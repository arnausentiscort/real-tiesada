// ── Temps i alineacions d'un partit ───────────────────────────────────────────
// Accepta el que s'escriu de pressa: "0:15" → "00:15", "21::01" → "21:01",
// "7" → "07:00". Retorna null si no se'n pot treure un temps.
export function normTime(t) {
  const m = String(t ?? '').trim().match(/^(\d{1,3})\s*:+\s*(\d{1,2})$|^(\d{1,3})$/);
  if (!m) return null;
  const min = Number(m[1] ?? m[3]), sec = Number(m[2] ?? 0);
  if (sec > 59) return null;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
export const toSec = (t) => {
  const n = normTime(t);
  if (!n) return null;
  const [a, b] = n.split(':').map(Number);
  return a * 60 + b;
};
export const sameSet = (a = [], b = []) => a.length === b.length && a.every(x => b.includes(x));

// L'alineació vigent en un minut: l'últim canvi que ja havia passat.
// Els de camp, sense el porter.
export function lineupAt(subs, time) {
  const t = toSec(time);
  if (t == null) return null;
  let cur = null;
  for (const s of subs || []) {
    const st = toSec(s.time);
    if (st == null || st > t) continue;
    if (!cur || st >= toSec(cur.time)) cur = s;
  }
  if (!cur || cur._isBreak || !(cur.onPitch || []).length) return null;
  return {
    time: normTime(cur.time),
    goalkeeper: cur.goalkeeper || '',
    onPitch: cur.onPitch.filter(p => p !== cur.goalkeeper),
  };
}
