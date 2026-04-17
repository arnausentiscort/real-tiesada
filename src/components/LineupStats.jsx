import React, { useMemo } from 'react';
import { DATABASE } from '../data.js';

const BASE = import.meta.env.BASE_URL;
const MEDALS = ['🥇','🥈','🥉'];

function getShirt(name) {
  return DATABASE.roster.find(r => r.name === name)?.shirtName || name.split(' ')[0];
}

function PlayerAvatar({ name, size = 28 }) {
  const pl = DATABASE.roster.find(r => r.name === name);
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

function calcLineupStats() {
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

  DATABASE.matches.forEach(match => {
    const subs = match.events?.substitutions || [];

    if (subs.length >= 2) {
      for (let i = 0; i < subs.length - 1; i++) {
        const cur  = subs[i];
        const next = subs[i + 1];
        const secs = parseSeconds(next.time) - parseSeconds(cur.time);
        if (secs <= 0) continue;

        const players = (cur.onPitch || []).filter(p => p !== cur.goalkeeper);

        for (let a = 0; a < players.length; a++)
          for (let b = a + 1; b < players.length; b++)
            getPair(players[a], players[b]).secs += secs;

        if (players.length >= 3)
          combos(players, 3).forEach(c => { getTrio(c).secs += secs; });
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

  // Ordena per gols marcats junts; desempat per menys gols encaixats
  const pairs = Object.values(pairData)
    .filter(p => p.goalsFor > 0 || p.goalsAgainst > 0 || p.secs > 0)
    .sort((a, b) => b.goalsFor - a.goalsFor || a.goalsAgainst - b.goalsAgainst)
    .slice(0, 10);

  const trios = Object.values(trioData)
    .filter(t => t.goalsFor > 0 || t.secs > 0)
    .sort((a, b) => b.goalsFor - a.goalsFor || a.goalsAgainst - b.goalsAgainst)
    .slice(0, 5);

  return { pairs, trios };
}

// ── Secció 1: Top Parelles ────────────────────────────────────────
function TopPairs({ pairs }) {
  const maxFor = Math.max(...pairs.map(p => p.goalsFor), 1);

  return (
    <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-black text-[#E5C07B] flex items-center gap-2">
          🤝 Top Parelles
        </h3>
        <p className="text-[10px] text-gray-600 mt-0.5">Ordenat per gols marcats junts</p>
      </div>

      <div className="space-y-3">
        {pairs.map(({ players, secs, goalsFor, goalsAgainst }, i) => {
          const [nameA, nameB] = players;
          const mins   = secs > 0 ? Math.round(secs / 60) : null;
          const isTop3 = i < 3;
          const pct    = (goalsFor / maxFor) * 100;

          return (
            <div key={i}>
              <div className="flex items-center gap-2.5">
                {/* Posició */}
                <span className="text-sm w-5 shrink-0 text-center leading-none">
                  {MEDALS[i] || <span className="text-[10px] text-gray-700 font-mono">{i+1}</span>}
                </span>

                {/* Avatars solapats */}
                <div className="flex shrink-0">
                  <PlayerAvatar name={nameA} size={26}/>
                  <div style={{marginLeft:-9}}>
                    <PlayerAvatar name={nameB} size={26}/>
                  </div>
                </div>

                {/* Noms + barra */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap mb-1">
                    <span className="text-xs font-black"
                      style={{color: isTop3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)'}}>
                      {getShirt(nameA)}
                    </span>
                    <span className="text-[9px] text-gray-700">+</span>
                    <span className="text-xs font-black"
                      style={{color: isTop3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)'}}>
                      {getShirt(nameB)}
                    </span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.05)'}}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{width:`${pct}%`, background:'rgba(39,174,96,0.6)'}}/>
                  </div>
                </div>

                {/* Gols — prominents */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-black font-mono ${isTop3 ? 'text-xl text-emerald-400' : 'text-base text-emerald-600'}`}>
                      {goalsFor}
                    </span>
                    <span className="text-[10px]">⚽</span>
                  </div>
                  {goalsAgainst > 0 && (
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
function TopTrios({ trios }) {
  const maxFor = Math.max(...trios.map(t => t.goalsFor), 1);

  if (!trios.length) return null;

  return (
    <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-black text-[#E5C07B] flex items-center gap-2">
          ⚡ Top Trios
        </h3>
        <p className="text-[10px] text-gray-600 mt-0.5">3 jugadors de camp · ordenat per gols marcats junts</p>
      </div>

      <div className="space-y-4">
        {trios.map(({ players, secs, goalsFor, goalsAgainst }, i) => {
          const mins   = secs > 0 ? Math.round(secs / 60) : null;
          const isTop3 = i < 3;
          const pct    = (goalsFor / maxFor) * 100;

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
                      <PlayerAvatar name={name} size={24}/>
                    </div>
                  ))}
                </div>

                {/* Noms + barra */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-x-1 gap-y-0.5 mb-1.5">
                    {players.map((name, j) => (
                      <span key={name} className="text-[10px] font-black"
                        style={{color: isTop3 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)'}}>
                        {getShirt(name)}{j < players.length - 1 && <span className="text-gray-700 font-normal"> ·</span>}
                      </span>
                    ))}
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.05)'}}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{width:`${pct}%`, background:'rgba(39,174,96,0.6)'}}/>
                  </div>
                </div>

                {/* Gols — prominents */}
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-black font-mono ${isTop3 ? 'text-xl text-emerald-400' : 'text-base text-emerald-600'}`}>
                      {goalsFor}
                    </span>
                    <span className="text-[10px]">⚽</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {goalsAgainst > 0 && (
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

// ── Component principal ───────────────────────────────────────────
export default function LineupStats() {
  const { pairs, trios } = useMemo(() => calcLineupStats(), []);
  if (!pairs.length && !trios.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <TopPairs pairs={pairs}/>
      <TopTrios trios={trios}/>
    </div>
  );
}
