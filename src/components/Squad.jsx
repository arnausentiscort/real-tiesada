import React, { useState } from 'react';
import { DATABASE } from '../data.js';
import { calcGlobalStats } from '../utils.js';

const BASE = import.meta.env.BASE_URL;

function PlayerCard({ player, goals, assists, minutes }) {
  const [hover, setHover] = useState(false);
  const hasPhotoCel = !!player.photoCel;
  const photoSrc = hover && hasPhotoCel ? player.photoCel : player.photo;

  return (
    <div
      className="relative group cursor-default select-none"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl overflow-hidden transition-all duration-300
        hover:border-[#E5C07B]/50 hover:shadow-xl hover:shadow-[#E5C07B]/8 hover:-translate-y-1">

        {/* Zona de foto — altura fixa */}
        <div className="relative bg-gradient-to-b from-[#1E1E1E] to-[#0f0f0f] overflow-hidden"
          style={{ height: '220px' }}>

          {/* Número gran de fons */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <span className="text-[130px] font-black text-white/[0.04] leading-none select-none">
              {player.number}
            </span>
          </div>

          {/* Franja granat de baix */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#C0392B]/20 to-transparent pointer-events-none" />

          {/* Foto o placeholder */}
          {photoSrc ? (
            <img
              src={`${BASE}${photoSrc}`}
              alt={player.name}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-500 group-hover:scale-105"
              style={{ height: '210px', width: 'auto', objectFit: 'contain', objectPosition: 'bottom' }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-20 h-20 rounded-full bg-[#C0392B]/15 border-2 border-[#C0392B]/25 flex items-center justify-center">
                <span className="text-2xl font-black text-[#E5C07B]/40">
                  {player.shirtName?.slice(0,2) || player.name.split(' ').map(n=>n[0]).join('')}
                </span>
              </div>
              <span className="text-xs text-gray-600">Sense foto</span>
            </div>
          )}

          {/* Badge dorsal */}
          <div className="absolute top-2 left-2 z-20 bg-[#C0392B] text-white text-xs font-black
            px-2 py-1 rounded-lg border border-[#E5C07B]/30 shadow-lg">
            {player.number}
          </div>

          {/* Indicador celebració */}
          {hasPhotoCel && (
            <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity
              text-xs bg-black/70 text-[#E5C07B] px-2 py-0.5 rounded-full border border-[#E5C07B]/20">
              ⭐
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          {/* Nom del dorsal (gran) */}
          <div className="text-[#E5C07B] font-black text-sm tracking-wider truncate">
            {player.shirtName || player.name.toUpperCase()}
          </div>
          {/* Nom complet (petit) */}
          <div className="text-gray-500 text-xs truncate mt-0.5">{player.name}</div>
          <div className="text-gray-600 text-xs">{player.position}</div>

          {/* Stats */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
            <div className="flex-1 text-center">
              <div className="text-[#E5C07B] font-black text-base leading-none">{goals}</div>
              <div className="text-gray-600 text-[10px] mt-0.5">⚽</div>
            </div>
            <div className="w-px bg-white/5" />
            <div className="flex-1 text-center">
              <div className="text-[#E5C07B] font-black text-base leading-none">{assists}</div>
              <div className="text-gray-600 text-[10px] mt-0.5">👟</div>
            </div>
            <div className="w-px bg-white/5" />
            <div className="flex-1 text-center">
              <div className="text-[#E5C07B] font-black text-base leading-none">{minutes}</div>
              <div className="text-gray-600 text-[10px] mt-0.5">min</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Squad() {
  const stats = calcGlobalStats(DATABASE);

  const fmtMin = (secs) => `${Math.floor(secs / 60)}'`;
  const getGoals   = (name) => stats.topScorers.find(([n]) => n === name)?.[1] ?? 0;
  const getAssists = (name) => stats.topAssists.find(([n]) => n === name)?.[1] ?? 0;
  const getMinutes = (name) => {
    const e = stats.totalMinutes.find(([n]) => n === name);
    return e ? fmtMin(e[1]) : "0'";
  };

  // Ordena per dorsal
  const sorted = [...DATABASE.roster].sort((a, b) => a.number - b.number);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-1">La Plantilla</h2>
        <p className="text-gray-400 text-sm">
          {DATABASE.roster.length} jugadors · Passa el cursor per veure la foto de celebració 🎉
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {sorted.map(player => (
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
