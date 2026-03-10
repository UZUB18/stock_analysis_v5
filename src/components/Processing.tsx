import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Terminal, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import AgentInvestor from './AgentInvestor';

interface ProcessingProps {
  query: string;
  onComplete?: (data: any, memo: string) => void;
}

const START_STEPS = [
  "Initializing Long-Only Stock Protocol...",
  "Parsing input parameters..."
];

const MIDDLE_STEPS = [
  "Consulting the Reddit hivemind...",
  "Fetching real-time financials...",
  "Checking if the CEO tweets too much...",
  "Calculating FCF Conversion...",
  "Calculating Accruals Ratio...",
  "Looking for diamond hands...",
  "Calculating SBC as % of Revenue...",
  "Running Liquidity checks...",
  "Ignoring technical analysis drawn with crayons...",
  "Running Reflexivity checks...",
  "Running Structural Disqualifier checks...",
  "Calculating the probability of a short squeeze...",
  "Executing Valuation Models (Bear, Base, Bull)...",
  "Steel-manning the bear case...",
  "Waiting for J-Pow to print more money...",
  "Generating Time-Decay Clause...",
  "Generating Pre-Mortem...",
  "Generating Monitoring Framework...",
  "Parsing management euphemisms...",
  "Checking whether revenue growth is doing the heavy lifting...",
  "Measuring how “adjusted” adjusted EBITDA really is...",
  "Looking for one-time items that happen every quarter...",
  "Stress-testing the balance sheet...",
  "Inspecting margins for signs of financial alchemy...",
  "Translating shareholder letters from CEO into English...",
  "Checking whether insiders are selling the dream...",
  "Estimating dilution before it becomes a lifestyle...",
  "Watching for debt maturities lurking in the dark...",
  "Calculating return on invested capital...",
  "Separating genuine moats from PowerPoint moats...",
  "Reviewing capital allocation decisions...",
  "Looking for inventory skeletons in the closet...",
  "Checking if working capital is quietly revolting...",
  "Comparing guidance to reality...",
  "Measuring how cyclical this “secular growth” story really is...",
  "Searching for customer concentration landmines...",
  "Testing how much of the story depends on lower rates...",
  "Checking if the turnaround is real or just a better slide deck...",
  "Running downside survivability checks...",
  "Looking for serial acquirers behaving suspiciously...",
  "Scanning earnings calls for confidence theater...",
  "Estimating normalized earnings...",
  "Checking if buybacks are value creation or cosmetics...",
  "Looking for channel stuffing in polite accounting language...",
  "Calculating net debt tolerance...",
  "Measuring pricing power under actual stress...",
  "Checking whether margins are peaking at exactly the wrong time...",
  "Running competitive pressure checks...",
  "Searching for hidden leverage...",
  "Estimating reinvestment runway...",
  "Checking if the TAM was invented in a conference room...",
  "Looking for cash flow that exists outside presentations...",
  "Running management credibility checks...",
  "Measuring dependence on stock-based optimism...",
  "Checking if “AI strategy” means anything at all...",
  "Hunting for covenant tripwires...",
  "Testing the bear case for actual teeth...",
  "Estimating terminal value without hallucinating...",
  "Looking for regulatory headaches...",
  "Checking if free cash flow survives reality...",
  "Comparing valuation to historical gravity...",
  "Scanning for macro sensitivity...",
  "Evaluating whether this is quality or just expensive...",
  "Looking for operating leverage that cuts both ways...",
  "Checking if the story survives one bad quarter...",
  "Measuring how promotional the narrative has become...",
  "Running fragility checks...",
  "Determining whether the market is early or simply wrong...",
  "Checking whether the bull case is just vibes...",
  "Ignoring price targets invented five minutes ago...",
  "Looking for growth purchased at usurious rates...",
  "Measuring hopium per share...",
  "Checking whether Wall Street is grading on a curve...",
  "Searching for red flags in the footnotes humans pretend to read...",
  "Building a working thesis...",
  "Gathering evidence across competing sources...",
  "Updating confidence scores...",
  "Cross-checking claims against raw filings...",
  "Reconciling conflicting signals...",
  "Ranking the most likely explanations...",
  "Distilling noise into signal...",
  "Tracing second-order effects...",
  "Testing assumptions for structural weakness...",
  "Revising priors with new data...",
  "Mapping causal relationships...",
  "Searching for disconfirming evidence...",
  "Compressing the research into first principles...",
  "Identifying what actually matters...",
  "Running scenario logic in parallel...",
  "Weighing upside against fragility...",
  "Converting scattered facts into a coherent view...",
  "Detecting narrative drift...",
  "Escalating anomalies for deeper inspection...",
  "Preparing a judgment under uncertainty...",
  "Spawning research threads...",
  "Orchestrating parallel analysis...",
  "Routing uncertain signals for verification...",
  "Merging partial conclusions into a live model...",
  "Recomputing the thesis as evidence arrives...",
  "Thinking through edge cases...",
  "Watching the thesis change shape...",
  "Noticing what doesn’t fit...",
  "Following the strongest thread...",
  "Narrowing uncertainty...",
  "Querying structured and unstructured sources...",
  "Performing iterative hypothesis refinement...",
  "Re-ranking evidence by relevance...",
  "Updating posterior estimates...",
  "Running contradiction detection..."
];

const END_STEPS = [
  "Compiling Audit-Ready Memo...",
  "Waiting for final AI validation..."
];

export default function Processing({ query, onComplete }: ProcessingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  
  const [reportData, setReportData] = useState<{data: any, memo: string} | null>(null);
  const [isTerminalFinished, setIsTerminalFinished] = useState(false);
  const isFastForward = useRef(false);

  useEffect(() => {
    if (reportData) {
      isFastForward.current = true;
    }
  }, [reportData]);

  useEffect(() => {
    // Fisher-Yates shuffle the middle steps
    const middle = [...MIDDLE_STEPS];
    for (let i = middle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [middle[i], middle[j]] = [middle[j], middle[i]];
    }
    
    // Select a subset of middle steps to ensure it doesn't run forever
    const selectedMiddle = middle.slice(0, 20);
    
    const shuffledSteps = [...START_STEPS, ...selectedMiddle, ...END_STEPS];

    let stepIndex = 0;
    let asymptoticInterval: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;
    let isCancelled = false;

    const processNextStep = () => {
      if (isCancelled) return;

      if (stepIndex < shuffledSteps.length) {
        setLogs(prev => {
          if (!prev.includes(shuffledSteps[stepIndex])) {
            return [...prev, shuffledSteps[stepIndex]];
          }
          return prev;
        });
        setCurrentStep(stepIndex);
        
        if (stepIndex < shuffledSteps.length - 1) {
          setProgress((stepIndex / shuffledSteps.length) * 100);
          stepIndex++;
          
          // If report is already generated, fast-forward the remaining steps
          const nextDelay = isFastForward.current ? 300 : 2500;
          timeoutId = setTimeout(processNextStep, nextDelay);
        } else {
          // Reached the final step
          let currentProg = ((shuffledSteps.length - 1) / shuffledSteps.length) * 100;
          setProgress(currentProg);
          setIsTerminalFinished(true);
          
          // Incrementally slow progress up to 99%
          asymptoticInterval = setInterval(() => {
            currentProg += (99 - currentProg) * 0.05;
            if (currentProg > 98.9) currentProg = 99;
            setProgress(currentProg);
          }, 500);
        }
      }
    };

    // Start the sequence
    timeoutId = setTimeout(processNextStep, 1000); 

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
      if (asymptoticInterval) clearInterval(asymptoticInterval);
    };
  }, []);

  useEffect(() => {
    if (!onComplete) return;

    let isMounted = true;
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/status/${query}`);
        const result = await res.json();
        
        if (result.status === 'complete' && isMounted) {
          clearInterval(pollInterval);
          // Store the data but don't call onComplete just yet
          setReportData({ data: result.data, memo: result.memo });
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 3000); // Poll every 3 seconds

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [query, onComplete]);

  useEffect(() => {
    // Only transition to the dashboard if both the terminal sequence has reached the final step
    // AND the background poll has successfully found the CLI report files.
    if (isTerminalFinished && reportData && onComplete) {
      setProgress(100);
      const timer = setTimeout(() => {
        onComplete(reportData.data, reportData.memo);
      }, 1000); // Wait 1 second on 100% so user sees the completion and strobe effect
      return () => clearTimeout(timer);
    }
  }, [isTerminalFinished, reportData, onComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
      <AgentInvestor />
      
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
            {logs.map((log, index) => {
              const isValidationStep = log === "Waiting for final AI validation...";
              // Force the final step to ALWAYS remain active (spinner + strobe) once it's rendered.
              // It should never turn into a checkmark, because it is the absolute final state before unmounting.
              const isActive = index === currentStep || (isValidationStep && isTerminalFinished);
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  {isActive ? (
                    <Loader2 className="w-4 h-4 text-[var(--color-warning)] animate-spin mt-0.5 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)] mt-0.5 shrink-0" />
                  )}
                  
                  {(isActive && isValidationStep) ? (
                    <motion.span 
                      animate={{ 
                        textShadow: ["0 0 0px transparent", "0 0 12px var(--color-accent)", "0 0 0px transparent"],
                        color: ["var(--color-ink)", "var(--color-accent)", "var(--color-ink)"]
                      }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                      className="font-bold"
                    >
                      {log}
                    </motion.span>
                  ) : (
                    <span className={isActive ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)]"}>
                      {log}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        
        <div className="w-full flex flex-col space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-[var(--color-ink-muted)] px-1">
            <span>Progress</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="w-full bg-[var(--color-surface)] h-2 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[var(--color-accent)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
