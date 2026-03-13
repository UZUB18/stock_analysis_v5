import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { createApp } from "../server/index.ts";
import type { GeneratedAnalysis } from "../server/analyze.ts";

function buildSingleAnalysisResult(): GeneratedAnalysis {
  return {
    data: {
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
        primary_sources: ["10-K"],
        price_source: "Nasdaq"
      },
      decision_gate: {
        pass: true,
        gate_summary: "Pass.",
        variant_perception_present: true,
        variant_perception_summary: "Variant perception exists.",
        structural_red_flags: [],
        why_continue_or_stop: "Continue."
      },
      recommendation: {
        rating: "BUY",
        confidence_1_to_10: 8,
        thesis_status: "Active",
        thesis_expiration: "2031-03-11",
        required_proof_points: ["Demand holds"]
      },
      thesis: {
        three_line_thesis: ["A", "B", "C"],
        market_mispricing: "Mispricing exists.",
        must_be_true: ["One", "Two", "Three"],
        bear_case_steelman: "Bear case.",
        why_market_may_be_right: "Market may be right.",
        three_ways_i_am_wrong: ["X", "Y", "Z"]
      },
      business_quality: {
        archetype: "Platform",
        moat_score_10: 9,
        pricing_power_score_10: 9,
        reinvestment_runway_score_10: 8,
        management_execution_score_10: 9,
        capital_allocation_score_10: 8,
        balance_sheet_score_10: 9,
        governance_score_10: 8,
        durability_score_10: 8,
        key_strengths: ["CUDA"],
        key_weaknesses: ["Concentration"],
        competitive_position_notes: "Leader."
      },
      financial_quality: {
        revenue_cagr_3y_pct: 100,
        gross_margin_ttm_pct: 71,
        operating_margin_ttm_pct: 60,
        fcf_margin_ttm_pct: 53,
        roic_ttm_pct: 83,
        roce_ttm_pct: 79,
        fcf_to_ebitda_pct: 96,
        accruals_ratio: 0.04,
        sbc_as_pct_revenue: 2.4,
        share_count_cagr_3y_pct: -0.8,
        fcf_per_share_cagr_3y_pct: 85,
        net_debt_to_ebitda: -0.38,
        interest_coverage: 150,
        current_ratio: 3.9,
        days_sales_outstanding_delta: 5.2,
        deferred_revenue_growth_pct: 45,
        sector_specific_metrics: {}
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
        peer_multiples_summary: "Peer summary.",
        valuation_methods: [
          { method: "Exit Multiple Analysis", implied_value_per_share: 400, weight_pct: 60, key_assumptions: ["25x"] },
          { method: "DCF", implied_value_per_share: 380, weight_pct: 40, key_assumptions: ["10.5% WACC"] }
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
        business_risks: ["ASICs"],
        financial_risks: ["Concentration"],
        regulatory_risks: ["Export controls"],
        technology_or_disruption_risks: ["Open source"],
        what_breaks_first_under_stress: "Supply chain."
      },
      monitoring: {
        weekly_or_monthly_watch: ["Lead times"],
        quarterly_thresholds: ["Margins > 68%"],
        event_triggers: ["Rubin delay"],
        next_review_date: "2026-05-25"
      },
      analyst_process: {
        evidence_quality_score_10: 9,
        data_completeness_score_10: 8,
        estimate_dependence_score_10: 7,
        missing_items: ["Software revenue"],
        what_changed_vs_prior: "Fresh."
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
      }
    },
    memo: "# NVIDIA Corp (NVDA) - Long-Only Underwriting Memo"
  };
}

function buildBasketAnalysisResult(): GeneratedAnalysis {
  return {
    data: {
      tickers: ["NVDA", "PLTR"],
      allocations: [
        { ticker: "NVDA", percentage: 85, rationale: "Best." },
        { ticker: "PLTR", percentage: 15, rationale: "Smaller." }
      ],
      gauntlet_scores: {
        business_quality: { NVDA: 90, PLTR: 70 },
        earnings_quality: { NVDA: 95, PLTR: 60 },
        valuation_support: { NVDA: 80, PLTR: 25 },
        strategic_durability: { NVDA: 85, PLTR: 90 },
        execution_dependency: { NVDA: 40, PLTR: 80 }
      },
      garp_metrics: [
        { ticker: "NVDA", revenue_growth_pct: 65, ev_sales_multiple: 21 },
        { ticker: "PLTR", revenue_growth_pct: 35, ev_sales_multiple: 50 }
      ]
    },
    memo: "# Basket Comparison Memo"
  };
}

async function withServer(
  handler: (ticker: string, type: "single" | "basket") => Promise<GeneratedAnalysis>,
  fn: (baseUrl: string) => Promise<void>
) {
  const { app, db } = createApp(handler, ":memory:");
  const server = app.listen(0);
  await once(server, "listening");
  const { port } = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    await fn(baseUrl);
  } finally {
    server.close();
    db.close();
    await once(server, "close");
  }
}

test("health endpoint exposes version metadata", async () => {
  await withServer(async () => buildSingleAnalysisResult(), async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/health`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.status, "online");
    assert.equal(typeof payload.version, "string");
    assert.equal(payload.contractVersion, "analysis-v2");
    assert.equal(typeof payload.startedAt, "string");
  });
});

test("history stores single and basket analyses newest first", async () => {
  await withServer(async (_ticker, type) => (type === "basket" ? buildBasketAnalysisResult() : buildSingleAnalysisResult()), async (baseUrl) => {
    await fetch(`${baseUrl}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker: "Run NVDA for a 5-year hold", type: "single" })
    });

    await fetch(`${baseUrl}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker: "Compare NVDA, PLTR", type: "basket" })
    });

    const historyResponse = await fetch(`${baseUrl}/api/history`);
    const history = await historyResponse.json();

    assert.equal(history.items.length, 2);
    assert.equal(history.total, 2);
    assert.equal(history.page, 1);
    assert.equal(history.totalPages, 1);
    assert.equal(history.items[0].ticker, "Compare NVDA, PLTR");
    assert.ok(Array.isArray(history.items[0].data.tickers));
    assert.equal(history.items[1].data.metadata.ticker, "NVDA");
  });
});

test("history pagination returns correct page and totalPages", async () => {
  await withServer(async () => buildSingleAnalysisResult(), async (baseUrl) => {
    // Insert 5 entries
    for (let i = 0; i < 5; i++) {
      await fetch(`${baseUrl}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: `TICK${i}`, type: "single" })
      });
    }

    // Request page 2 with limit 2
    const res = await fetch(`${baseUrl}/api/history?page=2&limit=2`);
    const data = await res.json();

    assert.equal(data.items.length, 2);
    assert.equal(data.total, 5);
    assert.equal(data.page, 2);
    assert.equal(data.totalPages, 3);
  });
});

test("DELETE /api/history/:id removes entry", async () => {
  await withServer(async () => buildSingleAnalysisResult(), async (baseUrl) => {
    await fetch(`${baseUrl}/api/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker: "NVDA", type: "single" })
    });

    const histBefore = await (await fetch(`${baseUrl}/api/history`)).json();
    assert.equal(histBefore.total, 1);
    const entryId = histBefore.items[0].id;

    const delRes = await fetch(`${baseUrl}/api/history/${entryId}`, { method: "DELETE" });
    assert.equal(delRes.status, 200);

    const histAfter = await (await fetch(`${baseUrl}/api/history`)).json();
    assert.equal(histAfter.total, 0);
  });
});

test("DELETE /api/history/:id returns 404 for missing entry", async () => {
  await withServer(async () => buildSingleAnalysisResult(), async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/history/99999`, { method: "DELETE" });
    assert.equal(res.status, 404);
  });
});
