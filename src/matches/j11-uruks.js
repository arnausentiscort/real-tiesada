// j11-uruks
export default {
  id: "j11-uruks",
  jornada: "Jornada 11",
  opponent: "Uruks",
  result: "2 - 5",
  date: "18 Mai 2026",
  youtubeId: "-z0c3GzA3_I",
  vimeoId: null,
  idealMinutesPerPlayer: 20.0,
  shots: {},
  keyPasses: {},
  dribbles: {},
  events: {
    substitutions: [
      { time: "0:00",  goalkeeper: "Joan Medina",  onPitch: ["Arnau Sentis", "Roger Miro", "Ivan Mico", "Pau Ibañez"] },
      { time: "5:23",  goalkeeper: "Joan Medina",  onPitch: ["Ivan Mico", "Roger Miro", "Pau Ibañez", "Marc Farreras"] },
      { time: "6:20",  goalkeeper: "Joan Medina",  onPitch: ["Roi Seoane", "Roger Miro", "Pau Ibañez", "Marc Farreras"] },
      { time: "7:17",  goalkeeper: "Joan Medina",  onPitch: ["Chengzhi Li", "Roi Seoane", "Roger Miro", "Marc Farreras"] },
      { time: "7:54",  goalkeeper: "Joan Medina",  onPitch: ["Oriol Tomas", "Chengzhi Li", "Roi Seoane", "Marc Farreras"] },
      { time: "12:04", goalkeeper: "Pau Ibañez",   onPitch: ["Joan Medina", "Arnau Sentis", "Ivan Mico", "Roi Seoane"] },
      { time: "13:33", goalkeeper: "Pau Ibañez",   onPitch: ["Roger Miro", "Joan Medina", "Arnau Sentis", "Ivan Mico"] },
      { time: "16:02", goalkeeper: "Pau Ibañez",   onPitch: ["Oriol Tomas", "Arnau Sentis", "Roger Miro", "Joan Medina"] },
      { time: "17:50", goalkeeper: "Pau Ibañez",   onPitch: ["Chengzhi Li", "Oriol Tomas", "Roger Miro", "Joan Medina"] },
      { time: "19:16", goalkeeper: "Pau Ibañez",   onPitch: ["Oriol Tomas", "Marc Farreras", "Ivan Mico", "Chengzhi Li"] },
      { time: "23:00", goalkeeper: "Pau Ibañez",   onPitch: ["Roi Seoane", "Marc Farreras", "Ivan Mico", "Chengzhi Li"] },
      { time: "23:35", goalkeeper: "Pau Ibañez",   onPitch: ["Arnau Sentis", "Roi Seoane", "Marc Farreras", "Ivan Mico"] },
      { time: "27:53", goalkeeper: "Pau Ibañez",   onPitch: ["Joan Medina", "Roger Miro", "Roi Seoane", "Arnau Sentis"] },
      { time: "29:48", goalkeeper: "Pau Ibañez",   onPitch: ["Joan Medina", "Roger Miro", "Roi Seoane", "Oriol Tomas"] },
      { time: "31:38", goalkeeper: "Ivan Mico",    onPitch: ["Oriol Tomas", "Joan Medina", "Roger Miro", "Roi Seoane"] },
      { time: "33:11", goalkeeper: "Ivan Mico",    onPitch: ["Pau Ibañez", "Joan Medina", "Roger Miro", "Oriol Tomas"] },
      { time: "36:26", goalkeeper: "Ivan Mico",    onPitch: ["Chengzhi Li", "Roger Miro", "Pau Ibañez", "Oriol Tomas"] },
      { time: "37:44", goalkeeper: "Ivan Mico",    onPitch: ["Marc Farreras", "Chengzhi Li", "Pau Ibañez", "Oriol Tomas"] },
      { time: "38:09", goalkeeper: "Ivan Mico",    onPitch: ["Arnau Sentis", "Marc Farreras", "Chengzhi Li", "Pau Ibañez"] },
      { time: "39:31", goalkeeper: "Ivan Mico",    onPitch: [] },
    ],
    cards: [],
    goals: [
      // GOL A FAVOR — Ivan Mico min 2 | lineup 0:00 | vídeo 2:00
      { time: "2:00", type: "favor", scorer: "Ivan Mico", assist: null, goalkeeper: "Joan Medina",
        zone: "C6", shotPos: { x: 740, y: 210 }, assistPos: null, conductPos: null, goalPos: { x: 150, y: 100 },
        onPitch: ["Arnau Sentis", "Roger Miro", "Ivan Mico", "Pau Ibañez"],
        notes: "" },

      // GOL EN CONTRA — Prov min 4 | lineup 0:00 | vídeo 4:00
      { time: "4:00", type: "contra", goalkeeper: "Joan Medina",
        onPitch: ["Arnau Sentis", "Roger Miro", "Ivan Mico", "Pau Ibañez"],
        notes: "" },

      // GOL EN CONTRA — Juan Carlos G. min 17 | lineup 16:02 | vídeo 17:00
      { time: "17:00", type: "contra", goalkeeper: "Pau Ibañez",
        onPitch: ["Oriol Tomas", "Arnau Sentis", "Roger Miro", "Joan Medina"],
        notes: "" },

      // GOL EN CONTRA — Sergi G. min 21 | lineup 19:16 | vídeo 21:00
      { time: "21:00", type: "contra", goalkeeper: "Pau Ibañez",
        onPitch: ["Oriol Tomas", "Marc Farreras", "Ivan Mico", "Chengzhi Li"],
        notes: "" },

      // GOL A FAVOR — Ivan Mico min 26 | lineup 23:35 | vídeo 26:00
      { time: "26:00", type: "favor", scorer: "Ivan Mico", assist: null, goalkeeper: "Pau Ibañez",
        zone: "C6", shotPos: { x: 740, y: 210 }, assistPos: null, conductPos: null, goalPos: { x: 150, y: 100 },
        onPitch: ["Arnau Sentis", "Roi Seoane", "Marc Farreras", "Ivan Mico"],
        notes: "" },

      // GOL EN CONTRA — Sergi G. min 31 | lineup 29:48 | vídeo 31:00
      { time: "31:00", type: "contra", goalkeeper: "Pau Ibañez",
        onPitch: ["Joan Medina", "Roger Miro", "Roi Seoane", "Oriol Tomas"],
        notes: "" },

      // GOL EN CONTRA — Prov min 37 | lineup 36:26 | vídeo 37:00
      { time: "37:00", type: "contra", goalkeeper: "Ivan Mico",
        onPitch: ["Chengzhi Li", "Roger Miro", "Pau Ibañez", "Oriol Tomas"],
        notes: "" },
    ],
    retransmissio: [],
  },
};
