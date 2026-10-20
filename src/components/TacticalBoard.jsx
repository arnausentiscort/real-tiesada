import React, { useState, useRef, useCallback, memo, useEffect } from 'react';
import { useSeason } from '../SeasonContext.jsx';
import { VB_W, VB_H, F, pct2svg, svg2pct, FieldLines } from './pitch/FieldLines.jsx';
import { saveCustomDrill, slugify, drillToJson, withAutoArrows } from '../drillStore.js';
import { DRILL_CATEGORIES } from '../drills.js';
import DrillPlayer from './DrillPlayer.jsx';

const BASE = import.meta.env.BASE_URL;

// ── Constants SVG ────────────────────────────────────────────────
const R = 15;   // radi token camp (SVG)
const BR = 20;  // radi token banquillo (px)
const BALL_R = 8;  // radi pilota (SVG)

// ── Detecció device ──────────────────────────────────────────────
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
};

const useIsTablet = () => {
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1024 && window.innerWidth >= 768);
  useEffect(() => {
    const handleResize = () => setIsTablet(window.innerWidth < 1024 && window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isTablet;
};

// ── Modes ────────────────────────────────────────────────────────
const MODES = {
  fs5: { label: 'Sala 5v5',  n: 5  },
  f7:  { label: 'Futbol 7',  n: 7  },
  f11: { label: 'Futbol 11', n: 11 },
};

// ── Posicions per defecte (% camp) ───────────────────────────────
// Sempre a la meitat inferior (>=~52%) perquè quedi un marge net amb
// els rivals (RIVAL_PCT, meitat superior) i eviti la col·lisió inicial.
// Formacions seleccionables per al mode f7 (porter + 6 jugadors de camp).
// Cada entrada és [GK, ...6 posicions de camp] en % del camp.
const FORMATIONS_F7 = {
  '2-3-1': [[50,92],[25,80],[75,80],[20,62],[50,62],[80,62],[50,52]],
  '2-2-2': [[50,92],[12,80],[88,80],[32,55],[68,55],[8,24],[92,24]],
  '3-1-2': [[50,92],[20,78],[50,78],[80,78],[50,62],[30,50],[70,50]],
  '3-2-1': [[50,92],[20,78],[50,78],[80,78],[30,62],[70,62],[50,50]],
};

// Quina posició va a cada casella de la formació (mateix ordre que FORMATIONS_F7)
const SLOTS_F7 = {
  '2-3-1': ['Porter','Defensa','Defensa','Migcampista','Migcampista','Migcampista','Davanter'],
  '2-2-2': ['Porter','Defensa','Defensa','Migcampista','Migcampista','Davanter','Davanter'],
  '3-1-2': ['Porter','Defensa','Defensa','Defensa','Migcampista','Davanter','Davanter'],
  '3-2-1': ['Porter','Defensa','Defensa','Defensa','Migcampista','Migcampista','Davanter'],
};

// Cada jugador a una casella de la seva posició; els que sobren omplen la resta
function arrangeBySlots(names, slots, posOf) {
  const left = [...names];
  const out = slots.map(pos => {
    const i = left.findIndex(n => posOf(n) === pos);
    return i === -1 ? null : left.splice(i, 1)[0];
  });
  return out.map(n => n ?? left.shift()).filter(Boolean);
}

const DEF_PCT = {
  fs5: [[50,92],[25,75],[75,75],[25,55],[75,55]],
  f7:  FORMATIONS_F7['2-3-1'],
  f11: [[50,92],[15,80],[38,80],[62,80],[85,80],[25,65],[50,65],[75,65],[20,52],[50,52],[80,52]],
};

// Rivals sempre a la meitat superior del camp (y SVG entre ~30 i ~300,
// per sota de VB_H=660) i els nostres a la inferior — vegeu DEF_PCT.
// Cap punt d'aquí ha de superar el ~42% perquè no s'apropi als nostres.
const RIVAL_PCT = {
  fs5: [[50,8],[25,25],[75,25],[25,42],[75,42]],
  f7:  [[50,6],[25,18],[75,18],[15,30],[50,30],[85,30],[50,40]],
  f11: [[50,5],[15,18],[38,18],[62,18],[85,18],[25,30],[50,30],[75,30],[20,40],[50,40],[80,40]],
};

// ── Alineacions per defecte ───────────────────────────────────────
const DEF_LINEUP = {
  fs5: ['Ivan Mico','Marc Farreras','Pau Ibañez','Joan Medina','Arnau Sentis'],
  f7:  ['Joan Ribes','Pau Ibañez','Roger Miro','Arnau Sentis','Paco Montero','Joan Medina','Marc Farreras'],
  f11: ['Oriol Tomas','Roi Seoane','Ivan Mico','Marc Farreras','Joan Medina',
        'Pau Ibañez','Paco Montero','Chengzhi Li','Arnau Sentis','Andreu Cases','Roger Miro'],
};

// ── Helpers ──────────────────────────────────────────────────────
const mkField  = (m, pct) => DEF_LINEUP[m].map((name, i) => ({ name, ...pct2svg((pct || DEF_PCT[m])[i]) }));
const mkRivals = m => RIVAL_PCT[m].map(pct2svg);
const clamp    = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Empeny `pos` lluny de qualsevol token de `others` que quedi a menys de
// minDist (dos radis + marge), fins a la distància mínima — no el deixa mai a sobre.
function resolveCollisions(pos, others, minDist) {
  let { x, y } = pos;
  others.forEach(o => {
    const dx = x - o.x, dy = y - o.y;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) { x += minDist; return; }
    if (dist < minDist) {
      const push = minDist - dist;
      x += (dx / dist) * push;
      y += (dy / dist) * push;
    }
  });
  return { x, y };
}

// ── Component Pilota ──────────────────────────────────────────────
const Ball = memo(({ ball, onDown, onMove, onUp }) => {
  if (!ball) return null;
  return (
    <circle cx={ball.x} cy={ball.y} r={BALL_R} fill="#fff" fillOpacity={0.9} stroke="#FFD700" strokeWidth={1.2}
      filter="url(#ballGlow)"
      style={{ cursor:'grab', touchAction:'none' }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}/>
  );
});

const SUB_COLOR = '#6FA8FF';
const SubToken = ({ p, info, adaptiveR, others, moves, onRemove }) => {
  const r = adaptiveR * 0.62;
  // Sota del titular; si hi ha algú o surt del camp, dalt o a un costat
  const spots = [
    [p.x, p.y + adaptiveR + 14 + r], [p.x, p.y - adaptiveR - 6 - r],
    [p.x + adaptiveR + r + 6, p.y + r], [p.x - adaptiveR - r - 6, p.y + r],
  ];
  const free = ([x, y]) => y + r + 2 < F.y + F.h && y - r > F.y && x - r > F.x && x + r + 40 < F.x + F.w + 30
    && others.every(o => Math.hypot(o.x - x, o.y - y) > adaptiveR + r + 12);
  const [cx, cy] = spots.find(free) || spots[0];
  const label = (moves ? '↕ ' : '') + (info?.shirtName || p.sub.split(' ')[0]).slice(0, 9);
  const clipId = `sub-${p.sub.replace(/\W/g, '')}`;
  return (
    <g style={{ cursor: 'pointer' }} onClick={onRemove}>
      <circle cx={cx} cy={cy} r={r + 1.5} fill="none" stroke={SUB_COLOR} strokeWidth={1.8}/>
      <circle cx={cx} cy={cy} r={r} fill={info?.photo ? '#0a0a0a' : 'rgba(111,168,255,0.2)'}/>
      {info?.photo ? (
        <>
          <clipPath id={clipId}><circle cx={cx} cy={cy} r={r}/></clipPath>
          <image href={`${BASE}${info.photo}`} x={cx - r} y={cy - r} width={r * 2} height={r * 2}
            clipPath={`url(#${clipId})`} preserveAspectRatio="xMidYMin slice" opacity={0.85}/>
        </>
      ) : (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={9} fontWeight="bold" fill={SUB_COLOR}>{p.sub[0]}</text>
      )}
      <text x={cx + r + 3} y={cy} dominantBaseline="middle" fontSize={7} fontWeight="bold" fill={SUB_COLOR}
        stroke="#0d1f0d" strokeWidth={2} paintOrder="stroke">{label}</text>
    </g>
  );
};

const OwnToken = memo(({ p, idx, info, onDown, onMove, onUp, adaptiveR }) => {
  const clipId = `cp-${idx}-${p.name.replace(/\s+/g, '')}`;
  return (
    <g style={{ cursor:'grab', touchAction:'none' }}
      onPointerDown={e => onDown(idx, e)}
      onPointerMove={e => onMove(idx, e)}
      onPointerUp={onUp}
      onPointerCancel={onUp}>
      <circle cx={p.x} cy={p.y+3} r={adaptiveR+3} fill="rgba(0,0,0,0.35)"/>
      <circle cx={p.x} cy={p.y} r={adaptiveR+1.5} fill="none" stroke="#E5C07B" strokeWidth={2} strokeOpacity={0.9}/>
      <circle cx={p.x} cy={p.y} r={adaptiveR} fill={info?.photo ? '#0a0a0a' : 'rgba(229,192,123,0.15)'}/>
      {info?.photo ? (
        <>
          <defs>
            <clipPath id={clipId}>
              <circle cx={p.x} cy={p.y} r={adaptiveR}/>
            </clipPath>
          </defs>
          <image href={`${BASE}${info.photo}`} x={p.x-adaptiveR} y={p.y-adaptiveR} width={adaptiveR*2} height={adaptiveR*2}
            clipPath={`url(#${clipId})`} preserveAspectRatio="xMidYMin slice" draggable={false}/>
        </>
      ) : (
        <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
          fontSize={13} fontWeight="900" fill="#E5C07B" style={{pointerEvents:'none'}}>
          {p.name[0]}
        </text>
      )}
      <text x={p.x} y={p.y+adaptiveR+9} textAnchor="middle" fontSize={8.5} fontWeight="bold"
        fill="rgba(255,255,255,0.92)" stroke="#121212" strokeWidth={3} paintOrder="stroke"
        style={{pointerEvents:'none'}}>
        {(info?.shirtName || p.name.split(' ')[0]).slice(0,12)}
      </text>
      {info?.status === 'lesionat' && (
        <text x={p.x+adaptiveR*0.75} y={p.y-adaptiveR*0.75} textAnchor="middle" fontSize={10}
          style={{pointerEvents:'none'}}>🩹</text>
      )}
    </g>
  );
});

const RivalToken = memo(({ pos, idx, onDown, onMove, onUp, adaptiveR }) => (
  <g style={{ cursor:'grab', touchAction:'none' }}
    onPointerDown={e => onDown(idx,e)}
    onPointerMove={e => onMove(idx,e)}
    onPointerUp={onUp}
    onPointerCancel={onUp}>
    <circle cx={pos.x} cy={pos.y+2} r={adaptiveR+2} fill="rgba(0,0,0,0.35)"/>
    <circle cx={pos.x} cy={pos.y} r={adaptiveR+1.5} fill="none" stroke="#ff6b6b" strokeWidth={1.6} strokeOpacity={0.7}/>
    <circle cx={pos.x} cy={pos.y} r={adaptiveR} fill="#C0392B" fillOpacity={0.9}/>
    <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
      fontSize={10} fontWeight="bold" fill="white" style={{pointerEvents:'none'}}>
      R{idx+1}
    </text>
  </g>
));

// ── Component principal ───────────────────────────────────────────
export default function TacticalBoard() {
  const { db: DATABASE, format } = useSeason();
  // Els 'baixa' ja no formen part de l'equip — no surten enlloc de la
  // pissarra (alineació per defecte, banquillo ni convocatòria). Els
  // 'lesionat' sí que hi surten, amb el badge 🩹.
  const roster = DATABASE.roster.filter(p => p.status !== 'baixa');
  const baixaNames = new Set(DATABASE.roster.filter(p => p.status === 'baixa').map(p => p.name));
  const svgRef = useRef(null);
  const fieldDrag = useRef(null);
  const benchDrag = useRef(null);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Mode per defecte derivat de la temporada activa (fs5 a S1/S2, f7 a
  // S3) — ara que consumim useSeason() ja no cal el TODO de la Fase 1c.
  const [mode, setMode] = useState(format.id);
  const [formation, setFormation] = useState('2-3-1');
  const [unavailable, setUnavailable] = useState([]);
  const [showConv, setShowConv] = useState(false);
  const [showRivals, setShowRivals] = useState(false);

  const fieldPct = m => (m === 'f7' ? FORMATIONS_F7[formation] : DEF_PCT[m]);

  const posOf = name => DATABASE.roster.find(p => p.name === name)?.position;
  const placeF7 = (names, f) => arrangeBySlots(names, SLOTS_F7[f], posOf)
    .slice(0, 7).map((name, i) => ({ name, ...pct2svg(FORMATIONS_F7[f][i]) }));
  const buildField = (m, out = []) => m === 'f7'
    ? placeF7(roster.filter(p => p.status === 'actiu' && !out.includes(p.name)).map(p => p.name), formation)
    : mkField(m, fieldPct(m)).filter(p => !out.includes(p.name) && !baixaNames.has(p.name));

  const [fieldPlayers, setFieldPlayers] = useState(() => buildField(format.id));
  const [rivalPos, setRivalPos] = useState(() => mkRivals(format.id));
  const [ghost, setGhost] = useState(null);
  const [ball, setBall] = useState({ x: F.x + F.w / 2, y: F.y + F.h / 2 });

  // ── Gravadora de jugades ─────────────────────────────────────────
  const [recording, setRecording] = useState(false);
  const [subMode, setSubMode] = useState(false);
  const [frames, setFrames]       = useState([]);
  const [showSave, setShowSave]   = useState(false);
  const [preview, setPreview]     = useState(null);
  const [meta, setMeta]           = useState({ title: '', category: 'pressio' });

  const captureFrame = () => {
    setFrames(prev => [...prev, {
      note: '',
      own:    fieldPlayers.filter(p => p.name).map(p => svg2pct(p)),
      rivals: showRivals ? rivalPos.map(p => svg2pct(p)) : [],
      ball:   svg2pct(ball),
      names:  fieldPlayers.filter(p => p.name).map(p => p.name),
    }]);
  };

  const restoreFrame = (i) => {
    const f = frames[i];
    if (!f) return;
    setFieldPlayers(f.names.map((name, k) => ({ name, ...pct2svg(f.own[k]) })));
    if (f.rivals.length) { setShowRivals(true); setRivalPos(f.rivals.map(pct2svg)); }
    setBall(pct2svg(f.ball));
  };

  const setFrameNote = (i, note) =>
    setFrames(prev => prev.map((f, k) => k === i ? { ...f, note } : f));

  const removeFrame = (i) => setFrames(prev => prev.filter((_, k) => k !== i));

  const buildDrill = () => {
    const first = frames[0];
    const roles = (first?.names || []).map(n => {
      const info = getInfo(n);
      return (info?.shirtName || n.split(' ')[0]).slice(0, 5);
    });
    return {
      id: `${slugify(meta.title)}-${Date.now().toString(36).slice(-4)}`,
      title: meta.title.trim() || 'Jugada sense nom',
      category: meta.category,
      mode,
      roles,
      summary: '',
      keys: [],
      steps: withAutoArrows(frames.map(f => ({
        note: f.note || '',
        own: f.own, rivals: f.rivals, ball: f.ball,
      }))),
    };
  };

  const saveDrill = () => {
    const drill = buildDrill();
    saveCustomDrill(drill);
    setShowSave(false);
    setRecording(false);
    setFrames([]);
    setMeta({ title: '', category: 'pressio' });
    window.alert('Jugada desada. La trobaràs a la pestanya Jugades.');
  };

  const exportDrill = () => {
    const json = drillToJson(buildDrill());
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${slugify(meta.title || 'jugada')}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    navigator.clipboard?.writeText(json).catch(() => {});
  };

  // Radi adaptatiu per mòbil
  const adaptiveR = isMobile ? R * 1.2 : R;
  const adaptiveBR = isMobile ? BR * 1.15 : BR;
  const minDist = adaptiveR * 2 + 3;

  const getInfo = useCallback(name => roster.find(p => p.name === name), [roster]);
  const benchPlayers = roster.filter(p => !fieldPlayers.some(fp => fp.name === p.name || fp.sub === p.name) && !unavailable.includes(p.name));
  const hasSubs = fieldPlayers.some(p => p.sub);
  // Els suplents passen a titulars i els titulars a suplents
  const swapSubs = () => setFieldPlayers(prev => {
    const next = prev.map(p => p.sub ? { ...p, name: p.sub, sub: p.name || undefined } : p);
    const moved = new Set(next.filter((p, i) => prev[i].sub).map(p => p.name));
    return next.map((p, i) => !prev[i].sub && p.name && moved.has(p.name) ? { ...p, name: null, sub: p.name } : p);
  });
  const removeSub = idx => setFieldPlayers(prev => prev[idx].name
    ? prev.map((p, i) => i === idx ? { ...p, sub: undefined } : p)
    : prev.filter((_, i) => i !== idx));

  const toSvg = useCallback((cx, cy) => {
    const rect = svgRef.current.getBoundingClientRect();
    return { x: ((cx-rect.left)/rect.width)*VB_W, y: ((cy-rect.top)/rect.height)*VB_H };
  }, []);

  const switchMode = m => {
    setMode(m);
    setFieldPlayers(buildField(m, unavailable));
    setRivalPos(mkRivals(m));
    setGhost(null); fieldDrag.current = null; benchDrag.current = null;
    setBall({ x: F.x + F.w / 2, y: F.y + F.h / 2 });
  };

  const reset = () => {
    setFieldPlayers(buildField(mode, unavailable));
    setRivalPos(mkRivals(mode));
    setGhost(null); fieldDrag.current = null; benchDrag.current = null;
    setBall({ x: F.x + F.w / 2, y: F.y + F.h / 2 });
  };

  const switchFormation = f => {
    setFormation(f);
    // Primer els que ja són al camp; si falta algú d'una posició, surt de la banqueta
    setFieldPlayers(prev => {
      const onField = prev.map(p => p.name);
      const bench = roster.filter(p => p.status === 'actiu' && !onField.includes(p.name) && !unavailable.includes(p.name)).map(p => p.name);
      const subOf = Object.fromEntries(prev.filter(p => p.sub).map(p => [p.name, p.sub]));
      const subs = Object.values(subOf);
      return placeF7([...onField, ...bench.filter(n => !subs.includes(n))], f)
        .map(p => subOf[p.name] ? { ...p, sub: subOf[p.name] } : p);
    });
  };

  const toggleAvail = name => {
    setUnavailable(prev => {
      const next = prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name];
      if (!prev.includes(name)) {
        setFieldPlayers(fp => fp.filter(p => p.name !== name).map(p => p.sub === name ? { ...p, sub: undefined } : p));
      }
      return next;
    });
  };

  // ── Drag jugadors propis ─────────────────────────────────────────
  const onOwnDown = useCallback((idx, e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = toSvg(e.clientX, e.clientY);
    const p = fieldPlayers[idx];
    fieldDrag.current = { type:'own', idx, pid:e.pointerId, ox:x-p.x, oy:y-p.y, from: { x: p.x, y: p.y } };
  }, [fieldPlayers, toSvg]);
  
  const onOwnMove = useCallback((idx, e) => {
    const d = fieldDrag.current;
    if (!d || d.type!=='own' || d.idx!==idx || d.pid!==e.pointerId) return;
    const { x, y } = toSvg(e.clientX, e.clientY);
    const nx = clamp(x-d.ox, F.x+adaptiveR, F.x+F.w-adaptiveR);
    const ny = clamp(y-d.oy, F.y+adaptiveR, F.y+F.h-adaptiveR);
    setFieldPlayers(prev => prev.map((p,i) => i===idx ? {...p,x:nx,y:ny} : p));
  }, [toSvg, adaptiveR]);
  
  const onOwnUp = useCallback(e => {
    const d = fieldDrag.current;
    if (!d || d.type!=='own' || d.pid!==e.pointerId) return;
    const { idx } = d;
    fieldDrag.current = null;
    // Tocar sense arrossegar: surt del camp (si tenia suplent, entra ell)
    const { x: ux, y: uy } = toSvg(e.clientX, e.clientY);
    if (!recording && Math.hypot(ux - d.ox - d.from.x, uy - d.oy - d.from.y) < 3) {
      setFieldPlayers(prev => {
        const out = prev[idx].name;
        return prev
          .map((p, i) => i === idx ? (p.sub && !prev.some(q => q.name === p.sub) ? { ...p, name: p.sub, sub: undefined, ...d.from } : null) : p)
          .filter(Boolean)
          .map(p => p.sub === out ? { ...p, sub: undefined } : p)
          .filter(p => p.name || p.sub);
      });
      return;
    }
    if (subMode) {
      setFieldPlayers(prev => {
        const me = prev[idx];
        let ti = -1, td = adaptiveR * 2.2;
        prev.forEach((p, i) => { const dd = Math.hypot(p.x - me.x, p.y - me.y); if (i !== idx && p.name && dd < td) { td = dd; ti = i; } });
        if (ti === -1) return prev;
        return prev.map((p, i) => i === idx ? { ...p, ...d.from } : i === ti ? { ...p, sub: me.name } : p);
      });
      return;
    }
    setFieldPlayers(prev => {
      const others = [...prev.filter((_,i) => i!==idx), ...rivalPos];
      const moved = resolveCollisions(prev[idx], others, minDist);
      const nx = clamp(moved.x, F.x+adaptiveR, F.x+F.w-adaptiveR);
      const ny = clamp(moved.y, F.y+adaptiveR, F.y+F.h-adaptiveR);
      return prev.map((p,i) => i===idx ? {...p, x:nx, y:ny} : p);
    });
  }, [rivalPos, adaptiveR, subMode, recording, toSvg]);

  // ── Drag rivals ──────────────────────────────────────────────────
  const onRivDown = useCallback((idx, e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = toSvg(e.clientX, e.clientY);
    const p = rivalPos[idx];
    fieldDrag.current = { type:'rival', idx, pid:e.pointerId, ox:x-p.x, oy:y-p.y };
  }, [rivalPos, toSvg]);
  
  const onRivMove = useCallback((idx, e) => {
    const d = fieldDrag.current;
    if (!d || d.type!=='rival' || d.idx!==idx || d.pid!==e.pointerId) return;
    const { x, y } = toSvg(e.clientX, e.clientY);
    const nx = clamp(x-d.ox, F.x+adaptiveR, F.x+F.w-adaptiveR);
    const ny = clamp(y-d.oy, F.y+adaptiveR, F.y+F.h-adaptiveR);
    setRivalPos(prev => prev.map((p,i) => i===idx ? {x:nx,y:ny} : p));
  }, [toSvg, adaptiveR]);
  
  const onRivUp = useCallback(e => {
    const d = fieldDrag.current;
    if (!d || d.type!=='rival' || d.pid!==e.pointerId) return;
    const { idx } = d;
    fieldDrag.current = null;
    setRivalPos(prev => {
      const others = [...prev.filter((_,i) => i!==idx), ...fieldPlayers];
      const moved = resolveCollisions(prev[idx], others, minDist);
      const nx = clamp(moved.x, F.x+adaptiveR, F.x+F.w-adaptiveR);
      const ny = clamp(moved.y, F.y+adaptiveR, F.y+F.h-adaptiveR);
      return prev.map((p,i) => i===idx ? {x:nx, y:ny} : p);
    });
  }, [fieldPlayers, adaptiveR]);

  // ── Drag pilota ──────────────────────────────────────────────────
  const onBallDown = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = toSvg(e.clientX, e.clientY);
    fieldDrag.current = { type:'ball', pid:e.pointerId, ox:x-ball.x, oy:y-ball.y };
  }, [ball, toSvg]);
  
  const onBallMove = useCallback((e) => {
    const d = fieldDrag.current;
    if (!d || d.type!=='ball' || d.pid!==e.pointerId) return;
    const { x, y } = toSvg(e.clientX, e.clientY);
    const nx = clamp(x-d.ox, F.x+BALL_R, F.x+F.w-BALL_R);
    const ny = clamp(y-d.oy, F.y+BALL_R, F.y+F.h-BALL_R);
    setBall({x:nx, y:ny});
  }, [toSvg]);
  
  const onBallUp = useCallback(e => { 
    if (fieldDrag.current?.pid===e.pointerId) fieldDrag.current=null; 
  }, []);

  // ── Drag del banquillo ───────────────────────────────────────────
  const onBenchDown = (name, e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    benchDrag.current = { name, pid:e.pointerId };
    const info = getInfo(name);
    setGhost({ name, photo:info?.photo, x:e.clientX, y:e.clientY });
  };
  const onBenchMove = e => {
    const d = benchDrag.current;
    if (!d || d.pid!==e.pointerId) return;
    setGhost(prev => prev ? {...prev, x:e.clientX, y:e.clientY} : null);
  };
  const onBenchUp = e => {
    const d = benchDrag.current;
    if (!d || d.pid!==e.pointerId) return;
    const name = d.name;
    benchDrag.current = null; setGhost(null);

    const svgEl = svgRef.current;
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right ||
        e.clientY < rect.top  || e.clientY > rect.bottom) return;

    const { x, y } = toSvg(e.clientX, e.clientY);
    if (x < F.x+adaptiveR || x > F.x+F.w-adaptiveR || y < F.y+adaptiveR || y > F.y+F.h-adaptiveR) return;

    let nearIdx = -1, nearDist = adaptiveR * 3;
    fieldPlayers.forEach((p, i) => {
      const dist = Math.hypot(p.x-x, p.y-y);
      if (dist < nearDist) { nearDist=dist; nearIdx=i; }
    });

    if (subMode) {
      if (nearIdx === -1) {
        let nd = Infinity;
        fieldPlayers.forEach((p, i) => { const dist = Math.hypot(p.x-x, p.y-y); if (dist < nd) { nd = dist; nearIdx = i; } });
      }
      if (nearIdx !== -1) setFieldPlayers(prev => prev.map((p,i) => i===nearIdx ? {...p, sub: name} : p));
      return;
    }

    if (nearIdx !== -1) {
      setFieldPlayers(prev => prev.map((p,i) => i===nearIdx ? {...p, name} : p));
    } else if (fieldPlayers.length < MODES[mode].n) {
      setFieldPlayers(prev => [...prev, { name, x, y }]);
    } else {
      let ni = 0, nd = Infinity;
      fieldPlayers.forEach((p,i) => { const dist=Math.hypot(p.x-x,p.y-y); if(dist<nd){nd=dist;ni=i;} });
      setFieldPlayers(prev => prev.map((p,i) => i===ni ? {...p, name} : p));
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-3 md:p-4">

        {/* Capçalera */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-3 mb-3 md:mb-4">
          <h2 className="text-base md:text-lg font-black text-[#E5C07B]">🎯 Pissarra Tàctica</h2>
          <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
            <button onClick={() => setShowConv(true)}
              className="px-2.5 md:px-3 py-1.5 bg-[#E5C07B]/10 border border-[#E5C07B]/30 rounded-lg md:rounded-xl text-[11px] md:text-xs text-[#E5C07B] font-bold hover:bg-[#E5C07B]/20 transition-all flex items-center gap-1 flex-shrink-0">
              <span>👥</span> <span className="hidden sm:inline">Convocatòria</span>
            </button>
            <button onClick={() => setShowRivals(v => !v)}
              className={`px-2.5 md:px-3 py-1.5 rounded-lg md:rounded-xl text-[11px] md:text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0 border ${
                showRivals
                  ? 'bg-[#C0392B]/15 border-[#C0392B]/40 text-[#C0392B] hover:bg-[#C0392B]/25'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}>
              <span>{showRivals ? '🙈' : '👁️'}</span>
              <span className="hidden sm:inline">{showRivals ? 'Amagar rivals' : 'Mostrar rivals'}</span>
            </button>
            <div className="flex bg-[#121212] border border-white/10 rounded-lg md:rounded-xl p-0.5 gap-0.5 flex-shrink-0">
              {Object.entries(MODES).map(([key, {label}]) => (
                <button key={key} onClick={() => switchMode(key)}
                  className={`px-2 md:px-3 py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all ${
                    mode===key ? 'bg-[#E5C07B]/20 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
                  {label}
                </button>
              ))}
            </div>
            {mode === 'f7' && (
              <div className="flex bg-[#121212] border border-white/10 rounded-lg md:rounded-xl p-0.5 gap-0.5 flex-shrink-0">
                {Object.keys(FORMATIONS_F7).map(key => (
                  <button key={key} onClick={() => switchFormation(key)}
                    className={`px-2 md:px-3 py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all ${
                      formation===key ? 'bg-[#E5C07B]/20 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
                    {key}
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setSubMode(v => !v)}
              className={`px-2.5 md:px-3 py-1.5 rounded-lg md:rounded-xl text-[11px] md:text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0 border ${
                subMode
                  ? 'bg-[#6FA8FF]/15 border-[#6FA8FF]/50 text-[#6FA8FF]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}>
              <span>🔵</span> <span>Suplents</span>
            </button>
            {hasSubs && (
              <button onClick={swapSubs}
                className="px-2.5 md:px-3 py-1.5 rounded-lg md:rounded-xl text-[11px] md:text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0 border bg-[#6FA8FF]/10 border-[#6FA8FF]/40 text-[#6FA8FF] hover:bg-[#6FA8FF]/20">
                <span>⇄</span> <span>Canviar</span>
              </button>
            )}
            <button onClick={() => setRecording(v => !v)}
              className={`px-2.5 md:px-3 py-1.5 rounded-lg md:rounded-xl text-[11px] md:text-xs font-bold transition-all flex items-center gap-1 flex-shrink-0 border ${
                recording
                  ? 'bg-[#C0392B]/20 border-[#C0392B]/50 text-[#ff8f85]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}>
              <span>{recording ? '⏺' : '🎥'}</span>
              <span className="hidden sm:inline">{recording ? 'Gravant' : 'Gravar jugada'}</span>
            </button>
            <button onClick={reset}
              className="px-2.5 md:px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-[10px] md:text-xs text-gray-400 font-bold hover:text-white hover:bg-white/10 transition-all flex-shrink-0">
              ↺
            </button>
          </div>
        </div>

        {/* Layout: camp + banquillo */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-start">

          {/* Camp SVG */}
          <div className="w-full md:flex-1 min-w-0" style={{ touchAction:'none' }}>
            <svg ref={svgRef} viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%"
              className="rounded-lg md:rounded-xl select-none block"
              style={{
                touchAction:'none',
                maxWidth: '100%',
                maxHeight: isMobile ? undefined : 'calc(100vh - 180px)',
              }}>

              <defs>
                <filter id="ballGlow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="1.8" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <rect width={VB_W} height={VB_H} fill="#0a0a0a" rx={8}/>
              <rect x={F.x} y={F.y} width={F.w} height={F.h} fill="#1c3d1c"/>

              <FieldLines mode={mode}/>

              <text x={F.x+F.w/2} y={F.y+F.h-10} textAnchor="middle" fontSize={9}
                fill="rgba(229,192,123,0.35)" fontWeight="bold" letterSpacing={1}>REAL TIESADA</text>
              <text x={F.x+F.w/2} y={F.y+18} textAnchor="middle" fontSize={9}
                fill="rgba(192,57,43,0.35)" fontWeight="bold" letterSpacing={1}>RIVAL</text>

              {showRivals && rivalPos.map((pos, i) => (
                <RivalToken key={`r-${i}`} pos={pos} idx={i} onDown={onRivDown} onMove={onRivMove} onUp={onRivUp} adaptiveR={adaptiveR}/>
              ))}

              {fieldPlayers.map((p, i) => !p.name ? (
                <circle key={`e-${i}`} cx={p.x} cy={p.y} r={adaptiveR} fill="rgba(0,0,0,0.25)"
                  stroke={SUB_COLOR} strokeWidth={1.5} strokeDasharray="3 3"/>
              ) : (
                <OwnToken key={`o-${i}-${p.name}`} p={p} idx={i} info={getInfo(p.name)}
                  onDown={onOwnDown} onMove={onOwnMove} onUp={onOwnUp} adaptiveR={adaptiveR} />
              ))}

              {fieldPlayers.map((p, i) => p.sub && (
                <SubToken key={`s-${i}-${p.sub}`} p={p} info={getInfo(p.sub)} adaptiveR={adaptiveR}
                  others={[...fieldPlayers.filter((_, j) => j !== i), ...(showRivals ? rivalPos : [])]}
                  moves={fieldPlayers.some(fp => fp.name === p.sub)}
                  onRemove={() => removeSub(i)}/>
              ))}

              <Ball ball={ball} onDown={onBallDown} onMove={onBallMove} onUp={onBallUp}/>
            </svg>
          </div>

          {/* Banquillo */}
          <div className={`${isMobile ? 'w-full' : 'w-28 shrink-0'}`}>
            <p className="text-[9px] md:text-[10px] text-gray-600 font-bold uppercase tracking-wider mb-1.5 md:mb-2">
              Banquillo {benchPlayers.length > 0 && `(${benchPlayers.length})`}
            </p>
            {subMode && (
              <p className="text-[10px] text-[#6FA8FF] font-bold mb-1.5 leading-tight">
                Arrossega'l (de la banqueta o del camp) damunt d'un titular: serà el seu suplent. Toca un suplent per treure'l.
              </p>
            )}
            <div className={`flex ${isMobile ? 'flex-row flex-wrap' : 'flex-col'} gap-1.5 md:gap-2 overflow-x-auto md:overflow-x-visible pb-1 md:pb-0 overflow-y-auto`}
              style={{ maxHeight: isMobile ? '32vh' : 'calc(100vh - 220px)' }}>
              {benchPlayers.map(p => (
                <div key={p.name}
                  className="flex flex-col items-center gap-0.5 cursor-grab select-none flex-shrink-0"
                  style={{ touchAction:'none' }}
                  onPointerDown={e => onBenchDown(p.name, e)}
                  onPointerMove={onBenchMove}
                  onPointerUp={onBenchUp}
                  onPointerCancel={onBenchUp}>
                  <div className="relative"
                    style={{ width: adaptiveBR*2, height: adaptiveBR*2, borderRadius:'50%',
                             border:'2px solid rgba(229,192,123,0.6)',
                             overflow:'hidden', background:'rgba(229,192,123,0.1)',
                             display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {p.photo ? (
                      <img src={`${BASE}${p.photo}`} alt={p.name} draggable={false}
                        style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top', pointerEvents:'none' }}/>
                    ) : (
                      <span style={{ color:'#E5C07B', fontWeight:900, fontSize:16, pointerEvents:'none' }}>{p.name[0]}</span>
                    )}
                    {p.status === 'lesionat' && (
                      <span style={{ position:'absolute', top:-2, right:-2, fontSize:11, lineHeight:1 }}>🩹</span>
                    )}
                  </div>
                  <span className="text-[8px] md:text-[8.5px] text-gray-500 font-bold text-center leading-tight"
                    style={{ maxWidth: adaptiveBR*2 }}>
                    {(p.shirtName || p.name.split(' ')[0]).slice(0,7)}
                  </span>
                </div>
              ))}
              {benchPlayers.length === 0 && (
                <p className="text-[9px] md:text-[10px] text-gray-700 italic">Tots al camp</p>
              )}
            </div>

            {unavailable.length > 0 && (
              <div className="mt-3 md:mt-4 border-t border-white/5 pt-2 md:pt-3">
                <p className="text-[8px] md:text-[10px] text-[#C0392B] font-bold uppercase tracking-wider mb-1.5 md:mb-2">
                  No Convocats ({unavailable.length})
                </p>
                <div className={`flex ${isMobile ? 'flex-row flex-wrap' : 'flex-col'} gap-1.5 md:gap-2 overflow-x-auto md:overflow-x-visible pb-1 md:pb-0 md:overflow-y-auto`}
                  style={{ maxHeight: isMobile ? undefined : 160 }}>
                  {unavailable.map(name => {
                    const info = getInfo(name);
                    return (
                      <div key={name} className="flex flex-col items-center gap-0.5 opacity-40 grayscale flex-shrink-0">
                        <div className="relative" style={{ width: adaptiveBR*1.5, height: adaptiveBR*1.5, borderRadius:'50%', border:'1px solid #777', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          {info?.photo ? <img src={`${BASE}${info?.photo}`} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }}/> : <span style={{ color:'#777', fontWeight:900, fontSize:12 }}>{name[0]}</span>}
                        </div>
                        <span className="text-[7px] md:text-[8px] text-gray-500 font-bold text-center leading-tight">
                          {(info?.shirtName || name.split(' ')[0]).slice(0,7)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Llegenda */}
            <div className="mt-3 md:mt-4 space-y-1.5 hidden md:block text-[8.5px]">
              <p className="text-gray-700 font-bold uppercase tracking-wider">Llegenda</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-[#E5C07B]"/>
                <span className="text-gray-600">Real Tiesada</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C0392B]"/>
                <span className="text-gray-600">Rival</span>
              </div>
              <p className="text-gray-700 mt-2 leading-relaxed">
                Arrossega fitxes del banquillo al camp per canviar jugadors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gravadora de jugades */}
      {recording && (
        <div className="bg-[#1E1E1E] rounded-2xl border border-[#C0392B]/30 p-3 md:p-4 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-black text-[#ff8f85] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C0392B] animate-pulse"/> Gravant jugada
            </h3>
            <span className="text-[10px] text-gray-500">{frames.length} fases</span>
            <div className="flex-1"/>
            <button onClick={captureFrame}
              className="px-3 py-1.5 bg-[#E5C07B] text-black rounded-lg text-[11px] font-black hover:bg-[#d4b06a] transition-colors">
              📸 Capturar fase
            </button>
            <button onClick={() => setPreview(buildDrill())} disabled={frames.length < 2}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[11px] font-bold text-gray-300 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              ▶ Previsualitzar
            </button>
            <button onClick={() => setShowSave(true)} disabled={frames.length < 2}
              className="px-3 py-1.5 bg-[#C0392B] text-white rounded-lg text-[11px] font-black hover:bg-[#a93226] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              💾 Desar
            </button>
          </div>

          <p className="text-[10.5px] text-gray-500 leading-snug">
            Col·loca les fitxes com vulguis i prem <strong className="text-gray-300">Capturar fase</strong>.
            Repeteix-ho per cada moment de la jugada: l'animació i les fletxes es generen soles entre fases.
          </p>

          {frames.length > 0 && (
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {frames.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#121212] border border-white/5 rounded-lg p-2">
                  <button onClick={() => restoreFrame(i)} title="Carregar aquesta fase al camp"
                    className="w-6 h-6 shrink-0 rounded-md bg-[#E5C07B]/15 text-[#E5C07B] text-[11px] font-black hover:bg-[#E5C07B]/30 transition-colors">
                    {i+1}
                  </button>
                  <input value={f.note} onChange={e => setFrameNote(i, e.target.value)}
                    placeholder="Què passa en aquesta fase?"
                    className="flex-1 min-w-0 bg-transparent text-[11.5px] text-gray-300 placeholder:text-gray-700 outline-none"/>
                  <button onClick={() => removeFrame(i)}
                    className="text-gray-700 hover:text-[#C0392B] text-sm px-1 shrink-0">🗑</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Previsualització */}
      {preview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 backdrop-blur-sm">
          <div className="bg-[#1E1E1E] rounded-2xl border border-white/10 w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="p-3 border-b border-white/5 flex justify-between items-center bg-[#121212] sticky top-0">
              <h3 className="text-sm font-black text-[#E5C07B]">▶ Previsualització</h3>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-3"><DrillPlayer drill={preview} autoPlay/></div>
          </div>
        </div>
      )}

      {/* Desar jugada */}
      {showSave && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm">
          <div className="bg-[#1E1E1E] rounded-2xl border border-white/10 w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="p-3 md:p-4 border-b border-white/5 flex justify-between items-center bg-[#121212]">
              <h3 className="text-base font-black text-[#E5C07B]">💾 Desar jugada</h3>
              <button onClick={() => setShowSave(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-3 md:p-4 space-y-3">
              <div>
                <label className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Nom</label>
                <input value={meta.title} autoFocus
                  onChange={e => setMeta(m => ({ ...m, title: e.target.value }))}
                  placeholder="Ex: Pressió alta al seu treta"
                  className="w-full mt-1 bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#E5C07B]/40"/>
              </div>
              <div>
                <label className="text-[10px] text-gray-600 font-bold uppercase tracking-wider">Categoria</label>
                <div className="flex gap-1.5 mt-1 flex-wrap">
                  {Object.entries(DRILL_CATEGORIES).map(([key, c]) => (
                    <button key={key} onClick={() => setMeta(m => ({ ...m, category: key }))}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                        meta.category === key ? 'border-transparent' : 'bg-white/5 border-white/10 text-gray-500'}`}
                      style={meta.category === key ? { background: `${c.color}22`, color: c.color } : undefined}>
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-gray-600 leading-snug">
                Es desa en aquest navegador i apareix a <strong className="text-gray-400">Jugades</strong>.
                Per publicar-la a tot l'equip, exporta el JSON i enganxa'l a <code className="text-[#E5C07B]/70">src/drills.js</code>.
              </p>
            </div>
            <div className="p-3 md:p-4 border-t border-white/5 bg-[#121212] flex gap-2">
              <button onClick={exportDrill}
                className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-gray-300 hover:bg-white/10 transition-all">
                ⬇ JSON
              </button>
              <button onClick={saveDrill}
                className="flex-1 py-2.5 bg-[#E5C07B] text-black font-black rounded-lg hover:bg-[#d4b06a] transition-colors text-sm">
                Desar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ghost banquillo */}
      {ghost && (() => {
        const info = getInfo(ghost.name);
        return (
          <div style={{
            position:'fixed', left: ghost.x-adaptiveBR, top: ghost.y-adaptiveBR,
            width: adaptiveBR*2, height: adaptiveBR*2, borderRadius:'50%',
            border:'2.5px solid #E5C07B',
            overflow:'hidden', background:'rgba(229,192,123,0.15)',
            display:'flex', alignItems:'center', justifyContent:'center',
            pointerEvents:'none', zIndex:9999, opacity:0.88,
            boxShadow:'0 4px 20px rgba(229,192,123,0.4)',
          }}>
            {info?.photo ? (
              <img src={`${BASE}${info.photo}`}
                style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'top'}}/>
            ) : (
              <span style={{color:'#E5C07B',fontWeight:900,fontSize:18}}>{ghost.name[0]}</span>
            )}
          </div>
        );
      })()}

      {/* Modal Convocatoria */}
      {showConv && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 md:p-4 backdrop-blur-sm">
          <div className="bg-[#1E1E1E] rounded-2xl border border-white/10 w-full max-w-sm overflow-hidden flex flex-col max-h-[85vh] md:max-h-[80vh] shadow-2xl">
            <div className="p-3 md:p-4 border-b border-white/5 flex justify-between items-center bg-[#121212]">
              <h3 className="text-base md:text-lg font-black text-[#E5C07B]">👥 Convocatòria</h3>
              <button onClick={() => setShowConv(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-3 md:p-4 overflow-y-auto flex-1 space-y-2">
              <p className="text-[10px] md:text-xs text-gray-400 mb-3 md:mb-4">Desmarca els jugadors que <strong className="text-white">no venen</strong> al partit per treure'ls de la pissarra.</p>
              {roster.map(p => {
                const isAvail = !unavailable.includes(p.name);
                return (
                  <label key={p.name} className={`flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg md:rounded-xl cursor-pointer transition-all border ${isAvail ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/40 border-black/50 opacity-50'}`}>
                    <input type="checkbox" checked={isAvail} onChange={() => toggleAvail(p.name)} className="w-4 h-4 md:w-5 md:h-5 accent-[#E5C07B]" />
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden bg-black flex-shrink-0 flex items-center justify-center border border-white/10">
                      {p.photo ? <img src={`${BASE}${p.photo}`} className="w-full h-full object-cover object-top" /> : <span className="text-[#E5C07B] text-[9px] md:text-xs font-bold">{p.name[0]}</span>}
                    </div>
                    <span className={`font-bold text-xs md:text-sm ${isAvail ? 'text-white' : 'text-gray-500 line-through'}`}>{p.name}</span>
                    {p.status === 'lesionat' && <span title="Lesionat">🩹</span>}
                  </label>
                )
              })}
            </div>
            <div className="p-3 md:p-4 border-t border-white/5 bg-[#121212]">
              <button onClick={() => setShowConv(false)} className="w-full py-2.5 md:py-3 bg-[#E5C07B] text-black font-black rounded-lg md:rounded-xl hover:bg-[#d4b06a] transition-colors text-sm md:text-base">Confirmar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
