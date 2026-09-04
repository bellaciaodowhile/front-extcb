import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Participant } from '../types';
import { MapPin } from 'lucide-react';

interface FloatingBubblesOrbitViewProps {
  participants: Participant[];
}

export const FloatingBubblesOrbitView: React.FC<FloatingBubblesOrbitViewProps> = ({
  participants,
}) => {
  // Generate harmonious floating positioning spread across screen
  const bubbleConfigs = useMemo(() => {
    const total = participants.length;
    if (total === 0) return [];

    // Predefined vibrant soft gradient color palettes for bubbles
    const themes = [
      { bg: 'from-blue-500 via-indigo-600 to-indigo-800', ring: 'ring-blue-300', glow: 'shadow-blue-500/40', tagBg: 'bg-blue-900/90 text-blue-200' },
      { bg: 'from-amber-400 via-yellow-500 to-amber-600', ring: 'ring-amber-200', glow: 'shadow-amber-500/40', tagBg: 'bg-amber-950/90 text-amber-200' },
      { bg: 'from-emerald-400 via-teal-500 to-emerald-700', ring: 'ring-emerald-200', glow: 'shadow-emerald-500/40', tagBg: 'bg-emerald-950/90 text-emerald-200' },
      { bg: 'from-purple-500 via-violet-600 to-purple-800', ring: 'ring-purple-300', glow: 'shadow-purple-500/40', tagBg: 'bg-purple-950/90 text-purple-200' },
      { bg: 'from-rose-500 via-pink-600 to-rose-700', ring: 'ring-rose-200', glow: 'shadow-rose-500/40', tagBg: 'bg-rose-950/90 text-rose-200' },
      { bg: 'from-cyan-400 via-sky-500 to-blue-600', ring: 'ring-cyan-200', glow: 'shadow-cyan-500/40', tagBg: 'bg-cyan-950/90 text-cyan-200' },
    ];

    return participants.map((p, index) => {
      // Golden ratio angle distribution for optimal organic space filling
      const phi = (1 + Math.sqrt(5)) / 2;
      const angle = 2 * Math.PI * (index * phi);

      // Distance from center distributed organically (20% to 46% of width)
      const distNorm = Math.sqrt((index + 0.8) / (total + 0.8));
      const minRadius = 18;
      const maxRadius = 45;
      const radius = minRadius + distNorm * (maxRadius - minRadius);

      const posXPercent = Math.cos(angle) * radius * 0.95;
      const posYPercent = Math.sin(angle) * (radius * 0.72); // slightly squashed for 16:9 screens

      // Organic fluid drift offsets
      const driftX = 14 + (index % 4) * 6;
      const driftY = 12 + ((index + 2) % 4) * 5;
      const duration = 5.0 + (index % 6) * 0.8;
      const delay = (index % 8) * 0.18;

      const theme = themes[index % themes.length];

      return {
        participant: p,
        posXPercent,
        posYPercent,
        driftX,
        driftY,
        duration,
        delay,
        theme,
      };
    });
  }, [participants]);

  return (
    <div className="relative w-full min-h-[580px] sm:min-h-[660px] flex items-center justify-center overflow-hidden select-none py-6">
      {/* Dynamic Floating Participant Constellation */}
      <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center">
        {bubbleConfigs.map((cfg, idx) => {
          const p = cfg.participant;

          return (
            <motion.div
              key={p.id || idx}
              initial={{ scale: 0, opacity: 0, rotate: -25 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: 0,
                x: [
                  `calc(${cfg.posXPercent}vw - ${cfg.driftX}px)`,
                  `calc(${cfg.posXPercent}vw + ${cfg.driftX}px)`,
                  `calc(${cfg.posXPercent}vw - ${cfg.driftX * 0.5}px)`,
                  `calc(${cfg.posXPercent}vw - ${cfg.driftX}px)`,
                ],
                y: [
                  `calc(${cfg.posYPercent}vh * 0.75 - ${cfg.driftY}px)`,
                  `calc(${cfg.posYPercent}vh * 0.75 + ${cfg.driftY}px)`,
                  `calc(${cfg.posYPercent}vh * 0.75 - ${cfg.driftY * 0.6}px)`,
                  `calc(${cfg.posYPercent}vh * 0.75 - ${cfg.driftY}px)`,
                ],
              }}
              transition={{
                scale: { duration: 0.6, delay: cfg.delay, ease: 'backOut' },
                opacity: { duration: 0.5, delay: cfg.delay },
                x: {
                  duration: cfg.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: cfg.delay,
                },
                y: {
                  duration: cfg.duration * 1.15,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: cfg.delay,
                },
              }}
              className="absolute pointer-events-auto flex flex-col items-center cursor-pointer group"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* 3D Glossy Sphere Bubble */}
              <motion.div
                whileHover={{ scale: 1.18 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full p-1.5 bg-gradient-to-br ${cfg.theme.bg} shadow-2xl ${cfg.theme.glow} backdrop-blur-md flex items-center justify-center border-2 border-white/90 ring-4 ${cfg.theme.ring}/40 transition-all duration-300 group-hover:shadow-[0_0_35px_rgba(255,255,255,0.7)]`}
              >
                {/* Glossy Bubble Surface Reflection */}
                <div className="absolute top-1.5 left-2.5 w-6 sm:w-8 h-3 sm:h-4 bg-white/70 rounded-full blur-[0.6px] rotate-[-28deg] pointer-events-none" />

                {/* Avatar Photo or Stylized Initials */}
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-950/40 flex items-center justify-center border border-white/30 shadow-inner">
                  {p.avatar ? (
                    <img
                      src={p.avatar}
                      alt={p.userName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-xl sm:text-2xl md:text-3xl font-black text-white font-['Fredoka',sans-serif] tracking-tight drop-shadow-md">
                      {p.userName.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Participant Name & Sede/Place Pill (NO SCORE/POINTS) */}
              <div className="mt-1.5 flex flex-col items-center text-center max-w-[120px] sm:max-w-[150px]">
                {/* Name */}
                <span className="text-xs sm:text-sm font-extrabold text-white truncate max-w-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] font-['Fredoka',sans-serif] tracking-wide">
                  {p.userName}
                </span>

                {/* Sede / Place Badge */}
                {p.sede && (
                  <span className={`inline-flex items-center gap-1 mt-0.5 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${cfg.theme.tagBg} border border-white/20 shadow-md backdrop-blur-md`}>
                    <MapPin className="w-2.5 h-2.5 opacity-80" />
                    <span>{p.sede}</span>
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
