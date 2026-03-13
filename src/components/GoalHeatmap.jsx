import React, { useState, useMemo } from 'react';
import { DATABASE } from '../data.js';

// Dimensions pista de futbol sala (40x20m normalitzades)
const W = 400, H = 200;
const GOAL_W = 20, GOAL_H = 40; // porteria

function parseZone(goal) {
  // Intenta extreure posició si existeix al camp, sinó zona aleatòria propera a porteria
  if (goal.position) return goal.position;
  // Distribuïm properes a les porteries per defecte
  if (goal.type === 'favor') {
    return { x: 340 + Math.random() * 40, y: 70 + Math.random() * 60 };
  } else {
    return { x: 20 + Math.random() * 40, y: 70 + Math.random() * 60 };
  }
}

function Dot({ x, y, type, goal, idx }) {
  const [hover, setHover] = useState(false);
  const color = type === 'favor' ? '#27AE60' : '#C0392B';

  return (
    <g>
      {/* Glow */}
      <circle cx={x} cy={y} r={hover ? 16 : 12}
        fill={color} opacity={0.15}
        style={{ transition: 'r 0.2s, opacity 0.2s' }} />
      {/* Dot */}
      <circle cx={x} cy={y} r={hover ? 8 : 6}
        fill={color} stroke="white" strokeWidth={1.5} opacity={0.9}
        style={{ cursor: 'pointer', transition: 'r 0.2s' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)} />
      {/* Número */}
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
        fontSize={7} fontWeight="bold" fill="white" style={{ pointerEvents: 'none' }}>
        {idx + 1}
      </text>
      {/* Tooltip */}
      {hover && (
        <g>
          <rect x={x - 55} y={y - 40} width={110} height={32} rx={4}
            fill="#0d0d0d" stroke={color} strokeWidth={1} />
          <text x={x} y={y - 28} textAnchor="middle" fontSize={8} fill={color} fontWeight="bold">
            {goal.time} · {type === 'favor' ? '⚽ Gol a favor' : '❌ En contra'}
          </text>
          <text x={x} y={y - 16} textAnchor="middle" fontSize={7} fill="#aaa">
            {goal.scorer || goal.goalkeeper || 'Desconegut'}
          </text>
        </g>
      )}
    </g>
  );
}

export default function GoalHeatmap() {
  const [filter, setFilter] = useState('all'); // 'all' | 'favor' | 'contra'
  const [matchFilter, setMatchFilter] = useState('all');

  const allGoals = useMemo(() => {
    const goals = [];
    DATABASE.matches.forEach(match => {
      (match.events?.goals || []).forEach(g => {
        goals.push({ ...g, matchId: match.id, opponent: match.opponent, jornada: match.jornada });
      });
    });
    return goals;
  }, []);

  const filtered = allGoals.filter(g => {
    if (filter !== 'all' && g.type !== filter) return false;
    if (matchFilter !== 'all' && g.matchId !== matchFilter) return false;
    return true;
  });

  // Assigna posicions als gols (amb seed per mantenir consistència)
  const goalsWithPos = useMemo(() => {
    let fi = 0, ci = 0;
    return filtered.map(g => {
      const pos = parseZone(g);
      return { ...g, px: pos.x, py: pos.y };
    });
  }, [filtered]);

  const favor  = filtered.filter(g => g.type === 'favor').length;
  const contra = filtered.filter(g => g.type === 'contra').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-3xl font-black text-white mb-1">Mapa de Gols</h2>
        <p className="text-gray-500 text-sm">On es marquen i encaixen els gols</p>
      </header>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5">
          {[['all','Tots'],['favor','A favor'],['contra','En contra']].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === v ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5">
          <button onClick={() => setMatchFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              matchFilter === 'all' ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
            Tots els partits
          </button>
          {DATABASE.matches.map(m => (
            <button key={m.id} onClick={() => setMatchFilter(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                matchFilter === m.id ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
              {m.jornada}
            </button>
          ))}
        </div>
      </div>

      {/* Comptadors */}
      <div className="flex gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-2xl font-black text-emerald-400">{favor}</span>
          <span className="text-xs text-emerald-600">gols a favor</span>
        </div>
        <div className="bg-[#C0392B]/10 border border-[#C0392B]/20 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-2xl font-black text-[#C0392B]">{contra}</span>
          <span className="text-xs text-[#C0392B]/70">gols en contra</span>
        </div>
      </div>

      {/* Camp SVG */}
      <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-4 overflow-x-auto">
        <svg viewBox={`-10 -10 ${W+20} ${H+20}`} className="w-full max-w-2xl mx-auto" style={{ minWidth: '320px' }}>
          {/* Gespa */}
          <rect x={0} y={0} width={W} height={H} rx={4} fill="#1a3a1a" stroke="#2d5a2d" strokeWidth={2} />

          {/* Línies de camp */}
          {/* Línia central */}
          <line x1={W/2} y1={0} x2={W/2} y2={H} stroke="#2d5a2d" strokeWidth={1.5} />
          {/* Cercle central */}
          <circle cx={W/2} cy={H/2} r={30} fill="none" stroke="#2d5a2d" strokeWidth={1.5} />
          <circle cx={W/2} cy={H/2} r={2} fill="#2d5a2d" />
          {/* Àrea esquerra */}
          <rect x={0} y={(H-80)/2} width={50} height={80} fill="none" stroke="#2d5a2d" strokeWidth={1.5} />
          <rect x={0} y={(H-40)/2} width={20} height={40} fill="none" stroke="#2d5a2d" strokeWidth={1.5} />
          {/* Àrea dreta */}
          <rect x={W-50} y={(H-80)/2} width={50} height={80} fill="none" stroke="#2d5a2d" strokeWidth={1.5} />
          <rect x={W-20} y={(H-40)/2} width={20} height={40} fill="none" stroke="#2d5a2d" strokeWidth={1.5} />
          {/* Porteries */}
          <rect x={-8} y={(H-GOAL_H)/2} width={8} height={GOAL_H} fill="#1a1a1a" stroke="#555" strokeWidth={1.5} rx={1} />
          <rect x={W} y={(H-GOAL_H)/2} width={8} height={GOAL_H} fill="#1a1a1a" stroke="#555" strokeWidth={1.5} rx={1} />

          {/* Etiquetes porteries */}
          <text x={-4} y={H/2} textAnchor="middle" dominantBaseline="middle" fontSize={7} fill="#555" transform={`rotate(-90,-4,${H/2})`}>
            Rival
          </text>
          <text x={W+4} y={H/2} textAnchor="middle" dominantBaseline="middle" fontSize={7} fill="#555" transform={`rotate(90,${W+4},${H/2})`}>
            Nosaltres
          </text>

          {/* Gols */}
          {goalsWithPos.map((g, idx) => (
            <Dot key={`${g.matchId}-${idx}`} x={g.px} y={g.py} type={g.type} goal={g} idx={idx} />
          ))}

          {/* Llegenda */}
          <g transform={`translate(${W/2-60}, ${H+4})`}>
            <circle cx={6} cy={6} r={5} fill="#27AE60" opacity={0.9} />
            <text x={14} y={10} fontSize={8} fill="#888">Gol a favor</text>
            <circle cx={80} cy={6} r={5} fill="#C0392B" opacity={0.9} />
            <text x={88} y={10} fontSize={8} fill="#888">Gol en contra</text>
          </g>
        </svg>
      </div>

      {/* Nota */}
      <p className="text-xs text-gray-700 text-center">
        💡 Les posicions dels gols són aproximades. Quan afegeixes un gol a <code>data.js</code> pots afegir <code>position: {'{ x: 350, y: 90 }'}</code> per ser exacte.
      </p>
    </div>
  );
}
