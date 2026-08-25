import React, { createContext, useContext, useMemo } from 'react';
import { SEASONS, getSeason } from './seasons/index.js';
import { getFormat } from './formats.js';
import { resolveRoster } from './players.js';

const EMPTY_DB = { teamName: '', roster: [], matches: [] };

const SeasonContext = createContext(null);

export function SeasonProvider({ seasonId, children }) {
  const value = useMemo(() => {
    const season = getSeason(seasonId) ?? SEASONS[0];
    const rawDb  = season.db ?? EMPTY_DB;
    const db     = { ...rawDb, roster: resolveRoster(rawDb) };
    const format = getFormat(season.format);
    return { season, db, format };
  }, [seasonId]);

  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>;
}

export function useSeason() {
  const ctx = useContext(SeasonContext);
  if (!ctx) throw new Error('useSeason must be used within a SeasonProvider');
  return ctx;
}
