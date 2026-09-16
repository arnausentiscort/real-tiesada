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
    summary: 'El seu porter la treu a un central: el DC talla el pas entre centrals, el mig de la banda salta en vertical i el defensa d\'aquell costat puja a cobrir el forat. Quan la tornen al porter i canvien de banda, ho repetim igual a l\'altre costat.',
    keys: [
      'El DC no corre cap al central de cara: corre en HORITZONTAL, tallant la línia entre els seus dos centrals i la tornada al porter',
      'Salta el mig de la banda MÉS PROPERA a la pilota, i sempre en vertical — mai en diagonal cap a dins',
      'El MC no mira la pilota: fixa el seu mig centre, que és on voldran sortir',
      'El defensa del costat de la pressió puja a agafar l\'extrem que queda sol. Si no puja, la trampa és un forat',
      'Si la tornen al porter no hem fallat: és el que buscàvem. Recuperem posició de pressa, perquè el canvi de banda ve tot seguit',
      'Al canvi de banda fem exactament el mateix reflectit: ara salta l\'altre mig i puja l\'altre defensa. Ningú improvisa, tots canviem alhora',
      'Si la treuen llarga per damunt, no passa res: era el pla. El que no pot passar és que surtin jugant per dins',
    ],
    steps: [
      {
        note: 'Els dos equips en 2-3-1. El seu porter té la pilota i nosaltres esperem col·locats: ningú es mou fins que la passada surt.',
        hold: 2600,
        own:    [[50,88],[32,64],[68,64],[22,48],[50,46],[78,48],[50,26]],
        rivals: [[50,7],[30,20],[70,20],[18,34],[50,34],[82,34],[50,48]],
        ball:   [50,11],
        arrows: [{ from: [50,11], to: [31,19], type: 'pass', label: 'la treu al central' }],
      },
      {
        note: 'GATELL: la passada va al seu central esquerre. Tots ens activem alhora — el DC comença la cursa horitzontal i el MI ataca en vertical.',
        dur: 1400, hold: 2800,
        own:    [[50,86],[26,48],[62,60],[26,30],[46,40],[72,44],[45,24]],
        rivals: [[50,7],[30,20],[70,20],[18,34],[50,34],[82,34],[50,48]],
        ball:   [32,22],
        highlight: [3,6],
        arrows: [
          { from: [45,24], to: [40,21], type: 'press', label: 'talla entre centrals' },
          { from: [26,30], to: [28,24], type: 'press', label: 'vertical' },
          { from: [26,48], to: [22,40], type: 'run', label: 'cobreix l\'extrem' },
          { from: [46,40], to: [46,36], type: 'run', label: 'fixa el mig' },
        ],
      },
      {
        note: 'Trampa tancada. El MI l\'aprieta, el DC li tapa el central i la tornada al porter, el MC té fixat el mig centre i el DFE ja té l\'extrem agafat. No té sortida neta.',
        dur: 1300, hold: 3000,
        own:    [[50,84],[22,40],[58,56],[27,27],[43,37],[70,42],[44,22]],
        rivals: [[50,7],[30,22],[70,20],[19,35],[49,35],[82,34],[50,48]],
        ball:   [31,23],
        highlight: [1,3,4,6],
        zone: { cx: 30, cy: 27, r: 17, label: 'trampa' },
        arrows: [
          { from: [44,22], to: [50,15], type: 'press', label: 'i el porter' },
          { from: [22,40], to: [20,36], type: 'run' },
        ],
      },
      {
        note: 'No troba res i la torna al porter. Això és una victòria nostra, no un fracàs: però ara toca recuperar posició de pressa, perquè el canvi de banda ve ja.',
        dur: 1400, hold: 2800,
        own:    [[50,86],[28,50],[62,58],[30,32],[48,38],[74,44],[48,20]],
        rivals: [[50,9],[30,20],[70,20],[18,34],[50,34],[82,34],[50,48]],
        ball:   [50,13],
        highlight: [6],
        arrows: [
          { from: [31,23], to: [50,12], type: 'pass', label: 'enrere' },
          { from: [48,20], to: [50,18], type: 'run', label: 'torna al mig' },
        ],
      },
      {
        note: 'CANVI DE BANDA: el porter la juga a l\'altre central. Mateixa jugada reflectida — ara el DC talla cap a l\'altre costat i qui salta en vertical és el MD.',
        dur: 1500, hold: 2800,
        own:    [[50,86],[38,60],[74,48],[28,44],[54,40],[74,30],[55,24]],
        rivals: [[50,7],[30,20],[70,20],[18,34],[50,34],[82,34],[50,48]],
        ball:   [68,22],
        highlight: [5,6],
        arrows: [
          { from: [50,13], to: [69,20], type: 'pass', label: 'canvia de banda' },
          { from: [55,24], to: [60,21], type: 'press', label: 'talla entre centrals' },
          { from: [74,30], to: [72,24], type: 'press', label: 'vertical' },
          { from: [74,48], to: [78,40], type: 'run', label: 'cobreix l\'extrem' },
        ],
      },
      {
        note: 'Mateixa trampa, costat contrari. Canviar de banda no els serveix de res si ens movem tots alhora: es troben exactament el mateix.',
        dur: 1300, hold: 3200,
        own:    [[50,84],[42,56],[78,40],[30,42],[57,37],[73,27],[56,22]],
        rivals: [[50,7],[30,20],[70,22],[18,34],[51,35],[81,35],[50,48]],
        ball:   [69,23],
        highlight: [2,4,5,6],
        zone: { cx: 70, cy: 27, r: 17, label: 'trampa' },
        arrows: [
          { from: [56,22], to: [50,15], type: 'press', label: 'i el porter' },
          { from: [78,40], to: [80,36], type: 'run' },
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
