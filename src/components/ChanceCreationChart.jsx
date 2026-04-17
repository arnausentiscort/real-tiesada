import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DATABASE } from '../data.js';
import { calcGlobalStats } from '../utils.js';

const BASE = import.meta.env.BASE_URL;

const PLAYER_COLORS = {
  "Arnau Sentis":  "#E5C07B",
  "Roger Miro":    "#61AFEF",
  "Joan Medina":   "#98C379",
  "Pau Ibañez":    "#C678DD",
  "Roi Seoane":    "#E06C75",
  "Oriol Tomas":   "#56B6C2",
  "Paco Montero":  "#D19A66",
  "Andreu Cases":  "#ABB2BF",
  "Chengzhi Li":   "#BE5046",
  "Ivan Mico":     "#21C7A8",
  "Marc Farreras": "#F0A500",
};

const DOT_POP = `
@keyframes dotPop {
  0%   { transform: scale(0); opacity: 0; }
  65%  { transform: scale(1.25); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}`;

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function sName(name) {
  return DATABASE.roster.find(p => p.name === name)?.shirtName || name.split(' ')[0];
}

export default function ChanceCreationChart() {
  const stats = useMemo(() => calcGlobalStats(DATABASE), []);
  const [hovered, setHovered] = useState(null);
  const [ref, inView] = useInView();

  const data = useMemo(() => {
    return DATABASE.roster.map(p => {
      const kp       = stats.keyPasses?.find(([n]) => n === p.name)?.[1] || 0;
      const goals    = stats.topScorers?.find(([n]) => n === p.name)?.[1] || 0;
      const assists  = stats.topAssists?.find(([n]) => n === p.name)?.[1] || 0;
      const mins     = stats.totalMinutes?.find(([n]) => n === p.name)?.[1] || 0;
      const shotsOT  = stats.shotsOnTarget?.find(([n]) => n === p.name)?.[1] || 0;
      const shotsAll = stats.shotsTotal?.find(([n]) => n === p.name)?.[1] || 0;
      const dribs    = stats.dribbles?.find(([n]) => n === p.name)?.[1] || 0;
      const fantasies = kp + dribs;
      return { name: p.name, photo: p.photo, kp, goals, assists, y: goals + assists, x: fantasies, mins, shotsOT, shotsAll, dribs };
    }).filter(p => p.mins > 0);
  }, [stats]);

  const W = 480, H = 300;
  const PAD = { top: 28, right: 24, bottom: 38, left: 38 };
  const IW = W - PAD.left - PAD.right;
  const IH = H - PAD.top - PAD.bottom;

  const maxX    = Math.max(...data.map(p => p.x), 3);
  const maxY    = Math.max(...data.map(p => p.y), 3);
  const maxMins = Math.max(...data.map(p => p.mins), 1);

  const domX  = maxX + 1;
  const domY  = maxY + 1;
  const toX   = (x) => PAD.left + (x / domX) * IW;
  const toY   = (y) => PAD.top + IH - (y / domY) * IH;
  const dotR  = (mins) => 7 + Math.sqrt(mins / maxMins) * 13;

  const xMid = toX(domX / 2);
  const yMid = toY(domY / 2);

  const xTicks = [...new Set([0, Math.round(maxX / 2), maxX])];
  const yTicks = [...new Set([0, Math.round(maxY / 2), maxY])];

  // clipPaths need absolute coords (no parent transform used)
  const photoPlayers = data.filter(p => p.photo);

  return (
    <div ref={ref} className="bg-[#1E1E1E] rounded-2xl border border-white/5 p-5">
      <style>{DOT_POP}</style>

      <div className="mb-4">
        <h3 className="text-sm font-black text-[#E5C07B]">⚡ Creació de Perill</h3>
        <p className="text-[10px] text-gray-600 mt-0.5">
          Fantasies = Key passes + Regats (eix X) · Gols + Assists (eix Y) · Mida = minuts jugats
        </p>
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          {photoPlayers.map((p, i) => {
            const cx = toX(p.x);
            const cy = toY(p.y);
            const r  = dotR(p.mins);
            return (
              <clipPath key={p.name} id={`ccc-clip-${i}`}>
                <circle cx={cx} cy={cy} r={r} />
              </clipPath>
            );
          })}
        </defs>

        {/* Plot background */}
        <rect x={PAD.left} y={PAD.top} width={IW} height={IH}
          fill="rgba(0,0,0,0.25)" rx="6" />

        {/* Quadrant tints */}
        <rect x={xMid}      y={PAD.top}   width={PAD.left+IW-xMid}  height={yMid-PAD.top}
          fill="rgba(229,192,123,0.05)" />
        <rect x={PAD.left}  y={PAD.top}   width={xMid-PAD.left}      height={yMid-PAD.top}
          fill="rgba(97,175,239,0.03)" />
        <rect x={xMid}      y={yMid}      width={PAD.left+IW-xMid}  height={PAD.top+IH-yMid}
          fill="rgba(39,174,96,0.03)" />

        {/* Quadrant dividers */}
        <line x1={xMid} y1={PAD.top}  x2={xMid}       y2={PAD.top+IH}
          stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="3,5" />
        <line x1={PAD.left} y1={yMid} x2={PAD.left+IW} y2={yMid}
          stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="3,5" />

        {/* Quadrant labels */}
        <text x={xMid+5}    y={PAD.top+11} fontSize="7.5" fill="rgba(229,192,123,0.4)" fontWeight="bold">
          Creadors i Finalitzadors
        </text>
        <text x={PAD.left+4} y={PAD.top+11} fontSize="7.5" fill="rgba(97,175,239,0.4)" fontWeight="bold">
          Finalitzadors
        </text>
        <text x={xMid+5}    y={PAD.top+IH-6} fontSize="7.5" fill="rgba(39,174,96,0.35)" fontWeight="bold">
          Creadors
        </text>

        {/* Reference diagonal (normalized trend) */}
        <line x1={PAD.left} y1={PAD.top+IH} x2={PAD.left+IW} y2={PAD.top}
          stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" strokeDasharray="7,5" />

        {/* Light grid */}
        {xTicks.slice(1).map(v => (
          <line key={`xg-${v}`} x1={toX(v)} y1={PAD.top} x2={toX(v)} y2={PAD.top+IH}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {yTicks.slice(1).map(v => (
          <line key={`yg-${v}`} x1={PAD.left} y1={toY(v)} x2={PAD.left+IW} y2={toY(v)}
            stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}

        {/* Axes */}
        <line x1={PAD.left} y1={PAD.top+IH} x2={PAD.left+IW} y2={PAD.top+IH}
          stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <line x1={PAD.left} y1={PAD.top}    x2={PAD.left}    y2={PAD.top+IH}
          stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

        {/* X ticks + label */}
        {xTicks.map(v => (
          <g key={`xt-${v}`}>
            <line x1={toX(v)} y1={PAD.top+IH} x2={toX(v)} y2={PAD.top+IH+4}
              stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <text x={toX(v)} y={PAD.top+IH+13} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.35)">
              {v}
            </text>
          </g>
        ))}
        <text x={PAD.left+IW/2} y={H-2} textAnchor="middle" fontSize="8.5"
          fill="rgba(229,192,123,0.55)" fontWeight="bold">Fantasies (KP + Regats)</text>

        {/* Y ticks + label */}
        {yTicks.map(v => (
          <g key={`yt-${v}`}>
            <line x1={PAD.left-4} y1={toY(v)} x2={PAD.left} y2={toY(v)}
              stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <text x={PAD.left-7} y={toY(v)+3} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.35)">
              {v}
            </text>
          </g>
        ))}
        <text x={11} y={PAD.top+IH/2} textAnchor="middle" fontSize="8.5"
          fill="rgba(229,192,123,0.55)" fontWeight="bold"
          transform={`rotate(-90, 11, ${PAD.top+IH/2})`}>G+A</text>

        {/* Dots */}
        {data.map((p, i) => {
          const cx     = toX(p.x);
          const cy     = toY(p.y);
          const r      = dotR(p.mins);
          const color  = PLAYER_COLORS[p.name] || '#888888';
          const isHov  = hovered?.name === p.name;
          const photoIdx = photoPlayers.findIndex(d => d.name === p.name);
          const anim   = {
            transformBox: 'fill-box',
            transformOrigin: 'center',
            animation: inView ? `dotPop 0.55s cubic-bezier(0.34,1.56,0.64,1) ${i * 55}ms both` : 'none',
          };

          return (
            <g key={p.name} style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setHovered(h => h?.name === p.name ? null : p)}>

              {/* Glow on hover */}
              {isHov && (
                <circle cx={cx} cy={cy} r={r + 7} fill={color} opacity={0.14}
                  style={{ pointerEvents: 'none' }} />
              )}

              {p.photo && photoIdx !== -1 ? (
                <>
                  <circle cx={cx} cy={cy} r={r + 1.5}
                    fill="none"
                    stroke={color}
                    strokeWidth={isHov ? 2.5 : 1.5}
                    opacity={isHov ? 1 : 0.7}
                    style={anim} />
                  <image
                    href={`${BASE}${p.photo}`}
                    x={cx - r} y={cy - r} width={r * 2} height={r * 2}
                    clipPath={`url(#ccc-clip-${photoIdx})`}
                    preserveAspectRatio="xMidYMin slice"
                    style={anim} />
                </>
              ) : (
                <circle cx={cx} cy={cy} r={r}
                  fill={`${color}20`}
                  stroke={color}
                  strokeWidth={isHov ? 2.5 : 1.5}
                  style={anim} />
              )}

              {/* Initial if no photo */}
              {!p.photo && (
                <text x={cx} y={cy + r * 0.32} textAnchor="middle"
                  fontSize={r * 0.65} fill={color} fontWeight="bold"
                  style={{ ...anim, pointerEvents: 'none' }}>
                  {p.name[0]}
                </text>
              )}

              {/* Name label */}
              <text x={cx} y={cy + r + 10} textAnchor="middle" fontSize="7.5"
                fill={isHov ? color : 'rgba(255,255,255,0.45)'}
                fontWeight={isHov ? 'bold' : 'normal'}
                style={{ ...anim, pointerEvents: 'none' }}>
                {sName(p.name)}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {hovered && (() => {
          const cx    = toX(hovered.x);
          const cy    = toY(hovered.y);
          const r     = dotR(hovered.mins);
          const color = PLAYER_COLORS[hovered.name] || '#888888';
          const TW = 126, TH = 90;
          const tx = cx + r + 10 > PAD.left + IW - TW ? cx - r - 10 - TW : cx + r + 10;
          const ty = Math.max(PAD.top + 2, Math.min(cy - 20, PAD.top + IH - TH - 2));
          const rows = [
            ['Gols',       hovered.goals],
            ['Assists',    hovered.assists],
            ['Fantasies (KP+Reg)', hovered.x],
            ['Key passes', hovered.kp],
            ['Tirs porta', hovered.shotsOT],
            ['Regats',     hovered.dribs],
          ];
          return (
            <g style={{ pointerEvents: 'none' }}>
              <rect x={tx} y={ty} width={TW} height={TH} rx="6"
                fill="#141414" stroke={color} strokeWidth="1" strokeOpacity="0.55" fillOpacity="0.97" />
              <text x={tx + 8} y={ty + 14} fontSize="10" fontWeight="bold" fill={color}>
                {sName(hovered.name)}
              </text>
              {rows.map(([label, val], j) => (
                <g key={label}>
                  <text x={tx + 8}    y={ty + 27 + j * 13} fontSize="8.5" fill="rgba(255,255,255,0.38)">{label}</text>
                  <text x={tx + TW-8} y={ty + 27 + j * 13} fontSize="8.5" fill="rgba(255,255,255,0.85)" textAnchor="end">{val}</text>
                </g>
              ))}
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
