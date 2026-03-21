// ==========================================
// BASE DE DADES ESTÀTICA — Real Tiesada FC
// ==========================================

export const DATABASE = {
  teamName: "Real Tiesada",

  // Proper partit (actualitza cada setmana)
  nextMatch: {
    opponent: "Dgeneración X",
    date: "2026-03-28T19:00:00",  // ISO format per al countdown
    dateLabel: "28 Mar 2026 · 19:00h",
    location: "Pavelló Municipal",
    jornada: "Jornada 5",
  },

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
      goalkeeperMinutes: { "Marc Farreras": 15, "Joan Medina": 15, "Pau Ibañez": 10 },
      fieldMinutes: { "Arnau Sentis": 14.5, "Roger Miro": 14.5, "Joan Medina": 14.5, "Pau Ibañez": 14.5, "Roi Seoane": 14.5, "Oriol Tomas": 14.5, "Paco Montero": 14.5, "Andreu Cases": 14.5, "Chengzhi Li": 14.5, "Ivan Mico": 14.5, "Marc Farreras": 14.5 },
      events: {
        substitutions: [],
        cards: [
          { time: "36:00", color: "yellow", player: "Oriol Tomas" }
        ],
        goals: [
          { time: "05:00", type: "favor", scorer: "Paco Montero", assist: null, goalkeeper: "Joan Medina",
            zone: "mig5E", shotPos: { x: 646, y: 210 }, assistPos: null, conductPos: null, goalPos: { x: 225, y: 193 },
            onPitch: ["Roger Miro","Ivan Mico","Paco Montero","Marc Farreras"], notes: "Recuperacio i gol." },
          { time: "17:00", type: "favor", scorer: "Joan Medina", assist: "Marc Farreras", goalkeeper: "Pau Ibañez",
            zone: "mig6E", shotPos: { x: 745, y: 210 }, assistPos: { x: 646, y: 258 }, conductPos: null, goalPos: { x: 125, y: 193 },
            onPitch: ["Roger Miro","Ivan Mico","Joan Medina","Marc Farreras"], notes: "Molt bona paret." },
          { time: "20:00", type: "favor", scorer: "Roger Miro", assist: "Joan Medina", goalkeeper: "Pau Ibañez",
            zone: "mig5", shotPos: { x: 621, y: 210 }, assistPos: { x: 477, y: 93 }, conductPos: null, goalPos: { x: 175, y: 193 },
            onPitch: ["Roger Miro","Ivan Mico","Pau Ibañez","Marc Farreras"], notes: "Quin bon pase de Medina." },
          { time: "31:00", type: "favor", scorer: "Arnau Sentis", assist: "Chengzhi Li", goalkeeper: "Joan Medina",
            zone: "B6", shotPos: { x: 735, y: 141 }, assistPos: { x: 646, y: 162 }, conductPos: null, goalPos: { x: 175, y: 193 },
            onPitch: ["Joan Medina","Roger Miro","Arnau Sentis","Chengzhi Li"], notes: "Chenghi regalant el gol." },
          { time: "08:00", type: "contra", goalkeeper: "Joan Medina", onPitch: ["Paco Montero","Oriol Tomas","Ivan Mico","Andreu Cases"], notes: "Ens dormim en un saque de banda." },
          { time: "18:00", type: "contra", goalkeeper: "Pau Ibañez", onPitch: ["Joan Medina","Ivan Mico","Roger Miro","Marc Farreras"], notes: "Ens tornem a dormir en un saque de banda." },
          { time: "33:00", type: "contra", goalkeeper: "Joan Medina", onPitch: ["Joan Medina","Pau Ibañez","Roi Seoane","Roger Miro"], notes: "Marc la caga fent una cucharilla." },
          { time: "35:00", type: "contra", goalkeeper: "Joan Medina", onPitch: ["Roger Miro","Joan Medina","Roi Seoane","Pau Ibañez"], notes: "Gol de corner els defensem fatal." },
          { time: "37:00", type: "contra", goalkeeper: "Joan Medina", onPitch: ["Oriol Tomas","Pau Ibañez","Andreu Cases","Ivan Mico"], notes: "Gol de falta Medina te les botes amb vaselina, la falta la provoca Oriol." },
        ],
        retransmissio: [],
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
      goalkeeperMinutes: { "Pau Ibañez": 15, "Joan Medina": 25 },
      fieldMinutes: { "Arnau Sentis": 16, "Roger Miro": 16, "Joan Medina": 16, "Pau Ibañez": 16, "Roi Seoane": 16, "Oriol Tomas": 16, "Paco Montero": 16, "Andreu Cases": 16, "Ivan Mico": 16, "Marc Farreras": 16 },
      events: {
        substitutions: [],
        goals: [
          { time: "17:00", type: "favor", scorer: "Andreu Cases", assist: null, goalkeeper: null,
            zone: "B6S", shotPos: { x: 745, y: 187 }, assistPos: null, goalPos: { x: 125, y: 193 },
            onPitch: ["Andreu Cases","Chengzhi Li","Paco Montero","Ivan Mico"] },
          { time: "31:00", type: "favor", scorer: "Andreu Cases", assist: null, goalkeeper: null,
            zone: "B4E", shotPos: { x: 519, y: 162 }, assistPos: null, goalPos: { x: 225, y: 75 },
            onPitch: ["Andreu Cases","Roger Miro","Marc Farreras","Pau Ibañez"] },
          { time: "03:00", type: "contra", goalkeeper: "Pau Ibañez",  notes: "Luis D.",     onPitch: ["Chengzhi Li","Ivan Mico","Paco Montero","Roi Seoane"] },
          { time: "05:00", type: "contra", goalkeeper: "Pau Ibañez",  notes: "Carles B.",   onPitch: ["Chengzhi Li","Ivan Mico","Roi Seoane","Oriol Tomas"] },
          { time: "14:00", type: "contra", goalkeeper: "Pau Ibañez",  notes: "Albert C.",   onPitch: ["Arnau Sentis","Ivan Mico","Joan Medina","Roi Seoane"] },
          { time: "16:00", type: "contra", goalkeeper: "Pau Ibañez",  notes: "Pròpia porta del Miró", onPitch: ["Roger Miro","Arnau Sentis","Oriol Tomas","Joan Medina"] },
          { time: "18:00", type: "contra", goalkeeper: "Pau Ibañez",  notes: "Carles B.",   onPitch: ["Roger Miro","Arnau Sentis","Oriol Tomas","Andreu Cases"] },
          { time: "22:00", type: "contra", goalkeeper: "Joan Medina", notes: "Carles B.",   onPitch: ["Roger Miro","Chengzhi Li","Andreu Cases","Pau Ibañez"] },
          { time: "25:00", type: "contra", goalkeeper: "Joan Medina", notes: "Carles B.",   onPitch: ["Roger Miro","Arnau Sentis","Andreu Cases","Paco Montero"] },
          { time: "26:00", type: "contra", goalkeeper: "Joan Medina", notes: "Fernando P.", onPitch: ["Roi Seoane","Ivan Mico","Andreu Cases","Pau Ibañez"] },
          { time: "29:00", type: "contra", goalkeeper: "Joan Medina", notes: "Fernando P.", onPitch: ["Oriol Tomas","Paco Montero","Pau Ibañez","Joan Medina"] },
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
      savesManual: { "Roger Miro": 1, "Joan Medina": 6, "Pau Ibañez": 3 },
      events: {
        substitutions: [
          { time: "00:00", goalkeeper: "Joan Medina",  onPitch: ["Roi Seoane", "Pau Ibañez", "Ivan Mico", "Chengzhi Li"] },
          { time: "04:05", goalkeeper: "Joan Medina",  onPitch: ["Roi Seoane", "Pau Ibañez", "Chengzhi Li", "Andreu Cases"] },
          { time: "05:10", goalkeeper: "Joan Medina",  onPitch: ["Arnau Sentis", "Andreu Cases", "Oriol Tomas", "Chengzhi Li"] },
          { time: "07:08", goalkeeper: "Joan Medina",  onPitch: ["Arnau Sentis", "Roger Miro", "Oriol Tomas", "Andreu Cases"] },
          { time: "08:35", goalkeeper: "Joan Medina",  onPitch: ["Paco Montero", "Roger Miro", "Oriol Tomas", "Andreu Cases"] },
          { time: "11:07", goalkeeper: "Joan Medina",  onPitch: ["Paco Montero", "Roger Miro", "Ivan Mico", "Andreu Cases"] },
          { time: "12:41", goalkeeper: "Joan Medina",  onPitch: ["Paco Montero", "Roger Miro", "Ivan Mico", "Joan Medina"] },
          { time: "12:45", goalkeeper: "Pau Ibañez",   onPitch: ["Paco Montero", "Roger Miro", "Ivan Mico", "Joan Medina"] },
          { time: "14:00", goalkeeper: "Pau Ibañez",   onPitch: ["Paco Montero", "Roi Seoane", "Ivan Mico", "Joan Medina"] },
          { time: "15:11", goalkeeper: "Pau Ibañez",   onPitch: ["Arnau Sentis", "Roi Seoane", "Ivan Mico", "Joan Medina"] },
          { time: "15:38", goalkeeper: "Pau Ibañez",   onPitch: ["Arnau Sentis", "Roi Seoane", "Chengzhi Li", "Joan Medina"] },
          { time: "19:45", goalkeeper: "Roger Miro",   onPitch: ["Paco Montero", "Oriol Tomas", "Andreu Cases", "Pau Ibañez"] },
          { time: "23:15", goalkeeper: "Roger Miro",   onPitch: ["Paco Montero", "Oriol Tomas", "Andreu Cases", "Ivan Mico"] },
          { time: "23:54", goalkeeper: "Roger Miro",   onPitch: ["Paco Montero", "Chengzhi Li", "Andreu Cases", "Ivan Mico"] },
          { time: "25:00", goalkeeper: "Joan Medina",  onPitch: ["Paco Montero", "Chengzhi Li", "Roger Miro", "Ivan Mico"] },
          { time: "26:00", goalkeeper: "Joan Medina",  onPitch: ["Roi Seoane", "Chengzhi Li", "Roger Miro", "Ivan Mico"] },
          { time: "27:30", goalkeeper: "Joan Medina",  onPitch: ["Roi Seoane", "Chengzhi Li", "Roger Miro", "Arnau Sentis"] },
          { time: "29:51", goalkeeper: "Joan Medina",  onPitch: ["Roi Seoane", "Andreu Cases", "Roger Miro", "Arnau Sentis"] },
          { time: "32:23", goalkeeper: "Joan Medina",  onPitch: ["Roi Seoane", "Andreu Cases", "Pau Ibañez", "Arnau Sentis"] },
          { time: "32:50", goalkeeper: "Joan Medina",  onPitch: ["Roi Seoane", "Andreu Cases", "Pau Ibañez", "Oriol Tomas"] },
          { time: "34:10", goalkeeper: "Joan Medina",  onPitch: ["Ivan Mico", "Andreu Cases", "Pau Ibañez", "Oriol Tomas"] },
          { time: "36:09", goalkeeper: "Joan Medina",  onPitch: ["Paco Montero", "Chengzhi Li", "Pau Ibañez", "Oriol Tomas"] },
          { time: "38:27", goalkeeper: "Joan Medina",  onPitch: ["Paco Montero", "Chengzhi Li", "Roger Miro", "Oriol Tomas"] },
          { time: "38:53", goalkeeper: "Joan Medina",  onPitch: ["Arnau Sentis", "Chengzhi Li", "Roger Miro", "Oriol Tomas"] },
          { time: "39:13", goalkeeper: "Joan Medina",  onPitch: [] }
        ],
        goals: [
          { time: "06:04", type: "favor", scorer: "Chengzhi Li", assist: "Andreu Cases", goalkeeper: "Joan Medina",
            zone: "B5SE", shotPos: { x: 639, y: 180 }, assistPos: { x: 606, y: 51 }, conductPos: null, goalPos: { x: 75, y: 193 },
            onPitch: ["Arnau Sentis","Andreu Cases","Chengzhi Li","Oriol Tomas"], notes: "Molt bona combinació i parets." },
          { time: "15:11", type: "contra", goalkeeper: "Pau Ibañez", onPitch: ["Ivan Mico","Arnau Sentis","Joan Medina","Roi Seoane"], notes: "Error de transició lenta" },
          { time: "22:50", type: "favor", scorer: "Oriol Tomas", assist: "Roger Miro", goalkeeper: "Roger Miro",
            zone: "C6S", shotPos: { x: 745, y: 283 }, assistPos: { x: 112, y: 187 }, conductPos: { x: 547, y: 263 }, goalPos: { x: 175, y: 193 },
            onPitch: ["Paco Montero","Andreu Cases","Pau Ibañez","Oriol Tomas"], notes: "Pase de Ter Stegen i definició de Luis Suarez." },
          { time: "24:02", type: "contra", goalkeeper: "Roger Miro", onPitch: ["Andreu Cases","Ivan Mico","Paco Montero","Chengzhi Li"], notes: "S'adorm com a porter" },
          { time: "26:04", type: "contra", goalkeeper: "Joan Medina", onPitch: ["Chengzhi Li","Roger Miro","Ivan Mico","Roi Seoane"], notes: "Ens driblen a tots" },
          { time: "34:26", type: "contra", goalkeeper: "Joan Medina", onPitch: ["Ivan Mico","Pau Ibañez","Andreu Cases","Oriol Tomas"], notes: "Rebot afortunat." },
          { time: "38:33", type: "contra", goalkeeper: "Joan Medina", onPitch: ["Chengzhi Li","Paco Montero","Oriol Tomas","Roger Miro"], notes: "La perd Paco." },
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
      savesManual: { "Ivan Mico": 5, "Pau Ibañez": 0 },
      events: {
        substitutions: [
          { time: "3:00",  goalkeeper: "Ivan Mico", onPitch: ["Arnau Sentis", "Marc Farreras", "Chengzhi Li", "Joan Medina"] },
          { time: "6:45",  goalkeeper: "Ivan Mico", onPitch: ["Pau Ibañez", "Marc Farreras", "Chengzhi Li", "Joan Medina"] },
          { time: "10:26", goalkeeper: "Ivan Mico", onPitch: ["Pau Ibañez", "Marc Farreras", "Chengzhi Li", "Roi Seoane"] },
          { time: "12:13", goalkeeper: "Ivan Mico", onPitch: ["Roger Miro", "Paco Montero", "Roi Seoane", "Pau Ibañez"] },
          { time: "15:38", goalkeeper: "Ivan Mico", onPitch: ["Arnau Sentis", "Paco Montero", "Roi Seoane", "Roger Miro"] },
          { time: "17:38", goalkeeper: "Ivan Mico", onPitch: ["Arnau Sentis", "Paco Montero", "Chengzhi Li", "Roger Miro"] },
          { time: "19:13", goalkeeper: "Ivan Mico", onPitch: ["Chengzhi Li", "Roger Miro", "Paco Montero", "Joan Medina"] },
          { time: "19:29", goalkeeper: "Ivan Mico", onPitch: [] },
          { time: "20:40", goalkeeper: "Ivan Mico", onPitch: ["Pau Ibañez", "Joan Medina", "Paco Montero", "Chengzhi Li"] },
          { time: "23:14", goalkeeper: "Ivan Mico", onPitch: ["Pau Ibañez", "Joan Medina", "Marc Farreras", "Chengzhi Li"] },
          { time: "23:37", goalkeeper: "Ivan Mico", onPitch: ["Pau Ibañez", "Joan Medina", "Marc Farreras", "Arnau Sentis"] },
          { time: "26:54", goalkeeper: "Ivan Mico", onPitch: ["Marc Farreras", "Roger Miro", "Paco Montero", "Joan Medina"] },
          { time: "27:50", goalkeeper: "Ivan Mico", onPitch: [] },
          { time: "29:30", goalkeeper: "Ivan Mico", onPitch: ["Roi Seoane", "Roger Miro", "Paco Montero", "Marc Farreras"] },
          { time: "31:52", goalkeeper: "Ivan Mico", onPitch: ["Chengzhi Li", "Roi Seoane", "Roger Miro", "Paco Montero"] },
          { time: "33:20", goalkeeper: "Ivan Mico", onPitch: ["Chengzhi Li", "Roi Seoane", "Roger Miro", "Paco Montero"] },
          { time: "34:00", goalkeeper: "Pau Ibañez", onPitch: ["Roi Seoane", "Chengzhi Li", "Roger Miro", "Paco Montero"] },
          { time: "34:26", goalkeeper: "Pau Ibañez", onPitch: ["Roi Seoane", "Chengzhi Li", "Joan Medina", "Arnau Sentis"] },
          { time: "36:00", goalkeeper: "Pau Ibañez", onPitch: ["Arnau Sentis", "Roi Seoane", "Marc Farreras", "Joan Medina"] },
          { time: "38:00", goalkeeper: "Pau Ibañez", onPitch: ["Arnau Sentis", "Chengzhi Li", "Marc Farreras", "Joan Medina"] },
          { time: "38:33", goalkeeper: "Pau Ibañez", onPitch: ["Roger Miro", "Chengzhi Li", "Marc Farreras", "Joan Medina"] },
          { time: "39:45", goalkeeper: "Pau Ibañez", onPitch: ["Roger Miro", "Chengzhi Li", "Marc Farreras", "Arnau Sentis"] },
          { time: "40:51", goalkeeper: "Pau Ibañez", onPitch: [] },
        ],
        cards: [],
        goals: [
          { time: "9:15", type: "favor", scorer: "Marc Farreras", assist: "Chengzhi Li", goalkeeper: "Ivan Mico",
            zone: "B5", shotPos: { x: 550, y: 148 }, assistPos: { x: 339, y: 128 }, conductPos: { x: 257, y: 77 }, goalPos: { x: 13, y: 188 },
            onPitch: ["Pau Ibañez","Marc Farreras","Chengzhi Li","Joan Medina"], notes: "El porter surt en la pilota li pren Chenghi i Marc marca en la porteria buida." },
          { time: "18:01", type: "favor", scorer: "Chengzhi Li", assist: null, goalkeeper: "Ivan Mico",
            zone: "B5", shotPos: { x: 572, y: 182 }, assistPos: { x: 80, y: 165 }, conductPos: { x: 293, y: 121 }, goalPos: { x: 68, y: 185 },
            onPitch: ["Paco Montero","Chengzhi Li","Roger Miro","Arnau Sentis"], notes: "Pase d'Ivan en el cap i golas de Chenghi rapid i sorprenent." },
          { time: "15:25", type: "contra", goalkeeper: "Ivan Mico", onPitch: ["Paco Montero","Roi Seoane","Roger Miro","Pau Ibañez"], notes: "Ivan chuta a la panxa de Roi i ens marquen." },
          { time: "18:43", type: "contra", goalkeeper: "Ivan Mico", onPitch: ["Paco Montero","Roger Miro","Chengzhi Li","Arnau Sentis"], notes: "Robo mesopotamic, falta clarisima." },
          { time: "33:20", type: "contra", goalkeeper: "Ivan Mico", onPitch: ["Chengzhi Li","Roi Seoane","Roger Miro","Paco Montero"], notes: "Al primer pal nois, al primer pal." },
          { time: "34:00", type: "contra", goalkeeper: "Pau Ibañez", onPitch: ["Roi Seoane","Chengzhi Li","Roger Miro","Paco Montero"], notes: "2 contra 1 i a sobre Pau era el porter, gol asegurat." },
          { time: "35:50", type: "contra", goalkeeper: "Pau Ibañez", onPitch: ["Arnau Sentis","Roi Seoane","Chengzhi Li","Joan Medina"], notes: "Arnau te tobogants per sabates i regala la posesió, el videocamara tambe te que millorar." },
        ],
        retransmissio: [
          { time:"3:28",  type:"bona",    text:"L'Arnau recupera en pressió i tira un passe llarg cap al Medina que no hi arriba. Bones intencions, peus poc fiables.", players:["Arnau Sentis","Joan Medina"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=204s" },
          { time:"4:05",  type:"bona",    text:"El Marc filtra una passada entre línies que talla la defensa per la meitat. Breu moment on semblàvem un equip de veritat.", players:["Marc Farreras"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=241s" },
          { time:"5:10",  type:"dolenta", text:"El Medina treu malament des de porteria i l'àrbitre xiula en contra. Ni l'escalfament ha servit.", players:["Joan Medina"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=306s" },
          { time:"5:50",  type:"bona",    text:"Combinació molt bona per la banda, l'Arnau arriba amb tot i la falla per un pam. La distància entre intentar-ho i fer-ho.", players:["Arnau Sentis"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=346s" },
          { time:"7:45",  type:"bona",    text:"Primera sortida sèria de l'Ivan, fora de la porteria i tot. Talla una acció perillosa abans que escalés. Avui té ganes.", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=461s" },
          { time:"9:52",  type:"clip",    text:"El Roi rep la pilota i s'atura. Com una pedra. No va endavant, no va enrere. La pilota l'espera. L'equip l'espera. El temps passa.", players:["Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=588s" },
          { time:"10:22", type:"bona",    text:"Un rival se'n va de tots i l'Ivan surt del marc i li roba la pilota. Valentia o bogeria. En tot cas, ha funcionat.", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=618s" },
          { time:"10:35", type:"bona",    text:"El Roi fa una paret. El Roi. Fent una paret. Guardeu aquest moment per a les generacions futures.", players:["Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=631s" },
          { time:"11:00", type:"bona",    text:"L'Ivan para saltant, envia la pilota a còrner amb una mà. L'únic porter de la història que fuma i vola alhora.", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=657s" },
          { time:"11:15", type:"dolenta", text:"El Pau treu els passos prohibits. Passos. Prohibits. L'àrbitre xiula, tothom sap per quê.", players:["Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=672s" },
          { time:"12:25", type:"bona",    text:"Parada a quatre-cents de l'Ivan. Xut a boca de canó i ell hi és. Un dels millors moments del partit.", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=741s" },
          { time:"12:40", type:"bona",    text:"Combinació espectacular que acaba en xut del Pau. Potència, trajectòria, tot bé... i el porter rival ho para. Injust.", players:["Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=756s" },
          { time:"13:28", type:"bona",    text:"Parada de l'Ivan i contraatac ràpid pel lateral. El Miró s'hi llança a tota velocitat i es menja la reixa com un bacallà. Sense fre.", players:["Ivan Mico","Roger Miro"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=804s" },
          { time:"14:15", type:"tactica", text:"El Miró, en lloc de treure fort cap endavant, juga enrere i conserva. Un moment de maduresa tàctica. Breu, però existeix.", players:["Roger Miro"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=852s" },
          { time:"15:07", type:"bona",    text:"El Miró quasi la lia però la recuperem. El Roi aprofita i fa un passe de base net. Dos errors seguits que acaben en positiu.", players:["Roger Miro","Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=903s" },
          { time:"16:12", type:"bona",    text:"Paradón de l'Ivan. Estirada llarga, pilota enviada a còrner. Si el Medina fuma, l'Ivan vola. Combinació ideal.", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=969s" },
        ],
      }
    },
  ]
};

// Helper: retorna l'objecte jugador pel nom
export const getPlayer = (name) =>
  DATABASE.roster.find(p => p.name === name) || { name, number: null, position: null, photo: null, photoCel: null };
