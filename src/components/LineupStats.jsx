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
  const pairData    = {};
  const quartetData = {};

  const getPair = (a, b) => {
    const key = [a, b].sort().join('|||');
    if (!pairData[key]) pairData[key] = { players: [a, b].sort(), secs: 0, goalsFor: 0, goalsAgainst: 0 };
    return pairData[key];
  };

  const getQuartet = (arr4) => {
    const sorted = [...arr4].sort();
    const key = sorted.join('|||');
    if (!quartetData[key]) quartetData[key] = { players: sorted, secs: 0, goalsFor: 0, goalsAgainst: 0 };
    return quartetData[key];
  };

  DATABASE.matches.forEach(match => {
    const subs = match.events?.substitutions || [];

    // Temps compartit — només partits amb substitucions
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

        if (players.length >= 4)
          combos(players, 4).forEach(c => { getQuartet(c).secs += secs; });
      }
    }

    // Gols — usa onPitch de cada gol
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

      if (op.length >= 4)
        combos(op, 4).forEach(c => {
          const q = getQuartet(c);
          if (isFor) q.goalsFor++; else q.goalsAgainst++;
        });
    });
  });

  const pairs = Object.values(pairData)
    .sort((a, b) => b.secs - a.secs)
    .slice(0, 10);

  const quartets = Object.values(quartetData)
    .filter(q => q.secs > 0)
    .sort((a, b) => b.secs - a.secs)
    .slice(0, 5);

  return { pairs, quartets };
}

function barGradient(i) {
  if (i === 0) return 'linear-gradient(90deg,#E5C07B,#F0D090)';
  if (i === 1) return 'linear-gradient(90deg,#aaa,#ddd)';
  if (i === 2) return 'linear-gradient(90deg,#cd7f32,#e8a060)';
  return 'rgba(255,255,255,0.18)';
}

// ── Secció 1: Top Parelles ────────────────────────────────────────
function TopPairs({ pairs }) {
  const maxSecs = pairs[0]?.secs || 1;

  return (
    <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-black text-[#E5C07B] flex items-center gap-2">
          🤝 Top Parelles
        </h3>
        <p className="text-[10px] text-gray-600 mt-0.5">Minuts junts · gols marcats · encaixats · ratio/20'</p>
      </div>

      <div className="space-y-3">
        {pairs.map(({ players, secs, goalsFor, goalsAgainst }, i) => {
          const [nameA, nameB] = players;
          const mins    = Math.round(secs / 60);
          const pct     = (secs / maxSecs) * 100;
          const ratio   = secs > 0 ? ((goalsFor / (secs / 60)) * 20).toFixed(1) : '—';
          const isTop3  = i < 3;

          return (
            <div key={i}>
              <div className="flex items-center gap-2.5 mb-1.5">
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
                      style={{color: isTop3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)'}}>
                      {getShirt(nameA)}
                    </span>
                    <span className="text-[9px] text-gray-700">+</span>
                    <span className="text-xs font-black"
                      style={{color: isTop3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)'}}>
                      {getShirt(nameB)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.05)'}}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{width:`${pct}%`, background: barGradient(i)}}/>
                  </div>
                </div>

                {/* Stats dreta */}
                <div className="flex items-center gap-2 shrink-0">
                  {(goalsFor > 0 || goalsAgainst > 0) && (
                    <div className="flex items-center gap-1 text-[10px] font-mono">
                      {goalsFor > 0 && <span className="text-emerald-400">+{goalsFor}</span>}
                      {goalsAgainst > 0 && <span className="text-[#C0392B]">-{goalsAgainst}</span>}
                    </div>
                  )}
                  {secs > 0 && goalsFor > 0 && (
                    <span className="text-[9px] font-mono text-[#E5C07B]/50 hidden sm:block">{ratio}/20'</span>
                  )}
                  <span className="text-sm font-black font-mono"
                    style={{color: isTop3 ? '#E5C07B' : 'rgba(255,255,255,0.35)'}}>
                    {mins}'
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Secció 2: Top Quintets (4 jugadors de camp) ───────────────────
function TopQuartets({ quartets }) {
  const maxSecs = quartets[0]?.secs || 1;

  if (!quartets.length) return null;

  return (
    <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-black text-[#E5C07B] flex items-center gap-2">
          ⚡ Top Quintets
        </h3>
        <p className="text-[10px] text-gray-600 mt-0.5">4 jugadors de camp que més minuts han jugat junts</p>
      </div>

      <div className="space-y-4">
        {quartets.map(({ players, secs, goalsFor, goalsAgainst }, i) => {
          const mins   = Math.round(secs / 60);
          const pct    = (secs / maxSecs) * 100;
          const ratio  = secs > 0 ? ((goalsFor / (secs / 60)) * 20).toFixed(1) : '—';
          const isTop3 = i < 3;

          return (
            <div key={i}>
              <div className="flex items-start gap-2.5 mb-1.5">
                {/* Posició */}
                <span className="text-sm w-5 shrink-0 text-center leading-none pt-1">
                  {MEDALS[i] || <span className="text-[10px] text-gray-700 font-mono">{i+1}</span>}
                </span>

                {/* 4 Avatars solapats */}
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
                        style={{color: isTop3 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)'}}>
                        {getShirt(name)}{j < players.length - 1 ? <span className="text-gray-700 font-normal"> ·</span> : ''}
                      </span>
                    ))}
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.05)'}}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{width:`${pct}%`, background: barGradient(i)}}/>
                  </div>
                </div>

                {/* Stats + minuts */}
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className="text-sm font-black font-mono"
                    style={{color: isTop3 ? '#E5C07B' : 'rgba(255,255,255,0.35)'}}>
                    {mins}'
                  </span>
                  {(goalsFor > 0 || goalsAgainst > 0) && (
                    <div className="flex items-center gap-1 text-[10px] font-mono">
                      {goalsFor > 0 && <span className="text-emerald-400">⚽{goalsFor}</span>}
                      {goalsAgainst > 0 && <span className="text-[#C0392B]">❌{goalsAgainst}</span>}
                    </div>
                  )}
                  {secs > 0 && goalsFor > 0 && (
                    <span className="text-[9px] font-mono text-[#E5C07B]/40">{ratio}/20'</span>
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

// ── Component principal ───────────────────────────────────────────
export default function LineupStats() {
  const { pairs, quartets } = useMemo(() => calcLineupStats(), []);
  if (!pairs.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <TopPairs pairs={pairs}/>
      <TopQuartets quartets={quartets}/>
    </div>
  );
}
