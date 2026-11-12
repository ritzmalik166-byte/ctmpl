"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { afterIntro } from "@/lib/helpers/afterIntro";
import { waveRevealWords } from "./waveReveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The entrances, by `data-sr` value. Only transforms and opacity are animated
 * (the browser can run those on the GPU), so they stay smooth on phones.
 */
const FROM: Record<string, gsap.TweenVars> = {
  /** a section label: up a little from under itself */
  label: { autoAlpha: 0, yPercent: 60 },
  /** a block rising into place */
  rise: { autoAlpha: 0, y: 50 },
  /** something set down from above, straightening as it lands */
  drop: { autoAlpha: 0, y: -45, rotation: -3 },
  /** in from the left / right */
  "slide-left": { autoAlpha: 0, x: -90 },
  "slide-right": { autoAlpha: 0, x: 90 },
};
const EASE: Record<string, string> = { drop: "back.out(1.5)" };
const DURATION: Record<string, number> = { label: 0.8, rise: 0.9, drop: 0.9, "slide-left": 1, "slide-right": 1 };

/**
 * Scroll entrances for a section, by marking its elements (no scrub, no
 * timeline: each element plays once, when it scrolls into view):
 *  - `data-sr="words"`: the text's words rise up from under their lines, in a wave;
 *  - `data-sr="label" | "rise" | "drop" | "slide-left" | "slide-right"`: the element enters so;
 *  - `data-sr="stagger"`: its children rise in one after another.
 * Optional `data-sr-delay` (s). Styles are cleared once each element has
 * arrived, so it behaves exactly as before afterwards. Elements of a layout
 * hidden at this screen size are left alone. Waits for fonts (text splits into
 * lines) and the welcome gateway; with reduced motion everything is simply there.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = ref.current;
      if (!root || !contextSafe || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const shown = (el: HTMLElement) => el.getClientRects().length > 0;
      const marked = gsap.utils.toArray<HTMLElement>("[data-sr]", root).filter(shown);
      const delayOf = (el: HTMLElement) => Number(el.dataset.srDelay ?? 0);
      const settle = (targets: gsap.TweenTarget) => () => void gsap.set(targets, { clearProps: "transform,opacity,visibility" });

      // hidden until seen (set before the first paint, so nothing flashes)
      marked.forEach((el) => {
        const kind = el.dataset.sr!;
        if (kind === "words") gsap.set(el, { autoAlpha: 0 });
        else if (kind === "stagger") gsap.set(el.children, { autoAlpha: 0, y: 36 });
        else if (FROM[kind]) gsap.set(el, FROM[kind]);
      });

      let stopWaiting = () => {};
      const build = contextSafe(() => {
        marked.forEach((el) => {
          const kind = el.dataset.sr!;
          // near the very end of the page an element may never scroll up that far: start as soon as it's on screen
          const usual = kind === "words" || kind === "label" ? 0.88 : 0.85;
          const top = el.getBoundingClientRect().top + window.scrollY;
          const reachable = top - window.innerHeight * usual <= document.documentElement.scrollHeight - window.innerHeight - 80; // with room to spare
          const scrollTrigger = { trigger: el, start: reachable ? `top ${usual * 100}%` : "top bottom-=20", once: true };
          const delay = delayOf(el);
          if (kind === "words") {
            waveRevealWords(el, scrollTrigger);
          } else if (kind === "stagger") {
            gsap.to(el.children, { autoAlpha: 1, y: 0, duration: 0.8, delay, stagger: 0.09, ease: "power3.out", scrollTrigger, onComplete: settle(el.children) });
          } else if (FROM[kind]) {
            gsap.to(el, {
              autoAlpha: 1,
              x: 0,
              y: 0,
              yPercent: 0,
              rotation: 0,
              duration: DURATION[kind],
              delay,
              ease: EASE[kind] ?? "power3.out",
              scrollTrigger,
              onComplete: settle(el),
            });
          }
        });
      });

      // fonts first (text splits into lines), then wait for the gateway
      document.fonts.ready.then(() => {
        if (ref.current) stopWaiting = afterIntro(build);
      });
      return () => stopWaiting();
    },
    { scope: ref }
  );

  return ref;
}
