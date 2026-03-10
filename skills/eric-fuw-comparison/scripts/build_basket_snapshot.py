#!/usr/bin/env python3
import json
import sys
from pathlib import Path
from statistics import mean


def safe_num(value):
    return value if isinstance(value, (int, float)) and not isinstance(value, bool) else None


def clamp(value, low, high):
    return max(low, min(high, value))


def avg(values):
    vals = [v for v in values if v is not None]
    return mean(vals) if vals else None


def get_nested(d, *keys):
    cur = d
    for key in keys:
        if not isinstance(cur, dict) or key not in cur:
            return None
        cur = cur[key]
    return cur


def load_reports(folder: Path):
    json_files = sorted(folder.glob('*_data.json'))
    reports = []
    for file in json_files:
        try:
            data = json.loads(file.read_text(encoding='utf-8'))
        except Exception as exc:
            reports.append({'file': file.name, 'error': str(exc)})
            continue
        reports.append({'file': file.name, 'data': data})
    return reports


def score_report(data):
    cf = data.get('comparison_fields', {})
    bq = data.get('business_quality', {})
    ap = data.get('analyst_process', {})

    quality = avg([
        safe_num(cf.get('quality_score_10')),
        safe_num(cf.get('moat_score_10')),
        safe_num(cf.get('reinvestment_runway_score_10')),
        safe_num(cf.get('balance_sheet_score_10')),
        safe_num(bq.get('management_execution_score_10')),
        safe_num(bq.get('capital_allocation_score_10')),
    ])
    valuation = safe_num(cf.get('valuation_score_10'))
    fragility = safe_num(cf.get('fragility_score_10'))
    evidence = avg([
        safe_num(cf.get('evidence_quality_score_10')),
        safe_num(cf.get('data_completeness_score_10')),
        safe_num(ap.get('evidence_quality_score_10')),
        safe_num(ap.get('data_completeness_score_10')),
    ])
    base_irr = safe_num(cf.get('expected_5y_irr_base_pct'))
    downside_irr = safe_num(cf.get('downside_case_5y_irr_pct'))

    missing = 0
    for val in [quality, valuation, fragility, evidence, base_irr, downside_irr]:
        if val is None:
            missing += 1

    irr_score = None
    if base_irr is not None:
        irr_score = clamp((base_irr - 5) / 2, 0, 10)

    downside_penalty = 0
    if downside_irr is not None and downside_irr < 0:
        downside_penalty = clamp(abs(downside_irr) / 5, 0, 5)

    provisional = 0.0
    if quality is not None:
        provisional += 0.30 * quality
    if valuation is not None:
        provisional += 0.20 * valuation
    if irr_score is not None:
        provisional += 0.20 * irr_score
    if fragility is not None:
        provisional += 0.15 * (10 - fragility)
    if evidence is not None:
        provisional += 0.15 * evidence
    provisional -= 0.20 * downside_penalty
    provisional -= 0.15 * missing

    return {
        'ticker': get_nested(data, 'metadata', 'ticker') or 'UNKNOWN',
        'rating': get_nested(data, 'recommendation', 'rating') or '',
        'confidence': safe_num(get_nested(data, 'recommendation', 'confidence_1_to_10')),
        'base_irr': base_irr,
        'downside_irr': downside_irr,
        'quality': quality,
        'valuation': valuation,
        'fragility': fragility,
        'evidence': evidence,
        'fcf_yield': safe_num(cf.get('fcf_yield_ttm_pct')),
        'roic': safe_num(cf.get('roic_ttm_pct')),
        'net_debt_to_ebitda': safe_num(cf.get('net_debt_to_ebitda')),
        'missing': missing,
        'provisional_pm_score': round(provisional, 2),
    }


def fmt(value):
    if value is None:
        return 'na'
    if isinstance(value, float):
        return f'{value:.2f}'
    return str(value)


def choose_folder(arg: str | None) -> Path:
    if arg:
        return Path(arg)
    default = Path('data/reports')
    return default if default.exists() else Path('.')


def main(argv):
    folder = choose_folder(argv[1] if len(argv) > 1 else None)
    reports = load_reports(folder)
    if not reports:
        print(f'no *_data.json files found in {folder}')
        return 1

    rows = []
    errors = []
    for report in reports:
        if 'error' in report:
            errors.append(f"{report['file']}: {report['error']}")
            continue
        rows.append(score_report(report['data']))

    rows.sort(key=lambda r: r['provisional_pm_score'], reverse=True)

    print(f'# Basket snapshot for {folder}')
    print()
    print('| rank | ticker | rating | conf | base 5y irr | downside irr | quality | valuation | fragility | evidence | fcf yld | roic | nd/ebitda | missing | pm score |')
    print('|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|')
    for idx, row in enumerate(rows, start=1):
        print(
            f"| {idx} | {row['ticker']} | {row['rating']} | {fmt(row['confidence'])} | {fmt(row['base_irr'])} | "
            f"{fmt(row['downside_irr'])} | {fmt(row['quality'])} | {fmt(row['valuation'])} | {fmt(row['fragility'])} | "
            f"{fmt(row['evidence'])} | {fmt(row['fcf_yield'])} | {fmt(row['roic'])} | {fmt(row['net_debt_to_ebitda'])} | "
            f"{row['missing']} | {fmt(row['provisional_pm_score'])} |"
        )

    if errors:
        print('\n## Errors')
        for error in errors:
            print(f'- {error}')

    print('\n## Notes')
    print('- `pm score` is a provisional ranking aid, not the final decision.')
    print('- Penalize missing data and weak evidence further in the final memo if the narrative also looks shaky.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main(sys.argv))