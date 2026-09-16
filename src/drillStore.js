// Jugades pròpies gravades a la pissarra — es guarden al navegador.
// Per publicar-les a tot l'equip: exporta el JSON i enganxa'l a src/drills.js
const KEY = 'rt:drills:v1';

export function loadCustomDrills() {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter(d => d?.id && Array.isArray(d.steps) && d.steps.length) : [];
  } catch { return []; }
}

function persist(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

export function saveCustomDrill(drill) {
  const list = loadCustomDrills();
  const i = list.findIndex(d => d.id === drill.id);
  if (i >= 0) list[i] = drill; else list.unshift(drill);
  persist(list);
  return list;
}

export function deleteCustomDrill(id) {
  const list = loadCustomDrills().filter(d => d.id !== id);
  persist(list);
  return list;
}

export const slugify = (s) =>
  (s || 'jugada').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'jugada';

export const drillToJson = (drill) => JSON.stringify(drill, null, 2);

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// Genera les fletxes de cada fase comparant-la amb la següent:
// moviment de jugador → fletxa 'run', moviment de pilota → 'pass'.
export function withAutoArrows(steps, minMove = 3.5) {
  return steps.map((s, i) => {
    const n = steps[i + 1];
    if (!n) return { ...s, arrows: [] };
    const arrows = [];
    (s.own || []).forEach((p, k) => {
      const q = n.own?.[k];
      if (q && dist(p, q) > minMove) arrows.push({ from: p, to: q, type: 'run' });
    });
    if (s.ball && n.ball && dist(s.ball, n.ball) > minMove) {
      arrows.push({ from: s.ball, to: n.ball, type: 'pass' });
    }
    return { ...s, arrows };
  });
}
