"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The visitor register's signatures write themselves in, pen-stroke by
 * pen-stroke, as each line of the register scrolls into view (once). Each
 * signature path has pathLength 1, so its dash runs from 1 (none drawn) to 0
 * (all drawn). With reduced motion they're simply there.
 */
export function useSignatureInk(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<SVGPathElement>("[data-ink]", scope.current).forEach((path) => {
        gsap.fromTo(
          path,
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.6,
            delay: 0.35,
            ease: "power1.inOut",
            scrollTrigger: { trigger: path.closest("li") ?? path, start: "top 88%", once: true },
          }
        );
      });
    },
    { scope }
  );
}
