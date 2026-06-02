// j12-touchlas
// Vídeo 1: 0:00–19:15 (1a part) | Vídeo 2: 19:15–22:01 | Gap ~2 min | Vídeo 3: 22:01–37:37 vídeo (24:01–39:37 real)
// Temps 2a part vídeo 3: temps_real = temps_video + 2:00
export default {
  id: "j12-touchlas",
  jornada: "Jornada 12",
  opponent: "Touchlas FC",
  result: "2 - 8",
  date: "01 Jun 2026",
  youtubeId: null,
  vimeoId: null,
  idealMinutesPerPlayer: 20.0,
  savesManual: { "Joan Medina": 3, "Pau Ibañez": 2, "Oriol Tomas": 2, "Paco Montero": 3 },
  shots: {
    "Andreu Cases":  [{ time: "0:18",  onTarget: true  }, { time: "35:28", onTarget: true  }, { time: "36:40", onTarget: false }],
    "Chengzhi Li":   [{ time: "6:45",  onTarget: true  }],
    "Arnau Sentis":  [{ time: "7:07",  onTarget: true  }, { time: "20:03", onTarget: true  }],
    "Marc Farreras": [{ time: "17:14", onTarget: false }],
    "Roger Miro":    [{ time: "20:30", onTarget: true  }, { time: "35:00", onTarget: false }, { time: "37:40", onTarget: false }],
    "Oriol Tomas":   [{ time: "38:22", onTarget: true  }],
  },
  keyPasses: {
    "Ivan Mico":    [{ time: "0:18"  }],
    "Roger Miro":   [{ time: "6:45"  }, { time: "36:40" }],
    "Chengzhi Li":  [{ time: "7:07"  }, { time: "20:30" }],
    "Pau Ibañez":   [{ time: "17:14" }],
    "Paco Montero": [{ time: "35:00" }, { time: "35:28" }],
    "Andreu Cases": [{ time: "37:40" }],
    "Arnau Sentis": [{ time: "38:22" }],
  },
  dribbles: {
    "Marc Farreras": [{ time: "34:07" }],
    "Andreu Cases":  [{ time: "36:16" }],
  },
  events: {
    substitutions: [
      // ── 1A PART (Vídeo 1, temps real = temps vídeo) ─────────────────────
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
      // ── 2A PART inici (Vídeo 2: 19:15–22:01) ────────────────────────────
      { time: "19:15", goalkeeper: "Oriol Tomas",  onPitch: ["Arnau Sentis", "Chengzhi Li", "Roger Miro", "Marc Farreras"] },
      { time: "21:34", goalkeeper: "Oriol Tomas",  onPitch: ["Ivan Mico", "Arnau Sentis", "Chengzhi Li", "Roger Miro"] },
      // ── GAP no gravat (~2 min, 22:01–24:01) ─────────────────────────────────
      { time: "22:01", goalkeeper: "Oriol Tomas",  onPitch: ["Ivan Mico", "Arnau Sentis", "Chengzhi Li", "Roger Miro"] },
      { time: "23:31", goalkeeper: "Oriol Tomas",  onPitch: ["Chengzhi Li", "Andreu Cases", "Ivan Mico", "Roger Miro"] },
      // ── 2A PART (Vídeo 3, temps real = temps vídeo + 2:00) ──────────────
      { time: "25:15", goalkeeper: "Oriol Tomas",  onPitch: ["Pau Ibañez", "Paco Montero", "Ivan Mico", "Andreu Cases"] },    // vídeo 23:15
      { time: "26:18", goalkeeper: "Oriol Tomas",  onPitch: ["Roi Seoane", "Paco Montero", "Pau Ibañez", "Andreu Cases"] },   // vídeo 24:18
      { time: "27:43", goalkeeper: "Paco Montero", onPitch: ["Oriol Tomas", "Pau Ibañez", "Andreu Cases", "Roi Seoane"] },    // vídeo 25:43
      { time: "28:38", goalkeeper: "Paco Montero", onPitch: ["Joan Medina", "Pau Ibañez", "Roi Seoane", "Oriol Tomas"] },     // vídeo 26:38
      { time: "30:47", goalkeeper: "Paco Montero", onPitch: ["Marc Farreras", "Joan Medina", "Roi Seoane", "Oriol Tomas"] },  // vídeo 28:47
      { time: "32:04", goalkeeper: "Paco Montero", onPitch: ["Ivan Mico", "Marc Farreras", "Joan Medina", "Roi Seoane"] },    // vídeo 30:04
      { time: "32:39", goalkeeper: "Paco Montero", onPitch: ["Roger Miro", "Ivan Mico", "Marc Farreras", "Joan Medina"] },    // vídeo 30:39
      { time: "33:37", goalkeeper: "Paco Montero", onPitch: ["Chengzhi Li", "Ivan Mico", "Marc Farreras", "Roger Miro"] },    // vídeo 31:37
      { time: "35:15", goalkeeper: "Paco Montero", onPitch: ["Arnau Sentis", "Chengzhi Li", "Roger Miro", "Andreu Cases"] }, // vídeo 33:15
      { time: "37:50", goalkeeper: "Paco Montero", onPitch: ["Pau Ibañez", "Arnau Sentis", "Chengzhi Li", "Andreu Cases"] }, // vídeo 35:50
      { time: "38:15", goalkeeper: "Paco Montero", onPitch: ["Oriol Tomas", "Pau Ibañez", "Andreu Cases", "Arnau Sentis"] }, // vídeo 36:15
      // Fi del partit
      { time: "38:37", goalkeeper: "Paco Montero", onPitch: [] },
    ],
    cards: [],
    goals: [
      // ── GOLS EN CONTRA ────────────────────────────────────────────────────
      // 1r — de cap, 1:48 | sub 0:00 | vídeo 1:48
      { time: "1:48",  type: "contra", goalkeeper: "Joan Medina",
        onPitch: ["Andreu Cases", "Ivan Mico", "Oriol Tomas", "Marc Farreras"],
        notes: "Gol de cap imparable, 1-0" },

      // 2n — ~3:00 | sub 0:00 | vídeo ~3:00
      { time: "3:00",  type: "contra", goalkeeper: "Joan Medina",
        onPitch: ["Andreu Cases", "Ivan Mico", "Oriol Tomas", "Marc Farreras"],
        notes: "Oriol perd la pilota, saque de banda ràpid del rival i gol a primeres, 2-0" },

      // 3r — de córner, 9:17 | sub 5:09 | vídeo 9:17
      { time: "9:17",  type: "contra", goalkeeper: "Joan Medina",
        onPitch: ["Roger Miro", "Pau Ibañez", "Chengzhi Li", "Arnau Sentis"],
        notes: "Gol de córner, 3-0" },

      // 4t — 15:20 | sub 14:27 | vídeo 15:20
      { time: "15:20", type: "contra", goalkeeper: "Pau Ibañez",
        onPitch: ["Roi Seoane", "Andreu Cases", "Oriol Tomas", "Paco Montero"],
        notes: "Contra nostra fallada: Paco intenta xutar, rebot als peus de Roi sense temps ni espai, roben i marquen 4-0" },

      // 5è — falta de Miro durant el tall no gravat entre vídeo 2 i 3
      { time: "22:01", type: "contra", goalkeeper: "Oriol Tomas",
        onPitch: ["Ivan Mico", "Arnau Sentis", "Chengzhi Li", "Roger Miro"],
        notes: "⚠️ NO SURT AL VÍDEO — Falta provocada per Miro, marquen de falta directa 5-0. Passa durant el tall entre vídeo 2 i 3" },

      // 6è — combinació espectacular, paradón d'Oriol però marquen al rebuig
      { time: "23:00", type: "contra", goalkeeper: "Oriol Tomas",
        onPitch: ["Chengzhi Li", "Andreu Cases", "Ivan Mico", "Roger Miro"],
        notes: "Combinació espectacular del rival, paradón d'Oriol però al rebuig marquen 6-0" },

      // 7è — vídeo 28:33
      { time: "28:33", type: "contra", goalkeeper: "Paco Montero",
        onPitch: ["Joan Medina", "Pau Ibañez", "Roi Seoane", "Oriol Tomas"],
        notes: "Equip destrossat, gol increïble del rival 7-0" },

      // 8è — gol del córner, vídeo 30:40
      { time: "30:40", type: "contra", goalkeeper: "Paco Montero",
        onPitch: ["Roger Miro", "Ivan Mico", "Marc Farreras", "Joan Medina"],
        notes: "Gol del córner anterior: Roi canvia lent, Miro no entra ràpid, Medina no baixa a defensar 8-0" },

      // ── GOLS A FAVOR ──────────────────────────────────────────────────────
      // 1r — Telico, assist Paco
      { time: "33:28", type: "favor", scorer: "Andreu Cases", assist: "Paco Montero", goalkeeper: "Paco Montero",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Arnau Sentis", "Chengzhi Li", "Roger Miro", "Andreu Cases"],
        notes: "Paco veu el desmarque de Telico i l'assisteix, xuta sol contra porter i marca 1-8" },

      // 2n — Oriol, assist Sentis
      { time: "36:22", type: "favor", scorer: "Oriol Tomas", assist: "Arnau Sentis", goalkeeper: "Paco Montero",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Oriol Tomas", "Pau Ibañez", "Andreu Cases", "Arnau Sentis"],
        notes: "Oriol agafa la pilota, sprint sol, Sentis li fa d'autopase, sol davant porter i marca 2-8" },
    ],
    retransmissio: [
      // ── 1A PART ──────────────────────────────────────────────────────────
      { time: "0:15",  type: "bona",    text: "Parada de Medina",                                                                                              players: ["Joan Medina"] },
      { time: "0:18",  type: "bona",    text: "Contra: passkey d'Ivan a Telico que xuta al pal",                                                              players: ["Ivan Mico", "Andreu Cases"] },
      { time: "1:23",  type: "dolenta", text: "Oriol la deixa caure en una contra i regala la possessió al rival",                                            players: ["Oriol Tomas"] },
      { time: "3:00",  type: "dolenta", text: "Oriol perd la pilota, saque de banda ràpid i gol rival 2-0",                                                   players: ["Oriol Tomas"] },
      { time: "4:05",  type: "bona",    text: "Parada de Medina d'un xut de fora de l'àrea",                                                                  players: ["Joan Medina"] },
      { time: "5:00",  type: "dolenta", text: "Medina la perd solet, ens xuten fora",                                                                         players: ["Joan Medina"] },
      { time: "6:45",  type: "bona",    text: "Miro saca de banda, Chengzhi xuta a porteria però la paren",                                                   players: ["Roger Miro", "Chengzhi Li"] },
      { time: "7:07",  type: "bona",    text: "Chengzhi troba Sentis des d'un saque, xut mossegat a porteria",                                                players: ["Chengzhi Li", "Arnau Sentis"] },
      { time: "8:50",  type: "dolenta", text: "Miro perd la pilota sent últim home",                                                                          players: ["Roger Miro"] },
      { time: "8:50",  type: "bona",    text: "Paradón de Medina per salvar el gol",                                                                          players: ["Joan Medina"] },
      { time: "13:37", type: "bona",    text: "Primera parada de Pau, després intenta sortir amb la bola",                                                    players: ["Pau Ibañez"] },
      { time: "15:20", type: "dolenta", text: "Paco intenta xutar, rebot als peus de Roi sense temps ni espai, roben i marquen 4-0",                          players: ["Paco Montero", "Roi Seoane"] },
      { time: "17:14", type: "bona",    text: "Xut de Marc a fora amb passkey de Pau",                                                                        players: ["Marc Farreras", "Pau Ibañez"] },
      { time: "18:25", type: "bona",    text: "Paradón de Pau, un gat al camp que para l'acció al rival",                                                      players: ["Pau Ibañez"] },
      // ── 2A PART (Vídeo 2) ────────────────────────────────────────────────
      { time: "20:03", type: "bona",    text: "Recuperació de Sentis a l'àrea rival, xut fluix que para el porter",                                           players: ["Arnau Sentis"] },
      { time: "20:30", type: "bona",    text: "Passkey de Chengzhi a Miro que xuta a porta",                                                                  players: ["Chengzhi Li", "Roger Miro"] },
      { time: "21:05", type: "bona",    text: "Parada d'Oriol Tomas",                                                                                         players: ["Oriol Tomas"] },
      // ── TALL entre Vídeo 2 i Vídeo 3 (no gravat) ───────────────────────
      { time: "22:01", type: "dolenta", text: "⚠️ NO GRAVAT — Falta provocada per Miro, el rival marca de falta directa 5-0",                                 players: ["Roger Miro"] },
      // ── 2A PART (Vídeo 3, temps real = temps vídeo + 2:00) ──────────────
      { time: "24:28", type: "bona",    text: "Pressió alta i bona recuperació de Chengzhi, passkey a Telico que intenta passar en lloc de xutar",            players: ["Chengzhi Li", "Andreu Cases"] },
      { time: "25:00", type: "bona",    text: "Paradón d'Oriol, però el rival marca al rebuig 6-0",                                                           players: ["Oriol Tomas"] },
      { time: "27:22", type: "bona",    text: "Robo de Telico, es planta 1 contra 1",                                                                         players: ["Andreu Cases"] },
      { time: "28:12", type: "tactica", text: "Pau s'enfada perquè Roi no va a la marca; recuperem i Roi fa bon pase que Telico quasi aprofita però no s'entenen amb Pau i la pilota es perd", players: ["Roi Seoane", "Pau Ibañez", "Andreu Cases"] },
      { time: "28:57", type: "bona",    text: "Bon tall de pilota de Roi, tot i que després la perdem i ens xuten rosant el pal",                             players: ["Roi Seoane"] },
      { time: "30:10", type: "bona",    text: "Moment èpic: Pau i Medina cuerpegen per aconseguir la pilota",                                                  players: ["Pau Ibañez", "Joan Medina"] },
      { time: "30:19", type: "tactica", text: "Oriol ja assoma les ganes que té de marcar",                                                                   players: ["Oriol Tomas"] },
      { time: "30:33", type: "dolenta", text: "Equip destrossat, ens pixen i ens marquen un gol increïble 7-0",                                               players: [] },
      { time: "32:26", type: "dolenta", text: "Farreras sent últim home intenta fer un caño, li recuperen la pilota",                                         players: ["Marc Farreras"] },
      { time: "32:26", type: "bona",    text: "Paradón històric de Paco per salvar el gol",                                                                   players: ["Paco Montero"] },
      { time: "32:40", type: "dolenta", text: "Gol del córner anterior: Roi canvia lent, Miro no entra ràpid, Medina no baixa a defensar. CARADURES. 8-0",    players: ["Roi Seoane", "Roger Miro", "Joan Medina"] },
      { time: "34:07", type: "bona",    text: "Regate exitós de Farreras: ruletinya i se'n va per velocitat",                                                 players: ["Marc Farreras"] },
      { time: "35:00", type: "bona",    text: "Paco surt conduint, bon pase a Miro que xuta fora",                                                            players: ["Paco Montero", "Roger Miro"] },
      { time: "35:28", type: "bona",    text: "Paco veu el desmarque de Telico i l'assisteix, xuta sol contra porter i marca el primer gol! 1-8",             players: ["Paco Montero", "Andreu Cases"] },
      { time: "36:16", type: "bona",    text: "Regate de Telico per la banda; paradón de Paco i Chengzhi recupera, arranca la moto i es planta quasi a camp rival", players: ["Andreu Cases", "Paco Montero", "Chengzhi Li"] },
      { time: "36:40", type: "bona",    text: "Recuperació de Chengzhi, pase a Miro, canvi a Telico que xuta rosant el pal per fora, molt bo",                players: ["Chengzhi Li", "Roger Miro", "Andreu Cases"] },
      { time: "37:40", type: "bona",    text: "Bona jugada de Telico i Miro que acaba en xut a fora",                                                         players: ["Andreu Cases", "Roger Miro"] },
      { time: "38:02", type: "bona",    text: "Parada molt sòlida de Paco sense guants, l'antipayo",                                                          players: ["Paco Montero"] },
      { time: "38:22", type: "bona",    text: "Oriol agafa la pilota, sprint sol, Sentis li fa d'autopase, sol davant porter i marca! 2-8",                   players: ["Oriol Tomas", "Arnau Sentis"] },
    ],
  },
};
