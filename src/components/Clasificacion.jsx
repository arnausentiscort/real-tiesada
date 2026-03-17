import React, { useState } from 'react';

const TABLA = [
  { pos: 1, equipo: 'Ensaimada',    pj:4, pg:4, pe:0, pp:0, gf:25, gc:8,  pts:12, forma: ['V','V','V','V'], esNosaltres: false },
  { pos: 2, equipo: 'Uruks',        pj:4, pg:4, pe:0, pp:0, gf:17, gc:11, pts:12, forma: ['V','V','V','V'], esNosaltres: false },
  { pos: 3, equipo: 'Touchla FC',   pj:4, pg:3, pe:0, pp:1, gf:14, gc:11, pts:9,  forma: ['D','V','V','V'], esNosaltres: false },
  { pos: 4, equipo: 'Dgeneracion',  pj:3, pg:2, pe:0, pp:1, gf:16, gc:7,  pts:6,  forma: ['V','V','D'],     esNosaltres: false },
  { pos: 5, equipo: 'Vietkong',     pj:3, pg:1, pe:0, pp:2, gf:9,  gc:9,  pts:3,  forma: ['D','V','D'],     esNosaltres: false },
  { pos: 6, equipo: 'Great Spirit', pj:4, pg:1, pe:0, pp:3, gf:11, gc:16, pts:3,  forma: ['D','V','D','D'], esNosaltres: false },
  { pos: 7, equipo: 'Vikings',      pj:3, pg:1, pe:0, pp:2, gf:6,  gc:12, pts:3,  forma: ['D','V','D'],     esNosaltres: false },
  { pos: 8, equipo: 'Fabbas FC',    pj:3, pg:0, pe:0, pp:3, gf:7,  gc:17, pts:0,  forma: ['D','D','D'],     esNosaltres: false },
  { pos: 9, equipo: 'Real Tiesada', pj:4, pg:0, pe:0, pp:4, gf:10, gc:24, pts:0,  forma: ['D','D','D','D'], esNosaltres: true  },
];

function FormaCircle({ r }) {
  const color = r === 'V' ? '#4ade80' : r === 'E' ? '#facc15' : '#f87171';
  return <span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background:color, margin:'0 2px' }}/>;
}

export default function Clasificacion() {
  const [showIframe, setShowIframe] = useState(false);

  const nosaltres = TABLA.find(e => e.esNosaltres);

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-3xl font-black text-white mb-1">Classificació</h2>
        <p className="text-gray-500 text-sm">Dilluns 2a Lliga 25-26</p>
      </header>

      {/* Targeta posició nostra */}
      {nosaltres && (
        <div className="bg-[#1a1a1a] border border-[#E5C07B]/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="text-4xl font-black text-[#E5C07B]">#{nosaltres.pos}</div>
          <div>
            <p className="text-white font-bold">Real Tiesada</p>
            <p className="text-gray-500 text-sm">{nosaltres.pts} punts · {nosaltres.pj} partits jugats · GD {nosaltres.gf - nosaltres.gc}</p>
          </div>
        </div>
      )}

      {/* Taula */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
        {/* Capçalera */}
        <div className="grid text-[10px] font-bold text-gray-600 uppercase tracking-wider px-4 py-2 border-b border-white/5"
          style={{ gridTemplateColumns: '28px 1fr 36px 28px 28px 28px 36px 36px 36px 60px' }}>
          <span>Pos</span>
          <span>Equip</span>
          <span className="text-center">Pts</span>
          <span className="text-center">PJ</span>
          <span className="text-center">G</span>
          <span className="text-center">E</span>
          <span className="text-center">P</span>
          <span className="text-center">GF</span>
          <span className="text-center">GC</span>
          <span className="text-center">Últims</span>
        </div>

        {TABLA.map((eq, i) => {
          const isUs = eq.esNosaltres;
          const dg = eq.gf - eq.gc;
          return (
            <div key={eq.equipo}
              className={`grid items-center px-4 py-3 border-b border-white/5 last:border-0 transition-colors
                ${isUs ? 'bg-[#E5C07B]/5 border-l-2 border-l-[#E5C07B]' : 'hover:bg-white/[0.02]'}`}
              style={{ gridTemplateColumns: '28px 1fr 36px 28px 28px 28px 36px 36px 36px 60px' }}>

              {/* Posició */}
              <span className={`text-sm font-black ${i < 2 ? 'text-[#E5C07B]' : i < 4 ? 'text-gray-400' : 'text-gray-600'}`}>
                {eq.pos}
              </span>

              {/* Nom */}
              <span className={`text-sm font-semibold truncate ${isUs ? 'text-[#E5C07B]' : 'text-white'}`}>
                {eq.equipo}
                {isUs && <span className="ml-1 text-[9px] text-[#E5C07B]/60">← nosaltres</span>}
              </span>

              {/* Punts */}
              <span className={`text-center text-sm font-black ${isUs ? 'text-[#E5C07B]' : 'text-white'}`}>
                {eq.pts}
              </span>

              <span className="text-center text-xs text-gray-400">{eq.pj}</span>
              <span className="text-center text-xs text-emerald-400">{eq.pg}</span>
              <span className="text-center text-xs text-yellow-400">{eq.pe}</span>
              <span className="text-center text-xs text-red-400">{eq.pp}</span>
              <span className="text-center text-xs text-gray-400">{eq.gf}</span>
              <span className="text-center text-xs text-gray-400">{eq.gc}</span>

              {/* Forma */}
              <span className="flex items-center justify-center gap-0">
                {(eq.forma || []).map((r, j) => <FormaCircle key={j} r={r} />)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Línia de descens */}
      <p className="text-xs text-gray-700 text-center">— Les posicions 8a i 9a estan en zona de descens —</p>

      {/* Botó apuntamelo */}
      <button onClick={() => setShowIframe(!showIframe)}
        className="w-full py-2 text-xs text-gray-600 hover:text-gray-400 border border-white/5 rounded-xl transition-colors">
        {showIframe ? 'Tancar' : 'Veure classificació oficial ↗'}
      </button>

      {showIframe && (
        <iframe
          src="https://apuntamelo.com/clasificacion-grupo/9/14/0/642/0/3354/2"
          className="w-full rounded-xl border border-white/10"
          style={{ height: 500 }}
          title="Classificació oficial"
        />
      )}
    </div>
  );
}
