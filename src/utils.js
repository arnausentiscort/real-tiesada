export const parseTime = (timeStr) => {
  if (!timeStr) return 0;
  const [m, s] = timeStr.split(':').map(Number);
  return m * 60 + (s || 0);
};

// ── Calcula minuts de porter per un match ─────────────────────────
export const calcGoalkeeperStints = (match) => {
  // Cas 1: minuts manuals (J1, J2)
  if (match.goalkeeperMinutes) {
    const result = {};
    Object.entries(match.goalkeeperMinutes).forEach(([name, mins]) => {
      result[name] = [{ start: 0, end: mins * 60, manual: true }];
    });
    return result;
  }
  // Cas 2: des de les substitucions amb camp goalkeeper
  const subs = match.events?.substitutions || [];
  if (subs.length < 2 || !subs[0].goalkeeper) return {};
  const stints = {};
  let prevGK = subs[0].goalkeeper;
  let prevT  = parseTime(subs[0].time);
  const finalT = parseTime(subs[subs.length-1].time);
  for (let i = 1; i < subs.length; i++) {
    const sub = subs[i];
    const ts  = parseTime(sub.time);
    if (sub.goalkeeper !== prevGK) {
      if (prevGK) {
        if (!stints[prevGK]) stints[prevGK] = [];
        stints[prevGK].push({ start: prevT, end: ts });
      }
      prevGK = sub.goalkeeper; prevT = ts;
    }
  }
  if (prevGK) {
    if (!stints[prevGK]) stints[prevGK] = [];
    stints[prevGK].push({ start: prevT, end: finalT });
  }
  return stints;
};

export const formatTime = (seconds) => {
  const m = Math.floor(Math.abs(seconds) / 60);
  const s = Math.floor(Math.abs(seconds) % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const calcMatchStats = (match) => {
  const subs = match.events.substitutions;

  // Si hi ha fieldMinutes manuals (J1, J2) usem aquells directament — ja són minuts de CAMP
  if (match.fieldMinutes) {
    const totals = {};
    Object.entries(match.fieldMinutes).forEach(([p, mins]) => {
      totals[p] = mins * 60;
    });
    const finalTime = 40 * 60;
    const stints = Object.entries(totals).map(([player, secs]) => ({ player, start: 0, end: secs }));
    const playerStats = Object.entries(totals)
      .map(([player, totalSec]) => ({ player, totalSec, deviation: totalSec - (match.idealMinutesPerPlayer * 60) }))
      .sort((a, b) => b.totalSec - a.totalSec);
    return { stints, playerStats, finalTime, totals };
  }

  if (!subs || subs.length < 2) return { stints: [], playerStats: [], finalTime: 0, totals: {} };

  let active = {}, stints = [], totals = {};
  const finalTime = parseTime(subs[subs.length - 1].time);

  subs.forEach(sub => {
    const timeSec = parseTime(sub.time);
    // Exclou el porter de onPitch per no comptar-lo com a jugador de camp
    const goalkeeper = sub.goalkeeper || null;
    const fieldPlayers = (sub.onPitch || []).filter(p => p !== goalkeeper);

    Object.keys(active).forEach(p => {
      if (!fieldPlayers.includes(p)) {
        totals[p] = (totals[p] || 0) + (timeSec - active[p]);
        stints.push({ player: p, start: active[p], end: timeSec });
        delete active[p];
      }
    });
    fieldPlayers.forEach(p => { if (active[p] === undefined) active[p] = timeSec; });
  });

  // Tanca els stints dels jugadors que queden al camp al final del partit
  Object.keys(active).forEach(p => {
    totals[p] = (totals[p] || 0) + (finalTime - active[p]);
    stints.push({ player: p, start: active[p], end: finalTime });
  });

  const playerStats = Object.entries(totals)
    .map(([player, totalSec]) => ({ player, totalSec, deviation: totalSec - (match.idealMinutesPerPlayer * 60) }))
    .sort((a, b) => b.totalSec - a.totalSec);

  return { stints, playerStats, finalTime, totals };
};

export const calcGlobalStats = (database) => {
  const goals = {}, assists = {}, minutesCamp = {}, minutesPorter = {};
  const goalsFor = {}, goalsAgainst = {}, goalsConceded = {}, yellowCards = {}, saves = {};

  const names = database.roster.map(p => typeof p === 'string' ? p : p.name);
  names.forEach(p => {
    goals[p] = 0; assists[p] = 0; minutesCamp[p] = 0; minutesPorter[p] = 0;
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

    // Parades — usa savesManual si existeix, sinó calcula de la retransmissió
    if (match.savesManual) {
      Object.entries(match.savesManual).forEach(([name, count]) => {
        if (saves[name] !== undefined) saves[name] += count;
      });
    } else {
      (match.events?.retransmissio || []).forEach(ev => {
        const txt = (ev.text || '').toLowerCase();
        const isSave = txt.includes('atura') || txt.includes('parad') || txt.includes('para ') ||
                       txt.includes('vola') || txt.includes('santo') || txt.includes('miracle');
        if (!isSave) return;
        (ev.players || []).forEach(p => {
          const pl = database.roster.find(r => r.name === p);
          if (pl && pl.position === 'Porter' && saves[p] !== undefined) saves[p]++;
        });
      });
    }

    // Targetes
    (match.events.cards || []).forEach(card => {
      if (card.color === 'yellow' && yellowCards[card.player] !== undefined) yellowCards[card.player]++;
    });

    // Minuts de CAMP (ja nets gràcies al filtre del goalkeeper a calcMatchStats)
    const { totals, stints: matchStints } = calcMatchStats(match);
    Object.entries(totals).forEach(([p, secs]) => {
      if (minutesCamp[p] !== undefined) minutesCamp[p] += secs;
    });

    // Minuts de PORTER
    const gkStints = calcGoalkeeperStints(match);
    Object.entries(gkStints).forEach(([name, stintArr]) => {
      if (minutesPorter[name] !== undefined) {
        stintArr.forEach(s => { minutesPorter[name] += (s.end - s.start); });
      }
    });
  });

  // Minuts totals = camp + porter
  const minutesTotal = {};
  names.forEach(p => { minutesTotal[p] = (minutesCamp[p] || 0) + (minutesPorter[p] || 0); });

  const sortDesc = (obj) => Object.entries(obj).sort((a, b) => b[1] - a[1]);

  return {
    topScorers:    sortDesc(goals).filter(([,v]) => v > 0),
    topAssists:    sortDesc(assists).filter(([,v]) => v > 0),
    totalMinutes:  sortDesc(minutesTotal).filter(([,v]) => v > 0),
    minutesCamp:   sortDesc(minutesCamp).filter(([,v]) => v > 0),
    minutesPorter: sortDesc(minutesPorter).filter(([,v]) => v > 0),
    goalsFor:      sortDesc(goalsFor),
    goalsAgainst:  sortDesc(goalsAgainst),
    goalsConceded: sortDesc(goalsConceded).filter(([,v]) => v > 0),
    saves:         sortDesc(saves).filter(([,v]) => v > 0),
    yellowCards:   sortDesc(yellowCards).filter(([,v]) => v > 0),
  };
};
