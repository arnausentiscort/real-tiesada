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
import j13Dgeneracion from './matches/j13-dgeneracion.js';
import j14FabbasFC    from './matches/j14-fabbas-fc.js';
import j15GreatSpirit from './matches/j15-great-spirit.js';
import j16Vietkong   from './matches/j16-vietkong.js';
import { resolveRoster } from './players.js';

const ROSTER_S2 = [
  { id: "arnau-sentis",  name: "Arnau Sentis",  number: 8,  shirtName: "SENTIS",      position: "Migcampista" },
  { id: "roger-miro",    name: "Roger Miro",    number: 9,  shirtName: "MIRÓ",        position: "Davanter" },
  { id: "joan-medina",   name: "Joan Medina",   number: 11, shirtName: "MEDINA",      position: "Migcampista" },
  { id: "pau-ibanez",    name: "Pau Ibañez",    number: 10, shirtName: "IBÁÑEZ",      position: "Defensa" },
  { id: "roi-seoane",    name: "Roi Seoane",    number: 24, shirtName: "ROI",         position: "Davanter" },
  { id: "oriol-tomas",   name: "Oriol Tomas",   number: 21, shirtName: "ORIOL TOMAS", position: "Davanter" },
  { id: "paco-montero",  name: "Paco Montero",  number: 22, shirtName: "GABARRI",     position: "Defensa" },
  { id: "andreu-cases",  name: "Andreu Cases",  number: 80, shirtName: "TELICO",      position: "Migcampista" },
  { id: "chengzhi-li",   name: "Chengzhi Li",   number: 12, shirtName: "CHENGZHI LI", position: "Migcampista" },
  { id: "ivan-mico",     name: "Ivan Mico",     number: 4,  shirtName: "QUATRE",      position: "Porter" },
  { id: "marc-farreras", name: "Marc Farreras", number: 77, shirtName: "FARRERAS",    position: "Davanter" },
];

export const DATABASE_S2 = {
  teamName: "Real Tiesada",

  // Fi de temporada 25/26 — Split 2 finalitzat
  nextMatch: null,

  leagueLabel: "Dilluns 2a Lliga 25-26",
  classificationUrl: "https://apuntamelo.com/clasificacion-grupo/9/14/0/642/0/3354/2",
  classification: [
    { pos: 1, equipo: 'Ensaimada',    pj:16, pg:13, pe:0, pp:3,  gf:79, gc:32, pts:39, forma: ['V','V','V','V','V'], esNosaltres: false },
    { pos: 2, equipo: 'Uruks',        pj:16, pg:12, pe:3, pp:1,  gf:62, gc:40, pts:39, forma: ['V','E','V','V','V'], esNosaltres: false },
    { pos: 3, equipo: 'Touchlas FC',  pj:16, pg:9,  pe:3, pp:4,  gf:61, gc:44, pts:30, forma: ['V','V','V','V','E'], esNosaltres: false },
    { pos: 4, equipo: 'Vietkong',     pj:16, pg:9,  pe:0, pp:7,  gf:59, gc:41, pts:27, forma: ['V','V','V','D','V'], esNosaltres: false },
    { pos: 5, equipo: 'Dgeneracion',  pj:16, pg:8,  pe:1, pp:7,  gf:55, gc:51, pts:25, forma: ['V','V','D','V','D'], esNosaltres: false },
    { pos: 6, equipo: 'Vikings',      pj:16, pg:7,  pe:3, pp:6,  gf:51, gc:51, pts:24, forma: ['V','D','D','V','D'], esNosaltres: false },
    { pos: 7, equipo: 'Real Tiesada', pj:16, pg:3,  pe:1, pp:12, gf:40, gc:71, pts:10, forma: ['V','V','V','D','D'], esNosaltres: true  },
    { pos: 8, equipo: 'Great Spirit', pj:16, pg:3,  pe:0, pp:13, gf:25, gc:56, pts:9,  forma: ['V','D','D','D','D'], esNosaltres: false },
    { pos: 9, equipo: 'Fabbas FC',    pj:16, pg:2,  pe:1, pp:13, gf:37, gc:83, pts:7,  forma: ['D','D','D','D','D'], esNosaltres: false },
  ],

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

  // Plantilla — dorsal i posició; shirtName/photo/photoCel venen del registre global (players.js)
  roster: resolveRoster({ roster: ROSTER_S2 }),

  matches: [
    j1Vikings, j2Ensaimada, j3Uruks, j4Touchlas, j5Dgeneracion,
    j6FabbasFC, j7GreatSpirit, j8Vietkong, j9Vikings, j10Ensaimada, j11Uruks, j12Touchlas, j13Dgeneracion, j14FabbasFC, j15GreatSpirit, j16Vietkong,
  ],
};

// Àlies temporal fins la Fase 6 — mantenen vius els ~15 imports existents
export const DATABASE = DATABASE_S2;

// Helper: retorna l'objecte jugador pel nom
export const getPlayer = (name) =>
  DATABASE.roster.find(p => p.name === name) || { name, number: null, position: null, photo: null, photoCel: null };
