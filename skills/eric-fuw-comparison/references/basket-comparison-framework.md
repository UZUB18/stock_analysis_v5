# Basket Comparison Framework

## Objective
Act like a portfolio manager deciding where fresh long-term capital belongs. Do not re-underwrite from scratch and do not fetch new data. Use the analyst reports already produced, then compare them ruthlessly.

## What to optimize
Optimize for **quality-adjusted long-run return per unit of fragility**, not for the lowest multiple or the prettiest story. A stock can be a fantastic business and still lose if the price embeds too much perfection. A cheap stock can be a trap if its balance sheet or economics break first under stress.

## Comparison lenses
Apply all of these, not just the easiest one:

### 1. Business quality and durability
Compare moat, pricing power, customer captivity, balance-sheet resilience, capital allocation, reinvestment runway, and governance.

### 2. Valuation and expected return
Compare base-case 5-year IRR, downside IRR, starting yield, multiple risk, and how much of the thesis depends on heroic assumptions.

### 3. Fragility and downside asymmetry
Identify which company is most exposed to refinancing risk, cyclical compression, margin collapse, technological obsolescence, or regulation. Ask which one breaks first if the macro backdrop turns hostile.

### 4. Evidence quality
Penalize incomplete or optimistic analyst work. If one report has weak source quality, heavy estimate dependence, or missing fields, the portfolio manager should trust it less even if the upside looks seductive.

### 5. Basket fit
If two candidates are both good but driven by the same cycle or macro factor, the split may be fake diversification. Prefer concentration when one clearly dominates and splits only when the drivers are genuinely distinct.

## Working scorecard
Use the JSON comparison fields plus memo nuance to build a provisional ranking. A sensible starting weight set is:
- quality and durability: 30%
- valuation attractiveness: 20%
- expected 5-year IRR: 20%
- balance-sheet resilience and fragility: 15%
- reinvestment and capital allocation: 10%
- evidence quality and completeness: 5%

Do not obey the score mechanically. It is a triage tool, not a substitute for judgment.

## Comparison rules
- Do not force raw multiple comparisons across very different sectors when those multiples are structurally incomparable.
- When business models differ a lot, compare through owner economics, normalized return on capital, reinvestment runway, balance-sheet risk, and expected return instead.
- If none of the candidates clears a reasonable hurdle, recommend cash or watchlist status.
- If one name dominates on quality and still offers acceptable return, prefer a concentrated answer over fake precision.
- If you split capital, explain exactly why each holding earns a place and why the blend is better than simply owning the top name.

## Mandatory challenge questions
For each loser, answer:
- What is the strongest argument that this name still beats the winner?
- What does the winner have to get wrong for that to happen?
- Is the loser cheaper for a valid reason?

For the basket as a whole, answer:
- What common macro shock hurts most names at once?
- Which report appears too optimistic or too forgiving?
- What single fact would most likely change the ranking?

## Output standard
The final comparison memo must include:
- a two-sentence verdict
- a full stack rank
- direct metric comparison
- relative fragility analysis
- explicit capital allocation
- a note on why the losing idea loses
- review triggers and the next decision date