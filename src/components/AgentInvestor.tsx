import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const TASKS = ['typing', 'thinking', 'smoking'] as const;
type Task = typeof TASKS[number];

export default function AgentInvestor() {
  const [task, setTask] = useState<Task>('typing');
  const [position, setPosition] = useState({ x: 15, y: 50, side: 'left' });

  useEffect(() => {
    // Every 9 seconds, pick a new location and task
    const interval = setInterval(() => {
      const nextTask = TASKS[Math.floor(Math.random() * TASKS.length)];
      
      // Randomly pick left or right side of the screen
      const isLeft = Math.random() > 0.5;
      
      // X: 5% to 25% (left) OR 75% to 95% (right)
      const x = isLeft ? 5 + Math.random() * 20 : 75 + Math.random() * 20;
      // Y: 20% to 80% (avoid absolute top/bottom)
      const y = 20 + Math.random() * 60;

      setTask(nextTask);
      setPosition({ x, y, side: isLeft ? 'left' : 'right' });
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  // Flip the agent so it always faces towards the center of the screen
  const flip = position.side === 'left' ? 1 : -1;

  const BaseBody = () => (
    <>
      {/* Head / Monitor */}
      <rect x="70" y="30" width="60" height="40" rx="4" />
      
      {/* "Eyes" pulsing */}
      <motion.circle 
        cx="90" cy="50" r="3" fill="var(--color-accent)"
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.circle 
        cx="110" cy="50" r="3" fill="var(--color-accent)"
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
      />

      {/* Neck & Tie */}
      <line x1="100" y1="70" x2="100" y2="90" />
      <line x1="100" y1="90" x2="100" y2="150" strokeDasharray="4 4" />

      {/* Torso */}
      <path d="M 80 90 L 120 90 L 130 160 L 70 160 Z" />

      {/* Legs */}
      <line x1="85" y1="160" x2="85" y2="210" />
      <line x1="115" y1="160" x2="115" y2="210" />
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, left: '15vw', top: '50vh' }}
      animate={{ 
        opacity: 0.25,
        left: `${position.x}vw`,
        top: `${position.y}vh`,
      }}
      transition={{ 
        duration: 4, 
        ease: "easeInOut",
        opacity: { duration: 1 } 
      }}
      className="fixed pointer-events-none hidden md:block z-0"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <svg 
        width="240" 
        height="240" 
        viewBox="0 0 240 240" 
        fill="none" 
        stroke="var(--color-accent)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ transform: `scaleX(${flip})`, transition: 'transform 1s ease-in-out' }}
      >
        {/* We wrap the whole body in a group shifted right so the agent is centered in the 240x240 box */}
        <g transform="translate(20, 0)">
          <BaseBody />

          <AnimatePresence mode="wait">
            {task === 'typing' && (
              <motion.g key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Desk */}
                <line x1="20" y1="150" x2="140" y2="150" stroke="var(--color-ink-muted)" />
                {/* Laptop Base (Keyboard area closer to agent) */}
                <path d="M 30 150 L 75 150 L 80 145 L 35 145 Z" fill="var(--color-bg)" stroke="var(--color-accent)" />
                {/* Laptop Screen (At the far end, angled towards the agent) */}
                <path d="M 35 145 L 40 145 L 30 115 L 25 115 Z" fill="var(--color-bg)" stroke="var(--color-accent)" />
                
                {/* Left Arm reaching out to laptop */}
                <motion.path 
                  d="M 80 100 C 65 100, 50 120, 55 140"
                  stroke="var(--color-accent)" strokeWidth="2" fill="none"
                  animate={{ d: ["M 80 100 C 65 100, 50 120, 55 140", "M 80 100 C 60 90, 50 110, 65 140", "M 80 100 C 65 100, 50 120, 55 140"] }}
                  transition={{ duration: 0.3, repeat: Infinity, ease: "linear" }}
                />
                {/* Right Arm reaching across body to laptop */}
                <motion.path 
                  d="M 120 100 C 105 110, 80 120, 70 140"
                  stroke="var(--color-accent)" strokeWidth="2" fill="none"
                  animate={{ d: ["M 120 100 C 105 110, 80 120, 70 140", "M 120 100 C 95 100, 70 110, 75 140", "M 120 100 C 105 110, 80 120, 70 140"] }}
                  transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
                />
              </motion.g>
            )}

            {task === 'smoking' && (
              <motion.g key="smoking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Left arm resting */}
                <path d="M 80 100 C 60 110, 60 150, 70 160" />
                
                {/* Animated Right arm smoking (2 intakes per cycle) */}
                <motion.path 
                  d="M 120 100 C 140 110, 150 120, 140 110" 
                  animate={{ 
                    d: [
                      "M 120 100 C 150 110, 160 140, 140 150", // 0: Arm down
                      "M 120 100 C 160 80, 140 60, 120 70",   // 1: Hand to mouth (Intake 1)
                      "M 120 100 C 160 80, 140 60, 120 70",   // 2: Hold
                      "M 120 100 C 160 100, 150 110, 130 110", // 3: Arm slightly down (Exhale 1)
                      "M 120 100 C 160 100, 150 110, 130 110", // 4: Hold
                      "M 120 100 C 160 80, 140 60, 120 70",   // 5: Hand to mouth (Intake 2)
                      "M 120 100 C 160 80, 140 60, 120 70",   // 6: Hold
                      "M 120 100 C 150 110, 160 140, 140 150", // 7: Arm down (Exhale 2)
                    ] 
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", times: [0, 0.15, 0.25, 0.4, 0.5, 0.65, 0.75, 1] }}
                />

                {/* The Cigarette attached to the hand */}
                <motion.g
                  animate={{ 
                    x: [0, -20, -20, -10, -10, -20, -20, 0],
                    y: [0, -80, -80, -40, -40, -80, -80, 0]
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", times: [0, 0.15, 0.25, 0.4, 0.5, 0.65, 0.75, 1] }}
                >
                  {/* Cigarette Body - pointing outward (mouth end at 140, lit end at 152) */}
                  <line x1="140" y1="150" x2="152" y2="150" stroke="white" strokeWidth="2" />
                  {/* Cherry (Glowing Tip) */}
                  <motion.circle 
                    cx="154" cy="150" r="1.5" fill="red" stroke="none"
                    animate={{ fill: ["#ff0000", "#ff6600", "#ff0000"] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  {/* Ember Glow Effect */}
                  <motion.circle 
                    cx="154" cy="150" r="3" fill="rgba(255,0,0,0.5)" stroke="none"
                    animate={{ opacity: [0.2, 0.8, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.g>

                {/* Plumes of Smoke - triggers after each intake */}
                <motion.g
                  animate={{ opacity: [0, 0, 0, 1, 0, 0, 0, 1, 0] }}
                  transition={{ duration: 7, repeat: Infinity, times: [0, 0.15, 0.25, 0.35, 0.5, 0.65, 0.75, 0.85, 1] }}
                >
                  <motion.path 
                    d="M 110 70 C 100 50, 120 30, 110 10" 
                    stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeDasharray="3 3"
                    animate={{ d: ["M 110 70 C 100 50, 120 30, 110 10", "M 110 70 C 120 40, 100 20, 115 0"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.path 
                    d="M 115 65 C 130 50, 100 35, 120 15" 
                    stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="2 4"
                    animate={{ d: ["M 115 65 C 130 50, 100 35, 120 15", "M 115 65 C 105 45, 125 25, 110 5"] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  />
                </motion.g>
              </motion.g>
            )}

            {task === 'thinking' && (
              <motion.g key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Left arm crossed */}
                <path d="M 80 100 C 60 120, 100 130, 120 130" />
                {/* Right arm chin */}
                <path d="M 120 100 C 140 110, 130 90, 110 70" />
                {/* Thinking Dots */}
                <motion.circle cx="140" cy="40" r="2" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }} />
                <motion.circle cx="150" cy="30" r="3" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
                <motion.circle cx="165" cy="15" r="4" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} />
              </motion.g>
            )}
          </AnimatePresence>
        </g>
      </svg>
    </motion.div>
  );
}