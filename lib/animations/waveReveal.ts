"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * The site's text entrance: a block's words rise up from just under their
 * line, one after another in a quick wave (each line is masked, so words
 * appear from beneath it). Played by `scrollTrigger` (once, no scrub).
 * If the lines change on resize the text is re-split, keeping the progress.
 * Call after fonts have loaded, so lines split where they'll stay.
 */
export function waveRevealWords(block: HTMLElement, scrollTrigger: ScrollTrigger.Vars) {
  gsap.set(block, { autoAlpha: 1 });
  return SplitText.create(block, {
    type: "lines,words",
    mask: "lines",
    aria: "auto",
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.words, {
        yPercent: 110,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.035,
        scrollTrigger,
      }),
  });
}
