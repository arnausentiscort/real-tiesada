import React, { useState, useRef, useCallback } from 'react';
import { DATABASE } from '../data.js';

const VB_W = 800, VB_H = 500;
const F = { x: 50, y: 50, w: 700, h: 400 }; // field rect
const R = 22; // token radius

const INIT_OWN = [
  { x: 105, y: 250 },
  { x: 230, y: 160 },
  { x: 230, y: 340 },
  { x: 355, y: 195 },
  { x: 355, y: 305 },
];

const INIT_RIVAL = [
  { x: 695, y: 250 },
  { x: 570, y: 160 },
  { x: 570, y: 340 },
  { x: 445, y: 195 },
  { x: 445, y: 305 },
];

const DEFAULT_PLAYERS = ['Joan Medina', 'Ivan Mico', 'Pau Ibañez', 'Arnau Sentis', 'Roger Miro'];

export default function TacticalBoard() {
  const roster = DATABASE.roster;
  const svgRef  = useRef(null);
  const dragRef = useRef(null);

  const [selectedPlayers, setSelectedPlayers] = useState([...DEFAULT_PLAYERS]);
  const [ownPos,   setOwnPos]   = useState(INIT_OWN.map(p => ({ ...p })));
  const [rivalPos, setRivalPos] = useState(INIT_RIVAL.map(p => ({ ...p })));

  const svgPoint = useCallback((cx, cy) => {
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: ((cx - rect.left) / rect.width)  * VB_W,
      y: ((cy - rect.top)  / rect.height) * VB_H,
    };
  }, []);

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const onDown = (team, idx, e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = svgPoint(e.clientX, e.clientY);
    const pos = (team === 'own' ? ownPos : rivalPos)[idx];
    dragRef.current = { team, idx, pid: e.pointerId, ox: x - pos.x, oy: y - pos.y };
  };

  const onMove = (team, idx, e) => {
    const d = dragRef.current;
    if (!d || d.team !== team || d.idx !== idx || d.pid !== e.pointerId) return;
    const { x, y } = svgPoint(e.clientX, e.clientY);
    const nx = clamp(x - d.ox, F.x + R, F.x + F.w - R);
    const ny = clamp(y - d.oy, F.y + R, F.y + F.h - R);
    (team === 'own' ? setOwnPos : setRivalPos)(
      prev => prev.map((p, i) => i === idx ? { x: nx, y: ny } : p)
    );
  };

  const onUp = (e) => {
    if (dragRef.current?.pid === e.pointerId) dragRef.current = null;
  };

  const reset = () => {
    setOwnPos(INIT_OWN.map(p => ({ ...p })));
    setRivalPos(INIT_RIVAL.map(p => ({ ...p })));
  };

  const getInfo = name => roster.find(p => p.name === name) || { shirtName: name.split(' ')[1] || name, number: '?' };

  const Token = ({ team, idx, pos }) => {
    const isOwn  = team === 'own';
    const fill   = isOwn ? '#E5C07B' : '#C0392B';
    const stroke = isOwn ? 'rgba(255,255,255,0.8)' : '#ff7b7b';
    const tFill  = isOwn ? '#121212' : '#fff';
    const info   = isOwn ? getInfo(selectedPlayers[idx]) : null;

    return (
      <g
        transform={`translate(${pos.x},${pos.y})`}
        style={{ cursor: 'grab' }}
        onPointerDown={e => onDown(team, idx, e)}
        onPointerMove={e => onMove(team, idx, e)}
        onPointerUp={onUp}
      >
        <circle r={R + 4} fill="rgba(0,0,0,0.25)" cy={2} />
        <circle r={R} fill={fill} fillOpacity={0.93} stroke={stroke} strokeWidth={2} />
        {isOwn ? (
          <>
            <text textAnchor="middle" dy="-3" fontSize={12} fontWeight="bold" fill={tFill} style={{ pointerEvents: 'none' }}>
              {info.number}
            </text>
            <text textAnchor="middle" dy={9} fontSize={7} fontWeight="bold" fill={tFill} style={{ pointerEvents: 'none' }}>
              {(info.shirtName || '').slice(0, 7)}
            </text>
          </>
        ) : (
          <text textAnchor="middle" dy="5" fontSize={14} fontWeight="bold" fill={tFill} style={{ pointerEvents: 'none' }}>
            R{idx + 1}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-4 md:p-5">

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black text-[#E5C07B]">🎯 Pissarra Tàctica</h2>
            <p className="text-[11px] text-gray-500 mt-0.5">Arrossega les fitxes per dibuixar jugades</p>
          </div>
          <button onClick={reset}
            className="px-4 py-2 bg-[#E5C07B]/15 border border-[#E5C07B]/30 rounded-xl text-sm text-[#E5C07B] font-bold hover:bg-[#E5C07B]/25 transition-all">
            ↺ Reiniciar
          </button>
        </div>

        {/* Selector de jugadors */}
        <div className="grid grid-cols-5 gap-1.5 mb-3">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="min-w-0">
              <label className="text-[9px] text-[#E5C07B]/50 font-bold uppercase tracking-wider block mb-1">
                J{i + 1}
              </label>
              <select
                value={selectedPlayers[i]}
                onChange={e => setSelectedPlayers(prev => prev.map((p, j) => j === i ? e.target.value : p))}
                className="w-full bg-[#121212] border border-white/10 rounded-lg text-[10px] text-white px-1.5 py-1.5 truncate focus:outline-none focus:border-[#E5C07B]/40"
              >
                {roster.map(p => (
                  <option key={p.name} value={p.name}>{p.shirtName || p.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Llegenda */}
        <div className="flex items-center gap-4 mb-3 text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-[#E5C07B]" />
            <span>Real Tiesada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-[#C0392B]" />
            <span>Rival</span>
          </div>
        </div>

        {/* Camp SVG */}
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          width="100%"
          className="rounded-xl select-none"
          style={{ touchAction: 'none', display: 'block' }}
        >
          {/* Fons */}
          <rect width={VB_W} height={VB_H} fill="#0d0d0d" rx={8} />

          {/* Camp verd */}
          <rect x={F.x} y={F.y} width={F.w} height={F.h} fill="#1a6b3c" />

          {/* Franges subtils */}
          {[0,1,2,3,4,5,6].map(i => (
            <rect key={i} x={F.x + i * 100} y={F.y} width={100} height={F.h}
              fill={i % 2 === 0 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.025)'} />
          ))}

          {/* Vora camp */}
          <rect x={F.x} y={F.y} width={F.w} height={F.h}
            fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={2.5} />

          {/* Línia de centre */}
          <line x1={400} y1={F.y} x2={400} y2={F.y + F.h}
            stroke="rgba(255,255,255,0.75)" strokeWidth={2} />

          {/* Cercle central */}
          <circle cx={400} cy={250} r={58}
            fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth={2} />
          <circle cx={400} cy={250} r={4} fill="rgba(255,255,255,0.75)" />

          {/* Àrees (semicercles radio=105: 6m × 17.5px/m) */}
          {/* Esquerra */}
          <path d={`M ${F.x} 145 A 105 105 0 0 1 ${F.x} 355`}
            fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.65)" strokeWidth={2} />
          {/* Dreta */}
          <path d={`M ${F.x + F.w} 145 A 105 105 0 0 0 ${F.x + F.w} 355`}
            fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.65)" strokeWidth={2} />

          {/* Punts de penal (6m = 105px des de la línia de gol) */}
          <circle cx={155} cy={250} r={3.5} fill="rgba(255,255,255,0.75)" />
          <circle cx={645} cy={250} r={3.5} fill="rgba(255,255,255,0.75)" />

          {/* Arcs de cantó */}
          <path d={`M ${F.x} ${F.y+20} A 20 20 0 0 1 ${F.x+20} ${F.y}`}
            fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth={1.5} />
          <path d={`M ${F.x+20} ${F.y+F.h} A 20 20 0 0 1 ${F.x} ${F.y+F.h-20}`}
            fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth={1.5} />
          <path d={`M ${F.x+F.w-20} ${F.y} A 20 20 0 0 1 ${F.x+F.w} ${F.y+20}`}
            fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth={1.5} />
          <path d={`M ${F.x+F.w} ${F.y+F.h-20} A 20 20 0 0 1 ${F.x+F.w-20} ${F.y+F.h}`}
            fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth={1.5} />

          {/* Porteries (3m = 52px, centrades a y=250) */}
          <rect x={F.x - 26} y={224} width={26} height={52}
            fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.75)" strokeWidth={2} />
          <rect x={F.x + F.w} y={224} width={26} height={52}
            fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.75)" strokeWidth={2} />

          {/* Etiquetes equips */}
          <text x={200} y={F.y + 18} textAnchor="middle" fontSize={10}
            fill="rgba(229,192,123,0.55)" fontWeight="bold" letterSpacing={1}>
            REAL TIESADA →
          </text>
          <text x={600} y={F.y + 18} textAnchor="middle" fontSize={10}
            fill="rgba(192,57,43,0.55)" fontWeight="bold" letterSpacing={1}>
            ← RIVAL
          </text>

          {/* Fitxes rivals (sota) */}
          {rivalPos.map((pos, i) => <Token key={`r${i}`} team="rival" idx={i} pos={pos} />)}
          {/* Fitxes pròpies (sobre) */}
          {ownPos.map((pos, i) => <Token key={`o${i}`} team="own" idx={i} pos={pos} />)}
        </svg>
      </div>
    </div>
  );
}
