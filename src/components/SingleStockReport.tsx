import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Download, TrendingUp, TrendingDown, Minus, Info, FileText, LayoutDashboard, Target, Briefcase, TrendingUp as YieldIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Rectangle, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const InfoTooltip = ({ text, position = 'top' }: { text: string, position?: 'top' | 'bottom' }) => (
  <div className="group relative inline-flex items-center ml-2 align-middle z-50">
    <Info className="w-4 h-4 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] cursor-help transition-colors" />
    <div className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 w-48 sm:w-64 p-3 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all text-xs font-sans text-[var(--color-ink)] normal-case tracking-normal text-left leading-relaxed`}>
      {text}
    </div>
  </div>
);

const CustomBar = (props: any) => {
  const { index, ...rest } = props;
  return (
    <motion.g
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 + 0.6, ease: "easeOut" }}
    >
      <Rectangle {...rest} />
    </motion.g>
  );
};

interface SingleStockReportProps {
  query: string;
  data?: any;
  memo?: string;
  onBack: () => void;
}

export default function SingleStockReport({ query, data, memo, onBack }: SingleStockReportProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'dashboard' | 'memo'>('dashboard');

  useEffect(() => {
    // Simulate a brief entrance animation delay
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !data) {
    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-12 animate-pulse">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Top Bar */}
          <div className="flex justify-between items-center">
            <div className="w-32 h-6 bg-[var(--color-surface)] rounded"></div>
            <div className="w-32 h-10 bg-[var(--color-surface)] rounded-lg"></div>
          </div>

          {/* Hero Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 glass-panel rounded-2xl p-8 h-64 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-48 h-20 bg-[var(--color-surface)] rounded-lg"></div>
                <div className="w-64 h-4 bg-[var(--color-surface)] rounded"></div>
              </div>
              <div className="flex items-center gap-6 mt-12">
                <div className="w-32 h-12 bg-[var(--color-surface)] rounded-full"></div>
                <div className="w-24 h-12 bg-[var(--color-surface)] rounded"></div>
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-8 h-64 flex flex-col items-center justify-center space-y-4">
              <div className="w-32 h-4 bg-[var(--color-surface)] rounded"></div>
              <div className="w-40 h-40 rounded-full border-8 border-[var(--color-surface)]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Metadata
  const ticker = data.metadata?.ticker || data.ticker || query;
  const currentPrice = data.metadata?.current_price || data.currentPrice || 0;
  const companyName = data.metadata?.company_name || '';
  const sector = data.metadata?.sector || '';
  
  // Recommendation
  const recommendation = data.recommendation?.rating || data.recommendation || 'HOLD';
  const confidenceScore = data.recommendation?.confidence_1_to_10 || data.confidenceScore || 5;
  const archetype = data.business_quality?.archetype || '';
  
  // Financial Quality
  const fcfConversion = data.financial_quality?.fcf_to_net_income_pct?.toFixed(1) || data.fcfConversion || 'N/A';
  const accrualsRatio = data.financial_quality?.accruals_ratio?.toFixed(2) || data.accrualsRatio || 'N/A';
  const sbcRev = data.financial_quality?.sbc_as_pct_revenue?.toFixed(1) || data.sbcRev || 'N/A';
  const revenueCagr = data.financial_quality?.revenue_cagr_3y_pct?.toFixed(1) || 'N/A';
  const isStructurallySound = data.decision_gate?.pass ?? data.isStructurallySound ?? true;

  // Business Quality Radar
  const bq = data.business_quality || {};
  const radarData = [
    { subject: 'Moat', A: bq.moat_score_10 || 5, fullMark: 10 },
    { subject: 'Pricing', A: bq.pricing_power_score_10 || 5, fullMark: 10 },
    { subject: 'Runway', A: bq.reinvestment_runway_score_10 || 5, fullMark: 10 },
    { subject: 'Mgmt', A: bq.management_execution_score_10 || 5, fullMark: 10 },
    { subject: 'Capital', A: bq.capital_allocation_score_10 || 5, fullMark: 10 },
    { subject: 'Durability', A: bq.durability_score_10 || 5, fullMark: 10 },
  ];

  // Valuation
  const returns = data.valuation?.expected_returns || {};
  const valuationData = data.valuationData || [
    { name: 'Bear', target: returns.bear_case_5y_irr_pct || 0, color: 'var(--color-danger)' },
    { name: 'Base', target: returns.base_case_5y_irr_pct || 0, color: 'var(--color-warning)' },
    { name: 'Bull', target: returns.bull_case_5y_irr_pct || 0, color: 'var(--color-accent)' }
  ];
  
  const returnDrivers = returns.return_driver_stack_pct || {};
  const multiples = data.valuation?.current_multiples || {};

  const markdownContent = memo || '# No memo provided.';

  // Dynamic Risk & Execution Content
  const thesisExpiration = data.recommendation?.thesis_expiration || data.thesisExpiration || "No expiration provided.";
  const fragilityScore = data.risk?.fragility_score_10 || "N/A";
  const preMortem = data.risk?.what_breaks_first_under_stress || data.thesis?.bear_case_steelman || "If this investment fails, it will likely be due to structural deterioration in the core moat or macro-economic compression of the multiple.";
  const monitoringItems = data.monitoring?.quarterly_thresholds || data.monitoring?.weekly_or_monthly_watch || [];

  const getRecColor = (rec: string) => {
    switch (rec?.toUpperCase()) {
      case 'BUY': return 'text-[var(--color-accent)] border-[var(--color-accent)] bg-[var(--color-accent-muted)]';
      case 'HOLD': return 'text-[var(--color-warning)] border-[var(--color-warning)] bg-[rgba(255,184,0,0.1)]';
      case 'AVOID': return 'text-[var(--color-danger)] border-[var(--color-danger)] bg-[var(--color-danger-muted)]';
      default: return 'text-white border-white';
    }
  };

  const getRecIcon = (rec: string) => {
    switch (rec?.toUpperCase()) {
      case 'BUY': return <TrendingUp className="w-6 h-6" />;
      case 'HOLD': return <Minus className="w-6 h-6" />;
      case 'AVOID': return <TrendingDown className="w-6 h-6" />;
      default: return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  // Quality styling helpers
  const getQualityColor = (val: string | number, type: 'high-is-good' | 'low-is-good' = 'high-is-good', thresholds: [number, number]) => {
    if (val === 'N/A' || val === null || val === undefined) return 'text-[var(--color-ink)]';
    const num = Number(val);
    if (isNaN(num)) return 'text-[var(--color-ink)]';
    
    if (type === 'high-is-good') {
      if (num >= thresholds[1]) return 'text-[var(--color-accent)]';
      if (num <= thresholds[0]) return 'text-[var(--color-danger)]';
      return 'text-[var(--color-warning)]';
    } else {
      if (num <= thresholds[0]) return 'text-[var(--color-accent)]';
      if (num >= thresholds[1]) return 'text-[var(--color-danger)]';
      return 'text-[var(--color-warning)]';
    }
  };

  // ... (keep existing definitions)

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12">
      <motion.div 
        className="max-w-5xl mx-auto space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        
        {/* ... (keep top bar and hero) ... */}
        
        {/* Top Bar */}
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:-translate-x-1 transition-all font-mono text-sm uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Input
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-1">
              <button 
                onClick={() => setViewMode('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-mono uppercase tracking-wider transition-all ${viewMode === 'dashboard' ? 'bg-[var(--color-border)] text-[var(--color-ink)] shadow-sm' : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button 
                onClick={() => setViewMode('memo')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-mono uppercase tracking-wider transition-all ${viewMode === 'memo' ? 'bg-[var(--color-border)] text-[var(--color-ink)] shadow-sm' : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'}`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Full Memo</span>
              </button>
            </div>
            <button className="hidden sm:flex items-center gap-2 bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] hover:scale-105 active:scale-95 border border-[var(--color-border)] px-4 py-2 rounded-lg text-sm font-mono uppercase tracking-wider transition-all shadow-sm hover:shadow-md">
              <Download className="w-4 h-4" />
              Export .md
            </button>
          </div>
        </motion.div>

        {viewMode === 'memo' ? (
          <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="markdown-body">
              <Markdown>{markdownContent}</Markdown>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Hero Header */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-panel rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent)] rounded-full mix-blend-screen filter blur-[100px] opacity-10"></div>
            
            <div className="space-y-2 z-10">
              <div className="flex items-center gap-3">
                <h1 className="display-heading text-6xl md:text-8xl font-bold tracking-tighter">{ticker}</h1>
                {archetype && (
                  <span className="px-3 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-xs font-mono uppercase tracking-widest text-[var(--color-ink-muted)] self-start mt-2">
                    {archetype}
                  </span>
                )}
              </div>
              <p className="font-mono text-[var(--color-ink-muted)] uppercase tracking-widest text-sm">{companyName || 'Capital Allocation Memo'} {sector ? `• ${sector}` : ''}</p>
            </div>
            
            <div className="flex items-center gap-6 mt-12 z-10">
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 font-bold text-xl tracking-widest uppercase ${getRecColor(recommendation)}`}>
                {getRecIcon(recommendation)}
                {recommendation}
              </div>
              <div className="flex flex-col">
                <span className="mono-label">Current Price</span>
                <span className="font-mono text-2xl">${Number(currentPrice).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4">
            <span className="mono-label flex items-center justify-center">
              Confidence Score
              <InfoTooltip text="A proprietary 1-10 score aggregating 14 quantitative and qualitative factors. Scores > 8 indicate high conviction." position="bottom" />
            </span>
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-surface)" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" 
                  stroke={confidenceScore >= 8 ? "var(--color-accent)" : confidenceScore >= 5 ? "var(--color-warning)" : "var(--color-danger)"} 
                  strokeWidth="8" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (283 * confidenceScore) / 10} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className={`display-heading text-5xl font-bold ${getQualityColor(confidenceScore, 'high-is-good', [4, 8])}`}>{confidenceScore}</span>
                <span className="font-mono text-xs text-[var(--color-ink-muted)]">/ 10</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Business Quality & Decision Gates */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4 flex flex-col h-full">
            <h3 className="mono-label">Decision Gates</h3>
            <div className="flex-1 glass-panel rounded-xl p-6 flex flex-col justify-center space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                <span className="font-mono text-sm uppercase flex items-center">
                  Liquidity Check
                </span>
                <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)] shrink-0 ml-2" />
              </div>
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                <span className="font-mono text-sm uppercase flex items-center">
                  Reflexivity Check
                </span>
                <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)] shrink-0 ml-2" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="font-mono text-sm uppercase flex items-center">
                  Structural Disqualifier
                  <InfoTooltip text="Checks for fatal flaws such as extreme customer concentration or accounting irregularities." />
                </span>
                {!isStructurallySound ? <AlertTriangle className="w-5 h-5 text-[var(--color-danger)] shrink-0 ml-2" /> : <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)] shrink-0 ml-2" />}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="mono-label flex items-center">
              Business Quality Matrix
              <InfoTooltip text="Qualitative underwriting scores across 6 key structural dimensions." />
            </h3>
            <div className="glass-panel rounded-xl p-4 h-64 flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-ink-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="A" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Earnings Quality Dashboard */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="mono-label">Earnings Quality & Growth</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-2xl">
            <div className="bg-[var(--color-bg)] p-6 flex flex-col space-y-2 rounded-tl-2xl md:rounded-l-2xl">
              <span className="font-mono text-xs text-[var(--color-ink-muted)] uppercase tracking-wider flex items-center">
                Revenue CAGR (3y)
              </span>
              <span className={`display-heading text-3xl font-bold ${getQualityColor(revenueCagr, 'high-is-good', [10, 20])}`}>{revenueCagr}%</span>
            </div>
            <div className="bg-[var(--color-bg)] p-6 flex flex-col space-y-2 rounded-tr-2xl md:rounded-none">
              <span className="font-mono text-xs text-[var(--color-ink-muted)] uppercase tracking-wider flex items-center">
                FCF Conversion
                <InfoTooltip text="Free Cash Flow divided by Net Income. >100% is ideal." />
              </span>
              <span className={`display-heading text-3xl font-bold ${getQualityColor(fcfConversion, 'high-is-good', [50, 100])}`}>{fcfConversion}%</span>
            </div>
            <div className="bg-[var(--color-bg)] p-6 flex flex-col space-y-2 rounded-bl-2xl md:rounded-none">
              <span className="font-mono text-xs text-[var(--color-ink-muted)] uppercase tracking-wider flex items-center">
                Accruals Ratio
                <InfoTooltip text="Non-cash earnings as a percentage of total assets. Negative is favorable." />
              </span>
              <span className={`display-heading text-3xl font-bold ${getQualityColor(accrualsRatio, 'low-is-good', [0, 5])}`}>{accrualsRatio}</span>
            </div>
            <div className="bg-[var(--color-bg)] p-6 flex flex-col space-y-2 rounded-br-2xl md:rounded-r-2xl">
              <span className="font-mono text-xs text-[var(--color-ink-muted)] uppercase tracking-wider flex items-center">
                SBC as % of Rev
                <InfoTooltip text="Stock-Based Compensation divided by Revenue. >15% is a red flag." />
              </span>
              <span className={`display-heading text-3xl font-bold ${getQualityColor(sbcRev, 'low-is-good', [5, 15])}`}>
                {sbcRev}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Valuation & Multiples Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="space-y-6">
            <h3 className="mono-label flex items-center">
              Current Multiples
              <InfoTooltip text="Pricing context. Never base a decision purely on multiples without checking growth and quality." />
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
                <span className="font-mono text-xs text-[var(--color-ink-muted)] uppercase">Forward P/E</span>
                <span className={`text-2xl font-bold ${getQualityColor(multiples.pe_ntm, 'low-is-good', [15, 30])}`}>{multiples.pe_ntm ? `${multiples.pe_ntm}x` : 'N/A'}</span>
              </div>
              <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
                <span className="font-mono text-xs text-[var(--color-ink-muted)] uppercase">EV / Sales (NTM)</span>
                <span className={`text-2xl font-bold ${getQualityColor(multiples.ev_sales_ntm, 'low-is-good', [5, 15])}`}>{multiples.ev_sales_ntm ? `${multiples.ev_sales_ntm}x` : 'N/A'}</span>
              </div>
              <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
                <span className="font-mono text-xs text-[var(--color-ink-muted)] uppercase">FCF Yield</span>
                <span className={`text-2xl font-bold ${getQualityColor(multiples.fcf_yield_ttm_pct, 'high-is-good', [2, 5])}`}>{multiples.fcf_yield_ttm_pct ? `${multiples.fcf_yield_ttm_pct}%` : 'N/A'}</span>
              </div>
              <div className="glass-panel p-4 rounded-xl flex flex-col justify-between">
                <span className="font-mono text-xs text-[var(--color-ink-muted)] uppercase">PEG Ratio</span>
                <span className={`text-2xl font-bold ${getQualityColor(multiples.peg, 'low-is-good', [1, 2])}`}>{multiples.peg ? multiples.peg : 'N/A'}</span>
              </div>
            </div>

            <h3 className="mono-label flex items-center pt-4">
              Base Case Return Drivers
              <InfoTooltip text="Decomposition of the base case 5-year annualized return." />
            </h3>
            <div className="glass-panel p-5 rounded-xl space-y-3">
              <div className="flex justify-between items-center text-sm font-mono">
                <span className="text-[var(--color-ink-muted)] flex items-center gap-2"><YieldIcon className="w-4 h-4" /> Starting Yield</span>
                <span className={`font-bold ${getQualityColor(returnDrivers.starting_yield, 'high-is-good', [0, 4])}`}>{returnDrivers.starting_yield || 0}%</span>
              </div>
              <div className="flex justify-between items-center text-sm font-mono">
                <span className="text-[var(--color-ink-muted)] flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Fundamental Growth</span>
                <span className={`font-bold ${getQualityColor(returnDrivers.fundamental_growth, 'high-is-good', [5, 15])}`}>{returnDrivers.fundamental_growth || 0}%</span>
              </div>
              <div className="flex justify-between items-center text-sm font-mono">
                <span className="text-[var(--color-ink-muted)] flex items-center gap-2"><Target className="w-4 h-4" /> Multiple Change</span>
                <span className={`font-bold ${getQualityColor(returnDrivers.multiple_change, 'high-is-good', [-5, 0])}`}>
                  {returnDrivers.multiple_change || 0}%
                </span>
              </div>
              <div className="flex justify-between items-center text-sm font-mono">
                <span className="text-[var(--color-ink-muted)] flex items-center gap-2"><Briefcase className="w-4 h-4" /> Capital Allocation</span>
                <span className={`font-bold ${getQualityColor(returnDrivers.capital_allocation_tailwind_or_drag, 'high-is-good', [-1, 2])}`}>
                  {returnDrivers.capital_allocation_tailwind_or_drag || 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Valuation Scenario Chart */}
          <div className="space-y-6">
            <h3 className="mono-label flex items-center">
              Expected 5-Year IRR
              <InfoTooltip text="Base, Bull, and Bear case internal rates of return over a 5-year holding period." />
            </h3>
            <div className="glass-panel rounded-2xl p-6 h-80 w-full flex flex-col justify-center">
                <ResponsiveContainer width="100%" height="90%" minWidth={1} minHeight={1}>
                  <BarChart data={valuationData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" stroke="var(--color-border)" tick={{ fill: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }} unit="%" />
                    <YAxis dataKey="name" type="category" stroke="var(--color-border)" tick={{ fill: 'var(--color-ink)', fontFamily: 'var(--font-mono)' }} />
                    <Tooltip 
                      cursor={{ fill: 'var(--color-surface)' }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-[var(--color-surface-hover)] border border-[var(--color-border)] p-3 rounded-lg shadow-xl font-mono z-50">
                              <p className="text-[var(--color-ink-muted)] text-xs uppercase mb-1">{label} Scenario</p>
                              <p className="text-[var(--color-ink)] text-lg font-bold">{Number(payload[0].value).toFixed(2)}% IRR</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="target" radius={[0, 4, 4, 0]} barSize={28} isAnimationActive={false} shape={<CustomBar />} activeBar={<Rectangle stroke="var(--color-ink)" strokeWidth={2} fillOpacity={0.8} />}>
                      {valuationData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="hover:brightness-125 transition-all cursor-pointer" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
            </div>
          </div>

        </motion.div>

        {/* Risk & Execution Cards */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="mono-label flex items-center">
            Risk & Execution Framework
            <InfoTooltip text="Pre-defined exit conditions and monitoring metrics to prevent emotional decision-making during the hold period." />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel rounded-xl p-6 border-l-2 border-l-[var(--color-warning)] hover:-translate-y-1 hover:shadow-lg transition-all cursor-default">
              <h4 className="font-mono font-bold uppercase tracking-wider mb-2 text-sm">Time-Decay Clause</h4>
              <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">
                {thesisExpiration}
              </p>
            </div>
            <div className="glass-panel rounded-xl p-6 border-l-2 border-l-[var(--color-danger)] hover:-translate-y-1 hover:shadow-lg transition-all cursor-default relative">
              <div className="absolute top-4 right-4 bg-[var(--color-danger-muted)] text-[var(--color-danger)] px-2 py-0.5 rounded text-xs font-mono font-bold">
                Fragility: {fragilityScore}/10
              </div>
              <h4 className="font-mono font-bold uppercase tracking-wider mb-2 text-sm pr-16">Pre-Mortem</h4>
              <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">
                {preMortem}
              </p>
            </div>
            <div className="glass-panel rounded-xl p-6 border-l-2 border-l-[var(--color-accent)] hover:-translate-y-1 hover:shadow-lg transition-all cursor-default">
              <h4 className="font-mono font-bold uppercase tracking-wider mb-2 text-sm">Monitoring Framework</h4>
              {monitoringItems.length > 0 ? (
                <ul className="text-[var(--color-ink-muted)] text-sm leading-relaxed list-disc list-inside space-y-1">
                  {monitoringItems.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">No specific thresholds tracked.</p>
              )}
            </div>
          </div>
        </motion.div>
        
        </>
        )}

      </motion.div>
    </div>
  );
}