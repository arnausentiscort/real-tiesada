// ================================================
// DATA SPLIT 1 · Futsal 24/25
// Stats de l'Excel Punts_mvp.xlsx (8 partits)
// ================================================

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
    // ── Jornada 1 — Real Magic Balompié ──────────────────────
    {
      id: "j1-s1",
      jornada: "Jornada 1",
      opponent: "Real Magic Balompié",
      date: "07 Oct 2025",
      result: "3 - 8",
      youtubeId: "78vD3yEYWdY",
      youtubeUrl: "https://www.youtube.com/watch?v=78vD3yEYWdY&t=1040s",
      mvpWinner: "Pau",
      playerStats: {
        "Aron": { gols:0, assists:0, jugadesBones:7, cagades:1, golsEncaixats:0, parades:0, pts:6.5 },
        "Coro": { gols:0, assists:1, jugadesBones:2, cagades:1, golsEncaixats:1, parades:0, pts:4.25 },
        "Lluc": { gols:0, assists:0, jugadesBones:7, cagades:2, golsEncaixats:3, parades:3, pts:4.5 },
        "Marc": { gols:0, assists:0, jugadesBones:3, cagades:2, golsEncaixats:0, parades:0, pts:1.5 },
        "Medina": { gols:1, assists:0, jugadesBones:1, cagades:4, golsEncaixats:4, parades:9, pts:5.25 },
        "Oriol": { gols:1, assists:0, jugadesBones:3, cagades:0, golsEncaixats:0, parades:0, pts:10.0 },
        "Pau": { gols:1, assists:1, jugadesBones:2, cagades:1, golsEncaixats:1, parades:1, pts:12.0 },
        "Roi": { gols:0, assists:0, jugadesBones:0, cagades:2, golsEncaixats:0, parades:0, pts:-4.0 },
        "Sentis": { gols:0, assists:0, jugadesBones:4, cagades:1, golsEncaixats:0, parades:0, pts:4.5 },
      },
      goals: [],
      highlights: [],
    },

    // ── Jornada 2 — Aston Birra ──────────────────────
    {
      id: "j2-s1",
      jornada: "Jornada 2",
      opponent: "Aston Birra",
      date: "21 Oct 2025",
      result: "2 - 11",
      youtubeId: "HM-4WBRTxrI",
      youtubeUrl: "https://www.youtube.com/watch?v=HM-4WBRTxrI",
      mvpWinner: "Marc",
      playerStats: {
        "Aron": { gols:0, assists:1, jugadesBones:5, cagades:2, golsEncaixats:0, parades:0, pts:5.5 },
        "Coro": { gols:1, assists:0, jugadesBones:4, cagades:0, golsEncaixats:3, parades:2, pts:7.25 },
        "Lluc": { gols:0, assists:0, jugadesBones:4, cagades:0, golsEncaixats:0, parades:0, pts:5.5 },
        "Marc": { gols:1, assists:0, jugadesBones:5, cagades:0, golsEncaixats:0, parades:0, pts:8.5 },
        "Medina": { gols:0, assists:0, jugadesBones:2, cagades:3, golsEncaixats:5, parades:7, pts:-1.0 },
        "Pau": { gols:0, assists:0, jugadesBones:1, cagades:1, golsEncaixats:2, parades:6, pts:-1.0 },
        "Roi": { gols:0, assists:0, jugadesBones:0, cagades:1, golsEncaixats:1, parades:0, pts:-2.75 },
        "Sentis": { gols:0, assists:1, jugadesBones:7, cagades:0, golsEncaixats:0, parades:0, pts:8.5 },
      },
      goals: [],
      highlights: [],
    },

    // ── Jornada 3 — Inafuman y Beben ──────────────────────
    {
      id: "j3-s1",
      jornada: "Jornada 3",
      opponent: "Inafuman y Beben",
      date: "31 Oct 2025",
      result: "3 - 7",
      youtubeId: "h1mGEGwetcs",
      youtubeUrl: "https://www.youtube.com/watch?v=h1mGEGwetcs&t=1499s",
      mvpWinner: "Coro",
      playerStats: {
        "Coro": { gols:1, assists:0, jugadesBones:4, cagades:0, golsEncaixats:0, parades:0, pts:12.0 },
        "Lluc": { gols:0, assists:0, jugadesBones:1, cagades:2, golsEncaixats:0, parades:0, pts:0.0 },
        "Marc": { gols:0, assists:0, jugadesBones:6, cagades:1, golsEncaixats:0, parades:0, pts:7.0 },
        "Medina": { gols:0, assists:0, jugadesBones:1, cagades:0, golsEncaixats:5, parades:8, pts:1.25 },
        "Miro": { gols:1, assists:1, jugadesBones:1, cagades:2, golsEncaixats:0, parades:0, pts:11.0 },
        "Oriol": { gols:0, assists:0, jugadesBones:0, cagades:1, golsEncaixats:0, parades:0, pts:-2.5 },
        "Pau": { gols:0, assists:1, jugadesBones:0, cagades:0, golsEncaixats:2, parades:4, pts:7.5 },
        "Roi": { gols:1, assists:0, jugadesBones:0, cagades:1, golsEncaixats:0, parades:0, pts:5.5 },
        "Sentis": { gols:0, assists:0, jugadesBones:0, cagades:0, golsEncaixats:0, parades:0, pts:-1.0 },
      },
      goals: [],
      highlights: [],
    },

    // ── Jornada 4 — Pink Devils ──────────────────────
    {
      id: "j4-s1",
      jornada: "Jornada 4",
      opponent: "Pink Devils",
      date: "07 Nov 2025",
      result: "3 - 9",
      youtubeId: "yDPweVzp1uM",
      youtubeUrl: "https://www.youtube.com/watch?v=yDPweVzp1uM&t=544s",
      mvpWinner: "Coro",
      playerStats: {
        "Coro": { gols:1, assists:0, jugadesBones:4, cagades:0, golsEncaixats:0, parades:0, pts:11.5 },
        "Marc": { gols:0, assists:0, jugadesBones:4, cagades:1, golsEncaixats:0, parades:0, pts:1.5 },
        "Medina": { gols:0, assists:1, jugadesBones:1, cagades:1, golsEncaixats:5, parades:4, pts:2.75 },
        "Miro": { gols:0, assists:1, jugadesBones:4, cagades:0, golsEncaixats:0, parades:0, pts:7.0 },
        "Oriol": { gols:1, assists:0, jugadesBones:0, cagades:2, golsEncaixats:0, parades:0, pts:6.0 },
        "Pau": { gols:1, assists:0, jugadesBones:3, cagades:1, golsEncaixats:4, parades:11, pts:10.75 },
        "Roi": { gols:0, assists:0, jugadesBones:0, cagades:1, golsEncaixats:0, parades:0, pts:0.5 },
      },
      goals: [],
      highlights: [],
    },

    // ── Jornada 5 — Birra Real ──────────────────────
    {
      id: "j5-s1",
      jornada: "Jornada 5",
      opponent: "Birra Real",
      date: "14 Nov 2025",
      result: "2 - 10",
      youtubeId: "acOoSv5FZPs",
      youtubeUrl: "https://www.youtube.com/watch?v=acOoSv5FZPs",
      mvpWinner: "Coro",
      playerStats: {
        "Aron": { gols:0, assists:0, jugadesBones:2, cagades:0, golsEncaixats:0, parades:0, pts:0.0 },
        "Coro": { gols:2, assists:0, jugadesBones:7, cagades:0, golsEncaixats:1, parades:9, pts:19.5 },
        "Marc": { gols:0, assists:0, jugadesBones:7, cagades:1, golsEncaixats:2, parades:2, pts:3.5 },
        "Medina": { gols:0, assists:0, jugadesBones:2, cagades:1, golsEncaixats:3, parades:5, pts:2.5 },
        "Oriol": { gols:0, assists:1, jugadesBones:2, cagades:2, golsEncaixats:0, parades:0, pts:2.5 },
        "Pau": { gols:0, assists:0, jugadesBones:3, cagades:1, golsEncaixats:4, parades:1, pts:-1.25 },
        "Roi": { gols:0, assists:0, jugadesBones:1, cagades:1, golsEncaixats:0, parades:0, pts:1.0 },
      },
      goals: [],
      highlights: [],
    },

    // ── Jornada 6 — Vodka Juniors ──────────────────────
    {
      id: "j6-s1",
      jornada: "Jornada 6",
      opponent: "Vodka Juniors",
      date: "25 Nov 2025",
      result: "0 - 4",
      youtubeId: "PaUUke29GNs",
      youtubeUrl: "https://www.youtube.com/watch?v=PaUUke29GNs&t=1516s",
      mvpWinner: "Lluc",
      playerStats: {
        "Aron": { gols:0, assists:0, jugadesBones:5, cagades:0, golsEncaixats:0, parades:0, pts:3.5 },
        "Coro": { gols:0, assists:0, jugadesBones:9, cagades:3, golsEncaixats:1, parades:3, pts:5.0 },
        "Lluc": { gols:0, assists:0, jugadesBones:7, cagades:0, golsEncaixats:0, parades:0, pts:5.5 },
        "Marc": { gols:0, assists:0, jugadesBones:1, cagades:0, golsEncaixats:0, parades:0, pts:0.0 },
        "Medina": { gols:0, assists:0, jugadesBones:7, cagades:0, golsEncaixats:3, parades:4, pts:5.25 },
        "Pau": { gols:0, assists:0, jugadesBones:7, cagades:1, golsEncaixats:0, parades:2, pts:5.5 },
        "Roi": { gols:0, assists:0, jugadesBones:1, cagades:1, golsEncaixats:0, parades:0, pts:0.0 },
      },
      goals: [],
      highlights: [],
    },

    // ── Jornada 7 — Fig Frames ──────────────────────
    {
      id: "j7-s1",
      jornada: "Jornada 7",
      opponent: "Fig Frames",
      date: "02 Des 2025",
      result: "1 - 3",
      youtubeId: "ycmGQkTey-o",
      youtubeUrl: "https://www.youtube.com/watch?v=ycmGQkTey-o&t=1193s",
      mvpWinner: "Marc",
      playerStats: {
        "Aron": { gols:0, assists:0, jugadesBones:12, cagades:0, golsEncaixats:0, parades:0, pts:13.0 },
        "Coro": { gols:0, assists:0, jugadesBones:7, cagades:0, golsEncaixats:1, parades:2, pts:8.25 },
        "Lluc": { gols:0, assists:0, jugadesBones:4, cagades:0, golsEncaixats:1, parades:4, pts:3.25 },
        "Marc": { gols:1, assists:0, jugadesBones:9, cagades:1, golsEncaixats:0, parades:1, pts:14.25 },
        "Medina": { gols:0, assists:0, jugadesBones:6, cagades:0, golsEncaixats:0, parades:4, pts:8.5 },
        "Pau": { gols:0, assists:0, jugadesBones:2, cagades:1, golsEncaixats:1, parades:0, pts:1.25 },
        "Roi": { gols:0, assists:0, jugadesBones:1, cagades:0, golsEncaixats:0, parades:0, pts:0.5 },
      },
      goals: [],
      highlights: [],
    },

    // ── Jornada 8 — Ràcing de Saberbeber ──────────────────────
    {
      id: "j8-s1",
      jornada: "Jornada 8",
      opponent: "Ràcing de Saberbeber",
      date: "05 Des 2025",
      result: "5 - 9",
      youtubeId: "WlUoJdl_JQE",
      youtubeUrl: "https://www.youtube.com/watch?v=WlUoJdl_JQE&t=339s",
      mvpWinner: "Lluc",
      playerStats: {
        "Aron": { gols:2, assists:0, jugadesBones:3, cagades:1, golsEncaixats:1, parades:8, pts:19.75 },
        "Lluc": { gols:3, assists:0, jugadesBones:8, cagades:1, golsEncaixats:1, parades:1, pts:28.0 },
        "Marc": { gols:0, assists:1, jugadesBones:7, cagades:0, golsEncaixats:1, parades:5, pts:17.5 },
        "Oriol": { gols:0, assists:0, jugadesBones:0, cagades:0, golsEncaixats:0, parades:0, pts:-0.5 },
        "Pau": { gols:0, assists:1, jugadesBones:4, cagades:0, golsEncaixats:5, parades:10, pts:10.25 },
        "Roi": { gols:0, assists:1, jugadesBones:1, cagades:0, golsEncaixats:1, parades:2, pts:7.25 },
      },
      goals: [],
      highlights: [],
    },

  ],
};