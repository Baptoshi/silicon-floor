<p align="center"><img src="assets/icon.png" width="96" alt="Silicon Floor"></p>

# Silicon Floor

**Who owns AI stocks, who's buying, who's selling — every answer sourced.**
The research terminal for your AI agent: who owns AI and semiconductor stocks, what insiders and funds buy and sell,
financials as filed, short interest, dividends and the sector's market cap, with every SEC figure linked to its
filing. Free, no account, no API key.

[siliconfloor.com](https://siliconfloor.com) · [Documentation](https://siliconfloor.com/docs/mcp) · MCP server: `https://siliconfloor.com/mcp`

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Silicon_Floor-0098FF?style=flat-square)](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522siliconfloor%2522%252C%2522type%2522%253A%2522http%2522%252C%2522url%2522%253A%2522https%253A%252F%252Fsiliconfloor.com%252Fmcp%2522%257D)
[![Install in Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=siliconfloor&config=eyJ1cmwiOiJodHRwczovL3NpbGljb25mbG9vci5jb20vbWNwIn0%3D)
[![Add to LM Studio](https://files.lmstudio.ai/deeplink/mcp-install-light.svg)](https://lmstudio.ai/install-mcp?name=siliconfloor&config=eyJ1cmwiOiJodHRwczovL3NpbGljb25mbG9vci5jb20vbWNwIn0=)
[![Install in goose](https://block.github.io/goose/img/extension-install-dark.svg)](https://block.github.io/goose/extension?cmd=npx&arg=-y&arg=siliconfloor-mcp&id=silicon-floor&name=Silicon%20Floor&description=Who%20owns%20AI%20and%20chip%20stocks%2C%20who%20is%20buying%20and%20selling%2C%20and%20what%20their%20filed%20numbers%20say)

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
- **Is it cheap or expensive?** Companies side by side, or the whole sector screened on growth, margins and valuation.
- **Are short sellers piling in?** FINRA short interest every two weeks, and the short float on a float counted from
  SEC filings, every holder taken out named.
- **Who buys from whom, who lends to whom?** The customers companies name, the contracts their filings disclose (value,
  term, megawatts), who acquired whom, and the banks behind each credit facility, with when it was signed and when it
  ends, as filed.
- **What is a private AI company worth before its IPO?** Anthropic's S-1 read in full, and served like a listed
  company: every funding round per common share of today and the value it implies, its financial statements (quarters,
  half years and audited years: revenue, cash, cash flow), who owns it (its principal stockholders, officers and
  directors, and what Amazon and Google hold), what it has committed to spend with each cloud and chip supplier, and who
  finances it — its credit facility and the notes Google, Amazon and Broadcom have agreed to buy.
- **Where does the revenue come from?** By segment, region and product, the customers a company depends on, and what it
  guided for against what it then reported.
- **What does it owe?** Debt as the balance sheet presents it, instrument by instrument with rates and maturities, and
  every note, loan and share sale filed since.
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

**A client that only runs commands**, through the bridge on npm — it forwards stdio to the same hosted server,
nothing is installed and no key is needed:

```json
{
  "mcpServers": {
    "siliconfloor": { "command": "npx", "args": ["-y", "siliconfloor-mcp"] }
  }
}
```

Any other MCP client: Streamable HTTP at `https://siliconfloor.com/mcp`, no authentication. Also listed in the
[official MCP Registry](https://registry.modelcontextprotocol.io) as `com.siliconfloor/silicon-floor`.

## Tools

Nineteen read-only tools: `list_companies`, `get_company`, `get_financials`, `get_figure_history`,
`compare_companies`, `screen_companies`, `get_ownership`, `get_holders`, `get_relationships`, `get_fund_flows`,
`get_insider_trading`, `get_filings`, `what_changed`, `get_dividends`, `get_market_overview`, `get_market`, `get_signals`,
`get_price_history`, `get_news`.
Their full reference is in [`skills/silicon-floor-research/references/tools.md`](skills/silicon-floor-research/references/tools.md).

## What's in this repository

| Path | For |
|---|---|
| `.claude-plugin/`, `.mcp.json` | Claude Code plugin and marketplace |
| `plugin.json`, `mcp.json` | [Agent Plugins](https://agent-plugins.org) manifest: GitHub Copilot CLI and other Agent Plugins clients |
| `skills/silicon-floor-research/` | Research skill: which tool answers what, and how to report it without overstating it |
| `gemini-extension.json`, `GEMINI.md` | Gemini CLI extension |
| `server.json` | Official MCP Registry entry |
| `bridge/`, `package.json` | `siliconfloor-mcp` on npm: a stdio bridge to the hosted server, for clients that expect a command. Zero dependencies; `npm test` covers it. Kept out of `bin/`, which Claude Code would put on its Bash `PATH` and which claude.ai and Cowork refuse to install |
| `Dockerfile`, `glama.json` | The same bridge as a container, for directories that start a server to read its tools (Glama). It holds no data: every answer comes from the hosted server |

## Changes

Answers only gain fields. When a field changes name or meaning, it is listed here.

- **1.7.0** (October 28, 2026)
  - `get_company`, `compare_companies`, `screen_companies`: `basis` says which period each figure covers — revenue
    growth and margins are the latest quarter's (growth against the same quarter a year earlier) and `revenueTtm` the
    last four quarters, or `fiscal year`; `basisMeaning` and each answer's note explain it.
  - An unknown segment or sector is refused with the list of segments; `what_changed` refuses a blank `since` or
    `until` and says when a window is moved to its 90-day limit (`windowClamped`); the map of `get_market` for a day
    without a session is the latest session before it (`requestedDate`).
  - Companies resolve from a CUSIP or a US or CA ISIN; a misspelled name gets suggestions, never a guess.
  - `get_financials` lists the periods its columns skip (`missingPeriods`); `get_holders` says in plain words why a
    manager is not ranked (`notRankedReason`).
- **1.6.0** (October 27, 2026)
  - `get_ownership`: `asOf` is now `latestDeclarationAsOf`, the date of the most recent declaration on the card; the
    quarter of the 13F positions is `coverage.quarterRead`. With `moves` set to a list, the answer is that list, its
    coverage and `next`, without the holders.
  - `get_ownership` and `get_holders`: a holder's `kind` is replaced by `type` (investment manager, broker-dealer,
    company or person) and, for a manager, `style` (active, index, market_maker or wealth).
  - `get_holders`: `move` is the direction of a position, as in `get_ownership`; the change in dollars is
    `valueChangeUsd`, in shares `sharesChange`, and a manager's net flow `netFlowUsd`.
  - `what_changed`: `until` and `next.until` read a long window page by page.
  - `screen_companies`: the sideways trend is `neutral` (`flat` is still accepted). `get_dividends`: certainty and
    status codes are in English. `get_price_history`: the volume of a session in progress is `null`, not 0.

The same list, kept current, is on [siliconfloor.com/docs/mcp](https://siliconfloor.com/docs/mcp#changes).

## Data and terms

Sources: SEC EDGAR (XBRL financial statements, IPO prospectuses, Forms 13F, 13D/G, 3/4/5, N-PORT) and FINRA (short interest and
short-sale volume, republished with FINRA's permission). Silicon Floor is a tracking tool, not investment advice.
[Terms and privacy](https://siliconfloor.com/terms) · contact@siliconfloor.com

The files in this repository are under the MIT license. The data the server returns is covered by the
[terms](https://siliconfloor.com/terms).
