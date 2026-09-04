import React, { useEffect, useState } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RefreshCw,
  Code2,
  Puzzle,
  SlidersHorizontal,
  Search,
  Trophy,
  Table,
  PlusCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { AppSettings, LeaderboardStats } from '../types';

interface HeaderBarProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  stats: LeaderboardStats;
  onManualRefresh: () => void;
  onOpenHtmlModal: () => void;
  onOpenExtensionGuide: () => void;
  onSimulateEvent: () => void;
  sedesList: string[];
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  settings,
  onUpdateSettings,
  stats,
  onManualRefresh,
  onOpenHtmlModal,
  onOpenExtensionGuide,
  onSimulateEvent,
  sedesList,
}) => {
  // Timer calculation (clock simulation)
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatClock = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `00:${m}:${s}`;
  };

  return (
    <header className="w-full max-w-5xl mx-auto mb-4 px-2 sm:px-4">
      {/* Top Arcade Title Banner (inspired by the uploaded neon title header) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-indigo-950/90 via-slate-900/90 to-slate-950/95 border-2 border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)] p-4 sm:p-5 text-center">
        {/* Glow & neon effects */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-20 bg-cyan-500/20 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Extension Badge & Status */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-xs">
              <Puzzle className="w-3.5 h-3.5 text-cyan-400" />
              Chrome Extension V3
            </span>

            {/* 2s Polling Indicator */}
            <button
              onClick={() => onUpdateSettings({ autoPolling: !settings.autoPolling })}
              title={settings.autoPolling ? 'Pausar actualización cada 2s' : 'Activar actualización cada 2s'}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                settings.autoPolling
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  settings.autoPolling ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'
                }`}
              />
              {settings.autoPolling ? 'En vivo (2s)' : 'Pausado'}
            </button>
          </div>

          {/* Action Tools: Sound, Extension Guide, HTML Editor */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Audio Toggle */}
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                settings.soundEnabled
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-800'
              }`}
              title={settings.soundEnabled ? 'Sonidos activos (Clic para silenciar)' : 'Sonidos silenciados (Clic para activar)'}
            >
              {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Simulated Live Event */}
            <button
              onClick={onSimulateEvent}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-purple-600/30 text-purple-200 border border-purple-500/50 hover:bg-purple-600/40 hover:border-purple-400 transition-all cursor-pointer shadow-xs"
              title="Simular progreso, nuevos participantes o respuestas correctas"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden sm:inline">Simular 2s</span>
            </button>

            {/* Edit / Paste HTML Modal */}
            <button
              onClick={onOpenHtmlModal}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-600/20 text-cyan-200 border border-cyan-500/40 hover:bg-cyan-600/30 transition-all cursor-pointer"
              title="Pegar código HTML de la tabla para parsear en tiempo real"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Pegar HTML</span>
            </button>

            {/* Extension Developer Guide */}
            <button
              onClick={onOpenExtensionGuide}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all cursor-pointer"
              title="Instrucciones para instalar la extensión en modo desarrollador"
            >
              <Puzzle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Instalar Extensión</span>
            </button>
          </div>
        </div>

        {/* Central Gamified Title Box */}
        <div className="py-1">
          <div className="inline-block px-6 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border-2 border-cyan-300 shadow-[0_0_20px_rgba(59,130,246,0.6)]">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black tracking-wider text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-['Fredoka',sans-serif]">
              TABLA DE CLASIFICACIÓN
            </h1>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2 text-xs sm:text-sm text-cyan-200 font-medium">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Tiempo Activo:</span>
            <span className="font-mono font-bold text-amber-300 text-sm bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700">
              {formatClock(elapsedSeconds)}
            </span>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block uppercase tracking-wider font-semibold">Participantes</span>
            <span className="text-base font-black text-white font-['Fredoka',sans-serif]">{stats.totalParticipants}</span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-emerald-400/90 text-[10px] block uppercase tracking-wider font-semibold">Completados</span>
            <span className="text-base font-black text-emerald-400 font-['Fredoka',sans-serif]">{stats.finishedCount}</span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-amber-400/90 text-[10px] block uppercase tracking-wider font-semibold">En Proceso</span>
            <span className="text-base font-black text-amber-400 font-['Fredoka',sans-serif]">{stats.inProgressCount}</span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
            <span className="text-yellow-400/90 text-[10px] block uppercase tracking-wider font-semibold">Máximo Puntaje</span>
            <span className="text-base font-black text-yellow-300 font-['Fredoka',sans-serif]">{stats.topScore} pts</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800 shadow-md">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] sm:min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar participante o equipo..."
            value={settings.searchQuery}
            onChange={(e) => onUpdateSettings({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Filter Sede */}
        <div className="flex items-center gap-1.5">
          <select
            value={settings.filterSede}
            onChange={(e) => onUpdateSettings({ filterSede: e.target.value })}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="ALL">Todas las Sedes / Equipos</option>
            {sedesList.map((sede) => (
              <option key={sede} value={sede}>
                Sede: {sede}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={settings.sortBy}
            onChange={(e) => onUpdateSettings({ sortBy: e.target.value as AppSettings['sortBy'] })}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="puntos">Ordenar por Puntos</option>
            <option value="correctas">Ordenar por Correctas</option>
            <option value="tiempo">Ordenar por Tiempo</option>
            <option value="avance">Ordenar por Avance</option>
          </select>

          {/* Toggle Podium / Table */}
          <button
            onClick={() => onUpdateSettings({ showPodium: !settings.showPodium })}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              settings.showPodium
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title={settings.showPodium ? 'Ocultar podio superior' : 'Mostrar podio superior'}
          >
            <Trophy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
