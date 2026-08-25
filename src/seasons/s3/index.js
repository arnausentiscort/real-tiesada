// ==========================================
// DATA SPLIT 3 · Futbol 7 · 26/27
// Encara sense partits — plantilla amb estat
// ==========================================

export const DATABASE_S3 = {
  teamName: 'Real Tiesada',

  nextMatch: null,
  calendar: [],
  classification: [],

  roster: [
    { id: 'arnau-sentis',  name: 'Arnau Sentis',  number: 8,    position: 'Migcampista', status: 'actiu' },
    { id: 'roger-miro',    name: 'Roger Miro',    number: 9,    position: 'Davanter',    status: 'actiu' },
    { id: 'joan-medina',   name: 'Joan Medina',   number: 11,   position: 'Migcampista', status: 'actiu' },
    { id: 'pau-ibanez',    name: 'Pau Ibañez',    number: 10,   position: 'Defensa',     status: 'actiu' },
    { id: 'roi-seoane',    name: 'Roi Seoane',    number: 24,   position: 'Davanter',    status: 'actiu' },
    { id: 'oriol-tomas',   name: 'Oriol Tomas',   number: 21,   position: 'Davanter',    status: 'lesionat', note: 'Lesió' },
    { id: 'paco-montero',  name: 'Paco Montero',  number: 22,   position: 'Defensa',     status: 'actiu' },
    { id: 'andreu-cases',  name: 'Andreu Cases',  number: 80,   position: 'Migcampista', status: 'baixa', note: 'Decisió pròpia' },
    { id: 'chengzhi-li',   name: 'Chengzhi Li',   number: 12,   position: 'Migcampista', status: 'actiu' },
    { id: 'ivan-mico',     name: 'Ivan Mico',     number: 4,    position: 'Porter',      status: 'actiu' },
    { id: 'marc-farreras', name: 'Marc Farreras', number: 77,   position: 'Davanter',    status: 'actiu' },
    { id: 'joan-ribes',    name: 'Joan Ribes',    number: null, position: 'Porter',      status: 'actiu', note: 'Fitxatge' },
    { id: 'serginho',      name: 'Serginho',      number: null, position: 'Davanter',    status: 'actiu', note: 'Fitxatge' },
    { id: 'coro',          name: 'Coro',          number: null, position: 'Davanter',    status: 'actiu', note: 'Retorn del Split 1' },
    { id: 'lluc',          name: 'Lluc',          number: null, position: 'Davanter',    status: 'actiu', note: 'Retorn del Split 1' },
  ],

  matches: [],
};
