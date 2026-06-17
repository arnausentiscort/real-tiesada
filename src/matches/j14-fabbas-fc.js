// j14-fabbas-fc
// No hi jugaren: Marc Farreras, Oriol Tomas, Andreu Cases (Telico)
// En lloc de Telico va jugar el seu amic Ivaniño (convidat) — registrat com "Andreu Cases"
export default {
  id: "j14-fabbas-fc",
  jornada: "Jornada 14",
  opponent: "Fabbas FC",
  result: "4 - 3",
  date: "14 Jun 2026",
  youtubeId: "x-eSXvoc0yI",
  vimeoId: null,
  idealMinutesPerPlayer: 20,
  savesManual: { "Ivan Mico": 4 },
  shots: {
    "Chengzhi Li":  [{ time: "1:20",  onTarget: true }, { time: "11:20", onTarget: true }],
    "Roger Miro":   [{ time: "8:20",  onTarget: true }],
    "Arnau Sentis": [{ time: "8:30",  onTarget: true }, { time: "10:01", onTarget: true }],
    "Andreu Cases": [{ time: "8:40",  onTarget: true }, { time: "11:40", onTarget: true }],
  },
  keyPasses: {
    "Andreu Cases": [{ time: "8:20"  }, { time: "10:01" }],
    "Pau Ibañez":   [{ time: "8:30"  }, { time: "8:40"  }],
    "Chengzhi Li":  [{ time: "11:40" }],
  },
  dribbles: {
    "Chengzhi Li":  [{ time: "6:00" }],
    "Andreu Cases": [{ time: "7:15" }],
  },
  events: {
    substitutions: [
      { time: "0:00",  goalkeeper: "Ivan Mico", onPitch: ["Arnau Sentis", "Roi Seoane", "Paco Montero", "Chengzhi Li"] },
      { time: "3:20",  goalkeeper: "Ivan Mico", onPitch: ["Paco Montero", "Roi Seoane", "Joan Medina", "Chengzhi Li"] },
      { time: "3:49",  goalkeeper: "Ivan Mico", onPitch: ["Paco Montero", "Pau Ibañez", "Joan Medina", "Chengzhi Li"] },
      { time: "7:00",  goalkeeper: "Ivan Mico", onPitch: ["Pau Ibañez", "Paco Montero", "Roger Miro", "Andreu Cases"] },
      { time: "7:39",  goalkeeper: "Ivan Mico", onPitch: ["Arnau Sentis", "Andreu Cases", "Pau Ibañez", "Roger Miro"] },
      { time: "9:20",  goalkeeper: "Ivan Mico", onPitch: ["Roi Seoane", "Andreu Cases", "Roger Miro", "Arnau Sentis"] },
      { time: "10:55", goalkeeper: "Ivan Mico", onPitch: ["Andreu Cases", "Roi Seoane", "Chengzhi Li", "Roger Miro"] },
    ],
    cards: [],
    goals: [
      { time: "4:07", type: "favor", scorer: "Joan Medina", assist: "Paco Montero", goalkeeper: "Ivan Mico",
        zone: "B1", shotPos: { x: 21, y: 208 }, assistPos: { x: 207, y: 43 }, conductPos: null, goalPos: { x: 158, y: 193 },
        onPitch: ["Joan Medina", "Pau Ibañez", "Paco Montero", "Chengzhi Li"],
        notes: "Bonísim pase d'Ivan a l'espai per Gabarri que xuta, el porter la para i Medina l'empuja per fer el gol." },

      { time: "7:15", type: "favor", scorer: "Andreu Cases", assist: "Roger Miro", goalkeeper: "Ivan Mico",
        zone: "C1", shotPos: { x: 115, y: 258 }, assistPos: { x: 750, y: 253 }, conductPos: { x: 666, y: 223 }, goalPos: { x: 245, y: 192 },
        onPitch: ["Roger Miro", "Pau Ibañez", "Paco Montero", "Andreu Cases"],
        notes: "Ivaniño té molta màgia, fa el millor gol individual de l'equip fins ara." },
    ],
    retransmissio: [
      { time: "0:25",  type: "bona", text: "Primera jugada perillosa que acaba en parada espectacular, quasi increïble, d'Ivan",                                                                         players: [], videoUrl: "https://www.youtube.com/watch?v=x-eSXvoc0yI&t=22s" },
      { time: "1:20",  type: "bona", text: "Recuperació de Chengzhi que xuta des de fora de l'àrea i la despejen",                                                                                     players: [], videoUrl: "https://www.youtube.com/watch?v=x-eSXvoc0yI&t=77s" },
      { time: "2:57",  type: "bona", text: "Falta feta per Gabarri a la frontal de l'àrea — aquesta fora concurs, és una grandíssima parada d'Ivan",                                                  players: [], videoUrl: "https://www.youtube.com/watch?v=x-eSXvoc0yI&t=174s" },
      { time: "5:35",  type: "bona", text: "Però quina peça de Ramona s'inventa el Li per penjar un centre",                                                                                           players: [], videoUrl: "https://www.youtube.com/watch?v=x-eSXvoc0yI&t=332s" },
      { time: "8:21",  type: "bona", text: "Molt bona combinació que genera un xut a porta — els que estan al camp s'entenen",                                                                         players: [], videoUrl: "https://www.youtube.com/watch?v=x-eSXvoc0yI&t=498s" },
      { time: "8:30",  type: "bona", text: "Pau des del saque de banda veu com Sentis es queda sol i li passa per estavellar la porteria a l'escaire — i després jugada bonísima que acaba en xut d'Ivan", players: [], videoUrl: "https://www.youtube.com/watch?v=x-eSXvoc0yI&t=507s" },
      { time: "9:20",  type: "bona", text: "Jugada que prometia però apareix Roi per fer un pase que no sent en Miró",                                                                                  players: [], videoUrl: "https://www.youtube.com/watch?v=x-eSXvoc0yI&t=557s" },
      { time: "11:20", type: "bona", text: "Jugada que demostra per què Chengzhi no té més assistències, partit fluix de Miró cara a porta. Xut de Miró i després pal de Chengzhi",                   players: [], videoUrl: "https://www.youtube.com/watch?v=x-eSXvoc0yI&t=677s" },
    ],
  },
};
