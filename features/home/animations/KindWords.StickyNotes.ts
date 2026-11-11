"use client";

import gsap from "gsap";
import { usePuppet } from "./puppet";

/** Each note rocks gently from its top edge: degrees either way, seconds per swing. */
const SWING = { angle: [2.2, 3.2], seconds: [2.8, 3.8] };

/**
 * The sticky notes on the notice board swing slowly, like paper stirred by a
 * draft, each at its own pace and timing so they never move in step.
 * Pauses off-screen; with reduced motion they stay still.
 */
export function useSwingingNotes() {
  return usePuppet((q) =>
    q("note").map((note) => {
      const angle = gsap.utils.random(SWING.angle[0], SWING.angle[1]);
      return gsap.fromTo(
        note,
        { rotation: -angle },
        {
          rotation: angle,
          duration: gsap.utils.random(SWING.seconds[0], SWING.seconds[1]),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        }
      ).totalTime(gsap.utils.random(0, 3)); // start part-way through, so they're out of step
    })
  );
}
