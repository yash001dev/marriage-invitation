import { wedding } from "@/config/wedding";
import { bgStyle } from "@/lib/utils";
import Html, { Rule } from "../Html";

export default function Family() {
  const f = wedding.withLove;
  return (
    <section className="sec" id="family">
      <div className="bgmedia bgimg" style={bgStyle(f.backgroundImage)} />
      <div className="scrim" />
      <div className="wrap wrap--center">
        <div className="sec-head">
          <p className="eyebrow reveal">Our Families</p>
          <Html as="h2" className="h2 reveal" html={f.heading} />
          <Rule />
          <Html className="lead reveal" html={f.text} />
        </div>
        <div className="grid-family">
          {f.families.map((fam, i) => (
            <div className="fcard reveal" key={i}>
              <Html className="fcard__side" html={fam.side} />
              <Html className="fcard__name" html={fam.familyName} />
              <Html className="fcard__parents" html={fam.parents} />
              <Html className="fcard__note" html={fam.note} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
