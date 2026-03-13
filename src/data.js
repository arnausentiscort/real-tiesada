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
      idealMinutesPerPlayer: 16.0,
      events: {
        substitutions: [],
        cards: [
          { time: "36:00", color: "yellow", player: "Oriol Tomas" }
        ],
        goals: [
          { time: "05:00", type: "favor",  scorer: "Paco Montero", assist: null,            goalkeeper: "Joan Medina", onPitch: ["Roger Miro", "Ivan Mico", "Paco Montero"],
            zone: "mig5E",   shotPos: { x: 337, y: 105 }, assistPos: null,           goalPos: { x: 225, y: 175 } },
          { time: "17:00", type: "favor",  scorer: "Joan Medina",  assist: "Marc Farreras", goalkeeper: "Pau Ibañez",  onPitch: ["Roger Miro", "Ivan Mico", "Joan Medina"],
            zone: "mig6E",   shotPos: { x: 408, y: 105 }, assistPos: { x: 337, y: 131 }, goalPos: { x: 125, y: 175 } },
          { time: "20:00", type: "favor",  scorer: "Roger Miro",   assist: "Joan Medina",   goalkeeper: "Pau Ibañez",  onPitch: ["Roger Miro", "Ivan Mico", "Pau Ibañez"],
            zone: "mig5",    shotPos: { x: 315, y: 105 }, assistPos: { x: 245, y: 56  }, goalPos: { x: 175, y: 175 } },
          { time: "31:00", type: "favor",  scorer: "Arnau Sentis", assist: "Chengzhi Li",   goalkeeper: "Joan Medina", onPitch: ["Joan Medina", "Roger Miro", "Arnau Sentis"],
            zone: "B6",      shotPos: { x: 385, y: 78  }, assistPos: { x: 337, y: 78  }, goalPos: { x: 175, y: 175 } },
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
      idealMinutesPerPlayer: 16.0,
      events: {
        substitutions: [],
        goals: [
          { time: "17:00", type: "favor",  scorer: "Andreu Cases", assist: null, goalkeeper: null,
            zone: "B6S",   shotPos: { x: 385, y: 100 }, assistPos: null,              goalPos: { x: 125, y: 175 } },
          { time: "31:00", type: "favor",  scorer: "Andreu Cases", assist: null, goalkeeper: null,
            zone: "B4E",   shotPos: { x: 267, y: 78  }, assistPos: null,              goalPos: { x: 225, y: 83  } },
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
      date: "03 Nov 2023",
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
            zone: "B5SE",  shotPos: { x: 330, y: 93  }, assistPos: { x: 300, y: 11  }, goalPos: { x: 75,  y: 175 } },
          { time: "15:11", type: "contra", goalkeeper: "Pau Ibañez",  notes: "Error de transició lenta" },
          { time: "22:50", type: "favor",  scorer: "Oriol Tomas",   assist: "Roger Miro",   goalkeeper: "Rival",
            zone: "C6S",   shotPos: { x: 385, y: 153 }, assistPos: { x: 35,  y: 100 }, goalPos: { x: 175, y: 175 } },
          { time: "24:02", type: "contra", goalkeeper: "Roger Miro",  notes: "S'adorm com a porter" },
          { time: "26:04", type: "contra", goalkeeper: "Joan Medina", notes: "Ens driblen a tots" },
          { time: "34:26", type: "contra", goalkeeper: "Joan Medina", notes: "Rebot afortunat" },
          { time: "38:33", type: "contra", goalkeeper: "Joan Medina", notes: "La perd Paco" }
        ],
        highlights: [
          { time: "22:00", player: "Oriol Tomas", type: "moment", emoji: "🤸", title: "El Pi de l'Oriol", description: "L'Oriol fa una entrada acrobàtica espectacular al terra que deixa tothom al·lucinat", photo: "gallery/j3-oriol-pi.jpg" },
        ]
      }
    }
  ]
};

// Helper: retorna l'objecte jugador pel nom
export const getPlayer = (name) =>
  DATABASE.roster.find(p => p.name === name) || { name, number: null, position: null, photo: null, photoCel: null };
