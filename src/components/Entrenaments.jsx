import React, { useState, useMemo } from 'react';
import DrillPlayer from './DrillPlayer.jsx';
import { DRILLS, DRILL_CATEGORIES } from '../drills.js';
import { loadCustomDrills, deleteCustomDrill } from '../drillStore.js';
import { goTo } from '../router.js';

const MODE_LABEL = { fs5: 'Sala 5v5', f7: 'Futbol 7', f11: 'Futbol 11' };

const SECTIONS = [
  { id: 'defensa', label: 'Defensa',           icon: '🛡️', cats: ['defensa', 'pressio'] },
  { id: 'atac',    label: 'Atac',              icon: '⚡', cats: ['atac'] },
  { id: 'abp',     label: 'Jugades assajades', icon: '🎯', cats: ['abp'] },
];
const sectionOf = (d) => SECTIONS.find(sec => sec.cats.includes(d.category))?.id || 'defensa';

function DrillCard({ drill, onOpen, onDelete }) {
  const cat = DRILL_CATEGORIES[drill.category] || DRILL_CATEGORIES.pressio;
  return (
    <button onClick={() => onOpen(drill)}
      className={`text-left bg-[#1E1E1E] border rounded-2xl p-3.5 hover:border-[#E5C07B]/40 hover:bg-[#232323] transition-all group w-full ${
        drill.featured ? 'border-[#E5C07B]/35 shadow-[0_0_0_1px_rgba(229,192,123,0.08)]' : 'border-white/5'}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs px-2 py-0.5 rounded-lg font-bold"
          style={{ background: `${cat.color}22`, color: cat.color }}>
          {cat.icon} {cat.label}
        </span>
        <span className="text-[10px] text-gray-600 font-bold">{MODE_LABEL[drill.mode]}</span>
        {drill.custom && <span className="text-[10px] text-[#E5C07B]/70 font-bold">· pròpia</span>}
        {drill.featured && <span className="text-[10px] text-[#E5C07B] font-black">★ clau</span>}
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

export default function Entrenaments({ drillId = null }) {
  const [cat, setCat]     = useState('all');
  const [custom, setCustom] = useState(() => loadCustomDrills());
  const [copied, setCopied] = useState(false);

  const all = useMemo(
    () => [...custom.map(d => ({ ...d, custom: true })), ...DRILLS],
    [custom]
  );
  // Dins de cada secció, les destacades primer
  const bySection = SECTIONS.map(sec => ({
    ...sec,
    items: all.filter(d => sectionOf(d) === sec.id)
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured)),
  })).filter(sec => sec.items.length && (cat === 'all' || cat === sec.id));

  // La jugada oberta viu a la URL (#/tactica/<id>), així es pot enviar pel grup
  const open = drillId ? all.find(d => d.id === drillId) : null;
  const openDrill  = (drill) => goTo('/tactica/' + encodeURIComponent(drill.id));
  const closeDrill = ()      => goTo('/tactica');

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { window.prompt('Copia l’enllaç:', window.location.href); }
  };

  const handleDelete = (drill) => {
    if (!window.confirm(`Esborrar la jugada "${drill.title}"?`)) return;
    deleteCustomDrill(drill.id);
    setCustom(loadCustomDrills());
    if (drillId === drill.id) closeDrill();
  };

  // Enllaç a una jugada que ja no existeix: tornem al catàleg
  if (drillId && !open) {
    return (
      <div className="space-y-3">
        <p className="text-xs text-gray-500">Aquesta jugada ja no existeix.</p>
        <button onClick={closeDrill}
          className="text-xs text-[#E5C07B] font-bold hover:underline">← Totes les jugades</button>
      </div>
    );
  }

  // ── Detall d'una jugada ────────────────────────────────────────
  if (open) {
    const c = DRILL_CATEGORIES[open.category] || DRILL_CATEGORIES.pressio;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button onClick={closeDrill}
            className="text-xs text-gray-500 hover:text-[#E5C07B] transition-colors font-bold">
            ← Totes les jugades
          </button>
          <span className="flex-1"/>
          <button onClick={copyLink}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold border bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
            {copied ? '✓ Enllaç copiat' : '🔗 Enviar al grup'}
          </button>
        </div>

        <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-3 md:p-4">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[11px] px-2 py-0.5 rounded-lg font-bold"
              style={{ background: `${c.color}22`, color: c.color }}>{c.icon} {c.label}</span>
            <span className="text-[10px] text-gray-600 font-bold">{MODE_LABEL[open.mode]}</span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-[#E5C07B] mb-3">{open.title}</h2>

          <div className={open.video?.youtubeId ? 'grid md:grid-cols-[1fr_260px] gap-3 md:gap-4 items-start' : ''}>
            <DrillPlayer drill={open} autoPlay />

            <div className="space-y-3">
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
        {SECTIONS.map(sec => (
          <button key={sec.id} onClick={() => setCat(sec.id)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
              cat === sec.id ? 'bg-[#E5C07B]/15 border-[#E5C07B]/30 text-[#E5C07B]' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}>
            {sec.icon} {sec.label}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-gray-600 leading-snug">
        Daurat = moviment · blanc = passada · vermell = pressió · verd = conducció · verd ple = cap a l'espai · vermell discontinu = no
      </p>

      {bySection.map(sec => (
        <section key={sec.id} className="space-y-2 pt-1">
          <h3 className="flex items-center gap-2 text-sm font-black text-white uppercase tracking-wider">
            <span>{sec.icon}</span>{sec.label}
            <span className="flex-1 h-px bg-white/10 ml-1"/>
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {sec.items.map(d => <DrillCard key={d.id} drill={d} onOpen={openDrill} onDelete={handleDelete}/>)}
          </div>
        </section>
      ))}

      {bySection.length === 0 && (
        <p className="text-xs text-gray-700 italic py-8 text-center">Cap jugada en aquesta categoria.</p>
      )}
    </div>
  );
}
