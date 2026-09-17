// Jornada 1 · 15/09/2026 · Real Tiesada 5-7 Polanco FC
// Dades parcials: cronologia de gols d'apuntamelo.com i alineacions
// que va anotar en Marc Farreras pel WhatsApp. No tenim el registre
// de canvis, per això `substitutions` va buit i no hi ha minutatges.
export default {
  id: "s3-j1-polanco",
  jornada: "Jornada 1",
  opponent: "Polanco FC",
  result: "5 - 7",
  date: "15 Set 2026",
  youtubeId: null,
  vimeoId: null,
  idealMinutesPerPlayer: null,
  savesManual: {},
  shots: {},
  keyPasses: {},
  dribbles: {},
  events: {
    substitutions: [],
    cards: [],
    goals: [
      { time: "07:00", type: "contra", goalkeeper: "Pau Ibañez",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Arnau Sentis", "Roi Seoane", "Marc Farreras", "Serginho", "Roger Miro", "Coro"],
        notes: "Primer gol encaixat. David H. #16." },

      { time: "08:00", type: "favor", scorer: "Serginho", assist: "Marc Farreras", goalkeeper: "Pau Ibañez",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Arnau Sentis", "Roi Seoane", "Marc Farreras", "Serginho", "Roger Miro", "Coro"],
        notes: "Primer gol nostre: el marca en Serginho amb assistència d'en Farreras, amb els mateixos al camp." },

      { time: "09:24", type: "contra", goalkeeper: "Pau Ibañez",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Marc Farreras", "Arnau Sentis", "Coro", "Roi Seoane", "Roger Miro", "Serginho"],
        notes: "Segon gol encaixat. David H. #16." },

      { time: "11:34", type: "contra", goalkeeper: "Pau Ibañez",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Arnau Sentis", "Roi Seoane", "Serginho", "Roger Miro", "Ivan Mico", "Coro"],
        notes: "Tercer gol encaixat. Daniel I. #96." },

      { time: "20:36", type: "contra", goalkeeper: "Joan Medina",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Roi Seoane", "Serginho", "Marc Farreras", "Roger Miro", "Ivan Mico", "Pau Ibañez"],
        notes: "Quart gol encaixat: ens el fan mentre fem els canvis. Aitor R. #42." },

      { time: "28:00", type: "contra", goalkeeper: null,
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: [],
        notes: "Cinquè gol encaixat. Daniel I. #96." },

      { time: "29:00", type: "contra", goalkeeper: null,
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: [],
        notes: "Sisè gol encaixat. Christian A. #27." },

      { time: "34:00", type: "favor", scorer: "Serginho", assist: "Arnau Sentis", goalkeeper: null,
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: [],
        notes: "Segon gol nostre, en Serginho amb assistència de l'Arnau Sentis." },

      { time: "41:00", type: "favor", scorer: "Marc Farreras", assist: null, goalkeeper: null,
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: [],
        notes: "Gol d'en Farreras." },

      { time: "42:00", type: "favor", scorer: "Roi Seoane", assist: null, goalkeeper: null,
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: [],
        notes: "Gol d'en Roi." },

      { time: "43:00", type: "contra", goalkeeper: null,
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: [],
        notes: "Setè gol encaixat. Daniel I. #96." },

      { time: "44:00", type: "favor", scorer: "Serginho", assist: "Arnau Sentis", goalkeeper: null,
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: [],
        notes: "Cinquè gol nostre, altre cop en Serginho amb assistència de l'Arnau Sentis." },
    ],
    retransmissio: [
      { time: "15:07", type: "bona", text: "Rematada de cap de l'Arnau Sentis", players: ["Arnau Sentis"], videoUrl: null, photo: null, photoHover: null },
    ],
  },
};
