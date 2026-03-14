import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { DATABASE } from '../data.js';

const BASE = import.meta.env.BASE_URL;

function parseTime(t) {
  if (!t) return 0;
  const [m, s] = t.split(':').map(Number);
  return m * 60 + (s || 0);
}

function getVideoLink(matchId, minute) {
  const match = DATABASE.matches.find(m => m.id === matchId);
  if (!match || !minute) return null;
  const secs = Math.max(0, parseTime(minute) - 4);
  if (match.youtubeId) return `https://www.youtube.com/watch?v=${match.youtubeId}&t=${secs}s`;
  if (match.vimeoId)   return `https://vimeo.com/${match.vimeoId}#t=${secs}s`;
  return null;
}

const FOTOS = [
  {
    matchId: 'j3',
    url:        'gallery/j3-paco-ivan-1.jpg',
    photoHover: 'gallery/j3-paco-ivan-2.jpg',
    caption:    'Quasi gol de Paco 🫁',
    subtitle:   'Jornada 3 vs Uruks · min 11:52',
    minute:     '11:52',
  },
  {
    matchId: 'j3',
    url:        'gallery/j3-oriol-pi-1.jpg',
    photoHover: 'gallery/j3-oriol-pi-2.jpg',
    caption:    "L'Oriol fa el pi 🤸",
    subtitle:   'Jornada 3 vs Uruks · min 21:45',
    minute:     '21:45',
  },
];

// ── Lightbox fullscreen amb swipe ─────────────────────────────────
function Lightbox({ fotos, idx, onClose, onPrev, onNext }) {
  const [imgState, setImgState] = useState('normal'); // normal | hover
  const touchStartX = useRef(null);
  const foto = fotos[idx];
  const hasMotion = !!foto.photoHover;

  // Teclat
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowLeft')   onPrev();
      if (e.key === 'ArrowRight')  onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  // Reset estat foto al canviar
  useEffect(() => { setImgState('normal'); }, [idx]);

  // Swipe tàctil
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? onNext() : onPrev(); }
    touchStartX.current = null;
  };

  const currentSrc = imgState === 'hover' && foto.photoHover ? foto.photoHover : foto.url;
  const videoUrl = getVideoLink(foto.matchId, foto.minute);

  return (
    <div
      className="fixed inset-0 z-[300] bg-black flex flex-col"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: 'pan-y' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-sm shrink-0">
        <div>
          <p className="text-white font-bold text-sm">{foto.caption}</p>
          <p className="text-gray-500 text-xs">{foto.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-xs">{idx+1}/{fotos.length}</span>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <X className="w-5 h-5 text-white"/>
          </button>
        </div>
      </div>

      {/* Imatge */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <img
          src={`${BASE}${currentSrc}`}
          alt={foto.caption}
          className="max-h-full max-w-full object-contain transition-all duration-300"
          style={{ userSelect:'none', WebkitUserDrag:'none' }}
        />

        {/* Botons prev/next */}
        {idx > 0 && (
          <button onClick={onPrev}
            className="absolute left-3 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 border border-white/10
              flex items-center justify-center transition-all backdrop-blur-sm">
            <ChevronLeft className="w-6 h-6 text-white"/>
          </button>
        )}
        {idx < fotos.length - 1 && (
          <button onClick={onNext}
            className="absolute right-3 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 border border-white/10
              flex items-center justify-center transition-all backdrop-blur-sm">
            <ChevronRight className="w-6 h-6 text-white"/>
          </button>
        )}
      </div>

      {/* Footer accions */}
      <div className="px-4 py-3 bg-black/80 backdrop-blur-sm flex items-center gap-3 shrink-0">
        {hasMotion && (
          <button
            onPointerDown={() => setImgState('hover')}
            onPointerUp={() => setImgState('normal')}
            onPointerLeave={() => setImgState('normal')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5C07B]/30 bg-[#E5C07B]/10 text-[#E5C07B] text-sm font-bold active:bg-[#E5C07B]/25 transition-all">
            🎬 {imgState === 'hover' ? 'Acció!' : 'Mantén premut'}
          </button>
        )}
        {videoUrl && (
          <a href={videoUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-600 hover:text-white transition-all">
            <Play className="w-4 h-4 fill-current"/> Vídeo
          </a>
        )}
        {/* Indicadors de punts */}
        {fotos.length > 1 && (
          <div className="flex gap-1.5 ml-auto">
            {fotos.map((_, i) => (
              <div key={i} className={`rounded-full transition-all ${i === idx ? 'w-4 h-2 bg-[#E5C07B]' : 'w-2 h-2 bg-white/20'}`}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Targeta desktop ───────────────────────────────────────────────
function PhotoCardDesktop({ foto, idx, onClick }) {
  const [hover, setHover] = useState(false);
  const hasMotion = !!foto.photoHover;
  const videoUrl  = getVideoLink(foto.matchId, foto.minute);

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer border border-white/5
        hover:border-[#E5C07B]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#E5C07B]/5 group"
      style={{ aspectRatio:'16/10', background:'#111' }}
      onClick={() => onClick(idx)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img src={`${BASE}${foto.url}`} alt={foto.caption} className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: hover && hasMotion ? 0 : 1, transform: hover && hasMotion ? 'scale(1.06)' : 'scale(1)', transition:'opacity 0.35s ease, transform 0.5s ease' }}/>
      {hasMotion && (
        <img src={`${BASE}${foto.photoHover}`} alt="" className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: hover ? 1 : 0, transform: hover ? 'scale(1.03)' : 'scale(1.08)', transition:'opacity 0.35s ease, transform 0.5s ease' }}/>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none"/>
      {hasMotion && (
        <div className={`absolute top-2 right-2 z-10 text-xs px-2 py-0.5 rounded-full border transition-all
          ${hover ? 'opacity-100 bg-[#E5C07B]/20 border-[#E5C07B]/50 text-[#E5C07B]' : 'opacity-60 bg-black/50 border-white/20 text-white'}`}>
          {hover ? '▶ moviment' : '🎬'}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <p className="text-sm text-white font-bold drop-shadow">{foto.caption}</p>
        <p className="text-xs text-white/50 mt-0.5">{foto.subtitle}</p>
      </div>
      {videoUrl && (
        <a href={videoUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
          className={`absolute top-2 left-2 z-20 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold
            border transition-all ${hover ? 'opacity-100 bg-black/70 border-[#E5C07B]/50 text-[#E5C07B]' : 'opacity-0'}`}>
          <Play className="w-3 h-3 fill-current"/> Veure al vídeo
        </a>
      )}
    </div>
  );
}

// ── Carrusel mòbil ────────────────────────────────────────────────
function MobileCarousel({ fotos, onOpenLightbox }) {
  const [active, setActive] = useState(0);
  const scrollRef = useRef(null);

  const onScroll = () => {
    if (!scrollRef.current) return;
    const idx = Math.round(scrollRef.current.scrollLeft / scrollRef.current.offsetWidth);
    setActive(idx);
  };

  const goTo = (idx) => {
    scrollRef.current?.scrollTo({ left: idx * scrollRef.current.offsetWidth, behavior: 'smooth' });
    setActive(idx);
  };

  return (
    <div className="relative">
      {/* Carrusel horitzontal */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-2"
        style={{ scrollbarWidth:'none', WebkitOverflowScrolling:'touch' }}
        onScroll={onScroll}>
        {fotos.map((foto, idx) => {
          const videoUrl = getVideoLink(foto.matchId, foto.minute);
          return (
            <div key={idx}
              className="snap-center shrink-0 relative rounded-2xl overflow-hidden border border-white/10 active:border-[#E5C07B]/40 cursor-pointer"
              style={{ width:'85vw', maxWidth:360, aspectRatio:'4/3', background:'#111' }}
              onClick={() => onOpenLightbox(idx)}>
              <img src={`${BASE}${foto.url}`} alt={foto.caption}
                className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"/>
              {/* Badge 🎬 */}
              {foto.photoHover && (
                <div className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full bg-black/60 border border-white/20 text-white">
                  🎬 Toca per veure
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-bold text-sm">{foto.caption}</p>
                <p className="text-white/50 text-xs mt-0.5">{foto.subtitle}</p>
              </div>
              {videoUrl && (
                <a href={videoUrl} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold
                    bg-red-600/70 border border-red-500/50 text-white">
                  <Play className="w-3 h-3 fill-current"/> Vídeo
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Indicadors + comptador */}
      <div className="flex items-center justify-center gap-2 mt-3">
        {fotos.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all ${i === active ? 'w-5 h-2 bg-[#E5C07B]' : 'w-2 h-2 bg-white/20'}`}/>
        ))}
      </div>
      <p className="text-center text-xs text-gray-600 mt-1">Llisca per veure més · Toca per ampliar</p>
    </div>
  );
}

// ── Component principal ───────────────────────────────────────────
export default function Galeria() {
  const [matchFilter, setMatchFilter] = useState('all');
  const [lightbox, setLightbox]       = useState(null);

  const filtered = FOTOS.filter(f => matchFilter === 'all' || f.matchId === matchFilter);
  const matchesWithPhotos = DATABASE.matches.filter(m => FOTOS.some(f => f.matchId === m.id));

  const openLightbox = useCallback((idx) => setLightbox(idx), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prevPhoto = useCallback(() => setLightbox(i => Math.max(0, i - 1)), []);
  const nextPhoto = useCallback(() => setLightbox(i => Math.min(filtered.length - 1, i + 1)), [filtered.length]);

  return (
    <div className="space-y-5 animate-fade-in">
      <header>
        <h2 className="text-3xl font-black text-white mb-1">Galeria</h2>
        <p className="text-gray-500 text-sm">
          {FOTOS.length} foto{FOTOS.length !== 1 ? 's' : ''} · 🎬 Efectes de moviment
        </p>
      </header>

      {/* Filtres */}
      {matchesWithPhotos.length > 0 && (
        <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5 w-fit flex-wrap">
          <button onClick={() => setMatchFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${matchFilter==='all' ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
            Tots
          </button>
          {matchesWithPhotos.map(m => (
            <button key={m.id} onClick={() => setMatchFilter(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${matchFilter===m.id ? 'bg-[#E5C07B]/15 text-[#E5C07B]' : 'text-gray-500 hover:text-white'}`}>
              {m.jornada} · {m.opponent}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <>
          {/* Mòbil: carrusel */}
          <div className="md:hidden">
            <MobileCarousel fotos={filtered} onOpenLightbox={openLightbox}/>
          </div>
          {/* Desktop: grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((foto, idx) => (
              <PhotoCardDesktop key={idx} foto={foto} idx={idx} onClick={openLightbox}/>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-16 text-center">
          <div className="text-5xl mb-4">📸</div>
          <p className="text-gray-500">Sense fotos per aquesta jornada</p>
        </div>
      )}

      {/* Lightbox fullscreen */}
      {lightbox !== null && (
        <Lightbox
          fotos={filtered}
          idx={lightbox}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </div>
  );
}
