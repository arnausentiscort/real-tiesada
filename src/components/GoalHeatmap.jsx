import React, { useState, useMemo } from 'react';
import { DATABASE } from '../data.js';

const ACCENT = '#E5C07B';

const PLAYER_COLORS = {
  'Arnau Sentis':  '#E5C07B', 'Roger Miro':    '#61AFEF',
  'Oriol Tomas':   '#98C379', 'Paco Montero':  '#E06C75',
  'Andreu Cases':  '#C678DD', 'Pau Ibañez':    '#56B6C2',
  'Joan Medina':   '#D19A66', 'Roi Seoane':    '#BE5046',
  'Ivan Mico':     '#ABB2BF', 'Marc Farreras': '#4EC9B0',
  'Chengzhi Li':   '#F0A500',
};

// Offset determinista per evitar solapament de punts molt propers
function jitter(goals) {
  const THRESH = 18;
  const result = goals.map(g => ({ ...g, _sx: g.shotPos?.x, _sy: g.shotPos?.y, _gx: g.goalPos?.x, _gy: g.goalPos?.y }));
  // offset spiral per grups solapats
  const offsets = [[0,0],[12,-8],[-12,8],[8,14],[-8,-14],[16,0],[-16,0],[0,16],[0,-16]];
  result.forEach((g, i) => {
    if (!g.shotPos) return;
    let groupIdx = 0;
    for (let j = 0; j < i; j++) {
      if (!result[j].shotPos) continue;
      const dx = result[j]._sx - g.shotPos.x;
      const dy = result[j]._sy - g.shotPos.y;
      if (Math.sqrt(dx*dx+dy*dy) < THRESH) groupIdx++;
    }
    if (groupIdx > 0) {
      const off = offsets[groupIdx % offsets.length];
      g._sx = g.shotPos.x + off[0];
      g._sy = g.shotPos.y + off[1];
    }
  });
  // igual per porteria
  result.forEach((g, i) => {
    if (!g.goalPos) return;
    let groupIdx = 0;
    for (let j = 0; j < i; j++) {
      if (!result[j].goalPos) continue;
      const dx = result[j]._gx - g.goalPos.x;
      const dy = result[j]._gy - g.goalPos.y;
      if (Math.sqrt(dx*dx+dy*dy) < THRESH) groupIdx++;
    }
    if (groupIdx > 0) {
      const off = offsets[groupIdx % offsets.length];
      g._gx = g.goalPos.x + off[0];
      g._gy = g.goalPos.y + off[1];
    }
  });
  return result;
}

// Helper: URL de vídeo amb timestamp
function getVideoUrl(goal) {
  const match = DATABASE.matches.find(m => m.id === goal.matchId);
  if (!match) return null;
  const [min, sec] = (goal.time || '0:0').split(':').map(Number);
  const secs = Math.max(0, (min * 60 + (sec || 0)) - 5);
  if (match.vimeoId)   return `https://vimeo.com/${match.vimeoId}#t=${secs}s`;
  if (match.youtubeId) return `https://www.youtube.com/watch?v=${match.youtubeId}&t=${secs}s`;
  return null;
}

// Helper: dorsal del jugador
function getDorsal(scorerName) {
  const p = DATABASE.roster.find(r => r.name === scorerName);
  return p ? p.number : null;
}

// ── Targeta info gol ──────────────────────────────────────────────
function GoalCard({ goal, idx, onClose }) {
  if (!goal) return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <svg width="32" height="32" viewBox="0 0 32 32" className="mb-3 opacity-20">
        <circle cx="16" cy="16" r="14" fill="none" stroke="white" strokeWidth="2"/>
        <path d="M16 8 L18 13 L24 13 L19 17 L21 23 L16 19 L11 23 L13 17 L8 13 L14 13 Z" fill="white" opacity="0.5"/>
      </svg>
      <p className="text-gray-600 text-sm leading-relaxed">Clica un gol<br/>per veure el detall</p>
    </div>
  );

  const videoUrl = getVideoUrl(goal);
  const dorsal   = getDorsal(goal.scorer);

  return (
    <div className="p-5 space-y-4 animate-fade-in">
      {/* Capçalera */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {/* Dorsal */}
          <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl border-2 border-[#E5C07B]/40 bg-[#E5C07B]/10 flex-shrink-0">
            <span className="text-[9px] text-[#E5C07B]/60 font-bold leading-none">#</span>
            <span className="text-sm font-black text-[#E5C07B] leading-none">{dorsal ?? '?'}</span>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{goal.jornada} · {goal.opponent}</p>
            <p className="text-white font-bold text-base leading-tight">min {goal.time}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all flex items-center justify-center flex-shrink-0">×</button>
      </div>

      <div className="h-px bg-white/5"/>

      {/* Info */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ACCENT }}/>
          <div className="min-w-0">
            <span className="text-[10px] text-gray-600 uppercase tracking-wider">Gol · </span>
            <span className="text-white font-semibold text-sm">{goal.scorer}</span>
          </div>
        </div>
        {goal.assist && (
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-gray-500"/>
            <div className="min-w-0">
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">Assist · </span>
              <span className="text-gray-300 font-medium text-sm">{goal.assist}</span>
            </div>
          </div>
        )}
      </div>

      {/* Botó vídeo */}
      {videoUrl && (
        <a href={videoUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl border border-[#E5C07B]/25 bg-[#E5C07B]/8 hover:bg-[#E5C07B]/15 transition-all group">
          <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
            <circle cx="8" cy="8" r="7" fill="none" stroke="#E5C07B" strokeWidth="1.2" opacity="0.7"/>
            <polygon points="6,5 12,8 6,11" fill="#E5C07B" opacity="0.9"/>
          </svg>
          <span className="text-xs font-semibold text-[#E5C07B]/80 group-hover:text-[#E5C07B]">Veure al vídeo</span>
          <span className="text-[10px] text-gray-600 ml-auto">min {goal.time}</span>
        </a>
      )}

      {/* Mini porteria */}
      {goal.goalPos && (
        <>
          <div className="h-px bg-white/5"/>
          <div>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">On entra</p>
            <svg viewBox="-8 -8 316 216" style={{ width:'100%', maxWidth:200 }}>
              <rect x="0" y="0" width="300" height="200" fill="#0a0a0a"/>
              <line x1="0" y1="0" x2="-10" y2="-10" stroke="#555" strokeWidth="1.5"/>
              <line x1="300" y1="0" x2="310" y2="-10" stroke="#555" strokeWidth="1.5"/>
              <line x1="-10" y1="-10" x2="310" y2="-10" stroke="#555" strokeWidth="1"/>
              <circle cx={goal.goalPos.x} cy={goal.goalPos.y} r="18" fill={ACCENT} opacity="0.2"/>
              <circle cx={goal.goalPos.x} cy={goal.goalPos.y} r="9" fill={ACCENT} stroke="white" strokeWidth="1.8" opacity="0.97"/>
              <rect x="-7" y="-7" width="9" height="209" rx="2" fill="#e0e0e0"/>
              <rect x="298" y="-7" width="9" height="209" rx="2" fill="#e0e0e0"/>
              <rect x="-7" y="-7" width="314" height="9" rx="2" fill="#e0e0e0"/>
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

// ── Camp SVG — nou dibuix ─────────────────────────────────────────
function PitchSVG({ goals, activeGoal, setActiveGoal }) {
  const LONG_ASSIST_THRESH = 200; // px — assistència llarga si > 200px

  return (
    <svg viewBox="0 0 800 420" style={{ width:'100%', display:'block' }}>
      <defs>
        <marker id="arr-short" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill={ACCENT} opacity="0.75"/>
        </marker>
        <marker id="arr-long" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L0,7 L7,3.5 z" fill="#61AFEF" opacity="0.75"/>
        </marker>
      </defs>

      {/* Gespa */}
      <rect width="800" height="420" fill="#1c3d1c"/>
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x="0" y={i*60} width="800" height="60" fill={i%2===0?'rgba(0,0,0,0.07)':'transparent'}/>
      ))}

      {/* Vora */}
      <rect x="18" y="18" width="764" height="384" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5"/>
      {/* Línia centre */}
      <line x1="400" y1="18" x2="400" y2="402" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
      {/* Cercle central gran */}
      <circle cx="400" cy="210" r="185" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2"/>
      <circle cx="400" cy="210" r="4" fill="rgba(255,255,255,0.9)"/>

      {/* ÀREA ESQUERRA */}
      <path d="M 18,80 A 70,70 0 0,1 88,150 L 88,270 A 70,70 0 0,1 18,340 Z" fill="rgba(255,255,255,0.04)"/>
      <path d="M 18,80 A 70,70 0 0,1 88,150" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
      <line x1="88" y1="150" x2="88" y2="270" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
      <path d="M 88,270 A 70,70 0 0,1 18,340" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
      <circle cx="58" cy="210" r="3" fill="rgba(255,255,255,0.7)"/>
      <rect x="3" y="185" width="15" height="50" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.95)" strokeWidth="2.5" rx="1"/>

      {/* ÀREA DRETA */}
      <path d="M 782,80 A 70,70 0 0,0 712,150 L 712,270 A 70,70 0 0,0 782,340 Z" fill="rgba(255,255,255,0.04)"/>
      <path d="M 782,80 A 70,70 0 0,0 712,150" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
      <line x1="712" y1="150" x2="712" y2="270" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
      <path d="M 712,270 A 70,70 0 0,0 782,340" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2"/>
      <circle cx="742" cy="210" r="3" fill="rgba(255,255,255,0.7)"/>
      <rect x="782" y="185" width="15" height="50" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.95)" strokeWidth="2.5" rx="1"/>

      {/* Gols */}
      {goals.map((g, idx) => {
        if (!g._sx) return null;
        const isActive = activeGoal === idx;
        const assist   = g.assistPos;
        const dorsal   = getDorsal(g.scorer);

        // Distància assist per detectar si és llarga
        const isLongAssist = assist
          ? Math.sqrt((assist.x - g._sx)**2 + (assist.y - g._sy)**2) > LONG_ASSIST_THRESH
          : false;

        return (
          <g key={idx} onClick={() => setActiveGoal(isActive ? null : idx)} style={{ cursor:'pointer' }}>
            {/* Línia assist */}
            {assist && (
              <line
                x1={assist.x} y1={assist.y} x2={g._sx} y2={g._sy}
                stroke={isLongAssist ? '#61AFEF' : ACCENT}
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeDasharray={isLongAssist ? '8,4' : '5,3'}
                opacity={isActive ? 0.95 : 0.45}
                markerEnd={isLongAssist ? 'url(#arr-long)' : 'url(#arr-short)'}
              />
            )}
            {/* Punt assist */}
            {assist && (
              <circle cx={assist.x} cy={assist.y} r={isActive?5.5:3.5}
                fill={isLongAssist ? '#61AFEF' : ACCENT}
                opacity={isActive?0.85:0.35}/>
            )}
            {/* Aura actiu */}
            {isActive && <circle cx={g._sx} cy={g._sy} r="22" fill={ACCENT} opacity="0.18"/>}
            {/* Cercle tir */}
            <circle cx={g._sx} cy={g._sy} r={isActive?13:9}
              fill={isActive ? ACCENT : 'rgba(255,255,255,0.88)'}
              stroke={isActive ? 'white' : 'rgba(0,0,0,0.25)'}
              strokeWidth={isActive ? 2 : 1}/>
            {/* Dorsal */}
            {dorsal !== null ? (
              <text x={g._sx} y={g._sy} textAnchor="middle" dominantBaseline="middle"
                fontSize={dorsal >= 10 ? (isActive?7:5.5) : (isActive?8:6.5)}
                fontWeight="bold"
                fill={isActive?'#1a1a1a':'#1c3d1c'}
                style={{ pointerEvents:'none' }}>
                {dorsal}
              </text>
            ) : (
              <text x={g._sx} y={g._sy} textAnchor="middle" dominantBaseline="middle"
                fontSize={isActive?8:6.5} fontWeight="bold"
                fill={isActive?'#1a1a1a':'#1c3d1c'} style={{ pointerEvents:'none' }}>
                ?
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Porteria SVG — nou dibuix ─────────────────────────────────────
function GoalSVG({ goals, activeGoal, setActiveGoal }) {
  return (
    <svg viewBox="-18 -18 336 230" style={{ width:'100%', display:'block' }}>
      {/* terra */}
      <rect x="-18" y="200" width="336" height="12" fill="#1c3d1c"/>

      {/* fons xarxa */}
      <rect x="0" y="0" width="300" height="200" fill="#0d0d0d"/>
      <rect x="0" y="0" width="300" height="60" fill="rgba(255,255,255,0.012)"/>

      {/* profunditat 3D */}
      <line x1="0"   y1="0"   x2="-13" y2="-13" stroke="#555" strokeWidth="1.8"/>
      <line x1="300" y1="0"   x2="313" y2="-13" stroke="#555" strokeWidth="1.8"/>
      <line x1="0"   y1="200" x2="-13" y2="187" stroke="#444" strokeWidth="1.4"/>
      <line x1="300" y1="200" x2="313" y2="187" stroke="#444" strokeWidth="1.4"/>
      <line x1="-13" y1="-13" x2="313" y2="-13" stroke="#555" strokeWidth="1.5"/>
      <line x1="-13" y1="-13" x2="-13" y2="187" stroke="#444" strokeWidth="1"/>
      <line x1="313" y1="-13" x2="313" y2="187" stroke="#444" strokeWidth="1"/>

      {/* Gols */}
      {goals.map((g, idx) => {
        if (!g._gx) return null;
        const isActive = activeGoal === idx;
        const dorsal   = getDorsal(g.scorer);
        return (
          <g key={idx} onClick={() => setActiveGoal(isActive?null:idx)} style={{ cursor:'pointer' }}>
            {isActive && <circle cx={g._gx} cy={g._gy} r="22" fill={ACCENT} opacity="0.2"/>}
            <circle cx={g._gx} cy={g._gy} r={isActive?13:9}
              fill={isActive?ACCENT:'rgba(255,255,255,0.82)'}
              stroke={isActive?'white':'rgba(0,0,0,0.3)'}
              strokeWidth={isActive?2:1}/>
            <text x={g._gx} y={g._gy} textAnchor="middle" dominantBaseline="middle"
              fontSize={dorsal !== null && dorsal >= 10 ? (isActive?7:5.5) : (isActive?8:6.5)}
              fontWeight="bold"
              fill={isActive?'#1a1a1a':'#111'} style={{ pointerEvents:'none' }}>
              {dorsal ?? '?'}
            </text>
          </g>
        );
      })}

      {/* Pals — per sobre dels gols */}
      <rect x="-9" y="-8" width="11" height="210" rx="3" fill="#ececec"/>
      <rect x="298" y="-8" width="11" height="210" rx="3" fill="#ececec"/>
      <rect x="-9" y="-8" width="318" height="11" rx="3" fill="#ececec"/>
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
        if (g.type === 'favor') goals.push({ ...g, matchId:match.id, jornada:match.jornada, opponent:match.opponent });
      });
    });
    return goals;
  }, []);

  const scorers = [...new Set(allGoals.map(g => g.scorer).filter(Boolean))];

  const filtered = useMemo(() => {
    return jitter(allGoals.filter(g => {
      if (matchFilter  !== 'all' && g.matchId !== matchFilter)  return false;
      if (playerFilter !== 'all' && g.scorer  !== playerFilter) return false;
      return true;
    }));
  }, [allGoals, matchFilter, playerFilter]);

  const activeGoalData = activeGoal !== null ? filtered[activeGoal] : null;

  return (
    <div className="space-y-5 animate-fade-in">
      <header>
        <h2 className="text-3xl font-black text-white mb-1">Mapa de Gols</h2>
        <p className="text-gray-500 text-sm">{filtered.length} gols a favor · clica un per veure el detall</p>
      </header>

      {/* Filtres */}
      <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5 w-fit flex-wrap">
        <button onClick={() => { setMatchFilter('all'); setActiveGoal(null); }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${matchFilter==='all'?'bg-[#E5C07B]/15 text-[#E5C07B]':'text-gray-500 hover:text-white'}`}>
          Tots
        </button>
        {DATABASE.matches.map(m => (
          <button key={m.id} onClick={() => { setMatchFilter(m.id); setActiveGoal(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${matchFilter===m.id?'bg-[#E5C07B]/15 text-[#E5C07B]':'text-gray-500 hover:text-white'}`}>
            {m.jornada}
          </button>
        ))}
      </div>

      {/* Jugadors */}
      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => { setPlayerFilter('all'); setActiveGoal(null); }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${playerFilter==='all'?'bg-white/10 border-white/30 text-white':'border-white/10 text-gray-500 hover:text-white'}`}>
          Tots
        </button>
        {scorers.map(name => (
          <button key={name} onClick={() => { setPlayerFilter(name===playerFilter?'all':name); setActiveGoal(null); }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${playerFilter===name?'bg-[#E5C07B]/15 border-[#E5C07B]/40 text-[#E5C07B]':'border-white/10 text-gray-500 hover:text-white'}`}>
            {name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Layout: camp + info, porteria sota */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-3 items-start">

        <div className="space-y-3">
          {/* Camp */}
          <div className="bg-[#0f1a0f] rounded-2xl border border-white/5 p-3 overflow-hidden">
            <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider font-bold">Camp · zona de tir</p>
            <PitchSVG goals={filtered} activeGoal={activeGoal} setActiveGoal={setActiveGoal}/>
          </div>
          {/* Porteria */}
          <div className="bg-[#0d0d0d] rounded-2xl border border-white/5 p-3 overflow-hidden">
            <p className="text-[10px] text-gray-600 mb-2 uppercase tracking-wider font-bold">Porteria rival · on entra</p>
            <GoalSVG goals={filtered} activeGoal={activeGoal} setActiveGoal={setActiveGoal}/>
          </div>
        </div>

        {/* Info gol */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 min-h-[240px] lg:sticky lg:top-4">
          <GoalCard goal={activeGoalData} idx={activeGoal} onClose={() => setActiveGoal(null)}/>
        </div>
      </div>

      {/* Llegenda */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-600 pt-1">
        <div className="flex items-center gap-2">
          <svg width="22" height="8"><line x1="0" y1="4" x2="15" y2="4" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="4,2" opacity="0.7"/><polygon points="13,1 20,4 13,7" fill={ACCENT} opacity="0.7"/></svg>
          assist curta
        </div>
        <div className="flex items-center gap-2">
          <svg width="22" height="8"><line x1="0" y1="4" x2="15" y2="4" stroke="#61AFEF" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.7"/><polygon points="13,1 20,4 13,7" fill="#61AFEF" opacity="0.7"/></svg>
          assist llarga / llançament
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-white/75 border border-black/20 flex items-center justify-center" style={{fontSize:'5px', color:'#1c3d1c', fontWeight:'bold'}}>9</div>
          dorsal del marcador
        </div>
      </div>
    </div>
  );
}
