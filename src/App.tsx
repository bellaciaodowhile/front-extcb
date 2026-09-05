import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Trophy,
} from 'lucide-react';
import { Participant, QuizMeta, LeaderboardViewMode } from './types';
import { Podium } from './components/Podium';
import { LeaderboardItem } from './components/LeaderboardItem';
import { HorizontalScoreBarsView } from './components/HorizontalScoreBarsView';
import { ConnectionsBackground } from './components/ConnectionsBackground';
import { FloatingQuizStats } from './components/FloatingQuizStats';
import { FloatingLevelBubbles } from './components/FloatingLevelBubbles';
import { SuspenseCardsStreamView } from './components/SuspenseCardsStreamView';
import { FooterControlsDrawer } from './components/FooterControlsDrawer';
import { HtmlLiveEditorModal } from './components/HtmlLiveEditorModal';
import { ExtensionGuideModal } from './components/ExtensionGuideModal';
import { WaitingForParticipantsView } from './components/WaitingForParticipantsView';
import {
  INITIAL_RAW_HTML,
  parseLeaderboardHtml,
  simulateIncrementalUpdate,
  simulateRankJump,
} from './utils/htmlParser';
import { soundEffects } from './utils/audio';
import { storageAdapter, isChromeExtension } from './utils/storage';
import { fetchParticipants } from './utils/api';
import JSZip from 'jszip';
const FAKE_NAMES = [
  'Valentina Rojas',
  'Mateo Morales',
  'Santiago Gómez',
  'Camila Fernández',
  'Daniela Mendoza',
  'Lucía Benítez',
  'Alejandro Silva',
  'Esteban Navarro',
  'Mariana Castillo',
  'Nicolás Vargas',
  'Sofía Paredes',
  'Gabriel Ortiz',
];

const FAKE_SEDES = [
  'PIAR',
  'LUGAR1',
  'LUGAR2',
  'CENTRAL',
  'NORTE',
  'OCCIDENTE',
];

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [quizMeta, setQuizMeta] = useState<QuizMeta>({
    niveles: '1,2',
    preguntas: 20,
    punteo: 250,
  });
  const [rawHtml, setRawHtml] = useState<string>(INITIAL_RAW_HTML);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);
  const [isExtensionGuideOpen, setIsExtensionGuideOpen] = useState(false);
  const [isCeremonyMode, setIsCeremonyMode] = useState(false);
  const [ceremonyStep, setCeremonyStep] = useState(3);
  const [ceremonyStartRank, setCeremonyStartRank] = useState<number>(5);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSyncPaused, setIsSyncPaused] = useState(false);
  const [viewMode, setViewMode] = useState<LeaderboardViewMode>('classic');
  const [showHudStats, setShowHudStats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSede, setSelectedSede] = useState('ALL');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<number>(Date.now());
  const [participantsBackup, setParticipantsBackup] = useState<Participant[]>([]);
  const [apiLastUpdated, setApiLastUpdated] = useState<number | null>(null);
  const [apiError, setApiError] = useState<boolean>(false);

  // Track previous participants map for audio and visual delta detection
  const previousMapRef = useRef<Map<string, Participant>>(new Map());
  const isFirstLoadRef = useRef(true);

  // Sync sound settings
  useEffect(() => {
    soundEffects.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Initial Load - Start with empty participants list (waiting for API or manual sync)
  useEffect(() => {
    const initialize = async () => {
      // Start with empty participants to show "Waiting for participants" view
      setParticipants([]);
      
      // Try to load saved HTML and meta from storage for fallback
      const savedHtml = await storageAdapter.getHtmlSource(INITIAL_RAW_HTML);
      setRawHtml(savedHtml);
      
      const savedMeta = await storageAdapter.getQuizMeta(quizMeta);
      if (savedMeta) {
        setQuizMeta(savedMeta);
      }

      // Populate empty reference map
      previousMapRef.current = new Map<string, Participant>();

      isFirstLoadRef.current = false;
    };

    initialize();
  }, []);

  // Real-time API polling every 2 seconds
  useEffect(() => {
    if (isSyncPaused) return;

    const checkForApiUpdates = async () => {
      try {
        const { participants: apiParticipants, quizMeta: apiMeta } = await fetchParticipants();
        
        if (apiParticipants && apiParticipants.length > 0) {
          // Sort by points (descending) and assign ranks
          const sorted = [...apiParticipants].sort((a, b) => {
            if (b.puntos !== a.puntos) return b.puntos - a.puntos;
            return a.tiempo.localeCompare(b.tiempo);
          });
          
          const ranked = sorted.map((p, i) => ({
            ...p,
            rank: i + 1,
          }));
          
          // Check if participants hash changed
          const currentParticipantsHash = storageAdapter.getApiParticipantsHash();
          const newParticipantsHash = storageAdapter.computeParticipantsHash(ranked);
          
          // Check if quizMeta hash changed
          const currentQuizMetaHash = storageAdapter.getApiQuizMetaHash();
          const newQuizMetaHash = storageAdapter.computeQuizMetaHash(apiMeta);
          
          // Only update if hash changed to avoid parpadeo
          if (newParticipantsHash !== currentParticipantsHash || newQuizMetaHash !== currentQuizMetaHash) {
            applyParticipantUpdates(ranked, apiMeta);
            
            // Save the new hashes
            storageAdapter.saveApiParticipantsHash(newParticipantsHash);
            storageAdapter.saveApiQuizMetaHash(newQuizMetaHash);
            
            console.log('API data updated:', ranked.length, 'participants');
          } else {
            console.log('API data unchanged, skipping update');
          }
        }
      } catch (error) {
        console.warn('API polling failed:', error);
      }
    };

    const interval = setInterval(checkForApiUpdates, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [isSyncPaused]);

  // Process incoming participant updates and play corresponding sounds
  const applyParticipantUpdates = (newList: Participant[], meta?: QuizMeta) => {
    if (meta) {
      setQuizMeta(meta);
      storageAdapter.saveQuizMeta(meta);
    }
    setLastUpdatedTime(Date.now());

    if (isFirstLoadRef.current) {
      setParticipants(newList);
      return;
    }

    let hasNewContestant = false;
    let hasJustFinished = false;

    const currentMap = previousMapRef.current;
    const nextMap = new Map<string, Participant>();

    const markedList = newList.map((p) => {
      const prev = currentMap.get(p.id);
      let isNew = false;
      let justFinished = false;

      if (!prev) {
        isNew = true;
        hasNewContestant = true;
      } else if (prev.status === 'in_progress' && p.status === 'finished') {
        justFinished = true;
        hasJustFinished = true;
      }

      const itemWithFlags: Participant = {
        ...p,
        isNew,
        justFinished,
      };

      nextMap.set(p.id, itemWithFlags);
      return itemWithFlags;
    });

    previousMapRef.current = nextMap;
    setParticipants(markedList);

    // Trigger sounds (No confetti)
    if (hasJustFinished) {
      soundEffects.playFinishVictory();
    } else if (hasNewContestant) {
      soundEffects.playNewParticipant();
    }

    // Persist to local storage
    storageAdapter.saveParticipants(markedList);
  };

  // Toggle Sync Pause & Suspense Mode
  const handleToggleSyncPause = () => {
    if (isSyncPaused) {
      // Unpausing: Restore authentic deterministic ordering by real points and time
      setIsSyncPaused(false);
      setParticipants((prev) => {
        const sorted = [...prev].sort((a, b) => {
          if (b.puntos !== a.puntos) return b.puntos - a.puntos;
          return a.tiempo.localeCompare(b.tiempo);
        });
        const reRanked = sorted.map((p, i) => ({
          ...p,
          rank: i + 1,
        }));
        soundEffects.playFinishVictory();
        storageAdapter.saveParticipants(reRanked);
        return reRanked;
      });
    } else {
      // Pausing: Turn on floating bubbles orbit mode
      setIsSyncPaused(true);
      soundEffects.playTick();
    }
  };

  // Rotate Top 3 Participants to showcase dramatic podium animation
  const handleRotateTop3 = () => {
    setParticipants((prev) => {
      if (prev.length < 2) return prev;

      const sorted = [...prev].sort((a, b) => {
        if (b.puntos !== a.puntos) return b.puntos - a.puntos;
        return a.tiempo.localeCompare(b.tiempo);
      });

      if (sorted.length >= 3) {
        // Cycle: 2nd becomes 1st, 3rd becomes 2nd, 1st becomes 3rd
        const first = sorted[0];
        const second = sorted[1];
        const third = sorted[2];

        const topPoints = Math.max(first.puntos, second.puntos, third.puntos) + 10;
        const midPoints = topPoints - 15;
        const lowPoints = midPoints - 15;

        const newFirst = { ...second, puntos: topPoints, rank: 1 };
        const newSecond = { ...third, puntos: midPoints, rank: 2 };
        const newThird = { ...first, puntos: Math.max(10, lowPoints), rank: 3 };

        const rest = sorted.slice(3).map((p, i) => ({ ...p, rank: i + 4 }));
        const rotated = [newFirst, newSecond, newThird, ...rest];

        soundEffects.playFinishVictory();
        storageAdapter.saveParticipants(rotated);
        return rotated;
      } else if (sorted.length === 2) {
        // Swap 1st and 2nd
        const first = sorted[0];
        const second = sorted[1];
        const newFirst = { ...second, puntos: first.puntos + 10, rank: 1 };
        const newSecond = { ...first, rank: 2 };
        const rotated = [newFirst, newSecond];
        soundEffects.playFinishVictory();
        storageAdapter.saveParticipants(rotated);
        return rotated;
      }
      return prev;
    });
  };

  // Toggle Waiting Mode (clearing list to simulate waiting for participants, or restoring previous list)
  const handleToggleWaitingMode = () => {
    if (participants.length > 0) {
      setParticipantsBackup(participants);
      setParticipants([]);
      soundEffects.playTick();
    } else {
      if (participantsBackup.length > 0) {
        setParticipants(participantsBackup);
      } else {
        const parsed = parseLeaderboardHtml(rawHtml || INITIAL_RAW_HTML);
        setParticipants(parsed.participants);
      }
      soundEffects.playNewParticipant();
    }
  };

  // Synchronize participants totalQuestions when quizMeta.preguntas updates in real time
  useEffect(() => {
    if (quizMeta.preguntas) {
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          totalQuestions: quizMeta.preguntas,
        }))
      );
    }
  }, [quizMeta.preguntas]);

  // Initial API fetch on mount (only once at start)
  useEffect(() => {
    const fetchFromApi = async () => {
      try {
        const { participants: apiParticipants, quizMeta: apiMeta } = await fetchParticipants();
        
        if (apiParticipants && apiParticipants.length > 0) {
          // Sort by points (descending) and assign ranks
          const sorted = [...apiParticipants].sort((a, b) => {
            if (b.puntos !== a.puntos) return b.puntos - a.puntos;
            return a.tiempo.localeCompare(b.tiempo);
          });
          
          const ranked = sorted.map((p, i) => ({
            ...p,
            rank: i + 1,
          }));
          
          applyParticipantUpdates(ranked, apiMeta);
          console.log('API data loaded:', ranked.length, 'participants');
        }
      } catch (error) {
        console.log('API not available, will use storage:', error);
      }
    };

    fetchFromApi();
  }, []);

  // Real-time synchronization loop and Chrome Extension listeners
  useEffect(() => {
    if (isSyncPaused) return;

    const checkForUpdates = async () => {
      const latestHtml = await storageAdapter.getHtmlSource(rawHtml);
      const latestMeta = await storageAdapter.getQuizMeta(quizMeta);

      if (latestHtml && latestHtml !== rawHtml) {
        setRawHtml(latestHtml);
        const parsed = parseLeaderboardHtml(latestHtml);
        applyParticipantUpdates(parsed.participants, parsed.quizMeta || latestMeta);
      } else if (
        latestMeta &&
        (latestMeta.niveles !== quizMeta.niveles ||
          latestMeta.preguntas !== quizMeta.preguntas ||
          latestMeta.punteo !== quizMeta.punteo)
      ) {
        setQuizMeta(latestMeta);
        setLastUpdatedTime(Date.now());
      }
    };

    const interval = setInterval(checkForUpdates, 1500);

    // Chrome Extension runtime message listener for immediate real-time push
    const handleExtensionMessage = (message: any) => {
      if (message && message.type === 'LEADERBOARD_DOM_UPDATED') {
        checkForUpdates();
      }
    };

    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      chrome.runtime.onMessage.addListener(handleExtensionMessage);
    }

    // Chrome storage change listener
    const handleStorageChange = (changes: any, areaName: string) => {
      if (areaName === 'local') {
        if (changes.leaderboard_html_source || changes.leaderboard_quiz_meta) {
          checkForUpdates();
        }
      }
    };

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener(handleStorageChange);
    }

    return () => {
      clearInterval(interval);
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.onMessage.removeListener(handleExtensionMessage);
      }
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      }
    };
  }, [rawHtml, quizMeta, isSyncPaused]);

  // Active Simulation Loop when isSimulating is ON (every 2 seconds)
  useEffect(() => {
    if (!isSimulating) return;

    const simInterval = setInterval(() => {
      setParticipants((prev) => {
        const { updatedList, newParticipantAdded, participantJustFinished } =
          simulateIncrementalUpdate(prev);

        if (participantJustFinished) {
          soundEffects.playFinishVictory();
        } else if (newParticipantAdded) {
          soundEffects.playNewParticipant();
        } else {
          soundEffects.playTick();
        }

        setLastUpdatedTime(Date.now());
        storageAdapter.saveParticipants(updatedList);
        return updatedList;
      });
    }, 2000);

    return () => clearInterval(simInterval);
  }, [isSimulating]);

  // Handler to simulate single participant answer / rank climb
  const handleSimulateAnswer = () => {
    const { updatedList } = simulateRankJump(participants);
    setParticipants(updatedList);
    setLastUpdatedTime(Date.now());
    soundEffects.playFinishVictory();
    storageAdapter.saveParticipants(updatedList);
  };

  // Handler to add a level dynamically in real time (e.g., "1,2" -> "1,2,3")
  const handleAddLevel = () => {
    setQuizMeta((prev) => {
      const currentLevels = prev.niveles
        ? prev.niveles.split(',').map((s) => s.trim()).filter(Boolean)
        : ['1'];

      // Find highest level number and add +1
      const numericLevels = currentLevels
        .map((l) => parseInt(l, 10))
        .filter((n) => !isNaN(n));
      const nextNum = numericLevels.length > 0 ? Math.max(...numericLevels) + 1 : currentLevels.length + 1;

      const newLevelsStr = `${prev.niveles},${nextNum}`;
      soundEffects.playTick();
      return {
        ...prev,
        niveles: newLevelsStr,
      };
    });
  };

  // Handler to remove highest level dynamically in real time
  const handleRemoveLevel = () => {
    setQuizMeta((prev) => {
      const currentLevels = prev.niveles
        ? prev.niveles.split(',').map((s) => s.trim()).filter(Boolean)
        : ['1'];
      if (currentLevels.length <= 1) return prev;
      const newLevelsStr = currentLevels.slice(0, -1).join(',');
      soundEffects.playTick();
      return {
        ...prev,
        niveles: newLevelsStr,
      };
    });
  };

  // Handler to change question count dynamically in real time
  const handleChangeQuestions = (delta: number) => {
    setQuizMeta((prev) => {
      const newCount = Math.max(5, prev.preguntas + delta);
      soundEffects.playTick();
      return {
        ...prev,
        preguntas: newCount,
      };
    });
  };

  // Handler to change max possible score in real time
  const handleChangePunteo = (delta: number) => {
    setQuizMeta((prev) => {
      const newPunteo = Math.max(50, prev.punteo + delta);
      soundEffects.playTick();
      return {
        ...prev,
        punteo: newPunteo,
      };
    });
  };

  // Add Fake Participant Handler
  const handleAddFakeParticipant = () => {
    const randomName = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
    const randomSede = FAKE_SEDES[Math.floor(Math.random() * FAKE_SEDES.length)];
    const randomPoints = Math.floor(Math.random() * 60) + 40; // 40-100 pts
    const randomCorrect = Math.floor(Math.random() * 4) + 3; // 3-7
    const randomAvance = Math.min(20, randomCorrect + Math.floor(Math.random() * 3));
    const randomSeconds = String(Math.floor(Math.random() * 45) + 15).padStart(2, '0');
    const randomTime = `00:00:${randomSeconds}.${Math.floor(Math.random() * 900 + 100)}`;

    const newGuy: Participant = {
      id: `fake-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      rank: 1, // will be recalculated
      avatarUrl: '',
      avatarTitle: '',
      userName: randomName,
      sede: randomSede,
      correctas: randomCorrect,
      puntos: randomPoints,
      tiempo: randomTime,
      avance: randomAvance,
      status: randomAvance >= 20 ? 'finished' : 'in_progress',
      isNew: true,
      rankChange: 0,
      lastUpdated: Date.now(),
    };

    const combined = [...participants, newGuy];
    // Sort descending by puntos
    combined.sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      return a.tiempo.localeCompare(b.tiempo);
    });

    const recalculated = combined.map((p, i) => ({
      ...p,
      rank: i + 1,
    }));

    setParticipants(recalculated);
    setLastUpdatedTime(Date.now());
    soundEffects.playNewParticipant();
    storageAdapter.saveParticipants(recalculated);
  };

  // Reset to initial HTML data
  const handleResetData = () => {
    const parsed = parseLeaderboardHtml(INITIAL_RAW_HTML);
    setRawHtml(INITIAL_RAW_HTML);
    setParticipants(parsed.participants);
    if (parsed.quizMeta) {
      setQuizMeta(parsed.quizMeta);
    }
    setLastUpdatedTime(Date.now());
    storageAdapter.saveHtmlSource(INITIAL_RAW_HTML);
    storageAdapter.saveParticipants(parsed.participants);
    soundEffects.playTick();
  };

  // Sync with API
  const [isSyncingWithApi, setIsSyncingWithApi] = useState(false);
  
  const handleSyncWithApi = async () => {
    setIsSyncingWithApi(true);
    try {
      const { participants: apiParticipants, quizMeta: apiMeta } = await fetchParticipants();
      
      if (apiParticipants && apiParticipants.length > 0) {
        // Sort by points (descending) and assign ranks
        const sorted = [...apiParticipants].sort((a, b) => {
          if (b.puntos !== a.puntos) return b.puntos - a.puntos;
          return a.tiempo.localeCompare(b.tiempo);
        });
        
        const ranked = sorted.map((p, i) => ({
          ...p,
          rank: i + 1,
        }));
        
        setParticipants(ranked);
        setLastUpdatedTime(Date.now());
        
        if (apiMeta) {
          setQuizMeta(apiMeta);
        }
        
        // Save to storage
        storageAdapter.saveParticipants(ranked);
        if (apiMeta) {
          storageAdapter.saveQuizMeta(apiMeta);
        }
        
        soundEffects.playNewParticipant();
      }
    } catch (error) {
      console.error('Failed to sync with API:', error);
      // Show error to user (could add a toast notification here)
    } finally {
      setIsSyncingWithApi(false);
    }
  };

  // Ceremony handlers (Top N starting from custom rank on the Podium)
  const handleStartCeremonyWithRank = (rank: number) => {
    setCeremonyStartRank(rank);
    setIsCeremonyMode(true);
    setIsSyncPaused(false);
    setCeremonyStep(0);
    setTimeout(() => {
      setCeremonyStep(1);
    }, 700);
  };

  const handleToggleCeremony = () => {
    if (!isCeremonyMode) {
      handleStartCeremonyWithRank(ceremonyStartRank);
    } else {
      setIsCeremonyMode(false);
    }
  };

  const handleNextCeremonyStep = () => {
    if (ceremonyStep < ceremonyStartRank) {
      setCeremonyStep((prev) => prev + 1);
    }
  };

  const handleRestartCeremony = () => {
    setCeremonyStep(0);
    setTimeout(() => {
      setCeremonyStep(1);
    }, 700);
  };

  const handleExitCeremony = () => {
    setIsCeremonyMode(false);
  };

  // Handle saving modified HTML from modal
  const handleSaveHtml = async (newHtml: string) => {
    setRawHtml(newHtml);
    await storageAdapter.saveHtmlSource(newHtml);
    const parsed = parseLeaderboardHtml(newHtml);
    applyParticipantUpdates(parsed.participants, parsed.quizMeta);
  };

  // Download Chrome Extension Files
  /*const handleDownloadExtension = () => {
    const readmeContent = `=== LEADERBOARD PRO - EXTENSIÓN CHROME ===
Para instalar esta extensión en Google Chrome:
1. Abre Google Chrome y ve a chrome://extensions/
2. Activa el "Modo de desarrollador" en la esquina superior derecha.
3. Haz clic en "Cargar descomprimida" (Load unpacked).
4. Selecciona la carpeta 'dist' del proyecto compilado con 'npm run build'.
5. ¡Listo! La extensión inspeccionará automáticamente cada 2s la tabla #table-5-column o <p id="GridResultados">.
`;
    const blob = new Blob([readmeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Instrucciones_Extension_Chrome.txt';
    a.click();
    URL.revokeObjectURL(url);
  };
*/



const handleDownloadExtension = async () => {
  try {
    const zip = new JSZip();
    
    // Lista los archivos que componen tu extensión dentro de public/extcb/
    // (Ajusta o añade aquí los nombres reales de los archivos que tengas en esa carpeta)
    const filesToZip = [
      'manifest.json',
      'content.js'
    ];

    // Descargamos cada archivo desde la carpeta pública de forma paralela
    const fetchPromises = filesToZip.map(async (filename) => {
      try {
        const response = await fetch(`/extcb/${filename}`);
        if (!response.ok) return; // Si algún archivo opcional no existe, lo ignora
        
        // Dependiendo del archivo, puede ser texto o binario (como imágenes o iconos)
        const isBinary = filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.ico');
        const content = isBinary ? await response.blob() : await response.text();
        
        zip.file(filename, content);
      } catch (err) {
        console.warn(`No se pudo cargar el archivo ${filename} para el ZIP:`, err);
      }
    });

    await Promise.all(fetchPromises);

    // Añadimos también un archivo README opcional dentro del ZIP con las instrucciones
    const readmeContent = `=== LEADERBOARD PRO - EXTENSIÓN CHROME ===
Para instalar esta extensión en Google Chrome:
1. Abre Google Chrome y ve a chrome://extensions/
2. Activa el "Modo de desarrollador" en la esquina superior derecha.
3. Haz clic en "Cargar descomprimida" (Load unpacked).
4. Selecciona esta carpeta descomprimida.
5. ¡Listo! La extensión inspeccionará automáticamente cada 2s la tabla #table-5-column o <p id="GridResultados">.
`;
    zip.file('Instrucciones.txt', readmeContent);

    // Generamos el archivo ZIP y disparamos la descarga
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LeaderboardPro_Extension.zip';
    a.click();
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error al generar el archivo ZIP de la extensión:', error);
  }
};
  // Extract unique sedes list
  const availableSedes = useMemo(() => {
    const set = new Set<string>();
    participants.forEach((p) => {
      if (p.sede) set.add(p.sede);
    });
    return Array.from(set);
  }, [participants]);

  // Filter and Sort Participants
  const filteredParticipants = useMemo(() => {
    let list = [...participants];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) => p.userName.toLowerCase().includes(q) || p.sede.toLowerCase().includes(q)
      );
    }

    if (selectedSede !== 'ALL') {
      list = list.filter((p) => p.sede === selectedSede);
    }

    // Only sort deterministically by points if NOT in suspense paused mode
    if (!isSyncPaused) {
      list.sort((a, b) => {
        if (b.puntos !== a.puntos) return b.puntos - a.puntos;
        return a.tiempo.localeCompare(b.tiempo);
      });
    }

    return list;
  }, [participants, searchQuery, selectedSede, isSyncPaused]);

  // Split Top 3 and rest
  const topThree = useMemo(() => {
    return filteredParticipants.slice(0, 3);
  }, [filteredParticipants]);

  const remainingParticipants = useMemo(() => {
    return filteredParticipants.slice(3);
  }, [filteredParticipants]);

  return (
    <div className="min-h-screen text-slate-800 flex flex-col font-['Outfit',sans-serif] relative pb-20 overflow-x-hidden">
      {/* Blue and White Connection Node Network Background */}
      <ConnectionsBackground />

      {/* Floating Header Stats in Top Right: Preguntas, Punteo (only when participants exist) */}
      <AnimatePresence>
        {showHudStats && filteredParticipants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          >
            <FloatingQuizStats quizMeta={quizMeta} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Level Bubbles on the Left Margin (only when participants exist) */}
      <AnimatePresence>
        {showHudStats && filteredParticipants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -30, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.8 }}
            transition={{ duration: 0.25 }}
          >
            <FloatingLevelBubbles niveles={quizMeta.niveles || '1'} onAddLevel={handleAddLevel} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 w-full mx-auto px-2 sm:px-4 pt-2 sm:pt-4 pb-2 z-10 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {filteredParticipants.length === 0 ? (
            /* ⏳ PANTALLA ENORME: ESPERANDO PARTICIPANTES (SOLO TEXTO Y METADATA) ⏳ */
            <motion.div
              key="waiting-for-participants-view"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full flex items-center justify-center py-6 sm:py-12"
            >
              <WaitingForParticipantsView quizMeta={quizMeta} />
            </motion.div>
          ) : isSyncPaused ? (
            /* Suspense Cards Stream & Slider View in Tension/Paused Mode */
            <motion.div
              key="paused-suspense-stream"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full max-w-6xl"
            >
              <SuspenseCardsStreamView participants={filteredParticipants} />
            </motion.div>
          ) : isCeremonyMode ? (
            /* 🏆 CEREMONY MODE: Focused Podium with Real Bars, Lower Cards Hidden 🏆 */
            <motion.div
              key="ceremony-mode-view"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-4"
            >
              <Podium
                topParticipants={filteredParticipants}
                isCeremonyMode={true}
                ceremonyStep={ceremonyStep}
                ceremonyStartRank={ceremonyStartRank}
                onNextCeremonyStep={handleNextCeremonyStep}
                onRestartCeremony={handleRestartCeremony}
                onExitCeremony={handleExitCeremony}
              />
            </motion.div>
          ) : viewMode === 'horizontal-bars' ? (
            /* 📊 HORIZONTAL SCORE BARS VIEW 📊 */
            <motion.div
              key="horizontal-bars-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <HorizontalScoreBarsView
                participants={filteredParticipants}
                maxPossiblePoints={quizMeta.punteo}
              />
            </motion.div>
          ) : (
            /* Ranked View: Single column or 2 Centered Columns */
            <motion.div
              key={viewMode === 'split' ? 'split-leaderboard-view' : 'classic-leaderboard-view'}
              initial={{ opacity: 0, scale: 0.85, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.85, rotateY: -90 }}
              transition={{
                type: 'spring',
                stiffness: 240,
                damping: 22,
                duration: 0.55,
              }}
              style={{ perspective: 1200 }}
              className="w-full flex items-center justify-center"
            >
              {viewMode === 'split' ? (
                /* Two-Column Centered Split Layout */
                <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 py-2">
                  {/* Left Column: Podium perfectly centered */}
                  {topThree.length > 0 && (
                    <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
                      <Podium topParticipants={topThree} />
                    </div>
                  )}

                  {/* Right Column: Remaining Contestants List (#4 onwards) */}
                  <div className="w-full lg:w-1/2 max-w-xl flex flex-col justify-center">
                    {remainingParticipants.length > 0 && (
                      <div className="flex items-center justify-between px-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white drop-shadow font-['Fredoka',sans-serif] flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-white" />
                            Posiciones siguientes (#4+)
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-white/90 text-indigo-950 shadow-xs">
                            {remainingParticipants.length}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Cards List */}
                    {remainingParticipants.length > 0 ? (
                      <motion.div layout className="space-y-2">
                        <AnimatePresence>
                          {remainingParticipants.map((p) => (
                            <LeaderboardItem key={p.id} participant={p} />
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    ) : topThree.length === 0 ? (
                      <div className="flex-1 min-h-[160px] flex flex-col items-center justify-center p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/60 text-center shadow-lg">
                        <Trophy className="w-10 h-10 text-indigo-300 mb-2" />
                        <p className="text-sm font-bold text-slate-800 font-['Fredoka',sans-serif]">
                          Sin participantes para mostrar
                        </p>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm">
                          Abre las herramientas inferiores para añadir participantes o simular respuestas.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                /* Classic Vertical Layout */
                <div className="w-full max-w-4xl mx-auto flex flex-col">
                  {/* Top 3 3D Podium matching reference design */}
                  {topThree.length > 0 && (
                    <div className="w-full">
                      <Podium topParticipants={topThree} />
                    </div>
                  )}

                  {/* Remaining Contestants List (#4 onwards) */}
                  <div className="w-full mt-2 sm:mt-3 flex-1 flex flex-col">
                    {remainingParticipants.length > 0 && (
                      <div className="flex items-center justify-between px-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white drop-shadow font-['Fredoka',sans-serif] flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-white" />
                            Posiciones siguientes (#4+)
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-white/90 text-indigo-950 shadow-xs">
                            {remainingParticipants.length}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Cards List without dark borders and non-clickable */}
                    {remainingParticipants.length > 0 ? (
                      <motion.div layout className="space-y-1.5 sm:space-y-2">
                        <AnimatePresence>
                          {remainingParticipants.map((p) => (
                            <LeaderboardItem key={p.id} participant={p} />
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    ) : topThree.length === 0 ? (
                      <div className="flex-1 min-h-[160px] flex flex-col items-center justify-center p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-white/60 text-center shadow-lg">
                        <Trophy className="w-10 h-10 text-indigo-300 mb-2" />
                        <p className="text-sm font-bold text-slate-800 font-['Fredoka',sans-serif]">
                          Sin participantes para mostrar
                        </p>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm">
                          Abre las herramientas inferiores para añadir participantes o simular respuestas.
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Fixed Bottom Drawer with Arrow Toggle containing all Tools */}
      <FooterControlsDrawer
        onAddFakeParticipant={handleAddFakeParticipant}
        onSimulateAnswer={handleSimulateAnswer}
        onRotateTop3={handleRotateTop3}
        isSyncPaused={isSyncPaused}
        onToggleSyncPause={handleToggleSyncPause}
        isWaitingMode={filteredParticipants.length === 0}
        onToggleWaitingMode={handleToggleWaitingMode}
        viewMode={viewMode}
        onChangeViewMode={(mode) => {
          setViewMode(mode);
          soundEffects.playTick();
        }}
        ceremonyStartRank={ceremonyStartRank}
        onChangeCeremonyStartRank={setCeremonyStartRank}
        onStartCeremonyWithRank={handleStartCeremonyWithRank}
        totalParticipantsCount={filteredParticipants.length}
        showHudStats={showHudStats}
        onToggleHudStats={() => setShowHudStats(!showHudStats)}
        isCeremonyMode={isCeremonyMode}
        onToggleCeremony={handleToggleCeremony}
        onAddLevel={handleAddLevel}
        onRemoveLevel={handleRemoveLevel}
        onChangeQuestions={handleChangeQuestions}
        onChangePunteo={handleChangePunteo}
        quizMeta={quizMeta}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        onOpenHtmlModal={() => setIsHtmlModalOpen(true)}
        onOpenInstallModal={() => setIsExtensionGuideOpen(true)}
        onDownloadExtension={handleDownloadExtension}
        onSyncWithApi={handleSyncWithApi}
        isSyncingWithApi={isSyncingWithApi}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onResetData={handleResetData}
        selectedSede={selectedSede}
        onSelectSede={setSelectedSede}
        availableSedes={availableSedes}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* HTML Live Editor Modal */}
      <HtmlLiveEditorModal
        isOpen={isHtmlModalOpen}
        onClose={() => setIsHtmlModalOpen(false)}
        currentHtml={rawHtml}
        onSaveHtml={handleSaveHtml}
      />

      {/* Chrome Extension Guide Modal */}
      <ExtensionGuideModal
        isOpen={isExtensionGuideOpen}
        onClose={() => setIsExtensionGuideOpen(false)}
      />
    </div>
  );
}
