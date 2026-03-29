import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { DATABASE } from '../data.js';

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

const MEDAL_COLORS = [
  'bg-yellow-500/15 border-yellow-500/30 text-yellow-400',
  'bg-gray-400/15 border-gray-400/30 text-gray-300',
  'bg-amber-700/15 border-amber-700/30 text-amber-500',
];
const MEDAL = ['🥇', '🥈', '🥉'];

const playedMatches = DATABASE.matches.filter(m => {
  const [f, a] = m.result.split('-').map(Number);
  return !isNaN(f) && !isNaN(a);
});

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

  // Rànquing global
  const globalRanking = calcRanking(allRows);

  // Per partit (only played matches, most recent first)
  const matchesDesc = [...playedMatches].reverse();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-600 text-sm">Carregant vots...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease]">
      {/* Capçalera */}
      <div>
        <h2 className="text-2xl font-black text-[#E5C07B] tracking-wide">🏆 MVP</h2>
        <p className="text-xs text-gray-600 mt-0.5">Votació dels jugadors de cada partit</p>
      </div>

      {/* Rànquing global */}
      {globalRanking.length > 0 && (
        <div className="bg-[#1A1A1A] rounded-2xl border border-[#E5C07B]/20 overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5">
            <h3 className="text-sm font-bold text-[#E5C07B]">Rànquing global temporada</h3>
            <p className="text-[11px] text-gray-600">{allRows.length} vot{allRows.length !== 1 ? 's' : ''} en total</p>
          </div>
          <div className="p-3 space-y-1.5">
            {globalRanking.map(([name, pts], i) => (
              <div key={name} className={`flex items-center gap-3 px-3 py-2 rounded-xl border ${
                i < 3 ? MEDAL_COLORS[i] : 'bg-white/3 border-white/5 text-gray-500'}`}>
                <span className="text-base w-6 text-center">{MEDAL[i] || `${i + 1}`}</span>
                <span className="flex-1 font-bold text-sm">{name}</span>
                <span className="text-xs font-mono font-bold">{pts}p</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per partit */}
      <div className="space-y-4">
        {matchesDesc.map(match => {
          const matchRows = allRows.filter(r => r.match_id === match.id);
          const ranking = calcRanking(matchRows);
          const [f, a] = match.result.split('-').map(Number);
          const win = f > a, draw = f === a;

          return (
            <div key={match.id} className="bg-[#1A1A1A] rounded-2xl border border-white/8 overflow-hidden">
              {/* Capçalera partit */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 font-medium">{match.jornada} · {match.dateLabel}</div>
                  <div className="text-sm font-bold text-white truncate">vs {match.opponent}</div>
                </div>
                <div className={`px-2.5 py-1 rounded-lg text-sm font-black border ${
                  win  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                  draw ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                         'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  {match.result}
                </div>
                <span className="text-[11px] text-gray-600">{matchRows.length}v</span>
              </div>

              {/* Rànquing del partit */}
              {ranking.length === 0 ? (
                <div className="px-4 py-4 text-center text-gray-700 text-xs">
                  Sense vots encara
                </div>
              ) : (
                <div className="p-3 space-y-1.5">
                  {ranking.map(([name, pts], i) => (
                    <div key={name} className={`flex items-center gap-3 px-3 py-2 rounded-xl border ${
                      i < 3 ? MEDAL_COLORS[i] : 'bg-white/3 border-white/5 text-gray-500'}`}>
                      <span className="text-base w-6 text-center">{MEDAL[i] || `${i + 1}`}</span>
                      <span className="flex-1 font-bold text-sm">{name}</span>
                      <span className="text-xs font-mono font-bold">{pts}p</span>
                    </div>
                  ))}
                  {/* Detall vots individuals */}
                  <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap gap-1">
                    {matchRows.map((row, i) => (
                      <span key={i} className="text-[10px] text-gray-600 bg-white/3 border border-white/5 rounded-full px-2 py-0.5">
                        {dorsal(row.voter_name)}: {dorsal(row.gold)} {dorsal(row.silver)} {dorsal(row.bronze)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {globalRanking.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-600">
          <div className="text-4xl mb-3">🗳️</div>
          <div className="text-sm">Encara no hi ha vots</div>
          <div className="text-xs mt-1 text-gray-700">Vota des del detall de cada partit</div>
        </div>
      )}
    </div>
  );
}
