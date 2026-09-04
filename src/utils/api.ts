import { Participant, QuizMeta } from '../types';

const API_URL = 'https://api-extcb.onrender.com/api/resultados';

export interface ApiConfiguracion {
  niveles: number[];
  preguntasTotales: number;
  punteoMaximo: number;
}

export interface ApiParticipant {
  no: string;
  avatar: {
    url: string;
    title: string;
  };
  usuario: {
    nombre: string;
    perfilUrl: string;
  };
  sedeEquipo: string;
  correctas: number;
  puntos: number;
  tiempo: string;
  avance: number;
  estado: string;
}

export interface ApiResponse {
  timestamp: string;
  configuracion: ApiConfiguracion;
  totalParticipantes: number;
  participantes: ApiParticipant[];
}

export async function fetchParticipants(): Promise<{ participants: Participant[]; quizMeta?: QuizMeta }> {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    
    console.log('API response:', data);
    console.log('Participants from API:', data.participantes.map(p => ({ no: p.no, usuario: p.usuario.nombre, avance: p.avance, correctas: p.correctas })));
    console.log('Config:', data.configuracion);
    
    // Parse API participants to internal Participant format
    const participants: Participant[] = data.participantes.map((p) => ({
      id: `api-${p.avatar.title}`, // Use avatar title as unique ID (more stable than rank)
      rank: parseInt(p.no, 10),
      avatarUrl: p.avatar.url,
      avatarTitle: p.avatar.title,
      userName: p.usuario.nombre,
      userProfileUrl: p.usuario.perfilUrl,
      sede: p.sedeEquipo,
      correctas: p.correctas,
      puntos: p.puntos,
      tiempo: p.tiempo,
      // Always use raw avance from API without modification
      avance: p.avance,
      // But for display purposes, when finished it should show totalQuestions
      // Store both: raw avance from API and totalQuestions
      rawAvance: p.avance,
      totalQuestions: data.configuracion.preguntasTotales,
      status: p.estado.toLowerCase() === 'completado' ? 'finished' : 'in_progress',
      lastUpdated: Date.now(),
    }));
    
    console.log('Parsed participants:', participants.map(p => ({ id: p.id, userName: p.userName, avance: p.avance, rawAvance: p.rawAvance, totalQuestions: p.totalQuestions })));

    // Parse quiz meta
    const quizMeta: QuizMeta = {
      niveles: data.configuracion.niveles.join(','),
      preguntas: data.configuracion.preguntasTotales,
      punteo: data.configuracion.punteoMaximo,
    };

    return {
      participants,
      quizMeta,
    };
  } catch (error) {
    console.error('Error fetching participants from API:', error);
    throw error;
  }
}
