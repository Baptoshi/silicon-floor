<p align="center"><img src="assets/icon.png" width="96" alt="Silicon Floor"></p>

# Silicon Floor

**Who's buying NVIDIA? What did the CEO just sell? Which chipmakers are growing fastest?**
Ask your AI assistant, and get the answer straight from SEC filings, every number linked to its source.
220 AI and semiconductor stocks. Free, no account, no API key.

[siliconfloor.com](https://siliconfloor.com) · [Documentation](https://siliconfloor.com/docs/mcp) · MCP server: `https://siliconfloor.com/mcp`

This repository holds what you need to plug Silicon Floor into an assistant: the connector settings, a Claude Code
plugin, a Gemini CLI extension and a research skill. The server itself runs at `https://siliconfloor.com/mcp`; its
code is not in this repository.

## What you can ask

- **Who's buying, who's selling?** Funds, insiders and big shareholders, from their own 13F, 13D/G and Form 4 filings.
- **What does the CEO really own?** Shares, restricted stock and options, broken down filing by filing.
- **Is it really growing?** Revenue, margins and cash flow exactly as filed: 12 quarters or 6 years.
- **Is it cheap or expensive?** Companies side by side, or all 220 screened on growth, margins and valuation.
- **Are short sellers piling in?** FINRA short interest, every two weeks.
- **What changed this week?** Earnings, insider buys, new 5% stakes, restatements, ranked by what matters.

Every number carries its date and its source, and SEC figures link to the filing itself. Missing data shows up as
missing, never guessed.

## Connect

**Claude** (web, desktop, mobile): Silicon Floor is in Claude's
[connector directory](https://claude.ai/directory/silicon-floor). Or add it yourself: Customize → Connectors → + →
Add custom connector, name it Silicon Floor, paste `https://siliconfloor.com/mcp`.

**Claude Code**, as a plugin (server and research skill):

```
/plugin marketplace add Baptoshi/silicon-floor
/plugin install silicon-floor@siliconfloor
```

or the server alone:

```
claude mcp add --transport http siliconfloor https://siliconfloor.com/mcp
```

**Gemini CLI**:

```
gemini extensions install https://github.com/Baptoshi/silicon-floor
```

**ChatGPT**: turn on developer mode in Settings (Security and login), then open Plugins, click +, name it
Silicon Floor and enter `https://siliconfloor.com/mcp` as a public endpoint.

**Cursor** (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "siliconfloor": { "url": "https://siliconfloor.com/mcp" }
  }
}
```

**VS Code** (`.vscode/mcp.json`):

```json
{
  "servers": {
    "siliconfloor": { "type": "http", "url": "https://siliconfloor.com/mcp" }
  }
}
```

Any other MCP client: Streamable HTTP at `https://siliconfloor.com/mcp`, no authentication. Also listed in the
[official MCP Registry](https://registry.modelcontextprotocol.io) as `com.siliconfloor/silicon-floor`.

## Tools

Sixteen read-only tools: `list_companies`, `get_company`, `get_financials`, `get_figure_history`,
`compare_companies`, `screen_companies`, `get_ownership`, `get_holders`, `get_filings`, `what_changed`,
`get_dividends`, `get_market_overview`, `get_market`, `get_signals`, `get_price_history`, `get_news`.
Their full reference is in [`skills/silicon-floor-research/references/tools.md`](skills/silicon-floor-research/references/tools.md).

## What's in this repository

| Path | For |
|---|---|
| `.claude-plugin/`, `.mcp.json` | Claude Code plugin and marketplace |
| `skills/silicon-floor-research/` | Research skill: which tool answers what, and how to report it without overstating it |
| `gemini-extension.json`, `GEMINI.md` | Gemini CLI extension |
| `server.json` | Official MCP Registry entry |

## Data and terms

Sources: SEC EDGAR (XBRL financial statements, Forms 13F, 13D/G, 3/4/5, N-PORT) and FINRA (short interest and
short-sale volume, republished with FINRA's permission). Silicon Floor is a tracking tool, not investment advice.
[Terms and privacy](https://siliconfloor.com/terms) · contact@siliconfloor.com

The files in this repository are under the MIT license. The data the server returns is covered by the
[terms](https://siliconfloor.com/terms).
