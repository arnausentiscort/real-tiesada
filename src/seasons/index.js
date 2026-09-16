import { DATABASE_S1 } from '../data_s1.js';
import { DATABASE_S2 } from '../data.js';
import { DATABASE_S3 } from './s3/index.js';

export const SEASONS = [
  { id: 's1', label: 'Split 1', period: '24/25', format: 'fs5', db: DATABASE_S1, legacy: true },
  { id: 's2', label: 'Split 2', period: '25/26', format: 'fs5', db: DATABASE_S2 },
  { id: 's3', label: 'Split 3', period: '26/27', format: 'f7',  db: DATABASE_S3 },
];

export const CURRENT_SEASON_ID = 's3';
export const getSeason = (id) => SEASONS.find(s => s.id === id);

// Busca un partit pel seu id a totes les temporades — ho fa servir el
// routing per hash (#/partit/<id>) per poder enllaçar un partit concret
// sense saber de quina temporada és.
export const findMatchById = (id) => {
  if (!id) return null;
  for (const s of SEASONS) {
    const match = s.db?.matches?.find(m => m.id === id);
    if (match) return { seasonId: s.id, match };
  }
  return null;
};
