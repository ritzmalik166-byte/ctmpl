"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePuppet } from "./puppet";

/** A blink: both eyes (cut out on their own) squash shut and open again, every few seconds (now and then twice). */
function squashBlink(eyes: Element[]) {
  return gsap
    .timeline({ repeat: -1, repeatRefresh: true, repeatDelay: 2.6, delay: gsap.utils.random(0.8, 2) })
    .to(eyes, { scaleY: 0.08, duration: 0.07, ease: "power2.in" })
    .to(eyes, { scaleY: 1, duration: 0.1, ease: "power2.out" })
    .to({}, { duration: () => gsap.utils.random(0.4, 2.8) });
}

/**
 * Talking, as a mouth really moves: only his lower lip (cut out on its own, the
 * dark of his mouth painted under it) drops on each syllable and comes back up,
 * now and then closing right up; his smile and upper lip stay as drawn. Returns
 * when the phrase ends, his lip back as drawn.
 */
function talkPhrase(timeline: gsap.core.Timeline, mouth: Element[], at: number, syllables: number) {
  let t = at;
  for (let i = 0; i < syllables; i++) {
    const length = gsap.utils.random(0.09, 0.15);
    timeline
      .to(mouth, { yPercent: gsap.utils.random(0.14, 0.38), duration: length, ease: "power2.out" }, t)
      .to(mouth, { yPercent: Math.random() < 0.2 ? -0.08 : gsap.utils.random(0, 0.05), duration: length * 0.9, ease: "power2.in" }, t + length);
    t += length * 1.9 + gsap.utils.random(0.02, 0.08);
  }
  timeline.to(mouth, { yPercent: 0, duration: 0.15, ease: "sine.out" }, t);
  return t;
}

/** Arjun at rest: he blinks, breathes, and shifts his weight a little. */
export function useArjunPuppet() {
  return usePuppet((q) => {
    const [arjun, eyes] = [q("arjun"), q("eye")];
    const sway = gsap.fromTo(arjun, { rotation: -0.4, x: -1 }, { rotation: 0.4, x: 1, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const breathing = gsap.to(arjun, { scaleY: 1.006, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return [sway, breathing, squashBlink(eyes)];
  });
}

/**
 * Arjun tells a testimonial: each time `signal` changes he talks for about
 * `seconds` (phrases with short pauses for breath), his raised right arm moves
 * from the shoulder to mark his points (+ lifts it, − lowers it), and his head
 * nods along. A new signal cuts the last story short and starts the next.
 */
export function useArjunSpeech(signal: number, seconds: number) {
  const ref = useRef<HTMLDivElement>(null);
  const current = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!signal || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = (part: string) => gsap.utils.toArray<Element>(`[data-part="${part}"]`, el);
      const [arm, head, mouth] = [q("arm"), q("head"), q("mouth")];

      // a new story cuts the last one short (arm and head carry on from wherever they are)
      current.current?.kill();
      gsap.set(mouth, { yPercent: 0 });
      const speech = (current.current = gsap.timeline({ delay: 0.15 }));
      // the words: phrases of 5–9 syllables with a breath between; the last one ends within his time
      let t = 0;
      while (t < seconds - 2.2) t = talkPhrase(speech, mouth, t, gsap.utils.random(5, 9, 1)) + gsap.utils.random(0.25, 0.45);

      // the arm: lifts as he starts, beats on his words, opens out, settles back as he finishes
      // (his hand is raised high, so small turns at the shoulder carry it a long way)
      const beats = [4, 1.5, 5, 2.5, 5.5, 1.5, 4, 2];
      speech.to(arm, { rotation: 3.5, duration: 0.45, ease: "power2.out" }, 0);
      for (let i = 0, at = 0.6; at < t - 0.8; i++, at += gsap.utils.random(0.45, 0.7)) {
        speech.to(arm, { rotation: beats[i % beats.length], duration: 0.38, ease: "sine.inOut" }, at);
      }
      speech.to(arm, { rotation: 0, duration: 0.6, ease: "power2.inOut" }, t - 0.4);

      // the head: a nod into the first words, small tilts, then straight
      speech
        .to(head, { rotation: 1.6, duration: 0.4, ease: "sine.inOut" }, 0)
        .to(head, { rotation: -1.2, duration: 0.7, ease: "sine.inOut" }, 1.1)
        .to(head, { rotation: 1, duration: 0.7, ease: "sine.inOut" }, 2.3)
        .to(head, { rotation: 0, duration: 0.5, ease: "sine.inOut" }, t - 0.4);
    },
    { scope: ref, dependencies: [signal, seconds] }
  );

  return ref;
}
