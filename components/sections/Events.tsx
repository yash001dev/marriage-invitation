"use client";

import { useEffect, useRef, useState } from "react";
import { wedding, type WeddingEvent } from "@/config/wedding";
import { bgStyle, onScrollFrame, rgbOf } from "@/lib/utils";
import Html, { Rule } from "../Html";

const Corners = () => (
  <>
    <i className="cnr cnr--tl" />
    <i className="cnr cnr--tr" />
    <i className="cnr cnr--bl" />
    <i className="cnr cnr--br" />
  </>
);

function EventCard({
  ev,
  index,
  onOpen,
}: {
  ev: WeddingEvent;
  index: number;
  onOpen: (src: string) => void;
}) {
  const e = wedding.celebrations;
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  // toggled on the element itself so React never overwrites the reveal class
  useEffect(() => {
    cardRef.current?.classList.toggle("is-flipped", flipped);
  }, [flipped]);
  const side = index % 2 === 0 ? "left" : "right";
  const colour = rgbOf(ev.colour);
  const rows = (
    [
      ["Date", ev.date],
      ["Time", ev.time],
      ["Venue", ev.venue],
      ["Dress Code", ev.dressCode],
    ] as const
  ).filter(([, v]) => v);
  const label = flipped
    ? e.backButton || "Back to the Invitation"
    : (e.detailsButton || "View {event} Details").replace("{event}", ev.title || "");

  return (
    <article
      ref={cardRef}
      className={`ecard reveal reveal--${side}`}
      data-side={side}
      data-colour={colour ?? undefined}
    >
      {/* the details live on the BACK of the card — the button turns it over */}
      <div className="ecard__flip">
        <div className="ecard__face ecard__face--front" aria-hidden={flipped}>
          <Corners />
          {ev.image ? (
            <button
              className="ecard__media"
              type="button"
              tabIndex={flipped ? -1 : 0}
              aria-label={`View the full ${ev.title} invitation`}
              onClick={() => onOpen(ev.full || ev.image)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ev.image}
                alt={`${ev.title} invitation card`}
                width={ev.width}
                height={ev.height}
                loading="lazy"
                decoding="async"
              />
            </button>
          ) : null}
        </div>
        <div className="ecard__face ecard__face--back" aria-hidden={!flipped}>
          <Corners />
          <div className="ecard__back">
            <p className="ecard__back-eyebrow">You are invited to our</p>
            <Html as="h4" className="ecard__back-title" html={ev.title} />
            <div className="ecard__back-rule"><i /><span>&#10022;</span><i /></div>
            {rows.length ? (
              <dl className="ecard__meta">
                {rows.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd dangerouslySetInnerHTML={{ __html: v as string }} />
                  </div>
                ))}
              </dl>
            ) : null}
            <Html className="ecard__back-note" html={ev.text} />
          </div>
        </div>
      </div>
      <div className="ecard__body">
        <Html as="h3" className="ecard__title" html={ev.title} />
        <Html className="ecard__text" html={ev.text} />
        <button
          className="btn btn--flip ecard__toggle"
          type="button"
          aria-expanded={flipped}
          onClick={() => setFlipped((f) => !f)}
        >
          <span>{label}</span>
        </button>
      </div>
    </article>
  );
}

export default function Events({
  active,
  onOpen,
}: {
  active: boolean;
  onOpen: (src: string) => void;
}) {
  const e = wedding.celebrations;
  const secRef = useRef<HTMLElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);

  /* COLOUR WASH — the background takes on the colour of whichever invitation
     fills the most of the screen, once it covers at least a quarter of it. */
  useEffect(() => {
    if (!active) return;
    const sec = secRef.current, tint = tintRef.current;
    if (!sec || !tint) return;
    const cards = Array.from(sec.querySelectorAll<HTMLElement>(".ecard[data-colour]"));
    if (!cards.length) return;
    let current: string | null | undefined;

    const paint = (rgb: string | null) => {
      if (rgb === current) return;
      current = rgb;
      tint.style.background = rgb
        ? `radial-gradient(140% 95% at 50% 50%, rgba(${rgb},.96) 0%, rgba(${rgb},.88) 62%, rgba(${rgb},.70) 100%)`
        : "";
      tint.classList.toggle("is-on", !!rgb);
      // pale washes need dark type, deep ones need light type
      let light = false;
      if (rgb) {
        const [r, g, b] = rgb.split(",").map(Number);
        light = (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
      }
      sec.classList.toggle("is-light", light);
    };

    const update = () => {
      const vh = window.innerHeight;
      let best: HTMLElement | null = null, bestVisible = 0;
      cards.forEach((card) => {
        const box = card.getBoundingClientRect();
        const visible = Math.min(box.bottom, vh) - Math.max(box.top, 0);
        if (visible > bestVisible) { bestVisible = visible; best = card; }
      });
      paint(best && bestVisible >= vh * 0.25 ? (best as HTMLElement).getAttribute("data-colour") : null);
    };

    const stop = onScrollFrame(update);
    update();
    return stop;
  }, [active]);

  return (
    <section className="sec" id="events" ref={secRef}>
      <div className="bgmedia bgimg" style={bgStyle(e.backgroundImage)} />
      <div className="scrim" />
      <div className="tint" ref={tintRef} aria-hidden="true" />
      <div className="wrap wrap--center">
        <div className="sec-head">
          <p className="eyebrow reveal">The Celebrations</p>
          <Html as="h2" className="h2 reveal" html={e.heading} />
          <Rule />
          <Html className="lead reveal" html={e.text} />
        </div>
        <div className="grid-events">
          {e.events.map((ev, i) => (
            <EventCard key={i} ev={ev} index={i} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}
