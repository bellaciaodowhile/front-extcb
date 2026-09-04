import React from 'react';
import { HelpCircle, Award } from 'lucide-react';
import { QuizMeta } from '../types';

interface FloatingQuizStatsProps {
  quizMeta: QuizMeta;
}

export const FloatingQuizStats: React.FC<FloatingQuizStatsProps> = ({ quizMeta }) => {
  return (
    <div className="fixed top-2.5 right-2.5 sm:top-3.5 sm:right-4 z-30 flex items-center gap-1.5 sm:gap-2.5 select-none pointer-events-auto">
      {/* Card 1: Total Preguntas */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md text-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg shadow-indigo-950/20 transition-all hover:scale-105">
        <div className="w-6 h-6 rounded-lg bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
          <HelpCircle className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Preguntas
          </span>
          <span className="text-xs sm:text-sm font-black text-emerald-400 font-['Fredoka',sans-serif]">
            {quizMeta.preguntas || 20}
          </span>
        </div>
      </div>

      {/* Card 2: Punteo Máximo */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md text-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg shadow-indigo-950/20 transition-all hover:scale-105">
        <div className="w-6 h-6 rounded-lg bg-amber-500/30 border border-amber-400/40 flex items-center justify-center text-amber-300">
          <Award className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Punteo
          </span>
          <span className="text-xs sm:text-sm font-black text-amber-300 font-['Fredoka',sans-serif]">
            {quizMeta.punteo || 250} <span className="text-[9px] font-bold text-amber-200/80">pts</span>
          </span>
        </div>
      </div>
    </div>
  );
};

