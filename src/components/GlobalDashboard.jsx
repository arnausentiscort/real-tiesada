import React, { useMemo, useState, useEffect, useRef } from 'react';
import { PlayCircle, Trophy, Target, Shield, TrendingUp, Users } from 'lucide-react';
import { DATABASE } from '../data.js';
import { calcGlobalStats } from '../utils.js';

const BASE = import.meta.env.BASE_URL;

// ── Hook: detecta quan l'element és visible ──────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ── Barra animada ────────────────────────────────────────────────
function AnimatedBar({ value, max, color, delay = 0 }) {
  const [ref, inView] = useInView();
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div ref={ref} className="flex-1 h-full bg-[#0d0d0d] rounded-lg overflow-hidden border border-white/5 relative bar-shimmer">
      <div
        className="h-full rounded-lg transition-all duration-1000 ease-out"
        style={{
          width: inView ? `${Math.max(pct, value > 0 ? 4 : 0)}%` : '0%',
          background: color,
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  );
}

// ── Card gran de jugador (top scorer / assist) ───────────────────
function PlayerHeroCard({ rank, name, value, emoji, label }) {
  const [ref, inView] = useInView(0.1);
  const player = DATABASE.roster.find(p => p.name === name);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div ref={ref}
      className={`relative bg-[#1a1a1a] border rounded-2xl overflow-hidden card-hover cursor-default
        ${rank === 0 ? 'border-[#E5C07B]/40 glow-gold' : 'border-white/5'}
        transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${rank * 120}ms` }}
    >
      {/* Foto gran de fons */}
      {player?.photo && (
        <div className="relative overflow-hidden" style={{ height: rank === 0 ? '220px' : '160px' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1a1a1a] z-10" />
          <img
            src={`${BASE}${player.photo}`}
            alt={name}
            className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-500"
          />
          {/* Medalla */}
          <div className="absolute top-3 right-3 z-20 text-3xl"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))' }}>
            {medals[rank] || ''}
          </div>
        </div>
      )}
      {!player?.photo && (
        <div className="relative flex items-center justify-center bg-gradient-to-b from-[#C0392B]/10 to-[#1a1a1a]"
          style={{ height: rank === 0 ? '120px' : '80px' }}>
          <span className="text-6xl opacity-20 font-black text-[#E5C07B]">{name[0]}</span>
          <div className="absolute top-3 right-3 text-3xl">{medals[rank] || ''}</div>
        </div>
      )}

      {/* Info */}
      <div className="p-4 relative z-10">
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">{label}</div>
        <div className={`font-black truncate mb-2 ${rank === 0 ? 'text-[#E5C07B] text-xl text-glow-gold' : 'text-white text-base'}`}>
          {name}
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`font-black font-mono ${rank === 0 ? 'text-4xl text-[#E5C07B]' : 'text-2xl text-white'}`}>
            {value}
          </span>
          <span className="text-lg">{emoji}</span>
        </div>
      </div>
    </div>
  );
}

// ── Fila d'estadística amb barra ─────────────────────────────────
function StatRow({ name, value, max, color, delay, icon }) {
  const [ref, inView] = useInView();
  const player = DATABASE.roster.find(p => p.name === name);
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <div ref={ref}
      className={`flex items-center gap-3 group transition-all duration-500 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {/* Avatar */}
      {player?.photo ? (
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#E5C07B]/50 transition-colors shrink-0">
          <img src={`${BASE}${player.photo}`} alt={name} className="w-full h-full object-cover object-top" />
        </div>
      ) : (
        <div className="w-9 h-9 rounded-full bg-[#C0392B]/15 border-2 border-white/10 flex items-center justify-center shrink-0">
          <span className="text-xs font-black text-[#E5C07B]/50">{name[0]}</span>
        </div>
      )}
      <span className="text-sm text-gray-400 group-hover:text-white transition-colors truncate w-24 shrink-0">{name}</span>
      {/* Barra */}
      <div className="flex-1 h-6 bg-[#0d0d0d] rounded-lg overflow-hidden border border-white/5 relative bar-shimmer">
        <div className="h-full rounded-lg transition-all duration-1000 ease-out"
          style={{ width: inView ? `${Math.max(pct, value > 0 ? 4 : 0)}%` : '0%', background: color, transitionDelay: `${delay + 100}ms` }} />
      </div>
      <span className="w-8 text-sm font-black text-right shrink-0" style={{ color }}>{value}</span>
      {icon && <span className="text-base shrink-0">{icon}</span>}
    </div>
  );
}

// ── Card de secció ────────────────────────────────────────────────
function Card({ title, icon, children, className = '' }) {
  const [ref, inView] = useInView(0.08);
  return (
    <div ref={ref}
      className={`bg-[#1E1E1E] rounded-2xl p-5 border border-white/5 shadow-2xl transition-all duration-600
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-[#E5C07B]/10 rounded-xl flex items-center justify-center shrink-0">{icon}</div>
        <h3 className="text-base font-bold text-[#E5C07B]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ── Component principal ───────────────────────────────────────────
export default function GlobalDashboard({ onSelectMatch }) {
  const stats = useMemo(() => calcGlobalStats(DATABASE), []);
  const [activeTab, setActiveTab] = useState('resum');

  const maxGoalsFor     = Math.max(...stats.goalsFor.map(([,v]) => v), 1);
  const maxGoalsAgainst = Math.max(...stats.goalsAgainst.map(([,v]) => v), 1);

  const matchHistory = DATABASE.matches.map(m => {
    const [f, a] = m.result.split('-').map(s => parseInt(s.trim()));
    return { jornada: m.jornada, opponent: m.opponent, for: f, against: a, match: m };
  });

  const getRS = (f, a) => {
    if (f > a) return { label:'V', bg:'bg-emerald-500/20 text-emerald-400', border:'border-emerald-500/30', color:'text-emerald-400' };
    if (f < a) return { label:'D', bg:'bg-[#C0392B]/20 text-[#C0392B]',    border:'border-[#C0392B]/30',   color:'text-[#C0392B]'  };
    return           { label:'E', bg:'bg-yellow-500/20 text-yellow-400',    border:'border-yellow-500/30',  color:'text-yellow-400' };
  };

  return (
    <div className="space-y-8">
      {/* ── HERO HEADER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#E5C07B]/15 p-8 glow-gold animate-fade-in">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #E5C07B 0, #E5C07B 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10">
          <div className="text-xs text-[#E5C07B]/60 uppercase tracking-[0.3em] mb-2">Futbol Sala · Temporada 25/26</div>
          <h2 className="text-4xl font-black text-white mb-1">Estadístiques</h2>
          <p className="text-gray-500">{DATABASE.matches.length} partits jugats</p>
        </div>
        {/* Fons decoratiu */}
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-[#E5C07B]/5 blur-3xl pointer-events-none" />
        <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full bg-[#C0392B]/5 blur-2xl pointer-events-none" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5 w-fit animate-slide-up">
        {[{ id:'resum', label:'📊 Resum' }, { id:'partits', label:'🏟 Partits' }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === t.id ? 'bg-[#E5C07B]/15 text-[#E5C07B] shadow-inner' : 'text-gray-500 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── RESUM ── */}
      {activeTab === 'resum' && (
        <div className="space-y-10">

          {/* TOP GOLEJADORS — targetes heroes grans */}
          {stats.topScorers.length > 0 && (
            <section>
              <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#E5C07B]" /> Golejadors
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {stats.topScorers.map(([name, count], idx) => (
                  <PlayerHeroCard key={name} rank={idx} name={name} value={count} emoji="⚽" label="Golejador" />
                ))}
              </div>
            </section>
          )}

          {/* TOP ASSISTÈNCIES */}
          {stats.topAssists.length > 0 && (
            <section>
              <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#E5C07B]" /> Assistències
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {stats.topAssists.map(([name, count], idx) => (
                  <PlayerHeroCard key={name} rank={idx} name={name} value={count} emoji="👟" label="Assistències" />
                ))}
              </div>
            </section>
          )}

          {/* Stats secundàries en grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {/* Gols porter */}
            {stats.goalsConceded.length > 0 && (
              <Card title="Gols Encaixats (Porter)" icon={<Shield className="w-4 h-4 text-[#E5C07B]" />}>
                <div className="space-y-3">
                  {stats.goalsConceded.map(([name, count], i) => (
                    <StatRow key={name} name={name} value={count}
                      max={Math.max(...stats.goalsConceded.map(([,v])=>v),1)}
                      color="#C0392B" delay={i*80} />
                  ))}
                </div>
              </Card>
            )}

            {/* Gols a favor al camp */}
            <Card title="Gols a Favor al Camp" icon={<TrendingUp className="w-4 h-4 text-[#E5C07B]" />}>
              <p className="text-xs text-gray-600 mb-3">Gols a favor mentre estaves a la pista</p>
              <div className="space-y-3">
                {stats.goalsFor.filter(([,v])=>v>0).map(([name,count],i) => (
                  <StatRow key={name} name={name} value={count} max={maxGoalsFor} color="#27AE60" delay={i*80} />
                ))}
              </div>
            </Card>

            {/* Gols en contra al camp */}
            <Card title="Gols en Contra al Camp" icon={<Shield className="w-4 h-4 text-[#E5C07B]" />}>
              <p className="text-xs text-gray-600 mb-3">Gols en contra mentre estaves a la pista</p>
              <div className="space-y-3">
                {stats.goalsAgainst.filter(([,v])=>v>0).map(([name,count],i) => (
                  <StatRow key={name} name={name} value={count} max={maxGoalsAgainst} color="#C0392B" delay={i*80} />
                ))}
              </div>
            </Card>

            {/* Targetes */}
            <Card title="Targetes Grogues" icon={<span>🟨</span>}>
              {stats.yellowCards.length > 0 ? (
                <div className="space-y-3">
                  {stats.yellowCards.map(([name, count], i) => {
                    const player = DATABASE.roster.find(p => p.name === name);
                    return (
                      <div key={name} className="flex items-center gap-3 bg-yellow-500/5 border border-yellow-500/15 rounded-xl p-3">
                        {player?.photo ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-500/30 shrink-0">
                            <img src={`${BASE}${player.photo}`} alt={name} className="w-full h-full object-cover object-top" />
                          </div>
                        ) : null}
                        <span className="flex-1 font-bold text-yellow-200">{name}</span>
                        <span className="text-2xl font-black text-yellow-400">{count}</span>
                        <span className="text-xl">🟨</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 italic text-sm">Cap targeta encara 🎉</p>
              )}
            </Card>

            {/* Comparativa al camp — ocupa tot l'ample */}
            <Card title="⚽ Favor vs ❌ Contra per Jugador" icon={<Users className="w-4 h-4 text-[#E5C07B]" />} className="md:col-span-2 xl:col-span-2">
              <div className="space-y-4">
                {DATABASE.roster.map(p => p.name).map((name, i) => {
                  const gf = stats.goalsFor.find(([n])=>n===name)?.[1] ?? 0;
                  const ga = stats.goalsAgainst.find(([n])=>n===name)?.[1] ?? 0;
                  if (gf===0 && ga===0) return null;
                  const maxV = Math.max(gf, ga, 1);
                  const player = DATABASE.roster.find(p => p.name === name);
                  const [ref, inView] = [useRef(null), useState(false)]; // simplified inline
                  return (
                    <div key={name} className="flex items-center gap-3 group">
                      {player?.photo ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-[#E5C07B]/40 transition-colors shrink-0">
                          <img src={`${BASE}${player.photo}`} alt={name} className="w-full h-full object-cover object-top" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#C0392B]/15 border border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-[#E5C07B]/40">{name[0]}</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-400 group-hover:text-white transition-colors w-20 truncate shrink-0">{name}</span>
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-emerald-500/60 w-3">▲</span>
                          <div className="flex-1 h-2.5 bg-[#0d0d0d] rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500/70 rounded-full transition-all duration-700" style={{ width:`${(gf/maxV)*100}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-[#C0392B]/60 w-3">▼</span>
                          <div className="flex-1 h-2.5 bg-[#0d0d0d] rounded-full overflow-hidden">
                            <div className="h-full bg-[#C0392B]/70 rounded-full transition-all duration-700" style={{ width:`${(ga/maxV)*100}%` }} />
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-mono w-12 text-right shrink-0">
                        <span className="text-emerald-400">{gf}</span>
                        <span className="text-gray-600">/</span>
                        <span className="text-[#C0392B]">{ga}</span>
                      </div>
                    </div>
                  );
                }).filter(Boolean)}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── PARTITS ── */}
      {activeTab === 'partits' && (
        <div className="space-y-6">
          {/* Evolució */}
          <Card title="Evolució de la Temporada" icon={<TrendingUp className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="flex gap-4 items-end mt-2" style={{ height:'120px' }}>
              {matchHistory.map((m, idx) => {
                const max = Math.max(...matchHistory.flatMap(x=>[x.for,x.against]),1);
                const rs = getRS(m.for,m.against);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer card-hover"
                    onClick={()=>onSelectMatch(m.match)}>
                    <div className="flex gap-0.5 items-end w-full" style={{ height:'90px' }}>
                      <div className="flex-1 rounded-t-lg transition-all group-hover:brightness-125"
                        style={{ height:`${(m.for/max)*90}px`, background:'linear-gradient(to top,#1a6e3c,#27AE60)', minHeight:m.for>0?'4px':'0' }} />
                      <div className="flex-1 rounded-t-lg transition-all group-hover:brightness-125"
                        style={{ height:`${(m.against/max)*90}px`, background:'linear-gradient(to top,#7b1c12,#C0392B)', minHeight:m.against>0?'4px':'0' }} />
                    </div>
                    <div className={`text-xs font-black px-1.5 py-0.5 rounded-lg ${rs.bg}`}>{m.for}-{m.against}</div>
                    <div className="text-[10px] text-gray-600 group-hover:text-[#E5C07B] truncate w-full text-center transition-colors">{m.opponent}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-3 text-xs text-gray-600">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500/70 inline-block"/>A favor</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#C0392B]/70 inline-block"/>En contra</span>
            </div>
          </Card>

          {/* Cards dels partits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {DATABASE.matches.map((match, idx) => {
              const [f,a] = match.result.split('-').map(s=>parseInt(s.trim()));
              const rs = getRS(f,a);
              const hasSubs = match.events.substitutions?.length > 1;
              const [ref, inView] = useInView(0.1);
              return (
                <div ref={ref} key={match.id} onClick={()=>onSelectMatch(match)}
                  className={`group p-5 bg-gradient-to-br from-[#1E1E1E] to-[#191919] rounded-2xl border cursor-pointer card-hover
                    ${rs.border} transition-all duration-500 ${inView?'opacity-100 translate-y-0':'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay:`${idx*80}ms` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-xs text-[#E5C07B]/60 mb-1">{match.jornada}</div>
                      <div className="font-black text-white text-sm leading-tight">
                        <span className="text-[#C0392B]">Real Tiesada</span><br/>
                        <span className="text-gray-400 font-normal text-xs">vs </span>{match.opponent}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`font-black font-mono text-3xl ${rs.color}`}>{match.result}</span>
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full ${rs.bg}`}>{rs.label}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex gap-2">
                      {hasSubs && <span className="text-xs bg-[#E5C07B]/10 text-[#E5C07B]/60 px-2 py-0.5 rounded-full">⏱ minuts</span>}
                      {match.youtubeId && <span className="text-xs bg-red-600/10 text-red-400/60 px-2 py-0.5 rounded-full">▶ vídeo</span>}
                    </div>
                    <span className="text-xs text-gray-600 group-hover:text-[#E5C07B] transition-colors">{match.date} →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Taula */}
          <Card title="Taula de Resultats" icon={<PlayCircle className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-600 border-b border-white/5">
                    <th className="text-left pb-3">Jornada</th>
                    <th className="text-left pb-3">Rival</th>
                    <th className="text-center pb-3">Resultat</th>
                    <th className="text-center pb-3">R</th>
                    <th className="text-right pb-3">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {matchHistory.map((m,idx) => {
                    const rs = getRS(m.for,m.against);
                    return (
                      <tr key={idx} onClick={()=>onSelectMatch(m.match)}
                        className="border-b border-white/5 hover:bg-white/3 cursor-pointer transition-colors group">
                        <td className="py-3 text-gray-500 text-xs group-hover:text-white">{m.jornada}</td>
                        <td className="py-3 font-medium group-hover:text-white">{m.opponent}</td>
                        <td className="py-3 text-center font-black font-mono"><span className={rs.color}>{m.for}-{m.against}</span></td>
                        <td className="py-3 text-center"><span className={`text-xs font-black px-2 py-0.5 rounded-full ${rs.bg}`}>{rs.label}</span></td>
                        <td className="py-3 text-right text-xs text-gray-600">{m.match.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-t border-white/10 text-xs text-gray-600">
                  <tr>
                    <td colSpan={2} className="pt-3">Total temporada</td>
                    <td className="pt-3 text-center font-mono">
                      <span className="text-emerald-400">{matchHistory.reduce((a,m)=>a+m.for,0)}</span>
                      <span className="text-gray-600"> - </span>
                      <span className="text-[#C0392B]">{matchHistory.reduce((a,m)=>a+m.against,0)}</span>
                    </td>
                    <td colSpan={2} className="pt-3 text-right">
                      {matchHistory.filter(m=>m.for>m.against).length}V · {matchHistory.filter(m=>m.for===m.against).length}E · {matchHistory.filter(m=>m.for<m.against).length}D
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
