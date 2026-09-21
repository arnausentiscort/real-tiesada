// ── Jugades animades (entrenaments tàctics) ──────────────────────
// Format d'una jugada:
//   id, title, category, mode ('fs5'|'f7'|'f11'), roles[], summary
//   video?: { youtubeId }  → clip real opcional
//   steps[]: { note, hold?, dur?, own[[x,y]], rivals[[x,y]], ball[x,y],
//              arrows?: [{ from:[x,y], to:[x,y], type:'run'|'pass'|'press'|'carry', label? }],
//              zone?: { cx, cy, r, label? }, highlight?: [idx] }
// Totes les coordenades són % del camp: x 0=esquerra 100=dreta,
// y 0=porteria RIVAL (dalt), 100=porteria PRÒPIA (baix).
//
// La jugada s'explica MIRANT-LA. Les notes són d'una línia i les etiquetes
// de les fletxes, de dues o tres paraules: si cal un paràgraf, l'animació
// està mal feta. No hi tornis a posar llistes de punts clau.
//
// Per fer l'espejo d'una fase: x → 100-x, i els rols canvien de casella
// (el DFE passa a ocupar el lloc que feia el DFD, etc.) perquè cada
// jugador es queda a la seva banda; els que salten són els de l'altre costat.

export const DRILL_CATEGORIES = {
  pressio:  { label: 'Pressió',        icon: '🔥', color: '#C0392B' },
  defensa:  { label: 'Defensa',        icon: '🛡️', color: '#5B8DEF' },
  atac:     { label: 'Atac',           icon: '⚡', color: '#E5C07B' },
  abp:      { label: 'Estratègia',     icon: '🎯', color: '#7BC0A0' },
};

export const DRILLS = [
  {
    id: 'trampa-pressio-231-vs-231',
    title: 'Trampa de pressió — 2-3-1 contra 2-3-1',
    category: 'pressio',
    mode: 'f7',
    roles: ['POR', 'DFE', 'DFD', 'MI', 'MC', 'MD', 'DC'],
    summary: 'Tallem la sortida pels seus centrals, i igual al canvi de banda.',
    steps: [
      {
        note: 'Col·locats. Ningú es mou fins que surt la passada.',
        hold: 2600,
        own:    [[50,88],[30,62],[70,62],[24,41],[50,39],[76,41],[50,26]],
        rivals: [[50,7],[16,21],[84,21],[22,35],[50,34],[78,35],[50,48]],
        ball:   [50,11],
        arrows: [{ from: [50,11], to: [17,20], type: 'pass', label: 'al central' }],
      },
      {
        note: 'El DC talla entre els dos centrals, el MI salta en vertical.',
        dur: 1400, hold: 2800,
        own:    [[50,86],[24,46],[62,58],[20,29],[46,37],[74,38],[40,23]],
        rivals: [[50,7],[16,21],[84,21],[22,35],[50,34],[78,35],[50,48]],
        ball:   [18,23],
        highlight: [3,6],
        arrows: [
          { from: [40,23], to: [30,21], type: 'press', label: 'talla' },
          { from: [20,29], to: [18,25], type: 'press', label: 'vertical' },
          { from: [24,46], to: [22,39], type: 'run', label: 'cobreix' },
          { from: [46,37], to: [48,35], type: 'run', label: 'fixa el mig' },
        ],
      },
      {
        note: 'Trampa tancada. No té sortida neta.',
        dur: 1300, hold: 3000,
        own:    [[50,84],[19,39],[58,54],[18,27],[44,36],[73,38],[38,22]],
        rivals: [[50,7],[17,22],[84,21],[23,34],[49,35],[78,35],[50,48]],
        ball:   [17,23],
        highlight: [1,3,4,6],
        zone: { cx: 20, cy: 26, r: 16, label: 'trampa' },
        arrows: [
          { from: [38,22], to: [46,15], type: 'press', label: 'i el porter' },
          { from: [19,39], to: [21,35], type: 'run' },
        ],
      },
      {
        note: 'La torna al porter. Recuperem posició de pressa.',
        dur: 1400, hold: 2800,
        own:    [[50,86],[24,44],[62,56],[24,33],[48,37],[75,39],[48,20]],
        rivals: [[50,9],[16,21],[84,21],[22,35],[50,34],[78,35],[50,48]],
        ball:   [50,13],
        highlight: [6],
        arrows: [
          { from: [17,23], to: [50,12], type: 'pass', label: 'enrere' },
          { from: [48,20], to: [50,18], type: 'run' },
        ],
      },
      {
        note: 'Canvi de banda: la mateixa jugada, reflectida.',
        dur: 1500, hold: 2800,
        own:    [[50,86],[38,58],[76,46],[26,38],[54,37],[80,29],[60,23]],
        rivals: [[50,7],[16,21],[84,21],[22,35],[50,34],[78,35],[50,48]],
        ball:   [82,23],
        highlight: [5,6],
        arrows: [
          { from: [50,13], to: [83,20], type: 'pass', label: 'canvi' },
          { from: [60,23], to: [70,21], type: 'press', label: 'talla' },
          { from: [80,29], to: [82,25], type: 'press', label: 'vertical' },
          { from: [76,46], to: [78,39], type: 'run', label: 'cobreix' },
        ],
      },
      {
        note: 'Mateixa trampa a l\'altre costat.',
        dur: 1300, hold: 3200,
        own:    [[50,84],[42,54],[81,39],[27,38],[56,36],[82,27],[62,22]],
        rivals: [[50,7],[16,21],[83,22],[22,35],[51,35],[77,34],[50,48]],
        ball:   [83,23],
        highlight: [2,4,5,6],
        zone: { cx: 80, cy: 26, r: 16, label: 'trampa' },
        arrows: [
          { from: [62,22], to: [54,15], type: 'press', label: 'i el porter' },
          { from: [81,39], to: [79,35], type: 'run' },
        ],
      },
    ],
  },

  {
    id: 'sortida-pilota-222',
    title: 'Sortida de pilota — del 2-3-1 al 2-2-2',
    category: 'atac',
    mode: 'f7',
    roles: ['POR', 'DFE', 'DFD', 'MI', 'MC', 'MD', 'DAV'],
    summary: 'Del 2-3-1 defensiu al 2-2-2 per treure-la jugant.',
    steps: [
      {
        note: 'Porter amb pilota. Obrir-se ARA, no quan ja ens pressionin.',
        hold: 3200,
        own:    [[50,92],[34,78],[66,78],[20,62],[48,62],[80,62],[44,44]],
        rivals: [[50,6],[30,34],[70,34],[18,52],[56,52],[82,52],[50,76]],
        ball:   [50,95],
        arrows: [
          { from: [34,78], to: [16,78], type: 'run', label: 'obre i baixa' },
          { from: [66,78], to: [84,78], type: 'run', label: 'obre i baixa' },
          { from: [20,62], to: [22,36], type: 'run', label: 'puja' },
          { from: [44,44], to: [74,34], type: 'run', label: 'estira' },
          { from: [80,62], to: [60,58], type: 'run', label: 'pel mig' },
          { from: [48,62], to: [44,58], type: 'run' },
        ],
      },
      {
        note: '2-2-2 fet. El seu punta, sol contra tres.',
        dur: 1800, hold: 3200,
        own:    [[50,90],[12,78],[88,78],[22,32],[38,58],[62,58],[78,32]],
        rivals: [[50,6],[28,26],[72,26],[26,52],[50,50],[74,52],[50,78]],
        ball:   [50,93],
        highlight: [1,2,3,6],
        arrows: [{ from: [50,92], to: [14,77], type: 'pass', label: 'al central' }],
      },
      {
        note: 'El MC se\'n va a la banda: la passada li entra vertical.',
        dur: 1500, hold: 3400,
        own:    [[50,88],[12,76],[70,74],[20,28],[17,50],[46,58],[78,44]],
        rivals: [[50,6],[26,24],[66,24],[24,64],[44,50],[66,38],[40,74]],
        ball:   [14,74],
        highlight: [4,5],
        zone: { cx: 20, cy: 42, r: 12, label: 'el forat' },
        arrows: [
          { from: [17,50], to: [16,43], type: 'run', label: 'a la banda' },
          { from: [14,74], to: [17,52], type: 'pass', label: 'quasi vertical' },
          { from: [46,58], to: [42,66], type: 'run', label: 'marcat' },
          { from: [70,74], to: [62,72], type: 'run', label: 'ajuda' },
          { from: [78,44], to: [76,50], type: 'run' },
        ],
      },
      {
        note: 'Si no s\'obre res, canvi de banda.',
        dur: 1600, hold: 2800,
        own:    [[50,88],[20,74],[88,76],[22,30],[36,54],[62,54],[76,34]],
        rivals: [[50,6],[30,24],[70,24],[26,48],[50,46],[72,48],[58,74]],
        ball:   [86,74],
        highlight: [1,2],
        arrows: [{ from: [14,74], to: [85,74], type: 'pass', label: 'canvi' }],
      },
      {
        note: 'Al revés. El seu mig canvia de marca i arriba tard.',
        dur: 1500, hold: 3400,
        own:    [[50,88],[30,74],[88,76],[22,44],[54,58],[83,50],[80,28]],
        rivals: [[50,6],[34,24],[74,24],[34,38],[64,44],[80,66],[60,74]],
        ball:   [86,74],
        highlight: [4,5],
        zone: { cx: 80, cy: 42, r: 12, label: 'el forat' },
        arrows: [
          { from: [83,50], to: [84,43], type: 'run', label: 'a la banda' },
          { from: [54,58], to: [58,66], type: 'run', label: 'per dins' },
          { from: [86,74], to: [55,60], type: 'pass', label: 'ara sí' },
          { from: [46,50], to: [62,45], type: 'press', label: 'canvia de marca' },
          { from: [30,74], to: [38,72], type: 'run', label: 'ajuda' },
        ],
      },
    ],
  },

  {
    id: 'corner-defensa',
    title: 'Córner en contra — marcatge i sortida',
    category: 'abp',
    mode: 'f7',
    roles: ['POR', 'PAL', 'M1', 'M2', 'M3', 'M4', 'CON'],
    summary: 'Un al primer pal, quatre marcant i un fora esperant la contra.',
    steps: [
      {
        note: 'Cadascú amb el seu. El PAL no marca ningú: guarda el primer pal.',
        hold: 3400,
        own:    [[57,95],[42,94],[28,88],[45,85],[68,88],[57,76],[50,58]],
        rivals: [[3,96],[23,83],[42,80],[70,83],[59,70],[47,64],[50,8]],
        ball:   [3,96],
        highlight: [1,6],
        zone: { cx: 42, cy: 91, r: 12, label: 'primer pal' },
        arrows: [{ from: [3,96], to: [40,88], type: 'pass', label: 'sol anar aquí' }],
      },
      {
        note: 'La treuen al primer pal. El PAL hi va sempre, sense esperar.',
        dur: 1200, hold: 3000,
        own:    [[57,95],[41,89],[28,86],[45,83],[68,86],[57,74],[50,56]],
        rivals: [[7,93],[25,81],[43,78],[70,81],[60,68],[47,62],[50,8]],
        ball:   [40,87],
        highlight: [1],
        arrows: [
          { from: [42,94], to: [40,88], type: 'press', label: 'primer contacte' },
          { from: [28,88], to: [30,85], type: 'press' },
        ],
      },
      {
        note: 'Rebuig llarg i fora tots alhora: qui es queda, els regala el segon.',
        dur: 1300, hold: 3200,
        own:    [[55,92],[43,74],[28,72],[46,70],[68,72],[59,62],[62,48]],
        rivals: [[14,86],[26,76],[44,73],[70,76],[61,64],[49,58],[50,8]],
        ball:   [62,50],
        highlight: [1,2,3,4,5,6],
        arrows: [
          { from: [40,87], to: [62,52], type: 'pass', label: 'rebuig' },
          { from: [46,70], to: [48,62], type: 'run', label: 'tots fora' },
        ],
      },
      {
        note: 'I a córrer: ells tenen mig equip a la nostra àrea.',
        dur: 1500, hold: 3000,
        own:    [[52,92],[44,62],[30,60],[47,56],[69,58],[63,42],[66,24]],
        rivals: [[22,78],[28,70],[46,68],[70,70],[62,58],[50,50],[50,10]],
        ball:   [66,26],
        highlight: [5,6],
        arrows: [
          { from: [62,50], to: [66,28], type: 'carry', label: 'la contra' },
          { from: [63,42], to: [58,28], type: 'run', label: 'acompanya' },
        ],
      },
    ],
  },

  {
    id: 'corner-atac',
    title: 'Córner a favor — primer pal i perllongació',
    category: 'abp',
    mode: 'f7',
    roles: ['POR', 'LLA', 'P1', 'P2', 'PT', 'REB', 'EQ'],
    summary: 'Tres junts fora de l\'àrea, tensa al primer pal i la toquem al segon.',
    steps: [
      {
        note: 'Els tres, junts i fora de l\'àrea. Quiets: encara no és el moment.',
        hold: 3400,
        own:    [[50,92],[3,3],[56,26],[66,30],[76,34],[42,34],[50,60]],
        rivals: [[50,4],[38,11],[56,9],[72,14],[62,22],[46,26],[50,54]],
        ball:   [3,3],
        zone: { cx: 66, cy: 30, r: 14, label: 'sortim d\'aquí' },
      },
      {
        note: 'Ara sí: el P1 ataca el primer pal i s\'emporta el seu marcador.',
        dur: 1300, hold: 3000,
        own:    [[50,92],[3,3],[38,14],[66,24],[52,19],[42,32],[50,60]],
        rivals: [[50,4],[33,11],[56,9],[72,14],[58,18],[46,26],[50,54]],
        ball:   [3,3],
        highlight: [2],
        arrows: [
          { from: [56,26], to: [38,15], type: 'run', label: 'primer pal' },
          { from: [76,34], to: [52,20], type: 'run', label: 'al punt' },
          { from: [66,30], to: [66,25], type: 'run', label: 'espera' },
        ],
      },
      {
        note: 'Tensa i rasa al primer pal. No cal que la mati: només tocar-la.',
        dur: 1200, hold: 3200,
        own:    [[50,92],[6,6],[39,10],[70,18],[52,19],[42,32],[50,60]],
        rivals: [[50,4],[34,9],[54,9],[70,12],[58,18],[46,26],[50,54]],
        ball:   [40,9],
        highlight: [2],
        arrows: [
          { from: [3,3], to: [40,10], type: 'pass', label: 'tensa i rasa' },
          { from: [66,24], to: [70,14], type: 'run', label: 'al segon' },
        ],
      },
      {
        note: 'La perllonga i al segon pal hi arriba sol: allà no mira ningú.',
        dur: 1100, hold: 3400,
        own:    [[50,92],[9,9],[38,9],[70,9],[54,20],[42,30],[50,60]],
        rivals: [[50,4],[33,8],[50,10],[62,13],[56,19],[46,26],[50,54]],
        ball:   [69,8],
        highlight: [3],
        zone: { cx: 70, cy: 9, r: 12, label: 'ningú el mira' },
        arrows: [
          { from: [40,9], to: [69,9], type: 'pass', label: 'perllonga' },
          { from: [69,8], to: [53,2], type: 'pass', label: 'a dins' },
        ],
      },
    ],
  },
];

export const getDrill = (id) => DRILLS.find(d => d.id === id) || null;

// Timeline: converteix els steps en segments amb temps absoluts (ms)
export const DEFAULT_DUR = 1500;
export const DEFAULT_HOLD = 2000;

export function buildTimeline(steps = []) {
  let t = 0;
  const segs = steps.map((s, i) => {
    const dur  = i === 0 ? 0 : (s.dur ?? DEFAULT_DUR);
    const hold = s.hold ?? DEFAULT_HOLD;
    const seg  = { i, travelStart: t, travelEnd: t + dur, holdEnd: t + dur + hold };
    t = seg.holdEnd;
    return seg;
  });
  return { segs, total: t || 1 };
}
