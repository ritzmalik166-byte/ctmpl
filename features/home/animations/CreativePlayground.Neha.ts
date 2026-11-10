"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { blinkFrames, talkFrames, usePuppet } from "./puppet";
import { STAMP_LANDS_AT } from "./CreativePlayground.FilingRoom";

/**
 * Neha stamps a new case file: a small wind-up, then the stamp comes down hard
 * (timed to land with the APPROVED seal on the file) and she lifts it again.
 * Runs each time `signal` changes (not on load).
 */
export function useNehaStamp(signal: number) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const joint = ref.current;
      if (!signal || !joint || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap
        .timeline({ delay: STAMP_LANDS_AT - 0.42 })
        .to(joint, { rotation: -5, duration: 0.26, ease: "power2.out" }) // wind up (- = up)
        .to(joint, { rotation: 6, duration: 0.16, ease: "power3.in" }) // down onto the file
        .to(joint, { rotation: 0, duration: 0.45, ease: "power2.inOut" }, "+=0.08");
    },
    { scope: ref, dependencies: [signal] }
  );
  return ref;
}

/**
 * Neha, the filing-room clerk. Every few seconds she tells us something: her
 * lips follow the words, the arm holding the stamp lifts from the shoulder and
 * marks her points, her head tilts, and she shifts her weight a little. Between
 * sentences she blinks, breathes and sways gently on her feet.
 */
export function useNehaPuppet() {
  return usePuppet((q) => {
    const [neha, head, arm, eyes, eyesHalf, mouthSmall, mouthWide] = [
      q("neha"), q("head"), q("arm"), q("eyes"), q("eyes-half"), q("mouth-small"), q("mouth-wide"),
    ];

    const telling = gsap.timeline({ repeat: -1, delay: 1, repeatDelay: 2.4 });
    const end = talkFrames(telling, mouthSmall, mouthWide, 0.15, 11);
    telling
      // the stamp arm comes up a little (- = up), beats on her words, settles
      .to(arm, { rotation: -4, duration: 0.5, ease: "power2.out" }, 0)
      .to(arm, { rotation: -1.5, duration: 0.25, ease: "sine.inOut" }, 0.65)
      .to(arm, { rotation: -4, duration: 0.25, ease: "sine.inOut" }, 0.9)
      .to(arm, { rotation: -2, duration: 0.3, ease: "sine.inOut" }, 1.35)
      .to(arm, { rotation: -3.5, duration: 0.3, ease: "sine.inOut" }, 1.65)
      .to(arm, { rotation: 0, duration: 0.6, ease: "power2.inOut" }, end - 0.1)
      // head: a tilt as she starts, the other way mid-sentence, then straight
      .to(head, { rotation: 2, duration: 0.5, ease: "sine.inOut" }, 0)
      .to(head, { rotation: -1.5, duration: 0.6, ease: "sine.inOut" }, 0.9)
      .to(head, { rotation: 0, duration: 0.5, ease: "sine.inOut" }, end - 0.2)
      // a small lift as she begins
      .to(neha, { yPercent: -0.35, duration: 0.25, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0.1);

    // her weight shifts slowly from foot to foot
    const sway = gsap.fromTo(neha, { rotation: -0.5, x: -1 }, { rotation: 0.5, x: 1, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const blinking = blinkFrames(eyes, eyesHalf);
    const breathing = gsap.to(neha, { scaleY: 1.006, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return [telling, sway, blinking, breathing];
  });
}
