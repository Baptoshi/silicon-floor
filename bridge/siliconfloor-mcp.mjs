#!/usr/bin/env node
/**
 * Silicon Floor MCP — stdio bridge to the hosted server.
 *
 * Silicon Floor is a remote MCP server: clients that speak Streamable HTTP should use
 * https://siliconfloor.com/mcp directly and skip this package entirely. It exists for the clients and
 * directories that still expect a command to run, and for `npx siliconfloor-mcp`.
 *
 * It is a pipe, not a server: every JSON-RPC message read on stdin is forwarded to the endpoint as-is,
 * and the reply is written back on stdout. No state, no rewriting, no dependency — the same choice as
 * the server it talks to.
 *
 * stdout carries JSON-RPC and nothing else; anything we have to say goes to stderr.
 */

import { createInterface } from "node:readline";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DEFAULT_URL = "https://siliconfloor.com/mcp";
const TIMEOUT_MS = Number(process.env.SILICON_FLOOR_TIMEOUT_MS ?? 60_000);

const version = (() => {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    return JSON.parse(readFileSync(join(here, "..", "package.json"), "utf8")).version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
})();

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write(
    `siliconfloor-mcp ${version}\n\n` +
      "Bridges a stdio MCP client to the hosted Silicon Floor server.\n\n" +
      "Usage: siliconfloor-mcp [url]\n\n" +
      `  url   endpoint to talk to (default ${DEFAULT_URL}),\n` +
      "        or the SILICON_FLOOR_MCP_URL environment variable.\n\n" +
      "A client that speaks Streamable HTTP needs no bridge: point it at the URL itself.\n" +
      "Docs: https://siliconfloor.com/docs/mcp\n",
  );
  process.exit(0);
}
if (args.includes("--version") || args.includes("-v")) {
  process.stdout.write(`${version}\n`);
  process.exit(0);
}

const endpoint = args.find((a) => !a.startsWith("-")) ?? process.env.SILICON_FLOOR_MCP_URL ?? DEFAULT_URL;
try {
  const { protocol } = new URL(endpoint);
  if (protocol !== "https:" && protocol !== "http:") throw new Error("protocol");
} catch {
  process.stderr.write(`siliconfloor-mcp: not a usable endpoint: ${endpoint}\n`);
  process.exit(2);
}

const send = (line) => process.stdout.write(line + "\n");

/** A transport failure is answered in the protocol, so the client sees a refusal rather than silence. */
const failure = (id, message) =>
  JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32_000, message: `siliconfloor-mcp: ${message}` } });

/** The server answers in JSON; Server-Sent Events are read too, in case it ever streams. */
async function reply(res) {
  const type = res.headers.get("content-type") ?? "";
  const body = await res.text();
  if (!body) return [];
  if (type.includes("text/event-stream")) {
    return body
      .split("\n")
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice(5).trim())
      .filter(Boolean);
  }
  return [body.trim()];
}

async function forward(message, id) {
  let res;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
        "user-agent": `siliconfloor-mcp/${version}`,
      },
      body: message,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (e) {
    // The endpoint may be down, or the machine offline: say which, never why we think so.
    if (id !== undefined) send(failure(id, e?.name === "TimeoutError" ? "no answer in time" : "endpoint unreachable"));
    return;
  }
  if (!res.ok) {
    await res.body?.cancel?.();
    if (id !== undefined) send(failure(id, `endpoint answered HTTP ${res.status}`));
    return;
  }
  for (const line of await reply(res)) send(line);
}

const lines = createInterface({ input: process.stdin });
const pending = new Set();

lines.on("line", (line) => {
  const text = line.trim();
  if (!text) return;
  let id;
  try {
    const parsed = JSON.parse(text);
    // A notification has no id and expects no answer; a batch is forwarded whole.
    id = Array.isArray(parsed) ? undefined : parsed.id;
  } catch {
    send(failure(null, "the client sent something that is not JSON"));
    return;
  }
  const task = forward(text, id).finally(() => pending.delete(task));
  pending.add(task);
});

lines.on("close", async () => {
  await Promise.allSettled([...pending]);
  process.exit(0);
});
