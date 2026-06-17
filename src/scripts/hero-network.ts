type Point = { x: number; y: number; vx: number; vy: number };
type RGB = [number, number, number];

/**
 * Animated particle network behind the hero. Points drift and connect with
 * thin lines (and to the cursor) in the brand gradient (violet→pink→amber).
 * Fills the hero, pauses when scrolled out of view, and renders a single
 * static frame when prefers-reduced-motion is set.
 */
export function initHeroNetwork(): void {
  const canvas = document.getElementById("hero-net") as HTMLCanvasElement | null;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const stops: RGB[] = [
    [124, 58, 237], // violet
    [236, 72, 153], // pink
    [245, 158, 11], // amber
  ];
  const colorAt = (t: number): RGB => {
    t = Math.max(0, Math.min(1, t));
    const [a, b, k] = t < 0.5 ? [stops[0], stops[1], t * 2] : [stops[1], stops[2], (t - 0.5) * 2];
    return [
      Math.round(a[0] + (b[0] - a[0]) * k),
      Math.round(a[1] + (b[1] - a[1]) * k),
      Math.round(a[2] + (b[2] - a[2]) * k),
    ];
  };

  const maxDist = 150;
  let w = 0;
  let h = 0;
  let raf = 0;
  let pts: Point[] = [];
  const mouse = { x: -9999, y: -9999 };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const resize = (): void => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(40, Math.min(110, Math.round((w * h) / 14000)));
    pts = [];
    for (let i = 0; i < count; i++) {
      pts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }
  };

  const render = (): void => {
    ctx.clearRect(0, 0, w, h);

    for (const p of pts) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }

    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxDist) {
          const c = colorAt((a.x + b.x) / 2 / w);
          const al = (1 - d / maxDist) * 0.4;
          ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${al})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      const md = maxDist * 1.3;
      const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (dm < md) {
        const c = colorAt(a.x / w);
        const al = (1 - dm / md) * 0.55;
        ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${al})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }

    for (const p of pts) {
      const c = colorAt(p.x / w);
      ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const loop = (): void => {
    render();
    raf = requestAnimationFrame(loop);
  };
  const start = (): void => {
    if (!raf) loop();
  };
  const stop = (): void => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  resize();

  if (reduce) {
    render();
  } else {
    start();
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? start() : stop())),
      { threshold: 0 },
    );
    io.observe(canvas);
  }

  window.addEventListener("resize", () => {
    resize();
    if (reduce) render();
  });
  window.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
}
