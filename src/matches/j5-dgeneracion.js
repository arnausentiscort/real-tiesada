// j5-dgeneracion
export default {
      id: "j5-dgeneracion",
      jornada: "Jornada 5",
      opponent: "Dgeneración X",
      result: "1 - 3",
      date: "23 Mar 2026",
      youtubeId: "7CV-4Fjj7tw",
      vimeoId: null,
      idealMinutesPerPlayer: 16.0,
      savesManual: { "Ivan Mico": 8, "Joan Medina": 5 },
      shots: { "Paco Montero": [{ time: "3:05", onTarget: true }, { time: "32:09", onTarget: true }, { time: "34:27", onTarget: true }, { time: "35:22", onTarget: false }], "Joan Medina": [{ time: "9:45", onTarget: true }], "Andreu Cases": [{ time: "14:34", onTarget: false }, { time: "33:24", onTarget: true }], "Roger Miro": [{ time: "29:50", onTarget: true }, { time: "25:10", onTarget: true }], "Roi Seoane": [{ time: "25:55", onTarget: false }], "Oriol Tomas": [{ time: "32:59", onTarget: false }] },
      keyPasses: { "Arnau Sentis": [{ time: "9:45" }, { time: "25:55" }], "Roger Miro": [{ time: "19:49" }], "Oriol Tomas": [{ time: "29:50" }, { time: "33:24" }], "Joan Medina": [{ time: "25:10" }, { time: "32:59" }, { time: "35:22" }], "Andreu Cases": [{ time: "32:09" }, { time: "34:27" }] },
      dribbles: { "Andreu Cases": [{ time: "14:00" }, { time: "27:40" }] },
      events: {
       substitutions: [
          { time: "00:00", goalkeeper: "Ivan Mico", onPitch: ["Pau Ibañez", "Oriol Tomas", "Paco Montero", "Roger Miro"] },
          { time: "05:56", goalkeeper: "Ivan Mico", onPitch: ["Oriol Tomas", "Paco Montero", "Roger Miro", "Andreu Cases"] },
          { time: "07:35", goalkeeper: "Ivan Mico", onPitch: ["Arnau Sentis", "Joan Medina", "Roi Seoane", "Andreu Cases"] },
          { time: "14:42", goalkeeper: "Ivan Mico", onPitch: ["Pau Ibañez", "Joan Medina", "Roi Seoane", "Andreu Cases"] },
          { time: "16:16", goalkeeper: "Ivan Mico", onPitch: ["Paco Montero", "Andreu Cases", "Joan Medina", "Pau Ibañez"] },
          { time: "17:26", goalkeeper: "Ivan Mico", onPitch: ["Oriol Tomas", "Paco Montero", "Pau Ibañez", "Roger Miro"] },
          
          // Pausa por la media parte
          { time: "18:13", goalkeeper: "Ivan Mico", onPitch: [] },
          { time: "18:41", goalkeeper: "Joan Medina", onPitch: ["Roger Miro", "Pau Ibañez", "Paco Montero", "Oriol Tomas"] },
          
          { time: "21:07", goalkeeper: "Joan Medina", onPitch: ["Ivan Mico", "Paco Montero", "Oriol Tomas", "Roger Miro"] },
          { time: "25:04", goalkeeper: "Joan Medina", onPitch: ["Oriol Tomas", "Roger Miro", "Andreu Cases", "Ivan Mico"] },
          { time: "25:24", goalkeeper: "Joan Medina", onPitch: ["Arnau Sentis", "Oriol Tomas", "Andreu Cases", "Ivan Mico"] },
          { time: "25:50", goalkeeper: "Joan Medina", onPitch: ["Arnau Sentis", "Andreu Cases", "Roi Seoane", "Ivan Mico"] },
          
          // Entran justo antes del corte de vídeo
          { time: "26:37", goalkeeper: "Joan Medina", onPitch: ["Arnau Sentis", "Pau Ibañez", "Roi Seoane", "Andreu Cases"] },
          
          // Pausa por el tiempo muerto (+1 MINUTO AÑADIDO MAGÍCAMENTE AQUÍ)
          // Antes era 29:10, ahora es 30:10. Esto les regala 1 minuto de estadística.
          { time: "30:10", goalkeeper: "Joan Medina", onPitch: [] },
          
          // Reanudamos después del tiempo muerto
          { time: "30:55", goalkeeper: "Ivan Mico", onPitch: ["Joan Medina", "Paco Montero", "Andreu Cases", "Roi Seoane"] },
          
          // Último cambio
          { time: "33:00", goalkeeper: "Ivan Mico", onPitch: ["Andreu Cases", "Paco Montero", "Oriol Tomas", "Joan Medina"] },
          
          // Final del partido
          { time: "36:48", goalkeeper: "Ivan Mico", onPitch: [] }
        ],
        cards: [],
        goals: [
          { time: "04:25", type: "favor", scorer: "Roger Miro", assist: "Ivan Mico", goalkeeper: "Ivan Mico",
            zone: "A2", shotPos: { x: 245, y: 114 }, assistPos: { x: 70, y: 201 }, conductPos: null, goalPos: { x: 290, y: 10 },
            onPitch: ["Roger Miro","Pau Ibañez","Paco Montero","Oriol Tomas"], notes: "Golas per la esquadra de Miro increible." },
          { time: "05:35", type: "contra", goalkeeper: "Ivan Mico", onPitch: ["Pau Ibañez","Oriol Tomas","Paco Montero","Roger Miro"], notes: "Intentem sortir pel mig, ens la recuperen i ens marquen." },
          { time: "26:18", type: "contra", goalkeeper: "Joan Medina", onPitch: ["Arnau Sentis","Ivan Mico","Roi Seoane","Andreu Cases"], notes: "Ens marquen un golas des de la banda." },
          { time: "27:47", type: "contra", goalkeeper: "Joan Medina", onPitch: ["Arnau Sentis","Andreu Cases","Roi Seoane","Pau Ibañez"], notes: "No surt al video, Medina fa una parada i despres ens marquen." }
        ],
        retransmissio: [
          { time:"00:36", type:"dolenta", text:"Cagada d'Oriol a la sortida per a fer una paradeta fàcil d'Ivan.", players:["Oriol Tomas", "Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=33s" },
          { time:"03:08", type:"bona",    text:"El porter rival surt de la porteria i Paco casi marca. El porter rival va fora de l'àrea?", players:["Paco Montero"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=185s" },
          { time:"09:02", type:"dolenta", text:"L'Ivan regala la pilota a Qatar Airways.", players:["Ivan Mico"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=539s" },
          { time:"09:42", type:"bona",    text:"Molt bona jugada entre Medina, Arnau i Roi.", players:["Joan Medina", "Arnau Sentis", "Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=579s" },
          { time:"14:34", type:"bona",    text:"Bon xut d'Andreu.", players:["Andreu Cases"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=871s" },
          { time:"15:41", type:"clip",    text:"Aquesta jugada val la pena mirar-la, cada segon és millor que l'anterior.", players:[], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=938s" },
          { time:"19:20", type:"bona",    text:"Cagada d'en Medina sortint de porter i després paradón.", players:["Joan Medina"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1157s" },
          { time:"19:56", type:"bona",    text:"Gran combinació entre Miró i Pau. THEM ON FIRE REAL TIESADA 👏.", players:["Roger Miro", "Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1193s" },
          { time:"20:50", type:"bona",    text:"Xutazo de Roger Miró.", players:["Roger Miro"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1247s" },
          { time:"25:10", type:"bona",    text:"Un altre quasi gol de Miró, està a tope. El porter torna a semblar avançat.", players:["Roger Miro"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1507s" },
          { time:"25:51", type:"bona",    text:"Bona combinació que acaba en pal de Roi.", players:["Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1548s" },
          { time:"28:30", type:"clip",    text:"Jugada rara, la titulo 'El T-Rex'.", players:[], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1707s" },
          { time:"28:49", type:"bona",    text:"Bona jugada entre Roi i Pau.", players:["Roi Seoane", "Pau Ibañez"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1726s" },
          { time:"30:16", type:"clip",    text:"L'Andreu fa una segada que se la juga.", players:["Andreu Cases"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1813s" },
          { time:"31:00", type:"bona",    text:"El Roi corre per defensar i talla l'acció... i gairebé es marca en pròpia.", players:["Roi Seoane"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1857s" },
          { time:"32:10", type:"bona",    text:"Xut d'en Telico que en Paco l'intenta enredar i surt fregant el pal.", players:["Andreu Cases", "Paco Montero"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1927s" },
          { time:"33:00", type:"bona",    text:"Molt bona jugada i xut d'Oriol.", players:["Oriol Tomas"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1977s" },
          { time:"33:15", type:"bona",    text:"Xut de l'Andreu davant del porter, després li fan penal al Medina. L'àrbitre no té ulleres.", players:["Andreu Cases", "Joan Medina"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=1992s" },
          { time:"34:31", type:"bona",    text:"Xut molt bo d'en Paco des de la banda, el porter la para.", players:["Paco Montero"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=2068s" },
          { time:"35:20", type:"bona",    text:"Un altre xut d'en Paco.", players:["Paco Montero"], videoUrl:"https://www.youtube.com/watch?v=cOzSYdAtNQg&t=2117s" }
        ]
      }
    };
