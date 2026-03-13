import React, { useMemo, useState } from 'react';
import { PlayCircle, Trophy, Target, Shield, TrendingUp, Users } from 'lucide-react';
import { DATABASE } from '../data.js';
import { calcGlobalStats } from '../utils.js';

const BASE = import.meta.env.BASE_URL;

function StatBar({ label, value, max, color = '#C0392B', suffix = '', photo = null }) {
  const width = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3 group">
      {photo ? (
        <div className="w-7 h-7 rounded-full overflow-hidden bg-[#1a1a1a] border border-white/10 shrink-0">
          <img src={`${BASE}${photo}`} alt={label} className="w-full h-full object-cover object-top" />
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-[#C0392B]/15 border border-white/10 flex items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-[#E5C07B]/40">{label[0]}</span>
        </div>
      )}
      <span className="text-xs text-gray-400 group-hover:text-white transition-colors truncate w-20 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-5 bg-[#0d0d0d] rounded overflow-hidden border border-white/5">
        <div className="h-full rounded transition-all duration-700"
          style={{ width: `${Math.max(width, value > 0 ? 4 : 0)}%`, background: color }} />
      </div>
      <span className="w-8 text-xs font-mono text-right shrink-0" style={{ color }}>
        {value}{suffix}
      </span>
    </div>
  );
}

function Card({ title, icon, children, className = '' }) {
  return (
    <div className={`bg-[#1E1E1E] rounded-xl p-5 border border-white/5 shadow-xl ${className}`}>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 bg-[#E5C07B]/10 rounded-lg flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h3 className="text-base font-bold text-[#E5C07B]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function RankList({ items, emoji }) {
  if (!items.length) return <p className="text-gray-600 italic text-sm">Sense dades</p>;
  return (
    <div className="space-y-2">
      {items.map(([name, count], idx) => {
        const player = DATABASE.roster.find(p => p.name === name);
        return (
          <div key={name} className="flex items-center gap-2 py-1.5 border-b border-white/5 last:border-0">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0
              ${idx === 0 ? 'bg-[#E5C07B] text-black' : 'bg-white/5 text-gray-500'}`}>
              {idx + 1}
            </span>
            {player?.photo && (
              <div className="w-6 h-6 rounded-full overflow-hidden bg-[#1a1a1a] shrink-0">
                <img src={`${BASE}${player.photo}`} alt={name} className="w-full h-full object-cover object-top" />
              </div>
            )}
            <span className="text-sm flex-1 truncate">{name}</span>
            <span className="text-xs font-bold bg-[#E5C07B]/10 text-[#E5C07B] px-2 py-0.5 rounded-full">
              {count} {emoji}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function GlobalDashboard({ onSelectMatch }) {
  const stats = useMemo(() => calcGlobalStats(DATABASE), []);
  const [activeTab, setActiveTab] = useState('resum');

  const maxGoalsFor     = Math.max(...stats.goalsFor.map(([,v]) => v), 1);
  const maxGoalsAgainst = Math.max(...stats.goalsAgainst.map(([,v]) => v), 1);

  const matchHistory = DATABASE.matches.map(m => {
    const [home, away] = m.result.split('-').map(s => parseInt(s.trim()));
    return { jornada: m.jornada, opponent: m.opponent, for: home, against: away, match: m };
  });

  const getRS = (f, a) => {
    if (f > a) return { label: 'V', bg: 'bg-emerald-500/20 text-emerald-400', border: 'border-emerald-500/30', color: 'text-emerald-400' };
    if (f < a) return { label: 'D', bg: 'bg-[#C0392B]/20 text-[#C0392B]',    border: 'border-[#C0392B]/30',   color: 'text-[#C0392B]'   };
    return           { label: 'E', bg: 'bg-yellow-500/20 text-yellow-400',    border: 'border-yellow-500/30',  color: 'text-yellow-400'  };
  };

  const tabs = [
    { id: 'resum',   label: '📊 Resum' },
    { id: 'partits', label: '🏟 Partits' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-3xl font-bold text-white mb-1">Resum de la Temporada</h2>
        <p className="text-gray-500 text-sm">{DATABASE.matches.length} partits jugats · 25/26</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5 w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === t.id ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── RESUM ── */}
      {activeTab === 'resum' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* Golejadors */}
          <Card title="Golejadors" icon={<Target className="w-4 h-4 text-[#E5C07B]" />}>
            <RankList items={stats.topScorers} emoji="⚽" />
          </Card>

          {/* Assistències */}
          <Card title="Assistències" icon={<Trophy className="w-4 h-4 text-[#E5C07B]" />}>
            <RankList items={stats.topAssists} emoji="👟" />
          </Card>

          {/* Targetes grogues */}
          <Card title="Targetes Grogues" icon={<span className="text-sm">🟨</span>}>
            {stats.yellowCards.length > 0 ? (
              <div className="flex gap-3 flex-wrap">
                {stats.yellowCards.map(([name, count]) => {
                  const player = DATABASE.roster.find(p => p.name === name);
                  return (
                    <div key={name} className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
                      {player?.photo && (
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-[#1a1a1a]">
                          <img src={`${BASE}${player.photo}`} alt={name} className="w-full h-full object-cover object-top" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-yellow-300">{name}</span>
                      <span className="text-xs font-black text-yellow-400">{count}x 🟨</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600 italic text-sm">Cap targeta encara 🎉</p>
            )}
          </Card>

          {/* Gols encaixats de porter */}
          <Card title="Gols Encaixats (Porter)" icon={<Shield className="w-4 h-4 text-[#E5C07B]" />}>
            {stats.goalsConceded.length > 0 ? (
              <div className="space-y-2.5">
                {stats.goalsConceded.map(([name, count]) => (
                  <StatBar key={name} label={name} value={count}
                    max={Math.max(...stats.goalsConceded.map(([,v])=>v),1)}
                    color="#C0392B"
                    photo={DATABASE.roster.find(p => p.name === name)?.photo} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 italic text-sm">Sense dades</p>
            )}
          </Card>

          {/* Gols marcats al camp */}
          <Card title="Gols a Favor al Camp" icon={<TrendingUp className="w-4 h-4 text-[#E5C07B]" />}>
            <p className="text-xs text-gray-600 mb-3">Gols a favor marcats mentre estaves a la pista</p>
            <div className="space-y-2">
              {stats.goalsFor.filter(([,v]) => v > 0).map(([name, count]) => (
                <StatBar key={name} label={name} value={count} max={maxGoalsFor}
                  color="#27AE60"
                  photo={DATABASE.roster.find(p => p.name === name)?.photo} />
              ))}
            </div>
          </Card>

          {/* Gols encaixats al camp */}
          <Card title="Gols en Contra al Camp" icon={<Shield className="w-4 h-4 text-[#E5C07B]" />}>
            <p className="text-xs text-gray-600 mb-3">Gols en contra encaixats mentre estaves a la pista</p>
            <div className="space-y-2">
              {stats.goalsAgainst.filter(([,v]) => v > 0).map(([name, count]) => (
                <StatBar key={name} label={name} value={count} max={maxGoalsAgainst}
                  color="#C0392B"
                  photo={DATABASE.roster.find(p => p.name === name)?.photo} />
              ))}
            </div>
          </Card>

          {/* Comparativa al camp */}
          <Card title="⚽ Favor vs ❌ Contra per Jugador" icon={<Users className="w-4 h-4 text-[#E5C07B]" />} className="md:col-span-2 xl:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-3">
              {DATABASE.roster.map(p => p.name).map(name => {
                const gf = stats.goalsFor.find(([n]) => n === name)?.[1] ?? 0;
                const ga = stats.goalsAgainst.find(([n]) => n === name)?.[1] ?? 0;
                if (gf === 0 && ga === 0) return null;
                const maxV = Math.max(gf, ga, 1);
                const player = DATABASE.roster.find(p => p.name === name);
                return (
                  <div key={name} className="flex items-center gap-2">
                    {player?.photo ? (
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-[#1a1a1a] shrink-0">
                        <img src={`${BASE}${player.photo}`} alt={name} className="w-full h-full object-cover object-top" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#C0392B]/15 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-bold text-[#E5C07B]/40">{name[0]}</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-400 w-20 truncate shrink-0">{name}</span>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <div className="h-2 bg-[#0d0d0d] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500/70 rounded-full" style={{ width: `${(gf/maxV)*100}%` }} />
                      </div>
                      <div className="h-2 bg-[#0d0d0d] rounded-full overflow-hidden">
                        <div className="h-full bg-[#C0392B]/70 rounded-full" style={{ width: `${(ga/maxV)*100}%` }} />
                      </div>
                    </div>
                    <div className="text-xs font-mono w-10 text-right shrink-0">
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
      )}

      {/* ── PARTITS ── */}
      {activeTab === 'partits' && (
        <div className="space-y-5">
          {/* Gràfic evolució */}
          <Card title="Evolució de la Temporada" icon={<TrendingUp className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="flex gap-4 items-end h-32 mt-2">
              {matchHistory.map((m, idx) => {
                const max = Math.max(...matchHistory.flatMap(x => [x.for, x.against]), 1);
                const rs = getRS(m.for, m.against);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                    onClick={() => onSelectMatch(m.match)}>
                    <div className="flex gap-0.5 items-end w-full" style={{ height: '90px' }}>
                      <div className="flex-1 rounded-t transition-all group-hover:brightness-125"
                        style={{ height: `${(m.for/max)*90}px`, background: '#27AE60', minHeight: m.for > 0 ? '4px' : '0' }} />
                      <div className="flex-1 rounded-t transition-all group-hover:brightness-125"
                        style={{ height: `${(m.against/max)*90}px`, background: '#C0392B', minHeight: m.against > 0 ? '4px' : '0' }} />
                    </div>
                    <div className={`text-xs font-black px-1.5 py-0.5 rounded ${rs.bg}`}>{m.for}-{m.against}</div>
                    <div className="text-xs text-gray-600 group-hover:text-[#E5C07B] transition-colors truncate w-full text-center">
                      {m.opponent}
                    </div>
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
            {DATABASE.matches.map(match => {
              const [f, a] = match.result.split('-').map(s => parseInt(s.trim()));
              const rs = getRS(f, a);
              const hasSubs = match.events.substitutions?.length > 1;
              return (
                <div key={match.id} onClick={() => onSelectMatch(match)}
                  className={`group p-4 bg-[#1E1E1E] rounded-xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl ${rs.border} hover:border-[#E5C07B]/40`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#E5C07B]/70">{match.jornada}</span>
                    <div className="flex items-center gap-1.5">
                      {hasSubs && <span className="text-xs bg-[#E5C07B]/10 text-[#E5C07B]/60 px-1.5 rounded">⏱ minuts</span>}
                      {match.youtubeId && <span className="text-xs bg-red-600/10 text-red-400/60 px-1.5 rounded">▶ vídeo</span>}
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full ${rs.bg}`}>{rs.label}</span>
                    </div>
                  </div>
                  <div className="font-bold text-sm text-white mb-1">
                    <span className="text-[#C0392B]">Real Tiesada</span> vs {match.opponent}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`font-black font-mono text-2xl ${rs.color}`}>{match.result}</span>
                    <span className="text-xs text-gray-600 group-hover:text-[#E5C07B] transition-colors">{match.date} →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Taula resum */}
          <Card title="Taula de Resultats" icon={<PlayCircle className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-600 border-b border-white/5">
                    <th className="text-left pb-2">Jornada</th>
                    <th className="text-left pb-2">Rival</th>
                    <th className="text-center pb-2">Resultat</th>
                    <th className="text-center pb-2">R</th>
                    <th className="text-right pb-2">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {matchHistory.map((m, idx) => {
                    const rs = getRS(m.for, m.against);
                    return (
                      <tr key={idx} onClick={() => onSelectMatch(m.match)}
                        className="border-b border-white/5 hover:bg-white/3 cursor-pointer transition-colors group">
                        <td className="py-2.5 text-gray-400 text-xs group-hover:text-white">{m.jornada}</td>
                        <td className="py-2.5 font-medium group-hover:text-white">{m.opponent}</td>
                        <td className="py-2.5 text-center font-black font-mono">
                          <span className={rs.color}>{m.for}-{m.against}</span>
                        </td>
                        <td className="py-2.5 text-center">
                          <span className={`text-xs font-black px-2 py-0.5 rounded-full ${rs.bg}`}>{rs.label}</span>
                        </td>
                        <td className="py-2.5 text-right text-xs text-gray-600">{m.match.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-t border-white/10 text-xs text-gray-600">
                  <tr>
                    <td colSpan={2} className="pt-2">Total</td>
                    <td className="pt-2 text-center font-mono">
                      <span className="text-emerald-400">{matchHistory.reduce((a,m)=>a+m.for,0)}</span>
                      <span className="text-gray-600"> - </span>
                      <span className="text-[#C0392B]">{matchHistory.reduce((a,m)=>a+m.against,0)}</span>
                    </td>
                    <td colSpan={2} className="pt-2 text-right">
                      {matchHistory.filter(m=>m.for>m.against).length}V·{matchHistory.filter(m=>m.for===m.against).length}E·{matchHistory.filter(m=>m.for<m.against).length}D
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
