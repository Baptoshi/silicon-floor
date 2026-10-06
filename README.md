<p align="center"><img src="assets/icon.png" width="96" alt="Silicon Floor"></p>

# Silicon Floor

**Who's buying NVIDIA? What did the CEO just sell? Which chipmakers are growing fastest?**
Follow the AI stock market from your AI assistant: 220 AI and semiconductor stocks, their news, the sector's market
cap, dividends, and who's buying or selling, with every SEC figure linked to its filing. Free, no account, no API key.

[siliconfloor.com](https://siliconfloor.com) · [Documentation](https://siliconfloor.com/docs/mcp) · MCP server: `https://siliconfloor.com/mcp`

This repository holds what you need to plug Silicon Floor into an assistant: the connector settings, a Claude Code
plugin, a GitHub Copilot CLI plugin, a Gemini CLI extension and a research skill. The server itself runs at
`https://siliconfloor.com/mcp`; its code is not in this repository.

## What you can ask

- **Who's buying, who's selling?** Funds, insiders and big shareholders, from their own 13F, 13D/G and Form 4 filings.
- **What did insiders sell this quarter?** CEO, founder and director sales and purchases across the sector, quarter by
  quarter: the biggest sellers and buyers, what they still hold, and the filing behind each.
- **What did hedge funds buy last quarter?** Each quarter's 13F filings, read in full: where the money went by sector, the
  most bought and sold stocks, the biggest moves of named funds.
- **What does the CEO really own?** Shares, restricted stock and options, broken down filing by filing.
- **Whose AI picks did best?** Funds ranked on what the AI stocks in their 13F returned, quarter after quarter, against
  SMH. Then follow one: every fund and big shareholder has an RSS feed of their filings.
- **How big is the AI trade?** The market cap of the whole sector, split between chips, cloud, power and the rest, and
  each company's weight in it, day by day.
- **Which ones pay a dividend?** Yield, growth, and how well each payout is covered.
- **Is it really growing?** Revenue, margins and cash flow exactly as filed: 12 quarters or 6 years.
- **Is it cheap or expensive?** Companies side by side, or all 220 screened on growth, margins and valuation.
- **Are short sellers piling in?** FINRA short interest, every two weeks.
- **What's the news?** The latest AI headlines, tagged by company.
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

**GitHub Copilot CLI**, as a plugin (server and research skill):

```
copilot plugin marketplace add Baptoshi/silicon-floor
copilot plugin install silicon-floor@siliconfloor
```

**Gemini CLI**:

```
gemini extensions install https://github.com/Baptoshi/silicon-floor
```

**The research skill alone**, for any agent that supports [Agent Skills](https://agentskills.io), via
[skills.sh](https://skills.sh). It uses the MCP server, so add the server to the same client too:

```
npx skills add Baptoshi/silicon-floor
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

Eighteen read-only tools: `list_companies`, `get_company`, `get_financials`, `get_figure_history`,
`compare_companies`, `screen_companies`, `get_ownership`, `get_holders`, `get_fund_flows`, `get_insider_trading`,
`get_filings`, `what_changed`, `get_dividends`, `get_market_overview`, `get_market`, `get_signals`, `get_price_history`,
`get_news`.
Their full reference is in [`skills/silicon-floor-research/references/tools.md`](skills/silicon-floor-research/references/tools.md).

## What's in this repository

| Path | For |
|---|---|
| `.claude-plugin/`, `.mcp.json` | Claude Code plugin and marketplace |
| `plugin.json`, `mcp.json` | [Agent Plugins](https://agent-plugins.org) manifest: GitHub Copilot CLI and other Agent Plugins clients |
| `skills/silicon-floor-research/` | Research skill: which tool answers what, and how to report it without overstating it |
| `gemini-extension.json`, `GEMINI.md` | Gemini CLI extension |
| `server.json` | Official MCP Registry entry |

## Data and terms

Sources: SEC EDGAR (XBRL financial statements, Forms 13F, 13D/G, 3/4/5, N-PORT) and FINRA (short interest and
short-sale volume, republished with FINRA's permission). Silicon Floor is a tracking tool, not investment advice.
[Terms and privacy](https://siliconfloor.com/terms) · contact@siliconfloor.com

The files in this repository are under the MIT license. The data the server returns is covered by the
[terms](https://siliconfloor.com/terms).
