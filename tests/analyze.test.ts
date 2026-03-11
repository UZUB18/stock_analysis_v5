import test from "node:test";
import assert from "node:assert/strict";
import { validateBasketCandidate, validateSingleCandidate } from "../server/analyze.ts";

function buildValidSingleTransport() {
  return {
    metadata: {
      ticker: "NVDA",
      company_name: "NVIDIA Corporation",
      analysis_date: "2026-03-11",
      horizon_years: 5,
      currency: "USD",
      current_price: 186.25,
      shares_outstanding: 24310000000,
      market_cap: 4527737500000,
      enterprise_value: 4473637500000,
      sector: "Information Technology",
      industry: "Semiconductors",
      company_type: "Platform",
      primary_sources: ["10-K", "Investor Relations"],
      price_source: "Nasdaq"
    },
    decision_gate: {
      pass: true,
      gate_summary: "Pass.",
      variant_perception_present: true,
      variant_perception_summary: "Consensus is too cautious.",
      structural_red_flags: [],
      why_continue_or_stop: "Continue."
    },
    recommendation: {
      rating: "BUY",
      confidence_1_to_10: 8,
      thesis_status: "Active",
      thesis_expiration: "2031-03-11",
      required_proof_points: ["Demand stays strong", "Margins stay above 60%", "Roadmap stays on track"]
    },
    thesis: {
      three_line_thesis: [
        "NVIDIA owns the full-stack AI platform.",
        "Inference expands the addressable market.",
        "The valuation still underprices durable earnings power."
      ],
      market_mispricing: "The market is anchoring to cyclical hardware multiples.",
      must_be_true: [
        "Inference grows faster than training.",
        "CUDA remains the default software layer.",
        "Supply chain capacity remains available."
      ],
      bear_case_steelman: "ASIC adoption compresses margins.",
      why_market_may_be_right: "AI capex may pause.",
      three_ways_i_am_wrong: ["ASIC share loss", "Power constraints", "Software moat erosion"]
    },
    business_quality: {
      archetype: "Platform compounder",
      moat_score_10: 9,
      pricing_power_score_10: 9,
      reinvestment_runway_score_10: 8,
      management_execution_score_10: 9,
      capital_allocation_score_10: 8,
      balance_sheet_score_10: 9,
      governance_score_10: 8,
      durability_score_10: 8,
      key_strengths: ["CUDA", "Scale"],
      key_weaknesses: ["Supply chain concentration"],
      competitive_position_notes: "Clear leader."
    },
    financial_quality: {
      revenue_cagr_3y_pct: 100,
      gross_margin_ttm_pct: 71,
      operating_margin_ttm_pct: 60,
      fcf_margin_ttm_pct: 53,
      roic_ttm_pct: 83,
      roce_ttm_pct: 79,
      fcf_to_net_income_pct: 96,
      accruals_ratio: 0.04,
      sbc_as_pct_revenue: 2.4,
      share_count_cagr_3y_pct: -0.8,
      fcf_per_share_cagr_3y_pct: 85,
      net_debt_to_ebitda: -0.38,
      interest_coverage: 150,
      current_ratio: 3.9,
      days_sales_outstanding_delta: 5.2,
      deferred_revenue_growth_pct: 45,
      sector_specific_metrics: {
        data_center_revenue_mix: 0.915
      }
    },
    valuation: {
      current_multiples: {
        pe_ttm: 38,
        pe_ntm: 22.6,
        ev_ebitda_ttm: 31.8,
        ev_ebitda_ntm: 18.5,
        ev_sales_ttm: 20.7,
        ev_sales_ntm: 14.2,
        p_fcf_ttm: 39.4,
        fcf_yield_ttm_pct: 2.54,
        dividend_yield_pct: 0.02,
        peg: 0.45
      },
      peer_multiples_summary: "Cheaper than peers on PEG.",
      valuation_methods: [
        {
          method: "Exit Multiple Analysis",
          implied_value_per_share: 400,
          weight_pct: 60,
          key_assumptions: ["25x exit multiple"]
        },
        {
          method: "DCF",
          implied_value_per_share: 380,
          weight_pct: 40,
          key_assumptions: ["10.5% WACC"]
        }
      ],
      blended_implied_value_per_share: 392,
      margin_of_safety_pct: 52,
      expected_returns: {
        bear_case_5y_irr_pct: -5,
        base_case_5y_irr_pct: 17,
        bull_case_5y_irr_pct: 27,
        return_driver_stack_pct: {
          starting_yield: 2.5,
          fundamental_growth: 27,
          multiple_change: -8,
          capital_allocation_tailwind_or_drag: 1.2
        }
      }
    },
    risk: {
      fragility_score_10: 4,
      macro_sensitivities: ["Rates"],
      business_risks: ["ASIC competition"],
      financial_risks: ["Customer concentration"],
      regulatory_risks: ["Export controls"],
      technology_or_disruption_risks: ["Open source compilers"],
      what_breaks_first_under_stress: "Supply chain disruption."
    },
    monitoring: {
      weekly_or_monthly_watch: ["Lead times", "Capex commentary", "Competitive launches"],
      quarterly_thresholds: ["Gross margin > 68%", "FCF conversion > 90%"],
      event_triggers: ["Rubin delay"],
      next_review_date: "2026-05-25"
    },
    analyst_process: {
      evidence_quality_score_10: 9,
      data_completeness_score_10: 8,
      estimate_dependence_score_10: 7,
      missing_items: ["Software-only revenue"],
      what_changed_vs_prior: "Fresh initiation."
    },
    comparison_fields: {
      quality_score_10: 9,
      valuation_score_10: 8,
      expected_5y_irr_base_pct: 17,
      downside_case_5y_irr_pct: -5,
      fcf_yield_ttm_pct: 2.54,
      roic_ttm_pct: 83,
      net_debt_to_ebitda: -0.38,
      moat_score_10: 9,
      reinvestment_runway_score_10: 8,
      balance_sheet_score_10: 9,
      fragility_score_10: 4,
      evidence_quality_score_10: 9,
      data_completeness_score_10: 8
    },
    memo_markdown: `# NVIDIA Corp (NVDA) - Long-Only Underwriting Memo

## 1. Recommendation Snapshot
[Judgment] Recommendation: BUY.
[Judgment] Confidence Score: 8.
[Judgment] Thesis Expiration: 2031-03-11.

## 2. Decision Gate
[Fact] Accounting and solvency pass.

## 3. Thesis in Three Lines
[Interpretation] NVIDIA owns the stack.

## 4. Must-Be-True Conditions
[Estimate] Inference grows faster than training.

## 5. Business Quality and Competitive Position
[Interpretation] CUDA drives switching costs.

## 6. Financial Quality Audit
[Derived] FCF Conversion = Free Cash Flow / Net Income = 96.7 / 100.7 = 96%.
[Derived] Accruals Ratio = (Net Income - Operating Cash Flow) / Average Total Assets = (100.7 - 118.2) / 437.5 = -0.04.
[Derived] ROE = Net Income / Shareholders' Equity = 100.7 / 132.0 = 76%.

## 7. Narrative vs Numbers Check
[Fact] Management says demand is durable; numbers still support it.

## 8. Valuation
[Estimate] Exit Multiple Analysis implies $400.
[Estimate] DCF implies $380.

## 9. Peer Benchmarking
[Fact] NVDA trades below peers on PEG.

## 10. Downside Map and Thesis Killers
[Judgment] The main killer is ASIC substitution.

## 11. Bias Check
Bear-case steelman: hyperscaler ASIC share rises sharply.
Why this view is differentiated vs consensus: consensus still treats NVDA as a cyclical hardware name.
Three specific ways this thesis could be wrong: supply chain disruption, moat erosion, capex slowdown.

## 12. Monitoring Framework
[Fact] Watch lead times and hyperscaler capex commentary.

[Fact] [Estimate] [Derived] [Interpretation] [Judgment]`
  };
}

function buildValidBasketTransport(scale: "hundred" | "ten" = "hundred") {
  const valueA = scale === "hundred" ? 90 : 9;
  const valueB = scale === "hundred" ? 70 : 7;

  return {
    tickers: ["NVDA", "PLTR"],
    allocations: [
      { ticker: "NVDA", percentage: 85, rationale: "Best quality-adjusted return." },
      { ticker: "PLTR", percentage: 15, rationale: "Smaller hedge allocation." }
    ],
    gauntlet_scores: {
      business_quality: { NVDA: valueA, PLTR: valueB },
      earnings_quality: { NVDA: valueA, PLTR: valueB },
      valuation_support: { NVDA: valueA, PLTR: valueB },
      strategic_durability: { NVDA: valueA, PLTR: valueB },
      execution_dependency: { NVDA: valueB, PLTR: valueA }
    },
    garp_metrics: [
      { ticker: "NVDA", revenue_growth_pct: 65, ev_sales_multiple: 21 },
      { ticker: "PLTR", revenue_growth_pct: 35, ev_sales_multiple: 50 }
    ],
    memo_markdown: `# Basket Comparison Memo

## 1. The Verdict
NVDA wins.

## 2. Stack Rank
1. NVDA
2. PLTR

## 3. Comparative Snapshot
Snapshot.

## 4. Business Quality Comparison
Comparison.

## 5. Comparative Valuation
Valuation.

## 6. Relative Fragility
Fragility.

## 7. Allocation Logic
Allocation.

## 8. Re-Rank Triggers
Triggers.

## 9. Anti-Bias Check
Bias check.`
  };
}

test("validateSingleCandidate accepts a complete institutional response", () => {
  const result = validateSingleCandidate(buildValidSingleTransport());

  assert.deepEqual(result.issues, []);
  assert.equal(result.data?.metadata.ticker, "NVDA");
  assert.equal(result.memo?.includes("## 11. Bias Check"), true);
});

test("validateSingleCandidate rejects incomplete memo requirements", () => {
  const candidate = buildValidSingleTransport();
  candidate.memo_markdown = candidate.memo_markdown.replace("Bear-case steelman", "Bear case");
  candidate.memo_markdown = candidate.memo_markdown.replace("FCF Conversion", "Cash conversion");

  const result = validateSingleCandidate(candidate);

  assert.equal(result.data, undefined);
  assert.equal(result.issues.some((issue) => issue.includes("bias-check")), true);
  assert.equal(result.issues.some((issue) => issue.includes("formula evidence")), true);
});

test("validateBasketCandidate accepts canonical 0-100 gauntlet scores", () => {
  const result = validateBasketCandidate(buildValidBasketTransport("hundred"));

  assert.deepEqual(result.issues, []);
  assert.equal(result.data?.allocations.length, 2);
});

test("validateBasketCandidate rejects likely legacy 0-10 gauntlet scores", () => {
  const result = validateBasketCandidate(buildValidBasketTransport("ten"));

  assert.equal(result.data, undefined);
  assert.equal(result.issues.some((issue) => issue.includes("0-10 scale")), true);
});
