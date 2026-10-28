// ==========================================
// DATA SPLIT 3 · Futbol 7 · 26/27
// 1a Lliga Velòdrom F7 — lliga de 18 jornades, en juguem 16
// (descansem la J4 i la J13). Numeració oficial d'apuntamelo.com.
// ==========================================

import j1Polanco from './matches/j1-polanco.js';
import j2StarWarros from './matches/j2-star-warros.js';
import j3Manguito from './matches/j3-manguito.js';
import j5Inafumaybeben from './matches/j5-inafumaybeben.js';
import j6FcLucky from './matches/j6-fc-lucky.js';
import j7PozitoMurcia from './matches/j7-pozito-murcia.js';

export const DATABASE_S3 = {
  teamName: 'Real Tiesada',
  // Només el porter titular suma els gols a favor i en contra de quan és a porteria
  startingKeeper: 'Joan Ribes',

  nextMatch: null,

  leagueLabel: '1a Lliga Velòdrom F7',

  calendar: [
    { date: "2026-09-15T21:10:00", dateLabel: "15 Set · 21:10h", jornada: "Jornada 1",  opponent: "Polanco FC",      location: "Velòdrom F7", isHome: true  },
    { date: "2026-09-22T20:15:00", dateLabel: "22 Set · 20:15h", jornada: "Jornada 2",  opponent: "Star Warros FC",  location: "Velòdrom F7", isHome: false },
    { date: "2026-09-29T23:00:00", dateLabel: "29 Set · 23:00h", jornada: "Jornada 3",  opponent: "FC Manguito",     location: "Velòdrom F7", isHome: true  },
    { date: "2026-10-13T22:05:00", dateLabel: "13 Oct · 22:05h", jornada: "Jornada 5",  opponent: "Inafumaybeben",   location: "Velòdrom F7", isHome: false },
    { date: "2026-10-20T23:00:00", dateLabel: "20 Oct · 23:00h", jornada: "Jornada 6",  opponent: "FC Lucky",        location: "Velòdrom F7", isHome: true  },
    { date: "2026-10-27T20:15:00", dateLabel: "27 Oct · 20:15h", jornada: "Jornada 7",  opponent: "Pozito Murcia",   location: "Velòdrom F7", isHome: false },
    { date: "2026-11-03T22:05:00", dateLabel: "03 Nov · 22:05h", jornada: "Jornada 8",  opponent: "Josefas FC",      location: "Velòdrom F7", isHome: true  },
    { date: "2026-11-10T21:10:00", dateLabel: "10 Nov · 21:10h", jornada: "Jornada 9",  opponent: "Gola Seca FC",    location: "Velòdrom F7", isHome: false },
    { date: "2026-11-17T21:10:00", dateLabel: "17 Nov · 21:10h", jornada: "Jornada 10",  opponent: "Polanco FC",      location: "Velòdrom F7", isHome: true  },
    { date: "2026-11-24T20:15:00", dateLabel: "24 Nov · 20:15h", jornada: "Jornada 11", opponent: "Star Warros FC",  location: "Velòdrom F7", isHome: false },
    { date: "2026-12-01T22:05:00", dateLabel: "01 Des · 22:05h", jornada: "Jornada 12", opponent: "FC Manguito",     location: "Velòdrom F7", isHome: true  },
    { date: "2026-12-22T20:15:00", dateLabel: "22 Des · 20:15h", jornada: "Jornada 14", opponent: "Inafumaybeben",   location: "Velòdrom F7", isHome: false },
    { date: "2027-01-12T22:05:00", dateLabel: "12 Gen · 22:05h", jornada: "Jornada 15", opponent: "FC Lucky",        location: "Velòdrom F7", isHome: true  },
    { date: "2027-01-19T21:10:00", dateLabel: "19 Gen · 21:10h", jornada: "Jornada 16", opponent: "Pozito Murcia",   location: "Velòdrom F7", isHome: false },
    { date: "2027-01-26T23:00:00", dateLabel: "26 Gen · 23:00h", jornada: "Jornada 17", opponent: "Josefas FC",      location: "Velòdrom F7", isHome: true  },
    { date: "2027-02-02T23:00:00", dateLabel: "02 Feb · 23:00h", jornada: "Jornada 18", opponent: "Gola Seca FC",    location: "Velòdrom F7", isHome: false },
  ],

  // Actualitzada a la jornada 7 amb `npm run importar` (font: apuntamelo.com; la forma, els últims 5)
  classification: [
    { pos: 1, equipo: 'Inafumaybeben',   pj: 5, pg: 5, pe: 0, pp: 0, gf: 37, gc: 14, pts: 15,  forma: ['V','V','V','V','V'], esNosaltres: false },
    { pos: 2, equipo: 'Josefas FC',      pj: 5, pg: 4, pe: 1, pp: 0, gf: 37, gc: 19, pts: 13,  forma: ['V','V','V','E','V'], esNosaltres: false },
    { pos: 3, equipo: 'FC Manguito',     pj: 5, pg: 4, pe: 0, pp: 1, gf: 30, gc: 28, pts: 12,  forma: ['V','V','V','V','D'], esNosaltres: false },
    { pos: 4, equipo: 'Polanco FC',      pj: 5, pg: 3, pe: 0, pp: 2, gf: 31, gc: 28, pts: 9,   forma: ['V','D','V','D','V'], esNosaltres: false },
    { pos: 5, equipo: 'Star Warros FC',  pj: 6, pg: 2, pe: 1, pp: 3, gf: 29, gc: 35, pts: 7,   forma: ['V','D','D','E','V'], esNosaltres: false },
    { pos: 6, equipo: 'Pozito Murcia',   pj: 5, pg: 2, pe: 0, pp: 3, gf: 28, gc: 33, pts: 6,   forma: ['D','D','V','D','V'], esNosaltres: false },
    { pos: 7, equipo: 'Gola Seca FC',    pj: 5, pg: 2, pe: 0, pp: 3, gf: 26, gc: 42, pts: 6,   forma: ['D','V','V','D','D'], esNosaltres: false },
    { pos: 8, equipo: 'FC Lucky',        pj: 6, pg: 1, pe: 0, pp: 5, gf: 29, gc: 37, pts: 3,   forma: ['D','D','D','V','D'], esNosaltres: false },
    { pos: 9, equipo: 'Real Tiesada',    pj: 6, pg: 0, pe: 0, pp: 6, gf: 27, gc: 38, pts: 0,   forma: ['D','D','D','D','D'], esNosaltres: true  },
  ],

  roster: [
    { id: 'joan-ribes',    name: 'Joan Ribes',    number: 1,    position: 'Porter',      status: 'actiu', note: 'Fitxatge' },
    { id: 'coro',          name: 'Coro',          number: 2,    position: 'Defensa',     altPositions: ['Davanter'], status: 'actiu', note: 'Retorn del Split 1' },
    { id: 'lluc',          name: 'Lluc',          number: 7,    position: 'Defensa',     status: 'actiu', note: 'Retorn del Split 1' },
    { id: 'joan-medina',   name: 'Joan Medina',   number: 11,   position: 'Davanter',    status: 'actiu' },
    { id: 'pau-ibanez',    name: 'Pau Ibañez',    number: 10,   position: 'Migcampista', altPositions: ['Defensa'], status: 'actiu' },
    { id: 'paco-montero',  name: 'Paco Montero',  number: 22,   position: 'Defensa',     altPositions: ['Migcampista'], status: 'actiu' },
    { id: 'roger-miro',    name: 'Roger Miro',    number: 9,    position: 'Davanter',    altPositions: ['Defensa'], status: 'actiu' },
    { id: 'serginho',      name: 'Serginho',      number: 18,   position: 'Migcampista', altPositions: ['Davanter'], status: 'actiu', note: 'Fitxatge', apuntamelo: 'Sergi Marcelino' },
    { id: 'chengzhi-li',   name: 'Chengzhi Li',   number: 12,   position: 'Migcampista', altPositions: ['Davanter'], status: 'actiu' },
    { id: 'roi-seoane',    name: 'Roi Seoane',    number: 24,   position: 'Davanter',    status: 'actiu' },
    { id: 'arnau-sentis',  name: 'Arnau Sentis',  number: 8,    position: 'Migcampista', altPositions: ['Davanter'], status: 'actiu' },
    { id: 'marc-farreras', name: 'Marc Farreras', number: 77,   position: 'Defensa',     altPositions: ['Davanter'], status: 'actiu' },
    { id: 'oriol-tomas',   name: 'Oriol Tomas',   number: 21,   position: 'Davanter',    status: 'lesionat', note: 'Lesió' },
    { id: 'andreu-cases',  name: 'Andreu Cases',  number: 80,   position: 'Migcampista', status: 'baixa', note: 'Decisió pròpia' },
    { id: 'ivan-mico',     name: 'Ivan Mico',     number: 4,    position: 'Davanter',    altPositions: ['Defensa'], status: 'actiu' },
  ],

  matches: [j1Polanco, j2StarWarros, j3Manguito, j5Inafumaybeben, j6FcLucky, j7PozitoMurcia],
};
