import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Terminal, ArrowRight, ShieldCheck, Activity, Cpu, Clock, ChevronRight } from 'lucide-react';

interface LandingProps {
  onAnalyze: (query: string) => void;
  onViewHistory?: (ticker: string, data: any, memo: string) => void;
}

export default function Landing({ onAnalyze, onViewHistory }: LandingProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Offset by half the width/height (192px) to center the light on the cursor
      mouseX.set(e.clientX - 192);
      mouseY.set(e.clientY - 192);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    fetch('http://localhost:3001/api/history')
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error("Failed to load history", err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnalyze(input);
    }
  };

  const getRecColor = (rec: string) => {
    switch (rec?.toUpperCase()) {
      case 'BUY': return 'text-[var(--color-accent)] border-[var(--color-accent)]';
      case 'HOLD': return 'text-[var(--color-warning)] border-[var(--color-warning)]';
      case 'AVOID': return 'text-[var(--color-danger)] border-[var(--color-danger)]';
      default: return 'text-[var(--color-ink-muted)] border-[var(--color-border)]';
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-y-auto">
      {/* Decorative cursor-following light */}
      <motion.div 
        style={{ x: smoothX, y: smoothY }}
        className="fixed top-0 left-0 w-96 h-96 bg-[var(--color-accent)] rounded-full mix-blend-screen filter blur-[128px] opacity-20 pointer-events-none z-0 animate-pulse"
      ></motion.div>

      <div className="max-w-4xl w-full z-10 flex flex-col items-center text-center space-y-12 pb-12">

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6 mt-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] mb-4">
            <Terminal className="w-4 h-4 text-[var(--color-accent)]" />
            <span className="font-mono text-xs uppercase tracking-wider">A 14-step gauntlet for long-term equity deployment</span>
          </div>

          <h1 className="display-heading text-5xl md:text-7xl font-bold leading-[1.1] tracking-tighter">
            Algorithmic Rigor.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--color-ink-muted)]">
              Audit-Grade Conviction.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--color-ink-muted)] max-w-2xl mx-auto font-light leading-relaxed">
            Upload a ticker. Download a mathematically enforced, bias-checked capital allocation memo. No narrative fluff. Just execution.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-2xl"
        >
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-border)] to-[var(--color-surface)] rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-2 focus-within:border-[var(--color-accent)] transition-colors">
              <div className="pl-4 pr-2">
                <Terminal className="w-5 h-5 text-[var(--color-ink-muted)] group-focus-within:text-[var(--color-accent)] transition-colors" />
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., 'Run MSFT for a 5-year hold' or 'Compare CRWD, PANW, ZS'"
                className="flex-1 bg-transparent border-none outline-none text-lg py-3 px-2 font-mono placeholder:text-[var(--color-border)] z-10"
                autoFocus
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-[var(--color-ink)] text-[var(--color-bg)] hover:bg-[var(--color-accent)] hover:text-black transition-all px-6 py-3 rounded-lg font-mono font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed z-10" 
              >
                EXECUTE
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-mono text-[var(--color-ink-muted)] relative z-10">
            <button onClick={() => setInput('Run NVDA for a 5-year hold')} className="hover:text-[var(--color-accent)] transition-colors border border-[var(--color-border)] rounded px-3 py-1 bg-[var(--color-bg)]">NVDA</button>
            <button onClick={() => setInput('Run PLTR for a 5-year hold')} className="hover:text-[var(--color-accent)] transition-colors border border-[var(--color-border)] rounded px-3 py-1 bg-[var(--color-bg)]">PLTR</button>
            <button onClick={() => setInput('Compare CRWD, PANW, ZS')} className="hover:text-[var(--color-accent)] transition-colors border border-[var(--color-border)] rounded px-3 py-1 bg-[var(--color-bg)]">Compare CyberSec</button>
          </div>
        </motion.div>

        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="w-full pt-8 flex flex-col items-start text-left relative z-10"
          >
            <div className="flex items-center gap-2 mb-6 text-[var(--color-ink-muted)]">
              <Clock className="w-5 h-5" />
              <h3 className="font-mono uppercase tracking-widest text-sm">Recent Memorandums</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {history.map((item, i) => (
                <div
                  key={i}
                  onClick={() => onViewHistory && onViewHistory(item.ticker, item.data, item.memo)}
                  className="glass-panel rounded-xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between h-32 border border-[var(--color-border)] group bg-[var(--color-surface)]"
                >
                  <div className="flex justify-between items-start">
                    <span className="display-heading text-2xl font-bold tracking-tighter group-hover:text-[var(--color-accent)] transition-colors">{item.ticker}</span>
                    <span className={`px-2 py-1 text-xs font-bold font-mono uppercase rounded-full border ${getRecColor(item.data?.recommendation)}`}>
                      {item.data?.recommendation || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-[var(--color-ink-muted)]">Score: {item.data?.confidenceScore}/10</span>
                      <span className="font-mono text-xs text-[var(--color-ink-muted)]">{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--color-ink-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-12 border-t border-[var(--color-border)] relative z-10"
        >
          <div className="flex flex-col items-center text-center space-y-3 p-6 glass-panel rounded-xl bg-[var(--color-surface)]">
            <Cpu className="w-8 h-8 text-[var(--color-accent)]" />
            <h3 className="font-mono font-bold uppercase tracking-wider text-sm">Autonomous Research</h3>
            <p className="text-sm text-[var(--color-ink-muted)]">Real-time financials & strict earnings quality metrics via Python.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 glass-panel rounded-xl bg-[var(--color-surface)]">
            <Activity className="w-8 h-8 text-[var(--color-accent)]" />
            <h3 className="font-mono font-bold uppercase tracking-wider text-sm">Valuation Models</h3>
            <p className="text-sm text-[var(--color-ink-muted)]">Multiple scenario modeling and steel-manning the bear case.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 glass-panel rounded-xl bg-[var(--color-surface)]">
            <ShieldCheck className="w-8 h-8 text-[var(--color-accent)]" />
            <h3 className="font-mono font-bold uppercase tracking-wider text-sm">Audit-Ready Memos</h3>
            <p className="text-sm text-[var(--color-ink-muted)]">Strict buy/avoid decisions, confidence scores, and execution maps.</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
