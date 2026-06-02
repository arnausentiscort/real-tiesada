// ==========================================
// BASE DE DADES ESTÀTICA — Real Tiesada FC
// ==========================================
// Cada partit viu al seu propi fitxer: src/matches/jN-rival.js

import j1Vikings      from './matches/j1-vikings.js';
import j2Ensaimada    from './matches/j2-ensaimada.js';
import j3Uruks        from './matches/j3-uruks.js';
import j4Touchlas     from './matches/j4-touchlas.js';
import j5Dgeneracion  from './matches/j5-dgeneracion.js';
import j6FabbasFC     from './matches/j6-fabbas-fc.js';
import j7GreatSpirit  from './matches/j7-great-spirit.js';
import j8Vietkong     from './matches/j8-vietkong.js';
import j9Vikings      from './matches/j9-vikings.js';
import j10Ensaimada  from './matches/j10-ensaimada.js';
import j11Uruks      from './matches/j11-uruks.js';
import j12Touchlas   from './matches/j12-touchlas.js';

export const DATABASE = {
  teamName: "Real Tiesada",

  // Proper partit (actualitza cada setmana)
  nextMatch: {
    opponent: "Dgeneración X",
    date: "2026-06-08T21:45:00",
    dateLabel: "08 Jun 2026 · 21:45h",
    location: "St. Ignasi Sala 1",
    jornada: "Jornada 13",
    isHome: true,
  },

  // Calendari complet de la temporada
  calendar: [
    { date: "2026-03-23T23:15:00", dateLabel: "23 Mar · 23:15h", jornada: "Jornada 5",  opponent: "Dgeneración X", location: "St. Ignasi Sala 2", isHome: true  },
    { date: "2026-03-30T22:30:00", dateLabel: "30 Mar · 22:30h", jornada: "Jornada 6",  opponent: "Fabbas FC",     location: "St. Ignasi Sala 2", isHome: false },
    { date: "2026-04-13T21:45:00", dateLabel: "13 Abr · 21:45h", jornada: "Jornada 7",  opponent: "Great Spirit",  location: "St. Ignasi Sala 2", isHome: true  },
    { date: "2026-04-27T21:45:00", dateLabel: "27 Abr · 21:45h", jornada: "Jornada 8",  opponent: "Vietkong",      location: "St. Ignasi Sala 2", isHome: false },
    { date: "2026-05-04T22:30:00", dateLabel: "04 Mai · 22:30h", jornada: "Jornada 9",  opponent: "Vikings",       location: "St. Ignasi Sala 2", isHome: true  },
    { date: "2026-05-11T21:00:00", dateLabel: "11 Mai · 21:00h", jornada: "Jornada 10", opponent: "Ensaimada",     location: "St. Ignasi Sala 1", isHome: false },
    { date: "2026-05-18T22:30:00", dateLabel: "18 Mai · 22:30h", jornada: "Jornada 11", opponent: "Uruks",         location: "St. Ignasi Sala 2", isHome: true  },
    { date: "2026-06-01T21:00:00", dateLabel: "01 Jun · 21:00h", jornada: "Jornada 12", opponent: "Touchlas FC",   location: "St. Ignasi Sala 1", isHome: false },
    { date: "2026-06-08T21:45:00", dateLabel: "08 Jun · 21:45h", jornada: "Jornada 13", opponent: "Dgeneración X", location: "St. Ignasi Sala 1", isHome: true  },
    { date: "2026-06-14T21:00:00", dateLabel: "14 Jun · 21:00h", jornada: "Jornada 14", opponent: "Fabbas FC",     location: "St. Ignasi Sala 1", isHome: false },
    { date: "2026-06-22T23:15:00", dateLabel: "22 Jun · 23:15h", jornada: "Jornada 15", opponent: "Great Spirit",  location: "St. Ignasi Sala 1", isHome: true  },
    { date: "2026-07-06T21:45:00", dateLabel: "06 Jul · 21:45h", jornada: "Jornada 16", opponent: "Vietkong",      location: "St. Ignasi Sala 1", isHome: false },
  ],

  // Plantilla amb foto, dorsal i posició
  roster: [
    { name: "Arnau Sentis",  number: 8,  shirtName: "SENTIS",      position: "Migcampista", photo: "players/arnau.png",   photoCel: "players/arnau_cel.png" },
    { name: "Roger Miro",    number: 9,  shirtName: "MIRÓ",        position: "Davanter",    photo: "players/roger.png",   photoCel: "players/roger_cel.png" },
    { name: "Joan Medina",   number: 11, shirtName: "MEDINA",      position: "Migcampista", photo: null,                  photoCel: null },
    { name: "Pau Ibañez",    number: 10, shirtName: "IBÁÑEZ",      position: "Defensa",     photo: "players/pau.png",    photoCel: "players/pau_cel.png" },
    { name: "Roi Seoane",    number: 24, shirtName: "ROI",         position: "Davanter",    photo: null,                  photoCel: null },
    { name: "Oriol Tomas",   number: 21, shirtName: "ORIOL TOMAS", position: "Davanter",    photo: "players/oriol.png",   photoCel: "players/oriol_cel.png" },
    { name: "Paco Montero",  number: 22, shirtName: "GABARRI",     position: "Defensa",     photo: "players/paco.png",    photoCel: "players/paco_cel.png" },
    { name: "Andreu Cases",  number: 80, shirtName: "TELICO",      position: "Migcampista", photo: "players/andreu.png",  photoCel: "players/andreu_cel.png" },
    { name: "Chengzhi Li",   number: 12, shirtName: "CHENGZHI LI", position: "Migcampista", photo: "players/chenghy.png", photoCel: "players/chengzhi_cel.png" },
    { name: "Ivan Mico",     number: 4,  shirtName: "QUATRE",      position: "Porter",      photo: null,                  photoCel: null },
    { name: "Marc Farreras", number: 77, shirtName: "FARRERAS",    position: "Davanter",    photo: "players/marc.png",    photoCel: "players/marc_cel.png" },
  ],

  matches: [
    j1Vikings, j2Ensaimada, j3Uruks, j4Touchlas, j5Dgeneracion,
    j6FabbasFC, j7GreatSpirit, j8Vietkong, j9Vikings, j10Ensaimada, j11Uruks, j12Touchlas,
  ],
};

// Helper: retorna l'objecte jugador pel nom
export const getPlayer = (name) =>
  DATABASE.roster.find(p => p.name === name) || { name, number: null, position: null, photo: null, photoCel: null };
