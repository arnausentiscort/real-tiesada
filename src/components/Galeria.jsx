import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { DATABASE } from '../data.js';

const BASE = import.meta.env.BASE_URL;

// ── Afegeix fotos aquí per cada partit ───────────────────────────
// Format: { matchId: 'j1', url: 'players/foto.jpg', caption: 'Text opcional' }
const FOTOS = [
  // Exemple — descomentar i posar fotos reals:
  // { matchId: 'j1', url: 'gallery/j1-1.jpg', caption: 'Primer gol del partit' },
  // { matchId: 'j1', url: 'gallery/j1-2.jpg', caption: 'Celebració final' },
];

function Lightbox({ foto, onClose, onPrev, onNext, hasPrev, hasNext }) {
  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={e => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
      >
        <X className="w-8 h-8" />
      </button>

      {hasPrev && (
        <button
          onClick={e => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 text-white/60 hover:text-white transition-colors z-10 bg-black/50 rounded-full p-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {hasNext && (
        <button
          onClick={e => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 text-white/60 hover:text-white transition-colors z-10 bg-black/50 rounded-full p-2"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      <div onClick={e => e.stopPropagation()} className="max-w-4xl max-h-screen p-4 flex flex-col items-center gap-3">
        <img
          src={`${BASE}${foto.url}`}
          alt={foto.caption}
          className="max-h-[80vh] max-w-full object-contain rounded-xl"
        />
        {foto.caption && (
          <p className="text-gray-300 text-sm text-center">{foto.caption}</p>
        )}
      </div>
    </div>
  );
}

export default function Galeria() {
  const [selectedMatch, setSelectedMatch] = useState('all');
  const [lightbox, setLightbox] = useState(null); // index

  const filtered = FOTOS.filter(f => selectedMatch === 'all' || f.matchId === selectedMatch);
  const isEmpty  = FOTOS.length === 0;

  const openLightbox = (idx) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);
  const prevPhoto = () => setLightbox(i => Math.max(0, i - 1));
  const nextPhoto = () => setLightbox(i => Math.min(filtered.length - 1, i + 1));

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-3xl font-black text-white mb-1">Galeria</h2>
        <p className="text-gray-500 text-sm">Fotos dels partits</p>
      </header>

      {/* Filtre per jornada */}
      {!isEmpty && (
        <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5 w-fit flex-wrap">
          <button
            onClick={() => setSelectedMatch('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedMatch === 'all' ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
            Tots
          </button>
          {DATABASE.matches.map(m => (
            <button key={m.id}
              onClick={() => setSelectedMatch(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedMatch === m.id ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
              {m.jornada}
            </button>
          ))}
        </div>
      )}

      {/* Estat buit */}
      {isEmpty && (
        <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-16 text-center">
          <div className="text-6xl mb-4">📸</div>
          <h3 className="text-xl font-bold text-white mb-2">Encara no hi ha fotos</h3>
          <p className="text-gray-500 text-sm mb-4">
            Per afegir fotos, posa els fitxers a <code className="text-[#E5C07B]">public/gallery/</code> i afegeix-los a l'array <code className="text-[#E5C07B]">FOTOS</code> de <code className="text-gray-400">src/components/Galeria.jsx</code>
          </p>
          <div className="bg-[#121212] rounded-xl p-4 text-left text-xs font-mono text-gray-500 max-w-md mx-auto">
            <span className="text-gray-600">{'// Exemple:'}</span><br />
            {'{'} <span className="text-[#E5C07B]">matchId</span>: <span className="text-emerald-400">'j1'</span>,<br />
            {'  '}<span className="text-[#E5C07B]">url</span>: <span className="text-emerald-400">'gallery/j1-gol.jpg'</span>,<br />
            {'  '}<span className="text-[#E5C07B]">caption</span>: <span className="text-emerald-400">'El primer gol!'</span><br />
            {'}'}
          </div>
        </div>
      )}

      {/* Grid de fotos */}
      {!isEmpty && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map((foto, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer
                border border-white/5 hover:border-[#E5C07B]/40 transition-all
                hover:-translate-y-1 hover:shadow-xl group"
            >
              <img
                src={`${BASE}${foto.url}`}
                alt={foto.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                {foto.caption && (
                  <p className="text-xs text-white font-medium">{foto.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isEmpty && filtered.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          Sense fotos per aquesta jornada
        </div>
      )}

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <Lightbox
          foto={filtered[lightbox]}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
          hasPrev={lightbox > 0}
          hasNext={lightbox < filtered.length - 1}
        />
      )}
    </div>
  );
}
