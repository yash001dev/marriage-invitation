"use client";

import { useEffect, useState } from "react";

/** Full-size invitation cards — never cropped or compressed. */
export default function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  const [shown, setShown] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (src) {
      setShown(src);
      document.body.classList.add("is-locked");
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    document.body.classList.remove("is-locked");
    const t = setTimeout(() => setShown(null), 400);
    return () => clearTimeout(t);
  }, [src]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!shown) return null;
  return (
    <div
      className={`lightbox${visible ? " is-in" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button className="lightbox__close" type="button" aria-label="Close" onClick={onClose}>
        &times;
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="lightbox__img" src={shown} alt="" />
    </div>
  );
}
