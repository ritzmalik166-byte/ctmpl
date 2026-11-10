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

/**
 * Talking with mouth frames: on each syllable a small or wide open-mouth frame
 * replaces the character's own (closed) smile. Returns when the phrase ends.
 */
export function talkFrames(timeline: gsap.core.Timeline, small: Element[], wide: Element[], at: number, count: number) {
  let t = at;
  for (let i = 0; i < count; i++) {
    const frame = Math.random() < 0.55 ? small : wide;
    const open = gsap.utils.random(0.1, 0.18);
    const shut = gsap.utils.random(0.05, 0.12);
    timeline.set(frame, { opacity: 1 }, t).set(frame, { opacity: 0 }, t + open);
    t += open + shut;
  }
  return t;
}

/**
 * A real-looking blink with painted eye frames over closed-eye artwork:
 * open → half → closed (the art itself) → half → open, about 0.2 s. A fresh
 * 2.5–5 s pause comes before each blink, and now and then a double blink.
 */
export function blinkFrames(open: Element[], half: Element[]) {
  const pause = () => gsap.utils.random(2.5, 5);
  const wait = gsap.to({}, { duration: pause() });
  const blinkOnce = (tl: gsap.core.Timeline) =>
    tl
      .set(open, { opacity: 0 }).set(half, { opacity: 1 }) // lids coming down
      .set(half, { opacity: 0 }, "+=0.05") // closed
      .set(half, { opacity: 1 }, "+=0.08") // opening
      .set(half, { opacity: 0 }, "+=0.05").set(open, { opacity: 1 });
  const timeline = gsap.timeline({ repeat: -1, onRepeat: () => wait.duration(pause()) }).add(wait);
  blinkOnce(timeline);
  timeline.add(() => {
    if (Math.random() < 0.2) blinkOnce(gsap.timeline({ delay: 0.15 }));
  });
  return timeline;
}

/**
 * Talking over artwork drawn mid-word (mouth already open): a closed-lips frame
 * shows at rest; on each syllable it hides, revealing either a slightly open
 * frame or the art's own open mouth. Returns when the phrase ends.
 */
export function talkOverOpenArt(timeline: gsap.core.Timeline, closed: Element[], small: Element[], at: number, count: number) {
  let t = at;
  for (let i = 0; i < count; i++) {
    const open = gsap.utils.random(0.1, 0.18);
    const shut = gsap.utils.random(0.05, 0.12);
    timeline.set(closed, { opacity: 0 }, t).set(closed, { opacity: 1 }, t + open);
    if (Math.random() < 0.55) timeline.set(small, { opacity: 1 }, t).set(small, { opacity: 0 }, t + open);
    t += open + shut;
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
