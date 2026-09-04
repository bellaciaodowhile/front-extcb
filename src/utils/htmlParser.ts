import { Participant, QuizMeta } from '../types';

export const INITIAL_RAW_HTML = `<label class="pull-right inline">
    <span class="btn btn-app btn-sm btn-grey no-hover">
        <span id="strNiveles" class="line-height-1 bigger-140">1</span>
        <br>
        <span class="line-height-1 smaller-90">Niveles </span>
    </span>

    <span class="btn btn-app btn-sm btn-success no-hover">
        <span id="strPreguntas" class="line-height-1 bigger-170">20</span>
        <br>
        <span class="line-height-1 smaller-90">Preguntas </span>
    </span>

    <span class="btn btn-app btn-sm btn-primary no-hover">
        <span id="strPunteo" class="line-height-1 bigger-170">250</span>
        <br>
        <span class="line-height-1 smaller-90">Punteo </span>
    </span>
</label>

<p id="GridResultados"><div class="clearfix"><div class="pull-right tableTools-container"></div></div><div class="table-header">Resultados para "los distintos usuarios"</div><table id="table-5-column" class="table table-striped table-bordered table-hover"><thead><tr style="font-size: 25px; text-align: center; font-weight: bold; background-color: yellow;"><th class="hidden-480">No.</th><th>Avatar</th><th class="hidden-480">Usuario</th><th class="hidden-480">Sede/Equipo</th><th>Correctas</th><th>Puntos</th><th>Tiempo</th><th>Avance</th><th>-</th></tr></thead><tbody><tr id="row1" style="font-size: 25px; text-align: center; font-weight: bold; background-color: yellow;"><td class="hidden-480">1</td><td><center><div class="nav ace-nav"><img src="https://app1.conexionbiblica.net/assets133/avatars/@lugare26.png" class="responsive" width="50" height="30" title="@lugare26"> </div></center></td><td class="hidden-480"><a href="../Cuestionario/Resultados?UserName=@lugare26" target="_blank">Avnet Jias</a></td><td class="hidden-480">PIAR</td><td>6</td><td>85</td><td>00:00:41.360</td><td>20</td><td><div class="green"><i class="ace-icon fa fa-check"></i></div></td></tr><tr id="row2" style="font-size: 25px; text-align: center; font-weight: bold; background-color: lightblue;"><td class="hidden-480">2</td><td><center><div class="nav ace-nav"><img src="https://app1.conexionbiblica.net/assets133/avatars/@claro26.png" class="responsive" width="50" height="30" title="@claro26"> </div></center></td><td class="hidden-480"><a href="../Cuestionario/Resultados?UserName=@claro26" target="_blank">Anita Peas</a></td><td class="hidden-480">LUGAR2</td><td>5</td><td>80</td><td>00:00:43.202</td><td>20</td><td><div class="green"><i class="ace-icon fa fa-check"></i></div></td></tr><tr id="row3" style="font-size: 25px; text-align: center; font-weight: bold; background-color: lightskyblue;"><td class="hidden-480">3</td><td><center><div class="nav ace-nav"><img src="https://app1.conexionbiblica.net/assets133/avatars/@como26.png" class="responsive" width="50" height="30" title="@como26"> </div></center></td><td class="hidden-480"><a href="../Cuestionario/Resultados?UserName=@como26" target="_blank">Junito Jans</a></td><td class="hidden-480">LUGAR1</td><td>6</td><td>70</td><td>00:00:47.255</td><td>20</td><td><div class="green"><i class="ace-icon fa fa-check"></i></div></td></tr><tr id="row4"><td class="hidden-480">4</td><td><center><div class="nav ace-nav"><img src="https://api.dicebear.com/7.x/bottts/svg?seed=carlos" class="responsive" width="50" height="30" title="@carlos45"></div></center></td><td class="hidden-480"><a href="#" target="_blank">Carlos Méndez</a></td><td class="hidden-480">PIAR</td><td>5</td><td>65</td><td>00:00:52.110</td><td>18</td><td><div><i class="ace-icon fa fa-spinner fa-spin orange"></i></div></td></tr><tr id="row5"><td class="hidden-480">5</td><td><center><div class="nav ace-nav"><img src="https://api.dicebear.com/7.x/bottts/svg?seed=elena" class="responsive" width="50" height="30" title="@elena99"></div></center></td><td class="hidden-480"><a href="#" target="_blank">Elena Ramos</a></td><td class="hidden-480">LUGAR2</td><td>4</td><td>55</td><td>00:01:04.820</td><td>15</td><td><div><i class="ace-icon fa fa-spinner fa-spin orange"></i></div></td></tr><tr id="row6"><td class="hidden-480">6</td><td><center><div class="nav ace-nav"><img src="https://api.dicebear.com/7.x/bottts/svg?seed=diego" class="responsive" width="50" height="30" title="@diego_gt"></div></center></td><td class="hidden-480"><a href="#" target="_blank">Diego Morales</a></td><td class="hidden-480">CENTRAL</td><td>4</td><td>50</td><td>00:01:15.340</td><td>14</td><td><div class="green"><i class="ace-icon fa fa-check"></i></div></td></tr></tbody></table></p>`;

export function parseLeaderboardHtml(htmlString: string): {
  title: string;
  participants: Participant[];
  quizMeta: QuizMeta;
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Extract Floating Quiz Meta (Niveles, Preguntas, Punteo)
  const nivelesEl = doc.querySelector('#strNiveles');
  const preguntasEl = doc.querySelector('#strPreguntas');
  const punteoEl = doc.querySelector('#strPunteo');

  const niveles = nivelesEl?.textContent?.trim() || '1,2';
  const preguntas = parseInt(preguntasEl?.textContent?.trim() || '20', 10);
  const punteo = parseInt(punteoEl?.textContent?.trim() || '250', 10);

  const quizMeta: QuizMeta = {
    niveles: niveles || '1,2',
    preguntas: isNaN(preguntas) ? 20 : preguntas,
    punteo: isNaN(punteo) ? 250 : punteo,
  };

  // Extract Title from table-header if available
  const titleEl = doc.querySelector('.table-header');
  const title = titleEl ? titleEl.textContent?.trim() || 'Resultados de Clasificación' : 'Resultados de Clasificación';

  const rows = doc.querySelectorAll('table tbody tr');
  const participants: Participant[] = [];

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 8) return;

    // 0: No.
    const rankRaw = parseInt(cells[0]?.textContent?.trim() || `${index + 1}`, 10);
    const rank = isNaN(rankRaw) ? index + 1 : rankRaw;

    // 1: Avatar
    const imgEl = cells[1]?.querySelector('img');
    const avatarUrl = imgEl?.getAttribute('src') || `https://api.dicebear.com/7.x/bottts/svg?seed=user${index}`;
    const avatarTitle = imgEl?.getAttribute('title') || `@user${rank}`;

    // 2: Usuario (name & link)
    const linkEl = cells[2]?.querySelector('a');
    const userName = linkEl ? linkEl.textContent?.trim() || cells[2]?.textContent?.trim() || `Participante ${rank}` : cells[2]?.textContent?.trim() || `Participante ${rank}`;
    const userProfileUrl = linkEl?.getAttribute('href') || undefined;

    // 3: Sede/Equipo
    const sede = cells[3]?.textContent?.trim() || 'GENERAL';

    // 4: Correctas
    const correctas = parseInt(cells[4]?.textContent?.trim() || '0', 10);

    // 5: Puntos
    const puntos = parseInt(cells[5]?.textContent?.trim() || '0', 10);

    // 6: Tiempo
    const tiempo = cells[6]?.textContent?.trim() || '00:00:00.000';

    // 7: Avance
    const avance = parseInt(cells[7]?.textContent?.trim() || '0', 10);

    // 8: Status icon (- column)
    const statusCell = cells[8];
    const statusHtml = statusCell ? statusCell.innerHTML : '';
    const hasCheck = statusHtml.includes('fa-check') || statusHtml.includes('check') || statusCell?.querySelector('.green') !== null;
    const isFinished = hasCheck;

    const id = (avatarTitle && avatarTitle.startsWith('@')) ? avatarTitle : `user-${userName.replace(/\s+/g, '-').toLowerCase()}-${rank}`;

    participants.push({
      id,
      rank,
      avatarUrl,
      avatarTitle,
      userName,
      userProfileUrl,
      sede,
      correctas: isNaN(correctas) ? 0 : correctas,
      puntos: isNaN(puntos) ? 0 : puntos,
      tiempo,
      avance: isNaN(avance) ? 0 : avance,
      totalQuestions: isNaN(preguntas) ? 20 : preguntas,
      status: isFinished ? 'finished' : 'in_progress',
      lastUpdated: Date.now(),
    });
  });

  return { title, participants, quizMeta };
}

// Helper to simulate answers & score jumps so participants visibly climb or fall ranks
export function simulateRankJump(currentParticipants: Participant[]): {
  updatedList: Participant[];
  climberName: string;
} {
  const list = currentParticipants.map((p) => ({ ...p }));
  if (list.length === 0) return { updatedList: list, climberName: '' };

  // Pick a participant from position 3 to end (or random) to boost significantly
  const candidateIndices = list.map((_, i) => i);
  // Give preference to lower-ranked participants so they jump up
  const chosenIndex = candidateIndices.length > 2
    ? Math.floor(Math.random() * (candidateIndices.length - 2)) + 2
    : Math.floor(Math.random() * candidateIndices.length);

  const climber = list[chosenIndex];
  const pointsBoost = Math.floor(Math.random() * 35) + 20; // 20-55 pts
  const newCorrectas = climber.correctas + 1 + Math.floor(Math.random() * 2);
  const newAvance = Math.min(20, climber.avance + 1 + Math.floor(Math.random() * 2));

  // Slightly improve time
  const currentSeconds = parseInt(climber.tiempo.split(':')[2] || '40', 10);
  const newSeconds = Math.max(12, currentSeconds - 3);
  const newTime = `00:00:${String(newSeconds).padStart(2, '0')}.${Math.floor(Math.random() * 900 + 100)}`;

  list[chosenIndex] = {
    ...climber,
    puntos: climber.puntos + pointsBoost,
    correctas: newCorrectas,
    avance: newAvance,
    tiempo: newTime,
    status: newAvance >= 20 ? 'finished' : 'in_progress',
    justFinished: newAvance >= 20 && climber.status === 'in_progress',
    lastUpdated: Date.now(),
  };

  // Re-sort descending by points, then by time
  list.sort((a, b) => {
    if (b.puntos !== a.puntos) return b.puntos - a.puntos;
    return a.tiempo.localeCompare(b.tiempo);
  });

  // Calculate rank deltas
  const updatedList = list.map((p, idx) => {
    const prevRank = p.rank || idx + 1;
    const newRank = idx + 1;
    const delta = prevRank - newRank; // positive means climbed up
    return {
      ...p,
      previousRank: prevRank,
      rank: newRank,
      rankChange: delta,
    };
  });

  return { updatedList, climberName: climber.userName };
}

// Helper to generate a dummy/simulated update step
export function simulateIncrementalUpdate(currentParticipants: Participant[]): {
  updatedList: Participant[];
  newParticipantAdded?: Participant;
  participantJustFinished?: Participant;
} {
  const list = currentParticipants.map((p) => ({ ...p }));
  let newParticipantAdded: Participant | undefined = undefined;
  let participantJustFinished: Participant | undefined = undefined;

  const randomAction = Math.random();

  // Scenario 1: Advance an in-progress participant
  const inProgressList = list.filter((p) => p.status === 'in_progress');
  if (inProgressList.length > 0 && randomAction < 0.7) {
    const target = inProgressList[Math.floor(Math.random() * inProgressList.length)];
    const targetIdx = list.findIndex((p) => p.id === target.id);
    if (targetIdx !== -1) {
      const newAvance = Math.min(20, target.avance + 1 + Math.floor(Math.random() * 2));
      const gotCorrect = Math.random() > 0.3;
      const newCorrectas = gotCorrect ? target.correctas + 1 : target.correctas;
      const addedPoints = gotCorrect ? 10 + Math.floor(Math.random() * 5) : 0;
      const isNowFinished = newAvance >= 20;

      const updated: Participant = {
        ...target,
        avance: newAvance,
        correctas: newCorrectas,
        puntos: target.puntos + addedPoints,
        status: isNowFinished ? 'finished' : 'in_progress',
        justFinished: isNowFinished && target.status === 'in_progress',
        lastUpdated: Date.now(),
      };

      if (updated.justFinished) {
        participantJustFinished = updated;
      }

      list[targetIdx] = updated;
    }
  } else if (randomAction >= 0.7 && list.length < 15) {
    // Scenario 2: A new contestant joins!
    const names = ['Mateo Silva', 'Sofía Castillo', 'Gabriel Torres', 'Valentina Luna', 'Lucas Morales', 'Mariana Ríos', 'Samuel Paz'];
    const sedes = ['PIAR', 'LUGAR1', 'LUGAR2', 'CENTRAL', 'NORTE'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const usernameTag = `@${randomName.toLowerCase().replace(/\s+/g, '')}${Math.floor(Math.random() * 90 + 10)}`;

    const newContestant: Participant = {
      id: usernameTag,
      rank: list.length + 1,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${usernameTag}`,
      avatarTitle: usernameTag,
      userName: randomName,
      userProfileUrl: `../Cuestionario/Resultados?UserName=${usernameTag}`,
      sede: sedes[Math.floor(Math.random() * sedes.length)],
      correctas: 1 + Math.floor(Math.random() * 3),
      puntos: 15 + Math.floor(Math.random() * 30),
      tiempo: `00:00:${Math.floor(Math.random() * 30 + 15).toString().padStart(2, '0')}.120`,
      avance: 4 + Math.floor(Math.random() * 5),
      totalQuestions: 20,
      status: 'in_progress',
      lastUpdated: Date.now(),
      isNew: true,
    };

    list.push(newContestant);
    newParticipantAdded = newContestant;
  }

  // Re-sort by points descending, then by time ascending
  list.sort((a, b) => {
    if (b.puntos !== a.puntos) {
      return b.puntos - a.puntos;
    }
    return a.tiempo.localeCompare(b.tiempo);
  });

  // Reassign ranks and deltas
  const updatedList = list.map((p, idx) => {
    const prevRank = p.rank || idx + 1;
    const newRank = idx + 1;
    return {
      ...p,
      previousRank: prevRank,
      rank: newRank,
      rankChange: prevRank - newRank,
    };
  });

  return { updatedList, newParticipantAdded, participantJustFinished };
}

