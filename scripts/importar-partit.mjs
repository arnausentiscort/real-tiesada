// Importa un partit de la temporada actual des d'apuntamelo.com i el vídeo del canal de YouTube.
//   npm run importar            → l'últim partit jugat que encara no tenim
//   npm run importar -- 7       → la jornada 7
//   npm run importar -- 7 --força   → la torna a importar encara que ja hi sigui (sobreescriu)
//   npm run importar -- --prova → només ensenya què faria, sense escriure res
// Crea el fitxer del partit (marcador, golejadors, assistències, tipus de gol i vídeo),
// el registra a l'índex de la temporada i actualitza la classificació.
// Els canvis, els tirs i les aturades s'apunten després amb el mode partit.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const EQUIP_APUNTAMELO = 32161;
const CANAL_YOUTUBE = 'UCuupYN3GJNL8mfnWQ8aa8DA';
const ARREL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INDEX = path.join(ARREL, 'src/seasons/s3/index.js');
const PARTITS = path.join(ARREL, 'src/seasons/s3/matches');

const args = process.argv.slice(2);
const prova = args.includes('--prova');
const forca = args.includes('--força') || args.includes('--forca');
const jornadaDemanada = Number(args.find(a => /^\d+$/.test(a))) || null;

const api = async u => {
  const r = await fetch('https://apuntamelo.com/' + u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error(`apuntamelo ha respost ${r.status} a ${u}. Torna-ho a provar d'aquí a una estona.`);
  return r.json();
};
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/football club/g, 'fc').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const slug = s => norm(s).replace(/ /g, '-');
const mm = n => String(n).padStart(2, '0');
const MESOS = ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'];
const q = s => JSON.stringify(s);

let index = fs.readFileSync(INDEX, 'utf8');
const eol = index.includes('\r\n') ? '\r\n' : '\n';
index = index.replace(/\r\n/g, '\n');

// ── Plantilla i calendari de la temporada ──
const roster = [...index.matchAll(/name: '([^']+)',\s*number: (\d+)/g)].map(m => ({ name: m[1], number: +m[2] }));
// El nom que surt a apuntamelo quan no coincideix ni el dorsal ni el nom (camp `apuntamelo` de la plantilla)
for (const m of index.matchAll(/name: '([^']+)'[^\n]*apuntamelo: '([^']+)'/g)) {
  const r = roster.find(x => x.name === m[1]);
  if (r) r.apuntamelo = m[2];
}
const calendari = [...index.matchAll(/date: "([^"]+)",[^\n]*jornada: "Jornada (\d+)",\s*opponent: "([^"]+)"/g)]
  .map(m => ({ date: m[1], jornada: +m[2], opponent: m[3] }));
const jaTenim = new Set([...index.matchAll(/from '\.\/matches\/j(\d+)-/g)].map(m => +m[1]));

// ── Quin partit ──
const partits = (await api(`obtenerPartidosEquipo?equipo=${EQUIP_APUNTAMELO}`))
  .filter(p => p.Validado && p.Goles_A != null)
  .sort((a, b) => b.Jornada - a.Jornada);
const partit = jornadaDemanada
  ? partits.find(p => p.Jornada === jornadaDemanada)
  : partits.find(p => !jaTenim.has(p.Jornada));
if (!partit) {
  console.log(jornadaDemanada ? `A apuntamelo encara no hi ha la jornada ${jornadaDemanada} acabada.` : 'No hi ha cap partit nou: ja els tenim tots.');
  process.exit(0);
}
const J = partit.Jornada;
if (jaTenim.has(J) && !forca) {
  console.log(`La jornada ${J} ja hi és. Si la vols tornar a importar (es perden els canvis i accions apuntats): npm run importar -- ${J} --força`);
  process.exit(0);
}

const somA = partit.FK_EquipoLiga_A === EQUIP_APUNTAMELO;
const rivalId = somA ? partit.FK_EquipoLiga_B : partit.FK_EquipoLiga_A;
const nostres = somA ? partit.Goles_A : partit.Goles_B;
const seus = somA ? partit.Goles_B : partit.Goles_A;
const cal = calendari.find(c => c.jornada === J);
const rival = cal?.opponent || (somA ? partit.Nombre_B : partit.Nombre_A).trim();
const data = new Date(partit.Fecha.replace(' ', 'T'));
const dataLabel = `${mm(data.getDate())} ${MESOS[data.getMonth()]} ${data.getFullYear()}`;

// ── Gols ──
const info = (await api(`obtenerInfoPartido?id=${partit.Id}`))[0];
const noticies = JSON.parse(info.Json_noticias || '[]');
const plantilla = async eq => {
  const r = await api(`obtenerPlantillaEquipo?equipo=${eq}`);
  return new Map(JSON.parse(r[0]?.Json_plantilla || '[]').map(j => [j.Id, j]));
};
const [nostra, seva] = await Promise.all([plantilla(EQUIP_APUNTAMELO), plantilla(rivalId)]);

const noTrobats = new Set();
const jugador = id => {
  if (!id) return null;
  const j = nostra.get(id);
  if (!j) return null;
  const perAlias = roster.find(r => r.apuntamelo && norm(r.apuntamelo) === norm(j.Nombre));
  if (perAlias) return perAlias.name;
  const perDorsal = roster.find(r => r.number === j.Dorsal);
  if (perDorsal) return perDorsal.name;
  const perNom = roster.find(r => norm(j.Nombre).split(' ').some(w => w.length > 2 && norm(r.name).split(' ').includes(w)));
  if (perNom) return perNom.name;
  noTrobats.add(`${j.Nombre} #${j.Dorsal}`);
  return null;
};
const curt = j => j ? `${j.Nombre.split(' ')[0]} ${j.Nombre.split(' ')[1]?.[0] || ''}.`.replace(' .', '') + (j.Dorsal != null ? ` #${j.Dorsal}` : '') : '';
const TIPUS = { 'de penalti': 'De penal.', 'de falta': 'De falta.', 'de cabeza': 'De cap.', 'desde fuera del área': 'Des de fora de l\'àrea.' };

const gols = noticies.filter(n => n.Tipo === 2).reverse().map(n => {
  const detall = noticies.find(d => d.Tipo === 0 && d.Minuto === n.Minuto && d.FK_JugadorLiga === n.FK_JugadorLiga && d.Parametros?.tipo);
  const tipus = TIPUS[detall?.Parametros?.tipo] || '';
  const favor = n.FK_EquipoLiga === EQUIP_APUNTAMELO;
  const assistent = n.FK_AsistenteLiga ? [...nostra.values()].find(j => j.Id === n.FK_AsistenteLiga) : null;
  if (favor) {
    const golejador = jugador(n.FK_JugadorLiga);
    const assist = assistent ? jugador(assistent.Id) : null;
    const falta = [!golejador && `golejador ${n.Nombre_Jugador}`, n.FK_AsistenteLiga && !assist && `assistent ${n.Nombre_Asistente}`].filter(Boolean);
    return { min: n.Minuto, favor, golejador, assist, nota: [tipus, falta.length ? `A apuntamelo: ${falta.join(', ')}.` : ''].filter(Boolean).join(' ') };
  }
  const r = seva.get(n.FK_JugadorLiga);
  return { min: n.Minuto, favor, nota: [r ? curt(r) + '.' : n.Nombre_Jugador ? n.Nombre_Jugador + '.' : '', tipus].filter(Boolean).join(' ') };
});
if (gols.filter(g => g.favor).length !== nostres || gols.filter(g => !g.favor).length !== seus)
  console.log(`⚠ apuntamelo té ${gols.length} gols apuntats però el marcador és ${nostres}-${seus}. Revisa'ls al mode partit.`);

// ── Vídeo ──
let youtubeId = null, titolVideo = null;
try {
  const xml = await (await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CANAL_YOUTUBE}`)).text();
  const videos = [...xml.matchAll(/<entry>[\s\S]*?<yt:videoId>([^<]+)<\/yt:videoId>[\s\S]*?<title>([^<]+)<\/title>[\s\S]*?<published>([^<]+)<\/published>/g)]
    .map(m => ({ id: m[1], titol: m[2].replace(/&amp;/g, '&'), publicat: new Date(m[3]) }));
  const paraules = norm(rival).split(' ').filter(w => w.length > 2 && w !== 'fc');
  const v = videos.find(v => v.publicat >= data && (paraules.some(w => norm(v.titol).includes(w)) || v.titol.includes(`${nostres} - ${seus}`)));
  if (v) { youtubeId = v.id; titolVideo = v.titol; }
} catch { /* sense vídeo: es pot posar després */ }

// ── Fitxer del partit ──
const nomFitxer = `j${J}-${slug(rival)}.js`;
const id = `s3-j${J}-${slug(rival)}`;
const ident = `j${J}` + slug(rival).split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('');
const golsCodi = gols.map(g => [
  `      { time: "${mm(g.min)}:00", type: "${g.favor ? 'favor' : 'contra'}", ${g.favor ? `scorer: ${q(g.golejador)}, assist: ${q(g.assist)}, ` : ''}goalkeeper: "Joan Ribes",`,
  `        zone: null, shotPos: null, assistPos: null, conductPos: null, goalPos: null,`,
  `        onPitch: [], notes: ${q(g.nota)} },`,
].join('\n')).join('\n\n');

const fitxer = `// Jornada ${J} · ${dataLabel.slice(0, 6)}/${data.getFullYear()} · Real Tiesada ${nostres}-${seus} ${rival}
// Importat d'apuntamelo.com (partit ${partit.Id}) amb \`npm run importar\`: marcador, golejadors,
// assistències i tipus de gol, només amb el minut. Falten els canvis, les accions i les aturades.
export default {
  id: "${id}",
  jornada: "Jornada ${J}",
  opponent: ${q(rival)},
  result: "${nostres} - ${seus}",
  date: "${dataLabel}",
  youtubeId: ${q(youtubeId)},
  vimeoId: null,
  idealMinutesPerPlayer: 26,
  shots: {},
  keyPasses: {},
  dribbles: {},
  events: {
    substitutions: [],
    cards: [],
    goals: [
${golsCodi}
    ],
    retransmissio: [],
  },
};
`;

// ── Índex: import, llista de partits i classificació ──
if (!jaTenim.has(J)) {
  const imports = [...index.matchAll(/^import (\w+) from '\.\/matches\/j(\d+)-[^']+';$/gm)];
  const abans = imports.filter(m => +m[2] < J).pop() || imports[imports.length - 1];
  const linia = `import ${ident} from './matches/${nomFitxer}';`;
  index = index.replace(abans[0], `${abans[0]}\n${linia}`);
  index = index.replace(/matches: \[([^\]]*)\]/, (_, llista) => {
    const noms = llista.split(',').map(s => s.trim()).filter(Boolean);
    const num = n => +(n.match(/^j(\d+)/)?.[1] ?? 99);
    const pos = noms.findIndex(n => num(n) > J);
    noms.splice(pos === -1 ? noms.length : pos, 0, ident);
    return `matches: [${noms.join(', ')}]`;
  });
}

const taula = JSON.parse((await api(`obtenerClasEquipo?equipo=${EQUIP_APUNTAMELO}`))[0].Json_clasificacion);
const nomsActuals = [...index.matchAll(/equipo: '([^']+)'/g)].map(m => m[1]);
const nomEquip = n => nomsActuals.find(a => norm(a) === norm(n)) || nomsActuals.find(a => norm(n).includes(norm(a)) || norm(a).includes(norm(n))) || n.trim();
const FORMA = { 3: 'V', 2: 'E', 1: 'D' };
const files = taula.map((t, i) => {
  const forma = String(t.Lasts || '').split('/').map(x => FORMA[x]).filter(Boolean).map(x => `'${x}'`).join(',');
  const nosaltres = t.Id === EQUIP_APUNTAMELO;
  const equip = `'${nomEquip(t.Nombre).replace(/'/g, "\\'")}',`;
  return `    { pos: ${i + 1}, equipo: ${equip.padEnd(18)} pj: ${t.PJ}, pg: ${t.Victorias}, pe: ${t.Empates}, pp: ${t.Derrotas},` +
    ` gf: ${t.GF}, gc: ${t.GC}, ${`pts: ${t.Puntos},`.padEnd(9)} ${`forma: [${forma}],`.padEnd(29)} esNosaltres: ${nosaltres}${nosaltres ? ' ' : ''} },`;
});
const ultima = Math.max(...partits.map(p => p.Jornada));
index = index.replace(/  \/\/ Actualitzada a la jornada \d+[\s\S]*?classification: \[[\s\S]*?\n  \],/,
  `  // Actualitzada a la jornada ${ultima} amb \`npm run importar\` (font: apuntamelo.com; la forma, els últims 5)\n  classification: [\n${files.join('\n')}\n  ],`);

// ── Resultat ──
console.log(`\nJornada ${J} · Real Tiesada ${nostres}-${seus} ${rival} · ${dataLabel}`);
console.log(`Vídeo: ${youtubeId ? `${titolVideo} (${youtubeId})` : 'no trobat al canal (afegeix youtubeId a mà quan es pugi)'}`);
for (const g of gols) console.log(`  ${mm(g.min)}'  ${g.favor ? '⚽ ' + (g.golejador || '?') + (g.assist ? ` (assist. ${g.assist})` : '') : '❌ ' + g.nota}${g.favor && g.nota ? ' · ' + g.nota : ''}`);
if (noTrobats.size) console.log(`⚠ No sé qui són a la plantilla: ${[...noTrobats].join(', ')}. Posa'ls al mode partit.`);
if (prova) { console.log('\n(prova: no s\'ha escrit res)'); process.exit(0); }
fs.writeFileSync(path.join(PARTITS, nomFitxer), fitxer);
fs.writeFileSync(INDEX, index.replace(/\n/g, eol));
console.log(`\n✓ Escrit src/seasons/s3/matches/${nomFitxer} i actualitzat l'índex i la classificació.`);
console.log('  Ara: obre el mode partit per apuntar els canvis, i puja-ho (git o el botó de l\'admin).');
