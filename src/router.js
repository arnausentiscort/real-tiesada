// ── Routing per hash ──────────────────────────────────────────────
// Sense llibreria: #/tactica/<jugada> és enllaçable (es pot enviar pel
// grup) i el botó enrere del mòbil torna enrere dins l'app en lloc de
// sortir-ne. Viu en un mòdul propi perquè els components puguin navegar
// sense importar App.jsx i muntar un cicle d'imports.

export const HASH_FOR = {
  dashboard:     '/',
  squad:         '/plantilla',
  clasificacion: '/classificacio',
  calendari:     '/calendari',
  mvp:           '/mvp',
  heatmap:       '/mapa',
  galeria:       '/galeria',
  pissarra:      '/tactica',
};

const VIEW_FOR = {
  plantilla:     'squad',
  classificacio: 'clasificacion',
  calendari:     'calendari',
  mvp:           'mvp',
  mapa:          'heatmap',
  galeria:       'galeria',
};

export function parseHash() {
  const parts = (window.location.hash || '').replace(/^#/, '').split('/').filter(Boolean);
  if (!parts.length) return { view: 'dashboard' };
  const [head, ...rest] = parts;
  if (head === 'tactica') {
    return rest[0] === 'pissarra'
      ? { view: 'pissarra', tacticTab: 'pissarra' }
      : { view: 'pissarra', tacticTab: 'jugades', drillId: rest[0] ? decodeURIComponent(rest[0]) : null };
  }
  if (head === 'partit') return { view: 'match', matchId: rest[0] ? decodeURIComponent(rest[0]) : null };
  return { view: VIEW_FOR[head] || 'dashboard' };
}

export const goTo = (path) => { window.location.hash = path; };
