import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Plus, Trash2, ChevronLeft, Github, Check, AlertCircle, Loader } from 'lucide-react';
import { DATABASE } from '../data.js';

const BASE = import.meta.env.BASE_URL;
const REPO_OWNER = 'arnausentiscort';
const REPO_NAME  = 'real-tiesada';
const FILE_PATH  = 'src/data.js';

// ── GitHub API ────────────────────────────────────────────────────
async function getFileSha(token) {
  const r = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }
  });
  if (!r.ok) throw new Error(`GitHub error ${r.status}`);
  const d = await r.json();
  return { sha: d.sha, content: atob(d.content.replace(/\n/g,'')) };
}
async function pushFile(token, sha, newContent, message) {
  const r = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: btoa(unescape(encodeURIComponent(newContent))), sha })
  });
  if (!r.ok) { const e = await r.json(); throw new Error(e.message || `Error ${r.status}`); }
  return r.json();
}

// ── Conversió click SVG precisa (usa CTM) ─────────────────────────
function svgPoint(svgEl, clientX, clientY) {
  const pt = svgEl.createSVGPoint();
  pt.x = clientX; pt.y = clientY;
  const ctm = svgEl.getScreenCTM();
  if (!ctm) return null;
  const inv = ctm.inverse();
  const p = pt.matrixTransform(inv);
  return { x: Math.round(p.x), y: Math.round(p.y) };
}

// ── Camp clickable — suporta fins a 3 punts (assist, conducció, tir) ──
function PitchClickable({ points, onChange }) {
  // points: { assist, conduct, shot } — cadascun pot ser null o {x,y,zone}
  const svgRef = useRef(null);
  const [mode, setMode] = useState('shot'); // 'assist' | 'conduct' | 'shot'

  const zoneFromXY = (x, y) => {
    const col  = Math.min(6, Math.max(1, Math.ceil((x - 18) / (764/6))));
    const rowN = Math.min(4, Math.max(1, Math.ceil((y - 18) / (384/4))));
    return ['A','B','C','D'][rowN-1] + col;
  };

  const handleClick = useCallback((e) => {
    const p = svgPoint(svgRef.current, e.clientX, e.clientY);
    if (!p) return;
    const zone = zoneFromXY(p.x, p.y);
    onChange({ ...points, [mode]: { x: p.x, y: p.y, zone } });
  }, [mode, points, onChange]);

  const clear = (key) => onChange({ ...points, [key]: null });

  const btnCls = (m, color) => `flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all ${
    mode === m ? `${color} opacity-100` : 'border-white/10 text-gray-600 opacity-60 hover:opacity-100'
  }`;

  return (
    <div className="space-y-2">
      {/* Selector de mode */}
      <div className="flex gap-1.5">
        <button onClick={() => setMode('assist')}  className={btnCls('assist',  'bg-blue-500/20 border-blue-500/40 text-blue-400')}>
          👟 Assist {points.assist ? '✓' : ''}
        </button>
        <button onClick={() => setMode('conduct')} className={btnCls('conduct', 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400')}>
          🏃 Conducció {points.conduct ? '✓' : ''}
        </button>
        <button onClick={() => setMode('shot')}    className={btnCls('shot',    'bg-[#E5C07B]/20 border-[#E5C07B]/40 text-[#E5C07B]')}>
          ⚽ Tir {points.shot ? '✓' : ''}
        </button>
      </div>
      <p className="text-[10px] text-gray-600">
        Mode: <span className="text-white font-bold">{mode === 'assist' ? 'Punt assistència' : mode === 'conduct' ? 'Fi conducció (on rep el tir)' : 'Punt de tir'}</span>
        {' — '}clica al camp per marcar
      </p>

      <svg ref={svgRef} viewBox="0 0 800 420" onClick={handleClick}
        className="w-full rounded-xl cursor-crosshair border border-white/10"
        style={{display:'block', maxHeight:220}}>
        <rect width="800" height="420" fill="#1c3d1c"/>
        {[0,2,4,6].map(i=><rect key={i} x="0" y={i*60} width="800" height="60" fill="rgba(0,0,0,0.07)"/>)}
        <rect x="18" y="18" width="764" height="384" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
        <line x1="400" y1="18" x2="400" y2="402" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
        <circle cx="400" cy="210" r="185" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
        <path d="M 18,80 A 70,70 0 0,1 88,150" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
        <line x1="88" y1="150" x2="88" y2="270" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
        <path d="M 88,270 A 70,70 0 0,1 18,340" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
        <path d="M 782,80 A 70,70 0 0,0 712,150" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
        <line x1="712" y1="150" x2="712" y2="270" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
        <path d="M 712,270 A 70,70 0 0,0 782,340" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
        <rect x="3" y="185" width="15" height="50" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
        <rect x="782" y="185" width="15" height="50" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
        {[1,2,3,4,5].map(c=><line key={c} x1={18+c*764/6} y1="18" x2={18+c*764/6} y2="402" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>)}
        {[1,2,3].map(r=><line key={r} x1="18" y1={18+r*384/4} x2="782" y2={18+r*384/4} stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>)}
        {['A','B','C','D'].map((row,ri)=>[1,2,3,4,5,6].map(col=>(
          <text key={`${row}${col}`} x={18+(col-0.5)*764/6} y={18+(ri+0.5)*384/4}
            textAnchor="middle" dominantBaseline="middle" fontSize="9"
            fill="rgba(255,255,255,0.3)" fontWeight="bold">{row}{col}</text>
        )))}

        {/* Línia assist → conduct */}
        {points.assist && points.conduct && (
          <line x1={points.assist.x} y1={points.assist.y} x2={points.conduct.x} y2={points.conduct.y}
            stroke="#61AFEF" strokeWidth="1.5" strokeDasharray="6,3" opacity="0.7"/>
        )}
        {/* Línia conduct → shot (o assist → shot si no hi ha conduct) */}
        {(() => {
          const from = points.conduct || points.assist;
          const to   = points.shot;
          if (!from || !to) return null;
          return <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
            stroke="#E5C07B" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7"/>;
        })()}

        {/* Punts */}
        {points.assist && <>
          <circle cx={points.assist.x} cy={points.assist.y} r="10" fill="#61AFEF" opacity="0.2"/>
          <circle cx={points.assist.x} cy={points.assist.y} r="5" fill="#61AFEF" stroke="white" strokeWidth="1.5"/>
          <text x={points.assist.x} y={points.assist.y-10} textAnchor="middle" fontSize="8" fill="#61AFEF">A</text>
        </>}
        {points.conduct && <>
          <circle cx={points.conduct.x} cy={points.conduct.y} r="10" fill="#facc15" opacity="0.2"/>
          <circle cx={points.conduct.x} cy={points.conduct.y} r="5" fill="#facc15" stroke="white" strokeWidth="1.5"/>
          <text x={points.conduct.x} y={points.conduct.y-10} textAnchor="middle" fontSize="8" fill="#facc15">C</text>
        </>}
        {points.shot && <>
          <circle cx={points.shot.x} cy={points.shot.y} r="12" fill="#E5C07B" opacity="0.2"/>
          <circle cx={points.shot.x} cy={points.shot.y} r="6" fill="#E5C07B" stroke="white" strokeWidth="2"/>
          <text x={points.shot.x} y={points.shot.y-12} textAnchor="middle" fontSize="8" fill="#E5C07B">T</text>
        </>}
        <text x="10" y="213" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.25)" transform="rotate(-90,10,213)">nostra</text>
        <text x="793" y="213" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.25)" transform="rotate(90,793,213)">rival →</text>
      </svg>

      {/* Resum punts + esborrar */}
      <div className="flex gap-1.5 flex-wrap">
        {[
          {key:'assist', label:'A', color:'text-blue-400', desc:points.assist?.zone},
          {key:'conduct',label:'C', color:'text-yellow-400', desc:points.conduct?.zone},
          {key:'shot',   label:'T', color:'text-[#E5C07B]', desc:points.shot?.zone},
        ].map(({key,label,color,desc}) => desc && (
          <div key={key} className="flex items-center gap-1 bg-[#111] border border-white/8 rounded-lg px-2 py-0.5 text-[10px]">
            <span className={`font-bold ${color}`}>{label}: {desc}</span>
            <button onClick={() => clear(key)} className="text-gray-600 hover:text-red-400 ml-0.5">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Porteria clickable ─────────────────────────────────────────────
function GoalClickable({ value, onChange, label }) {
  const svgRef = useRef(null);
  const handleClick = useCallback((e) => {
    const p = svgPoint(svgRef.current, e.clientX, e.clientY);
    if (!p) return;
    const x = Math.max(0, Math.min(300, p.x));
    const y = Math.max(0, Math.min(200, p.y));
    const col  = Math.min(6, Math.max(1, Math.ceil(x / 50)));
    const rowN = Math.min(4, Math.max(1, Math.ceil(y / 50)));
    onChange({ x, y, zone: ['A','B','C','D'][rowN-1] + col });
  }, [onChange]);

  return (
    <div>
      <p className="text-[10px] text-gray-500 mb-1">
        {label}{value && <span className="text-[#E5C07B] ml-1">→ {value.zone} ({value.x},{value.y})</span>}
      </p>
      <svg ref={svgRef} viewBox="-18 -18 336 230" onClick={handleClick}
        className="w-full rounded-xl cursor-crosshair border border-white/10"
        style={{display:'block', maxHeight:130}}>
        <rect x="0" y="0" width="300" height="200" fill="#0d0d0d"/>
        {[1,2,3,4,5].map(c=><line key={c} x1={c*50} y1="0" x2={c*50} y2="200" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>)}
        {[1,2,3].map(r=><line key={r} x1="0" y1={r*50} x2="300" y2={r*50} stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>)}
        {['A','B','C','D'].map((row,ri)=>[1,2,3,4,5,6].map(col=>(
          <text key={`${row}${col}`} x={(col-0.5)*50} y={(ri+0.5)*50}
            textAnchor="middle" dominantBaseline="middle" fontSize="10"
            fill="rgba(255,255,255,0.35)" fontWeight="bold">{row}{col}</text>
        )))}
        <rect x="-9" y="-9" width="11" height="212" rx="2" fill="#e8e8e8"/>
        <rect x="298" y="-9" width="11" height="212" rx="2" fill="#e8e8e8"/>
        <rect x="-9" y="-9" width="318" height="11" rx="2" fill="#e8e8e8"/>
        <rect x="-18" y="200" width="336" height="12" fill="#1c3d1c"/>
        {value && <>
          <circle cx={value.x} cy={value.y} r="12" fill="#E5C07B" opacity="0.25"/>
          <circle cx={value.x} cy={value.y} r="6" fill="#E5C07B" stroke="white" strokeWidth="1.5"/>
        </>}
        <text x="150" y="-10" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.25)">A=alt · D=baix · 1=esq · 6=dreta</text>
      </svg>
    </div>
  );
}

// ── Formulari de gol ───────────────────────────────────────────────
function GoalForm({ goal, onChange, onRemove, idx }) {
  const roster = DATABASE.roster.map(p => p.name);
  const emptyPts = { assist: null, conduct: null, shot: null };
  const pts = goal.pts || emptyPts;

  return (
    <div className="bg-[#111] rounded-xl p-3 border border-white/8 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400">Gol #{idx+1}</span>
        <button onClick={onRemove} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
      </div>
      <div className="flex gap-2">
        {['favor','contra'].map(t => (
          <button key={t} onClick={() => onChange({...goal, type: t})}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all
              ${goal.type===t ? (t==='favor'?'bg-emerald-500/20 border-emerald-500/40 text-emerald-400':'bg-[#C0392B]/20 border-[#C0392B]/40 text-[#C0392B]') : 'border-white/10 text-gray-600'}`}>
            {t==='favor'?'⚽ A favor':'❌ En contra'}
          </button>
        ))}
      </div>
      <input value={goal.time||''} onChange={e=>onChange({...goal,time:e.target.value})}
        placeholder="Minut (ex: 9:15)"
        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#E5C07B]/40 outline-none"/>
      {goal.type==='favor' ? (
        <>
          <div className="grid grid-cols-2 gap-2">
            <select value={goal.scorer||''} onChange={e=>onChange({...goal,scorer:e.target.value})}
              className="bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-2 text-sm text-white focus:border-[#E5C07B]/40 outline-none">
              <option value="">Marcador...</option>
              {roster.map(n=><option key={n} value={n}>{n.split(' ')[0]}</option>)}
            </select>
            <select value={goal.assist||''} onChange={e=>onChange({...goal,assist:e.target.value||null})}
              className="bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-2 text-sm text-white focus:border-[#E5C07B]/40 outline-none">
              <option value="">Assist (opcio.)</option>
              {roster.map(n=><option key={n} value={n}>{n.split(' ')[0]}</option>)}
            </select>
          </div>
          {/* Mapa 3 punts */}
          <PitchClickable
            points={pts}
            onChange={newPts => onChange({...goal, pts: newPts,
              shotPos:   newPts.shot    ? {x:newPts.shot.x,   y:newPts.shot.y}   : null,
              assistPos: newPts.assist  ? {x:newPts.assist.x, y:newPts.assist.y} : null,
              conductPos:newPts.conduct ? {x:newPts.conduct.x,y:newPts.conduct.y}: null,
              zone:      newPts.shot?.zone || newPts.conduct?.zone || '',
            })}
          />
          <GoalClickable value={goal.goalPos||null} label="On entra a la porteria:"
            onChange={v=>onChange({...goal,goalPos:v})}/>
        </>
      ) : (
        <select value={goal.goalkeeper||''} onChange={e=>onChange({...goal,goalkeeper:e.target.value})}
          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-2 text-sm text-white focus:border-[#E5C07B]/40 outline-none">
          <option value="">Porter...</option>
          {roster.map(n=><option key={n} value={n}>{n.split(' ')[0]}</option>)}
        </select>
      )}
    </div>
  );
}

// ── Formulari de moment ────────────────────────────────────────────
function MomentForm({ moment, onChange, onRemove, idx }) {
  return (
    <div className="bg-[#111] rounded-xl p-3 border border-white/8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-400">Moment #{idx+1}</span>
        <button onClick={onRemove} className="text-gray-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5"/></button>
      </div>
      <div className="flex gap-2">
        <input value={moment.time||''} onChange={e=>onChange({...moment,time:e.target.value})}
          placeholder="Min" className="w-20 bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:border-[#E5C07B]/40 outline-none shrink-0"/>
        <textarea value={moment.text||''} onChange={e=>onChange({...moment,text:e.target.value})}
          placeholder="Descriu el moment..." rows={2}
          className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:border-[#E5C07B]/40 outline-none resize-none"/>
      </div>
    </div>
  );
}

// ── Generador de codi ─────────────────────────────────────────────
function generateMatchCode(match) {
  const ytId = match.youtubeUrl ? match.youtubeUrl.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1] : null;
  const n = (v) => v === null || v === undefined ? 'null' : JSON.stringify(v);

  const goalsCode = match.goals.map(g => {
    if (g.type==='favor') {
      const sp  = g.shotPos    ? `{ x: ${g.shotPos.x}, y: ${g.shotPos.y} }` : 'null';
      const ap  = g.assistPos  ? `{ x: ${g.assistPos.x}, y: ${g.assistPos.y} }` : 'null';
      const cp  = g.conductPos ? `{ x: ${g.conductPos.x}, y: ${g.conductPos.y} }` : 'null';
      const gp  = g.goalPos    ? `{ x: ${g.goalPos.x}, y: ${g.goalPos.y} }` : 'null';
      const ass = g.assist ? `"${g.assist}"` : 'null';
      return `          { time: "${g.time}", type: "favor", scorer: "${g.scorer||''}", assist: ${ass}, goalkeeper: null,
            zone: "${g.zone||''}", shotPos: ${sp}, assistPos: ${ap}, conductPos: ${cp}, goalPos: ${gp} },`;
    }
    return `          { time: "${g.time}", type: "contra", goalkeeper: "${g.goalkeeper||''}" },`;
  }).join('\n');

  const momentsCode = match.moments.map(m => {
    const [min,sec] = (m.time||'0:0').split(':').map(Number);
    const secs = Math.max(0, min*60+(sec||0)-3);
    const ytUrl = ytId ? `"https://www.youtube.com/watch?v=${ytId}&t=${secs}s"` : 'null';
    const txt = (m.text||'').replace(/\\/g,'\\\\').replace(/"/g,"'");
    return `          { time:"${m.time}", type:"bona", text:"${txt}", players:[], videoUrl:${ytUrl} },`;
  }).join('\n');

  const ytStr = ytId ? `"${ytId}"` : 'null';
  const id = `j${DATABASE.matches.length+1}-${(match.opponent||'rival').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').slice(0,20)}`;

  return `
    // ── ${match.jornada||'Jornada ?'} — ${match.opponent||'Rival'} ──────────────────────────
    {
      id: "${id}",
      jornada: "${match.jornada||''}",
      opponent: "${match.opponent||''}",
      result: "${match.result||''}",
      date: "${match.date||''}",
      youtubeId: ${ytStr},
      vimeoId: null,
      idealMinutesPerPlayer: 16.0,
      events: {
        substitutions: [],
        cards: [],
        goals: [
${goalsCode}
        ],
        retransmissio: [
${momentsCode}
        ],
      }
    },`;
}

function injectMatchIntoDataJs(currentJs, matchCode) {
  const marker = '\n  ]\n};';
  const idx = currentJs.lastIndexOf(marker);
  if (idx === -1) throw new Error("No he trobat el marcador al data.js. Verifica el fitxer.");
  return currentJs.slice(0, idx) + matchCode + '\n' + currentJs.slice(idx);
}

// ── Admin Panel ───────────────────────────────────────────────────
export default function AdminPanel({ onClose }) {
  const [token, setToken]       = useState(() => localStorage.getItem('gh_token') || '');
  const [tokenSaved, setTokenSaved] = useState(!!localStorage.getItem('gh_token'));
  const [step, setStep]         = useState('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const emptyMatch = {
    jornada: `Jornada ${DATABASE.matches.length + 1}`,
    opponent: '', date: '', result: '', youtubeUrl: '',
    goals: [], moments: [],
  };
  const [match, setMatch] = useState(emptyMatch);

  const saveToken = () => { localStorage.setItem('gh_token', token); setTokenSaved(true); };

  const addGoal   = () => setMatch(m=>({...m,goals:[...m.goals,{type:'favor',time:'',scorer:'',assist:null,goalkeeper:'',shotPos:null,assistPos:null,conductPos:null,goalPos:null,zone:'',pts:{assist:null,conduct:null,shot:null}}]}));
  const addMoment = () => setMatch(m=>({...m,moments:[...m.moments,{time:'',text:''}]}));
  const updateGoal   = (i,g) => setMatch(m=>({...m,goals:m.goals.map((x,j)=>j===i?g:x)}));
  const updateMoment = (i,g) => setMatch(m=>({...m,moments:m.moments.map((x,j)=>j===i?g:x)}));
  const removeGoal   = (i) => setMatch(m=>({...m,goals:m.goals.filter((_,j)=>j!==i)}));
  const removeMoment = (i) => setMatch(m=>({...m,moments:m.moments.filter((_,j)=>j!==i)}));

  const handlePreview = () => { setGeneratedCode(generateMatchCode(match)); setStep('preview'); };

  const handlePush = async () => {
    setStep('saving');
    try {
      const tk = token || localStorage.getItem('gh_token');
      if (!tk) throw new Error('Cal el token de GitHub');
      const { sha, content } = await getFileSha(tk);
      const newContent = injectMatchIntoDataJs(content, generatedCode);
      await pushFile(tk, sha, newContent, `Add ${match.jornada} vs ${match.opponent} (${match.result})`);
      setStep('done');
    } catch(e) { setErrorMsg(e.message); setStep('error'); }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-[#0d0d0d] overflow-y-auto">
      <div className="sticky top-0 z-10 bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-white/8 px-4 py-3 flex items-center gap-3">
        {step !== 'form' && (
          <button onClick={()=>setStep('form')} className="text-gray-500 hover:text-white"><ChevronLeft className="w-5 h-5"/></button>
        )}
        <span className="text-[#E5C07B] font-black text-sm">🔧 Admin — Nou Partit</span>
        <div className="ml-auto flex items-center gap-3">
          {tokenSaved && <span className="text-[10px] text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3"/>Token guardat</span>}
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center">
            <X className="w-4 h-4 text-gray-400"/>
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Token */}
        {!tokenSaved && (
          <div className="bg-[#1a1a1a] rounded-xl border border-[#E5C07B]/20 p-4">
            <p className="text-xs text-[#E5C07B] font-bold mb-2 flex items-center gap-1.5"><Github className="w-3.5 h-3.5"/> Token GitHub</p>
            <div className="flex gap-2">
              <input type="password" value={token} onChange={e=>setToken(e.target.value)} placeholder="ghp_..."
                className="flex-1 bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#E5C07B]/40 outline-none font-mono"/>
              <button onClick={saveToken} className="px-4 py-2 bg-[#E5C07B]/15 border border-[#E5C07B]/30 text-[#E5C07B] rounded-lg text-xs font-bold hover:bg-[#E5C07B]/25 transition-all">Guardar</button>
            </div>
          </div>
        )}

        {step==='form' && (
          <>
            {/* Info bàsica */}
            <div className="bg-[#1a1a1a] rounded-xl border border-white/8 p-4 space-y-3">
              <p className="text-xs font-bold text-[#E5C07B]">📋 Informació bàsica</p>
              <div className="grid grid-cols-2 gap-2">
                <input value={match.jornada} onChange={e=>setMatch(m=>({...m,jornada:e.target.value}))} placeholder="Jornada 5"
                  className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#E5C07B]/40 outline-none"/>
                <input value={match.date} onChange={e=>setMatch(m=>({...m,date:e.target.value}))} placeholder="24 Mar 2026"
                  className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#E5C07B]/40 outline-none"/>
              </div>
              <input value={match.opponent} onChange={e=>setMatch(m=>({...m,opponent:e.target.value}))} placeholder="Nom del rival"
                className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#E5C07B]/40 outline-none"/>
              <input value={match.result} onChange={e=>setMatch(m=>({...m,result:e.target.value}))} placeholder="Resultat (ex: 3 - 2)"
                className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#E5C07B]/40 outline-none"/>
              <input value={match.youtubeUrl} onChange={e=>setMatch(m=>({...m,youtubeUrl:e.target.value}))} placeholder="URL YouTube (opcional)"
                className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#E5C07B]/40 outline-none"/>
            </div>

            {/* Gols */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#E5C07B]">⚽ Gols ({match.goals.length})</p>
                <button onClick={addGoal} className="flex items-center gap-1 px-3 py-1.5 bg-[#E5C07B]/10 border border-[#E5C07B]/25 text-[#E5C07B] rounded-lg text-xs font-bold hover:bg-[#E5C07B]/20 transition-all">
                  <Plus className="w-3 h-3"/> Afegir gol
                </button>
              </div>
              {match.goals.map((g,i)=>(
                <GoalForm key={i} goal={g} idx={i} onChange={g=>updateGoal(i,g)} onRemove={()=>removeGoal(i)}/>
              ))}
            </div>

            {/* Moments */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#E5C07B]">📝 Moments ({match.moments.length})</p>
                <button onClick={addMoment} className="flex items-center gap-1 px-3 py-1.5 bg-[#E5C07B]/10 border border-[#E5C07B]/25 text-[#E5C07B] rounded-lg text-xs font-bold hover:bg-[#E5C07B]/20 transition-all">
                  <Plus className="w-3 h-3"/> Afegir moment
                </button>
              </div>
              <p className="text-[11px] text-gray-600">Ordre cronològic. L'emoji s'assigna automàticament.</p>
              {match.moments.map((m,i)=>(
                <MomentForm key={i} moment={m} idx={i} onChange={m=>updateMoment(i,m)} onRemove={()=>removeMoment(i)}/>
              ))}
            </div>

            <button onClick={handlePreview}
              className="w-full py-3 bg-[#E5C07B] text-[#121212] font-black rounded-xl hover:bg-[#f0cc85] transition-all text-sm">
              Previsualitzar codi →
            </button>
          </>
        )}

        {step==='preview' && (
          <div className="space-y-4">
            <div className="bg-[#111] rounded-xl border border-white/8 p-4">
              <p className="text-xs text-gray-500 mb-2 font-bold">Codi generat</p>
              <pre className="text-[10px] text-[#E5C07B] overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">{generatedCode}</pre>
            </div>
            <div className="bg-[#1a1a1a] rounded-xl border border-[#E5C07B]/20 p-4">
              <p className="text-sm text-white font-bold">{match.jornada} vs {match.opponent} — {match.result}</p>
              <p className="text-xs text-gray-500">{match.goals.filter(g=>g.type==='favor').length}⚽ a favor · {match.goals.filter(g=>g.type==='contra').length}❌ contra · {match.moments.length} moments</p>
            </div>
            <button onClick={handlePush}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2">
              <Github className="w-4 h-4"/> Pujar a GitHub → deploy automàtic
            </button>
            <p className="text-[10px] text-gray-600 text-center">La web s'actualitzarà en ~2 minuts</p>
          </div>
        )}

        {step==='saving' && (
          <div className="flex flex-col items-center py-20 gap-4">
            <Loader className="w-10 h-10 text-[#E5C07B] animate-spin"/>
            <p className="text-white font-bold">Pujant a GitHub...</p>
          </div>
        )}

        {step==='done' && (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-emerald-400"/>
            </div>
            <p className="text-white font-bold text-lg">Fet! ✅</p>
            <p className="text-gray-500 text-sm text-center">Partit pujat. Web actualitzada en ~2 min.</p>
            <button onClick={()=>{setMatch(emptyMatch);setStep('form');}}
              className="px-6 py-2 bg-[#E5C07B]/15 border border-[#E5C07B]/30 text-[#E5C07B] rounded-xl text-sm font-bold">
              Afegir un altre
            </button>
          </div>
        )}

        {step==='error' && (
          <div className="flex flex-col items-center py-12 gap-4">
            <div className="w-16 h-16 rounded-full bg-[#C0392B]/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-[#C0392B]"/>
            </div>
            <p className="text-white font-bold">Error</p>
            <p className="text-gray-500 text-sm text-center">{errorMsg}</p>
            <div className="flex gap-3">
              <button onClick={()=>setStep('preview')} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-sm">← Tornar</button>
              {(errorMsg.includes('401') || errorMsg.includes('token')) && (
                <button onClick={()=>{localStorage.removeItem('gh_token');setTokenSaved(false);setStep('form');}}
                  className="px-4 py-2 bg-[#E5C07B]/15 border border-[#E5C07B]/30 text-[#E5C07B] rounded-lg text-sm">
                  Canviar token
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
