// Jornada 3 · 29/09/2026 · Real Tiesada 4-5 FC Manguito
// Marcador i golejadors rivals d'apuntamelo.com (partit 379087); canvis,
// gols, assistències i accions són de l'Arnau. Les 20 alineacions són reals.
// Els gols del 34:00 i el 36:00 només tenen el minut d'apuntamelo, sense segons.
// Única inconsistència coneguda: el gol del 24:40 es va encaixar amb
// l'alineació que al registre no entra fins al 24:43. Tres segons de marge.
export default {
  id: "s3-j3-manguito",
  jornada: "Jornada 3",
  opponent: "FC Manguito",
  result: "4 - 5",
  date: "29 Set 2026",
  youtubeId: "E2N1jhhszN0",
  vimeoId: null,
  idealMinutesPerPlayer: 39,
  savesManual: {},
  shots: {
    "Lluc":          [{ time: "00:15", onTarget: true }, { time: "15:51", onTarget: false }],
    "Serginho":      [{ time: "00:20", onTarget: false }, { time: "07:23", onTarget: false }, { time: "32:49", onTarget: false }, { time: "36:10", onTarget: true }, { time: "42:00", onTarget: false }],
    "Paco Montero":  [{ time: "07:58", onTarget: false, post: true }, { time: "09:11", onTarget: false }],
    "Marc Farreras": [{ time: "10:18", onTarget: true }],
    "Arnau Sentis":  [{ time: "14:10", onTarget: false }, { time: "48:45", onTarget: true }],
    "Chengzhi Li":   [{ time: "27:37", onTarget: true }, { time: "30:05", onTarget: true }],
    "Ivan Mico":     [{ time: "40:11", onTarget: false }],
  },
  keyPasses: {
    "Chengzhi Li":  [{ time: "07:58" }, { time: "40:11" }, { time: "42:00" }],
    "Lluc":         [{ time: "09:11" }],
    "Pau Ibañez":   [{ time: "14:10" }],
    "Ivan Mico":    [{ time: "27:37" }],
    "Paco Montero": [{ time: "48:45" }],
  },
  dribbles: {
    "Ivan Mico":    [{ time: "03:01" }],
    "Arnau Sentis": [{ time: "07:20" }],
  },
  events: {
    substitutions: [
      { time: "00:00", goalkeeper: "Joan Ribes", onPitch: ["Lluc","Chengzhi Li","Paco Montero","Serginho","Marc Farreras","Ivan Mico"] },
      { time: "07:14", goalkeeper: "Joan Ribes", onPitch: ["Lluc","Chengzhi Li","Paco Montero","Serginho","Marc Farreras","Arnau Sentis"] },
      { time: "10:39", goalkeeper: "Joan Ribes", onPitch: ["Lluc","Chengzhi Li","Serginho","Arnau Sentis","Marc Farreras","Pau Ibañez"] },
      { time: "11:19", goalkeeper: "Joan Ribes", onPitch: ["Lluc","Chengzhi Li","Serginho","Arnau Sentis","Pau Ibañez","Ivan Mico"] },
      { time: "14:41", goalkeeper: "Joan Ribes", onPitch: ["Lluc","Arnau Sentis","Pau Ibañez","Ivan Mico","Paco Montero","Serginho"] },
      { time: "16:27", goalkeeper: "Joan Ribes", onPitch: ["Lluc","Arnau Sentis","Pau Ibañez","Ivan Mico","Paco Montero","Marc Farreras"] },
      { time: "17:18", goalkeeper: "Joan Ribes", onPitch: ["Marc Farreras","Arnau Sentis","Chengzhi Li","Pau Ibañez","Paco Montero","Ivan Mico"] },
      { time: "18:51", goalkeeper: "Joan Ribes", onPitch: ["Marc Farreras","Chengzhi Li","Pau Ibañez","Paco Montero","Ivan Mico","Serginho"] },
      { time: "20:53", goalkeeper: "Joan Ribes", onPitch: ["Marc Farreras","Chengzhi Li","Pau Ibañez","Paco Montero","Serginho","Lluc"] },
      { time: "22:21", goalkeeper: "Joan Ribes", onPitch: ["Marc Farreras","Chengzhi Li","Paco Montero","Serginho","Lluc","Arnau Sentis"] },
      { time: "24:43", goalkeeper: "Joan Ribes", onPitch: ["Chengzhi Li","Lluc","Arnau Sentis","Ivan Mico","Pau Ibañez","Marc Farreras"] },
      { time: "30:28", goalkeeper: "Joan Ribes", onPitch: ["Lluc","Arnau Sentis","Pau Ibañez","Paco Montero","Serginho","Ivan Mico"] },
      { time: "32:06", goalkeeper: "Joan Ribes", onPitch: ["Lluc","Arnau Sentis","Pau Ibañez","Paco Montero","Serginho","Marc Farreras"] },
      { time: "35:12", goalkeeper: "Joan Ribes", onPitch: ["Lluc","Arnau Sentis","Paco Montero","Serginho","Marc Farreras","Chengzhi Li"] },
      { time: "36:42", goalkeeper: "Joan Ribes", onPitch: ["Lluc","Paco Montero","Serginho","Marc Farreras","Ivan Mico","Chengzhi Li"] },
      { time: "40:21", goalkeeper: "Joan Ribes", onPitch: ["Lluc","Paco Montero","Serginho","Ivan Mico","Chengzhi Li","Pau Ibañez"] },
      { time: "45:00", goalkeeper: "Joan Ribes", onPitch: ["Paco Montero","Serginho","Ivan Mico","Chengzhi Li","Pau Ibañez","Arnau Sentis"] },
      { time: "45:11", goalkeeper: "Joan Ribes", onPitch: ["Serginho","Ivan Mico","Chengzhi Li","Pau Ibañez","Arnau Sentis","Marc Farreras"] },
      { time: "48:11", goalkeeper: "Joan Ribes", onPitch: ["Ivan Mico","Chengzhi Li","Pau Ibañez","Arnau Sentis","Marc Farreras","Paco Montero"] },
      { time: "50:00", goalkeeper: null, onPitch: [], _isBreak: true },
    ],
    cards: [],
    goals: [
      { time: "03:50", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Lluc","Paco Montero","Serginho","Chengzhi Li","Marc Farreras","Ivan Mico"],
        notes: "Gol olímpic. Ferran P. #7." },

      { time: "05:00", type: "favor", scorer: "Lluc", assist: null, goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Lluc","Paco Montero","Serginho","Chengzhi Li","Marc Farreras","Ivan Mico"],
        notes: "Recuperació i gol des del mig del camp." },

      { time: "10:00", type: "favor", scorer: "Chengzhi Li", assist: "Marc Farreras", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Lluc","Paco Montero","Serginho","Chengzhi Li","Arnau Sentis","Marc Farreras"],
        notes: "" },

      { time: "18:36", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Ivan Mico","Chengzhi Li","Marc Farreras","Pau Ibañez","Arnau Sentis","Paco Montero"],
        notes: "Robert C. #4." },

      { time: "21:00", type: "favor", scorer: "Serginho", assist: "Paco Montero", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Lluc","Pau Ibañez","Chengzhi Li","Paco Montero","Marc Farreras","Serginho"],
        notes: "" },

      { time: "21:50", type: "favor", scorer: "Chengzhi Li", assist: "Paco Montero", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Lluc","Pau Ibañez","Paco Montero","Serginho","Chengzhi Li","Marc Farreras"],
        notes: "" },

      { time: "24:40", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Lluc","Pau Ibañez","Chengzhi Li","Arnau Sentis","Marc Farreras","Ivan Mico"],
        notes: "Des del mig del camp. Robert C. #4." },

      { time: "34:00", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Lluc","Pau Ibañez","Arnau Sentis","Serginho","Marc Farreras","Paco Montero"],
        notes: "Jordi S. #14." },

      { time: "36:00", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Lluc","Paco Montero","Serginho","Arnau Sentis","Marc Farreras","Chengzhi Li"],
        notes: "Robert C. #4, el tercer seu." },
    ],
    retransmissio: [
      { time: "06:10", type: "bona", text: "En Farreras intenta treure de banda", players: ["Marc Farreras"], videoUrl: "https://www.youtube.com/watch?v=E2N1jhhszN0&t=367s", photo: null, photoHover: null },
      { time: "07:58", type: "bona", text: "Xut al pal d'en Paco Montero, amb passada clau d'en Chengzhi", players: ["Paco Montero", "Chengzhi Li"], videoUrl: "https://www.youtube.com/watch?v=E2N1jhhszN0&t=475s", photo: null, photoHover: null },
      { time: "39:45", type: "bona", text: "Paco es mata", players: ["Paco Montero"], videoUrl: "https://www.youtube.com/watch?v=E2N1jhhszN0&t=2382s", photo: null, photoHover: null },
    ],
  },
};
