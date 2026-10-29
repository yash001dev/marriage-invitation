import { wedding } from "@/config/wedding";
import { bgStyle } from "@/lib/utils";
import Html, { Rule } from "../Html";

export default function Venue() {
  const v = wedding.venue;
  return (
    <section className="sec" id="venue">
      {/* a video background is optional — the image is used when it is empty */}
      {v.backgroundVideo ? (
        <video className="bgmedia" src={v.backgroundVideo} autoPlay muted loop playsInline />
      ) : (
        <div className="bgmedia bgimg" style={bgStyle(v.backgroundImage)} />
      )}
      <div className="scrim" />
      <div className="wrap wrap--center">
        <div className="sec-head">
          <p className="eyebrow reveal">Where</p>
          <Html as="h2" className="h2 reveal" html={v.heading} />
          <Rule />
          <Html className="lead reveal" html={v.text} />
        </div>
        <div className="venue-card reveal">
          <Html className="venue-card__name" html={v.name} />
          <Html className="venue-card__addr" html={v.address} />
          <a className="btn btn--ghost" href={v.mapsLink || "#"} target="_blank" rel="noopener noreferrer">
            {v.buttonText || "Open in Google Maps"}
          </a>
        </div>
      </div>
    </section>
  );
}
