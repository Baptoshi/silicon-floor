/**
 * The bridge is a pipe: what matters is that nothing is lost, nothing is invented, and stdout carries
 * JSON-RPC and nothing else. Tested against a stand-in server, so the tests need no network.
 *
 * Run: npm test
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const BIN = join(dirname(fileURLToPath(import.meta.url)), "..", "bin", "siliconfloor-mcp.mjs");

/** A stand-in for the hosted server. `mode` decides how it answers, so each failure can be reproduced. */
function standIn(mode = "json") {
  const seen = [];
  const server = createServer((req, res) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      seen.push({ body, accept: req.headers.accept, agent: req.headers["user-agent"] });
      const message = JSON.parse(body);
      if (mode === "down") return res.destroy();
      if (mode === "http500") {
        res.writeHead(500).end("nope");
        return;
      }
      if (message.id === undefined) {
        // A notification is acknowledged with no content, as the hosted server does.
        res.writeHead(202).end();
        return;
      }
      const answer = JSON.stringify({ jsonrpc: "2.0", id: message.id, result: { echoed: message.method } });
      if (mode === "sse") {
        res.writeHead(200, { "content-type": "text/event-stream" }).end(`event: message\ndata: ${answer}\n\n`);
        return;
      }
      res.writeHead(200, { "content-type": "application/json" }).end(answer);
    });
  });
  return new Promise((ready) => {
    server.listen(0, "127.0.0.1", () => ready({ server, seen, url: `http://127.0.0.1:${server.address().port}/mcp` }));
  });
}

/** Feeds the bridge the given lines and returns what it wrote, once it has closed. */
function through(url, lines) {
  return new Promise((done) => {
    const child = spawn(process.execPath, [BIN, url], { stdio: ["pipe", "pipe", "pipe"] });
    let out = "";
    let err = "";
    child.stdout.on("data", (c) => (out += c));
    child.stderr.on("data", (c) => (err += c));
    child.on("close", (code) => done({ out: out.trim(), err, code }));
    child.stdin.end(lines.map((l) => (typeof l === "string" ? l : JSON.stringify(l))).join("\n") + "\n");
  });
}

test("a request is forwarded whole and its answer written back", async () => {
  const { server, seen, url } = await standIn();
  const { out, code } = await through(url, [{ jsonrpc: "2.0", id: 1, method: "tools/list" }]);
  server.close();
  assert.equal(code, 0);
  assert.deepEqual(JSON.parse(out), { jsonrpc: "2.0", id: 1, result: { echoed: "tools/list" } });
  assert.equal(JSON.parse(seen[0].body).method, "tools/list", "the message reaches the server unchanged");
  assert.match(seen[0].agent, /^siliconfloor-mcp\//, "the bridge says who it is");
});

test("a notification is forwarded and answered with silence", async () => {
  const { server, seen, url } = await standIn();
  const { out } = await through(url, [
    { jsonrpc: "2.0", method: "notifications/initialized" },
    { jsonrpc: "2.0", id: 2, method: "ping" },
  ]);
  server.close();
  assert.equal(seen.length, 2, "both messages are forwarded");
  assert.equal(out.split("\n").length, 1, "only the request is answered on stdout");
  assert.equal(JSON.parse(out).id, 2);
});

test("several requests all come back, each with its own id", async () => {
  const { server, url } = await standIn();
  const asked = [1, 2, 3, 4, 5].map((id) => ({ jsonrpc: "2.0", id, method: "ping" }));
  const { out } = await through(url, asked);
  server.close();
  const ids = out.split("\n").map((l) => JSON.parse(l).id);
  assert.deepEqual([...ids].sort(), [1, 2, 3, 4, 5], "none is lost, none is invented");
});

test("a streamed answer is read as well", async () => {
  const { server, url } = await standIn("sse");
  const { out } = await through(url, [{ jsonrpc: "2.0", id: 7, method: "tools/list" }]);
  server.close();
  assert.deepEqual(JSON.parse(out), { jsonrpc: "2.0", id: 7, result: { echoed: "tools/list" } });
});

test("an endpoint that refuses is reported in the protocol, not by silence", async () => {
  const { server, url } = await standIn("http500");
  const { out } = await through(url, [{ jsonrpc: "2.0", id: 8, method: "ping" }]);
  server.close();
  const answer = JSON.parse(out);
  assert.equal(answer.id, 8);
  assert.match(answer.error.message, /HTTP 500/);
});

test("an unreachable endpoint is reported too", async () => {
  const { out } = await through("http://127.0.0.1:1/mcp", [{ jsonrpc: "2.0", id: 9, method: "ping" }]);
  const answer = JSON.parse(out);
  assert.equal(answer.id, 9);
  assert.match(answer.error.message, /unreachable/);
});

test("a line that is not JSON is refused without reaching the server", async () => {
  const { server, seen, url } = await standIn();
  const { out } = await through(url, ["{ not json", { jsonrpc: "2.0", id: 10, method: "ping" }]);
  server.close();
  const [refusal, answer] = out.split("\n").map((l) => JSON.parse(l));
  assert.equal(refusal.id, null);
  assert.match(refusal.error.message, /not JSON/);
  assert.equal(answer.id, 10);
  assert.equal(seen.length, 1, "only the valid message is forwarded");
});

test("blank lines are ignored", async () => {
  const { server, seen, url } = await standIn();
  const { out } = await through(url, ["", "   ", { jsonrpc: "2.0", id: 11, method: "ping" }]);
  server.close();
  assert.equal(seen.length, 1);
  assert.equal(JSON.parse(out).id, 11);
});

test("an endpoint that is not an address is refused before anything is sent", async () => {
  const { out, err, code } = await through("not-a-url", [{ jsonrpc: "2.0", id: 12, method: "ping" }]);
  assert.equal(code, 2);
  assert.equal(out, "", "stdout stays clean");
  assert.match(err, /not a usable endpoint/);
});
