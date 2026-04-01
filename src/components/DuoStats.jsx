import React, { useMemo, useState } from 'react';
import { DATABASE } from '../data.js';

const BASE = import.meta.env.BASE_URL;

// ── Calcula minuts compartits per parella ─────────────────────────
function calcPairMinutes() {
  const pairSecs = {};

  DATABASE.matches.forEach(match => {
    const subs = match.events?.substitutions || [];
    if (subs.length < 2) return;

    for (let i = 0; i < subs.length - 1; i++) {
      const cur  = subs[i];
      const next = subs[i + 1];
      const t1 = cur.time.split(':').map(Number).reduce((a,v,j)=>j===0?a+v*60:a+v, 0);
      const t2 = next.time.split(':').map(Number).reduce((a,v,j)=>j===0?a+v*60:a+v, 0);
      const secs = t2 - t1;
      if (secs <= 0) return;

      const players = (cur.onPitch || []).filter(p => p !== cur.goalkeeper);
      for (let a = 0; a < players.length; a++) {
        for (let b = a + 1; b < players.length; b++) {
          const key = [players[a], players[b]].sort().join('|||');
          pairSecs[key] = (pairSecs[key] || 0) + secs;
        }
      }
    }
  });

  return Object.entries(pairSecs)
    .map(([key, secs]) => ({ players: key.split('|||'), secs }))
    .sort((a, b) => b.secs - a.secs);
}

// ── Mini avatar jugador ───────────────────────────────────────────
function PlayerAvatar({ name, size = 32 }) {
  const pl = DATABASE.roster.find(r => r.name === name);
  if (pl?.photo) return (
    <div className="rounded-full overflow-hidden border-2 border-white/15 shrink-0"
      style={{width:size, height:size}}>
      <img src={`${BASE}${pl.photo}`} alt={name}
        className="w-full h-full object-cover object-top"/>
    </div>
  );
  return (
    <div className="rounded-full border-2 border-white/10 flex items-center justify-center shrink-0 font-black"
      style={{width:size, height:size, background:'rgba(229,192,123,0.1)', fontSize:size*0.3, color:'#E5C07B'}}>
      {pl?.number || name[0]}
    </div>
  );
}

// ── Component principal ───────────────────────────────────────────
export default function DuoStats() {
  const [showAll, setShowAll] = useState(false);
  const pairs = useMemo(() => calcPairMinutes(), []);
  const maxSecs = pairs[0]?.secs || 1;
  const displayed = showAll ? pairs.slice(0, 15) : pairs.slice(0, 5);

  return (
    <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-black text-[#E5C07B] flex items-center gap-2">
            🤝 Duos del Camp
          </h3>
          <p className="text-[10px] text-gray-600 mt-0.5">Parelles que més minuts han compartit</p>
        </div>
      </div>

      <div className="space-y-3">
        {displayed.map(({ players, secs }, i) => {
          const [nameA, nameB] = players;
          const plA = DATABASE.roster.find(r => r.name === nameA);
          const plB = DATABASE.roster.find(r => r.name === nameB);
          const mins = Math.round(secs / 60);
          const pct  = (secs / maxSecs) * 100;
          const medals = ['🥇','🥈','🥉'];
          const isTop3 = i < 3;

          return (
            <div key={i} className="group">
              <div className="flex items-center gap-3 mb-1.5">
                {/* Posició */}
                <span className="text-sm w-5 shrink-0 text-center">
                  {medals[i] || <span className="text-xs text-gray-700 font-mono">{i+1}</span>}
                </span>

                {/* Avatars solapats */}
                <div className="flex shrink-0" style={{width:52}}>
                  <PlayerAvatar name={nameA} size={28}/>
                  <div style={{marginLeft:-8}}>
                    <PlayerAvatar name={nameB} size={28}/>
                  </div>
                </div>

                {/* Noms */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black truncate"
                      style={{color: isTop3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)'}}>
                      {plA?.shirtName || nameA.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-gray-700">+</span>
                    <span className="text-xs font-black truncate"
                      style={{color: isTop3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)'}}>
                      {plB?.shirtName || nameB.split(' ')[0]}
                    </span>
                  </div>
                  {/* Barra */}
                  <div className="h-1.5 rounded-full mt-1.5 overflow-hidden"
                    style={{background:'rgba(255,255,255,0.05)'}}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{
                        width:`${pct}%`,
                        background: i === 0 ? 'linear-gradient(90deg,#E5C07B,#F0D090)' :
                                    i === 1 ? 'linear-gradient(90deg,#aaa,#ddd)' :
                                    i === 2 ? 'linear-gradient(90deg,#cd7f32,#e8a060)' :
                                    'rgba(255,255,255,0.2)'
                      }}/>
                  </div>
                </div>

                {/* Minuts */}
                <div className="text-right shrink-0">
                  <span className="text-sm font-black font-mono"
                    style={{color: isTop3 ? '#E5C07B' : 'rgba(255,255,255,0.4)'}}>
                    {mins}'
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {pairs.length > 5 && (
        <button onClick={() => setShowAll(s => !s)}
          className="mt-4 w-full text-xs text-gray-600 hover:text-white transition-colors py-2 border border-white/5 rounded-xl">
          {showAll ? 'Veure menys ↑' : `Veure totes (${pairs.length} parelles) ↓`}
        </button>
      )}
    </div>
  );
}
