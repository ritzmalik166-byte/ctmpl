"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { afterIntro } from "@/lib/helpers/afterIntro";

gsap.registerPlugin(useGSAP);

/** Looks up a puppet part by `data-part`, inside the puppet. */
export type PartQuery = (part: string) => Element[];

/**
 * Shared set-up for a paper puppet: waits for the welcome gateway to finish,
 * respects reduced motion, and pauses its animations while off-screen.
 * `build` creates the puppet's animations and returns them.
 */
export function usePuppet(build: (q: PartQuery) => gsap.core.Animation[]) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const q: PartQuery = (part) => gsap.utils.toArray<Element>(`[data-part="${part}"]`, el);
      let animations: gsap.core.Animation[] = [];
      let visible = true;

      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        animations.forEach((a) => (visible ? a.resume() : a.pause()));
      });
      observer.observe(el);

      const stopWaiting = afterIntro(() => {
        animations = build(q);
        if (!visible) animations.forEach((a) => a.pause());
      });

      return () => {
        stopWaiting();
        observer.disconnect();
        animations.forEach((a) => a.kill());
      };
    },
    { scope: ref }
  );

  return ref;
}

/** Quick mouth flaps, like someone talking: `count` syllables from `at` (scaleY 0 = shut). */
export function talk(timeline: gsap.core.Timeline, mouth: Element[], at: number, count: number) {
  let t = at;
  for (let i = 0; i < count; i++) {
    const open = gsap.utils.random(0.5, 1);
    const length = gsap.utils.random(0.09, 0.16);
    timeline.to(mouth, { scaleY: open, duration: length, ease: "power1.out" }, t);
    timeline.to(mouth, { scaleY: 0, duration: length, ease: "power1.in" }, t + length);
    t += length * 2 + gsap.utils.random(0.02, 0.1);
  }
  return t;
}

/** Breathing: a barely-there rise and fall, from the feet. */
export const breathe = (figure: Element[]) =>
  gsap.to(figure, { scaleY: 1.006, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1 });

/**
 * Natural blinking: `openEyes` (an open-eyes overlay over closed-eye artwork)
 * disappears for a moment, with a fresh random pause of 2.8–6 s before each
 * blink (re-rolled on every repeat) and an occasional double blink.
 */
export function blink(openEyes: Element[]) {
  const pauseLength = () => gsap.utils.random(2.8, 6);
  const timeline = gsap.timeline({
    repeat: -1,
    repeatRefresh: true,
    delay: gsap.utils.random(0.8, 2.5),
    onRepeat: () => pause.duration(pauseLength()), // so no two gaps are alike
  });
  const pause = gsap.to({}, { duration: pauseLength() }); // eyes open, waiting
  timeline
    .add(pause)
    .set(openEyes, { opacity: 0 }) // close…
    .set(openEyes, { opacity: 1 }, "+=0.15") // …and open again
    // about one blink in five is a double blink
    .to({}, { duration: 0.18 })
    .set(openEyes, { opacity: () => (Math.random() < 0.2 ? 0 : 1) })
    .set(openEyes, { opacity: 1 }, "+=0.13");
  return timeline;
}
