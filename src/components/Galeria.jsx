import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Image } from 'lucide-react';
import { DATABASE } from '../data.js';

const BASE = import.meta.env.BASE_URL;

function parseTime(t) {
  if (!t) return 0;
  const [m, s] = t.split(':').map(Number);
  return m * 60 + (s || 0);
}

// ── Construeix galeria NOMÉS amb fotos manuals ────────────────────
function buildGallery() {
  const items = [];

  DATABASE.matches.forEach(match => {
    (match.events?.retransmissio || []).forEach(r => {
      if (!r.photo) return;
      items.push({
        type: 'manual',
        matchId: match.id,
        jornada: match.jornada,
        opponent: match.opponent,
        time: r.time,
        caption: r.text,
        url: r.photo,
        photoHover: r.photoHover || null,
        videoUrl: r.videoUrl || null,
        players: r.players || [],
      });
    });

    if (match.youtubeId) {
      (match.events?.retransmissio || []).forEach(r => {
        if (r.photo) return;
        if (!r.photoTimestamp) return;
        const secs = r.photoTimestamp;
        const ytUrl = `https://www.youtube.com/watch?v=${match.youtubeId}&t=${secs}s`;
        items.push({
          type: 'ytframe',
          matchId: match.id,
          jornada: match.jornada,
          opponent: match.opponent,
          time: r.time,
          caption: r.text,
          youtubeId: match.youtubeId,
          timestamp: secs,
          videoUrl: r.videoUrl || ytUrl,
          players: r.players || [],
        });
      });
    }
  });

  items.sort((a, b) => {
    const mi = DATABASE.matches.findIndex(m => m.id === a.matchId) - DATABASE.matches.findIndex(m => m.id === b.matchId);
    return mi !== 0 ? mi : parseTime(a.time) - parseTime(b.time);
  });

  return items;
}

// ── Targeta del grid ──────────────────────────────────────────────
function GalleryCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isManual = item.type === 'manual';
  const thumb = isManual
    ? `${BASE}${item.url}`
    : `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-black select-none"
      style={{aspectRatio: '16/10'}}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      <img
        src={isManual && hovered && item.photoHover ? `${BASE}${item.photoHover}` : thumb}
        alt={item.caption}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"/>

      {/* Gradient overlay */}
      <div className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 45%, transparent 100%)',
          opacity: hovered ? 1 : 0.6,
        }}/>

      {/* Play icon per a vídeos */}
      {!isManual && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{background:'rgba(255,0,0,0.85)'}}>
            <Play className="w-5 h-5 text-white ml-0.5" fill="white"/>
          </div>
        </div>
      )}

      {/* Badge hover photo */}
      {isManual && item.photoHover && hovered && (
        <div className="absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-full font-bold"
          style={{background:'rgba(0,0,0,0.75)', color:'#E5C07B', border:'1px solid rgba(229,192,123,0.3)'}}>
          🎬
        </div>
      )}

      {/* Caption bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-1 group-hover:translate-y-0 transition-transform duration-200">
        <p className="text-white text-[10px] font-semibold leading-snug line-clamp-2">{item.caption}</p>
        <p className="text-gray-400 text-[9px] mt-0.5">{item.jornada} · {item.time}</p>
      </div>
    </div>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────
function Lightbox({ items, idx, onClose, onPrev, onNext, onJump }) {
  const item = items[idx];
  const touchStartX = useRef(null);
  const thumbRef = useRef(null);

  // Desplaça les miniatures cap al seleccionat
  useEffect(() => {
    if (!thumbRef.current) return;
    const btn = thumbRef.current.children[idx];
    if (btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [idx]);

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext]);

  const handleTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = e => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 48) dx < 0 ? onNext() : onPrev();
    touchStartX.current = null;
  };

  const isManual = item.type === 'manual';
  const imgSrc   = isManual
    ? `${BASE}${item.url}`
    : `https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`;

  return (
    <div
      className="fixed inset-0 z-[400] flex flex-col"
      style={{background:'#000'}}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}>

      {/* ── Barra superior ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 z-20 pointer-events-none"
        style={{background:'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)'}}>
        <span className="text-white/40 text-xs font-mono pointer-events-none">
          {idx + 1} / {items.length}
        </span>
        <button
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:bg-white/20 pointer-events-auto"
          style={{background:'rgba(255,255,255,0.1)'}}
          onClick={onClose}>
          <X className="w-4 h-4 text-white"/>
        </button>
      </div>

      {/* ── Imatge — ocupa tot l'espai disponible ── */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        onClick={onClose}>
        <img
          key={idx}
          src={imgSrc}
          alt={item.caption}
          className="max-w-full max-h-full object-contain select-none"
          style={{userSelect:'none', WebkitUserDrag:'none'}}
          onClick={e => e.stopPropagation()}
          onError={!isManual ? e => { e.target.src = `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`; } : undefined}
          draggable={false}
        />

        {/* Botons prev/next sobre la imatge */}
        {idx > 0 && (
          <button
            className="absolute left-3 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:bg-white/25 hover:scale-110"
            style={{background:'rgba(255,255,255,0.12)', backdropFilter:'blur(8px)'}}
            onClick={e => { e.stopPropagation(); onPrev(); }}>
            <ChevronLeft className="w-6 h-6 text-white"/>
          </button>
        )}
        {idx < items.length - 1 && (
          <button
            className="absolute right-3 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:bg-white/25 hover:scale-110"
            style={{background:'rgba(255,255,255,0.12)', backdropFilter:'blur(8px)'}}
            onClick={e => { e.stopPropagation(); onNext(); }}>
            <ChevronRight className="w-6 h-6 text-white"/>
          </button>
        )}
      </div>

      {/* ── Barra inferior: caption + miniatures ── */}
      <div className="shrink-0 z-20"
        style={{background:'linear-gradient(to top, #000 60%, transparent 100%)'}}>

        {/* Caption */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold leading-snug line-clamp-2">{item.caption}</p>
              <p className="text-gray-500 text-xs mt-1">
                {item.jornada} · vs {item.opponent} · min {item.time}
              </p>
              {item.players?.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {item.players.map(p => (
                    <span key={p} className="text-[9px] px-2 py-0.5 rounded-full text-gray-400"
                      style={{border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)'}}>
                      {DATABASE.roster.find(r => r.name === p)?.shirtName || p.split(' ')[0]}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {item.videoUrl && (
              <a href={item.videoUrl} target="_blank" rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                style={{background:'rgba(255,0,0,0.15)', color:'#ff6b6b', border:'1px solid rgba(255,0,0,0.25)'}}>
                <Play className="w-3 h-3" fill="currentColor"/> Vídeo
              </a>
            )}
          </div>
        </div>

        {/* Strip de miniatures */}
        <div
          ref={thumbRef}
          className="flex gap-1.5 overflow-x-auto px-4 pb-5 pt-1"
          style={{scrollbarWidth:'none', msOverflowStyle:'none'}}>
          {items.map((it, i) => (
            <button
              key={i}
              className="shrink-0 rounded-lg overflow-hidden transition-all"
              style={{
                width: 48, height: 36,
                border: `2px solid ${i === idx ? 'rgba(255,255,255,0.8)' : 'transparent'}`,
                opacity: i === idx ? 1 : 0.35,
                transform: i === idx ? 'scale(1.1)' : 'scale(1)',
              }}
              onClick={e => { e.stopPropagation(); onJump(i); }}>
              {it.type === 'manual'
                ? <img src={`${BASE}${it.url}`} className="w-full h-full object-cover" loading="lazy"/>
                : <img src={`https://img.youtube.com/vi/${it.youtubeId}/default.jpg`} className="w-full h-full object-cover" loading="lazy"/>
              }
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Component principal ───────────────────────────────────────────
export default function Galeria() {
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [filter, setFilter] = useState('all');

  const allItems = useMemo(() => buildGallery(), []);

  const filtered = useMemo(() => {
    if (filter === 'all') return allItems;
    return allItems.filter(i => i.matchId === filter);
  }, [allItems, filter]);

  const openLightbox  = useCallback(i => setLightboxIdx(i), []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prevItem      = useCallback(() => setLightboxIdx(i => Math.max(0, i - 1)), []);
  const nextItem      = useCallback(() => setLightboxIdx(i => Math.min(filtered.length - 1, i + 1)), [filtered.length]);
  const jumpItem      = useCallback(i => setLightboxIdx(i), []);

  const matchesWithContent = DATABASE.matches.filter(m => allItems.some(i => i.matchId === m.id));

  if (allItems.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Image className="w-12 h-12 mb-4 opacity-15" style={{color:'#E5C07B'}}/>
      <p className="text-white font-bold">Galeria buida</p>
      <p className="text-gray-700 text-xs mt-2 max-w-xs">
        Per afegir fotos posa el camp <code className="text-gray-500">photo</code> als moments de la retransmissió des del panel admin.
      </p>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-5">

      {/* Capçalera */}
      <div>
        <h2 className="text-3xl font-black text-white mb-0.5">Galeria</h2>
        <p className="text-gray-500 text-sm">{allItems.length} moments capturats</p>
      </div>

      {/* Filtres per jornada */}
      {matchesWithContent.length > 1 && (
        <div className="flex gap-1.5 flex-wrap">
          {[{ id: 'all', label: 'Tots' }, ...matchesWithContent.map(m => ({
            id: m.id,
            label: `${m.jornada.replace('Jornada ', 'J')} vs ${m.opponent}`,
          }))].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
              style={{
                background:   filter === f.id ? 'rgba(229,192,123,0.15)' : 'transparent',
                color:        filter === f.id ? '#E5C07B'                 : 'rgba(255,255,255,0.35)',
                borderColor:  filter === f.id ? 'rgba(229,192,123,0.4)'  : 'rgba(255,255,255,0.08)',
              }}>
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-700">
          <Image className="w-8 h-8 mx-auto mb-3 opacity-20"/>
          <p className="text-sm">Sense fotos per aquesta jornada</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {filtered.map((item, idx) => (
            <GalleryCard key={idx} item={item} onClick={() => openLightbox(idx)}/>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          items={filtered}
          idx={lightboxIdx}
          onClose={closeLightbox}
          onPrev={prevItem}
          onNext={nextItem}
          onJump={jumpItem}
        />
      )}
    </div>
  );
}
