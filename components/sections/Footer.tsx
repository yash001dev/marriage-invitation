import { wedding } from "@/config/wedding";
import { bgStyle, coupleNames } from "@/lib/utils";
import Html, { Rule } from "../Html";

export default function Footer() {
  const f = wedding.footer, c = wedding.couple;
  return (
    <footer className="sec sec--footer" id="footer">
      <div className="bgmedia bgimg" style={bgStyle(f.backgroundImage)} />
      <div className="scrim scrim--deep" />
      <div className="wrap wrap--center">
        <div className="orn orn--top" aria-hidden="true" />
        <Html as="h2" className="names names--footer reveal" html={coupleNames()} />
        <Html className="foot-date reveal" html={c.weddingDate} />
        <Rule />
        <Html className="lead lead--foot reveal" html={f.closingLine} />
        <Html className="foot-sign reveal" html={f.signOff} />
        <Html className="tag reveal" html={c.hashtag} />
        <div className="orn orn--bottom" aria-hidden="true" />
      </div>
    </footer>
  );
}
