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
// Per afegir una foto a la galeria: posa `photo` al moment de retransmissió
// Per tenir dos frames (normal + hover/acció): posa `photoHover`
// Per associar un frame de YouTube específic: posa `photoTimestamp` (segon del vídeo)
function buildGallery() {
  const items = [];

  DATABASE.matches.forEach(match => {
    // Moments de la retransmissió amb foto manual
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

    // Moments amb photoTimestamp (frame específic de YouTube sense foto manual)
    if (match.youtubeId) {
      (match.events?.retransmissio || []).forEach(r => {
        if (r.photo) return; // ja té foto manual
        if (!r.photoTimestamp) return; // no té frame especificat
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
    const mi = DATABASE.matches.findIndex(m=>m.id===a.matchId) - DATABASE.matches.findIndex(m=>m.id===b.matchId);
    return mi !== 0 ? mi : parseTime(a.time) - parseTime(b.time);
  });

  return items;
}

// ── Targeta foto manual ───────────────────────────────────────────
function ManualCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-xl aspect-video bg-black select-none"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <img
        src={`${BASE}${hovered && item.photoHover ? item.photoHover : item.url}`}
        alt={item.caption}
        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
        loading="lazy"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
      {item.photoHover && (
        <div className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-md font-bold opacity-0 group-hover:opacity-100 transition-opacity"
          style={{background:'rgba(0,0,0,0.7)', color:'rgba(255,255,255,0.5)'}}>
          🎬 hover
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-[10px] font-semibold leading-snug line-clamp-2">{item.caption}</p>
        <p className="text-gray-400 text-[9px] mt-0.5">{item.jornada} · min {item.time}</p>
      </div>
    </div>
  );
}

// ── Targeta frame YouTube (amb timestamp específic) ───────────────
function YTFrameCard({ item, onClick }) {
  // Usa el thumbnail HD del vídeo (no és frame exacte però és representatiu)
  const thumb = `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-xl aspect-video bg-[#111] select-none"
      onClick={onClick}>
      <img src={thumb} alt={item.caption}
        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
        loading="lazy"/>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"/>
      {/* Play overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{background:'rgba(255,0,0,0.85)'}}>
          <Play className="w-4 h-4 text-white ml-0.5" fill="white"/>
        </div>
      </div>
      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold"
        style={{background:'rgba(0,0,0,0.7)', color:'rgba(255,255,255,0.7)'}}>
        {item.time}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p className="text-white text-[10px] font-semibold leading-snug line-clamp-2">{item.caption}</p>
        <p className="text-gray-400 text-[9px] mt-0.5">{item.jornada} · min {item.time}</p>
      </div>
    </div>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────
function Lightbox({ items, idx, onClose, onPrev, onNext }) {
  const item = items[idx];
  const [hovered, setHovered] = useState(false);
  const touchStart = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose, onPrev, onNext]);

  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(dx) > 50) dx < 0 ? onNext() : onPrev();
    touchStart.current = null;
  };

  const isManual = item.type === 'manual';

  return (
    <div className="fixed inset-0 z-[400] flex flex-col items-center justify-center"
      style={{background:'rgba(0,0,0,0.97)'}}
      onClick={onClose}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

      <button className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
        style={{background:'rgba(255,255,255,0.1)'}} onClick={onClose}>
        <X className="w-4 h-4"/>
      </button>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-gray-600 font-mono">
        {idx+1} / {items.length}
      </div>

      <div className="w-full max-w-4xl px-4 flex flex-col items-center gap-4"
        onClick={e=>e.stopPropagation()}>

        {/* Imatge */}
        <div className="relative w-full rounded-xl overflow-hidden" style={{maxHeight:'65vh'}}>
          {isManual ? (
            <img
              src={`${BASE}${hovered && item.photoHover ? item.photoHover : item.url}`}
              alt={item.caption}
              className="w-full h-full object-contain"
              onMouseEnter={()=>setHovered(true)}
              onMouseLeave={()=>setHovered(false)}/>
          ) : (
            <img src={`https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`}
              alt={item.caption} className="w-full h-full object-cover"
              onError={e=>{ e.target.src=`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`; }}/>
          )}
          {isManual && item.photoHover && (
            <div className="absolute bottom-3 right-3 text-[10px] px-2 py-1 rounded-full font-bold"
              style={{background:'rgba(0,0,0,0.7)', color:hovered?'#E5C07B':'rgba(255,255,255,0.4)'}}>
              {hovered ? '▶ acció' : '🖱 hover per acció'}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="w-full flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold leading-snug">{item.caption}</p>
            <p className="text-gray-500 text-xs mt-1">{item.jornada} vs {item.opponent} · min {item.time}</p>
            {item.players?.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {item.players.map(p => (
                  <span key={p} className="text-[10px] px-2 py-0.5 rounded-full border text-gray-400"
                    style={{borderColor:'rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.04)'}}>
                    {DATABASE.roster.find(r=>r.name===p)?.shirtName || p.split(' ')[0]}
                  </span>
                ))}
              </div>
            )}
          </div>
          {item.videoUrl && (
            <a href={item.videoUrl} target="_blank" rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold hover:opacity-80 transition-all"
              style={{background:'rgba(255,0,0,0.15)', color:'#ff6b6b', border:'1px solid rgba(255,0,0,0.25)'}}>
              <Play className="w-3 h-3" fill="currentColor"/> YouTube
            </a>
          )}
        </div>
      </div>

      {/* Prev/Next */}
      {idx > 0 && (
        <button className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
          style={{background:'rgba(255,255,255,0.1)'}}
          onClick={e=>{e.stopPropagation();onPrev();}}>
          <ChevronLeft className="w-5 h-5 text-white"/>
        </button>
      )}
      {idx < items.length-1 && (
        <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
          style={{background:'rgba(255,255,255,0.1)'}}
          onClick={e=>{e.stopPropagation();onNext();}}>
          <ChevronRight className="w-5 h-5 text-white"/>
        </button>
      )}

      {/* Strip miniatures */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 overflow-x-auto px-8"
        style={{scrollbarWidth:'none'}}>
        {items.map((it, i) => (
          <button key={i}
            className={`shrink-0 w-9 h-9 rounded-md overflow-hidden border-2 transition-all ${i===idx?'border-white opacity-100':'border-transparent opacity-35 hover:opacity-60'}`}
            onClick={e=>{e.stopPropagation();setLightboxIdx&&setLightboxIdx(i);}}>
            {it.type==='manual'
              ? <img src={`${BASE}${it.url}`} className="w-full h-full object-cover"/>
              : <img src={`https://img.youtube.com/vi/${it.youtubeId}/default.jpg`} className="w-full h-full object-cover"/>
            }
          </button>
        ))}
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
    return allItems.filter(i=>i.matchId===filter);
  }, [allItems, filter]);

  const openLightbox  = useCallback((i) => setLightboxIdx(i), []);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const prevItem = useCallback(() => setLightboxIdx(i => Math.max(0, i-1)), []);
  const nextItem = useCallback(() => setLightboxIdx(i => Math.min(filtered.length-1, i+1)), [filtered.length]);

  const matchesWithContent = DATABASE.matches.filter(m=>allItems.some(i=>i.matchId===m.id));

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-3xl font-black text-white mb-1">Galeria</h2>
        <p className="text-gray-500 text-sm">{allItems.length} moments capturats</p>
      </div>

      {/* Filtres per jornada */}
      {matchesWithContent.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {[{id:'all', label:'Tots'}, ...matchesWithContent.map(m=>({id:m.id, label:`${m.jornada} vs ${m.opponent}`}))].map(f => (
            <button key={f.id} onClick={()=>setFilter(f.id)}
              className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
              style={{
                background: filter===f.id?'rgba(229,192,123,0.15)':'transparent',
                color: filter===f.id?'#E5C07B':'rgba(255,255,255,0.4)',
                borderColor: filter===f.id?'rgba(229,192,123,0.4)':'rgba(255,255,255,0.1)',
              }}>
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-700">
          <Image className="w-10 h-10 mx-auto mb-3 opacity-20"/>
          <p className="text-sm">Sense fotos per aquesta jornada</p>
          <p className="text-xs mt-1 text-gray-800">Afegeix <code>photo</code> als moments de la retransmissió des de l'admin</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {filtered.map((item, idx) => (
            item.type === 'manual'
              ? <ManualCard key={idx} item={item} onClick={()=>openLightbox(idx)}/>
              : <YTFrameCard key={idx} item={item} onClick={()=>openLightbox(idx)}/>
          ))}
        </div>
      )}

      {allItems.length === 0 && (
        <div className="text-center py-20 text-gray-700">
          <Image className="w-12 h-12 mx-auto mb-4 opacity-20"/>
          <p className="text-sm font-semibold">Galeria buida</p>
          <p className="text-xs mt-2 text-gray-800 max-w-xs mx-auto">
            Per afegir fotos, posa el camp <code className="text-gray-600">photo</code> a qualsevol moment de la retransmissió des del panel d'administració.
          </p>
        </div>
      )}

      {lightboxIdx !== null && (
        <Lightbox items={filtered} idx={lightboxIdx}
          onClose={closeLightbox} onPrev={prevItem} onNext={nextItem}/>
      )}
    </div>
  );
}
