"use client";

import { useEffect, useRef } from "react";

type Petal = {
  x: number; y: number; r: number; speed: number; drift: number;
  spin: number; angle: number; alpha: number; colour: string;
};

declare global {
  interface Window { __petalBurst?: () => void }
}

/** Soft falling petals. Scrolling stirs them; a new section adds a flurry. */
export default function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // soft blurred shapes — a full-retina canvas buys nothing visually
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const count = window.innerWidth < 760 ? 16 : 28;
    const colours = ["rgba(226,120,160,", "rgba(240,160,190,", "rgba(232,207,139,"];

    const size = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (initial: boolean): Petal => ({
      x: Math.random() * window.innerWidth,
      y: initial ? Math.random() * window.innerHeight : -30,
      r: 4 + Math.random() * 6,
      speed: 0.35 + Math.random() * 0.85,
      drift: (Math.random() - 0.5) * 0.7,
      spin: (Math.random() - 0.5) * 0.03,
      angle: Math.random() * Math.PI * 2,
      alpha: 0.25 + Math.random() * 0.4,
      colour: colours[Math.floor(Math.random() * colours.length)],
    });

    const petals: Petal[] = Array.from({ length: count }, () => spawn(true));
    const extras: Petal[] = [];

    let boost = 0, lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      boost = Math.min(boost + Math.abs(y - lastY) * 0.035, 7);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    window.__petalBurst = () => {
      if (petals.length + extras.length > count + 26) return;
      for (let i = 0; i < 7; i++) {
        const p = spawn(false);
        p.y = -20 - Math.random() * 90;
        p.speed *= 1.5;
        extras.push(p);
      }
    };

    const draw = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.colour + p.alpha + ")";
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    const step = (p: Petal) => {
      p.y += p.speed * (1 + boost);
      p.x += p.drift * (1 + boost * 0.5) + Math.sin(p.y / 60) * (0.4 + boost * 0.25);
      p.angle += p.spin * (1 + boost * 1.4);
    };

    let raf = 0;
    const frame = () => {
      boost *= 0.92;
      if (boost < 0.01) boost = 0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      petals.forEach((p, i) => {
        step(p);
        if (p.y > window.innerHeight + 30) petals[i] = spawn(false);
        draw(p);
      });
      for (let i = extras.length - 1; i >= 0; i--) {
        step(extras[i]);
        if (extras[i].y > window.innerHeight + 30) { extras.splice(i, 1); continue; }
        draw(extras[i]);
      }
      raf = requestAnimationFrame(frame);
    };

    size();
    window.addEventListener("resize", size);
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", size);
      delete window.__petalBurst;
    };
  }, []);

  return <canvas id="petals" ref={ref} />;
}
