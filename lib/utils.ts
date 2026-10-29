import { wedding } from "@/config/wedding";

/** true when a config line was left empty, so the element should disappear */
export const isBlank = (v?: string | null) => v == null || String(v).trim() === "";

/** "#E3A008" -> "227,160,8" so it can be used inside rgba() */
export function rgbOf(hex?: string): string | null {
  let h = String(hex || "").replace("#", "").trim();
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length !== 6 || /[^0-9a-f]/i.test(h)) return null;
  return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
}

export function coupleNames() {
  const c = wedding.couple;
  return [c.groomName, c.separator || "&", c.brideName].filter(Boolean).join(" ");
}

export const bgStyle = (src?: string) =>
  src ? ({ backgroundImage: `url("${src}")` } as React.CSSProperties) : undefined;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * One shared, throttled scroll listener. The throttle never latches: rAF is
 * paused in background tabs, so a timer is a guaranteed release.
 * Returns a cleanup function.
 */
export function onScrollFrame(job: () => void) {
  let ticking = false;
  const release = () => {
    if (!ticking) return;
    ticking = false;
    job();
  };
  const schedule = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(release);
    setTimeout(release, 120);
  };
  const onVisible = () => {
    if (!document.hidden) { ticking = false; job(); }
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", job);
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", job);
    document.removeEventListener("visibilitychange", onVisible);
  };
}
