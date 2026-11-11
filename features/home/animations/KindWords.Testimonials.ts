"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

/** How long each testimonial is told before the next one (s). */
export const TESTIMONIAL_SECONDS = 5;
/** The bubble grows out of Arjun's mouth… */
const GROW = { duration: 0.75, ease: "back.out(1.2)" };
/** …and is swallowed back before the next one. */
const SHRINK = { duration: 0.35, ease: "power2.in" };

/** Point the bubble's transform origin at Arjun's mouth (in the bubble's own px). */
function growFromMouth(bubble: HTMLElement, mouth: Element | null | undefined) {
  if (!mouth) return;
  const scale = gsap.getProperty(bubble, "scale");
  gsap.set(bubble, { scale: 1 });
  const box = bubble.getBoundingClientRect();
  const point = mouth.getBoundingClientRect();
  const k = bubble.offsetWidth / box.width || 1; // undo any scaling of the bubble's parents
  gsap.set(bubble, { scale, transformOrigin: `${(point.left - box.left) * k}px ${(point.top - box.top) * k}px` });
}

/**
 * The Kind Words cycle: every 5 s Arjun tells the next testimonial. Its speech
 * bubble grows from nothing out of his mouth (the scene's `[data-mouth]` point,
 * measured each time, so it works wherever the layout puts them) to its full
 * size and place, and shrinks back into his mouth before the next one comes
 * out. `goTo` (a click on Arjun, or a client button) switches at once and
 * restarts the 5 s.
 * It starts when the scene first comes into view and pauses while it's off-screen.
 *
 *  - `shown`: the testimonial in the bubble; `selected`: the client button to
 *    highlight (switches at once, before the bubble has changed);
 *  - `told`: counts each time a testimonial comes out (Arjun starts telling it).
 */
export function useTestimonialCycle(count: number) {
  const scene = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState(0);
  const [{ shown, told }, setTold] = useState({ shown: 0, told: 0 });
  const shownRef = useRef(0);
  const timer = useRef<gsap.core.Tween | null>(null);
  const visible = useRef(false);
  const reduced = useRef(false);

  /** Bring testimonial `index` out of his mouth (after swallowing the current one). */
  const goTo = useCallback((index: number) => {
    timer.current?.kill();
    setSelected(index);
    const el = bubble.current;
    const tell = () => setTold((s) => ({ shown: index, told: s.told + 1 }));
    if (!el || reduced.current || Number(gsap.getProperty(el, "scale")) < 0.05) return tell();
    gsap.killTweensOf(el);
    growFromMouth(el, scene.current?.querySelector("[data-mouth]"));
    gsap.to(el, { scale: 0, opacity: 0, ...SHRINK, onComplete: tell });
  }, []);

  // each new testimonial: grow the bubble out of his mouth, and line up the next one
  useLayoutEffect(() => {
    const el = bubble.current;
    if (!el) return;
    shownRef.current = shown;
    growFromMouth(el, scene.current?.querySelector("[data-mouth]"));
    if (!told) {
      gsap.set(el, { scale: 0, opacity: 0 }); // waiting until the scene is seen
      return;
    }
    if (reduced.current) gsap.set(el, { scale: 1, opacity: 1 });
    else {
      gsap.killTweensOf(el);
      gsap.fromTo(el, { scale: 0, opacity: 0 }, { scale: 1, ...GROW });
      gsap.to(el, { opacity: 1, duration: 0.2, ease: "none" });
    }
    timer.current = gsap.delayedCall(TESTIMONIAL_SECONDS, () => goTo((shownRef.current + 1) % count));
    if (!visible.current) timer.current.pause();
  }, [told, shown, count, goTo]);

  // start on first sight; pause the clock while off-screen
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = scene.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting) setTold((s) => (s.told ? s : { ...s, told: 1 }));
        if (entry.isIntersecting) timer.current?.resume();
        else timer.current?.pause();
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timer.current?.kill();
    };
  }, []);

  return { scene, bubble, shown, selected, told, goTo };
}
