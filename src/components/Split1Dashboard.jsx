import React, { useState, useMemo } from 'react';
import { ChevronLeft, Trophy, Target, Star, TrendingUp, Shield, Play, Zap } from 'lucide-react';
import { DATABASE_S1 } from '../data_s1.js';

const BASE = import.meta.env.BASE_URL;

// ── Colors i scoring ─────────────────────────────────────────────
const ACCENT  = '#E5C07B';
const GARNET  = '#C0392B';
const score = s => (s.gols||0)*3 + (s.assists||0)*2 + (s.parades||0)*1 + (s.jugadesBones||0)*1 - (s.cagades||0)*1;

function calcTotals() {
  const t = {};
  DATABASE_S1.roster.forEach(p => {
    t[p.name] = { gols:0,assists:0,jugadesBones:0,cagades:0,golsEncaixats:0,parades:0,pts:0,partits:0,mvpWins:0 };
  });
  DATABASE_S1.matches.forEach(m => {
    Object.entries(m.playerStats||{}).forEach(([name,s]) => {
      if (!t[name]) t[name] = { gols:0,assists:0,jugadesBones:0,cagades:0,golsEncaixats:0,parades:0,pts:0,partits:0,mvpWins:0 };
      t[name].gols          += s.gols||0;
      t[name].assists       += s.assists||0;
      t[name].jugadesBones  += s.jugadesBones||0;
      t[name].cagades       += s.cagades||0;
      t[name].golsEncaixats += s.golsEncaixats||0;
      t[name].parades       += s.parades||0;
      t[name].pts           += s.pts||0;
      if ((s.pts||0) !== 0 || (s.jugadesBones||0) > 0 || (s.gols||0) > 0) t[name].partits++;
    });
    if (m.mvpWinner) { if(!t[m.mvpWinner]) t[m.mvpWinner]={gols:0,assists:0,jugadesBones:0,cagades:0,golsEncaixats:0,parades:0,pts:0,partits:0,mvpWins:0}; t[m.mvpWinner].mvpWins++; }
  });
  return t;
}

// ── Targeta jugador horitzontal ───────────────────────────────────
function PlayerRow({ rank, name, stats }) {
  const player = DATABASE_S1.roster.find(p => p.name === name);
  const medals = ['🥇','🥈','🥉'];
  const isTop = rank === 0;
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all
      ${isTop ? 'bg-[#E5C07B]/8 border-[#E5C07B]/25' : 'bg-[#1a1a1a] border-white/5'}`}>
      <div className="w-7 h-7 rounded-full bg-[#0d0d0d] flex items-center justify-center text-base flex-shrink-0">
        {medals[rank] || <span className="text-xs text-gray-600 font-bold">#{rank+1}</span>}
      </div>
      {player?.photo ? (
        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
          <img src={`${BASE}${player.photo}`} alt={name} className="w-full h-full object-cover" style={{objectPosition:'center 15%'}}/>
        </div>
      ) : (
        <div className="w-10 h-10 rounded-xl bg-[#C0392B]/15 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-black text-[#E5C07B]/40">{name[0]}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-sm truncate ${isTop ? 'text-[#E5C07B]' : 'text-white'}`}>{name}</p>
        <p className="text-[10px] text-gray-600">{stats.partits}j · {stats.gols}⚽ {stats.assists}👟 {stats.parades}🧤</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`font-black font-mono text-lg ${isTop ? 'text-[#E5C07B]' : 'text-white'}`}>{stats.pts}</p>
        <p className="text-[9px] text-gray-600">pts</p>
      </div>
      {stats.mvpWins > 0 && (
        <div className="text-[#E5C07B] text-sm flex-shrink-0">{'👑'.repeat(stats.mvpWins)}</div>
      )}
    </div>
  );
}

function StatBar({ label, value, max, color, photo }) {
  const pct = max > 0 ? (value/max)*100 : 0;
  return (
    <div className="flex items-center gap-2 group">
      {photo ? (
        <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 flex-shrink-0">
          <img src={`${BASE}${photo}`} alt={label} className="w-full h-full object-cover" style={{objectPosition:'center 15%'}}/>
        </div>
      ) : (
        <div className="w-6 h-6 rounded-full bg-[#C0392B]/15 border border-white/10 flex items-center justify-center flex-shrink-0">
          <span className="text-[9px] font-bold text-[#E5C07B]/40">{label[0]}</span>
        </div>
      )}
      <span className="text-xs text-gray-500 w-14 truncate flex-shrink-0">{label.split(' ')[0]}</span>
      <div className="flex-1 h-4 bg-[#0d0d0d] rounded overflow-hidden border border-white/5">
        <div className="h-full rounded transition-all duration-700"
          style={{ width:`${Math.max(pct,value>0?3:0)}%`, background:color }}/>
      </div>
      <span className="text-xs font-mono w-5 text-right flex-shrink-0" style={{color}}>{value}</span>
    </div>
  );
}

function Card({ title, icon, children, className='' }) {
  return (
    <div className={`bg-[#1E1E1E] rounded-xl p-4 border border-white/5 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-[#E5C07B]/10 rounded-lg flex items-center justify-center shrink-0">{icon}</div>
        <h3 className="text-sm font-bold text-[#E5C07B]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ── Detall d'un Partit ────────────────────────────────────────────
function MatchDetailPanel({ match, onBack }) {
  const [tab, setTab] = useState('stats');
  const sorted = Object.entries(match.playerStats||{}).sort((a,b) => score(b[1])-score(a[1]));
  const maxPts = Math.max(...sorted.map(([,s])=>score(s)),1);
  const [f,a] = match.result.split('-').map(Number);
  const rs = f>a ? {color:'text-emerald-400',border:'border-emerald-500/30'} :
             f<a ? {color:'text-[#C0392B]',border:'border-[#C0392B]/30'} :
                   {color:'text-yellow-400',border:'border-yellow-500/30'};

  const goalsF  = (match.goals||[]).filter(g=>g.type==='favor');
  const goalsC  = (match.goals||[]).filter(g=>g.type==='contra');
  const highlights = match.highlights||[];

  return (
    <div className="space-y-4 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1 text-gray-500 hover:text-[#E5C07B] transition-colors text-sm">
        <ChevronLeft className="w-4 h-4"/> Tornar
      </button>

      {/* Vídeo YouTube a dalt */}
      {match.youtubeUrl && (
        <div className="rounded-2xl overflow-hidden bg-black border border-white/5" style={{aspectRatio:'16/9'}}>
          <iframe
            src={`https://www.youtube.com/embed/${match.youtubeId}${match.youtubeUrl.includes('&t=') ? '?start=' + match.youtubeUrl.split('&t=')[1].replace('s','') : ''}`}
            className="w-full h-full"
            allowFullScreen
            title={`${match.jornada} vs ${match.opponent}`}
          />
        </div>
      )}

      {/* Capçalera */}
      <div className={`bg-[#1E1E1E] rounded-xl p-4 border ${rs.border}`}>
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <p className="text-[10px] text-[#E5C07B]/60 uppercase tracking-wider mb-0.5">{match.jornada} · {match.date}</p>
            <h2 className="text-xl font-black text-white">
              <span style={{color:GARNET}}>Real Tiesada</span>
              <span className="mx-2 text-gray-600 font-light">vs</span>
              {match.opponent}
            </h2>
          </div>
          <div className={`text-3xl font-black font-mono bg-[#121212] px-4 py-2 rounded-xl border border-white/5 ${rs.color}`}>
            {match.result}
          </div>
        </div>
        {match.mvpWinner && (
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
            <span className="text-lg">👑</span>
            <span className="text-sm text-[#E5C07B] font-bold">MVP: {match.mvpWinner}</span>
            <span className="text-xs text-gray-600">
              ({score(match.playerStats?.[match.mvpWinner]||{})}pts)
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5 w-fit">
        {[{id:'stats',l:'📊 Stats'},{id:'goals',l:'⚽ Gols'},{id:'highlights',l:'✨ Moments'}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
              ${tab===t.id?'bg-[#E5C07B]/15 text-[#E5C07B]':'text-gray-500 hover:text-white'}`}>
            {t.l}
          </button>
        ))}
        {match.youtubeId && (
          <a href={`https://www.youtube.com/watch?v=${match.youtubeId}`} target="_blank" rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400/70 hover:text-red-400 transition-all flex items-center gap-1">
            <Play className="w-3 h-3"/> Vídeo
          </a>
        )}
      </div>

      {/* STATS */}
      {tab==='stats' && (
        <div className="space-y-2">
          {sorted.map(([name,s],i) => {
            const pts = score(s);
            const player = DATABASE_S1.roster.find(p=>p.name===name);
            const isMvp = name === match.mvpWinner;
            return (
              <div key={name} className={`flex items-center gap-3 p-3 rounded-xl border
                ${isMvp?'bg-[#E5C07B]/8 border-[#E5C07B]/25':'bg-[#1a1a1a] border-white/5'}`}>
                <span className="text-base w-6 flex-shrink-0">{isMvp?'👑':''}</span>
                {player?.photo ? (
                  <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={`${BASE}${player.photo}`} alt={name} className="w-full h-full object-cover" style={{objectPosition:'center 15%'}}/>
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-[#C0392B]/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-[#E5C07B]/40">{name[0]}</span>
                  </div>
                )}
                <span className={`text-sm font-bold w-16 flex-shrink-0 truncate ${isMvp?'text-[#E5C07B]':'text-white'}`}>{name}</span>
                {/* Barra de punts */}
                <div className="flex-1 h-4 bg-[#0d0d0d] rounded overflow-hidden border border-white/5">
                  <div className="h-full rounded transition-all duration-700"
                    style={{ width:`${Math.max((pts/maxPts)*100,pts>0?4:0)}%`,
                      background: isMvp ? ACCENT : pts>0?'#27AE60':'#C0392B' }}/>
                </div>
                <span className={`text-sm font-black font-mono w-8 text-right flex-shrink-0 ${isMvp?'text-[#E5C07B]':'text-white'}`}>{pts}</span>
                {/* Detall */}
                <div className="hidden sm:flex gap-1 text-[10px] text-gray-600 flex-shrink-0">
                  {s.gols>0&&<span className="text-emerald-400">{s.gols}⚽</span>}
                  {s.assists>0&&<span className="text-blue-400">{s.assists}👟</span>}
                  {s.parades>0&&<span className="text-purple-400">{s.parades}🧤</span>}
                  {s.jugadesBones>0&&<span className="text-yellow-400">{s.jugadesBones}✨</span>}
                  {s.cagades>0&&<span className="text-red-400">-{s.cagades}💥</span>}
                </div>
              </div>
            );
          })}
          <div className="bg-[#111] rounded-xl p-3 text-[10px] text-gray-600 mt-2">
            Sistema: Gol=+3 · Assist=+2 · Parada=+1 · Jugada bona=+1 · Cagada=-1
          </div>
        </div>
      )}

      {/* GOLS */}
      {tab==='goals' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-bold text-emerald-400 mb-2">⚽ A favor ({goalsF.length})</p>
            <div className="space-y-2">
              {goalsF.map((g,i) => {
                const link = match.youtubeId ? `https://www.youtube.com/watch?v=${match.youtubeId}&t=${(() => { const [m,s]=(g.time||'0:0').split(':').map(Number); return Math.max(0,m*60+(s||0)-3); })()}s` : null;
                return (
                  <div key={i} className="bg-[#1a1a1a] rounded-xl p-3 border border-emerald-500/15">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-emerald-400 font-mono">{g.time}</p>
                        <p className="text-white text-sm font-bold">{g.scorer}</p>
                        {g.assist && <p className="text-gray-500 text-xs">↳ {g.assist}</p>}
                        {g.details && <p className="text-gray-600 text-xs italic mt-0.5">"{g.details}"</p>}
                      </div>
                      {link && (
                        <a href={link} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-red-600/15 flex items-center justify-center hover:bg-red-600/30 transition-colors">
                          <Play className="w-3.5 h-3.5 text-red-400"/>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-[#C0392B] mb-2">❌ En contra ({goalsC.length})</p>
            <div className="space-y-2">
              {goalsC.map((g,i) => (
                <div key={i} className="bg-[#1a1a1a] rounded-xl p-3 border border-[#C0392B]/15">
                  <p className="text-xs text-[#C0392B] font-mono">{g.time}</p>
                  <p className="text-gray-400 text-sm">{g.goalkeeper && `Porter: ${g.goalkeeper}`}</p>
                  {g.details && <p className="text-gray-600 text-xs italic mt-0.5">"{g.details}"</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HIGHLIGHTS */}
      {tab==='highlights' && (
        <div className="space-y-2">
          {highlights.length === 0 && <p className="text-gray-600 text-sm italic">Cap moment destacat registrat.</p>}
          {highlights.map((h,i) => (
            <div key={i} className="bg-[#1a1a1a] rounded-xl p-3 border border-white/5 flex items-center gap-3">
              <div className="text-lg">🎬</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#E5C07B]/60 font-mono">{h.time} · {h.player}</p>
                <p className="text-white text-sm font-medium truncate">"{h.details}"</p>
              </div>
              {h.videoUrl && (
                <a href={h.videoUrl} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-red-600/15 flex items-center justify-center hover:bg-red-600/30 transition-all flex-shrink-0">
                  <Play className="w-3.5 h-3.5 text-red-400"/>
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Dashboard principal Split 1 ───────────────────────────────────
export default function Split1Dashboard() {
  const [tab, setTab]         = useState('resum');
  const [selMatch, setSelMatch] = useState(null);
  const totals = useMemo(calcTotals, []);

  if (selMatch) return <MatchDetailPanel match={selMatch} onBack={() => setSelMatch(null)}/>;

  const ranking = Object.entries(totals).sort((a,b) => b[1].pts - a[1].pts).filter(([,s])=>s.pts>0||s.partits>0);
  const maxGols = Math.max(...ranking.map(([,s])=>s.gols),1);
  const maxJB   = Math.max(...ranking.map(([,s])=>s.jugadesBones),1);
  const maxCag  = Math.max(...ranking.map(([,s])=>s.cagades),1);
  const maxPar  = Math.max(...ranking.map(([,s])=>s.parades),1);

  const getRS = (r) => {
    const [f,a] = r.split('-').map(Number);
    return f>a ? {label:'V',bg:'bg-emerald-500/20 text-emerald-400',color:'text-emerald-400'} :
           f<a ? {label:'D',bg:'bg-[#C0392B]/20 text-[#C0392B]',color:'text-[#C0392B]'} :
                 {label:'E',bg:'bg-yellow-500/20 text-yellow-400',color:'text-yellow-400'};
  };

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Header */}
      <div className="bg-[#1a1a1a] rounded-xl border border-[#E5C07B]/15 p-4">
        <p className="text-[10px] text-[#E5C07B]/50 uppercase tracking-widest mb-1">Split 1 · Futsal 24/25</p>
        <h2 className="text-2xl font-black text-white">Estadístiques</h2>
        <div className="flex flex-wrap gap-4 mt-2">
          {[
            {v:DATABASE_S1.matches.length,l:'Partits'},
            {v:DATABASE_S1.matches.reduce((a,m)=>a+(m.goals||[]).filter(g=>g.type==='favor').length,0),l:'Gols favor',c:'text-emerald-400'},
            {v:DATABASE_S1.matches.reduce((a,m)=>a+(m.goals||[]).filter(g=>g.type==='contra').length,0),l:'Gols contra',c:'text-[#C0392B]'},
          ].map(({v,l,c})=>(
            <div key={l} className="text-center">
              <p className={`text-xl font-black font-mono ${c||'text-[#E5C07B]'}`}>{v}</p>
              <p className="text-[9px] text-gray-600 uppercase tracking-wider">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5 w-fit flex-wrap">
        {[{id:'resum',l:'📊 Resum'},{id:'mvp',l:'👑 MVP'},{id:'partits',l:'🏟 Partits'},{id:'plantilla',l:'👥 Plantilla'}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all
              ${tab===t.id?'bg-[#E5C07B]/15 text-[#E5C07B]':'text-gray-500 hover:text-white'}`}>
            {t.l}
          </button>
        ))}
      </div>

      {/* RESUM */}
      {tab==='resum' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card title="Golejadors" icon={<Target className="w-3.5 h-3.5 text-[#E5C07B]"/>}>
              <div className="space-y-2">
                {ranking.filter(([,s])=>s.gols>0).sort((a,b)=>b[1].gols-a[1].gols).map(([name,s]) => {
                  const p = DATABASE_S1.roster.find(x=>x.name===name);
                  return <StatBar key={name} label={name} value={s.gols} max={maxGols} color="#27AE60" photo={p?.photo}/>;
                })}
              </div>
            </Card>
            <Card title="Jugades bones" icon={<Zap className="w-3.5 h-3.5 text-[#E5C07B]"/>}>
              <div className="space-y-2">
                {ranking.sort((a,b)=>b[1].jugadesBones-a[1].jugadesBones).slice(0,8).map(([name,s]) => {
                  const p = DATABASE_S1.roster.find(x=>x.name===name);
                  return <StatBar key={name} label={name} value={s.jugadesBones} max={maxJB} color={ACCENT} photo={p?.photo}/>;
                })}
              </div>
            </Card>
            <Card title="Parades" icon={<Shield className="w-3.5 h-3.5 text-[#E5C07B]"/>}>
              <div className="space-y-2">
                {ranking.filter(([,s])=>s.parades>0).sort((a,b)=>b[1].parades-a[1].parades).map(([name,s]) => {
                  const p = DATABASE_S1.roster.find(x=>x.name===name);
                  return <StatBar key={name} label={name} value={s.parades} max={maxPar} color="#61AFEF" photo={p?.photo}/>;
                })}
              </div>
            </Card>
            <Card title="Cagades 💥" icon={<span className="text-sm">💥</span>}>
              <div className="space-y-2">
                {ranking.filter(([,s])=>s.cagades>0).sort((a,b)=>b[1].cagades-a[1].cagades).map(([name,s]) => {
                  const p = DATABASE_S1.roster.find(x=>x.name===name);
                  return <StatBar key={name} label={name} value={s.cagades} max={maxCag} color={GARNET} photo={p?.photo}/>;
                })}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* MVP */}
      {tab==='mvp' && (
        <div className="space-y-3">
          <div className="space-y-2">
            {ranking.map(([name,s],i) => <PlayerRow key={name} rank={i} name={name} stats={s}/>)}
          </div>
          <div className="bg-[#111] rounded-xl p-3 text-[10px] text-gray-600">
            Puntuació: Gol=+3 · Assist=+2 · Parada=+1 · Jugada bona=+1 · Cagada=-1 · 👑=MVP del partit
          </div>
        </div>
      )}

      {/* PARTITS */}
      {tab==='partits' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {DATABASE_S1.matches.map((m,i) => {
            const rs = getRS(m.result);
            const gf = (m.goals||[]).filter(g=>g.type==='favor').length;
            const gc = (m.goals||[]).filter(g=>g.type==='contra').length;
            const hasHighlights = (m.highlights||[]).length > 0;
            return (
              <div key={m.id} onClick={()=>setSelMatch(m)}
                className="bg-[#1E1E1E] rounded-xl p-4 border border-white/5 cursor-pointer
                  hover:-translate-y-1 hover:border-[#E5C07B]/25 transition-all group">
                <p className="text-[10px] text-[#E5C07B]/50 mb-1">{m.jornada} · {m.date}</p>
                <div className="flex justify-between items-start mb-3">
                  <p className="font-bold text-white text-sm leading-tight">{m.opponent}</p>
                  <div className="text-right">
                    <p className={`font-black font-mono text-xl ${rs.color}`}>{m.result}</p>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${rs.bg}`}>{rs.label}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-white/5">
                  <div className="flex gap-2">
                    {m.mvpWinner && <span className="text-[#E5C07B]">👑 {m.mvpWinner}</span>}
                    {hasHighlights && <span>✨ {m.highlights.length}</span>}
                    {m.youtubeId && <span className="text-red-400/60">▶</span>}
                  </div>
                  <span className="group-hover:text-[#E5C07B] transition-colors">Detall →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PLANTILLA */}
      {tab==='plantilla' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {DATABASE_S1.roster.map((player,i) => {
            const s = totals[player.name];
            return (
              <div key={player.name} className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5
                hover:border-[#E5C07B]/30 hover:-translate-y-1 transition-all duration-300">
                <div className="relative overflow-hidden bg-black" style={{height:140}}>
                  {player.photo ? (
                    <img src={`${BASE}${player.photo}`} alt={player.name}
                      className="w-full h-full object-cover" style={{objectPosition:'center 15%'}}/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl font-black text-[#E5C07B]/10">{player.name[0]}</span>
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-[#E5C07B] font-black text-xs truncate">{player.shirtName}</p>
                  <p className="text-gray-600 text-[10px]">{player.position}</p>
                  {s && s.partits > 0 && (
                    <p className="text-[10px] text-gray-500 mt-1">
                      <span className="text-white font-bold">{s.pts}pts</span>
                      {s.mvpWins>0&&<span className="text-[#E5C07B] ml-1">{'👑'.repeat(s.mvpWins)}</span>}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
