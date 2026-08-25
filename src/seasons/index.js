import { DATABASE_S1 } from '../data_s1.js';
import { DATABASE_S2 } from '../data.js';
import { DATABASE_S3 } from './s3/index.js';

export const SEASONS = [
  { id: 's1', label: 'Split 1', period: '24/25', format: 'fs5', db: DATABASE_S1, legacy: true },
  { id: 's2', label: 'Split 2', period: '25/26', format: 'fs5', db: DATABASE_S2 },
  { id: 's3', label: 'Split 3', period: '26/27', format: 'f7',  db: DATABASE_S3 },
];

export const CURRENT_SEASON_ID = 's2';
export const getSeason = (id) => SEASONS.find(s => s.id === id);
