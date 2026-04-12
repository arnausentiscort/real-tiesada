import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { DATABASE } from '../data.js';

const BASE = import.meta.env.BASE_URL;

const supabase = createClient(
  'https://pibacoitanqebynhvpnc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpYmFjb2l0YW5xZWJ5bmh2cG5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODkzODEsImV4cCI6MjA5MDI2NTM4MX0.SzhGturICQHYCNOyivySgPo3fG-5Pfk6n6MQYEYAqLg'
);

function dorsal(name) {
  const pl = DATABASE.roster.find(r => r.name === name);
  return pl?.shirtName || name.split(' ')[0].toUpperCase();
}

function calcRanking(rows) {
  const pts = {};
  rows.forEach(row => {
    if (row.gold)   pts[row.gold]   = (pts[row.gold]   || 0) + 3;
    if (row.silver) pts[row.silver] = (pts[row.silver] || 0) + 2;
    if (row.bronze) pts[row.bronze] = (pts[row.bronze] || 0) + 1;
  });
  return Object.entries(pts).sort((a, b) => b[1] - a[1]);
}

const playedMatches = DATABASE.matches.filter(m => {
  const [f, a] = m.result.split('-').map(Number);
  return !isNaN(f) && !isNaN(a);
});

// ── Avatar jugador ────────────────────────────────────────────────
function PlayerAvatar({ name, size = 56, ring }) {
  const pl = DATABASE.roster.find(r => r.name === name);
  const style = {
    width: size, height: size, flexShrink: 0,
    border: `2px solid ${ring || 'rgba(255,255,255,0.12)'}`,
    borderRadius: '50%', overflow: 'hidden',
  };
  if (pl?.photo) return (
    <div style={style}>
      <img src={`${BASE}${pl.photo}`} alt={name} className="w-full h-full object-cover object-top"/>
    </div>
  );
  return (
    <div style={{...style, display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(229,192,123,0.1)', color:'#E5C07B', fontWeight:900,
      fontSize: size * 0.35}}>
      {pl?.number || name[0]}
    </div>
  );
}

// ── Pòdium: top 3 de la temporada ────────────────────────────────
const PODIUM_CFG = [
  { rank: 1, color: '#F59E0B', glow: 'rgba(245,158,11,0.25)', medal: '🥇', label: 'ORO',   h: 80 },
  { rank: 2, color: '#9CA3AF', glow: 'rgba(156,163,175,0.15)', medal: '🥈', label: 'PLATA', h: 56 },
  { rank: 3, color: '#CD7F32', glow: 'rgba(205,127,50,0.15)',  medal: '🥉', label: 'BRONZE',h: 40 },
];

function Podium({ ranking }) {
  // Display order: 2n, 1r, 3r
  const display = [1, 0, 2];
  return (
    <div className="flex items-end justify-center gap-2 sm:gap-4 mb-2">
      {display.map(pi => {
        const cfg = PODIUM_CFG[pi];
        if (!ranking[pi]) return <div key={pi} className="flex-1"/>;
        const [name, pts] = ranking[pi];
        const pl = DATABASE.roster.find(r => r.name === name);
        const avatarSize = pi === 0 ? 76 : 56;
        return (
          <div key={pi} className="flex-1 flex flex-col items-center gap-2 sm:gap-3">
            {/* Avatar + info */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative">
                <PlayerAvatar name={name} size={avatarSize} ring={cfg.color}/>
                <span className="absolute -bottom-1 -right-1 text-base leading-none">{cfg.medal}</span>
              </div>
              <div className="text-center">
                <div className="text-xs sm:text-sm font-black text-white leading-tight">
                  {pl?.shirtName || name.split(' ')[0].toUpperCase()}
                </div>
                <div className="text-xs font-bold mt-0.5" style={{color: cfg.color}}>
                  {pts} pts
                </div>
              </div>
            </div>
            {/* Graó del pòdium */}
            <div className="w-full rounded-t-xl flex items-center justify-center"
              style={{
                height: cfg.h,
                background: `linear-gradient(to bottom, ${cfg.color}22, ${cfg.color}08)`,
                border: `1px solid ${cfg.color}30`,
                borderBottom: 'none',
                boxShadow: `0 -4px 24px ${cfg.glow}`,
              }}>
              <span className="text-2xl font-black opacity-30" style={{color: cfg.color}}>
                {cfg.rank}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Fila de rànquing (del 4t en amunt) ───────────────────────────
function RankRow({ rank, name, pts, maxPts }) {
  const pl = DATABASE.roster.find(r => r.name === name);
  const pct = maxPts > 0 ? (pts / maxPts) * 100 : 0;
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
      style={{background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)'}}>
      <span className="text-xs font-black w-5 text-center" style={{color:'rgba(255,255,255,0.2)'}}>{rank}</span>
      <PlayerAvatar name={name} size={32}/>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-white leading-none">{pl?.shirtName || name.split(' ')[0].toUpperCase()}</div>
        <div className="mt-1 h-1 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.08)'}}>
          <div className="h-full rounded-full" style={{width:`${pct}%`, background:'rgba(229,192,123,0.5)'}}/>
        </div>
      </div>
      <span className="text-xs font-black" style={{color:'rgba(255,255,255,0.5)'}}>{pts}p</span>
    </div>
  );
}

// ── Targeta MVP per partit ────────────────────────────────────────
function MatchMvpCard({ match, rows }) {
  const ranking = calcRanking(rows);
  const [f, a]  = match.result.split('-').map(Number);
  const win = f > a, draw = f === a;

  const resultStyle = win
    ? { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', color: '#10B981' }
    : draw
    ? { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)',  color: '#F59E0B' }
    : { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)',   color: '#EF4444' };

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{background:'#181818', border:'1px solid rgba(255,255,255,0.06)'}}>

      {/* Capçalera */}
      <div className="flex items-center gap-3 px-4 py-3"
        style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wider" style={{color:'rgba(255,255,255,0.3)'}}>
            {match.jornada} · {match.dateLabel || match.date}
          </div>
          <div className="text-sm font-black text-white mt-0.5 truncate">vs {match.opponent}</div>
        </div>
        <div className="px-3 py-1 rounded-lg text-sm font-black"
          style={{background: resultStyle.bg, border:`1px solid ${resultStyle.border}`, color: resultStyle.color}}>
          {match.result.replace(/ /g,'')}
        </div>
        <span className="text-[10px] font-bold" style={{color:'rgba(255,255,255,0.2)'}}>{rows.length}v</span>
      </div>

      {/* Contingut */}
      {ranking.length === 0 ? (
        <div className="px-4 py-5 text-center text-xs" style={{color:'rgba(255,255,255,0.2)'}}>
          Sense vots encara
        </div>
      ) : (
        <div className="p-3">
          {/* Top 3 del partit */}
          <div className="flex items-center gap-2 mb-3">
            {[['🥇','#F59E0B'], ['🥈','#9CA3AF'], ['🥉','#CD7F32']].map(([medal, color], i) => {
              if (!ranking[i]) return null;
              const [name, pts] = ranking[i];
              return (
                <div key={i} className="flex items-center gap-2 flex-1 px-2.5 py-2 rounded-xl min-w-0"
                  style={{background:'rgba(255,255,255,0.04)', border:`1px solid rgba(255,255,255,0.06)`}}>
                  <PlayerAvatar name={name} size={36} ring={color}/>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-black text-white truncate">{dorsal(name)}</div>
                    <div className="text-[9px] font-bold mt-0.5" style={{color}}>
                      {medal} {pts}p
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vots individuals */}
          {rows.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2"
              style={{borderTop:'1px solid rgba(255,255,255,0.05)'}}>
              {rows.map((row, i) => (
                <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded-full"
                  style={{background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.3)',
                    border:'1px solid rgba(255,255,255,0.06)'}}>
                  {dorsal(row.voter_name)}: {dorsal(row.gold)} · {dorsal(row.silver)} · {dorsal(row.bronze)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Component principal ───────────────────────────────────────────
export default function MvpPage() {
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const { data, error } = await supabase
        .from('mvp_votes')
        .select('match_id, voter_name, gold, silver, bronze');
      if (!error) setAllRows(data || []);
      setLoading(false);
    }
    fetchAll();
    const interval = setInterval(fetchAll, 15000);
    return () => clearInterval(interval);
  }, []);

  const globalRanking = calcRanking(allRows);
  const matchesDesc   = [...playedMatches].reverse();

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#E5C07B]/30 border-t-[#E5C07B] animate-spin"/>
        <span className="text-gray-600 text-xs">Carregant vots...</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-[fadeIn_0.4s_ease]">

      {/* Capçalera */}
      <div>
        <h2 className="text-3xl font-black text-white leading-none">MVP</h2>
        <p className="text-gray-600 text-sm mt-1">
          {allRows.length > 0 ? `${allRows.length} vot${allRows.length !== 1 ? 's' : ''} emesos` : 'Sense vots encara'}
        </p>
      </div>

      {/* Rànquing de temporada */}
      {globalRanking.length > 0 && (
        <section className="rounded-2xl overflow-hidden"
          style={{background:'#181818', border:'1px solid rgba(229,192,123,0.12)'}}>

          {/* Header de la secció */}
          <div className="px-4 pt-4 pb-3" style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
            <div className="text-[10px] font-black uppercase tracking-widest" style={{color:'#E5C07B'}}>
              ⭐ Rànquing de temporada
            </div>
          </div>

          {/* Pòdium */}
          {globalRanking.length >= 2 && (
            <div className="px-4 pt-5 pb-0">
              <Podium ranking={globalRanking}/>
            </div>
          )}

          {/* Llista completa */}
          <div className="p-3 space-y-1.5">
            {globalRanking.length < 2
              ? globalRanking.map(([name, pts], i) => (
                  <RankRow key={name} rank={i+1} name={name} pts={pts} maxPts={globalRanking[0][1]}/>
                ))
              : globalRanking.slice(3).map(([name, pts], i) => (
                  <RankRow key={name} rank={i+4} name={name} pts={pts} maxPts={globalRanking[0][1]}/>
                ))
            }
          </div>
        </section>
      )}

      {/* Per jornada */}
      <section className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest" style={{color:'rgba(255,255,255,0.25)'}}>
          Per jornada
        </p>
        {matchesDesc.map(match => (
          <MatchMvpCard key={match.id} match={match}
            rows={allRows.filter(r => r.match_id === match.id)}/>
        ))}
      </section>

      {/* Estat buit */}
      {globalRanking.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🗳️</div>
          <div className="text-white font-bold text-lg">Sense vots encara</div>
          <div className="text-gray-600 text-sm mt-2">Vota des del detall de cada partit</div>
        </div>
      )}
    </div>
  );
}
