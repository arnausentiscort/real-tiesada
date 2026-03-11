import React, { useState } from 'react';
import { DATABASE, getPlayer } from '../data.js';
import { calcGlobalStats } from '../utils.js';

// Foto per defecte quan no hi ha imatge
const DEFAULT_AVATAR = null;

// ==========================================
// COMPONENT: Targeta de jugador
// ==========================================
function PlayerCard({ player, goals, assists, minutes }) {
  const [hover, setHover] = useState(false);
  const hasPhotoCel = !!player.photoCel;
  const displayPhoto = hover && hasPhotoCel ? player.photoCel : player.photo;

  return (
    <div
      className="relative group cursor-default select-none"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Targeta */}
      <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#E5C07B]/40 hover:shadow-xl hover:shadow-[#E5C07B]/5 hover:-translate-y-1">

        {/* Zona de foto */}
        <div className="relative h-52 bg-gradient-to-b from-[#1E1E1E] to-[#111] overflow-hidden flex items-end justify-center">

          {/* Número de dorsal de fons */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[120px] font-black text-white/4 leading-none select-none">
              {player.number || '?'}
            </span>
          </div>

          {/* Foto del jugador */}
          {displayPhoto ? (
            <img
              src={displayPhoto}
              alt={player.name}
              className="relative z-10 h-full w-auto object-contain object-bottom transition-all duration-500 group-hover:scale-105"
              style={{ maxWidth: '100%' }}
            />
          ) : (
            // Placeholder si no hi ha foto
            <div className="relative z-10 w-24 h-24 rounded-full bg-[#C0392B]/20 border-2 border-[#C0392B]/30 flex items-center justify-center mb-4">
              <span className="text-4xl font-black text-[#E5C07B]/50">
                {player.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}

          {/* Badge de dorsal */}
          <div className="absolute top-3 left-3 z-20 bg-[#C0392B] text-white text-xs font-black px-2 py-1 rounded-lg border border-[#E5C07B]/30">
            #{player.number || '?'}
          </div>
        </div>

        {/* Info del jugador */}
        <div className="p-4">
          <div className="text-white font-bold text-sm leading-tight">{player.name}</div>
          <div className="text-[#E5C07B]/60 text-xs mt-0.5">{player.position || 'Jugador'}</div>

          {/* Stats mini */}
          <div className="flex gap-3 mt-3 pt-3 border-t border-white/5">
            <div className="flex-1 text-center">
              <div className="text-[#E5C07B] font-black text-lg leading-none">{goals}</div>
              <div className="text-gray-600 text-xs mt-1">⚽ Gols</div>
            </div>
            <div className="w-px bg-white/5" />
            <div className="flex-1 text-center">
              <div className="text-[#E5C07B] font-black text-lg leading-none">{assists}</div>
              <div className="text-gray-600 text-xs mt-1">👟 Assist</div>
            </div>
            <div className="w-px bg-white/5" />
            <div className="flex-1 text-center">
              <div className="text-[#E5C07B] font-black text-sm leading-none">{minutes}</div>
              <div className="text-gray-600 text-xs mt-1">⏱ Min</div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de foto de celebració */}
      {hasPhotoCel && (
        <div className="absolute bottom-16 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-[#E5C07B]/60 bg-black/60 px-2 py-0.5 rounded-full">
          ⭐ cel·lebració
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPONENT PRINCIPAL: Plantilla
// ==========================================
export default function Squad() {
  const stats = calcGlobalStats(DATABASE);

  // Converteix minuts a format mm:ss llegible
  const fmtMin = (secs) => {
    const m = Math.floor(secs / 60);
    return `${m}'`;
  };

  const getGoals   = (name) => (stats.topScorers.find(([n]) => n === name)?.[1] ?? 0);
  const getAssists = (name) => (stats.topAssists.find(([n]) => n === name)?.[1] ?? 0);
  const getMinutes = (name) => {
    const entry = stats.totalMinutes.find(([n]) => n === name);
    return entry ? fmtMin(entry[1]) : "0'";
  };

  return (
    <div className="animate-fade-in">
      {/* Capçalera */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-1">La Plantilla</h2>
        <p className="text-gray-400 text-sm">Passa el cursor per sobre per veure la foto de celebració 🎉</p>
      </div>

      {/* Grid de jugadors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {DATABASE.roster.map(player => (
          <PlayerCard
            key={player.name}
            player={player}
            goals={getGoals(player.name)}
            assists={getAssists(player.name)}
            minutes={getMinutes(player.name)}
          />
        ))}
      </div>
    </div>
  );
}
