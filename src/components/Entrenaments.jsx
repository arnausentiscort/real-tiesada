import React, { useState, useMemo } from 'react';
import DrillPlayer from './DrillPlayer.jsx';
import { DRILLS, DRILL_CATEGORIES } from '../drills.js';
import { loadCustomDrills, deleteCustomDrill } from '../drillStore.js';

const MODE_LABEL = { fs5: 'Sala 5v5', f7: 'Futbol 7', f11: 'Futbol 11' };

function DrillCard({ drill, onOpen, onDelete }) {
  const cat = DRILL_CATEGORIES[drill.category] || DRILL_CATEGORIES.pressio;
  return (
    <button onClick={() => onOpen(drill)}
      className="text-left bg-[#1E1E1E] border border-white/5 rounded-2xl p-3.5 hover:border-[#E5C07B]/30 hover:bg-[#232323] transition-all group w-full">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs px-2 py-0.5 rounded-lg font-bold"
          style={{ background: `${cat.color}22`, color: cat.color }}>
          {cat.icon} {cat.label}
        </span>
        <span className="text-[10px] text-gray-600 font-bold">{MODE_LABEL[drill.mode]}</span>
        {drill.custom && <span className="text-[10px] text-[#E5C07B]/70 font-bold">· pròpia</span>}
        <span className="flex-1"/>
        {drill.custom && onDelete && (
          <span role="button" tabIndex={0}
            onClick={e => { e.stopPropagation(); onDelete(drill); }}
            className="text-gray-700 hover:text-[#C0392B] text-sm px-1">🗑</span>
        )}
      </div>
      <h3 className="text-sm md:text-base font-black text-white group-hover:text-[#E5C07B] transition-colors leading-tight">
        {drill.title}
      </h3>
      {drill.summary && <p className="text-[11px] text-gray-500 mt-1 leading-snug">{drill.summary}</p>}
      <div className="flex items-center gap-2 mt-2.5 text-[10px] text-gray-600">
        <span>🎬 {drill.steps.length} fases</span>
        {drill.video?.youtubeId && <span>· 📹 vídeo real</span>}
        <span className="flex-1"/>
        <span className="text-[#E5C07B]/70 font-bold">Veure ▸</span>
      </div>
    </button>
  );
}

export default function Entrenaments() {
  const [open, setOpen]   = useState(null);
  const [cat, setCat]     = useState('all');
  const [custom, setCustom] = useState(() => loadCustomDrills());

  const all = useMemo(
    () => [...custom.map(d => ({ ...d, custom: true })), ...DRILLS],
    [custom]
  );
  const list = cat === 'all' ? all : all.filter(d => d.category === cat);

  const handleDelete = (drill) => {
    if (!window.confirm(`Esborrar la jugada "${drill.title}"?`)) return;
    deleteCustomDrill(drill.id);
    setCustom(loadCustomDrills());
    if (open?.id === drill.id) setOpen(null);
  };

  // ── Detall d'una jugada ────────────────────────────────────────
  if (open) {
    const c = DRILL_CATEGORIES[open.category] || DRILL_CATEGORIES.pressio;
    return (
      <div className="space-y-3">
        <button onClick={() => setOpen(null)}
          className="text-xs text-gray-500 hover:text-[#E5C07B] transition-colors font-bold">
          ← Totes les jugades
        </button>

        <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[11px] px-2 py-0.5 rounded-lg font-bold"
              style={{ background: `${c.color}22`, color: c.color }}>{c.icon} {c.label}</span>
            <span className="text-[10px] text-gray-600 font-bold">{MODE_LABEL[open.mode]}</span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-[#E5C07B] mb-3">{open.title}</h2>

          <div className="grid md:grid-cols-[1fr_260px] gap-3 md:gap-4 items-start">
            <DrillPlayer drill={open} autoPlay />

            <div className="space-y-3">
              {open.summary && (
                <p className="text-[12px] text-gray-400 leading-snug">{open.summary}</p>
              )}

              {open.keys?.length > 0 && (
                <div className="bg-[#121212] border border-white/5 rounded-xl p-3">
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mb-2">Punts clau</p>
                  <ul className="space-y-1.5">
                    {open.keys.map((k, i) => (
                      <li key={i} className="flex gap-2 text-[11.5px] text-gray-300 leading-snug">
                        <span className="text-[#E5C07B] shrink-0">•</span><span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {open.video?.youtubeId && (
                <div className="bg-[#121212] border border-white/5 rounded-xl p-3">
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mb-2">Al partit</p>
                  <div className="rounded-lg overflow-hidden aspect-video bg-black">
                    <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${open.video.youtubeId}${open.video.start ? `?start=${open.video.start}` : ''}`}
                      title={open.title} allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen frameBorder="0"/>
                  </div>
                </div>
              )}

              <div className="bg-[#121212] border border-white/5 rounded-xl p-3">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mb-2">Fases</p>
                <ol className="space-y-1.5">
                  {open.steps.map((s, i) => (
                    <li key={i} className="flex gap-2 text-[11px] text-gray-500 leading-snug">
                      <span className="text-[#E5C07B]/70 font-bold shrink-0">{i+1}.</span>
                      <span>{s.note}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Catàleg ────────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="text-base md:text-lg font-black text-[#E5C07B] mr-1">🎬 Jugades</h2>
        <button onClick={() => setCat('all')}
          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
            cat === 'all' ? 'bg-[#E5C07B]/15 border-[#E5C07B]/30 text-[#E5C07B]' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}>
          Totes
        </button>
        {Object.entries(DRILL_CATEGORIES).map(([key, c]) => (
          <button key={key} onClick={() => setCat(key)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
              cat === key ? 'border-transparent' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}
            style={cat === key ? { background: `${c.color}22`, color: c.color } : undefined}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-gray-600 leading-snug">
        Jugades animades pas a pas. Dona-li al play, para on vulguis i mira les fletxes:
        daurat = moviment sense pilota, blanc = passada, vermell = pressió.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {list.map(d => <DrillCard key={d.id} drill={d} onOpen={setOpen} onDelete={handleDelete}/>)}
      </div>

      {list.length === 0 && (
        <p className="text-xs text-gray-700 italic py-8 text-center">Cap jugada en aquesta categoria.</p>
      )}
    </div>
  );
}
