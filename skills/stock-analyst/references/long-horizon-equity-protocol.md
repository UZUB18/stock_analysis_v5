# Long-Horizon Equity Research Protocol

## Mandate
Run a full-depth, long-only underwriting process for a 3 to 5+ year holding period. Default to depth. Treat every analysis as a decision about fresh capital at today's price, not as a defense of a prior opinion.

## What good output looks like
A good report does five things at once:
1. Explain the business clearly enough that the edge is testable.
2. Separate reported numbers from normalized economics.
3. Translate the thesis into falsifiable conditions and explicit kill-switches.
4. Estimate long-run return drivers rather than worshiping one multiple.
5. Leave behind standardized data that another portfolio skill can compare against peers.

## Research sequence
1. **Set the frame.** Confirm the ticker, company, listing, reporting currency, current price, and long-horizon objective.
2. **Collect evidence.** Prefer the latest annual report, 10-K, 10-Q, investor presentation, proxy, earnings call transcript, and a live price source. Treat commentary as secondary.
3. **Run the decision gate.** If the company is structurally uninvestable, stop early and say so.
4. **Underwrite the business.** Study how the firm makes money, why customers stay, where margins come from, and how capital is recycled.
5. **Audit the numbers.** Reconcile earnings, cash flow, dilution, leverage, and working capital.
6. **Value the business.** Use at least two distinct valuation frameworks and a return-driver stack.
7. **Map the downside.** Name what breaks first, how the thesis dies, and what evidence would force an exit.
8. **Write the memo and JSON.** Standardize everything so the basket comparison skill can ingest it.

## Decision gate
Fail the idea or downgrade it sharply if any of the following dominate the case:
- Fraud, repeated restatements, or unexplained accounting opacity.
- Going-concern language, refinancing dependence, covenant fragility, or obvious balance-sheet distress.
- Regulatory or legal threats that could impair the core business model.
- Dilution or SBC so severe that per-share compounding is structurally broken.
- A mega-cap, hyper-covered situation where there is no credible variant perception at all.

The gate is not a style preference. It is a filter against wasting time on businesses that cannot plausibly compound owner value.

## Qualitative underwriting
Cover these areas explicitly:

### Business model and unit economics
Explain the revenue engine, cost structure, customer type, sales motion, and the main variable that drives incremental profit.

### Competitive position
Assess switching costs, scale advantages, network effects, cost position, regulation, brand, data advantages, asset scarcity, distribution, and customer captivity. A moat score without a mechanism is decorative nonsense.

### Demand durability and reinvestment runway
Ask whether the company can still redeploy capital at attractive returns for years. A wonderful business with no runway can still be a mediocre investment if bought as a perpetual compounder.

### Management and capital allocation
Judge management by revealed preferences: buybacks versus dilution, M&A discipline, leverage tolerance, guidance credibility, underwriting discipline, and opportunism across the cycle.

### Governance and incentives
Use the proxy when possible. Check voting control, compensation design, insider ownership, insider selling patterns, and related-party risks.

## Quantitative underwriting
Always calculate, never hand-wave.

### Core profitability and efficiency
Use revenue growth, gross margin, operating margin, FCF margin, ROIC or ROCE, and per-share growth. Prefer per-share economics over aggregate growth when dilution is meaningful.

### Earnings quality
Mandatory checks:
- FCF to net income conversion.
- Accruals ratio.
- SBC as a percent of revenue.
- DSO trend and deferred revenue context when relevant.
- Reconciliation of non-GAAP to GAAP when management leans on adjustments.

### Balance sheet and financing
Map net debt, debt maturities, interest coverage, fixed-charge risk, pension or lease burdens, and refinancing exposure. A decent business can still be a bad stock if the capital structure owns the upside.

### Per-share reality
Track share count CAGR, FCF per share CAGR, and buyback quality. Buybacks above intrinsic value or buybacks funded by leverage deserve skepticism, not applause.

## Sector adaptations
Do not force generic metrics where they are economically nonsensical.

### Banks and insurers
Replace EV/EBITDA and generic FCF obsession with ROTCE, underwriting quality, reserve behavior, capital ratios, deposit or funding stability, book value growth, and excess capital generation.

### REITs
Use AFFO, NAV context, occupancy, lease maturity, same-store NOI, debt to EBITDA, and interest-rate sensitivity.

### Commodity producers and cyclicals
Normalize at mid-cycle margins or prices. The cheapest-looking multiple at peak earnings is often a trap wearing a spreadsheet.

### Pre-profit or special situations
If conventional earnings-based methods are invalid, say so explicitly and switch to runway, unit economics, probability-weighted scenarios, and dilution analysis. Confidence should fall accordingly.

## Valuation framework
Always triangulate with at least two distinct methods. Good default combinations:
- Normalized earnings power plus a justified multiple.
- Simplified DCF or owner-earnings DCF.
- NAV or sum-of-the-parts when assets or segments genuinely differ.
- Sector-specific methods for banks, insurers, REITs, and commodity producers.

For every valuation:
- Show assumptions.
- Identify the single most sensitive variable.
- Produce bear, base, and bull 5-year IRRs.
- Decompose base-case expected return into starting yield, fundamental growth, multiple change, and capital allocation tailwind or drag.

## Scorecards
Score these from 1 to 10 with a one-line basis for each:
- moat
- pricing power
- reinvestment runway
- management execution
- capital allocation
- balance sheet
- governance
- durability
- valuation attractiveness
- fragility
- evidence quality
- data completeness

These are not substitutes for reasoning. They are compression tools for later comparison.

## Bias controls
Every memo must include:
- A real bear-case steelman.
- Why the market may already be right.
- Three ways the thesis could be wrong.
- What would have to happen for the stock to materially outperform your recommendation.

## Monitoring and thesis decay
A long horizon is not a license for inertia. Include:
- Weekly or monthly watch items.
- Quarterly thresholds that would force a reassessment.
- Event-driven triggers.
- A next review date.
- A thesis expiration date or explicit proof-point condition. If the business fails to show progress by that date, the thesis loses freshness even if the stock has not moved.

## Comparison-readiness
The JSON output must be clean enough for downstream basket comparison. Required comparison ideas:
- expected 5-year IRR
- quality score
- valuation score
- fragility score
- moat score
- reinvestment score
- leverage or balance-sheet score
- evidence and completeness scores

## Optional appendix only when requested
Technical analysis, RSI, support and resistance, and entry ladders are optional for a 3 to 5+ year investor. Include them only when the user explicitly wants execution timing. Otherwise, focus on underwriting the business and the price paid.