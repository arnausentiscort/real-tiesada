import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Trophy, Target, Shield, TrendingUp, Users, X, ChevronRight, ChevronLeft, Clock, Calendar } from 'lucide-react';
import { DATABASE } from '../data.js';
import { calcGlobalStats, formatTime } from '../utils.js';
import ExportExcelButton from './ExportExcel.jsx';
import DuoStats from './DuoStats.jsx';

const BASE = import.meta.env.BASE_URL;
const ACCENT = '#E5C07B';
const GARNET = '#C0392B';

// ── Nom de dorsal ─────────────────────────────────────────────────
function sName(fullName) {
  const p = DATABASE.roster.find(r => r.name === fullName);
  return p?.shirtName || fullName.split(' ')[0].toUpperCase();
}

// ── Countdown al proper partit ────────────────────────────────────
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    if (!targetDate) return;
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) return setTimeLeft({ past: true });
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ d, h, m, s, past: false });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

function CountdownHero({ onSelectMatch }) {
  // Detecta el proper partit no jugat del calendari
  const now = new Date();
  const upcoming = (DATABASE.calendar || [])
    .filter(c => new Date(c.date) > now)
    .sort((a,b) => new Date(a.date) - new Date(b.date));
  const next = upcoming[0] || DATABASE.nextMatch;

  const lastMatch = DATABASE.matches[DATABASE.matches.length - 1];
  const [lf, la] = lastMatch.result.split('-').map(s=>parseInt(s.trim()));
  const lastRS = getRS(lf, la);
  const t = useCountdown(next?.date);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!t || t.past) return;
    setPulse(true);
    const id = setTimeout(() => setPulse(false), 200);
    return () => clearTimeout(id);
  }, [t?.s]);

  if (!next) return null;

  const isToday = t && !t.past && t.d === 0;
  const isSoon  = t && !t.past && t.d <= 2;

  return (
    <div className="relative overflow-hidden rounded-2xl border"
      style={{
        background: isToday ? 'linear-gradient(135deg, #1a0a00, #1a1a00)' : 'linear-gradient(135deg, #0f0f14, #1a1a1a)',
        borderColor: isToday ? 'rgba(229,192,123,0.4)' : 'rgba(255,255,255,0.07)'
      }}>

      {isToday && (
        <div className="absolute inset-0 pointer-events-none"
          style={{background:'radial-gradient(ellipse at 50% 0%, rgba(229,192,123,0.08) 0%, transparent 70%)'}}/>
      )}

      <div className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row gap-5 md:gap-8">

          {/* Proper partit — Countdown */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-3.5 h-3.5 text-[#E5C07B]/60"/>
              <span className="text-[10px] font-bold text-[#E5C07B]/60 uppercase tracking-widest">
                {isToday ? '🔥 AVUI JUGUEM!' : isSoon ? '⚡ Proper Partit' : 'Proper Partit'}
              </span>
              {/* Badge local/visitant */}
              {next.isHome !== undefined && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
                  style={{
                    background: next.isHome ? 'rgba(39,174,96,0.1)' : 'rgba(192,57,43,0.1)',
                    borderColor: next.isHome ? 'rgba(39,174,96,0.3)' : 'rgba(192,57,43,0.3)',
                    color: next.isHome ? '#27AE60' : '#C0392B',
                  }}>
                  {next.isHome ? '🏠 Local' : '✈️ Visitant'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h2 className="text-2xl font-black text-white">
                {next.isHome ? (
                  <><span className="text-[#C0392B]">Real Tiesada</span><span className="mx-2 text-gray-600 font-light">vs</span><span>{next.opponent}</span></>
                ) : (
                  <><span>{next.opponent}</span><span className="mx-2 text-gray-600 font-light">vs</span><span className="text-[#C0392B]">Real Tiesada</span></>
                )}
              </h2>
              <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-0.5 rounded-full border border-white/8">
                {next.jornada}
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-4">{next.dateLabel}{next.location ? ` · ${next.location}` : ''}</p>

            {/* Countdown boxes */}
            {t && !t.past && (
              <div className="flex gap-2">
                {[
                  { v: t.d, l: 'dies' },
                  { v: t.h, l: 'hores' },
                  { v: t.m, l: 'min' },
                  { v: t.s, l: 'seg' },
                ].map(({ v, l }, i) => (
                  <div key={l} className="flex flex-col items-center">
                    <div className="relative w-14 h-14 rounded-xl flex items-center justify-center font-black font-mono text-2xl"
                      style={{
                        background: i === 3 && pulse ? 'rgba(229,192,123,0.15)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${i === 3 && pulse ? 'rgba(229,192,123,0.3)' : 'rgba(255,255,255,0.08)'}`,
                        color: i === 0 && t.d === 0 ? '#E5C07B' : 'rgba(255,255,255,0.9)',
                        transition: 'background 0.1s, border-color 0.1s',
                      }}>
                      {String(v).padStart(2,'0')}
                    </div>
                    <span className="text-[9px] text-gray-600 mt-1 uppercase tracking-wider">{l}</span>
                  </div>
                ))}
              </div>
            )}
            {t?.past && <div className="text-sm text-gray-500">El proper partit és aviat</div>}

            {/* Llista dels pròxims partits */}
            {upcoming.length > 1 && (
              <div className="mt-4 pt-3 border-t border-white/5 space-y-1">
                {upcoming.slice(1, 4).map((c,i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] text-gray-600">
                    <span className="text-gray-700">{c.dateLabel}</span>
                    <span className="text-gray-800">·</span>
                    <span>{c.isHome ? 'vs' : '@'} {c.opponent}</span>
                    <span className="text-gray-800 ml-auto">{c.jornada.replace('Jornada ','J')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Separador */}
          <div className="hidden md:block w-px bg-white/6"/>

          {/* Últim resultat */}
          <div className="flex-shrink-0 md:w-52">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Últim Resultat</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className={`text-3xl font-black font-mono px-3 py-1.5 rounded-xl ${lastRS.color}`}
                style={{background:'rgba(0,0,0,0.3)'}}>
                {lastMatch.result}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{lastMatch.opponent}</div>
                <div className="text-[10px] text-gray-600">{lastMatch.jornada} · {lastMatch.date}</div>
              </div>
            </div>
            <button onClick={() => onSelectMatch(lastMatch)}
              className="text-[11px] text-[#E5C07B]/60 hover:text-[#E5C07B] transition-colors flex items-center gap-1 mt-2">
              Veure crònica <ChevronRight className="w-3 h-3"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Número animat (compta de 0 al valor) ─────────────────────────
function AnimatedNumber({ value, suffix = '', duration = 800 }) {
  const [displayed, setDisplayed] = useState(0);
  const [ref, inView] = useInView();
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  return <span ref={ref}>{displayed}{suffix}</span>;
}

// ── InView hook ───────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ── Resultat helper ───────────────────────────────────────────────
const getRS = (f, a) => {
  if (f > a) return { label:'V', bg:'bg-emerald-500/20 text-emerald-400', border:'border-emerald-500/20', color:'text-emerald-400' };
  if (f < a) return { label:'D', bg:'bg-[#C0392B]/20 text-[#C0392B]',    border:'border-[#C0392B]/20',   color:'text-[#C0392B]'  };
  return           { label:'E', bg:'bg-yellow-500/20 text-yellow-400',    border:'border-yellow-500/20',  color:'text-yellow-400' };
};

// ── Barra stat ────────────────────────────────────────────────────
function StatRow({ name, value, max, color, delay = 0 }) {
  const [ref, inView] = useInView();
  const player = DATABASE.roster.find(p => p.name === name);
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div ref={ref} className="flex items-center gap-3 group"
      style={{ opacity: inView?1:0, transform: inView?'translateX(0)':'translateX(-12px)',
        transition: `opacity 0.5s ${delay}ms, transform 0.5s ${delay}ms` }}>
      {player?.photo ? (
        <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0">
          <img src={`${BASE}${player.photo}`} alt={name} className="w-full h-full object-cover" style={{objectPosition:'center 15%'}}/>
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full bg-[#C0392B]/15 border border-white/10 flex items-center justify-center shrink-0">
          <span className="text-[9px] font-black text-[#E5C07B]/40">{name[0]}</span>
        </div>
      )}
      <span className="text-xs text-gray-500 w-16 truncate shrink-0">{sName(name)}</span>
      <div className="flex-1 h-4 bg-[#0d0d0d] rounded-lg overflow-hidden border border-white/5">
        <div className="h-full rounded-lg"
          style={{ width: inView?`${Math.max(pct,value>0?4:0)}%`:'0%', background: color,
            transition: `width 0.9s ${delay+100}ms cubic-bezier(0.16,1,0.3,1)` }}/>
      </div>
      <span className="w-5 text-xs font-black text-right shrink-0" style={{color}}>{value}</span>
    </div>
  );
}

// ── Targeta jugador ranking ───────────────────────────────────────
function PlayerCard({ rank, name, value, label, emoji }) {
  const [hover, setHover] = useState(false);
  const [ref, inView] = useInView(0.05);
  const player = DATABASE.roster.find(p => p.name === name);
  const medals = ['🥇','🥈','🥉'];
  const photoSrc = hover && player?.photoCel ? player.photoCel : player?.photo;
  const isTop = rank === 0;
  return (
    <div ref={ref}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 cursor-default
        ${isTop ? 'bg-[#E5C07B]/8 border-[#E5C07B]/25' : 'bg-[#1a1a1a] border-white/5 hover:border-white/15'}
        ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
      style={{ transitionDelay: `${rank * 60}ms` }}>
      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#111]">
        {photoSrc ? (
          <img src={`${BASE}${photoSrc}`} alt={name} className="w-full h-full object-cover"
            style={{objectPosition:'center 15%', transition:'transform 0.4s', transform: hover?'scale(1.08)':'scale(1)'}}/>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#C0392B]/10">
            <span className="text-xl font-black text-[#E5C07B]/20">{name[0]}</span>
          </div>
        )}
        <div className="absolute top-0.5 left-0.5 text-xs leading-none">{medals[rank] || ''}</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-600 uppercase tracking-wider">{label}</p>
        <p className={`font-bold truncate text-sm ${isTop?'text-[#E5C07B]':'text-white'}`}>{sName(name)}</p>
      </div>
      <div className="flex flex-col items-center shrink-0">
        <span className={`font-black font-mono ${isTop?'text-2xl text-[#E5C07B]':'text-lg text-white'}`}>{value}</span>
        <span className="text-sm">{emoji}</span>
      </div>
    </div>
  );
}

// ── Modal jugador ─────────────────────────────────────────────────
function PlayerModal({ player, stats, onClose }) {
  const perMatch = DATABASE.matches.map(m => {
    const gf = (m.events?.goals||[]).filter(g => g.type==='favor' && g.scorer===player.name).length;
    const gc = (m.events?.goals||[]).filter(g => g.type==='contra' && g.goalkeeper===player.name).length;
    const ast = (m.events?.goals||[]).filter(g => g.type==='favor' && g.assist===player.name).length;
    const [f,a] = m.result.split('-').map(s=>parseInt(s.trim()));
    return { jornada: m.jornada, opponent: m.opponent, gf, gc, ast, result: m.result, f, a };
  }).filter(m => m.gf>0 || m.gc>0 || m.ast>0);

  useEffect(() => {
    const onKey = e => { if (e.key==='Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const totalGols = stats?.gols || 0;
  const totalAst  = stats?.assists || 0;
  const totalMin  = stats?.minutes || 0;

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 w-full max-w-md shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#1E1E1E] to-[#121212] p-6 border-b border-white/5">
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-400"/>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#E5C07B]/20 bg-[#111] shrink-0">
              {player.photo ? (
                <img src={`${BASE}${player.photo}`} alt={player.name}
                  className="w-full h-full object-cover" style={{objectPosition:'center 15%'}}/>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-black text-[#E5C07B]/20">{player.name[0]}</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-[10px] text-[#E5C07B]/50 uppercase tracking-wider">#{player.number} · {player.position}</p>
              <h3 className="text-2xl font-black text-white">{sName(player.name)}</h3>
              <p className="text-gray-500 text-sm">{player.name}</p>
            </div>
          </div>
          {/* Stats ràpides */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-white/5">
            {[
              {v: totalGols, l:'Gols', c:'text-emerald-400'},
              {v: totalAst,  l:'Assists', c:'text-blue-400'},
              {v: totalGols+totalAst, l:'Participació', c:'text-[#E5C07B]'},
            ].map(({v,l,c}) => (
              <div key={l} className="text-center flex-1">
                <p className={`text-2xl font-black font-mono ${c}`}>{v}</p>
                <p className="text-[10px] text-gray-600 uppercase tracking-wider">{l}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Per jornada */}
        {perMatch.length > 0 && (
          <div className="p-4">
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">Per jornada</p>
            <div className="space-y-2">
              {DATABASE.matches.map(m => {
                const gf  = (m.events?.goals||[]).filter(g=>g.type==='favor'&&g.scorer===player.name).length;
                const ast = (m.events?.goals||[]).filter(g=>g.type==='favor'&&g.assist===player.name).length;
                const gc  = (m.events?.goals||[]).filter(g=>g.type==='contra'&&g.goalkeeper===player.name).length;
                if (gf===0&&ast===0&&gc===0) return null;
                const [f,a] = m.result.split('-').map(s=>parseInt(s.trim()));
                const rs = getRS(f,a);
                return (
                  <div key={m.id} className="flex items-center gap-3 bg-[#111] rounded-xl px-3 py-2">
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${rs.bg}`}>{rs.label}</span>
                    <span className="text-xs text-gray-400 flex-1">{m.jornada} vs {m.opponent}</span>
                    <div className="flex gap-2 text-xs">
                      {gf>0 && <span className="text-emerald-400 font-bold">{gf}⚽</span>}
                      {ast>0 && <span className="text-blue-400 font-bold">{ast}👟</span>}
                      {gc>0 && <span className="text-[#C0392B] font-bold">{gc}🥅</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {perMatch.length === 0 && (
          <div className="p-6 text-center text-gray-600 text-sm">Sense estadístiques registrades</div>
        )}
      </div>
    </div>
  );
}

// ── Timeline de temporada ─────────────────────────────────────────
function SeasonTimeline({ matches, onSelectMatch }) {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <button onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#1a1a1a]/90
          border border-white/10 flex items-center justify-center hover:bg-[#252525] transition-all shadow-lg">
        <ChevronLeft className="w-4 h-4 text-gray-400"/>
      </button>
      <button onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#1a1a1a]/90
          border border-white/10 flex items-center justify-center hover:bg-[#252525] transition-all shadow-lg">
        <ChevronRight className="w-4 h-4 text-gray-400"/>
      </button>

      {/* Línia de temps */}
      <div ref={scrollRef} className="flex gap-0 overflow-x-auto mx-10 pb-1"
        style={{scrollbarWidth:'none', WebkitOverflowScrolling:'touch'}}>
        {/* Línia horitzontal */}
        <div className="flex items-center min-w-max">
          {matches.map((m, idx) => {
            const [f,a] = m.result.split('-').map(s=>parseInt(s.trim()));
            const rs = getRS(f,a);
            const isLast = idx === matches.length - 1;
            return (
              <div key={m.id} className="flex items-center">
                {/* Node */}
                <div className="flex flex-col items-center gap-1.5 group cursor-pointer"
                  onClick={() => onSelectMatch(m)}>
                  {/* Bubble resultat */}
                  <div className={`w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center
                    transition-all group-hover:scale-110 group-hover:shadow-lg
                    ${rs.color} ${rs.border.replace('border-','border-').replace('/20','/60')}
                    bg-[#1a1a1a] group-hover:bg-[#252525]`}>
                    <span className="font-black font-mono text-sm leading-none">{f}-{a}</span>
                    <span className={`text-[8px] font-bold px-1 rounded-full mt-0.5 ${rs.bg}`}>{rs.label}</span>
                  </div>
                  {/* Info */}
                  <div className="text-center">
                    <p className="text-[9px] text-gray-600 font-bold">{m.jornada.replace('Jornada ','J')}</p>
                    <p className="text-[9px] text-gray-500 max-w-[64px] truncate">{m.opponent}</p>
                  </div>
                </div>
                {/* Connector */}
                {!isLast && (
                  <div className="w-8 h-px bg-gradient-to-r from-white/10 to-white/5 mx-1"/>
                )}
              </div>
            );
          })}
          {/* Proper partit placeholder */}
          <div className="flex items-center">
            <div className="w-8 h-px bg-gradient-to-r from-white/10 to-transparent mx-1"/>
            <div className="flex flex-col items-center gap-1.5 opacity-40">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center bg-transparent">
                <span className="text-[10px] text-gray-600 font-bold">J5?</span>
              </div>
              <p className="text-[9px] text-gray-700">Proper</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Targeta de partit (columna dreta) ─────────────────────────────
function MatchSideCard({ match, onSelect, isActive }) {
  const [f,a] = match.result.split('-').map(s=>parseInt(s.trim()));
  const rs = getRS(f,a);
  const goalsF = (match.events?.goals||[]).filter(g=>g.type==='favor');
  const topScorer = goalsF.length > 0 ? sName(goalsF[0].scorer) : null;

  return (
    <div onClick={() => onSelect(match)}
      className={`p-3 rounded-xl border cursor-pointer transition-all hover:-translate-x-0.5 group
        ${isActive ? 'bg-[#E5C07B]/8 border-[#E5C07B]/30' : `bg-[#1a1a1a] ${rs.border} hover:border-white/20`}`}>
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-black font-mono text-xs ${rs.color} bg-black/30`}>
          {f}-{a}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-bold truncate">{match.opponent}</p>
          <p className="text-gray-600 text-[10px]">{match.jornada} · {match.date}</p>
        </div>
        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${rs.bg}`}>{rs.label}</span>
      </div>
      {topScorer && (
        <p className="text-[10px] text-gray-600 mt-1.5 pl-10">⚽ {topScorer}{goalsF.length>1?` +${goalsF.length-1}`:''}</p>
      )}
    </div>
  );
}

// ── Dashboard principal ───────────────────────────────────────────
export default function GlobalDashboard({ onSelectMatch }) {
  const stats = useMemo(() => calcGlobalStats(DATABASE), []);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [activeMatchId, setActiveMatchId] = useState(null);

  const matchHistory = DATABASE.matches.map(m => {
    const [f, a] = m.result.split('-').map(s => parseInt(s.trim()));
    return { ...m, for: f, against: a };
  });

  const totalGF = matchHistory.reduce((a,m) => a+m.for, 0);
  const totalGA = matchHistory.reduce((a,m) => a+m.against, 0);
  const wins    = matchHistory.filter(m => m.for > m.against).length;
  const draws   = matchHistory.filter(m => m.for === m.against).length;
  const losses  = matchHistory.filter(m => m.for < m.against).length;
  const lastMatch = matchHistory[matchHistory.length - 1];
  const [lf, la] = lastMatch.result.split('-').map(s=>parseInt(s.trim()));
  const lastRS = getRS(lf, la);

  const maxGF = Math.max(...stats.goalsFor.map(([,v]) => v), 1);
  const maxGA = Math.max(...stats.goalsAgainst.map(([,v]) => v), 1);

  const handleMatchSelect = (match) => {
    setActiveMatchId(match.id);
    onSelectMatch(match);
  };

  // Player stats map per modal
  const playerStatsMap = useMemo(() => {
    const map = {};
    DATABASE.roster.forEach(p => {
      map[p.name] = {
        gols:    stats.topScorers.find(([n])=>n===p.name)?.[1] || 0,
        assists: stats.topAssists.find(([n])=>n===p.name)?.[1] || 0,
      };
    });
    return map;
  }, [stats]);

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── HERO — Countdown + últim resultat ── */}
      <CountdownHero onSelectMatch={handleMatchSelect}/>

      {/* ── Xifres temporada animades ── */}
      <div className="grid grid-cols-5 gap-2">
        {[
          {v: wins,    l:'Victòries', c:'text-emerald-400', delay:0},
          {v: draws,   l:'Empats',    c:'text-yellow-400',  delay:80},
          {v: losses,  l:'Derrotes',  c:'text-[#C0392B]',   delay:160},
          {v: totalGF, l:'G. favor',  c:'text-[#E5C07B]',   delay:240},
          {v: totalGA, l:'En contra', c:'text-gray-400',    delay:320},
        ].map(({v,l,c,delay}) => (
          <div key={l} className="bg-[#1a1a1a] rounded-xl border border-white/5 p-2 sm:p-3 text-center"
            style={{animation:`fadeSlideUp 0.5s ease ${delay}ms both`}}>
            <p className={`text-xl sm:text-2xl font-black font-mono ${c}`}>
              <AnimatedNumber value={v} duration={600 + delay}/>
            </p>
            <p className="text-[9px] sm:text-[10px] text-gray-600 uppercase tracking-wider mt-0.5 leading-tight">{l}</p>
          </div>
        ))}
      </div>

      {/* ── TIMELINE TEMPORADA ── */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 px-4 py-4">
        <p className="text-xs text-gray-600 uppercase tracking-wider mb-4 px-2">📅 Temporada actual</p>
        <SeasonTimeline matches={DATABASE.matches} onSelectMatch={handleMatchSelect}/>
      </div>

      {/* ── LAYOUT DUES COLUMNES: STATS + PARTITS ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5 items-start">

        {/* Columna esquerra — Stats */}
        <div className="space-y-5">

          {/* Botó exportar */}
          <div className="flex justify-end">
            <ExportExcelButton/>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {stats.topScorers.length > 0 && (
              <section>
                <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#E5C07B]"/> Golejadors
                  <span className="text-[10px] text-gray-600 font-normal ml-auto">clica per veure detall</span>
                </h3>
                <div className="space-y-2">
                  {stats.topScorers.map(([name, count], idx) => (
                    <div key={name} onClick={() => setSelectedPlayer(DATABASE.roster.find(p=>p.name===name))}
                      className="cursor-pointer hover:scale-[1.01] transition-transform">
                      <PlayerCard rank={idx} name={name} value={count} emoji="⚽" label="Gols"/>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {stats.topAssists.length > 0 && (
              <section>
                <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#E5C07B]"/> Assistències
                </h3>
                <div className="space-y-2">
                  {stats.topAssists.map(([name, count], idx) => (
                    <div key={name} onClick={() => setSelectedPlayer(DATABASE.roster.find(p=>p.name===name))}
                      className="cursor-pointer hover:scale-[1.01] transition-transform">
                      <PlayerCard rank={idx} name={name} value={count} emoji="👟" label="Assists"/>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Barres stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1E1E1E] rounded-2xl p-4 border border-emerald-500/10">
              <h4 className="text-xs font-bold text-[#E5C07B] mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5"/> ⚽ Gols a Favor per Jugador
              </h4>
              <div className="space-y-2">
                {stats.goalsFor.filter(([,v])=>v>0).map(([name,count],i) => (
                  <StatRow key={name} name={name} value={count} max={maxGF} color="#27AE60" delay={i*60}/>
                ))}
              </div>
            </div>
            <div className="bg-[#1E1E1E] rounded-2xl p-4 border border-[#C0392B]/10">
              <h4 className="text-xs font-bold text-[#E5C07B] mb-3 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5"/> ❌ Gols en Contra per Jugador
              </h4>
              <div className="space-y-2">
                {stats.goalsAgainst.filter(([,v])=>v>0).map(([name,count],i) => (
                  <StatRow key={name} name={name} value={count} max={maxGA} color="#C0392B" delay={i*60}/>
                ))}
              </div>
            </div>

            {/* Favor vs Contra */}
            <div className="bg-[#1E1E1E] rounded-2xl p-4 border border-white/5 md:col-span-2">
              <h4 className="text-xs font-bold text-[#E5C07B] mb-3 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5"/> Favor vs Contra per Jugador
              </h4>
              <div className="space-y-2">
                {DATABASE.roster.map(p => {
                  const gf = stats.goalsFor.find(([n])=>n===p.name)?.[1] ?? 0;
                  const ga = stats.goalsAgainst.find(([n])=>n===p.name)?.[1] ?? 0;
                  if (gf===0&&ga===0) return null;
                  const maxV = Math.max(gf,ga,1);
                  return (
                    <div key={p.name} className="flex items-center gap-2 group cursor-pointer"
                      onClick={() => setSelectedPlayer(p)}>
                      {p.photo ? (
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0">
                          <img src={`${BASE}${p.photo}`} alt={p.name} className="w-full h-full object-cover" style={{objectPosition:'center 15%'}}/>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#C0392B]/15 border border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-[9px] font-bold text-[#E5C07B]/40">{p.name[0]}</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-500 w-14 truncate shrink-0">{sName(p.name)}</span>
                      <div className="flex-1 flex flex-col gap-0.5">
                        <div className="h-2 bg-[#0d0d0d] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500/60 rounded-full transition-all duration-700" style={{width:`${(gf/maxV)*100}%`}}/>
                        </div>
                        <div className="h-2 bg-[#0d0d0d] rounded-full overflow-hidden">
                          <div className="h-full bg-[#C0392B]/60 rounded-full transition-all duration-700" style={{width:`${(ga/maxV)*100}%`}}/>
                        </div>
                      </div>
                      <span className="text-xs font-mono w-8 text-right shrink-0">
                        <span className="text-emerald-400">{gf}</span>
                        <span className="text-gray-600">/</span>
                        <span className="text-[#C0392B]">{ga}</span>
                      </span>
                    </div>
                  );
                }).filter(Boolean)}
              </div>
            </div>
          </div>

          <DuoStats />

          {/* Minuts de camp */}
          {stats.minutesCamp.length > 0 && (
            <div>
              <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E5C07B]"/> Minuts de Camp per Jugador
              </h3>
              <div className="bg-[#1E1E1E] rounded-2xl p-4 border border-[#C0392B]/10">
                <div className="space-y-2.5">
                  {stats.minutesCamp.map(([name, secs]) => {
                    const maxSecs = stats.minutesCamp[0]?.[1] || 1;
                    const pl = DATABASE.roster.find(p => p.name === name);
                    return (
                      <div key={name} className="flex items-center gap-2 group">
                        {pl?.photo ? (
                          <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0">
                            <img src={`${BASE}${pl.photo}`} alt={name} className="w-full h-full object-cover" style={{objectPosition:'center 15%'}}/>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#C0392B]/15 border border-white/10 flex items-center justify-center shrink-0">
                            <span className="text-[8px] font-black text-[#E5C07B]/40">{name[0]}</span>
                          </div>
                        )}
                        <span className="w-20 text-xs text-right text-gray-500 group-hover:text-white shrink-0 font-semibold truncate">{sName(name)}</span>
                        <div className="flex-1 h-4 bg-[#0d0d0d] rounded-lg overflow-hidden border border-white/5">
                          <div className="h-full rounded-lg bg-[#C0392B] transition-all duration-700" style={{width:`${(secs/maxSecs)*100}%`}}/>
                        </div>
                        <span className="w-12 text-xs font-mono text-right shrink-0 text-white">{formatTime(secs)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Porter: minuts + gols encaixats + aturades */}
          {(stats.minutesPorter.length > 0 || stats.goalsConceded.length > 0) && (
            <div>
              <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#E5C07B]"/> Estadístiques de Porter
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {stats.minutesPorter.length > 0 && (
                  <div className="bg-[#1E1E1E] rounded-2xl p-4 border border-emerald-500/10">
                    <h4 className="text-xs font-bold text-[#E5C07B] mb-3">🧤 Minuts de Porter</h4>
                    <div className="space-y-2.5">
                      {stats.minutesPorter.map(([name, secs]) => {
                        const maxSecs = stats.minutesPorter[0]?.[1] || 1;
                        const pl = DATABASE.roster.find(p => p.name === name);
                        return (
                          <div key={name} className="flex items-center gap-2 group">
                            {pl?.photo ? (
                              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0">
                                <img src={`${BASE}${pl.photo}`} alt={name} className="w-full h-full object-cover" style={{objectPosition:'center 15%'}}/>
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-white/10 flex items-center justify-center shrink-0">
                                <span className="text-[8px] font-black text-emerald-400/50">{name[0]}</span>
                              </div>
                            )}
                            <span className="w-16 text-xs text-right text-gray-500 group-hover:text-white shrink-0 font-semibold truncate">{sName(name)}</span>
                            <div className="flex-1 h-4 bg-[#0d0d0d] rounded-lg overflow-hidden border border-white/5">
                              <div className="h-full rounded-lg bg-emerald-500 transition-all duration-700" style={{width:`${(secs/maxSecs)*100}%`}}/>
                            </div>
                            <span className="w-12 text-xs font-mono text-right shrink-0 text-emerald-400">{formatTime(secs)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {stats.goalsConceded.length > 0 && (
                  <div className="bg-[#1E1E1E] rounded-2xl p-4 border border-[#C0392B]/10">
                    <h4 className="text-xs font-bold text-[#E5C07B] mb-3">🥅 Gols Encaixats</h4>
                    <div className="space-y-2">
                      {stats.goalsConceded.map(([name,count],i) => (
                        <StatRow key={name} name={name} value={count}
                          max={Math.max(...stats.goalsConceded.map(([,v])=>v),1)}
                          color="#C0392B" delay={i*60}/>
                      ))}
                    </div>
                  </div>
                )}
                {stats.saves.length > 0 && (
                  <div className="bg-[#1E1E1E] rounded-2xl p-4 border border-blue-500/10">
                    <h4 className="text-xs font-bold text-[#E5C07B] mb-3">⛔ Aturades</h4>
                    <div className="space-y-2">
                      {stats.saves.map(([name,count],i) => (
                        <StatRow key={name} name={name} value={count}
                          max={Math.max(...stats.saves.map(([,v])=>v),1)}
                          color="#61AFEF" delay={i*60}/>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Targetes */}
          {stats.yellowCards.length > 0 && (
            <div className="bg-[#1E1E1E] rounded-2xl p-4 border border-yellow-500/10">
              <h4 className="text-xs font-bold text-[#E5C07B] mb-3">🟨 Targetes Grogues</h4>
              {stats.yellowCards.map(([name,count]) => {
                const player = DATABASE.roster.find(p=>p.name===name);
                return (
                  <div key={name} className="flex items-center gap-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-2.5 mb-2">
                    {player?.photo && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-yellow-500/20 shrink-0">
                        <img src={`${BASE}${player.photo}`} alt={name} className="w-full h-full object-cover" style={{objectPosition:'center 15%'}}/>
                      </div>
                    )}
                    <span className="flex-1 text-sm font-bold text-yellow-200">{sName(name)}</span>
                    <span className="text-xl font-black text-yellow-400">{count} 🟨</span>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Columna dreta — Partits */}
        <div className="xl:sticky xl:top-20">
          <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2">
            🏟 Partits
          </h3>
          <div className="space-y-2">
            {[...DATABASE.matches].reverse().map(match => (
              <MatchSideCard key={match.id} match={match}
                onSelect={handleMatchSelect}
                isActive={activeMatchId === match.id}/>
            ))}
          </div>
          {/* Taula resum */}
          <div className="mt-4 bg-[#1a1a1a] rounded-xl border border-white/5 p-3">
            <div className="flex justify-between text-xs text-gray-600 pb-2 border-b border-white/5">
              <span>{wins}V · {matchHistory.filter(m=>m.for===m.against).length}E · {losses}D</span>
              <span className="font-mono">
                <span className="text-emerald-400">{totalGF}</span>
                <span className="text-gray-600"> - </span>
                <span className="text-[#C0392B]">{totalGA}</span>
              </span>
            </div>
            <p className="text-[10px] text-gray-700 mt-2 text-center">Temporada 25/26 · Futbol Sala</p>
          </div>
        </div>
      </div>

      {/* Modal jugador */}
      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          stats={playerStatsMap[selectedPlayer.name]}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}
