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

function GoalOnPitch({ goal, idx, isActive, onClick }) {
  const color  = PLAYER_COLORS[goal.scorer] || DEFAULT_COLOR;
  const shot   = goal.shotPos;
  const assist = goal.assistPos;
  if (!shot) return null;
  const scorerFirst = goal.scorer?.split(' ')[0] || 'gol';

  return (
    <g onClick={() => onClick(idx)} style={{ cursor: 'pointer' }}>
      {assist && (
        <line x1={assist.x} y1={assist.y} x2={shot.x} y2={shot.y}
          stroke={color} strokeWidth={isActive ? 2.2 : 1.4}
          strokeDasharray="5,3" opacity={isActive ? 0.95 : 0.5}
          markerEnd={`url(#arr-${scorerFirst})`} />
      )}
      {assist && (
        <circle cx={assist.x} cy={assist.y} r={isActive ? 5.5 : 3.5}
          fill={color} opacity={isActive ? 0.8 : 0.4} />
      )}
      <circle cx={shot.x} cy={shot.y} r={isActive ? 22 : 14}
        fill={color} opacity={isActive ? 0.2 : 0.09} />
      <circle cx={shot.x} cy={shot.y} r={isActive ? 11 : 7.5}
        fill={color} stroke="rgba(255,255,255,0.9)" strokeWidth={1.8} opacity={0.97} />
      <text x={shot.x} y={shot.y} textAnchor="middle" dominantBaseline="middle"
        fontSize={isActive ? 7.5 : 6} fontWeight="bold" fill="white" style={{ pointerEvents:'none' }}>
        {idx + 1}
      </text>
    </g>
  );
}

function GoalInNet({ goal, idx, isActive }) {
  const color = PLAYER_COLORS[goal.scorer] || DEFAULT_COLOR;
  const pos   = goal.goalPos;
  if (!pos) return null;
  return (
    <g style={{ cursor:'pointer' }}>
      <circle cx={pos.x} cy={pos.y} r={isActive ? 20 : 13}
        fill={color} opacity={isActive ? 0.28 : 0.12} />
      <circle cx={pos.x} cy={pos.y} r={isActive ? 10 : 6.5}
        fill={color} stroke="rgba(255,255,255,0.9)" strokeWidth={1.8} opacity={0.97} />
      <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
        fontSize={isActive ? 7.5 : 6} fontWeight="bold" fill="white" style={{ pointerEvents:'none' }}>
        {idx + 1}
      </text>
    </g>
  );
}

function GoalTooltip({ goal, idx, color }) {
  return (
    <div className="bg-[#0d0d0d] rounded-xl border p-3 text-xs space-y-1"
      style={{ borderColor: color + '60', minWidth: 190 }}>
      <div className="font-bold text-sm" style={{ color }}>{idx + 1}. {goal.time} · {goal.jornada}</div>
      <div className="text-white font-semibold">{goal.scorer}</div>
      {goal.assist && <div className="text-gray-400">↳ assist: <span className="text-gray-300">{goal.assist}</span></div>}
      <div className="text-gray-600 text-[10px]">vs {goal.opponent}</div>
    </div>
  );
}

// ── Camp SVG ──────────────────────────────────────────────────────
// viewBox: 0 0 420 210  (mitja pista, porteria a la dreta)
// Proporcions reals futsal: 40m × 20m → 400×200 + marges
function PitchSVG({ filtered, activeGoal, setActiveGoal }) {
  const arrowScorers = [...new Set(filtered.filter(g => g.assistPos).map(g => g.scorer))];
  return (
    <svg viewBox="-5 -5 435 220" style={{ width:'100%', minWidth:300, display:'block' }}>
      <defs>
        {arrowScorers.map(name => {
          const c = PLAYER_COLORS[name] || DEFAULT_COLOR;
          const id = name.split(' ')[0];
          return (
            <marker key={name} id={`arr-${id}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L0,7 L7,3.5 z" fill={c} opacity="0.85"/>
            </marker>
          );
        })}
      </defs>

      {/* Fons gespa */}
      <rect x={0} y={0} width={420} height={210} rx={6} fill="#1a3d1a"/>

      {/* Franges de gespa alternades */}
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x={0} y={i*30} width={420} height={30}
          fill={i%2===0 ? 'rgba(0,0,0,0.06)' : 'transparent'}/>
      ))}

      {/* Línies blanques del camp */}
      {/* Vora exterior */}
      <rect x={0} y={0} width={420} height={210} rx={6} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2}/>

      {/* Línia de mig camp (esquerra = centre del camp real) */}
      <line x1={0} y1={0} x2={0} y2={210} stroke="rgba(255,255,255,0.7)" strokeWidth={2}/>

      {/* Cercle central (mig del camp real) */}
      <circle cx={0} cy={105} r={52} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5}/>
      <circle cx={0} cy={105} r={3} fill="rgba(255,255,255,0.7)"/>

      {/* ÀREA PENAL DRETA (porteria a x=420)
          Futsal: àrea = semicercle de radi 6m des del punt de penal (a 6m de la línia de gol)
          Punt penal = 420-60=360, y=105
          Arc de radi 6m = 60px, però l'àrea real és la línia dels 6m des de cada pal de la porteria
          Pal porteria: y=105±35 (porteria 3m=30px... fem 3m~30px sobre 20m=210px → porteria=31.5px)
          Porteria: 3m → 3/20*210=31.5px d'alt → centrada: y=105-15.75 a y=105+15.75 ≈ y=89 a y=121
          
          Àrea futsal real: dues línies perpendiculars des dels pals de 6m, unides per un arc
          Punt de penal a 6m=60px de la línia de gol → x=420-60=360
          Arc centrat al punt de penal, radi 6m=60px
          Les línies rectes van des de y=89 i y=121 fins x=360, horitzontal
          Però l'arc talla als 6m des dels pals → simplifiquem amb l'arc des de (360,105) r=60
          des de x=420,y=89 fins x=420,y=121 passant per x=300,y=105
      -->

      {/* Àrea gran: línies rectes als costats + arc al centre */}
      {/* Línia recta superior àrea */}
      <line x1={420} y1={68} x2={368} y2={68} stroke="rgba(255,255,255,0.7)" strokeWidth={1.8}/>
      {/* Línia recta inferior àrea */}
      <line x1={420} y1={142} x2={368} y2={142} stroke="rgba(255,255,255,0.7)" strokeWidth={1.8}/>
      {/* Arc de l'àrea (semicercle des del punt de penal) */}
      <path d="M 368,68 A 90,90 0 0,0 368,142"
        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.7)" strokeWidth={1.8}/>

      {/* Àrea petita */}
      <line x1={420} y1={89} x2={400} y2={89} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2}/>
      <line x1={420} y1={121} x2={400} y2={121} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2}/>
      <line x1={400} y1={89} x2={400} y2={121} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2}/>

      {/* Punt de penal */}
      <circle cx={360} cy={105} r={3} fill="rgba(255,255,255,0.8)"/>
      {/* 2n punt de penal */}
      <circle cx={315} cy={105} r={2.5} fill="rgba(255,255,255,0.5)"/>

      {/* Porteria */}
      <rect x={420} y={89} width={14} height={32}
        fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.9)" strokeWidth={2.5} rx={1}/>

      {/* Etiquetes zones molt subtils */}
      {['A','B','C','D'].map((row, ri) =>
        [1,2,3,4,5,6].map((col, ci) => {
          const x = 35 + ci * 70;
          const y = 26 + ri * 52;
          return (
            <text key={`${row}${col}`} x={x} y={y}
              textAnchor="middle" fontSize={7.5} fill="rgba(255,255,255,0.16)" fontWeight="bold">
              {row}{col}
            </text>
          );
        })
      )}

      {/* Grid zones ultra subtil */}
      {[70,140,210,280,350].map(x => (
        <line key={x} x1={x} y1={0} x2={x} y2={210} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5}/>
      ))}
      {[52,105,157].map(y => (
        <line key={y} x1={0} y1={y} x2={420} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={0.5}/>
      ))}

      {/* Gols */}
      {filtered.map((g, idx) => (
        <GoalOnPitch key={`${g.matchId}-${idx}`} goal={g} idx={idx}
          isActive={activeGoal === idx} onClick={setActiveGoal}/>
      ))}
    </svg>
  );
}

// ── Porteria SVG ──────────────────────────────────────────────────
// viewBox: 0 0 300 200 → 6 cols x 4 files = 24 zones
function GoalSVG({ filtered, activeGoal }) {
  return (
    <svg viewBox="-15 -15 330 240" style={{ width:'100%', minWidth:160, display:'block' }}>

      {/* Terra */}
      <rect x={-15} y={200} width={330} height={25} fill="#1a3d1a"/>
      <line x1={-15} y1={200} x2={315} y2={200} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5}/>

      {/* Herba de fons porteria */}
      <rect x={0} y={0} width={300} height={200} fill="#0f0f0f"/>
      {/* Franges xarxa */}
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x={i*50} y={0} width={50} height={200}
          fill={i%2===0 ? 'rgba(255,255,255,0.015)' : 'transparent'}/>
      ))}

      {/* Xarxa fons - lines verticals fines */}
      {[25,50,75,100,125,150,175,200,225,250,275].map(x => (
        <line key={x} x1={x} y1={0} x2={x} y2={200} stroke="rgba(255,255,255,0.06)" strokeWidth={0.6}/>
      ))}
      {[20,40,60,80,100,120,140,160,180].map(y => (
        <line key={y} x1={0} y1={y} x2={300} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={0.6}/>
      ))}

      {/* Divisió zones 6x4 */}
      {[50,100,150,200,250].map(x => (
        <line key={`z${x}`} x1={x} y1={0} x2={x} y2={200} stroke="rgba(255,255,255,0.12)" strokeWidth={0.8}/>
      ))}
      {[50,100,150].map(y => (
        <line key={`zy${y}`} x1={0} y1={y} x2={300} y2={y} stroke="rgba(255,255,255,0.12)" strokeWidth={0.8}/>
      ))}

      {/* Etiquetes zones */}
      {['A','B','C','D'].map((row,ri) =>
        [1,2,3,4,5,6].map((col,ci) => (
          <text key={`${row}${col}`} x={25+ci*50} y={25+ri*50}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={9} fill="rgba(255,255,255,0.22)" fontWeight="bold">
            {row}{col}
          </text>
        ))
      )}

      {/* Gols */}
      {filtered.map((g,idx) => (
        <GoalInNet key={`net-${g.matchId}-${idx}`} goal={g} idx={idx} isActive={activeGoal===idx}/>
      ))}

      {/* Pals — gruixuts i visibles */}
      {/* Pal esquerre */}
      <rect x={-8} y={-8} width={10} height={216} rx={3} fill="#f0f0f0"/>
      {/* Pal dret */}
      <rect x={298} y={-8} width={10} height={216} rx={3} fill="#f0f0f0"/>
      {/* Travesser */}
      <rect x={-8} y={-8} width={316} height={10} rx={3} fill="#f0f0f0"/>
      {/* Base */}
      <rect x={-8} y={198} width={316} height={7} rx={2} fill="#d0d0d0"/>

      {/* Profunditat porteria (efecte 3D) */}
      <line x1={-8} y1={-8} x2={-20} y2={-20} stroke="#aaa" strokeWidth={2}/>
      <line x1={308} y1={-8} x2={320} y2={-20} stroke="#aaa" strokeWidth={2}/>
      <line x1={-20} y1={-20} x2={320} y2={-20} stroke="#aaa" strokeWidth={1.5}/>

      {/* Mesures */}
      <line x1={0} y1={215} x2={300} y2={215} stroke="rgba(255,255,255,0.15)" strokeWidth={0.8}/>
      <line x1={0} y1={211} x2={0} y2={219} stroke="rgba(255,255,255,0.15)" strokeWidth={0.8}/>
      <line x1={300} y1={211} x2={300} y2={219} stroke="rgba(255,255,255,0.15)" strokeWidth={0.8}/>
      <text x={150} y={226} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.2)">3 metres</text>
    </svg>
  );
}

// ── Component principal ───────────────────────────────────────────
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

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-3xl font-black text-white mb-1">Mapa de Gols</h2>
        <p className="text-gray-500 text-sm">Zona d'atac · On s'originen i on entren els gols</p>
      </header>

      {/* Filtres partits */}
      <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5 w-fit flex-wrap">
        <button onClick={() => { setMatchFilter('all'); setActiveGoal(null); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
            ${matchFilter==='all' ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
          Tots
        </button>
        {DATABASE.matches.map(m => (
          <button key={m.id} onClick={() => { setMatchFilter(m.id); setActiveGoal(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${matchFilter===m.id ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
            {m.jornada} · {m.opponent}
          </button>
        ))}
      </div>

      {/* Llegenda jugadors */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => { setPlayerFilter('all'); setActiveGoal(null); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all
            ${playerFilter==='all' ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 text-gray-500 hover:text-white'}`}>
          <span className="w-2.5 h-2.5 rounded-full bg-white/40 inline-block"/>
          Tots
        </button>
        {scorers.map(name => {
          const color = PLAYER_COLORS[name] || DEFAULT_COLOR;
          return (
            <button key={name} onClick={() => { setPlayerFilter(name===playerFilter ? 'all' : name); setActiveGoal(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                ${playerFilter===name ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-80'}`}
              style={{ borderColor:color+'60', background:playerFilter===name ? color+'20' : 'transparent', color }}>
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background:color }}/>
              {name.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Comptador + tooltip */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-2xl font-black text-emerald-400">{filtered.length}</span>
          <span className="text-xs text-emerald-600">gols a favor</span>
        </div>
        {activeGoalData && <GoalTooltip goal={activeGoalData} idx={activeGoal} color={activeColor}/>}
        {!activeGoalData && filtered.length > 0 && (
          <p className="text-xs text-gray-600">Clica un gol per veure el detall</p>
        )}
      </div>

      {/* Camp + Porteria */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="bg-[#0f1a0f] rounded-2xl border border-white/5 p-3 overflow-x-auto">
          <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider font-bold">Camp — zona de tir</p>
          <PitchSVG filtered={filtered} activeGoal={activeGoal} setActiveGoal={setActiveGoal}/>
        </div>
        <div className="bg-[#0d0d0d] rounded-2xl border border-white/5 p-3 overflow-x-auto">
          <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider font-bold">Porteria rival — on entra</p>
          <GoalSVG filtered={filtered} activeGoal={activeGoal}/>
        </div>
      </div>

      {/* Llegenda */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <svg width="20" height="8"><line x1="0" y1="4" x2="16" y2="4" stroke="#888" strokeWidth="1.5" strokeDasharray="4,2"/><polygon points="14,1 20,4 14,7" fill="#888"/></svg>
          <span>línia d'assistència</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-500 opacity-50"/>
          <span>origen de l'assist</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center text-[8px] text-white font-bold bg-gray-700">1</div>
          <span>punt de tir · clica per detall</span>
        </div>
      </div>
    </div>
  );
}
