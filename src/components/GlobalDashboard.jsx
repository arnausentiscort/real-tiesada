import React, { useMemo } from 'react';
import { PlayCircle, Trophy, Clock, Target } from 'lucide-react';
import { DATABASE } from '../data.js';
import { formatTime, calcGlobalStats } from '../utils.js';

// ==========================================
// VISTA A: PANEL GLOBAL (Home)
// ==========================================
export default function GlobalDashboard({ onSelectMatch }) {
  // Calcula estadístiques globals
  const stats = useMemo(() => calcGlobalStats(DATABASE), []);

  // Determina el color del resultat
  const getResultColor = (result) => {
    const [home, away] = result.split('-').map(s => parseInt(s.trim()));
    if (home > away) return 'text-emerald-400';
    if (home < away) return 'text-[#C0392B]';
    return 'text-yellow-400';
  };

  const getResultLabel = (result) => {
    const [home, away] = result.split('-').map(s => parseInt(s.trim()));
    if (home > away) return { text: 'V', bg: 'bg-emerald-500/20 text-emerald-400' };
    if (home < away) return { text: 'D', bg: 'bg-[#C0392B]/20 text-[#C0392B]' };
    return { text: 'E', bg: 'bg-yellow-500/20 text-yellow-400' };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Capçalera */}
      <header>
        <h2 className="text-3xl font-bold text-white mb-1">Resum de la Temporada</h2>
        <p className="text-gray-400 text-sm">Estadístiques globals acumulades de tots els partits.</p>
      </header>

      {/* Grid principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* === GOLEJADORS === */}
        <div className="bg-[#1E1E1E] rounded-xl p-6 border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#E5C07B]/10 rounded-lg flex items-center justify-center">
              <Target className="text-[#E5C07B] w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#E5C07B]">Golejadors</h3>
          </div>
          <div className="space-y-3">
            {stats.topScorers.length > 0 ? (
              stats.topScorers.map(([name, count], idx) => (
                <div key={name} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${idx === 0 ? 'bg-[#E5C07B] text-black' : idx === 1 ? 'bg-gray-600 text-white' : 'bg-[#1a1a1a] text-gray-400 border border-white/10'}`}>
                      {idx + 1}
                    </span>
                    <span className="font-medium text-sm">{name}</span>
                  </div>
                  <span className="bg-[#E5C07B]/15 text-[#E5C07B] px-3 py-1 rounded-full text-sm font-bold">
                    {count} ⚽
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm">Encara no hi ha gols.</p>
            )}
          </div>
        </div>

        {/* === ASSISTÈNCIES === */}
        <div className="bg-[#1E1E1E] rounded-xl p-6 border border-white/5 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#E5C07B]/10 rounded-lg flex items-center justify-center">
              <Trophy className="text-[#E5C07B] w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#E5C07B]">Assistències</h3>
          </div>
          <div className="space-y-3">
            {stats.topAssists.length > 0 ? (
              stats.topAssists.map(([name, count], idx) => (
                <div key={name} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${idx === 0 ? 'bg-[#E5C07B] text-black' : idx === 1 ? 'bg-gray-600 text-white' : 'bg-[#1a1a1a] text-gray-400 border border-white/10'}`}>
                      {idx + 1}
                    </span>
                    <span className="font-medium text-sm">{name}</span>
                  </div>
                  <span className="bg-[#E5C07B]/15 text-[#E5C07B] px-3 py-1 rounded-full text-sm font-bold">
                    {count} 👟
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-sm">Encara no hi ha assistències.</p>
            )}
          </div>
        </div>

        {/* === PARTITS === */}
        <div className="bg-[#1E1E1E] rounded-xl p-6 border border-white/5 shadow-xl md:row-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#E5C07B]/10 rounded-lg flex items-center justify-center">
              <PlayCircle className="text-[#E5C07B] w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#E5C07B]">Partits</h3>
          </div>
          <div className="space-y-3">
            {DATABASE.matches.map(match => {
              const label = getResultLabel(match.result);
              return (
                <div
                  key={match.id}
                  onClick={() => onSelectMatch(match)}
                  className="group p-4 bg-[#121212] rounded-lg border border-[#E5C07B]/10
                    cursor-pointer hover:border-[#E5C07B]/50 transition-all hover:-translate-y-0.5
                    hover:shadow-lg hover:shadow-[#E5C07B]/5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#E5C07B]/70 font-medium">{match.jornada}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${label.bg}`}>{label.text}</span>
                  </div>
                  <div className="font-bold text-sm mb-2 text-white">
                    {DATABASE.teamName} <span className="text-gray-500 font-normal">vs</span> {match.opponent}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`font-mono font-bold text-lg ${getResultColor(match.result)}`}>
                      {match.result}
                    </span>
                    <span className="text-xs text-gray-500 group-hover:text-[#E5C07B] transition-colors">
                      {match.date} →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* === MINUTS TOTALS === */}
        <div className="bg-[#1E1E1E] rounded-xl p-6 border border-white/5 shadow-xl md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-[#E5C07B]/10 rounded-lg flex items-center justify-center">
              <Clock className="text-[#E5C07B] w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#E5C07B]">Càrrega Física (Minuts Totals)</h3>
          </div>
          <div className="space-y-3">
            {stats.totalMinutes.map(([name, seconds], idx) => {
              const maxSecs = stats.totalMinutes[0][1];
              const width = maxSecs > 0 ? (seconds / maxSecs) * 100 : 0;
              const isTop = idx === 0;
              return (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-28 text-xs text-right truncate text-gray-400">{name}</span>
                  <div className="flex-1 h-5 bg-[#121212] rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isTop
                          ? 'bg-gradient-to-r from-[#E5C07B]/70 to-[#E5C07B]'
                          : 'bg-gradient-to-r from-[#5B2C30] to-[#C0392B]'
                      }`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="w-14 text-xs font-mono text-[#E5C07B] text-right">
                    {formatTime(seconds)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
