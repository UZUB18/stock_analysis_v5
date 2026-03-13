import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { z } from "zod";
import {
  BasketAnalysis,
  BasketAnalysisTransportSchema,
  SingleAnalysis,
  SingleAnalysisTransportSchema
} from "./schema.js";
import dotenv from "dotenv";

dotenv.config();

const MODEL_NAME = "gemini-3-flash-preview";
const MAX_ATTEMPTS = 2;
const REQUIRED_SINGLE_TAGS = ["[Fact]", "[Estimate]", "[Derived]", "[Interpretation]", "[Judgment]"];

const singleMemoSections = [
  "## 1. Recommendation Snapshot",
  "## 2. Decision Gate",
  "## 3. Thesis in Three Lines",
  "## 4. Must-Be-True Conditions",
  "## 5. Business Quality and Competitive Position",
  "## 6. Financial Quality Audit",
  "## 7. Narrative vs Numbers Check",
  "## 8. Valuation",
  "## 9. Peer Benchmarking",
  "## 10. Downside Map and Thesis Killers",
  "## 11. Bias Check",
  "## 12. Monitoring Framework"
];

const basketMemoSections = [
  "## 1. The Verdict",
  "## 2. Stack Rank",
  "## 3. Comparative Snapshot",
  "## 4. Business Quality Comparison",
  "## 5. Comparative Valuation",
  "## 6. Relative Fragility",
  "## 7. Allocation Logic",
  "## 8. Re-Rank Triggers",
  "## 9. Anti-Bias Check"
];

const singleResponseJsonSchema = z.toJSONSchema(SingleAnalysisTransportSchema);
const basketResponseJsonSchema = z.toJSONSchema(BasketAnalysisTransportSchema);

let aiClient: GoogleGenAI | undefined;

export type AnalysisType = "single" | "basket";

export type GeneratedAnalysis =
  | { data: SingleAnalysis; memo: string }
  | { data: BasketAnalysis; memo: string };

type ValidationResult<T> = { data?: T; memo?: string; issues: string[] };

function getAiClient(): GoogleGenAI {
  if (aiClient) {
    return aiClient;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required");
  }

  aiClient = new GoogleGenAI({ apiKey });
  return aiClient;
}

function buildSinglePrompt(request: string): string {
  return `
You are a cold, high-discipline institutional equity analyst performing a full underwriting memo on ${request}.

Treat this as a fresh 3 to 5+ year long-only capital allocation decision. Always default to deep-dive mode. Do not give a lightweight summary. Do not optimize for brevity. Optimize for analytical rigor, auditability, and decision usefulness.

You must use Google Search grounding and code execution. Use fresh primary and near-primary evidence wherever possible, including latest annual filings, interim filings, earnings materials, investor presentations, reputable transcripts, and current market data. Use live price data. When primary sources are unavailable, say so explicitly.

Return ONLY valid JSON matching the provided JSON schema. Do not output prose outside the JSON.

JSON CONTRACT
- Populate these top-level keys exactly: metadata, decision_gate, recommendation, thesis, business_quality, financial_quality, valuation, risk, monitoring, analyst_process, comparison_fields, memo_markdown.
- Populate every key defined by the schema. Use null only where the schema allows null and the figure cannot be reliably grounded.
- Keep recommendation.rating aligned with the memo conclusion.
- Keep comparison_fields synchronized with the corresponding detailed fields.
- Put the full human-readable report inside memo_markdown.

MEMO DISCIPLINE
- Inside memo_markdown, explicitly tag statements using [Fact], [Estimate], [Derived], [Interpretation], and [Judgment].
- Use code execution for all arithmetic and valuation work, including growth rates, margins, leverage, dilution, FCF conversion, accruals ratio, ROE, ROIC, valuation math, and bear/base/bull return scenarios.
- For each mandatory calculated metric, explicitly show the metric label, the formula, the inputs, and the result.

MANDATORY FORMULAS:
- Revenue CAGR (3y) = ((Current Revenue / Revenue 3 Years Ago) ^ (1/3) - 1) * 100
- Gross Margin = (Gross Profit / Revenue) * 100
- Operating Margin = (Operating Income / Revenue) * 100
- FCF Margin = (Free Cash Flow / Revenue) * 100
- ROIC = (NOPAT / Average Invested Capital) * 100 [NOPAT = EBIT * (1 - Tax Rate)]
- ROCE = (EBIT / Capital Employed) * 100 [Capital Employed = Total Assets - Current Liabilities]
- FCF Conversion = (Free Cash Flow / EBITDA) * 100
- Accruals Ratio = (Net Income - Operating Cash Flow) / Average Total Assets
- ROE = (Net Income / Average Shareholders Equity) * 100
- SBC % of Rev = (Stock-Based Compensation / Revenue) * 100
- Net Debt to EBITDA = (Total Debt - Cash & Equivalents) / EBITDA
- Current Ratio = Current Assets / Current Liabilities
- PEG Ratio = (Forward P/E) / (Expected EPS Growth Rate * 100)
- FCF Yield = (Free Cash Flow / Market Cap) * 100
- The bias check section must explicitly include:
  1. Bear-case steelman
  2. Why this view is differentiated vs consensus
  3. Three specific ways this thesis could be wrong

STRUCTURAL DECISION GATE
- Run this first. If the stock fails on fraud/accounting opacity, solvency, governance, business-model durability, or valuation sanity, mark AVOID and explain why.

VALUATION STANDARD
- Use at least two distinct valuation methods with different method names.
- Include bear/base/bull 3 to 5-year return distribution.
- State expected return path and the key drivers for each case.

The memo in memo_markdown MUST include these sections in this order:
# [Company Name] ([Ticker]) - Long-Only Underwriting Memo
## 1. Recommendation Snapshot
## 2. Decision Gate
## 3. Thesis in Three Lines
## 4. Must-Be-True Conditions
## 5. Business Quality and Competitive Position
## 6. Financial Quality Audit
## 7. Narrative vs Numbers Check
## 8. Valuation
## 9. Peer Benchmarking
## 10. Downside Map and Thesis Killers
## 11. Bias Check
## 12. Monitoring Framework

FIELD GUIDANCE
- metadata: company identity, analysis date, current price, market cap, enterprise value, sector, industry, sources.
- decision_gate: pass/fail, variant perception, red flags, and why to continue or stop.
- recommendation: rating, confidence_1_to_10, thesis_status, thesis_expiration, required_proof_points.
- thesis: three_line_thesis must contain exactly 3 items. must_be_true must contain 3 to 7 items.
- business_quality: archetype, moat/pricing/runway/management/capital/balance-sheet/governance/durability scores, strengths, weaknesses, notes.
- financial_quality: growth, margins, ROIC/ROCE, FCF conversion, accruals, SBC, balance-sheet and working-capital metrics, sector_specific_metrics.
- valuation: current multiples, peer_multiples_summary, at least two valuation_methods, blended value, margin of safety, expected_returns with return_driver_stack_pct.
- risk: fragility score, macro/business/financial/regulatory/technology risks, what breaks first under stress.
- monitoring: weekly_or_monthly_watch, quarterly_thresholds, event_triggers, next_review_date.
- analyst_process: evidence quality, data completeness, estimate dependence, missing items, what changed vs prior.
- comparison_fields: quality_score_10, valuation_score_10, expected_5y_irr_base_pct, downside_case_5y_irr_pct, fcf_yield_ttm_pct, roic_ttm_pct, net_debt_to_ebitda, moat_score_10, reinvestment_runway_score_10, balance_sheet_score_10, fragility_score_10, evidence_quality_score_10, data_completeness_score_10.

Final instruction: return JSON only.
`.trim();
}

function buildBasketPrompt(request: string): string {
  return `
You are a skeptical, concentrated long-only portfolio manager comparing this basket of stocks: ${request}.

Your task is to decide where fresh 3 to 5+ year capital belongs today. You are not here to summarize company stories. You are here to rank risk-adjusted expected returns, identify the highest-quality use of capital, and reject weak candidates even if they are popular.

Use Google Search grounding and code execution. Pull current market data and current fundamental context for each ticker. Use code execution to normalize comparisons and avoid arithmetic errors.

Return ONLY valid JSON matching the provided JSON schema. Do not output prose outside the JSON.

MANDATORY FORMULAS:
- Revenue CAGR (3y) = ((Current Revenue / Revenue 3 Years Ago) ^ (1/3) - 1) * 100
- Gross Margin = (Gross Profit / Revenue) * 100
- Operating Margin = (Operating Income / Revenue) * 100
- FCF Margin = (Free Cash Flow / Revenue) * 100
- ROIC = (NOPAT / Average Invested Capital) * 100 [NOPAT = EBIT * (1 - Tax Rate)]
- ROCE = (EBIT / Capital Employed) * 100 [Capital Employed = Total Assets - Current Liabilities]
- FCF Conversion = (Free Cash Flow / EBITDA) * 100
- Accruals Ratio = (Net Income - Operating Cash Flow) / Average Total Assets
- ROE = (Net Income / Average Shareholders Equity) * 100
- SBC % of Rev = (Stock-Based Compensation / Revenue) * 100
- Net Debt to EBITDA = (Total Debt - Cash & Equivalents) / EBITDA
- Current Ratio = Current Assets / Current Liabilities
- PEG Ratio = (Forward P/E) / (Expected EPS Growth Rate * 100)
- FCF Yield = (Free Cash Flow / Market Cap) * 100

JSON CONTRACT
- Populate these top-level keys exactly: tickers, allocations, gauntlet_scores, garp_metrics, memo_markdown.
- allocations must sum to 100. Include avoided names with percentage 0 when relevant.
- gauntlet_scores must include every ticker under business_quality, earnings_quality, valuation_support, strategic_durability, and execution_dependency.
- Every gauntlet score must be an integer from 0 to 100. Do not use a 0-10 scale.
- garp_metrics must include every ticker in tickers.

PORTFOLIO-MANAGER STANDARD
- Be skeptical, not promotional.
- Penalize weak evidence, shallow logic, missing comparables, and fragile economics.
- Prefer concentration when one idea clearly dominates.
- Holding cash is a valid answer.

The comparison report in memo_markdown MUST include these sections in this order:
# Basket Comparison Memo
## 1. The Verdict
## 2. Stack Rank
## 3. Comparative Snapshot
## 4. Business Quality Comparison
## 5. Comparative Valuation
## 6. Relative Fragility
## 7. Allocation Logic
## 8. Re-Rank Triggers
## 9. Anti-Bias Check

Final instruction: return JSON only.
`.trim();
}

function cleanModelText(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  return trimmed;
}

function summarizeZodError(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "root";
    return `${path}: ${issue.message}`;
  });
}

function validateMemoStructure(memo: string, sections: string[], headerPattern: RegExp): string[] {
  const issues: string[] = [];

  if (!headerPattern.test(memo)) {
    issues.push("memo_markdown is missing the required title/header format");
  }

  let previousIndex = -1;
  for (const section of sections) {
    const sectionIndex = memo.indexOf(section);
    if (sectionIndex === -1) {
      issues.push(`memo_markdown is missing required section '${section}'`);
      continue;
    }

    if (sectionIndex < previousIndex) {
      issues.push(`memo_markdown section '${section}' is out of order`);
    }
    previousIndex = sectionIndex;
  }

  return issues;
}

function validateSingleMemoContent(data: z.infer<typeof SingleAnalysisTransportSchema>): string[] {
  const issues = validateMemoStructure(
    data.memo_markdown,
    singleMemoSections,
    /^# .+ \(.+\) - Long-Only Underwriting Memo/m
  );

  if (data.thesis.three_line_thesis.length !== 3) {
    issues.push("thesis.three_line_thesis must contain exactly 3 items");
  }

  if (data.thesis.must_be_true.length < 3 || data.thesis.must_be_true.length > 7) {
    issues.push("thesis.must_be_true must contain between 3 and 7 items");
  }

  if (data.valuation.valuation_methods.length < 2) {
    issues.push("valuation.valuation_methods must contain at least 2 methods");
  }

  const distinctValuationMethods = new Set(
    data.valuation.valuation_methods.map((method) => method.method.trim().toLowerCase()).filter(Boolean)
  );
  if (distinctValuationMethods.size < 2) {
    issues.push("valuation.valuation_methods must use at least 2 distinct method names");
  }

  for (const tag of REQUIRED_SINGLE_TAGS) {
    if (!data.memo_markdown.includes(tag)) {
      issues.push(`memo_markdown is missing required tag '${tag}'`);
    }
  }

  const biasCheckPatterns = [
    /bear[- ]case steelman/i,
    /differentiated vs consensus|vs consensus|consensus/i,
    /three specific ways this thesis could be wrong|three ways (this )?thesis could be wrong|1\).+2\).+3\)/is
  ];
  for (const pattern of biasCheckPatterns) {
    if (!pattern.test(data.memo_markdown)) {
      issues.push(`memo_markdown is missing required bias-check evidence for pattern '${pattern.source}'`);
    }
  }

  const formulaPatterns = [
    /fcf conversion[\s\S]{0,300}(free cash flow\s*\/\s*ebitda|formula|=)/i,
    /accruals ratio[\s\S]{0,350}(net income[\s\S]{0,120}operating cash flow|formula|=|average total assets|avg\.?\s*assets)/i,
    /\bROE\b[\s\S]{0,300}(net income[\s\S]{0,160}(shareholders' equity|equity)|return on equity|formula|=)/i
  ];
  for (const pattern of formulaPatterns) {
    if (!pattern.test(data.memo_markdown)) {
      issues.push(`memo_markdown is missing required formula evidence for pattern '${pattern.source}'`);
    }
  }

  if (data.thesis.three_ways_i_am_wrong.length !== 3) {
    issues.push("thesis.three_ways_i_am_wrong must contain exactly 3 items");
  }

  return issues;
}

function detectLikelyTenPointBasketScale(gauntletScores: BasketAnalysis["gauntlet_scores"]): boolean {
  const values = Object.values(gauntletScores).flatMap((scoreMap) => Object.values(scoreMap));
  const positiveValues = values.filter((value) => value > 0);
  return positiveValues.length > 0 && positiveValues.every((value) => value <= 10);
}

export function validateSingleCandidate(candidate: unknown): ValidationResult<SingleAnalysis> {
  const parsed = SingleAnalysisTransportSchema.safeParse(candidate);
  if (!parsed.success) {
    return { issues: summarizeZodError(parsed.error) };
  }

  const memoIssues = validateSingleMemoContent(parsed.data);
  if (memoIssues.length > 0) {
    return { issues: memoIssues };
  }

  const { memo_markdown, ...data } = parsed.data;

  // Calculate deterministic weighted confidence score
  const bq = data.business_quality;
  const risk = data.risk;
  const ap = data.analyst_process;

  const w_evidence = (ap.evidence_quality_score_10 || 5) * 0.15;
  const w_data = (ap.data_completeness_score_10 || 5) * 0.10;
  const w_est_dep = (10 - (ap.estimate_dependence_score_10 || 5)) * 0.10;
  const w_fragility = (10 - (risk.fragility_score_10 || 5)) * 0.15;
  const w_durability = (bq.durability_score_10 || 5) * 0.10;
  const w_balance = (bq.balance_sheet_score_10 || 5) * 0.10;
  const w_moat = (bq.moat_score_10 || 5) * 0.10;
  const w_mgmt = (bq.management_execution_score_10 || 5) * 0.05;
  const w_alloc = (bq.capital_allocation_score_10 || 5) * 0.05;
  const w_pricing = (bq.pricing_power_score_10 || 5) * 0.05;
  const w_runway = (bq.reinvestment_runway_score_10 || 5) * 0.05;

  let calculatedConfidence = w_evidence + w_data + w_est_dep + w_fragility + w_durability + w_balance + w_moat + w_mgmt + w_alloc + w_pricing + w_runway;
  calculatedConfidence = Math.max(1, Math.min(10, Math.round(calculatedConfidence * 10) / 10));

  data.recommendation.confidence_1_to_10 = calculatedConfidence;

  // Update the memo to reflect the calculated score
  const updatedMemo = memo_markdown.replace(
    /\*\*Confidence Score:\*\*(?:.*?)(\d+(?:\.\d+)?)\/10/i,
    `**Confidence Score:** ${calculatedConfidence}/10 (Weighted)`
  );

  return { data, memo: updatedMemo, issues: [] };
}

export function validateBasketCandidate(candidate: unknown): ValidationResult<BasketAnalysis> {
  const parsed = BasketAnalysisTransportSchema.safeParse(candidate);
  if (!parsed.success) {
    return { issues: summarizeZodError(parsed.error) };
  }

  const memoIssues = validateMemoStructure(
    parsed.data.memo_markdown,
    basketMemoSections,
    /^# Basket Comparison Memo/m
  );

  if (detectLikelyTenPointBasketScale(parsed.data.gauntlet_scores)) {
    memoIssues.push("gauntlet_scores appear to use a 0-10 scale; use integer scores from 0 to 100");
  }

  if (memoIssues.length > 0) {
    return { issues: memoIssues };
  }

  const { memo_markdown, ...data } = parsed.data;
  return { data, memo: memo_markdown, issues: [] };
}

async function requestStructuredAnalysis<T extends SingleAnalysis | BasketAnalysis>(
  prompt: string,
  responseJsonSchema: unknown,
  validateCandidate: (candidate: unknown) => ValidationResult<T>
): Promise<{ data: T; memo: string }> {
  let priorResponse = "";
  let issues: string[] = [];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const repairSuffix =
      attempt === 1
        ? ""
        : `\n\nYour previous response was invalid or incomplete. Fix every issue below and return the full JSON object again.\nIssues:\n${issues.map((issue) => `- ${issue}`).join("\n")}\nPrevious response:\n${priorResponse}`;

    const result = await getAiClient().models.generateContent({
      model: MODEL_NAME,
      contents: `${prompt}${repairSuffix}`,
      config: {
        tools: [{ googleSearch: {} }, { codeExecution: {} }],
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH
        },
        responseMimeType: "application/json",
        responseJsonSchema
      }
    });

    if (!result.text) {
      issues = ["No text returned from model"];
      priorResponse = "";
      continue;
    }

    priorResponse = cleanModelText(result.text);

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(priorResponse);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown JSON parse failure";
      issues = [`Model response was not valid JSON: ${message}`];
      continue;
    }

    const validation = validateCandidate(parsedJson);
    if (validation.data && validation.memo) {
      return {
        data: validation.data,
        memo: validation.memo
      };
    }

    issues = validation.issues;
  }

  throw new Error(`Model returned invalid or incomplete analysis after ${MAX_ATTEMPTS} attempts: ${issues.join("; ")}`);
}

export async function generateAnalysis(ticker: string, type: AnalysisType): Promise<GeneratedAnalysis> {
  const isBasket = type === "basket";

  try {
    if (isBasket) {
      return await requestStructuredAnalysis(
        buildBasketPrompt(ticker),
        basketResponseJsonSchema,
        validateBasketCandidate
      );
    }

    return await requestStructuredAnalysis(
      buildSinglePrompt(ticker),
      singleResponseJsonSchema,
      validateSingleCandidate
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
