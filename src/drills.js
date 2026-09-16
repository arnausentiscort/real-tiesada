// ── Jugades animades (entrenaments tàctics) ──────────────────────
// Format d'una jugada:
//   id, title, category, mode ('fs5'|'f7'|'f11'), roles[], summary, keys[]
//   video?: { youtubeId }  → clip real opcional
//   steps[]: { note, hold?, dur?, own[[x,y]], rivals[[x,y]], ball[x,y],
//              arrows?: [{ from:[x,y], to:[x,y], type:'run'|'pass'|'press'|'carry', label? }],
//              zone?: { cx, cy, r, label? }, highlight?: [idx] }
// Totes les coordenades són % del camp: x 0=esquerra 100=dreta,
// y 0=porteria RIVAL (dalt), 100=porteria PRÒPIA (baix).
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
    summary: 'Els seus centrals obren molt per treure jugant. El DC talla el pas entre els dos, el mig de la banda salta en vertical i el defensa d\'aquell costat puja a cobrir el forat. Quan la tornen al porter i canvien de banda, ho repetim igual a l\'altre costat.',
    keys: [
      'El DC no corre cap al central de cara: corre en HORITZONTAL, tallant la línia entre els seus dos centrals i la tornada al porter. Com més oberts estiguin, més llarga és la cursa: ha de sortir amb la passada, no després',
      'Els nostres mitjos van enganxats als seus: si els donem dos metres, la treuen jugant per dins i la pressió no serveix de res',
      'Salta el mig de la banda MÉS PROPERA a la pilota, i sempre en vertical — mai en diagonal cap a dins',
      'El MC no mira la pilota: fixa el seu mig centre, que és on voldran sortir',
      'El defensa del costat de la pressió puja a agafar l\'extrem que queda sol. Si no puja, la trampa és un forat',
      'Si la tornen al porter no hem fallat: és el que buscàvem. Recuperem posició de pressa, perquè el canvi de banda ve tot seguit',
      'Al canvi de banda fem exactament el mateix reflectit: ara salta l\'altre mig i puja l\'altre defensa. Ningú improvisa, tots canviem alhora',
      'Si la treuen llarga per damunt, no passa res: era el pla. El que no pot passar és que surtin jugant per dins',
    ],
    steps: [
      {
        note: 'Els dos equips en 2-3-1. Els seus centrals s\'obren molt per treure jugant i els nostres mitjos ja estan a sobre dels seus: esperem col·locats, ningú es mou fins que la passada surt.',
        hold: 2600,
        own:    [[50,88],[30,62],[70,62],[24,41],[50,39],[76,41],[50,26]],
        rivals: [[50,7],[16,21],[84,21],[22,35],[50,34],[78,35],[50,48]],
        ball:   [50,11],
        arrows: [{ from: [50,11], to: [17,20], type: 'pass', label: 'la treu al central' }],
      },
      {
        note: 'GATELL: la passada va al seu central esquerre. Com que està molt obert, el DC ha de sortir ja per arribar a tallar. El MI ataca en vertical.',
        dur: 1400, hold: 2800,
        own:    [[50,86],[24,46],[62,58],[20,29],[46,37],[74,38],[40,23]],
        rivals: [[50,7],[16,21],[84,21],[22,35],[50,34],[78,35],[50,48]],
        ball:   [18,23],
        highlight: [3,6],
        arrows: [
          { from: [40,23], to: [30,21], type: 'press', label: 'talla entre centrals' },
          { from: [20,29], to: [18,25], type: 'press', label: 'vertical' },
          { from: [24,46], to: [22,39], type: 'run', label: 'cobreix l\'extrem' },
          { from: [46,37], to: [48,35], type: 'run', label: 'fixa el mig' },
        ],
      },
      {
        note: 'Trampa tancada. El MI l\'aprieta, el DC li tapa el central i la tornada al porter, i els nostres mitjos tenen els seus enganxats. No té sortida neta.',
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
        note: 'No troba res i la torna al porter. Això és una victòria nostra, no un fracàs: però ara toca recuperar posició de pressa, perquè el canvi de banda ve ja.',
        dur: 1400, hold: 2800,
        own:    [[50,86],[24,44],[62,56],[24,33],[48,37],[75,39],[48,20]],
        rivals: [[50,9],[16,21],[84,21],[22,35],[50,34],[78,35],[50,48]],
        ball:   [50,13],
        highlight: [6],
        arrows: [
          { from: [17,23], to: [50,12], type: 'pass', label: 'enrere' },
          { from: [48,20], to: [50,18], type: 'run', label: 'torna al mig' },
        ],
      },
      {
        note: 'CANVI DE BANDA: el porter la juga a l\'altre central, que està igual d\'obert. Mateixa jugada reflectida — ara el DC talla cap a l\'altre costat i qui salta en vertical és el MD.',
        dur: 1500, hold: 2800,
        own:    [[50,86],[38,58],[76,46],[26,38],[54,37],[80,29],[60,23]],
        rivals: [[50,7],[16,21],[84,21],[22,35],[50,34],[78,35],[50,48]],
        ball:   [82,23],
        highlight: [5,6],
        arrows: [
          { from: [50,13], to: [83,20], type: 'pass', label: 'canvia de banda' },
          { from: [60,23], to: [70,21], type: 'press', label: 'talla entre centrals' },
          { from: [80,29], to: [82,25], type: 'press', label: 'vertical' },
          { from: [76,46], to: [78,39], type: 'run', label: 'cobreix l\'extrem' },
        ],
      },
      {
        note: 'Mateixa trampa, costat contrari. Canviar de banda no els serveix de res si ens movem tots alhora: es troben exactament el mateix.',
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
