import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { ArrowLeft, Download, PieChart as PieChartIcon, Activity, Target, FileText, LayoutDashboard } from 'lucide-react';
import { PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BasketReportProps {
  query: string;
  onBack: () => void;
}

export default function BasketReport({ query, onBack }: BasketReportProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'dashboard' | 'memo'>('dashboard');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Mock data based on query
  const tickers = query.match(/[A-Z]{2,}/g) || ['PANW', 'ZS', 'CRWD'];
  
  const allocationData = [
    { name: tickers[0] || 'PANW', value: 70, color: 'var(--color-accent)' },
    { name: tickers[1] || 'ZS', value: 30, color: 'var(--color-ink-muted)' },
    { name: tickers[2] || 'CRWD', value: 0, color: 'var(--color-danger)' },
  ].filter(d => d.value > 0);

  const radarData = [
    { subject: 'Business Quality', A: 90, B: 70, C: 85, fullMark: 100 },
    { subject: 'Earnings Quality', A: 85, B: 60, C: 40, fullMark: 100 },
    { subject: 'Valuation Support', A: 60, B: 80, C: 30, fullMark: 100 },
    { subject: 'Strategic Durability', A: 95, B: 75, C: 90, fullMark: 100 },
    { subject: 'Execution Dependency', A: 40, B: 80, C: 95, fullMark: 100 }, // Lower is better, but mapped for chart
  ];

  const scatterData = [
    { name: tickers[0] || 'PANW', revGrowth: 22, evSales: 12, fill: 'var(--color-accent)' },
    { name: tickers[1] || 'ZS', revGrowth: 35, evSales: 18, fill: 'var(--color-ink-muted)' },
    { name: tickers[2] || 'CRWD', revGrowth: 30, evSales: 24, fill: 'var(--color-danger)' },
  ];

  const markdownContent = `
# Sector Comparison Memo: ${tickers.join(', ')}
**Date:** ${new Date().toLocaleDateString()}  

---

## Executive Summary
This relative capital allocation matrix evaluates the selected basket of assets across our 5-dimension gauntlet. Based on current valuations and structural durability, we recommend the following target allocation:

${allocationData.map(d => `- **${d.name}:** ${d.value}%`).join('\n')}
${tickers.filter(t => !allocationData.find(d => d.name === t)).map(t => `- **${t}:** 0% (AVOID)`).join('\n')}

## 5-Dimension Gauntlet Matrix
Our proprietary radar analysis scores each asset across five critical vectors (1-100 scale):

### 1. Business Quality
Evaluates competitive moats, pricing power, and switching costs.
- **${tickers[0] || 'Asset A'}:** 90/100 (Category leader with entrenched ecosystem)
- **${tickers[1] || 'Asset B'}:** 70/100 (Strong niche player)
- **${tickers[2] || 'Asset C'}:** 85/100 (High growth, emerging moat)

### 2. Earnings Quality
Adjusts GAAP earnings for SBC, aggressive accruals, and capitalization of R&D.
- **${tickers[0] || 'Asset A'}:** 85/100 (Clean cash conversion)
- **${tickers[1] || 'Asset B'}:** 60/100 (Moderate SBC dilution)
- **${tickers[2] || 'Asset C'}:** 40/100 (Warning: High SBC and negative accruals)

### 3. Valuation Support
Measures margin of safety based on reverse DCF and historical multiple bands.
- **${tickers[0] || 'Asset A'}:** 60/100 (Fairly valued, premium justified)
- **${tickers[1] || 'Asset B'}:** 80/100 (Undervalued relative to growth)
- **${tickers[2] || 'Asset C'}:** 30/100 (Priced for perfection)

### 4. Strategic Durability
Assesses vulnerability to technological disruption or hyperscaler insourcing.
- **${tickers[0] || 'Asset A'}:** 95/100 (Mission-critical infrastructure)
- **${tickers[1] || 'Asset B'}:** 75/100 (Durable, but faces emerging competition)
- **${tickers[2] || 'Asset C'}:** 90/100 (Strong structural tailwinds)

### 5. Execution Dependency
Measures how much of the current valuation relies on flawless future execution (Lower score = Better).
- **${tickers[0] || 'Asset A'}:** 40/100 (High margin of safety)
- **${tickers[1] || 'Asset B'}:** 80/100 (Requires sustained hyper-growth)
- **${tickers[2] || 'Asset C'}:** 95/100 (Zero room for error)

## GARP Matrix (Growth vs. Multiple)
The scatter plot analysis reveals the relationship between Revenue Growth and EV/Sales multiples. Assets trading below the trendline offer superior Growth-at-a-Reasonable-Price (GARP) characteristics.

> **Conclusion:** We are allocating capital heavily towards assets that demonstrate high structural durability and clean earnings quality, while avoiding those with extreme execution dependency and stretched multiples.
  `;

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-12 animate-pulse">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Top Bar */}
          <div className="flex justify-between items-center">
            <div className="w-32 h-6 bg-[var(--color-surface)] rounded"></div>
            <div className="w-32 h-10 bg-[var(--color-surface)] rounded-lg"></div>
          </div>

          {/* Hero Header */}
          <div className="glass-panel rounded-2xl p-8 h-48 flex flex-col justify-center space-y-4">
            <div className="w-96 h-16 bg-[var(--color-surface)] rounded-lg"></div>
            <div className="flex gap-4">
              <div className="w-24 h-10 bg-[var(--color-surface)] rounded-full"></div>
              <div className="w-24 h-10 bg-[var(--color-surface)] rounded-full"></div>
              <div className="w-24 h-10 bg-[var(--color-surface)] rounded-full"></div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="glass-panel rounded-2xl p-6 h-96 bg-[var(--color-surface)]"></div>
            <div className="glass-panel rounded-2xl p-6 h-96 lg:col-span-2 bg-[var(--color-surface)]"></div>
          </div>

          {/* GARP Matrix */}
          <div className="glass-panel rounded-2xl p-6 h-96 bg-[var(--color-surface)]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center">
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
        </div>

        {viewMode === 'memo' ? (
          <div className="glass-panel rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="markdown-body">
              <Markdown>{markdownContent}</Markdown>
            </div>
          </div>
        ) : (
          <>
            {/* Hero Header */}
            <div className="glass-panel rounded-2xl p-8 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)] rounded-full mix-blend-screen filter blur-[128px] opacity-10"></div>
          
          <div className="space-y-4 z-10">
            <h1 className="display-heading text-5xl md:text-7xl font-bold tracking-tighter">Sector Comparison</h1>
            <div className="flex items-center gap-4 flex-wrap">
              {tickers.map((t, i) => (
                <span key={i} className="px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] hover:scale-105 hover:border-[var(--color-ink-muted)] transition-all cursor-default font-mono text-lg font-bold shadow-sm">
                  {t}
                </span>
              ))}
            </div>
            <p className="font-mono text-[var(--color-ink-muted)] uppercase tracking-widest text-sm mt-4">Relative Capital Allocation Matrix</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Allocation Donut */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col space-y-6">
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
              <PieChartIcon className="w-5 h-5 text-[var(--color-accent)]" />
              <h3 className="font-mono font-bold uppercase tracking-wider text-sm">Target Allocation</h3>
            </div>
            <div className="h-64 relative w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 hover:scale-[1.02] origin-center transition-all cursor-pointer outline-none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', fontFamily: 'var(--font-mono)' }}
                    itemStyle={{ color: 'var(--color-ink)' }}
                    formatter={(value: number) => [`${value}%`, 'Allocation']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-mono text-2xl font-bold">100%</span>
              </div>
            </div>
            <div className="space-y-3">
              {allocationData.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span className="font-mono font-bold">{d.name}</span>
                  </div>
                  <span className="font-mono text-[var(--color-ink-muted)]">{d.value}%</span>
                </div>
              ))}
              {tickers.filter(t => !allocationData.find(d => d.name === t)).map((t, i) => (
                <div key={`zero-${i}`} className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-danger)]"></div>
                    <span className="font-mono font-bold line-through">{t}</span>
                  </div>
                  <span className="font-mono text-[var(--color-danger)]">0% (AVOID)</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5-Dimension Radar Chart */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col space-y-6 lg:col-span-2">
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
              <Target className="w-5 h-5 text-[var(--color-accent)]" />
              <h3 className="font-mono font-bold uppercase tracking-wider text-sm">5-Dimension Gauntlet Matrix</h3>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-ink-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name={tickers[0] || 'A'} dataKey="A" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.3} activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-ink)' }} className="hover:fill-opacity-50 transition-all cursor-pointer" />
                  <Radar name={tickers[1] || 'B'} dataKey="B" stroke="var(--color-ink-muted)" fill="var(--color-ink-muted)" fillOpacity={0.3} activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-ink)' }} className="hover:fill-opacity-50 transition-all cursor-pointer" />
                  <Radar name={tickers[2] || 'C'} dataKey="C" stroke="var(--color-danger)" fill="var(--color-danger)" fillOpacity={0.1} activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-ink)' }} className="hover:fill-opacity-30 transition-all cursor-pointer" />
                  <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', fontFamily: 'var(--font-mono)' }}
                    itemStyle={{ color: 'var(--color-ink)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* GARP Matrix */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
            <Activity className="w-5 h-5 text-[var(--color-accent)]" />
            <h3 className="font-mono font-bold uppercase tracking-wider text-sm">GARP Matrix (Growth vs. Multiple)</h3>
          </div>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <XAxis 
                  type="number" 
                  dataKey="revGrowth" 
                  name="Revenue Growth (%)" 
                  unit="%" 
                  stroke="var(--color-border)" 
                  tick={{ fill: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }}
                  label={{ value: 'Revenue Growth (%)', position: 'insideBottom', offset: -10, fill: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="evSales" 
                  name="EV/Sales (x)" 
                  unit="x" 
                  stroke="var(--color-border)" 
                  tick={{ fill: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)' }}
                  label={{ value: 'EV / Sales Multiple', angle: -90, position: 'insideLeft', fill: 'var(--color-ink-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}
                />
                <ZAxis type="category" dataKey="name" name="Ticker" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', fontFamily: 'var(--font-mono)' }}
                  formatter={(value: number, name: string) => [value, name === 'revGrowth' ? 'Rev Growth (%)' : 'EV/Sales (x)']}
                />
                <Scatter name="Stocks" data={scatterData} fill="var(--color-accent)">
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80 hover:scale-125 origin-center transition-all cursor-pointer" />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        </>
        )}

      </div>
    </div>
  );
}
