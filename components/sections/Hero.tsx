import type { RefObject } from "react";
import { wedding } from "@/config/wedding";
import { coupleNames } from "@/lib/utils";
import Html, { Rule } from "../Html";

export default function Hero({
  videoRef,
  onScrollDown,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  onScrollDown: () => void;
}) {
  const h = wedding.hero;
  return (
    <section className="sec sec--hero" id="hero">
      <video
        ref={videoRef}
        className="bgmedia"
        src={h.backgroundVideo || undefined}
        poster={h.posterImage || undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="scrim scrim--hero" />
      <div className="wrap wrap--center">
        <Html className="eyebrow reveal" html={h.eyebrow} />
        <Html as="h2" className="h-script reveal" html={h.heading} />
        <Rule />
        <Html className="lead reveal" html={h.subheading} />
        <Html as="h3" className="names reveal" html={coupleNames()} />
        <Html className="tag reveal" html={wedding.couple.hashtag} />
      </div>

      {/* a gold thread with a drop travelling down it, and chevrons beneath */}
      <button className="scroller reveal" type="button" aria-label="Scroll down" onClick={onScrollDown}>
        <span className="scroller__label">{h.buttonText || "Scroll"}</span>
        <span className="scroller__line" aria-hidden="true"><i /></span>
        <span className="scroller__chevs" aria-hidden="true"><b /><b /></span>
      </button>
    </section>
  );
}
