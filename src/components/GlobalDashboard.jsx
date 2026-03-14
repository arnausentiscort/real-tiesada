import React, { useMemo, useState, useEffect, useRef } from 'react';
import { PlayCircle, Trophy, Target, Shield, TrendingUp, Users } from 'lucide-react';
import { DATABASE } from '../data.js';
import { calcGlobalStats } from '../utils.js';

const BASE = import.meta.env.BASE_URL;

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

// ── Targeta jugador horitzontal — foto quadrada, no es talla ──────
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

      {/* Foto quadrada — objecte-cover centrat a la cara */}
      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#111]">
        {photoSrc ? (
          <img src={`${BASE}${photoSrc}`} alt={name}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 15%', transition: 'transform 0.4s', transform: hover ? 'scale(1.08)' : 'scale(1)' }}/>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#C0392B]/10">
            <span className="text-2xl font-black text-[#E5C07B]/20">{name[0]}</span>
          </div>
        )}
        <div className="absolute top-1 left-1 text-sm leading-none">{medals[rank] || ''}</div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-600 uppercase tracking-wider">{label}</p>
        <p className={`font-bold truncate text-sm ${isTop ? 'text-[#E5C07B]' : 'text-white'}`}>{name}</p>
        {player && <p className="text-[10px] text-gray-600">#{player.number} · {player.position}</p>}
      </div>

      {/* Valor */}
      <div className="flex flex-col items-center flex-shrink-0">
        <span className={`font-black font-mono ${isTop ? 'text-3xl text-[#E5C07B]' : 'text-xl text-white'}`}>{value}</span>
        <span className="text-base">{emoji}</span>
      </div>
    </div>
  );
}

// ── Barra stats ────────────────────────────────────────────────────
function StatRow({ name, value, max, color, delay = 0 }) {
  const [ref, inView] = useInView();
  const player = DATABASE.roster.find(p => p.name === name);
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div ref={ref} className="flex items-center gap-3 group"
      style={{ opacity: inView?1:0, transform: inView?'translateX(0)':'translateX(-12px)',
        transition: `opacity 0.5s ${delay}ms, transform 0.5s ${delay}ms` }}>
      {player?.photo ? (
        <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10 shrink-0">
          <img src={`${BASE}${player.photo}`} alt={name}
            className="w-full h-full object-cover" style={{ objectPosition:'center 15%' }}/>
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-[#C0392B]/15 border border-white/10 flex items-center justify-center shrink-0">
          <span className="text-[10px] font-black text-[#E5C07B]/40">{name[0]}</span>
        </div>
      )}
      <span className="text-xs text-gray-400 truncate w-20 shrink-0">{name.split(' ')[0]}</span>
      <div className="flex-1 h-5 bg-[#0d0d0d] rounded-lg overflow-hidden border border-white/5">
        <div className="h-full rounded-lg bar-shimmer"
          style={{ width: inView?`${Math.max(pct, value>0?4:0)}%`:'0%', background: color,
            transition: `width 0.9s ${delay+100}ms cubic-bezier(0.16,1,0.3,1)` }}/>
      </div>
      <span className="w-6 text-xs font-black text-right shrink-0" style={{ color }}>{value}</span>
    </div>
  );
}

function Card({ title, icon, children, className = '' }) {
  const [ref, inView] = useInView(0.05);
  return (
    <div ref={ref} className={`bg-[#1E1E1E] rounded-2xl p-4 border border-white/5 ${className}`}
      style={{ opacity: inView?1:0, transform: inView?'translateY(0)':'translateY(16px)',
        transition: 'opacity 0.4s, transform 0.4s' }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-[#E5C07B]/10 rounded-lg flex items-center justify-center shrink-0">{icon}</div>
        <h3 className="text-sm font-bold text-[#E5C07B]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function MatchCard({ match, idx, onSelectMatch, getRS }) {
  const [ref, inView] = useInView(0.05);
  const [f, a] = match.result.split('-').map(s => parseInt(s.trim()));
  const rs = getRS(f, a);
  return (
    <div ref={ref} onClick={() => onSelectMatch(match)}
      className={`group p-4 bg-[#1E1E1E] rounded-xl border cursor-pointer hover:-translate-y-1
        hover:shadow-lg hover:border-[#E5C07B]/25 transition-all ${rs.border}`}
      style={{ opacity: inView?1:0, transform: inView?'translateY(0)':'translateY(20px)',
        transition: `opacity 0.4s ${idx*60}ms, transform 0.4s ${idx*60}ms` }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-[10px] text-[#E5C07B]/50">{match.jornada} · {match.date}</p>
          <p className="font-bold text-white text-sm">{match.opponent}</p>
        </div>
        <div className="text-right">
          <p className={`font-black font-mono text-2xl ${rs.color}`}>{match.result}</p>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${rs.bg}`}>{rs.label}</span>
        </div>
      </div>
      <div className="flex gap-2 pt-2 border-t border-white/5">
        {match.youtubeId && <span className="text-[10px] bg-red-600/10 text-red-400/60 px-2 py-0.5 rounded-full">▶ YouTube</span>}
        {match.vimeoId   && <span className="text-[10px] bg-blue-600/10 text-blue-400/60 px-2 py-0.5 rounded-full">▶ Vimeo</span>}
        <span className="ml-auto text-[10px] text-gray-600 group-hover:text-[#E5C07B] transition-colors">Detall →</span>
      </div>
    </div>
  );
}

export default function GlobalDashboard({ onSelectMatch }) {
  const stats = useMemo(() => calcGlobalStats(DATABASE), []);
  const [activeTab, setActiveTab] = useState('resum');

  const maxGF = Math.max(...stats.goalsFor.map(([,v]) => v), 1);
  const maxGA = Math.max(...stats.goalsAgainst.map(([,v]) => v), 1);
  const matchHistory = DATABASE.matches.map(m => {
    const [f, a] = m.result.split('-').map(s => parseInt(s.trim()));
    return { jornada: m.jornada, opponent: m.opponent, for: f, against: a, match: m };
  });
  const getRS = (f, a) => {
    if (f > a) return { label:'V', bg:'bg-emerald-500/20 text-emerald-400', border:'border-emerald-500/20', color:'text-emerald-400' };
    if (f < a) return { label:'D', bg:'bg-[#C0392B]/20 text-[#C0392B]',    border:'border-[#C0392B]/20',   color:'text-[#C0392B]'  };
    return           { label:'E', bg:'bg-yellow-500/20 text-yellow-400',    border:'border-yellow-500/20',  color:'text-yellow-400' };
  };

  // Resum xifres clau
  const totalGF = matchHistory.reduce((a,m) => a+m.for, 0);
  const totalGA = matchHistory.reduce((a,m) => a+m.against, 0);
  const wins    = matchHistory.filter(m => m.for > m.against).length;
  const losses  = matchHistory.filter(m => m.for < m.against).length;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── HERO compacte amb xifres clau ── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#1a1a1a] border border-[#E5C07B]/15 p-5">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] text-[#E5C07B]/50 uppercase tracking-widest mb-1">Actual · Futbol Sala</p>
            <h2 className="text-2xl font-black text-white">Estadístiques</h2>
          </div>
          {/* Xifres clau en una línia */}
          <div className="flex gap-4 flex-wrap">
            {[
              { v: DATABASE.matches.length, l: 'Partits' },
              { v: `${wins}W-${losses}L`, l: 'Balanç' },
              { v: totalGF, l: 'Gols favor', c: 'text-emerald-400' },
              { v: totalGA, l: 'Gols contra', c: 'text-[#C0392B]' },
              { v: totalGF - totalGA, l: 'Diferència', c: (totalGF-totalGA) >= 0 ? 'text-emerald-400' : 'text-[#C0392B]' },
            ].map(({ v, l, c }) => (
              <div key={l} className="text-center">
                <p className={`text-2xl font-black font-mono ${c || 'text-[#E5C07B]'}`}>{v}</p>
                <p className="text-[10px] text-gray-600 uppercase tracking-wider">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5 w-fit">
        {[{id:'resum',label:'📊 Resum'},{id:'partits',label:'🏟 Partits'}].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
              ${activeTab===t.id ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── RESUM ── */}
      {activeTab === 'resum' && (
        <div className="space-y-6">

          {/* 1. Golejadors + Assists — targetes grans amb foto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stats.topScorers.length > 0 && (
              <section>
                <h3 className="text-base font-black text-white mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#E5C07B]"/> Golejadors
                </h3>
                <div className="space-y-2">
                  {stats.topScorers.map(([name, count], idx) => (
                    <PlayerCard key={name} rank={idx} name={name} value={count} emoji="⚽" label="Gols"/>
                  ))}
                </div>
              </section>
            )}
            {stats.topAssists.length > 0 && (
              <section>
                <h3 className="text-base font-black text-white mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#E5C07B]"/> Assistències
                </h3>
                <div className="space-y-2">
                  {stats.topAssists.map(([name, count], idx) => (
                    <PlayerCard key={name} rank={idx} name={name} value={count} emoji="👟" label="Assists"/>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* 2. Barres: totes iguals, gols favor/contra destacats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Gols a Favor — destacat verd */}
            <Card title="⚽ Gols a Favor per Jugador" icon={<TrendingUp className="w-4 h-4 text-[#E5C07B]"/>}
              className="border-emerald-500/15">
              <div className="space-y-3">
                {stats.goalsFor.filter(([,v]) => v>0).map(([name, count], i) => (
                  <StatRow key={name} name={name} value={count} max={maxGF} color="#27AE60" delay={i*60}/>
                ))}
              </div>
            </Card>

            {/* Gols en Contra — destacat vermell */}
            <Card title="❌ Gols en Contra per Jugador" icon={<Shield className="w-4 h-4 text-[#E5C07B]"/>}
              className="border-[#C0392B]/15">
              <div className="space-y-3">
                {stats.goalsAgainst.filter(([,v]) => v>0).map(([name, count], i) => (
                  <StatRow key={name} name={name} value={count} max={maxGA} color="#C0392B" delay={i*60}/>
                ))}
              </div>
            </Card>

            {/* Favor vs Contra — comparativa */}
            <Card title="Favor vs Contra per Jugador" icon={<Users className="w-4 h-4 text-[#E5C07B]"/>}
              className="md:col-span-2">
              <div className="space-y-3">
                {DATABASE.roster.map(p => p.name).map(name => {
                  const gf = stats.goalsFor.find(([n]) => n===name)?.[1] ?? 0;
                  const ga = stats.goalsAgainst.find(([n]) => n===name)?.[1] ?? 0;
                  if (gf===0 && ga===0) return null;
                  const maxV = Math.max(gf, ga, 1);
                  const player = DATABASE.roster.find(p => p.name===name);
                  return (
                    <div key={name} className="flex items-center gap-2 group">
                      {player?.photo ? (
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10 shrink-0">
                          <img src={`${BASE}${player.photo}`} alt={name}
                            className="w-full h-full object-cover" style={{objectPosition:'center 15%'}}/>
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#C0392B]/15 border border-white/10 flex items-center justify-center shrink-0">
                          <span className="text-[9px] font-bold text-[#E5C07B]/40">{name[0]}</span>
                        </div>
                      )}
                      <span className="text-xs text-gray-400 w-16 truncate shrink-0">{name.split(' ')[0]}</span>
                      <div className="flex-1 flex flex-col gap-0.5">
                        <div className="h-2.5 bg-[#0d0d0d] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500/70 rounded-full transition-all duration-700"
                            style={{width:`${(gf/maxV)*100}%`}}/>
                        </div>
                        <div className="h-2.5 bg-[#0d0d0d] rounded-full overflow-hidden">
                          <div className="h-full bg-[#C0392B]/70 rounded-full transition-all duration-700"
                            style={{width:`${(ga/maxV)*100}%`}}/>
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
            </Card>

            {/* Targetes grogues */}
            {stats.yellowCards.length > 0 && (
              <Card title="Targetes Grogues" icon={<span className="text-sm">🟨</span>}>
                {stats.yellowCards.map(([name, count]) => {
                  const player = DATABASE.roster.find(p => p.name === name);
                  return (
                    <div key={name} className="flex items-center gap-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-3 mb-2">
                      {player?.photo && (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-yellow-500/20 shrink-0">
                          <img src={`${BASE}${player.photo}`} alt={name}
                            className="w-full h-full object-cover" style={{objectPosition:'center 15%'}}/>
                        </div>
                      )}
                      <span className="flex-1 text-sm font-bold text-yellow-200">{name}</span>
                      <span className="text-2xl font-black text-yellow-400">{count} 🟨</span>
                    </div>
                  );
                })}
              </Card>
            )}
          </div>

          {/* 3. Stats de porter — al final */}
          <div>
            <h3 className="text-base font-black text-white mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#E5C07B]"/> Estadístiques de Porter
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.goalsConceded.length > 0 && (
                <Card title="Gols Encaixats" icon={<span className="text-sm">🥅</span>}
                  className="border-[#C0392B]/15">
                  <div className="space-y-3">
                    {stats.goalsConceded.map(([name, count], i) => (
                      <StatRow key={name} name={name} value={count}
                        max={Math.max(...stats.goalsConceded.map(([,v]) => v), 1)}
                        color="#C0392B" delay={i*60}/>
                    ))}
                  </div>
                </Card>
              )}
              {stats.saves.length > 0 && (
                <Card title="Aturades" icon={<span className="text-sm">🧤</span>}
                  className="border-blue-500/15">
                  <div className="space-y-3">
                    {stats.saves.map(([name, count], i) => (
                      <StatRow key={name} name={name} value={count}
                        max={Math.max(...stats.saves.map(([,v]) => v), 1)}
                        color="#61AFEF" delay={i*60}/>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ── PARTITS ── */}
      {activeTab === 'partits' && (
        <div className="space-y-5">
          <Card title="Evolució de la Temporada" icon={<TrendingUp className="w-4 h-4 text-[#E5C07B]"/>}>
            <div className="flex gap-4 items-end" style={{ height:'110px' }}>
              {matchHistory.map((m, idx) => {
                const max = Math.max(...matchHistory.flatMap(x => [x.for, x.against]), 1);
                const rs  = getRS(m.for, m.against);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                    onClick={() => onSelectMatch(m.match)}>
                    <div className="flex gap-0.5 items-end w-full" style={{ height:'80px' }}>
                      <div className="flex-1 rounded-t-sm group-hover:brightness-125 transition-all"
                        style={{ height:`${(m.for/max)*80}px`, background:'#27AE60', minHeight:m.for>0?'3px':'0' }}/>
                      <div className="flex-1 rounded-t-sm group-hover:brightness-125 transition-all"
                        style={{ height:`${(m.against/max)*80}px`, background:'#C0392B', minHeight:m.against>0?'3px':'0' }}/>
                    </div>
                    <div className={`text-[10px] font-black px-1 py-0.5 rounded ${rs.bg}`}>{m.for}-{m.against}</div>
                    <div className="text-[9px] text-gray-600 group-hover:text-[#E5C07B] truncate w-full text-center">{m.opponent}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {DATABASE.matches.map((match, idx) => (
              <MatchCard key={match.id} match={match} idx={idx} onSelectMatch={onSelectMatch} getRS={getRS}/>
            ))}
          </div>

          <Card title="Taula de Resultats" icon={<PlayCircle className="w-4 h-4 text-[#E5C07B]"/>}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] text-gray-600 border-b border-white/5">
                    <th className="text-left pb-3">Jornada</th>
                    <th className="text-left pb-3">Rival</th>
                    <th className="text-center pb-3">Resultat</th>
                    <th className="text-center pb-3">R</th>
                    <th className="text-right pb-3">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {matchHistory.map((m, idx) => {
                    const rs = getRS(m.for, m.against);
                    return (
                      <tr key={idx} onClick={() => onSelectMatch(m.match)}
                        className="border-b border-white/5 hover:bg-white/3 cursor-pointer transition-colors">
                        <td className="py-2.5 text-gray-500 text-xs">{m.jornada}</td>
                        <td className="py-2.5 font-medium text-sm">{m.opponent}</td>
                        <td className="py-2.5 text-center font-black font-mono"><span className={rs.color}>{m.for}-{m.against}</span></td>
                        <td className="py-2.5 text-center"><span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${rs.bg}`}>{rs.label}</span></td>
                        <td className="py-2.5 text-right text-xs text-gray-600">{m.match.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-t border-white/10 text-xs text-gray-600">
                  <tr>
                    <td colSpan={2} className="pt-3">Total</td>
                    <td className="pt-3 text-center font-mono">
                      <span className="text-emerald-400">{totalGF}</span>
                      <span className="text-gray-600"> - </span>
                      <span className="text-[#C0392B]">{totalGA}</span>
                    </td>
                    <td colSpan={2} className="pt-3 text-right">
                      {wins}V · {matchHistory.filter(m=>m.for===m.against).length}E · {losses}D
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
