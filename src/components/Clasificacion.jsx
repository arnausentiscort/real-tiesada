import React, { useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';

const CLASIFICACION_URL = 'https://apuntamelo.com/clasificacion-grupo/9/14/0/642/0/3354/2';

// Dades hardcoded de la classificació — actualitza-les manualment cada jornada
// o mira la URL de dalt
const TABLA = [
  { pos: 1,  equipo: 'Vikings FC',        pj:3, pg:3, pe:0, pp:0, gf:18, gc:6,  pts:9,  esNosaltres: false },
  { pos: 2,  equipo: 'Uruks',             pj:3, pg:2, pe:1, pp:0, gf:13, gc:7,  pts:7,  esNosaltres: false },
  { pos: 3,  equipo: 'Los Ensaimadas',    pj:3, pg:2, pe:0, pp:1, gf:15, gc:9,  pts:6,  esNosaltres: false },
  { pos: 4,  equipo: 'Atlètic Birra',     pj:3, pg:1, pe:1, pp:1, gf:11, gc:12, pts:4,  esNosaltres: false },
  { pos: 5,  equipo: 'Real Tiesada',      pj:3, pg:0, pe:0, pp:3, gf:8,  gc:19, pts:0,  esNosaltres: true  },
  { pos: 6,  equipo: 'Deportivo Gasofa',  pj:3, pg:0, pe:0, pp:3, gf:5,  gc:16, pts:0,  esNosaltres: false },
];

export default function Clasificacion() {
  const [showIframe, setShowIframe]   = useState(false);
  const [iframeError, setIframeError] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-3xl font-black text-white mb-1">Classificació</h2>
        <p className="text-gray-500 text-sm">Lliga de Futbol Sala · Temporada 25/26</p>
      </header>

      {/* Taula local */}
      <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h3 className="font-bold text-[#E5C07B]">Taula de Classificació</h3>
          <a
            href={CLASIFICACION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#E5C07B] transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Veure a apuntamelo.com
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-600 border-b border-white/5">
                <th className="text-left pl-5 py-3 w-8">#</th>
                <th className="text-left py-3">Equip</th>
                <th className="text-center py-3 px-2">PJ</th>
                <th className="text-center py-3 px-2 text-emerald-500/70">PG</th>
                <th className="text-center py-3 px-2 text-yellow-500/70">PE</th>
                <th className="text-center py-3 px-2 text-[#C0392B]/70">PP</th>
                <th className="text-center py-3 px-2 hidden sm:table-cell">GF</th>
                <th className="text-center py-3 px-2 hidden sm:table-cell">GC</th>
                <th className="text-center py-3 px-2 hidden sm:table-cell">Dif</th>
                <th className="text-center py-3 pr-5 font-black text-[#E5C07B]">Pts</th>
              </tr>
            </thead>
            <tbody>
              {TABLA.map((equip, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-white/5 last:border-0 transition-colors
                    ${equip.esNosaltres
                      ? 'bg-[#C0392B]/8 border-[#C0392B]/20'
                      : 'hover:bg-white/3'}`}
                >
                  <td className="pl-5 py-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black
                      ${equip.pos === 1 ? 'bg-[#E5C07B] text-black' :
                        equip.pos === 2 ? 'bg-gray-400 text-black' :
                        equip.pos === 3 ? 'bg-amber-700 text-white' : 'bg-white/5 text-gray-500'}`}>
                      {equip.pos}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {equip.esNosaltres && (
                        <img src={`${import.meta.env.BASE_URL}escut.svg`} alt="" className="w-5 h-5 shrink-0" />
                      )}
                      <span className={`font-medium ${equip.esNosaltres ? 'text-[#E5C07B] font-black' : ''}`}>
                        {equip.equipo}
                      </span>
                      {equip.esNosaltres && (
                        <span className="text-xs bg-[#C0392B]/20 text-[#C0392B] px-1.5 py-0.5 rounded-full font-bold">nosaltres</span>
                      )}
                    </div>
                  </td>
                  <td className="text-center py-3 px-2 text-gray-400">{equip.pj}</td>
                  <td className="text-center py-3 px-2 text-emerald-400 font-bold">{equip.pg}</td>
                  <td className="text-center py-3 px-2 text-yellow-400">{equip.pe}</td>
                  <td className="text-center py-3 px-2 text-[#C0392B]">{equip.pp}</td>
                  <td className="text-center py-3 px-2 hidden sm:table-cell text-gray-400">{equip.gf}</td>
                  <td className="text-center py-3 px-2 hidden sm:table-cell text-gray-400">{equip.gc}</td>
                  <td className="text-center py-3 px-2 hidden sm:table-cell">
                    <span className={`text-xs font-mono ${equip.gf - equip.gc > 0 ? 'text-emerald-400' : equip.gf - equip.gc < 0 ? 'text-[#C0392B]' : 'text-gray-500'}`}>
                      {equip.gf - equip.gc > 0 ? '+' : ''}{equip.gf - equip.gc}
                    </span>
                  </td>
                  <td className="text-center py-3 pr-5">
                    <span className={`font-black text-lg ${equip.esNosaltres ? 'text-[#E5C07B]' : 'text-white'}`}>
                      {equip.pts}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nota actualització */}
        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-gray-700 flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3" />
            Actualitza manualment a <code className="text-gray-600">src/components/Clasificacion.jsx</code> → array <code className="text-gray-600">TABLA</code>
          </p>
        </div>
      </div>

      {/* Iframe apuntamelo */}
      <div className="bg-[#1E1E1E] rounded-2xl border border-white/5 overflow-hidden">
        <div
          className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/3 transition-colors"
          onClick={() => setShowIframe(!showIframe)}
        >
          <div>
            <div className="font-bold text-[#E5C07B]">📡 Classificació en directe</div>
            <div className="text-xs text-gray-600">Des d'apuntamelo.com (pot trigar)</div>
          </div>
          <span className="text-gray-500 text-sm">{showIframe ? '▲ Tancar' : '▼ Obrir'}</span>
        </div>

        {showIframe && (
          <div className="border-t border-white/5">
            {!iframeError ? (
              <iframe
                src={CLASIFICACION_URL}
                className="w-full"
                style={{ height: '600px', border: 'none', background: '#fff' }}
                onError={() => setIframeError(true)}
                title="Classificació apuntamelo"
              />
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">El site no permet mostrar-se dins la web.</p>
                <a
                  href={CLASIFICACION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#C0392B] text-white px-4 py-2 rounded-xl font-bold hover:brightness-110 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Obrir a apuntamelo.com
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
