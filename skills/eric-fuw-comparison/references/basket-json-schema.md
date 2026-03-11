# Basket Comparison JSON Schema

When generating the final `_data.json` file for a basket comparison, you MUST strictly adhere to this schema. This structured data powers the interactive visual dashboard, driving the charts and layout.

```json
{
  "tickers": ["PANW", "ZS", "CRWD"],
  "allocations": [
    {
      "ticker": "PANW",
      "percentage": 70,
      "rationale": "Category leader with entrenched ecosystem"
    },
    {
      "ticker": "ZS",
      "percentage": 30,
      "rationale": "Strong niche player with secular tailwinds"
    },
    {
      "ticker": "CRWD",
      "percentage": 0,
      "rationale": "Valuation priced for perfection; execution dependency too high"
    }
  ],
  "gauntlet_scores": {
    "business_quality": {
      "PANW": 90,
      "ZS": 70,
      "CRWD": 85
    },
    "earnings_quality": {
      "PANW": 85,
      "ZS": 60,
      "CRWD": 40
    },
    "valuation_support": {
      "PANW": 60,
      "ZS": 80,
      "CRWD": 30
    },
    "strategic_durability": {
      "PANW": 95,
      "ZS": 75,
      "CRWD": 90
    },
    "execution_dependency": {
      "PANW": 40,
      "ZS": 80,
      "CRWD": 95
    }
  },
  "garp_metrics": [
    {
      "ticker": "PANW",
      "revenue_growth_pct": 22.5,
      "ev_sales_multiple": 12.1
    },
    {
      "ticker": "ZS",
      "revenue_growth_pct": 35.0,
      "ev_sales_multiple": 18.5
    },
    {
      "ticker": "CRWD",
      "revenue_growth_pct": 30.2,
      "ev_sales_multiple": 24.0
    }
  ]
}
```

**Rules:**
- `tickers`: An array of all tickers evaluated in the basket.
- `allocations`: The percentages must sum to exactly 100. Any asset you recommend avoiding should be included but with a `percentage: 0`.
- `gauntlet_scores`: Each of the five sub-objects MUST contain a key for every ticker in the `tickers` array. Scores must be integers from 0 to 100. *Note: For `execution_dependency`, a lower underlying trait is better in analysis, but provide the absolute score based on how you rated it in the gauntlet.*
- `garp_metrics`: Must contain an array entry for every ticker evaluated. Pull `revenue_growth_pct` and `ev_sales_multiple` from their respective single-stock `_data.json` files or extrapolate appropriately based on your analysis.