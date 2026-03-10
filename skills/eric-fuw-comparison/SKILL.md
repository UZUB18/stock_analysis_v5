---
name: eric-fuw-comparison
description: compare multiple pre-existing stock-analyst reports for long-horizon capital allocation. use when several [ticker]_data.json and [ticker]_memo.md files already exist and a portfolio-manager style ranking is needed for a 3 to 5+ year decision. do not fetch new financials. ingest every report, penalize weak or incomplete analyst work, compare quality, valuation, durability, fragility, macro overlap, and expected return, then write a decisive basket memo in data/reports/.
---

# Eric Fuw Comparison

## Overview
Read existing analyst outputs, compare them, and decide where fresh long-term capital belongs. Operate like a skeptical portfolio manager, not like a cheerleader for whichever memo sounds smartest.

Load these files before finalizing any basket decision:
- `references/basket-comparison-framework.md`
- `references/stock-json-schema.md`

Use `scripts/build_basket_snapshot.py <folder>` to create a first-pass comparison table before writing the final memo.

## Workflow
1. Locate the report folder. Prefer `data/reports/` when it exists; otherwise use the current directory.
2. Read every relevant `[TICKER]_data.json` and `[TICKER]_memo.md` file.
3. Run the basket snapshot script to build a normalized table and a provisional ranking.
4. Read the memos for nuance the JSON cannot fully capture: moat mechanism, management quality, cyclicality, and obvious thesis gaps.
5. Penalize weak source quality, missing data, inconsistent logic, or obvious optimism.
6. Decide whether the right answer is one winner, a split allocation, staged deployment, or holding cash.
7. Write `BASKET_comparison_[YYYY-MM-DD].md` in the report folder.

## Hard Rules
- Do not fetch new filings, prices, or commentary. Work only from the supplied reports.
- Do not merely summarize the memos. Synthesize them into a capital allocation decision.
- Do not force false precision. If the evidence quality is weak, say so and penalize conviction.
- Do not reward optically cheap multiples without testing business quality and fragility.
- Prefer concentration when one candidate clearly dominates on quality-adjusted expected return.
- Recommend a split only when it is genuinely better than owning just the best name.
- It is valid to recommend `pass / hold cash` when none of the candidates meets the hurdle.

## Required Sections In The Final Memo
- **The Verdict:** two sentences on the allocation decision.
- **The Stack Rank:** 1 to N with one-line reasons.
- **Comparative Valuation:** direct comparison of return, multiples, and quality-adjusted price.
- **Relative Fragility:** who breaks first under macro or business stress and why.
- **Execution Plan:** exact capital deployment, including whether to stage entries or keep cash.
- **Anti-portfolio Note:** why the losing idea loses and what would have to change for it to win later.
- **Review Triggers:** what new evidence would force a re-rank.