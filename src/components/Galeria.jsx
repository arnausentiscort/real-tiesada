import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { DATABASE } from '../data.js';

const BASE = import.meta.env.BASE_URL;

// ── AFEGEIX FOTOS AQUÍ ────────────────────────────────────────────
// matchId: 'j1', 'j2', 'j3' ...
// url: fitxer a public/gallery/
// photoHover: (opcional) foto alternativa que surt en passar el ratolí → efecte moviment
// caption: text descriptiu
const FOTOS = [
  {
    matchId: 'j3',
    url:        'gallery/j3-oriol-pi-1.jpg',
    photoHover: 'gallery/j3-oriol-pi-2.jpg',
    caption:    "L'Oriol fa el pi 🤸 — Jornada 3 vs Uruks",
  },
];

// ── Targeta de foto amb efecte hover ─────────────────────────────
function PhotoCard({ foto, idx, onClick }) {
  const [hover, setHover] = useState(false);
  const hasMotion = !!foto.photoHover;

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer border border-white/5
        hover:border-[#E5C07B]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
      style={{ aspectRatio: '16/10', background: '#111' }}
      onClick={() => onClick(idx)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Foto principal */}
      <img
        src={`${BASE}${foto.url}`}
        alt={foto.caption}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: hover && hasMotion ? 0 : 1,
          transform: hover && hasMotion ? 'scale(1.05)' : 'scale(1.0)',
          transition: 'opacity 0.35s ease, transform 0.5s ease',
        }}
      />
      {/* Foto hover (efecte moviment) */}
      {hasMotion && (
        <img
          src={`${BASE}${foto.photoHover}`}
          alt={`${foto.caption} (moviment)`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: hover ? 1 : 0,
            transform: hover ? 'scale(1.03)' : 'scale(1.08)',
            transition: 'opacity 0.35s ease, transform 0.5s ease',
          }}
        />
      )}

      {/* Gradient baix */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

      {/* Indicador moviment */}
      {hasMotion && (
        <div className={`absolute top-2 right-2 z-10 text-xs px-2 py-0.5 rounded-full border transition-all duration-300
          ${hover ? 'opacity-100 bg-[#E5C07B]/20 border-[#E5C07B]/50 text-[#E5C07B]' : 'opacity-60 bg-black/50 border-white/20 text-white'}`}>
          {hover ? '▶ moviment' : '🎬'}
        </div>
      )}

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <p className="text-xs text-white font-medium drop-shadow leading-snug">{foto.caption}</p>
      </div>
    </div>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────
function Lightbox({ fotos, idx, onClose, onPrev, onNext }) {
  const foto = fotos[idx];
  return (
    <div className="fixed inset-0 z-[200] bg-black/96 flex items-center justify-center"
      onClick={onClose}>
      <button onClick={e => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10 bg-white/5 rounded-full p-2">
        <X className="w-6 h-6" />
      </button>
      {idx > 0 && (
        <button onClick={e => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 text-white/60 hover:text-white transition-colors z-10 bg-black/50 rounded-full p-3">
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {idx < fotos.length - 1 && (
        <button onClick={e => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 text-white/60 hover:text-white transition-colors z-10 bg-black/50 rounded-full p-3">
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
      <div onClick={e => e.stopPropagation()} className="max-w-5xl w-full px-16 flex flex-col items-center gap-3">
        <img src={`${BASE}${foto.url}`} alt={foto.caption}
          className="max-h-[82vh] max-w-full object-contain rounded-xl shadow-2xl" />
        {foto.caption && (
          <p className="text-gray-300 text-sm text-center">{foto.caption}</p>
        )}
        <p className="text-gray-700 text-xs">{idx + 1} / {fotos.length}</p>
      </div>
    </div>
  );
}

// ── Component principal ───────────────────────────────────────────
export default function Galeria() {
  const [matchFilter, setMatchFilter] = useState('all');
  const [lightbox, setLightbox]       = useState(null);

  const filtered = FOTOS.filter(f => matchFilter === 'all' || f.matchId === matchFilter);

  // Quins partits tenen fotos
  const matchesWithPhotos = DATABASE.matches.filter(m => FOTOS.some(f => f.matchId === m.id));

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-3xl font-black text-white mb-1">Galeria</h2>
        <p className="text-gray-500 text-sm">
          {FOTOS.length} foto{FOTOS.length !== 1 ? 's' : ''} · Passa el ratolí per veure l'efecte moviment 🎬
        </p>
      </header>

      {/* Filtres */}
      <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5 w-fit flex-wrap">
        <button onClick={() => setMatchFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            matchFilter === 'all' ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
          Tots
        </button>
        {matchesWithPhotos.map(m => (
          <button key={m.id} onClick={() => setMatchFilter(m.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              matchFilter === m.id ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
            {m.jornada} · {m.opponent}
          </button>
        ))}
      </div>

      {/* Grid fotos */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((foto, idx) => (
            <PhotoCard key={idx} foto={foto} idx={idx} onClick={setLightbox} />
          ))}
        </div>
      ) : (
        <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-16 text-center">
          <div className="text-5xl mb-4">📸</div>
          <p className="text-gray-500">Sense fotos per aquesta jornada</p>
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox
          fotos={filtered}
          idx={lightbox}
          onClose={() => setLightbox(null)}
          onPrev={() => setLightbox(i => Math.max(0, i - 1))}
          onNext={() => setLightbox(i => Math.min(filtered.length - 1, i + 1))}
        />
      )}
    </div>
  );
}
