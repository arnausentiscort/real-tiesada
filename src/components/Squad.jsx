import React, { useState, useMemo } from 'react';
import { DATABASE } from '../data.js';
import { calcGlobalStats, calcGoalkeeperStints, formatTime } from '../utils.js';

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

// ── Configuració visual per posició ──────────────────────────────
const POS_CONFIG = {
  'Porter':      { gradient: 'from-amber-900 via-yellow-800 to-amber-950', accent: '#F59E0B', badge: 'GK', emoji: '🧤' },
  'Defensa':     { gradient: 'from-blue-900 via-blue-800 to-blue-950',    accent: '#3B82F6', badge: 'DEF', emoji: '🛡️' },
  'Migcampista': { gradient: 'from-emerald-900 via-green-800 to-emerald-950', accent: '#10B981', badge: 'MIG', emoji: '⚙️' },
  'Davanter':    { gradient: 'from-red-900 via-rose-800 to-red-950',      accent: '#EF4444', badge: 'DAV', emoji: '⚽' },
};

// ── Calcula rating 0-99 ───────────────────────────────────────────
function calcRating(player, stats) {
  const isGK = player.position === 'Porter';
  const goals    = stats.topScorers.find(([n])=>n===player.name)?.[1] || 0;
  const assists  = stats.topAssists.find(([n])=>n===player.name)?.[1] || 0;
  const minSecs  = stats.totalMinutes.find(([n])=>n===player.name)?.[1] || 0;
  const conceded = stats.goalsConceded.find(([n])=>n===player.name)?.[1] || 0;
  const saves    = stats.saves.find(([n])=>n===player.name)?.[1] || 0;
  const gf       = stats.goalsFor.find(([n])=>n===player.name)?.[1] || 0;
  const ga       = stats.goalsAgainst.find(([n])=>n===player.name)?.[1] || 0;
  const mins     = minSecs / 60;

  let base = 60;
  if (isGK) {
    base += Math.min(saves * 4, 20);
    base -= Math.min(conceded * 1.5, 15);
    base += Math.min(mins / 10, 8);
  } else {
    base += Math.min(goals * 6, 18);
    base += Math.min(assists * 4, 12);
    base += Math.min(gf * 0.8, 8);
    base -= Math.min(ga * 0.5, 8);
    base += Math.min(mins / 10, 6);
  }
  return Math.min(99, Math.max(50, Math.round(base)));
}

// ── Color del rating ──────────────────────────────────────────────
function ratingColor(r) {
  if (r >= 85) return '#FFD700';
  if (r >= 75) return '#C0C0C0';
  if (r >= 65) return '#CD7F32';
  return '#9CA3AF';
}

// ── Mini barres de stats ──────────────────────────────────────────
function StatBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-bold w-6 text-right shrink-0" style={{color: 'rgba(255,255,255,0.4)'}}>{label}</span>
      <div className="flex-1 h-1.5 rounded-full" style={{background:'rgba(255,255,255,0.08)'}}>
        <div className="h-full rounded-full transition-all duration-700" style={{width:`${pct}%`, background: color}}/>
      </div>
      <span className="text-[9px] font-black w-4 shrink-0" style={{color:'rgba(255,255,255,0.7)'}}>{value}</span>
    </div>
  );
}

// ── Targeta carta ─────────────────────────────────────────────────
function PlayerCard({ player, stats, onClick }) {
  const [flipped, setFlipped] = useState(false);
  const pos = POS_CONFIG[player.position] || POS_CONFIG['Migcampista'];
  const rating = useMemo(() => calcRating(player, stats), [player, stats]);
  const rColor = ratingColor(rating);
  const goals    = stats.topScorers.find(([n])=>n===player.name)?.[1] || 0;
  const assists  = stats.topAssists.find(([n])=>n===player.name)?.[1] || 0;
  const minSecs  = stats.totalMinutes.find(([n])=>n===player.name)?.[1] || 0;
  const gf       = stats.goalsFor.find(([n])=>n===player.name)?.[1] || 0;
  const ga       = stats.goalsAgainst.find(([n])=>n===player.name)?.[1] || 0;
  const conceded = stats.goalsConceded.find(([n])=>n===player.name)?.[1] || 0;
  const saves    = stats.saves.find(([n])=>n===player.name)?.[1] || 0;
  const isGK     = player.position === 'Porter';

  // Max per barres (globals de tota la plantilla)
  const maxGoals   = Math.max(...DATABASE.roster.map(p => stats.topScorers.find(([n])=>n===p.name)?.[1]||0), 1);
  const maxAssists = Math.max(...DATABASE.roster.map(p => stats.topAssists.find(([n])=>n===p.name)?.[1]||0), 1);
  const maxGF      = Math.max(...DATABASE.roster.map(p => stats.goalsFor.find(([n])=>n===p.name)?.[1]||0), 1);
  const maxGA      = Math.max(...DATABASE.roster.map(p => stats.goalsAgainst.find(([n])=>n===p.name)?.[1]||0), 1);
  const maxMin     = Math.max(...DATABASE.roster.map(p => stats.totalMinutes.find(([n])=>n===p.name)?.[1]||0), 1);

  return (
    <div className="relative cursor-pointer select-none group"
      style={{perspective: '1000px', aspectRatio: '2/3'}}
      onClick={() => setFlipped(f => !f)}>

      {/* Contenidor flip */}
      <div className="absolute inset-0 transition-transform duration-500"
        style={{transformStyle:'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}}>

        {/* ── CARA FRONTAL ── */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
          style={{backfaceVisibility:'hidden', background: '#0a0a0a',
            boxShadow: flipped ? 'none' : `0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08)`}}>

          {/* Gradient de posició al fons */}
          <div className={`absolute inset-0 bg-gradient-to-b ${pos.gradient} opacity-40`}/>

          {/* Textura subtil */}
          <div className="absolute inset-0 opacity-5"
            style={{backgroundImage:'radial-gradient(circle at 50% 0%, white 1px, transparent 1px)', backgroundSize:'20px 20px'}}/>

          {/* Foto */}
          {player.photo ? (
            <img src={`${BASE}${player.photo}`} alt={player.name}
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"/>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl mb-2 opacity-20">{pos.emoji}</div>
              <div className="text-4xl font-black" style={{color:'rgba(255,255,255,0.08)'}}>{player.number}</div>
            </div>
          )}

          {/* Gradient baix */}
          <div className="absolute bottom-0 left-0 right-0" style={{
            height:'65%',
            background:'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.8) 40%, transparent 100%)'
          }}/>

          {/* Rating top-left */}
          <div className="absolute top-3 left-3 flex flex-col items-center">
            <div className="text-2xl font-black leading-none" style={{color: rColor, textShadow:`0 0 20px ${rColor}60`}}>
              {rating}
            </div>
            <div className="text-[8px] font-bold mt-0.5" style={{color: pos.accent}}>{pos.badge}</div>
          </div>

          {/* Número top-right */}
          <div className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
            style={{background:'rgba(0,0,0,0.6)', color:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.1)'}}>
            {player.number}
          </div>

          {/* Info baix */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="text-base font-black tracking-wider leading-none mb-0.5 truncate" style={{color: pos.accent}}>
              {player.shirtName || player.name.toUpperCase()}
            </div>
            <div className="text-[10px] font-medium mb-3 truncate" style={{color:'rgba(255,255,255,0.35)'}}>
              {player.name}
            </div>

            {/* Stats horitzontals */}
            <div className="grid grid-cols-3 gap-0 border-t" style={{borderColor:'rgba(255,255,255,0.07)'}}>
              {isGK ? [
                {v: saves||0, l:'PAR'},
                {v: conceded||0, l:'GC'},
                {v: `${Math.floor(minSecs/60)}'`, l:'MIN'},
              ] : [
                {v: goals, l:'GOL'},
                {v: assists, l:'ASS'},
                {v: `${Math.floor(minSecs/60)}'`, l:'MIN'},
              ].map(({v,l},i) => (
                <div key={l} className="flex flex-col items-center py-1.5" style={{
                  borderRight: i<2 ? '1px solid rgba(255,255,255,0.07)' : 'none'
                }}>
                  <span className="text-sm font-black leading-none" style={{color:'rgba(255,255,255,0.9)'}}>{v}</span>
                  <span className="text-[8px] mt-0.5 font-bold" style={{color:'rgba(255,255,255,0.3)'}}>{l}</span>
                </div>
              ))}
              {isGK && [{v: saves||0, l:'PAR'},{v: conceded||0, l:'GC'},{v: `${Math.floor(minSecs/60)}'`, l:'MIN'}].map(({v,l},i) => (
                <div key={l} className="flex flex-col items-center py-1.5" style={{
                  borderRight: i<2 ? '1px solid rgba(255,255,255,0.07)' : 'none'
                }}>
                  <span className="text-sm font-black leading-none" style={{color:'rgba(255,255,255,0.9)'}}>{v}</span>
                  <span className="text-[8px] mt-0.5 font-bold" style={{color:'rgba(255,255,255,0.3)'}}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hint de gir */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{background:'rgba(0,0,0,0.7)', color:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.1)'}}>
              ↻ girar
            </div>
          </div>
        </div>

        {/* ── CARA POSTERIOR ── */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col"
          style={{backfaceVisibility:'hidden', transform:'rotateY(180deg)',
            background:'#0f0f0f',
            boxShadow:'0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)'}}>

          {/* Franja de color posició */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{background: pos.accent}}/>

          {/* Capçalera */}
          <div className="flex items-start justify-between mb-3 mt-1">
            <div>
              <div className="text-sm font-black truncate" style={{color: pos.accent}}>{player.shirtName}</div>
              <div className="text-[9px]" style={{color:'rgba(255,255,255,0.3)'}}>{player.position}</div>
            </div>
            <div className="text-3xl font-black" style={{color:'rgba(255,255,255,0.06)'}}>{player.number}</div>
          </div>

          {/* Rating gran */}
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{background:'rgba(255,255,255,0.04)'}}>
            <div className="text-4xl font-black" style={{color: rColor, textShadow:`0 0 30px ${rColor}50`}}>{rating}</div>
            <div>
              <div className="text-[9px] font-bold" style={{color:'rgba(255,255,255,0.4)'}}>RATING</div>
              <div className="flex gap-0.5 mt-1">
                {[...Array(5)].map((_,i) => (
                  <div key={i} className="w-4 h-1 rounded-full" style={{
                    background: i < Math.ceil(((rating-50)/49)*5) ? rColor : 'rgba(255,255,255,0.1)'
                  }}/>
                ))}
              </div>
            </div>
          </div>

          {/* Barres stats */}
          <div className="space-y-2 flex-1">
            {isGK ? <>
              <StatBar label="PAR" value={saves||0}   max={10}    color="#10B981"/>
              <StatBar label="GC"  value={conceded||0} max={15}   color="#EF4444"/>
              <StatBar label="MIN" value={Math.floor(minSecs/60)} max={Math.floor(maxMin/60)} color={pos.accent}/>
            </> : <>
              <StatBar label="GOL" value={goals}   max={maxGoals}   color="#F59E0B"/>
              <StatBar label="ASS" value={assists} max={maxAssists} color="#61AFEF"/>
              <StatBar label="GF"  value={gf}      max={maxGF}      color="#10B981"/>
              <StatBar label="GC"  value={ga}      max={maxGA}      color="#EF4444"/>
              <StatBar label="MIN" value={Math.floor(minSecs/60)} max={Math.floor(maxMin/60)} color={pos.accent}/>
            </>}
          </div>

          {/* Botó veure perfil */}
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="mt-3 w-full py-2 rounded-xl text-xs font-black tracking-wider transition-all hover:opacity-80"
            style={{background: pos.accent, color:'#000'}}>
            VEURE PERFIL →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Perfil complet (modal) ────────────────────────────────────────
function PlayerProfile({ player, stats, onClose }) {
  const pos = POS_CONFIG[player.position] || POS_CONFIG['Migcampista'];
  const isGK = player.position === 'Porter';
  const rating = calcRating(player, stats);
  const rColor = ratingColor(rating);

  const goals    = stats.topScorers.find(([n])=>n===player.name)?.[1] || 0;
  const assists  = stats.topAssists.find(([n])=>n===player.name)?.[1] || 0;
  const minSecs  = stats.totalMinutes.find(([n])=>n===player.name)?.[1] || 0;
  const conceded = stats.goalsConceded.find(([n])=>n===player.name)?.[1] || 0;
  const saves    = stats.saves.find(([n])=>n===player.name)?.[1] || 0;
  const gf       = stats.goalsFor.find(([n])=>n===player.name)?.[1] || 0;
  const ga       = stats.goalsAgainst.find(([n])=>n===player.name)?.[1] || 0;

  const scoredGoals = DATABASE.matches.flatMap(m =>
    (m.events?.goals||[]).filter(g=>g.type==='favor'&&g.scorer===player.name)
    .map(g=>({...g, matchId:m.id, jornada:m.jornada, opponent:m.opponent}))
  );
  const assistedGoals = DATABASE.matches.flatMap(m =>
    (m.events?.goals||[]).filter(g=>g.type==='favor'&&g.assist===player.name)
    .map(g=>({...g, matchId:m.id, jornada:m.jornada, opponent:m.opponent}))
  );

  // Minuts per jornada
  const minutesByMatch = DATABASE.matches.map(match => {
    const { totals } = (() => {
      // Importem calcMatchStats inline
      const subs = match.events.substitutions || [];
      if (match.fieldMinutes) return { totals: Object.fromEntries(Object.entries(match.fieldMinutes).map(([p,m])=>[p,m*60])) };
      if (subs.length < 2) return { totals: {} };
      let active = {}, totals = {};
      const gk = (sub) => sub.goalkeeper || null;
      subs.forEach(sub => {
        const ts = sub.time.split(':').map(Number).reduce((a,v,i)=>i===0?a+v*60:a+v, 0);
        const field = (sub.onPitch||[]).filter(p=>p!==gk(sub));
        Object.keys(active).forEach(p => {
          if (!field.includes(p)) { totals[p]=(totals[p]||0)+(ts-active[p]); delete active[p]; }
        });
        field.forEach(p => { if (active[p]===undefined) active[p]=ts; });
      });
      return { totals };
    })();
    const gkStints = calcGoalkeeperStints(match);
    const campSecs = totals[player.name] || 0;
    const gkSecs = (gkStints[player.name]||[]).reduce((a,s)=>a+(s.end-s.start),0);
    return { match, campSecs, gkSecs };
  }).filter(r => r.campSecs > 0 || r.gkSecs > 0);

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{background:'rgba(0,0,0,0.9)'}} onClick={onClose}>
      <div className="w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{background:'#0f0f0f', border:'1px solid rgba(255,255,255,0.07)', maxHeight:'94vh', overflowY:'auto'}}
        onClick={e=>e.stopPropagation()}>

        {/* Hero */}
        <div className="relative h-64 sm:h-72 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-b ${pos.gradient} opacity-60`}/>
          {player.photo
            ? <img src={`${BASE}${player.photo}`} alt={player.name} className="absolute inset-0 w-full h-full object-cover object-top"/>
            : <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-9xl font-black" style={{color:'rgba(255,255,255,0.04)'}}>{player.number}</div>
              </div>
          }
          <div className="absolute inset-0" style={{background:'linear-gradient(to top, #0f0f0f 0%, rgba(15,15,15,0.5) 50%, transparent 100%)'}}/>

          {/* Rating badge */}
          <div className="absolute top-4 left-4 flex flex-col items-center px-3 py-2 rounded-2xl"
            style={{background:'rgba(0,0,0,0.7)', border:`1px solid ${rColor}40`, backdropFilter:'blur(10px)'}}>
            <span className="text-3xl font-black leading-none" style={{color:rColor}}>{rating}</span>
            <span className="text-[8px] font-bold mt-0.5" style={{color:pos.accent}}>{pos.badge}</span>
          </div>

          {/* Tancar */}
          <button onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/20"
            style={{background:'rgba(0,0,0,0.6)'}}>✕</button>

          {/* Info */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{color:pos.accent}}>{player.position}</div>
              <div className="text-3xl font-black leading-none" style={{color:'white'}}>{player.shirtName}</div>
              <div className="text-sm mt-0.5" style={{color:'rgba(255,255,255,0.45)'}}>{player.name}</div>
            </div>
            <div className="text-6xl font-black" style={{color:'rgba(255,255,255,0.08)'}}>#{player.number}</div>
          </div>
        </div>

        {/* Cos */}
        <div className="p-5 space-y-5">

          {/* Stats principals */}
          <div className="grid grid-cols-4 gap-2">
            {(isGK ? [
              {v:saves||0, l:'Aturades', c:'#10B981'},
              {v:conceded||0, l:'Gols encaixats', c:'#EF4444'},
              {v:`${Math.floor(minSecs/60)}'`, l:'Minuts', c:pos.accent},
              {v:gf, l:'A favor (camp)', c:'#61AFEF'},
            ] : [
              {v:goals, l:'Gols', c:'#F59E0B'},
              {v:assists, l:'Assists', c:'#61AFEF'},
              {v:`${Math.floor(minSecs/60)}'`, l:'Minuts', c:pos.accent},
              {v:gf, l:'A favor', c:'#10B981'},
            ]).map(({v,l,c}) => (
              <div key={l} className="rounded-xl p-3 text-center" style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.06)'}}>
                <div className="text-xl font-black" style={{color:c}}>{v}</div>
                <div className="text-[9px] mt-0.5 leading-tight" style={{color:'rgba(255,255,255,0.35)'}}>{l}</div>
              </div>
            ))}
          </div>

          {/* Minuts per jornada */}
          {minutesByMatch.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold mb-3">Minuts jugats</p>
              <div className="space-y-2">
                {minutesByMatch.map(({match, campSecs, gkSecs}) => {
                  const maxSecs = 41*60;
                  const campW = (campSecs/maxSecs)*100;
                  const gkW   = (gkSecs/maxSecs)*100;
                  return (
                    <div key={match.id} className="flex items-center gap-3">
                      <span className="text-[10px] font-bold w-20 shrink-0" style={{color:'rgba(255,255,255,0.4)'}}>{match.jornada.replace('Jornada ','J')}</span>
                      <div className="flex-1 flex flex-col gap-0.5">
                        {campSecs>0 && <div className="h-2 rounded-full" style={{background:'rgba(255,255,255,0.06)'}}>
                          <div className="h-full rounded-full bg-[#C0392B]" style={{width:`${campW}%`}}/>
                        </div>}
                        {gkSecs>0 && <div className="h-2 rounded-full" style={{background:'rgba(255,255,255,0.06)'}}>
                          <div className="h-full rounded-full bg-emerald-500" style={{width:`${gkW}%`}}/>
                        </div>}
                      </div>
                      <span className="text-[10px] font-mono w-12 text-right shrink-0" style={{color:'rgba(255,255,255,0.5)'}}>
                        {formatTime(campSecs+gkSecs)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-2 text-[9px]" style={{color:'rgba(255,255,255,0.3)'}}>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#C0392B] inline-block"/>Camp</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/>Porter</span>
              </div>
            </div>
          )}

          {/* Gols */}
          {scoredGoals.length > 0 && (
            <div>
              <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold mb-2">⚽ Gols marcats</p>
              <div className="space-y-1.5">
                {scoredGoals.map((g,i) => {
                  const vidUrl = getVideoUrl(g.matchId, g.time);
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                      style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.05)'}}>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:'#F59E0B'}}/>
                      <div className="flex-1 min-w-0">
                        <span className="text-white text-sm font-semibold">min {g.time}</span>
                        <span className="text-gray-600 text-xs ml-2">{g.jornada} vs {g.opponent}</span>
                        {g.assist && <span className="text-gray-600 text-xs block">assist: {g.assist}</span>}
                        {g.notes && <span className="text-gray-700 text-xs block italic">{g.notes}</span>}
                      </div>
                      {vidUrl && (
                        <a href={vidUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold shrink-0 transition-all hover:opacity-70"
                          style={{background:'rgba(245,158,11,0.15)', color:'#F59E0B', border:'1px solid rgba(245,158,11,0.25)'}}>
                          ▶ Veure
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
              <p className="text-[10px] text-gray-600 uppercase tracking-wider font-semibold mb-2">👟 Assistències</p>
              <div className="space-y-1.5">
                {assistedGoals.map((g,i) => {
                  const vidUrl = getVideoUrl(g.matchId, g.time);
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                      style={{background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.05)'}}>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-gray-500"/>
                      <div className="flex-1 min-w-0">
                        <span className="text-white text-sm font-semibold">min {g.time}</span>
                        <span className="text-gray-600 text-xs ml-2">{g.jornada} vs {g.opponent}</span>
                        <span className="text-gray-600 text-xs block">gol: {g.scorer}</span>
                      </div>
                      {vidUrl && (
                        <a href={vidUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold shrink-0"
                          style={{background:'rgba(97,175,239,0.1)', color:'#61AFEF', border:'1px solid rgba(97,175,239,0.2)'}}>
                          ▶ Veure
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {scoredGoals.length===0 && assistedGoals.length===0 && (
            <p className="text-gray-700 text-sm text-center py-4">Sense gols ni assists registrats</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Component principal ───────────────────────────────────────────
export default function Squad() {
  const stats   = useMemo(() => calcGlobalStats(DATABASE), []);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState('all');

  const sorted = useMemo(() => {
    const r = [...DATABASE.roster].sort((a,b) => a.number - b.number);
    if (filter === 'all') return r;
    return r.filter(p => p.position === filter);
  }, [filter]);

  const positions = [...new Set(DATABASE.roster.map(p=>p.position))];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-black text-white mb-1">La Plantilla</h2>
        <p className="text-gray-500 text-sm">{DATABASE.roster.length} jugadors · Clica una carta per girar-la · Doble clic per veure el perfil complet</p>
      </div>

      {/* Filtre per posició */}
      <div className="flex gap-1.5 mb-6 flex-wrap">
        {['all', ...positions].map(pos => {
          const cfg = POS_CONFIG[pos];
          return (
            <button key={pos} onClick={() => setFilter(pos)}
              className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
              style={{
                background: filter===pos ? (cfg?.accent||'rgba(255,255,255,0.15)') : 'transparent',
                color: filter===pos ? '#000' : 'rgba(255,255,255,0.4)',
                borderColor: filter===pos ? (cfg?.accent||'rgba(255,255,255,0.3)') : 'rgba(255,255,255,0.1)',
              }}>
              {pos==='all' ? 'Tots' : `${cfg?.emoji||''} ${pos}`}
            </button>
          );
        })}
      </div>

      {/* Grid cartes */}
      <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {sorted.map(player => (
          <PlayerCard key={player.name} player={player} stats={stats}
            onClick={() => setSelected(player)}/>
        ))}
      </div>

      {/* Mòbil carousel */}
      <div className="sm:hidden">
        <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{scrollbarWidth:'none', msOverflowStyle:'none'}}>
          {sorted.map(player => (
            <div key={player.name} className="snap-start shrink-0" style={{width:'72vw', maxWidth:'240px'}}>
              <PlayerCard player={player} stats={stats}
                onClick={() => setSelected(player)}/>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-700 mt-1">← Llisca · Toca per girar · Botó per veure perfil</p>
      </div>

      {/* Modal perfil */}
      {selected && (
        <PlayerProfile player={selected} stats={stats} onClose={() => setSelected(null)}/>
      )}
    </div>
  );
}
