export const parseTime = (timeStr) => {
  const [m, s] = timeStr.split(':').map(Number);
  return m * 60 + s;
};

export const formatTime = (seconds) => {
  const m = Math.floor(Math.abs(seconds) / 60);
  const s = Math.floor(Math.abs(seconds) % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const calcMatchStats = (match) => {
  const subs = match.events.substitutions;
  if (!subs || subs.length < 2) return { stints: [], playerStats: [], finalTime: 0, totals: {} };

  let active = {}, stints = [], totals = {};
  const finalTime = parseTime(subs[subs.length - 1].time);

  subs.forEach(sub => {
    const timeSec = parseTime(sub.time);
    Object.keys(active).forEach(p => {
      if (!sub.onPitch.includes(p)) {
        totals[p] = (totals[p] || 0) + (timeSec - active[p]);
        stints.push({ player: p, start: active[p], end: timeSec });
        delete active[p];
      }
    });
    sub.onPitch.forEach(p => { if (active[p] === undefined) active[p] = timeSec; });
  });

  const playerStats = Object.entries(totals)
    .map(([player, totalSec]) => ({ player, totalSec, deviation: totalSec - (match.idealMinutesPerPlayer * 60) }))
    .sort((a, b) => b.totalSec - a.totalSec);

  return { stints, playerStats, finalTime, totals };
};

export const calcGlobalStats = (database) => {
  const goals = {}, assists = {}, minutes = {};
  const goalsFor = {}, goalsAgainst = {}, goalsConceded = {}, yellowCards = {}, saves = {};

  const names = database.roster.map(p => typeof p === 'string' ? p : p.name);
  names.forEach(p => {
    goals[p] = 0; assists[p] = 0; minutes[p] = 0;
    goalsFor[p] = 0; goalsAgainst[p] = 0; goalsConceded[p] = 0; yellowCards[p] = 0; saves[p] = 0;
  });

  database.matches.forEach(match => {
    const getOnPitch = (goal) => {
      if (goal.onPitch) return goal.onPitch;
      const { stints } = calcMatchStats(match);
      if (!stints.length) return [];
      const t = parseTime(goal.time);
      return stints.filter(s => s.start <= t && s.end > t).map(s => s.player);
    };

    match.events.goals.forEach(goal => {
      const onPitch = getOnPitch(goal);
      if (goal.type === 'favor') {
        if (goal.scorer && goals[goal.scorer] !== undefined) goals[goal.scorer]++;
        if (goal.assist && assists[goal.assist] !== undefined) assists[goal.assist]++;
        onPitch.forEach(p => { if (goalsFor[p] !== undefined) goalsFor[p]++; });
      } else {
        if (goal.goalkeeper && goalsConceded[goal.goalkeeper] !== undefined) goalsConceded[goal.goalkeeper]++;
        onPitch.forEach(p => { if (goalsAgainst[p] !== undefined) goalsAgainst[p]++; });
      }
    });

    // Parades: comptem events de la retransmissió de tipus "bona" que contenen "aturada" o "parada" o "paradon"
    // i també els events de la retransmissió on el porter és protagonista en accions defensives
    (match.events?.retransmissio || []).forEach(ev => {
      const txt = (ev.text || '').toLowerCase();
      const isSave = txt.includes('atura') || txt.includes('parad') || txt.includes('para ') ||
                     txt.includes('vola') || txt.includes('santo') || txt.includes('miracle');
      if (!isSave) return;
      (ev.players || []).forEach(p => {
        // Només comptem com a parada si el jugador és porter (posició Porter)
        const pl = database.roster.find(r => r.name === p);
        if (pl && pl.position === 'Porter' && saves[p] !== undefined) saves[p]++;
      });
    });

    (match.events.cards || []).forEach(card => {
      if (card.color === 'yellow' && yellowCards[card.player] !== undefined) yellowCards[card.player]++;
    });

    const { totals } = calcMatchStats(match);
    Object.entries(totals).forEach(([p, secs]) => { if (minutes[p] !== undefined) minutes[p] += secs; });
  });

  const sortDesc = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]);

  return {
    topScorers:    sortDesc(goals).filter(([,v]) => v > 0),
    topAssists:    sortDesc(assists).filter(([,v]) => v > 0),
    totalMinutes:  sortDesc(minutes),
    goalsFor:      sortDesc(goalsFor),
    goalsAgainst:  sortDesc(goalsAgainst),
    goalsConceded: sortDesc(goalsConceded).filter(([,v]) => v > 0),
    saves:         sortDesc(saves).filter(([,v]) => v > 0),
    yellowCards:   sortDesc(yellowCards).filter(([,v]) => v > 0),
  };
};
