"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const DRAW = 0.75;
const WIPE = 0.3;

/**
 * Hand-drawn marker circles on the whiteboard stats.
 *
 * Each circle is a stroke with `pathLength="1"`: dash offset 1 = hidden,
 * 0 = fully drawn. Hidden circles are also transparent: a round line cap
 * would otherwise leave a stray marker dot at the end of an "empty" dash.
 *
 * Only one marker is ever drawn at a time. Every change goes through a single
 * timeline: the previous run is cancelled, any visible circle is wiped away
 * along its path, and only then is the new active circle drawn (with a fresh
 * tilt and size, like a new pen stroke).
 *
 * Pass the active stat index; mark each circle `data-marker-index="n"`.
 */
export function useMarkerCircles(activeIndex: number) {
  const ref = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const firstRun = useRef(true);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const circles = gsap.utils.toArray<SVGSVGElement>("[data-marker-index]", root);
      const pathOf = (svg: SVGSVGElement) => svg.querySelector("path")!;
      const active = circles.find((svg) => Number(svg.dataset.markerIndex) === activeIndex);
      const others = circles.filter((svg) => svg !== active);

      const hide = (path: SVGPathElement) => gsap.set(path, { strokeDashoffset: 1, opacity: 0 });
      const isVisible = (path: SVGPathElement) => Number(gsap.getProperty(path, "opacity")) > 0;

      // First render (or reduced motion): just show the right state.
      const instant = firstRun.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      firstRun.current = false;
      if (instant) {
        others.forEach((svg) => hide(pathOf(svg)));
        if (active) gsap.set(pathOf(active), { strokeDashoffset: 0, opacity: 1 });
        return;
      }

      // Cancel whatever was being drawn or wiped; one marker at a time.
      timeline.current?.kill();
      const tl = gsap.timeline();
      timeline.current = tl;

      // 1. wipe every other circle that is (even partly) on the board
      const toWipe = others.map(pathOf).filter(isVisible);
      if (active) {
        const activePath = pathOf(active);
        // the active one may be half-drawn from an earlier hover: start it clean
        if (isVisible(activePath)) toWipe.push(activePath);
      }
      toWipe.forEach((path) => {
        tl.to(path, { strokeDashoffset: -1, duration: WIPE, ease: "power2.in" }, 0).add(() => hide(path));
      });

      // 2. then draw the new one
      if (active) {
        const path = pathOf(active);
        tl.add(() => {
          gsap.set(active, { rotation: gsap.utils.random(-4, 4), scale: gsap.utils.random(0.95, 1.05) });
          gsap.set(path, { strokeDashoffset: 1, opacity: 1 });
        }, toWipe.length ? WIPE + 0.05 : 0.08);
        tl.to(path, { strokeDashoffset: 0, duration: DRAW, ease: "power1.inOut" });
      }
    },
    { scope: ref, dependencies: [activeIndex], revertOnUpdate: false }
  );

  return ref;
}
