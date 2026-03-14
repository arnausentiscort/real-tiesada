import React, { useState } from 'react';
import { DATABASE } from '../data.js';
import { calcGlobalStats } from '../utils.js';

const BASE = import.meta.env.BASE_URL;

// ── Helpers ───────────────────────────────────────────────────────
function getVideoUrl(matchId, time) {
  const match = DATABASE.matches.find(m => m.id === matchId);
  if (!match || !time) return null;
  const [min, sec] = time.split(':').map(Number);
  const secs = Math.max(0, (min * 60 + (sec || 0)) - 5);
  if (match.vimeoId)   return `https://vimeo.com/${match.vimeoId}#t=${secs}s`;
  if (match.youtubeId) return `https://www.youtube.com/watch?v=${match.youtubeId}&t=${secs}s`;
  return null;
}

// ── Perfil de jugador (modal/overlay) ────────────────────────────
function PlayerProfile({ player, stats, onClose }) {
  const fmtMin = s => `${Math.floor(s / 60)}'`;
  const goals   = stats.topScorers.find(([n]) => n === player.name)?.[1] ?? 0;
  const assists = stats.topAssists.find(([n]) => n === player.name)?.[1] ?? 0;
  const minSecs = stats.totalMinutes.find(([n]) => n === player.name)?.[1] ?? 0;
  const conceded = stats.goalsConceded.find(([n]) => n === player.name)?.[1] ?? 0;
  const yellowCards = stats.yellowCards.find(([n]) => n === player.name)?.[1] ?? 0;

  // Gols marcats amb detall
  const scoredGoals = DATABASE.matches.flatMap(m =>
    (m.events?.goals || [])
      .filter(g => g.type === 'favor' && g.scorer === player.name)
      .map(g => ({ ...g, matchId: m.id, jornada: m.jornada, opponent: m.opponent }))
  );
  const assistedGoals = DATABASE.matches.flatMap(m =>
    (m.events?.goals || [])
      .filter(g => g.type === 'favor' && g.assist === player.name)
      .map(g => ({ ...g, matchId: m.id, jornada: m.jornada, opponent: m.opponent }))
  );
  const partits = DATABASE.matches.filter(m =>
    (m.events?.goals || []).some(g => g.onPitch?.includes(player.name)) ||
    calcGlobalStats({ ...DATABASE, matches: [m] }).totalMinutes.find(([n]) => n === player.name)?.[1] > 0
  ).length;

  const isKeeper = player.position === 'Porter';

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}>
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{ background: '#161616', border: '1px solid rgba(229,192,123,0.15)', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>

        {/* Header foto */}
        <div className="relative h-56 sm:h-64" style={{ background: '#000' }}>
          {/* Número fons */}
          <div className="absolute inset-0 flex items-center justify-end pr-6 pointer-events-none overflow-hidden">
            <span className="font-black select-none" style={{ fontSize: 180, color: 'rgba(229,192,123,0.05)', lineHeight: 1 }}>
              {player.number}
            </span>
          </div>

          {/* Foto */}
          {player.photo
            ? <img src={`${BASE}${player.photo}`} alt={player.name}
                className="absolute inset-0 w-full h-full object-cover object-top"/>
            : <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black"
                  style={{ background: 'rgba(192,57,43,0.2)', color: 'rgba(229,192,123,0.5)', border: '2px solid rgba(192,57,43,0.3)' }}>
                  {player.shirtName?.slice(0,2) || player.name.split(' ').map(n=>n[0]).join('')}
                </div>
              </div>
          }

          {/* Gradient */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #161616 0%, rgba(22,22,22,0.6) 50%, transparent 100%)' }}/>

          {/* Info sobre foto */}
          <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
            <div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">{player.position}</div>
              <div className="text-2xl font-black" style={{ color: '#E5C07B' }}>{player.shirtName || player.name.toUpperCase()}</div>
              <div className="text-sm text-gray-400">{player.name}</div>
            </div>
            <div className="text-5xl font-black" style={{ color: 'rgba(229,192,123,0.4)' }}>#{player.number}</div>
          </div>

          {/* Botó tancar */}
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            style={{ background: 'rgba(0,0,0,0.6)' }}>
            ×
          </button>
        </div>

        {/* Stats grid */}
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: goals,   label: 'Gols' },
              { val: assists, label: 'Assists' },
              { val: fmtMin(minSecs), label: 'Minuts' },
              isKeeper
                ? { val: conceded, label: 'Rebuts' }
                : { val: yellowCards || 0, label: 'Grogues' }
            ].map(({ val, label }) => (
              <div key={label} className="rounded-xl p-3 text-center" style={{ background: '#1e1e1e' }}>
                <div className="text-xl font-black" style={{ color: '#E5C07B' }}>{val}</div>
                <div className="text-[10px] text-gray-600 mt-0.5 uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>

          {/* Gols marcats */}
          {scoredGoals.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold mb-2">Gols marcats</p>
              <div className="space-y-1.5">
                {scoredGoals.map((g, i) => {
                  const vidUrl = getVideoUrl(g.matchId, g.time);
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                      style={{ background: '#1e1e1e' }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#E5C07B' }}/>
                      <div className="flex-1 min-w-0">
                        <span className="text-white text-sm font-semibold">min {g.time}</span>
                        <span className="text-gray-600 text-xs ml-2">{g.jornada} vs {g.opponent}</span>
                        {g.assist && <span className="text-gray-600 text-xs block">assist: {g.assist}</span>}
                      </div>
                      {vidUrl && (
                        <a href={vidUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold flex-shrink-0 transition-colors"
                          style={{ background: 'rgba(229,192,123,0.1)', color: '#E5C07B', border: '1px solid rgba(229,192,123,0.2)' }}>
                          <svg width="10" height="10" viewBox="0 0 10 10">
                            <polygon points="2,1 9,5 2,9" fill="#E5C07B"/>
                          </svg>
                          Veure
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assists */}
          {assistedGoals.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold mb-2">Assistències</p>
              <div className="space-y-1.5">
                {assistedGoals.map((g, i) => {
                  const vidUrl = getVideoUrl(g.matchId, g.time);
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                      style={{ background: '#1e1e1e' }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gray-500"/>
                      <div className="flex-1 min-w-0">
                        <span className="text-white text-sm font-semibold">min {g.time}</span>
                        <span className="text-gray-600 text-xs ml-2">{g.jornada} vs {g.opponent}</span>
                        <span className="text-gray-600 text-xs block">gol: {g.scorer}</span>
                      </div>
                      {vidUrl && (
                        <a href={vidUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold flex-shrink-0 transition-colors"
                          style={{ background: 'rgba(97,175,239,0.1)', color: '#61AFEF', border: '1px solid rgba(97,175,239,0.2)' }}>
                          <svg width="10" height="10" viewBox="0 0 10 10">
                            <polygon points="2,1 9,5 2,9" fill="#61AFEF"/>
                          </svg>
                          Veure
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {scoredGoals.length === 0 && assistedGoals.length === 0 && (
            <p className="text-gray-700 text-sm text-center py-2">Sense gols ni assists registrats</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Targeta jugador ───────────────────────────────────────────────
function PlayerCard({ player, goals, assists, minutes, onClick }) {
  const [hover, setHover] = useState(false);
  const hasPhotoCel = !!player.photoCel;

  return (
    <div className="relative group cursor-pointer select-none"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <div className="border border-white/8 rounded-2xl overflow-hidden transition-all duration-300
        hover:border-[#E5C07B]/50 hover:shadow-xl hover:shadow-[#E5C07B]/10 hover:-translate-y-1"
        style={{ background: '#000' }}>

        <div className="relative overflow-hidden" style={{ height: '220px', background: '#000' }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[110px] font-black leading-none select-none"
              style={{ color: 'rgba(229,192,123,0.04)' }}>{player.number}</span>
          </div>
          {player.photo && (
            <img src={`${BASE}${player.photo}`} alt={player.name}
              className="absolute inset-0 w-full h-full"
              style={{ objectFit:'cover', objectPosition:'top',
                opacity: hover && hasPhotoCel ? 0 : 1,
                transform: hover && hasPhotoCel ? 'scale(1.08)' : 'scale(1.0)',
                transition: 'opacity 0.4s ease, transform 0.5s ease' }}/>
          )}
          {hasPhotoCel && (
            <img src={`${BASE}${player.photoCel}`} alt={`${player.name} celebració`}
              className="absolute inset-0 w-full h-full"
              style={{ objectFit:'cover', objectPosition:'top',
                opacity: hover ? 1 : 0,
                transform: hover ? 'scale(1.05)' : 'scale(1.12)',
                transition: 'opacity 0.4s ease, transform 0.5s ease' }}/>
          )}
          {!player.photo && !hasPhotoCel && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-20 h-20 rounded-full border-2 border-[#C0392B]/30 flex items-center justify-center"
                style={{ background: 'rgba(192,57,43,0.1)' }}>
                <span className="text-2xl font-black" style={{ color: 'rgba(229,192,123,0.4)' }}>
                  {player.shirtName?.slice(0,2) || player.name.split(' ').map(n=>n[0]).join('')}
                </span>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #000, transparent)' }}/>
          <div className="absolute top-2 left-2 z-20 text-white text-xs font-black px-2 py-1 rounded-lg shadow-lg"
            style={{ background: '#C0392B', border: '1px solid rgba(229,192,123,0.3)' }}>
            {player.number}
          </div>
          {/* Indicador "clica" en hover */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${hover ? 'opacity-100' : 'opacity-0'}`}>
            <div className="px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ background: 'rgba(0,0,0,0.7)', color: '#E5C07B', border: '1px solid rgba(229,192,123,0.3)' }}>
              Veure perfil
            </div>
          </div>
        </div>

        <div className="p-3" style={{ background: '#111' }}>
          <div className="font-black text-sm tracking-wider truncate" style={{ color: '#E5C07B' }}>
            {player.shirtName || player.name.toUpperCase()}
          </div>
          <div className="text-xs truncate mt-0.5" style={{ color: '#555' }}>{player.name}</div>
          <div className="text-xs" style={{ color: '#444' }}>{player.position}</div>
          <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex-1 text-center">
              <div className="font-black text-base leading-none" style={{ color: '#E5C07B' }}>{goals}</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#444' }}>⚽</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.05)' }}/>
            <div className="flex-1 text-center">
              <div className="font-black text-base leading-none" style={{ color: '#E5C07B' }}>{assists}</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#444' }}>👟</div>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.05)' }}/>
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

// ── Component principal ───────────────────────────────────────────
export default function Squad() {
  const stats = calcGlobalStats(DATABASE);
  const [selected, setSelected] = useState(null);

  const fmtMin = s => `${Math.floor(s / 60)}'`;
  const getGoals   = n => stats.topScorers.find(([p]) => p === n)?.[1] ?? 0;
  const getAssists = n => stats.topAssists.find(([p]) => p === n)?.[1] ?? 0;
  const getMinutes = n => { const e = stats.totalMinutes.find(([p]) => p === n); return e ? fmtMin(e[1]) : "0'"; };

  const sorted = [...DATABASE.roster].sort((a, b) => a.number - b.number);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-1">La Plantilla</h2>
        <p className="text-gray-400 text-sm">
          {DATABASE.roster.length} jugadors · Clica un jugador per veure el seu perfil
        </p>
      </div>

      {/* Desktop grid */}
      <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {sorted.map(player => (
          <PlayerCard key={player.name} player={player}
            goals={getGoals(player.name)} assists={getAssists(player.name)} minutes={getMinutes(player.name)}
            onClick={() => setSelected(player)}/>
        ))}
      </div>

      {/* Mòbil carousel */}
      <div className="sm:hidden">
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {sorted.map(player => (
            <div key={player.name} className="snap-start shrink-0" style={{ width: '75vw', maxWidth: '260px' }}>
              <PlayerCard player={player}
                goals={getGoals(player.name)} assists={getAssists(player.name)} minutes={getMinutes(player.name)}
                onClick={() => setSelected(player)}/>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-700 mt-1">← Llisca · Clica per veure el perfil →</p>
      </div>

      {/* Perfil modal */}
      {selected && (
        <PlayerProfile
          player={selected}
          stats={stats}
          onClose={() => setSelected(null)}/>
      )}
    </div>
  );
}
