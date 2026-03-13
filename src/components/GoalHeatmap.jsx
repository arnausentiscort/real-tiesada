import React, { useState, useMemo } from 'react';
import { DATABASE } from '../data.js';

const PLAYER_COLORS = {
  'Arnau Sentis':  '#E5C07B',
  'Roger Miro':    '#61AFEF',
  'Oriol Tomas':   '#98C379',
  'Paco Montero':  '#E06C75',
  'Andreu Cases':  '#C678DD',
  'Pau Ibañez':    '#56B6C2',
  'Joan Medina':   '#D19A66',
  'Roi Seoane':    '#BE5046',
  'Ivan Mico':     '#ABB2BF',
  'Marc Farreras': '#4EC9B0',
  'Chengzhi Li':   '#F0A500',
};
const DEFAULT_COLOR = '#E5C07B';

// Porteria: SVG coords dins d'un viewBox 300x200
// 6 cols x 4 files → cada cel = 50x50
const GOAL_ZONES = {
  A1:{x:25,y:25}, A2:{x:75,y:25}, A3:{x:125,y:25}, A4:{x:175,y:25}, A5:{x:225,y:25}, A6:{x:275,y:25},
  B1:{x:25,y:75}, B2:{x:75,y:75}, B3:{x:125,y:75}, B4:{x:175,y:75}, B5:{x:225,y:75}, B6:{x:275,y:75},
  C1:{x:25,y:125},C2:{x:75,y:125},C3:{x:125,y:125},C4:{x:175,y:125},C5:{x:225,y:125},C6:{x:275,y:125},
  D1:{x:25,y:175},D2:{x:75,y:175},D3:{x:125,y:175},D4:{x:175,y:175},D5:{x:225,y:175},D6:{x:275,y:175},
};

// ── Camp: component d'un gol (tir + assist + fletxa) ──────────────
function GoalOnPitch({ goal, idx, isActive, onClick }) {
  const color  = PLAYER_COLORS[goal.scorer] || DEFAULT_COLOR;
  const shot   = goal.shotPos;
  const assist = goal.assistPos;
  if (!shot) return null;

  return (
    <g onClick={() => onClick(idx)} style={{ cursor: 'pointer' }}>
      {/* Fletxa assist → tir */}
      {assist && (
        <line
          x1={assist.x} y1={assist.y} x2={shot.x} y2={shot.y}
          stroke={color} strokeWidth={isActive ? 2 : 1.2}
          strokeDasharray="5,3" opacity={isActive ? 0.9 : 0.45}
          markerEnd={`url(#arrow-${goal.scorer?.split(' ')[0]})`}
        />
      )}
      {/* Punt assist */}
      {assist && (
        <circle cx={assist.x} cy={assist.y} r={isActive ? 5 : 3.5}
          fill={color} opacity={isActive ? 0.7 : 0.35} />
      )}
      {/* Aura tir */}
      <circle cx={shot.x} cy={shot.y} r={isActive ? 20 : 13}
        fill={color} opacity={isActive ? 0.18 : 0.08} />
      {/* Punt tir */}
      <circle cx={shot.x} cy={shot.y} r={isActive ? 10 : 7}
        fill={color} stroke="white" strokeWidth={1.5} opacity={0.95} />
      {/* Número */}
      <text x={shot.x} y={shot.y} textAnchor="middle" dominantBaseline="middle"
        fontSize={isActive ? 7 : 6} fontWeight="bold" fill="white" style={{ pointerEvents: 'none' }}>
        {idx + 1}
      </text>
    </g>
  );
}

// ── Porteria: punt on entra el gol ────────────────────────────────
function GoalInNet({ goal, idx, isActive }) {
  const color = PLAYER_COLORS[goal.scorer] || DEFAULT_COLOR;
  const pos   = goal.goalPos;
  if (!pos) return null;

  // Escala goalPos (que ve de camp 0-300 vertical) a porteria SVG 300x200
  // goalPos ja ve en coordenades de porteria directament
  return (
    <g>
      <circle cx={pos.x} cy={pos.y} r={isActive ? 18 : 12}
        fill={color} opacity={isActive ? 0.25 : 0.1} />
      <circle cx={pos.x} cy={pos.y} r={isActive ? 9 : 6}
        fill={color} stroke="white" strokeWidth={1.5} opacity={0.95} />
      <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
        fontSize={isActive ? 7 : 5.5} fontWeight="bold" fill="white" style={{ pointerEvents: 'none' }}>
        {idx + 1}
      </text>
    </g>
  );
}

// ── Tooltip info gol ──────────────────────────────────────────────
function GoalTooltip({ goal, idx, color }) {
  return (
    <div className="bg-[#0d0d0d] rounded-xl border p-3 text-xs space-y-1 min-w-[180px]"
      style={{ borderColor: color + '60' }}>
      <div className="font-bold text-sm" style={{ color }}>{idx + 1}. {goal.time} · {goal.jornada}</div>
      <div className="text-white font-semibold">{goal.scorer}</div>
      {goal.assist && <div className="text-gray-400">↳ assist: <span className="text-gray-300">{goal.assist}</span></div>}
      <div className="text-gray-600 text-[10px]">vs {goal.opponent}</div>
    </div>
  );
}

export default function GoalHeatmap() {
  const [matchFilter,  setMatchFilter]  = useState('all');
  const [playerFilter, setPlayerFilter] = useState('all');
  const [activeGoal,   setActiveGoal]   = useState(null);

  const allGoals = useMemo(() => {
    const goals = [];
    DATABASE.matches.forEach(match => {
      (match.events?.goals || []).forEach(g => {
        if (g.type === 'favor') goals.push({ ...g, matchId: match.id, jornada: match.jornada, opponent: match.opponent });
      });
    });
    return goals;
  }, []);

  const scorers = [...new Set(allGoals.map(g => g.scorer).filter(Boolean))];

  const filtered = allGoals.filter(g => {
    if (matchFilter  !== 'all' && g.matchId  !== matchFilter)  return false;
    if (playerFilter !== 'all' && g.scorer   !== playerFilter) return false;
    return true;
  });

  const activeGoalData = activeGoal !== null ? filtered[activeGoal] : null;
  const activeColor    = activeGoalData ? (PLAYER_COLORS[activeGoalData.scorer] || DEFAULT_COLOR) : '#666';

  // Capçaleres de fletxa per jugador
  const arrowPlayers = [...new Set(filtered.filter(g => g.assistPos).map(g => g.scorer))];

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-3xl font-black text-white mb-1">Mapa de Gols</h2>
        <p className="text-gray-500 text-sm">Zona d'atac · On s'originen i on entren els gols</p>
      </header>

      {/* Filtres partits */}
      <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5 w-fit flex-wrap">
        <button onClick={() => { setMatchFilter('all'); setActiveGoal(null); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${matchFilter === 'all' ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
          Tots
        </button>
        {DATABASE.matches.map(m => (
          <button key={m.id} onClick={() => { setMatchFilter(m.id); setActiveGoal(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${matchFilter === m.id ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
            {m.jornada} · {m.opponent}
          </button>
        ))}
      </div>

      {/* Llegenda jugadors */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => { setPlayerFilter('all'); setActiveGoal(null); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all
            ${playerFilter === 'all' ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 text-gray-500 hover:text-white'}`}>
          <span className="w-2.5 h-2.5 rounded-full bg-white/40 inline-block" />
          Tots
        </button>
        {scorers.map(name => {
          const color = PLAYER_COLORS[name] || DEFAULT_COLOR;
          return (
            <button key={name} onClick={() => { setPlayerFilter(name === playerFilter ? 'all' : name); setActiveGoal(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                ${playerFilter === name ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-80'}`}
              style={{ borderColor: color + '60', background: playerFilter === name ? color + '20' : 'transparent', color }}>
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />
              {name.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Comptador + tooltip actiu */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-2xl font-black text-emerald-400">{filtered.length}</span>
          <span className="text-xs text-emerald-600">gols a favor</span>
        </div>
        {activeGoalData && (
          <GoalTooltip goal={activeGoalData} idx={activeGoal} color={activeColor} />
        )}
      </div>

      {/* Layout: camp + porteria costat a costat */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">

        {/* ── CAMP ── */}
        <div className="bg-[#141a14] rounded-2xl border border-white/5 p-4 overflow-x-auto">
          <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider">Camp — zona de tir</p>
          <svg viewBox="-18 -18 440 236" style={{ width: '100%', minWidth: '300px' }}>
            <defs>
              {arrowPlayers.map(name => {
                const c = PLAYER_COLORS[name] || DEFAULT_COLOR;
                return (
                  <marker key={name} id={`arrow-${name.split(' ')[0]}`}
                    markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill={c} opacity="0.8" />
                  </marker>
                );
              })}
            </defs>

            {/* Gespa */}
            <rect x={0} y={0} width={400} height={200} rx={5} fill="#152615" stroke="#2a5a2a" strokeWidth={2}/>

            {/* Franges horitzontals subtils de gespa */}
            {[0,25,50,75,100,125,150,175].map((y,i) => (
              <rect key={y} x={0} y={y} width={400} height={25} fill={i%2===0 ? 'rgba(255,255,255,0.012)' : 'transparent'}/>
            ))}

            {/* Grid molt subtil */}
            {[66,133,200,266,333].map(x => (
              <line key={x} x1={x} y1={0} x2={x} y2={200} stroke="#2a5a2a" strokeWidth={0.3} strokeDasharray="2,8"/>
            ))}
            {[50,100,150].map(y => (
              <line key={y} x1={0} y1={y} x2={400} y2={y} stroke="#2a5a2a" strokeWidth={0.3} strokeDasharray="2,8"/>
            ))}

            {/* Línia de centre */}
            <line x1={0} y1={0} x2={0} y2={200} stroke="#2a5a2a" strokeWidth={2}/>
            {/* Semicercle centre camp */}
            <path d="M 0,72 A 46,46 0 0,1 0,128" fill="none" stroke="#2a5a2a" strokeWidth={1.2}/>

            {/* Àrea penal en arc (radi 96px ~ 6m proporcionat a 400px=25m) */}
            <path d="M 400,42 A 98,98 0 0,0 400,158"
              fill="rgba(255,255,255,0.035)" stroke="#3a7a3a" strokeWidth={1.5}/>

            {/* Àrea petita */}
            <rect x={368} y={85} width={32} height={30} fill="rgba(255,255,255,0.025)" stroke="#2a5a2a" strokeWidth={1}/>

            {/* Punt penal */}
            <circle cx={340} cy={100} r={2.5} fill="#3a7a3a"/>
            {/* 2n punt penal */}
            <circle cx={300} cy={100} r={1.8} fill="#2a5a2a"/>

            {/* Porteria */}
            <rect x={400} y={80} width={12} height={40} fill="#111" stroke="#777" strokeWidth={1.5} rx={1}/>

            {/* Etiquetes zones */}
            {['A','B','C','D'].map((row, ri) =>
              [1,2,3,4,5,6].map((col, ci) => {
                const x = 33 + ci * 66.6;
                const y = 25 + ri * 50;
                return (
                  <text key={`${row}${col}`} x={x} y={y - 14}
                    textAnchor="middle" fontSize={7} fill="rgba(255,255,255,0.18)" fontWeight="bold">
                    {row}{col}
                  </text>
                );
              })
            )}

            {/* Etiquetes orientació */}
            <text x={200} y={-6} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.18)">→ direcció atac</text>
            <text x={-12} y={100} textAnchor="middle" dominantBaseline="middle" fontSize={7}
              fill="rgba(255,255,255,0.15)" transform="rotate(-90,-12,100)">centre camp</text>

            {/* Gols */}
            {filtered.map((g, idx) => (
              <GoalOnPitch key={`${g.matchId}-${idx}`} goal={g} idx={idx}
                isActive={activeGoal === idx} onClick={setActiveGoal} />
            ))}
          </svg>
        </div>

        {/* ── PORTERIA ── */}
        <div className="bg-[#141414] rounded-2xl border border-white/5 p-4 overflow-x-auto">
          <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider">Porteria rival — on entra</p>
          <svg viewBox="-12 -12 324 238" style={{ width: '100%', minWidth: '180px' }}>

            {/* Fons terra */}
            <rect x={-12} y={206} width={324} height={20} fill="#152615"/>
            <line x1={-12} y1={206} x2={312} y2={206} stroke="#3a7a3a" strokeWidth={1}/>

            {/* Xarxa fons */}
            {[50,100,150,200,250].map(x => (
              <line key={x} x1={x} y1={0} x2={x} y2={200} stroke="#1f1f1f" strokeWidth={0.8}/>
            ))}
            {[50,100,150].map(y => (
              <line key={y} x1={0} y1={y} x2={300} y2={y} stroke="#1f1f1f" strokeWidth={0.8}/>
            ))}

            {/* Divisió zones 6x4 */}
            {[50,100,150,200,250].map(x => (
              <line key={`z${x}`} x1={x} y1={0} x2={x} y2={200} stroke="rgba(255,255,255,0.09)" strokeWidth={0.8}/>
            ))}
            {[50,100,150].map(y => (
              <line key={`zy${y}`} x1={0} y1={y} x2={300} y2={y} stroke="rgba(255,255,255,0.09)" strokeWidth={0.8}/>
            ))}

            {/* Etiquetes zones porteria */}
            {['A','B','C','D'].map((row, ri) =>
              [1,2,3,4,5,6].map((col, ci) => (
                <text key={`${row}${col}`}
                  x={25 + ci * 50} y={25 + ri * 50}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={8} fill="rgba(255,255,255,0.2)" fontWeight="bold">
                  {row}{col}
                </text>
              ))
            )}

            {/* Gols a la xarxa */}
            {filtered.map((g, idx) => (
              <GoalInNet key={`net-${g.matchId}-${idx}`} goal={g} idx={idx} isActive={activeGoal === idx} />
            ))}

            {/* Marc porteria */}
            <rect x={-4} y={-4} width={8} height={208} rx={3} fill="#d0d0d0"/>
            <rect x={296} y={-4} width={8} height={208} rx={3} fill="#d0d0d0"/>
            <rect x={-4} y={-4} width={308} height={8} rx={3} fill="#d0d0d0"/>
            <rect x={-4} y={202} width={308} height={5} rx={1} fill="#aaa"/>

            {/* Mesures */}
            <text x={150} y={218} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.18)">3 metres</text>
            <text x={-10} y={100} textAnchor="middle" dominantBaseline="middle"
              fontSize={8} fill="rgba(255,255,255,0.18)" transform="rotate(-90,-10,100)">2 metres</text>
          </svg>
        </div>
      </div>

      {/* Llegenda */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-gray-500" style={{ borderTop: '1px dashed #666' }}/>
          <span>línia d'assistència</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-500"/>
          <span>punt d'assistència</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center text-[8px] text-white font-bold bg-gray-700">1</div>
          <span>punt de tir · clica per detall</span>
        </div>
      </div>
    </div>
  );
}
