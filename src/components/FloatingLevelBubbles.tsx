import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingLevelBubblesProps {
  niveles: string; // e.g. "1" or "1,2" or "1,2,3"
  onAddLevel?: () => void;
}

export const FloatingLevelBubbles: React.FC<FloatingLevelBubblesProps> = ({
  niveles,
}) => {
  const levelList = (niveles || '1')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="fixed left-3 sm:left-6 top-3 sm:top-4 z-30 flex items-center select-none pointer-events-none">
      {/* Lateral Row of Floating Bubbles Emerging to the side and pushing existing ones */}
      <motion.div layout className="flex flex-row items-center gap-2 sm:gap-2.5">
        <AnimatePresence mode="popLayout">
          {levelList.map((lvl, idx) => {
            return (
              <motion.div
                key={lvl}
                layout
                initial={{ opacity: 0, scale: 0.2, x: -45 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: [0, -4, 0],
                }}
                exit={{ opacity: 0, scale: 0.2, x: -40 }}
                transition={{
                  layout: { type: 'spring', damping: 20, stiffness: 300 },
                  x: { type: 'spring', damping: 18, stiffness: 280 },
                  scale: { type: 'spring', damping: 16, stiffness: 260 },
                  y: {
                    duration: 2.2 + idx * 0.3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
                className="relative flex items-center justify-center"
              >
                {/* Glow Backdrop */}
                <div className="absolute inset-0 rounded-full blur-md opacity-60 bg-[#0f172a]" />

                {/* Main Solid Bubble with White Number */}
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0f172a] border border-slate-700/80 text-white flex items-center justify-center shadow-2xl">
                  {/* Subtle Top Highlight */}
                  <div className="absolute top-1.5 left-2.5 w-3.5 h-1.5 bg-white/20 rounded-full -rotate-12 blur-[0.5px]" />

                  {/* Level Number Only */}
                  <span className="text-xl sm:text-2xl font-black font-['Fredoka',sans-serif] text-white drop-shadow-md leading-none">
                    {lvl}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

