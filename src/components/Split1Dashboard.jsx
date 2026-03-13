import React, { useState, useMemo } from 'react';
import { ChevronLeft, Trophy, Target, Star, TrendingUp, Users, Shield } from 'lucide-react';
import { DATABASE_S1 } from '../data_s1.js';

const BASE = import.meta.env.BASE_URL;

function calcTotals() {
  const totals = {};
  DATABASE_S1.roster.forEach(p => {
    totals[p.name] = { gols:0, assists:0, jugadesBones:0, cagades:0, golsEncaixats:0, parades:0, pts:0, partits:0, mvpWins:0, mvpVotes:0 };
  });
  DATABASE_S1.matches.forEach(match => {
    Object.entries(match.playerStats).forEach(([name, s]) => {
      if (!totals[name]) return;
      totals[name].gols          += s.gols;
      totals[name].assists       += s.assists;
      totals[name].jugadesBones  += s.jugadesBones;
      totals[name].cagades       += s.cagades;
      totals[name].golsEncaixats += s.golsEncaixats;
      totals[name].parades       += s.parades;
      totals[name].pts           += s.pts;
      if (s.pts !== 0 || s.jugadesBones > 0 || s.gols > 0) totals[name].partits++;
    });
    if (match.mvpWinner) totals[match.mvpWinner].mvpWins++;
    Object.entries(match.mvpVotes || {}).forEach(([name, v]) => {
      if (totals[name]) totals[name].mvpVotes += v;
    });
  });
  return totals;
}

function StatBar({ label, value, max, color = '#C0392B', photo }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3 group">
      {photo ? (
        <div className="w-7 h-7 rounded-full overflow-hidden bg-[#1a1a1a] border border-white/10 shrink-0">
          <img src={`${BASE}${photo}`} alt={label} className="w-full h-full object-cover object-top" />
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-[#C0392B]/15 border border-white/10 flex items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-[#E5C07B]/50">{label[0]}</span>
        </div>
      )}
      <span className="w-16 text-xs text-gray-400 group-hover:text-white transition-colors truncate shrink-0">{label}</span>
      <div className="flex-1 h-5 bg-[#0d0d0d] rounded overflow-hidden border border-white/5">
        <div className="h-full rounded transition-all duration-700"
          style={{ width: `${Math.max(pct, value !== 0 ? 3 : 0)}%`, background: color }} />
      </div>
      <span className="w-8 text-xs font-mono text-right shrink-0" style={{ color }}>{value}</span>
    </div>
  );
}

function Card({ title, icon, children, className = '' }) {
  return (
    <div className={`bg-[#1E1E1E] rounded-xl p-5 border border-white/5 shadow-xl ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-[#E5C07B]/10 rounded-lg flex items-center justify-center shrink-0">{icon}</div>
        <h3 className="text-base font-bold text-[#E5C07B]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ── Detall d'un Partit ────────────────────────────────────────────
function MatchDetail({ match, onBack }) {
  const sortedPlayers = Object.entries(match.playerStats)
    .sort((a, b) => b[1].pts - a[1].pts);

  const getRS = (r) => {
    const [f, a] = r.split('-').map(Number);
    if (f > a) return { color: 'text-emerald-400', border: 'border-emerald-500/30' };
    if (f < a) return { color: 'text-[#C0392B]',   border: 'border-[#C0392B]/30'   };
    return           { color: 'text-yellow-400',    border: 'border-yellow-500/30'  };
  };
  const rs = getRS(match.result);

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-[#E5C07B] transition-colors text-sm">
        <ChevronLeft className="w-4 h-4" /> Tornar
      </button>

      {/* Capçalera */}
      <div className={`bg-[#1E1E1E] rounded-xl p-6 border ${rs.border}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-[#E5C07B] text-sm mb-1">{match.jornada} · {match.date}</div>
            <h2 className="text-2xl font-black text-white">
              <span className="text-[#C0392B]">Real Tiesada</span>
              <span className="mx-3 text-gray-600 font-light">vs</span>
              {match.opponent}
            </h2>
          </div>
          <div className={`text-4xl font-black font-mono bg-[#121212] px-5 py-3 rounded-xl border border-white/5 ${rs.color}`}>
            {match.result}
          </div>
        </div>
        {match.mvpWinner && (
          <div className="mt-4 inline-flex items-center gap-2 bg-[#E5C07B]/10 border border-[#E5C07B]/20 rounded-lg px-4 py-2">
            <span>👑</span>
            <span className="text-sm text-[#E5C07B] font-bold">MVP: {match.mvpWinner}</span>
          </div>
        )}
      </div>

      {/* Taula stats */}
      <Card title="Stats Individuals" icon={<Users className="w-4 h-4 text-[#E5C07B]" />}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-600 border-b border-white/5">
                <th className="text-left pb-2 pr-3">Jugador</th>
                <th className="text-center pb-2 px-2" title="Gols">⚽</th>
                <th className="text-center pb-2 px-2" title="Assistències">👟</th>
                <th className="text-center pb-2 px-2" title="Jugades Bones">✅</th>
                <th className="text-center pb-2 px-2" title="Cagades">❌</th>
                <th className="text-center pb-2 px-2" title="Gols Encaixats">🥅</th>
                <th className="text-center pb-2 px-2" title="Parades">🧤</th>
                <th className="text-center pb-2 px-2 text-[#E5C07B]" title="Punts MVP">⭐ Pts</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map(([name, s]) => {
                const isMvp = match.mvpWinner === name;
                const played = s.pts !== 0 || s.jugadesBones > 0 || s.gols > 0;
                const player = DATABASE_S1.roster.find(p => p.name === name);
                return (
                  <tr key={name}
                    className={`border-b border-white/5 last:border-0 transition-colors
                      ${isMvp ? 'bg-[#E5C07B]/5' : ''} ${!played ? 'opacity-25' : ''}`}>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        {player?.photo ? (
                          <div className="w-6 h-6 rounded-full overflow-hidden bg-[#1a1a1a] shrink-0">
                            <img src={`${BASE}${player.photo}`} alt={name} className="w-full h-full object-cover object-top" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-[#C0392B]/15 border border-white/10 flex items-center justify-center shrink-0">
                            <span className="text-[9px] font-bold text-[#E5C07B]/50">{name[0]}</span>
                          </div>
                        )}
                        <span className={`font-medium ${isMvp ? 'text-[#E5C07B]' : 'text-white'}`}>
                          {name} {isMvp ? '👑' : ''}
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-2 text-emerald-400 font-bold">{s.gols || '—'}</td>
                    <td className="text-center py-2 text-blue-400">{s.assists || '—'}</td>
                    <td className="text-center py-2 text-[#E5C07B]">{s.jugadesBones || '—'}</td>
                    <td className="text-center py-2 text-[#C0392B]">{s.cagades || '—'}</td>
                    <td className="text-center py-2 text-red-400">{s.golsEncaixats || '—'}</td>
                    <td className="text-center py-2 text-purple-400">{s.parades || '—'}</td>
                    <td className={`text-center py-2 font-black ${s.pts > 0 ? 'text-[#E5C07B]' : s.pts < 0 ? 'text-[#C0392B]' : 'text-gray-600'}`}>
                      {s.pts > 0 ? `+${s.pts}` : s.pts || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Votació MVP */}
      <Card title="Votació MVP" icon={<Star className="w-4 h-4 text-[#E5C07B]" />}>
        <div className="space-y-2">
          {Object.entries(match.mvpVotes || {})
            .sort((a,b) => b[1] - a[1])
            .filter(([,v]) => v > 0)
            .map(([name, votes], idx) => (
              <div key={name} className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0
                  ${idx === 0 ? 'bg-[#E5C07B] text-black' : 'bg-white/5 text-gray-500'}`}>{idx+1}</span>
                <span className="flex-1 text-sm">{name}</span>
                <div className="flex gap-0.5">
                  {Array.from({length: votes}).map((_,i) => <span key={i} className="text-[#E5C07B] text-sm">★</span>)}
                </div>
                <span className="text-xs text-gray-500 w-12 text-right">{votes} vots</span>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}

// ── Dashboard Principal Split 1 ───────────────────────────────────
export default function Split1Dashboard() {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [activeTab, setActiveTab] = useState('resum');
  const totals = useMemo(() => calcTotals(), []);

  if (selectedMatch) return <MatchDetail match={selectedMatch} onBack={() => setSelectedMatch(null)} />;

  const roster = DATABASE_S1.roster;
  const getPhoto = (name) => roster.find(p => p.name === name)?.photo;
  const sorted = (key) => Object.entries(totals).filter(([,s]) => s.partits > 0).sort((a,b) => b[1][key]-a[1][key]);
  const maxOf  = (key) => Math.max(...Object.values(totals).map(s => s[key]), 1);

  const getRS = (r) => {
    const [f, a] = r.split('-').map(Number);
    if (f > a) return { label:'V', bg:'bg-emerald-500/20 text-emerald-400', border:'border-emerald-500/30', color:'text-emerald-400' };
    if (f < a) return { label:'D', bg:'bg-[#C0392B]/20 text-[#C0392B]',    border:'border-[#C0392B]/30',   color:'text-[#C0392B]'  };
    return           { label:'E', bg:'bg-yellow-500/20 text-yellow-400',    border:'border-yellow-500/30',  color:'text-yellow-400' };
  };

  const tabs = [
    { id: 'resum',   label: '📊 Resum' },
    { id: 'mvp',     label: '👑 MVP' },
    { id: 'partits', label: '🏟 Partits' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-3xl font-bold text-white">Temporada 2024-25</h2>
          <span className="text-xs bg-[#C0392B]/20 text-[#C0392B] border border-[#C0392B]/30 px-2 py-1 rounded-full font-bold">
            ⚽ Futbol 8
          </span>
        </div>
        <p className="text-gray-500 text-sm">{DATABASE_S1.matches.length} partits · Split anterior</p>
      </header>

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
          <Card title="Golejadors" icon={<Target className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="space-y-2">
              {sorted('gols').filter(([,s]) => s.gols > 0).map(([name,s]) => (
                <StatBar key={name} label={name} value={s.gols} max={maxOf('gols')} color="#27AE60" photo={getPhoto(name)} />
              ))}
            </div>
          </Card>

          <Card title="Assistències" icon={<Trophy className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="space-y-2">
              {sorted('assists').filter(([,s]) => s.assists > 0).map(([name,s]) => (
                <StatBar key={name} label={name} value={s.assists} max={maxOf('assists')} color="#3498DB" photo={getPhoto(name)} />
              ))}
            </div>
          </Card>

          <Card title="Jugades Bones" icon={<TrendingUp className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="space-y-2">
              {sorted('jugadesBones').slice(0,6).map(([name,s]) => (
                <StatBar key={name} label={name} value={s.jugadesBones} max={maxOf('jugadesBones')} color="#E5C07B" photo={getPhoto(name)} />
              ))}
            </div>
          </Card>

          <Card title="Parades (Porter)" icon={<Shield className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="space-y-2">
              {sorted('parades').filter(([,s]) => s.parades > 0).map(([name,s]) => (
                <StatBar key={name} label={name} value={s.parades} max={maxOf('parades')} color="#9B59B6" photo={getPhoto(name)} />
              ))}
            </div>
          </Card>

          <Card title="Cagades 💀" icon={<span className="text-sm">❌</span>}>
            <div className="space-y-2">
              {sorted('cagades').filter(([,s]) => s.cagades > 0).map(([name,s]) => (
                <StatBar key={name} label={name} value={s.cagades} max={maxOf('cagades')} color="#C0392B" photo={getPhoto(name)} />
              ))}
            </div>
          </Card>

          <Card title="Punts MVP Totals" icon={<Star className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="space-y-2">
              {sorted('pts').slice(0,6).map(([name,s]) => (
                <StatBar key={name} label={name} value={Math.round(s.pts*10)/10} max={maxOf('pts')} color="#E5C07B" photo={getPhoto(name)} />
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── MVP ── */}
      {activeTab === 'mvp' && (
        <div className="space-y-5">
          <Card title="Rànking MVP Final de Temporada" icon={<Star className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-600 border-b border-white/5">
                    <th className="text-left pb-2 pr-2">#</th>
                    <th className="text-left pb-2">Jugador</th>
                    <th className="text-center pb-2">🏆 MVPs</th>
                    <th className="text-center pb-2">⭐ Pts totals</th>
                    <th className="text-right pb-2">Partits</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(totals).sort((a,b) => b[1].pts - a[1].pts).map(([name,s], idx) => {
                    const player = roster.find(p => p.name === name);
                    return (
                      <tr key={name} className="border-b border-white/5 last:border-0 hover:bg-white/3">
                        <td className="py-2.5 pr-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black
                            ${idx===0?'bg-[#E5C07B] text-black':idx===1?'bg-gray-400 text-black':idx===2?'bg-amber-700 text-white':'bg-white/5 text-gray-500'}`}>
                            {idx+1}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            {player?.photo ? (
                              <div className="w-7 h-7 rounded-full overflow-hidden bg-[#1a1a1a]">
                                <img src={`${BASE}${player.photo}`} alt={name} className="w-full h-full object-cover object-top" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-[#C0392B]/15 border border-white/10 flex items-center justify-center">
                                <span className="text-xs font-bold text-[#E5C07B]/50">{name[0]}</span>
                              </div>
                            )}
                            <span className="font-medium">{name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-center">
                          {s.mvpWins > 0
                            ? <span>{Array.from({length:s.mvpWins}).map((_,i)=><span key={i}>👑</span>)}</span>
                            : <span className="text-gray-700">—</span>}
                        </td>
                        <td className="py-2.5 text-center">
                          <span className={`font-black ${s.pts>0?'text-[#E5C07B]':'text-gray-600'}`}>
                            {Math.round(s.pts*10)/10}
                          </span>
                        </td>
                        <td className="py-2.5 text-right text-gray-500 text-xs">{s.partits}/8</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* MVP per jornada */}
          <Card title="MVP per Jornada" icon={<Trophy className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DATABASE_S1.matches.map(match => {
                const rs = getRS(match.result);
                const mvpPlayer = roster.find(p => p.name === match.mvpWinner);
                return (
                  <div key={match.id} onClick={() => setSelectedMatch(match)}
                    className={`p-3 bg-[#121212] rounded-xl border cursor-pointer hover:border-[#E5C07B]/40 transition-all hover:-translate-y-0.5 ${rs.border}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">{match.jornada.replace('Jornada ','J')}</span>
                      <span className={`text-xs font-black px-1.5 rounded-full ${rs.bg}`}>{rs.label}</span>
                    </div>
                    <div className="text-xs text-gray-400 truncate mb-1">{match.opponent}</div>
                    <div className={`font-black font-mono text-lg ${rs.color}`}>{match.result}</div>
                    {match.mvpWinner && (
                      <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-1.5">
                        {mvpPlayer?.photo && (
                          <div className="w-4 h-4 rounded-full overflow-hidden bg-[#1a1a1a] shrink-0">
                            <img src={`${BASE}${mvpPlayer.photo}`} alt="" className="w-full h-full object-cover object-top" />
                          </div>
                        )}
                        <span className="text-[10px] text-[#E5C07B] font-bold truncate">👑 {match.mvpWinner}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ── PARTITS ── */}
      {activeTab === 'partits' && (
        <div className="space-y-4">
          {/* Evolució */}
          <Card title="Evolució de la Temporada" icon={<TrendingUp className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="flex gap-3 items-end mt-2" style={{ height: '110px' }}>
              {DATABASE_S1.matches.map((match, idx) => {
                const [f, a] = match.result.split('-').map(Number);
                const max = Math.max(...DATABASE_S1.matches.flatMap(m => m.result.split('-').map(Number)), 1);
                const rs = getRS(match.result);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                    onClick={() => setSelectedMatch(match)}>
                    <div className="flex gap-0.5 items-end w-full" style={{ height: '80px' }}>
                      <div className="flex-1 rounded-t" style={{ height:`${(f/max)*80}px`, background:'#27AE60', minHeight: f>0?'4px':'0' }} />
                      <div className="flex-1 rounded-t" style={{ height:`${(a/max)*80}px`, background:'#C0392B', minHeight: a>0?'4px':'0' }} />
                    </div>
                    <div className={`text-[10px] font-black px-1 rounded ${rs.bg}`}>{f}-{a}</div>
                    <div className="text-[10px] text-gray-700 group-hover:text-[#E5C07B] truncate w-full text-center">
                      {match.opponent.split(' ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500/70 inline-block"/>A favor</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#C0392B]/70 inline-block"/>En contra</span>
            </div>
          </Card>

          {/* Cards partits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {DATABASE_S1.matches.map(match => {
              const rs = getRS(match.result);
              const topScorer = Object.entries(match.playerStats)
                .filter(([,s]) => s.gols > 0).sort((a,b) => b[1].gols-a[1].gols)[0];
              const topPts = Object.entries(match.playerStats)
                .sort((a,b) => b[1].pts-a[1].pts)[0];
              return (
                <div key={match.id} onClick={() => setSelectedMatch(match)}
                  className={`group p-4 bg-[#1E1E1E] rounded-xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl ${rs.border} hover:border-[#E5C07B]/40`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#E5C07B]/70">{match.jornada}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${rs.bg}`}>{rs.label}</span>
                  </div>
                  <div className="font-bold text-sm text-white truncate mb-1">{match.opponent}</div>
                  <div className={`font-black font-mono text-2xl ${rs.color} mb-3`}>{match.result}</div>
                  <div className="space-y-1 pt-2 border-t border-white/5 text-xs text-gray-500">
                    {match.mvpWinner && <div className="text-[#E5C07B]">👑 {match.mvpWinner}</div>}
                    {topScorer && <div>⚽ {topScorer[0]} ({topScorer[1].gols})</div>}
                    <div className="text-gray-700 group-hover:text-[#E5C07B] transition-colors text-right pt-1">
                      Veure detall →
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
