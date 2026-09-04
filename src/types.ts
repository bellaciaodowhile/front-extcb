export interface QuizMeta {
  niveles: string; // e.g. "1,2" or "1,2,3"
  preguntas: number; // e.g. 20
  punteo: number; // e.g. 250
}

export interface Participant {
  id: string;
  rank: number;
  previousRank?: number;
  rankChange?: number;
  avatarUrl?: string;
  avatarTitle?: string;
  userName: string;
  userProfileUrl?: string;
  sede: string; // Sede / Equipo (e.g. PIAR, LUGAR1, LUGAR2)
  correctas: number;
  puntos: number;
  tiempo: string; // e.g. "00:00:41.360"
  avance: number; // e.g. 20 (questions completed)
  totalQuestions?: number;
  status: 'finished' | 'in_progress';
  lastUpdated?: number;
  isNew?: boolean;
  justFinished?: boolean;
}

export interface LeaderboardStats {
  title: string;
  totalParticipants: number;
  finishedCount: number;
  inProgressCount: number;
  averageScore: number;
  topScore: number;
  lastPollTime: number;
}

export type LeaderboardViewMode = 'classic' | 'split' | 'horizontal-bars';

export interface AppSettings {
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  pollingIntervalMs: number; // default 2000
  autoPolling: boolean;
  sortBy: 'puntos' | 'correctas' | 'tiempo' | 'avance';
  filterSede: string;
  searchQuery: string;
  showPodium: boolean;
  viewMode: 'arcade' | 'table' | 'compact';
}
