// j12-touchlas
// Temps 2a part: temps_real ≈ temps_video + 21:00 (fi 1a part ~20:00 + ~1:00 de tall al vídeo, pendent confirmar)
export default {
  id: "j12-touchlas",
  jornada: "Jornada 12",
  opponent: "Touchlas FC",
  result: "2 - 8",
  date: "01 Jun 2026",
  youtubeId: null,
  vimeoId: null,
  idealMinutesPerPlayer: 20.0,
  savesManual: { "Joan Medina": 3, "Pau Ibañez": 2, "Oriol Tomas": 1 }, // pendent confirmar total
  shots: {
    "Andreu Cases":  [{ time: "0:18",  onTarget: true  }],
    "Chengzhi Li":   [{ time: "6:45",  onTarget: true  }],
    "Arnau Sentis":  [{ time: "7:07",  onTarget: true  }, { time: "21:48", onTarget: true  }],
    "Marc Farreras": [{ time: "17:14", onTarget: false }],
    "Roger Miro":    [{ time: "22:15", onTarget: true  }],
  },
  keyPasses: {
    "Ivan Mico":   [{ time: "0:18"  }],
    "Roger Miro":  [{ time: "6:45"  }],
    "Chengzhi Li": [{ time: "7:07"  }, { time: "22:15" }],
    "Pau Ibañez":  [{ time: "17:14" }],
  },
  dribbles: {},
  events: {
    substitutions: [
      // ── 1A PART (temps real = temps vídeo) ──────────────────────────────
      { time: "0:00",  goalkeeper: "Joan Medina",  onPitch: ["Andreu Cases", "Ivan Mico", "Oriol Tomas", "Marc Farreras"] },
      { time: "4:03",  goalkeeper: "Joan Medina",  onPitch: ["Andreu Cases", "Oriol Tomas", "Marc Farreras", "Pau Ibañez"] },
      { time: "4:38",  goalkeeper: "Joan Medina",  onPitch: ["Andreu Cases", "Arnau Sentis", "Chengzhi Li", "Pau Ibañez"] },
      { time: "5:09",  goalkeeper: "Joan Medina",  onPitch: ["Roger Miro", "Pau Ibañez", "Chengzhi Li", "Arnau Sentis"] },
      { time: "9:27",  goalkeeper: "Joan Medina",  onPitch: ["Paco Montero", "Arnau Sentis", "Pau Ibañez", "Chengzhi Li"] },
      { time: "10:27", goalkeeper: "Joan Medina",  onPitch: ["Ivan Mico", "Pau Ibañez", "Arnau Sentis", "Paco Montero"] },
      { time: "10:53", goalkeeper: "Joan Medina",  onPitch: ["Andreu Cases", "Pau Ibañez", "Paco Montero", "Ivan Mico"] },
      { time: "11:15", goalkeeper: "Joan Medina",  onPitch: ["Oriol Tomas", "Andreu Cases", "Paco Montero", "Ivan Mico"] },
      { time: "12:50", goalkeeper: "Pau Ibañez",   onPitch: ["Oriol Tomas", "Andreu Cases", "Paco Montero", "Ivan Mico"] },
      { time: "14:27", goalkeeper: "Pau Ibañez",   onPitch: ["Roi Seoane", "Andreu Cases", "Oriol Tomas", "Paco Montero"] },
      { time: "16:30", goalkeeper: "Pau Ibañez",   onPitch: ["Joan Medina", "Andreu Cases", "Roi Seoane", "Paco Montero"] },
      { time: "17:00", goalkeeper: "Pau Ibañez",   onPitch: ["Joan Medina", "Andreu Cases", "Roi Seoane", "Marc Farreras"] },
      { time: "17:53", goalkeeper: "Pau Ibañez",   onPitch: ["Roger Miro", "Joan Medina", "Roi Seoane", "Marc Farreras"] },
      { time: "19:15", goalkeeper: "Oriol Tomas",  onPitch: ["Arnau Sentis", "Chengzhi Li", "Roger Miro", "Marc Farreras"] },
      // Fi 1a part: ~20:00
      // ── 2A PART inici (no gravat ~1 min) ────────────────────────────────
      { time: "20:00", goalkeeper: "Oriol Tomas",  onPitch: ["Arnau Sentis", "Chengzhi Li", "Roger Miro", "Marc Farreras"] },
      // ── 2A PART gravada (temps real ≈ temps vídeo + 21:00) ──────────────
      { time: "23:19", goalkeeper: "Oriol Tomas",  onPitch: ["Ivan Mico", "Arnau Sentis", "Chengzhi Li", "Roger Miro"] }, // vídeo 2:19
      // Fi del partit
      { time: "40:00", goalkeeper: "Oriol Tomas",  onPitch: [] },
    ],
    cards: [],
    goals: [
      // ── GOLS EN CONTRA ────────────────────────────────────────────────────
      // 1r — de cap, 1:48 | sub 0:00 | vídeo 1:48
      { time: "1:48",  type: "contra", goalkeeper: "Joan Medina",
        onPitch: ["Andreu Cases", "Ivan Mico", "Oriol Tomas", "Marc Farreras"],
        notes: "Gol de cap, inparable" },

      // 2n — ~3:00 | sub 0:00 | vídeo ~3:00
      { time: "3:00",  type: "contra", goalkeeper: "Joan Medina",
        onPitch: ["Andreu Cases", "Ivan Mico", "Oriol Tomas", "Marc Farreras"],
        notes: "Oriol perd la pilota, saque de banda ràpid, xut a primeres" },

      // 3r — de córner, 9:17 | sub 5:09 | vídeo 9:17
      { time: "9:17",  type: "contra", goalkeeper: "Joan Medina",
        onPitch: ["Roger Miro", "Pau Ibañez", "Chengzhi Li", "Arnau Sentis"],
        notes: "De còrner" },

      // 4t — 15:20 | sub 14:27 | vídeo 15:20
      { time: "15:20", type: "contra", goalkeeper: "Pau Ibañez",
        onPitch: ["Roi Seoane", "Andreu Cases", "Oriol Tomas", "Paco Montero"],
        notes: "Contra: Paco intenta xutar però el rebot cau a Roi que no pot fer res, li roben i marquen" },

      // 5è al 8è i 2 gols a favor — 2a part (pendent)
    ],
    retransmissio: [
      { time: "0:15",  type: "bona",    text: "Parada de Medina",                                                                          players: ["Joan Medina"] },
      { time: "0:18",  type: "bona",    text: "Contra-atac: Ivan deixa sol a Telico que envia la pilota al pal",                           players: ["Ivan Mico", "Andreu Cases"] },
      { time: "1:23",  type: "dolenta", text: "Oriol perd la pilota i decideix que la contra sigui pel rival",                             players: ["Oriol Tomas"] },
      { time: "4:05",  type: "bona",    text: "Parada de Medina d'un xut de fora de l'àrea",                                              players: ["Joan Medina"] },
      { time: "5:00",  type: "dolenta", text: "Medina la perd solet i ens chuten (fora)",                                                 players: ["Joan Medina"] },
      { time: "6:45",  type: "bona",    text: "Saque de banda de Miró, Chengzhi chuta a porteria però la paren",                          players: ["Roger Miro", "Chengzhi Li"] },
      { time: "7:07",  type: "bona",    text: "Chengzhi troba des d'un saque a Sentis que fa un xut mossegat a porteria",                 players: ["Chengzhi Li", "Arnau Sentis"] },
      { time: "8:50",  type: "bona",    text: "Miró perd la pilota sent últim home i Medina fa paradón per salvar el gol",                players: ["Roger Miro", "Joan Medina"] },
      { time: "13:37", type: "bona",    text: "Primera parada de Pau i després intenta sortir amb la bola",                               players: ["Pau Ibañez"] },
      { time: "17:14", type: "bona",    text: "Key pass de Pau, xut de Marc a fora",                                                      players: ["Pau Ibañez", "Marc Farreras"] },
      { time: "18:25", type: "bona",    text: "Un gat salta al camp i para l'acció al rival — paradón de Pau",                            players: ["Pau Ibañez"] },
      // ── 2A PART (temps real ≈ temps vídeo + 21:00) ──────────────────────
      { time: "21:48", type: "bona",    text: "Recuperació de Sentis a l'àrea rival que acaba en xut molt fluix que para el porter",      players: ["Arnau Sentis"] },         // vídeo 0:48
      { time: "22:15", type: "bona",    text: "Key pass de Chengzhi a Miró que acaba en xut a porta",                                     players: ["Chengzhi Li", "Roger Miro"] }, // vídeo 1:15
      { time: "22:50", type: "bona",    text: "Parada d'Oriol Tomas",                                                                     players: ["Oriol Tomas"] },             // vídeo 1:50
    ],
  },
};
