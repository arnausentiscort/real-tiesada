import React from 'react';

// ── Marc de porteria — pals, travesser i terra ─────────────────────
// Dibuixa només "el marc": el viewBox, la franja de terra i els pals.
// El contingut interior (xarxa, animacions, graella de zones...) el
// decideix qui l'usa, com a children — cada ús pot voler un tractament
// visual diferent (GoalHeatmap vs. el picker de l'AdminPanel).
//
// La mida ve sempre de `format.goal` (formats.js): fs5 és 300×200
// (3×2 m), f7 és 600×200 (6×2 m, el doble d'ample). El marge lateral/
// superior (18px) i el gruix del terra (12px) es mantenen fixos entre
// formats — només l'amplada interior escala.
export default function GoalFrame({ format, children, svgRef, onClick, className, style }) {
  const { viewBox, w } = format.goal;

  return (
    <svg ref={svgRef} viewBox={viewBox} onClick={onClick} className={className}
      style={{ width: '100%', display: 'block', ...style }}>
      {/* Terra */}
      <rect x="-18" y="200" width={w + 36} height="12" fill="#1c3d1c" />

      {children}

      {/* Pals i travesser */}
      <rect x="-9" y="-8" width="11" height="210" rx="3" fill="#e8e8e8" />
      <rect x={w - 2} y="-8" width="11" height="210" rx="3" fill="#e8e8e8" />
      <rect x="-9" y="-8" width={w + 18} height="11" rx="3" fill="#e8e8e8" />
      {/* Brillantor pals */}
      <rect x="-9" y="-8" width="4" height="210" rx="2" fill="rgba(255,255,255,0.3)" />
      <rect x={w - 2} y="-8" width="4" height="210" rx="2" fill="rgba(255,255,255,0.3)" />
      <rect x="-9" y="-8" width={w + 18} height="4" rx="2" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}
