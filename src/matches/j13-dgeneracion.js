// j13-dgeneracion
// 1a part completa · 2a part pendent
export default {
  id: "j13-dgeneracion",
  jornada: "Jornada 13",
  opponent: "Dgeneración X",
  result: "2 - 4",
  date: "08 Jun 2026",
  youtubeId: "uhbrgpIPI5M",
  vimeoId: null,
  idealMinutesPerPlayer: 20.0,
  savesManual: { "Oriol Tomas": 1, "Joan Medina": 0 },
  shots: {
    "Andreu Cases": [{ time: "0:28",  onTarget: true  }, { time: "5:00", onTarget: false }],
    "Roger Miro":   [{ time: "1:00",  onTarget: true  }, { time: "3:01", onTarget: true  }],
  },
  keyPasses: {
    "Pau Ibañez":   [{ time: "0:28" }],
    "Andreu Cases": [{ time: "3:01" }],
  },
  dribbles: {
    "Andreu Cases": [{ time: "5:00" }, { time: "11:20" }],
  },
  events: {
    substitutions: [
      // ── 1A PART ──────────────────────────────────────────────────────────
      { time: "0:00",  goalkeeper: "Oriol Tomas", onPitch: ["Roger Miro", "Pau Ibañez", "Andreu Cases", "Paco Montero"] },
      { time: "4:29",  goalkeeper: "Oriol Tomas", onPitch: ["Roger Miro", "Andreu Cases", "Marc Farreras", "Paco Montero"] },
      { time: "5:13",  goalkeeper: "Oriol Tomas", onPitch: ["Roger Miro", "Arnau Sentis", "Paco Montero", "Marc Farreras"] },
      { time: "5:55",  goalkeeper: "Oriol Tomas", onPitch: ["Joan Medina", "Arnau Sentis", "Paco Montero", "Marc Farreras"] },
      { time: "7:11",  goalkeeper: "Oriol Tomas", onPitch: ["Chengzhi Li", "Marc Farreras", "Arnau Sentis", "Joan Medina"] },
      { time: "9:28",  goalkeeper: "Oriol Tomas", onPitch: ["Joan Medina", "Chengzhi Li", "Marc Farreras", "Pau Ibañez"] },
      { time: "10:10", goalkeeper: "Oriol Tomas", onPitch: ["Andreu Cases", "Chengzhi Li", "Joan Medina", "Pau Ibañez"] },
      { time: "12:33", goalkeeper: "Oriol Tomas", onPitch: ["Roger Miro", "Andreu Cases", "Pau Ibañez", "Paco Montero"] },
      { time: "14:51", goalkeeper: "Joan Medina", onPitch: ["Andreu Cases", "Paco Montero", "Pau Ibañez", "Roger Miro"] },
      { time: "15:30", goalkeeper: "Joan Medina", onPitch: ["Paco Montero", "Oriol Tomas", "Roger Miro", "Andreu Cases"] },
      { time: "16:27", goalkeeper: "Joan Medina", onPitch: ["Arnau Sentis", "Paco Montero", "Oriol Tomas", "Roger Miro"] },
      // ── 2A PART (pendent) ────────────────────────────────────────────────
      { time: "40:00", goalkeeper: "Joan Medina", onPitch: [] },
    ],
    cards: [],
    goals: [
      // GOL A FAVOR — Miro, 1:29 | sub 0:00 | vídeo 1:29
      { time: "1:29", type: "favor", scorer: "Roger Miro", assist: "Andreu Cases", goalkeeper: "Oriol Tomas",
        zone: "B6", shotPos: { x: 717, y: 175 }, assistPos: { x: 582, y: 217 }, conductPos: null, goalPos: { x: 219, y: 187 },
        onPitch: ["Roger Miro", "Pau Ibañez", "Paco Montero", "Andreu Cases"],
        notes: "Assistència increïble de Telico per a que Miró obri el marcador" },

      // GOL EN CONTRA — 12:20 | sub 10:10 | vídeo 12:20
      { time: "12:20", type: "contra", goalkeeper: "Oriol Tomas",
        onPitch: ["Joan Medina", "Andreu Cases", "Pau Ibañez", "Chengzhi Li"],
        notes: "El rival astut veu que Oriol té un pal preferit i li tira la pilota a l'altre" },

      // GOL EN CONTRA — 14:14 | sub 12:33 | vídeo 14:14
      { time: "14:14", type: "contra", goalkeeper: "Oriol Tomas",
        onPitch: ["Roger Miro", "Pau Ibañez", "Andreu Cases", "Paco Montero"],
        notes: "Mal pase de Paco que recupera el rival, un pase i ens xuten, Oriol no la para" },

      // GOL A FAVOR 2n + 2 gols en contra — 2a part (pendent)
    ],
    retransmissio: [
      { time: "0:12",  type: "bona",    text: "Estem jugant molt bé fins que la perdem i el rival fa un cañito a Pau i després a Paco",                                    players: [], videoUrl: "https://www.youtube.com/watch?v=uhbrgpIPI5M&t=9s" },
      { time: "0:28",  type: "bona",    text: "Jugada brutal: Paco fa un pase llarg a Pau que la salva de la banda i la passa a la frontal perquè Telico xuti a porta",    players: [], videoUrl: "https://www.youtube.com/watch?v=uhbrgpIPI5M&t=25s" },
      { time: "0:56",  type: "bona",    text: "Recuperació ràpida de Miró que fa un bon xut a porta",                                                                      players: ["Roger Miro"], videoUrl: "https://www.youtube.com/watch?v=uhbrgpIPI5M&t=53s" },
      { time: "2:30",  type: "bona",    text: "Primera falta que ens xuten, la para Oriol",                                                                               players: ["Oriol Tomas"], videoUrl: "https://www.youtube.com/watch?v=uhbrgpIPI5M&t=135s" },
      { time: "2:49",  type: "bona",    text: "Saquen el córner i menys mal que Pau estava sota pals perquè ens salva d'un gol en dos temps (el porter era l'Oriol, xd)", players: ["Pau Ibañez"], videoUrl: "https://www.youtube.com/watch?v=uhbrgpIPI5M&t=166s" },
      { time: "3:00",  type: "bona",    text: "Sortim ràpid entre Miró i Telico, acaba en xut a porta de Miró",                                                           players: ["Roger Miro", "Andreu Cases"], videoUrl: "https://www.youtube.com/watch?v=uhbrgpIPI5M&t=177s" },
      { time: "4:56",  type: "bona",    text: "Una de les jugades del partit: acció boníssima de tot el camp, sobretot Telico que rebateja al porter però l'envia a fora", players: ["Andreu Cases"], videoUrl: "https://www.youtube.com/watch?v=uhbrgpIPI5M&t=293s" },
      { time: "7:10",  type: "bona",    text: "Contra que comença en un pase de taló de Sentis a Chengzhi",                                                               players: ["Arnau Sentis", "Chengzhi Li"], videoUrl: "https://www.youtube.com/watch?v=uhbrgpIPI5M&t=427s" },
      { time: "8:06",  type: "dolenta", text: "Ocasió clara del rival, no sé com la fallen",                                                                              players: [], videoUrl: "https://www.youtube.com/watch?v=uhbrgpIPI5M&t=483s" },
      { time: "8:34",  type: "bona",    text: "Medina portava les sabates del revés",                                                                                     players: ["Joan Medina"], videoUrl: "https://www.youtube.com/watch?v=uhbrgpIPI5M&t=511s" },
      { time: "9:50",  type: "dolenta", text: "Marc deixa la pilota a Pau a la banda, fa un centre que recupera el rival i ens fa una contra que per sort no marquen",    players: ["Marc Farreras", "Pau Ibañez"], videoUrl: "https://www.youtube.com/watch?v=uhbrgpIPI5M&t=587s" },
      { time: "12:50", type: "dolenta", text: "Cagada de Pau en un pase; després fora de banda que Oriol intenta treure de porter — menys mal que no el deixem",          players: ["Pau Ibañez", "Oriol Tomas"], videoUrl: "https://www.youtube.com/watch?v=uhbrgpIPI5M&t=767s" },
      { time: "15:31", type: "dolenta", text: "Primera sortida de Medina amb la pilota, no ho podria haver fet pitjor",                                                   players: ["Joan Medina"], videoUrl: "https://www.youtube.com/watch?v=uhbrgpIPI5M&t=928s" },
      { time: "15:59", type: "dolenta", text: "Oriol ensenya com tornar una pilota al camp rival — no ho intenteu a casa",                                                players: ["Oriol Tomas"], videoUrl: "https://www.youtube.com/watch?v=uhbrgpIPI5M&t=956s" },
      { time: "16:20", type: "dolenta", text: "Una altra delicatessen d'Oriol xutant una pilota — cada cop queda més clar que el seu gol de mig camp hi va haver molta sort", players: ["Oriol Tomas"], videoUrl: "https://www.youtube.com/watch?v=uhbrgpIPI5M&t=977s" },
    ],
  },
};
