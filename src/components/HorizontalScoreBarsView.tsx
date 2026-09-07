import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Check,
  Loader2,
  Award,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Eye,
  EyeOff,
  Sun,
  Moon,
  TrendingDown,
  Sparkles,
  Pause,
  Play,
} from 'lucide-react';
import { Participant } from '../types';

interface HorizontalScoreBarsViewProps {
  participants: Participant[];
  maxPossiblePoints?: number;
}

// Roman numerals for zone mapping: ZONA I, ZONA II, ZONA III...
const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV'];

/**
 * Maps or formats the participant's location/sede to ZONA N
 * e.g. LUGAR1 -> ZONA I, LUGAR2 -> ZONA II, PIAR -> ZONA I, etc.
 * Supports any custom location as well.
 */
export const formatLocationZone = (sede: string | undefined, index: number): string => {
  if (!sede || !sede.trim()) {
    const roman = ROMAN_NUMERALS[index % ROMAN_NUMERALS.length];
    return `ZONA ${roman}`;
  }

  const upper = sede.trim().toUpperCase();

  // If already starts with ZONA (e.g. ZONA I, ZONA 1, ZONA CENTRAL)
  if (upper.startsWith('ZONA')) {
    return upper;
  }

  // If it's LUGAR1, LUGAR 2, etc.
  const lugarMatch = upper.match(/^LUGAR\s*(\d+)$/i);
  if (lugarMatch) {
    const num = parseInt(lugarMatch[1], 10);
    const roman = ROMAN_NUMERALS[num - 1] || `${num}`;
    return `ZONA ${roman}`;
  }

  // Predefined mappings for standard mock sedes
  const sedeMap: Record<string, string> = {
    PIAR: 'ZONA I',
    LUGAR2: 'ZONA II',
    LUGAR1: 'ZONA III',
    CENTRAL: 'ZONA IV',
    NORTE: 'ZONA V',
    SUR: 'ZONA VI',
    OCCIDENTE: 'ZONA I',
    ORIENTE: 'ZONA II',
    METROPOLITANA: 'ZONA III',
    REGIONAL: 'ZONA IV',
  };

  if (sedeMap[upper]) {
    return sedeMap[upper];
  }

  // Default sequential mapping from ZONA I to ZONA VI and beyond
  const roman = ROMAN_NUMERALS[index % ROMAN_NUMERALS.length];
  return `ZONA ${roman}`;
};

// Vibrant non-red accent colors for cards
const ACCENT_COLORS = [
  {
    name: 'Violeta',
    accent: '#8b5cf6',
    bar: 'from-violet-600 via-purple-500 to-indigo-400',
    lightBg: 'bg-violet-50/70',
    lightBorder: 'border-violet-300/80',
    watermarkColor: 'text-violet-600/10',
    pill: 'bg-violet-100 text-violet-800 border-violet-200',
  },
  {
    name: 'Ámbar',
    accent: '#f59e0b',
    bar: 'from-amber-500 via-yellow-400 to-amber-300',
    lightBg: 'bg-amber-50/70',
    lightBorder: 'border-amber-300/80',
    watermarkColor: 'text-amber-600/10',
    pill: 'bg-amber-100 text-amber-900 border-amber-200',
  },
  {
    name: 'Esmeralda',
    accent: '#10b981',
    bar: 'from-emerald-500 via-teal-400 to-emerald-300',
    lightBg: 'bg-emerald-50/70',
    lightBorder: 'border-emerald-300/80',
    watermarkColor: 'text-emerald-600/10',
    pill: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  },
  {
    name: 'Cian',
    accent: '#06b6d4',
    bar: 'from-cyan-500 via-sky-400 to-blue-400',
    lightBg: 'bg-cyan-50/70',
    lightBorder: 'border-cyan-300/80',
    watermarkColor: 'text-cyan-600/10',
    pill: 'bg-cyan-100 text-cyan-900 border-cyan-200',
  },
  {
    name: 'Cobalto',
    accent: '#3b82f6',
    bar: 'from-blue-600 via-indigo-500 to-cyan-400',
    lightBg: 'bg-blue-50/70',
    lightBorder: 'border-blue-300/80',
    watermarkColor: 'text-blue-600/10',
    pill: 'bg-blue-100 text-blue-900 border-blue-200',
  },
  {
    name: 'Fucsia',
    accent: '#d946ef',
    bar: 'from-fuchsia-500 via-pink-400 to-purple-400',
    lightBg: 'bg-fuchsia-50/70',
    lightBorder: 'border-fuchsia-300/80',
    watermarkColor: 'text-fuchsia-600/10',
    pill: 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-200',
  },
  {
    name: 'Turquesa',
    accent: '#14b8a6',
    bar: 'from-teal-500 via-emerald-400 to-cyan-400',
    lightBg: 'bg-teal-50/70',
    lightBorder: 'border-teal-300/80',
    watermarkColor: 'text-teal-600/10',
    pill: 'bg-teal-100 text-teal-900 border-teal-200',
  },
  {
    name: 'Índigo',
    accent: '#6366f1',
    bar: 'from-indigo-500 via-violet-400 to-purple-400',
    lightBg: 'bg-indigo-50/70',
    lightBorder: 'border-indigo-300/80',
    watermarkColor: 'text-indigo-600/10',
    pill: 'bg-indigo-100 text-indigo-900 border-indigo-200',
  },
];

// Helper to format names: first name regular, last name bold uppercase
const formatName = (fullName: string) => {
  const clean = fullName.trim();
  const parts = clean.split(/\s+/);
  if (parts.length === 1) {
    return { firstName: '', lastName: parts[0].toUpperCase() };
  }
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ').toUpperCase();
  return { firstName, lastName };
};

export const HorizontalScoreBarsView: React.FC<HorizontalScoreBarsViewProps> = ({
  participants,
  maxPossiblePoints = 250,
}) => {
  // Active participant selected for the large Hero Card on top
  const [activeParticipantIndex, setActiveParticipantIndex] = useState<number>(0);

  // Auto-navigate state
  const [isAutoNavigating, setIsAutoNavigating] = useState<boolean>(true);
  const autoNavigateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Toggle to show/hide the location/zone watermark in big format on cards
  const [showBigZoneWatermark, setShowBigZoneWatermark] = useState<boolean>(true);

  // Theme mode: Default to daylight mode (True) for optimal daytime visibility and no glare
  const [isDaylightMode, setIsDaylightMode] = useState<boolean>(true);

  // Calculate highest score in dataset for benchmark comparison
  const leaderScore = useMemo(() => {
    return participants.length > 0 ? Math.max(...participants.map((p) => p.puntos), 1) : 1;
  }, [participants]);

  const benchmarkScore = Math.max(leaderScore, maxPossiblePoints > 0 ? maxPossiblePoints : 100);

  // Safely get active participant
  const safeIndex = Math.min(Math.max(0, activeParticipantIndex), Math.max(0, participants.length - 1));
  const activeParticipant = participants[safeIndex] || participants[0];

  // Auto-navigate effect
  useEffect(() => {
    if (isAutoNavigating && participants.length > 1) {
      autoNavigateIntervalRef.current = setInterval(() => {
        setActiveParticipantIndex((prev) => (prev < participants.length - 1 ? prev + 1 : 0));
      }, 3000);
    } else {
      if (autoNavigateIntervalRef.current) {
        clearInterval(autoNavigateIntervalRef.current);
        autoNavigateIntervalRef.current = null;
      }
    }

    return () => {
      if (autoNavigateIntervalRef.current) {
        clearInterval(autoNavigateIntervalRef.current);
      }
    };
  }, [isAutoNavigating, participants.length]);

  // Navigation handlers
  const handlePrev = () => {
    setIsAutoNavigating(false);
    setActiveParticipantIndex((prev) => (prev > 0 ? prev - 1 : participants.length - 1));
  };

  const handleNext = () => {
    setIsAutoNavigating(false);
    setActiveParticipantIndex((prev) => (prev < participants.length - 1 ? prev + 1 : 0));
  };

  if (participants.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 flex flex-col items-center justify-center rounded-3xl bg-white/95 border border-slate-200 text-center shadow-xl">
        <Award className="w-12 h-12 text-indigo-400 mb-2" />
        <p className="text-base font-bold text-slate-800 font-['Fredoka',sans-serif]">
          Sin participantes para mostrar en la lista
        </p>
      </div>
    );
  }

  // Calculations for active participant
  const activeFormatted = activeParticipant ? formatName(activeParticipant.userName) : null;
  const activeRank = activeParticipant?.rank || safeIndex + 1;
  const activePercentage = activeParticipant
    ? Math.max(8, Math.min(100, Math.round((activeParticipant.puntos / benchmarkScore) * 100)))
    : 100;
  const activeZone = formatLocationZone(activeParticipant?.sede, safeIndex);
  const activeColorConfig = ACCENT_COLORS[safeIndex % ACCENT_COLORS.length];
  const activeDiff = leaderScore - (activeParticipant?.puntos || 0);

  return (
    <div
      className={`w-full max-w-5xl mx-auto flex flex-col gap-3.5 p-3 sm:p-5 rounded-3xl transition-colors duration-300 select-none ${
        isDaylightMode
          ? 'bg-slate-100/90 border border-slate-200/90 shadow-2xl text-slate-900'
          : 'bg-[#0b0f19]/95 border border-slate-800 shadow-2xl text-white'
      }`}
    >
      {/* 🧭 CONTROL & NAVIGATION BAR 🧭 */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow-md ${
              isDaylightMode
                ? 'bg-indigo-600 text-white shadow-indigo-200'
                : 'bg-indigo-500 text-slate-950 shadow-indigo-900/50'
            }`}
          >
            #{safeIndex + 1}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs font-black uppercase tracking-wider ${
                  isDaylightMode ? 'text-indigo-700' : 'text-cyan-400'
                }`}
              >
                Participante en Foco
              </span>
              <span className="text-xs text-slate-400 font-bold">
                ({safeIndex + 1} de {participants.length})
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Usa las flechas o toca una card para ver sus características
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Button to Toggle Big Zone Watermark (Icon Only) */}
          <button
            onClick={() => setShowBigZoneWatermark(!showBigZoneWatermark)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${
              showBigZoneWatermark
                ? isDaylightMode
                  ? 'bg-indigo-600 text-white shadow-indigo-200 ring-1 ring-indigo-400'
                  : 'bg-cyan-500 text-slate-950 font-black ring-1 ring-cyan-300'
                : isDaylightMode
                ? 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-50'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
            }`}
            title={showBigZoneWatermark ? 'Ocultar marca de agua de Zonas' : 'Mostrar marca de agua de Zonas'}
            aria-label={showBigZoneWatermark ? 'Ocultar marca de agua de Zonas' : 'Mostrar marca de agua de Zonas'}
          >
            {showBigZoneWatermark ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>

          {/* Daylight vs Night mode button for daytime projection (Icon Only) */}
          <button
            onClick={() => setIsDaylightMode(!isDaylightMode)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${
              isDaylightMode
                ? 'bg-amber-400 text-slate-950 shadow-amber-200 ring-1 ring-amber-300'
                : 'bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-700'
            }`}
            title={isDaylightMode ? 'Cambiar a Modo Noche' : 'Cambiar a Modo Día (Luz)'}
            aria-label={isDaylightMode ? 'Cambiar a Modo Noche' : 'Cambiar a Modo Día (Luz)'}
          >
            {isDaylightMode ? (
              <Sun className="w-4 h-4 fill-slate-950 text-slate-950" />
            ) : (
              <Moon className="w-4 h-4 text-amber-300" />
            )}
          </button>
        </div>
      </div>

      {/* 🌟 BIG ACTIVE / HERO CARD (Navigable through arrows) 🌟 */}
      {activeParticipant && activeFormatted && (
        <motion.div
          key={`hero-card-${activeParticipant.id}`}
          layout
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className={`relative overflow-hidden rounded-3xl border-2 shadow-xl p-4 sm:p-6 transition-all ${
            isDaylightMode
              ? 'bg-white border-indigo-300/80 shadow-[0_10px_35px_rgba(79,70,229,0.12)]'
              : 'bg-gradient-to-r from-blue-950/90 via-[#0d1424] to-[#070b14] border-cyan-500/60 shadow-[0_0_35px_rgba(6,182,212,0.25)]'
          }`}
        >
          {/* 📍 BIG BACKGROUND ZONE WATERMARK (When toggled ON) 📍 */}
          {showBigZoneWatermark && (
            <div
              className={`absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none font-black text-6xl sm:text-8xl md:text-9xl tracking-tighter uppercase whitespace-nowrap overflow-hidden z-0 transition-opacity ${
                isDaylightMode ? 'text-slate-900/[0.04]' : 'text-cyan-300/[0.06]'
              }`}
            >
              {activeZone}
            </div>
          )}

          {/* Top Quick Navigation Controls */}
          <div className="flex items-center justify-between relative z-10 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  activeRank === 1
                    ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-300 font-extrabold'
                    : isDaylightMode
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-slate-800 text-cyan-300'
                }`}
              >
                {activeRank === 1 ? '👑 1º Lugar General' : `Puesto #${activeRank}`}
              </span>

              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                  isDaylightMode ? 'bg-slate-100 text-slate-700' : 'bg-slate-800/80 text-slate-300'
                }`}
              >
                <MapPin className="w-3 h-3 text-indigo-500" />
                {activeZone}
              </span>
            </div>

            {/* Carousel Arrow Buttons (Icon only) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-xs ${
                  isDaylightMode
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
                title="Participante anterior"
                aria-label="Participante anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsAutoNavigating(!isAutoNavigating)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
                  isAutoNavigating
                    ? 'bg-amber-400 text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
                title={isAutoNavigating ? 'Pausar auto-navegación' : 'Reanudar auto-navegación'}
                aria-label={isAutoNavigating ? 'Pausar auto-navegación' : 'Reanudar auto-navegación'}
              >
                {isAutoNavigating ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
              </button>

              <span className="font-mono text-xs font-bold px-2 text-slate-400">
                {safeIndex + 1} / {participants.length}
              </span>

              <button
                onClick={handleNext}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-xs ${
                  isDaylightMode
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-cyan-900'
                }`}
                title="Siguiente participante"
                aria-label="Siguiente participante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            {/* Left: Rank Badge + Accent Strip + Large Typography Name */}
            <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
              {/* Slanted Rank Box (Clean Non-Red Aesthetic) */}
              <div className="flex-shrink-0 relative">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center shadow-lg ${
                    activeRank === 1
                      ? 'bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 text-slate-950 border-2 border-white ring-2 ring-amber-300 shadow-amber-400/30'
                      : activeRank === 2
                      ? 'bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 text-slate-900 border-2 border-white shadow-slate-300/40'
                      : activeRank === 3
                      ? 'bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 text-white border-2 border-amber-300/40 shadow-amber-900/30'
                      : isDaylightMode
                      ? 'bg-gradient-to-br from-indigo-700 to-blue-800 text-white border-2 border-indigo-400 shadow-indigo-300/40'
                      : 'bg-gradient-to-br from-slate-800 to-slate-900 text-white border-2 border-cyan-400'
                  }`}
                  style={{ transform: 'skewX(-10deg)', borderRadius: '14px' }}
                >
                  <div style={{ transform: 'skewX(10deg)' }} className="flex flex-col items-center">
                    <span className="text-2xl sm:text-4xl font-black italic tracking-tighter leading-none">
                      {activeRank}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase opacity-80">
                      LUGAR
                    </span>
                  </div>
                </div>
              </div>

              {/* Vertical Color Accent Strip */}
              <div
                className="w-1.5 sm:w-2 h-14 sm:h-18 rounded-full shadow-md flex-shrink-0"
                style={{
                  backgroundColor: activeColorConfig.accent,
                  boxShadow: `0 0 14px ${activeColorConfig.accent}`,
                }}
              />

              {/* Name (First Name Top Regular, LAST NAME BOLD UPPERCASE) */}
              <div className="flex flex-col min-w-0">
                {activeFormatted.firstName && (
                  <span
                    className={`text-xs sm:text-sm font-semibold tracking-wide uppercase ${
                      isDaylightMode ? 'text-slate-500' : 'text-slate-300'
                    }`}
                  >
                    {activeFormatted.firstName}
                  </span>
                )}
                <h3
                  className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase italic leading-none truncate ${
                    isDaylightMode ? 'text-slate-900' : 'text-white drop-shadow-md'
                  }`}
                >
                  {activeFormatted.lastName}
                </h3>

                {/* Location Badge + Status */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md font-bold text-xs flex items-center gap-1 ${
                      isDaylightMode
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-extrabold">{activeZone}</span>
                  </span>

                  {activeParticipant.status === 'finished' ? (
                    <span className="flex items-center gap-1 text-[11px] font-black uppercase text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                      COMPLETADO
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-black uppercase text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      EN CURSO
                    </span>
                  )}
                    <span className="flex items-center gap-1 text-[11px] font-black uppercase text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                      { activeParticipant.correctas } CORRECTAS
                    </span>
                </div>
              </div>
            </div>

            {/* Right: Points, Official Time & Progress */}
            <div className="flex items-center md:flex-col md:items-end justify-between w-full md:w-auto gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-200 dark:border-slate-800">
              {/* Score Display */}
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`text-3xl sm:text-5xl font-black font-mono italic tracking-tight ${
                    isDaylightMode
                      ? 'text-indigo-950'
                      : 'text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  }`}
                >
                  {activeParticipant.puntos.toLocaleString()}
                </span>
                <span
                  className={`text-xs sm:text-sm font-black uppercase ${
                    isDaylightMode ? 'text-indigo-600' : 'text-amber-400'
                  }`}
                >
                  PTS
                </span>
              </div>

              {/* High-Visibility Official Time Banner */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-950 text-cyan-300 border border-cyan-400/80 px-3 py-1 rounded-xl font-mono font-black text-xs sm:text-sm shadow-md ring-1 ring-cyan-400/30">
                  <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>TIEMPO: {activeParticipant.tiempo}</span>
                </div>

                <span
                  className={`text-[11px] font-bold px-2 py-1 rounded-lg border ${
                    isDaylightMode
                      ? 'bg-slate-100 text-slate-700 border-slate-200'
                      : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  {activeParticipant.avance}/20 PREG.
                </span>
              </div>
            </div>
          </div>

          {/* 🌟 Horizontal Score Bar along the base of the Hero Card 🌟 */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="flex items-center gap-1 text-indigo-700 dark:text-cyan-400 font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                PUNTUACIÓN OBTENIDA
              </span>
              <span className="font-mono font-black">
                {activePercentage}% de {benchmarkScore} pts
              </span>
            </div>

            <div
              className={`w-full h-3.5 rounded-full p-0.5 overflow-hidden border relative shadow-inner ${
                isDaylightMode
                  ? 'bg-slate-100 border-slate-300/80'
                  : 'bg-slate-950 border-cyan-500/40'
              }`}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${activePercentage}%` }}
                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                className={`h-full rounded-full bg-gradient-to-r ${activeColorConfig.bar} relative shadow-md`}
              >
                <motion.div
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 📋 LIST OF ALL PARTICIPANTS (Cards with Bars & Watermark Zone) 📋 */}
      <div className="space-y-2 mt-1">
        <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>LISTA DE PARTICIPANTES ({participants.length})</span>
          <span>Toca una tarjeta para seleccionarla</span>
        </div>

        <AnimatePresence>
          {participants.map((participant, index) => {
            const rank = participant.rank || index + 1;
            const formatted = formatName(participant.userName);
            const colorConfig = ACCENT_COLORS[index % ACCENT_COLORS.length];
            const zone = formatLocationZone(participant.sede, index);
            const isCurrentlyActive = index === safeIndex;

            // Percentage relative to benchmark
            const rawPercentage = Math.round((participant.puntos / benchmarkScore) * 100);
            const percentage = Math.max(8, Math.min(100, rawPercentage));
            const diffFromLeader = leaderScore - participant.puntos;

            return (
              <motion.div
                key={participant.id}
                layout
                onClick={() => setActiveParticipantIndex(index)}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320, delay: index * 0.02 }}
                className={`relative overflow-hidden rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group ${
                  isCurrentlyActive
                    ? isDaylightMode
                      ? 'bg-white border-indigo-500 ring-2 ring-indigo-400/40 shadow-indigo-100 scale-[1.01]'
                      : 'bg-[#131b2e] border-cyan-400 ring-2 ring-cyan-400/30 shadow-cyan-900/30 scale-[1.01]'
                    : isDaylightMode
                    ? 'bg-white hover:bg-slate-50/90 border-slate-200/80 text-slate-900'
                    : 'bg-[#0c111c] hover:bg-[#101726] border-slate-800/90 text-white'
                }`}
              >
                {/* 📍 BIG BACKGROUND ZONE WATERMARK (When toggled ON) 📍 */}
                {showBigZoneWatermark && (
                  <div
                    className={`absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 pointer-events-none select-none font-black text-4xl sm:text-6xl md:text-7xl tracking-tighter uppercase whitespace-nowrap overflow-hidden z-0 transition-opacity ${
                      isDaylightMode ? 'text-slate-900/[0.04]' : 'text-cyan-300/[0.05]'
                    }`}
                  >
                    {zone}
                  </div>
                )}

                {/* Subtle percentage progress fill behind card */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ type: 'spring', stiffness: 140, damping: 20, delay: index * 0.03 }}
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colorConfig.bar} opacity-5 dark:opacity-10 pointer-events-none group-hover:opacity-15 transition-opacity`}
                />

                <div className="relative z-10 p-2.5 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-4">
                  {/* Left: Slanted Rank Box + Color Strip + Name + Zone */}
                  <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                    {/* Rank Box */}
                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm font-black italic tracking-tighter text-sm sm:text-lg ${
                        rank === 1
                          ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-300'
                          : rank === 2
                          ? 'bg-slate-200 text-slate-900 ring-1 ring-white'
                          : rank === 3
                          ? 'bg-amber-700 text-white'
                          : isDaylightMode
                          ? 'bg-slate-100 text-slate-700 border border-slate-300'
                          : 'bg-slate-800 text-white border border-slate-700'
                      }`}
                      style={{ transform: 'skewX(-10deg)' }}
                    >
                      <span style={{ transform: 'skewX(10deg)' }}>{rank}</span>
                    </div>

                    {/* Color Accent Vertical Bar */}
                    <div
                      className="w-1 sm:w-1.5 h-8 sm:h-11 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: colorConfig.accent,
                        boxShadow: `0 0 8px ${colorConfig.accent}`,
                      }}
                    />

                    {/* Participant Name & Zone */}
                    <div className="flex flex-col min-w-0 flex-1">
                      {formatted.firstName && (
                        <span
                          className={`text-[11px] sm:text-xs font-medium uppercase tracking-wide leading-tight truncate ${
                            isDaylightMode ? 'text-slate-500' : 'text-slate-400'
                          }`}
                        >
                          {formatted.firstName}
                        </span>
                      )}
                      <span
                        className={`text-sm sm:text-lg font-black uppercase italic tracking-tight leading-tight truncate ${
                          isDaylightMode ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {formatted.lastName}
                      </span>

                      {/* Zone / Location Badge */}
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${
                            isDaylightMode
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                              : 'bg-slate-800 text-cyan-300 border border-slate-700'
                          }`}
                        >
                          <MapPin className="w-2.5 h-2.5 text-indigo-500" />
                          {zone}
                        </span>

                        {isCurrentlyActive && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-xs">
                            EN FOCO
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Points, Time & Delta */}
                  <div className="flex items-center sm:flex-col sm:items-end justify-between w-full sm:w-auto gap-1 border-t sm:border-t-0 pt-1 sm:pt-0 border-slate-100 dark:border-slate-800">
                    {/* Points & Delta */}
                    <div className="flex items-center gap-2">
                      {diffFromLeader > 0 ? (
                        <span className="flex items-center gap-0.5 text-[10px] sm:text-[11px] font-mono font-bold text-slate-400">
                          <TrendingDown className="w-2.5 h-2.5 text-indigo-500" />
                          -{diffFromLeader} PTS
                        </span>
                      ) : (
                        <span className="text-[10px] sm:text-[11px] font-mono font-black text-amber-500">
                          LÍDER
                        </span>
                      )}

                      <div className="flex items-baseline gap-1 font-mono">
                        <span
                          className={`text-base sm:text-xl font-black italic ${
                            isDaylightMode ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {participant.puntos.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">PTS</span>
                      </div>
                    </div>

                    {/* Official Time & Question Progress */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                          isDaylightMode
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {participant.avance}/20
                      </span>

                      {/* Official Time Badge & Correctas */}
                      <div className="flex flex-col items-center gap-1">
                        {/* Official Time Badge */}
                        <div className="flex items-center gap-1 bg-slate-950 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-md font-mono font-black text-xs shadow-xs">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>{participant.tiempo}</span>
                        </div>

                        {/* Correctas Badge - separate and larger */}
                        <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300/50 px-2.5 py-0.3 rounded font-extrabold text-xs sm:text-sm shadow-xs backdrop-blur-sm">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{participant.correctas} correctas</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🌟 Horizontal Comparative Bar at Card Base 🌟 */}
                <div className="px-2.5 sm:px-3.5 pb-2 pt-0.5">
                  <div
                    className={`w-full h-1.5 sm:h-2 rounded-full overflow-hidden border relative ${
                      isDaylightMode
                        ? 'bg-slate-100 border-slate-200'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{
                        type: 'spring',
                        stiffness: 180,
                        damping: 22,
                        delay: index * 0.02,
                      }}
                      className={`h-full rounded-full bg-gradient-to-r ${colorConfig.bar} relative`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
