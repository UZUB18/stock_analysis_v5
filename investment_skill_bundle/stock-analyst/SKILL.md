---
name: stock-analyst
description: deep long-horizon single-stock equity research for 3 to 5+ year long-only decisions. use when analyzing one listed company, checking a thesis, testing earnings quality, valuing a business with at least two methods, or generating standardized [ticker]_memo.md and [ticker]_data.json files for later basket comparison. fetch current filings and market data, run arithmetic in python, stop early if the idea fails the structural gate, and produce audit-ready outputs.
---

# Stock Analyst

## Overview
Produce a full-depth underwriting memo for one equity. Treat every request as a 3 to 5+ year decision unless the user explicitly overrides the horizon.

Load these files before finalizing any report:
- `references/long-horizon-equity-protocol.md`
- `references/metric-definitions.md`
- `references/stock-json-schema.md`

Run `scripts/validate_stock_report.py <path-to-json>` before declaring the job finished.

## Workflow
1. Determine the output directory. Prefer `data/reports/` when it exists; otherwise use the current directory.
2. Gather primary evidence first: annual report or 10-K, latest interim filing, proxy if available, earnings transcript, and a live price source.
3. Run the structural decision gate. If the idea is structurally uninvestable, still write both files, mark the rating `AVOID`, explain the failure, and stop the rest of the deep dive.
4. Underwrite the business qualitatively: business model, moat, management, capital allocation, reinvestment runway, and governance.
5. Underwrite the business quantitatively: growth, margins, ROIC or sector equivalent, cash conversion, dilution, leverage, and working-capital behavior.
6. Value the stock with at least two distinct methods. Include a peer sanity check and a five-year bear/base/bull return distribution.
7. Write `[TICKER]_memo.md` and `[TICKER]_data.json`, then validate the JSON.

## Hard Rules
- Default to a full deep dive. Do not downshift into a light memo unless the user explicitly asks for a lighter artifact.
- Keep facts, estimates, derived values, interpretations, and judgments clearly tagged in the memo as `[Fact]`, `[Estimate]`, `[Derived]`, `[Interpretation]`, and `[Judgment]`.
- Run Python for every arithmetic step that affects the thesis: growth rates, margins, leverage, cash conversion, valuation math, expected returns, and sensitivity work.
- Do not silently estimate missing numbers. Use `null` in JSON and state `Data missing: ...` in the memo.
- Use sector-specific metrics when generic metrics are economically invalid.
- Always include a bear-case steelman, why the market may be right, three ways the thesis could be wrong, a thesis expiration condition, and a structured monitoring block.
- Optimize for fresh capital at today's price. If the user already owns the stock, ignore their entry price when judging the business.

## Output Standard
Create exactly two files:
1. `[TICKER]_data.json`
2. `[TICKER]_memo.md`

The memo must be audit-ready and explicitly cover:
- recommendation and confidence with basis
- three-line thesis
- market mispricing claim
- must-be-true conditions
- business quality and competitive position
- management and capital allocation
- earnings quality and balance-sheet audit
- valuation with two methods and sensitivity
- bear/base/bull five-year returns
- downside map and thesis killers
- bias check
- monitoring framework with next review date

The JSON must follow `references/stock-json-schema.md` exactly enough for the comparison skill to ingest it without manual cleanup.
