import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronUp,
  ChevronDown,
  UserPlus,
  Play,
  Pause,
  Square,
  Code,
  Download,
  Volume2,
  VolumeX,
  RotateCcw,
  BookOpen,
  Filter,
  Sparkles,
  Search,
  Zap,
  Layers,
  Columns2,
  Rows3,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Trophy,
  Minus,
  Plus,
  X,
  Wrench,
  Hourglass,
  RefreshCw,
} from 'lucide-react';
import { LeaderboardViewMode, QuizMeta } from '../types';

interface FooterControlsDrawerProps {
  onAddFakeParticipant: () => void;
  onSimulateAnswer: () => void;
  onRotateTop3: () => void;
  isSyncPaused: boolean;
  onToggleSyncPause: () => void;
  isWaitingMode?: boolean;
  onToggleWaitingMode?: () => void;
  viewMode: LeaderboardViewMode;
  onChangeViewMode: (mode: LeaderboardViewMode) => void;
  showHudStats: boolean;
  onToggleHudStats: () => void;
  isCeremonyMode: boolean;
  onToggleCeremony: () => void;
  ceremonyStartRank: number;
  onChangeCeremonyStartRank: (rank: number) => void;
  onStartCeremonyWithRank: (rank: number) => void;
  totalParticipantsCount: number;
  onAddLevel: () => void;
  onRemoveLevel?: () => void;
  onChangeQuestions?: (delta: number) => void;
  onChangePunteo?: (delta: number) => void;
  quizMeta?: QuizMeta;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onOpenHtmlModal: () => void;
  onOpenInstallModal: () => void;
  onDownloadExtension: () => void;
  onSyncWithApi: () => void;
  isSyncingWithApi?: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetData: () => void;
  selectedSede: string;
  onSelectSede: (sede: string) => void;
  availableSedes: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FooterControlsDrawer: React.FC<FooterControlsDrawerProps> = ({
  onAddFakeParticipant,
  onSimulateAnswer,
  onRotateTop3,
  isSyncPaused,
  onToggleSyncPause,
  isWaitingMode = false,
  onToggleWaitingMode,
  viewMode,
  onChangeViewMode,
  showHudStats,
  onToggleHudStats,
  isCeremonyMode,
  onToggleCeremony,
  ceremonyStartRank,
  onChangeCeremonyStartRank,
  onStartCeremonyWithRank,
  totalParticipantsCount,
  onAddLevel,
  onRemoveLevel,
  onChangeQuestions,
  onChangePunteo,
  quizMeta,
  isSimulating,
  onToggleSimulation,
  onOpenHtmlModal,
  onOpenInstallModal,
  onDownloadExtension,
  onSyncWithApi,
  isSyncingWithApi = false,
  soundEnabled,
  onToggleSound,
  onResetData,
  selectedSede,
  onSelectSede,
  availableSedes,
  searchQuery,
  onSearchChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isViewSpeedDialOpen, setIsViewSpeedDialOpen] = useState<boolean>(false);
  const [isCeremonyConfigOpen, setIsCeremonyConfigOpen] = useState<boolean>(false);
  const [areBubblesHidden, setAreBubblesHidden] = useState<boolean>(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center pointer-events-none">
      {/* Quick Actions at the bottom center (hideable) */}
      <AnimatePresence>
        {!areBubblesHidden && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto mb-1 flex items-center gap-2 relative"
          >
        {/* 🏆 Quick Trophy Button with Starting Rank Selector 🏆 */}
        <div className="relative">
          {/* Popover to configure rank number when clicked */}
          <AnimatePresence>
            {isCeremonyConfigOpen && !isCeremonyMode && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl p-3.5 shadow-2xl z-50 text-white select-none"
              >
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 font-['Fredoka',sans-serif]">
                    <Trophy className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Mostrar Ganadores</span>
                  </div>
                  <button
                    onClick={() => setIsCeremonyConfigOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-300 font-medium mb-2 text-center">
                  ¿Desde qué lugar comenzar la revelación?
                </p>

                {/* Number Stepper */}
                <div className="flex items-center justify-center gap-2 mb-2.5 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800">
                  <button
                    onClick={() => onChangeCeremonyStartRank(Math.max(3, ceremonyStartRank - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                    title="Disminuir puesto"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400 font-bold">Puesto</span>
                    <input
                      type="number"
                      min={3}
                      max={Math.max(3, totalParticipantsCount || 20)}
                      value={ceremonyStartRank}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 3) {
                          onChangeCeremonyStartRank(val);
                        }
                      }}
                      className="w-12 text-center text-base font-black font-['Fredoka',sans-serif] bg-amber-500/20 text-amber-300 rounded-lg py-0.5 border border-amber-400/50 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() =>
                      onChangeCeremonyStartRank(
                        Math.min(totalParticipantsCount || 20, ceremonyStartRank + 1)
                      )
                    }
                    className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                    title="Aumentar puesto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center justify-center gap-1.5 mb-3">
                  {[3, 4, 5, 10].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => onChangeCeremonyStartRank(preset)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        ceremonyStartRank === preset
                          ? 'bg-amber-400 text-slate-950 ring-1 ring-amber-200 font-black'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      Top {preset}
                    </button>
                  ))}
                </div>

                {/* Start Button */}
                <button
                  onClick={() => {
                    onStartCeremonyWithRank(ceremonyStartRank);
                    setIsCeremonyConfigOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Trophy className="w-4 h-4 fill-slate-950" />
                  <span>Iniciar Revelación (#{ceremonyStartRank} → #1)</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => {
              if (isCeremonyMode) {
                onToggleCeremony();
              } else {
                setIsCeremonyConfigOpen(!isCeremonyConfigOpen);
                setIsViewSpeedDialOpen(false);
              }
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer relative ${
              isCeremonyMode
                ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 ring-2 ring-white shadow-amber-500/60 scale-105'
                : 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 hover:from-amber-400 hover:to-yellow-300 text-slate-950 ring-2 ring-amber-300/80 shadow-amber-500/40'
            }`}
            title={
              isCeremonyMode
                ? 'Salir de Ceremonia (Ver toda la tabla)'
                : `Mostrar Ganadores (Revelar desde puesto #${ceremonyStartRank})`
            }
          >
            <Trophy className="w-4 h-4 fill-slate-950 stroke-slate-950" />

            {/* Rank badge on the button */}
            <span className="absolute -top-1.5 -right-1.5 px-1 min-w-[16px] h-4 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black flex items-center justify-center border border-amber-300/80 shadow-xs font-mono">
              {ceremonyStartRank}
            </span>
          </button>
        </div>

        {/* 🔘 BURBUJA SELECTORA DE MODOS DE VISTA (Se expande hacia un lado empujando las demás burbujas) 🔘 */}
        <motion.div layout className="flex items-center gap-1.5">
          {/* Main View Mode Trigger Bubble */}
          <motion.button
            layout
            onClick={() => {
              setIsViewSpeedDialOpen(!isViewSpeedDialOpen);
              setIsCeremonyConfigOpen(false);
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer relative ${
              isViewSpeedDialOpen
                ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 scale-105'
                : 'bg-slate-900/95 hover:bg-slate-800 text-white border border-slate-700/80'
            }`}
            title={isViewSpeedDialOpen ? 'Cerrar opciones de vista' : 'Cambiar vista (expandir al lado)'}
          >
            {viewMode === 'horizontal-bars' ? (
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            ) : viewMode === 'split' ? (
              <Columns2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <Rows3 className="w-4 h-4 text-amber-300" />
            )}
          </motion.button>

          {/* Sub-burbujas expandiéndose lateralmente hacia un lado */}
          <AnimatePresence>
            {isViewSpeedDialOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0, scale: 0.75 }}
                animate={{ opacity: 1, width: 'auto', scale: 1 }}
                exit={{ opacity: 0, width: 0, scale: 0.75 }}
                transition={{ type: 'spring', damping: 24, stiffness: 360 }}
                className="flex items-center gap-1.5 overflow-hidden pr-1"
              >
                {/* Burbuja 1: Podio Clásico */}
                <button
                  onClick={() => {
                    onChangeViewMode('classic');
                    setIsViewSpeedDialOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-md ${
                    viewMode === 'classic'
                      ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-white/60'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold'
                  }`}
                  title="Podio Clásico (Podio arriba, lista abajo)"
                >
                  <Rows3 className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Clásico</span>
                </button>

                {/* Burbuja 2: Vista Dividida */}
                <button
                  onClick={() => {
                    onChangeViewMode('split');
                    setIsViewSpeedDialOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-md ${
                    viewMode === 'split'
                      ? 'bg-cyan-400 text-slate-950 font-black ring-2 ring-white/60'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold'
                  }`}
                  title="Vista Dividida (2 Columnas centradas)"
                >
                  <Columns2 className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Dividido</span>
                </button>

                {/* Burbuja 3: Cards con Barras */}
                <button
                  onClick={() => {
                    onChangeViewMode('horizontal-bars');
                    setIsViewSpeedDialOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap shadow-md ${
                    viewMode === 'horizontal-bars'
                      ? 'bg-emerald-400 text-slate-950 font-black ring-2 ring-white/60'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold'
                  }`}
                  title="Cards con Barras Horizontales de Puntos"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Barras</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick Icon-Only Play/Pause Button (Empujado a un lado al expandir vistas) */}
        <motion.button
          layout
          onClick={onToggleSyncPause}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${
            isSyncPaused
              ? 'bg-rose-600 hover:bg-rose-500 text-white ring-2 ring-rose-300 animate-pulse'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
          title={
            isSyncPaused
              ? 'Reanudar sincronización'
              : 'Pausar sincronización (Momento de tensión y suspenso)'
          }
        >
          {isSyncPaused ? (
            <Play className="w-4 h-4 fill-white translate-x-0.5" />
          ) : (
            <Pause className="w-4 h-4 fill-white" />
          )}
        </motion.button>

        {/* Quick Icon-Only Waiting Mode Toggle Button */}
        {onToggleWaitingMode && (
          <motion.button
            layout
            onClick={onToggleWaitingMode}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${
              isWaitingMode
                ? 'bg-amber-400 text-slate-950 ring-2 ring-white shadow-amber-500/50'
                : 'bg-slate-900/95 hover:bg-slate-800 text-slate-300 border border-slate-700/80'
            }`}
            title={
              isWaitingMode
                ? 'Restaurar participantes de prueba'
                : 'Simular espera de participantes (Vaciar lista)'
            }
          >
            <Hourglass className={`w-4 h-4 ${isWaitingMode ? 'text-slate-950' : 'text-amber-400'}`} />
          </motion.button>
        )}

        {/* Quick Icon-Only HUD Stats Toggle Button */}
        <motion.button
          layout
          onClick={onToggleHudStats}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${
            !showHudStats
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600 ring-2 ring-slate-400'
              : 'bg-slate-900/95 hover:bg-slate-900 text-white border border-slate-700/80'
          }`}
          title={
            showHudStats
              ? 'Ocultar niveles, total de preguntas y punteo general'
              : 'Mostrar niveles, total de preguntas y punteo general'
          }
        >
          {showHudStats ? (
            <Eye className="w-4 h-4 text-emerald-400" />
          ) : (
            <EyeOff className="w-4 h-4 text-slate-400" />
          )}
        </motion.button>

        {/* Drawer Toggle: Only arrow button */}
        <motion.button
          layout
          onClick={() => {
            setIsOpen(!isOpen);
            setIsViewSpeedDialOpen(false);
            setIsCeremonyConfigOpen(false);
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white flex items-center justify-center shadow-2xl backdrop-blur-md border border-slate-700/80 transition-all hover:scale-110 active:scale-95 cursor-pointer"
          title={isOpen ? 'Ocultar panel de herramientas' : 'Más herramientas y controles'}
        >
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-slate-200" />
          ) : (
            <ChevronUp className="w-4 h-4 text-indigo-400 animate-bounce" />
          )}
        </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expandable Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="pointer-events-auto w-full max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/80 rounded-t-3xl shadow-2xl p-4 sm:p-5 text-white max-h-[85vh] overflow-y-auto"
          >
            {/* Drawer Header with Sync Status Indicator */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 mb-3 gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                    isSyncPaused
                      ? 'bg-rose-950/80 border-rose-700/60'
                      : 'bg-slate-800/80 border-slate-700'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full inline-block ${
                      isSyncPaused ? 'bg-rose-400 animate-ping' : 'bg-emerald-400 animate-ping'
                    }`}
                  />
                  <span
                    className={`text-xs font-semibold ${
                      isSyncPaused ? 'text-rose-300' : 'text-emerald-300'
                    }`}
                  >
                    {isSyncPaused
                      ? 'Sincronización PAUSADA (Posiciones Aleatorias)'
                      : 'Actualizando en tiempo real (cada 2s)'}
                  </span>
                </div>
              </div>

              {/* View Mode Quick Selector inside drawer */}
              <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => onChangeViewMode('classic')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'classic'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Podio Clásico"
                >
                  Podio Clásico
                </button>
                <button
                  onClick={() => onChangeViewMode('split')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'split'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Vista Dividida"
                >
                  Dividida
                </button>
                <button
                  onClick={() => onChangeViewMode('horizontal-bars')}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'horizontal-bars'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Cards con Barras"
                >
                  Barras de Puntos
                </button>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Ocultar panel <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Action Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 mb-3">
              {/* 🏆 Winners Ceremony on Podium Button */}
              <button
                onClick={() => {
                  onToggleCeremony();
                  setIsOpen(false);
                }}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer ring-1 ring-white/60 ${
                  isCeremonyMode
                    ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 ring-2 ring-white'
                    : 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 hover:from-amber-400 hover:to-yellow-300 text-slate-950'
                }`}
                title="Iniciar o salir de la ceremonia de ganadores"
              >
                <Trophy className="w-4 h-4 fill-slate-950" />
                <span>
                  {isCeremonyMode ? 'Salir Ceremonia' : `Ganadores (#${ceremonyStartRank})`}
                </span>
              </button>

              {/* Rotate Top 3 Button */}
              <button
                onClick={onRotateTop3}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                title="Cambia las posiciones de los tres primeros"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Rotar Top 3</span>
              </button>

              {/* Pause/Resume Sync Mode */}
              <button
                onClick={onToggleSyncPause}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer ${
                  isSyncPaused
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                    : 'bg-indigo-700 hover:bg-indigo-600 text-white'
                }`}
                title="Pausar o reanudar sincronización con modo suspenso aleatorio"
              >
                {isSyncPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span>{isSyncPaused ? 'Reanudar' : 'Pausar Suspenso'}</span>
              </button>

              {/* Simulate Answer / Score Jump Button */}
              <button
                onClick={onSimulateAnswer}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                title="Simula que un participante responde y sube de posición"
              >
                <Zap className="w-4 h-4" />
                <span>Simular Resp.</span>
              </button>

              {/* Add Level Button */}
              <button
                onClick={onAddLevel}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                title="Agrega un nuevo nivel al contador superior"
              >
                <Layers className="w-4 h-4 text-indigo-200" />
                <span>+ Nivel</span>
              </button>

              {/* Add Fake Participant Button */}
              <button
                onClick={onAddFakeParticipant}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                title="Añade un nuevo participante para probar animaciones"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Participante</span>
              </button>

              {/* Simulate Waiting Mode Button */}
              {onToggleWaitingMode && (
                <button
                  onClick={onToggleWaitingMode}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer ${
                    isWaitingMode
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black ring-2 ring-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title={
                    isWaitingMode
                      ? 'Restaurar participantes'
                      : 'Simular sala en espera (Vaciar participantes)'
                  }
                >
                  <Hourglass className={`w-4 h-4 ${isWaitingMode ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span>{isWaitingMode ? 'Restaurar Lista' : 'Simular Espera'}</span>
                </button>
              )}

              {/* Simulation Loop Toggle */}
              <button
                onClick={onToggleSimulation}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer ${
                  isSimulating
                    ? 'bg-rose-700 hover:bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title="Activa o desactiva la simulación continua cada 2 segundos"
              >
                {isSimulating ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
                <span>{isSimulating ? 'Detener Auto' : 'Simular Auto'}</span>
              </button>

              {/* Install Guide */}
              <button
                onClick={onOpenInstallModal}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-all active:scale-95 col-span-2 sm:col-span-1 cursor-pointer"
                title="Cómo instalar la extensión en Google Chrome"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Cómo Instalar</span>
              </button>
            </div>

            {/* ⚡ Actualización en Tiempo Real: Niveles, Preguntas, Punteo y Participantes ⚡ */}
            {quizMeta && (
              <div className="flex flex-wrap items-center justify-between gap-2.5 px-3 py-2 mb-3 rounded-xl bg-slate-900/90 border border-indigo-500/30 text-xs">
                <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                  <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>En Tiempo Real:</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Cantidad de Niveles */}
                  <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-700/80">
                    <span className="text-slate-400 text-[11px]">Niveles:</span>
                    <span className="text-amber-300 font-black text-xs font-mono">{quizMeta.niveles}</span>
                    <button
                      onClick={onRemoveLevel}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer ml-1"
                      title="Eliminar último nivel"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={onAddLevel}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-emerald-400 cursor-pointer"
                      title="Agregar nivel dinámicamente"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Cantidad de Preguntas */}
                  <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-700/80">
                    <span className="text-slate-400 text-[11px]">Preguntas:</span>
                    <span className="text-cyan-300 font-black text-xs font-mono">{quizMeta.preguntas}</span>
                    <button
                      onClick={() => onChangeQuestions?.(-5)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-[10px] font-bold cursor-pointer ml-1"
                      title="Disminuir 5 preguntas"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => onChangeQuestions?.(5)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 text-[10px] font-bold cursor-pointer"
                      title="Aumentar 5 preguntas"
                    >
                      +5
                    </button>
                  </div>

                  {/* Punteo Máximo */}
                  <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-700/80">
                    <span className="text-slate-400 text-[11px]">Punteo Máx:</span>
                    <span className="text-emerald-300 font-black text-xs font-mono">{quizMeta.punteo} pts</span>
                    <button
                      onClick={() => onChangePunteo?.(-50)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-[10px] font-bold cursor-pointer ml-1"
                      title="Disminuir 50 puntos"
                    >
                      -50
                    </button>
                    <button
                      onClick={() => onChangePunteo?.(50)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 text-[10px] font-bold cursor-pointer"
                      title="Aumentar 50 puntos"
                    >
                      +50
                    </button>
                  </div>

                  {/* Info Participantes */}
                  <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-700/80">
                    <span className="text-slate-400 text-[11px]">Participantes:</span>
                    <span className="text-indigo-300 font-black text-xs font-mono">{totalParticipantsCount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Second Row: Search, Sede Filter, HTML Paste, Sound, Reset */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2.5 border-t border-slate-800/80 text-xs">
              {/* Search & Sede Filter */}
              <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar participante..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={selectedSede}
                    onChange={(e) => onSelectSede(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ALL">Todas las sedes</option>
                    {availableSedes.map((sede) => (
                      <option key={sede} value={sede}>
                        {sede}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Utility actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenHtmlModal}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Pegar código HTML de tu plataforma"
                >
                  <Code className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Pegar HTML</span>
                </button>

                <button
                  onClick={onToggleSound}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    soundEnabled
                      ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                      : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'
                  }`}
                  title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    if (typeof localStorage !== 'undefined') {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Limpiar localStorage y recargar"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpiar</span>
                </button>

                <button
                  onClick={onResetData}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Restablecer tabla original"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reiniciar</span>
                </button>

                <button
                  onClick={onDownloadExtension}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  title="Descargar paquete de extensión para Chrome"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📌 BOTÓN FIJO ABAJO PARA OCULTAR / MOSTRAR BURBUJAS DE HERRAMIENTAS (SOLO ICONO, SIN PARPADEO) 📌 */}
      <motion.button
        layout
        onClick={() => {
          setAreBubblesHidden((prev) => !prev);
          if (isOpen) setIsOpen(false);
          setIsViewSpeedDialOpen(false);
          setIsCeremonyConfigOpen(false);
        }}
        className={`fixed bottom-3 right-3.5 z-50 pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md transition-all active:scale-90 hover:scale-105 cursor-pointer select-none border ${
          areBubblesHidden
            ? 'bg-indigo-600 hover:bg-indigo-500 text-amber-300 border-indigo-400/80 shadow-indigo-500/40 ring-1 ring-indigo-300/40'
            : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/80 shadow-black/60'
        }`}
        title={areBubblesHidden ? 'Mostrar herramientas' : 'Ocultar herramientas'}
      >
        {areBubblesHidden ? (
          <Wrench className="w-4 h-4 text-amber-300" />
        ) : (
          <EyeOff className="w-4 h-4 text-slate-400" />
        )}
      </motion.button>

      {/* 🔄 External API Sync Button - Outside the bubbles */}
      <motion.button
        layout
        onClick={onSyncWithApi}
        disabled={isSyncingWithApi}
        className={`fixed bottom-20 right-3.5 z-50 pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md transition-all active:scale-90 hover:scale-105 cursor-pointer select-none border ${
          isSyncingWithApi
            ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed border-slate-600'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400 shadow-emerald-600/40 ring-1 ring-emerald-300/40'
        }`}
        title="Sincronizar con API externa"
      >
        <RefreshCw className={`w-5 h-5 ${isSyncingWithApi ? 'animate-spin' : ''}`} />
      </motion.button>
    </div>
  );
};
