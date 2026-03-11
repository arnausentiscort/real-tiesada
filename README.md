# 🦇 Real Tiesada FC · Stats Dashboard

Dashboard d'estadístiques de fútbol sala per al Real Tiesada FC.  
Web estàtica publicada a **GitHub Pages** — sense backend, sense servidor.

---

## 🚀 Com publicar-ho a GitHub Pages (pas a pas)

### Pas 1 — Instal·la les eines necessàries

Necessites tenir instal·lat:
- [Node.js](https://nodejs.org/) (versió 18 o superior)
- [Git](https://git-scm.com/)
- Un compte a [GitHub](https://github.com)

---

### Pas 2 — Crea un repositori nou a GitHub

1. Ves a **github.com** i fes clic a **"New repository"**
2. Posa-li el nom: `real-tiesada`
3. Deixa'l en **Public**
4. **NO** marquis cap checkbox (ni README, ni .gitignore)
5. Fes clic a **"Create repository"**

---

### Pas 3 — Configura la URL base (IMPORTANT)

Obre el fitxer `vite.config.js` i assegura't que el `base` és el nom exacte del teu repositori:

```js
base: '/real-tiesada/',
```

Si el teu repositori es diu diferent, canvia-ho aquí.

---

### Pas 4 — Puja el codi a GitHub

Obre un terminal a la carpeta del projecte i executa:

```bash
# Inicialitza Git
git init
git add .
git commit -m "🦇 Initial commit - Real Tiesada Dashboard"

# Connecta amb el teu repositori de GitHub
# (substitueix EL_TEU_USUARI pel teu nom d'usuari de GitHub)
git remote add origin https://github.com/EL_TEU_USUARI/real-tiesada.git

# Puja el codi
git branch -M main
git push -u origin main
```

---

### Pas 5 — Instal·la les dependències i desplega

```bash
# Instal·la les dependències (només el primer cop)
npm install

# Construeix i desplega a GitHub Pages
npm run deploy
```

Espera ~30 segons. Veuràs missatges com:
```
> real-tiesada@1.0.0 deploy
> npm run build && gh-pages -d dist
Published
```

---

### Pas 6 — Activa GitHub Pages al repositori

1. Ves al teu repositori a GitHub
2. Fes clic a **Settings** (configuració)
3. Al menú esquerre, fes clic a **Pages**
4. A "Branch", selecciona **`gh-pages`** i la carpeta **`/ (root)`**
5. Fes clic a **Save**

Espera 2-3 minuts i la web estarà disponible a:

```
https://EL_TEU_USUARI.github.io/real-tiesada/
```

---

## 🔄 Com actualitzar la web (afegir partits)

### Per afegir un nou partit:

1. Obre el fitxer `src/data.js`
2. Afegeix un nou objecte al array `matches` seguint la mateixa estructura
3. Guarda el fitxer
4. Executa des del terminal:

```bash
git add .
git commit -m "➕ Afegit Jornada X vs [Rival]"
git push
npm run deploy
```

La web s'actualitzarà en ~2 minuts.

---

## 📁 Estructura del projecte

```
real-tiesada/
├── src/
│   ├── App.jsx              ← Component principal (navegació)
│   ├── main.jsx             ← Punt d'entrada de React
│   ├── index.css            ← Estils globals + Tailwind
│   ├── data.js              ← 📊 DADES DELS PARTITS (edita aquí!)
│   ├── utils.js             ← Funcions matemàtiques de temps
│   └── components/
│       ├── GlobalDashboard.jsx  ← Vista A: Panell global
│       └── MatchDetail.jsx      ← Vista B: Detall d'un partit
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── vite.config.js          ← ⚠️ Canvia "base" si canvies el nom del repo
├── tailwind.config.js
└── postcss.config.js
```

---

## 🎨 Paleta de colors

| Color | Hex | Ús |
|-------|-----|-----|
| Carbó | `#121212` | Fons principal |
| Superfície | `#1E1E1E` | Targetes i panels |
| Or | `#E5C07B` | Accents i títols |
| Granat | `#C0392B` | Gols en contra / excés de minuts |
| Verd | `emerald-400` | Gols a favor |

---

## ❓ Problemes comuns

**La web no es veu després del deploy:**
→ Espera 5 minuts i refresca. GitHub Pages tarda una mica.

**Error "base" o rutes incorrectes:**
→ Comprova que `vite.config.js` té el nom exacte del teu repositori.

**El vídeo de YouTube no es carrega:**
→ Comprova que el `youtubeId` al `data.js` és correcte (és el codi que apareix a la URL del vídeo després de `?v=`).
