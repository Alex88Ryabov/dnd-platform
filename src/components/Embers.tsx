import { useEffect, useRef } from 'react';

interface Ember {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  hue: number;
  alpha: number;
  phase: number;
}

// Мягкие парящие искры на фоне всего приложения
export function Embers() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    let raf = 0;
    let width = 0;
    let height = 0;
    const embers: Ember[] = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = Math.min(46, Math.floor(width / 30));
    for (let i = 0; i < COUNT; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.8 + Math.random() * 1.9,
        vy: 0.12 + Math.random() * 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        hue: Math.random() < 0.72 ? 42 : 265,
        alpha: 0.25 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, width, height);
      for (const e of embers) {
        e.y -= e.vy;
        e.x += e.vx + Math.sin(t + e.phase) * 0.12;
        if (e.y < -8) {
          e.y = height + 8;
          e.x = Math.random() * width;
        }
        const twinkle = 0.55 + 0.45 * Math.sin(t * 1.7 + e.phase);
        const a = e.alpha * twinkle;
        const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4);
        grad.addColorStop(0, `hsla(${e.hue}, 80%, 68%, ${a})`);
        grad.addColorStop(1, `hsla(${e.hue}, 80%, 68%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.75,
      }}
    />
  );
}
