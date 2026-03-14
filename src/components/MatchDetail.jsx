import React, { useMemo, useState, useRef } from 'react';
import { ChevronLeft, PlayCircle, Clock, Star, XCircle, AlertCircle } from 'lucide-react';
import { DATABASE } from '../data.js';
import { parseTime, formatTime, calcMatchStats } from '../utils.js';

// ==========================================
// RETRANSMISSIÓ MINUT A MINUT
// ==========================================

const TYPE_CONFIG = {
  bona:    { icon: '✅', label: 'Jugada bona',  bg: 'bg-emerald-500/8',  border: 'border-emerald-500/20', dot: 'bg-emerald-400', text: 'text-emerald-400' },
  dolenta: { icon: '💥', label: 'Error',         bg: 'bg-[#C0392B]/8',    border: 'border-[#C0392B]/20',   dot: 'bg-[#C0392B]',   text: 'text-[#C0392B]'  },
  clip:    { icon: '🎬', label: 'Moment viral',  bg: 'bg-[#E5C07B]/8',    border: 'border-[#E5C07B]/20',   dot: 'bg-[#E5C07B]',   text: 'text-[#E5C07B]'  },
  tactica: { icon: '🧠', label: 'Tàctica',       bg: 'bg-blue-500/8',     border: 'border-blue-500/20',    dot: 'bg-blue-400',    text: 'text-blue-400'   },
};

function RetransmissioSection({ events, onJump, hasVideo }) {
  const [filter, setFilter] = React.useState('all');
  const [hoveredPhoto, setHoveredPhoto] = React.useState(null);

  const filtered = filter === 'all' ? events : events.filter(e => e.type === filter);
  const counts = { bona: 0, dolenta: 0, clip: 0, tactica: 0 };
  events.forEach(e => { if (counts[e.type] !== undefined) counts[e.type]++; });

  return (
    <div className="bg-[#1E1E1E] rounded-xl border border-[#E5C07B]/15 shadow-xl overflow-hidden">
      {/* Capçalera */}
      <div className="px-6 py-5 border-b border-white/5">
        <h3 className="text-lg font-bold text-[#E5C07B] flex items-center gap-2 mb-4">
          📺 Retransmissió minut a minut
        </h3>
        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all
              ${filter==='all' ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 text-gray-500 hover:text-white'}`}>
            Tots ({events.length})
          </button>
          {Object.entries(TYPE_CONFIG).map(([key, cfg]) => counts[key] > 0 && (
            <button key={key} onClick={() => setFilter(key === filter ? 'all' : key)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1
                ${filter===key ? `${cfg.bg} ${cfg.border} ${cfg.text}` : 'border-white/10 text-gray-500 hover:text-white'}`}>
              {cfg.icon} {cfg.label} ({counts[key]})
            </button>
          ))}
        </div>
      </div>

      {/* Llista */}
      <div className="divide-y divide-white/5">
        {filtered.map((ev, idx) => {
          const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.clip;
          const hasPhoto = !!ev.photo;
          const isPhotoHovered = hoveredPhoto === idx;

          return (
            <div key={idx}
              className={`flex items-start gap-4 px-5 py-4 transition-all hover:bg-white/3 ${cfg.bg}`}>

              {/* Línia de temps + dot */}
              <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot} shadow-lg`}
                  style={{ boxShadow: `0 0 8px currentColor` }}/>
                <div className="w-px flex-1 bg-white/8 min-h-[16px]"/>
              </div>

              {/* Temps */}
              <div className="w-10 shrink-0 pt-0.5">
                <span className="font-mono text-xs text-gray-500 bg-[#121212] px-1.5 py-0.5 rounded border border-white/8">
                  {ev.time}
                </span>
              </div>

              {/* Contingut */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 leading-relaxed">{ev.text}</p>

                {/* Jugadors */}
                {ev.players?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {ev.players.map(p => {
                      const playerObj = DATABASE.roster.find(pl => pl.name === p);
                      return (
                        <span key={p} className="flex items-center gap-1 text-[10px] bg-[#121212] border border-white/8 rounded-full px-2 py-0.5 text-gray-400">
                          {playerObj?.photo && (
                            <img src={`${BASE}${playerObj.photo}`} alt={p}
                              className="w-3 h-3 rounded-full object-cover object-top"/>
                          )}
                          {p.split(' ')[0]}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Foto especial (Oriol pi) */}
                {hasPhoto && (
                  <div className="mt-3 flex items-start gap-3">
                    <div
                      className="relative rounded-xl overflow-hidden border border-[#E5C07B]/30 cursor-pointer shrink-0 transition-all duration-300"
                      style={{ width: 120, height: 80 }}
                      onMouseEnter={() => setHoveredPhoto(idx)}
                      onMouseLeave={() => setHoveredPhoto(null)}>
                      <img
                        src={`${BASE}${isPhotoHovered && ev.photoHover ? ev.photoHover : ev.photo}`}
                        alt="Moment"
                        className="w-full h-full object-cover transition-all duration-400"
                      />
                      {ev.photoHover && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-xs text-white font-bold bg-black/60 px-2 py-1 rounded-full">Hover!</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-[#E5C07B]/60 italic">⭐ Moment especial</p>
                  </div>
                )}
              </div>

              {/* Botó vídeo */}
              {hasVideo && ev.videoUrl && (
                <a href={ev.videoUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 w-9 h-9 rounded-full bg-red-600/15 border border-red-500/20
                    flex items-center justify-center hover:bg-red-600 hover:border-red-500 transition-all group/btn mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" className="fill-red-400 group-hover/btn:fill-white transition-colors">
                    <polygon points="2,1 11,6 2,11"/>
                  </svg>
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// VISTA B: DETALL D'UN PARTIT
// ==========================================
const BASE = import.meta.env.BASE_URL;

export default function MatchDetail({ match, onBack }) {

  // Minut d'inici del vídeo (en segons) — canvia quan es clica un gol
  const [videoStart, setVideoStart] = useState(0);

  // Funció per saltar al minut del gol
  const jumpToGoal = (timeStr) => {
    if (!match.youtubeId) return;
    const secs = Math.max(0, parseTime(timeStr) - 3); // 3 segons abans del gol
    setVideoStart(secs);
    // Scroll suau cap al vídeo
    document.getElementById('match-video')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const hasSubstitutions = match.events.substitutions.length > 1;

  // Només calculem stats si tenim substitucions
  const matchStats = useMemo(() => {
    if (!hasSubstitutions) return null;
    return calcMatchStats(match);
  }, [match, hasSubstitutions]);

  // Color de la barra de minuts
  const barColor = (deviation) => {
    if (deviation > 120)  return 'bg-[#C0392B]';
    if (deviation < -120) return 'bg-[#4A5568]';
    return 'bg-[#E5C07B]';
  };

  // Qui estava a la pista en un moment donat (si tenim les dades)
  const whoWasOnPitch = (timeSec) => {
    if (!hasSubstitutions) return null;
    const subs = match.events.substitutions;
    let lastSub = subs[0];
    for (const sub of subs) {
      if (parseTime(sub.time) <= timeSec) lastSub = sub;
      else break;
    }
    return lastSub.onPitch;
  };

  // Color del resultat
  const [home, away] = match.result.split('-').map(s => parseInt(s.trim()));
  const resultColor = home > away ? 'text-emerald-400' : home < away ? 'text-[#C0392B]' : 'text-yellow-400';

  // Determina quin reproductor mostrar
  const hasYoutube = !!match.youtubeId;
  const hasVimeo   = !!match.vimeoId;
  const hasVideo   = hasYoutube || hasVimeo;

  // Ordena gols per minut
  const goalsSorted = [...match.events.goals].sort((a, b) => parseTime(a.time) - parseTime(b.time));

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Botó tornar */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-[#E5C07B] transition-colors text-sm font-medium"
      >
        <ChevronLeft className="w-4 h-4" /> Tornar al Panel
      </button>

      {/* === CAPÇALERA === */}
      <div className="bg-[#1E1E1E] rounded-xl p-6 md:p-8 border border-[#E5C07B]/20 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="text-[#E5C07B] text-sm font-semibold mb-2">
              {match.jornada} · {match.date}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              <span className="text-[#C0392B]">{DATABASE.teamName}</span>
              <span className="mx-3 text-gray-600 font-light">vs</span>
              <span>{match.opponent}</span>
            </h2>
          </div>
          <div className={`text-5xl md:text-6xl font-black font-mono bg-[#121212] px-6 py-3 rounded-xl border border-white/5 ${resultColor}`}>
            {match.result}
          </div>
        </div>
      </div>

      {/* === VÍDEO (YouTube o Vimeo) === */}
      {hasVideo && (
        <div id="match-video" className="bg-[#1E1E1E] rounded-xl p-6 border border-white/5 shadow-xl">
          <h3 className="text-lg font-bold text-[#E5C07B] mb-4 flex items-center gap-2">
            <PlayCircle className="w-5 h-5" />
            {hasVimeo ? 'Vídeo del Partit (Resum de Gols)' : 'Vídeo del Partit'}
          </h3>
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden border border-white/10">
            {hasYoutube && (
              <iframe
                width="100%" height="100%"
                src={`https://www.youtube.com/embed/${match.youtubeId}?rel=0&start=${videoStart}&autoplay=${videoStart > 0 ? 1 : 0}`}
                title={`${DATABASE.teamName} vs ${match.opponent}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            {hasVimeo && (
              <iframe
                width="100%" height="100%"
                src={`https://player.vimeo.com/video/${match.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                title={`${DATABASE.teamName} vs ${match.opponent}`}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}

      {/* === BARRES DE MINUTS + LOG DE GOLS === */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Minuts per jugador — només si tenim substitucions */}
        {hasSubstitutions && matchStats ? (
          <div className="bg-[#1E1E1E] rounded-xl p-6 border border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#E5C07B] flex items-center gap-2">
                <Clock className="w-5 h-5" /> Minuts per Jugador
              </h3>
              <span className="text-xs bg-[#121212] px-3 py-1 rounded text-gray-400 border border-white/5">
                Ideal: {match.idealMinutesPerPlayer} min
              </span>
            </div>
            <div className="flex gap-4 mb-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#E5C07B] inline-block"/>Ideal</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#C0392B] inline-block"/>Excés</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#4A5568] inline-block"/>Poc temps</span>
            </div>
            <div className="space-y-3">
              {matchStats.playerStats.map(({ player, totalSec, deviation }) => {
                const width = (totalSec / matchStats.finalTime) * 100;
                const idealWidth = ((match.idealMinutesPerPlayer * 60) / matchStats.finalTime) * 100;
                return (
                  <div key={player} className="group flex items-center gap-3">
                    <span className="w-28 text-xs text-right truncate text-gray-400 group-hover:text-white transition-colors">
                      {player}
                    </span>
                    <div className="flex-1 h-6 bg-[#121212] rounded overflow-hidden border border-white/5 relative">
                      <div
                        className={`h-full ${barColor(deviation)} transition-all duration-700 rounded`}
                        style={{ width: `${Math.max(width, 1)}%` }}
                      />
                      <div className="absolute top-0 bottom-0 w-px bg-white/30" style={{ left: `${idealWidth}%` }} />
                    </div>
                    <div className="w-20 text-right">
                      <div className="text-xs font-mono text-white">{formatTime(totalSec)}</div>
                      <div className={`text-xs font-mono ${deviation > 0 ? 'text-[#C0392B]' : deviation < 0 ? 'text-gray-500' : 'text-[#E5C07B]'}`}>
                        {deviation >= 0 ? '+' : '-'}{formatTime(Math.abs(deviation))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Missatge quan no tenim dades de substitucions
          <div className="bg-[#1E1E1E] rounded-xl p-6 border border-white/5 shadow-xl flex items-center justify-center">
            <div className="text-center text-gray-500">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">Sense dades de substitucions</p>
              <p className="text-xs mt-1 opacity-60">No es van registrar els canvis d'aquest partit</p>
            </div>
          </div>
        )}

        {/* === HIGHLIGHTS === */}
        {match.events?.highlights?.length > 0 && (
          <div className="bg-[#1E1E1E] rounded-xl p-6 border border-[#E5C07B]/15 shadow-xl">
            <h3 className="text-lg font-bold text-[#E5C07B] mb-4 flex items-center gap-2">
              ✨ Moments Destacats
            </h3>
            <div className="space-y-4">
              {match.events.highlights.map((h, idx) => (
                <div key={idx} className="flex gap-4 items-start group">
                  {/* Foto si en té */}
                  {h.photo && (
                    <div className="w-24 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0 group-hover:border-[#E5C07B]/40 transition-colors">
                      <img src={`${BASE}${h.photo}`} alt={h.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono bg-[#121212] px-2 py-0.5 rounded text-xs border border-white/10 shrink-0">
                        {h.time}
                      </span>
                      <span className="text-lg leading-none">{h.emoji}</span>
                      <span className="font-black text-white text-sm">{h.title}</span>
                      {/* Botó saltar al vídeo */}
                      {match.youtubeId && (
                        <button
                          onClick={() => jumpToGoal(h.time)}
                          className="ml-auto flex items-center gap-1 text-xs px-2 py-0.5 rounded-full
                            bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/30 transition-all shrink-0"
                        >
                          ▶ {h.time}
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{h.description}</p>
                    {h.player && (
                      <div className="mt-1 text-xs text-[#E5C07B]/60">👤 {h.player}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === LOG DE GOLS === */}
        <div className="bg-[#1E1E1E] rounded-xl p-6 border border-white/5 shadow-xl flex flex-col">
          <h3 className="text-lg font-bold text-[#E5C07B] mb-5 flex items-center gap-2">
            ⚽ Registre de Gols
          </h3>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {goalsSorted.map((goal, idx) => {
              const onPitch = goal.onPitch || (hasSubstitutions ? whoWasOnPitch(parseTime(goal.time)) : null);
              const isFavor = goal.type === 'favor';
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-l-4 ${
                    isFavor ? 'bg-emerald-500/10 border-emerald-500' : 'bg-[#C0392B]/10 border-[#C0392B]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono bg-[#121212] px-2 py-0.5 rounded text-xs border border-white/10">
                      {goal.time}
                    </span>
                    <span className={`font-bold text-xs ${isFavor ? 'text-emerald-400' : 'text-[#C0392B]'}`}>
                      {isFavor ? '⭐ GOL A FAVOR' : '❌ GOL EN CONTRA'}
                    </span>
                    {match.youtubeId && (
                      <button
                        onClick={() => jumpToGoal(goal.time)}
                        className="ml-auto flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-all
                          bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/30"
                        title="Veure al vídeo"
                      >
                        ▶ {goal.time}
                      </button>
                    )}
                  </div>

                  {isFavor ? (
                    <div className="text-sm text-gray-300">
                      <span className="text-white font-semibold">{goal.scorer}</span>
                      {goal.assist && (
                        <span className="text-gray-400"> · Assist: <span className="text-white">{goal.assist}</span></span>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 italic">
                      {goal.notes || 'Sense observacions'}
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-white/5 text-xs text-gray-500 space-y-1">
                    {goal.goalkeeper && (
                      <div>Porter: <span className="text-gray-300">{goal.goalkeeper}</span></div>
                    )}
                    {onPitch && onPitch.length > 0 && (
                      <div>A la pista: <span className="text-gray-300">{onPitch.join(', ')}</span></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* === RETRANSMISSIÓ MINUT A MINUT === */}
      {match.events?.retransmissio?.length > 0 && (
        <RetransmissioSection
          events={match.events.retransmissio}
          onJump={jumpToGoal}
          hasVideo={hasYoutube}
        />
      )}

      {/* === LÍNIA DE TEMPS — només si tenim substitucions === */}
      {hasSubstitutions && matchStats && (
        <div className="bg-[#1E1E1E] rounded-xl p-6 border border-white/5 shadow-xl overflow-x-auto">
          <h3 className="text-lg font-bold text-[#E5C07B] mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Línia de Temps
          </h3>
          <div className="min-w-[700px]">
            {/* Eix X */}
            <div className="flex ml-32 mb-2 relative h-5">
              {[0, 5, 10, 15, 20, 25, 30, 35].map(m => {
                const left = (m * 60 / matchStats.finalTime) * 100;
                if (left > 100) return null;
                return (
                  <div key={m} className="absolute text-xs text-gray-500 -translate-x-1/2" style={{ left: `${left}%` }}>
                    {m}'
                  </div>
                );
              })}
            </div>

            {/* Icones de gols + highlights */}
            <div className="relative h-8 ml-32 mb-1">
              {goalsSorted.map((goal, idx) => {
                const left = (parseTime(goal.time) / matchStats.finalTime) * 100;
                return (
                  <div key={idx} className="absolute top-0 -translate-x-1/2 flex flex-col items-center group cursor-default" style={{ left: `${left}%` }}>
                    {goal.type === 'favor'
                      ? <Star className="w-5 h-5 text-[#E5C07B] fill-[#E5C07B] drop-shadow-[0_0_4px_rgba(229,192,123,0.9)]" />
                      : <XCircle className="w-5 h-5 text-[#C0392B] drop-shadow-[0_0_4px_rgba(192,57,43,0.9)]" />
                    }
                    <div className="opacity-0 group-hover:opacity-100 absolute top-7 w-28 bg-[#0a0a0a] text-xs p-2 rounded z-50 border border-white/10 transition-opacity text-center pointer-events-none whitespace-nowrap">
                      {goal.time} — {goal.type === 'favor' ? '⭐ Favor' : '❌ Contra'}
                      {goal.scorer && <div className="text-[#E5C07B]">{goal.scorer}</div>}
                    </div>
                  </div>
                );
              })}
              {/* Highlights sobre el timeline */}
              {(match.events?.highlights || []).map((h, idx) => {
                const left = (parseTime(h.time) / matchStats.finalTime) * 100;
                return (
                  <div key={`h-${idx}`} className="absolute top-0 -translate-x-1/2 flex flex-col items-center group cursor-default" style={{ left: `${left}%` }}>
                    <span className="text-lg leading-none drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.4))' }}>{h.emoji}</span>
                    <div className="opacity-0 group-hover:opacity-100 absolute top-7 w-36 bg-[#0a0a0a] text-xs p-2 rounded z-50 border border-[#E5C07B]/20 transition-opacity text-center pointer-events-none">
                      <div className="font-bold text-[#E5C07B] mb-0.5">{h.title}</div>
                      <div className="text-gray-500">{h.time} · {h.player}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Línies dels jugadors */}
            <div className="space-y-1.5 relative">
              {goalsSorted.map((goal, idx) => {
                const left = (parseTime(goal.time) / matchStats.finalTime) * 100;
                return (
                  <div key={`vline-${idx}`}
                    className={`absolute top-0 bottom-0 w-px z-0 pointer-events-none ${goal.type === 'favor' ? 'bg-[#E5C07B]/15' : 'bg-[#C0392B]/15'}`}
                    style={{ left: `calc(8rem + ${left}%)` }}
                  />
                );
              })}

              {/* Jugadors que han jugat — extraiem noms únics dels stints */}
              {[...new Set(matchStats.stints.map(s => s.player))].map(playerName => {
                const playerStints = matchStats.stints.filter(s => s.player === playerName);
                const totalSecs = playerStints.reduce((acc, s) => acc + (s.end - s.start), 0);
                const playerObj = DATABASE.roster.find(p => p.name === playerName);
                return (
                  <div key={playerName} className="flex items-center gap-2 h-8 relative z-10 hover:bg-white/5 rounded-lg px-1 group">
                    {/* Mini avatar */}
                    {playerObj?.photo ? (
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 shrink-0">
                        <img src={`${BASE}${playerObj.photo}`} alt={playerName} className="w-full h-full object-cover object-top" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#C0392B]/20 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-black text-[#E5C07B]/60">{playerName[0]}</span>
                      </div>
                    )}
                    <span className="w-20 text-xs text-right truncate text-gray-400 group-hover:text-white transition-colors shrink-0">
                      {playerObj?.shirtName || playerName}
                    </span>
                    <div className="flex-1 h-full relative">
                      {playerStints.map((stint, idx) => {
                        const left  = (stint.start / matchStats.finalTime) * 100;
                        const width = ((stint.end - stint.start) / matchStats.finalTime) * 100;
                        return (
                          <div key={idx}
                            className="absolute top-1 bottom-1 rounded border border-[#E5C07B]/20 hover:border-[#E5C07B]/60 hover:brightness-125 transition-all cursor-default"
                            style={{
                              left: `${left}%`,
                              width: `${Math.max(width, 0.8)}%`,
                              background: 'linear-gradient(90deg, #7b1c12, #C0392B)',
                            }}
                            title={`${playerName}: ${formatTime(stint.start)} → ${formatTime(stint.end)} (${formatTime(stint.end - stint.start)})`}
                          />
                        );
                      })}
                    </div>
                    <span className="w-12 text-xs font-mono text-[#E5C07B]/60 text-right shrink-0">{formatTime(totalSecs)}</span>
                  </div>
                );
              })}
            </div>

            {/* Llegenda */}
            <div className="flex gap-4 mt-4 text-xs text-gray-500 ml-32">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[#E5C07B] fill-[#E5C07B]" /> Gol a favor</span>
              <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-[#C0392B]" /> Gol en contra</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
