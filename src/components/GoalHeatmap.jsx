import React, { useState, useMemo } from 'react';
import { DATABASE } from '../data.js';

// ── COLORS PER JUGADOR ────────────────────────────────────────────
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

// ── ZONES NOMBRADES ───────────────────────────────────────────────
// Mitja pista d'atac (nosaltres ataquem cap a la dreta → porteria rival a x=400)
// Coordenades: x=0 (centre camp) → x=400 (porteria rival), y=0 (dalt) → y=200 (baix)
//
//  ┌─────────────────────────────────────────┐
//  │  A1 │  A2 │  A3 │  A4 │  A5 │  A6 │   │
//  │─────│─────│─────│─────│─────│─────│ P │
//  │  B1 │  B2 │  B3 │  B4 │  B5 │  B6 │   │
//  │─────│─────│─────│─────│─────│─────│ O │
//  │  C1 │  C2 │  C3 │  C4 │  C5 │  C6 │   │
//  │─────│─────│─────│─────│─────│─────│ R │
//  │  D1 │  D2 │  D3 │  D4 │  D5 │  D6 │   │
//  └─────────────────────────────────────────┘
//   Centre                            Porteria

export const ZONES = {
  // Fila A (dalt)
  A1: { x: 33,  y: 25  }, A2: { x: 100, y: 25  }, A3: { x: 167, y: 25  },
  A4: { x: 233, y: 25  }, A5: { x: 300, y: 25  }, A6: { x: 355, y: 25  },
  // Fila B (mig-dalt)
  B1: { x: 33,  y: 75  }, B2: { x: 100, y: 75  }, B3: { x: 167, y: 75  },
  B4: { x: 233, y: 75  }, B5: { x: 300, y: 75  }, B6: { x: 355, y: 75  },
  // Fila C (mig-baix)
  C1: { x: 33,  y: 125 }, C2: { x: 100, y: 125 }, C3: { x: 167, y: 125 },
  C4: { x: 233, y: 125 }, C5: { x: 300, y: 125 }, C6: { x: 355, y: 125 },
  // Fila D (baix)
  D1: { x: 33,  y: 175 }, D2: { x: 100, y: 175 }, D3: { x: 167, y: 175 },
  D4: { x: 233, y: 175 }, D5: { x: 300, y: 175 }, D6: { x: 355, y: 175 },
};

// ── Dot interactiu ────────────────────────────────────────────────
function Dot({ goal, idx }) {
  const [hover, setHover] = useState(false);
  const pos   = ZONES[goal.zone] || { x: 350, y: 100 };
  const color = PLAYER_COLORS[goal.scorer] || DEFAULT_COLOR;

  return (
    <g>
      <circle cx={pos.x} cy={pos.y} r={hover ? 18 : 13}
        fill={color} opacity={0.12}
        style={{ transition: 'r 0.2s' }} />
      <circle cx={pos.x} cy={pos.y} r={hover ? 9 : 7}
        fill={color} stroke="white" strokeWidth={1.5} opacity={0.95}
        style={{ cursor: 'pointer', transition: 'r 0.2s' }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)} />
      <text x={pos.x} y={pos.y + 0.5} textAnchor="middle" dominantBaseline="middle"
        fontSize={6} fontWeight="bold" fill="white" style={{ pointerEvents: 'none' }}>
        {idx + 1}
      </text>
      {hover && (
        <g>
          <rect x={pos.x - 60} y={pos.y - 46} width={120} height={38} rx={5}
            fill="#0d0d0d" stroke={color} strokeWidth={1} />
          <text x={pos.x} y={pos.y - 32} textAnchor="middle" fontSize={8} fill={color} fontWeight="bold">
            {goal.time} · {goal.jornada}
          </text>
          <text x={pos.x} y={pos.y - 20} textAnchor="middle" fontSize={7.5} fill="white">
            {goal.scorer || '?'} {goal.assist ? `→ ${goal.assist}` : ''}
          </text>
          <text x={pos.x} y={pos.y - 10} textAnchor="middle" fontSize={7} fill="#666">
            Zona {goal.zone || '?'}
          </text>
        </g>
      )}
    </g>
  );
}

export default function GoalHeatmap() {
  const [matchFilter, setMatchFilter] = useState('all');
  const [playerFilter, setPlayerFilter] = useState('all');

  const allGoals = useMemo(() => {
    const goals = [];
    DATABASE.matches.forEach(match => {
      (match.events?.goals || []).forEach(g => {
        if (g.type === 'favor') {
          goals.push({ ...g, matchId: match.id, jornada: match.jornada, opponent: match.opponent });
        }
      });
    });
    return goals;
  }, []);

  const scorers = [...new Set(allGoals.map(g => g.scorer).filter(Boolean))];

  const filtered = allGoals.filter(g => {
    if (matchFilter !== 'all' && g.matchId !== matchFilter) return false;
    if (playerFilter !== 'all' && g.scorer !== playerFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-3xl font-black text-white mb-1">Mapa de Gols</h2>
        <p className="text-gray-500 text-sm">Zona d'atac — on marquem els gols</p>
      </header>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5 flex-wrap">
          <button onClick={() => setMatchFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${matchFilter === 'all' ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
            Tots els partits
          </button>
          {DATABASE.matches.map(m => (
            <button key={m.id} onClick={() => setMatchFilter(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${matchFilter === m.id ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
              {m.jornada}
            </button>
          ))}
        </div>
      </div>

      {/* Llegenda jugadors */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setPlayerFilter('all')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
            playerFilter === 'all' ? 'bg-white/10 border-white/30 text-white' : 'border-white/10 text-gray-500 hover:text-white'}`}>
          <span className="w-2.5 h-2.5 rounded-full bg-white/40 inline-block" />
          Tots
        </button>
        {scorers.map(name => {
          const color = PLAYER_COLORS[name] || DEFAULT_COLOR;
          return (
            <button key={name} onClick={() => setPlayerFilter(name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                playerFilter === name ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
              style={{ borderColor: color + '60', background: playerFilter === name ? color + '20' : 'transparent', color }}>
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />
              {name.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Comptador */}
      <div className="flex items-center gap-3">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-2xl font-black text-emerald-400">{filtered.length}</span>
          <span className="text-xs text-emerald-600">gols a favor</span>
        </div>
      </div>

      {/* Camp — mitja pista d'atac */}
      <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-4 overflow-x-auto">
        <svg viewBox="-15 -15 430 230" className="w-full max-w-2xl mx-auto" style={{ minWidth: '320px' }}>
          {/* Gespa */}
          <rect x={0} y={0} width={400} height={200} rx={4} fill="#1a3a1a" stroke="#2d5a2d" strokeWidth={2} />

          {/* Línies interiors */}
          {/* Àrea gran */}
          <rect x={310} y={60} width={90} height={80} fill="rgba(255,255,255,0.03)" stroke="#2d5a2d" strokeWidth={1.5} />
          {/* Àrea petita */}
          <rect x={360} y={80} width={40} height={40} fill="rgba(255,255,255,0.03)" stroke="#2d5a2d" strokeWidth={1.5} />
          {/* Punt de penal */}
          <circle cx={340} cy={100} r={2} fill="#2d5a2d" />
          {/* Línia de centre (esquerra) */}
          <line x1={0} y1={0} x2={0} y2={200} stroke="#2d5a2d" strokeWidth={2} />

          {/* Porteria */}
          <rect x={400} y={80} width={10} height={40} fill="#1a1a1a" stroke="#666" strokeWidth={1.5} rx={1} />

          {/* Etiqueta porteria */}
          <text x={414} y={100} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="#555"
            transform="rotate(90,414,100)">Porteria rival</text>
          {/* Etiqueta centre */}
          <text x={-10} y={100} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="#444"
            transform="rotate(-90,-10,100)">Centre</text>

          {/* Grid de zones (visible subtil) */}
          {[66, 133, 200, 266, 333].map(x => (
            <line key={x} x1={x} y1={0} x2={x} y2={200} stroke="#2d5a2d" strokeWidth={0.5} strokeDasharray="3,4" />
          ))}
          {[50, 100, 150].map(y => (
            <line key={y} x1={0} y1={y} x2={400} y2={y} stroke="#2d5a2d" strokeWidth={0.5} strokeDasharray="3,4" />
          ))}

          {/* Etiquetes de zones */}
          {Object.entries(ZONES).map(([key, pos]) => (
            <text key={key} x={pos.x} y={pos.y - 15} textAnchor="middle" fontSize={6}
              fill="rgba(255,255,255,0.15)" fontWeight="bold">
              {key}
            </text>
          ))}

          {/* Gols */}
          {filtered.map((g, idx) => (
            <Dot key={`${g.matchId}-${idx}`} goal={g} idx={idx} />
          ))}

          {/* Sense gols */}
          {filtered.length === 0 && (
            <text x={200} y={100} textAnchor="middle" dominantBaseline="middle"
              fontSize={12} fill="rgba(255,255,255,0.2)">
              Cap gol amb zona assignada
            </text>
          )}
        </svg>
      </div>

      {/* Instruccions zona */}
      <div className="bg-[#1a1a1a] rounded-xl border border-white/5 p-4 text-xs text-gray-500 space-y-2">
        <p className="font-bold text-gray-400">📌 Com assignar zona a un gol:</p>
        <p>A <code className="text-[#E5C07B]">src/data.js</code>, afegeix <code className="text-[#E5C07B]">zone: 'B5'</code> a cada gol a favor:</p>
        <div className="bg-[#121212] rounded-lg p-3 font-mono text-gray-500 leading-relaxed">
          {'{ time: "05:00", type: "favor", scorer: "Roger Miro", '}<span className="text-[#E5C07B]">zone: 'B5'</span>{', ... }'}
        </div>
        <p className="text-gray-600">Les zones van de <strong className="text-gray-500">A1</strong> (dalt-centre) fins <strong className="text-gray-500">D6</strong> (baix-porteria). Consulta el mapa de sobre per orientar-te.</p>
      </div>
    </div>
  );
}
