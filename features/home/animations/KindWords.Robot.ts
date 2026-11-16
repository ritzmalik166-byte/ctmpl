"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { breathe, talk, usePuppet } from "./puppet";

gsap.registerPlugin(useGSAP);

/** Looking at Arjun (to its left): head turned and tipped his way, eyes on him, a slight lean. */
const LOOK = { head: { rotation: -8, xPercent: -2 }, pupils: { xPercent: -1.8, yPercent: 0.3 }, robot: { rotation: -1.5 } };
/** Straight out at the room. */
const STRAIGHT = { head: { rotation: 0, xPercent: 0 }, pupils: { xPercent: 0, yPercent: 0 }, robot: { rotation: 0 } };

/** The robot at rest: it breathes, and now and then its eyes blink (pupils squash flat for a moment). */
export function useRobotIdle() {
  return usePuppet((q) => {
    const pupils = q("pupils");
    const pause = () => gsap.utils.random(2.2, 4.5);
    const wait = gsap.to({}, { duration: pause() });
    const blinking = gsap
      .timeline({ repeat: -1, delay: 1, onRepeat: () => wait.duration(pause()) })
      .add(wait)
      .to(pupils, { scaleY: 0.1, duration: 0.07, ease: "power1.in" })
      .to(pupils, { scaleY: 1, duration: 0.1, ease: "power1.out" }, "+=0.06");
    return [breathe(q("robot")), blinking];
  });
}

/**
 * The robot reacts to each testimonial (each change of `signal`), turn about:
 *  - odd ones: it turns to look at Arjun and listens (a small nod now and
 *    then), eyes on him;
 *  - even ones: it looks straight out and talks to itself: the mouth goes in
 *    short mutters, the head bobs and the folded arms lift, tip and squeeze on
 *    its words, then settle.
 * Each reaction lasts about `seconds`; a new signal takes over from wherever
 * the last one left off.
 */
export function useRobotReaction(signal: number, seconds: number) {
  const ref = useRef<HTMLDivElement>(null);
  const current = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!signal || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = (part: string) => gsap.utils.toArray<Element>(`[data-part="${part}"]`, el);
      const [robot, head, pupils, arms, mouth] = [[el], q("head"), q("pupils"), q("arms"), q("mouth")];

      current.current?.kill();
      gsap.set(mouth, { scaleY: 0 });
      const tl = (current.current = gsap.timeline({ delay: 0.2 }));
      const settle = { duration: 0.6, ease: "power2.inOut" };

      if (signal % 2 === 1) {
        // look at Arjun while he tells it
        tl.to(head, { ...LOOK.head, ...settle }, 0)
          .to(pupils, { ...LOOK.pupils, duration: 0.35, ease: "power2.out" }, 0)
          .to(robot, { ...LOOK.robot, ...settle }, 0.1)
          .to(arms, { rotation: 0, y: 0, scale: 1, ...settle }, 0)
          // listening: a small nod, then another
          .to(head, { rotation: LOOK.head.rotation + 2.5, duration: 0.35, ease: "sine.inOut", yoyo: true, repeat: 1 }, 1.4)
          .to(head, { rotation: LOOK.head.rotation + 2, duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: 1 }, 3);
        return;
      }

      // straight out, talking to itself
      tl.to(head, { ...STRAIGHT.head, ...settle }, 0)
        .to(pupils, { ...STRAIGHT.pupils, duration: 0.35, ease: "power2.out" }, 0)
        .to(robot, { ...STRAIGHT.robot, ...settle }, 0);

      // the words: mutters of 3–6 syllables with short pauses
      let t = 0.5;
      while (t < seconds - 1.4) t = talk(tl, mouth, t, gsap.utils.random(3, 6, 1)) + gsap.utils.random(0.25, 0.5);

      // the arms beat on its words: lift and tip one way, then the other, a squeeze, then rest
      const beats = [
        { rotation: -4, y: -3, scale: 1.02 },
        { rotation: 3.5, y: -1.5, scale: 1 },
        { rotation: -2.5, y: -3.5, scale: 1.03 },
        { rotation: 4, y: -2, scale: 1.01 },
      ];
      let i = 0;
      for (let at = 0.5; at < t - 0.5; at += gsap.utils.random(0.5, 0.75), i++) {
        tl.to(arms, { ...beats[i % beats.length], duration: 0.35, ease: "sine.inOut" }, at);
      }
      tl.to(arms, { rotation: 0, y: 0, scale: 1, duration: 0.5, ease: "power2.inOut" }, t);

      // the head bobs along, eyes glancing down and back as if thinking
      tl.to(head, { rotation: 2.5, duration: 0.45, ease: "sine.inOut" }, 0.7)
        .to(head, { rotation: -2, duration: 0.55, ease: "sine.inOut" }, 1.6)
        .to(pupils, { yPercent: 0.8, xPercent: 0.8, duration: 0.25, ease: "power1.out" }, 2.1)
        .to(pupils, { yPercent: 0, xPercent: 0, duration: 0.3, ease: "power1.inOut" }, 2.9)
        .to(head, { rotation: 1.5, duration: 0.5, ease: "sine.inOut" }, 2.6)
        .to(head, { rotation: 0, duration: 0.5, ease: "sine.inOut" }, t);
    },
    { scope: ref, dependencies: [signal, seconds] }
  );

  return ref;
}
