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
      <div className="border border-white/8 rounded-2xl overflow-hidden transition-all duration-300
        hover:border-[#E5C07B]/50 hover:shadow-xl hover:shadow-[#E5C07B]/10 hover:-translate-y-1"
        style={{ background: '#000' }}>

        {/* Zona foto — fons negre igual que la foto */}
        <div className="relative overflow-hidden" style={{ height: '220px', background: '#000' }}>

          {/* Número gran de fons */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[110px] font-black leading-none select-none"
              style={{ color: 'rgba(229,192,123,0.04)' }}>
              {player.number}
            </span>
          </div>

          {/* Foto normal */}
          {player.photo && (
            <img
              src={`${BASE}${player.photo}`}
              alt={player.name}
              className="absolute inset-0 w-full h-full"
              style={{
                objectFit: 'cover', objectPosition: 'top',
                opacity: hover && hasPhotoCel ? 0 : 1,
                transform: hover && hasPhotoCel ? 'scale(1.08)' : 'scale(1.0)',
                transition: 'opacity 0.4s ease, transform 0.5s ease',
              }}
            />
          )}
          {/* Foto celebració — cross-fade */}
          {hasPhotoCel && (
            <img
              src={`${BASE}${player.photoCel}`}
              alt={`${player.name} celebració`}
              className="absolute inset-0 w-full h-full"
              style={{
                objectFit: 'cover', objectPosition: 'top',
                opacity: hover ? 1 : 0,
                transform: hover ? 'scale(1.05)' : 'scale(1.12)',
                transition: 'opacity 0.4s ease, transform 0.5s ease',
              }}
            />
          )}
          {/* Placeholder sense foto */}
          {!player.photo && !hasPhotoCel && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-20 h-20 rounded-full border-2 border-[#C0392B]/30 flex items-center justify-center"
                style={{ background: 'rgba(192,57,43,0.1)' }}>
                <span className="text-2xl font-black" style={{ color: 'rgba(229,192,123,0.4)' }}>
                  {player.shirtName?.slice(0, 2) || player.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <span className="text-xs text-gray-600">Sense foto</span>
            </div>
          )}

          {/* Gradient baix per suavitzar transició a la info */}
          <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #000, transparent)' }} />

          {/* Badge dorsal */}
          <div className="absolute top-2 left-2 z-20 text-white text-xs font-black px-2 py-1 rounded-lg shadow-lg"
            style={{ background: '#C0392B', border: '1px solid rgba(229,192,123,0.3)' }}>
            {player.number}
          </div>

          {/* Indicador celebració */}
          {hasPhotoCel && (
            <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity
              text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(0,0,0,0.7)', color: '#E5C07B', border: '1px solid rgba(229,192,123,0.2)' }}>
              ⭐
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3" style={{ background: '#111' }}>
          <div className="font-black text-sm tracking-wider truncate" style={{ color: '#E5C07B' }}>
            {player.shirtName || player.name.toUpperCase()}
          </div>
          <div className="text-xs truncate mt-0.5" style={{ color: '#555' }}>{player.name}</div>
          <div className="text-xs" style={{ color: '#444' }}>{player.position}</div>

          {/* Stats */}
          <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex-1 text-center">
              <div className="font-black text-base leading-none" style={{ color: '#E5C07B' }}>{goals}</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#444' }}>⚽</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.05)' }} />
            <div className="flex-1 text-center">
              <div className="font-black text-base leading-none" style={{ color: '#E5C07B' }}>{assists}</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#444' }}>👟</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.05)' }} />
            <div className="flex-1 text-center">
              <div className="font-black text-base leading-none" style={{ color: '#E5C07B' }}>{minutes}</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#444' }}>min</div>
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

  const sorted = [...DATABASE.roster].sort((a, b) => a.number - b.number);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-1">La Plantilla</h2>
        <p className="text-gray-400 text-sm">
          {DATABASE.roster.length} jugadors · Passa el cursor per veure la foto de celebració 🎉
        </p>
      </div>

      {/* Mòbil: carousel horitzontal / Desktop: grid */}
      <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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

      {/* Mòbil: slider */}
      <div className="sm:hidden">
        <div
          className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sorted.map(player => (
            <div key={player.name} className="snap-start shrink-0" style={{ width: '75vw', maxWidth: '260px' }}>
              <PlayerCard
                player={player}
                goals={getGoals(player.name)}
                assists={getAssists(player.name)}
                minutes={getMinutes(player.name)}
              />
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-700 mt-1">← Llisca per veure tots els jugadors →</p>
      </div>
    </div>
  );
}
