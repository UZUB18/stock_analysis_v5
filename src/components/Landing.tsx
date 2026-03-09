import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, ArrowRight, ShieldCheck, Activity, Cpu } from 'lucide-react';

interface LandingProps {
  onAnalyze: (query: string) => void;
}

export default function Landing({ onAnalyze }: LandingProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnalyze(input);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 relative">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-accent)] rounded-full mix-blend-screen filter blur-[128px] opacity-10 animate-pulse"></div>
      
      <div className="max-w-4xl w-full z-10 flex flex-col items-center text-center space-y-12">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
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
                className="flex-1 bg-transparent border-none outline-none text-lg py-3 px-2 font-mono placeholder:text-[var(--color-border)]"
                autoFocus
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="bg-[var(--color-ink)] text-[var(--color-bg)] hover:bg-[var(--color-accent)] hover:text-black transition-all px-6 py-3 rounded-lg font-mono font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                EXECUTE
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
          
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-mono text-[var(--color-ink-muted)]">
            <button onClick={() => setInput('Run NVDA for a 5-year hold')} className="hover:text-[var(--color-accent)] transition-colors border border-[var(--color-border)] rounded px-3 py-1">NVDA</button>
            <button onClick={() => setInput('Run PLTR for a 5-year hold')} className="hover:text-[var(--color-accent)] transition-colors border border-[var(--color-border)] rounded px-3 py-1">PLTR</button>
            <button onClick={() => setInput('Compare CRWD, PANW, ZS')} className="hover:text-[var(--color-accent)] transition-colors border border-[var(--color-border)] rounded px-3 py-1">Compare CyberSec</button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-12 border-t border-[var(--color-border)]"
        >
          <div className="flex flex-col items-center text-center space-y-3 p-6 glass-panel rounded-xl">
            <Cpu className="w-8 h-8 text-[var(--color-accent)]" />
            <h3 className="font-mono font-bold uppercase tracking-wider text-sm">Autonomous Research</h3>
            <p className="text-sm text-[var(--color-ink-muted)]">Real-time financials & strict earnings quality metrics via Python.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 glass-panel rounded-xl">
            <Activity className="w-8 h-8 text-[var(--color-accent)]" />
            <h3 className="font-mono font-bold uppercase tracking-wider text-sm">Valuation Models</h3>
            <p className="text-sm text-[var(--color-ink-muted)]">Multiple scenario modeling and steel-manning the bear case.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3 p-6 glass-panel rounded-xl">
            <ShieldCheck className="w-8 h-8 text-[var(--color-accent)]" />
            <h3 className="font-mono font-bold uppercase tracking-wider text-sm">Audit-Ready Memos</h3>
            <p className="text-sm text-[var(--color-ink-muted)]">Strict buy/avoid decisions, confidence scores, and execution maps.</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
