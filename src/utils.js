import { FORMATS } from './formats.js';

export const parseTime = (timeStr) => {
  if (!timeStr) return 0;
  const [m, s] = timeStr.split(':').map(Number);
  return m * 60 + (s || 0);
};

// ── Calcula minuts de porter per un match ─────────────────────────
export const calcGoalkeeperStints = (match, format = FORMATS.fs5) => {
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

export const calcMatchStats = (match, format = FORMATS.fs5) => {
  const subs = match.events.substitutions;

  // Si hi ha fieldMinutes manuals (J1, J2) usem aquells directament — ja són minuts de CAMP
  if (match.fieldMinutes) {
    const totals = {};
    Object.entries(match.fieldMinutes).forEach(([p, mins]) => {
      totals[p] = mins * 60;
    });
    const finalTime = format.totalMinutes * 60;
    const allGKs = Object.keys(match.goalkeeperMinutes || {});
    const numPlayers = new Set([...Object.keys(totals), ...allGKs]).size || 1;
    const idealSec = (finalTime * format.playersOnPitch) / numPlayers;
    const stints = Object.entries(totals).map(([player, secs]) => ({ player, start: 0, end: secs }));
    const playerStats = Object.entries(totals)
      .map(([player, totalSec]) => ({ player, totalSec, deviation: totalSec - idealSec }))
      .sort((a, b) => b.totalSec - a.totalSec);
    return { stints, playerStats, finalTime, totals, idealSec };
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

  const allGKs = [...new Set(subs.map(s => s.goalkeeper).filter(Boolean))];
  const numPlayers = new Set([...Object.keys(totals), ...allGKs]).size || 1;
  const idealSec = (finalTime * format.playersOnPitch) / numPlayers;

  const playerStats = Object.entries(totals)
    .map(([player, totalSec]) => ({ player, totalSec, deviation: totalSec - idealSec }))
    .sort((a, b) => b.totalSec - a.totalSec);

  return { stints, playerStats, finalTime, totals, idealSec };
};

export const calcGlobalStats = (database, format = FORMATS.fs5) => {
  const goals = {}, assists = {}, minutesCamp = {}, minutesPorter = {};
  const goalsFor = {}, goalsAgainst = {}, yellowCards = {}, saves = {};
  const goalsForGK = {}, goalsAgainstGK = {};
  const shotsTotal = {}, shotsOnTarget = {}, shotsPost = {}, keyPassesMap = {}, dribblesMap = {};

  const names = database.roster.map(p => typeof p === 'string' ? p : p.name);
  names.forEach(p => {
    goals[p] = 0; assists[p] = 0; minutesCamp[p] = 0; minutesPorter[p] = 0;
    goalsFor[p] = 0; goalsAgainst[p] = 0; yellowCards[p] = 0; saves[p] = 0;
    goalsForGK[p] = 0; goalsAgainstGK[p] = 0;
    shotsTotal[p] = 0; shotsOnTarget[p] = 0; shotsPost[p] = 0; keyPassesMap[p] = 0; dribblesMap[p] = 0;
  });

  database.matches.forEach(match => {
    const getOnPitch = (goal) => goal.onPitch || [];

    match.events.goals.forEach(goal => {
      const onPitch = getOnPitch(goal);
      if (goal.type === 'favor') {
        if (goal.scorer && goals[goal.scorer] !== undefined) goals[goal.scorer]++;
        if (goal.assist && assists[goal.assist] !== undefined) assists[goal.assist]++;
        onPitch.forEach(p => { if (goalsFor[p] !== undefined) goalsFor[p]++; });
        if (goal.goalkeeper && goalsForGK[goal.goalkeeper] !== undefined) goalsForGK[goal.goalkeeper]++;
      } else {
        onPitch.forEach(p => { if (goalsAgainst[p] !== undefined) goalsAgainst[p]++; });
        if (goal.goalkeeper && goalsAgainstGK[goal.goalkeeper] !== undefined) goalsAgainstGK[goal.goalkeeper]++;
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

    // Tirs, key passes, regats
    const countEvents = (map, dest) => {
      Object.entries(map || {}).forEach(([name, evs]) => {
        if (dest[name] !== undefined) dest[name] += (evs || []).length;
      });
    };
    countEvents(match.shots,     shotsTotal);
    countEvents(match.keyPasses, keyPassesMap);
    countEvents(match.dribbles,  dribblesMap);
    Object.entries(match.shots || {}).forEach(([name, evs]) => {
      if (shotsOnTarget[name] === undefined) return;
      // El pal es compta a part: no ha entrat ni l'ha aturat ningu
      shotsOnTarget[name] += (evs || []).filter(e => e.onTarget).length;
      shotsPost[name]     += (evs || []).filter(e => e.post).length;
    });

    // Minuts de CAMP (ja nets gràcies al filtre del goalkeeper a calcMatchStats)
    const { totals, stints: matchStints } = calcMatchStats(match, format);
    Object.entries(totals).forEach(([p, secs]) => {
      if (minutesCamp[p] !== undefined) minutesCamp[p] += secs;
    });

    // Minuts de PORTER
    const gkStints = calcGoalkeeperStints(match, format);
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
    goalsForGK:    sortDesc(goalsForGK),
    goalsAgainstGK: sortDesc(goalsAgainstGK),
    goalsForAll:     sortDesc(Object.fromEntries(names.map(n => [n, goalsFor[n] + (n === database.startingKeeper ? goalsForGK[n] : 0)]))),
    goalsAgainstAll: sortDesc(Object.fromEntries(names.map(n => [n, goalsAgainst[n] + (n === database.startingKeeper ? goalsAgainstGK[n] : 0)]))),
    saves:         sortDesc(saves).filter(([,v]) => v > 0),
    yellowCards:   sortDesc(yellowCards).filter(([,v]) => v > 0),
    shotsTotal:    sortDesc(shotsTotal).filter(([,v]) => v > 0),
    shotsOnTarget: sortDesc(shotsOnTarget).filter(([,v]) => v > 0),
    shotsPost:     sortDesc(shotsPost).filter(([,v]) => v > 0),
    keyPasses:     sortDesc(keyPassesMap).filter(([,v]) => v > 0),
    dribbles:      sortDesc(dribblesMap).filter(([,v]) => v > 0),
  };
};

// ── Nota del partit (sobre 10) ────────────────────────────────────
// Resultat (3), atac (3), defensa (3) i porter (1).
// Les aturades NO són bones per a l'equip: cada aturada és una ocasió clara
// del rival. Aturades + gols encaixats = xuts a porta del rival, i com més
// n'hi ha, pitjor hem defensat. Al porter, en canvi, se li valora el % que atura.
// El que no es va apuntar (tirs, aturades) no compta: la nota es fa sobre la resta.
export const calcMatchRating = (match) => {
  const [gf, ga] = match.result.split('-').map(s => parseInt(s.trim(), 10));
  const shots = Object.values(match.shots || {}).flat();
  const keyPasses = Object.values(match.keyPasses || {}).flat().length;
  const saves = Object.values(match.savesManual || {}).reduce((a, b) => a + b, 0);
  const hasShots = shots.length > 0;
  const hasSaves = saves > 0;

  const diff = gf - ga;
  const resultat = diff > 0 ? 3 : diff === 0 ? 1.75 : diff === -1 ? 1 : diff === -2 ? 0.5 : 0;

  // Atac: gols i, si es van apuntar, les ocasions (a porta, pals, passades clau)
  const onTarget = shots.filter(s => s.onTarget).length + shots.filter(s => s.post).length * 0.7;
  const atac = Math.min(hasShots ? 2 : 3, gf * (hasShots ? 0.3 : 0.45))
    + (hasShots ? Math.min(1, onTarget * 0.1 + keyPasses * 0.05) : 0);

  // Defensa: gols encaixats i, si hi ha aturades apuntades, totes les seves arribades a porta
  const rivalOnTarget = ga + saves;
  const defensa = hasSaves
    ? Math.max(0, 3 - Math.max(0, ga - 1) * 0.3 - Math.max(0, rivalOnTarget - 6) * 0.12)
    : Math.max(0, 3 - Math.max(0, ga - 1) * 0.4);

  // Porter: quina part de les que li arriben atura
  const porter = hasSaves ? saves / (saves + ga) : 0;

  const parts = [
    { key: 'resultat', label: 'Resultat', value: resultat, max: 3, on: true },
    { key: 'atac',     label: 'Atac',     value: atac,     max: 3, on: true,
      hint: hasShots ? `${gf} gols · ${shots.length} xuts (${Math.round(onTarget)} a porta) · ${keyPasses} pass. clau` : `${gf} gols` },
    { key: 'defensa',  label: 'Defensa',  value: defensa,  max: 3, on: true,
      hint: hasSaves ? `${ga} gols en contra · ${rivalOnTarget} xuts seus a porta` : `${ga} gols en contra` },
    { key: 'porter',   label: 'Porter',   value: porter,   max: 1, on: hasSaves,
      hint: hasSaves ? `${saves} aturades de ${rivalOnTarget} (${Math.round(porter * 100)}%)` : '' },
  ];
  const active = parts.filter(p => p.on);
  const got = active.reduce((a, p) => a + p.value, 0);
  const max = active.reduce((a, p) => a + p.max, 0);
  const nota = Math.round((got / max) * 100) / 10;
  const label = nota >= 8 ? 'Partidàs' : nota >= 6.5 ? 'Bon partit' : nota >= 5 ? 'Correcte' : nota >= 3.5 ? 'Fluix' : 'Per oblidar';
  const color = nota >= 6.5 ? '#4ade80' : nota >= 5 ? '#E5C07B' : nota >= 3.5 ? '#fb923c' : '#f87171';
  return { nota, label, color, parts, partial: active.length < parts.length };
};
