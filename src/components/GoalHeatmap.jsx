import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { DATABASE } from '../data.js';

const ACCENT = '#E5C07B';

const PLAYER_COLORS = {
  'Arnau Sentis': '#E5C07B', 'Roger Miro':   '#61AFEF',
  'Oriol Tomas':  '#98C379', 'Paco Montero': '#E06C75',
  'Andreu Cases': '#C678DD', 'Pau Ibañez':   '#56B6C2',
  'Joan Medina':  '#D19A66', 'Roi Seoane':   '#BE5046',
  'Ivan Mico':    '#ABB2BF', 'Marc Farreras':'#4EC9B0',
  'Chengzhi Li':  '#F0A500',
};

function jitter(goals) {
  const THRESH = 18;
  const result = goals.map(g => ({...g, _sx:g.shotPos?.x, _sy:g.shotPos?.y, _gx:g.goalPos?.x, _gy:g.goalPos?.y}));
  const offsets = [[0,0],[14,-10],[-14,10],[10,16],[-10,-16],[18,0],[-18,0],[0,18],[0,-18]];
  result.forEach((g,i) => {
    if (!g.shotPos) return;
    let gi = 0;
    for (let j=0;j<i;j++) {
      if (!result[j].shotPos) continue;
      const dx=result[j]._sx-g.shotPos.x, dy=result[j]._sy-g.shotPos.y;
      if (Math.sqrt(dx*dx+dy*dy)<THRESH) gi++;
    }
    if (gi>0) { const o=offsets[gi%offsets.length]; g._sx=g.shotPos.x+o[0]; g._sy=g.shotPos.y+o[1]; }
  });
  result.forEach((g,i) => {
    if (!g.goalPos) return;
    let gi = 0;
    for (let j=0;j<i;j++) {
      if (!result[j].goalPos) continue;
      const dx=result[j]._gx-g.goalPos.x, dy=result[j]._gy-g.goalPos.y;
      if (Math.sqrt(dx*dx+dy*dy)<THRESH) gi++;
    }
    if (gi>0) { const o=offsets[gi%offsets.length]; g._gx=g.goalPos.x+o[0]; g._gy=g.goalPos.y+o[1]; }
  });
  return result;
}

function getVideoUrl(goal) {
  const match = DATABASE.matches.find(m => m.id === goal.matchId);
  if (!match) return null;
  const [min, sec] = (goal.time||'0:0').split(':').map(Number);
  const secs = Math.max(0, (min*60+(sec||0))-5);
  if (match.vimeoId)   return `https://vimeo.com/${match.vimeoId}#t=${secs}s`;
  if (match.youtubeId) return `https://www.youtube.com/watch?v=${match.youtubeId}&t=${secs}s`;
  return null;
}

function getDorsal(name) {
  return DATABASE.roster.find(r=>r.name===name)?.number ?? null;
}
function getShirt(name) {
  return DATABASE.roster.find(r=>r.name===name)?.shirtName || name?.split(' ')[0] || '?';
}

// ── Pilota animada que recorre el trajecte ────────────────────────
function useBallAnimation(goal) {
  const [ballPos, setBallPos] = useState(null);
  const [phase, setPhase] = useState('idle'); // idle | assist | conduct | shot | done
  const rafRef = useRef(null);

  const animate = useCallback(() => {
    if (!goal?._sx) return;
    const A = goal.assistPos;
    const C = goal.conductPos;
    const S = { x: goal._sx, y: goal._sy };

    // Seqüència de segments
    const segments = [];
    if (A && C) { segments.push({from:A,to:C,dur:500,phase:'assist'}); segments.push({from:C,to:S,dur:400,phase:'conduct'}); }
    else if (A)  { segments.push({from:A,to:S,dur:600,phase:'assist'}); }
    else if (C)  { segments.push({from:C,to:S,dur:400,phase:'conduct'}); }
    if (segments.length === 0) { setBallPos({...S,glow:true}); setPhase('done'); return; }

    let segIdx = 0;
    let startTime = null;

    const tick = (ts) => {
      if (!startTime) startTime = ts;
      const seg = segments[segIdx];
      if (!seg) { setBallPos({...S,glow:true}); setPhase('done'); return; }
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / seg.dur, 1);
      const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t; // easeInOut
      const x = seg.from.x + (seg.to.x - seg.from.x) * ease;
      const y = seg.from.y + (seg.to.y - seg.from.y) * ease;
      setBallPos({x, y, glow: false});
      setPhase(seg.phase);
      if (t >= 1) { segIdx++; startTime = null; }
      rafRef.current = requestAnimationFrame(tick);
    };

    // Delay petit abans de començar
    setTimeout(() => { rafRef.current = requestAnimationFrame(tick); }, 200);
  }, [goal]);

  useEffect(() => {
    setBallPos(null); setPhase('idle');
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (goal) animate();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [goal, animate]);

  return { ballPos, phase };
}

// ── Camp SVG ──────────────────────────────────────────────────────
function PitchSVG({ goals, activeGoal, setActiveGoal }) {
  const activeGoalData = activeGoal !== null ? goals[activeGoal] : null;
  const { ballPos, phase } = useBallAnimation(activeGoalData);

  return (
    <svg viewBox="0 0 800 420" style={{width:'100%',display:'block'}}>
      <defs>
        <style>{`
          @keyframes goalPop {
            0%   { opacity:0; transform:scale(0.3); }
            65%  { transform:scale(1.2); }
            100% { opacity:1; transform:scale(1); }
          }
          @keyframes trailFade {
            from { opacity:0.6; }
            to   { opacity:0; }
          }
          @keyframes ballGlow {
            0%,100% { filter: drop-shadow(0 0 4px #E5C07B); }
            50%      { filter: drop-shadow(0 0 10px #E5C07B); }
          }
          @keyframes ripple {
            0%   { r:8;  opacity:0.6; }
            100% { r:28; opacity:0;   }
          }
        `}</style>
        <filter id="softglow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <radialGradient id="ballgrad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#fff"/>
          <stop offset="60%" stopColor="#e0e0e0"/>
          <stop offset="100%" stopColor="#aaa"/>
        </radialGradient>
      </defs>

      {/* Gespa */}
      <rect width="800" height="420" fill="#1c3d1c"/>
      {[0,1,2,3,4,5,6].map(i=>(
        <rect key={i} x="0" y={i*60} width="800" height="60" fill={i%2===0?'rgba(0,0,0,0.06)':'transparent'}/>
      ))}
      {/* Línies */}
      <rect x="18" y="18" width="764" height="384" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
      <line x1="400" y1="18" x2="400" y2="402" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
      <circle cx="400" cy="210" r="185" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
      <circle cx="400" cy="210" r="4" fill="rgba(255,255,255,0.85)"/>
      {/* Àrea esquerra */}
      <path d="M 18,80 A 70,70 0 0,1 88,150 L 88,270 A 70,70 0 0,1 18,340" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
      <line x1="88" y1="150" x2="88" y2="270" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
      <rect x="3" y="185" width="15" height="50" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" rx="1"/>
      {/* Àrea dreta */}
      <path d="M 782,80 A 70,70 0 0,0 712,150 L 712,270 A 70,70 0 0,0 782,340" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
      <line x1="712" y1="150" x2="712" y2="270" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
      <rect x="782" y="185" width="15" height="50" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" rx="1"/>

      {/* Gols inactius — punts discrets */}
      {goals.map((g, idx) => {
        if (!g._sx || idx === activeGoal) return null;
        const color = PLAYER_COLORS[g.scorer] || ACCENT;
        const dorsal = getDorsal(g.scorer);
        return (
          <g key={idx} onClick={() => setActiveGoal(idx === activeGoal ? null : idx)}
            style={{cursor:'pointer'}}>
            {/* Traces molt fines i discretes */}
            {g.assistPos && (
              <line x1={g.assistPos.x} y1={g.assistPos.y} x2={g._sx} y2={g._sy}
                stroke={color} strokeWidth="0.8" strokeDasharray="3,4" opacity="0.18"/>
            )}
            {g.conductPos && (
              <line x1={g.conductPos.x} y1={g.conductPos.y} x2={g._sx} y2={g._sy}
                stroke={color} strokeWidth="0.8" strokeDasharray="2,3" opacity="0.18"/>
            )}
            {/* Punt de tir */}
            <circle cx={g._sx} cy={g._sy} r="7" fill={color} opacity="0.7"
              stroke="rgba(0,0,0,0.3)" strokeWidth="1"
              style={{transformOrigin:`${g._sx}px ${g._sy}px`,
                animation:`goalPop 0.4s cubic-bezier(0.34,1.56,0.64,1) ${idx*0.08}s both`}}/>
            <text x={g._sx} y={g._sy} textAnchor="middle" dominantBaseline="middle"
              fontSize={dorsal!==null&&dorsal>=10?'4.5':'5.5'} fontWeight="bold"
              fill="rgba(0,0,0,0.8)" style={{pointerEvents:'none'}}>
              {dorsal??'?'}
            </text>
          </g>
        );
      })}

      {/* Gol actiu — trajecte complet + pilota */}
      {activeGoal !== null && goals[activeGoal] && (() => {
        const g = goals[activeGoal];
        if (!g._sx) return null;
        const color = PLAYER_COLORS[g.scorer] || ACCENT;
        const A = g.assistPos, C = g.conductPos;
        const S = {x:g._sx, y:g._sy};

        // Calcul longitud del path per animació strokeDasharray
        const pathLen = (from, to) => Math.sqrt((to.x-from.x)**2+(to.y-from.y)**2);

        return (
          <g>
            {/* Halo de focus */}
            <circle cx={S.x} cy={S.y} r="30" fill={color} opacity="0.06"/>
            <circle cx={S.x} cy={S.y} r="30" fill="none" stroke={color} strokeWidth="1" opacity="0.15"/>

            {/* Línia assist — fina, no aparatosa */}
            {A && (
              <>
                <line x1={A.x} y1={A.y} x2={C?C.x:S.x} y2={C?C.y:S.y}
                  stroke="#61AFEF" strokeWidth="1.5" opacity="0.5"
                  strokeDasharray={`${pathLen(A,C||S)} ${pathLen(A,C||S)}`}
                  strokeDashoffset="0"
                  style={{strokeDashoffset:0, transition:'stroke-dashoffset 0.5s ease'}}/>
                {/* Punt origen assist */}
                <circle cx={A.x} cy={A.y} r="4" fill="#61AFEF" opacity="0.6"/>
              </>
            )}

            {/* Línia conducció — color jugador, molt fina */}
            {C && (
              <>
                <line x1={C.x} y1={C.y} x2={S.x} y2={S.y}
                  stroke={color} strokeWidth="1.5" opacity="0.5"
                  strokeDasharray="4,3"/>
                <rect x={C.x-3} y={C.y-3} width="6" height="6" rx="1"
                  fill={color} opacity="0.6" transform={`rotate(45,${C.x},${C.y})`}/>
              </>
            )}

            {/* Punt de tir — gran, color jugador */}
            <circle cx={S.x} cy={S.y} r="12" fill={color}
              stroke="white" strokeWidth="1.5" opacity="0.95"
              style={{filter:`drop-shadow(0 0 6px ${color}60)`}}/>
            <text x={S.x} y={S.y} textAnchor="middle" dominantBaseline="middle"
              fontSize={getDorsal(g.scorer)!==null&&getDorsal(g.scorer)>=10?'6.5':'7.5'}
              fontWeight="bold" fill="rgba(0,0,0,0.9)" style={{pointerEvents:'none'}}>
              {getDorsal(g.scorer)??'?'}
            </text>

            {/* Ripple al punt de tir */}
            <circle cx={S.x} cy={S.y} r="8" fill="none" stroke={color} strokeWidth="1.5"
              style={{animation:'ripple 1s ease-out infinite'}} opacity="0.4"/>

            {/* PILOTA ANIMADA */}
            {ballPos && (
              <g style={{filter: ballPos.glow ? `drop-shadow(0 0 8px ${color})` : 'none'}}>
                {/* Ombra */}
                <ellipse cx={ballPos.x+2} cy={ballPos.y+3} rx="5" ry="3" fill="rgba(0,0,0,0.3)"/>
                {/* Pilota */}
                <circle cx={ballPos.x} cy={ballPos.y} r="6.5" fill="url(#ballgrad)"
                  stroke="rgba(0,0,0,0.4)" strokeWidth="0.8"/>
                {/* Costures */}
                <path d={`M${ballPos.x-3},${ballPos.y-2} Q${ballPos.x},${ballPos.y-4} ${ballPos.x+3},${ballPos.y-2}`}
                  fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="0.7"/>
                <path d={`M${ballPos.x-3},${ballPos.y+2} Q${ballPos.x},${ballPos.y+4} ${ballPos.x+3},${ballPos.y+2}`}
                  fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="0.7"/>
              </g>
            )}
          </g>
        );
      })()}
    </svg>
  );
}

// ── Porteria SVG ──────────────────────────────────────────────────
const GROUND_Y = 185;
function GoalSVG({ goals, activeGoal, setActiveGoal }) {
  return (
    <svg viewBox="-18 -18 336 230" style={{width:'100%',display:'block'}}>
      <rect x="-18" y="200" width="336" height="12" fill="#1c3d1c"/>
      <rect x="0" y="0" width="300" height="200" fill="#0d0d0d"/>
      <rect x="0" y="0" width="300" height="60" fill="rgba(255,255,255,0.01)"/>
      {/* 3D profunditat */}
      <line x1="0"   y1="0"   x2="-13" y2="-13" stroke="#555" strokeWidth="1.8"/>
      <line x1="300" y1="0"   x2="313" y2="-13" stroke="#555" strokeWidth="1.8"/>
      <line x1="0"   y1="200" x2="-13" y2="187" stroke="#444" strokeWidth="1.4"/>
      <line x1="300" y1="200" x2="313" y2="187" stroke="#444" strokeWidth="1.4"/>
      <line x1="-13" y1="-13" x2="313" y2="-13" stroke="#555" strokeWidth="1.5"/>
      <line x1="-13" y1="-13" x2="-13" y2="187" stroke="#444" strokeWidth="1"/>
      <line x1="313" y1="-13" x2="313" y2="187" stroke="#444" strokeWidth="1"/>
      {/* Xarxa fina */}
      {[40,80,120,160,200,240].map(x=>(
        <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
      ))}
      {[50,100,150].map(y=>(
        <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
      ))}

      {goals.map((g, idx) => {
        if (!g._gx) return null;
        const isActive = activeGoal === idx;
        const isGround = g._gy >= GROUND_Y;
        const dorsal = getDorsal(g.scorer);
        const color = PLAYER_COLORS[g.scorer] || ACCENT;

        return (
          <g key={idx} onClick={() => setActiveGoal(isActive?null:idx)} style={{cursor:'pointer'}}>
            {isActive && <>
              <circle cx={g._gx} cy={g._gy} r="24" fill={color} opacity="0.12"/>
              <circle cx={g._gx} cy={g._gy} r="24" fill="none" stroke={color} strokeWidth="1" opacity="0.2"
                style={{animation:'ripple 1.2s ease-out infinite'}}/>
            </>}
            <circle cx={g._gx} cy={g._gy}
              r={isActive?13:9}
              fill={isActive ? color : 'rgba(255,255,255,0.85)'}
              stroke={isActive ? 'white' : 'rgba(0,0,0,0.2)'}
              strokeWidth={isActive?1.5:1}
              style={{
                transformOrigin:`${g._gx}px ${g._gy}px`,
                animation:`goalPop 0.45s cubic-bezier(0.34,1.56,0.64,1) ${idx*0.1+0.15}s both`,
                filter: isActive ? `drop-shadow(0 0 6px ${color}80)` : 'none',
              }}/>
            <text x={g._gx} y={g._gy+(isGround?-1:0)}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={dorsal!==null&&dorsal>=10?(isActive?7:5.5):(isActive?8:6.5)}
              fontWeight="bold"
              fill={isActive?'rgba(0,0,0,0.9)':'#111'}
              style={{pointerEvents:'none',
                animation:`goalPop 0.45s cubic-bezier(0.34,1.56,0.64,1) ${idx*0.1+0.15}s both`}}>
              {dorsal??'?'}
            </text>
          </g>
        );
      })}
      {/* Pals */}
      <rect x="-9" y="-8" width="11" height="210" rx="3" fill="#e8e8e8"/>
      <rect x="298" y="-8" width="11" height="210" rx="3" fill="#e8e8e8"/>
      <rect x="-9" y="-8" width="318" height="11" rx="3" fill="#e8e8e8"/>
    </svg>
  );
}

// ── Targeta info gol ──────────────────────────────────────────────
function GoalCard({ goal, idx, onClose }) {
  if (!goal) return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center mb-3 opacity-30">
        <span style={{fontSize:18}}>⚽</span>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">Clica un gol<br/>per veure el detall</p>
    </div>
  );

  const videoUrl = getVideoUrl(goal);
  const dorsal = getDorsal(goal.scorer);
  const color = PLAYER_COLORS[goal.scorer] || ACCENT;

  return (
    <div className="p-5 space-y-4 animate-fade-in">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl border-2 flex-shrink-0"
            style={{borderColor:`${color}50`, background:`${color}15`}}>
            <span style={{fontSize:8, color, fontWeight:'bold', lineHeight:1}}>#</span>
            <span style={{fontSize:15, color, fontWeight:900, lineHeight:1}}>{dorsal??'?'}</span>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{goal.jornada} · {goal.opponent}</p>
            <p className="text-white font-bold text-base leading-tight">min {goal.time}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all flex items-center justify-center flex-shrink-0">×</button>
      </div>

      <div className="h-px bg-white/5"/>

      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:color}}/>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Gol</span>
          <span className="text-white font-bold text-sm">{getShirt(goal.scorer)}</span>
        </div>
        {goal.assist && (
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0 bg-[#61AFEF]"/>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Assist</span>
            <span className="text-gray-300 font-medium text-sm">{getShirt(goal.assist)}</span>
          </div>
        )}
        {goal.notes && (
          <p className="text-gray-600 text-xs italic leading-relaxed pl-4">{goal.notes}</p>
        )}
      </div>

      {(videoUrl || goal.goalPos) && <div className="h-px bg-white/5"/>}

      {videoUrl && (
        <a href={videoUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border transition-all hover:opacity-80"
          style={{borderColor:`${color}30`, background:`${color}10`, color}}>
          <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="2,1 11,6 2,11" fill="currentColor"/></svg>
          <span className="text-xs font-semibold">Veure vídeo</span>
        </a>
      )}

      {goal.goalPos && (
        <div>
          <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">On entra</p>
          <svg viewBox="-8 -8 316 216" style={{width:'100%',maxWidth:200}}>
            <rect x="0" y="0" width="300" height="200" fill="#0a0a0a"/>
            <line x1="0" y1="0" x2="-10" y2="-10" stroke="#555" strokeWidth="1.5"/>
            <line x1="300" y1="0" x2="310" y2="-10" stroke="#555" strokeWidth="1.5"/>
            <line x1="-10" y1="-10" x2="310" y2="-10" stroke="#555" strokeWidth="1"/>
            <circle cx={goal.goalPos.x} cy={goal.goalPos.y} r="18" fill={color} opacity="0.2"/>
            <circle cx={goal.goalPos.x} cy={goal.goalPos.y} r="9" fill={color} stroke="white" strokeWidth="1.5" opacity="0.97"/>
            <rect x="-7" y="-7" width="9" height="209" rx="2" fill="#ddd"/>
            <rect x="298" y="-7" width="9" height="209" rx="2" fill="#ddd"/>
            <rect x="-7" y="-7" width="314" height="9" rx="2" fill="#ddd"/>
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Component principal ───────────────────────────────────────────
export default function GoalHeatmap() {
  const [matchFilter,  setMatchFilter]  = useState('all');
  const [playerFilter, setPlayerFilter] = useState('all');
  const [activeGoal,   setActiveGoal]   = useState(null);
  const [autoPlay,     setAutoPlay]     = useState(false);
  const autoRef = useRef(null);

  const allGoals = useMemo(() => {
    const goals = [];
    DATABASE.matches.forEach(match => {
      (match.events?.goals||[]).forEach(g => {
        if (g.type==='favor') goals.push({...g, matchId:match.id, jornada:match.jornada, opponent:match.opponent});
      });
    });
    return goals;
  }, []);

  const scorers = [...new Set(allGoals.map(g=>g.scorer).filter(Boolean))];

  const filtered = useMemo(() => jitter(allGoals.filter(g => {
    if (matchFilter!=='all' && g.matchId!==matchFilter) return false;
    if (playerFilter!=='all' && g.scorer!==playerFilter) return false;
    return true;
  })), [allGoals, matchFilter, playerFilter]);

  // AutoPlay: passa automàticament per tots els gols
  useEffect(() => {
    if (!autoPlay || filtered.length === 0) {
      if (autoRef.current) clearTimeout(autoRef.current);
      return;
    }
    const next = () => {
      setActiveGoal(prev => {
        const nextIdx = prev === null ? 0 : (prev + 1) % filtered.length;
        return nextIdx;
      });
      autoRef.current = setTimeout(next, 2200);
    };
    setActiveGoal(0);
    autoRef.current = setTimeout(next, 2200);
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [autoPlay, filtered]);

  const activeGoalData = activeGoal !== null ? filtered[activeGoal] : null;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-3xl font-black text-white mb-1">Mapa de Gols</h2>
          <p className="text-gray-500 text-sm">{filtered.length} gols a favor</p>
        </div>
        {/* Botó autoplay */}
        <button onClick={() => { setAutoPlay(p=>!p); if (autoPlay) setActiveGoal(null); }}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
            autoPlay ? 'bg-[#E5C07B]/15 border-[#E5C07B]/40 text-[#E5C07B]' : 'border-white/10 text-gray-500 hover:text-white'
          }`}>
          <span style={{fontSize:12}}>{autoPlay ? '⏸' : '▶'}</span>
          {autoPlay ? 'Pausar' : 'Reproduir tots'}
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5 w-fit flex-wrap">
        <button onClick={() => { setMatchFilter('all'); setActiveGoal(null); setAutoPlay(false); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${matchFilter==='all'?'bg-[#E5C07B]/15 text-[#E5C07B]':'text-gray-500 hover:text-white'}`}>
          Tots
        </button>
        {DATABASE.matches.map(m => (
          <button key={m.id} onClick={() => { setMatchFilter(m.id); setActiveGoal(null); setAutoPlay(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${matchFilter===m.id?'bg-[#E5C07B]/15 text-[#E5C07B]':'text-gray-500 hover:text-white'}`}>
            {m.jornada}
          </button>
        ))}
      </div>

      {/* Filtres jugador */}
      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => { setPlayerFilter('all'); setActiveGoal(null); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${playerFilter==='all'?'bg-white/10 border-white/30 text-white':'border-white/10 text-gray-500 hover:text-white'}`}>
          Tots
        </button>
        {scorers.map(name => (
          <button key={name} onClick={() => { setPlayerFilter(name===playerFilter?'all':name); setActiveGoal(null); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all`}
            style={{
              background: playerFilter===name ? `${PLAYER_COLORS[name]||ACCENT}20` : 'transparent',
              borderColor: playerFilter===name ? `${PLAYER_COLORS[name]||ACCENT}50` : 'rgba(255,255,255,0.1)',
              color: playerFilter===name ? (PLAYER_COLORS[name]||ACCENT) : 'rgba(255,255,255,0.4)',
            }}>
            {name.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_210px] gap-3 items-start">
        <div className="space-y-3 min-w-0">
          <div className="bg-[#0f1a0f] rounded-2xl border border-white/5 p-3 overflow-hidden">
            <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider font-bold">Camp · zona de tir</p>
            <PitchSVG goals={filtered} activeGoal={activeGoal} setActiveGoal={(i) => { setAutoPlay(false); setActiveGoal(i); }}/>
          </div>
          <div className="bg-[#0d0d0d] rounded-2xl border border-white/5 p-3 overflow-hidden">
            <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider font-bold">Porteria rival · on entra</p>
            <GoalSVG goals={filtered} activeGoal={activeGoal} setActiveGoal={(i) => { setAutoPlay(false); setActiveGoal(i); }}/>
          </div>
        </div>

        <div className={`bg-[#1a1a1a] rounded-2xl border border-white/5 lg:sticky lg:top-4 lg:min-h-[240px] ${activeGoalData?'block':'hidden lg:block'}`}>
          <GoalCard goal={activeGoalData} idx={activeGoal} onClose={() => { setActiveGoal(null); setAutoPlay(false); }}/>
        </div>
      </div>

      {!activeGoalData && (
        <p className="text-center text-xs text-gray-700 lg:hidden">Toca un punt al camp per veure el detall</p>
      )}

      {/* Llegenda minimalista */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-600 pt-1">
        <span className="flex items-center gap-1.5">
          <svg width="8" height="8"><circle cx="4" cy="4" r="4" fill="#61AFEF" opacity="0.7"/></svg>Assist
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="8" height="8"><rect x="0" y="0" width="8" height="8" rx="1" fill="#E5C07B" opacity="0.7" transform="rotate(45,4,4)"/></svg>Conducció
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="8" height="8"><circle cx="4" cy="4" r="4" fill="rgba(255,255,255,0.7)"/></svg>Tir (dorsal)
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="14" height="8"><circle cx="7" cy="4" r="3.5" fill="url(#ballgrad)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/></svg>Pilota animada
        </span>
      </div>
    </div>
  );
}
