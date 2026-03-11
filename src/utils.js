// ==========================================
// FUNCIONS D'UTILITAT — Càlculs de temps
// ==========================================

/** Converteix "MM:SS" a total de segons */
export const parseTime = (timeStr) => {
  const [m, s] = timeStr.split(':').map(Number);
  return m * 60 + s;
};

/** Converteix segons a "MM:SS" */
export const formatTime = (seconds) => {
  const m = Math.floor(Math.abs(seconds) / 60);
  const s = Math.floor(Math.abs(seconds) % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

/** Formata la data "2023-11-03" → "03 Nov 2023" */
export const formatDate = (dateStr) => {
  if (!dateStr.includes('-')) return dateStr;
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

/**
 * Calcula els intervals (stints) de joc de cada jugador.
 * Accepta partits sense substitucions (retorna buit).
 */
export const calcMatchStats = (match) => {
  let active = {};
  let stints = [];
  let totals = {};

  const subs = match.events.substitutions;

  // Si no hi ha substitucions suficients, retornem buit
  if (!subs || subs.length < 2) {
    return { stints: [], playerStats: [], finalTime: 0, totals: {} };
  }

  const finalTime = parseTime(subs[subs.length - 1].time);

  subs.forEach(sub => {
    const timeSec = parseTime(sub.time);

    // Qui surt de la pista
    Object.keys(active).forEach(p => {
      if (!sub.onPitch.includes(p)) {
        const duration = timeSec - active[p];
        totals[p] = (totals[p] || 0) + duration;
        stints.push({ player: p, start: active[p], end: timeSec });
        delete active[p];
      }
    });

    // Qui entra a la pista
    sub.onPitch.forEach(p => {
      if (active[p] === undefined) active[p] = timeSec;
    });
  });

  const playerStats = Object.entries(totals)
    .map(([player, totalSec]) => ({
      player,
      totalSec,
      deviation: totalSec - (match.idealMinutesPerPlayer * 60)
    }))
    .sort((a, b) => b.totalSec - a.totalSec);

  return { stints, playerStats, finalTime, totals };
};

/**
 * Calcula les estadístiques globals de tots els partits.
 * Compatible amb roster d'strings i roster d'objectes {name, ...}
 */
export const calcGlobalStats = (database) => {
  const goals   = {};
  const assists = {};
  const minutes = {};

  // Suport per roster de strings o d'objectes
  const names = database.roster.map(p => typeof p === 'string' ? p : p.name);
  names.forEach(p => { goals[p] = 0; assists[p] = 0; minutes[p] = 0; });

  database.matches.forEach(match => {
    // Gols i assistències
    match.events.goals.forEach(goal => {
      if (goal.type === 'favor') {
        if (goal.scorer && goals[goal.scorer] !== undefined) goals[goal.scorer]++;
        if (goal.assist && assists[goal.assist] !== undefined) assists[goal.assist]++;
      }
    });

    // Minuts jugats (només si hi ha substitucions)
    const { totals } = calcMatchStats(match);
    Object.entries(totals).forEach(([p, secs]) => {
      if (minutes[p] !== undefined) minutes[p] += secs;
    });
  });

  const sortDesc = (obj) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1]).filter(([, v]) => v > 0);

  return {
    topScorers: sortDesc(goals),
    topAssists: sortDesc(assists),
    totalMinutes: Object.entries(minutes).sort((a, b) => b[1] - a[1])
  };
};
