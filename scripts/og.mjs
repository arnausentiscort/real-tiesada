// Vista prèvia per compartir (WhatsApp, Telegram...): una imatge per jugada i una
// pàgina petita amb les etiquetes og: que porta a la jugada.
//   npm run og      → refà public/og/*.png i public/j/<jugada>/index.html
// Cal tornar-lo a passar quan es canvia o s'afegeix una jugada a src/drills.js.
// Fa servir l'Edge de Windows per fer les captures.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { DRILLS, DRILL_CATEGORIES } from '../src/drills.js';

const ARREL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WEB = 'https://arnausentiscort.github.io/real-tiesada/';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const OG = path.join(ARREL, 'public/og');
const TMP = path.join(ARREL, 'node_modules/.og');
fs.mkdirSync(OG, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });
const escut = pathToFileURL(path.join(ARREL, 'public/escut.svg')).href;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const net = s => String(s ?? '').replace(/\*/g, '');

const COLORS = { run: '#E5C07B', pass: '#ffffff', press: '#C0392B', carry: '#4ade80', opt: '#22c55e', no: '#ef4444' };

// El camp amb la fase que més s'explica sola (la que té més fletxes)
function camp(d) {
  const step = d.steps.reduce((a, s) => ((s.arrows || []).length > (a.arrows || []).length ? s : a), d.steps[0]);
  const W = 300, H = 480;
  const [y0, y1] = d.view?.y || [0, 100];
  const X = x => (x / 100) * W, Y = y => (y / 100) * H;
  const vb = `-8 ${Y(y0) - 8} ${W + 16} ${Y(y1) - Y(y0) + 16}`;
  // Mida exacta perquè l'SVG no ensenyi res de fora de l'enquadrament
  const vw = W + 16, vh = Y(y1) - Y(y0) + 16, k = Math.min(390 / vw, 574 / vh);
  const pw = Math.round(vw * k), ph = Math.round(vh * k);
  const r = 13 * (d.tokenScale || 1);
  const roles = step.roles || d.roles || [];
  const fletxes = (step.arrows || []).map(a => {
    const c = COLORS[a.type] || '#fff', dash = a.type === 'pass' || a.type === 'no' ? 'stroke-dasharray="7 6"' : '';
    return `<line x1="${X(a.from[0])}" y1="${Y(a.from[1])}" x2="${X(a.to[0])}" y2="${Y(a.to[1])}" stroke="${c}" stroke-width="3.2" ${dash} marker-end="url(#m-${a.type || 'run'})" stroke-linecap="round" opacity="0.95"/>`;
  }).join('');
  const markers = Object.entries(COLORS).map(([k, c]) =>
    `<marker id="m-${k}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker>`).join('');
  const rects = (step.rects || []).map(q => `<rect x="${X(q.x0)}" y="${Y(q.y0)}" width="${X(q.x1) - X(q.x0)}" height="${Y(q.y1) - Y(q.y0)}" fill="rgba(34,197,94,0.18)" stroke="#22c55e" stroke-dasharray="5 4" rx="6"/>`).join('');
  const rivals = (step.rivals || []).map(([x, y]) => `<circle cx="${X(x)}" cy="${Y(y)}" r="${r}" fill="#C0392B" stroke="#7f1d1d" stroke-width="2"/>`).join('');
  const own = (step.own || []).map(([x, y], i) => `<g><circle cx="${X(x)}" cy="${Y(y)}" r="${r}" fill="#121212" stroke="#E5C07B" stroke-width="2.5"/><text x="${X(x)}" y="${Y(y) + 3.5}" text-anchor="middle" font-size="${9.5 * (d.tokenScale || 1)}" font-weight="900" fill="#E5C07B" font-family="Inter,Arial">${esc(roles[i] || '')}</text></g>`).join('');
  const ball = step.ball ? `<circle cx="${X(step.ball[0])}" cy="${Y(step.ball[1])}" r="${6 * (d.tokenScale || 1)}" fill="#fff" stroke="#000" stroke-width="1.5"/>` : '';
  return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" width="${pw}" height="${ph}" style="display:block">
    <defs>${markers}</defs>
    <rect x="-8" y="-8" width="${W + 16}" height="${H + 16}" rx="14" fill="#1d3b22"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="0" y="${i * H / 8}" width="${W}" height="${H / 16}" fill="rgba(255,255,255,0.03)"/>`).join('')}
    <g fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2">
      <rect x="0" y="0" width="${W}" height="${H}" rx="4"/><line x1="0" y1="${H / 2}" x2="${W}" y2="${H / 2}"/>
      <circle cx="${W / 2}" cy="${H / 2}" r="42"/><rect x="${W * 0.25}" y="0" width="${W * 0.5}" height="${H * 0.14}"/>
      <rect x="${W * 0.25}" y="${H * 0.86}" width="${W * 0.5}" height="${H * 0.14}"/>
    </g>${rects}${fletxes}${rivals}${own}${ball}</svg>`;
}

function pagina({ titol, sub, etiqueta, color, dreta }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;800;900&display=swap');
  *{margin:0;box-sizing:border-box} body{width:1200px;height:630px;overflow:hidden;font-family:Inter,Arial,sans-serif;color:#fff;
  background:radial-gradient(ellipse at 20% 0%,rgba(192,57,43,.35),transparent 55%),radial-gradient(ellipse at 100% 100%,rgba(229,192,123,.18),transparent 55%),#0e0e0e;display:flex}
  .esq{flex:1;padding:64px 56px;display:flex;flex-direction:column;justify-content:space-between}
  .pill{display:inline-block;padding:8px 18px;border-radius:999px;font-weight:800;font-size:24px;background:${color}26;color:${color}}
  h1{font-size:${titol.length > 40 ? 52 : 62}px;font-weight:900;line-height:1.05;margin-top:26px;letter-spacing:-0.01em}
  p{font-size:26px;color:#a3a3a3;margin-top:18px;line-height:1.35;max-width:640px}
  .peu{display:flex;align-items:center;gap:16px;font-weight:900;letter-spacing:.18em;color:#E5C07B;font-size:24px}
  .peu img{height:64px} .dreta{width:${dreta ? 430 : 0}px;height:630px;padding:28px 40px 28px 0;display:flex;align-items:center;justify-content:center}
  </style></head><body><div class="esq"><div>${etiqueta ? `<span class="pill">${esc(etiqueta)}</span>` : ''}
  <h1>${esc(titol)}</h1><p>${esc(sub)}</p></div><div class="peu"><img src="${escut}">REAL TIESADA</div></div>
  ${dreta ? `<div class="dreta">${dreta}</div>` : ''}</body></html>`;
}

function captura(html, nom) {
  const f = path.join(TMP, nom + '.html');
  fs.writeFileSync(f, html);
  execFileSync(EDGE, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=1200,630', `--screenshot=${path.join(OG, nom + '.png')}`, '--virtual-time-budget=3000', pathToFileURL(f).href], { stdio: 'ignore' });
}

const redireccio = ({ titol, desc, img, desti, url }) => `<!doctype html>
<html lang="ca"><head><meta charset="utf-8">
<title>${esc(titol)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Real Tiesada">
<meta property="og:title" content="${esc(titol)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#121212">
<meta http-equiv="refresh" content="0; url=${desti}">
<script>location.replace(${JSON.stringify(desti)})</script>
</head><body style="background:#121212"></body></html>
`;

// Imatge general de la web
captura(pagina({ titol: 'Real Tiesada FC', sub: 'Estadístiques, partits, plantilla i tàctica de l\'equip.', etiqueta: 'Futbol 7 · Velòdrom',
  dreta: `<img src="${escut}" style="height:470px;filter:drop-shadow(0 0 50px rgba(229,192,123,.45))">` }), 'web');
console.log('✓ og/web.png');

for (const d of DRILLS) {
  const cat = DRILL_CATEGORIES[d.category] || {};
  captura(pagina({ titol: d.title, sub: net(d.summary), etiqueta: `${cat.icon || ''} ${cat.label || ''}`.trim(), color: cat.color || '#E5C07B', dreta: camp(d) }), d.id);
  const dir = path.join(ARREL, 'public/j', d.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), redireccio({
    titol: `${d.title} · Real Tiesada`, desc: net(d.summary),
    img: `${WEB}og/${d.id}.png`, desti: `../../#/tactica/${encodeURIComponent(d.id)}`, url: `${WEB}j/${d.id}/`,
  }));
  console.log(`✓ ${d.id}`);
}
// Jugades que ja no existeixen: fora la pàgina i la imatge
const ids = new Set(DRILLS.map(d => d.id));
for (const id of fs.existsSync(path.join(ARREL, 'public/j')) ? fs.readdirSync(path.join(ARREL, 'public/j')) : [])
  if (!ids.has(id)) { fs.rmSync(path.join(ARREL, 'public/j', id), { recursive: true }); fs.rmSync(path.join(OG, id + '.png'), { force: true }); }
