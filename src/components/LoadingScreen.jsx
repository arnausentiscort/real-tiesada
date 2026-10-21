import React, { useEffect, useState } from 'react';

const BASE = import.meta.env.BASE_URL;
const NOM = 'REAL TIESADA';

// Arrencada: el camp es dibuixa sol, l'escut cau amb un rebot i una espurna,
// el nom surt lletra a lletra i una pilota recorre la barra. Tocar la salta
export default function LoadingScreen({ onDone }) {
  const [sortint, setSortint] = useState(false);
  const reduit = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const t1 = setTimeout(() => setSortint(true), reduit ? 500 : 2300);
    const t2 = setTimeout(onDone, reduit ? 800 : 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const saltar = () => { setSortint(true); setTimeout(onDone, 300); };

  return (
    <div onClick={saltar}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#0b0b0b] cursor-pointer select-none"
      style={{ opacity: sortint ? 0 : 1, transform: sortint ? 'scale(1.04)' : 'scale(1)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>

      {/* Llums de l'estadi */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[140vw] h-[70vh] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center top, rgba(192,57,43,0.28) 0%, transparent 60%)' }}/>
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[120vw] h-[60vh] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center bottom, rgba(229,192,123,0.14) 0%, transparent 60%)' }}/>

      {/* Camp que es dibuixa */}
      <svg viewBox="0 0 200 320" className="absolute h-[92vh] max-w-[96vw] pointer-events-none" fill="none"
        stroke="#E5C07B" strokeWidth="1" strokeOpacity="0.16" strokeLinecap="round">
        {[
          'M10 10 H190 V310 H10 Z', 'M10 160 H190',
          'M60 10 V52 H140 V10', 'M60 310 V268 H140 V310',
          'M82 10 V24 H118 V10', 'M82 310 V296 H118 V310',
        ].map((d, i) => (
          <path key={i} d={d} pathLength="1" className="animate-draw-line" style={{ animationDelay: `${i * 90}ms` }}/>
        ))}
        <circle cx="100" cy="160" r="30" pathLength="1" className="animate-draw-line" style={{ animationDelay: '300ms' }}/>
        <circle cx="100" cy="160" r="1.6" fill="#E5C07B" fillOpacity="0.3" stroke="none"/>
      </svg>

      {/* Escut */}
      <div className="relative animate-crest-drop">
        <div className="absolute inset-0 rounded-full blur-2xl animate-crest-glow"
          style={{ background: 'radial-gradient(circle, rgba(229,192,123,0.45) 0%, transparent 65%)' }}/>
        <div className="relative w-32 h-40 overflow-hidden">
          <img src={`${BASE}escut.svg`} alt="Real Tiesada" className="w-full h-full object-contain"
            style={{ filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.7))' }}/>
          {/* L'espurna només damunt de l'escut (màscara amb la seva silueta) */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ WebkitMaskImage: `url(${BASE}escut.svg)`, maskImage: `url(${BASE}escut.svg)`,
                     WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
                     WebkitMaskPosition: 'center', maskPosition: 'center' }}>
            <div className="absolute inset-y-0 -left-full w-1/2 animate-crest-shine"
              style={{ background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.45), transparent)' }}/>
          </div>
        </div>
      </div>

      {/* Nom, lletra a lletra */}
      <h1 className="relative mt-7 text-3xl sm:text-4xl font-black tracking-[0.18em] text-[#E5C07B] flex"
        aria-label="Real Tiesada">
        {NOM.split('').map((c, i) => (
          <span key={i} className="animate-letter-in inline-block" style={{ animationDelay: `${700 + i * 45}ms`, minWidth: c === ' ' ? '0.4em' : undefined }}>
            {c}
          </span>
        ))}
      </h1>
      <p className="relative mt-2 text-[11px] text-gray-500 tracking-[0.35em] uppercase animate-letter-in"
        style={{ animationDelay: '1350ms' }}>
        Futbol 7 · Velòdrom · Split 3
      </p>

      {/* Barra amb la pilota */}
      <div className="absolute bottom-14 w-44">
        <div className="h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full rounded-full animate-load-bar"
            style={{ background: 'linear-gradient(90deg, #C0392B, #E5C07B)' }}/>
        </div>
        <div className="absolute -top-[9px] left-0 animate-ball-roll text-[15px] leading-none">⚽</div>
      </div>
    </div>
  );
}
