# Installing Silicon Floor (for AI agents)

Silicon Floor is a **hosted, remote MCP server**: nothing to build, clone or run locally, no API key, no account.

- Endpoint: `https://siliconfloor.com/mcp`
- Transport: Streamable HTTP (stateless JSON-RPC over `POST`)
- Authentication: none
- All tools are read-only.

## Cline

Add this to `cline_mcp_settings.json`:

```json
{
  "mcpServers": {
    "silicon-floor": {
      "type": "streamableHttp",
      "url": "https://siliconfloor.com/mcp",
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

## Clients that can only run a command

Some clients will not take a URL. For those, a bridge on npm forwards stdio to the same hosted server — nothing is
installed permanently, and there is still no key:

```json
{
  "mcpServers": {
    "siliconfloor": { "command": "npx", "args": ["-y", "siliconfloor-mcp"] }
  }
}
```

Prefer the URL whenever the client accepts one: the bridge is one more process for the same answers.

## Other clients

Any client that speaks remote MCP over HTTP takes the same URL:

```json
{
  "mcpServers": {
    "silicon-floor": { "url": "https://siliconfloor.com/mcp" }
  }
}
```

Claude Code: `claude mcp add --transport http siliconfloor https://siliconfloor.com/mcp`

## Check it works

Call `list_companies`, then for example `get_ownership` with `symbol: "NVDA"`. Every answer carries the date of its data and a link to its SEC filing or FINRA file. Cite those, and report a `null` as unknown.

## Optional skill

`skills/silicon-floor-research/SKILL.md` in this repository tells an agent which tool to use for which question and how to read ownership ranges, fiscal-year figures, restated numbers and the prospectus figures of a company before its IPO.

Documentation: https://siliconfloor.com/docs/mcp
