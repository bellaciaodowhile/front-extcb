import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Participant } from '../types';
import { MapPin, Sparkles, Flame, Crown } from 'lucide-react';

interface SuspenseCardsStreamViewProps {
  participants: Participant[];
}

export const SuspenseCardsStreamView: React.FC<SuspenseCardsStreamViewProps> = ({
  participants,
}) => {
  const [highlightIndex, setHighlightIndex] = useState(0);

  // Cycle the featured spotlight card every 2.4 seconds
  useEffect(() => {
    if (participants.length <= 1) return;
    const timer = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % participants.length);
    }, 2400);
    return () => clearInterval(timer);
  }, [participants.length]);

  if (participants.length === 0) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center text-white">
        <p className="font-['Fredoka',sans-serif] text-slate-200">No hay participantes disponibles.</p>
      </div>
    );
  }

  const currentFeatured = participants[highlightIndex] || participants[0];

  // Duplicate arrays to create infinite seamless horizontal slider effect
  const repeatedParticipants = [...participants, ...participants, ...participants, ...participants];

  return (
    <div className="relative w-full max-w-6xl mx-auto py-1 sm:py-2 flex flex-col items-center select-none overflow-hidden">
      {/* 1. SLIDER SUPERIOR: Cuadritos Blancos (Square Cards) que se desplazan de derecha a izquierda */}
      <div className="w-full overflow-hidden relative py-1 mb-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{
            x: {
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
          className="flex items-center gap-3.5 w-max"
        >
          {repeatedParticipants.map((p, idx) => (
            <motion.div
              key={`sq-card-${p.id}-${idx}`}
              whileHover={{ scale: 1.08, y: -4 }}
              className="w-28 sm:w-32 h-28 sm:h-32 rounded-2xl bg-white/95 backdrop-blur-md border border-white/80 shadow-lg shadow-indigo-950/15 p-2.5 flex flex-col items-center justify-between text-center relative overflow-hidden group cursor-pointer transition-all duration-300"
            >
              {/* Subtle top gloss shine */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-amber-400 opacity-80" />

              {/* Avatar Photo / Initials */}
              <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-xl overflow-hidden bg-slate-100 border-2 border-indigo-200 shadow-inner flex items-center justify-center flex-shrink-0">
                {p.avatar ? (
                  <img
                    src={p.avatar}
                    alt={p.userName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-base sm:text-lg font-black text-indigo-600 font-['Fredoka',sans-serif]">
                    {p.userName.slice(0, 2).toUpperCase()}
                  </span>
                )}
                {/* Mini Live Ping */}
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>

              {/* Name and Sede */}
              <div className="w-full flex flex-col items-center">
                <h5 className="text-[11px] sm:text-xs font-black text-slate-800 truncate max-w-full font-['Fredoka',sans-serif]">
                  {p.userName}
                </h5>
                {p.sede ? (
                  <span className="text-[9px] font-bold text-slate-500 truncate max-w-full flex items-center gap-0.5 mt-0.5">
                    <MapPin className="w-2 h-2 text-indigo-500" />
                    {p.sede}
                  </span>
                ) : (
                  <span className="text-[9px] font-medium text-slate-400">En juego</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 2. CARD CENTRAL BLANCA CON EL "1" GRANDOTE SOBRESALIENDO Y TROFEO DESTACADO (MÁS ALTA Y PROMINENTE) */}
      <div className="w-full max-w-xl my-2 sm:my-4 px-4 pt-7 sm:pt-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`featured-${currentFeatured.id}`}
            initial={{ scale: 0.88, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: -15 }}
            transition={{ type: 'spring', damping: 18, stiffness: 260 }}
            className="relative rounded-3xl min-h-[160px] sm:min-h-[200px] py-7 sm:py-9 px-6 sm:px-8 bg-white/95 border-2 border-amber-300 shadow-[0_20px_60px_rgba(0,0,0,0.28)] flex items-center justify-between gap-4 sm:gap-6 backdrop-blur-xl"
          >
            {/* 🌟 NÚMERO "1" GRANDOTE SOBRESALIENDO DE LA CARD 🌟 */}
            <motion.div
              initial={{ scale: 0, rotate: -20, y: -20 }}
              animate={{ scale: 1, rotate: -6, y: -42 }}
              transition={{ type: 'spring', stiffness: 350, damping: 16 }}
              className="absolute -top-4 -left-3 sm:-left-5 z-20 flex items-center justify-center select-none pointer-events-none"
            >
              <div className="relative flex items-center justify-center">
                {/* 3D Giant 1 Number Badge with Drop Shadows */}
                <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-slate-950 flex flex-col items-center justify-center font-['Fredoka',sans-serif] shadow-[0_12px_28px_rgba(245,158,11,0.6)] border-3 border-white ring-4 ring-amber-400/40">
                  <span className="text-4xl sm:text-5xl font-black leading-none drop-shadow-sm">
                    1
                  </span>
                  <div className="absolute -bottom-2.5 px-2.5 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[9px] font-black tracking-wider uppercase shadow-md">
                    #1 TOP
                  </div>
                </div>

                {/* Sparkling icon on top of the 1 */}
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -top-2.5 -right-2.5 text-amber-400"
                >
                  <Sparkles className="w-6 h-6 fill-amber-300" />
                </motion.div>
              </div>
            </motion.div>

            {/* Avatar with Golden Ring */}
            <div className="relative flex-shrink-0 pl-12 sm:pl-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-3 border-amber-400 shadow-xl bg-slate-100 flex items-center justify-center">
                {currentFeatured.avatar ? (
                  <img
                    src={currentFeatured.avatar}
                    alt={currentFeatured.userName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl font-black text-amber-600 font-['Fredoka',sans-serif]">
                    {currentFeatured.userName.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-slate-950" />
                <span>ACTIVO</span>
              </div>
            </div>

            {/* Details: Posible Ganador, Name, Sede */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80 text-xs sm:text-[13px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  Posible Ganador
                </span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight truncate font-['Fredoka',sans-serif]">
                {currentFeatured.userName}
              </h3>
              {currentFeatured.sede && (
                <p className="text-xs sm:text-base font-bold text-slate-600 flex items-center gap-1.5 mt-1 truncate">
                  <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  {currentFeatured.sede}
                </p>
              )}
            </div>

            {/* Corona Dorada en la Card */}
            <div className="flex flex-col items-center justify-center pl-1 flex-shrink-0">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  rotate: [-6, 6, -6],
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex items-center justify-center p-3 sm:p-4 rounded-2xl bg-amber-400/20 border border-amber-400/40 shadow-inner"
                title="Candidato a la Corona"
              >
                <Crown className="w-9 h-9 sm:w-11 sm:h-11 fill-amber-400 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. SLIDER INFERIOR: Cards Blancas Largas en movimiento continuo en dirección opuesta */}
      <div className="w-full overflow-hidden relative py-1 mt-1 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <motion.div
          animate={{ x: [-1200, 0] }}
          transition={{
            x: {
              duration: 28,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
          className="flex items-center gap-3.5 w-max"
        >
          {repeatedParticipants.map((p, idx) => (
            <motion.div
              key={`long-card-${p.id}-${idx}`}
              whileHover={{ scale: 1.05, y: -2 }}
              className="w-56 sm:w-64 h-16 sm:h-18 rounded-2xl bg-white/95 border border-white/80 shadow-md shadow-indigo-950/10 p-2.5 flex items-center gap-3 backdrop-blur-md flex-shrink-0 cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-slate-100 border border-indigo-200 flex items-center justify-center flex-shrink-0">
                {p.avatar ? (
                  <img
                    src={p.avatar}
                    alt={p.userName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-sm font-black text-indigo-600 font-['Fredoka',sans-serif]">
                    {p.userName.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h6 className="text-xs sm:text-sm font-extrabold text-slate-800 truncate font-['Fredoka',sans-serif]">
                  {p.userName}
                </h6>
                <div className="flex items-center gap-2 mt-0.5">
                  {p.sede ? (
                    <span className="text-[10px] font-bold text-slate-500 truncate flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5 text-indigo-500" />
                      {p.sede}
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400">Participante</span>
                  )}
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-600 font-bold border border-indigo-100">
                    En juego
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
