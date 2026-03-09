import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Download, TrendingUp, TrendingDown, Minus, Info, FileText, LayoutDashboard } from 'lucide-react';

const InfoTooltip = ({ text, position = 'top' }: { text: string, position?: 'top' | 'bottom' }) => (
  <div className="group relative inline-flex items-center ml-2 align-middle z-50">
    <Info className="w-4 h-4 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] cursor-help transition-colors" />
    <div className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 w-48 sm:w-64 p-3 bg-[var(--color-surface-hover)] border border-[var(--color-border)] rounded-lg shadow-2xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all text-xs font-sans text-[var(--color-ink)] normal-case tracking-normal text-left leading-relaxed`}>
      {text}
    </div>
  </div>
);
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Rectangle } from 'recharts';

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
  onBack: () => void;
}

export default function SingleStockReport({ query, onBack }: SingleStockReportProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'dashboard' | 'memo'>('dashboard');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Generate random data based on query
  const data = useMemo(() => {
    const extractedTicker = query.match(/[A-Z]{2,}/)?.[0];
    const randomTickers = ['AAPL', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD', 'SNOW'];
    const ticker = extractedTicker || randomTickers[Math.floor(Math.random() * randomTickers.length)];
    
    const recommendations = ['BUY', 'HOLD', 'AVOID'];
    const recommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
    
    const confidenceScore = Number((Math.random() * 5 + 4.9).toFixed(1)); // 4.9 to 9.8
    const currentPrice = Number((Math.random() * 400 + 50).toFixed(2));
    
    const bearTarget = currentPrice * (Math.random() * 0.3 + 0.5); // 0.5 to 0.8
    const baseTarget = currentPrice * (Math.random() * 0.4 + 0.9); // 0.9 to 1.3
    const bullTarget = currentPrice * (Math.random() * 0.5 + 1.2); // 1.2 to 1.7

    const fcfConversion = Math.floor(Math.random() * 100 + 50); // 50% to 150%
    const accrualsRatio = (Math.random() * 20 - 10).toFixed(1); // -10% to 10%
    const sbcRev = (Math.random() * 25 + 2).toFixed(1); // 2% to 27%

    const isStructurallySound = Math.random() > 0.2;

    return {
      ticker,
      recommendation,
      confidenceScore,
      currentPrice,
      valuationData: [
        { name: 'Bear', target: bearTarget, color: 'var(--color-danger)' },
        { name: 'Base', target: baseTarget, color: 'var(--color-ink-muted)' },
        { name: 'Bull', target: bullTarget, color: 'var(--color-accent)' },
      ],
      fcfConversion,
      accrualsRatio,
      sbcRev,
      isStructurallySound
    };
  }, [query]);

  const { ticker, recommendation, confidenceScore, currentPrice, valuationData, fcfConversion, accrualsRatio, sbcRev, isStructurallySound } = data;

  const markdownContent = `
# Capital Allocation Memo: ${ticker}
**Date:** ${new Date().toLocaleDateString()}  
**Recommendation:** ${recommendation}  
**Confidence Score:** ${confidenceScore}/10  
**Current Price:** $${currentPrice.toFixed(2)}  

---

## Executive Summary
Based on our proprietary 14-factor algorithmic model, **${ticker}** presents a compelling **${recommendation}** opportunity. The current market price of $${currentPrice.toFixed(2)} implies a mispricing relative to our base case intrinsic value of $${valuationData[1].target.toFixed(2)}. 

Our analysis indicates that the market is currently under-appreciating the structural durability of the business model, while over-indexing on short-term macroeconomic noise.

## Decision Gates (Gauntlet Passed)
Before any asset enters the portfolio, it must pass three strict structural gates. **${ticker}** has been evaluated as follows:

- **Liquidity Check:** Passed. The asset has sufficient average daily trading volume (ADTV) to enter and exit without significant slippage.
- **Reflexivity Check:** Passed. The company's fundamentals are not overly dependent on its stock price (e.g., heavy reliance on equity issuance).
- **Structural Disqualifier:** ${isStructurallySound ? 'Passed. No fatal flaws detected.' : 'Warning. Potential structural issues detected (e.g., extreme customer concentration, regulatory existential threats, or accounting irregularities).'}

## Earnings Quality Analysis
We do not trust GAAP earnings. Our forensic accounting module has adjusted the financials to reflect true economic reality:

- **FCF Conversion (${fcfConversion}%):** ${fcfConversion > 100 ? 'Exceptional cash generation. The business is converting accounting profits into hard cash efficiently.' : 'Sub-optimal cash generation. Requires further manual audit.'}
- **Accruals Ratio (${accrualsRatio}%):** ${Number(accrualsRatio) < 0 ? 'Negative accruals indicate conservative accounting and high-quality earnings.' : 'Positive accruals flag potential aggressive revenue recognition.'}
- **SBC as % of Revenue (${sbcRev}%):** ${Number(sbcRev) > 15 ? 'High shareholder dilution. Management is compensating heavily via equity, which acts as a hidden tax on returns.' : 'Acceptable dilution levels.'}

## Valuation Scenarios (5-Year Horizon)
Calculated using a reverse DCF and multiple-compression models over a 5-year time horizon.

- **Bear Case ($${valuationData[0].target.toFixed(2)}):** Assumes severe multiple compression, growth deceleration to terminal rates within 24 months, and margin contraction.
- **Base Case ($${valuationData[1].target.toFixed(2)}):** Assumes normalized growth and historical average multiples. This is our highest-probability outcome.
- **Bull Case ($${valuationData[2].target.toFixed(2)}):** Assumes sustained hyper-growth, successful expansion into adjacent TAMs, and margin expansion.

## Risk & Execution Framework
We do not hold assets blindly. The following framework dictates our execution strategy:

> **Time-Decay Clause:** If revenue growth decelerates below 15% for two consecutive quarters, the thesis is invalidated. Exit position regardless of price action.

> **Pre-Mortem:** If this investment fails, it will likely be due to hyperscaler insourcing of core capabilities, rendering the standalone product a commodity.

> **Monitoring Framework:**
> - Quarterly NRR (Must remain > 115%)
> - Operating Margin Expansion (Target: +200bps YoY)
> - Customer Acquisition Cost (CAC) Payback Period
  `;

  const getRecColor = (rec: string) => {
    switch (rec) {
      case 'BUY': return 'text-[var(--color-accent)] border-[var(--color-accent)] bg-[var(--color-accent-muted)]';
      case 'HOLD': return 'text-[var(--color-warning)] border-[var(--color-warning)] bg-[rgba(255,184,0,0.1)]';
      case 'AVOID': return 'text-[var(--color-danger)] border-[var(--color-danger)] bg-[var(--color-danger-muted)]';
      default: return 'text-white border-white';
    }
  };

  const getRecIcon = (rec: string) => {
    switch (rec) {
      case 'BUY': return <TrendingUp className="w-6 h-6" />;
      case 'HOLD': return <Minus className="w-6 h-6" />;
      case 'AVOID': return <TrendingDown className="w-6 h-6" />;
      default: return null;
    }
  };

  if (isLoading) {
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

          {/* Decision Gates */}
          <div className="space-y-4">
            <div className="w-32 h-4 bg-[var(--color-surface)] rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-panel rounded-xl p-4 h-16 bg-[var(--color-surface)]"></div>
              ))}
            </div>
          </div>

          {/* Earnings Quality Dashboard */}
          <div className="space-y-4">
            <div className="w-48 h-4 bg-[var(--color-surface)] rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-border)] rounded-2xl overflow-hidden">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-[var(--color-bg)] p-8 h-32">
                  <div className="w-full h-full bg-[var(--color-surface)] rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12">
      <motion.div 
        className="max-w-5xl mx-auto space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        
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
              <h1 className="display-heading text-6xl md:text-8xl font-bold tracking-tighter">{ticker}</h1>
              <p className="font-mono text-[var(--color-ink-muted)] uppercase tracking-widest text-sm">Capital Allocation Memo</p>
            </div>
            
            <div className="flex items-center gap-6 mt-12 z-10">
              <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 font-bold text-xl tracking-widest uppercase ${getRecColor(recommendation)}`}>
                {getRecIcon(recommendation)}
                {recommendation}
              </div>
              <div className="flex flex-col">
                <span className="mono-label">Current Price</span>
                <span className="font-mono text-2xl">${currentPrice.toFixed(2)}</span>
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
                  stroke="var(--color-accent)" 
                  strokeWidth="8" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (283 * confidenceScore) / 10} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="display-heading text-5xl font-bold">{confidenceScore}</span>
                <span className="font-mono text-xs text-[var(--color-ink-muted)]">/ 10</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Decision Gates */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="mono-label">Decision Gates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel rounded-xl p-4 flex items-center justify-between border-l-4 border-l-[var(--color-accent)] hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--color-accent-muted)] transition-all cursor-default">
              <span className="font-mono text-sm uppercase flex items-center">
                Liquidity Check
                <InfoTooltip text="Ensures the asset has sufficient average daily trading volume (ADTV) to enter and exit without significant slippage." />
              </span>
              <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)] shrink-0 ml-2" />
            </div>
            <div className="glass-panel rounded-xl p-4 flex items-center justify-between border-l-4 border-l-[var(--color-accent)] hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--color-accent-muted)] transition-all cursor-default">
              <span className="font-mono text-sm uppercase flex items-center">
                Reflexivity Check
                <InfoTooltip text="Evaluates if the company's fundamentals are overly dependent on its stock price (e.g., heavy reliance on equity issuance)." />
              </span>
              <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)] shrink-0 ml-2" />
            </div>
            <div className={`glass-panel rounded-xl p-4 flex items-center justify-between border-l-4 ${!isStructurallySound ? 'border-l-[var(--color-warning)] hover:shadow-[rgba(255,184,0,0.1)]' : 'border-l-[var(--color-accent)] hover:shadow-[var(--color-accent-muted)]'} hover:-translate-y-1 hover:shadow-lg transition-all cursor-default`}>
              <span className="font-mono text-sm uppercase flex items-center">
                Structural Disqualifier
                <InfoTooltip text="Checks for fatal flaws such as extreme customer concentration, regulatory existential threats, or accounting irregularities." />
              </span>
              {!isStructurallySound ? <AlertTriangle className="w-5 h-5 text-[var(--color-warning)] shrink-0 ml-2" /> : <CheckCircle2 className="w-5 h-5 text-[var(--color-accent)] shrink-0 ml-2" />}
            </div>
          </div>
        </motion.div>

        {/* Earnings Quality Dashboard */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="mono-label">Earnings Quality Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)] rounded-2xl">
            <div className="bg-[var(--color-bg)] p-8 flex flex-col space-y-2 rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl">
              <span className="font-mono text-xs text-[var(--color-ink-muted)] uppercase tracking-wider flex items-center">
                FCF Conversion
                <InfoTooltip text="Free Cash Flow divided by Net Income. Measures how well accounting earnings translate to actual cash. >100% is ideal." />
              </span>
              <span className="display-heading text-4xl font-bold text-[var(--color-accent)]">{fcfConversion}%</span>
              <span className="text-sm text-[var(--color-ink-muted)]">High quality cash generation.</span>
            </div>
            <div className="bg-[var(--color-bg)] p-8 flex flex-col space-y-2">
              <span className="font-mono text-xs text-[var(--color-ink-muted)] uppercase tracking-wider flex items-center">
                Accruals Ratio
                <InfoTooltip text="Non-cash earnings as a percentage of total assets. High positive accruals can indicate aggressive accounting. Negative is favorable." />
              </span>
              <span className={`display-heading text-4xl font-bold ${Number(accrualsRatio) > 5 ? 'text-[var(--color-warning)]' : 'text-[var(--color-ink)]'}`}>{accrualsRatio}%</span>
              <span className="text-sm text-[var(--color-ink-muted)]">Negative is favorable.</span>
            </div>
            <div className="bg-[var(--color-bg)] p-8 flex flex-col space-y-2 rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl">
              <span className="font-mono text-xs text-[var(--color-ink-muted)] uppercase tracking-wider flex items-center">
                SBC as % of Rev
                <InfoTooltip text="Stock-Based Compensation divided by Revenue. Measures shareholder dilution. >15% is a red flag for tech companies." />
              </span>
              <span className={`display-heading text-4xl font-bold ${Number(sbcRev) > 15 ? 'text-[var(--color-warning)]' : 'text-[var(--color-ink)]'}`}>
                {sbcRev}%
              </span>
              <span className="text-sm text-[var(--color-ink-muted)]">Dilution impact analysis.</span>
            </div>
          </div>
        </motion.div>

        {/* Valuation & Risks Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Valuation Scenario Chart */}
          <div className="space-y-6">
            <h3 className="mono-label flex items-center">
              Valuation Scenarios (5-Year)
              <InfoTooltip text="Calculated using a reverse DCF and multiple-compression models over a 5-year time horizon." />
            </h3>
            <div className="glass-panel rounded-2xl p-6 h-80 w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <BarChart data={valuationData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" stroke="var(--color-border)" tick={{ fill: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }} />
                  <YAxis dataKey="name" type="category" stroke="var(--color-border)" tick={{ fill: 'var(--color-ink)', fontFamily: 'var(--font-mono)' }} />
                  <Tooltip 
                    cursor={{ fill: 'var(--color-surface)' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[var(--color-surface-hover)] border border-[var(--color-border)] p-3 rounded-lg shadow-xl font-mono z-50">
                            <p className="text-[var(--color-ink-muted)] text-xs uppercase mb-1">{label} Scenario</p>
                            <p className="text-[var(--color-ink)] text-lg font-bold">${Number(payload[0].value).toFixed(2)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="target" radius={[0, 4, 4, 0]} barSize={32} isAnimationActive={false} shape={<CustomBar />} activeBar={<Rectangle stroke="var(--color-ink)" strokeWidth={2} fillOpacity={0.8} />}>
                    {valuationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} className="hover:brightness-125 transition-all cursor-pointer" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk & Execution Cards */}
          <div className="space-y-6">
            <h3 className="mono-label flex items-center">
              Risk & Execution Framework
              <InfoTooltip text="Pre-defined exit conditions and monitoring metrics to prevent emotional decision-making during the hold period." />
            </h3>
            <div className="space-y-4">
              <div className="glass-panel rounded-xl p-6 border-l-2 border-l-[var(--color-warning)] hover:-translate-y-1 hover:shadow-lg hover:shadow-[rgba(255,184,0,0.05)] transition-all cursor-default">
                <h4 className="font-mono font-bold uppercase tracking-wider mb-2 text-sm">Time-Decay Clause</h4>
                <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">
                  If revenue growth decelerates below 15% for two consecutive quarters, the thesis is invalidated. Exit position regardless of price action.
                </p>
              </div>
              <div className="glass-panel rounded-xl p-6 border-l-2 border-l-[var(--color-danger)] hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--color-danger-muted)] transition-all cursor-default">
                <h4 className="font-mono font-bold uppercase tracking-wider mb-2 text-sm">Pre-Mortem</h4>
                <p className="text-[var(--color-ink-muted)] text-sm leading-relaxed">
                  If this investment fails, it will likely be due to hyperscaler insourcing of core capabilities, rendering the standalone product a commodity.
                </p>
              </div>
              <div className="glass-panel rounded-xl p-6 border-l-2 border-l-[var(--color-accent)] hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--color-accent-muted)] transition-all cursor-default">
                <h4 className="font-mono font-bold uppercase tracking-wider mb-2 text-sm">Monitoring Framework</h4>
                <ul className="text-[var(--color-ink-muted)] text-sm leading-relaxed list-disc list-inside space-y-1">
                  <li>Quarterly NRR (Must remain &gt; 115%)</li>
                  <li>Operating Margin Expansion (Target: +200bps YoY)</li>
                  <li>Customer Acquisition Cost (CAC) Payback Period</li>
                </ul>
              </div>
            </div>
          </div>

        </motion.div>
        </>
        )}

      </motion.div>
    </div>
  );
}
