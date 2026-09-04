import { AppSettings, Participant, QuizMeta } from '../types';

const STORAGE_KEYS = {
  PARTICIPANTS: 'leaderboard_participants',
  SETTINGS: 'leaderboard_settings',
  HTML_SOURCE: 'leaderboard_html_source',
  QUIZ_META: 'leaderboard_quiz_meta',
  LAST_UPDATE: 'leaderboard_last_update',
  HISTORY: 'leaderboard_history',
  API_PARTICIPANTS_HASH: 'leaderboard_api_participants_hash',
  API_QUIZ_META_HASH: 'leaderboard_api_quiz_meta_hash',
};

// Check if Chrome Extension storage API is available
export const isChromeExtension = (): boolean => {
  return (
    typeof chrome !== 'undefined' &&
    Boolean(chrome.storage) &&
    Boolean(chrome.storage.local)
  );
};

async function getItem<T>(key: string, defaultValue: T): Promise<T> {
  if (isChromeExtension()) {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get([key], (result) => {
          if (chrome.runtime.lastError || result[key] === undefined) {
            resolve(defaultValue);
          } else {
            resolve(result[key] as T);
          }
        });
      } catch {
        resolve(defaultValue);
      }
    });
  } else {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }
}

async function setItem<T>(key: string, value: T): Promise<void> {
  if (isChromeExtension()) {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.set({ [key]: value }, () => {
          resolve();
        });
      } catch {
        resolve();
      }
    });
  } else {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage might be full or blocked
    }
  }
}

async function removeItem(key: string): Promise<void> {
  if (isChromeExtension()) {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.remove([key], () => resolve());
      } catch {
        resolve();
      }
    });
  } else {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore
    }
  }
}

export const storageAdapter = {
  get: getItem,
  set: setItem,
  remove: removeItem,

  // Helpers for specific app entities
  async getParticipants(defaultList: Participant[] = []): Promise<Participant[]> {
    return getItem<Participant[]>(STORAGE_KEYS.PARTICIPANTS, defaultList);
  },

  async saveParticipants(participants: Participant[]): Promise<void> {
    await setItem(STORAGE_KEYS.PARTICIPANTS, participants);
    await setItem(STORAGE_KEYS.LAST_UPDATE, Date.now());
  },

  async getSettings(defaultSettings: AppSettings): Promise<AppSettings> {
    const saved = await getItem<Partial<AppSettings>>(STORAGE_KEYS.SETTINGS, {});
    return { ...defaultSettings, ...saved };
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    await setItem(STORAGE_KEYS.SETTINGS, settings);
  },

  async getHtmlSource(defaultHtml: string): Promise<string> {
    return getItem<string>(STORAGE_KEYS.HTML_SOURCE, defaultHtml);
  },

  async saveHtmlSource(html: string): Promise<void> {
    await setItem(STORAGE_KEYS.HTML_SOURCE, html);
  },

  async getQuizMeta(defaultMeta: QuizMeta): Promise<QuizMeta> {
    return getItem<QuizMeta>(STORAGE_KEYS.QUIZ_META, defaultMeta);
  },

  async saveQuizMeta(meta: QuizMeta): Promise<void> {
    await setItem(STORAGE_KEYS.QUIZ_META, meta);
  },

  async getApiParticipantsHash(): Promise<string | null> {
    return getItem<string | null>(STORAGE_KEYS.API_PARTICIPANTS_HASH, null);
  },

  async saveApiParticipantsHash(hash: string): Promise<void> {
    await setItem(STORAGE_KEYS.API_PARTICIPANTS_HASH, hash);
  },

  async getApiQuizMetaHash(): Promise<string | null> {
    return getItem<string | null>(STORAGE_KEYS.API_QUIZ_META_HASH, null);
  },

  async saveApiQuizMetaHash(hash: string): Promise<void> {
    await setItem(STORAGE_KEYS.API_QUIZ_META_HASH, hash);
  },

  // Helper to generate hash of participants array (for change detection)
  computeParticipantsHash(participants: Participant[]): string {
    // Create a hash based on key fields that change
    const hashData = participants.map(p => ({
      id: p.id,
      rank: p.rank,
      puntos: p.puntos,
      tiempo: p.tiempo,
      correctas: p.correctas,
      avance: p.avance,
      status: p.status
    }));
    return JSON.stringify(hashData);
  },

  // Helper to generate hash of quiz meta (for change detection)
  computeQuizMetaHash(meta: QuizMeta): string {
    return JSON.stringify({
      niveles: meta.niveles,
      preguntas: meta.preguntas,
      punteo: meta.punteo
    });
  },
};
