import { z } from "zod";

const NullableNumber = z.number().nullable();
const StringList = z.array(z.string());
const Score10 = z.number().min(0).max(10).nullable();
const GauntletScore = z.number().int().min(0).max(100);

export const SingleAnalysisDataSchema = z.object({
  metadata: z.object({
    ticker: z.string(),
    company_name: z.string(),
    analysis_date: z.string(),
    horizon_years: z.number(),
    currency: z.string(),
    current_price: NullableNumber,
    shares_outstanding: NullableNumber,
    market_cap: NullableNumber,
    enterprise_value: NullableNumber,
    sector: z.string(),
    industry: z.string(),
    company_type: z.string(),
    primary_sources: StringList,
    price_source: z.string()
  }),
  decision_gate: z.object({
    pass: z.boolean(),
    gate_summary: z.string(),
    variant_perception_present: z.boolean(),
    variant_perception_summary: z.string(),
    structural_red_flags: StringList,
    why_continue_or_stop: z.string()
  }),
  recommendation: z.object({
    rating: z.enum(["BUY", "HOLD", "AVOID"]),
    confidence_1_to_10: z.number().min(1).max(10),
    thesis_status: z.string(),
    thesis_expiration: z.string(),
    required_proof_points: StringList
  }),
  thesis: z.object({
    three_line_thesis: StringList,
    market_mispricing: z.string(),
    must_be_true: StringList,
    bear_case_steelman: z.string(),
    why_market_may_be_right: z.string(),
    three_ways_i_am_wrong: StringList
  }),
  business_quality: z.object({
    archetype: z.string(),
    moat_score_10: Score10,
    pricing_power_score_10: Score10,
    reinvestment_runway_score_10: Score10,
    management_execution_score_10: Score10,
    capital_allocation_score_10: Score10,
    balance_sheet_score_10: Score10,
    governance_score_10: Score10,
    durability_score_10: Score10,
    key_strengths: StringList,
    key_weaknesses: StringList,
    competitive_position_notes: z.string()
  }),
  financial_quality: z.object({
    revenue_cagr_3y_pct: NullableNumber,
    gross_margin_ttm_pct: NullableNumber,
    operating_margin_ttm_pct: NullableNumber,
    fcf_margin_ttm_pct: NullableNumber,
    roic_ttm_pct: NullableNumber,
    roce_ttm_pct: NullableNumber,
    fcf_to_ebitda_pct: NullableNumber,
    accruals_ratio: NullableNumber,
    sbc_as_pct_revenue: NullableNumber,
    share_count_cagr_3y_pct: NullableNumber,
    fcf_per_share_cagr_3y_pct: NullableNumber,
    net_debt_to_ebitda: NullableNumber,
    interest_coverage: NullableNumber,
    current_ratio: NullableNumber,
    days_sales_outstanding_delta: NullableNumber,
    deferred_revenue_growth_pct: NullableNumber,
    sector_specific_metrics: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
  }),
  valuation: z.object({
    current_multiples: z.object({
      pe_ttm: NullableNumber,
      pe_ntm: NullableNumber,
      ev_ebitda_ttm: NullableNumber,
      ev_ebitda_ntm: NullableNumber,
      ev_sales_ttm: NullableNumber,
      ev_sales_ntm: NullableNumber,
      p_fcf_ttm: NullableNumber,
      fcf_yield_ttm_pct: NullableNumber,
      dividend_yield_pct: NullableNumber,
      peg: NullableNumber
    }),
    peer_multiples_summary: z.string(),
    valuation_methods: z.array(
      z.object({
        method: z.string(),
        implied_value_per_share: NullableNumber,
        weight_pct: NullableNumber,
        key_assumptions: StringList
      })
    ),
    blended_implied_value_per_share: NullableNumber,
    margin_of_safety_pct: NullableNumber,
    expected_returns: z.object({
      bear_case_5y_irr_pct: NullableNumber,
      base_case_5y_irr_pct: NullableNumber,
      bull_case_5y_irr_pct: NullableNumber,
      return_driver_stack_pct: z.object({
        starting_yield: NullableNumber,
        fundamental_growth: NullableNumber,
        multiple_change: NullableNumber,
        capital_allocation_tailwind_or_drag: NullableNumber
      })
    })
  }),
  risk: z.object({
    fragility_score_10: Score10,
    macro_sensitivities: StringList,
    business_risks: StringList,
    financial_risks: StringList,
    regulatory_risks: StringList,
    technology_or_disruption_risks: StringList,
    what_breaks_first_under_stress: z.string()
  }),
  monitoring: z.object({
    weekly_or_monthly_watch: StringList,
    quarterly_thresholds: StringList,
    event_triggers: StringList,
    next_review_date: z.string()
  }),
  analyst_process: z.object({
    evidence_quality_score_10: Score10,
    data_completeness_score_10: Score10,
    estimate_dependence_score_10: Score10,
    missing_items: StringList,
    what_changed_vs_prior: z.string()
  }),
  comparison_fields: z.object({
    quality_score_10: Score10,
    valuation_score_10: Score10,
    expected_5y_irr_base_pct: NullableNumber,
    downside_case_5y_irr_pct: NullableNumber,
    fcf_yield_ttm_pct: NullableNumber,
    roic_ttm_pct: NullableNumber,
    net_debt_to_ebitda: NullableNumber,
    moat_score_10: Score10,
    reinvestment_runway_score_10: Score10,
    balance_sheet_score_10: Score10,
    fragility_score_10: Score10,
    evidence_quality_score_10: Score10,
    data_completeness_score_10: Score10
  })
});

export const SingleAnalysisTransportSchema = SingleAnalysisDataSchema.extend({
  memo_markdown: z.string().min(1)
});

const AllocationSchema = z.object({
  ticker: z.string(),
  percentage: z.number().min(0).max(100),
  rationale: z.string()
});

export const BasketAnalysisDataSchema = z.object({
  tickers: z.array(z.string()).min(1),
  allocations: z.array(AllocationSchema).min(1),
  gauntlet_scores: z.object({
    business_quality: z.record(z.string(), GauntletScore),
    earnings_quality: z.record(z.string(), GauntletScore),
    valuation_support: z.record(z.string(), GauntletScore),
    strategic_durability: z.record(z.string(), GauntletScore),
    execution_dependency: z.record(z.string(), GauntletScore)
  }),
  garp_metrics: z.array(
    z.object({
      ticker: z.string(),
      revenue_growth_pct: z.number(),
      ev_sales_multiple: z.number()
    })
  )
}).superRefine((value, ctx) => {
  const allocationSum = value.allocations.reduce((sum, item) => sum + item.percentage, 0);
  if (Math.abs(allocationSum - 100) > 0.001) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "allocations must sum to 100"
    });
  }

  const tickerSet = new Set(value.tickers);
  for (const ticker of value.tickers) {
    for (const key of Object.keys(value.gauntlet_scores) as Array<keyof typeof value.gauntlet_scores>) {
      if (typeof value.gauntlet_scores[key][ticker] !== "number") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `gauntlet score '${key}' missing ticker '${ticker}'`
        });
      }
    }
  }

  for (const allocation of value.allocations) {
    if (!tickerSet.has(allocation.ticker)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `allocation ticker '${allocation.ticker}' must exist in tickers`
      });
    }
  }

  const garpTickers = new Set(value.garp_metrics.map((item) => item.ticker));
  for (const ticker of value.tickers) {
    if (!garpTickers.has(ticker)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `garp_metrics missing ticker '${ticker}'`
      });
    }
  }
});

export const BasketAnalysisTransportSchema = BasketAnalysisDataSchema.extend({
  memo_markdown: z.string().min(1)
});

export const SingleAnalysisSchema = SingleAnalysisDataSchema;
export const BasketAnalysisSchema = BasketAnalysisDataSchema;

export type SingleAnalysis = z.infer<typeof SingleAnalysisDataSchema>;
export type SingleAnalysisTransport = z.infer<typeof SingleAnalysisTransportSchema>;
export type BasketAnalysis = z.infer<typeof BasketAnalysisDataSchema>;
export type BasketAnalysisTransport = z.infer<typeof BasketAnalysisTransportSchema>;
