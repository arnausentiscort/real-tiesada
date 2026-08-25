import React from 'react';

// ── Camp de futbol sala — pista 40×20, àrea semicircular de 6 m ────
function Fs5Field({ w, h }) {
  const midX = w / 2, midY = h / 2;
  return (
    <>
      {/* Gespa — franges alternades */}
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={18 + i * 95.5} y="18" width="95.5" height={h - 36}
          fill={i % 2 === 0 ? '#1c3d1c' : '#193619'} />
      ))}
      <rect x="0" y="0" width={w} height={h} fill="none" />

      {/* Línies del camp */}
      <rect x="18" y="18" width={w - 36} height={h - 36} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" />
      <line x1={midX} y1="18" x2={midX} y2={h - 18} stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
      <circle cx={midX} cy={midY} r="185" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
      <circle cx={midX} cy={midY} r="4" fill="rgba(255,255,255,0.8)" />

      {/* Àrea semicircular de 6 m — porteria pròpia */}
      <path d={`M18,${midY - 130} A70,70 0 0,1 88,${midY - 60} L88,${midY + 60} A70,70 0 0,1 18,${midY + 130}`}
        fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
      <line x1="88" y1={midY - 60} x2="88" y2={midY + 60} stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
      <rect x="3" y={midY - 25} width="15" height="50" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" rx="1" />

      {/* Àrea semicircular de 6 m — porteria rival */}
      <path d={`M${w - 18},${midY - 130} A70,70 0 0,0 ${w - 88},${midY - 60} L${w - 88},${midY + 60} A70,70 0 0,0 ${w - 18},${midY + 130}`}
        fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
      <line x1={w - 88} y1={midY - 60} x2={w - 88} y2={midY + 60} stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
      <rect x={w - 18} y={midY - 25} width="15" height="50" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" rx="1" />
    </>
  );
}

// ── Camp de futbol 7 — ~65×45, àrea rectangular, banderins ─────────
function F7Field({ w, h, goalX, goalY }) {
  const midX = w / 2;
  const areaW = 90, areaH = 180;
  const boxW = 15, boxH = 50;
  const flag = (x, y, mirrorX, mirrorY) => (
    <g>
      <line x1={x} y1={y} x2={x} y2={y - 16} stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" />
      <path d={`M${x},${y - 16} l${mirrorX ? -10 : 10},4 l${mirrorX ? 10 : -10},4 Z`}
        fill="#E5C07B" opacity="0.85" />
    </g>
  );

  return (
    <>
      {/* Gespa — franges alternades */}
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={18 + i * 95.5} y="18" width="95.5" height={h - 36}
          fill={i % 2 === 0 ? '#1c3d1c' : '#193619'} />
      ))}
      <rect x="0" y="0" width={w} height={h} fill="none" />

      {/* Línies del camp */}
      <rect x="18" y="18" width={w - 36} height={h - 36} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" />
      <line x1={midX} y1="18" x2={midX} y2={h - 18} stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
      <circle cx={midX} cy={goalY} r="140" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
      <circle cx={midX} cy={goalY} r="4" fill="rgba(255,255,255,0.8)" />

      {/* Àrea rectangular — porteria pròpia */}
      <rect x="18" y={goalY - areaH / 2} width={areaW} height={areaH} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
      <circle cx={18 + areaW - 30} cy={goalY} r="4" fill="rgba(255,255,255,0.85)" />
      <rect x="3" y={goalY - boxH / 2} width={boxW} height={boxH} fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" rx="1" />

      {/* Àrea rectangular — porteria rival */}
      <rect x={w - 18 - areaW} y={goalY - areaH / 2} width={areaW} height={areaH} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
      <circle cx={w - 18 - areaW + 30} cy={goalY} r="4" fill="rgba(255,255,255,0.85)" />
      <rect x={w - 18} y={goalY - boxH / 2} width={boxW} height={boxH} fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" rx="1" />

      {/* Banderins de córner */}
      {flag(18, 18, false, false)}
      {flag(w - 18, 18, true, false)}
      {flag(18, h - 18, false, true)}
      {flag(w - 18, h - 18, true, true)}
    </>
  );
}

// ── Camp — rep format i dibuixa el camp corresponent ────────────────
// Igual que GoalFrame per a la porteria: dibuixa només el terreny de
// joc estàtic (gespa, línies, àrees, cercle central...); el contingut
// dinàmic (calor de gols, marcadors, graella de zones clicables...)
// el decideix qui l'usa, com a children.
export default function Pitch({ format, svgRef, onClick, className, style, children }) {
  const { viewBox, w, h, goalX, goalY } = format.pitch;

  return (
    <svg ref={svgRef} viewBox={viewBox} onClick={onClick} className={className}
      style={{ width: '100%', display: 'block', ...style }}>
      {format.id === 'f7'
        ? <F7Field w={w} h={h} goalX={goalX} goalY={goalY} />
        : <Fs5Field w={w} h={h} />}
      {children}
    </svg>
  );
}
