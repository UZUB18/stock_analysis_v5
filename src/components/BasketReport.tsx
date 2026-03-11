import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import { ArrowLeft, Download, PieChart as PieChartIcon, Activity, Target, FileText, LayoutDashboard } from 'lucide-react';
import { PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, ReferenceLine, LabelList } from 'recharts';

interface BasketReportProps {
  query: string;
  data: any;
  memo: string;
  onBack: () => void;
}

const COLORS = [
  'var(--color-accent)',
  'var(--color-ink-muted)',
  'var(--color-danger)',
  'var(--color-warning)',
  'var(--color-success)'
];

export default function BasketReport({ query, data, memo, onBack }: BasketReportProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'dashboard' | 'memo'>('dashboard');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const tickers = data?.tickers || query.match(/[A-Z]{2,}/g) || ['UNKNOWN'];
  
  const allocationData = (data?.allocations || []).map((alloc: any, i: number) => ({
    name: alloc.ticker,
    value: alloc.percentage,
    color: COLORS[i % COLORS.length]
  })).filter((d: any) => d.value > 0);

  const avoidTickers = (data?.allocations || [])
    .filter((alloc: any) => alloc.percentage === 0)
    .map((alloc: any) => alloc.ticker);

  const subjects = [
    { key: 'business_quality', label: 'Business Quality' },
    { key: 'earnings_quality', label: 'Earnings Quality' },
    { key: 'valuation_support', label: 'Valuation Support' },
    { key: 'strategic_durability', label: 'Strategic Durability' },
    { key: 'execution_dependency', label: 'Execution Dependency' }
  ];

  const radarData = subjects.map(subj => {
    const row: any = { subject: subj.label, fullMark: 100 };
    if (data?.gauntlet_scores?.[subj.key]) {
      tickers.forEach((t: string) => {
        row[t] = data.gauntlet_scores[subj.key][t] || 0;
      });
    }
    return row;
  });

  const scatterData = (data?.garp_metrics || []).map((metric: any, i: number) => ({
    name: metric.ticker,
    revGrowth: metric.revenue_growth_pct,
    evSales: metric.ev_sales_multiple,
    fill: COLORS[i % COLORS.length]
  }));

  const avgRevGrowth = scatterData.length > 0 ? scatterData.reduce((acc: number, curr: any) => acc + curr.revGrowth, 0) / scatterData.length : 0;
  const avgEvSales = scatterData.length > 0 ? scatterData.reduce((acc: number, curr: any) => acc + curr.evSales, 0) / scatterData.length : 0;

  const markdownContent = memo || "No memo generated.";

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 md:p-12 animate-pulse">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex justify-between items-center">
            <div className="w-32 h-6 bg-[var(--color-surface)] rounded"></div>
            <div className="w-32 h-10 bg-[var(--color-surface)] rounded-lg"></div>
          </div>
          <div className="glass-panel rounded-2xl p-8 h-48 flex flex-col justify-center space-y-4">
            <div className="w-96 h-16 bg-[var(--color-surface)] rounded-lg"></div>
            <div className="flex gap-4">
              <div className="w-24 h-10 bg-[var(--color-surface)] rounded-full"></div>
              <div className="w-24 h-10 bg-[var(--color-surface)] rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="glass-panel rounded-2xl p-6 h-96 bg-[var(--color-surface)]"></div>
            <div className="glass-panel rounded-2xl p-6 h-96 lg:col-span-2 bg-[var(--color-surface)]"></div>
          </div>
          <div className="glass-panel rounded-2xl p-6 h-96 bg-[var(--color-surface)]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        
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
            <div className="glass-panel rounded-2xl p-8 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)] rounded-full mix-blend-screen filter blur-[128px] opacity-10"></div>
              
              <div className="space-y-4 z-10">
                <h1 className="display-heading text-5xl md:text-7xl font-bold tracking-tighter">Sector Comparison</h1>
                <div className="flex items-center gap-4 flex-wrap">
                  {tickers.map((t: string, i: number) => (
                    <span key={i} className="px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] hover:scale-105 hover:border-[var(--color-ink-muted)] transition-all cursor-default font-mono text-lg font-bold shadow-sm">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="font-mono text-[var(--color-ink-muted)] uppercase tracking-widest text-sm mt-4">Relative Capital Allocation Matrix</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
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
                        {allocationData.map((entry: any, index: number) => (
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
                  {allocationData.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="font-mono text-2xl font-bold">100%</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {allocationData.map((d: any, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                        <span className="font-mono font-bold">{d.name}</span>
                      </div>
                      <span className="font-mono text-[var(--color-ink-muted)]">{d.value}%</span>
                    </div>
                  ))}
                  {avoidTickers.map((t: string, i: number) => (
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
                      {tickers.map((t: string, i: number) => (
                        <Radar 
                          key={t}
                          name={t} 
                          dataKey={t} 
                          stroke={COLORS[i % COLORS.length]} 
                          fill={COLORS[i % COLORS.length]} 
                          fillOpacity={0.3} 
                          activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-ink)' }} 
                          className="hover:fill-opacity-50 transition-all cursor-pointer" 
                        />
                      ))}
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

            <div className="glass-panel rounded-2xl p-6 flex flex-col space-y-6">
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
                <Activity className="w-5 h-5 text-[var(--color-accent)]" />
                <h3 className="font-mono font-bold uppercase tracking-wider text-sm">GARP Matrix (Growth vs. Multiple)</h3>
              </div>
              <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
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
                    {scatterData.length > 0 && (
                      <>
                        <ReferenceLine x={avgRevGrowth} stroke="var(--color-ink-muted)" strokeDasharray="3 3" opacity={0.5} label={{ position: 'insideTopLeft', value: 'Avg Growth', fill: 'var(--color-ink-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                        <ReferenceLine y={avgEvSales} stroke="var(--color-ink-muted)" strokeDasharray="3 3" opacity={0.5} label={{ position: 'insideBottomRight', value: 'Avg Multiple', fill: 'var(--color-ink-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                      </>
                    )}
                    <Scatter name="Stocks" data={scatterData} fill="var(--color-accent)">
                      <LabelList dataKey="name" position="top" fill="var(--color-ink)" fontSize={12} fontFamily="var(--font-mono)" offset={10} />
                      {scatterData.map((entry: any, index: number) => (
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