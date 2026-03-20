// ==========================================
// BASE DE DADES ESTÀTICA — Real Tiesada FC
// ==========================================

export const DATABASE = {
  teamName: "Real Tiesada",

  // Plantilla amb foto, dorsal i posició
  roster: [
    { name: "Arnau Sentis",  number: 8,  shirtName: "SENTIS",      position: "Migcampista", photo: "players/arnau.png",  photoCel: "players/arnau_cel.png" },
    { name: "Roger Miro",    number: 9,  shirtName: "MIRÓ",        position: "Davanter",    photo: "players/roger.png",  photoCel: "players/roger_cel.png" },
    { name: "Joan Medina",   number: 11, shirtName: "MEDINA",      position: "Porter",      photo: null,                 photoCel: null },
    { name: "Pau Ibañez",    number: 10, shirtName: "IBÁÑEZ",      position: "Defensa",     photo: null,                 photoCel: null },
    { name: "Roi Seoane",    number: 24, shirtName: "ROI",         position: "Defensa",     photo: null,                 photoCel: null },
    { name: "Oriol Tomas",   number: 21, shirtName: "ORIOL TOMAS", position: "Migcampista", photo: "players/oriol.png",  photoCel: "players/oriol_cel.png" },
    { name: "Paco Montero",  number: 22, shirtName: "GABARRI",     position: "Davanter",    photo: "players/paco.png",   photoCel: "players/paco_cel.png" },
    { name: "Andreu Cases",  number: 80, shirtName: "TELICO",      position: "Migcampista", photo: "players/andreu.png", photoCel: "players/andreu_cel.png" },
    { name: "Chengzhi Li",   number: 12, shirtName: "CHENGZHI LI", position: "Davanter",    photo: null,                 photoCel: null },
    { name: "Ivan Mico",     number: 4,  shirtName: "QUATRE",      position: "Defensa",     photo: null,                 photoCel: null },
    { name: "Marc Farreras", number: 77, shirtName: "FARRERAS",    position: "Davanter",    photo: null,                 photoCel: null },
  ],

  matches: [

    // ── JORNADA 1 — Vikings ──────────────────────────────────────────
    {
      id: "j1-vikings",
      jornada: "Jornada 1",
      opponent: "Vikings",
      result: "4 - 5",
      date: "23 Feb 2026",
      vimeoId: "1167919011",
      youtubeId: null,
      idealMinutesPerPlayer: 14.5,
      events: {
        substitutions: [],
        cards: [
          { time: "36:00", color: "yellow", player: "Oriol Tomas" }
        ],
        goals: [
          { time: "05:00", type: "favor",  scorer: "Paco Montero", assist: null,            goalkeeper: "Joan Medina", onPitch: ["Roger Miro", "Ivan Mico", "Paco Montero"],
            zone: "mig5E",   shotPos: { x: 646, y: 210 }, assistPos: null,              goalPos: { x: 225, y: 193 } },
          { time: "17:00", type: "favor",  scorer: "Joan Medina",  assist: "Marc Farreras", goalkeeper: "Pau Ibañez",  onPitch: ["Roger Miro", "Ivan Mico", "Joan Medina"],
            zone: "mig6E",   shotPos: { x: 745, y: 210 }, assistPos: { x: 646, y: 258 }, goalPos: { x: 125, y: 193 } },
          { time: "20:00", type: "favor",  scorer: "Roger Miro",   assist: "Joan Medina",   goalkeeper: "Pau Ibañez",  onPitch: ["Roger Miro", "Ivan Mico", "Pau Ibañez"],
            zone: "mig5",    shotPos: { x: 621, y: 210 }, assistPos: { x: 494, y: 137 }, goalPos: { x: 175, y: 193 } },
          { time: "31:00", type: "favor",  scorer: "Arnau Sentis", assist: "Chengzhi Li",   goalkeeper: "Joan Medina", onPitch: ["Joan Medina", "Roger Miro", "Arnau Sentis"],
            zone: "B6",      shotPos: { x: 745, y: 162 }, assistPos: { x: 646, y: 162 }, goalPos: { x: 175, y: 193 } },
          { time: "08:00", type: "contra", goalkeeper: "Joan Medina", onPitch: ["Paco Montero", "Oriol Tomas", "Ivan Mico", "Andreu Cases"] },
          { time: "18:00", type: "contra", goalkeeper: "Pau Ibañez",  onPitch: ["Joan Medina", "Ivan Mico", "Roger Miro"] },
          { time: "33:00", type: "contra", goalkeeper: "Joan Medina", onPitch: ["Joan Medina", "Pau Ibañez", "Roi Seoane", "Roger Miro"] },
          { time: "35:00", type: "contra", goalkeeper: "Joan Medina", onPitch: ["Roger Miro", "Joan Medina", "Roi Seoane", "Pau Ibañez"] },
          { time: "37:00", type: "contra", goalkeeper: "Joan Medina", onPitch: ["Oriol Tomas", "Pau Ibañez", "Andreu Cases", "Ivan Mico"] }
        ]
      }
    },

    // ── JORNADA 2 — Ensaimada ────────────────────────────────────────
    {
      id: "j2-ensaimada",
      jornada: "Jornada 2",
      opponent: "Ensaimada",
      result: "2 - 9",
      date: "02 Mar 2026",
      youtubeId: null,
      vimeoId: null,
      idealMinutesPerPlayer: 20.0,
      events: {
        substitutions: [],
        goals: [
          { time: "17:00", type: "favor",  scorer: "Andreu Cases", assist: null, goalkeeper: null,
            zone: "B6S",   shotPos: { x: 745, y: 187 }, assistPos: null,              goalPos: { x: 125, y: 193 } },
          { time: "31:00", type: "favor",  scorer: "Andreu Cases", assist: null, goalkeeper: null,
            zone: "B4E",   shotPos: { x: 519, y: 162 }, assistPos: null,              goalPos: { x: 225, y: 75  } },
          { time: "03:00", type: "contra", goalkeeper: null },
          { time: "05:00", type: "contra", goalkeeper: null },
          { time: "14:00", type: "contra", goalkeeper: null },
          { time: "18:00", type: "contra", goalkeeper: null },
          { time: "22:00", type: "contra", goalkeeper: null },
          { time: "25:00", type: "contra", goalkeeper: null },
          { time: "26:00", type: "contra", goalkeeper: null },
          { time: "29:00", type: "contra", goalkeeper: null },
          { time: "30:00", type: "contra", goalkeeper: null }
        ]
      }
    },

    // ── JORNADA 3 — Uruks ────────────────────────────────────────────
    {
      id: "j3-uruks",
      jornada: "Jornada 3",
      opponent: "Uruks",
      result: "2 - 5",
      date: "09 Mar 2026",
      youtubeId: "X9w3f1w47YA",
      vimeoId: null,
      idealMinutesPerPlayer: 16.0,
      events: {
        substitutions: [
          { time: "00:00", onPitch: ["Roi Seoane", "Pau Ibañez", "Ivan Mico", "Chengzhi Li"] },
          { time: "04:05", onPitch: ["Roi Seoane", "Pau Ibañez", "Chengzhi Li", "Andreu Cases"] },
          { time: "05:10", onPitch: ["Arnau Sentis", "Andreu Cases", "Oriol Tomas", "Chengzhi Li"] },
          { time: "07:08", onPitch: ["Arnau Sentis", "Roger Miro", "Oriol Tomas", "Andreu Cases"] },
          { time: "08:35", onPitch: ["Paco Montero", "Roger Miro", "Oriol Tomas", "Andreu Cases"] },
          { time: "11:07", onPitch: ["Paco Montero", "Roger Miro", "Ivan Mico", "Andreu Cases"] },
          { time: "12:41", onPitch: ["Paco Montero", "Roger Miro", "Ivan Mico", "Joan Medina"] },
          { time: "14:00", onPitch: ["Paco Montero", "Roi Seoane", "Ivan Mico", "Joan Medina"] },
          { time: "15:11", onPitch: ["Arnau Sentis", "Roi Seoane", "Ivan Mico", "Joan Medina"] },
          { time: "15:38", onPitch: ["Arnau Sentis", "Roi Seoane", "Chengzhi Li", "Joan Medina"] },
          { time: "19:45", onPitch: ["Paco Montero", "Oriol Tomas", "Andreu Cases", "Pau Ibañez"] },
          { time: "23:15", onPitch: ["Paco Montero", "Oriol Tomas", "Andreu Cases", "Ivan Mico"] },
          { time: "23:54", onPitch: ["Paco Montero", "Chengzhi Li", "Andreu Cases", "Ivan Mico"] },
          { time: "25:00", onPitch: ["Paco Montero", "Chengzhi Li", "Roger Miro", "Ivan Mico"] },
          { time: "26:00", onPitch: ["Roi Seoane", "Chengzhi Li", "Roger Miro", "Ivan Mico"] },
          { time: "27:30", onPitch: ["Roi Seoane", "Chengzhi Li", "Roger Miro", "Arnau Sentis"] },
          { time: "29:51", onPitch: ["Roi Seoane", "Andreu Cases", "Roger Miro", "Arnau Sentis"] },
          { time: "32:23", onPitch: ["Roi Seoane", "Andreu Cases", "Pau Ibañez", "Arnau Sentis"] },
          { time: "32:50", onPitch: ["Roi Seoane", "Andreu Cases", "Pau Ibañez", "Oriol Tomas"] },
          { time: "34:10", onPitch: ["Ivan Mico", "Andreu Cases", "Pau Ibañez", "Oriol Tomas"] },
          { time: "36:09", onPitch: ["Paco Montero", "Chengzhi Li", "Pau Ibañez", "Oriol Tomas"] },
          { time: "38:27", onPitch: ["Paco Montero", "Chengzhi Li", "Roger Miro", "Oriol Tomas"] },
          { time: "38:53", onPitch: ["Arnau Sentis", "Chengzhi Li", "Roger Miro", "Oriol Tomas"] },
          { time: "39:13", onPitch: [] }
        ],
        goals: [
          { time: "06:04", type: "favor",  scorer: "Chengzhi Li",  assist: "Andreu Cases", goalkeeper: "Joan Medina",
            zone: "B5SE",  shotPos: { x: 639, y: 180 }, assistPos: { x: 606, y: 51  }, goalPos: { x: 75,  y: 193 } },
          { time: "15:11", type: "contra", goalkeeper: "Pau Ibañez",  notes: "Error de transició lenta" },
          { time: "22:50", type: "favor",  scorer: "Oriol Tomas",   assist: "Roger Miro",   goalkeeper: "Rival",
            zone: "C6S",   shotPos: { x: 745, y: 283 }, assistPos: { x: 112, y: 187 }, goalPos: { x: 175, y: 193 } },
          { time: "24:02", type: "contra", goalkeeper: "Roger Miro",  notes: "S'adorm com a porter" },
          { time: "26:04", type: "contra", goalkeeper: "Joan Medina", notes: "Ens driblen a tots" },
          { time: "34:26", type: "contra", goalkeeper: "Joan Medina", notes: "Rebot afortunat" },
          { time: "38:33", type: "contra", goalkeeper: "Joan Medina", notes: "La perd Paco" }
        ],
        highlights: [
          { time: "22:00", player: "Oriol Tomas", type: "moment", emoji: "🤸", title: "El Pi de l'Oriol", description: "L'Oriol fa una entrada acrobàtica espectacular al terra que deixa tothom al·lucinat", photo: "gallery/j3-oriol-pi.jpg" },
        ],
        retransmissio: [
          { time:"3:30",  type:"bona",    text:"L'Ivan fa el saque i la pilota se li escapa dels peus com si tingués sabó. Take Kubo (Chengzhi) s'embolica i el Medina salva els mobles amb una aturada d'escàndol.", players:["Ivan Mico","Chengzhi Li","Joan Medina"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=206s" },
          { time:"7:10",  type:"dolenta", text:"El Miró es fa un embolic traient la pilota. Un clàssic.", players:["Roger Miro"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=426s" },
          { time:"7:23",  type:"dolenta", text:"\"Teva, meva... de ningú\". L'Arnau i l'Oriol miren fixament com la pilota surt fora.", players:["Arnau Sentis","Oriol Tomas"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=439s" },
          { time:"8:08",  type:"clip",    text:"El Pau regala a l'afició un rot històric.", players:["Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=484s" },
          { time:"8:50",  type:"bona",    text:"Connexió miraculosa entre el Miró, l'Andreu i el Paco. Semblen bons i tot.", players:["Roger Miro","Andreu Cases","Paco Montero"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=526s" },
          { time:"11:52", type:"bona",    text:"Quasi gol de Paco. L'Ivan i el Paco s'agraden jugant i munten una jugada que acaba en un xut que quasi fa mal.", players:["Ivan Mico","Paco Montero"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=708s", photo:"gallery/j3-paco-ivan-1.jpg", photoHover:"gallery/j3-paco-ivan-2.jpg" },
          { time:"12:15", type:"bona",    text:"El Medina li fa un six-seven al Chengzhi i a en Chengzhi li encanta.", players:["Joan Medina","Chengzhi Li"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=731s" },
          { time:"13:13", type:"bona",    text:"El Pau es vesteix del SANTO i vola per aturar una falta.", players:["Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=789s" },
          { time:"13:55", type:"bona",    text:"El Paco fa un gir d'estrella i el Pau respon amb un altre paradon.", players:["Paco Montero","Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=831s" },
          { time:"14:35", type:"dolenta", text:"El Pau té un excés de generositat i fa el primer \"regal\" a l'equip rival.", players:["Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=871s" },
          { time:"15:10", type:"tactica", text:"Canvi tàctic de manual: l'Arnau entra pel Paco just a temps per veure com ens marquen un gol.", players:["Arnau Sentis","Paco Montero"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=906s" },
          { time:"16:23", type:"dolenta", text:"El Pau obre la botiga de regals: segona i tercera assistència (al contrari, esclar).", players:["Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=979s" },
          { time:"17:31", type:"dolenta", text:"El Roi recupera una pilota i, aclaparat per tenir-la més d'un segon, la llança fora.", players:["Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=1047s", photo:"gallery/j3-roi-passa-1.jpg", photoHover:"gallery/j3-roi-passa-2.jpg" },
          { time:"17:53", type:"dolenta", text:"L'Arnau i el Roi fan aigües en defensa. Sort del pal.", players:["Arnau Sentis","Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=1069s" },
          { time:"18:08", type:"dolenta", text:"Sortida de pilota preciosa que acaba amb l'Arnau donant dos tocs a l'aire.", players:["Arnau Sentis"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=1084s" },
          { time:"20:19", type:"bona",    text:"L'Andreu, l'Oriol i el Pau trenen una bona jugada.", players:["Andreu Cases","Oriol Tomas","Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=1215s" },
          { time:"21:45", type:"clip",    text:"Tiqui-taca espectacular que acaba de la manera més èpica possible: amb l'Oriol fotent-se una tombarella.", players:["Oriol Tomas"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=1301s", photo:"gallery/j3-oriol-pi-1.jpg", photoHover:"gallery/j3-oriol-pi-2.jpg" },
          { time:"24:00", type:"dolenta", text:"El Miró s'afegeix al festival de la solidaritat: regal i gol en contra.", players:["Roger Miro"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=1436s" },
          { time:"25:27", type:"bona",    text:"El Medina ens ofereix la jugada esquizofrènica del partit: triple cagada i aturada alhora.", players:["Joan Medina"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=1523s" },
          { time:"25:46", type:"dolenta", text:"Li treu la vareta màgica i el Miró ho destrossa amb una volea per oblidar.", players:["Chengzhi Li","Roger Miro"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=1542s" },
          { time:"26:26", type:"bona",    text:"Passada mil·limètrica a l'espai per al Roi.", players:["Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=1582s" },
          { time:"28:19", type:"clip",    text:"El Roi cau a terra. Sense motiu aparent. Res més a afegir.", players:["Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=1695s" },
          { time:"30:05", type:"bona",    text:"L'Andreu i el Roi descobreixen l'art de la paret.", players:["Andreu Cases","Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=1801s" },
          { time:"31:47", type:"dolenta", text:"El Medina gairebé es menja un gol des de mig camp regalant pilotes.", players:["Joan Medina"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=1903s" },
          { time:"32:30", type:"clip",    text:"IBAÑEEEEEZ! (Amb eco dramàtic).", players:["Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=1946s" },
          { time:"32:40", type:"bona",    text:"Gairebé un minut de possessió èpica. El Barça de Guardiola tremola.", players:[], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=1956s" },
          { time:"33:33", type:"bona",    text:"Al Pau li roben la cartera, el Medina fa un miracle, el Pau cau misteriosament a l'àrea i el Medina tanca amb la jugada 'con suerte'.", players:["Pau Ibañez","Joan Medina"], videoUrl:"https://www.youtube.com/watch?v=X9w3f1w47YA&t=2009s" },
        ]
      }
    },

    // ── JORNADA 4 — Touchlas FC ──────────────────────────────────────
    {
      id: "j4-touchlas",
      jornada: "Jornada 4",
      opponent: "Touchlas FC",
      result: "2 - 5",
      date: "17 Mar 2026",
      youtubeId: "tokKRGjQP1Q",
      vimeoId: null,
      idealMinutesPerPlayer: 17.5,
      events: {
        substitutions: [
          { time: "3:00",  onPitch: ["Arnau Sentis", "Marc Farreras", "Chengzhi Li", "Joan Medina"] },
          { time: "6:45",  onPitch: ["Pau Ibañez", "Marc Farreras", "Chengzhi Li", "Joan Medina"] },
          { time: "10:26", onPitch: ["Pau Ibañez", "Marc Farreras", "Chengzhi Li", "Roi Seoane"] },
          { time: "12:13", onPitch: ["Roger Miro", "Paco Montero", "Roi Seoane", "Pau Ibañez"] },
          { time: "15:38", onPitch: ["Arnau Sentis", "Paco Montero", "Roi Seoane", "Roger Miro"] },
          { time: "17:38", onPitch: ["Arnau Sentis", "Paco Montero", "Chengzhi Li", "Roger Miro"] },
          { time: "19:13", onPitch: ["Chengzhi Li", "Roger Miro", "Paco Montero", "Joan Medina"] },
          { time: "19:29", onPitch: [] },
          { time: "20:40", onPitch: ["Pau Ibañez", "Joan Medina", "Paco Montero", "Chengzhi Li"] },
          { time: "23:14", onPitch: ["Pau Ibañez", "Joan Medina", "Marc Farreras", "Chengzhi Li"] },
          { time: "23:37", onPitch: ["Pau Ibañez", "Joan Medina", "Marc Farreras", "Arnau Sentis"] },
          { time: "26:54", onPitch: ["Marc Farreras", "Roger Miro", "Paco Montero", "Joan Medina"] },
          { time: "27:50", onPitch: [] },
          { time: "29:30", onPitch: ["Roi Seoane", "Roger Miro", "Paco Montero", "Marc Farreras"] },
          { time: "31:52", onPitch: ["Chengzhi Li", "Roi Seoane", "Roger Miro", "Paco Montero"] },
          { time: "34:26", onPitch: ["Roi Seoane", "Chengzhi Li", "Joan Medina", "Arnau Sentis"] },
          { time: "36:00", onPitch: ["Arnau Sentis", "Roi Seoane", "Marc Farreras", "Joan Medina"] },
          { time: "38:00", onPitch: ["Arnau Sentis", "Chengzhi Li", "Marc Farreras", "Joan Medina"] },
          { time: "38:33", onPitch: ["Roger Miro", "Chengzhi Li", "Marc Farreras", "Joan Medina"] },
          { time: "39:45", onPitch: ["Roger Miro", "Chengzhi Li", "Marc Farreras", "Arnau Sentis"] },
          { time: "40:51", onPitch: [] },
        ],
        cards: [],
        goals: [
          { time: "9:15",  type: "favor",  scorer: "Marc Farreras", assist: "Chengzhi Li", goalkeeper: "Ivan Mico",
            onPitch: ["Pau Ibañez", "Marc Farreras", "Chengzhi Li", "Joan Medina"],
            zone: null, shotPos: null, assistPos: null, goalPos: null },
          { time: "18:01", type: "favor",  scorer: "Chengzhi Li",   assist: null,           goalkeeper: "Ivan Mico",
            onPitch: ["Paco Montero", "Chengzhi Li", "Roger Miro", "Arnau Sentis"],
            zone: null, shotPos: null, assistPos: null, goalPos: null },
          { time: "15:25", type: "contra", goalkeeper: "Ivan Mico",
            onPitch: ["Paco Montero", "Roi Seoane", "Roger Miro", "Pau Ibañez"] },
          { time: "18:43", type: "contra", goalkeeper: "Ivan Mico",
            onPitch: ["Paco Montero", "Roger Miro", "Chengzhi Li", "Arnau Sentis"] },
          { time: "33:20", type: "contra", goalkeeper: "Ivan Mico",
            onPitch: ["Chengzhi Li", "Roi Seoane", "Roger Miro", "Paco Montero"] },
          { time: "34:00", type: "contra", goalkeeper: "Pau Ibañez",
            onPitch: ["Roi Seoane", "Chengzhi Li", "Roger Miro", "Paco Montero"] },
          { time: "35:50", type: "contra", goalkeeper: "Pau Ibañez",
            onPitch: ["Arnau Sentis", "Roi Seoane", "Chengzhi Li", "Joan Medina"] },
        ],
        retransmissio: [
          { time:"3:28",  type:"bona",    text:"L'Arnau recupera a la medina prieta i tira un passe llarg que no arriba al Medina. Bones intencions.", players:["Arnau Sentis","Joan Medina"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=204s" },
          { time:"4:05",  type:"bona",    text:"Bona combinació amb passe filtrat del Marc.", players:["Marc Farreras"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=241s" },
          { time:"5:10",  type:"dolenta", text:"El Medina treu malament i l'àrbitre xiula en contra. Un clàssic.", players:["Joan Medina"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=306s" },
          { time:"5:50",  type:"bona",    text:"Combinació molt bona, l'Arnau l'acaba fallant. Gairebé.", players:["Arnau Sentis"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=346s" },
          { time:"7:45",  type:"bona",    text:"Primera bona sortida de l'Ivan. Sembla que avui vol jugar.", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=461s" },
          { time:"9:52",  type:"clip",    text:"Pausa en cada banda, com si fos una pedra. El Roi en el seu element.", players:["Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=588s" },
          { time:"10:22", type:"bona",    text:"Un jugador rival se'n va de tots i l'Ivan li treu la pilota. L'únic porter del planeta.", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=618s" },
          { time:"10:35", type:"bona",    text:"El Roi fa una paret. El Roi fent una paret. Anoteu-ho.", players:["Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=631s" },
          { time:"11:00", type:"bona",    text:"L'Ivan para saltant. El Medina contempla des de la distància.", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=657s" },
          { time:"11:15", type:"dolenta", text:"El Pau treu els passos prohibits. Reglament: 1, Pau: 0.", players:["Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=672s" },
          { time:"12:25", type:"bona",    text:"Parada a quatre-cents. No sabem de qui, però ha sigut espectacular.", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=741s" },
          { time:"12:40", type:"bona",    text:"Jugada de combinació espectacular, el Pau xuta però li paren.", players:["Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=756s" },
          { time:"13:28", type:"bona",    text:"Parada de l'Ivan, i el Miró se'n va per la banda i es menja la reixa com un bacallà.", players:["Ivan Mico","Roger Miro"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=804s" },
          { time:"14:15", type:"tactica", text:"El Miró, en lloc de treure tan fort, juga enrere. Evolució.", players:["Roger Miro"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=852s" },
          { time:"15:07", type:"bona",    text:"El Miró quasi la lia, però la recuperem i el Roi fa un bon passe base.", players:["Roger Miro","Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=903s" },
          { time:"16:12", type:"bona",    text:"Paradón de l'Ivan. Aquest home hauria de cobrar.", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=969s" },
        ],
      }
    },
  ]
};

// Helper: retorna l'objecte jugador pel nom
export const getPlayer = (name) =>
  DATABASE.roster.find(p => p.name === name) || { name, number: null, position: null, photo: null, photoCel: null };
