import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { DATABASE } from '../data.js';

const ACCENT = '#E5C07B';
const BASE = import.meta.env.BASE_URL;

const PLAYER_COLORS = {
  'Arnau Sentis': '#E5C07B', 'Roger Miro':   '#61AFEF',
  'Oriol Tomas':  '#98C379', 'Paco Montero': '#E06C75',
  'Andreu Cases': '#C678DD', 'Pau Ibañez':   '#56B6C2',
  'Joan Medina':  '#D19A66', 'Roi Seoane':   '#BE5046',
  'Ivan Mico':    '#ABB2BF', 'Marc Farreras':'#4EC9B0',
  'Chengzhi Li':  '#F0A500',
};

// ── Bezier helpers ────────────────────────────────────────────────
function bezierCP(from, to, kick = 28) {
  return {
    x: (from.x + to.x) / 2,
    y: (from.y + to.y) / 2 - kick,
  };
}
function bezierAt(t, p0, cp, p1) {
  const mt = 1 - t;
  return {
    x: mt*mt*p0.x + 2*mt*t*cp.x + t*t*p1.x,
    y: mt*mt*p0.y + 2*mt*t*cp.y + t*t*p1.y,
  };
}
function bezierPathD(p0, cp, p1) {
  return `M${p0.x},${p0.y} Q${cp.x},${cp.y} ${p1.x},${p1.y}`;
}

// ── Jitter ────────────────────────────────────────────────────────
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
  const secs = Math.max(0, min*60+(sec||0)-5);
  if (match.vimeoId)   return `https://vimeo.com/${match.vimeoId}#t=${secs}s`;
  if (match.youtubeId) return `https://www.youtube.com/watch?v=${match.youtubeId}&t=${secs}s`;
  return null;
}
const getDorsal = (name) => DATABASE.roster.find(r=>r.name===name)?.number ?? null;
const getShirt  = (name) => DATABASE.roster.find(r=>r.name===name)?.shirtName || name?.split(' ')[0] || '?';

// ── Hook: pilota amb bezier, trail, spin i fase 2 cap a porteria ──
function useBallAnimation(goal) {
  const [ballPos,    setBallPos]    = useState(null);
  const [trail,      setTrail]      = useState([]);
  const [spin,       setSpin]       = useState(0);
  const [impact,     setImpact]     = useState(false);
  const [goalRipple, setGoalRipple] = useState(false);
  const rafRef   = useRef(null);
  const trailRef = useRef([]);
  const spinRef  = useRef(0);

  const animate = useCallback(() => {
    if (!goal?._sx) return;
    const A    = goal.assistPos;
    const C    = goal.conductPos;
    const S    = { x: goal._sx, y: goal._sy };
    const GOAL = { x: 782, y: 210 }; // centre porteria rival al PitchSVG

    // Fase 1: assist/conducció → shotPos
    const segs1 = [];
    if (A && C) {
      segs1.push({ p0:A, cp:bezierCP(A,C,22), p1:C, dur:480 });
      segs1.push({ p0:C, cp:bezierCP(C,S,16), p1:S,  dur:340 });
    } else if (A) {
      segs1.push({ p0:A, cp:bezierCP(A,S,30), p1:S, dur:560 });
    } else if (C) {
      segs1.push({ p0:C, cp:bezierCP(C,S,18), p1:S, dur:370 });
    }

    // Fase 2: shotPos → porteria (arc lleuger)
    const goalCP = { x: (S.x + GOAL.x) / 2, y: (S.y + GOAL.y) / 2 - 20 };
    const seg2   = { p0: S, cp: goalCP, p1: GOAL, dur: 430 };

    let phase = segs1.length ? 1 : 2;
    let segIdx = 0, startTime = null, lastPos = null;

    setImpact(false); setGoalRipple(false);
    if (phase === 2) { setBallPos({ ...S }); setImpact(true); }

    const tick = (ts) => {
      if (!startTime) startTime = ts;

      // Transició fase 1 → fase 2
      if (phase === 1 && !segs1[segIdx]) {
        setBallPos({ ...S }); setImpact(true);
        phase = 2; startTime = null; lastPos = null;
        trailRef.current = [];
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const seg  = phase === 1 ? segs1[segIdx] : seg2;
      const t    = Math.min((ts - startTime) / seg.dur, 1);
      const ease = t < 0.5 ? 4*t*t*t : 1 - (-2*t+2)**3/2;
      const pos  = bezierAt(ease, seg.p0, seg.cp, seg.p1);

      if (lastPos) {
        const d = Math.sqrt((pos.x-lastPos.x)**2 + (pos.y-lastPos.y)**2);
        spinRef.current = (spinRef.current + d * 9) % 360;
        setSpin(spinRef.current);
      }
      lastPos = pos;
      trailRef.current = [...trailRef.current.slice(-9), { x: pos.x, y: pos.y }];
      setBallPos({ x: pos.x, y: pos.y });
      setTrail([...trailRef.current]);

      if (t >= 1) {
        if (phase === 1) { segIdx++; startTime = null; rafRef.current = requestAnimationFrame(tick); }
        else {
          // Fase 2 acabada → ripple + desaparèixer
          setGoalRipple(true);
          setTrail([]);
          setTimeout(() => setBallPos(null), 650);
        }
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    trailRef.current = []; spinRef.current = 0;
    setTimeout(() => { rafRef.current = requestAnimationFrame(tick); }, 200);
  }, [goal]);

  useEffect(() => {
    setBallPos(null); setTrail([]); setSpin(0); setImpact(false); setGoalRipple(false);
    trailRef.current = []; spinRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (goal) animate();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [goal, animate]);

  return { ballPos, trail, spin, impact, goalRipple };
}

// ── CSS animations (string injectable in SVG defs) ────────────────
const SVG_ANIMATIONS = `
  @keyframes goalPop   { 0%{opacity:0;transform:scale(0.2)} 65%{transform:scale(1.25)} 100%{opacity:1;transform:scale(1)} }
  @keyframes drawPath  { from{stroke-dashoffset:1} to{stroke-dashoffset:0} }
  @keyframes svgRipple { 0%{opacity:0.65;transform:scale(1)} 100%{opacity:0;transform:scale(4.5)} }
  @keyframes netFlash  { 0%{opacity:0.35} 60%{opacity:0.5} 100%{opacity:0.07} }
  @keyframes impactPop { 0%{opacity:0.8;transform:scale(0.5)} 100%{opacity:0;transform:scale(3.5)} }
  @keyframes floatNum  { 0%{opacity:0;transform:translateY(4px)} 100%{opacity:0.7;transform:translateY(0)} }
  @keyframes bigRipple { 0%{opacity:0.85;transform:scale(1)} 100%{opacity:0;transform:scale(9)} }
  @keyframes ballSink  { 0%{opacity:1;transform:scale(1)} 80%{opacity:0.4;transform:scale(0.3)} 100%{opacity:0;transform:scale(0.05)} }
  @keyframes netBurst  { 0%{opacity:0;fill-opacity:0.18} 25%{opacity:1;fill-opacity:0.45} 100%{opacity:0;fill-opacity:0} }
`;

// ── Hook: pilota al GoalSVG — paràbola des del centre → goalPos ───
function useGoalBallAnimation(goal) {
  const [frame,  setFrame]  = useState(null);
  const [ripple, setRipple] = useState(false);
  const rafRef   = useRef(null);
  const trailRef = useRef([]);

  useEffect(() => {
    setFrame(null); setRipple(false);
    trailRef.current = [];
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!goal?.goalPos) return;

    const GP = goal.goalPos;
    const p0 = { x: 150, y: 100 }; // centre del camp (GoalSVG coords)
    const p1 = { x: GP.x, y: GP.y };
    // Paràbola: punt de control ben per sobre del punt mig (trajectòria d'arc alt)
    const cp = {
      x: (p0.x + p1.x) / 2,
      y: Math.min(p0.y, p1.y) - 90,
    };

    const FLY_DUR  = 680;
    const SINK_DUR = 500;
    let startTime = null;
    let sinking   = false;
    let sinkStart = null;

    const tick = (ts) => {
      if (!startTime) startTime = ts;

      if (!sinking) {
        const rawT = Math.min((ts - startTime) / FLY_DUR, 1);
        const ease = rawT < 0.5 ? 4*rawT*rawT*rawT : 1 - Math.pow(-2*rawT+2, 3)/2;
        const pos  = bezierAt(ease, p0, cp, p1);
        // Mida decreix en apropar-se (perspectiva)
        const r = 9 - rawT * 2;
        trailRef.current = [...trailRef.current.slice(-8), { x: pos.x, y: pos.y }];
        setFrame({ x: pos.x, y: pos.y, r, alpha: 1, trail: [...trailRef.current] });

        if (rawT >= 1) {
          sinking = true; sinkStart = ts;
          setRipple(true);
          trailRef.current = [];
        }
        rafRef.current = requestAnimationFrame(tick);
      } else {
        const sinkT = Math.min((ts - sinkStart) / SINK_DUR, 1);
        const ease  = sinkT * sinkT;
        const r     = 7 * (1 - ease * 0.93);
        const alpha = 1 - ease;
        if (r > 0.4) {
          setFrame({ x: GP.x, y: GP.y, r, alpha, trail: [] });
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setFrame(null);
        }
      }
    };

    setTimeout(() => { rafRef.current = requestAnimationFrame(tick); }, 200);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [goal]);

  return { frame, ripple };
}

// ── Camp SVG ──────────────────────────────────────────────────────
function PitchSVG({ goals, activeGoal, setActiveGoal }) {
  const activeGoalData = activeGoal !== null ? goals[activeGoal] : null;
  const { ballPos, trail, spin, impact, goalRipple } = useBallAnimation(activeGoalData);

  const activeColor = activeGoalData ? (PLAYER_COLORS[activeGoalData.scorer] || ACCENT) : ACCENT;
  const A  = activeGoalData?.assistPos;
  const C  = activeGoalData?.conductPos;
  const S  = activeGoalData ? { x: activeGoalData._sx, y: activeGoalData._sy } : null;
  const PITCH_GOAL = { x: 782, y: 210 };

  // Bezier paths per al trajecte actiu
  const pathAssist  = A && (C||S) ? bezierPathD(A, bezierCP(A, C||S, 22), C||S) : null;
  const pathConduct = C && S       ? bezierPathD(C, bezierCP(C, S,    16), S)    : null;
  const pathShot    = !C && A && S ? null : null; // ja cobert per pathAssist si no hi ha C

  // Gradient id únic per cada gol actiu
  const gradId = `tg-${activeGoal}`;
  const gradFrom = A || C || S;

  return (
    <svg viewBox="0 0 800 420" style={{width:'100%',display:'block'}}>
      <defs>
        <style>{SVG_ANIMATIONS}</style>

        {/* Gradient del trajecte actiu */}
        {S && gradFrom && (
          <linearGradient id={gradId} gradientUnits="userSpaceOnUse"
            x1={gradFrom.x} y1={gradFrom.y} x2={S.x} y2={S.y}>
            <stop offset="0%"   stopColor={activeColor} stopOpacity="0.1"/>
            <stop offset="100%" stopColor={activeColor} stopOpacity="0.85"/>
          </linearGradient>
        )}

        <radialGradient id="ballgrad" cx="35%" cy="30%">
          <stop offset="0%"   stopColor="#fff"/>
          <stop offset="55%"  stopColor="#e8e8e8"/>
          <stop offset="100%" stopColor="#b0b0b0"/>
        </radialGradient>
        <filter id="softglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      {/* Gespa — franges alternades */}
      {Array.from({length:8},(_,i)=>(
        <rect key={i} x={18+i*95.5} y="18" width="95.5" height="384"
          fill={i%2===0?'#1c3d1c':'#193619'}/>
      ))}
      <rect x="0" y="0" width="800" height="420" fill="none"/>

      {/* Línies del camp */}
      <rect x="18" y="18" width="764" height="384" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2"/>
      <line x1="400" y1="18" x2="400" y2="402" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5"/>
      <circle cx="400" cy="210" r="185" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5"/>
      <circle cx="400" cy="210" r="4"   fill="rgba(255,255,255,0.8)"/>
      <path d="M18,80 A70,70 0 0,1 88,150 L88,270 A70,70 0 0,1 18,340" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5"/>
      <line x1="88" y1="150" x2="88" y2="270" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5"/>
      <rect x="3"   y="185" width="15" height="50" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" rx="1"/>
      <path d="M782,80 A70,70 0 0,0 712,150 L712,270 A70,70 0 0,0 782,340" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5"/>
      <line x1="712" y1="150" x2="712" y2="270" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5"/>
      <rect x="782" y="185" width="15" height="50" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" rx="1"/>

      {/* Calor de fons — blobs acumulats */}
      {goals.map((g,i) => g._sx && (
        <circle key={`heat-${i}`} cx={g._sx} cy={g._sy} r="30"
          fill={PLAYER_COLORS[g.scorer]||ACCENT} opacity="0.055"/>
      ))}

      {/* Gols inactius — pilota real amb dorsal */}
      {goals.map((g, idx) => {
        if (!g._sx || idx === activeGoal) return null;
        const color  = PLAYER_COLORS[g.scorer] || ACCENT;
        const dorsal = getDorsal(g.scorer);
        const num    = idx + 1;
        return (
          <g key={idx} onClick={() => setActiveGoal(idx === activeGoal ? null : idx)}
            style={{cursor:'pointer'}}
            style={{cursor:'pointer', opacity: activeGoal !== null ? 0.55 : 1, transition:'opacity 0.3s'}}>
            {/* Traces molt discretes */}
            {g.assistPos && <line x1={g.assistPos.x} y1={g.assistPos.y} x2={g._sx} y2={g._sy} stroke={color} strokeWidth="0.7" strokeDasharray="3,4" opacity="0.15"/>}
            {g.conductPos && <line x1={g.conductPos.x} y1={g.conductPos.y} x2={g._sx} y2={g._sy} stroke={color} strokeWidth="0.7" strokeDasharray="2,3" opacity="0.15"/>}
            {/* Ombra */}
            <ellipse cx={g._sx+1.5} cy={g._sy+2.5} rx="6" ry="3.5" fill="rgba(0,0,0,0.25)"/>
            {/* Pilota */}
            <circle cx={g._sx} cy={g._sy} r="8.5" fill={color} opacity="0.82"
              stroke="rgba(255,255,255,0.25)" strokeWidth="1"
              style={{transformOrigin:`${g._sx}px ${g._sy}px`, animation:`goalPop 0.4s cubic-bezier(0.34,1.56,0.64,1) ${idx*0.07}s both`}}/>
            {/* Costura */}
            <path d={`M${g._sx-3.5},${g._sy-1} Q${g._sx},${g._sy-4.5} ${g._sx+3.5},${g._sy-1}`} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth="0.8"/>
            {/* Dorsal */}
            <text x={g._sx} y={g._sy} textAnchor="middle" dominantBaseline="middle"
              fontSize={dorsal!==null&&dorsal>=10?'4.8':'5.8'} fontWeight="900"
              fill="rgba(0,0,0,0.85)" style={{pointerEvents:'none'}}>
              {dorsal??'?'}
            </text>
            {/* Número del gol */}
            <text x={g._sx} y={g._sy-13} textAnchor="middle"
              fontSize="5.5" fontWeight="bold" fill="rgba(255,255,255,0.5)"
              style={{pointerEvents:'none', animation:`floatNum 0.4s ease ${idx*0.07+0.1}s both`}}>
              #{num}
            </text>
          </g>
        );
      })}

      {/* Gol actiu — trajecte complet + pilota */}
      {activeGoal !== null && S && (() => {
        const g = goals[activeGoal];
        if (!g._sx) return null;

        return (
          <g>
            {/* Aura de focus difuminada */}
            <circle cx={S.x} cy={S.y} r="40" fill={activeColor} opacity="0.07" filter="url(#softglow)"/>

            {/* Trajecte assist — bezier animat */}
            {A && (
              <>
                <path key={`ass-${activeGoal}`}
                  d={pathAssist}
                  fill="none" stroke="#61AFEF" strokeWidth="2" opacity="0.5"
                  pathLength="1" strokeDasharray="1" strokeDashoffset="1"
                  style={{animation:'drawPath 0.55s ease-out 0.1s forwards'}}/>
                <circle cx={A.x} cy={A.y} r="5" fill="#61AFEF" opacity="0.7"
                  style={{animation:`goalPop 0.3s ease 0.1s both`}}/>
                <text x={A.x} y={A.y-9} textAnchor="middle" fontSize="5.5" fill="#61AFEF" opacity="0.7">👟</text>
              </>
            )}

            {/* Trajecte conducció */}
            {C && S && (
              <>
                <path key={`cnd-${activeGoal}`}
                  d={pathConduct}
                  fill="none" stroke={activeColor} strokeWidth="2" opacity="0.45"
                  strokeDasharray="5,3" pathLength="1"
                  style={{animation:'drawPath 0.4s ease-out 0.3s forwards', strokeDashoffset:'1'}}/>
                <rect x={C.x-3.5} y={C.y-3.5} width="7" height="7" rx="1"
                  fill={activeColor} opacity="0.65" transform={`rotate(45,${C.x},${C.y})`}/>
              </>
            )}

            {/* Gradient path complet (overlay lluminós) */}
            {A && S && (
              <path key={`grd-${activeGoal}`}
                d={bezierPathD(A, bezierCP(A, S, 30), S)}
                fill="none" stroke={`url(#${gradId})`} strokeWidth="1.5" opacity="0.35"
                pathLength="1" strokeDasharray="1" strokeDashoffset="1"
                style={{animation:'drawPath 0.7s ease-out 0.05s forwards'}}/>
            )}

            {/* Punt de tir gran */}
            <circle cx={S.x} cy={S.y} r="14" fill={activeColor}
              stroke="white" strokeWidth="1.5" opacity="0.95"
              style={{filter:`drop-shadow(0 0 8px ${activeColor}70)`, transformOrigin:`${S.x}px ${S.y}px`, animation:'goalPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both'}}/>
            <text x={S.x} y={S.y} textAnchor="middle" dominantBaseline="middle"
              fontSize={getDorsal(g.scorer)!==null&&getDorsal(g.scorer)>=10?'7.5':'8.5'}
              fontWeight="900" fill="rgba(0,0,0,0.9)" style={{pointerEvents:'none'}}>
              {getDorsal(g.scorer)??'?'}
            </text>

            {/* Anells expansius d'impacte */}
            {[0,1,2].map(i => (
              <circle key={`ring-${i}-${activeGoal}`} cx={S.x} cy={S.y} r="10"
                fill="none" stroke={activeColor} strokeWidth="1.5"
                style={{
                  transformOrigin:`${S.x}px ${S.y}px`,
                  animation:`svgRipple 1.4s ease-out ${i*0.32}s infinite`,
                  opacity:0,
                }}/>
            ))}

            {/* Anell d'impacte quan arriba la pilota */}
            {impact && [0,1].map(i => (
              <circle key={`imp-${i}`} cx={S.x} cy={S.y} r="6"
                fill="none" stroke="white" strokeWidth="2"
                style={{
                  transformOrigin:`${S.x}px ${S.y}px`,
                  animation:`impactPop 0.5s ease-out ${i*0.12}s forwards`,
                  opacity:0,
                }}/>
            ))}

            {/* TRAIL de la pilota */}
            {trail.map((pos, i) => {
              const prog = (i+1)/trail.length;
              return (
                <circle key={i} cx={pos.x} cy={pos.y}
                  r={3.5 * prog}
                  fill={activeColor}
                  opacity={0.35 * prog * 0.8}/>
              );
            })}

            {/* PILOTA */}
            {ballPos && (
              <g>
                <ellipse cx={ballPos.x+2} cy={ballPos.y+3.5} rx="5.5" ry="3" fill="rgba(0,0,0,0.3)"/>
                <circle cx={ballPos.x} cy={ballPos.y} r="7.5"
                  fill="url(#ballgrad)" stroke="rgba(0,0,0,0.3)" strokeWidth="0.7"
                  style={{filter: impact ? `drop-shadow(0 0 6px ${activeColor})` : 'none'}}/>
                <g style={{transformOrigin:`${ballPos.x}px ${ballPos.y}px`, transform:`rotate(${spin}deg)`}}>
                  <path d={`M${ballPos.x-3.5},${ballPos.y-1.2} Q${ballPos.x},${ballPos.y-5.5} ${ballPos.x+3.5},${ballPos.y-1.2}`}
                    fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="0.9"/>
                  <path d={`M${ballPos.x-4},${ballPos.y+1.5} Q${ballPos.x},${ballPos.y+5.5} ${ballPos.x+4},${ballPos.y+1.5}`}
                    fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="0.8"/>
                  <path d={`M${ballPos.x},${ballPos.y-7} L${ballPos.x},${ballPos.y+7}`}
                    stroke="rgba(0,0,0,0.15)" strokeWidth="0.6"/>
                </g>
              </g>
            )}

            {/* RIPPLE a la porteria quan la pilota hi arriba */}
            {goalRipple && (
              <g key={`pgr-${activeGoal}-${goalRipple}`}>
                {[0,1,2,3].map(i => (
                  <circle key={i} cx={PITCH_GOAL.x} cy={PITCH_GOAL.y} r="7"
                    fill="none"
                    stroke={i % 2 === 0 ? 'white' : activeColor}
                    strokeWidth={i < 2 ? 2.5 : 1.5}
                    style={{
                      transformOrigin: `${PITCH_GOAL.x}px ${PITCH_GOAL.y}px`,
                      animation: `bigRipple ${0.5+i*0.12}s ease-out ${i*0.1}s forwards`,
                    }}/>
                ))}
                <circle cx={PITCH_GOAL.x} cy={PITCH_GOAL.y} r="11"
                  fill={activeColor}
                  style={{
                    transformOrigin: `${PITCH_GOAL.x}px ${PITCH_GOAL.y}px`,
                    animation: 'netBurst 0.5s ease-out both',
                  }}/>
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
  const activeGoalData = activeGoal !== null ? goals[activeGoal] : null;
  const { frame, ripple } = useGoalBallAnimation(activeGoalData);

  return (
    <svg viewBox="-18 -18 336 230" style={{width:'100%',display:'block'}}>
      <defs>
        <style>{SVG_ANIMATIONS}</style>
        <radialGradient id="netbg" cx="50%" cy="0%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.03)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>
        <radialGradient id="goalBallGrad" cx="35%" cy="30%">
          <stop offset="0%"   stopColor="#fff"/>
          <stop offset="55%"  stopColor="#e8e8e8"/>
          <stop offset="100%" stopColor="#b0b0b0"/>
        </radialGradient>
      </defs>

      {/* Terra */}
      <rect x="-18" y="200" width="336" height="12" fill="#1c3d1c"/>
      {/* Interior porteria */}
      <rect x="0" y="0" width="300" height="200" fill="#070707"/>
      <rect x="0" y="0" width="300" height="200" fill="url(#netbg)"/>
      {/* Degradat profunditat */}
      <rect x="0" y="150" width="300" height="50" fill="rgba(0,0,0,0.25)"/>

      {/* 3D perspectiva */}
      <line x1="0"   y1="0"   x2="-13" y2="-13" stroke="#555" strokeWidth="1.8"/>
      <line x1="300" y1="0"   x2="313" y2="-13" stroke="#555" strokeWidth="1.8"/>
      <line x1="0"   y1="200" x2="-13" y2="187" stroke="#444" strokeWidth="1.4"/>
      <line x1="300" y1="200" x2="313" y2="187" stroke="#444" strokeWidth="1.4"/>
      <line x1="-13" y1="-13" x2="313" y2="-13" stroke="#555" strokeWidth="1.5"/>
      <line x1="-13" y1="-13" x2="-13" y2="187" stroke="#444" strokeWidth="1"/>
      <line x1="313" y1="-13" x2="313" y2="187" stroke="#444" strokeWidth="1"/>

      {/* Xarxa */}
      {[30,60,90,120,150,180,210,240,270].map(x=>(
        <line key={`nv-${x}-${ripple}`} x1={x} y1="0" x2={x} y2="200"
          stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"
          style={ripple ? {animation:'netFlash 0.7s ease-out both'} : {}}/>
      ))}
      {[40,80,120,160].map(y=>(
        <line key={`nh-${y}-${ripple}`} x1="0" y1={y} x2="300" y2={y}
          stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"
          style={ripple ? {animation:`netFlash 0.7s ease-out ${y*0.002}s both`} : {}}/>
      ))}
      {/* Diagonals perspectiva xarxa */}
      {[30,60,90,120,150,180,210,240,270].map(x=>(
        <line key={`nd-${x}`} x1={x} y1="0" x2={x-13} y2="-13"
          stroke="rgba(255,255,255,0.03)" strokeWidth="0.4"/>
      ))}

      {/* Gols */}
      {goals.map((g, idx) => {
        if (!g._gx) return null;
        const isActive = activeGoal === idx;
        const isGround = g._gy >= GROUND_Y;
        const dorsal   = getDorsal(g.scorer);
        const color    = PLAYER_COLORS[g.scorer] || ACCENT;
        const num      = idx + 1;

        return (
          <g key={idx} onClick={() => setActiveGoal(isActive?null:idx)} style={{cursor:'pointer',
            opacity: !isActive && activeGoal !== null ? 0.45 : 1, transition:'opacity 0.3s'}}>
            {isActive && (
              <>
                {/* Halo glow */}
                <circle cx={g._gx} cy={g._gy} r="28" fill={color} opacity="0.15"
                  style={{filter:`blur(6px)`}}/>
                {/* Anells */}
                {[0,1,2].map(i => (
                  <circle key={i} cx={g._gx} cy={g._gy} r="10" fill="none"
                    stroke={color} strokeWidth="1.2"
                    style={{
                      transformOrigin:`${g._gx}px ${g._gy}px`,
                      animation:`svgRipple 1.5s ease-out ${i*0.35}s infinite`,
                      opacity:0,
                    }}/>
                ))}
              </>
            )}
            {/* Ombra */}
            {isGround && <ellipse cx={g._gx+1} cy={g._gy+2.5} rx={isActive?10:6} ry={isActive?5:3} fill="rgba(0,0,0,0.35)"/>}
            {/* Pilota / punt */}
            <circle cx={g._gx} cy={g._gy}
              r={isActive?15:10}
              fill={isActive ? color : 'rgba(255,255,255,0.88)'}
              stroke={isActive ? 'white' : 'rgba(0,0,0,0.15)'}
              strokeWidth={isActive?2:1}
              style={{
                transformOrigin:`${g._gx}px ${g._gy}px`,
                animation:`goalPop 0.45s cubic-bezier(0.34,1.56,0.64,1) ${idx*0.09+0.1}s both`,
                filter: isActive ? `drop-shadow(0 0 8px ${color}90)` : 'none',
              }}/>
            {/* Costura si actiu */}
            {isActive && (
              <path d={`M${g._gx-5},${g._gy-1.5} Q${g._gx},${g._gy-7} ${g._gx+5},${g._gy-1.5}`}
                fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
            )}
            {/* Dorsal */}
            <text x={g._gx} y={g._gy+(isGround?-0.5:0)}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={dorsal!==null&&dorsal>=10?(isActive?8:6):(isActive?9.5:7)}
              fontWeight="900"
              fill={isActive?'rgba(0,0,0,0.9)':'#111'}
              style={{pointerEvents:'none',
                animation:`goalPop 0.45s cubic-bezier(0.34,1.56,0.64,1) ${idx*0.09+0.1}s both`}}>
              {dorsal??'?'}
            </text>
            {/* Número gol */}
            {!isActive && (
              <text x={g._gx} y={g._gy-15} textAnchor="middle"
                fontSize="5.5" fill="rgba(255,255,255,0.4)" style={{pointerEvents:'none'}}>
                #{num}
              </text>
            )}
          </g>
        );
      })}

      {/* ── Pilota animada — r i alpha via RAF, sense CSS ── */}
      {frame && activeGoalData && (() => {
        const color = PLAYER_COLORS[activeGoalData.scorer] || ACCENT;
        const { x, y, r, alpha, trail } = frame;
        const isSinking = alpha < 0.98;
        return (
          <g>
            {trail.map((pos, i) => {
              const prog = (i + 1) / trail.length;
              return <circle key={i} cx={pos.x} cy={pos.y} r={3.5*prog} fill={color} opacity={0.22*prog}/>;
            })}
            {r > 4 && <ellipse cx={x+1.5} cy={y+2.5} rx={r*0.6} ry={r*0.28} fill="rgba(0,0,0,0.3)" opacity={alpha*0.8}/>}
            <circle cx={x} cy={y} r={r}
              fill="url(#goalBallGrad)"
              stroke={isSinking ? color : 'rgba(0,0,0,0.25)'}
              strokeWidth={isSinking ? 1.5 : 0.6}
              opacity={alpha}
              style={{filter: isSinking ? `drop-shadow(0 0 ${10*alpha}px ${color})` : 'none'}}/>
            {r > 5 && (
              <path d={`M${x-r*0.44},${y-r*0.17} Q${x},${y-r*0.72} ${x+r*0.44},${y-r*0.17}`}
                fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="0.8" opacity={alpha}/>
            )}
          </g>
        );
      })()}

      {/* ── Ripple gran en arribar ── */}
      {ripple && activeGoalData?.goalPos && (() => {
        const color = PLAYER_COLORS[activeGoalData.scorer] || ACCENT;
        const GP = activeGoalData.goalPos;
        return (
          <g key={`r-${activeGoal}-${ripple}`}>
            {[0,1,2,3].map(i => (
              <circle key={i} cx={GP.x} cy={GP.y} r="8"
                fill="none"
                stroke={i % 2 === 0 ? 'white' : color}
                strokeWidth={i < 2 ? 2.5 : 1.5}
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                  animation: `bigRipple ${0.5+i*0.1}s ease-out ${i*0.1}s forwards`,
                }}/>
            ))}
            <circle cx={GP.x} cy={GP.y} r="16"
              fill={color}
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
                animation: 'netBurst 0.45s ease-out both',
              }}/>
          </g>
        );
      })()}

      {/* Pals */}
      <rect x="-9" y="-8" width="11" height="210" rx="3" fill="#e8e8e8"/>
      <rect x="298" y="-8" width="11" height="210" rx="3" fill="#e8e8e8"/>
      <rect x="-9" y="-8" width="318" height="11" rx="3" fill="#e8e8e8"/>
      {/* Brillantor pals */}
      <rect x="-9" y="-8" width="4" height="210" rx="2" fill="rgba(255,255,255,0.3)"/>
      <rect x="298" y="-8" width="4" height="210" rx="2" fill="rgba(255,255,255,0.3)"/>
      <rect x="-9" y="-8" width="318" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
    </svg>
  );
}

// ── Mini trajecte per a la targeta ────────────────────────────────
function MiniTrajectory({ goal }) {
  if (!goal?._sx) return null;
  const A = goal.assistPos, C = goal.conductPos;
  const S = { x: goal._sx, y: goal._sy };
  const color = PLAYER_COLORS[goal.scorer] || ACCENT;

  // Escalar a un viewport 200x100
  const xs = [S.x, A?.x, C?.x].filter(Boolean);
  const ys = [S.y, A?.y, C?.y].filter(Boolean);
  const minX = Math.min(...xs)-20, maxX = Math.max(...xs)+20;
  const minY = Math.min(...ys)-20, maxY = Math.max(...ys)+20;
  const vw = `${minX} ${minY} ${maxX-minX} ${maxY-minY}`;

  const pathD = A
    ? bezierPathD(A, bezierCP(A, C||S, 28), C||S)
    : C ? bezierPathD(C, bezierCP(C, S, 18), S) : null;
  const pathD2 = A && C ? bezierPathD(C, bezierCP(C, S, 16), S) : null;

  return (
    <div>
      <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1.5">Trajectòria</p>
      <svg viewBox={vw} style={{width:'100%',maxHeight:80,display:'block'}}
        className="rounded-xl bg-[#0f1a0f] border border-white/5">
        {/* Heat blob */}
        <circle cx={S.x} cy={S.y} r="20" fill={color} opacity="0.1"/>

        {/* Paths */}
        {pathD && (
          <path key={`mini-1-${goal.matchId}-${goal.time}`}
            d={pathD} fill="none"
            stroke={pathD2 ? '#61AFEF' : `url(#mini-grad)`} strokeWidth="1.5" opacity="0.7"
            pathLength="1" strokeDasharray="1" strokeDashoffset="1"
            style={{animation:'drawPath 0.6s ease-out 0.1s forwards'}}/>
        )}
        {pathD2 && (
          <path key={`mini-2-${goal.matchId}-${goal.time}`}
            d={pathD2} fill="none" stroke={color} strokeWidth="1.5" opacity="0.7"
            strokeDasharray="4,2" pathLength="1" strokeDashoffset="1"
            style={{animation:'drawPath 0.4s ease-out 0.35s forwards'}}/>
        )}

        {/* Punts */}
        {A && <circle cx={A.x} cy={A.y} r="3.5" fill="#61AFEF" opacity="0.8"/>}
        {C && <rect x={C.x-3} y={C.y-3} width="6" height="6" rx="1" fill={color} opacity="0.7" transform={`rotate(45,${C.x},${C.y})`}/>}
        <circle cx={S.x} cy={S.y} r="5" fill={color} stroke="white" strokeWidth="1" opacity="0.95"/>

        <defs>
          <linearGradient id="mini-grad" gradientUnits="userSpaceOnUse"
            x1={A?.x||S.x} y1={A?.y||S.y} x2={S.x} y2={S.y}>
            <stop offset="0%"   stopColor="#61AFEF" stopOpacity="0.3"/>
            <stop offset="100%" stopColor={color}   stopOpacity="0.9"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ── Targeta info gol ──────────────────────────────────────────────
function GoalCard({ goal, idx, onClose }) {
  if (!goal) return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8 min-h-48">
      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-3 opacity-30">
        <span style={{fontSize:22}}>⚽</span>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">Clica un gol<br/>per veure el detall</p>
    </div>
  );

  const videoUrl = getVideoUrl(goal);
  const dorsal   = getDorsal(goal.scorer);
  const color    = PLAYER_COLORS[goal.scorer] || ACCENT;
  const num      = idx + 1;

  return (
    <div key={`card-${goal.matchId}-${goal.time}`}
      className="p-5 space-y-4"
      style={{animation:'goalPop 0.3s ease both'}}>

      {/* Capçalera */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {/* Badge número */}
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
            style={{background:`${color}20`, color, border:`1px solid ${color}40`}}>
            {num}
          </div>
          {/* Dorsal */}
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
        <button onClick={onClose}
          className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all flex items-center justify-center flex-shrink-0">×</button>
      </div>

      <div className="h-px bg-white/5"/>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:color}}/>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider w-10">Gol</span>
          <span className="text-white font-bold text-sm">{getShirt(goal.scorer)}</span>
        </div>
        {goal.assist && (
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0 bg-[#61AFEF]"/>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider w-10">Assist</span>
            <span className="text-gray-300 font-medium text-sm">{getShirt(goal.assist)}</span>
          </div>
        )}
        {goal.notes && (
          <p className="text-gray-500 text-xs italic leading-relaxed pl-4 border-l border-white/5">{goal.notes}</p>
        )}
      </div>

      {/* Mini trajectòria */}
      {(goal.assistPos || goal.conductPos) && goal.shotPos && (
        <MiniTrajectory goal={goal}/>
      )}

      {/* Porteria miniatura en el card */}
      {goal.goalPos && (
        <div>
          <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-1.5">On entra</p>
          <svg viewBox="-8 -8 316 216" style={{width:'100%',maxWidth:200}} className="rounded-xl bg-[#070707] border border-white/5">
            <rect x="0" y="0" width="300" height="200" fill="#070707"/>
            <line x1="0" y1="0" x2="-10" y2="-10" stroke="#555" strokeWidth="1.5"/>
            <line x1="300" y1="0" x2="310" y2="-10" stroke="#555" strokeWidth="1.5"/>
            <line x1="-10" y1="-10" x2="310" y2="-10" stroke="#555" strokeWidth="1"/>
            {[50,100,150,200,250].map(x=><line key={x} x1={x} y1="0" x2={x} y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>)}
            {[50,100,150].map(y=><line key={y} x1="0" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>)}
            <circle cx={goal.goalPos.x} cy={goal.goalPos.y} r="20" fill={color} opacity="0.15"/>
            <circle cx={goal.goalPos.x} cy={goal.goalPos.y} r="10" fill={color} stroke="white" strokeWidth="1.5" opacity="0.97"
              style={{animation:'goalPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both'}}/>
            <rect x="-7" y="-7" width="9" height="209" rx="2" fill="#ddd"/>
            <rect x="298" y="-7" width="9" height="209" rx="2" fill="#ddd"/>
            <rect x="-7" y="-7" width="314" height="9" rx="2" fill="#ddd"/>
            <rect x="-7" y="-7" width="4" height="209" rx="2" fill="rgba(255,255,255,0.3)"/>
          </svg>
        </div>
      )}

      {(goal.localVideoUrl || videoUrl) && <div className="h-px bg-white/5"/>}

      {goal.localVideoUrl && (
        <video src={`${BASE}${goal.localVideoUrl}`} controls
          className="w-full rounded-xl border border-white/10" style={{maxHeight:160}}/>
      )}
      {!goal.localVideoUrl && videoUrl && (
        <a href={videoUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border transition-all hover:opacity-80"
          style={{borderColor:`${color}30`, background:`${color}10`, color}}>
          <svg width="12" height="12" viewBox="0 0 12 12"><polygon points="2,1 11,6 2,11" fill="currentColor"/></svg>
          <span className="text-xs font-semibold">Veure vídeo</span>
        </a>
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

  // AutoPlay
  useEffect(() => {
    if (!autoPlay || !filtered.length) {
      if (autoRef.current) clearTimeout(autoRef.current);
      return;
    }
    const next = () => {
      setActiveGoal(prev => (prev === null ? 0 : (prev+1) % filtered.length));
      autoRef.current = setTimeout(next, 2400);
    };
    setActiveGoal(0);
    autoRef.current = setTimeout(next, 2400);
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [autoPlay, filtered]);

  const activeGoalData = activeGoal !== null ? filtered[activeGoal] : null;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Capçalera */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-3xl font-black text-white mb-1">Mapa de Gols</h2>
          <p className="text-gray-500 text-sm">{filtered.length} gols a favor</p>
        </div>
        <button onClick={() => { setAutoPlay(p=>!p); if (autoPlay) setActiveGoal(null); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
            autoPlay ? 'bg-[#E5C07B]/15 border-[#E5C07B]/40 text-[#E5C07B]' : 'border-white/10 text-gray-500 hover:text-white hover:border-white/25'}`}>
          <span style={{fontSize:13}}>{autoPlay ? '⏸' : '▶'}</span>
          {autoPlay ? 'Pausar' : 'Reproduir tots'}
        </button>
      </div>

      {/* Filtre per jornada */}
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

      {/* Filtre per jugador */}
      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => { setPlayerFilter('all'); setActiveGoal(null); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${playerFilter==='all'?'bg-white/10 border-white/30 text-white':'border-white/10 text-gray-500 hover:text-white'}`}>
          Tots
        </button>
        {scorers.map(name => {
          const c = PLAYER_COLORS[name] || ACCENT;
          return (
            <button key={name} onClick={() => { setPlayerFilter(name===playerFilter?'all':name); setActiveGoal(null); }}
              className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
              style={{
                background: playerFilter===name ? `${c}20` : 'transparent',
                borderColor: playerFilter===name ? `${c}50` : 'rgba(255,255,255,0.1)',
                color: playerFilter===name ? c : 'rgba(255,255,255,0.4)',
              }}>
              {name.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Layout: mapes + card */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_220px] gap-3 items-start">
        <div className="space-y-3 min-w-0">
          <div className="bg-[#0f1a0f] rounded-2xl border border-white/5 p-3 overflow-hidden">
            <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider font-bold flex items-center gap-2">
              Camp · zona de tir
              {activeGoalData && (
                <span style={{color: PLAYER_COLORS[activeGoalData.scorer]||ACCENT}}
                  className="font-black">
                  → #{activeGoal+1} {activeGoalData.time}'
                </span>
              )}
            </p>
            <PitchSVG goals={filtered} activeGoal={activeGoal}
              setActiveGoal={(i) => { setAutoPlay(false); setActiveGoal(i); }}/>
          </div>
          <div className="bg-[#080808] rounded-2xl border border-white/5 p-3 overflow-hidden">
            <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider font-bold">Porteria rival · on entra</p>
            <GoalSVG goals={filtered} activeGoal={activeGoal}
              setActiveGoal={(i) => { setAutoPlay(false); setActiveGoal(i); }}/>
          </div>
        </div>

        {/* Card info */}
        <div className={`bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden lg:sticky lg:top-4 ${activeGoalData?'block':'hidden lg:block'}`}
          style={{minHeight: 240}}>
          <GoalCard goal={activeGoalData} idx={activeGoal}
            onClose={() => { setActiveGoal(null); setAutoPlay(false); }}/>
        </div>
      </div>

      {!activeGoalData && (
        <p className="text-center text-xs text-gray-700 lg:hidden">Toca un punt al camp per veure el detall</p>
      )}

      {/* Llegenda */}
      <div className="flex flex-wrap gap-5 text-xs text-gray-600 pt-1">
        <span className="flex items-center gap-1.5">
          <svg width="10" height="10"><circle cx="5" cy="5" r="5" fill="#61AFEF" opacity="0.8"/></svg>Assist
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="10" height="10"><rect x="0" y="0" width="10" height="10" rx="1" fill="#E5C07B" opacity="0.8" transform="rotate(45,5,5)"/></svg>Conducció
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="10" height="10"><circle cx="5" cy="5" r="5" fill="white" opacity="0.75"/></svg>Tir (color = jugador)
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="14" height="10"><circle cx="7" cy="5" r="4" fill="#ccc" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/></svg>Pilota animada
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="10" height="10"><circle cx="5" cy="5" r="5" fill="#E5C07B" opacity="0.15"/></svg>Zona calenta
        </span>
      </div>
    </div>
  );
}
