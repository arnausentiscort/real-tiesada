import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { DATABASE } from '../data.js';
import { calcMatchStats, calcGoalkeeperStints, calcGlobalStats, formatTime } from '../utils.js';

const matches  = DATABASE.matches;
const roster   = DATABASE.roster;
const PLAYERS  = roster.map(p => p.name);

const pl = (name) => roster.find(p => p.name === name);
const shirt = (name) => pl(name)?.shirtName || name.split(' ')[0].toUpperCase();
const toSecs = (t) => { if (!t) return 0; const [m,s]=(t||'0:0').split(':').map(Number); return (m||0)*60+(s||0); };
const num = (v) => (v === 0 || v === '-') ? (v === 0 ? 0 : '-') : v;

// ── Helpers d'estil ──────────────────────────────────────────────────────────
const S = {
  HDR:   { font:{bold:true,sz:11,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'1a1a2e'}}, alignment:{horizontal:'center',vertical:'center',wrapText:true}, border:{bottom:{style:'medium',color:{rgb:'E5C07B'}}} },
  HDR_G: { font:{bold:true,sz:11,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'1a4a1a'}}, alignment:{horizontal:'center',vertical:'center',wrapText:true} },
  HDR_R: { font:{bold:true,sz:11,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'7b1c12'}}, alignment:{horizontal:'center',vertical:'center',wrapText:true} },
  HDR_B: { font:{bold:true,sz:11,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'1a3a6a'}}, alignment:{horizontal:'center',vertical:'center',wrapText:true} },
  HDR_O: { font:{bold:true,sz:11,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'5a3a10'}}, alignment:{horizontal:'center',vertical:'center',wrapText:true} },
  BOLD:  { font:{bold:true} },
  CTR:   { alignment:{horizontal:'center'} },
  GOLD:  { font:{bold:true}, fill:{fgColor:{rgb:'FFF3CD'}}, alignment:{horizontal:'center'} },
  ALT:   { fill:{fgColor:{rgb:'F5F5F5'}} },
  FAVOR: { fill:{fgColor:{rgb:'E8F5E9'}} },
  CONTR: { fill:{fgColor:{rgb:'FCE4E4'}} },
  SEC:   { font:{bold:true,sz:12,color:{rgb:'E5C07B'}}, fill:{fgColor:{rgb:'111111'}} },
};

function sc(ws, r, c, style) {
  const addr = XLSX.utils.encode_cell({r,c});
  if (!ws[addr]) ws[addr] = {t:'s',v:''};
  ws[addr].s = {...(ws[addr].s||{}), ...style};
}
function styleRow(ws, r, nCols, style) {
  for (let c=0; c<nCols; c++) sc(ws, r, c, style);
}
function applyStyles(ws, rows, styleFn) {
  rows.forEach((row, ri) => {
    row.forEach((_, ci) => {
      const s = styleFn(ri, ci, row);
      if (s) sc(ws, ri, ci, s);
    });
  });
}

function makeSheet(rows, colWidths) {
  const ws = XLSX.utils.aoa_to_sheet(rows);
  if (colWidths) ws['!cols'] = colWidths.map(w => ({wch: w}));
  ws['!rows'] = rows.map(() => ({hpt: 18}));
  if (ws['!rows'][0]) ws['!rows'][0] = {hpt: 28};
  return ws;
}

// ════════════════════════════════════════════════════════════════════════════
// FULL 1 — Resum de Partits
// ════════════════════════════════════════════════════════════════════════════
function sheetResumPartits() {
  const hdr = [
    'Jornada','Data','Rival','Casa/Fora','Resultat','GF','GC','DG',
    'Gols a favor','Gols en contra','Tirs totals','Tirs a porta','Key Passes','Regats','Targetes',
    'Jugadors usats','Durada (min)','Vídeo',
  ];
  const rows = [hdr];
  matches.forEach(m => {
    const [gf,gc] = (m.result||'0-0').split('-').map(s=>parseInt(s.trim())||0);
    const goals = m.events?.goals||[];
    const goalsF = goals.filter(g=>g.type==='favor').length;
    const goalsC = goals.filter(g=>g.type==='contra').length;
    const tirs = Object.values(m.shots||{}).reduce((a,b)=>a+b.length,0);
    const tirsPorta = Object.values(m.shots||{}).reduce((a,b)=>a+b.filter(t=>t.onTarget).length,0);
    const kp = Object.values(m.keyPasses||{}).reduce((a,b)=>a+b.length,0);
    const reg = Object.values(m.dribbles||{}).reduce((a,b)=>a+b.length,0);
    const cards = m.events?.cards?.length||0;
    const subs = m.events?.substitutions||[];
    const allUsed = new Set();
    subs.forEach(s => { if(s.goalkeeper) allUsed.add(s.goalkeeper); (s.onPitch||[]).forEach(p=>allUsed.add(p)); });
    const durSecs = subs.length>0 ? toSecs(subs[subs.length-1].time) : 0;
    const video = m.youtubeId ? `https://youtu.be/${m.youtubeId}` : (m.vimeoId ? `https://vimeo.com/${m.vimeoId}` : '-');
    rows.push([
      m.jornada, m.date, m.opponent,
      '-', // isHome no el tenim al match obj, el tenim al calendari
      m.result, gf, gc, gf-gc,
      goalsF, goalsC, tirs, tirsPorta, kp, reg, cards,
      allUsed.size, durSecs>0 ? Math.round(durSecs/60) : '-',
      video,
    ]);
  });
  // totals
  const tot = [
    'TOTAL','','','','',
    rows.slice(1).reduce((a,r)=>a+(r[5]||0),0),
    rows.slice(1).reduce((a,r)=>a+(r[6]||0),0),
    rows.slice(1).reduce((a,r)=>a+(r[7]||0),0),
    rows.slice(1).reduce((a,r)=>a+(r[8]||0),0),
    rows.slice(1).reduce((a,r)=>a+(r[9]||0),0),
    rows.slice(1).reduce((a,r)=>a+(r[10]||0),0),
    rows.slice(1).reduce((a,r)=>a+(r[11]||0),0),
    rows.slice(1).reduce((a,r)=>a+(r[12]||0),0),
    rows.slice(1).reduce((a,r)=>a+(r[13]||0),0),
    rows.slice(1).reduce((a,r)=>a+(r[14]||0),0),
    '','','',
  ];
  rows.push(tot);
  const ws = makeSheet(rows, [12,14,16,10,10,6,6,6,10,10,10,10,10,10,10,12,12,35]);
  const hdrStyles = [S.HDR,S.HDR,S.HDR,S.HDR,S.BOLD,...Array(3).fill(S.HDR_G),...Array(2).fill(S.HDR_R),...Array(4).fill(S.HDR_O),...Array(1).fill(S.HDR_R),...Array(3).fill(S.HDR),...Array(1).fill(S.HDR_B)];
  hdrStyles.forEach((s,c) => sc(ws,0,c,s));
  for (let r=1;r<rows.length-1;r++) {
    if(r%2===0) styleRow(ws,r,hdr.length,S.ALT);
    [5,6,7,8,9,10,11,12,13,14,15,16].forEach(c=>sc(ws,r,c,S.CTR));
  }
  styleRow(ws,rows.length-1,hdr.length,S.GOLD);
  return ws;
}

// ════════════════════════════════════════════════════════════════════════════
// FULL 2 — Minuts per Jugador (camp + porter per jornada)
// ════════════════════════════════════════════════════════════════════════════
function sheetMinuts() {
  const hdrBase = ['Jugador','Dorsal','Posició'];
  const hdrM = [];
  matches.forEach(m => hdrM.push(`J${m.jornada.replace(/\D/g,'')} Camp`, `J${m.jornada.replace(/\D/g,'')} Porter`));
  const hdrTot = ['TOTAL Camp','TOTAL Porter','TOTAL GENERAL','Partits jugats'];
  const hdr = [...hdrBase,...hdrM,...hdrTot];
  const rows = [hdr];

  const allNames = new Set(PLAYERS);
  matches.forEach(m => {
    const subs = m.events?.substitutions||[];
    subs.forEach(s => { if(s.goalkeeper) allNames.add(s.goalkeeper); (s.onPitch||[]).forEach(p=>allNames.add(p)); });
  });

  [...allNames].forEach(name => {
    const p = pl(name);
    const row = [name, p ? `#${p.number}` : '-', p?.position||'Convidat'];
    let tC=0, tG=0, pj=0;
    matches.forEach(m => {
      const {totals} = calcMatchStats(m);
      const gkS = calcGoalkeeperStints(m);
      const c = totals[name]||0;
      const g = (gkS[name]||[]).reduce((a,s)=>a+(s.end-s.start),0);
      row.push(c>0?formatTime(c):'-', g>0?formatTime(g):'-');
      tC+=c; tG+=g;
      if(c>0||g>0) pj++;
    });
    row.push(tC>0?formatTime(tC):'-', tG>0?formatTime(tG):'-', formatTime(tC+tG), pj||'-');
    rows.push(row);
  });

  rows.sort((a,b)=>{ if(a===rows[0]) return -1; const tA=toSecs(a[hdr.length-2])||0, tB=toSecs(b[hdr.length-2])||0; return tB-tA; });

  const nC = hdr.length;
  const ws = makeSheet(rows, [22,8,14,...matches.flatMap(()=>[12,12]),13,13,14,10]);
  for(let c=0;c<nC;c++) sc(ws,0,c, c<3?S.HDR: c<3+matches.length*2 ? (c%2===1?S.HDR_G:S.HDR_B) : S.BOLD);
  for(let r=1;r<rows.length;r++) {
    if(r%2===0) styleRow(ws,r,nC,S.ALT);
    for(let c=3;c<nC;c++) sc(ws,r,c,S.CTR);
    const isConvid = rows[r][2]==='Convidat';
    if(isConvid) sc(ws,r,0,{font:{italic:true,color:{rgb:'999999'}}});
  }
  return ws;
}

// ════════════════════════════════════════════════════════════════════════════
// FULL 3 — Stats Individuals Globals
// ════════════════════════════════════════════════════════════════════════════
function sheetStatsGlobals() {
  const stats = calcGlobalStats(DATABASE);
  const findStat = (arr, name) => (arr||[]).find(([n])=>n===name)?.[1]||0;

  const hdr = [
    'Jugador','Dorsal','Posició',
    'Gols','Assistències','Participació gols\n(gols+assist)',
    'Tirs totals','Tirs a porta','% precisió',
    'Key Passes','Regats',
    'Min. Camp','Min. Porter','Min. Total','PJ',
    'Gols a favor\n(camp)','Gols en contra\n(camp)',
    'Gols encaixats\n(porter)','Aturades',
    'Targetes grogues',
    'Rating\n(gols×3 + assist×2 + KP + reg)',
  ];
  const rows = [hdr];

  const allNames = new Set(PLAYERS);
  matches.forEach(m => {
    const subs = m.events?.substitutions||[];
    subs.forEach(s => { if(s.goalkeeper) allNames.add(s.goalkeeper); (s.onPitch||[]).forEach(p=>allNames.add(p)); });
    Object.keys(m.shots||{}).forEach(n=>allNames.add(n));
    Object.keys(m.keyPasses||{}).forEach(n=>allNames.add(n));
    Object.keys(m.dribbles||{}).forEach(n=>allNames.add(n));
  });

  const minutesCampMap = {}, minutesPorterMap = {}, pjMap = {};
  [...allNames].forEach(n => { minutesCampMap[n]=0; minutesPorterMap[n]=0; pjMap[n]=0; });
  matches.forEach(m => {
    const {totals} = calcMatchStats(m);
    const gkS = calcGoalkeeperStints(m);
    Object.entries(totals).forEach(([n,s]) => { if(minutesCampMap[n]!==undefined) minutesCampMap[n]+=s; });
    Object.entries(gkS).forEach(([n,arr]) => { if(minutesPorterMap[n]!==undefined) minutesPorterMap[n]+=arr.reduce((a,s)=>a+(s.end-s.start),0); });
    const used = new Set();
    (m.events?.substitutions||[]).forEach(s => { if(s.goalkeeper) used.add(s.goalkeeper); (s.onPitch||[]).forEach(p=>used.add(p)); });
    used.forEach(n => { if(pjMap[n]!==undefined) pjMap[n]++; });
  });

  const savesMap = {};
  [...allNames].forEach(n => savesMap[n]=0);
  matches.forEach(m => { Object.entries(m.savesManual||{}).forEach(([n,v]) => { if(savesMap[n]!==undefined) savesMap[n]+=v; }); });

  const shotsMap={}, shotsOTMap={}, kpMap={}, regMap={};
  [...allNames].forEach(n => { shotsMap[n]=0; shotsOTMap[n]=0; kpMap[n]=0; regMap[n]=0; });
  matches.forEach(m => {
    Object.entries(m.shots||{}).forEach(([n,evs]) => { shotsMap[n]=(shotsMap[n]||0)+evs.length; shotsOTMap[n]=(shotsOTMap[n]||0)+evs.filter(e=>e.onTarget).length; });
    Object.entries(m.keyPasses||{}).forEach(([n,evs]) => { kpMap[n]=(kpMap[n]||0)+evs.length; });
    Object.entries(m.dribbles||{}).forEach(([n,evs]) => { regMap[n]=(regMap[n]||0)+evs.length; });
  });

  const sorted = [...allNames].sort((a,b) => {
    const rA = findStat(stats.topScorers,a)*3 + findStat(stats.topAssists,a)*2 + (kpMap[a]||0) + (regMap[a]||0);
    const rB = findStat(stats.topScorers,b)*3 + findStat(stats.topAssists,b)*2 + (kpMap[b]||0) + (regMap[b]||0);
    return rB - rA;
  });

  sorted.forEach(name => {
    const p = pl(name);
    const g = findStat(stats.topScorers,name);
    const a = findStat(stats.topAssists,name);
    const tirs = shotsMap[name]||0;
    const tirsOT = shotsOTMap[name]||0;
    const prec = tirs>0 ? `${Math.round((tirsOT/tirs)*100)}%` : '-';
    const mC = minutesCampMap[name]||0;
    const mP = minutesPorterMap[name]||0;
    const gF = findStat(stats.goalsFor,name);
    const gC = findStat(stats.goalsAgainst,name);
    const gEnc = findStat(stats.goalsAgainstGK,name);
    const atur = savesMap[name]||0;
    const tarj = findStat(stats.yellowCards,name);
    const rating = g*3 + a*2 + (kpMap[name]||0) + (regMap[name]||0);
    rows.push([
      name, p?`#${p.number}`:'-', p?.position||'Convidat',
      g||'-', a||'-', (g+a)||'-',
      tirs||'-', tirsOT||'-', prec,
      kpMap[name]||'-', regMap[name]||'-',
      mC>0?formatTime(mC):'-', mP>0?formatTime(mP):'-', formatTime(mC+mP), pjMap[name]||'-',
      gF||'-', gC||'-',
      gEnc||'-', atur||'-',
      tarj||'-',
      rating||'-',
    ]);
  });

  const nC = hdr.length;
  const ws = makeSheet(rows, [22,8,14,7,10,14,10,10,9,10,8,12,12,12,6,13,13,13,10,12,14]);
  const hdrColors = [S.HDR,S.HDR,S.HDR, S.HDR_G,S.HDR_G,S.HDR_G, S.HDR_O,S.HDR_O,S.HDR_O, S.HDR_B,S.HDR_B, S.HDR,S.HDR,S.HDR,S.HDR, S.HDR_G,S.HDR_R, S.HDR_R,S.HDR_B, S.HDR_R, S.BOLD];
  hdrColors.forEach((s,c) => sc(ws,0,c,s));
  for(let r=1;r<rows.length;r++) {
    if(r%2===0) styleRow(ws,r,nC,S.ALT);
    for(let c=3;c<nC;c++) sc(ws,r,c,S.CTR);
    if(rows[r][2]==='Convidat') sc(ws,r,0,{font:{italic:true,color:{rgb:'888888'}}});
  }
  return ws;
}

// ════════════════════════════════════════════════════════════════════════════
// FULL 4 — Tirs per Jugador i Jornada
// ════════════════════════════════════════════════════════════════════════════
function sheetTirs() {
  const hdrBase = ['Jugador','Dorsal'];
  const hdrM = [];
  matches.forEach(m => { const j=m.jornada.replace(/\D/g,''); hdrM.push(`J${j} Tirs`,`J${j} Porta`); });
  const hdr = [...hdrBase,...hdrM,'TOTAL Tirs','TOTAL a Porta','% Precisió'];
  const rows = [hdr];

  const allNames = new Set();
  matches.forEach(m => Object.keys(m.shots||{}).forEach(n=>allNames.add(n)));

  [...allNames].sort().forEach(name => {
    const p = pl(name);
    const row = [name, p?`#${p.number}`:'-'];
    let tT=0, tP=0;
    matches.forEach(m => {
      const evs = m.shots?.[name]||[];
      const porta = evs.filter(e=>e.onTarget).length;
      row.push(evs.length||'-', porta||'-');
      tT+=evs.length; tP+=porta;
    });
    row.push(tT||'-', tP||'-', tT>0?`${Math.round((tP/tT)*100)}%`:'-');
    rows.push(row);
  });

  const nC = hdr.length;
  const ws = makeSheet(rows, [22,8,...matches.flatMap(()=>[8,8]),10,10,10]);
  for(let c=0;c<nC;c++) sc(ws,0,c, c<2?S.HDR: c<2+matches.length*2?(c%2===0?S.HDR_O:S.HDR_G):S.BOLD);
  for(let r=1;r<rows.length;r++) {
    if(r%2===0) styleRow(ws,r,nC,S.ALT);
    for(let c=2;c<nC;c++) sc(ws,r,c,S.CTR);
  }
  return ws;
}

// ════════════════════════════════════════════════════════════════════════════
// FULL 5 — Key Passes i Regats per Jornada
// ════════════════════════════════════════════════════════════════════════════
function sheetKPReg() {
  const hdrBase = ['Jugador','Dorsal'];
  const hdrM = [];
  matches.forEach(m => { const j=m.jornada.replace(/\D/g,''); hdrM.push(`J${j} KP`,`J${j} Reg`); });
  const hdr = [...hdrBase,...hdrM,'TOTAL KP','TOTAL Reg','TOTAL Creació'];
  const rows = [hdr];

  const allNames = new Set();
  matches.forEach(m => { Object.keys(m.keyPasses||{}).forEach(n=>allNames.add(n)); Object.keys(m.dribbles||{}).forEach(n=>allNames.add(n)); });

  [...allNames].sort().forEach(name => {
    const p = pl(name);
    const row = [name, p?`#${p.number}`:'-'];
    let tKP=0, tReg=0;
    matches.forEach(m => {
      const kp = (m.keyPasses?.[name]||[]).length;
      const reg = (m.dribbles?.[name]||[]).length;
      row.push(kp||'-', reg||'-');
      tKP+=kp; tReg+=reg;
    });
    row.push(tKP||'-', tReg||'-', (tKP+tReg)||'-');
    rows.push(row);
  });

  const nC = hdr.length;
  const ws = makeSheet(rows, [22,8,...matches.flatMap(()=>[7,7]),10,10,12]);
  for(let c=0;c<nC;c++) sc(ws,0,c, c<2?S.HDR: c<2+matches.length*2?(c%2===0?S.HDR_B:S.HDR_O):S.BOLD);
  for(let r=1;r<rows.length;r++) {
    if(r%2===0) styleRow(ws,r,nC,S.ALT);
    for(let c=2;c<nC;c++) sc(ws,r,c,S.CTR);
  }
  return ws;
}

// ════════════════════════════════════════════════════════════════════════════
// FULL 6 — Tots els Gols de la temporada
// ════════════════════════════════════════════════════════════════════════════
function sheetGols() {
  const hdr = [
    'Jornada','Rival','Minut','Tipus','Marcador\nParcial','Marcador','Gol','Porter','Assist',
    'J1 camp','J2 camp','J3 camp','J4 camp','Zona','Notes',
  ];
  const rows = [hdr];
  matches.forEach(m => {
    const goals = (m.events?.goals||[]).slice().sort((a,b)=>toSecs(a.time)-toSecs(b.time));
    let home=0, away=0;
    goals.forEach(g => {
      const isFavor = g.type==='favor';
      if(isFavor) home++; else away++;
      const op = g.onPitch||[];
      rows.push([
        m.jornada, m.opponent, g.time,
        isFavor ? 'A FAVOR' : 'EN CONTRA',
        `${home} - ${away}`,
        m.result,
        isFavor ? (g.scorer||'?') : '—',
        g.goalkeeper||'—',
        isFavor ? (g.assist||'—') : '—',
        op[0]||'—', op[1]||'—', op[2]||'—', op[3]||'—',
        g.zone||'—',
        g.notes||'',
      ]);
    });
  });
  const nC = hdr.length;
  const ws = makeSheet(rows, [12,16,8,12,12,10,20,20,20,20,20,20,20,8,50]);
  const hc = [S.HDR,S.HDR,S.HDR_B,S.HDR,S.HDR,S.HDR,S.HDR_G,S.HDR_B,S.HDR_G,...Array(4).fill(S.HDR),S.HDR,S.HDR];
  hc.forEach((s,c) => sc(ws,0,c,s));
  for(let r=1;r<rows.length;r++) {
    const isFav = rows[r][3]==='A FAVOR';
    styleRow(ws,r,nC, isFav ? S.FAVOR : S.CONTR);
    [2,3,4,5,13].forEach(c=>sc(ws,r,c,{...S.CTR,...(isFav?S.FAVOR:S.CONTR)}));
  }
  return ws;
}

// ════════════════════════════════════════════════════════════════════════════
// FULLS 7+ — Detall per Jornada
// ════════════════════════════════════════════════════════════════════════════
function sheetJornada(m) {
  const [gfRes, gcRes] = (m.result||'0-0').split('-').map(s=>parseInt(s.trim())||0);
  const goals = (m.events?.goals||[]).slice().sort((a,b)=>toSecs(a.time)-toSecs(b.time));
  const subs = m.events?.substitutions||[];
  const cards = m.events?.cards||[];

  // Col·lecta tots els noms que aparèixen en aquest partit
  const matchNames = new Set();
  subs.forEach(s => { if(s.goalkeeper) matchNames.add(s.goalkeeper); (s.onPitch||[]).forEach(p=>matchNames.add(p)); });
  goals.forEach(g => { if(g.scorer) matchNames.add(g.scorer); if(g.assist) matchNames.add(g.assist); if(g.goalkeeper) matchNames.add(g.goalkeeper); });
  Object.keys(m.shots||{}).forEach(n=>matchNames.add(n));
  Object.keys(m.keyPasses||{}).forEach(n=>matchNames.add(n));
  Object.keys(m.dribbles||{}).forEach(n=>matchNames.add(n));

  const rows = [];
  const SPACER = [];

  // ── Títol ──
  rows.push([`${m.jornada} — Real Tiesada ${m.result} ${m.opponent}`, m.date,'','','','','','','','']);
  rows.push(SPACER);

  // ── Secció A: Gols ──
  rows.push(['⚽ GOLS','','','','','','','','','']);
  rows.push(['Min','Tipus','Marcador Parcial','Gol','Assist','Porter','J1','J2','J3','J4','Zona','Notes']);
  let h=0, a=0;
  goals.forEach(g => {
    const isFav = g.type==='favor';
    if(isFav) h++; else a++;
    const op = g.onPitch||[];
    rows.push([
      g.time, isFav?'A FAVOR':'EN CONTRA', `${h} - ${a}`,
      isFav?(g.scorer||'?'):'—', isFav?(g.assist||'—'):'—', g.goalkeeper||'—',
      op[0]||'—', op[1]||'—', op[2]||'—', op[3]||'—',
      g.zone||'—', g.notes||'',
    ]);
  });
  if(goals.length===0) rows.push(['—','Sense gols registrats','','','','','','','','','','']);
  rows.push(SPACER);

  // ── Secció B: Substitucions ──
  rows.push(['🔄 SUBSTITUCIONS I ALINEACIÓ','','','','','','','','','']);
  rows.push(['Min','Porter','J1 Camp','J2 Camp','J3 Camp','J4 Camp','Descans?']);
  subs.forEach(s => {
    const op = s.onPitch||[];
    rows.push([s.time, s.goalkeeper||'—', op[0]||'—', op[1]||'—', op[2]||'—', op[3]||'—', s._isBreak?'⏸ SÍ':'']);
  });
  rows.push(SPACER);

  // ── Secció C: Tirs ──
  rows.push(['🎯 TIRS','','','','','','','','','']);
  rows.push(['Jugador','Minut','A porta?','','','','','','','']);
  Object.entries(m.shots||{}).sort().forEach(([name, evs]) => {
    evs.forEach((e,i) => {
      rows.push([i===0?name:'', e.time, e.onTarget?'✓ A porta':'✗ Fora','','','','','','','']);
    });
  });
  rows.push(SPACER);

  // ── Secció D: Key Passes i Regats ──
  rows.push(['🎯 KEY PASSES','','🏃 REGATS','','','','','','','']);
  rows.push(['Jugador','Minut','','Jugador','Minut','','','','','']);
  const kpEntries = Object.entries(m.keyPasses||{}).flatMap(([n,evs])=>evs.map(e=>({name:n,time:e.time})));
  const regEntries = Object.entries(m.dribbles||{}).flatMap(([n,evs])=>evs.map(e=>({name:n,time:e.time})));
  const maxLen = Math.max(kpEntries.length, regEntries.length);
  for(let i=0;i<maxLen;i++) {
    const kp = kpEntries[i]||{name:'',time:''};
    const reg = regEntries[i]||{name:'',time:''};
    rows.push([kp.name,kp.time,'',reg.name,reg.time,'','','','','']);
  }
  rows.push(SPACER);

  // ── Secció E: Estadístiques del partit per jugador ──
  rows.push(['📊 RESUM JUGADOR (aquest partit)','','','','','','','','','']);
  rows.push(['Jugador','Dorsal','Min Camp','Min Porter','Gols','Assist','Tirs','A porta','KP','Reg','Gols enc.','Aturades']);
  const {totals} = calcMatchStats(m);
  const gkS = calcGoalkeeperStints(m);
  const matchG = {}, matchA = {}, matchEnc = {};
  [...matchNames].forEach(n => { matchG[n]=0; matchA[n]=0; matchEnc[n]=0; });
  goals.forEach(g => {
    if(g.type==='favor') { if(g.scorer&&matchG[g.scorer]!==undefined) matchG[g.scorer]++; if(g.assist&&matchA[g.assist]!==undefined) matchA[g.assist]++; }
    else { if(g.goalkeeper&&matchEnc[g.goalkeeper]!==undefined) matchEnc[g.goalkeeper]++; }
  });
  [...matchNames].sort().forEach(name => {
    const p = pl(name);
    const mC = totals[name]||0;
    const mP = (gkS[name]||[]).reduce((a,s)=>a+(s.end-s.start),0);
    if(mC===0&&mP===0) return;
    const tirs = (m.shots?.[name]||[]).length;
    const porta = (m.shots?.[name]||[]).filter(e=>e.onTarget).length;
    const kp = (m.keyPasses?.[name]||[]).length;
    const reg = (m.dribbles?.[name]||[]).length;
    const enc = matchEnc[name]||0;
    const atur = m.savesManual?.[name]!==undefined ? m.savesManual[name] : '-';
    rows.push([
      name, p?`#${p.number}`:'-',
      mC>0?formatTime(mC):'-', mP>0?formatTime(mP):'-',
      matchG[name]||'-', matchA[name]||'-',
      tirs||'-', porta||'-', kp||'-', reg||'-',
      enc||'-', atur,
    ]);
  });

  // ── Secció F: Retransmissió ──
  rows.push(SPACER);
  rows.push(['📝 RETRANSMISSIÓ','','','','','','','','','']);
  rows.push(['Min','Tipus','Text','Jugadors','Vídeo URL','','','','','']);
  (m.events?.retransmissio||[]).forEach(r => {
    rows.push([r.time, r.type, r.text, (r.players||[]).join(', ')||'—', r.videoUrl||'', '','','','','']);
  });

  const ws = makeSheet(rows, [10,20,18,20,20,20,20,20,20,20,8,50]);
  ws['!rows'][0] = {hpt:32};

  // Estils títol
  sc(ws,0,0,{font:{bold:true,sz:13,color:{rgb:'E5C07B'}}, fill:{fgColor:{rgb:'111111'}}});

  // Estils seccions
  let ri = 2;
  const sectionRows = [];
  rows.forEach((row,i) => { if(row[0]&&typeof row[0]==='string'&&(row[0].startsWith('⚽')||row[0].startsWith('🔄')||row[0].startsWith('🎯')||row[0].startsWith('🏃')||row[0].startsWith('📊')||row[0].startsWith('📝'))) sectionRows.push(i); });
  sectionRows.forEach(r => { for(let c=0;c<10;c++) sc(ws,r,c,S.SEC); ws['!rows'][r]={hpt:24}; });

  // Capçaleres de secció (fila after section title)
  rows.forEach((row,i) => {
    if(i===0) return;
    const prev = rows[i-1];
    if(prev&&typeof prev[0]==='string'&&prev[0].startsWith('⚽')) { for(let c=0;c<12;c++) sc(ws,i,c,S.HDR_B); }
    else if(prev&&typeof prev[0]==='string'&&prev[0].startsWith('🔄')) { for(let c=0;c<7;c++) sc(ws,i,c,S.HDR_O); }
    else if(prev&&typeof prev[0]==='string'&&prev[0].startsWith('🎯 TIRS')) { for(let c=0;c<3;c++) sc(ws,i,c,S.HDR_O); }
    else if(prev&&typeof prev[0]==='string'&&prev[0].startsWith('🎯 KEY')) { for(let c=0;c<5;c++) sc(ws,i,c,S.HDR_B); }
    else if(prev&&typeof prev[0]==='string'&&prev[0].startsWith('📊')) { for(let c=0;c<12;c++) sc(ws,i,c,S.HDR); }
    else if(prev&&typeof prev[0]==='string'&&prev[0].startsWith('📝')) { for(let c=0;c<5;c++) sc(ws,i,c,S.HDR_B); }
  });

  // Colors gols
  rows.forEach((row,i) => {
    if(row[1]==='A FAVOR') styleRow(ws,i,12,S.FAVOR);
    else if(row[1]==='EN CONTRA') styleRow(ws,i,12,S.CONTR);
  });

  return ws;
}

// ════════════════════════════════════════════════════════════════════════════
// GENERACIÓ EXCEL
// ════════════════════════════════════════════════════════════════════════════
async function generateExcel() {
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, sheetResumPartits(),   'Resum Partits');
  XLSX.utils.book_append_sheet(wb, sheetMinuts(),         'Minuts Jugadors');
  XLSX.utils.book_append_sheet(wb, sheetStatsGlobals(),   'Stats Individuals');
  XLSX.utils.book_append_sheet(wb, sheetTirs(),           'Tirs per Jornada');
  XLSX.utils.book_append_sheet(wb, sheetKPReg(),          'KP i Regats');
  XLSX.utils.book_append_sheet(wb, sheetGols(),           'Tots els Gols');
  matches.forEach(m => {
    const num = m.jornada.replace(/\D/g,'');
    const name = `J${num} ${m.opponent}`.slice(0,31);
    XLSX.utils.book_append_sheet(wb, sheetJornada(m), name);
  });

  const date = new Date().toISOString().slice(0,10);
  XLSX.writeFile(wb, `real-tiesada-${date}.xlsx`, {cellStyles: true});
}

export default function ExportExcelButton() {
  const [loading, setLoading] = useState(false);
  const handleExport = async () => {
    setLoading(true);
    try { await generateExcel(); }
    catch(e) { console.error(e); alert('Error exportant: ' + e.message); }
    finally { setLoading(false); }
  };
  return (
    <button onClick={handleExport} disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/30
        bg-emerald-500/10 text-emerald-400 text-sm font-bold hover:bg-emerald-500/20
        transition-all disabled:opacity-50">
      {loading
        ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Generant...</>
        : <>📊 Exportar Excel</>
      }
    </button>
  );
}
