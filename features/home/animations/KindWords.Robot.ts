"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { breathe, usePuppet } from "./puppet";

gsap.registerPlugin(useGSAP);

/** Listening to Arjun (to its left): head tipped his way, a lean towards him. */
const LISTEN = { head: { rotation: -2.5 }, robot: { rotation: -1.2 } };

/** The robot at rest: it breathes, and now and then it blinks (its eyes squash shut for a moment). */
export function useRobotIdle() {
  return usePuppet((q) => {
    const eyes = q("eye");
    const blinking = gsap
      .timeline({ repeat: -1, repeatRefresh: true, repeatDelay: 2.2, delay: 1 })
      .to(eyes, { scaleY: 0.08, duration: 0.07, ease: "power1.in" })
      .to(eyes, { scaleY: 1, duration: 0.1, ease: "power1.out" }, "+=0.05")
      .to({}, { duration: () => gsap.utils.random(0.4, 2.4) });
    return [breathe(q("robot")), blinking];
  });
}

/**
 * The robot listens to each testimonial (each change of `signal`), carefully:
 * it leans in towards Arjun and tips its head his way, nods along now and then
 * (as if to say "go on"), and taps its head with its fingers, thinking it
 * over; as the story ends it straightens up again. Each lasts about `seconds`;
 * a new signal takes over from wherever the last one left off.
 */
export function useRobotReaction(signal: number, seconds: number) {
  const ref = useRef<HTMLDivElement>(null);
  const current = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!signal || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = (part: string) => gsap.utils.toArray<Element>(`[data-part="${part}"]`, el);
      const [robot, head, arm] = [[el], q("head"), q("arm")];

      current.current?.kill();
      const tl = (current.current = gsap.timeline({ delay: 0.2 }));
      const settle = { duration: 0.7, ease: "power2.inOut" };

      // lean in and tip the head towards him
      tl.to(head, { ...LISTEN.head, ...settle }, 0).to(robot, { ...LISTEN.robot, ...settle }, 0.1);
      // nods along, every couple of seconds
      for (let at = 1.3; at < seconds - 1.6; at += gsap.utils.random(1.8, 2.6)) {
        tl.to(head, { rotation: LISTEN.head.rotation + 1.6, y: 1, duration: 0.28, ease: "sine.inOut", yoyo: true, repeat: 1 }, at);
      }
      // thinking it over: the fingers tap its head, twice, now and then
      for (let at = 2.2; at < seconds - 1.6; at += gsap.utils.random(2.6, 3.4)) {
        tl.to(arm, { rotation: 1.2, duration: 0.12, ease: "sine.inOut", yoyo: true, repeat: 3 }, at);
      }
      // the story's over: straighten up
      tl.to(head, { rotation: 0, y: 0, ...settle }, seconds - 0.9).to(robot, { rotation: 0, ...settle }, seconds - 0.9);
    },
    { scope: ref, dependencies: [signal, seconds] }
  );

  return ref;
}
