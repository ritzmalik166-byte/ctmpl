"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { afterIntro } from "@/lib/helpers/afterIntro";
import { setSmoothScroll } from "@/lib/scroll/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

/**
 * Very smooth page scrolling (Lenis). The wheel glides to a stop instead of
 * stepping; touch screens keep their own native scrolling. Lenis runs on
 * GSAP's clock and tells ScrollTrigger about every move, so all the scroll
 * animations stay exactly in step. It holds still while the welcome gateway
 * plays, and isn't used at all with reduced motion (plain native scrolling).
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.075, // how much of the remaining distance each frame covers: low = silkier glide
      wheelMultiplier: 0.9,
      smoothWheel: true,
      anchors: true, // in-page links (#…) glide too
      autoRaf: false,
    });
    setSmoothScroll(lenis);

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // hold still while the welcome gateway plays
    const html = document.documentElement;
    if (html.dataset.gateway === "playing" || (html.dataset.gateway !== "done" && document.querySelector("[aria-label='Welcome']"))) lenis.stop();
    const stopWaiting = afterIntro(() => {
      lenis.start();
      lenis.resize();
      ScrollTrigger.refresh();
    });

    return () => {
      stopWaiting();
      gsap.ticker.remove(tick);
      lenis.destroy();
      setSmoothScroll(null);
    };
  }, []);

  return null;
}
