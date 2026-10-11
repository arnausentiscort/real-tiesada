import React, { useState, useEffect, useRef, useMemo } from 'react';
import { normTime, toSec, lineupAt } from './matchTime.js';

// ── Mode partit ───────────────────────────────────────────────────
// Per apuntar el partit mentre es mira el vídeo: cada botó agafa el minut
// del vídeo sol, atura la reproducció mentre tries el jugador i la reprèn.
// Treballa directament sobre l'estat del formulari de l'admin, així que en
// sortir es revisa i es puja com sempre.

const ytIdOf = (url) => url?.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/)?.[1] || null;
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const bySec = (a, b) => (toSec(a.time) ?? 0) - (toSec(b.time) ?? 0);

let ytApi = null;
function loadYouTube() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!ytApi) ytApi = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve(window.YT); };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  });
  return ytApi;
}

const ACTIONS = [
  { kind: 'golF',    key: 'g', icon: '⚽', label: 'Gol a favor',   color: '#10B981' },
  { kind: 'golC',    key: 'e', icon: '❌', label: 'Gol en contra', color: '#E06B5E' },
  { kind: 'xut',     key: 'x', icon: '🎯', label: 'Xut',           color: '#E5C07B' },
  { kind: 'pas',     key: 'p', icon: '🔑', label: 'Pas clau',      color: '#E5C07B' },
  { kind: 'regat',   key: 'r', icon: '🪄', label: 'Regat',         color: '#E5C07B' },
  { kind: 'parada',  key: 'a', icon: '🧤', label: 'Aturada',       color: '#5B8DEF' },
  { kind: 'canvi',   key: 'c', icon: '🔄', label: 'Canvi',         color: '#A78BFA' },
  { kind: 'targeta', key: 't', icon: '🟨', label: 'Targeta',       color: '#EAB308' },
  { kind: 'moment',  key: 'm', icon: '📝', label: 'Moment',        color: '#9CA3AF' },
  { kind: 'final',   key: 'f', icon: '🏁', label: 'Final',         color: '#9CA3AF' },
];
const ACTION = Object.fromEntries(ACTIONS.map(a => [a.kind, a]));

const MOMENT_TYPES = [
  { id: 'bona', label: '👍 Bona' }, { id: 'dolenta', label: '👎 Dolenta' },
  { id: 'tactica', label: '🧠 Tàctica' }, { id: 'clip', label: '🎬 Clip' },
];

const isTyping = (e) => !!e.target.closest?.('input, textarea, select');

// Tecles d'un pas del diàleg; captura abans que les tecles globals
function useKeys(map, deps) {
  useEffect(() => {
    const h = (e) => {
      if (isTyping(e) && e.key !== 'Enter' && e.key !== 'Escape') return;
      const fn = map[e.key.toLowerCase()];
      if (!fn) return;
      e.preventDefault(); e.stopPropagation();
      fn();
    };
    window.addEventListener('keydown', h, true);
    return () => window.removeEventListener('keydown', h, true);
  }, deps);
}

// Graella de jugadors amb número de tecla (1–9, 0)
function PlayerGrid({ names, sn, onPick, selected = [], disabled = [] }) {
  const keyOf = (i) => (i < 9 ? String(i + 1) : i === 9 ? '0' : null);
  useKeys(Object.fromEntries(names.slice(0, 10).map((n, i) => [keyOf(i), () => !disabled.includes(n) && onPick(n)])),
    [names.join('|'), selected.join('|'), disabled.join('|')]);
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {names.map((n, i) => {
        const sel = selected.includes(n), off = disabled.includes(n);
        return (
          <button key={n} onClick={() => !off && onPick(n)} disabled={off}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all ${
              sel ? 'bg-[#E5C07B]/20 border-[#E5C07B]/50 text-[#E5C07B]'
              : off ? 'bg-white/[0.02] border-white/5 text-gray-700 cursor-not-allowed'
              : 'bg-white/5 border-white/10 text-gray-200 hover:border-[#E5C07B]/40 hover:text-white'}`}>
            {keyOf(i) && <span className="text-[10px] font-mono text-gray-500 w-3 shrink-0">{keyOf(i)}</span>}
            <span className="text-xs font-bold truncate">{sn(n)}</span>
          </button>
        );
      })}
    </div>
  );
}

const Btn = ({ onClick, children, tone = 'gold', k, disabled }) => {
  const cls = {
    gold:  'bg-[#E5C07B]/15 border-[#E5C07B]/40 text-[#E5C07B] hover:bg-[#E5C07B]/25',
    green: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25',
    red:   'bg-[#C0392B]/20 border-[#C0392B]/45 text-[#E06B5E] hover:bg-[#C0392B]/30',
    post:  'bg-[#E8833A]/15 border-[#E8833A]/45 text-[#E8833A] hover:bg-[#E8833A]/25',
    grey:  'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10',
  }[tone];
  return (
    <button onClick={onClick} disabled={disabled}
      className={`flex-1 px-3 py-2.5 rounded-lg border text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${cls}`}>
      {children}{k && <span className="ml-1.5 text-[10px] font-mono opacity-60">{k}</span>}
    </button>
  );
};

// ── Diàlegs de cada acció ─────────────────────────────────────────
function Dialog({ dlg, ctx, onSave, onCancel }) {
  const { kind, t } = dlg;
  const { onField, gk, allNames, sn, fieldN, lineup } = ctx;
  const a = ACTION[kind];
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const set = (p) => setData(d => ({ ...d, ...p }));
  const pickFrom = onField.length ? onField : allNames;

  useKeys({ escape: onCancel }, []);

  let body = null;
  if (kind === 'golF') {
    body = step === 0
      ? <PlayerGrid names={pickFrom} sn={sn} onPick={n => { set({ scorer: n }); setStep(1); }}/>
      : <>
          <p className="text-[11px] text-gray-400">Assistència de… <span className="text-gray-600">(gol d'en {sn(data.scorer)})</span></p>
          <PlayerGrid names={pickFrom.filter(n => n !== data.scorer)} sn={sn}
            onPick={n => onSave({ ...data, assist: n })}/>
          <div className="flex gap-2"><Btn tone="grey" k="↵" onClick={() => onSave({ ...data, assist: null })}>Sense assistència</Btn></div>
          <EnterKey fn={() => onSave({ ...data, assist: null })}/>
        </>;
  } else if (kind === 'golC') {
    body = <>
      <input autoFocus value={data.notes || ''} onChange={e => set({ notes: e.target.value })}
        onKeyDown={e => e.key === 'Enter' && onSave(data)}
        placeholder="Nota (opcional): golejador, com ha anat…"
        className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-[#E5C07B]/40 outline-none"/>
      <div className="flex gap-2"><Btn tone="red" k="↵" onClick={() => onSave(data)}>Desar gol en contra</Btn></div>
    </>;
  } else if (kind === 'xut') {
    body = step === 0
      ? <PlayerGrid names={pickFrom} sn={sn} onPick={n => { set({ player: n }); setStep(1); }}/>
      : <ShotResult shooter={data.player} others={pickFrom.filter(n => n !== data.player)} sn={sn}
          onSave={(r) => onSave({ ...data, ...r })}/>;
  } else if (kind === 'pas' || kind === 'regat') {
    body = <PlayerGrid names={pickFrom} sn={sn} onPick={n => onSave({ player: n })}/>;
  } else if (kind === 'parada') {
    body = gk && !data.pickGk
      ? <>
          <p className="text-sm text-white">Aturada d'en <b className="text-[#5B8DEF]">{sn(gk)}</b></p>
          <div className="flex gap-2">
            <Btn tone="gold" k="↵" onClick={() => onSave({ gk, chronicle: false })}>Desar</Btn>
            <Btn tone="grey" k="2" onClick={() => onSave({ gk, chronicle: true })}>Desar i a la crònica</Btn>
          </div>
          <button onClick={() => set({ pickGk: true })} className="text-[10px] text-gray-500 underline">no era ell</button>
          <EnterKey fn={() => onSave({ gk, chronicle: false })} extra={{ 2: () => onSave({ gk, chronicle: true }) }}/>
        </>
      : <PlayerGrid names={allNames} sn={sn} onPick={n => onSave({ gk: n, chronicle: false })}/>;
  } else if (kind === 'targeta') {
    body = step === 0
      ? <PlayerGrid names={allNames} sn={sn} onPick={n => { set({ player: n }); setStep(1); }}/>
      : <>
          <p className="text-sm text-white">{sn(data.player)}</p>
          <div className="flex gap-2">
            <Btn tone="gold" k="1" onClick={() => onSave({ ...data, color: 'yellow' })}>🟨 Groga</Btn>
            <Btn tone="red" k="2" onClick={() => onSave({ ...data, color: 'red' })}>🟥 Vermella</Btn>
          </div>
          <EnterKey extra={{ 1: () => onSave({ ...data, color: 'yellow' }), 2: () => onSave({ ...data, color: 'red' }) }}/>
        </>;
  } else if (kind === 'moment') {
    body = <MomentForm pick={pickFrom} sn={sn} onSave={onSave}/>;
  } else if (kind === 'canvi') {
    body = <LineupEditor lineup={lineup} allNames={allNames} sn={sn} fieldN={fieldN} initial={t === '00:00' && !lineup}
      onSave={onSave}/>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-black" style={{ color: a.color }}>{a.icon} {a.label}</p>
        <span className="font-mono text-sm text-white bg-white/10 rounded px-2 py-0.5">{t}</span>
      </div>
      {!onField.length && kind !== 'canvi' && (
        <p className="text-[11px] text-amber-400">Encara no hi ha alineació en aquest minut: surten tots. Marca-la amb 🔄 Canvi.</p>
      )}
      {body}
      <button onClick={onCancel} className="w-full text-[11px] text-gray-500 hover:text-white py-1">Cancel·lar <span className="font-mono">Esc</span></button>
    </div>
  );
}

function EnterKey({ fn, extra = {} }) {
  useKeys({ ...(fn ? { enter: fn } : {}), ...extra }, [fn, ...Object.values(extra)]);
  return null;
}

function ShotResult({ shooter, others, sn, onSave }) {
  const [kp, setKp] = useState(null);
  const save = (r) => onSave({ ...r, keyPassBy: kp });
  useKeys({ q: () => save({ onTarget: true }), w: () => save({ onTarget: false }), e: () => save({ onTarget: false, post: true }) }, [kp]);
  return <>
    <p className="text-sm text-white">Xut d'en <b className="text-[#E5C07B]">{sn(shooter)}</b></p>
    <div className="flex gap-2">
      <Btn tone="green" k="Q" onClick={() => save({ onTarget: true })}>A porta</Btn>
      <Btn tone="grey"  k="W" onClick={() => save({ onTarget: false })}>Fora</Btn>
      <Btn tone="post"  k="E" onClick={() => save({ onTarget: false, post: true })}>◆ Al pal</Btn>
    </div>
    <p className="text-[11px] text-gray-400">Pas clau de… <span className="text-gray-600">(opcional, abans del resultat)</span></p>
    <PlayerGrid names={others} sn={sn} selected={kp ? [kp] : []} onPick={n => setKp(k => (k === n ? null : n))}/>
  </>;
}

function MomentForm({ pick, sn, onSave }) {
  const [text, setText] = useState('');
  const [type, setType] = useState('bona');
  const [players, setPlayers] = useState([]);
  const save = () => text.trim() && onSave({ text: text.trim(), type, players });
  return <>
    <textarea autoFocus rows={2} value={text} onChange={e => setText(e.target.value)}
      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save(); } }}
      placeholder="Què ha passat? (en català)"
      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-[#E5C07B]/40 outline-none resize-none"/>
    <div className="flex gap-1.5 flex-wrap">
      {MOMENT_TYPES.map(m => (
        <button key={m.id} onClick={() => setType(m.id)}
          className={`px-2 py-1 rounded-lg border text-[10px] font-bold ${type === m.id ? 'bg-[#E5C07B]/20 border-[#E5C07B]/40 text-[#E5C07B]' : 'bg-white/5 border-white/10 text-gray-500'}`}>
          {m.label}
        </button>
      ))}
    </div>
    <PlayerGrid names={pick} sn={sn} selected={players}
      onPick={n => setPlayers(p => (p.includes(n) ? p.filter(x => x !== n) : [...p, n]))}/>
    <div className="flex gap-2"><Btn tone="gold" k="↵" onClick={save} disabled={!text.trim()}>Desar moment</Btn></div>
  </>;
}

function LineupEditor({ lineup, allNames, sn, fieldN, initial, onSave }) {
  const [field, setField] = useState(lineup?.onPitch || []);
  const [gk, setGk] = useState(lineup?.goalkeeper || '');
  const bench = allNames.filter(n => !field.includes(n) && n !== gk);
  const entering = lineup ? field.filter(n => !lineup.onPitch.includes(n)) : [];
  const leaving  = lineup ? lineup.onPitch.filter(n => !field.includes(n)) : [];
  const ok = gk && field.length > 0 && field.length <= fieldN;
  const save = () => ok && onSave({ goalkeeper: gk, onPitch: field });
  useKeys({ enter: save }, [field.join('|'), gk]);
  return <>
    {initial && <p className="text-[11px] text-sky-400">Alineació inicial: es desa al 00:00.</p>}
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-emerald-400 font-bold shrink-0">🧤 Porter</span>
      <select value={gk} onChange={e => { const n = e.target.value; setGk(n); setField(f => f.filter(x => x !== n)); }}
        className="flex-1 bg-[#111] border border-emerald-500/25 rounded-lg px-2 py-1.5 text-xs text-white outline-none">
        <option value="">— tria —</option>
        {allNames.map(n => <option key={n} value={n}>{sn(n)}</option>)}
      </select>
    </div>
    <p className={`text-[11px] font-bold ${field.length === fieldN ? 'text-[#E5C07B]' : 'text-amber-400'}`}>
      Al camp ({field.length}/{fieldN}) <span className="font-normal text-gray-600">· clica per treure'l</span>
    </p>
    <div className="flex flex-wrap gap-1.5">
      {field.map(n => (
        <button key={n} onClick={() => setField(f => f.filter(x => x !== n))}
          className={`px-2 py-1 rounded-lg border text-[11px] font-bold ${entering.includes(n)
            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' : 'bg-[#E5C07B]/15 border-[#E5C07B]/35 text-[#E5C07B]'}`}>
          {sn(n)} ×
        </button>
      ))}
    </div>
    <p className="text-[11px] text-gray-500">Banqueta <span className="text-gray-700">· clica per entrar</span></p>
    <div className="flex flex-wrap gap-1.5">
      {bench.map(n => (
        <button key={n} onClick={() => field.length < fieldN && setField(f => [...f, n])} disabled={field.length >= fieldN}
          className={`px-2 py-1 rounded-lg border text-[11px] font-bold disabled:opacity-40 ${leaving.includes(n)
            ? 'bg-[#C0392B]/10 border-[#C0392B]/30 text-[#E06B5E]' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}>
          {sn(n)}
        </button>
      ))}
    </div>
    {(entering.length > 0 || leaving.length > 0) && (
      <p className="text-[11px] text-gray-400">
        {entering.length > 0 && <>Entra <b className="text-emerald-400">{entering.map(sn).join(', ')}</b></>}
        {entering.length > 0 && leaving.length > 0 && ' · '}
        {leaving.length > 0 && <>surt <b className="text-[#E06B5E]">{leaving.map(sn).join(', ')}</b></>}
      </p>
    )}
    <div className="flex gap-2"><Btn tone="gold" k="↵" onClick={save} disabled={!ok}>Desar canvi</Btn></div>
  </>;
}

// ── Pantalla ──────────────────────────────────────────────────────
export default function LiveLogger({ match, setMatch, roster, fieldN, onExit, onReview }) {
  const ytId = ytIdOf(match.youtubeUrl);
  const offset = match.videoOffset || 0;
  const sn = (n) => roster.find(p => p.name === n)?.shirtName || n;
  const allNames = roster.filter(p => p.status !== 'baixa').map(p => p.name);

  // Esborrany: un partit sencer apuntat no es pot perdre per tancar la pestanya
  const draftKey = `rt:live:${match._id || 'nou'}`;
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(draftKey) || 'null');
      if (d?.match && JSON.stringify(d.match) !== JSON.stringify(match) &&
          window.confirm(`Hi ha un esborrany del mode partit desat el ${new Date(d.at).toLocaleString('ca-ES')}.\n\nEl recupero?`))
        setMatch(d.match);
    } catch { /* sense esborrany */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(draftKey, JSON.stringify({ at: Date.now(), match })); } catch { /* ple */ }
  }, [match]);

  // Reproductor de YouTube
  const wrapRef = useRef(null);
  const playerRef = useRef(null);
  const [vt, setVt] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!ytId) return;
    let dead = false;
    loadYouTube().then((YT) => {
      if (dead || !wrapRef.current) return;
      const el = document.createElement('div');
      wrapRef.current.appendChild(el);
      // Si es surt al formulari i es torna, el vídeo continua on anava
      let start = 0;
      try { start = Math.floor(Number(localStorage.getItem(`${draftKey}:pos`)) || 0); } catch { /* res */ }
      playerRef.current = new YT.Player(el, {
        videoId: ytId, width: '100%', height: '100%',
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1, start },
        events: { onStateChange: (e) => setPlaying(e.data === 1) },
      });
    });
    let ticks = 0;
    const iv = setInterval(() => {
      const p = playerRef.current;
      if (!p?.getCurrentTime) return;
      const t = p.getCurrentTime() || 0;
      setVt(t);
      if (++ticks % 10 === 0 && t > 0) {
        try { localStorage.setItem(`${draftKey}:pos`, String(t)); } catch { /* res */ }
      }
    }, 200);
    return () => {
      dead = true; clearInterval(iv);
      try { playerRef.current?.destroy(); } catch { /* ja no hi és */ }
      playerRef.current = null;
      if (wrapRef.current) wrapRef.current.innerHTML = '';
    };
  }, [ytId]);

  const p = () => playerRef.current;
  // YouTube triga a aplicar un salt: si es prem → seguit (o es manté), cada
  // pas ha de partir d'on anava l'anterior, no del temps que encara no s'ha mogut
  const target = useRef(null);
  const seekTo = (s) => {
    const t = Math.max(0, s);
    target.current = { t, until: Date.now() + 1000 };
    p()?.seekTo?.(t, true);
  };
  const seek = (d) => {
    const base = target.current && target.current.until > Date.now()
      ? target.current.t : (p()?.getCurrentTime?.() || 0);
    seekTo(base + d);
  };
  const toggle = () => (playing ? p()?.pauseVideo?.() : p()?.playVideo?.());

  const mt = Math.max(0, Math.floor(vt - offset));
  const now = fmt(mt);
  const subs = match.subs || [];
  const hasLineup = subs.some(s => !s._isBreak && (s.onPitch || []).length);

  // ── Desar ──
  const upd = (fn) => setMatch(m => fn({ ...m }));
  const pushEv = (m, key, player, ev) => {
    const map = { ...(m[key] || {}) };
    map[player] = [...(map[player] || []), ev].sort(bySec);
    m[key] = map;
  };
  const save = (dlg, d) => {
    const { kind, t } = dlg;
    const lu = lineupAt(subs, t);
    upd(m => {
      if (kind === 'golF' || kind === 'golC') {
        const g = {
          type: kind === 'golF' ? 'favor' : 'contra', time: t,
          scorer: d.scorer || '', assist: d.assist || null,
          goalkeeper: lu?.goalkeeper || '', onPitch: lu?.onPitch || [],
          shotPos: null, assistPos: null, conductPos: null, goalPos: null,
          zone: '', notes: d.notes || '', pts: { assist: null, conduct: null, shot: null }, _manual: false,
        };
        m.goals = [...(m.goals || []), g].sort(bySec);
      } else if (kind === 'xut') {
        pushEv(m, 'shots', d.player, d.post ? { time: t, onTarget: false, post: true } : { time: t, onTarget: d.onTarget });
        if (d.keyPassBy) pushEv(m, 'keyPasses', d.keyPassBy, { time: t });
      } else if (kind === 'pas') {
        pushEv(m, 'keyPasses', d.player, { time: t });
      } else if (kind === 'regat') {
        pushEv(m, 'dribbles', d.player, { time: t });
      } else if (kind === 'parada') {
        m.savesManual = { ...(m.savesManual || {}), [d.gk]: ((m.savesManual || {})[d.gk] || 0) + 1 };
        m._saveLog = [...(m._saveLog || []), { time: t, gk: d.gk }];
        if (d.chronicle)
          m.moments = [...(m.moments || []), { time: t, type: 'bona', text: `Aturada d'en ${sn(d.gk)}`, players: [d.gk] }].sort(bySec);
      } else if (kind === 'targeta') {
        m.cards = [...(m.cards || []), { time: t, color: d.color, player: d.player }].sort(bySec);
      } else if (kind === 'moment') {
        m.moments = [...(m.moments || []), { time: t, type: d.type, text: d.text, players: d.players }].sort(bySec);
      } else if (kind === 'canvi') {
        const s = { time: t, goalkeeper: d.goalkeeper, onPitch: [...d.onPitch], _isBreak: false };
        m.subs = [...(m.subs || []).filter(x => normTime(x.time) !== t), s].sort(bySec);
      }
      return m;
    });
  };

  // ── Diàleg ──
  const [dlg, setDlg] = useState(null);
  const open = (kind) => {
    if (kind === 'final') {
      const has = subs.some(s => s._isBreak);
      if (has && !window.confirm(`Ja hi ha un final marcat. El moc al ${now}?`)) return;
      upd(m => ({ ...m, subs: [...(m.subs || []).filter(s => !s._isBreak), { time: now, goalkeeper: '', onPitch: [], _isBreak: true }].sort(bySec) }));
      return;
    }
    const was = playing;
    document.activeElement?.blur?.();  // si no, l'espai tornaria a prémer el botó
    p()?.pauseVideo?.();
    const t = kind === 'canvi' && !hasLineup ? '00:00' : now;
    setDlg({ kind, t, was, id: Date.now() });
  };
  const close = (resume) => {
    document.activeElement?.blur?.();
    if (resume && dlg?.was) p()?.playVideo?.();
    setDlg(null);
  };
  const onSave = (d) => { save(dlg, d); close(true); };

  // Tecles globals (amb el diàleg tancat)
  useEffect(() => {
    const h = (e) => {
      if (dlg || isTyping(e) || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === ' ') { e.preventDefault(); toggle(); return; }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); seek(e.shiftKey ? -15 : -5); return; }
      if (e.key === 'ArrowRight') { e.preventDefault(); seek(e.shiftKey ? 15 : 5); return; }
      const a = ACTIONS.find(x => x.key === e.key.toLowerCase());
      if (a) { e.preventDefault(); open(a.kind); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  // ── Registre de tot el que hi ha apuntat ──
  const items = useMemo(() => {
    const out = [];
    const ss = [...subs].sort(bySec);
    ss.forEach((s, i) => {
      const del = () => upd(m => ({ ...m, subs: m.subs.filter(x => x !== s) }));
      if (s._isBreak) { out.push({ t: s.time, icon: '🏁', text: 'Final del partit', del }); return; }
      const field = s.onPitch.filter(x => x !== s.goalkeeper);
      const prev = ss.slice(0, i).reverse().find(x => !x._isBreak);
      if (!prev) { out.push({ t: s.time, icon: '📋', text: `Alineació: 🧤 ${sn(s.goalkeeper)} · ${field.map(sn).join(', ')}`, del }); return; }
      const pf = prev.onPitch.filter(x => x !== prev.goalkeeper);
      const inn = field.filter(x => !pf.includes(x)), outp = pf.filter(x => !field.includes(x));
      const gkTxt = prev.goalkeeper !== s.goalkeeper ? ` · 🧤 ${sn(s.goalkeeper)}` : '';
      out.push({ t: s.time, icon: '🔄', text: `${inn.length ? 'Entra ' + inn.map(sn).join(', ') : ''}${inn.length && outp.length ? ' · ' : ''}${outp.length ? 'surt ' + outp.map(sn).join(', ') : ''}${gkTxt}` || 'Canvi', del });
    });
    (match.goals || []).forEach(g => out.push({
      t: g.time, icon: g.type === 'favor' ? '⚽' : '❌',
      text: g.type === 'favor' ? `Gol d'en ${sn(g.scorer)}${g.assist ? ` · assist. ${sn(g.assist)}` : ''}` : `Gol en contra${g.notes ? ' · ' + g.notes : ''}`,
      del: () => upd(m => ({ ...m, goals: m.goals.filter(x => x !== g) })),
    }));
    const evDel = (key, pl, ev) => () => upd(m => {
      const map = { ...m[key] };
      map[pl] = map[pl].filter(x => x !== ev);
      if (!map[pl].length) delete map[pl];
      return { ...m, [key]: map };
    });
    Object.entries(match.shots || {}).forEach(([pl, evs]) => evs.forEach(ev => out.push({
      t: ev.time, icon: '🎯', text: `Xut d'en ${sn(pl)} · ${ev.post ? '◆ al pal' : ev.onTarget ? 'a porta' : 'fora'}`, del: evDel('shots', pl, ev) })));
    Object.entries(match.keyPasses || {}).forEach(([pl, evs]) => evs.forEach(ev => out.push({
      t: ev.time, icon: '🔑', text: `Pas clau d'en ${sn(pl)}`, del: evDel('keyPasses', pl, ev) })));
    Object.entries(match.dribbles || {}).forEach(([pl, evs]) => evs.forEach(ev => out.push({
      t: ev.time, icon: '🪄', text: `Regat d'en ${sn(pl)}`, del: evDel('dribbles', pl, ev) })));
    (match.cards || []).forEach(c => out.push({
      t: c.time, icon: c.color === 'red' ? '🟥' : '🟨', text: `Targeta per a ${sn(c.player)}`,
      del: () => upd(m => ({ ...m, cards: m.cards.filter(x => x !== c) })) }));
    (match.moments || []).forEach(mo => out.push({
      t: mo.time, icon: '📝', text: mo.text,
      del: () => upd(m => ({ ...m, moments: m.moments.filter(x => x !== mo) })) }));
    (match._saveLog || []).forEach(sv => out.push({
      t: sv.time, icon: '🧤', text: `Aturada d'en ${sn(sv.gk)}`,
      del: () => upd(m => {
        const n = Math.max(0, ((m.savesManual || {})[sv.gk] || 0) - 1);
        const saves = { ...(m.savesManual || {}) };
        if (n) saves[sv.gk] = n; else delete saves[sv.gk];
        return { ...m, savesManual: saves, _saveLog: m._saveLog.filter(x => x !== sv) };
      }) }));
    return out.sort((a, b) => (toSec(b.t) ?? 0) - (toSec(a.t) ?? 0));
  }, [match]);

  const lu = lineupAt(subs, now);
  const gf = (match.goals || []).filter(g => g.type === 'favor').length;
  const ga = (match.goals || []).filter(g => g.type === 'contra').length;
  const ctx = {
    onField: dlg ? (lineupAt(subs, dlg.t)?.onPitch || []) : [],
    gk: dlg ? lineupAt(subs, dlg.t)?.goalkeeper : null,
    lineup: dlg ? lineupAt(subs, dlg.t) : null,
    allNames, sn, fieldN,
  };

  const markKickoff = () => {
    const s = Math.floor(p()?.getCurrentTime?.() || 0);
    if (items.length && !window.confirm(`El partit començarà al ${fmt(s)} del vídeo.\n\nEl que ja tens apuntat NO es mourà: només ho has de fer abans de començar.`)) return;
    upd(m => ({ ...m, videoOffset: s }));
  };

  if (!ytId) {
    return (
      <div className="fixed inset-0 z-[400] bg-[#0d0d0d] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <p className="text-white font-bold">Cal l'enllaç de YouTube del partit</p>
          <p className="text-xs text-gray-500">Posa'l al formulari i torna al mode partit.</p>
          <button onClick={onExit} className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm">← Tornar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[400] bg-[#0d0d0d] text-[#E2E8F0] flex flex-col">
      {/* Capçalera */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-white/10 bg-[#1A1A1A] shrink-0">
        <button onClick={onExit} className="text-xs text-gray-400 hover:text-white">← Formulari</button>
        <span className="text-sm font-black text-[#E5C07B] truncate">🎬 {match.jornada} · {match.opponent}</span>
        <span className="font-mono text-lg font-black text-white ml-2">{gf} - {ga}</span>
        <span className="flex-1"/>
        <span className="text-[11px] text-gray-500 hidden md:inline">
          Inici del partit al vídeo: <b className="font-mono text-gray-300">{fmt(offset)}</b>
        </span>
        <button onClick={markKickoff} title="Prem-ho just quan la pilota es posa en joc"
          className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold border bg-white/5 border-white/10 text-gray-300 hover:text-white">
          ⏱ Comença ara
        </button>
        <button onClick={onReview}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#E5C07B] text-black hover:bg-[#f0d08f]">
          Revisar i pujar →
        </button>
      </div>

      <div className="flex-1 min-h-0 grid lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* Vídeo i registre */}
        <div className="min-h-0 flex flex-col p-4 gap-3 overflow-y-auto [&>*]:shrink-0">
          <div ref={wrapRef} className="w-full shrink-0 aspect-video bg-black rounded-xl overflow-hidden [&>iframe]:w-full [&>iframe]:h-full"/>
          <div className="flex items-center gap-2">
            <button onClick={() => seek(-5)} className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs">−5 s</button>
            <button onClick={toggle} className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs font-bold w-24">
              {playing ? '❚❚ Pausa' : '▶ Play'}
            </button>
            <button onClick={() => seek(5)} className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs">+5 s</button>
            <span className="font-mono text-3xl font-black text-white ml-3 tabular-nums">{now}</span>
            <span className="text-[10px] text-gray-600 ml-1">minut del partit</span>
            <span className="flex-1"/>
            <span className="text-[10px] text-gray-600 hidden xl:inline">Espai: play · ←/→: 5 s (Maj: 15 s)</span>
          </div>
          <div className="rounded-lg border border-white/8 bg-[#141414] px-3 py-2 text-[11px]">
            {lu
              ? <span className="text-gray-400">Al camp <span className="text-gray-600">(des del {lu.time})</span>: 🧤 <b className="text-emerald-400">{sn(lu.goalkeeper)}</b> · {lu.onPitch.map(sn).join(', ')}
                  {lu.onPitch.length < fieldN && <b className="text-amber-400"> · {lu.onPitch.length}/{fieldN}</b>}</span>
              : <span className="text-amber-400">Sense alineació encara: comença amb 🔄 Canvi (C) per posar la inicial.</span>}
          </div>
          <div className="rounded-xl border border-white/8 bg-[#141414]">
            <p className="px-3 py-2 text-[11px] font-bold text-gray-400 border-b border-white/5">
              Apuntat ({items.length}) <span className="font-normal text-gray-600">· clica un minut per anar-hi</span>
            </p>
            <ul className="divide-y divide-white/5">
              {items.map((it, i) => (
                <li key={i} className="flex items-center gap-2 px-3 py-1.5 group">
                  <button onClick={() => seekTo((toSec(it.t) ?? 0) + offset - 3)}
                    className="font-mono text-[11px] text-[#E5C07B] hover:underline w-11 shrink-0 text-left">{normTime(it.t) || it.t}</button>
                  <span className="shrink-0">{it.icon}</span>
                  <span className="text-xs text-gray-300 truncate flex-1">{it.text}</span>
                  <button onClick={it.del} title="Esborrar"
                    className="text-gray-700 hover:text-[#E06B5E] text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </li>
              ))}
              {!items.length && <li className="px-3 py-4 text-xs text-gray-600 text-center">Encara no hi ha res apuntat.</li>}
            </ul>
          </div>
        </div>

        {/* Accions o diàleg */}
        <div className="min-h-0 overflow-y-auto border-l border-white/10 bg-[#121212] p-4">
          {dlg
            ? <Dialog key={dlg.id} dlg={dlg} ctx={ctx} onSave={onSave} onCancel={() => close(true)}/>
            : <div className="space-y-3">
                <p className="text-[11px] text-gray-500">Cada botó agafa el minut del vídeo i l'atura mentre tries.</p>
                <div className="grid grid-cols-2 gap-2">
                  {ACTIONS.map(a => (
                    <button key={a.kind} onClick={() => open(a.kind)}
                      className="flex items-center gap-2 px-3 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all text-left">
                      <span className="text-lg">{a.icon}</span>
                      <span className="text-xs font-bold flex-1" style={{ color: a.color }}>{a.label}</span>
                      <kbd className="text-[10px] font-mono text-gray-500 border border-white/10 rounded px-1.5 py-0.5 uppercase">{a.key}</kbd>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-600 leading-relaxed">
                  Dins d'una acció: <b>1–9, 0</b> trien jugador · <b>↵</b> desa · <b>Esc</b> cancel·la.
                  Al xut, <b>Q</b> a porta · <b>W</b> fora · <b>E</b> al pal.
                </p>
              </div>}
        </div>
      </div>
    </div>
  );
}
