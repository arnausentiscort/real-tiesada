import React, { useState } from 'react';
import { useSeason } from '../SeasonContext.jsx';

function FormaCircle({ r }) {
  const color = r === 'V' ? '#4ade80' : r === 'E' ? '#facc15' : '#f87171';
  return <span style={{ display:'inline-block', width:9, height:9, borderRadius:'50%', background:color, margin:'0 1.5px', flexShrink:0 }}/>;
}

// Al mòbil només Pts, PJ, DG i forma: amb les 8 columnes el nom de l'equip
// es quedava en "I…" i no se sabia qui era qui
const COLS = 'grid grid-cols-[22px_minmax(0,1fr)_30px_24px_34px_62px] sm:grid-cols-[28px_minmax(0,1fr)_36px_28px_28px_28px_28px_36px_36px_36px_66px] gap-x-1';
const WIDE = 'hidden sm:block';

export default function Clasificacion() {
  const { db: DATABASE, season } = useSeason();
  const [showIframe, setShowIframe] = useState(false);

  const TABLA = DATABASE.classification;
  const nosaltres = TABLA.find(e => e.esNosaltres);
  const lastPos = TABLA.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-3xl font-black text-white mb-1">Classificació</h2>
        <p className="text-gray-500 text-sm">{DATABASE.leagueLabel || season.period}</p>
      </header>

      {TABLA.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-white font-bold">Encara no hi ha classificació</p>
          <p className="text-gray-700 text-xs mt-2 max-w-xs">
            Es publicarà quan comenci la lliga d'aquesta temporada.
          </p>
        </div>
      ) : (
        <>
          {/* Targeta posició nostra */}
          {nosaltres && (
            <div className="bg-[#1a1a1a] border border-[#E5C07B]/20 rounded-2xl p-4 flex items-center gap-4">
              <div className="text-4xl font-black text-[#E5C07B]">#{nosaltres.pos}</div>
              <div>
                <p className="text-white font-bold">Real Tiesada</p>
                <p className="text-gray-500 text-sm">{nosaltres.pts} punts · {nosaltres.pj} partits jugats · DG {nosaltres.gf - nosaltres.gc > 0 ? "+" : ""}{nosaltres.gf - nosaltres.gc}</p>
              </div>
            </div>
          )}

          {/* Taula */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
            {/* Capçalera */}
            <div className={`${COLS} text-[10px] font-bold text-gray-600 uppercase tracking-wider px-3 sm:px-4 py-2 border-b border-white/5`}>
              <span>Pos</span>
              <span>Equip</span>
              <span className="text-center">Pts</span>
              <span className="text-center">PJ</span>
              <span className={`${WIDE} text-center`}>G</span>
              <span className={`${WIDE} text-center`}>E</span>
              <span className={`${WIDE} text-center`}>P</span>
              <span className={`${WIDE} text-center`}>GF</span>
              <span className={`${WIDE} text-center`}>GC</span>
              <span className="text-center">DG</span>
              <span className="text-center">Últims</span>
            </div>

            {TABLA.map((eq, i) => {
              const isUs = eq.esNosaltres;
              return (
                <div key={eq.equipo}
                  className={`${COLS} items-center px-3 sm:px-4 py-3 border-b border-white/5 last:border-0 transition-colors
                    ${isUs ? 'bg-[#E5C07B]/5 border-l-2 border-l-[#E5C07B]' : 'hover:bg-white/[0.02]'}`}
>

                  {/* Posició */}
                  <span className={`text-sm font-black ${i < 2 ? 'text-[#E5C07B]' : i < 4 ? 'text-gray-400' : 'text-gray-600'}`}>
                    {eq.pos}
                  </span>

                  {/* Nom */}
                  <span className={`text-sm font-semibold truncate ${isUs ? 'text-[#E5C07B]' : 'text-white'}`}>
                    {eq.equipo}
                    {isUs && <span className="hidden sm:inline ml-1 text-[9px] text-[#E5C07B]/60">← nosaltres</span>}
                  </span>

                  {/* Punts */}
                  <span className={`text-center text-sm font-black ${isUs ? 'text-[#E5C07B]' : 'text-white'}`}>
                    {eq.pts}
                  </span>

                  <span className="text-center text-xs text-gray-400">{eq.pj}</span>
                  <span className={`${WIDE} text-center text-xs text-emerald-400`}>{eq.pg}</span>
                  <span className={`${WIDE} text-center text-xs text-yellow-400`}>{eq.pe}</span>
                  <span className={`${WIDE} text-center text-xs text-red-400`}>{eq.pp}</span>
                  <span className={`${WIDE} text-center text-xs text-gray-400`}>{eq.gf}</span>
                  <span className={`${WIDE} text-center text-xs text-gray-400`}>{eq.gc}</span>
                  <span className={`text-center text-xs font-bold ${eq.gf - eq.gc > 0 ? 'text-emerald-400' : eq.gf - eq.gc < 0 ? 'text-red-400/80' : 'text-gray-500'}`}>
                    {eq.gf - eq.gc > 0 ? '+' : ''}{eq.gf - eq.gc}
                  </span>

                  {/* Forma */}
                  <span className="flex items-center justify-center gap-0">
                    {(eq.forma || []).map((r, j) => <FormaCircle key={j} r={r} />)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Línia de descens */}
          {lastPos >= 2 && (
            <p className="text-xs text-gray-700 text-center">
              — Les posicions {lastPos - 1}a i {lastPos}a estan en zona de descens —
            </p>
          )}

          {/* Botó apuntamelo */}
          {DATABASE.classificationUrl && (
            <>
              <button onClick={() => setShowIframe(!showIframe)}
                className="w-full py-2 text-xs text-gray-600 hover:text-gray-400 border border-white/5 rounded-xl transition-colors">
                {showIframe ? 'Tancar' : 'Veure classificació oficial ↗'}
              </button>

              {showIframe && (
                <iframe
                  src={DATABASE.classificationUrl}
                  className="w-full rounded-xl border border-white/10"
                  style={{ height: 500 }}
                  title="Classificació oficial"
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
