// Jornada 6 · 20/10/2026 · Real Tiesada 8-9 FC Lucky
// Marcador i golejadors d'apuntamelo.com (partit 381627), només amb el minut.
// Golejadors nostres pel dorsal: #2 Marti C. → Coro, #18 Sergi M. → Serginho,
// #10 Pau I. → Pau Ibañez. Canvis, tirs i aturades de l'Arnau amb el mode partit.
// Corregit el 21/10: en Chengzhi no va jugar. Era en Serginho (15:37-15:38 era
// un clic d'anada i tornada, i de 17:32 a 24:49 hi constava en Chengzhi, però en
// Serginho marca al 18'). 14:45+14:48 i 41:35+41:38 eren un sol canvi cadascun,
// i el de les 19:12 (en Coro surt i torna als 18 s) també era un clic de més.
export default {
  id: "s3-j6-fc-lucky",
  jornada: "Jornada 6",
  opponent: "FC Lucky",
  result: "8 - 9",
  date: "20 Oct 2026",
  youtubeId: "_4OKL5z8_mQ",
  vimeoId: null,
  idealMinutesPerPlayer: 37,
  savesManual: { "Joan Ribes": 5 },
  shots: {
    "Serginho":     [{ time: "00:39", onTarget: false, post: true }, { time: "04:43", onTarget: true }, { time: "08:00", onTarget: true }, { time: "43:49", onTarget: false, post: true }],
    "Coro":         [{ time: "05:56", onTarget: false }, { time: "06:58", onTarget: false }],
    "Ivan Mico":    [{ time: "12:22", onTarget: true }],
    "Roger Miro":   [{ time: "15:50", onTarget: true }],
    "Arnau Sentis": [{ time: "32:27", onTarget: true }],
  },
  keyPasses: {},
  dribbles: {},
  events: {
    substitutions: [
      { time: "00:00", goalkeeper: "Joan Ribes", onPitch: ["Arnau Sentis","Paco Montero","Serginho","Ivan Mico","Roger Miro","Joan Medina"] },
      { time: "05:17", goalkeeper: "Joan Ribes", onPitch: ["Paco Montero","Serginho","Ivan Mico","Roger Miro","Joan Medina","Coro"] },
      { time: "06:34", goalkeeper: "Joan Ribes", onPitch: ["Paco Montero","Serginho","Ivan Mico","Joan Medina","Coro","Pau Ibañez"] },
      { time: "08:20", goalkeeper: "Joan Ribes", onPitch: ["Paco Montero","Serginho","Ivan Mico","Coro","Pau Ibañez","Arnau Sentis"] },
      { time: "09:15", goalkeeper: "Joan Ribes", onPitch: ["Paco Montero","Ivan Mico","Coro","Pau Ibañez","Arnau Sentis","Roger Miro"] },
      { time: "14:45", goalkeeper: "Joan Ribes", onPitch: ["Ivan Mico","Coro","Pau Ibañez","Arnau Sentis","Roger Miro","Joan Medina"] },
      { time: "15:35", goalkeeper: "Joan Ribes", onPitch: ["Coro","Pau Ibañez","Arnau Sentis","Roger Miro","Joan Medina","Serginho"] },
      { time: "17:32", goalkeeper: "Joan Ribes", onPitch: ["Coro","Arnau Sentis","Roger Miro","Joan Medina","Serginho","Paco Montero"] },
      { time: "19:30", goalkeeper: "Joan Ribes", onPitch: ["Coro","Roger Miro","Joan Medina","Serginho","Paco Montero","Ivan Mico"] },
      { time: "21:31", goalkeeper: "Joan Ribes", onPitch: ["Coro","Roger Miro","Serginho","Paco Montero","Ivan Mico","Pau Ibañez"] },
      { time: "24:49", goalkeeper: "Joan Ribes", onPitch: ["Coro","Paco Montero","Ivan Mico","Pau Ibañez","Serginho","Arnau Sentis"] },
      { time: "25:12", goalkeeper: "Joan Ribes", onPitch: ["Paco Montero","Ivan Mico","Pau Ibañez","Serginho","Arnau Sentis","Joan Medina"] },
      { time: "28:51", goalkeeper: "Joan Ribes", onPitch: ["Paco Montero","Pau Ibañez","Serginho","Arnau Sentis","Joan Medina","Roger Miro"] },
      { time: "29:29", goalkeeper: "Joan Ribes", onPitch: ["Paco Montero","Serginho","Arnau Sentis","Joan Medina","Roger Miro","Coro"] },
      { time: "29:49", goalkeeper: "Joan Ribes", onPitch: ["Paco Montero","Serginho","Arnau Sentis","Roger Miro","Coro","Ivan Mico"] },
      { time: "32:52", goalkeeper: "Joan Ribes", onPitch: ["Serginho","Arnau Sentis","Roger Miro","Coro","Ivan Mico","Pau Ibañez"] },
      { time: "34:56", goalkeeper: "Joan Ribes", onPitch: ["Serginho","Roger Miro","Coro","Ivan Mico","Pau Ibañez","Joan Medina"] },
      { time: "35:34", goalkeeper: "Joan Ribes", onPitch: ["Roger Miro","Coro","Ivan Mico","Pau Ibañez","Joan Medina","Paco Montero"] },
      { time: "39:01", goalkeeper: "Joan Ribes", onPitch: ["Coro","Ivan Mico","Pau Ibañez","Joan Medina","Paco Montero","Arnau Sentis"] },
      { time: "39:42", goalkeeper: "Joan Ribes", onPitch: ["Ivan Mico","Pau Ibañez","Joan Medina","Paco Montero","Arnau Sentis","Serginho"] },
      { time: "41:35", goalkeeper: "Joan Ribes", onPitch: ["Pau Ibañez","Joan Medina","Paco Montero","Arnau Sentis","Serginho","Coro"] },
      { time: "43:09", goalkeeper: "Joan Ribes", onPitch: ["Pau Ibañez","Paco Montero","Arnau Sentis","Serginho","Coro","Ivan Mico"] },
      { time: "48:56", goalkeeper: null, onPitch: [], _isBreak: true },
    ],
    cards: [],
    goals: [
      { time: "01:00", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Arnau Sentis","Paco Montero","Serginho","Ivan Mico","Roger Miro","Joan Medina"],
        notes: "Matias L. #10." },

      { time: "02:00", type: "favor", scorer: "Serginho", assist: null, goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Arnau Sentis","Paco Montero","Serginho","Ivan Mico","Roger Miro","Joan Medina"],
        notes: "" },

      { time: "09:00", type: "favor", scorer: "Coro", assist: null, goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Paco Montero","Serginho","Ivan Mico","Coro","Pau Ibañez","Arnau Sentis"],
        notes: "" },

      { time: "09:00", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Paco Montero","Serginho","Ivan Mico","Coro","Pau Ibañez","Arnau Sentis"],
        notes: "Matias L. #10." },

      { time: "13:00", type: "favor", scorer: "Coro", assist: null, goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Paco Montero","Ivan Mico","Coro","Pau Ibañez","Arnau Sentis","Roger Miro"],
        notes: "" },

      { time: "15:00", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Ivan Mico","Coro","Pau Ibañez","Arnau Sentis","Roger Miro","Joan Medina"],
        notes: "Matias L. #10." },

      { time: "18:00", type: "favor", scorer: "Serginho", assist: null, goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Coro","Arnau Sentis","Roger Miro","Joan Medina","Serginho","Paco Montero"],
        notes: "" },

      { time: "23:00", type: "favor", scorer: "Pau Ibañez", assist: null, goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Coro","Roger Miro","Serginho","Paco Montero","Ivan Mico","Pau Ibañez"],
        notes: "" },

      { time: "30:00", type: "favor", scorer: "Coro", assist: null, goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Paco Montero","Serginho","Arnau Sentis","Roger Miro","Coro","Ivan Mico"],
        notes: "" },

      { time: "30:00", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Paco Montero","Serginho","Arnau Sentis","Roger Miro","Coro","Ivan Mico"],
        notes: "Matias L. #10." },

      { time: "31:00", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Paco Montero","Serginho","Arnau Sentis","Roger Miro","Coro","Ivan Mico"],
        notes: "Mirko L. #9." },

      { time: "33:00", type: "favor", scorer: "Coro", assist: null, goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Serginho","Arnau Sentis","Roger Miro","Coro","Ivan Mico","Pau Ibañez"],
        notes: "" },

      { time: "39:00", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Roger Miro","Coro","Ivan Mico","Pau Ibañez","Joan Medina","Paco Montero"],
        notes: "Matias L. #10, el cinquè seu." },

      { time: "40:00", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Ivan Mico","Pau Ibañez","Joan Medina","Paco Montero","Arnau Sentis","Serginho"],
        notes: "Mirko L. #9." },

      { time: "43:00", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Pau Ibañez","Joan Medina","Paco Montero","Arnau Sentis","Serginho","Coro"],
        notes: "Franco I. #91." },

      { time: "44:00", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Pau Ibañez","Paco Montero","Arnau Sentis","Serginho","Coro","Ivan Mico"],
        notes: "Franco I. #91." },

      { time: "46:00", type: "favor", scorer: "Serginho", assist: null, goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Pau Ibañez","Paco Montero","Arnau Sentis","Serginho","Coro","Ivan Mico"],
        notes: "" },
    ],
    retransmissio: [
      { time: "07:55", type: "bona", text: "Molt bona jugada que acaba amb en Medina xutant a l'aire", players: ["Joan Medina"], videoUrl: "https://www.youtube.com/watch?v=_4OKL5z8_mQ&t=472s", photo: null, photoHover: null },
    ],
  },
};
