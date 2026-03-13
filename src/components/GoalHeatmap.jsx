import React, { useState, useMemo } from 'react';
import { DATABASE } from '../data.js';

const ACCENT = '#E5C07B';

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

// ── Targeta info gol ──────────────────────────────────────────────
function GoalCard({ goal, idx, onClose }) {
  if (!goal) return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6">
      <div className="text-4xl mb-3 opacity-30">⚽</div>
      <p className="text-gray-600 text-sm">Clica un gol al camp per veure el detall</p>
    </div>
  );

  const color = PLAYER_COLORS[goal.scorer] || ACCENT;
  return (
    <div className="p-5 space-y-4 animate-fade-in">
      {/* Número + tanca */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white"
            style={{ background: ACCENT }}>
            {idx + 1}
          </div>
          <div>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider">{goal.jornada} · {goal.opponent}</p>
            <p className="text-white font-bold text-base leading-tight">{goal.time}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-300 text-lg leading-none px-1">×</button>
      </div>

      {/* Separator */}
      <div className="h-px bg-white/5"/>

      {/* Marcador */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ACCENT }}/>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Gol</p>
            <p className="text-white font-semibold">{goal.scorer}</p>
          </div>
        </div>
        {goal.assist && (
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full flex-shrink-0 bg-gray-500"/>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Assistència</p>
              <p className="text-gray-300 font-medium">{goal.assist}</p>
            </div>
          </div>
        )}
        {goal.zone && (
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full flex-shrink-0 bg-gray-700"/>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Zona</p>
              <p className="text-gray-400 font-mono text-sm">{goal.zone}</p>
            </div>
          </div>
        )}
      </div>

      {/* Porteria miniatura */}
      {goal.goalPos && (
        <>
          <div className="h-px bg-white/5"/>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">On entra</p>
            <svg viewBox="-6 -6 312 212" style={{ width:'100%', maxWidth:220 }}>
              <rect x={0} y={0} width={300} height={200} fill="#0d0d0d"/>
              {[50,100,150,200,250].map(x => (
                <line key={x} x1={x} y1={0} x2={x} y2={200} stroke="rgba(255,255,255,0.06)" strokeWidth={0.6}/>
              ))}
              {[50,100,150].map(y => (
                <line key={y} x1={0} y1={y} x2={300} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={0.6}/>
              ))}
              {/* Pals */}
              <rect x={-5} y={-5} width={8} height={210} rx={2} fill="#e0e0e0"/>
              <rect x={297} y={-5} width={8} height={210} rx={2} fill="#e0e0e0"/>
              <rect x={-5} y={-5} width={310} height={8} rx={2} fill="#e0e0e0"/>
              <rect x={-5} y={200} width={310} height={5} rx={1} fill="#aaa"/>
              {/* Profunditat */}
              <line x1={-5} y1={-5} x2={-14} y2={-14} stroke="#888" strokeWidth={1.5}/>
              <line x1={305} y1={-5} x2={314} y2={-14} stroke="#888" strokeWidth={1.5}/>
              <line x1={-14} y1={-14} x2={314} y2={-14} stroke="#888" strokeWidth={1}/>
              {/* Punt */}
              <circle cx={goal.goalPos.x} cy={goal.goalPos.y} r={18} fill={ACCENT} opacity={0.2}/>
              <circle cx={goal.goalPos.x} cy={goal.goalPos.y} r={10} fill={ACCENT} stroke="white" strokeWidth={2} opacity={0.95}/>
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

// ── Camp SVG ──────────────────────────────────────────────────────
function PitchSVG({ filtered, activeGoal, setActiveGoal }) {
  return (
    <svg viewBox="-5 -5 435 220" style={{ width:'100%', display:'block' }}>
      <defs>
        <marker id="arr-assist" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill={ACCENT} opacity="0.7"/>
        </marker>
      </defs>

      {/* Gespa */}
      <rect x={0} y={0} width={420} height={210} rx={6} fill="#1a3d1a"/>
      {/* Franges */}
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x={0} y={i*30} width={420} height={30}
          fill={i%2===0 ? 'rgba(0,0,0,0.07)' : 'transparent'}/>
      ))}
      {/* Vora */}
      <rect x={0} y={0} width={420} height={210} rx={6} fill="none"
        stroke="rgba(255,255,255,0.75)" strokeWidth={2}/>

      {/* Línia centre */}
      <line x1={0} y1={0} x2={0} y2={210} stroke="rgba(255,255,255,0.75)" strokeWidth={2}/>
      {/* Cercle centre */}
      <circle cx={0} cy={105} r={52} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5}/>
      <circle cx={0} cy={105} r={3} fill="rgba(255,255,255,0.8)"/>

      {/* Àrea penal: línies rectes + arc */}
      <line x1={420} y1={68} x2={368} y2={68} stroke="rgba(255,255,255,0.75)" strokeWidth={1.8}/>
      <line x1={420} y1={142} x2={368} y2={142} stroke="rgba(255,255,255,0.75)" strokeWidth={1.8}/>
      <path d="M 368,68 A 90,90 0 0,0 368,142"
        fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.75)" strokeWidth={1.8}/>

      {/* Àrea petita */}
      <line x1={420} y1={89} x2={400} y2={89} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2}/>
      <line x1={420} y1={121} x2={400} y2={121} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2}/>
      <line x1={400} y1={89} x2={400} y2={121} stroke="rgba(255,255,255,0.5)" strokeWidth={1.2}/>

      {/* Punts penal */}
      <circle cx={360} cy={105} r={3} fill="rgba(255,255,255,0.8)"/>
      <circle cx={315} cy={105} r={2.5} fill="rgba(255,255,255,0.4)"/>

      {/* Porteria */}
      <rect x={420} y={89} width={14} height={32}
        fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.9)" strokeWidth={2.5} rx={1}/>

      {/* Gols */}
      {filtered.map((g, idx) => {
        if (!g.shotPos) return null;
        const isActive = activeGoal === idx;
        const shot   = g.shotPos;
        const assist = g.assistPos;
        return (
          <g key={`${g.matchId}-${idx}`} onClick={() => setActiveGoal(isActive ? null : idx)}
            style={{ cursor:'pointer' }}>
            {/* Línia assist */}
            {assist && (
              <line x1={assist.x} y1={assist.y} x2={shot.x} y2={shot.y}
                stroke={ACCENT} strokeWidth={isActive ? 2.5 : 1.5}
                strokeDasharray="5,3" opacity={isActive ? 1 : 0.45}
                markerEnd="url(#arr-assist)"/>
            )}
            {/* Punt assist */}
            {assist && (
              <circle cx={assist.x} cy={assist.y} r={isActive ? 6 : 4}
                fill={ACCENT} opacity={isActive ? 0.9 : 0.35}/>
            )}
            {/* Aura actiu */}
            {isActive && (
              <circle cx={shot.x} cy={shot.y} r={24}
                fill={ACCENT} opacity={0.15}/>
            )}
            {/* Cercle tir */}
            <circle cx={shot.x} cy={shot.y}
              r={isActive ? 12 : 8}
              fill={isActive ? ACCENT : 'rgba(255,255,255,0.85)'}
              stroke={isActive ? 'white' : 'rgba(255,255,255,0.3)'}
              strokeWidth={isActive ? 2 : 1}
              opacity={isActive ? 1 : 0.75}/>
            {/* Número */}
            <text x={shot.x} y={shot.y} textAnchor="middle" dominantBaseline="middle"
              fontSize={isActive ? 8 : 6.5} fontWeight="bold"
              fill={isActive ? '#1a1a1a' : '#1a3d1a'}
              style={{ pointerEvents:'none' }}>
              {idx + 1}
            </text>
          </g>
        );
      })}
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

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-3xl font-black text-white mb-1">Mapa de Gols</h2>
        <p className="text-gray-500 text-sm">{filtered.length} gols a favor · clica un per veure el detall</p>
      </header>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2">
        <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5">
          <button onClick={() => { setMatchFilter('all'); setActiveGoal(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${matchFilter==='all' ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
            Tots
          </button>
          {DATABASE.matches.map(m => (
            <button key={m.id} onClick={() => { setMatchFilter(m.id); setActiveGoal(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                ${matchFilter===m.id ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
              {m.jornada}
            </button>
          ))}
        </div>
      </div>

      {/* Jugadors */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => { setPlayerFilter('all'); setActiveGoal(null); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all
            ${playerFilter==='all' ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 text-gray-500 hover:text-white'}`}>
          Tots
        </button>
        {scorers.map(name => (
          <button key={name}
            onClick={() => { setPlayerFilter(name===playerFilter ? 'all' : name); setActiveGoal(null); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all
              ${playerFilter===name
                ? 'bg-[#E5C07B]/15 border-[#E5C07B]/50 text-[#E5C07B]'
                : 'border-white/10 text-gray-500 hover:text-white hover:border-white/20'}`}>
            {name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Layout principal: camp + info lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-4 items-start">

        {/* Camp + Porteria apilats */}
        <div className="space-y-3">
          {/* Camp */}
          <div className="bg-[#0f1a0f] rounded-2xl border border-white/5 p-4 overflow-x-auto">
            <p className="text-[10px] text-gray-600 mb-3 uppercase tracking-wider font-bold">Camp · zona de tir</p>
            <PitchSVG filtered={filtered} activeGoal={activeGoal} setActiveGoal={setActiveGoal}/>
          </div>

          {/* Porteria */}
          <div className="bg-[#0d0d0d] rounded-2xl border border-white/5 p-4 overflow-x-auto">
            <p className="text-[10px] text-gray-600 mb-3 uppercase tracking-wider font-bold">Porteria rival · on entra</p>
            <svg viewBox="-15 -15 330 230" style={{ width:'100%', display:'block' }}>
              {/* Fons */}
              <rect x={0} y={0} width={300} height={200} fill="#0a0a0a"/>
              {/* Xarxa fina */}
              {[25,50,75,100,125,150,175,200,225,250,275].map(x => (
                <line key={x} x1={x} y1={0} x2={x} y2={200} stroke="rgba(255,255,255,0.05)" strokeWidth={0.6}/>
              ))}
              {[20,40,60,80,100,120,140,160,180].map(y => (
                <line key={y} x1={0} y1={y} x2={300} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={0.6}/>
              ))}
              {/* Zones */}
              {[50,100,150,200,250].map(x => (
                <line key={`z${x}`} x1={x} y1={0} x2={x} y2={200} stroke="rgba(255,255,255,0.1)" strokeWidth={0.8}/>
              ))}
              {[50,100,150].map(y => (
                <line key={`zy${y}`} x1={0} y1={y} x2={300} y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth={0.8}/>
              ))}
              {/* Terra */}
              <rect x={-15} y={200} width={330} height={15} fill="#1a3d1a"/>
              <line x1={-15} y1={200} x2={315} y2={200} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5}/>
              {/* Gols */}
              {filtered.map((g, idx) => {
                if (!g.goalPos) return null;
                const isActive = activeGoal === idx;
                const pos = g.goalPos;
                return (
                  <g key={`net-${idx}`} onClick={() => setActiveGoal(isActive ? null : idx)}
                    style={{ cursor:'pointer' }}>
                    {isActive && <circle cx={pos.x} cy={pos.y} r={22} fill={ACCENT} opacity={0.2}/>}
                    <circle cx={pos.x} cy={pos.y} r={isActive ? 12 : 8}
                      fill={isActive ? ACCENT : 'rgba(255,255,255,0.8)'}
                      stroke={isActive ? 'white' : 'rgba(255,255,255,0.2)'}
                      strokeWidth={isActive ? 2 : 1}/>
                    <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle"
                      fontSize={isActive ? 8 : 6.5} fontWeight="bold"
                      fill={isActive ? '#1a1a1a' : '#111'}
                      style={{ pointerEvents:'none' }}>
                      {idx + 1}
                    </text>
                  </g>
                );
              })}
              {/* Pals */}
              <rect x={-8} y={-8} width={10} height={216} rx={3} fill="#efefef"/>
              <rect x={298} y={-8} width={10} height={216} rx={3} fill="#efefef"/>
              <rect x={-8} y={-8} width={316} height={10} rx={3} fill="#efefef"/>
              <rect x={-8} y={202} width={316} height={6} rx={2} fill="#ccc"/>
              {/* Profunditat 3D */}
              <line x1={-8} y1={-8} x2={-20} y2={-20} stroke="#999" strokeWidth={2}/>
              <line x1={308} y1={-8} x2={320} y2={-20} stroke="#999" strokeWidth={2}/>
              <line x1={-20} y1={-20} x2={320} y2={-20} stroke="#999" strokeWidth={1.5}/>
              <line x1={-20} y1={-20} x2={-20} y2={195} stroke="#777" strokeWidth={1}/>
              <line x1={320} y1={-20} x2={320} y2={195} stroke="#777" strokeWidth={1}/>
              {/* Mesures */}
              <text x={150} y={220} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.18)">3 metres</text>
            </svg>
          </div>
        </div>

        {/* Targeta info gol — lateral */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 min-h-[200px] lg:sticky lg:top-4">
          <GoalCard goal={activeGoalData} idx={activeGoal} onClose={() => setActiveGoal(null)}/>
        </div>
      </div>

      {/* Llegenda */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <svg width="22" height="8"><line x1="0" y1="4" x2="16" y2="4" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4,2" opacity="0.7"/><polygon points="14,1 20,4 14,7" fill={ACCENT} opacity="0.7"/></svg>
          línia d'assistència
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-white/70"/>
          punt de tir
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full" style={{ background: ACCENT }}/>
          gol seleccionat
        </div>
      </div>
    </div>
  );
}
