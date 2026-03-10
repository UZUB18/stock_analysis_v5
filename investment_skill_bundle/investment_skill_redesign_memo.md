# Investment Skill Redesign Memo

## What was weak in the original setup
The original design had strong ambition but three structural problems.

First, the single-stock analyst was not standardized enough for downstream comparison. It could produce a good memo, but not a reliably comparable data object. That makes the portfolio-manager skill depend too much on prose quality and too little on normalized evidence.

Second, the comparison skill was underpowered. It promised ruthless ranking, but without a stricter JSON schema, evidence penalties, or a formal way to compare quality versus price versus fragility, it risked becoming a glorified summary engine.

Third, the mother prompt mixed too many horizons and jobs. It contained long-term investing, open-position therapy, technical timing, quant backtesting, and portfolio sizing in one giant blob. Rich, yes. Efficient, no. A 3 to 5+ year investor needs a deep underwriting engine first, and optional execution layers only when timing matters.

## What changed
The redesign does four important things.

1. **Everything is long-horizon by default.** The stock analyst now assumes a 3 to 5+ year long-only mandate and defaults to full depth.
2. **The JSON is now comparison-ready.** The analyst must write a standardized schema with quality, valuation, fragility, expected return, and evidence fields.
3. **The PM can penalize weak analysis.** Eric no longer treats all analyst reports as equally trustworthy. Missing fields, weak evidence, or heroic assumptions reduce ranking credibility.
4. **The mother prompt is modularized.** Long-horizon underwriting is the backbone. Technical timing is optional rather than clogging every analysis.

## Architecture recommendation
Use this three-layer structure.

### Layer 1: single-stock underwriting
Use `stock-analyst` for one ticker at a time. This is the map stage.

### Layer 2: basket ranking and capital allocation
Use `eric-fuw-comparison` only after all underlying reports exist. This is the reduce stage.

### Layer 3: optional extensions
Keep these outside the core two-skill loop unless you really need them:
- post-earnings thesis updater
- portfolio risk map and factor overlap checker
- entry-staging or technical execution helper

## Why this is stronger
A strong portfolio process is not just about doing more work. It is about making later decisions more reliable.

The upgraded analyst now leaves behind a machine-readable trail: quality, valuation, fragility, monitoring, and evidence confidence. The PM skill can use that structure to compare companies that are excellent for different reasons without collapsing into a vibes contest.

## Additional ideas worth considering
### 1. Add a post-earnings delta skill
This would update an existing memo after each quarterly result and answer one question only: what actually changed?

### 2. Add a portfolio risk-map skill
This would read every existing JSON and tell you whether your supposed diversification is fake because all names are secretly the same macro bet.

### 3. Add a watchlist triage skill
This would filter candidate tickers before they earn a full deep dive, which saves time and keeps the heavy research reserved for serious ideas.

## Final view
If your goal is serious long-term investing, the core loop should be:
1. deep-dive each company with the analyst
2. compare the standardized outputs with the PM
3. revisit only when facts change

That is cleaner than one giant universal prompt trying to be a research analyst, portfolio manager, trader, therapist, and court stenographer at the same time.
