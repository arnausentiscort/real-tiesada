export const FORMATS = {
  fs5: {
    id: 'fs5',
    label: 'Futbol sala',
    playersOnPitch: 5,      // inclou porter
    fieldPlayers: 4,        // jugadors de camp
    totalMinutes: 40,
    periods: 2,
    pitch: { viewBox: '0 0 800 420', w: 800, h: 420, goalX: 782, goalY: 210 },
    goal:  { viewBox: '-18 -18 336 230', w: 300, h: 200 },
    hasOffside: false,
    hasAccumulatedFouls: true,
    positions: ['Porter', 'Tancament', 'Ala', 'Pivot'],
  },
  f7: {
    id: 'f7',
    label: 'Futbol 7',
    playersOnPitch: 7,
    fieldPlayers: 6,
    totalMinutes: 50, // TODO: confirmar amb el reglament de la lliga
    periods: 2,
    pitch: { viewBox: '0 0 800 550', w: 800, h: 550, goalX: 782, goalY: 275 },
    goal:  { viewBox: '-18 -18 636 230', w: 600, h: 200 },
    hasOffside: true,
    hasAccumulatedFouls: false,
    positions: ['Porter', 'Central', 'Carriler', 'Migcampista', 'Davanter'],
  },
};

export const getFormat = (id) => FORMATS[id] || FORMATS.fs5;

// Un partit amistós de format diferent dins d'una temporada pot sobreescriure'l
export const getMatchFormat = (match, season) => getFormat(match?.format ?? season?.format);
