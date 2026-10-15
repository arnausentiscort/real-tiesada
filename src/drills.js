// ── Jugades animades (entrenaments tàctics) ──────────────────────
// Format d'una jugada:
//   id, title, category, mode ('fs5'|'f7'|'f11'), roles[], summary
//   video?: { youtubeId }  → clip real opcional
//   steps[]: { note, hold?, dur?, own[[x,y]], rivals[[x,y]], ball[x,y],
//              arrows?: [{ from:[x,y], to:[x,y], type:'run'|'pass'|'press'|'carry'|'opt'|'no', label? }],
//              zone?: { cx, cy, r, label? }, highlight?: [idx] }
//   view?: { y: [des de, fins a] }  → enquadra només aquesta franja del camp (%)
//   tokenScale?: 0.62  → fitxes més petites (jugades amb molta gent en poc espai)
//   steps[].roles?  → noms de rol per a aquesta fase (quan canvia el sistema)
//   steps[].rects?: [{ x0, y0, x1, y1, label? }]  → espais lliures en verd (%)
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
  abp:      { label: 'Jugada assajada', icon: '🎯', color: '#7BC0A0' },
};

export const DRILLS = [
  {
    id: 'trampa-pressio-231-vs-231',
    title: 'Trampa de pressió — 2-3-1 contra 2-3-1',
    category: 'defensa',
    mode: 'f7',
    roles: ['POR', 'DFE', 'DFD', 'MI', 'MC', 'MD', 'DC'],
    summary: 'Tallem la sortida pels seus centrals, i igual al canvi de banda.',
    steps: [
      {
        note: 'Col·locats. *Ningú es mou* fins a la passada.',
        hold: 2600,
        own:    [[50,88],[30,62],[70,62],[24,41],[50,39],[76,41],[50,26]],
        rivals: [[50,7],[16,21],[84,21],[22,35],[50,34],[78,35],[50,48]],
        ball:   [50,11],
        arrows: [{ from: [50,11], to: [17,20], type: 'pass', label: 'al central' }],
      },
      {
        note: 'El DC *talla*, el MI *salta en vertical*.',
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
        note: '*Trampa tancada.*',
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
        note: 'La torna al porter: *recuperem posició*.',
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
        note: 'Canvi de banda: *el mateix, reflectit*.',
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
        note: 'Mateixa trampa, *a l\'altre costat*.',
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
    // Pressió home a home a la sacada de porter (l'Arnau, 15/10). Posicions del
    // seu dibuix: del nostre 2-3-1 passem a un 1-3-2 mirall del seu 2-3-1.
    id: 'pressio-home-a-home',
    featured: true,
    title: 'Pressió home a home a la sacada de porter',
    category: 'defensa',
    mode: 'f7',
    roles: ['POR', 'DFE', 'DFD', 'EXE', 'MC', 'EXD', 'DC'],
    summary: 'Abans que el porter la posi en joc, cadascú té el seu home: no hi ha passada curta i l\'ha de pegar a dalt.',
    steps: [
      {
        note: 'Sacada de porter. Som al *2-3-1*.',
        hold: 3000,
        own:    [[50,92.3],[12.3,79.3],[84.3,80.8],[9.3,52.6],[48,53.9],[84,56],[52,27]],
        rivals: [[50,5.8],[25,18],[75,18],[14.5,47.5],[51,46.5],[90.6,50.1],[51,73.3]],
        ball:   [50,9.5],
      },
      {
        note: 'El DC *tria un central*; l\'extrem contrari, *l\'altre*.',
        dur: 1800, hold: 4200,
        own:    [[50,92],[15.7,53.1],[48.6,78.7],[26.1,24.1],[49.8,52.7],[87.3,55.3],[69.3,23.1]],
        rivals: [[50,5.8],[25,18],[75,18],[14.5,47.5],[51,46.5],[90.6,50.1],[51,73.3]],
        ball:   [50,9.5],
        highlight: [3,6],
        arrows: [
          { from: [55,26], to: [68,24], type: 'press' },
          { from: [9.3,50], to: [24,27], type: 'press', label: 'puja al central' },
          { from: [12.3,77], to: [15,56], type: 'run', label: 'salta' },
          { from: [82,80.5], to: [52,79], type: 'run', label: 'al 9' },
        ],
      },
      {
        note: '*Un home cadascú*. Només el porter, lliure.',
        dur: 500, hold: 4200,
        own:    [[50,92],[15.7,53.1],[48.6,78.7],[26.1,24.1],[49.8,52.7],[87.3,55.3],[69.3,23.1]],
        rivals: [[50,5.8],[25,18],[75,18],[14.5,47.5],[51,46.5],[90.6,50.1],[51,73.3]],
        ball:   [50,9.5],
        zone: { cx: 50, cy: 8, r: 8 },
      },
      {
        note: 'Pilotada: el DFD *la guanya*, el porter *avançat*.',
        dur: 1500, hold: 4000,
        own:    [[50,85],[15.7,53.1],[51.5,77],[26.1,24.1],[49.8,52.7],[87.3,55.3],[69.3,23.1]],
        rivals: [[50,5.8],[25,18],[75,18],[14.5,47.5],[51,46.5],[90.6,50.1],[51,71.5]],
        ball:   [51.5,74.2],
        highlight: [2,0],
        arrows: [
          { from: [50,10], to: [51.5,73.5], type: 'pass', label: 'pilotada' },
          { from: [48.6,79], to: [51.3,77.5], type: 'press' },
          { from: [50,91], to: [50,86.5], type: 'run' },
        ],
      },
      {
        note: 'Una altra.',
        dur: 700, hold: 700,
        own:    [[50,92],[15.7,53.1],[48.6,78.7],[26.1,24.1],[49.8,52.7],[87.3,55.3],[69.3,23.1]],
        rivals: [[50,5.8],[25,18],[75,18],[14.5,47.5],[51,46.5],[90.6,50.1],[51,73.3]],
        ball:   [50,9.5],
      },
      {
        note: 'A l\'esquena: *un persegueix, l\'altre es tanca*.',
        dur: 1600, hold: 4400,
        own:    [[50,88],[19,62],[38,74],[26.1,24.1],[49.8,52.7],[66,64],[69.3,23.1]],
        rivals: [[50,5.8],[25,18],[75,18],[16,68.5],[51,46.5],[90.6,50.1],[51,73.3]],
        ball:   [14,71],
        highlight: [1,2,5],
        zone: { cx: 15, cy: 66, r: 10, label: 'esquena del lateral' },
        arrows: [
          { from: [50,10], to: [14.5,70.5], type: 'pass', label: 'pilotada' },
          { from: [15.7,55.5], to: [18.5,60], type: 'press' },
          { from: [48.6,78.7], to: [39.5,74.5], type: 'run' },
          { from: [87.3,57.5], to: [68,63.5], type: 'run', label: 'es tanca' },
        ],
      },
      {
        note: 'Una altra.',
        dur: 700, hold: 700,
        own:    [[50,92],[15.7,53.1],[48.6,78.7],[26.1,24.1],[49.8,52.7],[87.3,55.3],[69.3,23.1]],
        rivals: [[50,5.8],[25,18],[75,18],[14.5,47.5],[51,46.5],[90.6,50.1],[51,73.3]],
        ball:   [50,9.5],
      },
      {
        note: 'El del mig, *enganxat i per davant*.',
        dur: 900, hold: 4200,
        own:    [[50,92],[15.7,53.1],[48.6,78.7],[26.1,24.1],[46,43],[87.3,55.3],[69.3,23.1]],
        rivals: [[50,5.8],[25,18],[75,18],[14.5,47.5],[51,46.5],[90.6,50.1],[51,73.3]],
        ball:   [50,9.5],
        highlight: [4],
        zone: { cx: 49, cy: 45, r: 9, label: 'la clau' },
        arrows: [{ from: [49.5,51], to: [46.5,45.5], type: 'run' }],
      },
      {
        note: 'Una altra sacada: *al revés*.',
        dur: 1400, hold: 1600,
        own:    [[50,92.3],[12.3,79.3],[84.3,80.8],[9.3,52.6],[48,53.9],[84,56],[52,27]],
        rivals: [[50,5.8],[25,18],[75,18],[14.5,47.5],[51,46.5],[90.6,50.1],[51,73.3]],
        ball:   [50,9.5],
      },
      {
        note: 'Ara puja *l\'extrem dret* i salta el DFD.',
        dur: 1800, hold: 4200,
        own:    [[50,92],[51.4,78.7],[84.3,53.1],[12.7,55.3],[50.2,52.7],[73.9,24.1],[30.7,23.1]],
        rivals: [[50,5.8],[25,18],[75,18],[14.5,47.5],[51,46.5],[90.6,50.1],[51,73.3]],
        ball:   [50,9.5],
        highlight: [5,6],
        arrows: [
          { from: [49,26], to: [33,24], type: 'press' },
          { from: [84,53], to: [76,27], type: 'press', label: 'puja al central' },
          { from: [84.3,78], to: [84.5,56], type: 'run', label: 'salta' },
          { from: [15,80], to: [48,79], type: 'run', label: 'al 9' },
        ],
      },
      {
        note: 'Es tria *abans del saque*. El DC *ho crida*.',
        dur: 500, hold: 4500,
        own:    [[50,92],[51.4,78.7],[84.3,53.1],[12.7,55.3],[50.2,52.7],[73.9,24.1],[30.7,23.1]],
        rivals: [[50,5.8],[25,18],[75,18],[14.5,47.5],[51,46.5],[90.6,50.1],[51,73.3]],
        ball:   [50,9.5],
        highlight: [6],
      },
    ],
  },

  {
    // Per què passem del 2-3-1 al 2-2-2 (l'Arnau, 15/10). Posicions, espais i
    // fletxes dels seus dos dibuixos, passats al camp; rols genèrics, sense noms.
    id: 'per-que-222',
    featured: true,
    title: 'Per què el 2-2-2 — espais al nostre camp',
    category: 'atac',
    mode: 'f7',
    roles: ['POR', 'DFE', 'DFD', 'EXE', 'MC', 'EXD', 'DC'],
    summary: 'Al 2-3-1 el rival ens tapa i els espais queden lluny. Al 2-2-2 estirem el camp i n\'hi ha quatre.',
    steps: [
      {
        note: '2-3-1: *sis duels*, ningú lliure.',
        hold: 4000,
        own:    [[50,92.3],[12.3,79.3],[84.3,80.8],[9.3,52.6],[48,53.9],[87,52.8],[52,24]],
        rivals: [[50,5.8],[52,17],[12.3,45.7],[48,47.6],[84.7,45.5],[15.3,72],[82.3,74.3]],
        ball:   [50,95],
      },
      {
        note: 'Cap a dins, *no*: et trepitges.',
        dur: 600, hold: 4200,
        own:    [[50,92.3],[12.3,79.3],[84.3,80.8],[9.3,52.6],[48,53.9],[87,52.8],[52,24]],
        rivals: [[50,5.8],[52,17],[12.3,45.7],[48,47.6],[84.7,45.5],[15.3,72],[82.3,74.3]],
        ball:   [50,95],
        arrows: [
          { from: [12,52.6], to: [25,52.6], type: 'no' },
          { from: [45,56], to: [33,56], type: 'no' },
          { from: [51,56], to: [63,56], type: 'no' },
          { from: [84,52.8], to: [72,52.8], type: 'no' },
          { from: [12.3,77], to: [12.3,68], type: 'no' },
          { from: [84.3,78], to: [84.3,69], type: 'no' },
        ],
      },
      {
        note: 'Hi ha espai: *els córners rivals*.',
        dur: 600, hold: 5000,
        own:    [[50,92.3],[12.3,79.3],[84.3,80.8],[9.3,52.6],[48,53.9],[87,52.8],[52,24]],
        rivals: [[50,5.8],[52,17],[12.3,45.7],[48,47.6],[84.7,45.5],[15.3,72],[82.3,74.3]],
        ball:   [50,95],
        rects: [
          { x0: 2, y0: 8, x1: 26.7, y1: 31, label: 'espai' },
          { x0: 66, y0: 9, x1: 98, y1: 32.8, label: 'espai' },
          { x0: 34.3, y0: 77, x1: 65, y1: 86 },
        ],
        arrows: [
          { from: [9.3,49], to: [9.3,36], type: 'opt' },
          { from: [87,49], to: [87,36], type: 'opt' },
          { from: [47,28], to: [32,28], type: 'opt' },
          { from: [57,28], to: [66,28], type: 'opt' },
          { from: [48,58], to: [48,75], type: 'opt' },
          { from: [16,82], to: [32,82], type: 'opt' },
          { from: [81,83], to: [66,83], type: 'opt' },
        ],
      },
      {
        note: 'Però *lluny*: passada llarga i la tallen.',
        dur: 1500, hold: 4000,
        own:    [[50,92.3],[12.3,79.3],[84.3,80.8],[10,31],[48,53.9],[87,52.8],[34,25]],
        rivals: [[50,5.8],[37,19],[12,25.5],[48,47.6],[84.7,45.5],[15.3,72],[82.3,74.3]],
        ball:   [11,28],
        highlight: [3],
        arrows: [
          { from: [50,91], to: [11,28.5], type: 'pass', label: 'llarga' },
          { from: [12.3,45.7], to: [12,27], type: 'press' },
        ],
      },
      {
        note: 'I el DC, *sol*.',
        dur: 900, hold: 3400,
        own:    [[50,92.3],[12.3,79.3],[84.3,80.8],[9.3,52.6],[48,53.9],[87,52.8],[52,24]],
        rivals: [[50,5.8],[52,18.5],[12.3,45.7],[48,47.6],[84.7,45.5],[15.3,72],[82.3,74.3]],
        ball:   [50,95],
        highlight: [6],
        zone: { cx: 52, cy: 21, r: 9, label: 'sol' },
      },
      {
        note: 'Passem al *2-2-2*.',
        dur: 2200, hold: 3800,
        roles: ['POR', 'DFE', 'DFD', 'DE', 'MCE', 'MCD', 'DD'],
        own:    [[50,91.2],[13.3,78.8],[84.1,80.3],[8.6,18],[34.3,51.6],[65.7,51.1],[81.6,20.2]],
        rivals: [[49.9,5.9],[82,13.6],[8.6,11.7],[36,45.6],[64.6,44.7],[15.9,72.2],[82.1,74.4]],
        ball:   [50,94],
        arrows: [
          { from: [9.3,50], to: [8.6,22], type: 'run' },
          { from: [55,24], to: [78,21], type: 'run', label: "s'obre" },
          { from: [46,55], to: [36,53], type: 'run' },
          { from: [85,54], to: [68,52], type: 'run', label: 'entra' },
        ],
      },
      {
        note: 'Els estirem: *quatre espais*.',
        dur: 600, hold: 6000,
        roles: ['POR', 'DFE', 'DFD', 'DE', 'MCE', 'MCD', 'DD'],
        own:    [[50,91.2],[13.3,78.8],[84.1,80.3],[8.6,18],[34.3,51.6],[65.7,51.1],[81.6,20.2]],
        rivals: [[49.9,5.9],[82,13.6],[8.6,11.7],[36,45.6],[64.6,44.7],[15.9,72.2],[82.1,74.4]],
        ball:   [50,94],
        rects: [
          { x0: 30, y0: 24.2, x1: 60, y1: 34.8 },
          { x0: 3.9, y0: 40, x1: 21, y1: 62.4 },
          { x0: 78.4, y0: 43.3, x1: 94.2, y1: 62.2 },
          { x0: 36.6, y0: 70, x1: 62.3, y1: 82.7 },
        ],
        arrows: [
          { from: [15,23], to: [36,23], type: 'opt' },
          { from: [75,24], to: [59,24], type: 'opt' },
          { from: [8.6,25], to: [8.6,38], type: 'opt' },
          { from: [84,27], to: [84,40], type: 'opt' },
          { from: [29.4,48], to: [29.4,38], type: 'opt' },
          { from: [68,47], to: [68,36], type: 'opt' },
          { from: [29,55], to: [17,55], type: 'opt' },
          { from: [71,54], to: [83,54], type: 'opt' },
          { from: [35,58], to: [35,70], type: 'opt' },
          { from: [66,57], to: [66,69], type: 'opt' },
          { from: [10.5,74], to: [10.5,64], type: 'opt' },
          { from: [88,77], to: [88,65], type: 'opt' },
          { from: [19,82], to: [37,82], type: 'opt' },
          { from: [79,84], to: [62,84], type: 'opt' },
        ],
      },
      {
        note: 'A cada espai hi arriben *tres o quatre*.',
        dur: 500, hold: 4500,
        roles: ['POR', 'DFE', 'DFD', 'DE', 'MCE', 'MCD', 'DD'],
        own:    [[50,91.2],[13.3,78.8],[84.1,80.3],[8.6,18],[34.3,51.6],[65.7,51.1],[81.6,20.2]],
        rivals: [[49.9,5.9],[82,13.6],[8.6,11.7],[36,45.6],[64.6,44.7],[15.9,72.2],[82.1,74.4]],
        ball:   [50,94],
        highlight: [2,5,6],
        rects: [{ x0: 78.4, y0: 43.3, x1: 94.2, y1: 62.2, label: 'DFD, MCD o DD' }],
        arrows: [
          { from: [84,27], to: [86,42], type: 'opt' },
          { from: [71,54], to: [80,53], type: 'opt' },
          { from: [88,77], to: [88,63.5], type: 'opt' },
        ],
      },
      {
        note: 'Els dos del mig *poden rotar posicions* sense trepitjar-se.',
        dur: 500, hold: 3200,
        roles: ['POR', 'DFE', 'DFD', 'DE', 'MCE', 'MCD', 'DD'],
        own:    [[50,91.2],[13.3,78.8],[84.1,80.3],[8.6,18],[34.3,51.6],[65.7,51.1],[81.6,20.2]],
        rivals: [[49.9,5.9],[82,13.6],[8.6,11.7],[36,45.6],[64.6,44.7],[15.9,72.2],[82.1,74.4]],
        ball:   [50,94],
        highlight: [4,5],
        // Un puja i l'altre baixa, cadascú pel seu costat: es canvien l'altura
        // sense creuar-se ni ocupar el mateix espai
        arrows: [
          { from: [34.3,48.5], to: [37,39], type: 'opt', label: 'puja' },
          { from: [65.7,54.5], to: [63,64], type: 'opt', label: 'baixa' },
        ],
      },
      {
        note: '*Exemple 1*: el DFE té la pilota.',
        dur: 900, hold: 2200,
        roles: ['POR', 'DFE', 'DFD', 'DE', 'MCE', 'MCD', 'DD'],
        own:    [[50,91.2],[13.3,78.8],[84.1,80.3],[8.6,18],[34.3,51.6],[65.7,51.1],[81.6,20.2]],
        rivals: [[49.9,5.9],[82,13.6],[8.6,11.7],[36,45.6],[64.6,44.7],[15.9,72.2],[82.1,74.4]],
        ball:   [15.5,81],
      },
      {
        note: 'Primer, *al porter*.',
        dur: 900, hold: 2200,
        roles: ['POR', 'DFE', 'DFD', 'DE', 'MCE', 'MCD', 'DD'],
        own:    [[50,91.2],[13.3,78.8],[84.1,80.3],[8.6,18],[34.3,51.6],[65.7,51.1],[81.6,20.2]],
        rivals: [[49.9,5.9],[82,13.6],[8.6,11.7],[36,45.6],[64.6,44.7],[15.9,72.2],[82.1,74.4]],
        ball:   [50,94],
        arrows: [{ from: [15.5,81], to: [48,92.5], type: 'pass' }],
      },
      {
        note: 'El MCD *baixa* i el seu rival *el segueix*.',
        dur: 1400, hold: 3200,
        roles: ['POR', 'DFE', 'DFD', 'DE', 'MCE', 'MCD', 'DD'],
        own:    [[50,91.2],[13.3,78.8],[84.1,80.3],[8.6,18],[34.3,51.6],[56,73],[81.6,20.2]],
        rivals: [[49.9,5.9],[82,13.6],[8.6,11.7],[36,45.6],[58,66],[15.9,72.2],[82.1,74.4]],
        ball:   [56,75.5],
        highlight: [5],
        rects: [{ x0: 78.4, y0: 43.3, x1: 94.2, y1: 62.2, label: 'queda buit' }],
        arrows: [
          { from: [65.7,54], to: [57,71], type: 'opt', label: 'baixa' },
          { from: [50,90], to: [55.5,76.5], type: 'pass' },
          { from: [64.6,47], to: [58.5,64], type: 'press', label: 'el segueix' },
        ],
      },
      {
        note: 'El forat és *per al DFD*.',
        dur: 1400, hold: 3400,
        roles: ['POR', 'DFE', 'DFD', 'DE', 'MCE', 'MCD', 'DD'],
        own:    [[50,91.2],[13.3,78.8],[87,52],[8.6,18],[34.3,51.6],[56,73],[81.6,20.2]],
        rivals: [[49.9,5.9],[82,13.6],[8.6,11.7],[36,45.6],[58,66],[15.9,72.2],[84,64]],
        ball:   [86.5,54.5],
        highlight: [2],
        rects: [{ x0: 78.4, y0: 43.3, x1: 94.2, y1: 62.2 }],
        arrows: [
          { from: [86,78], to: [87,55], type: 'opt' },
          { from: [57,73], to: [85.5,55.5], type: 'pass' },
        ],
      },
      {
        note: 'El DD *allarga* i baixa: *defensa i atac connectats*.',
        dur: 1300, hold: 3800,
        roles: ['POR', 'DFE', 'DFD', 'DE', 'MCE', 'MCD', 'DD'],
        own:    [[50,91.2],[13.3,78.8],[87,52],[8.6,18],[34.3,51.6],[56,73],[82,32]],
        rivals: [[49.9,5.9],[82,25.5],[8.6,11.7],[36,45.6],[58,66],[15.9,72.2],[84,64]],
        ball:   [82.5,34.5],
        highlight: [2,6],
        arrows: [
          { from: [81.6,23], to: [82,30], type: 'opt' },
          { from: [86.5,52], to: [83,36], type: 'pass' },
        ],
      },
      {
        note: '*Exemple 2*: pilotada des de *la nostra porteria*.',
        dur: 1800, hold: 2800,
        roles: ['POR', 'DFE', 'DFD', 'DE', 'MCE', 'MCD', 'DD'],
        own:    [[50,91.2],[13.3,78.8],[84.1,80.3],[8.6,18],[34.3,51.6],[65.7,51.1],[81.6,20.2]],
        rivals: [[49.9,5.9],[82,13.6],[8.6,11.7],[36,45.6],[64.6,44.7],[15.9,72.2],[82.1,74.4]],
        ball:   [50,94],
        highlight: [3,4],
        arrows: [
          { from: [10,21], to: [27,38], type: 'opt' },
          { from: [31,49], to: [17,27], type: 'opt' },
        ],
      },
      {
        note: 'El davanter *baixa*, el mig *puja*: *rotació*.',
        dur: 1500, hold: 3000,
        roles: ['POR', 'DFE', 'DFD', 'DE', 'MCE', 'MCD', 'DD'],
        own:    [[50,91.2],[13.3,78.8],[84.1,80.3],[27,38],[17,25],[65.7,51.1],[81.6,20.2]],
        rivals: [[49.9,5.9],[82,13.6],[8.6,11.7],[36,47],[64.6,44.7],[15.9,72.2],[82.1,74.4]],
        ball:   [28,41],
        highlight: [3],
        arrows: [{ from: [50,90], to: [28.5,42], type: 'pass', label: 'pilotada' }],
      },
      {
        note: 'La rep *de cara* i a l\'espai: *perill*.',
        dur: 1100, hold: 3600,
        roles: ['POR', 'DFE', 'DFD', 'DE', 'MCE', 'MCD', 'DD'],
        own:    [[50,91.2],[13.3,78.8],[84.1,80.3],[27,38],[19,20],[65.7,51.1],[81.6,20.2]],
        rivals: [[49.9,5.9],[82,13.6],[9,15],[33,43],[64.6,44.7],[15.9,72.2],[82.1,74.4]],
        ball:   [21,17.5],
        highlight: [4],
        arrows: [{ from: [26,36], to: [20.5,21], type: 'pass' }],
      },
      {
        note: '*Més espais, més passades.*',
        dur: 1800, hold: 5000,
        roles: ['POR', 'DFE', 'DFD', 'DE', 'MCE', 'MCD', 'DD'],
        own:    [[50,91.2],[13.3,78.8],[84.1,80.3],[8.6,18],[34.3,51.6],[65.7,51.1],[81.6,20.2]],
        rivals: [[49.9,5.9],[82,13.6],[8.6,11.7],[36,45.6],[64.6,44.7],[15.9,72.2],[82.1,74.4]],
        ball:   [50,94],
        rects: [
          { x0: 30, y0: 24.2, x1: 60, y1: 34.8 },
          { x0: 3.9, y0: 40, x1: 21, y1: 62.4 },
          { x0: 78.4, y0: 43.3, x1: 94.2, y1: 62.2 },
          { x0: 36.6, y0: 70, x1: 62.3, y1: 82.7 },
        ],
      },
    ],
  },

  {
    // Proposta d'en Joan Ribes (àudios del 14/10): defensar els córners com al
    // futsal, per zones i no per persona. Posicions del seu dibuix, passades a
    // l'àrea de futbol 7.
    id: 'corner-defensa-zona',
    featured: true,
    title: 'Córner en contra — en zona',
    category: 'abp',
    mode: 'f7',
    view: { y: [72, 100] },
    tokenScale: 0.62,
    roles: ['POR', '1P', 'Z1', 'Z2', '2P', 'MIG', 'LLI'],
    summary: 'Per zones, no per persona: cinc espais fixos i un lliure. Per l\'altre costat, igual reflectit.',
    steps: [
      {
        note: '*Per zones*, no per persona.',
        hold: 3400,
        own:    [[53,98.2],[43,98.6],[40,93.5],[50,93.5],[62,93.5],[40,87.5],[57,87.5]],
        rivals: [[3,97.5],[34,82],[46,80],[58,81],[68,86],[50,74],[50,6]],
        ball:   [3,97.5],
        highlight: [6],
      },
      {
        note: 'Ells entren; nosaltres *no sortim de la zona*.',
        dur: 1300, hold: 2600,
        own:    [[53,98.2],[43,98.6],[40,93.5],[50,93.5],[62,93.5],[40,87.5],[57,87.5]],
        rivals: [[3,97.5],[33,96.5],[32,88.5],[48.5,88.5],[66,89],[48,79],[50,6]],
        ball:   [3,97.5],
      },
      {
        note: 'Primer pal: *és del 1P*.',
        dur: 1000, hold: 2800,
        own:    [[53,98.2],[42,97.8],[40,93.5],[50,93.5],[62,93.5],[40,87.5],[57,87.5]],
        rivals: [[3,97.5],[33.5,96.6],[32,88.5],[48.5,88.5],[66,89],[48,79],[50,6]],
        ball:   [40.3,97.3],
        highlight: [1],
        zone: { cx: 41, cy: 97, r: 7, label: 'primer pal' },
        arrows: [{ from: [3,97.5], to: [40,97.2], type: 'pass', label: 'primer pal' }],
      },
      {
        note: 'Una altra.',
        dur: 700, hold: 700,
        own:    [[53,98.2],[43,98.6],[40,93.5],[50,93.5],[62,93.5],[40,87.5],[57,87.5]],
        rivals: [[3,97.5],[33,96.5],[32,88.5],[48.5,88.5],[66,89],[48,79],[50,6]],
        ball:   [3,97.5],
      },
      {
        note: 'Passada enrere: *surt el MIG*.',
        dur: 1100, hold: 3200,
        own:    [[53,98.2],[43,98.6],[40,93.5],[50,93.5],[62,93.5],[45,84],[57,87.5]],
        rivals: [[3,97.5],[33,96.5],[32,88.5],[48.5,88.5],[66,89],[48,79],[50,6]],
        ball:   [48.6,80.5],
        highlight: [5],
        zone: { cx: 47, cy: 80.5, r: 7, label: 'passada enrere' },
        arrows: [
          { from: [3,97.5], to: [47.5,80.8], type: 'pass' },
          { from: [40,87.5], to: [44.8,84.3], type: 'press' },
        ],
      },
      {
        note: 'Una altra.',
        dur: 700, hold: 700,
        own:    [[53,98.2],[43,98.6],[40,93.5],[50,93.5],[62,93.5],[40,87.5],[57,87.5]],
        rivals: [[3,97.5],[33,96.5],[32,88.5],[48.5,88.5],[66,89],[48,79],[50,6]],
        ball:   [3,97.5],
      },
      {
        note: 'Al mig: *els dos del mig*.',
        dur: 1100, hold: 3000,
        own:    [[53,98.2],[43,98.6],[40,93.5],[47.5,93],[62,93.5],[40,87.5],[57,87.5]],
        rivals: [[3,97.5],[33,96.5],[32,88.5],[47.8,88.3],[66,89],[48,79],[50,6]],
        ball:   [45.6,90.7],
        highlight: [2,3],
        zone: { cx: 45, cy: 92, r: 8, label: 'el mig' },
        arrows: [
          { from: [3,97.5], to: [45.5,90.8], type: 'pass', label: 'al mig' },
          { from: [50,93.5], to: [47.8,92.8], type: 'press' },
        ],
      },
      {
        note: 'Una altra.',
        dur: 700, hold: 700,
        own:    [[53,98.2],[43,98.6],[40,93.5],[50,93.5],[62,93.5],[40,87.5],[57,87.5]],
        rivals: [[3,97.5],[33,96.5],[32,88.5],[48.5,88.5],[66,89],[48,79],[50,6]],
        ball:   [3,97.5],
      },
      {
        note: 'Llarga al segon pal: *és del 2P*.',
        dur: 1200, hold: 3000,
        own:    [[53,98.2],[43,98.6],[40,93.5],[50,93.5],[64,96.3],[40,87.5],[57,87.5]],
        rivals: [[3,97.5],[33,96.5],[32,88.5],[48.5,88.5],[66.5,92],[48,79],[50,6]],
        ball:   [62.3,94.8],
        highlight: [4],
        zone: { cx: 64, cy: 95, r: 7, label: 'segon pal' },
        arrows: [{ from: [3,97.5], to: [62.3,94.8], type: 'pass' }],
      },
      {
        note: 'El lliure va *on hi hagi un home sol*.',
        dur: 1300, hold: 3400,
        own:    [[53,98.2],[43,98.6],[40,93.5],[50,93.5],[62,93.5],[40,87.5],[61,84]],
        rivals: [[3,97.5],[33,96.5],[63,79.5],[48.5,88.5],[66,89],[48,79],[50,6]],
        ball:   [3,97.5],
        highlight: [6],
        arrows: [{ from: [57,87.5], to: [60.8,84.3], type: 'run' }],
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
