import React from 'react';
import { motion } from 'motion/react';
import { QuizMeta } from '../types';

interface WaitingForParticipantsViewProps {
  quizMeta: QuizMeta;
}

export const WaitingForParticipantsView: React.FC<WaitingForParticipantsViewProps> = ({
  quizMeta,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center px-4 py-8 sm:py-16 select-none"
    >
      {/* 🏆 GRANDE: ESPERANDO PARTICIPANTES 🏆 */}
      <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white font-['Fredoka',sans-serif] drop-shadow-[0_8px_32px_rgba(0,0,0,0.85)] leading-tight mb-8 sm:mb-12">
        Esperando participantes
      </h1>

      {/* 📋 SOLO NIVELES, PREGUNTAS Y PUNTEO MÁX 📋 */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {/* Niveles */}
        <div className="flex flex-col items-center justify-center px-6 sm:px-9 py-4 sm:py-6 rounded-3xl bg-slate-900/85 border border-indigo-400/40 shadow-2xl backdrop-blur-md min-w-[140px] sm:min-w-[180px]">
          <span className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider mb-1">
            Niveles
          </span>
          <span className="text-3xl sm:text-5xl font-black text-amber-300 font-mono tracking-tight">
            {quizMeta.niveles || '1'}
          </span>
        </div>

        {/* Preguntas */}
        <div className="flex flex-col items-center justify-center px-6 sm:px-9 py-4 sm:py-6 rounded-3xl bg-slate-900/85 border border-cyan-400/40 shadow-2xl backdrop-blur-md min-w-[140px] sm:min-w-[180px]">
          <span className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider mb-1">
            Preguntas
          </span>
          <span className="text-3xl sm:text-5xl font-black text-cyan-300 font-mono tracking-tight">
            {quizMeta.preguntas || 20}
          </span>
        </div>

        {/* Punteo Máximo */}
        <div className="flex flex-col items-center justify-center px-6 sm:px-9 py-4 sm:py-6 rounded-3xl bg-slate-900/85 border border-emerald-400/40 shadow-2xl backdrop-blur-md min-w-[140px] sm:min-w-[180px]">
          <span className="text-xs sm:text-sm text-slate-300 font-bold uppercase tracking-wider mb-1">
            Punteo Máx
          </span>
          <span className="text-3xl sm:text-5xl font-black text-emerald-300 font-mono tracking-tight">
            {quizMeta.punteo || 250}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
