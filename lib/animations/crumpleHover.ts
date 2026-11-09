"use client";

import { useId, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export type CrumpleHoverOptions = {
  /** Turn the effect off (the element then behaves as a normal link). */
  enabled?: boolean;
  /** Colours of the paper chunks that fly off: [before, after] works well. */
  chunkColors?: readonly string[];
};

/** Attribute the effect toggles at peak crumple; style the hovered look with it. */
export const CRUMPLED_ATTR = "data-flipped";

const CHUNKS_ON_ENTER = 9;

/**
 * Paper "crumple" hover: the element is crushed (squeeze + buckled edges +
 * creases), flips to its hover colours at peak crush, sheds a few paper chunks,
 * then springs back flat. Leaving does the same back to the resting colours.
 *
 * Markup contract (see ButtonLink):
 *  - an SVG filter with id `filterId` containing an <feDisplacementMap>
 *  - an overlay element with [data-crumple-creases]
 *  - hover colours styled via the `data-flipped` attribute
 */
export function useCrumpleHover<T extends HTMLElement>({ enabled = true, chunkColors = [] }: CrumpleHoverOptions = {}) {
  const ref = useRef<T>(null);
  const filterId = `crumple-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !enabled || !contextSafe) return;

      const displacement = el.querySelector("feDisplacementMap");
      const creases = el.querySelector<HTMLElement>("[data-crumple-creases]");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const bursts = new Set<HTMLElement>();
      let timeline: gsap.core.Timeline | undefined;

      const crumple = contextSafe((toHover: boolean) => {
        if (reduceMotion) {
          el.toggleAttribute(CRUMPLED_ATTR, toHover);
          return;
        }

        timeline?.kill();
        const crush = 0.16;
        timeline = gsap
          .timeline({ onComplete: () => gsap.set(el, { clearProps: "filter" }) })
          .set(el, { filter: `url(#${filterId})` })
          // crush: squeeze, buckle the edges, show the creases
          .to(el, { scaleX: 0.9, scaleY: 0.8, rotation: gsap.utils.random(-3, 3), duration: crush, ease: "power2.in" }, 0)
          .to(displacement, { attr: { scale: 9 }, duration: crush, ease: "power2.in" }, 0)
          .to(creases, { opacity: 1, duration: crush }, 0)
          // peak: new colours, and a few chunks tear off
          .call(() => {
            el.toggleAttribute(CRUMPLED_ATTR, toHover);
            if (toHover) burstChunks(el, chunkColors, bursts);
          }, undefined, crush)
          // release: spring back flat, faint creases remain while hovered
          .to(el, { scaleX: 1, scaleY: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.45)" }, crush)
          .to(displacement, { attr: { scale: 0 }, duration: 0.35, ease: "power2.out" }, crush)
          .to(creases, { opacity: toHover ? 0.45 : 0, duration: 0.45, ease: "power1.out" }, crush);
      });

      const onEnter = (event: PointerEvent) => event.pointerType === "mouse" && crumple(true);
      const onLeave = (event: PointerEvent) => event.pointerType === "mouse" && crumple(false);
      const onFocus = () => el.matches(":focus-visible") && crumple(true);
      const onBlur = () => el.hasAttribute(CRUMPLED_ATTR) && crumple(false);

      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
      el.addEventListener("focus", onFocus);
      el.addEventListener("blur", onBlur);

      return () => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
        el.removeEventListener("focus", onFocus);
        el.removeEventListener("blur", onBlur);
        bursts.forEach((burst) => burst.remove());
      };
    },
    { scope: ref, dependencies: [enabled, filterId, chunkColors] }
  );

  return { ref, filterId };
}

/**
 * Small torn paper scraps that pop off the element's edges and fall away.
 * Rendered in a fixed layer on <body> so they are never clipped or filtered.
 */
function burstChunks(el: HTMLElement, colors: readonly string[], bursts: Set<HTMLElement>) {
  if (colors.length === 0) return;
  const rect = el.getBoundingClientRect();
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden";
  document.body.appendChild(layer);
  bursts.add(layer);

  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const random = gsap.utils.random;
  const tweens: Promise<unknown>[] = [];

  for (let i = 0; i < CHUNKS_ON_ENTER; i++) {
    // start somewhere along the edge of the button
    const t = Math.random();
    const onTopOrBottom = Math.random() < 0.7;
    const x = onTopOrBottom ? rect.left + t * rect.width : Math.random() < 0.5 ? rect.left : rect.right;
    const y = onTopOrBottom ? (Math.random() < 0.5 ? rect.top : rect.bottom) : rect.top + t * rect.height;

    const size = random(4, 9);
    const chunk = document.createElement("span");
    // irregular torn shape: a random 4–5 point polygon
    const cornerCount = Math.random() < 0.5 ? 4 : 5;
    const corners = Array.from({ length: cornerCount }, (_, k) => {
      const angle = (k / cornerCount) * Math.PI * 2 + random(-0.4, 0.4);
      const r = random(35, 50);
      return `${50 + Math.cos(angle) * r}% ${50 + Math.sin(angle) * r}%`;
    });
    chunk.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size * random(0.6, 1)}px;background:${gsap.utils.random(colors as string[])};clip-path:polygon(${corners.join(",")});box-shadow:0 1px 1px rgba(0,0,0,.15)`;
    layer.appendChild(chunk);

    // fly outward from the centre, then gravity takes over
    const dx = (x - cx) / (rect.width / 2);
    const dy = (y - cy) / (rect.height / 2);
    const lift = random(18, 38);
    tweens.push(
      gsap
        .timeline()
        .to(chunk, { x: dx * random(14, 36), duration: 0.9, ease: "power1.out" }, 0)
        .to(chunk, { y: dy * random(6, 14) - lift, duration: 0.3, ease: "power2.out" }, 0)
        .to(chunk, { y: `+=${lift + random(30, 60)}`, duration: 0.6, ease: "power2.in" }, 0.3)
        .to(chunk, { rotation: random(-260, 260), duration: 0.9, ease: "none" }, 0)
        .to(chunk, { opacity: 0, duration: 0.3, ease: "power1.in" }, 0.6)
        .then()
    );
  }

  Promise.all(tweens).then(() => {
    layer.remove();
    bursts.delete(layer);
  });
}
