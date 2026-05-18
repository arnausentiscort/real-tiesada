// j10-ensaimada
// Temps 2a part: temps_real = temps_video + 5:40 (els primers 5:40 de la 2a part no estan gravats)
export default {
  id: "j10-ensaimada",
  jornada: "Jornada 10",
  opponent: "Ensaimada",
  result: "1 - 7",
  date: "11 Mai 2026",
  youtubeId: "tIGjnqzBW5U",
  vimeoId: "1191708697",
  idealMinutesPerPlayer: 20.0,
  shots: {},
  keyPasses: {},
  dribbles: {},
  events: {
    substitutions: [
      // ── 1A PART (temps real = temps vídeo) ──────────────────────────────
      { time: "0:00",  goalkeeper: "Pau Ibañez", onPitch: ["Chengzhi Li", "Oriol Tomas", "Padilla", "Marc Farreras"] },
      { time: "3:50",  goalkeeper: "Pau Ibañez", onPitch: ["Chengzhi Li", "Oriol Tomas", "Padilla", "Arnau Sentis"] },
      { time: "6:09",  goalkeeper: "Pau Ibañez", onPitch: ["Ivan Mico", "Arnau Sentis", "Joan Medina", "Oriol Tomas"] },
      { time: "6:33",  goalkeeper: "Pau Ibañez", onPitch: ["Ivan Mico", "Arnau Sentis", "Joan Medina", "Roi Seoane"] },
      { time: "9:18",  goalkeeper: "Pau Ibañez", onPitch: ["Arnau Sentis", "Joan Medina", "Roi Seoane", "Padilla"] },
      { time: "10:21", goalkeeper: "Pau Ibañez", onPitch: ["Padilla", "Chengzhi Li", "Roi Seoane", "Joan Medina"] },
      { time: "11:39", goalkeeper: "Pau Ibañez", onPitch: ["Oriol Tomas", "Padilla", "Chengzhi Li", "Roi Seoane"] },
      { time: "12:49", goalkeeper: "Ivan Mico",  onPitch: ["Oriol Tomas", "Padilla", "Chengzhi Li", "Pau Ibañez"] },
      { time: "14:27", goalkeeper: "Ivan Mico",  onPitch: ["Marc Farreras", "Oriol Tomas", "Padilla", "Chengzhi Li"] },
      { time: "15:41", goalkeeper: "Ivan Mico",  onPitch: ["Pau Ibañez", "Oriol Tomas", "Marc Farreras", "Padilla"] },
      // Fi 1a part: 18:32
      // ── 2A PART inici (no gravat) ────────────────────────────────────────
      { time: "18:32", goalkeeper: "Ivan Mico",  onPitch: ["Pau Ibañez", "Arnau Sentis", "Joan Medina", "Roi Seoane"] },
      // ── 2A PART gravada (temps real = temps vídeo + 5:40) ───────────────
      { time: "24:20", goalkeeper: "Ivan Mico",  onPitch: ["Joan Medina", "Marc Farreras", "Padilla", "Oriol Tomas"] }, // vídeo 18:40
      { time: "25:53", goalkeeper: "Ivan Mico",  onPitch: ["Pau Ibañez", "Padilla", "Marc Farreras", "Oriol Tomas"] }, // vídeo 20:13
      { time: "27:50", goalkeeper: "Ivan Mico",  onPitch: ["Arnau Sentis", "Pau Ibañez", "Padilla", "Oriol Tomas"] }, // vídeo 22:10
      { time: "28:38", goalkeeper: "Ivan Mico",  onPitch: ["Chengzhi Li", "Arnau Sentis", "Pau Ibañez", "Oriol Tomas"] }, // vídeo 22:58
      { time: "29:06", goalkeeper: "Ivan Mico",  onPitch: ["Roi Seoane", "Chengzhi Li", "Pau Ibañez", "Arnau Sentis"] }, // vídeo 23:26
      // TODO: falta 1 substitució on Pau torna a porteria (~min 33, a confirmar)
      { time: "33:00", goalkeeper: "Pau Ibañez", onPitch: ["Roi Seoane", "Chengzhi Li", "Joan Medina", "Padilla"] },
      // Fi del partit
      { time: "36:00", goalkeeper: "Pau Ibañez", onPitch: [] },
    ],
    cards: [],
    goals: [
      // ── GOL A FAVOR ──────────────────────────────────────────────────────
      // Medina, 8:44 | lineup 6:33 | vídeo 8:44
      { time: "8:44",  type: "favor", scorer: "Joan Medina", assist: "Roi Seoane", goalkeeper: "Pau Ibañez",
        zone: "C6", shotPos: { x: 740, y: 210 }, assistPos: { x: 720, y: 240 }, conductPos: null, goalPos: { x: 150, y: 100 },
        onPitch: ["Ivan Mico", "Arnau Sentis", "Joan Medina", "Roi Seoane"],
        notes: "" },

      // ── GOLS EN CONTRA ────────────────────────────────────────────────────
      // 1r — Carles B. ~9:05 | lineup 6:33 | vídeo ~9:05
      { time: "9:05",  type: "contra", goalkeeper: "Pau Ibañez",
        onPitch: ["Ivan Mico", "Arnau Sentis", "Joan Medina", "Roi Seoane"],
        notes: "" },

      // 2n — Luis D. ~11:10 | lineup 10:21 | vídeo ~11:10
      { time: "11:10", type: "contra", goalkeeper: "Pau Ibañez",
        onPitch: ["Padilla", "Chengzhi Li", "Roi Seoane", "Joan Medina"],
        notes: "" },

      // 3r — Albert C. ~15:50 | lineup 15:41 | vídeo ~15:50
      { time: "15:50", type: "contra", goalkeeper: "Ivan Mico",
        onPitch: ["Pau Ibañez", "Oriol Tomas", "Marc Farreras", "Padilla"],
        notes: "" },

      // 4t — Fernando P. ~20:00 | 2a part NO gravada
      { time: "20:00", type: "contra", goalkeeper: "Ivan Mico",
        onPitch: ["Pau Ibañez", "Arnau Sentis", "Joan Medina", "Roi Seoane"],
        notes: "No gravat (inici 2a part sense càmera)" },

      // 5è — Carles B. ~26:00 | lineup 24:20 | vídeo ~20:20
      { time: "26:00", type: "contra", goalkeeper: "Ivan Mico",
        onPitch: ["Joan Medina", "Marc Farreras", "Padilla", "Oriol Tomas"],
        notes: "" },

      // 6è — Carles B. ~30:00 | lineup 29:06 | vídeo ~24:20
      { time: "30:00", type: "contra", goalkeeper: "Ivan Mico",
        onPitch: ["Roi Seoane", "Chengzhi Li", "Pau Ibañez", "Arnau Sentis"],
        notes: "" },

      // 7è — Albert C. ~34:00 | lineup 33:00 | vídeo ~28:20
      { time: "34:00", type: "contra", goalkeeper: "Pau Ibañez",
        onPitch: ["Roi Seoane", "Chengzhi Li", "Joan Medina", "Padilla"],
        notes: "" },
    ],
    retransmissio: [],
  },
};
