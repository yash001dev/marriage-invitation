"use client";

import { useEffect, useRef } from "react";
import { wedding } from "@/config/wedding";
import { bgStyle } from "@/lib/utils";
import Html, { Rule } from "../Html";

/** Gold-foil scratch card that hides the wedding date. */
export default function Scratch() {
  const s = wedding.scratch;
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    if (!card || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    let drawing = false;
    let last: { x: number; y: number } | null = null;

    const paintCover = () => {
      const rect = card.getBoundingClientRect();
      // the card has no size until the site is visible — nothing to paint yet
      if (doneRef.current || rect.width < 2 || rect.height < 2) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = rect.width, h = rect.height;

      // gold foil surface
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0.0, "#b98f2c");
      grad.addColorStop(0.26, "#e8cf8b");
      grad.addColorStop(0.48, "#c9a227");
      grad.addColorStop(0.72, "#f2e0a8");
      grad.addColorStop(1.0, "#a67c22");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // faint diagonal weave
      ctx.strokeStyle = "rgba(255,255,255,.13)";
      ctx.lineWidth = 1;
      for (let x = -h; x < w; x += 9) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h, h); ctx.stroke();
      }

      // inner hairline frame
      ctx.strokeStyle = "rgba(90,50,20,.5)";
      ctx.strokeRect(9.5, 9.5, w - 19, h - 19);

      // label
      const label = s.coverLabel || "Scratch Here";
      ctx.fillStyle = "rgba(74,38,14,.82)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const size = Math.max(11, Math.min(16, w * 0.038));
      ctx.font = `600 ${size}px "Cinzel", Georgia, serif`;
      ctx.fillText(label.toUpperCase().split("").join(" "), w / 2, h / 2 + Math.min(46, h * 0.19));
    };

    const pointFrom = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = "touches" in e ? e.touches[0] : e;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };

    const scratchAt = (p: { x: number; y: number }) => {
      const radius = Math.max(18, canvas.getBoundingClientRect().width * 0.075);
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = radius * 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (last) {
        ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI * 2); ctx.fill();
      last = p;
    };

    // how much of the foil has been removed (samples every 32nd pixel)
    const clearedRatio = () => {
      const { width: w, height: h } = canvas;
      if (!w || !h) return 0;
      const data = ctx.getImageData(0, 0, w, h).data;
      let clear = 0, total = 0;
      for (let i = 3; i < data.length; i += 4 * 32) { total++; if (data[i] < 32) clear++; }
      return total ? clear / total : 0;
    };

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      card.classList.add("is-done");
    };

    const start = (e: MouseEvent | TouchEvent) => {
      if (doneRef.current) return;
      drawing = true; last = null;
      card.classList.add("is-touched");
      scratchAt(pointFrom(e));
      e.preventDefault();
    };
    const move = (e: MouseEvent | TouchEvent) => {
      if (!drawing || doneRef.current) return;
      scratchAt(pointFrom(e));
      e.preventDefault();
    };
    const end = () => {
      if (!drawing) return;
      drawing = false; last = null;
      if (!doneRef.current && clearedRatio() > 0.45) finish();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); finish(); }
    };

    canvas.addEventListener("mousedown", start);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);
    window.addEventListener("touchcancel", end);
    canvas.addEventListener("keydown", key);

    // repaints once the site is shown (the card has no size before that)
    const ro = new ResizeObserver(() => paintCover());
    ro.observe(card);
    paintCover();
    // repaint after the web font arrives so the label uses Cinzel
    document.fonts?.ready.then(paintCover);

    return () => {
      ro.disconnect();
      canvas.removeEventListener("mousedown", start);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
      window.removeEventListener("touchcancel", end);
      canvas.removeEventListener("keydown", key);
    };
  }, [s.coverLabel]);

  return (
    <section className="sec" id="scratch">
      <div className="bgmedia bgimg" style={bgStyle(s.backgroundImage)} />
      <div className="scrim" />
      <div className="wrap wrap--center">
        <div className="sec-head">
          <p className="eyebrow reveal">A Little Secret</p>
          <Html as="h2" className="h2 reveal" html={s.heading} />
          <Rule />
          <Html className="lead reveal" html={s.text} />
        </div>

        <div className="card-scratch reveal" ref={cardRef}>
          <div className="card-scratch__under">
            <Html className="cs-small" html={s.revealSmallText} />
            <Html className="cs-big" html={s.revealBigText} />
            <Html className="cs-sub" html={s.revealSubText} />
          </div>
          <canvas
            ref={canvasRef}
            className="card-scratch__cover"
            tabIndex={0}
            role="button"
            aria-label="Scratch to reveal the wedding date"
          />
          <div className="card-scratch__hint"><span /></div>
        </div>
      </div>
    </section>
  );
}
