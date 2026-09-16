// ── Jugades animades (entrenaments tàctics) ──────────────────────
// Format d'una jugada:
//   id, title, category, mode ('fs5'|'f7'|'f11'), roles[], summary, keys[]
//   video?: { youtubeId }  → clip real opcional
//   steps[]: { note, hold?, dur?, own[[x,y]], rivals[[x,y]], ball[x,y],
//              arrows?: [{ from:[x,y], to:[x,y], type:'run'|'pass'|'press'|'carry', label? }],
//              zone?: { cx, cy, r, label? }, highlight?: [idx] }
// Totes les coordenades són % del camp: x 0=esquerra 100=dreta,
// y 0=porteria RIVAL (dalt), 100=porteria PRÒPIA (baix).

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
    summary: 'El seu porter la treu a un central: el DAV talla el pas entre centrals, el mig de la banda salta en vertical i el defensa d\'aquell costat puja a cobrir el forat.',
    keys: [
      'El DC no corre cap al central de cara: corre en HORITZONTAL, tallant la línia entre els seus dos centrals i la tornada al porter',
      'Salta el mig de la banda MÉS PROPERA a la pilota, i sempre en vertical — mai en diagonal cap a dins',
      'El MC no mira la pilota: fixa el seu mig centre, que és on voldran sortir',
      'El defensa del costat de la pressió puja a agafar l\'extrem que queda sol. Si no puja, la trampa és un forat',
      'Només els deixem dues sortides: el seu mig centre (el tenim marcat) o tornar al porter (el DC hi arriba). Qualsevol de les dues és nostra',
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
        note: 'O la juga per dins i l\'hi robem, o la penja llarga. Si la robem: passada vertical immediata al DC, que ataca l\'esquena dels seus centrals.',
        dur: 1200, hold: 2600,
        own:    [[50,84],[24,42],[56,54],[30,28],[42,34],[68,42],[46,19]],
        rivals: [[50,8],[30,24],[70,22],[20,38],[47,39],[80,36],[50,50]],
        ball:   [30,29],
        highlight: [3,6],
        arrows: [{ from: [30,29], to: [46,20], type: 'pass', label: 'vertical' }],
      },
    ],
  },

  {
    id: 'pressio-alta-231',
    title: 'Pressió alta en bloc — 2-3-1',
    category: 'pressio',
    mode: 'f7',
    roles: ['POR', 'DFD', 'DFE', 'MD', 'MC', 'MI', 'DC'],
    summary: 'Com saltar tots alhora quan el porter rival treu curt, orientant la pressió a una banda i tancant l\'interior.',
    keys: [
      'Ningú surt fins que la pilota surt del peu del porter — sortir abans d\'hora trenca el bloc',
      'El DC pressiona per fora, en diagonal, tapant la tornada al porter',
      'L\'ala del costat contrari entra a dins: regalem la banda llunyana, mai el passadís interior',
      'Distància entre línies: màxim 10-12 metres. Si el davanter salta, la defensa puja',
      'Si no arribem en 5 segons, tots avall — es replega en bloc mig',
    ],
    steps: [
      {
        note: 'Bloc alt col·locat. El porter rival té la pilota: esperem col·locats i el DC es posa entre els dos centrals.',
        hold: 2200,
        own:    [[50,80],[34,60],[66,60],[22,44],[50,44],[78,44],[50,28]],
        rivals: [[50,7],[30,20],[70,20],[22,34],[50,34],[78,34],[50,48]],
        ball:   [50,12],
        arrows: [{ from: [50,12], to: [31,19], type: 'pass', label: 'treta' }],
      },
      {
        note: 'GATELL: la pilota va al central. El DC surt en diagonal per fora i li tapa la tornada al porter. Tot el bloc puja alhora.',
        dur: 1500, hold: 2400,
        own:    [[50,76],[32,54],[62,56],[22,36],[44,40],[72,42],[38,22]],
        rivals: [[50,7],[30,20],[70,20],[22,34],[50,34],[78,34],[50,48]],
        ball:   [31,22],
        highlight: [6],
        arrows: [
          { from: [38,22], to: [30,24], type: 'press', label: 'salta' },
          { from: [22,36], to: [22,32], type: 'run' },
          { from: [72,42], to: [62,40], type: 'run', label: 'tanca a dins' },
        ],
        zone: { cx: 30, cy: 26, r: 16, label: 'zona de pressió' },
      },
      {
        note: 'La pilota va al seu lateral: pressiona el MD i tots basculem al costat de la pilota. El MI entra a dins i la defensa llisca.',
        dur: 1500, hold: 2600,
        own:    [[50,74],[26,48],[58,52],[24,30],[40,36],[58,40],[30,18]],
        rivals: [[50,7],[30,20],[70,20],[22,32],[50,34],[78,34],[50,48]],
        ball:   [24,32],
        highlight: [3,4,5],
        arrows: [
          { from: [24,30], to: [23,32], type: 'press' },
          { from: [40,36], to: [34,34], type: 'run', label: 'cobertura' },
          { from: [58,40], to: [50,40], type: 'run' },
        ],
        zone: { cx: 30, cy: 32, r: 20, label: 'costat fort' },
      },
      {
        note: 'Robatori. Tenim 3 segons abans que es col·loquin: passada directa al DC que ataca l\'esquena del central.',
        dur: 1200, hold: 2400,
        own:    [[50,72],[28,50],[56,52],[26,30],[36,32],[52,38],[40,14]],
        rivals: [[50,7],[30,22],[70,20],[24,36],[52,38],[76,36],[52,50]],
        ball:   [36,30],
        highlight: [4,6],
        arrows: [{ from: [36,30], to: [40,15], type: 'pass', label: 'vertical' }],
      },
    ],
  },

  {
    id: 'replegar-bloc-mig',
    title: 'Replegar a bloc mig',
    category: 'defensa',
    mode: 'f7',
    roles: ['POR', 'DFD', 'DFE', 'MD', 'MC', 'MI', 'DC'],
    summary: 'Què fem quan la pressió alta no arriba: com tornar tots junts sense deixar el bloc partit.',
    keys: [
      'El senyal el dona el DC: si no arriba a la segona passada, crida i baixem tots',
      'Es replega corrent cap enrere mirant la pilota, no d\'esquena',
      'Línia defensiva a l\'altura de la frontal; el DC queda de referència al mig',
      'No robem a la seva meitat: robem quan entren al nostre bloc',
    ],
    steps: [
      {
        note: 'La pressió no ha arribat: el rival ha superat la primera línia i té la pilota còmoda.',
        hold: 2200,
        own:    [[50,76],[32,54],[62,56],[22,36],[44,40],[72,42],[38,22]],
        rivals: [[50,8],[30,24],[70,22],[26,40],[50,42],[76,40],[50,52]],
        ball:   [50,42],
      },
      {
        note: 'Ordre de replegar: tots baixem alhora fins a la frontal. Ningú es queda penjat a dalt.',
        dur: 1600, hold: 2400,
        own:    [[50,84],[36,66],[64,66],[28,54],[50,54],[72,54],[50,42]],
        rivals: [[50,8],[30,28],[70,26],[30,44],[50,44],[74,44],[50,50]],
        ball:   [50,44],
        highlight: [0,1,2,3,4,5,6],
        arrows: [
          { from: [38,22], to: [50,40], type: 'run' },
          { from: [22,36], to: [28,52], type: 'run' },
          { from: [72,42], to: [72,52], type: 'run' },
        ],
        zone: { cx: 50, cy: 58, r: 26, label: 'bloc mig' },
      },
      {
        note: 'Bloc compacte: 10-12 m entre línies. Ara sí, quan entrin al bloc saltem al portador i robem.',
        dur: 1300, hold: 2600,
        own:    [[50,86],[34,68],[64,68],[30,56],[50,56],[70,56],[46,46]],
        rivals: [[50,8],[32,34],[68,32],[30,50],[50,52],[72,50],[50,60]],
        ball:   [50,54],
        highlight: [6],
        arrows: [{ from: [46,46], to: [50,52], type: 'press', label: 'ara sí' }],
      },
    ],
  },

  {
    id: 'pressio-fs5-costat',
    title: 'Pressió al costat — futbol sala',
    category: 'pressio',
    mode: 'fs5',
    roles: ['POR', 'TAN', 'ALA-D', 'ALA-E', 'PIV'],
    summary: 'Pressió 1-2-1 orientant la pilota a la banda i tancant la sortida amb el pivot i l\'ala.',
    keys: [
      'El pivot orienta: li deixa una sola sortida, sempre cap a la banda',
      'L\'ala del costat de la pilota salta quan la passada ja ha sortit',
      'El tancament cobreix l\'esquena de l\'ala que salta',
      'Prohibit saltar dos alhora al mateix home',
    ],
    steps: [
      {
        note: 'Rival amb pilota al tancament. Ens col·loquem en 1-2-1 sense saltar encara.',
        hold: 2200,
        own:    [[50,86],[50,64],[26,48],[74,48],[50,32]],
        rivals: [[50,8],[50,26],[24,40],[76,40],[50,52]],
        ball:   [50,28],
      },
      {
        note: 'El PIV orienta: tapa el centre i obliga la passada a la banda esquerra.',
        dur: 1400, hold: 2200,
        own:    [[50,84],[50,62],[26,44],[70,46],[42,28]],
        rivals: [[50,8],[50,26],[24,40],[76,40],[50,52]],
        ball:   [48,28],
        highlight: [4],
        arrows: [
          { from: [42,28], to: [47,27], type: 'press' },
          { from: [50,28], to: [25,40], type: 'pass', label: 'l\'obliguem aquí' },
        ],
      },
      {
        note: 'Surt la passada: salta l\'ala dreta i el tancament li cobreix l\'esquena. Trampa tancada.',
        dur: 1300, hold: 2600,
        own:    [[50,82],[40,58],[26,38],[66,46],[38,32]],
        rivals: [[50,8],[50,28],[24,40],[76,40],[50,52]],
        ball:   [25,40],
        highlight: [1,2],
        arrows: [
          { from: [26,38], to: [25,39], type: 'press', label: 'salta' },
          { from: [40,58], to: [34,48], type: 'run', label: 'cobertura' },
        ],
        zone: { cx: 26, cy: 40, r: 18, label: 'trampa' },
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
