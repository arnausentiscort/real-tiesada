// Jornada 2 · 22/09/2026 · Star Warros FC 3-2 Real Tiesada
// Resultat i golejadors d'apuntamelo.com (partit 378409). El registre de
// canvis és de l'Arnau al grup (23/09) i s'atura al 12:13: d'aquí endavant
// no sabem qui hi havia al camp, així que els minuts només cobreixen els
// dotze primers i els tres últims gols van sense alineació. Falta el
// registre de la resta del partit per completar-ho.
export default {
  id: "s3-j2-star-warros",
  jornada: "Jornada 2",
  opponent: "Star Warros FC",
  result: "2 - 3",
  date: "22 Set 2026",
  youtubeId: null,
  vimeoId: null,
  idealMinutesPerPlayer: null,
  savesManual: {},
  shots: {},
  keyPasses: {},
  dribbles: {},
  events: {
    substitutions: [
      { time: "00:00", goalkeeper: "Joan Ribes", onPitch: ["Lluc", "Paco Montero", "Arnau Sentis", "Pau Ibañez", "Joan Medina", "Ivan Mico"] },
      { time: "08:16", goalkeeper: "Joan Ribes", onPitch: ["Lluc", "Paco Montero", "Pau Ibañez", "Joan Medina", "Ivan Mico", "Serginho"] },
      { time: "09:00", goalkeeper: "Joan Ribes", onPitch: ["Lluc", "Paco Montero", "Pau Ibañez", "Roi Seoane", "Serginho"] },
      { time: "10:30", goalkeeper: "Joan Ribes", onPitch: ["Coro", "Lluc", "Roger Miro", "Roi Seoane", "Serginho"] },
      { time: "12:13", goalkeeper: "Joan Ribes", onPitch: ["Roger Miro", "Arnau Sentis", "Coro", "Lluc", "Roi Seoane", "Serginho"] },
    ],
    cards: [],
    goals: [
      { time: "13:00", type: "favor", scorer: "Roger Miro", assist: null, goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: ["Roger Miro", "Arnau Sentis", "Coro", "Lluc", "Roi Seoane", "Serginho"],
        notes: "Ens avancem: rebuig d'una falta que remata en Miró." },

      { time: "17:00", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: [],
        notes: "Empaten de seguida. Jan C. #21." },

      { time: "18:00", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: [],
        notes: "I al minut següent se'n van. Miquel M. #4." },

      { time: "39:00", type: "favor", scorer: "Chengzhi Li", assist: null, goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: [],
        notes: "Gol d'en Chengzhi: tornem a empatar quan quedava poc." },

      { time: "41:00", type: "contra", goalkeeper: "Joan Ribes",
        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,
        onPitch: [],
        notes: "Dos minuts després ens el fan i ja no hi som a temps. Fèlix M. #9, MVP del partit." },
    ],
    retransmissio: [
      { time: "09:00", type: "tactica", text: "Ens quedem amb cinc de camp", players: [], videoUrl: null, photo: null, photoHover: null },
      { time: "13:00", type: "bona", text: "Gol d'en Miró al rebuig d'una falta", players: ["Roger Miro"], videoUrl: null, photo: null, photoHover: null },
      { time: "12:13", type: "dolenta", text: "El registre de canvis s'acaba aquí: els minuts d'aquest partit només cobreixen els dotze primers.", players: [], videoUrl: null, photo: null, photoHover: null },
    ],
  },
};
