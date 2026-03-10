# Stock Report JSON Schema

Generate `[TICKER]_data.json` using this structure. Keep all keys. Use `null` for unavailable numeric fields and explain the omission in the memo.

```json
{
  "metadata": {
    "ticker": "",
    "company_name": "",
    "analysis_date": "YYYY-MM-DD",
    "horizon_years": 5,
    "currency": "",
    "current_price": null,
    "shares_outstanding": null,
    "market_cap": null,
    "enterprise_value": null,
    "sector": "",
    "industry": "",
    "company_type": "operating-company",
    "primary_sources": [],
    "price_source": ""
  },
  "decision_gate": {
    "pass": true,
    "gate_summary": "",
    "variant_perception_present": true,
    "variant_perception_summary": "",
    "structural_red_flags": [],
    "why_continue_or_stop": ""
  },
  "recommendation": {
    "rating": "BUY",
    "confidence_1_to_10": 7,
    "thesis_status": "fresh",
    "thesis_expiration": "",
    "required_proof_points": []
  },
  "thesis": {
    "three_line_thesis": [],
    "market_mispricing": "",
    "must_be_true": [],
    "bear_case_steelman": "",
    "why_market_may_be_right": "",
    "three_ways_i_am_wrong": []
  },
  "business_quality": {
    "archetype": "compounder",
    "moat_score_10": null,
    "pricing_power_score_10": null,
    "reinvestment_runway_score_10": null,
    "management_execution_score_10": null,
    "capital_allocation_score_10": null,
    "balance_sheet_score_10": null,
    "governance_score_10": null,
    "durability_score_10": null,
    "key_strengths": [],
    "key_weaknesses": [],
    "competitive_position_notes": ""
  },
  "financial_quality": {
    "revenue_cagr_3y_pct": null,
    "gross_margin_ttm_pct": null,
    "operating_margin_ttm_pct": null,
    "fcf_margin_ttm_pct": null,
    "roic_ttm_pct": null,
    "roce_ttm_pct": null,
    "fcf_to_net_income_pct": null,
    "accruals_ratio": null,
    "sbc_as_pct_revenue": null,
    "share_count_cagr_3y_pct": null,
    "fcf_per_share_cagr_3y_pct": null,
    "net_debt_to_ebitda": null,
    "interest_coverage": null,
    "current_ratio": null,
    "days_sales_outstanding_delta": null,
    "deferred_revenue_growth_pct": null,
    "sector_specific_metrics": {}
  },
  "valuation": {
    "current_multiples": {
      "pe_ttm": null,
      "pe_ntm": null,
      "ev_ebitda_ttm": null,
      "ev_ebitda_ntm": null,
      "ev_sales_ttm": null,
      "ev_sales_ntm": null,
      "p_fcf_ttm": null,
      "fcf_yield_ttm_pct": null,
      "dividend_yield_pct": null,
      "peg": null
    },
    "peer_multiples_summary": "",
    "valuation_methods": [
      {
        "method": "",
        "implied_value_per_share": null,
        "weight_pct": null,
        "key_assumptions": []
      }
    ],
    "blended_implied_value_per_share": null,
    "margin_of_safety_pct": null,
    "expected_returns": {
      "bear_case_5y_irr_pct": null,
      "base_case_5y_irr_pct": null,
      "bull_case_5y_irr_pct": null,
      "return_driver_stack_pct": {
        "starting_yield": null,
        "fundamental_growth": null,
        "multiple_change": null,
        "capital_allocation_tailwind_or_drag": null
      }
    }
  },
  "risk": {
    "fragility_score_10": null,
    "macro_sensitivities": [],
    "business_risks": [],
    "financial_risks": [],
    "regulatory_risks": [],
    "technology_or_disruption_risks": [],
    "what_breaks_first_under_stress": ""
  },
  "monitoring": {
    "weekly_or_monthly_watch": [],
    "quarterly_thresholds": [],
    "event_triggers": [],
    "next_review_date": "YYYY-MM-DD"
  },
  "analyst_process": {
    "evidence_quality_score_10": null,
    "data_completeness_score_10": null,
    "estimate_dependence_score_10": null,
    "missing_items": [],
    "what_changed_vs_prior": ""
  },
  "comparison_fields": {
    "quality_score_10": null,
    "valuation_score_10": null,
    "expected_5y_irr_base_pct": null,
    "downside_case_5y_irr_pct": null,
    "fcf_yield_ttm_pct": null,
    "roic_ttm_pct": null,
    "net_debt_to_ebitda": null,
    "moat_score_10": null,
    "reinvestment_runway_score_10": null,
    "balance_sheet_score_10": null,
    "fragility_score_10": null,
    "evidence_quality_score_10": null,
    "data_completeness_score_10": null
  }
}
```

## Schema notes
- Keep `three_line_thesis` to a maximum of three bullets or sentences.
- `thesis_expiration` can be a date or a date plus an event condition.
- `comparison_fields` must mirror the core numbers used by the basket comparison skill.
- `quality_score_10` should summarize durability, management, balance sheet, and reinvestment, not just historical margins.
- `valuation_score_10` should reward price paid relative to base-case return, not superficial cheapness.
- `estimate_dependence_score_10` should be higher when the analysis relies heavily on forecasted steps rather than already-visible economics.
