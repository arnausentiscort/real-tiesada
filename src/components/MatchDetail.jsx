import React, { useMemo, useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Star, XCircle, AlertCircle } from 'lucide-react';
import { DATABASE } from '../data.js';
import { parseTime, formatTime, calcMatchStats } from '../utils.js';
import MvpVoting from './MvpVoting.jsx';

const BASE = import.meta.env.BASE_URL;

// ── Marcador animat ───────────────────────────────────────────────
function AnimatedScore({ home, away, resultColor }) {
  const [displayHome, setDisplayHome] = useState(0);
  const [displayAway, setDisplayAway] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayHome(0);
    setDisplayAway(0);
    setDone(false);
    if (home === 0 && away === 0) { setDone(true); return; }
    let h = 0, a = 0;
    const interval = setInterval(() => {
      if (h < home && (h <= a || a >= away)) h++;
      else if (a < away) a++;
      else { h = home; a = away; }
      setDisplayHome(h);
      setDisplayAway(a);
      if (h >= home && a >= away) { clearInterval(interval); setDone(true); }
    }, 350);
    return () => clearInterval(interval);
  }, [home, away]);

  return (
    <div className={`relative text-4xl md:text-5xl font-black font-mono bg-[#121212] px-5 py-3 rounded-xl border border-white/5 ${resultColor}`}
      style={{minWidth:140, textAlign:'center'}}>
      {displayHome}
      <span className="mx-2 opacity-40">-</span>
      {displayAway}
      {!done && <div className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#E5C07B] animate-pulse"/>}
    </div>
  );
}

// ── Nom de dorsal ─────────────────────────────────────────────────
function shirtName(fullName) {
  const p = DATABASE.roster.find(r => r.name === fullName);
  return p?.shirtName || fullName.split(' ')[0].toUpperCase();
}

// ── Emoji automàtic ───────────────────────────────────────────────
function pickEmoji(text) {
  const t = text.toLowerCase();
  if (t.includes('atura') || t.includes('parad') || t.includes('para ') || t.includes('vola') || t.includes('santo') || t.includes('paradon') || t.includes('miracle')) return '🧤';
  if (t.includes('tombarella') || t.includes('cau a terra') || t.includes('bacall') || t.includes('reixa') || t.includes('pedra')) return '🎬';
  if (t.includes('regal') || t.includes('embolic') || t.includes('perd') || t.includes('destrossa') || t.includes('botiga') || t.includes('prohibit')) return '💥';
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

// ── Targeta gran de gol ───────────────────────────────────────────
function GoalCard({ item, onJump }) {
  const isFavor = item.kind === 'goal_favor';
  const accent  = isFavor ? '#27AE60' : '#C0392B';
  const bg      = isFavor ? 'rgba(39,174,96,0.08)' : 'rgba(192,57,43,0.08)';
  const border  = isFavor ? 'rgba(39,174,96,0.3)'  : 'rgba(192,57,43,0.3)';
  return (
    <div className="relative rounded-2xl overflow-hidden border" style={{background:bg, borderColor:border}}>
      <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{background:accent}}/>
      <div className="pl-5 pr-4 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs bg-black/30 px-2 py-1 rounded-lg border border-white/10 text-gray-300">{item.time}</span>
            <span className="font-black font-mono text-2xl" style={{color:accent}}>{item.score}</span>
            <span className="text-sm font-bold uppercase tracking-wider" style={{color:accent}}>
              {isFavor ? '⚽ GOL A FAVOR' : '❌ EN CONTRA'}
            </span>
          </div>
          {item.jumpUrl && (
            <button onClick={() => onJump(item.time)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all
                bg-red-600/15 border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white">
              ▶ Veure
            </button>
          )}
        </div>
        {isFavor ? (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-white font-black text-xl">{shirtName(item.scorer)}</span>
            {item.assist && <span className="text-gray-400 text-sm">· assist: <span className="text-gray-200">{shirtName(item.assist)}</span></span>}
          </div>
        ) : (
          item.notes && <p className="mt-1.5 text-sm text-gray-400 italic">{item.notes}</p>
        )}
      </div>
    </div>
  );
}

// ── Targeta moment ────────────────────────────────────────────────
function MomentCard({ item, onJump }) {
  const [hovered, setHovered] = useState(false);
  const hasPhoto = !!item.photo;
  return (
    <div className="group rounded-xl border border-white/6 bg-[#1c1c1c] hover:border-white/15 hover:bg-[#222] transition-all overflow-hidden">
      {hasPhoto && (
        <div className="relative overflow-hidden cursor-pointer" style={{aspectRatio:'16/9'}}
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
          <img src={`${BASE}${hovered && item.photoHover ? item.photoHover : item.photo}`}
            alt={item.text} className="w-full h-full object-cover transition-all duration-400"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
          {item.photoHover && (
            <div className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full border font-bold transition-all
              ${hovered ? 'bg-[#E5C07B]/20 border-[#E5C07B]/40 text-[#E5C07B]' : 'bg-black/50 border-white/20 text-white/50'}`}>
              {hovered ? '▶ acció' : '🎬'}
            </div>
          )}
          {item.jumpUrl && (
            <button onClick={() => onJump(item.time)}
              className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold
                bg-red-600/80 hover:bg-red-600 text-white transition-all">
              ▶ Vídeo
            </button>
          )}
          <span className="absolute bottom-3 left-3 font-mono text-[10px] bg-black/60 px-2 py-0.5 rounded text-gray-300">{item.time}</span>
        </div>
      )}
      <div className="flex items-start gap-3 px-4 py-3">
        <span className="text-xl leading-none shrink-0 mt-0.5">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          {!hasPhoto && <span className="font-mono text-[10px] text-gray-600 mr-2">{item.time}</span>}
          <span className="text-sm text-gray-200 leading-relaxed">{item.text}</span>
          {item.players?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.players.map(p => {
                const pl = DATABASE.roster.find(r => r.name === p);
                return (
                  <span key={p} className="flex items-center gap-1 text-[10px] bg-black/30 border border-white/8 rounded-full px-2 py-0.5 text-gray-400">
                    {pl?.photo && <img src={`${BASE}${pl.photo}`} alt={p} className="w-3 h-3 rounded-full object-cover object-top"/>}
                    {shirtName(p)}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        {!hasPhoto && item.jumpUrl && (
          <button onClick={() => onJump(item.time)}
            className="shrink-0 w-7 h-7 rounded-full bg-red-600/10 border border-red-500/15
              flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className="text-red-400"><polygon points="1,0 8,4 1,8"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Gràfic de temps ───────────────────────────────────────────────
function TimelineChart({ match, matchStats }) {
  if (!matchStats) return null;
  const { stints, playerStats, finalTime } = matchStats;

  const subs = match.events.substitutions || [];

  // Stints de porter
  const goalkeeperStints = {};
  if (subs.length > 1) {
    let prevGK = subs[0].goalkeeper || null;
    let prevT  = parseTime(subs[0].time);
    subs.forEach(sub => {
      const ts = parseTime(sub.time);
      if (sub.goalkeeper !== undefined && sub.goalkeeper !== prevGK) {
        if (prevGK) {
          if (!goalkeeperStints[prevGK]) goalkeeperStints[prevGK] = [];
          goalkeeperStints[prevGK].push({ start: prevT, end: ts });
        }
        prevGK = sub.goalkeeper; prevT = ts;
      }
    });
    if (prevGK) {
      if (!goalkeeperStints[prevGK]) goalkeeperStints[prevGK] = [];
      goalkeeperStints[prevGK].push({ start: prevT, end: finalTime });
    }
  }

  // Pauses (onPitch buit)
  const pauses = [];
  for (let i = 0; i < subs.length - 1; i++) {
    if ((subs[i].onPitch||[]).length === 0) {
      pauses.push({ start: parseTime(subs[i].time), end: parseTime(subs[i+1].time) });
    }
  }

  // Tots els jugadors: camp + porter — ordenats per minuts de CAMP (no porter)
  const campSecs = (name) => stints.filter(s=>s.player===name).reduce((a,s)=>a+(s.end-s.start),0);
  const gkSecs   = (name) => (goalkeeperStints[name]||[]).reduce((a,s)=>a+(s.end-s.start),0);

  const allPlayers = [...new Set([
    ...playerStats.map(p => p.player),
    ...Object.keys(goalkeeperStints),
  ])];
  // Ordenar per minuts de CAMP (porters purs al final)
  allPlayers.sort((a,b) => campSecs(b) - campSecs(a));

  const idealSecs = match.idealMinutesPerPlayer * 60;
  const pct = (s) => `${(s/finalTime*100).toFixed(2)}%`;
  const w   = (s,e) => `${((e-s)/finalTime*100).toFixed(2)}%`;

  // Ticks
  const ticks = [];
  for (let m=5; m<=Math.floor(finalTime/60); m+=5) ticks.push(m);

  // Gols
  const goals = (match.events?.goals||[]).sort((a,b)=>parseTime(a.time)-parseTime(b.time));

  return (
    <div className="space-y-5">
      {/* Gantt */}
      <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-5 overflow-x-auto">
        <h3 className="text-sm font-bold text-[#E5C07B] mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4"/> Línia de Temps
        </h3>
        <div style={{minWidth:560}}>
          {/* Ticks */}
          <div className="flex mb-2">
            <div style={{width:88}} className="shrink-0"/>
            <div className="flex-1 relative h-4">
              {ticks.map(m => (
                <div key={m} className="absolute flex flex-col items-center -translate-x-1/2" style={{left:pct(m*60)}}>
                  <div className="w-px h-2 bg-white/15"/>
                  <span className="text-[9px] text-gray-600">{m}'</span>
                </div>
              ))}
            </div>
            <div style={{width:48}} className="shrink-0"/>
          </div>

          {/* Fila gols */}
          <div className="flex items-center mb-2">
            <div style={{width:88}} className="text-[9px] text-gray-600 text-right pr-2 shrink-0">Gols</div>
            <div className="flex-1 relative" style={{height:20}}>
              {pauses.map((p,i) => (
                <div key={i} className="absolute inset-y-0 bg-white/4 border-x border-white/8"
                  style={{left:pct(p.start), width:w(p.start,p.end)}}/>
              ))}
              <div className="absolute inset-y-0 border-l border-dashed border-[#E5C07B]/30" style={{left:pct(idealSecs)}}/>
              {goals.map((g,i) => (
                <div key={i} className="absolute inset-y-0 flex flex-col items-center group cursor-pointer"
                  style={{left:pct(parseTime(g.time)), transform:'translateX(-50%)', zIndex:10}}>
                  <div className="flex-1 w-px" style={{background:g.type==='favor'?'rgba(39,174,96,0.6)':'rgba(192,57,43,0.6)'}}/>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] border"
                    style={{background:g.type==='favor'?'rgba(39,174,96,0.2)':'rgba(192,57,43,0.2)',
                      borderColor:g.type==='favor'?'rgba(39,174,96,0.7)':'rgba(192,57,43,0.7)'}}>
                    {g.type==='favor'?'⚽':'❌'}
                  </div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#0a0a0a] border border-white/15 rounded-lg px-2 py-1
                    text-[9px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-20">
                    <span style={{color:g.type==='favor'?'#4ade80':'#f87171'}}>{g.time}</span>
                    {g.scorer && <span className="text-gray-400 ml-1">{shirtName(g.scorer)}</span>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{width:48}} className="shrink-0"/>
          </div>

          {/* Files jugadors */}
          {allPlayers.map(name => {
            const cSecs = campSecs(name);
            const gSecs = gkSecs(name);
            const campS = stints.filter(s=>s.player===name);
            const gkS   = goalkeeperStints[name] || [];
            // Porter stints tallats per pauses
            const gkSplitted = [];
            gkS.forEach(gs => {
              let cur = gs.start;
              [...pauses, {start:Infinity,end:Infinity}].sort((a,b)=>a.start-b.start).forEach(pause => {
                if (pause.start > cur && pause.start < gs.end) {
                  gkSplitted.push({start:cur, end:Math.min(pause.start, gs.end)});
                  cur = pause.end;
                }
              });
              if (cur < gs.end) gkSplitted.push({start:cur, end:gs.end});
            });
            const pl = DATABASE.roster.find(p=>p.name===name);
            const dev = cSecs - idealSecs;

            return (
              <div key={name} className="flex items-center mb-1.5 group">
                <div style={{width:88}} className="shrink-0 flex items-center justify-end gap-1.5 pr-2">
                  {pl?.photo ? (
                    <div className="w-5 h-5 rounded-full overflow-hidden border border-white/15 shrink-0">
                      <img src={`${BASE}${pl.photo}`} alt={name} className="w-full h-full object-cover object-top"/>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#C0392B]/15 border border-white/10 flex items-center justify-center shrink-0">
                      <span className="text-[7px] font-black text-[#E5C07B]/50">{name[0]}</span>
                    </div>
                  )}
                  <span className="text-[10px] text-gray-500 group-hover:text-white transition-colors truncate font-semibold" style={{maxWidth:56}}>
                    {pl?.shirtName || name.split(' ')[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 relative" style={{height:22}}>
                  {pauses.map((p,i) => (
                    <div key={i} className="absolute inset-y-0 bg-white/4 border-x border-white/8"
                      style={{left:pct(p.start), width:w(p.start,p.end)}}/>
                  ))}
                  <div className="absolute inset-y-0 border-l border-dashed border-[#E5C07B]/20" style={{left:pct(idealSecs)}}/>
                  {campS.map((s,i) => (
                    <div key={`c${i}`} className="absolute rounded border border-[#E5C07B]/10 hover:border-[#E5C07B]/40 transition-all"
                      style={{left:pct(s.start), width:w(s.start,s.end), top:2, bottom:2,
                        background:'linear-gradient(90deg,#7b1c12,#C0392B)'}}/>
                  ))}
                  {gkSplitted.map((s,i) => (
                    <div key={`g${i}`} className="absolute rounded border border-emerald-500/20 hover:border-emerald-500/50 transition-all"
                      style={{left:pct(s.start), width:w(s.start,s.end), top:2, bottom:2,
                        background:'linear-gradient(90deg,#1a4a1a,#27AE60)'}}/>
                  ))}
                  {goals.map((g,i) => (
                    <div key={i} className="absolute inset-y-0 w-px pointer-events-none"
                      style={{left:pct(parseTime(g.time)), background:g.type==='favor'?'rgba(39,174,96,0.2)':'rgba(192,57,43,0.2)'}}/>
                  ))}
                </div>
                <div style={{width:48}} className="shrink-0 text-right pl-1">
                  <div className="text-[10px] font-mono font-bold text-white">{formatTime(cSecs)}</div>
                  {gSecs > 0 && <div className="text-[9px] font-mono text-emerald-400">+{formatTime(gSecs)}</div>}
                  <div className="text-[9px] font-mono" style={{color:dev>120?'#C0392B':dev<-120?'#4A5568':'#E5C07B'}}>
                    {dev>=0?'+':''}{formatTime(Math.abs(dev))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Llegenda */}
          <div className="flex gap-4 mt-3 pt-3 border-t border-white/5 text-[9px] text-gray-600">
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded inline-block" style={{background:'linear-gradient(90deg,#1a4a1a,#27AE60)'}}/>Porter</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded inline-block" style={{background:'linear-gradient(90deg,#7b1c12,#C0392B)'}}/>Camp</span>
            <span className="flex items-center gap-1"><span className="inline-block w-4 border-t border-dashed border-[#E5C07B]/50"/>Ideal ({match.idealMinutesPerPlayer} min)</span>
          </div>
        </div>
      </div>

      {/* Barres minuts — ordenades per minuts de camp */}
      <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#E5C07B] flex items-center gap-2">
            <Clock className="w-4 h-4"/> Minuts per Jugador
          </h3>
          <span className="text-xs bg-[#121212] px-2 py-1 rounded text-gray-500 border border-white/5">
            Ideal: {match.idealMinutesPerPlayer} min
          </span>
        </div>
        <div className="flex gap-3 mb-3 text-[10px] text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded inline-block bg-[#C0392B]"/>Camp</span>
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded inline-block bg-emerald-500"/>Porter</span>
          <span className="flex items-center gap-1"><span className="inline-block w-4 border-t border-dashed border-[#E5C07B]/50"/>Ideal</span>
        </div>
        <div className="space-y-2.5">
          {allPlayers.map(name => {
            const cSecs  = campSecs(name);
            const gSecs  = gkSecs(name);
            const dev    = cSecs - idealSecs;
            const pl     = DATABASE.roster.find(p=>p.name===name);
            const campW  = (cSecs / finalTime) * 100;
            const gkW    = (gSecs / finalTime) * 100;
            const idealW = (idealSecs / finalTime) * 100;
            return (
              <div key={name} className="flex items-center gap-2 group">
                {pl?.photo ? (
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0">
                    <img src={`${BASE}${pl.photo}`} alt={name} className="w-full h-full object-cover object-top"/>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#C0392B]/15 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="text-[8px] font-black text-[#E5C07B]/50">{name[0]}</span>
                  </div>
                )}
                <span className="w-20 text-xs text-right truncate text-gray-500 group-hover:text-white transition-colors shrink-0 font-semibold">
                  {pl?.shirtName || name.split(' ')[0].toUpperCase()}
                </span>
                <div className="flex-1 flex flex-col gap-0.5 relative">
                  {cSecs > 0 && (
                    <div className="h-2.5 bg-[#121212] rounded overflow-hidden border border-white/5 relative">
                      <div className="h-full bg-[#C0392B] rounded transition-all duration-700" style={{width:`${Math.max(campW,1)}%`}}/>
                      <div className="absolute top-0 bottom-0 w-px bg-white/30" style={{left:`${idealW}%`}}/>
                    </div>
                  )}
                  {gSecs > 0 && (
                    <div className="h-2.5 bg-[#121212] rounded overflow-hidden border border-white/5 relative">
                      <div className="h-full bg-emerald-500 rounded transition-all duration-700" style={{width:`${Math.max(gkW,1)}%`}}/>
                      <div className="absolute top-0 bottom-0 w-px bg-white/20" style={{left:`${idealW}%`}}/>
                    </div>
                  )}
                </div>
                <div className="w-20 text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-white">{formatTime(cSecs)}</div>
                  {gSecs > 0 && <div className="text-[9px] font-mono text-emerald-400">+{formatTime(gSecs)} 🧤</div>}
                  <div className="text-[9px] font-mono" style={{color:dev>120?'#C0392B':dev<-120?'#4A5568':'#E5C07B'}}>
                    {dev>=0?'+':''}{formatTime(Math.abs(dev))}
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

// ── Component principal ───────────────────────────────────────────
export default function MatchDetail({ match, onBack, onNavigate }) {
  const [videoStart, setVideoStart] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null); // 'left' | 'right'
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const allMatches = DATABASE.matches;
  const currentIdx = allMatches.findIndex(m => m.id === match.id);
  const prevMatch = currentIdx > 0 ? allMatches[currentIdx - 1] : null;
  const nextMatch = currentIdx < allMatches.length - 1 ? allMatches[currentIdx + 1] : null;

  const hasSubstitutions = (match.events.substitutions||[]).length > 1;
  const matchStats = useMemo(() => {
    if (!hasSubstitutions) return null;
    return calcMatchStats(match);
  }, [match, hasSubstitutions]);

  const [home, away] = match.result.split('-').map(s => parseInt(s.trim()));
  const resultColor = home > away ? 'text-emerald-400' : home < away ? 'text-[#C0392B]' : 'text-yellow-400';
  const hasVideo = !!(match.youtubeId || match.vimeoId);
  const cronica  = useMemo(() => buildCronica(match), [match]);

  // Swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 60 && dy < 80) {
      if (dx < 0 && nextMatch && onNavigate) { setSwipeDir('left');  setTimeout(() => { onNavigate(nextMatch); setSwipeDir(null); }, 200); }
      if (dx > 0 && prevMatch && onNavigate) { setSwipeDir('right'); setTimeout(() => { onNavigate(prevMatch); setSwipeDir(null); }, 200); }
    }
    touchStartX.current = null;
  };

  const jumpToGoal = (timeStr) => {
    if (!hasVideo) return;
    const secs = Math.max(0, parseTime(timeStr) - 3);
    setVideoStart(secs);
    document.getElementById('match-video')?.scrollIntoView({ behavior:'smooth', block:'start' });
  };

  return (
    <div className="space-y-6 animate-fade-in"
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
      style={{
        transform: swipeDir === 'left' ? 'translateX(-30px)' : swipeDir === 'right' ? 'translateX(30px)' : 'translateX(0)',
        opacity: swipeDir ? 0 : 1,
        transition: 'transform 0.2s ease, opacity 0.2s ease'
      }}>

      {/* Navegació entre jornades */}
      <div className="flex items-center justify-between gap-3">
        <button onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-[#E5C07B] transition-colors text-sm font-medium">
          <ChevronLeft className="w-4 h-4"/> Tornar
        </button>

        {/* Swipe entre jornades */}
        <div className="flex items-center gap-1">
          <button
            disabled={!prevMatch}
            onClick={() => onNavigate && onNavigate(prevMatch)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-20 disabled:cursor-default"
            style={{background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.5)'}}>
            <ChevronLeft className="w-3.5 h-3.5"/>
            {prevMatch ? prevMatch.jornada.replace('Jornada ','J') : '—'}
          </button>

          <div className="flex gap-1">
            {allMatches.map((m, i) => (
              <button key={m.id}
                onClick={() => onNavigate && onNavigate(m)}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  background: m.id === match.id ? '#E5C07B' : 'rgba(255,255,255,0.15)',
                  transform: m.id === match.id ? 'scale(1.3)' : 'scale(1)',
                }}/>
            ))}
          </div>

          <button
            disabled={!nextMatch}
            onClick={() => onNavigate && onNavigate(nextMatch)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-20 disabled:cursor-default"
            style={{background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.5)'}}>
            {nextMatch ? nextMatch.jornada.replace('Jornada ','J') : '—'}
            <ChevronRight className="w-3.5 h-3.5"/>
          </button>
        </div>
      </div>

      {/* Capçalera amb marcador animat */}
      <div className="bg-[#1E1E1E] rounded-xl p-5 md:p-7 border border-[#E5C07B]/20 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-[#E5C07B] text-xs font-semibold mb-1 uppercase tracking-wider">{match.jornada} · {match.date}</div>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              <span className="text-[#C0392B]">{DATABASE.teamName}</span>
              <span className="mx-3 text-gray-600 font-light">vs</span>
              <span>{match.opponent}</span>
            </h2>
          </div>
          {/* Marcador animat */}
          <AnimatedScore home={home} away={away} resultColor={resultColor}/>
        </div>
      </div>

      {/* MVP Voting — prominent, just sota el marcador */}
      <div className="border border-[#E5C07B]/20 rounded-2xl shadow-lg shadow-[#E5C07B]/5">
        <MvpVoting match={match} />
      </div>

      {/* Vídeo */}
      {hasVideo && (
        <div id="match-video" className="bg-black rounded-xl overflow-hidden border border-white/5 shadow-xl">
          <div className="aspect-video w-full">
            {match.youtubeId && (
              <iframe width="100%" height="100%"
                src={`https://www.youtube.com/embed/${match.youtubeId}?rel=0&start=${videoStart}&autoplay=${videoStart>0?1:0}`}
                title={`${DATABASE.teamName} vs ${match.opponent}`}
                frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
            )}
            {match.vimeoId && (
              <iframe width="100%" height="100%"
                src={`https://player.vimeo.com/video/${match.vimeoId}?badge=0&autopause=0`}
                title={`${DATABASE.teamName} vs ${match.opponent}`}
                frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen/>
            )}
          </div>
        </div>
      )}

      {/* Crònica — scroll natural de la pàgina, gran */}
      {cronica.length > 0 && (
        <div className="bg-[#1A1A1A] rounded-2xl border border-white/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <span className="text-base">📋</span>
            <h3 className="text-base font-bold text-[#E5C07B]">Crònica del Partit</h3>
            <span className="text-xs text-gray-600 ml-auto">{cronica.length} moments</span>
          </div>
          <div className="p-4 space-y-3">
            {cronica.map((item, idx) => {
              if (item.kind === 'goal_favor' || item.kind === 'goal_contra')
                return <GoalCard key={idx} item={item} onJump={jumpToGoal}/>;
              return <MomentCard key={idx} item={item} onJump={jumpToGoal}/>;
            })}
          </div>
        </div>
      )}

      {/* Gràfics de temps */}
      {(hasSubstitutions || match.id === 'j4-touchlas') && (
        <TimelineChart match={match} matchStats={matchStats}/>
      )}

      {/* Sense substitucions */}
      {!hasSubstitutions && match.id !== 'j4-touchlas' && (
        <div className="bg-[#1E1E1E] rounded-xl p-5 border border-white/5 flex items-center justify-center">
          <div className="text-center text-gray-600">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40"/>
            <p className="text-sm">Sense dades de substitucions</p>
          </div>
        </div>
      )}
    </div>
  );
}
