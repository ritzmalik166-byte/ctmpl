"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { afterIntro } from "@/lib/helpers/afterIntro";
import { waveRevealWords } from "@/lib/animations/waveReveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Where the header starts its entrance (all of it at once). */
const START = "top 78%";

/**
 * "Who we are" scroll entrance, once, when the header scrolls into view (no
 * scrub, no timeline: a few tweens on the same trigger, all starting together):
 *  - the label, heading and intro rise up from below their lines, word after
 *    word in a quick wave (each line masked, so words appear from under it);
 *  - the paper airplane glides in from the bottom left into its spot, then
 *    floats on the air.
 * Waits for fonts (so lines split where they'll stay) and the welcome gateway.
 */
export function useWhoWeAreIntro() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = ref.current;
      if (!root || !contextSafe || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const q = (name: string) => root.querySelector<HTMLElement>(`[data-anim="${name}"]`)!;
      const [label, heading, intro, plane] = [q("label"), q("heading"), q("intro"), q("plane")];
      const trigger = { trigger: root, start: START, once: true };

      // hidden until it's seen (the section starts below the fold)
      gsap.set([label, heading, intro, plane], { autoAlpha: 0 });

      let stopWaiting = () => {};
      const build = contextSafe(() => {
        gsap.fromTo(label, { autoAlpha: 0, yPercent: 60 }, { autoAlpha: 1, yPercent: 0, duration: 0.8, ease: "power3.out", scrollTrigger: trigger });

        // words rise from under their line, in a wave
        [heading, intro].forEach((block) => waveRevealWords(block, trigger));

        flyIn(plane, trigger);
      });

      // fonts first, then wait for the gateway so it never plays behind it
      document.fonts.ready.then(() => {
        if (ref.current) stopWaiting = afterIntro(build);
      });

      return () => stopWaiting();
    },
    { scope: ref }
  );

  return ref;
}

/**
 * The paper airplane glides in from the bottom left, rising into its spot as
 * it fades in, then floats gently on the air.
 */
function flyIn(plane: HTMLElement, scrollTrigger: ScrollTrigger.Vars) {
  gsap.set(plane, { autoAlpha: 0 });
  gsap
    .timeline({ scrollTrigger, delay: 0.15 })
    .fromTo(
      plane,
      { autoAlpha: 0, x: -260, y: 160, rotation: 8 },
      { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: 1.4, ease: "power3.out" }
    )
    .to(plane, { y: -6, rotation: -2, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
}
