import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Landing from './components/Landing';
import Processing from './components/Processing';
import SingleStockReport from './components/SingleStockReport';
import BasketReport from './components/BasketReport';

export type AppState = 'landing' | 'processing' | 'report_single' | 'report_basket';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [query, setQuery] = useState('');

  const handleAnalyze = (input: string) => {
    setQuery(input);
    setAppState('processing');
    
    // Simulate processing time
    setTimeout(() => {
      // Simple heuristic to determine if it's a basket or single stock
      if (input.includes(',') || input.toLowerCase().includes('compare') || input.split(' ').length > 2 && input.match(/[A-Z]{2,}/g)?.length && (input.match(/[A-Z]{2,}/g)?.length || 0) > 1) {
        setAppState('report_basket');
      } else {
        setAppState('report_single');
      }
    }, 8000); // 8 seconds of processing
  };

  const handleReset = () => {
    setAppState('landing');
    setQuery('');
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[var(--color-bg)] text-[var(--color-ink)] selection:bg-[var(--color-accent)] selection:text-black">
      {/* Background grid effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }} 
      />
      
      <div className="relative z-10 w-full h-full min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full p-6 flex justify-between items-center border-b border-[var(--color-border)] glass-panel z-50">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={handleReset}
          >
            <div className="w-8 h-8 rounded-sm bg-[var(--color-ink)] flex items-center justify-center group-hover:bg-[var(--color-accent)] transition-colors">
              <span className="text-[var(--color-bg)] font-mono font-bold text-sm">LOSP</span>
            </div>
            <span className="font-mono text-sm tracking-widest uppercase text-[var(--color-ink-muted)] group-hover:text-[var(--color-ink)] transition-colors">
              Long-Only Stock Protocol
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
              <span className="mono-label">System Online</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative">
          <AnimatePresence mode="wait">
            {appState === 'landing' && (
              <motion.div 
                key="landing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col"
              >
                <Landing onAnalyze={handleAnalyze} />
              </motion.div>
            )}
            
            {appState === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col"
              >
                <Processing query={query} />
              </motion.div>
            )}

            {appState === 'report_single' && (
              <motion.div 
                key="report_single"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col"
              >
                <SingleStockReport query={query} onBack={handleReset} />
              </motion.div>
            )}

            {appState === 'report_basket' && (
              <motion.div 
                key="report_basket"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 flex flex-col"
              >
                <BasketReport query={query} onBack={handleReset} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
