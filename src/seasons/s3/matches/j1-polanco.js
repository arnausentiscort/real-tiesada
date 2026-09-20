// Jornada 1 · 15/09/2026 · Real Tiesada 5-7 Polanco FC
// Cronologia i alineacions anotades pel Pau al grup (18/09). Els minuts
// dels gols són els seus, més precisos que els d'apuntamelo.com, d'on
// surten els golejadors rivals. Les substitucions estan DERIVADES dels
// onze observats a cada gol: sabem qui hi havia en aquell moment, no
// l'instant exacte del canvi, així que els minutatges són aproximats.
export default {
  id: "s3-j1-polanco",
  jornada: "Jornada 1",
  opponent: "Polanco FC",
  result: "5 - 7",
  date: "15 Set 2026",
  youtubeId: null,
  vimeoId: null,
  idealMinutesPerPlayer: 35,
  savesManual: {},
  shots: {},
  keyPasses: {},
  dribbles: {},
  events: {
    substitutions: [
      { time: "00:00", goalkeeper: "Pau Ibañez",  onPitch: ["Arnau Sentis", "Coro", "Marc Farreras", "Roger Miro", "Roi Seoane", "Serginho"] },
      { time: "11:30", goalkeeper: "Pau Ibañez",  onPitch: ["Arnau Sentis", "Roi Seoane", "Ivan Mico", "Serginho", "Coro", "Roger Miro"] },
      { time: "20:45", goalkeeper: "Joan Medina", onPitch: ["Roi Seoane", "Ivan Mico", "Roger Miro", "Pau Ibañez", "Marc Farreras", "Serginho"] },
      { time: "26:55", goalkeeper: "Joan Medina", onPitch: ["Arnau Sentis", "Chengzhi Li", "Roger Miro", "Ivan Mico", "Serginho", "Roi Seoane"] },
      { time: "32:49", goalkeeper: "Ivan Mico",   onPitch: ["Coro", "Chengzhi Li", "Roger Miro", "Joan Medina", "Serginho", "Arnau Sentis"] },
      { time: "39:40", goalkeeper: "Ivan Mico",   onPitch: ["Coro", "Marc Farreras", "Pau Ibañez", "Serginho", "Roger Miro", "Chengzhi Li"] },
      { time: "41:13", goalkeeper: "Ivan Mico",   onPitch: ["Roger Miro", "Roi Seoane", "Coro", "Chengzhi Li", "Serginho"] },
      { time: "43:25", goalkeeper: "Ivan Mico",   onPitch: ["Serginho", "Arnau Sentis", "Pau Ibañez", "Roi Seoane", "Coro", "Chengzhi Li"] },
      { time: "50:00", goalkeeper: null, onPitch: [], _isBreak: true },
    ],
    cards: [],
    goals: [
      { time: "07:20", type: "contra", goalkeeper: "Pau Ibañez",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Arnau Sentis", "Coro", "Marc Farreras", "Roger Miro", "Roi Seoane", "Serginho"],
        notes: "Primer gol encaixat. David H. #16." },

      { time: "07:54", type: "favor", scorer: "Serginho", assist: "Marc Farreras", goalkeeper: "Pau Ibañez",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Arnau Sentis", "Coro", "Marc Farreras", "Roger Miro", "Roi Seoane", "Serginho"],
        notes: "Empatem de seguida, amb els mateixos al camp: gol d'en Serginho amb assistència d'en Farreras." },

      { time: "09:24", type: "contra", goalkeeper: "Pau Ibañez",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Marc Farreras", "Arnau Sentis", "Serginho", "Roi Seoane", "Roger Miro", "Coro"],
        notes: "Segon gol encaixat. David H. #16." },

      { time: "11:30", type: "contra", goalkeeper: "Pau Ibañez",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Arnau Sentis", "Roi Seoane", "Ivan Mico", "Serginho", "Coro", "Roger Miro"],
        notes: "Tercer gol encaixat. Daniel I. #96." },

      { time: "20:45", type: "contra", goalkeeper: "Joan Medina",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Roi Seoane", "Ivan Mico", "Roger Miro", "Pau Ibañez", "Marc Farreras", "Serginho"],
        notes: "Quart gol encaixat: ens el fan mentre fem els canvis. Aitor R. #42." },

      { time: "26:55", type: "contra", goalkeeper: "Joan Medina",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Arnau Sentis", "Chengzhi Li", "Roger Miro", "Ivan Mico", "Serginho", "Roi Seoane"],
        notes: "Cinquè gol encaixat. Daniel I. #96." },

      { time: "28:28", type: "contra", goalkeeper: "Joan Medina",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Arnau Sentis", "Chengzhi Li", "Roger Miro", "Ivan Mico", "Serginho", "Roi Seoane"],
        notes: "Sisè gol encaixat, amb els mateixos al camp. Christian A. #27." },

      { time: "32:49", type: "favor", scorer: "Serginho", assist: "Arnau Sentis", goalkeeper: "Ivan Mico",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Coro", "Chengzhi Li", "Roger Miro", "Joan Medina", "Serginho", "Arnau Sentis"],
        notes: "Segon gol nostre: Serginho amb assistència de l'Arnau Sentis." },

      { time: "39:40", type: "favor", scorer: "Marc Farreras", assist: "Pau Ibañez", goalkeeper: "Ivan Mico",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Coro", "Marc Farreras", "Pau Ibañez", "Serginho", "Roger Miro", "Chengzhi Li"],
        notes: "Gol d'en Farreras amb assistència d'en Pau Ibañez." },

      { time: "41:13", type: "favor", scorer: "Roi Seoane", assist: "Roger Miro", goalkeeper: "Ivan Mico",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Roger Miro", "Roi Seoane", "Coro", "Chengzhi Li", "Serginho"],
        notes: "Gol d'en Roi amb assistència d'en Miró. Jugàvem amb sis: cinc de camp i porter." },

      { time: "41:40", type: "contra", goalkeeper: "Ivan Mico",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Roger Miro", "Roi Seoane", "Coro", "Chengzhi Li", "Serginho"],
        notes: "Setè gol encaixat, mig minut després del nostre i amb els mateixos sis. Daniel I. #96." },

      { time: "43:25", type: "favor", scorer: "Serginho", assist: "Arnau Sentis", goalkeeper: "Ivan Mico",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Serginho", "Arnau Sentis", "Pau Ibañez", "Roi Seoane", "Coro", "Chengzhi Li"],
        notes: "Cinquè i últim gol nostre: Serginho, altre cop amb assistència de l'Arnau Sentis." },
    ],
    retransmissio: [
      { time: "15:07", type: "bona", text: "Rematada de cap de l'Arnau Sentis", players: ["Arnau Sentis"], videoUrl: null, photo: null, photoHover: null },
    ],
  },
};
