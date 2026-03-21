import React, { useMemo, useState, useRef, useEffect } from 'react';
import { ChevronLeft, Clock, AlertCircle } from 'lucide-react';
import { DATABASE } from '../data.js';
import { parseTime, formatTime, calcMatchStats } from '../utils.js';

const BASE = import.meta.env.BASE_URL;

// ── Emoji automàtic ───────────────────────────────────────────────
function pickEmoji(text) {
  const t = text.toLowerCase();
  if (t.includes('atura') || t.includes('parad') || t.includes('para ') || t.includes('vola') || t.includes('santo') || t.includes('paradon') || t.includes('miracle')) return '🧤';
  if (t.includes('tombarella') || t.includes('cau a terra') || t.includes('bacall') || t.includes('reixa') || t.includes('pedra')) return '🎬';
  if (t.includes('regal') || t.includes('embolic') || t.includes('perd') || t.includes('destrossa') || t.includes('botiga') || t.includes('prohibit') || t.includes('mal') && t.includes('treu')) return '💥';
  if (t.includes('paret') || t.includes('connexió') || t.includes('tiqui') || t.includes('combinaci') || t.includes('filtrat') || t.includes('entre línies')) return '🔗';
  if (t.includes('canvi') || t.includes('tàctic') || t.includes('enrere') || t.includes('conserva')) return '🔄';
  if (t.includes('falta') || t.includes('lliure')) return '🛡️';
  if (t.includes('passad') || t.includes('assist') || t.includes('espai')) return '🎯';
  if (t.includes('recuper')) return '💪';
  if (t.includes('xut') || t.includes('tir') || t.includes('dispara')) return '⚡';
  return '▶️';
}

// ── Construeix crònica ────────────────────────────────────────────
function buildCronica(match) {
  const items = [];
  const makeUrl = (timeStr) => {
    const s = Math.max(0, parseTime(timeStr) - 3);
    if (match.youtubeId) return `https://www.youtube.com/watch?v=${match.youtubeId}&t=${s}s`;
    if (match.vimeoId)   return `https://vimeo.com/${match.vimeoId}#t=${s}s`;
    return null;
  };
  (match.events?.goals || []).forEach(g => {
    items.push({ time: g.time, kind: g.type === 'favor' ? 'goal_favor' : 'goal_contra',
      scorer: g.scorer, assist: g.assist, notes: g.notes, jumpUrl: makeUrl(g.time) });
  });
  (match.events?.retransmissio || []).forEach(r => {
    items.push({ time: r.time, kind: 'moment', text: r.text, players: r.players,
      emoji: pickEmoji(r.text), photo: r.photo, photoHover: r.photoHover, jumpUrl: makeUrl(r.time) });
  });
  items.sort((a, b) => parseTime(a.time) - parseTime(b.time));
  let home = 0, away = 0;
  items.forEach(item => {
    if (item.kind === 'goal_favor')  { home++; item.score = `${home}-${away}`; }
    if (item.kind === 'goal_contra') { away++; item.score = `${home}-${away}`; }
  });
  return items;
}

// ── Gràfic de temps — nou disseny ────────────────────────────────
function TimelineChart({ match, matchStats, onJump }) {
  const subs = match.events.substitutions;
  if (!subs || subs.length < 2) return null;

  const finalTime = parseTime(subs[subs.length - 1].time);
  const START = parseTime(subs[0].time);
  const RANGE = finalTime - START;
  const idealSecs = match.idealMinutesPerPlayer * 60;

  // Calcula stints per jugador (camp)
  const stints = {};
  const active = {};
  subs.forEach((sub, i) => {
    const ts = parseTime(sub.time);
    Object.keys(active).forEach(p => {
      if (!sub.onPitch.includes(p)) {
        if (!stints[p]) stints[p] = [];
        stints[p].push({ start: active[p], end: ts });
        delete active[p];
      }
    });
    sub.onPitch.forEach(p => { if (active[p] === undefined) active[p] = ts; });
  });

  // Stints de porter per cada jugador
  const goalkeeperStints = {};
  let prevTime = START, prevGK = subs[0].goalkeeper || null;
  subs.forEach(sub => {
    const ts = parseTime(sub.time);
    if (sub.goalkeeper && sub.goalkeeper !== prevGK) {
      if (prevGK) {
        if (!goalkeeperStints[prevGK]) goalkeeperStints[prevGK] = [];
        goalkeeperStints[prevGK].push({ start: prevTime, end: ts });
      }
      prevGK = sub.goalkeeper; prevTime = ts;
    }
  });
  if (prevGK) {
    if (!goalkeeperStints[prevGK]) goalkeeperStints[prevGK] = [];
    goalkeeperStints[prevGK].push({ start: prevTime, end: finalTime });
  }

  // Tots els jugadors únics
  const allPlayers = [...new Set([
    ...Object.keys(stints),
    ...Object.keys(goalkeeperStints),
  ])];

  // Ordena: primers els que més minuts tenen
  const totalSecs = (p) => {
    const c = (stints[p] || []).reduce((a, s) => a + s.end - s.start, 0);
    const g = (goalkeeperStints[p] || []).reduce((a, s) => a + s.end - s.start, 0);
    return c + g;
  };
  allPlayers.sort((a, b) => totalSecs(b) - totalSecs(a));

  // Gols per marcar al timeline
  const goals = (match.events?.goals || []).map(g => ({
    time: parseTime(g.time), type: g.type,
    scorer: g.scorer, notes: g.notes,
  }));

  // Pauses (subs amb onPitch buit)
  const pauses = [];
  for (let i = 0; i < subs.length - 1; i++) {
    if (subs[i].onPitch.length === 0) {
      pauses.push({ start: parseTime(subs[i].time), end: parseTime(subs[i+1].time) });
    }
  }

  const pct = (s) => `${((s - START) / RANGE * 100).toFixed(2)}%`;
  const w   = (s, e) => `${((e - s) / RANGE * 100).toFixed(2)}%`;

  // Ticks cada 5 minuts
  const ticks = [];
  for (let m = 5; m <= Math.floor(finalTime / 60); m += 5) {
    const s = m * 60;
    if (s >= START && s <= finalTime) ticks.push({ s, label: `${m}'` });
  }

  const playerObj = (name) => DATABASE.roster.find(p => p.name === name);

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-bold text-[#E5C07B] flex items-center gap-2">
          <Clock className="w-4 h-4"/> Minuts jugats
        </h3>
        <div className="flex gap-3 text-[10px] text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{background:'linear-gradient(90deg,#1a4a1a,#27AE60)'}}/>Porter</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block" style={{background:'linear-gradient(90deg,#7b1c12,#C0392B)'}}/>Camp</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block bg-white/5 border border-white/10"/>Pausa</span>
          <span className="flex items-center gap-1"><span className="inline-block w-4 border-t border-dashed border-[#E5C07B]/50"/>Ideal</span>
        </div>
      </div>

      <div className="px-4 py-4 overflow-x-auto">
        <div style={{minWidth: 560}}>
          {/* Eix de temps */}
          <div className="flex mb-3">
            <div style={{width:100}} className="shrink-0"/>
            <div className="flex-1 relative h-5">
              {ticks.map(({s, label}) => (
                <div key={s} className="absolute flex flex-col items-center" style={{left: pct(s), transform:'translateX(-50%)'}}>
                  <div className="w-px h-2 bg-white/15"/>
                  <span className="text-[9px] text-gray-600 mt-0.5">{label}</span>
                </div>
              ))}
            </div>
            <div style={{width:52}} className="shrink-0"/>
          </div>

          {/* Fila de gols */}
          <div className="flex items-center mb-2">
            <div style={{width:100}} className="shrink-0 text-[9px] text-gray-600 text-right pr-2">Gols</div>
            <div className="flex-1 relative" style={{height:22}}>
              {/* Pauses */}
              {pauses.map((p,i) => (
                <div key={i} className="absolute top-0 bottom-0 bg-white/4 border-x border-white/8"
                  style={{left:pct(p.start), width:w(p.start,p.end)}}/>
              ))}
              {/* Línia ideal */}
              <div className="absolute top-0 bottom-0 border-l border-dashed border-[#E5C07B]/30" style={{left:pct(START+idealSecs)}}/>
              {/* Gols */}
              {goals.map((g,i) => (
                <div key={i} className="absolute top-0 bottom-0 flex flex-col items-center group cursor-pointer"
                  style={{left:pct(g.time), transform:'translateX(-50%)', zIndex:10}}
                  onClick={() => onJump && onJump(formatTime(g.time - START))}>
                  <div className="flex-1 w-px" style={{background: g.type==='favor' ? 'rgba(39,174,96,0.5)' : 'rgba(192,57,43,0.5)'}}/>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border"
                    style={{background: g.type==='favor'?'rgba(39,174,96,0.2)':'rgba(192,57,43,0.2)',
                      borderColor: g.type==='favor'?'rgba(39,174,96,0.6)':'rgba(192,57,43,0.6)',
                      color: g.type==='favor'?'#4ade80':'#f87171'}}>
                    {g.type==='favor'?'⚽':'❌'}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#0a0a0a] border border-white/15 rounded-lg px-2 py-1.5
                    text-[9px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-20">
                    <div className="font-bold" style={{color:g.type==='favor'?'#4ade80':'#f87171'}}>
                      {formatTime(g.time - START)} {g.type==='favor'?'⚽':'❌'}
                    </div>
                    {g.scorer && <div className="text-gray-400">{g.scorer.split(' ')[0]}</div>}
                    {g.notes && <div className="text-gray-500 max-w-[120px] whitespace-normal">{g.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{width:52}} className="shrink-0"/>
          </div>

          {/* Files per jugador */}
          {allPlayers.map(name => {
            const campStints = stints[name] || [];
            const gkStints   = goalkeeperStints[name] || [];
            const total = totalSecs(name);
            const pl = playerObj(name);
            const deviation = total - idealSecs;
            const devColor = deviation > 120 ? '#C0392B' : deviation < -120 ? '#4A5568' : '#E5C07B';

            return (
              <div key={name} className="flex items-center mb-1.5 group">
                {/* Nom + foto */}
                <div style={{width:100}} className="shrink-0 flex items-center justify-end gap-2 pr-2">
                  {pl?.photo ? (
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-white/15 shrink-0">
                      <img src={`${BASE}${pl.photo}`} alt={name} className="w-full h-full object-cover object-top"/>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#C0392B]/15 border border-white/10 flex items-center justify-center shrink-0">
                      <span className="text-[8px] font-black text-[#E5C07B]/50">{name[0]}</span>
                    </div>
                  )}
                  <span className="text-[10px] text-gray-500 group-hover:text-white transition-colors truncate" style={{maxWidth:60}}>
                    {pl?.shirtName || name.split(' ')[0]}
                  </span>
                </div>

                {/* Barra */}
                <div className="flex-1 relative" style={{height:24}}>
                  {/* Pauses */}
                  {pauses.map((p,i) => (
                    <div key={i} className="absolute top-0 bottom-0 bg-white/4 border-x border-white/8"
                      style={{left:pct(p.start), width:w(p.start,p.end)}}/>
                  ))}
                  {/* Línia ideal */}
                  <div className="absolute top-0 bottom-0 border-l border-dashed border-[#E5C07B]/25"
                    style={{left:pct(START+idealSecs)}}/>
                  {/* Stints de camp */}
                  {campStints.map((s,i) => (
                    <div key={`c${i}`} className="absolute rounded border border-[#E5C07B]/10 hover:border-[#E5C07B]/40 transition-all"
                      style={{
                        left:pct(s.start), width:w(s.start,s.end),
                        top:2, bottom:2,
                        background:'linear-gradient(90deg,#7b1c12,#C0392B)',
                      }}
                      title={`${name}: ${formatTime(s.start)} → ${formatTime(s.end)}`}/>
                  ))}
                  {/* Stints de porter */}
                  {gkStints.map((s,i) => (
                    <div key={`g${i}`} className="absolute rounded border border-emerald-500/20 hover:border-emerald-500/50 transition-all"
                      style={{
                        left:pct(s.start), width:w(s.start,s.end),
                        top:2, bottom:2,
                        background:'linear-gradient(90deg,#1a4a1a,#27AE60)',
                      }}
                      title={`${name} (porter): ${formatTime(s.start)} → ${formatTime(s.end)}`}/>
                  ))}
                  {/* Gols — línies verticals */}
                  {goals.map((g,i) => (
                    <div key={i} className="absolute top-0 bottom-0 w-px pointer-events-none"
                      style={{left:pct(g.time), background: g.type==='favor'?'rgba(39,174,96,0.25)':'rgba(192,57,43,0.25)'}}/>
                  ))}
                </div>

                {/* Minuts i desviació */}
                <div style={{width:52}} className="shrink-0 text-right">
                  <div className="text-[10px] font-mono font-bold text-white">{formatTime(total)}</div>
                  <div className="text-[9px] font-mono" style={{color:devColor}}>
                    {deviation >= 0 ? '+' : ''}{formatTime(Math.abs(deviation))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Crònica vertical amb scroll ───────────────────────────────────
function CronicaVertical({ cronica, match, onJump }) {
  const timelineRef = useRef(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [photoHover, setPhotoHover] = useState(false);

  const totalSecs = cronica.length > 0
    ? parseTime(cronica[cronica.length-1].time)
    : parseTime(match.events.substitutions?.slice(-1)[0]?.time || '40:00');

  const [home, away] = match.result.split('-').map(s => parseInt(s.trim()));

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
        <span className="text-base">📋</span>
        <h3 className="text-base font-bold text-[#E5C07B]">Crònica del Partit</h3>
        <span className="text-xs text-gray-600 ml-auto">{cronica.length} moments</span>
      </div>

      <div className="flex" style={{minHeight: 400}}>
        {/* Eix temporal vertical — esquerra */}
        <div className="w-14 shrink-0 relative border-r border-white/5 bg-[#141414]">
          {/* Línia central */}
          <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/8" style={{transform:'translateX(-50%)'}}/>
          {/* Marcadors de minut cada 5' */}
          {Array.from({length: Math.floor(totalSecs/60/5)+1}, (_,i) => i*5).map(m => {
            const pct = (m*60 / totalSecs) * 100;
            return (
              <div key={m} className="absolute flex items-center gap-1" style={{top:`calc(${pct}% + 16px)`, left:0, right:0}}>
                <div className="flex-1 h-px bg-white/10"/>
                <span className="text-[8px] text-gray-700 font-mono pr-1">{m}'</span>
              </div>
            );
          })}
        </div>

        {/* Feed d'events */}
        <div ref={timelineRef} className="flex-1 py-4 px-3 space-y-1 overflow-y-auto" style={{maxHeight:600}}>
          {cronica.map((item, idx) => {
            const timePct = (parseTime(item.time) / totalSecs) * 100;
            const isGoal = item.kind === 'goal_favor' || item.kind === 'goal_contra';
            const isFavor = item.kind === 'goal_favor';

            if (isGoal) {
              return (
                <div key={idx} className="relative rounded-xl overflow-hidden border mb-2"
                  style={{
                    background: isFavor ? 'rgba(39,174,96,0.08)' : 'rgba(192,57,43,0.08)',
                    borderColor: isFavor ? 'rgba(39,174,96,0.3)' : 'rgba(192,57,43,0.3)',
                  }}>
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                    style={{background: isFavor ? '#27AE60' : '#C0392B'}}/>
                  <div className="pl-5 pr-4 py-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] bg-black/30 px-2 py-0.5 rounded border border-white/10 text-gray-400">{item.time}</span>
                        <span className="font-black font-mono text-2xl" style={{color: isFavor?'#27AE60':'#C0392B'}}>{item.score}</span>
                        <span className="text-xs font-bold uppercase tracking-wider" style={{color: isFavor?'#27AE60':'#C0392B'}}>
                          {isFavor ? '⚽ GOL A FAVOR' : '❌ EN CONTRA'}
                        </span>
                      </div>
                      {item.jumpUrl && (
                        <button onClick={() => onJump(item.time)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all
                            bg-red-600/15 border-red-500/25 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-500">
                          ▶ Veure
                        </button>
                      )}
                    </div>
                    {isFavor ? (
                      <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                        <span className="text-white font-black text-lg">{item.scorer}</span>
                        {item.assist && <span className="text-gray-400 text-sm">· assist: <span className="text-gray-200">{item.assist}</span></span>}
                      </div>
                    ) : (
                      item.notes && <p className="mt-1 text-xs text-gray-400 italic">{item.notes}</p>
                    )}
                  </div>
                </div>
              );
            }

            // Moment normal
            const hasPhoto = !!item.photo;
            return (
              <div key={idx}
                className="group rounded-xl border border-white/5 bg-[#1c1c1c] hover:border-white/12 hover:bg-[#202020] transition-all overflow-hidden mb-1"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}>
                {hasPhoto && (
                  <div className="relative overflow-hidden" style={{aspectRatio:'16/7'}}
                    onMouseEnter={() => setPhotoHover(true)}
                    onMouseLeave={() => setPhotoHover(false)}>
                    <img src={`${BASE}${hoveredIdx===idx && photoHover && item.photoHover ? item.photoHover : item.photo}`}
                      alt={item.text} className="w-full h-full object-cover transition-all duration-400"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    {item.photoHover && (
                      <div className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-full border bg-black/60 border-white/20 text-white/60">
                        🎬 hover
                      </div>
                    )}
                    {item.jumpUrl && (
                      <button onClick={() => onJump(item.time)}
                        className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold
                          bg-red-600/80 hover:bg-red-600 text-white transition-all">
                        ▶
                      </button>
                    )}
                    <span className="absolute bottom-2 left-3 font-mono text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-gray-300">{item.time}</span>
                  </div>
                )}
                <div className="flex items-start gap-2.5 px-3 py-2.5">
                  <span className="text-lg leading-none shrink-0 mt-0.5">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    {!hasPhoto && <span className="font-mono text-[9px] text-gray-600 mr-1.5">{item.time}</span>}
                    <span className="text-xs text-gray-200 leading-relaxed">{item.text}</span>
                    {item.players?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.players.map(p => {
                          const pl = DATABASE.roster.find(r => r.name === p);
                          return (
                            <span key={p} className="flex items-center gap-1 text-[9px] bg-black/30 border border-white/8 rounded-full px-1.5 py-0.5 text-gray-500">
                              {pl?.photo && <img src={`${BASE}${pl.photo}`} alt={p} className="w-3 h-3 rounded-full object-cover object-top"/>}
                              {p.split(' ')[0]}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {!hasPhoto && item.jumpUrl && (
                    <button onClick={() => onJump(item.time)}
                      className="shrink-0 w-6 h-6 rounded-full bg-red-600/8 border border-red-500/10
                        flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all">
                      <svg width="7" height="7" viewBox="0 0 8 8" fill="currentColor" className="text-red-400"><polygon points="1,0 8,4 1,8"/></svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Component principal ───────────────────────────────────────────
export default function MatchDetail({ match, onBack }) {
  const [videoStart, setVideoStart] = useState(0);
  const hasSubstitutions = (match.events.substitutions || []).length > 1;
  const matchStats = useMemo(() => {
    if (!hasSubstitutions) return null;
    return calcMatchStats(match);
  }, [match, hasSubstitutions]);

  const [home, away] = match.result.split('-').map(s => parseInt(s.trim()));
  const resultColor = home > away ? 'text-emerald-400' : home < away ? 'text-[#C0392B]' : 'text-yellow-400';
  const hasYoutube = !!match.youtubeId;
  const hasVimeo   = !!match.vimeoId;
  const hasVideo   = hasYoutube || hasVimeo;
  const cronica = useMemo(() => buildCronica(match), [match]);

  const jumpToGoal = (timeStr) => {
    if (!hasVideo) return;
    const secs = Math.max(0, parseTime(timeStr) - 3);
    setVideoStart(secs);
    document.getElementById('match-video')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <button onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-[#E5C07B] transition-colors text-sm font-medium">
        <ChevronLeft className="w-4 h-4"/> Tornar
      </button>

      {/* Capçalera */}
      <div className="bg-[#1E1E1E] rounded-xl p-5 md:p-6 border border-[#E5C07B]/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-[#E5C07B] text-xs font-semibold mb-1 uppercase tracking-wider">{match.jornada} · {match.date}</div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
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
        <div id="match-video" className="bg-black rounded-xl overflow-hidden border border-white/5">
          <div className="aspect-video w-full">
            {hasYoutube && (
              <iframe width="100%" height="100%"
                src={`https://www.youtube.com/embed/${match.youtubeId}?rel=0&start=${videoStart}&autoplay=${videoStart>0?1:0}`}
                title={`${DATABASE.teamName} vs ${match.opponent}`}
                frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
            )}
            {hasVimeo && (
              <iframe width="100%" height="100%"
                src={`https://player.vimeo.com/video/${match.vimeoId}?badge=0&autopause=0`}
                title={`${DATABASE.teamName} vs ${match.opponent}`}
                frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen/>
            )}
          </div>
        </div>
      )}

      {/* Layout: crònica + gràfic */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5 items-start">
        {/* Crònica vertical */}
        {cronica.length > 0 && (
          <CronicaVertical cronica={cronica} match={match} onJump={jumpToGoal}/>
        )}

        {/* Gràfic de temps */}
        {hasSubstitutions && (
          <div className="xl:sticky xl:top-20">
            <TimelineChart match={match} matchStats={matchStats} onJump={jumpToGoal}/>
          </div>
        )}
      </div>
    </div>
  );
}
