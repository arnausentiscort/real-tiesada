# Real Tiesada FC — Claude Code Context

## Qui som
App d'estadístiques internes per a l'equip de futbol sala amateur **Real Tiesada FC**.
Lliga: 2a Lliga Sant Ignasi FSala masculí — Dilluns 2a Divisió.
Temporada activa: 25/26 (des de febrer 2026).
Usuari: Arnau Sentis (jugador i desenvolupador de l'app).

## Regles importants
- La UI és **sempre en català**
- No tocar `data.js` sense llegir-lo primer — conté les dades reals de l'equip
- Colors del projecte: `#E5C07B` (daurat/accent), `#C0392B` (grana), `#121212` (fons), `#1E1E1E` (superfície)
- L'equip es diu **Real Tiesada** (no "Tiesada" sol)
- El rival és **Touchlas FC** (amb s final)

## Comandes

```bash
npm run dev      # Servidor local amb hot reload
npm run build    # Build producció → dist/
npm run deploy   # Deploy a GitHub Pages (fa build + gh-pages)
```

## Deploy complet (git + deploy)
```bash
git add .
git commit -m "descripció del canvi"
git push https://arnausentiscort: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@github.com/arnausentiscort/real-tiesada.git main --force
npm run deploy
```

## URL producció
https://arnausentiscort.github.io/real-tiesada/

## Stack
- React + Vite + Tailwind CSS
- GitHub Pages (base path: `/real-tiesada/`)
- Sense router — navegació per `useState` a `App.jsx`
- Dades estàtiques a `src/data.js`

## Arquitectura de fitxers clau

```
src/
├── data.js              ← TOTES les dades: roster, partits, calendari, nextMatch
├── utils.js             ← calcGlobalStats, calcMatchStats, calcGoalkeeperStints, formatTime
├── App.jsx              ← Navegació principal (view state)
├── index.css            ← Animacions globals (fadeIn, slideUp, goalPop, etc.)
└── components/
    ├── GlobalDashboard.jsx  ← Home: countdown, stats temporada, SeasonTimeline
    ├── MatchDetail.jsx      ← Detall partit: marcador animat, swipe, gràfic temps
    ├── Squad.jsx            ← Plantilla: flip cards amb rating, modal perfil
    ├── GoalHeatmap.jsx      ← Mapa gols: pilota animada, autoplay
    ├── Galeria.jsx          ← Fotos manuals dels moments
    ├── Clasificacion.jsx    ← Taula classificació
    ├── AdminPanel.jsx       ← Panel admin (accés: triple clic al logo)
    └── ExportExcel.jsx      ← Export estadístiques a .xlsx
```

## data.js — estructura clau

```javascript
DATABASE = {
  teamName: "Real Tiesada",
  nextMatch: { opponent, date (ISO), dateLabel, location, jornada, isHome },
  calendar: [ { date, dateLabel, jornada, opponent, location, isHome }, ... ],
  roster: [ { name, number, shirtName, position, photo, photoCel }, ... ],
  matches: [ {
    id, jornada, opponent, result, date, youtubeId, vimeoId,
    idealMinutesPerPlayer,
    savesManual: { "Nom Jugador": N },  // aturades per jugador
    events: {
      substitutions: [ { time, goalkeeper, onPitch: [...] } ],
      goals: [ { time, type, scorer, assist, goalkeeper, onPitch, shotPos, goalPos, notes } ],
      retransmissio: [ { time, type, text, players, videoUrl, photo, photoHover } ]
    }
  } ]
}
```

## Partits jugats (temporada 25/26)
- J1 — Vikings 4-5 (derrota) — Vimeo: 1167919011
- J2 — Ensaimada 2-9 (derrota) — sense vídeo
- J3 — Uruks 2-5 (derrota) — YouTube: X9w3f1w47YA
- J4 — Touchlas FC 2-5 (derrota) — YouTube: tokKRGjQP1Q
- J5 — Dgeneración X 1-3 (derrota)

## Plantilla (dorsals i posicions)
- 4 Ivan Mico — Defensa
- 8 Arnau Sentis — Migcampista
- 9 Roger Miro — Davanter
- 10 Pau Ibañez — Defensa
- 11 Joan Medina — Porter
- 12 Chengzhi Li — Davanter
- 21 Oriol Tomas — Migcampista
- 22 Paco Montero (GABARRI) — Davanter
- 24 Roi Seoane — Defensa
- 77 Marc Farreras — Davanter
- 80 Andreu Cases (TELICO) — Migcampista

## Panel Admin
- Accés: triple clic al logo
- Genera codi per afegir/editar partits
- Secció d'aturades permet afegir jugadors de camp com a porters esporàdics
- Token GitHub per pujar canvis

## Convencions de codi
- Noms de jugadors sempre en format complet: "Arnau Sentis" (no "Arnau")
- `shirtName` és el nom al dorsal: SENTIS, MIRÓ, GABARRI, MEDINA, IBÁÑEZ...
- Temps dels gols en format "MM:SS" (ex: "13:45")
- `type: 'favor'` = gol a favor, `type: 'contra'` = gol en contra
- Coordenades camp: viewBox 0,0,800,420 — porteria dreta (atacam cap a la dreta)
- Coordenades porteria: viewBox 0,0,300,200

## Versions recents
- v55 — Mapa gols amb pilota animada + autoplay + traces subtils
- v54 — Favicon escut + "Real Tiesada" + "Touchlas FC"
- v53 — Bug marcador fix + calendari complet + badge local/visitant
- v52 — Countdown + números animats + marcador animat + swipe jornades
- v51b — Fix Squad bug + galeria neta
- v50 — Targetes jugador flip cards amb rating