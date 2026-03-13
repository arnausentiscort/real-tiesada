import React, { useEffect, useRef } from 'react';

export default function Confetti({ active }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#E5C07B', '#C0392B', '#fff', '#f39c12', '#e74c3c', '#f1c40f'];
    particles.current = Array.from({ length: 120 }, () => ({
      x:     Math.random() * canvas.width,
      y:     -10 - Math.random() * 100,
      w:     6 + Math.random() * 8,
      h:     3 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx:    (Math.random() - 0.5) * 3,
      vy:    2 + Math.random() * 4,
      angle: Math.random() * Math.PI * 2,
      spin:  (Math.random() - 0.5) * 0.2,
      alpha: 1,
    }));

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      particles.current.forEach(p => {
        p.x     += p.vx;
        p.y     += p.vy;
        p.vy    += 0.05;
        p.angle += p.spin;
        if (frame > 80) p.alpha -= 0.012;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle   = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (particles.current.some(p => p.alpha > 0)) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
