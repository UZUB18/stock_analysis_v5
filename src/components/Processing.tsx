import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface ProcessingProps {
  query: string;
}

const STEPS = [
  "Initializing Long-Only Stock Protocol...",
  "Parsing input parameters...",
  "Fetching real-time financials...",
  "Calculating FCF Conversion...",
  "Calculating Accruals Ratio...",
  "Calculating SBC as % of Revenue...",
  "Running Liquidity checks...",
  "Running Reflexivity checks...",
  "Running Structural Disqualifier checks...",
  "Executing Valuation Models (Bear, Base, Bull)...",
  "Steel-manning the bear case...",
  "Generating Time-Decay Clause...",
  "Generating Pre-Mortem...",
  "Generating Monitoring Framework...",
  "Compiling Audit-Ready Memo..."
];

export default function Processing({ query }: ProcessingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < STEPS.length) {
        setLogs(prev => [...prev, STEPS[stepIndex]]);
        setCurrentStep(stepIndex);
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 500); // Total time ~7.5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
      <div className="max-w-3xl w-full z-10 flex flex-col space-y-8">
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3 text-[var(--color-accent)]">
            <Loader2 className="w-6 h-6 animate-spin" />
            <h2 className="font-mono text-xl uppercase tracking-widest font-bold">Executing Gauntlet</h2>
          </div>
          <div className="p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] font-mono text-sm">
            <span className="text-[var(--color-ink-muted)]">Input: </span>
            <span className="text-[var(--color-ink)]">{query}</span>
          </div>
        </div>

        <div className="glass-panel rounded-xl border border-[var(--color-border)] overflow-hidden flex flex-col h-96">
          <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] p-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[var(--color-ink-muted)]" />
            <span className="font-mono text-xs text-[var(--color-ink-muted)] uppercase tracking-wider">System Log</span>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto font-mono text-sm space-y-3 flex flex-col justify-end">
            {logs.map((log, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3"
              >
                {index === currentStep && index < STEPS.length - 1 ? (
                  <Loader2 className="w-4 h-4 text-[var(--color-warning)] animate-spin mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)] mt-0.5 shrink-0" />
                )}
                <span className={index === currentStep && index < STEPS.length - 1 ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)]"}>
                  {log}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="w-full bg-[var(--color-surface)] h-2 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[var(--color-accent)]"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

      </div>
    </div>
  );
}
