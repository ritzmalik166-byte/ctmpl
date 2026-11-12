"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { afterIntro } from "@/lib/helpers/afterIntro";
import { waveRevealWords } from "@/lib/animations/waveReveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * "What we make" scroll entrance, once (no scrub, no timeline: tweens on two
 * triggers, each starting as its part comes into view):
 *  - the label rises in and the heading's words rise up in a wave;
 *  - the lobby panel rises in;
 *  - the lift slides up into place;
 *  - the brass directory fades up and its floors slide in one by one, the
 *    service card following.
 * Everything is found by `data-wwm` inside the returned ref; transforms are
 * cleared once each part has arrived, so the lift and directory
 * behave exactly as before. Waits for fonts and the welcome gateway; with
 * reduced motion everything is simply there.
 */
export function useWhatWeMakeReveal() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = ref.current;
      if (!root || !contextSafe || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const one = (name: string) => root.querySelector<HTMLElement>(`[data-wwm="${name}"]`)!;
      const all = (name: string) => gsap.utils.toArray<HTMLElement>(`[data-wwm="${name}"]`, root);
      const [label, heading, panel, lift, directory, card] = ["label", "heading", "panel", "lift", "directory", "card"].map(one);
      const floors = all("floor");
      const settle = { clearProps: "transform,opacity,visibility" };

      // hidden until seen (set before the first paint, so nothing flashes)
      gsap.set([label, heading], { autoAlpha: 0 });
      gsap.set(panel, { autoAlpha: 0, y: 60 });
      gsap.set(lift, { autoAlpha: 0, y: 90 });
      gsap.set(directory, { autoAlpha: 0, y: 30 });
      gsap.set(floors, { autoAlpha: 0, x: -22 });
      gsap.set(card, { autoAlpha: 0, y: 24 });

      let stopWaiting = () => {};
      const build = contextSafe(() => {
        const head = { trigger: heading, start: "top 82%", once: true };
        const lobby = { trigger: panel, start: "top 75%", once: true };

        gsap.fromTo(label, { autoAlpha: 0, yPercent: 60 }, { autoAlpha: 1, yPercent: 0, duration: 0.8, ease: "power3.out", scrollTrigger: head, onComplete: () => void gsap.set(label, settle) });
        waveRevealWords(heading, head);

        gsap.to(panel, { autoAlpha: 1, y: 0, duration: 1.1, ease: "power2.out", scrollTrigger: lobby, onComplete: () => void gsap.set(panel, settle) });
        gsap.to(lift, { autoAlpha: 1, y: 0, duration: 1.1, delay: 0.25, ease: "power3.out", scrollTrigger: lobby, onComplete: () => void gsap.set(lift, settle) });
        gsap.to(directory, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.35, ease: "power3.out", scrollTrigger: lobby, onComplete: () => void gsap.set(directory, settle) });
        gsap.to(floors, {
          autoAlpha: 1,
          x: 0,
          duration: 0.55,
          delay: 0.55,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: lobby,
          onComplete: () => void gsap.set(floors, settle),
        });
        gsap.to(card, { autoAlpha: 1, y: 0, duration: 0.7, delay: 0.85, ease: "power3.out", scrollTrigger: lobby, onComplete: () => void gsap.set(card, settle) });
      });

      // fonts first (the heading splits into lines), then wait for the gateway
      document.fonts.ready.then(() => {
        if (ref.current) stopWaiting = afterIntro(build);
      });
      return () => stopWaiting();
    },
    { scope: ref }
  );

  return ref;
}
