import React, { useEffect, useState } from 'react';

const BASE = import.meta.env.BASE_URL;

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase] = useState(0);
  // phase 0: shield fades in + grows, phase 1: name appears, phase 2: fade out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1600);
    const t3 = setTimeout(() => onDone(), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0d0d0d]"
      style={{
        opacity: phase === 2 ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
    >
      {/* Glow de fons */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-64 h-64 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(192,57,43,0.25) 0%, transparent 70%)',
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        />
      </div>

      {/* Escut */}
      <div
        style={{
          opacity: phase >= 0 ? 1 : 0,
          transform: phase >= 0 ? 'scale(1)' : 'scale(0.5)',
          transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
          filter: 'drop-shadow(0 0 30px rgba(229,192,123,0.5))',
        }}
      >
        <img src={`${BASE}escut.svg`} alt="Real Tiesada" className="w-28 h-28" />
      </div>

      {/* Nom */}
      <div
        className="mt-6 text-center"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <div className="text-3xl font-black tracking-[0.2em] text-[#E5C07B] uppercase">
          Real Tiesada
        </div>
        <div className="text-xs text-gray-600 tracking-[0.4em] uppercase mt-1">
          Futbol Sala · 25/26
        </div>
      </div>

      {/* Línia de càrrega */}
      <div className="absolute bottom-12 w-32 h-0.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#E5C07B] rounded-full"
          style={{
            width: phase >= 1 ? '100%' : '30%',
            transition: 'width 1s ease',
          }}
        />
      </div>
    </div>
  );
}
