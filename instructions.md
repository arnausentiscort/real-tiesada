# Real Tiesada FC — Instructions for Claude

## Project Identity
- **App**: Statistics dashboard for **Real Tiesada** (futbol sala, men's amateur)
- **Season**: 25/26 (Feb 2026 onwards)
- **Developer**: Arnau Sentis (player #8, migcampista)
- **League**: 2a Lliga Sant Ignasi FSala masculí — Dilluns 2a Divisió

---

## Mandatory Rules

### 1. UI Language
- **Always use Catalan** in the interface
- Never add English or other languages to UI elements
- Error messages, labels, buttons, placeholders → all Catalan

### 2. Project Names & Terms
- Team: **Real Tiesada** (never just "Tiesada")
- Main rival: **Touchlas FC** (always with 's' at end)
- Player names: **full format always** — "Arnau Sentis" (never "Arnau" solo)
- `shirtName`: uppercase dorsal names → SENTIS, MIRÓ, GABARRI, IBÁÑEZ, etc.

### 3. Data Integrity
- **Never modify `data.js` without reading it first** — contains live match data
- Always understand structure before adding matches, players, or stats
- `data_s1.js` is Split 1 (24/25 season) — separate from current season
- When editing: preserve existing data, never delete active match records

### 4. Code Style
- No unnecessary comments or README files
- Keep code concise and focused
- Player references must use exact full names from `data.js`
- File paths: relative to `public/` → `"players/arnau.png"` (no leading `/`)

### 5. GitHub & Deployment
- Always use: `git -c credential.helper=` to avoid Windows Credential Manager interference
- Production URL: `https://arnausentiscort.github.io/real-tiesada/`
- Base path in code: `BASE = import.meta.env.BASE_URL`
- Deploy with: `npm run deploy` (auto gh-pages)

---

## Technical Stack

| Tech | Version | Role |
|------|---------|------|
| React | 18 | UI framework |
| Vite | — | Build tool |
| Tailwind CSS | 3 | Styling |
| Supabase | — | MVP voting backend |
| GitHub Pages | — | Hosting (base: `/real-tiesada/`) |

**Key packages**: `@supabase/supabase-js`, `lucide-react`, `gh-pages`

**Navigation**: No router — `useState(view)` in `App.jsx` controls all views

---

## Project Colors

```
#E5C07B  → Daurat (gold)    — Primary accent, active states
#C0392B  → Grana (dark red) — Secondary accent, buttons
#121212  → Fons (black)     — App background
#1E1E1E  → Superfície       — Cards, panels
#1A1A1A  → Nav              — Navbar, footer
```

---

## File Architecture

```
src/
├── data.js              ← Live data (matches, roster, calendar)
├── data_s1.js           ← Split 1 data (24/25 season)
├── utils.js             ← calcGlobalStats, calcMatchStats, etc.
├── index.css            ← Global animations (fadeIn, goalPop, ripple, etc.)
├── App.jsx              ← Main navigation (view state, navbar)
└── components/
    ├── GlobalDashboard  ← Home, countdown, season stats
    ├── MatchDetail      ← Single match detail + replay
    ├── Squad            ← Roster with flip cards
    ├── GoalHeatmap      ← Goal ball animation + map
    ├── Galeria          ← Photo gallery
    ├── Clasificacion    ← League standings
    ├── MvpPage          ← MVP ranking (Supabase)
    ├── MvpVoting        ← Voting component
    ├── TacticalBoard    ← Tactical SVG canvas
    ├── AdminPanel       ← Admin tools (triple-click logo)
    ├── Split1Dashboard  ← Previous season stats
    ├── LineupStats      ← Stats by lineup
    ├── DuoStats         ← Pair player stats
    ├── ChanceCreationChart ← Chance analysis
    ├── ExportExcel      ← Stats export
    ├── LoadingScreen    ← Initial loader
    └── Confetti         ← Win animation

public/
├── players/             ← Player photos (lowercase: arnau.png, roger.png, etc.)
│   └── *_cel.png        ← Alternative photos
└── gallery/             ← Match moment photos/videos
```

---

## Navigation Views

In `App.jsx`, `view` can be:
- `'dashboard'` → GlobalDashboard (home)
- `'squad'` → Squad (roster)
- `'clasificacion'` → Clasificacion (standings)
- `'mvp'` → MvpPage (MVP voting)
- `'heatmap'` → GoalHeatmap (goal map)
- `'galeria'` → Galeria (photos)
- `'pissarra'` → TacticalBoard (tactical view)
- `{...matchObject}` → MatchDetail (full match object)

**Navbar order**: Stats · Plantilla · Classificació · MVP · Mapa de Gols · Galeria · Pissarra

---

## Key Conventions

### Player Data
```javascript
{
  name: "Arnau Sentis",           // Full name
  number: 8,
  shirtName: "SENTIS",            // Uppercase, max 12 chars
  position: "Migcampista",        // Porter|Defensa|Migcampista|Davanter
  photo: "players/arnau.png",     // Relative to public/
  photoCel: "players/arnau_cel.png"
}
```

### Match Data
```javascript
{
  id: "j1-vikings",               // "j{number}-{opponent_slug}"
  jornada: "Jornada 1",
  opponent: "Vikings",
  result: "4 - 5",                // "ours - theirs"
  date: "23 Feb 2026",
  youtubeId: null,                // or video ID
  vimeoId: null,
  events: {
    goals: [{
      time: "13:45",              // MM:SS format
      type: "favor",              // or "contra"
      scorer: "Arnau Sentis",     // Only if favor
      goalPos: { x, y }           // Goalmouth SVG coords
      shotPos: { x, y }           // Field SVG coords
    }],
    retransmissio: [{
      time: "12:34",
      type: "bona|dolenta|tactica|clip",
      text: "Description",
      photo: "gallery/j3-moment-1.jpg"
    }]
  }
}
```

### Coordinate Systems
- **Field SVG**: viewBox `0,0,800,420` — rival goal at `x≈782, y=210`
- **Goal SVG**: viewBox `0,0,300,200` — goal centered right
- Times: `"MM:SS"` format (e.g., `"13:45"`)

---

## TacticalBoard.jsx Specifics

- Portrait mode SVG: `VB_W=400, VB_H=660`
- Player token radius: SVG `R=22`, bench `BR=24px`
- Modes: `fs5` (5v5), `f7` (7v7), `f11` (11v11)
- Coordinate conversion: `((clientX - rect.left) / rect.width) * VB_W`
- Bottom = our team (y≈630), Top = rivals (y≈30)

---

## GoalHeatmap.jsx Specifics

- Ball animation: 2-phase (shot → goal via Bézier, 600ms + 430ms)
- Ripple effect: 4 concentric circles (keyframes: `bigRipple`, `netBurst`)
- Ball size decreases during flight: `r = 9 - t * 2`
- Parabola control point: `y: min(p0.y, p1.y) - 90`

---

## Admin Panel

- **Access**: Triple-click logo (within 1 second between clicks)
- Generates code snippets for editing `data.js`
- Can add field players as emergency goalkeepers
- GitHub token for direct repo pushes

---

## Common Commands

```bash
npm run dev       # Local server (http://localhost:5173)
npm run build     # Production build → dist/
npm run deploy    # Build + push to gh-pages (auto deploys)
```

## Deploy Checklist

1. Verify changes in `npm run dev`
2. `git add <files>` or `git add .`
3. `git commit -m "descripció del canvi"` (Catalan commit messages)
4. `git -c credential.helper= push https://arnausentiscort:TOKEN@github.com/arnausentiscort/real-tiesada.git main --force`
5. `npm run deploy` (auto runs gh-pages, should see "Published to...")
6. Clear browser cache, check https://arnausentiscort.github.io/real-tiesada/

---

## Special Cases

### Photo Filename Quirk
- Chengzhi Li: photo is `chenghy.png` (typo preserved), alternate: `chengzhi_cel.png`
- **GitHub Pages is case-sensitive** — file names must match exactly
- For renames: `git mv file tmp && git mv tmp final` (two-step to avoid case issues)

### Supabase MVP Voting
- Table: `mvp_votes` (columns: `id`, `match_id`, `voter_id`, `player_name`, `created_at`)
- Anon key stored in `MvpVoting.jsx` line 7 (never commit sensitive keys)

### Split 1 (24/25 Season)
- Historical data preserved in `data_s1.js`
- Use `Split1Dashboard.jsx` for comparative analysis
- Don't modify — reference only for stats context

---

## Decision Rules

When in doubt about what to do:
1. **Data changes** → Read `data.js` first, understand current structure
2. **New component** → Follow existing component patterns (e.g., GoalHeatmap for layout + animations)
3. **Styling** → Use Tailwind utility classes, never raw CSS except `index.css` animations
4. **Player names** → Always use exact full names from roster
5. **Translations** → Catalan unless it's an API key or code literal
6. **GitHub operations** → Always use `git -c credential.helper=`

---

## Questions to Clarify (Optional)

1. **Commit message style** — Should all be in Catalan? (Currently assumed yes)
2. **Component documentation** — Add JSDoc comments to new components?
3. **Animation tweaking** — Are the keyframes in `index.css` locked or can they be adjusted?
4. **Supabase** — Any restrictions on MVP voting data exports or queries?

