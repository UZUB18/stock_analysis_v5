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
  const [reportData, setReportData] = useState<any>(null);
  const [reportMemo, setReportMemo] = useState<string>('');
  const [appError, setAppError] = useState<string>('');

  const handleAnalyze = async (input: string) => {
    // Determine type
    const isBasket = input.includes(',') || input.toLowerCase().includes('compare') || (input.split(' ').length > 2 && (input.match(/[A-Z]{2,}/g)?.length || 0) > 1);
    const type = isBasket ? 'basket' : 'single';
    
    // Set query and start processing animation immediately
    setQuery(input);
    setAppError('');
    setReportData(null);
    setReportMemo('');
    setAppState('processing');
    
    try {
      // The API now does all the heavy lifting and returns the final JSON and Markdown
      const response = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: input, type })
      });
      const resData = await response.json();
      
      if (response.ok && resData.success && resData.status === 'complete') {
        // Pre-load the data but wait for the Terminal animation to finish
        setReportData(resData.data);
        setReportMemo(resData.memo);
      } else {
        console.error("Backend returned an error or incomplete status:", resData);
        setAppError(resData.error || 'The analysis request failed before a report was returned.');
        setAppState('landing'); // Fallback on error
      }

    } catch (e) {
      console.error("Failed to request analysis:", e);
      setAppError('The backend is unavailable or the request failed. Make sure the API server is running on http://localhost:3001.');
      setAppState('landing'); // Fallback on error
    }
  };

  const handleAnalysisComplete = () => {
    // This is called by Processing.tsx when its animation finishes
    if (reportData && reportMemo) {
      const isBasket = query.includes(',') || query.toLowerCase().includes('compare') || (query.split(' ').length > 2 && (query.match(/[A-Z]{2,}/g)?.length || 0) > 1);
      setAppState(isBasket ? 'report_basket' : 'report_single');
    }
  };

  const handleViewHistory = (ticker: string, data: any, memo: string) => {
    setAppError('');
    setQuery(ticker);
    setReportData(data);
    setReportMemo(memo);
    const isBasket = ticker.includes(',') || ticker.toLowerCase().includes('compare') || (ticker.split(' ').length > 2 && (ticker.match(/[A-Z]{2,}/g)?.length || 0) > 1);
    setAppState(isBasket ? 'report_basket' : 'report_single');
  };

  const handleReset = () => {
    setAppState('landing');
    setReportData(null);
    setReportMemo('');
    setAppError('');
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
                <Landing onAnalyze={handleAnalyze} onViewHistory={handleViewHistory} initialQuery={query} error={appError} />
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
                <Processing query={query} onComplete={handleAnalysisComplete} />
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
                <SingleStockReport query={query} data={reportData} memo={reportMemo} onBack={handleReset} />
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
                <BasketReport query={query} data={reportData} memo={reportMemo} onBack={handleReset} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
