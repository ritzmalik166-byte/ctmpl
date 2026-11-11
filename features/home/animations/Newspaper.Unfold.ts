"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Seconds the unfolding takes. */
const UNFOLD = 1.4;

/**
 * The newspaper section's entrance:
 *  1. until the section scrolls into view the paper lies folded in half;
 *  2. then (ScrollTrigger) it opens from the fold: the right half lifts toward
 *     us, turns over and lies flat, casting a shadow by the fold as it goes,
 *     while the paper slides into place; a soft crease stays down the middle;
 *  3. once it's open the desk things arrive: the CTM mug (steam rising off
 *     its coffee) with its coffee ring, the reading glasses and the pen;
 *  4. then the mug, glasses and pen keep gently rising and falling, and the
 *     steam keeps curling up.
 * Plays once. With reduced motion everything is simply shown, open and still.
 * Works for either layout (desktop or compact): use it on each; a layout that
 * is hidden when the page loads is simply shown open.
 */
export function useNewspaperUnfold() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = ref.current;
      if (!root || !contextSafe) return;
      const q = (name: string) => root.querySelector<HTMLElement>(`[data-anim="${name}"]`)!;
      const [paper, page, flap, flapShade, foldShadow, crease] = ["paper", "page", "flap", "flap-shade", "fold-shadow", "crease"].map(q);
      const [mug, ring, glasses, pen] = ["mug", "ring", "glasses", "pen"].map(q);
      const wisps = gsap.utils.toArray<SVGPathElement>('[data-anim="wisp"]', root);

      // open: the whole page is the real one (its links work), the flap is put away
      const showOpen = () => {
        gsap.set(page, { clipPath: "none" });
        gsap.set(flap, { autoAlpha: 0 });
      };

      // the other layout (hidden at this screen size): just show it open
      const hidden = root.getClientRects().length === 0;
      if (hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        showOpen();
        gsap.set(crease, { opacity: 1 });
        gsap.set(wisps, { opacity: 0.5 });
        return;
      }

      // the desk things rise and fall; the steam curls up, wisp after wisp
      const settle = contextSafe(() => {
        gsap.to(mug, { y: -6, duration: 1.7, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(glasses, { y: -5, duration: 2.1, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.3 });
        gsap.to(pen, { y: -5, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.6 });
        wisps.forEach((wisp, i) => {
          gsap
            .timeline({ repeat: -1, delay: i * 0.7 })
            .fromTo(wisp, { y: 14, scaleX: 0.85, opacity: 0 }, { y: -22, scaleX: 1.15, duration: 2.2, ease: "sine.out" }, 0)
            .to(wisp, { opacity: 0.75, duration: 0.7, ease: "sine.out" }, 0)
            .to(wisp, { opacity: 0, duration: 1.1, ease: "sine.in" }, 1.1)
            .to(wisp, { x: i % 2 ? 4 : -4, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: 1 }, 0);
        });
      });

      // folded, and the desk cleared, until it scrolls into view
      const shift = Number(paper.dataset.shift ?? 0); // % of its box, so the folded half lies centred
      gsap.set(paper, { xPercent: shift });
      // the flap lies over the other half; it lifts toward us to open (down the middle: -180°, across: 180°)
      const turn = paper.dataset.axis === "x" ? "rotationX" : "rotationY";
      gsap.set(flap, { [turn]: turn === "rotationX" ? 180 : -180 });
      gsap.set([mug, ring, glasses, pen], { autoAlpha: 0 });
      gsap.set(wisps, { opacity: 0 });

      gsap
        .timeline({ scrollTrigger: { trigger: root, start: "top 55%", once: true } })
        // unfold: the flap lifts toward us, over the top, and down flat
        .to(paper, { xPercent: 0, duration: UNFOLD, ease: "power2.inOut" }, 0)
        .to(flap, { [turn]: 0, duration: UNFOLD, ease: "power2.inOut" }, 0.1)
        .to(flapShade, { opacity: 0.18, duration: UNFOLD / 2, ease: "sine.in" }, 0.1)
        .to(flapShade, { opacity: 0, duration: UNFOLD / 2, ease: "sine.out" }, 0.1 + UNFOLD / 2)
        .to(foldShadow, { opacity: 0.5, duration: UNFOLD / 2, ease: "sine.in" }, 0.1)
        .to(foldShadow, { opacity: 0, duration: UNFOLD / 2, ease: "sine.out" }, 0.1 + UNFOLD / 2)
        .to(crease, { opacity: 1, duration: 0.4 }, UNFOLD - 0.1)
        .add(showOpen, UNFOLD + 0.1)
        // then the desk things
        .fromTo(mug, { autoAlpha: 0, y: -60 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "back.out(1.7)" }, UNFOLD + 0.15)
        .fromTo(ring, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power2.out" }, UNFOLD + 0.5)
        .fromTo(glasses, { autoAlpha: 0, x: -90, y: 40 }, { autoAlpha: 1, x: 0, y: 0, duration: 0.85, ease: "power3.out" }, UNFOLD + 0.3)
        .fromTo(pen, { autoAlpha: 0, x: 100, y: 30 }, { autoAlpha: 1, x: 0, y: 0, duration: 0.85, ease: "power3.out" }, UNFOLD + 0.45)
        .add(settle, UNFOLD + 1.3);
    },
    { scope: ref }
  );

  return ref;
}
