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

  {
    id: 'sortida-pilota-222',
    title: 'Sortida de pilota — 2-2-2',
    category: 'atac',
    mode: 'f7',
    roles: ['POR', 'DFE', 'DFD', 'MI', 'MD', 'ALA', 'DAV'],
    summary: 'Centrals molt oberts, un mig de banda que puja a dalt i el punta que se n\'va a l\'altra banda: queda un 2-2-2 amb la parella del mig molt més junta que la de dalt. Els dos mitjos pivoten — un ofereix el vertical per fora i l\'altre la diagonal per dins — fins que s\'obre el passadís.',
    keys: [
      'Els centrals s\'obren fins a la línia de banda. Com més amples, més camp han de cobrir ells i més fàcil és el canvi de costat',
      'La parella del mig va junta i a prop del centre, no oberta: són els que han de rebre entre línies',
      'Sempre un vertical i una diagonal alhora. Si tots dos ofereixen el mateix, el defensa només ha de mirar a un lloc',
      'El central que no té la pilota s\'apropa una mica: és l\'ajuda i és el canvi de costat. No es queda enganxat a la seva banda mirant',
      'El davanter de la banda contrària baixa uns metres per no deixar l\'equip partit',
      'No hi ha pressa: canvi de central les vegades que calgui fins que s\'obri la diagonal per dins. Passar per passar no és sortir jugant',
      'Si no ens pressionen, el central puja en conducció fins que surti algú a buscar-lo',
      'La tornada al porter sempre hi és. Recomençar no és perdre: perdre-la a la nostra àrea sí',
    ],
    steps: [
      {
        note: 'Col·locació 2-2-2: centrals molt oberts, el mig de banda puja a dalt i el punta se n\'va a l\'altra banda. La parella del mig, junta i pel centre.',
        hold: 3000,
        own:    [[50,90],[14,76],[86,76],[42,58],[58,58],[24,36],[76,36]],
        rivals: [[50,8],[35,22],[65,22],[26,44],[50,44],[74,44],[44,64]],
        ball:   [50,93],
        arrows: [
          { from: [50,92], to: [16,74], type: 'pass', label: 'quasi sempre' },
          { from: [50,92], to: [53,60], type: 'pass', label: 'poques vegades' },
        ],
      },
      {
        note: 'La rep el central esquerre. Els dos mitjos pivoten: el MI ofereix el vertical per la banda i el MD entra a la diagonal per dins. El DFD s\'apropa per ajudar i el DAV baixa uns metres.',
        dur: 1500, hold: 3200,
        own:    [[50,88],[14,74],[62,72],[26,52],[48,50],[22,32],[77,46]],
        rivals: [[50,8],[35,22],[65,22],[20,46],[44,44],[64,40],[30,64]],
        ball:   [16,72],
        highlight: [3,4],
        arrows: [
          { from: [26,52], to: [24,46], type: 'run', label: 'vertical per fora' },
          { from: [48,50], to: [40,44], type: 'run', label: 'diagonal per dins' },
          { from: [62,72], to: [56,70], type: 'run', label: 'ajuda' },
          { from: [77,46], to: [75,50], type: 'run', label: 'baixa' },
        ],
      },
      {
        note: 'No s\'obre res: canvi a l\'altre central. Ells han de córrer tot l\'ample del camp — per això els volem tan oberts.',
        dur: 1500, hold: 2600,
        own:    [[50,88],[20,72],[86,74],[40,52],[56,52],[26,42],[76,34]],
        rivals: [[50,8],[35,22],[65,22],[26,44],[50,44],[74,44],[48,62]],
        ball:   [84,73],
        highlight: [1,2],
        arrows: [{ from: [16,72], to: [83,72], type: 'pass', label: 'canvi de central' }],
      },
      {
        note: 'Exactament el mateix reflectit: ara el MD ofereix el vertical per la seva banda, el MI fa la diagonal per dins, ajuda el DFE i baixa l\'ALA.',
        dur: 1400, hold: 3200,
        own:    [[50,88],[38,72],[86,74],[52,50],[74,52],[23,46],[78,32]],
        rivals: [[50,8],[35,22],[65,22],[36,40],[56,44],[80,46],[70,64]],
        ball:   [84,72],
        highlight: [3,4],
        arrows: [
          { from: [74,52], to: [76,46], type: 'run', label: 'vertical per fora' },
          { from: [52,50], to: [60,44], type: 'run', label: 'diagonal per dins' },
          { from: [38,72], to: [44,70], type: 'run', label: 'ajuda' },
          { from: [23,46], to: [25,50], type: 'run', label: 'baixa' },
        ],
      },
      {
        note: 'Ara sí: la diagonal queda lliure i filtrem per dins. El MI rep entre línies de cara i comença l\'atac.',
        dur: 1300, hold: 3000,
        own:    [[50,86],[40,70],[80,70],[60,42],[74,40],[30,40],[76,28]],
        rivals: [[50,8],[35,24],[65,24],[34,46],[54,50],[84,50],[70,66]],
        ball:   [60,44],
        highlight: [3],
        zone: { cx: 60, cy: 45, r: 15, label: 'entre línies' },
        arrows: [{ from: [84,72], to: [60,43], type: 'pass', label: 'filtrada pel mig' }],
      },
      {
        note: 'I si no ens pressionen, no cal inventar: el central puja en conducció fins que surti algú. La tornada al porter hi és sempre, per si ens la lien.',
        dur: 1400, hold: 3000,
        own:    [[50,84],[42,68],[78,58],[58,44],[76,46],[26,44],[74,26]],
        rivals: [[50,8],[38,26],[62,26],[34,38],[50,40],[66,38],[52,54]],
        ball:   [78,58],
        highlight: [2],
        arrows: [
          { from: [78,68], to: [78,58], type: 'carry', label: 'conducció' },
          { from: [78,58], to: [52,82], type: 'pass', label: 'sempre tens el porter' },
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
