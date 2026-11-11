import React, { useEffect, useState } from 'react';

const BASE = import.meta.env.BASE_URL;

// El marcador puja de 0 al resultat amb una corba suau, sense salts
function CountUp({ to, delay = 0, dur = 900 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!(to > 0)) return;
    let raf;
    const t = setTimeout(() => {
      const t0 = performance.now();
      const step = now => {
        const k = Math.min(1, (now - t0) / dur);
        setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [to]);
  return <span>{v}</span>;
}

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
    const t1 = setTimeout(() => setSortint(true), 4300);
    const t2 = setTimeout(() => setVisible(false), 4950);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [match?.id]);

  if (!visible || !match) return null;
  const [f, a] = match.result.split('-').map(s => s.trim());
  const tancar = () => { setSortint(true); setTimeout(() => setVisible(false), 650); };

  return (
    <div onClick={tancar}
      className="fixed inset-0 z-[9990] cursor-pointer select-none overflow-hidden"
      style={{ pointerEvents: sortint ? 'none' : 'auto' }}>
      <div className="absolute inset-0 bg-black/[0.9] animate-victory-bg"
        style={sortint ? { opacity: 0, animation: 'none', transition: 'opacity 0.65s ease' } : undefined}/>
      <div className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ opacity: sortint ? 0 : 1, transform: sortint ? 'scale(1.06)' : 'scale(1)', transition: 'opacity 0.6s ease, transform 0.65s ease', willChange: 'opacity, transform' }}>
        <div className="absolute pointer-events-none rounded-full animate-victory-ring"
          style={{ width: 260, height: 260, border: '2px solid rgba(229,192,123,0.55)' }}/>
        <div className="absolute pointer-events-none rounded-full animate-victory-ring"
          style={{ width: 260, height: 260, border: '2px solid rgba(74,222,128,0.4)', animationDelay: '0.75s' }}/>
        <div className="absolute inset-0 pointer-events-none animate-victory-glow"
          style={{ background: 'radial-gradient(circle at 50% 42%, rgba(229,192,123,0.30) 0%, rgba(74,222,128,0.10) 30%, transparent 62%)' }}/>

        <img src={`${BASE}escut.svg`} alt="" className="relative w-28 h-36 object-contain animate-crest-drop"
          style={{ filter: 'drop-shadow(0 8px 28px rgba(229,192,123,0.35))' }}/>

        <p className="relative mt-5 text-[11px] font-black tracking-[0.4em] text-emerald-400 uppercase animate-letter-in"
          style={{ animationDelay: '600ms' }}>
          {first ? 'Primera de la temporada' : match.jornada}
        </p>
        <h2 className="relative mt-1 flex text-5xl sm:text-6xl font-black tracking-[0.1em] text-[#E5C07B]"
          style={{ textShadow: '0 4px 30px rgba(229,192,123,0.35)' }}>
          {'VICTÒRIA'.split('').map((c, i) => (
            <span key={i} className="inline-block animate-victory-letter" style={{ animationDelay: `${650 + i * 55}ms` }}>{c}</span>
          ))}
        </h2>

        <div className="relative mt-5 flex items-center gap-4 animate-letter-in" style={{ animationDelay: '1250ms' }}>
          <span className="text-sm font-bold text-gray-300">Real Tiesada</span>
          <span className="px-4 py-1.5 rounded-xl bg-white/10 border border-white/15 text-3xl font-black font-mono text-white tabular-nums">
            <CountUp to={Number(f)} delay={1300}/><span className="text-gray-500 mx-1.5">-</span><CountUp to={Number(a)} delay={1300}/>
          </span>
          <span className="text-sm font-bold text-gray-300">{match.opponent}</span>
        </div>
        <p className="relative mt-8 text-[10px] text-gray-500 animate-letter-in" style={{ animationDelay: '2200ms' }}>Toca per continuar</p>
      </div>
    </div>
  );
}
