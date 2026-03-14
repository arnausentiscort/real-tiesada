import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ChevronLeft, Clock, Star, XCircle, AlertCircle } from 'lucide-react';
import { DATABASE } from '../data.js';
import { parseTime, formatTime, calcMatchStats } from '../utils.js';

const BASE = import.meta.env.BASE_URL;

// ── Tipus d'events per la crònica ────────────────────────────────
const TYPE_CFG = {
  goal_favor:  { icon:'⚽', label:'Gol a favor',   size:'big',    accent:'#27AE60', bg:'rgba(39,174,96,0.08)',   border:'rgba(39,174,96,0.3)'   },
  goal_contra: { icon:'❌', label:'Gol en contra',  size:'big',    accent:'#C0392B', bg:'rgba(192,57,43,0.08)',   border:'rgba(192,57,43,0.3)'   },
  clip:        { icon:'🎬', label:'Moment viral',   size:'medium', accent:'#E5C07B', bg:'rgba(229,192,123,0.06)', border:'rgba(229,192,123,0.2)' },
  bona:        { icon:'✅', label:'Jugada bona',    size:'small',  accent:'#27AE60', bg:'transparent',            border:'transparent'           },
  dolenta:     { icon:'💥', label:'Error',          size:'small',  accent:'#C0392B', bg:'transparent',            border:'transparent'           },
  tactica:     { icon:'🧠', label:'Tàctica',        size:'small',  accent:'#61AFEF', bg:'transparent',            border:'transparent'           },
};

// ── Construeix la crònica unificada (gols + retransmissió) ────────
function buildCronica(match) {
  const items = [];

  // Gols
  (match.events?.goals || []).forEach(g => {
    items.push({
      time: g.time,
      kind: g.type === 'favor' ? 'goal_favor' : 'goal_contra',
      scorer: g.scorer,
      assist: g.assist,
      goalkeeper: g.goalkeeper,
      notes: g.notes,
      videoUrl: match.youtubeId
        ? `https://www.youtube.com/watch?v=${match.youtubeId}&t=${Math.max(0,parseTime(g.time)-3)}s`
        : (match.vimeoId ? `https://vimeo.com/${match.vimeoId}#t=${Math.max(0,parseTime(g.time)-3)}s` : null),
    });
  });

  // Retransmissió
  (match.events?.retransmissio || []).forEach(r => {
    items.push({
      time: r.time,
      kind: r.type,
      text: r.text,
      players: r.players,
      videoUrl: r.videoUrl,
      photo: r.photo,
      photoHover: r.photoHover,
    });
  });

  // Ordena per minut
  items.sort((a, b) => parseTime(a.time) - parseTime(b.time));

  // Calcula marcador en viu
  let home = 0, away = 0;
  items.forEach(item => {
    if (item.kind === 'goal_favor')  { home++; item.score = `${home}-${away}`; }
    if (item.kind === 'goal_contra') { away++; item.score = `${home}-${away}`; }
  });

  return items;
}

// ── Targeta gran de gol ───────────────────────────────────────────
function GoalCard({ item, onJump }) {
  const cfg = TYPE_CFG[item.kind];
  const isFavor = item.kind === 'goal_favor';
  return (
    <div className="relative rounded-2xl overflow-hidden border"
      style={{ background: cfg.bg, borderColor: cfg.border }}>
      {/* Franja lateral de color */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: cfg.accent }}/>
      <div className="pl-4 pr-4 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            {/* Timestamp */}
            <span className="font-mono text-xs bg-black/30 px-2 py-1 rounded-lg border border-white/10 text-gray-300">
              {item.time}
            </span>
            {/* Marcador */}
            <span className="font-black font-mono text-xl" style={{ color: cfg.accent }}>
              {item.score}
            </span>
            {/* Label */}
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: cfg.accent }}>
              {isFavor ? '⚽ GOL A FAVOR' : '❌ EN CONTRA'}
            </span>
          </div>
          {/* Botó vídeo */}
          {item.videoUrl && (
            <a href={item.videoUrl} target="_blank" rel="noopener noreferrer"
              onClick={e => { e.stopPropagation(); if (onJump) onJump(item.time); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all
                bg-red-600/15 border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-500">
              ▶ Veure
            </a>
          )}
        </div>
        {isFavor ? (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-white font-black text-lg">{item.scorer}</span>
            {item.assist && <span className="text-gray-400 text-sm">· assist: <span className="text-gray-200">{item.assist}</span></span>}
          </div>
        ) : (
          item.notes && <p className="mt-2 text-sm text-gray-400 italic">{item.notes}</p>
        )}
      </div>
    </div>
  );
}

// ── Targeta de moment (clip/viral) ────────────────────────────────
function MomentCard({ item }) {
  const [hovered, setHovered] = useState(false);
  const cfg = TYPE_CFG[item.kind];
  const hasPhoto = !!item.photo;

  return (
    <div className="rounded-xl overflow-hidden border"
      style={{ background: cfg.bg, borderColor: cfg.border }}>
      {/* Foto gran si en té */}
      {hasPhoto && (
        <div className="relative overflow-hidden cursor-pointer"
          style={{ aspectRatio:'16/9' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}>
          <img src={`${BASE}${hovered && item.photoHover ? item.photoHover : item.photo}`}
            alt={item.text}
            className="w-full h-full object-cover transition-all duration-400"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
          {item.photoHover && (
            <div className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full border font-bold transition-all
              ${hovered ? 'bg-[#E5C07B]/20 border-[#E5C07B]/50 text-[#E5C07B]' : 'bg-black/50 border-white/20 text-white/60'}`}>
              {hovered ? '▶ acció' : '🎬 hover'}
            </div>
          )}
          {item.videoUrl && (
            <a href={item.videoUrl} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold
                bg-red-600/80 hover:bg-red-600 text-white border border-red-500/50 transition-all">
              ▶ Vídeo
            </a>
          )}
          <div className="absolute bottom-3 left-3">
            <span className="font-mono text-xs bg-black/60 px-2 py-0.5 rounded text-gray-300">{item.time}</span>
          </div>
        </div>
      )}
      <div className="px-4 py-3">
        {!hasPhoto && (
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs bg-black/30 px-2 py-0.5 rounded border border-white/10 text-gray-400">{item.time}</span>
            <span className="text-base">{cfg.icon}</span>
          </div>
        )}
        <p className="text-sm text-gray-200 leading-relaxed">{item.text}</p>
        {item.players?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.players.map(p => {
              const pl = DATABASE.roster.find(r => r.name === p);
              return (
                <span key={p} className="flex items-center gap-1 text-[10px] bg-black/30 border border-white/8 rounded-full px-2 py-0.5 text-gray-400">
                  {pl?.photo && <img src={`${BASE}${pl.photo}`} alt={p} className="w-3 h-3 rounded-full object-cover object-top"/>}
                  {p.split(' ')[0]}
                </span>
              );
            })}
          </div>
        )}
        {!hasPhoto && item.videoUrl && (
          <a href={item.videoUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg text-xs font-bold
              bg-red-600/15 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-all">
            ▶ Veure al vídeo
          </a>
        )}
      </div>
    </div>
  );
}

// ── Línia compacta (bona/dolenta/tactica) ─────────────────────────
function CompactLine({ item }) {
  const cfg = TYPE_CFG[item.kind];
  return (
    <div className="flex items-start gap-3 py-2 px-3 rounded-xl hover:bg-white/3 transition-colors group">
      <span className="font-mono text-[10px] text-gray-600 w-8 shrink-0 pt-0.5 group-hover:text-gray-400">{item.time}</span>
      <span className="text-sm shrink-0">{cfg.icon}</span>
      <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors flex-1">{item.text}</p>
      {item.videoUrl && (
        <a href={item.videoUrl} target="_blank" rel="noopener noreferrer"
          className="shrink-0 w-6 h-6 rounded-full bg-red-600/10 flex items-center justify-center
            opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className="text-red-400">
            <polygon points="1,0 8,4 1,8"/>
          </svg>
        </a>
      )}
    </div>
  );
}

// ── Component principal ───────────────────────────────────────────
export default function MatchDetail({ match, onBack }) {
  const [videoStart, setVideoStart] = useState(0);

  const hasSubstitutions = match.events.substitutions.length > 1;
  const matchStats = useMemo(() => {
    if (!hasSubstitutions) return null;
    return calcMatchStats(match);
  }, [match, hasSubstitutions]);

  const barColor = (deviation) => {
    if (deviation > 120)  return 'bg-[#C0392B]';
    if (deviation < -120) return 'bg-[#4A5568]';
    return 'bg-[#E5C07B]';
  };

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

  const [home, away] = match.result.split('-').map(s => parseInt(s.trim()));
  const resultColor = home > away ? 'text-emerald-400' : home < away ? 'text-[#C0392B]' : 'text-yellow-400';
  const hasYoutube = !!match.youtubeId;
  const hasVimeo   = !!match.vimeoId;
  const hasVideo   = hasYoutube || hasVimeo;

  const cronica = useMemo(() => buildCronica(match), [match]);
  const hasCronica = cronica.length > 0;

  const jumpToGoal = (timeStr) => {
    if (!match.youtubeId) return;
    const secs = Math.max(0, parseTime(timeStr) - 3);
    setVideoStart(secs);
    document.getElementById('match-video')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Botó tornar */}
      <button onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-[#E5C07B] transition-colors text-sm font-medium">
        <ChevronLeft className="w-4 h-4" /> Tornar al Panel
      </button>

      {/* Capçalera */}
      <div className="bg-[#1E1E1E] rounded-xl p-5 md:p-7 border border-[#E5C07B]/20 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-[#E5C07B] text-xs font-semibold mb-1 uppercase tracking-wider">
              {match.jornada} · {match.date}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              <span className="text-[#C0392B]">{DATABASE.teamName}</span>
              <span className="mx-3 text-gray-600 font-light">vs</span>
              <span>{match.opponent}</span>
            </h2>
          </div>
          <div className={`text-4xl md:text-5xl font-black font-mono bg-[#121212] px-5 py-3 rounded-xl border border-white/5 ${resultColor}`}>
            {match.result}
          </div>
        </div>
      </div>

      {/* Vídeo */}
      {hasVideo && (
        <div id="match-video" className="bg-[#1E1E1E] rounded-xl overflow-hidden border border-white/5 shadow-xl">
          <div className="aspect-video w-full bg-black">
            {hasYoutube && (
              <iframe width="100%" height="100%"
                src={`https://www.youtube.com/embed/${match.youtubeId}?rel=0&start=${videoStart}&autoplay=${videoStart > 0 ? 1 : 0}`}
                title={`${DATABASE.teamName} vs ${match.opponent}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen/>
            )}
            {hasVimeo && (
              <iframe width="100%" height="100%"
                src={`https://player.vimeo.com/video/${match.vimeoId}?badge=0&autopause=0`}
                title={`${DATABASE.teamName} vs ${match.opponent}`}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen/>
            )}
          </div>
        </div>
      )}

      {/* Crònica del Partit */}
      {hasCronica && (
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <span className="text-base">📋</span>
            <h3 className="text-base font-bold text-[#E5C07B]">Crònica del Partit</h3>
            <span className="text-xs text-gray-600 ml-auto">{cronica.length} moments</span>
          </div>
          <div className="p-3 space-y-2">
            {cronica.map((item, idx) => {
              const size = TYPE_CFG[item.kind]?.size || 'small';
              if (size === 'big') return <GoalCard key={idx} item={item} onJump={jumpToGoal}/>;
              if (size === 'medium') return <MomentCard key={idx} item={item}/>;
              return <CompactLine key={idx} item={item}/>;
            })}
          </div>
        </div>
      )}

      {/* Minuts + Línia de temps */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {hasSubstitutions && matchStats ? (
          <div className="bg-[#1E1E1E] rounded-xl p-5 border border-white/5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#E5C07B] flex items-center gap-2">
                <Clock className="w-4 h-4"/> Minuts per Jugador
              </h3>
              <span className="text-xs bg-[#121212] px-2 py-1 rounded text-gray-500 border border-white/5">
                Ideal: {match.idealMinutesPerPlayer} min
              </span>
            </div>
            <div className="flex gap-3 mb-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#E5C07B] inline-block"/>Ideal</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#C0392B] inline-block"/>Excés</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#4A5568] inline-block"/>Poc temps</span>
            </div>
            <div className="space-y-2.5">
              {matchStats.playerStats.map(({ player, totalSec, deviation }) => {
                const width = (totalSec / matchStats.finalTime) * 100;
                const idealWidth = ((match.idealMinutesPerPlayer * 60) / matchStats.finalTime) * 100;
                return (
                  <div key={player} className="group flex items-center gap-2">
                    <span className="w-24 text-xs text-right truncate text-gray-500 group-hover:text-white transition-colors shrink-0">{player.split(' ')[0]}</span>
                    <div className="flex-1 h-5 bg-[#121212] rounded overflow-hidden border border-white/5 relative">
                      <div className={`h-full ${barColor(deviation)} transition-all duration-700 rounded`}
                        style={{ width: `${Math.max(width, 1)}%` }}/>
                      <div className="absolute top-0 bottom-0 w-px bg-white/30" style={{ left: `${idealWidth}%` }}/>
                    </div>
                    <div className="w-16 text-right shrink-0">
                      <div className="text-xs font-mono text-white">{formatTime(totalSec)}</div>
                      <div className={`text-[10px] font-mono ${deviation > 0 ? 'text-[#C0392B]' : deviation < 0 ? 'text-gray-500' : 'text-[#E5C07B]'}`}>
                        {deviation >= 0 ? '+' : '-'}{formatTime(Math.abs(deviation))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-[#1E1E1E] rounded-xl p-5 border border-white/5 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40"/>
              <p className="text-sm">Sense dades de substitucions</p>
            </div>
          </div>
        )}

        {/* Línia de temps */}
        {hasSubstitutions && matchStats && (
          <div className="bg-[#1E1E1E] rounded-xl p-5 border border-white/5 shadow-xl overflow-x-auto">
            <h3 className="text-sm font-bold text-[#E5C07B] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4"/> Línia de Temps
            </h3>
            <div className="min-w-[600px]">
              <div className="flex ml-24 mb-1.5 relative h-4">
                {[0,5,10,15,20,25,30,35].map(m => {
                  const left = (m*60/matchStats.finalTime)*100;
                  if (left > 100) return null;
                  return <div key={m} className="absolute text-[10px] text-gray-600 -translate-x-1/2" style={{left:`${left}%`}}>{m}'</div>;
                })}
              </div>
              <div className="relative h-7 ml-24 mb-1">
                {cronica.filter(i => i.kind === 'goal_favor' || i.kind === 'goal_contra').map((g, idx) => {
                  const left = (parseTime(g.time)/matchStats.finalTime)*100;
                  return (
                    <div key={idx} className="absolute top-0 -translate-x-1/2 group cursor-default" style={{left:`${left}%`}}>
                      {g.kind === 'goal_favor'
                        ? <Star className="w-4 h-4 text-[#E5C07B] fill-[#E5C07B]"/>
                        : <XCircle className="w-4 h-4 text-[#C0392B]"/>}
                      <div className="opacity-0 group-hover:opacity-100 absolute top-6 w-24 bg-[#0a0a0a] text-[10px] p-1.5 rounded z-50 border border-white/10 pointer-events-none whitespace-nowrap text-center">
                        {g.time} · {g.score}
                        {g.scorer && <div className="text-[#E5C07B]">{g.scorer}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="space-y-1.5 relative">
                {[...new Set(matchStats.stints.map(s => s.player))].map(playerName => {
                  const playerStints = matchStats.stints.filter(s => s.player === playerName);
                  const totalSecs = playerStints.reduce((acc,s) => acc+(s.end-s.start), 0);
                  const playerObj = DATABASE.roster.find(p => p.name === playerName);
                  return (
                    <div key={playerName} className="flex items-center gap-2 h-7 relative z-10 hover:bg-white/5 rounded px-1 group">
                      {playerObj?.photo ? (
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-white/20 shrink-0">
                          <img src={`${BASE}${playerObj.photo}`} alt={playerName} className="w-full h-full object-cover object-top"/>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-[#C0392B]/20 border border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-[8px] font-black text-[#E5C07B]/60">{playerName[0]}</span>
                        </div>
                      )}
                      <span className="w-16 text-[10px] text-right truncate text-gray-500 group-hover:text-white shrink-0">
                        {playerObj?.shirtName || playerName.split(' ')[0]}
                      </span>
                      <div className="flex-1 h-full relative">
                        {playerStints.map((stint, idx) => {
                          const left  = (stint.start/matchStats.finalTime)*100;
                          const width = ((stint.end-stint.start)/matchStats.finalTime)*100;
                          return (
                            <div key={idx}
                              className="absolute top-0.5 bottom-0.5 rounded border border-[#E5C07B]/20 hover:border-[#E5C07B]/60 transition-all cursor-default"
                              style={{ left:`${left}%`, width:`${Math.max(width,0.8)}%`,
                                background:'linear-gradient(90deg,#7b1c12,#C0392B)' }}
                              title={`${playerName}: ${formatTime(stint.start)} → ${formatTime(stint.end)}`}
                            />
                          );
                        })}
                      </div>
                      <span className="w-10 text-[10px] font-mono text-[#E5C07B]/50 text-right shrink-0">{formatTime(totalSecs)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
