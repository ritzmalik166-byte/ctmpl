"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { afterIntro } from "@/lib/helpers/afterIntro";
import { waveRevealWords } from "@/lib/animations/waveReveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * "The company we keep" scroll entrance, once (no scrub, no timeline: tweens
 * on their own triggers, each starting as its part comes into view):
 *  - the label rises in, and the heading's and intro's words rise up in a wave;
 *  - the paper airplane glides in from the bottom left;
 *  - each rail: its wooden bar draws in from the left, then its visitor passes
 *    drop on their lanyards one after another, settling with a little bounce
 *    (then they carry on swinging as usual).
 * Only the passes' fixed slots move (the swing turns the pass inside), and
 * styles are cleared once they've arrived, so hovering, sliding and swinging
 * work exactly as before. Waits for fonts and the welcome gateway; with
 * reduced motion everything is simply there.
 */
export function useCompanyWeKeepReveal() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = ref.current;
      if (!root || !contextSafe || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const one = (name: string, scope: ParentNode = root) => scope.querySelector<HTMLElement>(`[data-cwk="${name}"]`)!;
      const all = (name: string, scope: Element = root) => gsap.utils.toArray<HTMLElement>(`[data-cwk="${name}"]`, scope);
      const [label, heading, intro] = ["label", "heading", "intro"].map((n) => one(n));
      const planes = all("plane");
      const rails = all("rail");
      const clear = (targets: gsap.TweenTarget) => () => void gsap.set(targets, { clearProps: "transform,opacity,visibility" });

      // hidden until seen (set before the first paint, so nothing flashes)
      gsap.set([label, heading, intro], { autoAlpha: 0 });
      gsap.set(planes, { autoAlpha: 0, x: -220, y: 120, rotation: 8 });
      rails.forEach((rail) => {
        gsap.set(all("bar", rail), { scaleX: 0, transformOrigin: "0% 50%" });
        gsap.set(all("pass", rail), { autoAlpha: 0, y: -70 });
      });

      let stopWaiting = () => {};
      const build = contextSafe(() => {
        const head = { trigger: heading, start: "top 82%", once: true };

        gsap.fromTo(label, { autoAlpha: 0, yPercent: 60 }, { autoAlpha: 1, yPercent: 0, duration: 0.8, ease: "power3.out", scrollTrigger: head, onComplete: clear(label) });
        waveRevealWords(heading, head);
        waveRevealWords(intro, { ...head, trigger: intro, start: "top 88%" });
        planes.forEach((plane) =>
          gsap.to(plane, { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: 1.4, delay: 0.2, ease: "power3.out", scrollTrigger: head, onComplete: clear(plane) })
        );

        rails.forEach((rail) => {
          const scrollTrigger = { trigger: rail, start: "top 82%", once: true };
          const bars = all("bar", rail);
          const passes = all("pass", rail);
          gsap.to(bars, { scaleX: 1, duration: 0.9, ease: "power3.inOut", scrollTrigger, onComplete: clear(bars) });
          gsap.to(passes, { autoAlpha: 1, y: 0, duration: 0.85, delay: 0.45, stagger: 0.1, ease: "back.out(1.6)", scrollTrigger, onComplete: clear(passes) });
        });
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
