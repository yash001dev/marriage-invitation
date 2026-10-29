"use client";

import { useState } from "react";
import { wedding, type Photo } from "@/config/wedding";
import { bgStyle } from "@/lib/utils";
import Html, { Rule } from "../Html";

/* a monogram placeholder for photos that have not been added yet */
function Placeholder({ name }: { name: string }) {
  const initial = (name || "").trim().charAt(0) || "❀";
  return (
    <div className="pcard__ph">
      <b>{initial}</b>
      <i>Add your photo</i>
    </div>
  );
}

function PhotoCard({ p, index }: { p: Photo; index: number }) {
  const [missing, setMissing] = useState(!p.image);
  // photos lean left, then right, so the page zigzags
  const side = index % 2 === 0 ? "left" : "right";
  return (
    <figure className={`pcard reveal reveal--${side}`} data-side={side}>
      <div className="pcard__media">
        {missing ? (
          <Placeholder name={p.name} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image}
            alt={p.name || ""}
            width={p.width}
            height={p.height}
            loading="lazy"
            decoding="async"
            onError={() => setMissing(true)}
          />
        )}
      </div>
      <figcaption className="pcard__cap">
        <b>{p.name}</b>
        {p.caption ? <span>{p.caption}</span> : null}
      </figcaption>
    </figure>
  );
}

export default function Couple() {
  const m = wedding.meetTheCouple;
  return (
    <section className="sec" id="couple">
      <div className="bgmedia bgimg" style={bgStyle(m.backgroundImage)} />
      <div className="scrim" />
      <div className="wrap wrap--center">
        <div className="sec-head">
          <p className="eyebrow reveal">Our Story</p>
          <Html as="h2" className="h2 reveal" html={m.heading} />
          <Rule />
          <Html className="lead reveal" html={m.text} />
        </div>
        <div className="grid-couple">
          {m.photos.map((p, i) => (
            <PhotoCard key={i} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
