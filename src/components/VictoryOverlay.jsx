import React, { useEffect, useState } from 'react';

const BASE = import.meta.env.BASE_URL;

// Quan s'obre un partit guanyat: escut, VICTÒRIA i el marcador, amb el confeti.
// La primera de la temporada té el seu títol. Es veu un cop per partit i aparell
export default function VictoryOverlay({ match, first }) {
  const [visible, setVisible] = useState(false);
  const [sortint, setSortint] = useState(false);

  useEffect(() => {
    if (!match) return;
    const key = `rt:victoria:${match.id}`;
    try { if (localStorage.getItem(key)) return; localStorage.setItem(key, '1'); } catch { /* sense memòria: es mostra */ }
    setSortint(false);
    setVisible(true);
    const t1 = setTimeout(() => setSortint(true), 3400);
    const t2 = setTimeout(() => setVisible(false), 3900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [match?.id]);

  if (!visible || !match) return null;
  const [f, a] = match.result.split('-').map(s => s.trim());
  const tancar = () => { setSortint(true); setTimeout(() => setVisible(false), 400); };

  return (
    <div onClick={tancar}
      className="fixed inset-0 z-[9990] flex flex-col items-center justify-center cursor-pointer select-none bg-black/[0.88]"
      style={{ opacity: sortint ? 0 : 1, transition: 'opacity 0.45s ease' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 42%, rgba(229,192,123,0.28) 0%, rgba(74,222,128,0.10) 30%, transparent 60%)' }}/>

      <img src={`${BASE}escut.svg`} alt="" className="relative w-28 h-36 object-contain animate-crest-drop"/>

      <p className="relative mt-5 text-[11px] font-black tracking-[0.4em] text-emerald-400 uppercase animate-letter-in"
        style={{ animationDelay: '450ms' }}>
        {first ? 'Primera de la temporada' : match.jornada}
      </p>
      <h2 className="relative mt-1 text-5xl sm:text-6xl font-black tracking-[0.12em] text-[#E5C07B] animate-victory-pop">
        VICTÒRIA
      </h2>

      <div className="relative mt-5 flex items-center gap-4 animate-letter-in" style={{ animationDelay: '800ms' }}>
        <span className="text-sm font-bold text-gray-300">Real Tiesada</span>
        <span className="px-4 py-1.5 rounded-xl bg-white/10 border border-white/15 text-3xl font-black font-mono text-white">
          {f}<span className="text-gray-500 mx-1.5">-</span>{a}
        </span>
        <span className="text-sm font-bold text-gray-300">{match.opponent}</span>
      </div>
      <p className="relative mt-8 text-[10px] text-gray-500 animate-letter-in" style={{ animationDelay: '1400ms' }}>Toca per continuar</p>
    </div>
  );
}
