// ===================================================
// DATA SPLIT 1 · Futsal 24/25
// Estadístiques generades des dels events del partit
// ===================================================

export const DATABASE_S1 = {
  teamName: 'Real Tiesada',

  roster: [
    { name: "Aron", shirtName: "ARON", position: "Migcampista", photo: null, photoCel: null },
    { name: "Coro", shirtName: "CORO", position: "Davanter", photo: null, photoCel: null },
    { name: "Lluc", shirtName: "LLUC", position: "Davanter", photo: null, photoCel: null },
    { name: "Marc", shirtName: "MARC", position: "Davanter", photo: null, photoCel: null },
    { name: "Medina", shirtName: "MEDINA", position: "Porter", photo: null, photoCel: null },
    { name: "Miro", shirtName: "MIRÓ", position: "Davanter", photo: null, photoCel: null },
    { name: "Oriol", shirtName: "ORIOL", position: "Migcampista", photo: null, photoCel: null },
    { name: "Pau", shirtName: "PAU", position: "Porter", photo: null, photoCel: null },
    { name: "Roi", shirtName: "ROI", position: "Defensa", photo: null, photoCel: null },
    { name: "Sentis", shirtName: "SENTIS", position: "Migcampista", photo: null, photoCel: null },
  ],

  matches: [
    // ── Jornada 1 — Real Magic Balompié ─────────────────
    {
      id: "j1-s1",
      jornada: "Jornada 1",
      opponent: "Real Magic Balompié",
      date: "07 Oct 2025",
      result: "3 - 8",
      youtubeId: "78vD3yEYWdY",
      mvpWinner: "Medina",
      playerStats: {
        "Aron": { gols:0, assists:0, parades:0, jugadesBones:7, cagades:1, golsEncaixats:0, pts:6 },
        "Coro": { gols:0, assists:1, parades:0, jugadesBones:2, cagades:0, golsEncaixats:1, pts:4 },
        "Lluc": { gols:0, assists:0, parades:3, jugadesBones:7, cagades:2, golsEncaixats:3, pts:8 },
        "Marc": { gols:0, assists:0, parades:0, jugadesBones:3, cagades:2, golsEncaixats:0, pts:1 },
        "Medina": { gols:1, assists:0, parades:9, jugadesBones:1, cagades:4, golsEncaixats:4, pts:9 },
        "Oriol": { gols:1, assists:0, parades:0, jugadesBones:3, cagades:0, golsEncaixats:0, pts:6 },
        "Pau": { gols:1, assists:1, parades:1, jugadesBones:2, cagades:1, golsEncaixats:1, pts:7 },
        "Roi": { gols:0, assists:0, parades:0, jugadesBones:0, cagades:2, golsEncaixats:0, pts:-2 },
        "Sentis": { gols:0, assists:0, parades:0, jugadesBones:4, cagades:1, golsEncaixats:0, pts:3 },
      },
      goals: [
        { time:"1:35", type:"favor", scorer:"Oriol", assist:"Pau", details:"El pistolero" },
        { time:"3:20", type:"favor", scorer:"Pau", assist:"Coro", details:"De banda" },
        { time:"13:35", type:"favor", scorer:"Medina", assist:null, details:"" },
        { time:"3:46", type:"contra", goalkeeper:"Medina", details:"" },
        { time:"8:34", type:"contra", goalkeeper:"Lluc", details:"" },
        { time:"12:20", type:"contra", goalkeeper:"Medina", details:"Golas per la escuadra" },
        { time:"12:34", type:"contra", goalkeeper:"Coro", details:"" },
        { time:"18:32", type:"contra", goalkeeper:"Pau", details:"" },
        { time:"27:15", type:"contra", goalkeeper:"Medina", details:"" },
        { time:"27:21", type:"contra", goalkeeper:"Medina", details:"" },
        { time:"32:00", type:"contra", goalkeeper:"Lluc", details:"De falta" },
        { time:"32:42", type:"contra", goalkeeper:"Lluc", details:"Ja estaven tiesos" },
      ],
      highlights: [
        { player:"Roi", time:"3:40", details:"Surt Maradona al camp", videoUrl:"https://www.youtube.com/watch?v=78vD3yEYWdY&t=217s" },
        { player:"Roi", time:"20:03", details:"Culet de Roi", videoUrl:"https://www.youtube.com/watch?v=78vD3yEYWdY&t=1200s" },
        { player:"Oriol", time:"27:02", details:"Es menja a Pau", videoUrl:"https://www.youtube.com/watch?v=78vD3yEYWdY&t=1619s" },
      ],
    },

    // ── Jornada 2 — Aston Birra ─────────────────
    {
      id: "j2-s1",
      jornada: "Jornada 2",
      opponent: "Aston Birra",
      date: "21 Oct 2025",
      result: "2 - 11",
      youtubeId: "HM-4WBRTxrI",
      mvpWinner: "Sentis",
      playerStats: {
        "Aron": { gols:0, assists:1, parades:0, jugadesBones:5, cagades:2, golsEncaixats:0, pts:5 },
        "Coro": { gols:1, assists:0, parades:2, jugadesBones:4, cagades:0, golsEncaixats:3, pts:9 },
        "Lluc": { gols:0, assists:0, parades:0, jugadesBones:4, cagades:0, golsEncaixats:0, pts:4 },
        "Marc": { gols:1, assists:0, parades:0, jugadesBones:4, cagades:0, golsEncaixats:0, pts:7 },
        "Medina": { gols:0, assists:0, parades:7, jugadesBones:2, cagades:3, golsEncaixats:5, pts:6 },
        "Pau": { gols:0, assists:0, parades:6, jugadesBones:1, cagades:1, golsEncaixats:2, pts:6 },
        "Roi": { gols:0, assists:0, parades:0, jugadesBones:0, cagades:1, golsEncaixats:1, pts:-1 },
        "Sentis": { gols:0, assists:1, parades:0, jugadesBones:7, cagades:0, golsEncaixats:0, pts:9 },
      },
      goals: [
        { time:"13:08", type:"favor", scorer:"Coro", assist:"Sentis", details:"Coro se torna loco" },
        { time:"14:21", type:"favor", scorer:"Marc", assist:"Aron", details:"Manos de Aron pero golazo" },
        { time:"5:14", type:"contra", goalkeeper:"Pau", details:"" },
        { time:"8:38", type:"contra", goalkeeper:"Medina", details:"" },
        { time:"11:01", type:"contra", goalkeeper:"Medina", details:"" },
        { time:"18:22", type:"contra", goalkeeper:"Medina", details:"" },
        { time:"28:30", type:"contra", goalkeeper:"Medina", details:"" },
        { time:"32:10", type:"contra", goalkeeper:"Medina", details:"De falta" },
        { time:"37:40", type:"contra", goalkeeper:"Pau", details:"" },
        { time:"41:48", type:"contra", goalkeeper:"Coro", details:"" },
        { time:"42:48", type:"contra", goalkeeper:"Coro", details:"" },
        { time:"45:43", type:"contra", goalkeeper:"Coro", details:"" },
        { time:"46:23", type:"contra", goalkeeper:"Roi", details:"" },
      ],
      highlights: [
        { player:"Roi", time:"0:32", details:"Roi i Coro ballant", videoUrl:"https://www.youtube.com/watch?v=HM-4WBRTxrI&t=29s" },
      ],
    },

    // ── Jornada 3 — Inafuman y Beben ─────────────────
    {
      id: "j3-s1",
      jornada: "Jornada 3",
      opponent: "Inafuman y Beben",
      date: "31 Oct 2025",
      result: "3 - 7",
      youtubeId: "h1mGEGwetcs",
      mvpWinner: "Coro",
      playerStats: {
        "Coro": { gols:1, assists:0, parades:0, jugadesBones:4, cagades:0, golsEncaixats:0, pts:7 },
        "Lluc": { gols:0, assists:0, parades:0, jugadesBones:1, cagades:2, golsEncaixats:0, pts:-1 },
        "Marc": { gols:0, assists:0, parades:0, jugadesBones:6, cagades:1, golsEncaixats:0, pts:5 },
        "Medina": { gols:0, assists:0, parades:7, jugadesBones:0, cagades:0, golsEncaixats:5, pts:7 },
        "Miro": { gols:1, assists:1, parades:0, jugadesBones:1, cagades:2, golsEncaixats:0, pts:4 },
        "Pau": { gols:0, assists:1, parades:4, jugadesBones:0, cagades:0, golsEncaixats:2, pts:6 },
        "Roi": { gols:0, assists:0, parades:0, jugadesBones:0, cagades:1, golsEncaixats:0, pts:-1 },
      },
      goals: [
        { time:"25:07", type:"favor", scorer:"Miro", assist:"Pau", details:"Golaaaas" },
        { time:"57:20", type:"favor", scorer:"Coro", assist:"Miro", details:"Don croqueta" },
        { time:"23:56", type:"contra", goalkeeper:"Medina", details:"Es pixan a Miro" },
        { time:"29:23", type:"contra", goalkeeper:"Medina", details:"Contra" },
        { time:"31:24", type:"contra", goalkeeper:"Medina", details:"Saque de banda" },
        { time:"40:24", type:"contra", goalkeeper:"Medina", details:"Gol al pal" },
        { time:"44:41", type:"contra", goalkeeper:"Medina", details:"De corner" },
        { time:"68:42", type:"contra", goalkeeper:"Pau", details:"Perd saque banda" },
        { time:"69:30", type:"contra", goalkeeper:"Pau", details:"Tothom dormit" },
      ],
      highlights: [
        { player:"Coro", time:"22:33", details:"Va borracho", videoUrl:"https://www.youtube.com/watch?v=h1mGEGwetcs&t=1350s" },
        { player:"Medina", time:"37:45", details:"Mare meva", videoUrl:"https://www.youtube.com/watch?v=h1mGEGwetcs&t=2262s" },
      ],
    },

    // ── Jornada 6 — Vodka Juniors ─────────────────
    {
      id: "j6-s1",
      jornada: "Jornada 6",
      opponent: "Vodka Juniors",
      date: "25 Nov 2025",
      result: "0 - 4",
      youtubeId: "PaUUke29GNs",
      mvpWinner: "Medina",
      playerStats: {
        "Aron": { gols:0, assists:0, parades:0, jugadesBones:5, cagades:0, golsEncaixats:0, pts:5 },
        "Coro": { gols:0, assists:0, parades:3, jugadesBones:9, cagades:2, golsEncaixats:1, pts:10 },
        "Lluc": { gols:0, assists:0, parades:0, jugadesBones:7, cagades:0, golsEncaixats:0, pts:7 },
        "Marc": { gols:0, assists:0, parades:0, jugadesBones:1, cagades:0, golsEncaixats:0, pts:1 },
        "Medina": { gols:0, assists:0, parades:4, jugadesBones:6, cagades:0, golsEncaixats:3, pts:10 },
        "Pau": { gols:0, assists:0, parades:2, jugadesBones:7, cagades:1, golsEncaixats:0, pts:8 },
        "Roi": { gols:0, assists:0, parades:0, jugadesBones:1, cagades:1, golsEncaixats:0, pts:0 },
      },
      goals: [
        { time:"3:18", type:"contra", goalkeeper:"Medina", details:"Corner mal defensat" },
        { time:"38:28", type:"contra", goalkeeper:"Coro", details:"Cordó surt tard" },
        { time:"45:54", type:"contra", goalkeeper:"Medina", details:"Fan falta" },
        { time:"50:02", type:"contra", goalkeeper:"Medina", details:"De Ramona" },
      ],
      highlights: [
      ],
    },

    // ── Jornada 7 — Fig Frames ─────────────────
    {
      id: "j7-s1",
      jornada: "Jornada 7",
      opponent: "Fig Frames",
      date: "02 Des 2025",
      result: "1 - 3",
      youtubeId: "ycmGQkTey-o",
      mvpWinner: "Marc",
      playerStats: {
        "Aron": { gols:0, assists:0, parades:0, jugadesBones:12, cagades:0, golsEncaixats:0, pts:12 },
        "Coro": { gols:0, assists:0, parades:2, jugadesBones:7, cagades:0, golsEncaixats:1, pts:9 },
        "Lluc": { gols:0, assists:0, parades:4, jugadesBones:4, cagades:0, golsEncaixats:1, pts:8 },
        "Marc": { gols:1, assists:0, parades:1, jugadesBones:9, cagades:1, golsEncaixats:0, pts:12 },
        "Medina": { gols:0, assists:0, parades:4, jugadesBones:5, cagades:0, golsEncaixats:0, pts:9 },
        "Pau": { gols:0, assists:0, parades:0, jugadesBones:2, cagades:1, golsEncaixats:1, pts:1 },
        "Roi": { gols:0, assists:0, parades:0, jugadesBones:1, cagades:0, golsEncaixats:0, pts:1 },
      },
      goals: [
        { time:"19:46", type:"favor", scorer:"Marc", assist:null, details:"Golàs" },
        { time:"35:07", type:"contra", goalkeeper:"Pau", details:"Molt malament" },
        { time:"43:53", type:"contra", goalkeeper:"Coro", details:"De fora l'àrea" },
        { time:"49:09", type:"contra", goalkeeper:"Lluc", details:"Convocació" },
      ],
      highlights: [
      ],
    },

    // ── Jornada 8 — Ràcing de Saberbeber ─────────────────
    {
      id: "j8-s1",
      jornada: "Jornada 8",
      opponent: "Ràcing de Saberbeber",
      date: "05 Des 2025",
      result: "5 - 9",
      youtubeId: null,
      mvpWinner: "Lluc",
      playerStats: {
        "Aron": { gols:2, assists:0, parades:8, jugadesBones:3, cagades:1, golsEncaixats:1, pts:16 },
        "Lluc": { gols:3, assists:0, parades:1, jugadesBones:8, cagades:1, golsEncaixats:1, pts:17 },
        "Marc": { gols:0, assists:1, parades:5, jugadesBones:7, cagades:0, golsEncaixats:1, pts:14 },
        "Pau": { gols:0, assists:1, parades:10, jugadesBones:4, cagades:0, golsEncaixats:5, pts:16 },
        "Roi": { gols:0, assists:1, parades:2, jugadesBones:1, cagades:0, golsEncaixats:1, pts:5 },
      },
      goals: [
        { time:"34:54", type:"favor", scorer:"Lluc", assist:"Marc", details:"De corner" },
        { time:"43:18", type:"favor", scorer:"Lluc", assist:null, details:"Pase de Guille" },
        { time:"49:56", type:"favor", scorer:"Lluc", assist:null, details:"El rival es dorm" },
        { time:"54:02", type:"favor", scorer:"Aron", assist:"Roi", details:"De porta a gol" },
        { time:"58:55", type:"favor", scorer:"Aron", assist:"Pau", details:"De saque de banda" },
        { time:"5:35", type:"contra", goalkeeper:"Pau", details:"" },
        { time:"11:46", type:"contra", goalkeeper:"Pau", details:"Cagada de Lluc" },
        { time:"29:32", type:"contra", goalkeeper:"Pau", details:"De canyete" },
        { time:"44:08", type:"contra", goalkeeper:"Pau", details:"" },
        { time:"47:21", type:"contra", goalkeeper:"Pau", details:"La perd Guille" },
        { time:"48:49", type:"contra", goalkeeper:"Aron", details:"Una contra" },
        { time:"49:26", type:"contra", goalkeeper:"Lluc", details:"Es ballen a Guille" },
        { time:"51:13", type:"contra", goalkeeper:"Roi", details:"Fan una paret" },
        { time:"60:55", type:"contra", goalkeeper:"Marc", details:"Res a dir" },
      ],
      highlights: [
        { player:"Roi", time:"48:48", details:"Fa un canyo", videoUrl:null },
      ],
    },

  ],
};