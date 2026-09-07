import React, { useState } from 'react';
import { motion } from 'motion/react';
import { QuizMeta } from '../types';
import { Heart, Code, X } from 'lucide-react';

interface WaitingForParticipantsViewProps {
  quizMeta: QuizMeta;
}

export const WaitingForParticipantsView: React.FC<WaitingForParticipantsViewProps> = ({
  quizMeta,
}) => {
  const [showContact, setShowContact] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center px-4 py-8 sm:py-12 select-none"
    >
      {/* DEVELOPER CREDITS HEADER */}
      <div className="mb-6 text-center">
        <p className="text-slate-300 text-sm sm:text-base font-medium flex items-center justify-center gap-1.5">
          Desarrollado con ❤️ por 
          <button
            onClick={() => setShowContact(!showContact)}
            className="cursor-pointer text-red-500 hover:text-red-400 font-bold underline decoration-dashed underline-offset-2 transition-colors ml-1"
          >
            codezardi
          </button>
        </p>

        {showContact && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
              
              <button
                onClick={() => setShowContact(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white mb-4 shadow-lg shadow-indigo-500/30">
                  <Code className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
                  codezardi
                </h3>
                <p className="text-indigo-300 font-medium mb-6">
                  Desarrollo de sistemas a medida
                </p>

                <div className="space-y-3">
                  <a
                    href="mailto:codezardi@example.com"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center text-cyan-400">
                      <span className="text-lg">✉️</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-xs text-slate-400 uppercase font-bold">Email</p>
                      <p className="text-sm sm:text-base text-white font-medium">codezardi@example.com</p>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/584120000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-green-500/50 hover:bg-slate-800 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center text-green-400">
                      <span className="text-lg">📱</span>
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-xs text-slate-400 uppercase font-bold">WhatsApp</p>
                      <p className="text-sm sm:text-base text-white font-medium">+58 412-000-0000</p>
                    </div>
                  </a>
                </div>

                <p className="mt-6 text-xs text-slate-500">
                  ¿Necesitas un sistema a medida? Escríbeanos.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

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
