"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { bgStyle, onScrollFrame, prefersReducedMotion } from "@/lib/utils";
import Html, { Rule } from "./Html";
import Hero from "./sections/Hero";
import Scratch from "./sections/Scratch";
import Couple from "./sections/Couple";
import Events from "./sections/Events";
import Family from "./sections/Family";
import Venue from "./sections/Venue";
import Blessings from "./sections/Blessings";
import Footer from "./sections/Footer";
import Petals from "./Petals";
import Lightbox from "./Lightbox";

export default function Invitation() {
  const { couple: c, opening: o, introVideo: iv, music: m } = wedding;

  const gateRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const introVideoRef = useRef<HTMLVideoElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const opened = useRef(false);
  const enteredRef = useRef(false);
  const musicReady = useRef(false);

  const [entered, setEntered] = useState(false);
  const [musicVisible, setMusicVisible] = useState(false);
  const [muted, setMuted] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  /* ------------------------------------------------------------ music */

  const musicStart = () => (typeof m.startAt === "number" && m.startAt > 0 ? m.startAt : 0);

  // jump to the start point, but never rewind a guest who is already listening
  const seekToStart = useCallback(() => {
    const a = audioRef.current, start = musicStart();
    if (!a || !start) return;
    try { if (a.currentTime < start) a.currentTime = start; } catch { /* metadata not ready */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playMusic = useCallback(() => {
    const a = audioRef.current;
    if (!m.enabled || !m.src || !a) return;
    seekToStart();
    a.play()
      .then(() => { seekToStart(); setMusicVisible(true); setMuted(false); })
      // autoplay blocked — show the button so the guest can start it
      .catch(() => { if (musicReady.current) { setMusicVisible(true); setMuted(true); } });
  }, [m.enabled, m.src, seekToStart]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a || !m.enabled || !m.src) return;
    a.volume = typeof m.volume === "number" ? m.volume : 0.35;
    a.loop = false; // looped by hand so it restarts at startAt, not 0:00
    const onEnded = () => {
      try { a.currentTime = musicStart(); } catch {}
      a.play().catch(() => {});
    };
    const onError = () => { setMusicVisible(false); musicReady.current = false; };
    const onCanPlay = () => { musicReady.current = true; };
    a.addEventListener("loadedmetadata", seekToStart);
    a.addEventListener("ended", onEnded);
    a.addEventListener("error", onError);
    a.addEventListener("canplay", onCanPlay);
    if (a.readyState >= 1) seekToStart();
    return () => {
      a.removeEventListener("loadedmetadata", seekToStart);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("error", onError);
      a.removeEventListener("canplay", onCanPlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) playMusic();
    else { a.pause(); setMuted(true); }
  };

  /* ------------------------------------- opening → intro video → site */

  const enterSite = useCallback(() => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    const reduce = prefersReducedMotion();
    const intro = introRef.current, video = introVideoRef.current;

    // the gold flash carries the video into the hero
    if (!reduce) flashRef.current?.classList.add("is-flash");

    setEntered(true);
    window.scrollTo(0, 0);
    heroVideoRef.current?.play().catch(() => {});
    playMusic();

    setTimeout(() => {
      intro?.classList.add("is-out");
      document.body.classList.remove("is-locked");
      setTimeout(() => {
        if (intro) intro.hidden = true;
        if (video) { video.pause(); video.removeAttribute("src"); video.load(); }
      }, 800);
    }, reduce ? 60 : 420);
  }, [playMusic]);

  const openInvitation = () => {
    if (opened.current) return;
    opened.current = true;
    const gate = gateRef.current, intro = introRef.current, video = introVideoRef.current;

    if (!iv.src || !intro || !video) {
      gate?.classList.add("is-out");
      enterSite();
      return;
    }

    // everything below runs inside the tap, which is what lets sound play
    intro.hidden = false;
    video.src = iv.src;
    video.muted = iv.sound === false;
    video.addEventListener("ended", enterSite);
    video.addEventListener("error", enterSite);
    video.play().catch(() => {
      // some browsers still refuse sound — retry muted rather than fail
      video.muted = true;
      video.play().catch(enterSite);
    });

    document.body.classList.add("is-locked");
    requestAnimationFrame(() => intro.classList.add("is-in"));
    gate?.classList.add("is-out");
    setTimeout(() => { if (gate) gate.style.display = "none"; }, 950);

    // safety net: never leave a guest stuck if the video stalls
    setTimeout(enterSite, 30000);
  };

  const scrollToScratch = () => {
    document.getElementById("scratch")?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  };

  /* ------------------------------------------------------ scroll reveal */

  useEffect(() => {
    if (!entered) return;
    const all = () => Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-in)"));

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      all().forEach((el) => el.classList.add("is-in"));
      return;
    }

    let observer: IntersectionObserver | null = null;
    const showNow = (el: Element) => {
      if (el.classList.contains("is-in")) return;
      el.classList.add("is-in");
      observer?.unobserve(el);
      if (el.classList.contains("h2")) window.__petalBurst?.();
    };

    observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) showNow(e.target); }),
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    all().forEach((el) => observer!.observe(el));

    // safety net: a fast flick can carry an element past the viewport between
    // two observer samples — reveal anything that has reached the screen
    const sweep = () => {
      const limit = window.innerHeight * 0.94;
      all().forEach((el) => { if (el.getBoundingClientRect().top < limit) showNow(el); });
    };
    const stop = onScrollFrame(sweep);
    sweep();

    return () => { observer?.disconnect(); stop(); };
  }, [entered]);

  useEffect(() => {
    if (c.browserTitle) document.title = c.browserTitle;
  }, [c.browserTitle]);

  return (
    <>
      {/* 1 · OPENING SCREEN */}
      <div className="gate" ref={gateRef}>
        <div className="gate__bg" style={bgStyle(o.backgroundImage)} />
        <div className="gate__veil" />
        <div className="gate__inner">
          <div className="orn orn--top" aria-hidden="true" />
          <Html className="gate__eyebrow" html={o.eyebrow} />
          <Html className="gate__sub" html={o.subLine} />
          <h1 className="gate__names">
            <Html as="span" className="nm" html={c.groomName} />{" "}
            <Html as="span" className="amp" html={c.separator || "&"} />{" "}
            <Html as="span" className="nm" html={c.brideName} />
          </h1>
          <Rule reveal={false} />
          <Html className="gate__date" html={o.dateLine} />
          <button className="btn btn--gate" type="button" onClick={openInvitation}>
            <span>{o.buttonText || "Open Invitation"}</span>
          </button>
          <Html className="gate__hint" html={o.hintText} />
          <Html className="gate__tag" html={c.hashtag} />
          <div className="orn orn--bottom" aria-hidden="true" />
        </div>
      </div>

      {/* 2 · INTRO ANIMATION */}
      <div className="intro" ref={introRef} hidden>
        <video className="intro__video" ref={introVideoRef} playsInline preload="auto" />
        {iv.allowSkip ? (
          <button className="intro__skip" type="button" onClick={enterSite}>
            {iv.skipText || "Skip"}
          </button>
        ) : null}
        <div className="intro__flash" ref={flashRef} />
      </div>

      {/* THE WEBSITE */}
      <main className="site" hidden={!entered}>
        <Hero videoRef={heroVideoRef} onScrollDown={scrollToScratch} />
        <Scratch />
        <Couple />
        <Events active={entered} onOpen={setLightbox} />
        <Family />
        <Venue />
        <Blessings />
        <Footer />
      </main>

      {entered ? <Petals /> : null}

      {/* MUSIC BUTTON */}
      <button
        className={`music${muted ? " is-muted" : ""}`}
        type="button"
        hidden={!musicVisible}
        aria-label="Toggle background music"
        onClick={toggleMusic}
      >
        <span className="music__bars"><i /><i /><i /><i /></span>
      </button>
      {m.enabled && m.src ? <audio ref={audioRef} src={m.src} preload="metadata" /> : null}

      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
