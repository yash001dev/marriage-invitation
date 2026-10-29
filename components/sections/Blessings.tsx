"use client";

import { useRef, useState, type FormEvent } from "react";
import { wedding } from "@/config/wedding";
import { bgStyle } from "@/lib/utils";
import Html, { Rule } from "../Html";

/* Opens WhatsApp with the guest's message already typed out. Nothing is sent
   from the website itself — they still press send inside WhatsApp. */
export default function Blessings() {
  const b = wedding.blessings;
  const [msg, setMsg] = useState("");
  const [warn, setWarn] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  if (b.enabled === false || !b.whatsappNumber) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = msg.trim();
    if (!text) {
      setWarn(b.emptyWarning || "Please write a message first.");
      inputRef.current?.focus();
      return;
    }
    setWarn("");
    const full = b.messagePrefix ? `${b.messagePrefix}\n\n${text}` : text;
    const number = String(b.whatsappNumber).replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(full)}`, "_blank", "noopener");
  };

  return (
    <section className="sec" id="blessings">
      <div className="bgmedia bgimg" style={bgStyle(b.backgroundImage)} />
      <div className="scrim" />
      <div className="wrap wrap--center">
        <div className="sec-head">
          <p className="eyebrow reveal">A Word From You</p>
          <Html as="h2" className="h2 reveal" html={b.heading} />
          <Rule />
          <Html className="lead reveal" html={b.text} />
        </div>

        <form className="blessing reveal" noValidate onSubmit={submit}>
          <label className="blessing__label" htmlFor="blessingInput">
            {b.placeholder ? "Your blessing" : "Your message"}
          </label>
          <textarea
            ref={inputRef}
            id="blessingInput"
            className="blessing__input"
            rows={4}
            maxLength={900}
            autoComplete="off"
            placeholder={b.placeholder || ""}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <p className={`blessing__note${warn ? " is-warn" : ""}`} role="status" aria-live="polite">
            {warn}
          </p>
          <button className="btn" type="submit">{b.buttonText || "Send Blessing"}</button>
        </form>
      </div>
    </section>
  );
}
