import React, { useEffect, useRef } from 'react';

const COLORS = ['#E5C07B', '#F0D090', '#C0392B', '#ffffff', '#f39c12', '#4ade80'];
const rand = (a, b) => a + Math.random() * (b - a);

// Dos canons des de baix + una pluja suau. La física va per temps (no per fotograma),
// així es veu igual a 60 i a 120 Hz, i els trossos giren en 3D i s'esvaeixen sense tall.
export default function Confetti({ active, delay = 0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const mk = (x, y, vx, vy, delayS = 0) => ({
      x, y, vx, vy, delayS,
      w: rand(6, 11), h: rand(4, 7),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: rand(0, Math.PI * 2), spin: rand(-6, 6),
      flip: rand(0, Math.PI * 2), flipSpeed: rand(4, 10),
      life: rand(3.2, 4.6), age: 0, round: Math.random() < 0.2,
    });

    const parts = [];
    const cannon = (x, dir) => {
      for (let i = 0; i < 55; i++) {
        const ang = (-Math.PI / 2) + dir * rand(0.12, 0.62);
        const sp = rand(700, 1350) * Math.min(1, H / 800 + 0.35);
        parts.push(mk(x, H + 10, Math.cos(ang) * sp, Math.sin(ang) * sp, rand(0, 0.18)));
      }
    };
    cannon(0, 1);
    cannon(W, -1);
    for (let i = 0; i < 70; i++) parts.push(mk(rand(0, W), rand(-40, -10), rand(-30, 30), rand(60, 140), rand(0.5, 2.2)));

    let raf, last = performance.now(), t0 = last;
    const tick = now => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      const el = (now - t0) / 1000;
      for (const p of parts) {
        if (el < p.delayS) { alive = true; continue; }
        p.age += dt;
        if (p.age >= p.life) continue;
        alive = true;
        const drag = Math.pow(0.35, dt);
        p.vx *= drag; p.vy = p.vy * drag + 900 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.rot += p.spin * dt; p.flip += p.flipSpeed * dt;
        const fade = Math.min(1, (p.life - p.age) / 0.9);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.flip));
        ctx.globalAlpha = fade;
        ctx.fillStyle = p.color;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.h * 0.7, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W, H);
    };
    const start = setTimeout(() => { last = t0 = performance.now(); raf = requestAnimationFrame(tick); }, delay);
    return () => { clearTimeout(start); cancelAnimationFrame(raf); ctx.clearRect(0, 0, W, H); };
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9995]"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
