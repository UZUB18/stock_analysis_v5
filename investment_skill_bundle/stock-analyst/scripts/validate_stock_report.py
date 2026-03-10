#!/usr/bin/env python3
import json
import sys
from pathlib import Path

ALLOWED_RATINGS = {"BUY", "HOLD", "AVOID"}
REQUIRED_TOP = [
    "metadata", "decision_gate", "recommendation", "thesis", "business_quality",
    "financial_quality", "valuation", "risk", "monitoring", "analyst_process",
    "comparison_fields"
]
REQUIRED_STRING_PATHS = [
    ("metadata", "ticker"),
    ("metadata", "company_name"),
    ("metadata", "analysis_date"),
    ("metadata", "currency"),
    ("recommendation", "thesis_status"),
    ("recommendation", "thesis_expiration"),
    ("decision_gate", "gate_summary"),
    ("decision_gate", "why_continue_or_stop"),
    ("thesis", "market_mispricing"),
    ("thesis", "bear_case_steelman"),
    ("thesis", "why_market_may_be_right"),
    ("risk", "what_breaks_first_under_stress"),
    ("monitoring", "next_review_date"),
]
REQUIRED_LIST_PATHS = [
    ("metadata", "primary_sources"),
    ("decision_gate", "structural_red_flags"),
    ("recommendation", "required_proof_points"),
    ("thesis", "three_line_thesis"),
    ("thesis", "must_be_true"),
    ("thesis", "three_ways_i_am_wrong"),
    ("business_quality", "key_strengths"),
    ("business_quality", "key_weaknesses"),
    ("risk", "macro_sensitivities"),
    ("risk", "business_risks"),
    ("risk", "financial_risks"),
    ("risk", "regulatory_risks"),
    ("risk", "technology_or_disruption_risks"),
    ("monitoring", "weekly_or_monthly_watch"),
    ("monitoring", "quarterly_thresholds"),
    ("monitoring", "event_triggers"),
    ("analyst_process", "missing_items"),
]
NUMERIC_OR_NULL_PATHS = [
    ("metadata", "horizon_years"),
    ("metadata", "current_price"),
    ("metadata", "shares_outstanding"),
    ("metadata", "market_cap"),
    ("metadata", "enterprise_value"),
    ("recommendation", "confidence_1_to_10"),
    ("business_quality", "moat_score_10"),
    ("business_quality", "pricing_power_score_10"),
    ("business_quality", "reinvestment_runway_score_10"),
    ("business_quality", "management_execution_score_10"),
    ("business_quality", "capital_allocation_score_10"),
    ("business_quality", "balance_sheet_score_10"),
    ("business_quality", "governance_score_10"),
    ("business_quality", "durability_score_10"),
    ("financial_quality", "revenue_cagr_3y_pct"),
    ("financial_quality", "gross_margin_ttm_pct"),
    ("financial_quality", "operating_margin_ttm_pct"),
    ("financial_quality", "fcf_margin_ttm_pct"),
    ("financial_quality", "roic_ttm_pct"),
    ("financial_quality", "roce_ttm_pct"),
    ("financial_quality", "fcf_to_net_income_pct"),
    ("financial_quality", "accruals_ratio"),
    ("financial_quality", "sbc_as_pct_revenue"),
    ("financial_quality", "share_count_cagr_3y_pct"),
    ("financial_quality", "fcf_per_share_cagr_3y_pct"),
    ("financial_quality", "net_debt_to_ebitda"),
    ("financial_quality", "interest_coverage"),
    ("financial_quality", "current_ratio"),
    ("financial_quality", "days_sales_outstanding_delta"),
    ("financial_quality", "deferred_revenue_growth_pct"),
    ("valuation", "blended_implied_value_per_share"),
    ("valuation", "margin_of_safety_pct"),
    ("risk", "fragility_score_10"),
    ("analyst_process", "evidence_quality_score_10"),
    ("analyst_process", "data_completeness_score_10"),
    ("analyst_process", "estimate_dependence_score_10"),
    ("comparison_fields", "quality_score_10"),
    ("comparison_fields", "valuation_score_10"),
    ("comparison_fields", "expected_5y_irr_base_pct"),
    ("comparison_fields", "downside_case_5y_irr_pct"),
    ("comparison_fields", "fcf_yield_ttm_pct"),
    ("comparison_fields", "roic_ttm_pct"),
    ("comparison_fields", "net_debt_to_ebitda"),
    ("comparison_fields", "moat_score_10"),
    ("comparison_fields", "reinvestment_runway_score_10"),
    ("comparison_fields", "balance_sheet_score_10"),
    ("comparison_fields", "fragility_score_10"),
    ("comparison_fields", "evidence_quality_score_10"),
    ("comparison_fields", "data_completeness_score_10"),
]


def load_json(path: Path):
    with path.open('r', encoding='utf-8') as f:
        return json.load(f)


def get_path(data, path_tuple):
    cur = data
    for key in path_tuple:
        if not isinstance(cur, dict) or key not in cur:
            return None, False
        cur = cur[key]
    return cur, True


def is_number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def validate(path: Path):
    errors = []
    try:
        data = load_json(path)
    except Exception as exc:
        return [f"failed to load json: {exc}"]

    if not isinstance(data, dict):
        return ["top-level json must be an object"]

    for key in REQUIRED_TOP:
        if key not in data:
            errors.append(f"missing top-level key: {key}")

    rating, ok = get_path(data, ("recommendation", "rating"))
    if not ok:
        errors.append("missing recommendation.rating")
    elif rating not in ALLOWED_RATINGS:
        errors.append(f"recommendation.rating must be one of {sorted(ALLOWED_RATINGS)}, got {rating!r}")

    gate_pass, ok = get_path(data, ("decision_gate", "pass"))
    if not ok or not isinstance(gate_pass, bool):
        errors.append("decision_gate.pass must be present and boolean")

    variant_flag, ok = get_path(data, ("decision_gate", "variant_perception_present"))
    if not ok or not isinstance(variant_flag, bool):
        errors.append("decision_gate.variant_perception_present must be present and boolean")

    for path_tuple in REQUIRED_STRING_PATHS:
        val, ok = get_path(data, path_tuple)
        if not ok:
            errors.append(f"missing key: {'.'.join(path_tuple)}")
        elif not isinstance(val, str):
            errors.append(f"{'.'.join(path_tuple)} must be a string")

    for path_tuple in REQUIRED_LIST_PATHS:
        val, ok = get_path(data, path_tuple)
        if not ok:
            errors.append(f"missing key: {'.'.join(path_tuple)}")
        elif not isinstance(val, list):
            errors.append(f"{'.'.join(path_tuple)} must be a list")

    for path_tuple in NUMERIC_OR_NULL_PATHS:
        val, ok = get_path(data, path_tuple)
        if not ok:
            errors.append(f"missing key: {'.'.join(path_tuple)}")
        elif val is not None and not is_number(val):
            errors.append(f"{'.'.join(path_tuple)} must be numeric or null")

    confidence, ok = get_path(data, ("recommendation", "confidence_1_to_10"))
    if ok and confidence is not None and not (1 <= confidence <= 10):
        errors.append("recommendation.confidence_1_to_10 must be between 1 and 10")

    thesis_lines, ok = get_path(data, ("thesis", "three_line_thesis"))
    if ok and isinstance(thesis_lines, list) and len(thesis_lines) > 3:
        errors.append("thesis.three_line_thesis must contain at most 3 items")

    valuation_methods, ok = get_path(data, ("valuation", "valuation_methods"))
    if not ok:
        errors.append("missing valuation.valuation_methods")
    elif not isinstance(valuation_methods, list) or len(valuation_methods) < 2:
        errors.append("valuation.valuation_methods must contain at least 2 distinct methods")

    expected_returns, ok = get_path(data, ("valuation", "expected_returns"))
    if not ok or not isinstance(expected_returns, dict):
        errors.append("valuation.expected_returns must be present and be an object")
    else:
        for subkey in ["bear_case_5y_irr_pct", "base_case_5y_irr_pct", "bull_case_5y_irr_pct", "return_driver_stack_pct"]:
            if subkey not in expected_returns:
                errors.append(f"valuation.expected_returns missing key: {subkey}")

    current_multiples, ok = get_path(data, ("valuation", "current_multiples"))
    if not ok or not isinstance(current_multiples, dict):
        errors.append("valuation.current_multiples must be present and be an object")

    sector_specific, ok = get_path(data, ("financial_quality", "sector_specific_metrics"))
    if ok and not isinstance(sector_specific, dict):
        errors.append("financial_quality.sector_specific_metrics must be an object")

    return errors


def main(argv):
    if len(argv) != 2:
        print("usage: validate_stock_report.py <path-to-json>")
        return 1
    path = Path(argv[1])
    errors = validate(path)
    if errors:
        print("validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"valid stock report: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
