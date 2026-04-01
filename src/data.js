// ==========================================
// BASE DE DADES ESTÀTICA — Real Tiesada FC
// ==========================================

export const DATABASE = {
  teamName: "Real Tiesada",

  // Proper partit (actualitza cada setmana)
  nextMatch: {
    opponent: "Fabbas FC",
    date: "2026-03-30T22:30:00",
    dateLabel: "30 Mar 2026 · 22:30h",
    location: "St. Ignasi Sala 2",
    jornada: "Jornada 6",
    isHome: false,
  },

  // Calendari complet de la temporada
  calendar: [
    { date: "2026-03-23T23:15:00", dateLabel: "23 Mar · 23:15h", jornada: "Jornada 5",  opponent: "Dgeneración X", location: "St. Ignasi Sala 2", isHome: true  },
    { date: "2026-03-30T22:30:00", dateLabel: "30 Mar · 22:30h", jornada: "Jornada 6",  opponent: "Fabbas FC",     location: "St. Ignasi Sala 2", isHome: false },
    { date: "2026-04-13T21:45:00", dateLabel: "13 Abr · 21:45h", jornada: "Jornada 7",  opponent: "Great Spirit",  location: "St. Ignasi Sala 2", isHome: true  },
    { date: "2026-04-27T21:45:00", dateLabel: "27 Abr · 21:45h", jornada: "Jornada 8",  opponent: "Vietkong",      location: "St. Ignasi Sala 2", isHome: false },
    { date: "2026-05-04T22:30:00", dateLabel: "04 Mai · 22:30h", jornada: "Jornada 9",  opponent: "Vikings",       location: "St. Ignasi Sala 2", isHome: true  },
    { date: "2026-05-11T21:00:00", dateLabel: "11 Mai · 21:00h", jornada: "Jornada 10", opponent: "Ensaimada",     location: "St. Ignasi Sala 1", isHome: false },
    { date: "2026-05-18T22:30:00", dateLabel: "18 Mai · 22:30h", jornada: "Jornada 11", opponent: "Uruks",         location: "St. Ignasi Sala 2", isHome: true  },
    { date: "2026-06-01T21:00:00", dateLabel: "01 Jun · 21:00h", jornada: "Jornada 12", opponent: "Touchlas FC",   location: "St. Ignasi Sala 1", isHome: false },
    { date: "2026-06-08T21:45:00", dateLabel: "08 Jun · 21:45h", jornada: "Jornada 13", opponent: "Dgeneración X", location: "St. Ignasi Sala 1", isHome: true  },
    { date: "2026-06-15T21:00:00", dateLabel: "15 Jun · 21:00h", jornada: "Jornada 14", opponent: "Fabbas FC",     location: "St. Ignasi Sala 1", isHome: false },
    { date: "2026-06-22T23:15:00", dateLabel: "22 Jun · 23:15h", jornada: "Jornada 15", opponent: "Great Spirit",  location: "St. Ignasi Sala 1", isHome: true  },
    { date: "2026-07-06T21:45:00", dateLabel: "06 Jul · 21:45h", jornada: "Jornada 16", opponent: "Vietkong",      location: "St. Ignasi Sala 1", isHome: false },
  ],

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
    { name: "Chengzhi Li",   number: 12, shirtName: "CHENGZHI LI", position: "Davanter",    photo: "players/chenghy.png",   photoCel: "players/chengzhi_cel.png" },
    { name: "Ivan Mico",     number: 4,  shirtName: "QUATRE",      position: "Defensa",     photo: null,                 photoCel: null },
    { name: "Marc Farreras", number: 77, shirtName: "FARRERAS",    position: "Davanter",    photo: "players/marc.png",   photoCel: "players/marc_cel.png" },
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
            onPitch: ["Andreu Cases"] },
          { time: "31:00", type: "favor", scorer: "Andreu Cases", assist: null, goalkeeper: null,
            zone: "B4E", shotPos: { x: 519, y: 162 }, assistPos: null, goalPos: { x: 225, y: 75 },
            onPitch: ["Andreu Cases"] },
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
          { time: "18:01", type: "favor", scorer: "Chengzhi Li", assist: "Ivan Mico", goalkeeper: "Ivan Mico",
            zone: "B5", shotPos: { x: 572, y: 182 }, assistPos: { x: 80, y: 165 }, conductPos: { x: 293, y: 121 }, goalPos: { x: 68, y: 185 },
            localVideoUrl: "gallery/j3-gol-chengzhi.mp4",
            onPitch: ["Paco Montero","Chengzhi Li","Roger Miro","Arnau Sentis"], notes: "Pase d'Ivan en el cap i golas de Chenghi rapid i sorprenent." },
          { time: "15:25", type: "contra", goalkeeper: "Ivan Mico", onPitch: ["Paco Montero","Roi Seoane","Roger Miro","Pau Ibañez"], notes: "Ivan chuta a la panxa de Roi i ens marquen." },
          { time: "18:43", type: "contra", goalkeeper: "Ivan Mico", onPitch: ["Paco Montero","Roger Miro","Chengzhi Li","Arnau Sentis"], notes: "Robo mesopotamic, falta clarisima." },
          { time: "33:20", type: "contra", goalkeeper: "Ivan Mico", onPitch: ["Chengzhi Li","Roi Seoane","Roger Miro","Paco Montero"], notes: "Al primer pal nois, al primer pal." },
          { time: "34:00", type: "contra", goalkeeper: "Pau Ibañez", onPitch: ["Roi Seoane","Chengzhi Li","Roger Miro","Paco Montero"], notes: "2 contra 1 i a sobre Pau era el porter, gol asegurat." },
          { time: "35:50", type: "contra", goalkeeper: "Pau Ibañez", onPitch: ["Arnau Sentis","Roi Seoane","Chengzhi Li","Joan Medina"], notes: "Arnau te tobogants per sabates i regala la posesió, el videocamara tambe te que millorar." },
        ],
        retransmissio: [
          { time:"3:28",  type:"bona",    text:"L'Arnau recupera i tira un passe llarg cap al Medina que no hi arriba. Bones intencions, peus poc fiables.", players:["Arnau Sentis","Joan Medina"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=204s" },
          { time:"4:05",  type:"bona",    text:"El Marc filtra una passada entre línies que talla la defensa per la meitat. Breu moment on semblàvem un equip de veritat.", players:["Marc Farreras"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=241s" },
          { time:"5:10",  type:"dolenta", text:"El Medina treu malament de banda i l'àrbitre xiula en contra. Ni en les mans ho fem be.", players:["Joan Medina"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=306s" },
          { time:"5:50",  type:"bona",    text:"Combinació molt bona per la banda, llastima que la pilota li cau a l'Arnau.", players:["Arnau Sentis"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=346s" },
          { time:"7:45",  type:"bona",    text:"Primera sortida sèria de l'Ivan, fora de la porteria i tot. Talla una acció perillosa abans que escalés. Avui té ganes.", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=461s" },
          { time:"9:52",  type:"clip",    text:"El Pau saca de banda com qui tira una pedra al riu. ", players:["Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=588s" },
          { time:"10:22", type:"bona",    text:"Un rival se'n va de tots i l'Ivan surt i li roba la pilota. Valentia o bogeria. En tot cas, ha funcionat.", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=618s" },
          { time:"10:35", type:"bona",    text:"El Roi fa una paret. El Roi. Fent una paret. Guardeu aquest moment per a les generacions futures.", players:["Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=631s" },
          { time:"11:00", type:"bona",    text:"L'Ivan para saltant, com es nota que jugava a volleyball.", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=657s" },
          { time:"11:15", type:"dolenta", text:"El Pau treu els passos prohibits. L'àrbitre pita falta, per alguna cosa son prohibits.", players:["Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=672s" },
          { time:"12:25", type:"bona",    text:"Parada de 400. Quin senyor porter hem descobert.", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=741s" },
          { time:"12:40", type:"bona",    text:"De les millors jugades de Roi mai vistes Coro no sho creuria. ", players:["Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=756s" },
          { time:"13:28", type:"bona",    text:"Parada de l'Ivan i contraatac ràpid pel lateral. El Miró s'hi llança a tota velocitat i es menja la red com una sardina.", players:["Ivan Mico","Roger Miro"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=804s" },
          { time:"15:07", type:"bona",    text:"Encara estic suant per aquesta jugada. Roi continua esplendit.", players:["Roger Miro","Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=903s" },
          { time:"16:12", type:"bona",    text:"Paradón de l'Ivan. Qua faria si portes guants?", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=tokKRGjQP1Q&t=969s" },
        ],
      }
    },

// ── JORNADA 5 — Dgeneración ──────────────────────────────────────
    {
      id: "j5-dgeneracion",
      jornada: "Jornada 5",
      opponent: "Dgeneración X",
      result: "1 - 3",
      date: "23 Mar 2026",
      youtubeId: "7CV-4Fjj7tw",
      vimeoId: null,
      idealMinutesPerPlayer: 16.0,
      savesManual: { "Ivan Mico": 8, "Joan Medina": 5 },
      events: {
       substitutions: [
          { time: "00:00", goalkeeper: "Ivan Mico", onPitch: ["Pau Ibañez", "Oriol Tomas", "Paco Montero", "Roger Miro"] },
          { time: "05:56", goalkeeper: "Ivan Mico", onPitch: ["Oriol Tomas", "Paco Montero", "Roger Miro", "Andreu Cases"] },
          { time: "07:35", goalkeeper: "Ivan Mico", onPitch: ["Arnau Sentis", "Joan Medina", "Roi Seoane", "Andreu Cases"] },
          { time: "14:42", goalkeeper: "Ivan Mico", onPitch: ["Pau Ibañez", "Joan Medina", "Roi Seoane", "Andreu Cases"] },
          { time: "16:16", goalkeeper: "Ivan Mico", onPitch: ["Paco Montero", "Andreu Cases", "Joan Medina", "Pau Ibañez"] },
          { time: "17:26", goalkeeper: "Ivan Mico", onPitch: ["Oriol Tomas", "Paco Montero", "Pau Ibañez", "Roger Miro"] },
          
          // Pausa por la media parte
          { time: "18:13", goalkeeper: "Ivan Mico", onPitch: [] },
          { time: "18:41", goalkeeper: "Joan Medina", onPitch: ["Roger Miro", "Pau Ibañez", "Paco Montero", "Oriol Tomas"] },
          
          { time: "21:07", goalkeeper: "Joan Medina", onPitch: ["Ivan Mico", "Paco Montero", "Oriol Tomas", "Roger Miro"] },
          { time: "25:04", goalkeeper: "Joan Medina", onPitch: ["Oriol Tomas", "Roger Miro", "Andreu Cases", "Ivan Mico"] },
          { time: "25:24", goalkeeper: "Joan Medina", onPitch: ["Arnau Sentis", "Oriol Tomas", "Andreu Cases", "Ivan Mico"] },
          { time: "25:50", goalkeeper: "Joan Medina", onPitch: ["Arnau Sentis", "Andreu Cases", "Roi Seoane", "Ivan Mico"] },
          
          // Entran justo antes del corte de vídeo
          { time: "26:37", goalkeeper: "Joan Medina", onPitch: ["Arnau Sentis", "Pau Ibañez", "Roi Seoane", "Andreu Cases"] },
          
          // Pausa por el tiempo muerto (+1 MINUTO AÑADIDO MAGÍCAMENTE AQUÍ)
          // Antes era 29:10, ahora es 30:10. Esto les regala 1 minuto de estadística.
          { time: "30:10", goalkeeper: "Joan Medina", onPitch: [] },
          
          // Reanudamos después del tiempo muerto
          { time: "30:55", goalkeeper: "Ivan Mico", onPitch: ["Joan Medina", "Paco Montero", "Andreu Cases", "Roi Seoane"] },
          
          // Último cambio
          { time: "33:00", goalkeeper: "Ivan Mico", onPitch: ["Andreu Cases", "Paco Montero", "Oriol Tomas", "Joan Medina"] },
          
          // Final del partido
          { time: "36:48", goalkeeper: "Ivan Mico", onPitch: [] }
        ],
        cards: [],
        goals: [
          { time: "04:25", type: "favor", scorer: "Roger Miro", assist: "Ivan Mico", goalkeeper: "Ivan Mico",
            zone: "A2", shotPos: { x: 245, y: 114 }, assistPos: { x: 70, y: 201 }, conductPos: null, goalPos: { x: 290, y: 10 },
            onPitch: ["Roger Miro","Pau Ibañez","Paco Montero","Oriol Tomas"], notes: "Golas per la esquadra de Miro increible." },
          { time: "05:35", type: "contra", goalkeeper: "Ivan Mico", onPitch: ["Pau Ibañez","Oriol Tomas","Paco Montero","Roger Miro"], notes: "Intentem sortir pel mig, ens la recuperen i ens marquen." },
          { time: "26:18", type: "contra", goalkeeper: "Joan Medina", onPitch: ["Arnau Sentis","Ivan Mico","Roi Seoane","Andreu Cases"], notes: "Ens marquen un golas des de la banda." },
          { time: "27:47", type: "contra", goalkeeper: "Joan Medina", onPitch: ["Arnau Sentis","Andreu Cases","Roi Seoane","Pau Ibañez"], notes: "No surt al video, Medina fa una parada i despres ens marquen." }
        ],
        retransmissio: [
          { time:"00:36", type:"dolenta", text:"Cagada d'Oriol a la sortida per a fer una paradeta fàcil d'Ivan.", players:["Oriol Tomas", "Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=33s" },
          { time:"03:08", type:"bona",    text:"El porter rival surt de la porteria i Paco casi marca. El porter rival va fora de l'àrea?", players:["Paco Montero"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=185s" },
          { time:"09:02", type:"dolenta", text:"L'Ivan regala la pilota a Qatar Airways.", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=539s" },
          { time:"09:42", type:"bona",    text:"Molt bona jugada entre Medina, Arnau i Roi.", players:["Joan Medina", "Arnau Sentis", "Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=579s" },
          { time:"14:34", type:"bona",    text:"Bon xut d'Andreu.", players:["Andreu Cases"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=871s" },
          { time:"15:41", type:"clip",    text:"Aquesta jugada val la pena mirar-la, cada segon és millor que l'anterior.", players:[], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=938s" },
          { time:"19:20", type:"bona",    text:"Cagada d'en Medina sortint de porter i després paradón.", players:["Joan Medina"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1157s" },
          { time:"19:56", type:"bona",    text:"Gran combinació entre Miró i Pau. THEM ON FIRE REAL TIESADA 👏.", players:["Roger Miro", "Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1193s" },
          { time:"20:50", type:"bona",    text:"Xutazo de Roger Miró.", players:["Roger Miro"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1247s" },
          { time:"25:10", type:"bona",    text:"Un altre quasi gol de Miró, està a tope. El porter torna a semblar avançat.", players:["Roger Miro"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1507s" },
          { time:"25:51", type:"bona",    text:"Bona combinació que acaba en pal de Roi.", players:["Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1548s" },
          { time:"28:30", type:"clip",    text:"Jugada rara, la titulo 'El T-Rex'.", players:[], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1707s" },
          { time:"28:49", type:"bona",    text:"Bona jugada entre Roi i Pau.", players:["Roi Seoane", "Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1726s" },
          { time:"30:16", type:"clip",    text:"L'Andreu fa una segada que se la juga.", players:["Andreu Cases"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1813s" },
          { time:"31:00", type:"bona",    text:"El Roi corre per defensar i talla l'acció... i gairebé es marca en pròpia.", players:["Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1857s" },
          { time:"32:10", type:"bona",    text:"Xut d'en Telico que en Paco l'intenta enredar i surt fregant el pal.", players:["Andreu Cases", "Paco Montero"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1927s" },
          { time:"33:00", type:"bona",    text:"Molt bona jugada i xut d'Oriol.", players:["Oriol Tomas"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1977s" },
          { time:"33:15", type:"bona",    text:"Xut de l'Andreu davant del porter, després li fan penal al Medina. L'àrbitre no té ulleres.", players:["Andreu Cases", "Joan Medina"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1992s" },
          { time:"34:31", type:"bona",    text:"Xut molt bo d'en Paco des de la banda, el porter la para.", players:["Paco Montero"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=2068s" },
          { time:"35:20", type:"bona",    text:"Un altre xut d'en Paco.", players:["Paco Montero"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=2117s" }
        ]
      }
    },

    // ── JORNADA 6 — Fabbas FC ────────────────────────────────────────
    {
      id: "j6-fabbas-fc",
      jornada: "Jornada 6",
      opponent: "Fabbas FC",
      result: "2 - 2",
      date: "31 Mar 2026",
      youtubeId: "e3C1MCuXFQY",
      vimeoId: null,
      idealMinutesPerPlayer: 16.0,
      savesManual: { "Ivan Mico": 11, "Joan Medina": 3 },
      events: {
        substitutions: [
          { time: "00:00", goalkeeper: "Joan Medina", onPitch: ["Arnau Sentis","Oriol Tomas","Chengzhi Li","Ivan Mico"] },
          { time: "4:35",  goalkeeper: "Joan Medina", onPitch: ["Arnau Sentis","Pau Ibañez","Oriol Tomas","Chengzhi Li"] },
          { time: "5:56",  goalkeeper: "Joan Medina", onPitch: ["Arnau Sentis","Roger Miro","Pau Ibañez","Oriol Tomas"] },
          { time: "7:03",  goalkeeper: "Joan Medina", onPitch: ["Pau Ibañez","Roger Miro","Paco Montero","Arnau Sentis"] },
          { time: "7:10",  goalkeeper: "Ivan Mico",   onPitch: ["Arnau Sentis","Roger Miro","Pau Ibañez","Paco Montero"] },
          { time: "7:55",  goalkeeper: "Ivan Mico",   onPitch: ["Joan Medina","Roger Miro","Pau Ibañez","Paco Montero"] },
          { time: "12:36", goalkeeper: "Ivan Mico",   onPitch: ["Joan Medina","Chengzhi Li","Paco Montero","Roger Miro"] },
          { time: "13:44", goalkeeper: "Ivan Mico",   onPitch: ["Roger Miro","Oriol Tomas","Paco Montero","Chengzhi Li"] },
          { time: "15:56", goalkeeper: "Ivan Mico",   onPitch: ["Arnau Sentis","Oriol Tomas","Chengzhi Li","Paco Montero"] },
          { time: "17:31", goalkeeper: "Ivan Mico",   onPitch: ["Arnau Sentis","Pau Ibañez","Oriol Tomas","Paco Montero"] },
          { time: "18:44", goalkeeper: "Ivan Mico",   onPitch: ["Arnau Sentis","Pau Ibañez","Paco Montero","Roger Miro"] },
          { time: "20:11", goalkeeper: "Ivan Mico",   onPitch: ["Chengzhi Li","Pau Ibañez","Roger Miro","Arnau Sentis"] },
          { time: "21:19", goalkeeper: "Ivan Mico",   onPitch: ["Roger Miro","Pau Ibañez","Chengzhi Li","Oriol Tomas"] },
          { time: "23:20", goalkeeper: "Ivan Mico",   onPitch: ["Pau Ibañez","Oriol Tomas","Roger Miro","Arnau Sentis"] },
          { time: "24:15", goalkeeper: "Ivan Mico",   onPitch: ["Joan Medina","Roger Miro","Oriol Tomas","Pau Ibañez"] },
          { time: "26:40", goalkeeper: "Ivan Mico",   onPitch: ["Joan Medina","Roger Miro","Paco Montero","Chengzhi Li"] },
          { time: "28:25", goalkeeper: "Ivan Mico",   onPitch: ["Arnau Sentis","Roger Miro","Paco Montero","Chengzhi Li"] },
          { time: "29:15", goalkeeper: "Ivan Mico",   onPitch: ["Arnau Sentis","Pau Ibañez","Paco Montero","Chengzhi Li"] },
          { time: "31:36", goalkeeper: "Ivan Mico",   onPitch: ["Paco Montero","Arnau Sentis","Joan Medina","Oriol Tomas"] },
          { time: "33:25", goalkeeper: "Ivan Mico",   onPitch: ["Roger Miro","Oriol Tomas","Joan Medina","Paco Montero"] },
          { time: "35:09", goalkeeper: "Ivan Mico",   onPitch: ["Roger Miro","Joan Medina","Paco Montero","Pau Ibañez"] },
          { time: "35:29", goalkeeper: "Ivan Mico",   onPitch: ["Roger Miro","Pau Ibañez","Paco Montero","Chengzhi Li"] },
          { time: "38:29", goalkeeper: "Ivan Mico",   onPitch: ["Arnau Sentis","Roger Miro","Pau Ibañez","Chengzhi Li"] },
          { time: "39:26", goalkeeper: "Ivan Mico",   onPitch: ["Arnau Sentis","Roger Miro","Oriol Tomas","Chengzhi Li"] },
        ],
        cards: [
          { time: "5:00", type: "yellow", player: "Pau Ibañez" },
        ],
        goals: [
          { time: "3:50",  type: "contra", goalkeeper: "Joan Medina",
            onPitch: ["Arnau Sentis","Oriol Tomas","Chengzhi Li","Ivan Mico"],
            notes: "L'Ivan demana canvi al moment pitjor i el rival aprofita el desori per marcar. Una norma de temps mort que no entén ningú." },
          { time: "12:09", type: "favor", scorer: "Joan Medina", assist: "Pau Ibañez", goalkeeper: "Ivan Mico",
            zone: "B6", shotPos: { x: 719, y: 174 }, assistPos: { x: 602, y: 203 }, conductPos: null, goalPos: { x: 33, y: 135 },
            onPitch: ["Roger Miro","Pau Ibañez","Paco Montero","Joan Medina"],
            notes: "Sortida de pilota de manual. El Pau el deixa sol davant del porter i el Medina no perdona." },
          { time: "17:59", type: "favor", scorer: "Oriol Tomas", assist: null, goalkeeper: "Ivan Mico",
            zone: "B3", shotPos: { x: 399, y: 202 }, assistPos: null, conductPos: null, goalPos: { x: 133, y: 15 },
            onPitch: ["Arnau Sentis","Pau Ibañez","Oriol Tomas","Paco Montero"],
            notes: "GOLÀS des de mig camp. L'Oriol la veu i l'envia a l'escaire sense pensar-s'ho." },
          { time: "36:42", type: "contra", goalkeeper: "Ivan Mico",
            onPitch: ["Roger Miro","Pau Ibañez","Paco Montero","Chengzhi Li"],
            notes: "Saque de banda, el Paco perd la marca i el rival marca. Una llàstima quan quedaven menys de 4 minuts." },
        ],
        retransmissio: [
          { time: "0:15",  type: "bona",    text: "Primera combinació amb xut tapat del Chengzhi. Bon inici.",                                                                           players: [],                                          videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=12s" },
          { time: "1:03",  type: "clip",    text: "L'Ivan li fot una patada al peu del rival. El dolgut acaba sent ell.",                                                                 players: ["Ivan Mico"],                               videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=60s" },
          { time: "3:15",  type: "bona",    text: "Parada del Medina i a la contra un xut de l'Oriol que quasi entra.",                                                                  players: ["Joan Medina","Oriol Tomas"],                videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=192s" },
          { time: "5:00",  type: "dolenta", text: "Primera acció del Pau: falta i groga per agafar. Clàssic.",                                                                           players: ["Pau Ibañez"],                              videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=297s" },
          { time: "6:38",  type: "bona",    text: "Parada del Medina i contra entre l'Oriol i l'Arnau que acaba en xut de l'Oriol.",                                                    players: ["Joan Medina","Oriol Tomas","Arnau Sentis"], videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=395s" },
          { time: "8:21",  type: "bona",    text: "Molt bona combinació sortint des de porteria amb cop de cap del Medina que quasi porta el gol.",                                      players: ["Joan Medina"],                             videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=498s" },
          { time: "14:00", type: "bona",    text: "El Miró té un 1 contra 1 contra el porter i no el mata. Una llàstima.",                                                               players: ["Roger Miro"],                              videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=837s" },
          { time: "20:45", type: "bona",    text: "Moment de patiment intens. L'Ivan treu una aturada providencial.",                                                                    players: ["Ivan Mico"],                               videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=1242s" },
          { time: "27:02", type: "bona",    text: "Pilota llarga al Miró que xuta, la para el porter. El Chengzhi remata de taló però tampoc entra.",                                   players: ["Roger Miro","Chengzhi Li"],                 videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=1619s" },
          { time: "28:50", type: "bona",    text: "Combinació i xut del Chengzhi amb perill.",                                                                                           players: ["Chengzhi Li"],                             videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=1727s" },
          { time: "30:27", type: "clip",    text: "L'Arnau controla sol davant del porter i li para. La Nuria s'emociona tant que decideix gravar el terra.",                            players: ["Arnau Sentis"],                            videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=1824s" },
          { time: "30:44", type: "dolenta", text: "Lesió de genoll del Pau. Moment de tensió.",                                                                                          players: ["Pau Ibañez"],                              videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=1841s" },
          { time: "32:20", type: "dolenta", text: "Possible penal en contra. L'àrbitre no el veu.",                                                                                     players: [],                                          videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=1937s" },
          { time: "32:49", type: "bona",    text: "LLARGUER del Paco! Centímetres de diferència.",                                                                                      players: ["Paco Montero"],                            videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=1966s" },
          { time: "34:40", type: "dolenta", text: "El Medina fa una passada al aire en una contra 2 contra 1. Oportunitat perduda.",                                                     players: ["Joan Medina"],                             videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=2077s" },
          { time: "35:11", type: "dolenta", text: "El Miró falla la passada en un 3 contra 1. Seguim sense rematar les ocasions.",                                                      players: ["Roger Miro"],                              videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=2108s" },
          { time: "37:30", type: "bona",    text: "Penal al Pau. El porter para el xut però ja era empat.",                                                                              players: ["Pau Ibañez"],                              videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=2247s" },
          { time: "38:57", type: "clip",    text: "El Miró quasi es marca en pròpia i ens mata d'un infart. Per sort el rival tira fora.",                                               players: ["Roger Miro"],                              videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=2334s" },
          { time: "40:04", type: "bona",    text: "S'acaba el partit. PRIMER PUNT PER A LA REAL TIESADA! 🎉",                                                                           players: [],                                          videoUrl: "https://www.youtube.com/watch?v=e3C1MCuXFQY&t=2401s" },
        ],
      }
    },
  ]
};

// Helper: retorna l'objecte jugador pel nom
export const getPlayer = (name) =>
  DATABASE.roster.find(p => p.name === name) || { name, number: null, position: null, photo: null, photoCel: null };