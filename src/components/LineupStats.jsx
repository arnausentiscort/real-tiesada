import React, { useMemo, useState } from 'react';
import { useSeason } from '../SeasonContext.jsx';
import { cutBonus } from '../utils.js';

const BASE = import.meta.env.BASE_URL;
const MEDALS = ['🥇','🥈','🥉'];

function getShirt(roster, name) {
  return roster.find(r => r.name === name)?.shirtName || name.split(' ')[0];
}

function PlayerAvatar({ name, size = 28, roster }) {
  const pl = roster.find(r => r.name === name);
  if (pl?.photo) return (
    <div className="rounded-full overflow-hidden shrink-0"
      style={{width:size, height:size, border:'2px solid #121212'}}>
      <img src={`${BASE}${pl.photo}`} alt={name}
        className="w-full h-full object-cover object-top"/>
    </div>
  );
  return (
    <div className="rounded-full flex items-center justify-center shrink-0 font-black"
      style={{width:size, height:size, border:'2px solid #121212',
        background:'rgba(229,192,123,0.1)', fontSize:size*0.32, color:'#E5C07B'}}>
      {pl?.number || name[0]}
    </div>
  );
}

function combos(arr, k) {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [first, ...rest] = arr;
  return [
    ...combos(rest, k - 1).map(c => [first, ...c]),
    ...combos(rest, k),
  ];
}

function parseSeconds(timeStr) {
  const [m, s] = timeStr.split(':').map(Number);
  return m * 60 + (s || 0);
}

function calcLineupStats(matches) {
  const pairData = {};
  const trioData = {};

  const getPair = (a, b) => {
    const key = [a, b].sort().join('|||');
    if (!pairData[key]) pairData[key] = { players: [a, b].sort(), secs: 0, goalsFor: 0, goalsAgainst: 0 };
    return pairData[key];
  };

  const getTrio = (arr3) => {
    const sorted = [...arr3].sort();
    const key = sorted.join('|||');
    if (!trioData[key]) trioData[key] = { players: sorted, secs: 0, goalsFor: 0, goalsAgainst: 0 };
    return trioData[key];
  };

  matches.forEach(match => {
    const subs = match.events?.substitutions || [];

    if (subs.length >= 2) {
      for (let i = 0; i < subs.length - 1; i++) {
        const cur  = subs[i];
        const next = subs[i + 1];
        const secs = parseSeconds(next.time) - parseSeconds(cur.time);
        if (secs <= 0) continue;
        const secsTot = secs + cutBonus(match, parseSeconds(cur.time), parseSeconds(next.time));

        const players = (cur.onPitch || []).filter(p => p !== cur.goalkeeper);

        for (let a = 0; a < players.length; a++)
          for (let b = a + 1; b < players.length; b++)
            getPair(players[a], players[b]).secs += secsTot;

        if (players.length >= 3)
          combos(players, 3).forEach(c => { getTrio(c).secs += secsTot; });
      }
    }

    (match.events?.goals || []).forEach(goal => {
      const op = goal.onPitch || [];
      if (!op.length) return;
      const isFor = goal.type === 'favor';

      for (let a = 0; a < op.length; a++) {
        for (let b = a + 1; b < op.length; b++) {
          const p = getPair(op[a], op[b]);
          if (isFor) p.goalsFor++; else p.goalsAgainst++;
        }
      }

      if (op.length >= 3)
        combos(op, 3).forEach(c => {
          const t = getTrio(c);
          if (isFor) t.goalsFor++; else t.goalsAgainst++;
        });
    });
  });

  const byFor = (a, b) => b.goalsFor - a.goalsFor || a.goalsAgainst - b.goalsAgainst;
  // Més gols encaixats junts; desempat pels que ho han fet en menys minuts
  const byAgainst = (a, b) => b.goalsAgainst - a.goalsAgainst || a.secs - b.secs;
  const allPairs = Object.values(pairData).filter(p => p.goalsFor > 0 || p.goalsAgainst > 0 || p.secs > 0);
  const allTrios = Object.values(trioData).filter(t => t.goalsFor > 0 || t.goalsAgainst > 0 || t.secs > 0);

  return {
    allPairs, allTrios,
    pairs: [...allPairs].filter(p => p.goalsFor > 0 || p.goalsAgainst > 0 || p.secs > 0).sort(byFor).slice(0, 10),
    trios: [...allTrios].filter(t => t.goalsFor > 0 || t.secs > 0).sort(byFor).slice(0, 5),
    pairsAgainst: allPairs.filter(p => p.goalsAgainst > 0).sort(byAgainst).slice(0, 10),
    triosAgainst: allTrios.filter(t => t.goalsAgainst > 0).sort(byAgainst).slice(0, 5),
  };
}

// ── Secció 1: Top Parelles ────────────────────────────────────────
function TopPairs({ pairs, roster, against = false }) {
  const val = p => (against ? p.goalsAgainst : p.goalsFor);
  const maxFor = Math.max(...pairs.map(val), 1);

  return (
    <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-black text-[#E5C07B] flex items-center gap-2">
          {against ? '🧱 Parelles amb més gols en contra' : '🤝 Top Parelles'}
        </h3>
        <p className="text-[10px] text-gray-600 mt-0.5">{against ? 'Gols encaixats mentre jugaven junts' : 'Ordenat per gols marcats junts'}</p>
      </div>

      <div className="space-y-3">
        {pairs.map(({ players, secs, goalsFor, goalsAgainst }, i) => {
          const [nameA, nameB] = players;
          const mins   = secs > 0 ? Math.round(secs / 60) : null;
          const isTop3 = i < 3;
          const pct    = ((against ? goalsAgainst : goalsFor) / maxFor) * 100;

          return (
            <div key={i}>
              <div className="flex items-center gap-2.5">
                {/* Posició */}
                <span className="text-sm w-5 shrink-0 text-center leading-none">
                  {MEDALS[i] || <span className="text-[10px] text-gray-700 font-mono">{i+1}</span>}
                </span>

                {/* Avatars solapats */}
                <div className="flex shrink-0">
                  <PlayerAvatar name={nameA} size={26} roster={roster}/>
                  <div style={{marginLeft:-9}}>
                    <PlayerAvatar name={nameB} size={26} roster={roster}/>
                  </div>
                </div>

                {/* Noms + barra */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap mb-1">
                    <span className="text-xs font-black"
                      style={{color: isTop3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)'}}>
                      {getShirt(roster, nameA)}
                    </span>
                    <span className="text-[9px] text-gray-700">+</span>
                    <span className="text-xs font-black"
                      style={{color: isTop3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)'}}>
                      {getShirt(roster, nameB)}
                    </span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.05)'}}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{width:`${pct}%`, background: against ? 'rgba(192,57,43,0.65)' : 'rgba(39,174,96,0.6)'}}/>
                  </div>
                </div>

                {/* Gols — prominents */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-black font-mono ${against ? (isTop3 ? 'text-xl text-[#e8574a]' : 'text-base text-[#C0392B]') : (isTop3 ? 'text-xl text-emerald-400' : 'text-base text-emerald-600')}`}>
                      {against ? goalsAgainst : goalsFor}
                    </span>
                    <span className="text-[10px]">{against ? '🥅' : '⚽'}</span>
                  </div>
                  {!against && goalsAgainst > 0 && (
                    <span className="text-xs font-mono text-[#C0392B]">-{goalsAgainst}</span>
                  )}
                  {mins !== null && (
                    <span className="text-[10px] font-mono text-gray-600">{mins}'</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Secció 2: Top Trios (3 jugadors de camp) ─────────────────────
function TopTrios({ trios, roster, against = false }) {
  const val = t => (against ? t.goalsAgainst : t.goalsFor);
  const maxFor = Math.max(...trios.map(val), 1);

  if (!trios.length) return null;

  return (
    <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-black text-[#E5C07B] flex items-center gap-2">
          {against ? '🧱 Trios amb més gols en contra' : '⚡ Top Trios'}
        </h3>
        <p className="text-[10px] text-gray-600 mt-0.5">3 jugadors de camp · {against ? 'gols encaixats junts' : 'ordenat per gols marcats junts'}</p>
      </div>

      <div className="space-y-4">
        {trios.map(({ players, secs, goalsFor, goalsAgainst }, i) => {
          const mins   = secs > 0 ? Math.round(secs / 60) : null;
          const isTop3 = i < 3;
          const pct    = ((against ? goalsAgainst : goalsFor) / maxFor) * 100;

          return (
            <div key={i}>
              <div className="flex items-start gap-2.5">
                {/* Posició */}
                <span className="text-sm w-5 shrink-0 text-center leading-none pt-1">
                  {MEDALS[i] || <span className="text-[10px] text-gray-700 font-mono">{i+1}</span>}
                </span>

                {/* 3 Avatars solapats */}
                <div className="flex shrink-0 pt-0.5">
                  {players.map((name, j) => (
                    <div key={name} style={{marginLeft: j > 0 ? -10 : 0}}>
                      <PlayerAvatar name={name} size={24} roster={roster}/>
                    </div>
                  ))}
                </div>

                {/* Noms + barra */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-x-1 gap-y-0.5 mb-1.5">
                    {players.map((name, j) => (
                      <span key={name} className="text-[10px] font-black"
                        style={{color: isTop3 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)'}}>
                        {getShirt(roster, name)}{j < players.length - 1 && <span className="text-gray-700 font-normal"> ·</span>}
                      </span>
                    ))}
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.05)'}}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{width:`${pct}%`, background: against ? 'rgba(192,57,43,0.65)' : 'rgba(39,174,96,0.6)'}}/>
                  </div>
                </div>

                {/* Gols — prominents */}
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-black font-mono ${against ? (isTop3 ? 'text-xl text-[#e8574a]' : 'text-base text-[#C0392B]') : (isTop3 ? 'text-xl text-emerald-400' : 'text-base text-emerald-600')}`}>
                      {against ? goalsAgainst : goalsFor}
                    </span>
                    <span className="text-[10px]">{against ? '🥅' : '⚽'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!against && goalsAgainst > 0 && (
                      <span className="text-[10px] font-mono text-[#C0392B]">-{goalsAgainst}</span>
                    )}
                    {mins !== null && (
                      <span className="text-[10px] font-mono text-gray-600">{mins}'</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Secció 3: rendiment per 50 minuts (el temps com a variable) ───
const SORTS = {
  net:     { label: 'Millor net',          fn: (a, b) => b.net - a.net },
  atac:    { label: 'Més gols a favor',    fn: (a, b) => b.gf - a.gf },
  defensa: { label: 'Menys gols en contra', fn: (a, b) => a.gc - b.gc },
  contra:  { label: 'Més gols en contra',  fn: (a, b) => b.gc - a.gc },
  pitjor:  { label: 'Pitjor net',          fn: (a, b) => a.net - b.net },
};

function PerMinutes({ allPairs, allTrios, roster, total }) {
  const [kind, setKind] = useState('pairs');
  const [sort, setSort] = useState('net');
  const minMins = kind === 'pairs' ? 40 : 30;

  const rows = useMemo(() => {
    const src = kind === 'pairs' ? allPairs : allTrios;
    return src
      .filter(r => r.secs >= minMins * 60)
      .map(r => {
        const k = total * 60 / r.secs;
        const gf = r.goalsFor * k, gc = r.goalsAgainst * k;
        return { ...r, gf, gc, net: gf - gc };
      })
      .sort(SORTS[sort].fn)
      .slice(0, 8);
  }, [allPairs, allTrios, kind, sort, total, minMins]);

  const max = Math.max(...rows.map(r => Math.max(r.gf, r.gc)), 1);
  const tab = on => `px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${on
    ? 'bg-[#E5C07B]/15 border-[#E5C07B]/40 text-[#E5C07B]' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`;

  return (
    <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-5">
      <div className="mb-3">
        <h3 className="text-sm font-black text-[#E5C07B] flex items-center gap-2">⏱️ Rendiment per {total} minuts</h3>
        <p className="text-[10px] text-gray-600 mt-0.5">
          Gols a favor i en contra repartits pel temps que han jugat junts · mínim {minMins} min junts
        </p>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-2">
        <button onClick={() => setKind('pairs')} className={tab(kind === 'pairs')}>Parelles</button>
        <button onClick={() => setKind('trios')} className={tab(kind === 'trios')}>Trios</button>
      </div>
      <div className="flex gap-1.5 flex-wrap mb-4">
        {Object.entries(SORTS).map(([key, { label }]) => (
          <button key={key} onClick={() => setSort(key)} className={tab(sort === key)}>{label}</button>
        ))}
      </div>

      {rows.length === 0 && <p className="text-xs text-gray-600 italic">Encara no hi ha prou minuts junts.</p>}

      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={r.players.join('|')} className="flex items-center gap-2.5">
            <span className="text-sm w-5 shrink-0 text-center leading-none">
              {MEDALS[i] || <span className="text-[10px] text-gray-700 font-mono">{i + 1}</span>}
            </span>
            <div className="flex shrink-0">
              {r.players.map((name, j) => (
                <div key={name} style={{ marginLeft: j > 0 ? -9 : 0 }}>
                  <PlayerAvatar name={name} size={kind === 'pairs' ? 26 : 22} roster={roster}/>
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-x-1 mb-1">
                {r.players.map((name, j) => (
                  <span key={name} className="text-[11px] font-black text-white/80">
                    {getShirt(roster, name)}{j < r.players.length - 1 && <span className="text-gray-700 font-normal"> +</span>}
                  </span>
                ))}
                <span className="text-[10px] font-mono text-gray-600 ml-1">{Math.round(r.secs / 60)}'</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden mb-0.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="h-full rounded-full" style={{ width: `${(r.gf / max) * 100}%`, background: 'rgba(39,174,96,0.65)' }}/>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="h-full rounded-full" style={{ width: `${(r.gc / max) * 100}%`, background: 'rgba(192,57,43,0.65)' }}/>
              </div>
            </div>
            <div className="text-right shrink-0 leading-tight">
              <div className={`text-base font-black font-mono ${r.net > 0 ? 'text-emerald-400' : r.net < 0 ? 'text-[#e8574a]' : 'text-gray-400'}`}>
                {r.net > 0 ? '+' : ''}{r.net.toFixed(1)}
              </div>
              <div className="text-[10px] font-mono text-gray-500">
                <span className="text-emerald-600">{r.gf.toFixed(1)}</span> · <span className="text-[#C0392B]">{r.gc.toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Component principal ───────────────────────────────────────────
export default function LineupStats() {
  const { db, format } = useSeason();
  const { allPairs, allTrios, pairs, trios, pairsAgainst, triosAgainst } = useMemo(() => calcLineupStats(db.matches), [db]);
  if (!pairs.length && !trios.length) return null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TopPairs pairs={pairs} roster={db.roster}/>
        <TopTrios trios={trios} roster={db.roster}/>
      </div>
      {(pairsAgainst.length > 0 || triosAgainst.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {pairsAgainst.length > 0 && <TopPairs pairs={pairsAgainst} roster={db.roster} against/>}
          {triosAgainst.length > 0 && <TopTrios trios={triosAgainst} roster={db.roster} against/>}
        </div>
      )}
      <PerMinutes allPairs={allPairs} allTrios={allTrios} roster={db.roster} total={format.totalMinutes || 50}/>
    </div>
  );
}
