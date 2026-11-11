"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { talkFrames, usePuppet } from "./puppet";

/**
 * A blink over open-eyed artwork: half-closed → closed → half-closed → open,
 * about 0.2 s, with a fresh 2.5–5 s pause before each (now and then a double).
 */
function blinkOverOpenEyes(half: Element[], closed: Element[]) {
  const pause = () => gsap.utils.random(2.5, 5);
  const wait = gsap.to({}, { duration: pause() });
  const blinkOnce = (tl: gsap.core.Timeline) =>
    tl
      .set(half, { opacity: 1 })
      .set(half, { opacity: 0 }, "+=0.05").set(closed, { opacity: 1 })
      .set(closed, { opacity: 0 }, "+=0.08").set(half, { opacity: 1 })
      .set(half, { opacity: 0 }, "+=0.05");
  const timeline = gsap.timeline({ repeat: -1, onRepeat: () => wait.duration(pause()) }).add(wait);
  blinkOnce(timeline);
  timeline.add(() => {
    if (Math.random() < 0.2) blinkOnce(gsap.timeline({ delay: 0.15 }));
  });
  return timeline;
}

/** Arjun at rest: he blinks, breathes, and shifts his weight a little. */
export function useArjunPuppet() {
  return usePuppet((q) => {
    const [arjun, eyesHalf, eyesClosed] = [q("arjun"), q("eyes-half"), q("eyes-closed")];
    const sway = gsap.fromTo(arjun, { rotation: -0.4, x: -1 }, { rotation: 0.4, x: 1, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const breathing = gsap.to(arjun, { scaleY: 1.006, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return [sway, breathing, blinkOverOpenEyes(eyesHalf, eyesClosed)];
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
      const [arm, head, mouthSmall, mouthWide] = [q("arm"), q("head"), q("mouth-small"), q("mouth-wide")];

      // a new story cuts the last one short (arm and head carry on from wherever they are)
      current.current?.kill();
      gsap.set([...mouthSmall, ...mouthWide], { opacity: 0 });
      const speech = (current.current = gsap.timeline({ delay: 0.15 }));
      // the words: phrases of 5–9 syllables with a breath between; the last one ends within his time
      let t = 0;
      while (t < seconds - 2.2) t = talkFrames(speech, mouthSmall, mouthWide, t, gsap.utils.random(5, 9, 1)) + gsap.utils.random(0.25, 0.45);

      // the arm: lifts as he starts, beats on his words, opens out, settles back as he finishes
      const beats = [7, 3, 8.5, 4.5, 9, 2.5, 6.5, 3.5];
      speech.to(arm, { rotation: 6, duration: 0.45, ease: "power2.out" }, 0);
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
