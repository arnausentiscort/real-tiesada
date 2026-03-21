import React, { useState } from 'react';
import { DATABASE } from '../data.js';
import { calcMatchStats, calcGoalkeeperStints, calcGlobalStats, formatTime } from '../utils.js';

const PLAYERS = DATABASE.roster.map(p => p.name);
const SHIRT   = (n) => DATABASE.roster.find(p => p.name === n)?.shirtName || n.split(' ')[0];

async function generateExcel() {
  const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs');
  const wb   = XLSX.utils.book_new();

  // ── Colors ──────────────────────────────────────────────────────
  const HDR_DARK  = { font:{bold:true,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'1a1a2e'}}, alignment:{horizontal:'center',vertical:'center'}, border:{bottom:{style:'thin',color:{rgb:'E5C07B'}}} };
  const HDR_RED   = { font:{bold:true,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'7b1c12'}}, alignment:{horizontal:'center',vertical:'center'} };
  const HDR_GREEN = { font:{bold:true,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'1a4a1a'}}, alignment:{horizontal:'center',vertical:'center'} };
  const HDR_BLUE  = { font:{bold:true,color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'1a3a6a'}}, alignment:{horizontal:'center',vertical:'center'} };
  const ROW_FAVOR = { fill:{fgColor:{rgb:'e8f5e9'}} };
  const ROW_CONTR = { fill:{fgColor:{rgb:'fce4e4'}} };
  const ROW_ALT   = { fill:{fgColor:{rgb:'f5f5f5'}} };
  const NUM_C     = { alignment:{horizontal:'center'} };
  const BOLD      = { font:{bold:true} };

  const styleCell = (ws, addr, style) => {
    if (!ws[addr]) ws[addr] = {t:'s', v:''};
    ws[addr].s = {...(ws[addr].s||{}), ...style};
  };
  const styleRow = (ws, row, nCols, style) => {
    for (let c=0; c<nCols; c++) {
      const addr = XLSX.utils.encode_cell({r:row, c});
      if (ws[addr]) ws[addr].s = {...(ws[addr].s||{}), ...style};
    }
  };

  // ════════════════════════════════════════════════════════════════
  // FULL 1 — Minuts per Jornada
  // ════════════════════════════════════════════════════════════════
  const matches = DATABASE.matches;
  const hdr1 = ['Jugador','Dorsal'];
  matches.forEach(m => { hdr1.push(`${m.jornada}\nCamp`, `${m.jornada}\nPorter`); });
  hdr1.push('TOTAL\nCamp','TOTAL\nPorter','TOTAL\nGENERAL');

  const data1 = [hdr1];
  PLAYERS.forEach(name => {
    const pl  = DATABASE.roster.find(p=>p.name===name);
    const row = [name, `#${pl?.number||''}`];
    let tC=0, tG=0;
    matches.forEach(match => {
      const { totals } = calcMatchStats(match);
      const c = totals[name]||0;
      const gkS = calcGoalkeeperStints(match);
      const g = (gkS[name]||[]).reduce((a,s)=>a+(s.end-s.start),0);
      row.push(c>0 ? formatTime(c) : '-');
      row.push(g>0 ? formatTime(g) : '-');
      tC+=c; tG+=g;
    });
    row.push(tC>0?formatTime(tC):'-', tG>0?formatTime(tG):'-', formatTime(tC+tG));
    data1.push(row);
  });

  // Fila totals
  const totRow = ['TOTAL EQUIP',''];
  matches.forEach(match => {
    const { totals } = calcMatchStats(match);
    const campTotal = Object.values(totals).reduce((a,b)=>a+b,0);
    totRow.push(formatTime(campTotal), '—');
  });
  totRow.push('—','—','—');
  data1.push(totRow);

  const ws1 = XLSX.utils.aoa_to_sheet(data1);
  const nCols1 = hdr1.length;
  ws1['!cols'] = [{wch:22},{wch:8},...matches.flatMap(()=>[{wch:13},{wch:13}]),{wch:13},{wch:13},{wch:13}];
  ws1['!rows'] = [{hpt:32}];
  for (let c=0;c<nCols1;c++) styleCell(ws1, XLSX.utils.encode_cell({r:0,c}), HDR_DARK);
  for (let r=1;r<=PLAYERS.length;r++) {
    if (r%2===0) styleRow(ws1, r, nCols1, {fill:{fgColor:{rgb:'f8f8f8'}}});
  }
  styleRow(ws1, data1.length-1, nCols1, {font:{bold:true}, fill:{fgColor:{rgb:'ffe082'}}});
  XLSX.utils.book_append_sheet(wb, ws1, 'Minuts per Jornada');

  // ════════════════════════════════════════════════════════════════
  // FULL 2 — Gols per Jugador (resum global)
  // ════════════════════════════════════════════════════════════════
  const stats = calcGlobalStats(DATABASE);
  const hdr2 = ['Jugador','Dorsal','Posició','Gols\nMarcats','Assists','Gols\nA favor\n(camp)','Gols\nEn contra\n(camp)','Gols\nEncaixats\n(porter)','Aturades\nTotals'];
  const data2 = [hdr2];
  PLAYERS.forEach(name => {
    const pl  = DATABASE.roster.find(p=>p.name===name);
    // Aturades: suma de savesManual de tots els partits
    let totalSaves = 0;
    DATABASE.matches.forEach(match => {
      if (match.savesManual?.[name] !== undefined) totalSaves += match.savesManual[name];
    });
    data2.push([
      name, `#${pl?.number||''}`, pl?.position||'',
      stats.topScorers.find(([n])=>n===name)?.[1]||0,
      stats.topAssists.find(([n])=>n===name)?.[1]||0,
      stats.goalsFor.find(([n])=>n===name)?.[1]||0,
      stats.goalsAgainst.find(([n])=>n===name)?.[1]||0,
      stats.goalsConceded.find(([n])=>n===name)?.[1]||0,
      totalSaves||'-',
    ]);
  });

  // Fila aturades per jornada
  data2.push([]);
  data2.push(['', '', '', '', '', '', '', '', '']);
  const hdrSaves = ['Jugador','Dorsal', ...DATABASE.matches.map(m=>m.jornada), 'TOTAL'];
  data2.push(hdrSaves);
  PLAYERS.forEach(name => {
    const pl = DATABASE.roster.find(p=>p.name===name);
    let total = 0;
    const row = [name, `#${pl?.number||''}`];
    DATABASE.matches.forEach(match => {
      const v = match.savesManual?.[name];
      row.push(v !== undefined ? v : '-');
      if (v !== undefined) total += v;
    });
    row.push(total || '-');
    const hasAny = DATABASE.matches.some(m => m.savesManual?.[name] !== undefined);
    if (hasAny) data2.push(row);
  });
  const ws2 = XLSX.utils.aoa_to_sheet(data2);
  ws2['!cols'] = [{wch:22},{wch:8},{wch:14},{wch:10},{wch:10},{wch:12},{wch:12},{wch:14},{wch:10}];
  ws2['!rows'] = [{hpt:40}];
  const colors2 = [HDR_DARK,HDR_DARK,HDR_DARK,HDR_GREEN,HDR_GREEN,HDR_GREEN,HDR_RED,HDR_RED,HDR_BLUE];
  for (let c=0;c<9;c++) styleCell(ws2, XLSX.utils.encode_cell({r:0,c}), colors2[c]);
  for (let r=1;r<data2.length;r++) {
    if (r%2===0) styleRow(ws2,r,9,{fill:{fgColor:{rgb:'f8f8f8'}}});
    for (let c=3;c<9;c++) {
      const addr = XLSX.utils.encode_cell({r,c});
      if (ws2[addr]) ws2[addr].s = {...(ws2[addr].s||{}), ...NUM_C};
    }
  }
  XLSX.utils.book_append_sheet(wb, ws2, 'Estadístiques Globals');

  // ════════════════════════════════════════════════════════════════
  // FULLS 3+ — Un per jornada: cada gol amb jugadors en columnes
  // ════════════════════════════════════════════════════════════════
  matches.forEach(match => {
    const goals = (match.events?.goals||[]).slice().sort((a,b)=>{
      const t = x => { const [m,s]=(x||'0:0').split(':').map(Number); return m*60+(s||0); };
      return t(a.time)-t(b.time);
    });

    // ── Secció A: Detall gols ────────────────────────────────────
    const hdrA = ['Min','Tipus','Marcador','Porter','Assist','Jugador 1','Jugador 2','Jugador 3','Jugador 4','Notes'];
    const rowsA = [hdrA];
    let home=0, away=0;
    goals.forEach(g => {
      const isFavor = g.type==='favor';
      if (isFavor) home++; else away++;
      const op = g.onPitch||[];
      rowsA.push([
        g.time,
        isFavor ? `⚽ FAVOR ${home}-${away}` : `❌ CONTRA ${home}-${away}`,
        isFavor ? (g.scorer||'?') : '—',
        g.goalkeeper || '—',
        isFavor ? (g.assist||'—') : '—',
        op[0]||'—', op[1]||'—', op[2]||'—', op[3]||'—',
        g.notes||'',
      ]);
    });

    // ── Secció B: Resum per jugador (sumatori) ───────────────────
    const spacer = Array(10).fill('');
    const hdrB = ['Jugador','Dorsal','Gols\nMarcats','Assists','A favor\n(camp)','En contra\n(camp)','Gols\nEncaixats','Total\nParticipació'];

    // Calcular per aquest match
    const matchStats = {};
    PLAYERS.forEach(name => {
      matchStats[name] = { gols:0, assists:0, gf:0, ga:0, enc:0 };
    });
    goals.forEach(g => {
      const op = g.onPitch||[];
      if (g.type==='favor') {
        if (g.scorer && matchStats[g.scorer])    matchStats[g.scorer].gols++;
        if (g.assist && matchStats[g.assist])    matchStats[g.assist].assists++;
        op.forEach(p => { if (matchStats[p]) matchStats[p].gf++; });
      } else {
        if (g.goalkeeper && matchStats[g.goalkeeper]) matchStats[g.goalkeeper].enc++;
        op.forEach(p => { if (matchStats[p]) matchStats[p].ga++; });
      }
    });

    const rowsB = [hdrB];
    PLAYERS.forEach(name => {
      const s = matchStats[name];
      const total = s.gols + s.assists + s.gf + s.ga + s.enc;
      if (total === 0) return;
      const pl = DATABASE.roster.find(p=>p.name===name);
      rowsB.push([name, `#${pl?.number||''}`, s.gols||'-', s.assists||'-', s.gf||'-', s.ga||'-', s.enc||'-', total]);
    });

    // ── Combina les dues seccions ────────────────────────────────
    const allRows = [...rowsA, spacer, ...rowsB];
    const ws = XLSX.utils.aoa_to_sheet(allRows);

    // Amplades
    ws['!cols'] = [{wch:8},{wch:20},{wch:18},{wch:18},{wch:18},{wch:18},{wch:18},{wch:18},{wch:18},{wch:25}];
    ws['!rows'] = Array(allRows.length).fill({hpt:20});
    ws['!rows'][0] = {hpt:28};

    // Estil capçalera gols
    const hdrACols = [HDR_BLUE,HDR_BLUE,HDR_GREEN,HDR_RED,HDR_GREEN,HDR_DARK,HDR_DARK,HDR_DARK,HDR_DARK,HDR_BLUE];
    for (let c=0;c<10;c++) styleCell(ws, XLSX.utils.encode_cell({r:0,c}), hdrACols[c]);

    // Colors files gols
    for (let r=1;r<rowsA.length;r++) {
      const cell = ws[XLSX.utils.encode_cell({r,c:1})];
      const isFav = cell?.v?.includes('FAVOR');
      styleRow(ws, r, 10, isFav ? ROW_FAVOR : ROW_CONTR);
    }

    // Capçalera resum
    const rB0 = rowsA.length + 1;
    const hdrBCols = [HDR_DARK,HDR_DARK,HDR_GREEN,HDR_GREEN,HDR_GREEN,HDR_RED,HDR_RED,HDR_BLUE];
    for (let c=0;c<8;c++) styleCell(ws, XLSX.utils.encode_cell({r:rB0,c}), hdrBCols[c]);

    // Colors files resum alternats
    for (let r=rB0+1;r<allRows.length;r++) {
      if ((r-rB0)%2===0) styleRow(ws, r, 8, {fill:{fgColor:{rgb:'f8f8f8'}}});
      // Números centrats
      for (let c=2;c<8;c++) {
        const addr = XLSX.utils.encode_cell({r,c});
        if (ws[addr]) ws[addr].s = {...(ws[addr].s||{}), ...NUM_C};
      }
    }

    // Validació: desplegables per columnes Jugador 1-4, Marcador, Porter, Assist
    const playerList = PLAYERS.join(',').slice(0,255); // Excel limit
    const dropCols = [2,3,4,5,6,7,8]; // C,D,E,F,G,H,I
    const nGoals = goals.length;
    if (!ws['!dataValidation']) ws['!dataValidation'] = [];
    dropCols.forEach(c => {
      for (let r=1; r<=nGoals; r++) {
        ws['!dataValidation'].push({
          sqref: XLSX.utils.encode_cell({r,c}),
          type: 'list',
          formula1: `"${playerList}"`,
          showDropDown: false,
          showErrorMessage: true,
        });
      }
    });

    const sheetName = `${match.jornada} ${match.opponent}`.slice(0,31);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  const date = new Date().toISOString().slice(0,10);
  XLSX.writeFile(wb, `real-tiesada-${date}.xlsx`, {cellStyles: true});
}

export default function ExportExcelButton() {
  const [loading, setLoading] = useState(false);
  const handleExport = async () => {
    setLoading(true);
    try { await generateExcel(); }
    catch(e) { console.error(e); alert('Error: ' + e.message); }
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
