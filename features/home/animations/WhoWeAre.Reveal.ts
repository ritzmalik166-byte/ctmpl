"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { afterIntro } from "@/lib/helpers/afterIntro";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Marker writing: wiped on left to right, a touch soft at the leading edge. */
const HIDDEN_WRITING = "inset(-20% 100% -20% 0%)";
const SHOWN_WRITING = "inset(-20% -2% -20% 0%)";

/**
 * The whiteboard room's entrance, once, when it scrolls into view (no scrub):
 *  1. the room (or the phone board) rises softly into place;
 *  2. the magnets pop onto the board one by one, with a little wobble, like
 *     they're being stuck on;
 *  3. the title is written on in marker, left to right;
 *  4. the stats are written one after another, each caption following, and
 *     the marker circle is drawn round the first one;
 *  5. the story line is written along the bottom;
 *  6. Meera and her colleague step up into place, like paper cut-outs.
 * Everything is found by `data-reveal` inside the returned ref. It waits for the
 * welcome gateway, is skipped for a layout hidden at this screen size, and with
 * reduced motion everything is simply there.
 */
export function useWhiteboardReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = ref.current;
      if (!root || !contextSafe) return;
      if (root.getClientRects().length === 0) return; // the other layout (hidden here)
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const all = (name: string) => gsap.utils.toArray<HTMLElement>(`[data-reveal="${name}"]`, root);
      const [room, magnets, writing, stats, captions, characters] = ["room", "magnet", "write", "stat", "caption", "character"].map(all);
      const [title, ...story] = writing;
      // the marker circle already showing (round the first stat)
      const circle = root.querySelector<SVGPathElement>('[data-marker-index="0"] path');

      // hidden until it's seen (set before the first paint, so nothing flashes)
      gsap.set(room, { autoAlpha: 0, y: 40 });
      gsap.set(magnets, { autoAlpha: 0, scale: 0.4, rotation: -14 });
      gsap.set([...writing, ...stats], { clipPath: HIDDEN_WRITING });
      gsap.set(captions, { autoAlpha: 0, y: 8 });
      gsap.set(characters, { autoAlpha: 0, y: 46, rotation: -2.5, transformOrigin: "50% 100%" });
      if (circle) gsap.set(circle, { strokeDashoffset: 1 });

      let stopWaiting = () => {};
      const build = contextSafe(() => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 72%", once: true },
          defaults: { ease: "power3.out" },
        });
        tl.to(room, { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" }, 0)
          .to(magnets, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.55, ease: "back.out(2.2)", stagger: 0.09 }, 0.45)
          .to(title, { clipPath: SHOWN_WRITING, duration: 0.9, ease: "power1.inOut" }, 0.6);
        stats.forEach((stat, i) => {
          const at = 1.25 + i * 0.32;
          tl.to(stat, { clipPath: SHOWN_WRITING, duration: 0.55, ease: "power1.inOut" }, at).to(captions[i], { autoAlpha: 1, y: 0, duration: 0.45 }, at + 0.3);
        });
        const afterStats = 1.25 + stats.length * 0.32 + 0.3;
        if (circle) tl.to(circle, { strokeDashoffset: 0, duration: 0.75, ease: "power1.inOut" }, afterStats);
        tl.to(story, { clipPath: SHOWN_WRITING, duration: 1.3, ease: "power1.inOut" }, afterStats + 0.2)
          .to(characters, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.8, ease: "back.out(1.5)", stagger: 0.15 }, 0.85)
          // settled: nothing left clipped or moved
          .set([...room, ...magnets, ...writing, ...stats, ...captions, ...characters], { clearProps: "transform,clipPath" });
      });

      if (root.getClientRects().length) stopWaiting = afterIntro(build);
      return () => stopWaiting();
    },
    { scope: ref }
  );

  return ref;
}
