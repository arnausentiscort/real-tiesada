import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { VB_W, VB_H, F, pct2svg, FieldLines } from './pitch/FieldLines.jsx';
import { buildTimeline } from '../drills.js';

const TR = 14;      // radi token
const BALL_R = 6.5;

const ARROW_STYLE = {
  run:   { color: '#E5C07B', dash: null,    width: 2.6 },
  pass:  { color: '#ffffff', dash: '7 5',   width: 2.2 },
  press: { color: '#C0392B', dash: null,    width: 3   },
  carry: { color: '#7BC0A0', dash: '3 4',   width: 2.4 },
};

const ease = k => (k < 0.5 ? 4*k*k*k : 1 - Math.pow(-2*k + 2, 3) / 2);
const lerp  = (a, b, k) => a + (b - a) * k;
const lerp2 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
const lerpArr = (a = [], b = [], k) => b.map((p, i) => (a[i] ? lerp2(a[i], p, k) : p));

function frameAt(steps, timeline, t) {
  const { segs } = timeline;
  let seg = segs[segs.length - 1];
  for (const s of segs) { if (t < s.holdEnd) { seg = s; break; } }
  const i = seg.i;
  if (i > 0 && t < seg.travelEnd) {
    const k = ease((t - seg.travelStart) / (seg.travelEnd - seg.travelStart));
    const a = steps[i-1], b = steps[i];
    return {
      own:    lerpArr(a.own, b.own, k),
      rivals: lerpArr(a.rivals, b.rivals, k),
      ball:   lerp2(a.ball, b.ball, k),
      display: i - 1,
      moving: true,
    };
  }
  const s = steps[i];
  return { own: s.own, rivals: s.rivals, ball: s.ball, display: i, moving: false };
}

// ── Fletxa amb punta ─────────────────────────────────────────────
const Arrow = memo(function Arrow({ a, idx, dim }) {
  const st = ARROW_STYLE[a.type] || ARROW_STYLE.run;
  const p1 = pct2svg(a.from), p2 = pct2svg(a.to);
  const dx = p2.x - p1.x, dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  // separa la fletxa del centre de les fitxes
  const ux = dx / len, uy = dy / len;
  const s = { x: p1.x + ux * (TR + 2), y: p1.y + uy * (TR + 2) };
  const e = { x: p2.x - ux * 6, y: p2.y - uy * 6 };
  // corba lleugera per llegibilitat
  const mx = (s.x + e.x) / 2 - uy * len * 0.12;
  const my = (s.y + e.y) / 2 + ux * len * 0.12;
  const mid = { x: 0.25*s.x + 0.5*mx + 0.25*e.x, y: 0.25*s.y + 0.5*my + 0.25*e.y };
  return (
    <g opacity={dim ? 0.25 : 0.95}>
      <path d={`M${s.x} ${s.y} Q${mx} ${my} ${e.x} ${e.y}`}
        fill="none" stroke={st.color} strokeWidth={st.width} strokeLinecap="round"
        strokeDasharray={st.dash || undefined}
        markerEnd={`url(#ah-${a.type})`}>
        {st.dash && !dim && (
          <animate attributeName="stroke-dashoffset" from="24" to="0" dur="0.8s" repeatCount="indefinite"/>
        )}
      </path>
      {a.label && !dim && (
        <text x={mid.x} y={mid.y - 6} textAnchor="middle" fontSize={9} fontWeight="bold"
          fill={st.color} stroke="#121212" strokeWidth={3} paintOrder="stroke">
          {a.label}
        </text>
      )}
    </g>
  );
});

const OwnToken = memo(function OwnToken({ pos, role, hot }) {
  const { x, y } = pct2svg(pos);
  return (
    <g>
      <circle cx={x} cy={y+2.5} r={TR+2} fill="rgba(0,0,0,0.4)"/>
      {hot && (
        <circle cx={x} cy={y} r={TR+5} fill="none" stroke="#E5C07B" strokeWidth={2} opacity={0.6}>
          <animate attributeName="r" values={`${TR+3};${TR+8};${TR+3}`} dur="1.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;0;0.7" dur="1.4s" repeatCount="indefinite"/>
        </circle>
      )}
      <circle cx={x} cy={y} r={TR} fill="#1E1E1E" stroke="#E5C07B" strokeWidth={2.4}/>
      <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
        fontSize={role.length > 4 ? 7.5 : 9} fontWeight="900" fill="#E5C07B">{role}</text>
    </g>
  );
});

const RivalToken = memo(function RivalToken({ pos, idx }) {
  const { x, y } = pct2svg(pos);
  return (
    <g>
      <circle cx={x} cy={y+2.5} r={TR+2} fill="rgba(0,0,0,0.4)"/>
      <circle cx={x} cy={y} r={TR} fill="#C0392B" fillOpacity={0.9} stroke="#ff6b6b" strokeWidth={1.6} strokeOpacity={0.7}/>
      <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
        fontSize={9} fontWeight="bold" fill="#fff">R{idx+1}</text>
    </g>
  );
});

// ── Reproductor ──────────────────────────────────────────────────
export default function DrillPlayer({ drill, autoPlay = false }) {
  const steps = drill?.steps || [];
  const timeline = useMemo(() => buildTimeline(steps), [drill]);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(true);
  const raf = useRef(null);
  const last = useRef(0);
  const tRef = useRef(0);

  useEffect(() => { tRef.current = 0; setT(0); setPlaying(autoPlay); }, [drill?.id]);

  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const tick = (now) => {
      const dt = (now - last.current) * speed;
      last.current = now;
      let next = tRef.current + dt;
      if (next >= timeline.total) {
        if (loop) next = 0;
        else { next = timeline.total; tRef.current = next; setT(next); setPlaying(false); return; }
      }
      tRef.current = next;
      setT(next);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, speed, loop, timeline.total]);

  const seek = useCallback((ms) => {
    const v = Math.max(0, Math.min(timeline.total, ms));
    tRef.current = v; setT(v);
  }, [timeline.total]);

  const frame = frameAt(steps, timeline, t);
  const step  = steps[frame.display] || steps[0];
  const ballSvg = pct2svg(frame.ball || [50,50]);

  // travelEnd, no travelStart: a l'inici de la transicio encara es dibuixa
  // la fase anterior, i saltar a la fase 4 ensenyava la 3.
  const gotoStep = (i) => { seek(timeline.segs[i].travelEnd); };
  const prevStep = () => gotoStep(Math.max(0, frame.display - (frame.moving ? 0 : 1)));
  const nextStep = () => gotoStep(Math.min(steps.length - 1, frame.display + 1));

  const onKey = (e) => {
    if (e.key === ' ')          { e.preventDefault(); setPlaying(p => !p); }
    if (e.key === 'ArrowRight') { e.preventDefault(); nextStep(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prevStep(); }
  };

  if (!drill) return null;

  return (
    <div className="space-y-2.5" tabIndex={0} onKeyDown={onKey} style={{ outline: 'none' }}>

      {/* Camp */}
      <div className="rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/5 mx-auto w-full"
        style={{ maxWidth: `calc(min(62vh, 600px) * ${VB_W / VB_H})` }}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" className="block select-none">
          <defs>
            {Object.entries(ARROW_STYLE).map(([k, st]) => (
              <marker key={k} id={`ah-${k}`} viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0,1 L9,5 L0,9 z" fill={st.color}/>
              </marker>
            ))}
            <filter id="drillBallGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="1.6" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <rect width={VB_W} height={VB_H} fill="#0a0a0a"/>
          <rect x={F.x} y={F.y} width={F.w} height={F.h} fill="#1c3d1c"/>
          <FieldLines mode={drill.mode}/>

          <text x={F.x+F.w/2} y={F.y+F.h-10} textAnchor="middle" fontSize={9}
            fill="rgba(229,192,123,0.35)" fontWeight="bold" letterSpacing={1}>REAL TIESADA</text>
          <text x={F.x+F.w/2} y={F.y+18} textAnchor="middle" fontSize={9}
            fill="rgba(192,57,43,0.35)" fontWeight="bold" letterSpacing={1}>RIVAL</text>

          {/* Zona destacada */}
          {step?.zone && (() => {
            const c = pct2svg([step.zone.cx, step.zone.cy]);
            const r = (step.zone.r / 100) * F.w;
            return (
              <g opacity={frame.moving ? 0.35 : 0.75}>
                <circle cx={c.x} cy={c.y} r={r} fill="rgba(192,57,43,0.13)"
                  stroke="rgba(192,57,43,0.55)" strokeWidth={1.5} strokeDasharray="6 5"/>
                {step.zone.label && (
                  <text x={c.x} y={c.y - r - 5} textAnchor="middle" fontSize={9} fontWeight="bold"
                    fill="#ff8f85" stroke="#121212" strokeWidth={3} paintOrder="stroke">
                    {step.zone.label}
                  </text>
                )}
              </g>
            );
          })()}

          {/* Fletxes de la fase actual */}
          {(step?.arrows || []).map((a, i) => (
            <Arrow key={`a-${frame.display}-${i}`} a={a} idx={i} dim={frame.moving}/>
          ))}

          {(frame.rivals || []).map((p, i) => <RivalToken key={`r${i}`} pos={p} idx={i}/>)}
          {(frame.own || []).map((p, i) => (
            <OwnToken key={`o${i}`} pos={p} role={drill.roles[i] || String(i+1)}
              hot={!frame.moving && (step?.highlight || []).includes(i)}/>
          ))}

          <circle cx={ballSvg.x} cy={ballSvg.y} r={BALL_R} fill="#fff" fillOpacity={0.95}
            stroke="#FFD700" strokeWidth={1.2} filter="url(#drillBallGlow)"/>
        </svg>
      </div>

      {/* Narració de la fase */}
      <div className="bg-[#121212] border border-[#E5C07B]/15 rounded-xl p-3">
        <div className="flex items-start gap-2.5">
          <span className="shrink-0 w-6 h-6 rounded-lg bg-[#E5C07B]/15 text-[#E5C07B] text-[11px] font-black flex items-center justify-center">
            {frame.display + 1}
          </span>
          <p className="text-[12px] md:text-[13px] text-gray-300 leading-snug">{step?.note}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#1E1E1E] border border-white/5 rounded-xl p-2.5 space-y-2">
        <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
          <button onClick={() => { seek(0); setPlaying(true); }} title="Tornar a començar"
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">↺</button>
          <button onClick={prevStep} title="Fase anterior"
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">⏮</button>
          <button onClick={() => setPlaying(p => !p)}
            className="w-11 h-11 rounded-xl bg-[#E5C07B] text-black text-lg font-black hover:bg-[#d4b06a] transition-colors">
            {playing ? '❙❙' : '▶'}
          </button>
          <button onClick={nextStep} title="Fase següent"
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">⏭</button>

          <div className="flex-1"/>

          <button onClick={() => setLoop(l => !l)} title="Repetir"
            className={`px-2.5 h-9 rounded-lg text-[11px] font-bold border transition-all ${
              loop ? 'bg-[#E5C07B]/15 border-[#E5C07B]/30 text-[#E5C07B]' : 'bg-white/5 border-white/10 text-gray-500'}`}>🔁</button>
          <div className="flex bg-[#121212] border border-white/10 rounded-lg p-0.5 gap-0.5">
            {[0.5, 1, 1.5].map(s => (
              <button key={s} onClick={() => setSpeed(s)}
                className={`px-2 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                  speed === s ? 'bg-[#E5C07B]/20 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
                {s}×
              </button>
            ))}
          </div>
        </div>

        {/* Barra de temps amb marques de fase */}
        <div className="relative">
          <input type="range" min={0} max={timeline.total} value={t} step={10}
            onChange={e => { setPlaying(false); seek(Number(e.target.value)); }}
            className="w-full accent-[#E5C07B] h-1.5 cursor-pointer"/>
          <div className="flex gap-1 mt-1.5">
            {steps.map((s, i) => (
              <button key={i} onClick={() => { gotoStep(i); }}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  i === frame.display ? 'bg-[#E5C07B]' : i < frame.display ? 'bg-[#E5C07B]/35' : 'bg-white/10'}`}
                title={`Fase ${i+1}`}/>
            ))}
          </div>
        </div>
      </div>

      {/* Llegenda */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9.5px] text-gray-600 px-1">
        <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-[#E5C07B] inline-block rounded"/> desmarcatge</span>
        <span className="flex items-center gap-1"><span className="w-4 h-0.5 inline-block rounded" style={{background:'repeating-linear-gradient(90deg,#fff 0 3px,transparent 3px 6px)'}}/> passada</span>
        <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-[#C0392B] inline-block rounded"/> pressió</span>
        <span className="hidden md:inline text-gray-700">· Espai = play/pausa · ← → canvia de fase</span>
      </div>
    </div>
  );
}
