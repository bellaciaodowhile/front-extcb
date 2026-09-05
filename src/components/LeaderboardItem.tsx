import React from 'react';
import { motion } from 'motion/react';
import { Check, Clock, HelpCircle, Loader2 } from 'lucide-react';
import { Participant } from '../types';

interface LeaderboardItemProps {
  participant: Participant;
  isCurrentUser?: boolean;
}

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  participant,
  isCurrentUser = false,
}) => {
  const isFinished = participant.status === 'finished';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, rotateX: 45, y: 15 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, rotateX: -45, y: -15 }}
      transition={{
        layout: { type: 'spring', stiffness: 320, damping: 24 },
        rotateX: { type: 'spring', stiffness: 260, damping: 22 },
        opacity: { duration: 0.25 },
      }}
      style={{ perspective: 800 }}
      className={`group relative flex items-center justify-between p-2.5 sm:p-3.5 pl-3 sm:pl-4 rounded-2xl transition-all duration-200 ml-3 sm:ml-5 select-none ${
        !isFinished
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : isCurrentUser
          ? 'bg-indigo-50/95 shadow-md ring-2 ring-indigo-200'
          : 'bg-white/95 backdrop-blur-md shadow-sm'
      }`}
    >
      {/* Left side: Big Overhanging / Protruding Rank Number + User details */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
        {/* Large Overhanging Solid Rank Badge (No gradient) */}
        <div className="-ml-6 sm:-ml-8 flex flex-col items-center justify-center flex-shrink-0 z-10">
          <motion.div
            key={`badge-rank-${participant.rank}-${participant.status}`}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl ${
              !isFinished
                ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-200'
                : 'bg-[#0f172a] text-white shadow-xl shadow-slate-900/40 ring-2 ring-slate-700/60'
            } flex flex-col items-center justify-center`}
          >
            <span className="text-2xl sm:text-3xl md:text-4xl font-black font-['Fredoka',sans-serif] tracking-tight leading-none drop-shadow-md">
              {participant.rank}
            </span>
          </motion.div>
        </div>

        {/* User Info & Sede */}
        <div className="min-w-0 flex-1 pr-1 sm:pr-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-slate-800 truncate font-['Fredoka',sans-serif]">
              {participant.userName}
            </h3>

            {/* Clean status badge: Finalizado when ready, and simple subtle spinner when responding */}
            {isFinished ? (
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shadow-xs">
                <Check className="w-2.5 h-2.5 stroke-[3]" /> Finalizado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full shadow-xs">
                <Loader2 className="w-2.5 h-2.5 animate-spin text-blue-600" /> Respondiendo...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="px-2 py-0.2 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] sm:text-xs uppercase tracking-wide">
              {participant.sede}
            </span>

            {/* Avance tag in blue */}
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.2 rounded-md">
              <HelpCircle className="w-3 h-3 text-blue-600" />
              <span>{(participant as any).rawAvance || participant.avance}/{participant.totalQuestions || 20}</span>
            </div>
          </div>
        </div>
      </div>

        {/* Time & Correctas Badge */}
        <div className="flex flex-col items-end">
          <div className="flex flex-col items-end gap-1">
            {/* High-Contrast Standout Time Badge */}
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-0.5">
                <Clock className="w-3 h-3 text-indigo-500" /> Tiempo
              </span>
              <div className="bg-slate-950 text-amber-300 px-2 sm:px-2.5 py-0.5 rounded-lg shadow-inner mt-0.5 flex items-center gap-1">
                <span className="text-xs sm:text-sm font-mono font-black tracking-wide">
                  {participant.tiempo}
                </span>
              </div>
            </div>

            {/* Correctas Badge - below time */}
            <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300/50 px-2.5 py-0.3 rounded font-extrabold text-xs sm:text-sm shadow-xs backdrop-blur-sm">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{participant.correctas} correctas</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center text-[#0f172a] px-2.5 py-0.3 font-extrabold font-['Fredoka',sans-serif]">
          <span className="text-4xl">{participant.puntos}</span>
          <span className="text-md"> PTS</span>
        </div>
    </motion.div>
  );
};


