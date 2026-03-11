import React, { useState, useMemo } from 'react';
import { ChevronLeft, Trophy, Target, Star, TrendingUp, Users, Shield } from 'lucide-react';
import { DATABASE_S1 } from '../data_s1.js';

const BASE = import.meta.env.BASE_URL;

// ── Utilitats locals ──────────────────────────────────────────────
function calcTotals() {
  const totals = {};
  DATABASE_S1.roster.forEach(p => {
    totals[p.name] = { gols:0, assists:0, jugadesBones:0, cagades:0, golsEncaixats:0, golsFavor:0, golsContra:0, parades:0, pts:0, partits:0, mvpWins:0, mvpVotes:0 };
  });
  DATABASE_S1.matches.forEach(match => {
    Object.entries(match.playerStats).forEach(([name, s]) => {
      if (!totals[name]) return;
      const played = Object.values(s).some(v => v !== 0);
      totals[name].gols         += s.gols;
      totals[name].assists      += s.assists;
      totals[name].jugadesBones += s.jugadesBones;
      totals[name].cagades      += s.cagades;
      totals[name].golsEncaixats+= s.golsEncaixats;
      totals[name].golsFavor    += s.golsFavor;
      totals[name].golsContra   += s.golsContra;
      totals[name].parades      += s.parades;
      totals[name].pts          += s.pts;
      if (played || s.pts !== 0) totals[name].partits++;
    });
    // MVP
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

// ── Vista detall d'un partit ──────────────────────────────────────
function MatchDetail({ match, onBack }) {
  const players = DATABASE_S1.roster.map(p => p.name);
  const getResultStyle = (r) => {
    const [f, a] = r.replace('?','0').split('-').map(Number);
    if (f > a) return { color: 'text-emerald-400', label: 'V', bg: 'bg-emerald-500/20 text-emerald-400' };
    if (f < a) return { color: 'text-[#C0392B]',   label: 'D', bg: 'bg-[#C0392B]/20 text-[#C0392B]' };
    return      { color: 'text-yellow-400',          label: 'E', bg: 'bg-yellow-500/20 text-yellow-400' };
  };
  const rs = getResultStyle(match.result);

  const STATS_LABELS = [
    { key: 'gols',          label: '⚽ Gols',           color: '#27AE60' },
    { key: 'assists',       label: '👟 Assistències',   color: '#3498DB' },
    { key: 'jugadesBones',  label: '✅ Jug. Bones',     color: '#E5C07B' },
    { key: 'cagades',       label: '❌ Cagades',        color: '#C0392B' },
    { key: 'golsEncaixats', label: '🥅 Gols Encaixats', color: '#E74C3C' },
    { key: 'parades',       label: '🧤 Parades',        color: '#9B59B6' },
    { key: 'pts',           label: '⭐ Punts MVP',      color: '#E5C07B' },
  ];

  // Ordena per punts MVP
  const sortedPlayers = [...players].sort((a, b) =>
    (match.playerStats[b]?.pts || 0) - (match.playerStats[a]?.pts || 0)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-[#E5C07B] transition-colors text-sm">
        <ChevronLeft className="w-4 h-4" /> Tornar
      </button>

      {/* Capçalera */}
      <div className="bg-[#1E1E1E] rounded-xl p-6 border border-[#E5C07B]/20">
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
          <div className="mt-4 flex items-center gap-2 bg-[#E5C07B]/10 border border-[#E5C07B]/20 rounded-lg px-4 py-2 w-fit">
            <span className="text-lg">👑</span>
            <span className="text-sm text-[#E5C07B] font-bold">MVP: {match.mvpWinner}</span>
          </div>
        )}
      </div>

      {/* Taula stats individuals */}
      <Card title="Stats Individuals" icon={<Users className="w-4 h-4 text-[#E5C07B]" />}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-600 border-b border-white/5">
                <th className="text-left pb-2 pr-3">Jugador</th>
                <th className="text-center pb-2 px-2">⚽</th>
                <th className="text-center pb-2 px-2">👟</th>
                <th className="text-center pb-2 px-2">✅ JB</th>
                <th className="text-center pb-2 px-2">❌ Cag</th>
                <th className="text-center pb-2 px-2">🥅 Enc</th>
                <th className="text-center pb-2 px-2">🧤 Par</th>
                <th className="text-center pb-2 px-2 text-[#E5C07B]">⭐ Pts</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map(name => {
                const s = match.playerStats[name] || {};
                const isMvp = match.mvpWinner === name;
                const played = s.pts !== 0 || s.jugadesBones > 0 || s.gols > 0;
                const player = DATABASE_S1.roster.find(p => p.name === name);
                return (
                  <tr key={name} className={`border-b border-white/5 last:border-0 ${isMvp ? 'bg-[#E5C07B]/5' : ''} ${!played ? 'opacity-30' : ''}`}>
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
                    <td className="text-center py-2 px-2 text-emerald-400 font-bold">{s.gols || '-'}</td>
                    <td className="text-center py-2 px-2 text-blue-400">{s.assists || '-'}</td>
                    <td className="text-center py-2 px-2 text-[#E5C07B]">{s.jugadesBones || '-'}</td>
                    <td className="text-center py-2 px-2 text-[#C0392B]">{s.cagades || '-'}</td>
                    <td className="text-center py-2 px-2 text-red-400">{s.golsEncaixats || '-'}</td>
                    <td className="text-center py-2 px-2 text-purple-400">{s.parades || '-'}</td>
                    <td className={`text-center py-2 px-2 font-black ${s.pts > 0 ? 'text-[#E5C07B]' : s.pts < 0 ? 'text-[#C0392B]' : 'text-gray-600'}`}>
                      {s.pts > 0 ? `+${s.pts}` : s.pts || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Votacions MVP */}
      <Card title="Votació MVP" icon={<Star className="w-4 h-4 text-[#E5C07B]" />}>
        <div className="space-y-2">
          {Object.entries(match.mvpVotes || {})
            .sort((a,b) => b[1] - a[1])
            .map(([name, votes], idx) => (
              <div key={name} className="flex items-center gap-3">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0
                  ${idx === 0 ? 'bg-[#E5C07B] text-black' : 'bg-white/5 text-gray-500'}`}>{idx+1}</span>
                <span className="flex-1 text-sm">{name}</span>
                <div className="flex gap-0.5">
                  {Array.from({length: votes}).map((_, i) => (
                    <span key={i} className="text-[#E5C07B]">★</span>
                  ))}
                </div>
                <span className="text-xs text-gray-500 w-8 text-right">{votes} vots</span>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}

// ── Dashboard principal Split 1 ───────────────────────────────────
export default function Split1Dashboard() {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [activeTab, setActiveTab] = useState('resum');
  const totals = useMemo(() => calcTotals(), []);

  if (selectedMatch) return <MatchDetail match={selectedMatch} onBack={() => setSelectedMatch(null)} />;

  const roster = DATABASE_S1.roster;
  const getPhoto = (name) => roster.find(p => p.name === name)?.photo;

  const sorted = (key, desc = true) =>
    Object.entries(totals)
      .filter(([,s]) => s.partits > 0)
      .sort((a, b) => desc ? b[1][key] - a[1][key] : a[1][key] - b[1][key]);

  const maxOf = (key) => Math.max(...Object.values(totals).map(s => s[key]), 1);

  const getResultStyle = (r) => {
    const [f, a] = r.replace('?','0').split('-').map(Number);
    if (f > a) return { label: 'V', bg: 'bg-emerald-500/20 text-emerald-400', border: 'border-emerald-500/30', color: 'text-emerald-400' };
    if (f < a) return { label: 'D', bg: 'bg-[#C0392B]/20 text-[#C0392B]',    border: 'border-[#C0392B]/30',   color: 'text-[#C0392B]' };
    return           { label: 'E', bg: 'bg-yellow-500/20 text-yellow-400',    border: 'border-yellow-500/30',  color: 'text-yellow-400' };
  };

  const tabs = [
    { id: 'resum',   label: '📊 Resum' },
    { id: 'mvp',     label: '👑 MVP' },
    { id: 'stats',   label: '📈 Stats' },
    { id: 'partits', label: '🏟 Partits' },
  ];

  // Ranking MVP total
  const mvpRanking = Object.entries(totals)
    .filter(([,s]) => s.mvpWins > 0 || s.mvpVotes > 0)
    .sort((a, b) => b[1].pts - a[1].pts);

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

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5 w-fit flex-wrap">
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
              {sorted('gols').filter(([,s]) => s.gols > 0).map(([name, s]) => (
                <StatBar key={name} label={name} value={s.gols} max={maxOf('gols')} color="#27AE60" photo={getPhoto(name)} />
              ))}
              {sorted('gols').filter(([,s]) => s.gols > 0).length === 0 && <p className="text-gray-600 text-sm italic">Sense dades</p>}
            </div>
          </Card>

          <Card title="Assistències" icon={<Trophy className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="space-y-2">
              {sorted('assists').filter(([,s]) => s.assists > 0).map(([name, s]) => (
                <StatBar key={name} label={name} value={s.assists} max={maxOf('assists')} color="#3498DB" photo={getPhoto(name)} />
              ))}
            </div>
          </Card>

          <Card title="Punts MVP Totals" icon={<Star className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="space-y-2">
              {sorted('pts').slice(0,6).map(([name, s]) => (
                <StatBar key={name} label={name} value={Math.round(s.pts*10)/10} max={maxOf('pts')} color="#E5C07B" photo={getPhoto(name)} />
              ))}
            </div>
          </Card>

          <Card title="Jugades Bones" icon={<TrendingUp className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="space-y-2">
              {sorted('jugadesBones').slice(0,6).map(([name, s]) => (
                <StatBar key={name} label={name} value={s.jugadesBones} max={maxOf('jugadesBones')} color="#E5C07B" photo={getPhoto(name)} />
              ))}
            </div>
          </Card>

          <Card title="Parades" icon={<Shield className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="space-y-2">
              {sorted('parades').filter(([,s]) => s.parades > 0).map(([name, s]) => (
                <StatBar key={name} label={name} value={s.parades} max={maxOf('parades')} color="#9B59B6" photo={getPhoto(name)} />
              ))}
            </div>
          </Card>

          <Card title="Partits Jugats" icon={<Users className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="space-y-2">
              {sorted('partits').map(([name, s]) => (
                <StatBar key={name} label={name} value={s.partits} max={8} color="#C0392B" photo={getPhoto(name)} />
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── MVP ── */}
      {activeTab === 'mvp' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Ranking MVP */}
          <Card title="Rànking MVP Final" icon={<Star className="w-4 h-4 text-[#E5C07B]" />} className="md:col-span-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-600 border-b border-white/5">
                    <th className="text-left pb-2">#</th>
                    <th className="text-left pb-2">Jugador</th>
                    <th className="text-center pb-2">🏆 MVP Won</th>
                    <th className="text-center pb-2">🗳 Vots rebuts</th>
                    <th className="text-center pb-2">⭐ Pts MVP</th>
                    <th className="text-right pb-2">Partits</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(totals)
                    .sort((a,b) => b[1].pts - a[1].pts)
                    .map(([name, s], idx) => {
                      const player = roster.find(p => p.name === name);
                      return (
                        <tr key={name} className="border-b border-white/5 last:border-0 hover:bg-white/3">
                          <td className="py-2.5">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black
                              ${idx === 0 ? 'bg-[#E5C07B] text-black' : idx === 1 ? 'bg-gray-400 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-white/5 text-gray-500'}`}>
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
                          <td className="text-center py-2.5">
                            {s.mvpWins > 0 ? (
                              <span className="flex items-center justify-center gap-1">
                                {Array.from({length: s.mvpWins}).map((_,i) => <span key={i}>👑</span>)}
                              </span>
                            ) : <span className="text-gray-700">—</span>}
                          </td>
                          <td className="text-center py-2.5 text-gray-400">{s.mvpVotes || '—'}</td>
                          <td className="text-center py-2.5">
                            <span className={`font-black ${s.pts > 0 ? 'text-[#E5C07B]' : 'text-gray-600'}`}>
                              {Math.round(s.pts*10)/10}
                            </span>
                          </td>
                          <td className="text-right py-2.5 text-gray-500 text-xs">{s.partits}/8</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* MVP per jornada */}
          <Card title="MVP per Jornada" icon={<Trophy className="w-4 h-4 text-[#E5C07B]" />} className="md:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DATABASE_S1.matches.map(match => {
                const rs = getResultStyle(match.result);
                const mvpPlayer = roster.find(p => p.name === match.mvpWinner);
                return (
                  <div key={match.id} onClick={() => setSelectedMatch(match)}
                    className={`p-3 bg-[#121212] rounded-xl border cursor-pointer hover:border-[#E5C07B]/40 transition-all hover:-translate-y-0.5 ${rs.border}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-600">{match.jornada.replace('Jornada ','J')}</span>
                      <span className={`text-xs font-black px-1.5 rounded-full ${rs.bg}`}>{rs.label}</span>
                    </div>
                    <div className="text-xs text-gray-400 truncate mb-2">{match.opponent}</div>
                    <div className={`font-black font-mono text-lg ${rs.color}`}>{match.result}</div>
                    {match.mvpWinner && (
                      <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-1.5">
                        {mvpPlayer?.photo ? (
                          <div className="w-5 h-5 rounded-full overflow-hidden bg-[#1a1a1a] shrink-0">
                            <img src={`${BASE}${mvpPlayer.photo}`} alt={match.mvpWinner} className="w-full h-full object-cover object-top" />
                          </div>
                        ) : null}
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

      {/* ── STATS ── */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card title="Cagades Totals 💀" icon={<span className="text-sm">❌</span>}>
            <div className="space-y-2">
              {sorted('cagades').filter(([,s]) => s.cagades > 0).map(([name, s]) => (
                <StatBar key={name} label={name} value={s.cagades} max={maxOf('cagades')} color="#C0392B" photo={getPhoto(name)} />
              ))}
            </div>
          </Card>

          <Card title="Gols Encaixats (Porter)" icon={<Shield className="w-4 h-4 text-[#E5C07B]" />}>
            <div className="space-y-2">
              {sorted('golsEncaixats').filter(([,s]) => s.golsEncaixats > 0).map(([name, s]) => (
                <StatBar key={name} label={name} value={s.golsEncaixats} max={maxOf('golsEncaixats')} color="#E74C3C" photo={getPhoto(name)} />
              ))}
            </div>
          </Card>

          {/* Ràtio gols al camp */}
          <Card title="Comparativa al camp (⚽ vs ❌)" icon={<TrendingUp className="w-4 h-4 text-[#E5C07B]" />} className="md:col-span-2">
            <p className="text-xs text-gray-600 mb-4">Verd = gols a favor · Vermell = gols en contra mentre estaves al camp</p>
            <div className="space-y-3">
              {sorted('golsFavor').filter(([,s]) => s.golsFavor > 0 || s.golsContra > 0).map(([name, s]) => {
                const maxV = Math.max(s.golsFavor, s.golsContra, 1);
                const player = roster.find(p => p.name === name);
                return (
                  <div key={name} className="flex items-center gap-3">
                    {player?.photo ? (
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-[#1a1a1a] shrink-0">
                        <img src={`${BASE}${player.photo}`} alt={name} className="w-full h-full object-cover object-top" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#C0392B]/15 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-[#E5C07B]/50">{name[0]}</span>
                      </div>
                    )}
                    <span className="w-16 text-xs text-gray-400 truncate shrink-0">{name}</span>
                    <div className="flex-1 flex flex-col gap-0.5">
                      <div className="h-2.5 bg-[#0d0d0d] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500/70 rounded-full" style={{ width: `${(s.golsFavor/maxV)*100}%` }} />
                      </div>
                      <div className="h-2.5 bg-[#0d0d0d] rounded-full overflow-hidden">
                        <div className="h-full bg-[#C0392B]/70 rounded-full" style={{ width: `${(s.golsContra/maxV)*100}%` }} />
                      </div>
                    </div>
                    <div className="text-xs font-mono w-14 text-right">
                      <span className="text-emerald-400">{s.golsFavor}</span>
                      <span className="text-gray-600"> / </span>
                      <span className="text-[#C0392B]">{s.golsContra}</span>
                    </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {DATABASE_S1.matches.map(match => {
              const rs = getResultStyle(match.result);
              const mvpPlayer = roster.find(p => p.name === match.mvpWinner);
              const topScorer = Object.entries(match.playerStats)
                .filter(([,s]) => s.gols > 0)
                .sort((a,b) => b[1].gols - a[1].gols)[0];
              return (
                <div key={match.id} onClick={() => setSelectedMatch(match)}
                  className={`group p-4 bg-[#1E1E1E] rounded-xl border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl ${rs.border} hover:border-[#E5C07B]/40`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#E5C07B]/70">{match.jornada}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${rs.bg}`}>{rs.label}</span>
                  </div>
                  <div className="font-bold text-sm text-white mb-1 truncate">{match.opponent}</div>
                  <div className={`font-black font-mono text-2xl ${rs.color} mb-3`}>{match.result}</div>

                  <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs text-gray-500">
                    {match.mvpWinner && (
                      <div className="flex items-center gap-1.5">
                        {mvpPlayer?.photo ? (
                          <div className="w-4 h-4 rounded-full overflow-hidden bg-[#1a1a1a]">
                            <img src={`${BASE}${mvpPlayer.photo}`} alt="" className="w-full h-full object-cover object-top" />
                          </div>
                        ) : null}
                        <span className="text-[#E5C07B]">👑 {match.mvpWinner}</span>
                      </div>
                    )}
                    {topScorer && (
                      <div>⚽ {topScorer[0]} ({topScorer[1].gols} gols)</div>
                    )}
                    <div className="text-gray-700 group-hover:text-[#E5C07B] transition-colors text-right">
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
