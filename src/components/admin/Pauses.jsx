import { useState } from 'react';
import { Pause, Play, Trash2, Timer } from 'lucide-react';

function toSec(str) {
  if (!str || typeof str !== 'string') return 0;
  const [m, s] = str.split(':').map(Number);
  if (!Number.isFinite(m) || !Number.isFinite(s)) return 0;
  return m * 60 + s;
}

function fmt(sec) {
  const total = Math.max(0, Math.floor(Number(sec) || 0));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Pauses({ match, setMatch, now, mt }) {
  const [openFrom, setOpenFrom] = useState(null);

  const pauses = Array.isArray(match?.pauses) ? match.pauses : [];
  const totalPausedSec = pauses.reduce(
    (acc, p) => acc + Math.max(0, toSec(p.to) - toSec(p.from)),
    0
  );
  const elapsed = openFrom ? Math.max(0, (mt ?? 0) - openFrom.fromSec) : 0;

  function handleStart() {
    setOpenFrom({ from: now, fromSec: mt ?? toSec(now) });
  }

  function handleResume() {
    if (!openFrom) return;
    const diff = (mt ?? 0) - openFrom.fromSec;
    if (diff <= 0) {
      setOpenFrom(null);
      return;
    }
    const newPause = { from: openFrom.from, to: now };
    setMatch((m) => {
      const current = Array.isArray(m?.pauses) ? m.pauses : [];
      const next = [...current, newPause].sort(
        (a, b) => toSec(a.from) - toSec(b.from)
      );
      return { ...m, pauses: next };
    });
    setOpenFrom(null);
  }

  function handleDelete(index) {
    setMatch((m) => {
      const current = Array.isArray(m?.pauses) ? m.pauses : [];
      return {
        ...m,
        pauses: current.filter((_, i) => i !== index),
      };
    });
  }

  return (
    <div className="bg-[#1E1E1E] border border-white/10 rounded-xl p-3 text-white space-y-3">
      {openFrom ? (
        <button
          type="button"
          onClick={handleResume}
          className="w-full min-h-[44px] px-4 rounded-lg bg-[#E5C07B] hover:bg-[#E5C07B]/90 active:scale-[0.99] text-[#121212] font-semibold text-sm flex items-center justify-between gap-2 transition"
        >
          <span className="flex items-center gap-2">
            <Play className="w-4 h-4 fill-current shrink-0" />
            <span>Reprèn</span>
          </span>
          <span className="font-mono tabular-nums font-bold text-base">
            {fmt(elapsed)}
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleStart}
          className="w-full min-h-[44px] px-4 rounded-lg bg-[#121212] hover:bg-white/5 border border-white/10 active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
        >
          <Pause className="w-4 h-4 text-[#E5C07B] shrink-0" />
          <span>Pausa</span>
        </button>
      )}

      <div className="flex items-center justify-between px-1 text-xs">
        <span className="flex items-center gap-1.5 text-white/60">
          <Timer className="w-3.5 h-3.5 text-[#E5C07B] shrink-0" />
          <span>Total no jugat</span>
        </span>
        <span className="font-mono tabular-nums font-semibold text-[#E5C07B]">
          {fmt(totalPausedSec)}
        </span>
      </div>

      {pauses.length === 0 ? (
        <p className="text-xs text-white/40 text-center py-1">
          Cap pausa apuntada
        </p>
      ) : (
        <ul className="space-y-1">
          {pauses.map((p, index) => {
            const dur = Math.max(0, toSec(p.to) - toSec(p.from));
            return (
              <li
                key={`${p.from}-${p.to}-${index}`}
                className="flex items-center justify-between gap-2 bg-[#121212] border border-white/5 rounded-lg pl-3 pr-1 text-xs"
              >
                <span className="font-mono tabular-nums text-white/90">
                  {p.from} → {p.to}
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-mono tabular-nums text-white/50">
                    {fmt(dur)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    aria-label="Esborra pausa"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-white/40 hover:text-red-400 hover:bg-white/5 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
