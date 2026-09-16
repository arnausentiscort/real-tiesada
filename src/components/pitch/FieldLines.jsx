import React, { memo } from 'react';

// ── Geometria compartida del camp (pissarra i jugades animades) ───
export const VB_W = 400, VB_H = 660;
export const F = { x: 20, y: 30, w: 360, h: 600 };

// % del camp → coordenades SVG
export const pct2svg = ([px, py]) => ({ x: F.x + (px / 100) * F.w, y: F.y + (py / 100) * F.h });
export const svg2pct = ({ x, y }) => [
  Math.round(((x - F.x) / F.w) * 1000) / 10,
  Math.round(((y - F.y) / F.h) * 1000) / 10,
];


// ── Línies del camp: Futbol Sala (portrait) ───────────────────────
const FutsalLines = memo(function FutsalLines() {
  const { x: FX, y: FY, w: FW, h: FH } = F;
  const cx = FX + FW / 2, cy = FY + FH / 2;
  const arcR = 88, gW = 55, gH = 22;
  const gx = cx - gW / 2;
  const S = 'rgba(255,255,255,';
  return (
    <>
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x={FX} y={FY+i*100} width={FW} height={100}
          fill={i%2===0?'rgba(0,0,0,0.06)':'rgba(255,255,255,0.02)'}/>
      ))}
      <rect x={FX} y={FY} width={FW} height={FH} fill="none" stroke={S+'0.8)'} strokeWidth={2.5}/>
      <line x1={FX} y1={cy} x2={FX+FW} y2={cy} stroke={S+'0.7)'} strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={52} fill="none" stroke={S+'0.65)'} strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={3.5} fill={S+'0.75)'}/>
      <path d={`M${cx-arcR} ${FY+FH} A${arcR} ${arcR} 0 0 1 ${cx+arcR} ${FY+FH}`}
        fill={S+'0.04)'} stroke={S+'0.6)'} strokeWidth={1.5}/>
      <path d={`M${cx-arcR} ${FY} A${arcR} ${arcR} 0 0 0 ${cx+arcR} ${FY}`}
        fill={S+'0.04)'} stroke={S+'0.6)'} strokeWidth={1.5}/>
      <circle cx={cx} cy={FY+FH-arcR} r={3} fill={S+'0.7)'}/>
      <circle cx={cx} cy={FY+arcR}    r={3} fill={S+'0.7)'}/>
      <path d={`M${FX} ${FY+18} A18 18 0 0 1 ${FX+18} ${FY}`} fill="none" stroke={S+'0.55)'} strokeWidth={1.2}/>
      <path d={`M${FX+FW-18} ${FY} A18 18 0 0 1 ${FX+FW} ${FY+18}`} fill="none" stroke={S+'0.55)'} strokeWidth={1.2}/>
      <path d={`M${FX} ${FY+FH-18} A18 18 0 0 0 ${FX+18} ${FY+FH}`} fill="none" stroke={S+'0.55)'} strokeWidth={1.2}/>
      <path d={`M${FX+FW-18} ${FY+FH} A18 18 0 0 0 ${FX+FW} ${FY+FH-18}`} fill="none" stroke={S+'0.55)'} strokeWidth={1.2}/>
      <rect x={gx} y={FY+FH}  width={gW} height={gH} fill={S+'0.1)'} stroke={S+'0.8)'} strokeWidth={2}/>
      <rect x={gx} y={FY-gH}  width={gW} height={gH} fill={S+'0.1)'} stroke={S+'0.8)'} strokeWidth={2}/>
    </>
  );
});

// ── Línies Futbol 7 ───────────────────────────────────────────────
const F7Lines = memo(function F7Lines() {
  const { x: FX, y: FY, w: FW, h: FH } = F;
  const cx = FX + FW / 2, cy = FY + FH / 2;
  const areaW = 162, areaH = 100;
  const ax = cx - areaW / 2;
  const gW = 50, gH = 22;
  const gx = cx - gW / 2;
  const spotOff = 78;
  const S = 'rgba(255,255,255,';
  return (
    <>
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x={FX} y={FY+i*100} width={FW} height={100}
          fill={i%2===0?'rgba(0,0,0,0.06)':'rgba(255,255,255,0.02)'}/>
      ))}
      <rect x={FX} y={FY} width={FW} height={FH} fill="none" stroke={S+'0.8)'} strokeWidth={2.5}/>
      <line x1={FX} y1={cy} x2={FX+FW} y2={cy} stroke={S+'0.7)'} strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={60} fill="none" stroke={S+'0.65)'} strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={3.5} fill={S+'0.75)'}/>
      <rect x={ax} y={FY} width={areaW} height={areaH} fill={S+'0.04)'} stroke={S+'0.6)'} strokeWidth={1.5}/>
      <rect x={ax} y={FY+FH-areaH} width={areaW} height={areaH} fill={S+'0.04)'} stroke={S+'0.6)'} strokeWidth={1.5}/>
      <circle cx={cx} cy={FY+spotOff}    r={3} fill={S+'0.7)'}/>
      <circle cx={cx} cy={FY+FH-spotOff} r={3} fill={S+'0.7)'}/>
      <path d={`M${FX} ${FY+16} A16 16 0 0 1 ${FX+16} ${FY}`} fill="none" stroke={S+'0.5)'} strokeWidth={1.2}/>
      <path d={`M${FX+FW-16} ${FY} A16 16 0 0 1 ${FX+FW} ${FY+16}`} fill="none" stroke={S+'0.5)'} strokeWidth={1.2}/>
      <path d={`M${FX} ${FY+FH-16} A16 16 0 0 0 ${FX+16} ${FY+FH}`} fill="none" stroke={S+'0.5)'} strokeWidth={1.2}/>
      <path d={`M${FX+FW-16} ${FY+FH} A16 16 0 0 0 ${FX+FW} ${FY+FH-16}`} fill="none" stroke={S+'0.5)'} strokeWidth={1.2}/>
      <rect x={gx} y={FY+FH}  width={gW} height={gH} fill={S+'0.1)'} stroke={S+'0.8)'} strokeWidth={2}/>
      <rect x={gx} y={FY-gH}  width={gW} height={gH} fill={S+'0.1)'} stroke={S+'0.8)'} strokeWidth={2}/>
    </>
  );
});

// ── Línies Futbol 11 ──────────────────────────────────────────────
const F11Lines = memo(function F11Lines() {
  const { x: FX, y: FY, w: FW, h: FH } = F;
  const cx = FX + FW / 2, cy = FY + FH / 2;
  const areaW = 213, areaH = 94;
  const goalAreaW = 97, goalAreaH = 31;
  const ax = cx - areaW / 2, gax = cx - goalAreaW / 2;
  const penOff = 63;
  const arcR = 52;
  const gW = 40, gH = 22;
  const gx = cx - gW / 2;
  const dDx = Math.round(Math.sqrt(arcR*arcR - (areaH - penOff)*(areaH - penOff)));
  const S = 'rgba(255,255,255,';
  return (
    <>
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x={FX} y={FY+i*100} width={FW} height={100}
          fill={i%2===0?'rgba(0,0,0,0.06)':'rgba(255,255,255,0.02)'}/>
      ))}
      <rect x={FX} y={FY} width={FW} height={FH} fill="none" stroke={S+'0.8)'} strokeWidth={2.5}/>
      <line x1={FX} y1={cy} x2={FX+FW} y2={cy} stroke={S+'0.7)'} strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={52} fill="none" stroke={S+'0.65)'} strokeWidth={1.5}/>
      <circle cx={cx} cy={cy} r={3.5} fill={S+'0.75)'}/>
      <rect x={ax} y={FY}         width={areaW} height={areaH}     fill={S+'0.04)'} stroke={S+'0.6)'} strokeWidth={1.5}/>
      <rect x={ax} y={FY+FH-areaH} width={areaW} height={areaH}   fill={S+'0.04)'} stroke={S+'0.6)'} strokeWidth={1.5}/>
      <rect x={gax} y={FY}             width={goalAreaW} height={goalAreaH} fill="none" stroke={S+'0.5)'} strokeWidth={1}/>
      <rect x={gax} y={FY+FH-goalAreaH} width={goalAreaW} height={goalAreaH} fill="none" stroke={S+'0.5)'} strokeWidth={1}/>
      <circle cx={cx} cy={FY+penOff}    r={3} fill={S+'0.7)'}/>
      <circle cx={cx} cy={FY+FH-penOff} r={3} fill={S+'0.7)'}/>
      <path d={`M${cx-dDx} ${FY+areaH} A${arcR} ${arcR} 0 0 1 ${cx+dDx} ${FY+areaH}`}
        fill="none" stroke={S+'0.6)'} strokeWidth={1.5}/>
      <path d={`M${cx-dDx} ${FY+FH-areaH} A${arcR} ${arcR} 0 0 0 ${cx+dDx} ${FY+FH-areaH}`}
        fill="none" stroke={S+'0.6)'} strokeWidth={1.5}/>
      {[[FX,FY,'0 0 1'],[FX+FW,FY,'0 0 0'],[FX,FY+FH,'0 0 0'],[FX+FW,FY+FH,'0 0 1']].map(([bx,by,sw],k)=>{
        const dx = bx===FX?16:-16, dy = by===FY?16:-16;
        return <path key={k} d={`M${bx} ${by+dy} A16 16 ${sw} ${bx+dx} ${by}`} fill="none" stroke={S+'0.5)'} strokeWidth={1.2}/>;
      })}
      <rect x={gx} y={FY+FH}  width={gW} height={gH} fill={S+'0.1)'} stroke={S+'0.8)'} strokeWidth={2}/>
      <rect x={gx} y={FY-gH}  width={gW} height={gH} fill={S+'0.1)'} stroke={S+'0.8)'} strokeWidth={2}/>
    </>
  );
});

export const FIELD_LINES = { fs5: FutsalLines, f7: F7Lines, f11: F11Lines };

export const FieldLines = memo(function FieldLines({ mode }) {
  const Lines = FIELD_LINES[mode] || FutsalLines;
  return <Lines />;
});
