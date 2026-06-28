// j15-great-spirit
// De la Real Tiesada hi jugaren: Arnau Sentis, Pau Ibañez, Roger Miro, Paco Montero (Gabarri), Marc Farreras
// Convidats: Joan Porter (porter), Igni, Cardona, Marc Castells
export default {
  id: "j15-great-spirit",
  jornada: "Jornada 15",
  opponent: "Great Spirit",
  result: "5 - 2",
  date: "22 Jun 2026",
  youtubeId: "vi2PDXfRhp8",
  vimeoId: null,
  idealMinutesPerPlayer: 20,
  guestPlayers: ["Joan Porter", "Igni", "Cardona", "Marc Castells"],
  savesManual: { "Joan Porter": 0, "Pau Ibañez": 1 },
  shots: {
    "Marc Farreras": [{ time: "0:30", onTarget: false }, { time: "15:48", onTarget: true }, { time: "18:17", onTarget: false }, { time: "27:40", onTarget: true }],
    "Pau Ibañez":    [{ time: "2:15", onTarget: true  }, { time: "17:12", onTarget: false }],
    "Paco Montero":  [{ time: "2:49", onTarget: true  }, { time: "5:30",  onTarget: true  }],
    "Igni":          [{ time: "11:51", onTarget: false }],
    "Arnau Sentis":  [{ time: "17:02", onTarget: true  }, { time: "27:10", onTarget: true  }, { time: "40:00", onTarget: true  }],
    "Roger Miro":    [{ time: "18:51", onTarget: true  }, { time: "34:25", onTarget: true  }, { time: "39:50", onTarget: true  }],
    "Marc Castells": [{ time: "35:29", onTarget: true  }],
  },
  keyPasses: {
    "Arnau Sentis": [{ time: "2:15" }, { time: "18:17" }, { time: "27:40" }, { time: "39:50" }],
    "Marc Farreras": [{ time: "2:49" }, { time: "17:02" }],
    "Igni":          [{ time: "5:30" }, { time: "18:51" }],
    "Roger Miro":    [{ time: "11:51" }, { time: "35:29" }],
    "Paco Montero":  [{ time: "27:10" }],
  },
  dribbles: {
    "Marc Farreras": [{ time: "17:45" }],
  },
  events: {
    substitutions: [
      { time: "0:00",  goalkeeper: "Joan Porter", onPitch: ["Pau Ibañez", "Arnau Sentis", "Paco Montero", "Marc Farreras"] },
      { time: "5:15",  goalkeeper: "Joan Porter", onPitch: ["Igni", "Pau Ibañez", "Marc Farreras", "Paco Montero"] },
      { time: "6:38",  goalkeeper: "Joan Porter", onPitch: ["Marc Castells", "Igni", "Cardona", "Roger Miro"] },
      { time: "12:04", goalkeeper: null,           onPitch: ["Arnau Sentis", "Marc Castells", "Cardona", "Roger Miro"] },
      { time: "13:05", goalkeeper: "Joan Porter", onPitch: ["Arnau Sentis", "Pau Ibañez", "Marc Farreras", "Paco Montero"] },
      { time: "18:35", goalkeeper: "Joan Porter", onPitch: ["Roger Miro", "Pau Ibañez", "Igni", "Marc Castells"] },
      { time: "20:17", goalkeeper: "Joan Porter", onPitch: ["Igni", "Marc Castells", "Cardona", "Roger Miro"] },
      { time: "21:00", goalkeeper: "Pau Ibañez",  onPitch: ["Cardona", "Igni", "Marc Castells", "Roger Miro"] },
      { time: "24:34", goalkeeper: "Pau Ibañez",  onPitch: ["Joan Porter", "Marc Castells", "Igni", "Cardona"] },
      { time: "26:23", goalkeeper: "Pau Ibañez",  onPitch: ["Arnau Sentis", "Joan Porter", "Paco Montero", "Marc Farreras"] },
      { time: "32:11", goalkeeper: "Pau Ibañez",  onPitch: ["Roger Miro", "Marc Castells", "Igni", "Cardona"] },
      { time: "33:00", goalkeeper: "Joan Porter", onPitch: ["Roger Miro", "Igni", "Marc Castells", "Cardona"] },
      { time: "36:50", goalkeeper: "Joan Porter", onPitch: ["Roger Miro", "Pau Ibañez", "Igni", "Marc Castells"] },
      { time: "37:48", goalkeeper: "Joan Porter", onPitch: ["Arnau Sentis", "Pau Ibañez", "Marc Castells", "Igni"] },
      { time: "38:22", goalkeeper: "Joan Porter", onPitch: ["Arnau Sentis", "Pau Ibañez", "Paco Montero", "Igni"] },
      { time: "38:57", goalkeeper: "Joan Porter", onPitch: ["Arnau Sentis", "Pau Ibañez", "Marc Farreras", "Paco Montero"] },
      { time: "39:15", goalkeeper: "Joan Porter", onPitch: ["Roger Miro", "Arnau Sentis", "Pau Ibañez", "Marc Farreras"] },
    ],
    cards: [],
    goals: [
      { time: "5:02",  type: "favor",  scorer: "Marc Farreras", assist: null,           goalkeeper: "Joan Porter",
        zone: "C6", shotPos: { x: 746, y: 220 }, assistPos: { x: 627, y: 385 }, conductPos: null, goalPos: { x: 272, y: 195 },
        onPitch: ["Arnau Sentis", "Pau Ibañez", "Marc Farreras", "Paco Montero"] },

      { time: "9:43",  type: "favor",  scorer: "Cardona",       assist: "Marc Castells", goalkeeper: "Joan Porter",
        zone: "B6", shotPos: { x: 742, y: 175 }, assistPos: { x: 704, y: 211 }, conductPos: null, goalPos: { x: 42, y: 171 },
        onPitch: ["Roger Miro", "Marc Castells", "Igni", "Cardona"] },

      { time: "19:16", type: "favor",  scorer: "Roger Miro",    assist: "Marc Castells", goalkeeper: "Joan Porter",
        zone: "C6", shotPos: { x: 706, y: 265 }, assistPos: { x: 560, y: 89  }, conductPos: null, goalPos: { x: 208, y: 195 },
        onPitch: ["Roger Miro", "Pau Ibañez", "Marc Castells", "Igni"] },

      { time: "24:30", type: "contra",                                                    goalkeeper: "Pau Ibañez",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Marc Castells", "Igni", "Cardona", "Roger Miro"],
        notes: "El rival gira i marca molt sobrat." },

      { time: "28:04", type: "favor",  scorer: "Arnau Sentis",  assist: "Paco Montero", goalkeeper: "Pau Ibañez",
        zone: "B6", shotPos: { x: 758, y: 206 }, assistPos: { x: 771, y: 258 }, conductPos: null, goalPos: { x: 76, y: 186 },
        onPitch: ["Arnau Sentis", "Joan Porter", "Paco Montero", "Marc Farreras"] },

      { time: "31:49", type: "favor",  scorer: "Arnau Sentis",  assist: null,           goalkeeper: "Pau Ibañez",
        zone: "C6", shotPos: { x: 750, y: 221 }, assistPos: null, conductPos: null, goalPos: { x: 267, y: 183 },
        onPitch: ["Arnau Sentis", "Marc Farreras", "Joan Porter", "Paco Montero"] },

      { time: "40:20", type: "contra",                                                    goalkeeper: "Joan Porter",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Roger Miro", "Arnau Sentis", "Marc Farreras", "Pau Ibañez"],
        notes: "Ens despistem en defensa i ens marquen a l'últim minut." },
    ],
    retransmissio: [
      { time: "14:25", type: "bona", text: "Combinació que acaba en Paco donant-li una patada a Shifu i sembrant el caos",          players: [], videoUrl: "https://www.youtube.com/watch?v=vi2PDXfRhp8&t=862s"  },
      { time: "24:10", type: "bona", text: "Paradón d'Ibañez",                                                                        players: [], videoUrl: "https://www.youtube.com/watch?v=vi2PDXfRhp8&t=1447s" },
      { time: "30:29", type: "bona", text: "El Shifu agafa de la samarreta encarant-se a Farreras — l'antifutbol absolut",           players: [], videoUrl: "https://www.youtube.com/watch?v=vi2PDXfRhp8&t=1826s" },
      { time: "38:38", type: "bona", text: "Lesionen a Paco amb una entrada dura que no és ni falta",                                players: [], videoUrl: "https://www.youtube.com/watch?v=vi2PDXfRhp8&t=2315s" },
      { time: "40:53", type: "bona", text: "Final del partit — victòria 5-2!",                                                        players: [], videoUrl: "https://www.youtube.com/watch?v=vi2PDXfRhp8&t=2450s" },
    ],
  },
};
