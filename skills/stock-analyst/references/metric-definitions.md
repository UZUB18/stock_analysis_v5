# Metric Definitions and Sector Rules

## General rules
- Run arithmetic in Python.
- If a denominator is zero, negative where economically invalid, or the metric makes no sense for the sector, return `null` in JSON and explain the omission in the memo.
- Distinguish TTM, FY, reported, adjusted, and normalized values.
- Prefer per-share metrics whenever dilution, buybacks, or M&A meaningfully change the share count.

## Mandatory formulas for operating companies

### Revenue CAGR
`((ending_revenue / starting_revenue) ** (1 / years) - 1) * 100`

### FCF to net income conversion
`FCF / Net_Income * 100`
Use a meaningful trailing period and state whether FCF is operating cash flow minus capex.

### Accruals ratio
`(Net_Income - Operating_Cash_Flow) / Average_Total_Assets`
Negative is generally higher quality. Large positive values deserve scrutiny.

### SBC as percent of revenue
`Stock_Based_Compensation / Revenue * 100`

### Share count CAGR
`((ending_diluted_shares / starting_diluted_shares) ** (1 / years) - 1) * 100`

### FCF per share CAGR
1. `FCF_per_share = FCF / diluted_shares`
2. `((ending_fcf_per_share / starting_fcf_per_share) ** (1 / years) - 1) * 100`

### Net debt to EBITDA
`(Total_Debt - Cash_and_Equivalents) / EBITDA`
If EBITDA is not meaningful, use a better sector-specific leverage measure.

### Interest coverage
`EBIT / Interest_Expense`
If EBIT is distorted, explain the alternative measure used.

### FCF yield
`FCF / Market_Capitalization * 100`
State the period used and whether capex includes capitalized software or content investments if relevant.

### PEG
`(P/E) / Expected_EPS_Growth`
Use only when EPS growth is meaningful and positive. Otherwise return `null`.

## Return-driver stack
Use a five-year base-case decomposition:
- `starting_yield`: FCF yield, earnings yield, AFFO yield, or another sector-appropriate starting yield.
- `fundamental_growth`: annualized growth in normalized per-share cash earnings.
- `multiple_change`: annualized effect from entering at today's multiple and exiting at a justified future multiple.
- `capital_allocation_tailwind_or_drag`: buybacks, dilution, deleveraging, or value-destructive capital allocation.

Total expected annualized return is the sum of these components only as an approximation. If compounding or interaction effects matter, show the more exact model in Python and explain the difference.

## Sector substitutions

### Banks
Use these instead of generic EV/EBITDA or FCF obsession when appropriate:
- ROTCE or ROE
- CET1 or equivalent capital ratios
- tangible book value growth per share
- net interest margin and deposit/funding stability
- reserve coverage and credit quality trends
- payout capacity and excess capital generation
Valuation methods can include P/TBV, normalized ROE frameworks, or dividend discount variants.

### Insurers
Focus on:
- combined ratio or underwriting margin
- reserve adequacy
- investment portfolio quality and duration mismatch
- book value growth per share
- excess capital generation
- catastrophe sensitivity where relevant

### REITs
Use:
- AFFO per share growth
- dividend payout ratio to AFFO
- net asset value context
- occupancy and lease maturity profile
- debt to EBITDA and fixed-charge coverage
- same-store NOI growth

### Commodity producers and cyclical industrials
Use:
- mid-cycle revenue or commodity price assumptions
- cost-curve position
- sustaining capex
- reserve or asset life where relevant
- balance-sheet resilience at mid-cycle conditions

### Pre-profit companies
Use only if the economics are still analyzable. Emphasize:
- gross margin trajectory
- cohort behavior or unit economics
- operating leverage path
- cash runway
- dilution path
- scenario-weighted intrinsic value
Evidence and data completeness scores should be low when the investment case requires several unproven steps to work in sequence.