import React, { useState } from 'react';
import { DATABASE } from '../data.js';
import { calcMatchStats, calcGoalkeeperStints, calcGlobalStats, formatTime } from '../utils.js';

// ── Genera i descarrega l'Excel ───────────────────────────────────
async function generateExcel() {
  // Importem SheetJS dinàmicament
  const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs');

  const wb = XLSX.utils.book_new();

  // ── FULL 1: Minuts per jornada ────────────────────────────────
  const players = DATABASE.roster.map(p => p.name);
  const matches = DATABASE.matches;

  // Capçalera
  const header1 = ['Jugador', 'Dorsal'];
  matches.forEach(m => {
    header1.push(`${m.jornada} Camp`);
    header1.push(`${m.jornada} Porter`);
  });
  header1.push('TOTAL Camp', 'TOTAL Porter', 'TOTAL');

  const rows1 = [header1];

  players.forEach(name => {
    const pl = DATABASE.roster.find(p => p.name === name);
    const row = [name, `#${pl?.number || ''}`];
    let totalCamp = 0, totalPorter = 0;

    matches.forEach(match => {
      const { totals } = calcMatchStats(match);
      const campSecs = totals[name] || 0;

      const gkStints = calcGoalkeeperStints(match);
      const porterSecs = (gkStints[name] || []).reduce((a, s) => a + (s.end - s.start), 0);

      row.push(formatTime(campSecs));
      row.push(porterSecs > 0 ? formatTime(porterSecs) : '-');
      totalCamp   += campSecs;
      totalPorter += porterSecs;
    });

    row.push(formatTime(totalCamp));
    row.push(totalPorter > 0 ? formatTime(totalPorter) : '-');
    row.push(formatTime(totalCamp + totalPorter));
    rows1.push(row);
  });

  const ws1 = XLSX.utils.aoa_to_sheet(rows1);

  // Amplada columnes
  ws1['!cols'] = [
    {wch:22}, {wch:8},
    ...matches.flatMap(() => [{wch:12},{wch:12}]),
    {wch:13}, {wch:13}, {wch:10}
  ];

  // Estil capçalera (fons fosc)
  const range1 = XLSX.utils.decode_range(ws1['!ref']);
  for (let C = range1.s.c; C <= range1.e.c; C++) {
    const cell = ws1[XLSX.utils.encode_cell({r:0, c:C})];
    if (cell) {
      cell.s = { font:{bold:true, color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'1E1E1E'}}, alignment:{horizontal:'center'} };
    }
  }

  XLSX.utils.book_append_sheet(wb, ws1, 'Minuts per Jornada');

  // ── FULL 2: Gols per jugador ──────────────────────────────────
  const stats = calcGlobalStats(DATABASE);

  const header2 = ['Jugador','Dorsal','Gols','Assists','Gols a favor (camp)','Gols en contra (camp)','Gols encaixats (porter)','Aturades'];
  const rows2 = [header2];

  players.forEach(name => {
    const pl = DATABASE.roster.find(p => p.name === name);
    const gols     = stats.topScorers.find(([n])=>n===name)?.[1] || 0;
    const assists  = stats.topAssists.find(([n])=>n===name)?.[1] || 0;
    const gf       = stats.goalsFor.find(([n])=>n===name)?.[1] || 0;
    const ga       = stats.goalsAgainst.find(([n])=>n===name)?.[1] || 0;
    const encaixats= stats.goalsConceded.find(([n])=>n===name)?.[1] || 0;
    const aturades = stats.saves.find(([n])=>n===name)?.[1] || 0;
    rows2.push([name, `#${pl?.number||''}`, gols, assists, gf, ga, encaixats||'-', aturades||'-']);
  });

  const ws2 = XLSX.utils.aoa_to_sheet(rows2);
  ws2['!cols'] = [{wch:22},{wch:8},{wch:8},{wch:10},{wch:20},{wch:22},{wch:24},{wch:12}];

  for (let C = 0; C <= 7; C++) {
    const cell = ws2[XLSX.utils.encode_cell({r:0, c:C})];
    if (cell) cell.s = { font:{bold:true, color:{rgb:'FFFFFF'}}, fill:{fgColor:{rgb:'C0392B'}}, alignment:{horizontal:'center'} };
  }

  XLSX.utils.book_append_sheet(wb, ws2, 'Gols per Jugador');

  // ── Descarrega ────────────────────────────────────────────────
  const date = new Date().toISOString().slice(0,10);
  XLSX.writeFile(wb, `real-tiesada-stats-${date}.xlsx`);
}

// ── Component botó ────────────────────────────────────────────────
export default function ExportExcelButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await generateExcel();
    } catch(e) {
      console.error('Error exportant:', e);
      alert('Error generant l\'Excel: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleExport} disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/30
        bg-emerald-500/10 text-emerald-400 text-sm font-bold hover:bg-emerald-500/20
        transition-all disabled:opacity-50">
      {loading ? (
        <>
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Generant...
        </>
      ) : (
        <>📊 Exportar Excel</>
      )}
    </button>
  );
}
