import React, { useState, useRef } from 'react';
import { DATABASE } from '../data.js';

const BASE = import.meta.env.BASE_URL;

// ── Constants SVG ────────────────────────────────────────────────
const VB_W = 400, VB_H = 660;
const F = { x: 20, y: 30, w: 360, h: 600 }; // camp
const R = 22;   // radi token camp (SVG)
const BR = 24;  // radi token banquillo (px)

// ── Modes ────────────────────────────────────────────────────────
const MODES = {
  fs5: { label: 'Sala 5v5',  n: 5  },
  f7:  { label: 'Futbol 7',  n: 7  },
  f11: { label: 'Futbol 11', n: 11 },
};

// ── Posicions per defecte (% camp) ───────────────────────────────
const DEF_PCT = {
  fs5: [[50,90],[25,70],[75,70],[25,45],[75,45]],
  f7:  [[50,90],[30,75],[70,75],[20,50],[50,50],[80,50],[50,25]],
  f11: [[50,90],[20,80],[40,80],[60,80],[80,80],[25,55],[50,55],[75,55],[25,30],[50,30],[75,30]],
};

const RIVAL_PCT = {
  fs5: [[50,10],[25,30],[75,30],[25,55],[75,55]],
  f7:  [[50,10],[30,25],[70,25],[20,50],[50,50],[80,50],[50,75]],
  f11: [[50,10],[20,20],[40,20],[60,20],[80,20],[25,45],[50,45],[75,45],[25,70],[50,70],[75,70]],
};

// ── Alineacions per defecte ───────────────────────────────────────
const DEF_LINEUP = {
  fs5: ['Joan Medina','Arnau Sentis','Roger Miro','Pau Ibañez','Roi Seoane'],
  f7:  ['Joan Medina','Ivan Mico','Pau Ibañez','Arnau Sentis','Roger Miro','Oriol Tomas','Chengzhi Li'],
  f11: ['Joan Medina','Ivan Mico','Pau Ibañez','Roi Seoane','Andreu Cases',
        'Arnau Sentis','Oriol Tomas','Roger Miro','Paco Montero','Chengzhi Li','Marc Farreras'],
};

// ── Helpers ──────────────────────────────────────────────────────
const pct2svg = ([px, py]) => ({ x: F.x + (px/100)*F.w, y: F.y + (py/100)*F.h });
const mkField  = m => DEF_LINEUP[m].map((name, i) => ({ name, ...pct2svg(DEF_PCT[m][i]) }));
const mkRivals = m => RIVAL_PCT[m].map(pct2svg);
const clamp    = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ── Línies del camp: Futbol Sala (portrait) ───────────────────────
function FutsalLines() {
  const { x: FX, y: FY, w: FW, h: FH } = F;
  const cx = FX + FW / 2, cy = FY + FH / 2;
  const arcR = 88, gW = 55, gH = 22;
  const gx = cx - gW / 2;
  const S = 'rgba(255,255,255,';
  return (
    <>
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x={FX} y={FY+i*100} width={FW} height={100}
          fill={i%2===0?'rgba(0,0,0,0.06)':'rgba(255,255,255,0.02)'}/>
      ))}
      <rect x={FX} y={FY} width={FW} height={FH} fill="none" stroke={S+'0.8)'} strokeWidth={2.5}/>
      <line x1={FX} y1={cy} x2={FX+FW} y2={cy} stroke={S+'0.7)'} strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={52} fill="none" stroke={S+'0.65)'} strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={3.5} fill={S+'0.75)'}/>
      {/* Àrees penals: semicercle baix (cap amunt) i alt (cap avall) */}
      <path d={`M${cx-arcR} ${FY+FH} A${arcR} ${arcR} 0 0 1 ${cx+arcR} ${FY+FH}`}
        fill={S+'0.04)'} stroke={S+'0.6)'} strokeWidth={1.5}/>
      <path d={`M${cx-arcR} ${FY} A${arcR} ${arcR} 0 0 0 ${cx+arcR} ${FY}`}
        fill={S+'0.04)'} stroke={S+'0.6)'} strokeWidth={1.5}/>
      {/* Punts de penal */}
      <circle cx={cx} cy={FY+FH-arcR} r={3} fill={S+'0.7)'}/>
      <circle cx={cx} cy={FY+arcR}    r={3} fill={S+'0.7)'}/>
      {/* Arcs de cantó */}
      <path d={`M${FX} ${FY+18} A18 18 0 0 1 ${FX+18} ${FY}`} fill="none" stroke={S+'0.55)'} strokeWidth={1.2}/>
      <path d={`M${FX+FW-18} ${FY} A18 18 0 0 1 ${FX+FW} ${FY+18}`} fill="none" stroke={S+'0.55)'} strokeWidth={1.2}/>
      <path d={`M${FX} ${FY+FH-18} A18 18 0 0 0 ${FX+18} ${FY+FH}`} fill="none" stroke={S+'0.55)'} strokeWidth={1.2}/>
      <path d={`M${FX+FW-18} ${FY+FH} A18 18 0 0 0 ${FX+FW} ${FY+FH-18}`} fill="none" stroke={S+'0.55)'} strokeWidth={1.2}/>
      {/* Porteries */}
      <rect x={gx} y={FY+FH}  width={gW} height={gH} fill={S+'0.1)'} stroke={S+'0.8)'} strokeWidth={2}/>
      <rect x={gx} y={FY-gH}  width={gW} height={gH} fill={S+'0.1)'} stroke={S+'0.8)'} strokeWidth={2}/>
    </>
  );
}

// ── Línies Futbol 7 ───────────────────────────────────────────────
function F7Lines() {
  const { x: FX, y: FY, w: FW, h: FH } = F;
  const cx = FX + FW / 2, cy = FY + FH / 2;
  // Escala: FH=600px≈60m→10px/m; FW=360px≈40m→9px/m
  const areaW = 162, areaH = 100; // 18m wide, 10m deep
  const ax = cx - areaW / 2;
  const gW = 50, gH = 22;
  const gx = cx - gW / 2;
  const spotOff = 78; // 8m penalty spot
  const S = 'rgba(255,255,255,';
  return (
    <>
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x={FX} y={FY+i*100} width={FW} height={100}
          fill={i%2===0?'rgba(0,0,0,0.06)':'rgba(255,255,255,0.02)'}/>
      ))}
      <rect x={FX} y={FY} width={FW} height={FH} fill="none" stroke={S+'0.8)'} strokeWidth={2.5}/>
      <line x1={FX} y1={cy} x2={FX+FW} y2={cy} stroke={S+'0.7)'} strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={60} fill="none" stroke={S+'0.65)'} strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={3.5} fill={S+'0.75)'}/>
      {/* Àrees */}
      <rect x={ax} y={FY} width={areaW} height={areaH} fill={S+'0.04)'} stroke={S+'0.6)'} strokeWidth={1.5}/>
      <rect x={ax} y={FY+FH-areaH} width={areaW} height={areaH} fill={S+'0.04)'} stroke={S+'0.6)'} strokeWidth={1.5}/>
      {/* Punts */}
      <circle cx={cx} cy={FY+spotOff}    r={3} fill={S+'0.7)'}/>
      <circle cx={cx} cy={FY+FH-spotOff} r={3} fill={S+'0.7)'}/>
      {/* Arcs cantó */}
      <path d={`M${FX} ${FY+16} A16 16 0 0 1 ${FX+16} ${FY}`} fill="none" stroke={S+'0.5)'} strokeWidth={1.2}/>
      <path d={`M${FX+FW-16} ${FY} A16 16 0 0 1 ${FX+FW} ${FY+16}`} fill="none" stroke={S+'0.5)'} strokeWidth={1.2}/>
      <path d={`M${FX} ${FY+FH-16} A16 16 0 0 0 ${FX+16} ${FY+FH}`} fill="none" stroke={S+'0.5)'} strokeWidth={1.2}/>
      <path d={`M${FX+FW-16} ${FY+FH} A16 16 0 0 0 ${FX+FW} ${FY+FH-16}`} fill="none" stroke={S+'0.5)'} strokeWidth={1.2}/>
      {/* Porteries */}
      <rect x={gx} y={FY+FH}  width={gW} height={gH} fill={S+'0.1)'} stroke={S+'0.8)'} strokeWidth={2}/>
      <rect x={gx} y={FY-gH}  width={gW} height={gH} fill={S+'0.1)'} stroke={S+'0.8)'} strokeWidth={2}/>
    </>
  );
}

// ── Línies Futbol 11 ──────────────────────────────────────────────
function F11Lines() {
  const { x: FX, y: FY, w: FW, h: FH } = F;
  const cx = FX + FW / 2, cy = FY + FH / 2;
  // Escala: FH=600px≈105m→5.71px/m; FW=360px≈68m→5.29px/m
  const areaW = 213, areaH = 94;   // 40.32m x 16.5m
  const goalAreaW = 97, goalAreaH = 31; // 18.32m x 5.5m
  const ax = cx - areaW / 2, gax = cx - goalAreaW / 2;
  const penOff = 63; // 11m → spot
  const arcR = 52;  // 9.15m D arc
  const gW = 40, gH = 22;
  const gx = cx - gW / 2;
  // D arc intersections with area edge
  const dDx = Math.round(Math.sqrt(arcR*arcR - (areaH - penOff)*(areaH - penOff)));
  const S = 'rgba(255,255,255,';
  return (
    <>
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x={FX} y={FY+i*100} width={FW} height={100}
          fill={i%2===0?'rgba(0,0,0,0.06)':'rgba(255,255,255,0.02)'}/>
      ))}
      <rect x={FX} y={FY} width={FW} height={FH} fill="none" stroke={S+'0.8)'} strokeWidth={2.5}/>
      <line x1={FX} y1={cy} x2={FX+FW} y2={cy} stroke={S+'0.7)'} strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={52} fill="none" stroke={S+'0.65)'} strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={3.5} fill={S+'0.75)'}/>
      {/* Àrees */}
      <rect x={ax} y={FY}         width={areaW} height={areaH}     fill={S+'0.04)'} stroke={S+'0.6)'} strokeWidth={1.5}/>
      <rect x={ax} y={FY+FH-areaH} width={areaW} height={areaH}   fill={S+'0.04)'} stroke={S+'0.6)'} strokeWidth={1.5}/>
      {/* Àrees de gol */}
      <rect x={gax} y={FY}             width={goalAreaW} height={goalAreaH} fill="none" stroke={S+'0.5)'} strokeWidth={1}/>
      <rect x={gax} y={FY+FH-goalAreaH} width={goalAreaW} height={goalAreaH} fill="none" stroke={S+'0.5)'} strokeWidth={1}/>
      {/* Punts de penal */}
      <circle cx={cx} cy={FY+penOff}    r={3} fill={S+'0.7)'}/>
      <circle cx={cx} cy={FY+FH-penOff} r={3} fill={S+'0.7)'}/>
      {/* Arcs D (part fora de l'àrea) */}
      <path d={`M${cx-dDx} ${FY+areaH} A${arcR} ${arcR} 0 0 1 ${cx+dDx} ${FY+areaH}`}
        fill="none" stroke={S+'0.6)'} strokeWidth={1.5}/>
      <path d={`M${cx-dDx} ${FY+FH-areaH} A${arcR} ${arcR} 0 0 0 ${cx+dDx} ${FY+FH-areaH}`}
        fill="none" stroke={S+'0.6)'} strokeWidth={1.5}/>
      {/* Arcs cantó */}
      {[[FX,FY,'0 0 1'],[FX+FW,FY,'0 0 0'],[FX,FY+FH,'0 0 0'],[FX+FW,FY+FH,'0 0 1']].map(([bx,by,sw],k)=>{
        const dx = bx===FX?16:-16, dy = by===FY?16:-16;
        return <path key={k} d={`M${bx} ${by+dy} A16 16 ${sw} ${bx+dx} ${by}`} fill="none" stroke={S+'0.5)'} strokeWidth={1.2}/>;
      })}
      {/* Porteries */}
      <rect x={gx} y={FY+FH}  width={gW} height={gH} fill={S+'0.1)'} stroke={S+'0.8)'} strokeWidth={2}/>
      <rect x={gx} y={FY-gH}  width={gW} height={gH} fill={S+'0.1)'} stroke={S+'0.8)'} strokeWidth={2}/>
    </>
  );
}

// ── Component principal ───────────────────────────────────────────
export default function TacticalBoard() {
  const roster   = DATABASE.roster;
  const svgRef   = useRef(null);
  const fieldDrag = useRef(null); // { type, idx, pid, ox, oy }
  const benchDrag = useRef(null); // { name, pid }

  const [mode,         setMode]         = useState('fs5');
  const [fieldPlayers, setFieldPlayers] = useState(mkField('fs5'));
  const [rivalPos,     setRivalPos]     = useState(mkRivals('fs5'));
  const [ghost,        setGhost]        = useState(null); // { name, photo, x, y }

  const getInfo     = name => roster.find(p => p.name === name);
  const benchPlayers = roster.filter(p => !fieldPlayers.some(fp => fp.name === p.name));

  const toSvg = (cx, cy) => {
    const rect = svgRef.current.getBoundingClientRect();
    return { x: ((cx-rect.left)/rect.width)*VB_W, y: ((cy-rect.top)/rect.height)*VB_H };
  };

  // ── Mode ────────────────────────────────────────────────────────
  const switchMode = m => {
    setMode(m); setFieldPlayers(mkField(m)); setRivalPos(mkRivals(m));
    setGhost(null); fieldDrag.current = null; benchDrag.current = null;
  };

  // ── Reset ────────────────────────────────────────────────────────
  const reset = () => {
    setFieldPlayers(mkField(mode)); setRivalPos(mkRivals(mode));
    setGhost(null); fieldDrag.current = null; benchDrag.current = null;
  };

  // ── Drag jugadors propis ─────────────────────────────────────────
  const onOwnDown = (idx, e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = toSvg(e.clientX, e.clientY);
    const p = fieldPlayers[idx];
    fieldDrag.current = { type:'own', idx, pid:e.pointerId, ox:x-p.x, oy:y-p.y };
  };
  const onOwnMove = (idx, e) => {
    const d = fieldDrag.current;
    if (!d || d.type!=='own' || d.idx!==idx || d.pid!==e.pointerId) return;
    const { x, y } = toSvg(e.clientX, e.clientY);
    const nx = clamp(x-d.ox, F.x+R, F.x+F.w-R);
    const ny = clamp(y-d.oy, F.y+R, F.y+F.h-R);
    setFieldPlayers(prev => prev.map((p,i) => i===idx ? {...p,x:nx,y:ny} : p));
  };
  const onOwnUp = e => { if (fieldDrag.current?.pid===e.pointerId) fieldDrag.current=null; };

  // ── Drag rivals ──────────────────────────────────────────────────
  const onRivDown = (idx, e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = toSvg(e.clientX, e.clientY);
    const p = rivalPos[idx];
    fieldDrag.current = { type:'rival', idx, pid:e.pointerId, ox:x-p.x, oy:y-p.y };
  };
  const onRivMove = (idx, e) => {
    const d = fieldDrag.current;
    if (!d || d.type!=='rival' || d.idx!==idx || d.pid!==e.pointerId) return;
    const { x, y } = toSvg(e.clientX, e.clientY);
    const nx = clamp(x-d.ox, F.x+R, F.x+F.w-R);
    const ny = clamp(y-d.oy, F.y+R, F.y+F.h-R);
    setRivalPos(prev => prev.map((p,i) => i===idx ? {x:nx,y:ny} : p));
  };
  const onRivUp = e => { if (fieldDrag.current?.pid===e.pointerId) fieldDrag.current=null; };

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
    if (x < F.x+R || x > F.x+F.w-R || y < F.y+R || y > F.y+F.h-R) return;

    // Busca el jugador més proper
    let nearIdx = -1, nearDist = 52;
    fieldPlayers.forEach((p, i) => {
      const dist = Math.hypot(p.x-x, p.y-y);
      if (dist < nearDist) { nearDist=dist; nearIdx=i; }
    });

    if (nearIdx !== -1) {
      // Swap: el del camp va al banquillo (simplement esborrat de fieldPlayers), el del banquillo entra
      setFieldPlayers(prev => prev.map((p,i) => i===nearIdx ? {...p, name} : p));
    } else if (fieldPlayers.length < MODES[mode].n) {
      // Posició buida: afegir al camp
      setFieldPlayers(prev => [...prev, { name, x, y }]);
    } else {
      // Tot ple: swap amb el més proper absolut
      let ni = 0, nd = Infinity;
      fieldPlayers.forEach((p,i) => { const dist=Math.hypot(p.x-x,p.y-y); if(dist<nd){nd=dist;ni=i;} });
      setFieldPlayers(prev => prev.map((p,i) => i===ni ? {...p, name} : p));
    }
  };

  // ── Render token propi (SVG) ─────────────────────────────────────
  const OwnToken = ({ p, idx }) => {
    const info = getInfo(p.name);
    const clipId = `cp-${idx}`;
    return (
      <g style={{ cursor:'grab' }}
        onPointerDown={e => onOwnDown(idx, e)}
        onPointerMove={e => onOwnMove(idx, e)}
        onPointerUp={onOwnUp}>
        {/* Ombra */}
        <circle cx={p.x} cy={p.y+3} r={R+3} fill="rgba(0,0,0,0.35)"/>
        {/* Anell daurat */}
        <circle cx={p.x} cy={p.y} r={R+2} fill="none" stroke="#E5C07B" strokeWidth={2.5} strokeOpacity={0.9}/>
        {/* Fons */}
        <circle cx={p.x} cy={p.y} r={R} fill={info?.photo ? '#0a0a0a' : 'rgba(229,192,123,0.15)'}/>
        {/* Foto o inicial */}
        {info?.photo ? (
          <>
            <defs>
              <clipPath id={clipId}>
                <circle cx={p.x} cy={p.y} r={R}/>
              </clipPath>
            </defs>
            <image href={`${BASE}${info.photo}`} x={p.x-R} y={p.y-R} width={R*2} height={R*2}
              clipPath={`url(#${clipId})`} preserveAspectRatio="xMidYMin slice"/>
          </>
        ) : (
          <text x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fontSize={16} fontWeight="900" fill="#E5C07B" style={{pointerEvents:'none'}}>
            {p.name[0]}
          </text>
        )}
        {/* Nom */}
        <text x={p.x} y={p.y+R+11} textAnchor="middle" fontSize={9.5} fontWeight="bold"
          fill="rgba(255,255,255,0.92)" stroke="#121212" strokeWidth={3} paintOrder="stroke"
          style={{pointerEvents:'none'}}>
          {(info?.shirtName || p.name.split(' ')[0]).slice(0,7)}
        </text>
      </g>
    );
  };

  return (
    <div className="space-y-3">
      <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-4">

        {/* Capçalera */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-black text-[#E5C07B]">🎯 Pissarra Tàctica</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Selector de mode */}
            <div className="flex bg-[#121212] border border-white/10 rounded-xl p-0.5 gap-0.5">
              {Object.entries(MODES).map(([key, {label}]) => (
                <button key={key} onClick={() => switchMode(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode===key ? 'bg-[#E5C07B]/20 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
                  {label}
                </button>
              ))}
            </div>
            <button onClick={reset}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 font-bold hover:text-white hover:bg-white/10 transition-all">
              ↺ Reiniciar
            </button>
          </div>
        </div>

        {/* Layout: camp + banquillo */}
        <div className="flex flex-col lg:flex-row gap-3 items-start">

          {/* Camp SVG — ocupa tota l'amplada disponible */}
          <div className="w-full lg:flex-1 min-w-0">
            <svg ref={svgRef} viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%"
              className="rounded-xl select-none block" style={{ touchAction:'none' }}>

              {/* Fons */}
              <rect width={VB_W} height={VB_H} fill="#0a0a0a" rx={8}/>
              {/* Gespa */}
              <rect x={F.x} y={F.y} width={F.w} height={F.h} fill="#1c3d1c"/>

              {/* Línies del camp */}
              {mode==='fs5' && <FutsalLines/>}
              {mode==='f7'  && <F7Lines/>}
              {mode==='f11' && <F11Lines/>}

              {/* Etiquetes */}
              <text x={F.x+F.w/2} y={F.y+F.h-10} textAnchor="middle" fontSize={9}
                fill="rgba(229,192,123,0.35)" fontWeight="bold" letterSpacing={1}>REAL TIESADA</text>
              <text x={F.x+F.w/2} y={F.y+18} textAnchor="middle" fontSize={9}
                fill="rgba(192,57,43,0.35)" fontWeight="bold" letterSpacing={1}>RIVAL</text>

              {/* Rivals */}
              {rivalPos.map((pos, i) => (
                <g key={`r-${i}`} style={{ cursor:'grab' }}
                  onPointerDown={e => onRivDown(i,e)}
                  onPointerMove={e => onRivMove(i,e)}
                  onPointerUp={onRivUp}>
                  <circle cx={pos.x} cy={pos.y+3} r={R+3} fill="rgba(0,0,0,0.35)"/>
                  <circle cx={pos.x} cy={pos.y} r={R+2} fill="none" stroke="#ff6b6b" strokeWidth={2} strokeOpacity={0.7}/>
                  <circle cx={pos.x} cy={pos.y} r={R} fill="#C0392B" fillOpacity={0.9}/>
                  <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
                    fontSize={12} fontWeight="bold" fill="white" style={{pointerEvents:'none'}}>
                    R{i+1}
                  </text>
                </g>
              ))}

              {/* Jugadors propis */}
              {fieldPlayers.map((p, i) => <OwnToken key={`o-${i}-${p.name}`} p={p} idx={i}/>)}
            </svg>
          </div>

          {/* Banquillo */}
          <div className="w-full lg:w-28 lg:flex-shrink-0">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mb-2">
              Banquillo {benchPlayers.length > 0 && `(${benchPlayers.length})`}
            </p>
            {/* Mobile: scroll horitzontal. Desktop: grid vertical */}
            <div className="flex lg:flex-col flex-row flex-wrap gap-2 lg:gap-1.5 overflow-x-auto pb-1">
              {benchPlayers.map(p => (
                <div key={p.name}
                  className="flex flex-col items-center gap-0.5 cursor-grab select-none flex-shrink-0"
                  style={{ touchAction:'none' }}
                  onPointerDown={e => onBenchDown(p.name, e)}
                  onPointerMove={onBenchMove}
                  onPointerUp={onBenchUp}>
                  {/* Token banquillo */}
                  <div className="relative"
                    style={{ width: BR*2, height: BR*2, borderRadius:'50%',
                             border:'2px solid rgba(229,192,123,0.6)',
                             overflow:'hidden', background:'rgba(229,192,123,0.1)',
                             display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {p.photo ? (
                      <img src={`${BASE}${p.photo}`} alt={p.name}
                        style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }}/>
                    ) : (
                      <span style={{ color:'#E5C07B', fontWeight:900, fontSize:16 }}>{p.name[0]}</span>
                    )}
                  </div>
                  <span className="text-[8.5px] text-gray-500 font-bold text-center leading-tight"
                    style={{ maxWidth: BR*2 }}>
                    {(p.shirtName || p.name.split(' ')[0]).slice(0,7)}
                  </span>
                </div>
              ))}
              {benchPlayers.length === 0 && (
                <p className="text-[10px] text-gray-700 italic">Tots al camp</p>
              )}
            </div>

            {/* Llegenda */}
            <div className="mt-4 space-y-1.5 hidden lg:block">
              <p className="text-[9px] text-gray-700 font-bold uppercase tracking-wider">Llegenda</p>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full border-2 border-[#E5C07B]"/>
                <span className="text-[9px] text-gray-600">Real Tiesada</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#C0392B]"/>
                <span className="text-[9px] text-gray-600">Rival</span>
              </div>
              <p className="text-[8.5px] text-gray-700 mt-2 leading-relaxed">
                Arrossega fitxes del banquillo al camp per canviar jugadors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ghost quan es fa drag del banquillo */}
      {ghost && (() => {
        const info = getInfo(ghost.name);
        return (
          <div style={{
            position:'fixed', left: ghost.x-BR, top: ghost.y-BR,
            width: BR*2, height: BR*2, borderRadius:'50%',
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
    </div>
  );
}
