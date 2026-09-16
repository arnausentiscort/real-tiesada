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
    title: 'Sortida de pilota — del 2-3-1 al 2-2-2',
    category: 'atac',
    mode: 'f7',
    roles: ['POR', 'DFE', 'DFD', 'MI', 'MC', 'MD', 'DAV'],
    summary: 'Quan recuperem, el 2-3-1 defensiu es transforma: els centrals s\'obren fins a la banda i baixen, el DAV estira el camp i el MI puja a dalt. Queda un 2-2-2 amb el MC i el MD pel mig, amb prou distància entre ells perquè un sol rival no els tapi els dos. Som tres contra el seu punta, i per arribar-nos han de saltar amb un mig — el forat que deixa és el nostre.',
    keys: [
      'La transformació es fa quan recuperem, no abans: en defensa som 2-3-1, amb la pilota ens obrim al 2-2-2',
      'Els centrals s\'obren fins a la línia de banda I baixen. Amb el porter som 3 contra el seu punta: ell sol no pot tapar els dos',
      'El DAV estira el camp cap a una banda i el MI puja a l\'altra. Si no estirem, ens defensen tot l\'equip en vint metres',
      'El MC i el MD van pel centre, però amb una mica de distància entre ells: si van enganxats, un sol rival els tapa els dos',
      'Per arribar al nostre central han de saltar amb un mig de banda. Quan salta, deixa l\'esquena buida: aquell forat és on ataquem',
      'Sempre un vertical i una diagonal alhora. Si tots dos ofereixen el mateix, el defensa només ha de mirar a un lloc',
      'El de la diagonal BAIXA uns metres quan la té el central. Venint a buscar-la s\'obre l\'angle: des de la banda, la línia cap a ell passa de tapada a neta',
      'SENSE MOVIMENT NO HI HA ESPAI. El passadís no l\'obre la passada, l\'obre que algú s\'hagi mogut abans i hagi arrossegat un rival. Si esperem tots quiets, ells tampoc s\'han de moure i no s\'obre res',
      'El central que no té la pilota s\'apropa: és l\'ajuda i és el canvi de costat. No es queda mirant des de la seva banda',
      'El davanter de la banda contrària baixa uns metres per no deixar l\'equip partit',
      'No hi ha pressa. Canvi de central les vegades que calgui: cada canvi els obliga a córrer tot l\'ample i algú acaba arribant tard',
      'Si no surt ningú, el central puja en conducció fins que el vagin a buscar. I la tornada al porter hi és sempre: recomençar no és perdre',
    ],
    steps: [
      {
        note: 'El porter atrapa la pilota. Encara estem en el 2-3-1 defensiu i ells encara estan pujats. Aquí comença tot: obrir-se ARA, no quan ja ens pressionen.',
        hold: 3200,
        own:    [[50,92],[34,78],[66,78],[20,62],[48,62],[80,62],[44,44]],
        rivals: [[50,6],[30,34],[70,34],[18,52],[56,52],[82,52],[52,72]],
        ball:   [50,95],
        arrows: [
          { from: [34,78], to: [16,78], type: 'run', label: 'obre i baixa' },
          { from: [66,78], to: [84,78], type: 'run', label: 'obre i baixa' },
          { from: [20,62], to: [22,36], type: 'run', label: 'puja a dalt' },
          { from: [44,44], to: [74,34], type: 'run', label: 'estira el camp' },
          { from: [80,62], to: [60,58], type: 'run', label: 'es junten pel mig' },
          { from: [48,62], to: [44,58], type: 'run' },
        ],
      },
      {
        note: '2-2-2 format. Amb el porter som tres a la primera línia contra el seu punta: ell sol no pot tapar els dos centrals. La pilota surt quasi sempre cap a un d\'ells.',
        dur: 1800, hold: 3200,
        own:    [[50,90],[12,78],[88,78],[22,32],[38,58],[62,58],[78,32]],
        rivals: [[50,6],[30,24],[70,24],[22,42],[50,42],[78,42],[50,64]],
        ball:   [50,93],
        highlight: [1,2,3,6],
        arrows: [{ from: [50,92], to: [14,77], type: 'pass', label: 'quasi sempre al central' }],
      },
      {
        note: 'La rep el central esquerre. Per arribar-hi han de saltar amb el seu mig de banda — i quan salta, deixa l\'esquena buida. El MC ataca el vertical per fora i el MD BAIXA uns metres: venint a buscar-la, la diagonal s\'obre.',
        dur: 1500, hold: 3400,
        own:    [[50,88],[12,76],[70,74],[20,28],[24,52],[46,58],[76,42]],
        rivals: [[50,6],[26,24],[66,24],[16,60],[44,40],[66,38],[36,52]],
        ball:   [14,74],
        highlight: [4,5],
        zone: { cx: 26, cy: 44, r: 13, label: 'forat del que salta' },
        arrows: [
          { from: [24,52], to: [22,44], type: 'run', label: 'vertical per fora' },
          { from: [46,58], to: [43,67], type: 'run', label: 'baixa a buscar-la' },
          { from: [14,74], to: [45,60], type: 'pass', label: 'diagonal' },
          { from: [70,74], to: [62,72], type: 'run', label: 'ajuda' },
          { from: [76,42], to: [74,48], type: 'run' },
        ],
      },
      {
        note: 'Si no s\'obre res, canvi al central de l\'altra banda. Ells han de lliscar tot l\'ample del camp i el mig que havia saltat ha de tornar: aquí és on es fan tard.',
        dur: 1600, hold: 2800,
        own:    [[50,88],[20,74],[88,76],[22,30],[36,54],[62,54],[76,34]],
        rivals: [[50,6],[30,24],[70,24],[24,44],[50,42],[76,44],[46,60]],
        ball:   [86,74],
        highlight: [1,2],
        arrows: [{ from: [14,74], to: [85,74], type: 'pass', label: 'canvi de central' }],
      },
      {
        note: 'Exactament el mateix reflectit: salta el seu altre mig, el MD ataca el vertical per la seva banda i ara qui baixa a obrir-se la diagonal és el MC. Ajuda el DFE i baixa el MI.',
        dur: 1500, hold: 3400,
        own:    [[50,88],[30,74],[88,76],[24,42],[54,58],[76,52],[80,28]],
        rivals: [[50,6],[34,24],[74,24],[34,38],[56,40],[84,60],[64,52]],
        ball:   [86,74],
        highlight: [4,5],
        zone: { cx: 74, cy: 44, r: 13, label: 'forat del que salta' },
        arrows: [
          { from: [76,52], to: [78,44], type: 'run', label: 'vertical per fora' },
          { from: [54,58], to: [57,67], type: 'run', label: 'baixa a buscar-la' },
          { from: [86,74], to: [55,60], type: 'pass', label: 'diagonal' },
          { from: [30,74], to: [38,72], type: 'run', label: 'ajuda' },
          { from: [24,42], to: [26,48], type: 'run' },
        ],
      },
      {
        note: 'I si no surt ningú a buscar-lo, no cal inventar res: el central puja en conducció fins que el vagin a tapar. La tornada al porter hi és sempre, per si ens la lien.',
        dur: 1400, hold: 3000,
        own:    [[50,86],[36,70],[84,60],[26,40],[52,46],[70,48],[80,26]],
        rivals: [[50,6],[36,26],[66,26],[34,38],[54,40],[80,42],[58,54]],
        ball:   [84,60],
        highlight: [2],
        arrows: [
          { from: [86,72], to: [84,60], type: 'carry', label: 'puja en conducció' },
          { from: [84,60], to: [54,84], type: 'pass', label: 'sempre tens el porter' },
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
