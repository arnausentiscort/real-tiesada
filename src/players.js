// ==========================================
// REGISTRE GLOBAL DE JUGADORS
// ==========================================
// Una persona, una entrada — independentment de com es digui
// al roster de cada temporada. No inclou `name`: cada roster de
// temporada manté el seu propi name (la clau literal que apareix
// als partits d'aquella temporada).

export const PLAYERS = {
  // ── Plantilla actual (Split 2, continuen al Split 3) ──────────
  'arnau-sentis':  { shirtName: 'SENTIS',      photo: 'players/arnau.png',   photoCel: 'players/arnau_cel.png' },
  'roger-miro':    { shirtName: 'MIRÓ',        photo: 'players/roger.png',   photoCel: 'players/roger_cel.png' },
  'joan-medina':   { shirtName: 'MEDINA',      photo: null,                  photoCel: null },
  'pau-ibanez':    { shirtName: 'IBÁÑEZ',      photo: 'players/pau.png',     photoCel: 'players/pau_cel.png' },
  'roi-seoane':    { shirtName: 'ROI',         photo: null,                  photoCel: null },
  'oriol-tomas':   { shirtName: 'ORIOL TOMAS', photo: 'players/oriol.png',   photoCel: 'players/oriol_cel.png' },
  'paco-montero':  { shirtName: 'GABARRI',     photo: 'players/paco.png',    photoCel: 'players/paco_cel.png' },
  'andreu-cases':  { shirtName: 'TELICO',      photo: 'players/andreu.png',  photoCel: 'players/andreu_cel.png' },
  'chengzhi-li':   { shirtName: 'CHENGZHI LI', photo: 'players/chenghy.png', photoCel: 'players/chengzhi_cel.png' },
  'ivan-mico':     { shirtName: 'QUATRE',      photo: null,                  photoCel: null },
  'marc-farreras': { shirtName: 'FARRERAS',    photo: 'players/marc.png',    photoCel: 'players/marc_cel.png' },

  // ── Només Split 1 (24/25) ──────────────────────────────────────
  'aron':          { shirtName: 'ARON',        photo: null, photoCel: null },
  'coro':          { shirtName: 'CORO',        photo: null, photoCel: null },
  'lluc':          { shirtName: 'LLUC',        photo: null, photoCel: null },

  // ── Fitxatges Split 3 (26/27) ───────────────────────────────────
  'joan-ribes':    { shirtName: 'RIBES',       photo: null, photoCel: null },
  'serginho':      { shirtName: 'SERGINHO',    photo: null, photoCel: null },
};

// Fusiona un roster de temporada amb el registre global.
// `name`, `number`, `shirtName`, `status`, `note` venen sempre de
// l'entrada de temporada — shirtName cau al registre global (PLAYERS)
// només quan l'entrada no en porta (p. ex. un fitxatge nou sense
// dorsal encara decidit). `photo`/`photoCel` surten sempre del
// registre global: una cara no canvia de temporada.
export const resolveRoster = (db) => db.roster.map(entry => {
  const global = entry.id ? PLAYERS[entry.id] : undefined;
  return {
    ...entry,
    shirtName: entry.shirtName || global?.shirtName,
    photo: global?.photo ?? null,
    photoCel: global?.photoCel ?? null,
  };
});
