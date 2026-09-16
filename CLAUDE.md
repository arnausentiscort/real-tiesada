# Real Tiesada FC — Claude Code Context

## Qui som
App d'estadístiques internes per a l'equip amateur **Real Tiesada FC**.
- Temporada activa: **Split 3 · 26/27** — *Dimarts 1a Lliga* al Velòdrom, format **futbol 7**
- Lliga de 18 jornades, en juguem 16 (descansem la J4 i la J13)
- Font de dades oficials: https://apuntamelo.com/grupo/9/26/0/910/0/4414/0
- Splits anteriors (futbol sala, 2a Lliga Sant Ignasi): Split 1 24/25, Split 2 25/26
- Usuari: **Arnau Sentis** (jugador dorsal 8 i desenvolupador de l'app)

---

## Regles fonamentals
- La UI és **sempre en català**
- No tocar `data.js` sense llegir-lo primer — conté les dades reals de l'equip
- L'equip es diu **Real Tiesada** (mai "Tiesada" sol)
- Al Split 2 el rival habitual era **Touchlas FC** (amb s final)
- No afegir comentaris innecessaris al codi
- No crear fitxers README ni documentació extra

---

## Colors del projecte
| Nom       | Valor       | Ús                        |
|-----------|-------------|---------------------------|
| Daurat    | `#E5C07B`   | Accent principal, actiu   |
| Grana     | `#C0392B`   | Segon accent (botons)     |
| Fons      | `#121212`   | Fons de l'app             |
| Superfície| `#1E1E1E`   | Cards i panells           |
| Nav       | `#1A1A1A`   | Navbar i footer           |

---

## Stack tècnic
- **React 18** + **Vite** + **Tailwind CSS 3**
- **GitHub Pages** (base path: `/real-tiesada/`) — `BASE = import.meta.env.BASE_URL`
- Routing per hash sense llibreria (`src/router.js`) — el hash és l'única font de veritat
- Dades estàtiques a `src/data.js`
- Votació MVP via **Supabase**
- Dependències: `@supabase/supabase-js`, `lucide-react`, `gh-pages`

---

## Credencials i tokens

### GitHub
```
Usuari:  arnausentiscort
Repo:    https://github.com/arnausentiscort/real-tiesada.git
Token:   [vegeu .claude/settings.local.json o demana a l'Arnau — Classic PAT, scope: repo]
```

### Supabase
```
URL:   https://pibacoitanqebynhvpnc.supabase.co
Key:   [anon key a src/components/MvpVoting.jsx línia 7 — no posar aquí per seguretat]
Taula: mvp_votes (columns: id, match_id, voter_id, player_name, created_at)
```

---

## Comandes

```bash
npm run dev      # Servidor local amb hot reload (port 5173)
npm run build    # Build producció → dist/
npm run deploy   # Build + deploy a GitHub Pages (gh-pages -d dist)
```

## Deploy complet (git + GitHub Pages)
```bash
cd "c:/Users/arnau/OneDrive/Escritorio/real-tiesada/real-tiesada"
git add <fitxers>
git commit -m "descripció del canvi"
git -c credential.helper= push https://arnausentiscort:TOKEN@github.com/arnausentiscort/real-tiesada.git main --force
npm run deploy
```
**Important**: usar sempre `git -c credential.helper=` per evitar que el gestor de credencials de Windows intercepti el token.

## URL producció
https://arnausentiscort.github.io/real-tiesada/

---

## Arquitectura de fitxers

```
real-tiesada/
├── public/
│   ├── escut.svg                  ← Logo de l'equip
│   ├── favicon.svg
│   ├── players/                   ← Fotos jugadors (nom exacte en minúscules .png)
│   │   ├── arnau.png / arnau_cel.png
│   │   ├── roger.png / roger_cel.png
│   │   ├── pau.png   / pau_cel.png
│   │   ├── oriol.png / oriol_cel.png
│   │   ├── paco.png  / paco_cel.png
│   │   ├── andreu.png/ andreu_cel.png
│   │   ├── chenghy.png / chengzhi_cel.png   ← atenció: chenghy (no chengzhi) per la foto normal
│   │   └── marc.png  / marc_cel.png
│   └── gallery/                   ← Fotos i vídeos de moments del partit
│       ├── j3-oriol-pi-1.jpg / j3-oriol-pi-2.jpg
│       ├── j3-paco-ivan-1.jpg / j3-paco-ivan-2.jpg
│       ├── j3-roi-passa-1.jpg / j3-roi-passa-2.jpg
│       └── j3-gol-chengzhi.mp4
├── src/
│   ├── data.js                    ← TOTES les dades estàtiques
│   ├── data_s1.js                 ← Dades Split 1 (temporada anterior 24/25)
│   ├── utils.js                   ← calcGlobalStats, calcMatchStats, calcGoalkeeperStints, formatTime
│   ├── index.css                  ← Animacions globals (fadeIn, slideUp, goalPop, bigRipple, netBurst...)
│   ├── main.jsx
│   ├── App.jsx                    ← Navegació principal (view state, SeasonToggle, navs)
│   └── components/
│       ├── GlobalDashboard.jsx    ← Home: countdown proper partit, stats temporada, SeasonTimeline, llista partits
│       ├── MatchDetail.jsx        ← Detall partit: marcador animat, swipe jornades, gràfic temps, retransmissió
│       ├── Squad.jsx              ← Plantilla: flip cards amb rating, modal perfil jugador
│       ├── GoalHeatmap.jsx        ← Mapa gols: pilota animada bifàsica, autoplay, ripple a porteria
│       ├── Galeria.jsx            ← Fotos manuals dels moments destacats
│       ├── Clasificacion.jsx      ← Taula classificació de la lliga
│       ├── MvpPage.jsx            ← Pàgina MVP: rànquing de votacions via Supabase
│       ├── MvpVoting.jsx          ← Component de vot MVP per partit (Supabase)
│       ├── Pissarra.jsx           ← Pestanyes Jugades / Pissarra (view 'pissarra')
│       ├── Entrenaments.jsx       ← Catàleg de jugades animades + fitxa de cada jugada
│       ├── DrillPlayer.jsx        ← Reproductor d'animacions tàctiques (play/fases/velocitat)
│       ├── TacticalBoard.jsx      ← Pissarra tàctica: SVG portrait, 3 modes, drag&drop, banquillo, gravadora
│       ├── pitch/FieldLines.jsx   ← Línies de camp compartides (fs5/f7/f11) + VB_W/VB_H/F/pct2svg
│       ├── Split1Dashboard.jsx    ← Dashboard temporada Split 1
│       ├── AdminPanel.jsx         ← Panel admin (accés: triple clic al logo)
│       ├── ChanceCreationChart.jsx← Gràfic Fantasies (KP+Regats) vs Gols assistits
│       ├── DuoStats.jsx           ← Estadístiques parelles de jugadors
│       ├── LineupStats.jsx        ← Stats per alineació/quintet
│       ├── ExportExcel.jsx        ← Export estadístiques a .xlsx
│       ├── LoadingScreen.jsx      ← Pantalla de càrrega inicial
│       └── Confetti.jsx           ← Animació confetti quan guanyem
```

---

## Navegació (router.js + App.jsx)

El hash de la URL és l'única font de veritat. `parseHash()` el converteix en
una ruta i `App` escolta `hashchange`, així el botó enrere del navegador
funciona i qualsevol pantalla és enllaçable.

| Hash | Vista |
|------|-------|
| `#/` (o cap) | GlobalDashboard |
| `#/plantilla` | Squad |
| `#/classificacio` | Clasificacion |
| `#/calendari` | Calendari |
| `#/mvp` | MvpPage |
| `#/mapa` | GoalHeatmap |
| `#/galeria` | Galeria |
| `#/tactica` | Pissarra · pestanya Jugades |
| `#/tactica/pissarra` | Pissarra · pestanya Pissarra |
| `#/tactica/<drillId>` | Jugada concreta, enllaçable |
| `#/partit/<matchId>` | MatchDetail |

Per navegar des d'un component: `goTo('/tactica')` de `src/router.js`
(mai `setState` — trencaria l'enrere del navegador).

`#/partit/<id>` busca el partit a **totes** les temporades amb
`findMatchById()` i canvia la temporada activa sola si cal.

Nav items (ordre): Stats · Plantilla · Classificació · Calendari · Tàctica
Amagats al nav però la vista segueix funcionant: `mvp`, `heatmap` (Mapa de Gols), `galeria`

**Càrrega diferida**: `AdminPanel` i `xlsx` (dins `ExportExcel`) no entren al
bundle inicial — es descarreguen en obrir l'admin o en prémer Exportar Excel.
No els tornis a importar de forma estàtica.

**Admin**: triple clic al logo → `showAdmin = true` → `<AdminPanel />`

**Confetti**: s'activa 4 s quan obrim un partit guanyat (goals[0] > goals[1]).

---

## data.js — estructura completa

```javascript
DATABASE = {
  teamName: "Real Tiesada",

  nextMatch: {
    opponent: string,
    date: string (ISO "2026-04-27T21:45:00"),
    dateLabel: string ("27 Abr 2026 · 21:45h"),
    location: string ("St. Ignasi Sala 2"),
    jornada: string ("Jornada 8"),
    isHome: boolean,
  },

  calendar: [{ date, dateLabel, jornada, opponent, location, isHome }],

  roster: [{
    name: string,           // "Arnau Sentis" — format complet sempre
    number: number,
    shirtName: string,      // "SENTIS" — majúscules, és el nom al dorsal
    position: string,       // "Porter" | "Defensa" | "Migcampista" | "Davanter"
    photo: string | null,   // "players/arnau.png" (relatiu a public/)
    photoCel: string | null,// "players/arnau_cel.png"
  }],

  matches: [{
    id: string,             // "j1-vikings"
    jornada: string,        // "Jornada 1"
    opponent: string,
    result: string,         // "4 - 5" (nosaltres - rival)
    date: string,           // "23 Feb 2026"
    youtubeId: string|null,
    vimeoId: string|null,
    idealMinutesPerPlayer: number,
    goalkeeperMinutes: { "Nom Jugador": minutes },  // minuts a porteria
    fieldMinutes: { "Nom Jugador": minutes },        // minuts en camp
    savesManual: { "Nom Jugador": N },              // aturades manuals
    shots:     { "Nom Jugador": [{ time, onTarget }] },
    keyPasses: { "Nom Jugador": [{ time }] },
    dribbles:  { "Nom Jugador": [{ time }] },
    events: {
      substitutions: [{ time, goalkeeper, onPitch: [...noms] }],
      cards: [{ time, color, player }],
      goals: [{
        time: "MM:SS",
        type: "favor" | "contra",
        scorer: string,         // només si favor
        assist: string | null,
        goalkeeper: string,     // qui estava a porteria
        onPitch: [string],      // jugadors de camp en aquell moment
        shotPos: { x, y },     // coordenades camp SVG (viewBox 0,0,800,420)
        assistPos: { x, y } | null,
        conductPos: { x, y } | null,
        goalPos: { x, y },     // coordenades porteria SVG (viewBox 0,0,300,200)
        zone: string,
        notes: string,
      }],
      retransmissio: [{
        time: string,           // "12:34"
        type: "bona" | "dolenta" | "tactica" | "clip",
        text: string,
        players: [string],
        videoUrl: string | null,
        photo: string | null,   // "gallery/nom-1.jpg"
        photoHover: string | null,
      }],
    }
  }]
}
```

### Convencions de coordenades
- **Camp SVG**: viewBox `0,0,800,420` — porteria rival a la dreta (`x≈782, y=210`)
- **Porteria SVG**: viewBox `0,0,300,200` — porteria al centre dreta
- Temps dels gols: format `"MM:SS"` (ex: `"13:45"`)
- `type: 'favor'` = gol a favor, `type: 'contra'` = gol en contra

---

## Plantilla Split 2 (25/26)

| # | Nom | Dorsal | Posició | Foto |
|---|-----|--------|---------|------|
| 4 | Ivan Mico | QUATRE | Defensa | ❌ |
| 8 | Arnau Sentis | SENTIS | Migcampista | ✅ |
| 9 | Roger Miro | MIRÓ | Davanter | ✅ |
| 10 | Pau Ibañez | IBÁÑEZ | Defensa | ✅ |
| 11 | Joan Medina | MEDINA | Porter | ❌ |
| 12 | Chengzhi Li | CHENGZHI LI | Davanter | ✅ (chenghy.png) |
| 21 | Oriol Tomas | ORIOL TOMAS | Migcampista | ✅ |
| 22 | Paco Montero | GABARRI | Davanter | ✅ |
| 24 | Roi Seoane | ROI | Defensa | ❌ |
| 77 | Marc Farreras | FARRERAS | Davanter | ✅ |
| 80 | Andreu Cases | TELICO | Migcampista | ✅ |

---

## Partits jugats (Split 2 · 25/26)

| Jornada | Rival | Resultat | Vídeo |
|---------|-------|----------|-------|
| J1 | Vikings | 4-5 (D) | Vimeo: 1167919011 |
| J2 | Ensaimada | 2-9 (D) | — |
| J3 | Uruks | 2-5 (D) | YouTube: X9w3f1w47YA |
| J4 | Touchlas FC | 2-5 (D) | YouTube: tokKRGjQP1Q |
| J5 | Dgeneración X | 1-3 (D) | — |
| J6 | Fabbas FC | ? | — |
| J7 | Great Spirit | ? | — |

Propers: J8 Vietkong (27 Abr), J9 Vikings (04 Mai), J10 Ensaimada (11 Mai)...

---

## Split 3 (26/27) — temporada en curs

Dades a `src/seasons/s3/index.js`; cada partit al seu fitxer a `src/seasons/s3/matches/`.

| Jornada | Rival | Resultat |
|---------|-------|----------|
| J1 · 15 Set | Polanco FC | 5-7 (D) |

Propers: J2 Star Warros (22 Set), J3 FC Manguito (29 Set), J5 Inafumaybeben (13 Oct)...

Altes al roster respecte al Split 2: Joan Ribes (porter), Serginho, i el retorn de
Coro i Lluc del Split 1. Baixa: Andreu Cases. Lesionat: Oriol Tomas.

**Àlies**: "Lopa" al WhatsApp de l'equip és en **Pau Ibañez**.

---

## TacticalBoard.jsx — Notes tècniques

- SVG portrait: `VB_W=400, VB_H=660`, camp `F={x:20, y:30, w:360, h:600}` (a `pitch/FieldLines.jsx`)
- Radi token SVG: `R=15` (mòbil ×1.2), radi token banquillo: `BR=20px` — fitxes petites perquè no xoquin amb els rivals
- 3 modes: `fs5` (Sala 5v5), `f7` (Futbol 7), `f11` (Futbol 11)
- `fieldPlayers`: `[{name, x, y}]` — x,y en coordenades SVG
- `rivalPos`: `[{x,y}]` — tokens rivals (cercles vermells)
- Drag banquillo: pointer capture → ghost `position:fixed` → detecta drop sobre SVG via `getBoundingClientRect()`
- Conversió coords: `((clientX - rect.left) / rect.width) * VB_W`
- Bottom = nosaltres (y≈630), Top = rival (y≈30)

---

## Jugades animades — Notes tècniques

- Dades a `src/drills.js`: cada jugada té `steps[]` amb posicions en **% del camp**
  (x 0=esquerra 100=dreta, y 0=porteria rival 100=porteria pròpia)
- `buildTimeline()` converteix els steps en segments (`dur` de transició + `hold` de pausa)
- `DrillPlayer` interpola posicions amb easing i mostra les fletxes del step d'origen
- Fletxes: `run` daurat · `pass` blanc discontinu · `press` grana · `carry` verd
- Gravadora (botó 🎥 a la pissarra): captura fases → `withAutoArrows()` genera les fletxes soles
- Jugades gravades → `localStorage` (`rt:drills:v1`, a `src/drillStore.js`).
  Per publicar-les a tot l'equip: exportar JSON i enganxar-lo a `DRILLS` de `src/drills.js`

---

## GoalHeatmap.jsx — Notes tècniques

- Animació bifàsica: Fase 1 = shotPos → porteria (Bézier, 600ms), Fase 2 = shot → gol rival (430ms)
- Ripple a porteria: 4 cercles concèntrics amb `bigRipple`/`netBurst` keyframes (definits a `index.css`)
- `useGoalBallAnimation`: inici `{x:150, y:100}`, paràbola amb control point `y: min(p0.y,p1.y) - 90`
- Mida pilota disminueix durant vol: `r = 9 - rawT * 2` (efecte perspectiva)

---

## Panel Admin

- **Accés**: triple clic al logo (dins d'1 segon entre clics)
- Treballa **sempre sobre la temporada activa**: viu dins del `SeasonProvider`
  i en treu plantilla, calendari, partits i format (`useSeason()`)
- S'adapta sol al format: els selectors de camp són `format.fieldPlayers`
  (4 a sala, 6 a futbol 7), el camp i la porteria surten de `format.pitch`/
  `format.goal`, i la graella de zones A1..D6 es calcula sobre la mida real
- **Un partit = un fitxer**. El panel genera un mòdul `export default {...}`:
  - Partit nou → escriu `<matchesDir>/<id sense prefix>.js` **i** registra
    l'import + l'entrada a `matches` de l'índex de temporada
  - Editar → només reescriu el fitxer del partit
  - Rutes per temporada a `SEASON_PATHS` dins d'`AdminPanel.jsx`
- L'id d'un partit nou és `<temporada>-j<jornada>-<rival>`; el fitxer és
  aquest id sense el prefix (`s3-j2-star-warros` → `j2-star-warros.js`)
- La jornada i el rival es pre-omplen amb la primera del calendari que
  encara no té partit — així no es tornen a numerar malament
- Permet afegir jugadors de camp com a porters esporàdics (secció aturades)
- Token GitHub per pujar canvis directament des del panel

---

## Regles de decisió

Quan hi hagi dubte sobre què fer:
1. **Canvis de dades** → llegir primer el fitxer de la temporada que toca
   (`src/seasons/s3/index.js` i `src/seasons/s3/matches/` per a l'actual,
   `data.js` per al Split 2) abans de tocar res
2. **Component nou** → seguir els patrons dels existents (GoalHeatmap com a
   referència de layout + animacions)
3. **Estils** → classes de Tailwind, mai CSS cru fora de les animacions d'`index.css`
4. **Noms de jugadors** → sempre el nom complet exacte del roster
5. **Idioma** → català, excepte claus d'API i literals de codi
6. **Operacions de Git** → sempre `git -c credential.helper=`

---

## Convencions de codi

- Noms de jugadors sempre en format complet: `"Arnau Sentis"` (mai "Arnau" sol)
- `shirtName` és el nom al dorsal: SENTIS, MIRÓ, GABARRI, MEDINA, IBÁÑEZ...
- Rutes de fotos relatives a `public/`: `"players/arnau.png"` (no `/players/...`)
- **GitHub Pages és case-sensitive** (Linux): els noms de fitxer han de coincidir exactament
- Quan es fa `git mv` per reanomenar, fer en dos passos: `git mv fitxer tmp && git mv tmp fitxer_final`
- `git -c credential.helper=` sempre per evitar interferències del Windows Credential Manager
