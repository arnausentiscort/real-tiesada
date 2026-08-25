import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { DATABASE_S1 } from '../src/data_s1.js';
import { DATABASE_S2 } from '../src/data.js';
import { calcGlobalStats, calcMatchStats, calcGoalkeeperStints } from '../src/utils.js';
import { FORMATS } from '../src/formats.js';

const outArg = process.argv[2] || 'tmp/snapshot-before.json';
const outPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', outArg);
mkdirSync(path.dirname(outPath), { recursive: true });

// Els Splits 1 i 2 sempre s'han calculat en format futsal — fixem-ho
// explícitament perquè el snapshot no depengui del valor per defecte.
//
// NOTA: els partits del Split 1 no tenen `events` (goals/substitutions
// hi són a nivell arrel, sense coordenades) — és una forma de dades
// diferent de la del Split 2, pensada perquè Split1Dashboard.jsx llegís
// `playerStats` ja agregat. calcGlobalStats/calcMatchStats/
// calcGoalkeeperStints dins de utils.js esperen `match.events.*` i
// per tant peten sobre dades del Split 1. Ho capturem en lloc
// d'ignorar-ho perquè quedi documentat al propi snapshot.
const tryCalc = (fn, ...args) => {
  try { return { ok: true, value: fn(...args) }; }
  catch (err) { return { ok: false, error: err.message }; }
};

const snapshotSeason = (database) => ({
  globalStats: tryCalc(calcGlobalStats, database, FORMATS.fs5),
  matches: database.matches.map(match => ({
    id: match.id,
    matchStats: tryCalc(calcMatchStats, match, FORMATS.fs5),
    goalkeeperStints: tryCalc(calcGoalkeeperStints, match, FORMATS.fs5),
  })),
  goals: database.matches.flatMap(match =>
    (match.events?.goals || match.goals || []).map(g => ({
      matchId: match.id,
      time: g.time,
      type: g.type,
      shotPos: g.shotPos ?? null,
      goalPos: g.goalPos ?? null,
      assistPos: g.assistPos ?? null,
      conductPos: g.conductPos ?? null,
    }))
  ),
});

const snapshot = {
  s1: snapshotSeason(DATABASE_S1),
  s2: snapshotSeason(DATABASE_S2),
};

writeFileSync(outPath, JSON.stringify(snapshot, null, 2) + '\n');

console.log(`Snapshot escrit a ${outPath}`);
