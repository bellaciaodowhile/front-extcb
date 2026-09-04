import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Check, Loader2, Clock, Sparkles, RotateCcw, ArrowRight, X, MapPin, Trophy } from 'lucide-react';
import { Participant } from '../types';
import { soundEffects } from '../utils/audio';
import { formatLocationZone } from './HorizontalScoreBarsView';

interface PodiumProps {
  topParticipants: Participant[];
  isCeremonyMode?: boolean;
  ceremonyStep?: number;
  ceremonyStartRank?: number; // Starting rank (e.g. 5, 4, 3)
  onNextCeremonyStep?: () => void;
  onRestartCeremony?: () => void;
  onExitCeremony?: () => void;
}

// Helper to format grand ranks: 5to, 4to, 3ro, 2do, 1ro
const getRankGrandote = (rank: number) => {
  if (rank === 1) return { short: '1ro', label: '1er LUGAR', title: '👑 ¡GRAN CAMPEÓN DEL TORNEO!' };
  if (rank === 2) return { short: '2do', label: '2do LUGAR', title: '🥈 ¡SUBCAMPEÓN DEL TORNEO!' };
  if (rank === 3) return { short: '3ro', label: '3er LUGAR', title: '🥉 ¡3er LUGAR EN EL PODIO!' };
  if (rank === 4) return { short: '4to', label: '4to LUGAR', title: '🎖️ ¡4to LUGAR DE HONOR!' };
  if (rank === 5) return { short: '5to', label: '5to LUGAR', title: '🎖️ ¡5to LUGAR DE HONOR!' };
  if (rank === 6) return { short: '6to', label: '6to LUGAR', title: '🎖️ ¡6to LUGAR DE HONOR!' };
  return { short: `${rank}to`, label: `${rank}º LUGAR`, title: `¡PUESTO #${rank} REVELADO!` };
};

// Helper to format names with first name regular and last name bold
const formatNameParts = (fullName: string) => {
  const clean = fullName.trim();
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return { firstName: '', lastName: parts[0].toUpperCase() };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ').toUpperCase() };
};

export const Podium: React.FC<PodiumProps> = ({
  topParticipants,
  isCeremonyMode = false,
  ceremonyStep = 3,
  ceremonyStartRank = 3,
  onNextCeremonyStep,
  onRestartCeremony,
  onExitCeremony,
}) => {
  const first = topParticipants[0];
  const second = topParticipants[1];
  const third = topParticipants[2];

  const effectiveStartRank = Math.max(3, ceremonyStartRank || 3);
  const [isPreparingFirst, setIsPreparingFirst] = useState(false);
  const [countdownNum, setCountdownNum] = useState<number | string>(3);

  // Spotlight animation state: shows the grand 5to/4to/3ro/etc. overlay before settling into the list
  const [spotlightData, setSpotlightData] = useState<{
    participant: Participant;
    rank: number;
  } | null>(null);
  const [isSpotlightVisible, setIsSpotlightVisible] = useState(false);

  // Confetti helper
  const triggerConfetti = (isGrand: boolean = false) => {
    if (typeof window === 'undefined') return;
  };

  // Sound effects, confetti & Grandote Spotlight on ceremonyStep transition
  useEffect(() => {
    if (!isCeremonyMode) return;
    
    const currentRevealedRank = ceremonyStep > 0 && ceremonyStep <= effectiveStartRank
      ? effectiveStartRank - ceremonyStep + 1
      : null;

    // Only update spotlight if rank actually changed
    if (currentRevealedRank && (!spotlightData || spotlightData.rank !== currentRevealedRank)) {
      const participant = topParticipants[currentRevealedRank - 1];
      if (participant) {
        console.log(`CurrentReveal: ${currentRevealedRank} - Participant: ${participant}`)
        setSpotlightData({ participant, rank: currentRevealedRank });
        setIsSpotlightVisible(true);

        if (currentRevealedRank === 1) {
          soundEffects.playGrandVictory();
        } else {
          soundEffects.playFanfareStep(currentRevealedRank);
        }
      }
    } else if (!currentRevealedRank && isSpotlightVisible) {
      setIsSpotlightVisible(false);
    }
  }, [ceremonyStep, isCeremonyMode, effectiveStartRank, topParticipants]);

  // Handle dismissing spotlight manually to immediately see position in list
  const handleDismissSpotlight = () => {
    setIsSpotlightVisible(false);
  };

  // Handle revealing the 1st place with high-suspense preparation animation
  const handleRevealFirstPlace = () => {
    if (isPreparingFirst) return;

    setIsPreparingFirst(true);
    setCountdownNum(3);
    soundEffects.playDrumrollSuspense(2.6);

    // Preparation countdown beats
    setTimeout(() => {
      setCountdownNum(2);
    }, 800);

    setTimeout(() => {
      setCountdownNum(1);
    }, 1600);

    setTimeout(() => {
      setCountdownNum('👑');
    }, 2300);

    setTimeout(() => {
      setIsPreparingFirst(false);
      // Show spotlight for 1st place before incrementing ceremonyStep
      setSpotlightData({ participant: first, rank: 1 });
      setIsSpotlightVisible(true);
      soundEffects.playGrandVictory();
      // Note: onNextCeremonyStep is NOT called here to prevent spotlight from hiding immediately
      // It will be called when user clicks "Ver podio" button to dismiss spotlight
    }, 2700);
    return;
  };

  if (!first) return null;

  // Reveal calculation based on effectiveStartRank
  // Note: When ceremonyStep > effectiveStartRank, all positions are revealed
  const isFirstRevealed = !isCeremonyMode || ceremonyStep > effectiveStartRank;
  const isSecondRevealed = !isCeremonyMode || ceremonyStep >= effectiveStartRank - 1;
  const isThirdRevealed = !isCeremonyMode || ceremonyStep >= effectiveStartRank - 2;

  // Extra positions for start rank > 3 (e.g. 4th, 5th...)
  const extraParticipants =
    isCeremonyMode && effectiveStartRank > 3
      ? topParticipants.slice(3, effectiveStartRank)
      : [];

  const isNextLastStep = ceremonyStep === effectiveStartRank - 1; // revealing 1st next
  const isFinishedAll = ceremonyStep > effectiveStartRank;
  const nextRankToReveal = effectiveStartRank - ceremonyStep + 1;

  // Currently revealed rank number (or null if not in ceremony or ceremony finished)
  const justRevealedRank =
    ceremonyStep > 0 && ceremonyStep <= effectiveStartRank
      ? effectiveStartRank - ceremonyStep + 1
      : null;

  return (
    <div
      className={`relative w-full ${
        isCeremonyMode ? 'max-w-4xl py-1' : 'max-w-2xl py-1'
      } mx-auto px-1 sm:px-2 flex flex-col items-center select-none`}
    >
      {/* 🌟 GRANDOTE SPOTLIGHT OVERLAY (Appears directly over the connections background, with NO card and NO italics) 🌟 */}
      <AnimatePresence>
        {isSpotlightVisible && spotlightData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismissSpotlight}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 pointer-events-auto cursor-pointer bg-slate-950/75 backdrop-blur-md"
          >
            {/* Center Celebration Content - Animated with mode="wait" so each rank transition is dramatic & notable */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`spotlight-card-rank-${spotlightData.rank}-${spotlightData.participant.id}`}
                initial={{ scale: 0.15, y: 70, opacity: 0, rotate: -6 }}
                animate={{ scale: [0.15, 1.08, 0.98, 1], y: 0, opacity: 1, rotate: 0 }}
                exit={{
                  scale: 0.2,
                  y: -90,
                  opacity: 0,
                  rotate: 6,
                  transition: { duration: 0.26, ease: 'easeIn' },
                }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl flex flex-col items-center text-center cursor-default select-none px-4 py-2"
              >
                {/* Visual Shockwave Burst Behind Every Rank Reveal */}
                <motion.div
                  key={`burst-${spotlightData.rank}`}
                  initial={{ scale: 0.2, opacity: 1 }}
                  animate={{ scale: [0.2, 1.4, 2.3], opacity: [1, 0.75, 0] }}
                  transition={{ duration: 0.75, ease: 'easeOut' }}
                  className="absolute top-16 sm:top-20 w-44 h-44 sm:w-60 sm:h-60 rounded-full border-4 border-amber-400/90 pointer-events-none shadow-[0_0_30px_rgba(251,191,36,0.6)]"
                />

                {/* Golden Flash Aura */}
                <motion.div
                  key={`aura-${spotlightData.rank}`}
                  initial={{ opacity: 0.9, scale: 0.3 }}
                  animate={{ opacity: 0, scale: 2.2 }}
                  transition={{ duration: 0.65 }}
                  className="absolute top-16 sm:top-20 w-48 h-48 sm:w-64 sm:h-64 bg-amber-400/35 blur-3xl rounded-full pointer-events-none"
                />

                {/* Title Header */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                  className="flex items-center gap-2 mb-1"
                >
                  <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                  <span className="text-sm sm:text-base font-black tracking-widest uppercase text-amber-300 font-['Fredoka',sans-serif] drop-shadow-md">
                    {getRankGrandote(spotlightData.rank).title}
                  </span>
                  <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
                </motion.div>

                {/* 🏆 GRANDOTE RANK BADGE (5to, 4to, etc. ENORME, SIN CARD, CON TRANSICIÓN NOTABLE) 🏆 */}
                <motion.div
                  key={`badge-${spotlightData.rank}`}
                  initial={{ scale: 0.15, rotate: -15 }}
                  animate={{ scale: [0.15, 1.28, 0.95, 1], rotate: [-15, 4, -1, 0] }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="my-1 sm:my-2 relative flex items-center justify-center"
                >
                  <span className="text-8xl sm:text-9xl md:text-[11rem] font-black tracking-tight text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)] font-['Fredoka',sans-serif] leading-none">
                    {getRankGrandote(spotlightData.rank).short}
                  </span>
                </motion.div>

                {/* Sub-label */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.12 }}
                  className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-200 drop-shadow-sm mb-2"
                >
                  {getRankGrandote(spotlightData.rank).label}
                </motion.span>

                {/* Participant Name */}
                {(() => {
                  const { firstName, lastName } = formatNameParts(spotlightData.participant.userName);
                  return (
                    <motion.div
                      key={`name-${spotlightData.rank}`}
                      initial={{ y: 25, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.15, duration: 0.35 }}
                      className="flex flex-col items-center mb-3"
                    >
                      {firstName && (
                        <span className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-300 drop-shadow-sm">
                          {firstName}
                        </span>
                      )}
                      <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] font-['Fredoka',sans-serif] leading-tight">
                        {lastName}
                      </h2>
                    </motion.div>
                  );
                })()}

                {/* Zone and Status Badges */}
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap items-center justify-center gap-2 mb-4"
                >
                  <span className="px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-400/60 text-cyan-300 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <span>{formatLocationZone(spotlightData.participant.sede, spotlightData.rank - 1)}</span>
                  </span>

                  <span className="px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-200 font-mono text-xs sm:text-sm font-bold shadow-lg backdrop-blur-md">
                    {(spotlightData.participant as any).rawAvance || spotlightData.participant.avance}/{spotlightData.participant.totalQuestions || 20} PREG.
                  </span>
                </motion.div>

                {/* Score & Official Time Badges */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="flex flex-wrap items-center justify-center gap-3 pt-2"
                >
                  <div className="flex items-baseline gap-1 bg-amber-400 text-slate-950 px-4 py-1.5 rounded-full font-mono font-black text-xl sm:text-2xl shadow-xl">
                    <span>{spotlightData.participant.puntos.toLocaleString()}</span>
                    <span className="text-xs font-bold uppercase">PTS</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-950/95 text-cyan-300 border border-cyan-400/80 px-4 py-1.5 rounded-full font-mono font-black text-sm sm:text-base shadow-xl">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span>TIEMPO: {spotlightData.participant.tiempo}</span>
                  </div>

                  {/* Correctas Badge */}
                  <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300/50 px-3 py-1.5 rounded-full font-extrabold text-sm sm:text-base shadow-xs backdrop-blur-sm">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{spotlightData.participant.correctas} correctas</span>
                  </div>
                </motion.div>

                {/* Action Buttons: Stays until user explicitly decides to reveal next or view podium */}
                {spotlightData.rank > 1 ? (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 flex flex-wrap items-center justify-center gap-3"
                  >
                    {spotlightData.rank - 1 === 1 ? (
                      <button
                        onClick={() => {
                          setIsSpotlightVisible(false);
                          handleRevealFirstPlace();
                        }}
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-sm sm:text-base shadow-[0_6px_24px_rgba(245,158,11,0.5)] flex items-center gap-2 cursor-pointer active:scale-95 transition-all animate-bounce"
                      >
                        <Crown className="w-5 h-5 fill-slate-950 stroke-slate-950" />
                        <span>👑 Revelar 1º Lugar (Gran Campeón)</span>
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onNextCeremonyStep?.();
                        }}
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-sm sm:text-base shadow-[0_6px_24px_rgba(245,158,11,0.5)] flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                      >
                        <span>Revelar siguiente: {spotlightData.rank - 1}º Lugar</span>
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                      </button>
                    )}

                    <button
                      onClick={handleDismissSpotlight}
                      className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-white/30 shadow-lg"
                    >
                      <span>Ver podio</span>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 flex flex-wrap items-center justify-center gap-3"
                  >
                    <button
                      onClick={() => {
                        setIsSpotlightVisible(false);
                        onNextCeremonyStep?.();
                      }}
                      className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-sm sm:text-base shadow-[0_6px_24px_rgba(245,158,11,0.5)] flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                    >
                      <Trophy className="w-5 h-5 fill-slate-950 stroke-slate-950" />
                      <span>Ver podio completo con ganadores</span>
                    </button>
                    <button
                      onClick={() => {}}
                      className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-white/30 shadow-lg"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Celebrar de nuevo</span>
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🏛️ ESTRUCTURA DEL PODIO (Se oculta completamente cuando se revela un ganador para no verse feo detrás) 🏛️ */}
      <div
        className={`w-full flex flex-col items-center transition-all duration-300 ${
          isSpotlightVisible
            ? 'opacity-0 invisible pointer-events-none h-0 overflow-hidden'
            : 'opacity-100 visible'
        }`}
      >

      {/* 🏆 CEREMONY MODE CONTROLS (Pills & Exit) 🏆 */}
      {isCeremonyMode && (
        <div className="w-full flex flex-col items-center gap-1.5 px-2 sm:px-4 mb-2">
          <div className="w-full flex flex-wrap items-center justify-between gap-2">
            {/* Dynamic Status Step Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
              {Array.from({ length: effectiveStartRank }, (_, i) => {
                const rank = effectiveStartRank - i; // e.g. 5, 4, 3, 2, 1
                const stepRequired = i + 1;
                const isRevealed = ceremonyStep >= stepRequired;
                const isCurrentlyPreparing = rank === 1 && isPreparingFirst;
                const isCurrentStep = justRevealedRank === rank;

                let label = `${rank}º Lugar`;
                if (rank === 1) label = '👑 1º Lugar';
                else if (rank === 2) label = '🥈 2º Lugar';
                else if (rank === 3) label = '🥉 3º Lugar';
                else if (rank === 4) label = '🎖️ 4º Lugar';
                else if (rank === 5) label = '🎖️ 5º Lugar';

                return (
                  <span
                    key={`step-pill-${rank}`}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black transition-all ${
                      isRevealed
                        ? rank === 1
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-md ring-2 ring-amber-200 animate-pulse'
                          : rank === 2
                          ? 'bg-slate-300 text-slate-950 shadow-xs ring-1 ring-white'
                          : rank === 3
                          ? 'bg-amber-600/90 text-white shadow-xs ring-1 ring-amber-300'
                          : 'bg-indigo-600 text-white shadow-xs ring-1 ring-indigo-300'
                        : isCurrentlyPreparing
                        ? 'bg-amber-400 text-slate-950 font-black animate-bounce ring-2 ring-white'
                        : 'bg-white/20 text-slate-300'
                    } ${isCurrentStep ? 'ring-2 ring-amber-400 scale-105' : ''}`}
                  >
                    {label}
                  </span>
                );
              })}
            </div>

            {/* Exit Button */}
            {onExitCeremony && (
              <button
                onClick={onExitCeremony}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                title="Salir y ver toda la tabla"
              >
                <X className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Ver tabla</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 🏛️ PODIUM PILLARS (Optimized Compact Height so everything fits on one screen) 🏛️ */}
      <div className="w-full flex items-end justify-center gap-2 sm:gap-4 md:gap-5 min-h-[220px] sm:min-h-[260px]">
        {/* 2nd Place (Left) */}
        {second ? (
          <PodiumPillar
            key={`pillar-2`}
            participant={second}
            rank={2}
            heightClass={isCeremonyMode ? 'h-28 sm:h-34 md:h-40' : 'h-36 sm:h-44 md:h-52'}
            pillarGradient="bg-gradient-to-b from-[#8f9df8] via-[#7d8cf5] to-[#6d7df0]"
            topCapGradient="bg-[#a5b2fc]"
            sideShadow="shadow-[0_12px_24px_rgba(79,70,229,0.28)]"
            badgeBg="bg-white/95 text-slate-800 shadow-lg"
            isRevealed={isSecondRevealed}
            isCeremonyMode={isCeremonyMode}
            isHighlight={justRevealedRank === 2}
          />
        ) : (
          <div className="w-24 sm:w-32 md:w-40 h-28 opacity-25 flex items-center justify-center text-xs text-white">
            Vacante
          </div>
        )}

        {/* 1st Place (Center - Highest) with Preparation Animation (No heavy shadows) */}
        <PodiumPillar
          key={`pillar-1`}
          participant={first}
          rank={1}
          heightClass={isCeremonyMode ? 'h-36 sm:h-44 md:h-52' : 'h-48 sm:h-60 md:h-70'}
          pillarGradient="bg-gradient-to-b from-[#99a6fb] via-[#8594f8] to-[#7182f3]"
          topCapGradient="bg-[#c7d2fe]"
          sideShadow=""
          badgeBg="bg-white text-slate-900 shadow-md"
          isFirst
          isRevealed={isFirstRevealed}
          isCeremonyMode={isCeremonyMode}
          isPreparing={isPreparingFirst}
          countdownNum={countdownNum}
          isHighlight={justRevealedRank === 1}
        />

        {/* 3rd Place (Right) */}
        {third ? (
          <PodiumPillar
            key={`pillar-3`}
            participant={third}
            rank={3}
            heightClass={isCeremonyMode ? 'h-22 sm:h-28 md:h-32' : 'h-26 sm:h-34 md:h-40'}
            pillarGradient="bg-gradient-to-b from-[#8593f5] via-[#7382ee] to-[#6372e8]"
            topCapGradient="bg-[#93a1f8]"
            sideShadow="shadow-[0_10px_20px_rgba(79,70,229,0.22)]"
            badgeBg="bg-white/95 text-slate-800 shadow-lg"
            isRevealed={isThirdRevealed}
            isCeremonyMode={isCeremonyMode}
            isHighlight={justRevealedRank === 3}
          />
        ) : (
          <div className="w-24 sm:w-32 md:w-40 h-22 opacity-25 flex items-center justify-center text-xs text-white">
            Vacante
          </div>
        )}
      </div>

      {/* 🎖️ POSICIONES DE HONOR ADICIONALES (4º, 5º Lugar, etc.) COMPACTAS EN LA MISMA PANTALLA 🎖️ */}
      {isCeremonyMode && extraParticipants.length > 0 && (
        <div className="w-full mt-2 pt-2 border-t border-white/15 flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 w-full">
            {extraParticipants.map((p, idx) => {
              const rank = idx + 4;
              const stepRequired = effectiveStartRank - rank + 1;
              const isRevealed = ceremonyStep >= stepRequired;
              const isJustRevealed = justRevealedRank === rank;
              const zone = formatLocationZone(p.sede, rank - 1);

              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: isJustRevealed ? 1.04 : 1,
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-md transition-all duration-300 shadow-xs ${
                    isRevealed
                      ? isJustRevealed
                        ? 'bg-white text-slate-950 border-2 border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/30'
                        : 'bg-white/90 text-slate-900 border border-white/60 ring-1 ring-white/30'
                      : 'bg-white/10 text-white/60 border border-white/15'
                  }`}
                >
                  {isRevealed ? (
                    <>
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-black flex items-center justify-center text-2xl font-['Fredoka',sans-serif] shadow-xs">
                        #{rank}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-extrabold text-xs text-slate-900 font-['Fredoka',sans-serif] truncate max-w-[120px]">
                          {p.userName}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-medium">
                          <span className="bg-slate-100 px-1 py-0.2 rounded font-bold uppercase text-slate-700">
                            {zone}
                          </span>
                          <span className="font-bold text-amber-600 font-mono">
                            {p.puntos} pts
                          </span>
                          <span className="flex items-center gap-0.5 bg-slate-900 text-cyan-300 px-1.5 py-0.2 rounded font-mono font-bold text-[9px]">
                            <Clock className="w-2.5 h-2.5 text-amber-400" />
                            {p.tiempo}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5 py-0.5 px-1">
                      <div className="w-6 h-6 rounded-lg bg-white/15 text-white/60 font-black flex items-center justify-center text-2xl font-['Fredoka',sans-serif] animate-pulse">
                        ?
                      </div>
                      <span className="text-[11px] font-bold text-white/70">
                        {rank}º Lugar
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 🌟 ACTION BUTTONS (Clean, Centered, No Scroll) 🌟 */}
      {isCeremonyMode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex flex-wrap items-center justify-center gap-2.5"
        >
          {!isNextLastStep && !isFinishedAll && onNextCeremonyStep && (
            <button
              onClick={onNextCeremonyStep}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs sm:text-sm shadow-[0_4px_16px_rgba(245,158,11,0.4)] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <span>
                {ceremonyStep === 0
                  ? `Comenzar Revelación (Puesto #${effectiveStartRank})`
                  : `Revelar ${nextRankToReveal}º Lugar`}
              </span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}

          {isNextLastStep && (
            <button
              onClick={handleRevealFirstPlace}
              disabled={isPreparingFirst}
              className={`px-6 sm:px-7 py-2.5 rounded-full text-slate-950 font-black text-xs sm:text-sm shadow-[0_6px_20px_rgba(245,158,11,0.5)] flex items-center gap-2 cursor-pointer active:scale-95 transition-all ${
                isPreparingFirst
                  ? 'bg-amber-300 opacity-80 cursor-wait animate-pulse ring-4 ring-white'
                  : 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 ring-2 ring-white/80 animate-bounce'
              }`}
            >
              <Crown className="w-4 h-4 fill-slate-950 stroke-slate-950" />
              <span>{isPreparingFirst ? '¡Preparando al Campeón...!' : '👑 Revelar ¡GRAN CAMPEÓN!'}</span>
            </button>
          )}

          {isFinishedAll && (
            <>
              {onRestartCeremony && (
                <button
                  onClick={() => {
                    setIsPreparingFirst(false);
                    onRestartCeremony();
                  }}
                  className="px-4 py-2 rounded-full bg-white/90 hover:bg-white text-slate-900 font-bold text-xs shadow-md flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Repetir Revelación</span>
                </button>
              )}

              {onExitCeremony && (
                <button
                  onClick={onExitCeremony}
                  className="px-4 py-2 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-white/40 text-white font-bold text-xs shadow-md flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                >
                  <X className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ver Toda la Tabla</span>
                </button>
              )}
            </>
          )}
        </motion.div>
      )}
      </div>
    </div>
  );
};

interface PodiumPillarProps {
  participant: Participant;
  rank: 1 | 2 | 3;
  heightClass: string;
  pillarGradient: string;
  topCapGradient: string;
  sideShadow: string;
  badgeBg: string;
  isFirst?: boolean;
  isRevealed?: boolean;
  isCeremonyMode?: boolean;
  isPreparing?: boolean;
  countdownNum?: number | string;
  isHighlight?: boolean;
}

const PodiumPillar: React.FC<PodiumPillarProps> = ({
  participant,
  rank,
  heightClass,
  pillarGradient,
  topCapGradient,
  sideShadow,
  isFirst,
  isRevealed = true,
  isCeremonyMode = false,
  isPreparing = false,
  countdownNum = 3,
  isHighlight = false,
}) => {
  const isFinished = participant.status === 'finished';

  // 🌟 PREPARATION STATE FOR 1ST PLACE (Suspense Countdown Animation) 🌟
  if (isFirst && isPreparing) {
    return (
      <div className="flex flex-col items-center w-24 sm:w-32 md:w-40 select-none relative">
        {/* Suspense Crown Floating & Vibrating with anticipation (No heavy glow shadow) */}
        <div className="relative mb-2 flex flex-col items-center justify-center">
          <motion.div
            animate={{
              y: [-4, 4, -4],
              scale: [1, 1.2, 1],
              rotate: [-10, 10, -10],
            }}
            transition={{ duration: 0.28, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <Crown className="w-10 h-10 sm:w-14 sm:h-14 fill-amber-400 text-amber-500" />
            <Sparkles className="w-4 h-4 fill-white text-yellow-200 absolute -top-1 -right-1 animate-spin" />
          </motion.div>

          {/* Countdown Display Pill */}
          <motion.div
            key={`countdown-${countdownNum}`}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: [0.3, 1.4, 1], opacity: 1 }}
            exit={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="mt-1 px-3.5 py-1 rounded-full bg-slate-950 border-2 border-amber-400 text-amber-300 font-['Fredoka',sans-serif] font-black text-sm sm:text-xl shadow-[0_0_20px_rgba(245,158,11,0.8)] flex items-center gap-1"
          >
            <span>{countdownNum}</span>
          </motion.div>
        </div>

        {/* Energized Preparation Column */}
        <motion.div
          animate={{
            boxShadow: [
              '0 0 15px rgba(245,158,11,0.3)',
              '0 0 35px rgba(245,158,11,0.8)',
              '0 0 15px rgba(245,158,11,0.3)',
            ],
          }}
          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
          className={`w-full ${heightClass} relative flex flex-col items-center justify-center rounded-t-2xl bg-gradient-to-b from-amber-400 via-indigo-600 to-indigo-900 border-t-2 border-x-2 border-amber-300 overflow-hidden`}
        >
          <motion.div
            animate={{ y: ['100%', '-100%'] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 bg-gradient-to-t from-transparent via-amber-300/40 to-transparent"
          />
          <span className="text-3xl sm:text-5xl font-black text-amber-200 font-['Fredoka',sans-serif] animate-pulse">
            1
          </span>
          <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest mt-1">
            Preparando...
          </span>
        </motion.div>
      </div>
    );
  }

  // If hidden during ceremony mode, render a suspense mystery veiled pillar
  if (!isRevealed) {
    return (
      <div className="flex flex-col items-center w-20 sm:w-28 md:w-36 select-none relative">
        {/* Placeholder Suspense Avatar Circle */}
        <div className="flex flex-col items-center mb-1.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 border-2 border-white/20 backdrop-blur-md flex items-center justify-center text-white/50 text-base sm:text-lg font-black font-['Fredoka',sans-serif] animate-pulse">
            ?
          </div>
          <span className="text-[9px] sm:text-[10px] text-white/60 font-bold mt-0.5 tracking-wider uppercase">
            {rank === 1 ? '¿Campeón?' : `¿Lugar ${rank}?`}
          </span>
        </div>

        {/* Lowered veiled mystery column */}
        <div className="w-full h-14 sm:h-16 rounded-t-2xl bg-white/10 border-t border-x border-white/20 flex items-center justify-center text-white/40 font-black text-xl sm:text-2xl font-['Fredoka',sans-serif]">
          {rank}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.85 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isHighlight ? 1.05 : 1,
      }}
      transition={{ type: 'spring', damping: 18, stiffness: 260 }}
      className={`flex flex-col items-center w-20 sm:w-28 md:w-36 select-none relative transition-all ${
        isHighlight && !isFirst ? 'filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]' : ''
      }`}
    >
      {/* Animated Participant Information with smooth swap transitions */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={participant.id}
          initial={{ opacity: 0, y: -12, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex flex-col items-center mb-1 text-center w-full px-0.5"
        >
          {/* 👑 Corona Dorada Clásica para el 1er Lugar (Sin sombra pesada) 👑 */}
          {isFirst ? (
            <div className="relative mb-0.5 flex items-center justify-center">
              {/* Corona Dorada con Animación Suave */}
              <motion.div
                animate={{ y: [-2, 2, -2], rotate: [-4, 4, -4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative flex items-center justify-center"
              >
                <Crown className="w-7 h-7 sm:w-9 sm:h-9 fill-amber-400 text-amber-500" />
                <Sparkles className="w-3 h-3 fill-white text-yellow-200 absolute -top-1 -right-1 animate-pulse" />
              </motion.div>
            </div>
          ) : (
            <div className="h-1" />
          )}

          {/* Participant Full Name */}
          <motion.h4
            key={participant.userName}
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            className="text-[11px] sm:text-xs md:text-sm font-extrabold text-white tracking-wide truncate max-w-full drop-shadow-md font-['Fredoka',sans-serif]"
          >
            {participant.userName}
          </motion.h4>

          {/* Sede Tag & Status */}
          <div className="flex items-center gap-1 my-0.5">
            <span className="px-1.5 py-0.2 rounded-full bg-white/25 backdrop-blur-md text-white font-bold text-[9px] sm:text-[10px] tracking-wider uppercase shadow-xs">
              {formatLocationZone(participant.sede, rank - 1)}
            </span>
            {isFinished ? (
              <span
                className="p-0.5 rounded-full bg-emerald-400 text-slate-950"
                title="Cuestionario completado"
              >
                <Check className="w-2 h-2 stroke-[3]" />
              </span>
            ) : (
              <span className="p-0.5 rounded-full bg-amber-300 text-slate-950" title="En curso">
                <Loader2 className="w-2 h-2 animate-spin" />
              </span>
            )}
          </div>

          {/* Points Pill */}
          <motion.div
            key={participant.puntos}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 350 }}
            className={`mt-0.5 px-2 py-0.2 rounded-full text-center shadow-md backdrop-blur-sm flex items-center justify-center gap-1 ${
              isFirst
                ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 font-black ring-1 ring-amber-200/80'
                : 'bg-white/95 text-indigo-950 font-extrabold'
            }`}
          >
            <span className="text-2xl font-['Fredoka',sans-serif]">
              {participant.puntos.toLocaleString()}
            </span>
            <span className="text-[9px] font-bold uppercase">PTS</span>
          </motion.div>

          {/* Time Badge */}
          <div className="mt-1 flex items-center gap-1 bg-slate-950 text-cyan-300 border border-cyan-400/50 px-2 py-0.2 rounded font-mono font-black text-[9px] sm:text-[10px] shadow-xs">
            <Clock className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
            <span>{participant.tiempo}</span>
          </div>

          {/* Correctas Badge - separate and larger */}
          <div className="mt-1 flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300/50 px-3 py-0.3 rounded font-extrabold text-sm sm:text-base shadow-xs backdrop-blur-sm">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{participant.correctas} correctas</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 3D Smooth Rounded Column Podium with Giant Number and dynamic bounce */}
      <motion.div
        key={`pillar-bar-${participant.id}-${rank}`}
        initial={{ scaleY: 0.3, y: 20 }}
        animate={{
          scaleY: [0.3, 1.12, 0.96, 1],
          y: [20, -5, 2, 0],
        }}
        transition={{
          duration: 0.45,
          ease: 'easeOut',
        }}
        style={{ transformOrigin: 'bottom center' }}
        className={`w-full ${heightClass} relative flex flex-col items-center justify-between rounded-t-2xl sm:rounded-t-3xl ${pillarGradient} ${sideShadow} transition-all duration-300 overflow-hidden`}
      >
        {/* Shimmer Light Reflection Effect on Reveal */}
        <motion.div
          key={`shine-${participant.id}-${rank}`}
          initial={{ x: '-100%', opacity: 0.9 }}
          animate={{ x: '180%', opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 pointer-events-none z-10"
        />

        {/* 3D Top Cap Highlight */}
        <div
          className={`w-full h-4 sm:h-5 ${topCapGradient} rounded-t-2xl sm:rounded-t-3xl opacity-80 shadow-inner flex items-center justify-center`}
        >
          <div className="w-8 sm:w-10 h-0.5 bg-white/40 rounded-full" />
        </div>

        {/* Giant Number centered on the column */}
        <div className="flex-1 flex items-center justify-center">
          <motion.span
            key={`rank-num-${participant.id}-${rank}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.2, 0.95, 1], opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)] font-['Fredoka',sans-serif] tracking-tighter"
          >
            {rank}
          </motion.span>
        </div>

        {/* Bottom subtle bar */}
        <div className="w-full bg-black/15 py-0.2 px-1 text-center text-[8px] sm:text-[9px] text-white/80 font-bold uppercase tracking-wider">
          {isFinished ? '✓ Listo' : '⏳ En curso'}
        </div>
      </motion.div>
    </motion.div>
  );
};
