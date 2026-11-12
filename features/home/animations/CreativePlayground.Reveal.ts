"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { afterIntro } from "@/lib/helpers/afterIntro";
import { waveRevealWords } from "@/lib/animations/waveReveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * "Our creative playground" scroll entrance, once (no scrub, no timeline:
 * tweens on three triggers, each starting as its part comes into view):
 *  - the label rises in, and the heading's and intro's words rise up in a wave;
 *  - the filing room rises in softly; the case file drops onto the desk with a
 *    little tilt; Neha steps in from the right;
 *  - the client selector rises in.
 * Only wrappers are moved (`data-cp`), never the drawers, file or Neha's own
 * parts, and their styles are cleared once they've arrived, so the room's own
 * animations (drawers, file swaps, stamping) are untouched. Waits for fonts and
 * the welcome gateway; with reduced motion everything is simply there.
 */
export function useCreativePlaygroundReveal() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = ref.current;
      if (!root || !contextSafe || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const one = (name: string) => root.querySelector<HTMLElement>(`[data-cp="${name}"]`)!;
      const [label, heading, intro, room, file, neha, controls] = ["label", "heading", "intro", "room", "file", "neha", "controls"].map(one);
      const settle = (el: HTMLElement) => () => void gsap.set(el, { clearProps: "transform,opacity,visibility" });

      // hidden until seen (set before the first paint, so nothing flashes)
      gsap.set([label, heading, intro], { autoAlpha: 0 });
      gsap.set(room, { autoAlpha: 0, y: 60 });
      gsap.set(file, { autoAlpha: 0, y: -40, rotation: -3, transformOrigin: "40% 40%" });
      gsap.set(neha, { autoAlpha: 0, x: 90 });
      gsap.set(controls, { autoAlpha: 0, y: 30 });

      let stopWaiting = () => {};
      const build = contextSafe(() => {
        const head = { trigger: heading, start: "top 82%", once: true };
        const scene = { trigger: room, start: "top 75%", once: true };
        const selector = { trigger: controls, start: "top 92%", once: true };

        gsap.fromTo(label, { autoAlpha: 0, yPercent: 60 }, { autoAlpha: 1, yPercent: 0, duration: 0.8, ease: "power3.out", scrollTrigger: head, onComplete: settle(label) });
        waveRevealWords(heading, head);
        waveRevealWords(intro, { ...head, trigger: intro, start: "top 88%" });

        gsap.to(room, { autoAlpha: 1, y: 0, duration: 1.1, ease: "power2.out", scrollTrigger: scene, onComplete: settle(room) });
        gsap.to(file, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.9, delay: 0.45, ease: "back.out(1.4)", scrollTrigger: scene, onComplete: settle(file) });
        gsap.to(neha, { autoAlpha: 1, x: 0, duration: 1, delay: 0.6, ease: "power3.out", scrollTrigger: scene, onComplete: settle(neha) });
        gsap.to(controls, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: selector, onComplete: settle(controls) });
      });

      // fonts first (the text splits into lines), then wait for the gateway
      document.fonts.ready.then(() => {
        if (ref.current) stopWaiting = afterIntro(build);
      });
      return () => stopWaiting();
    },
    { scope: ref }
  );

  return ref;
}
