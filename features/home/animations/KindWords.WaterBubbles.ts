"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** The bottle's inside, in px of the bubble layer (see WaterBubbles): its walls, bottom, shoulders and neck. */
const BOTTLE = { left: 12, right: 98, bottom: 182, shoulder: 48, neck: { left: 42, right: 68, top: 8 } };
/** A steady trickle of tiny bubbles (s between them)… */
const TRICKLE = [0.35, 0.8];
/** …and every few seconds a "glug": one big bubble and a stream of small ones. */
const GLUG = [2.8, 4.2];
/** A bubble: a thin bright rim, a highlight up-left, nearly clear inside. */
const BUBBLE_LOOK = {
  position: "absolute",
  borderRadius: "9999px",
  border: "1px solid rgba(255,255,255,0.7)",
  background: "radial-gradient(circle at 32% 30%, rgba(255,255,255,0.85) 0 18%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0.08) 100%)",
};

/**
 * Bubbles rising in the water cooler's bottle: a gentle trickle of tiny ones,
 * and now and then a glug, a big wobbling bubble followed by a little stream,
 * as if someone had just filled a cup. Each rises with a slight wobble, swells
 * a touch as it goes up, and pops at the top of the water. The bubbles are
 * clipped to the bottle's shape. Runs only on screen; none with reduced motion.
 */
export function useWaterBubbles() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const layer = ref.current;
      if (!layer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const { random } = gsap.utils;
      let visible = false;
      const timers: { trickle?: gsap.core.Tween; glug?: gsap.core.Tween } = {};

      /** One bubble of `size` px from (x, bottom), rising to `top` over `seconds`. */
      const bubble = (x: number, size: number, top: number, seconds: number, delay = 0) => {
        const el = document.createElement("span");
        Object.assign(el.style, { ...BUBBLE_LOOK, width: `${size}px`, height: `${size}px`, left: `${x - size / 2}px`, top: `${BOTTLE.bottom - size}px` });
        layer.appendChild(el);
        const wobble = random(1.5, 3.5) * (size > 6 ? 1.4 : 1);
        gsap
          .timeline({ delay, onComplete: () => el.remove() })
          .fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power1.out" })
          .fromTo(el, { scale: 0.6 }, { y: top - BOTTLE.bottom, scale: 1.25, duration: seconds, ease: "power1.in" }, 0)
          .to(el, { x: wobble, duration: seconds / 6, ease: "sine.inOut", yoyo: true, repeat: 5 }, 0)
          .to(el, { scale: 1.6, opacity: 0, duration: 0.14, ease: "power1.out" }, seconds - 0.05); // pop
      };

      const startX = () => random(BOTTLE.left + 6, BOTTLE.right - 6);
      const topOfWater = (x: number) =>
        x > BOTTLE.neck.left && x < BOTTLE.neck.right && Math.random() < 0.3 ? random(BOTTLE.neck.top, 26) : random(BOTTLE.shoulder, BOTTLE.shoulder + 14);

      const trickle = () => {
        if (visible) {
          const x = startX();
          bubble(x, random(2, 4.5), topOfWater(x), random(2, 3));
        }
        timers.trickle = gsap.delayedCall(random(TRICKLE[0], TRICKLE[1]), trickle);
      };
      const glug = () => {
        if (visible) {
          const x = random(40, 70);
          bubble(x, random(8, 11), random(BOTTLE.neck.top, 20), random(1.5, 1.9)); // the big one, up into the neck
          for (let i = 0, n = random(4, 7, 1); i < n; i++) bubble(x + random(-10, 10), random(2.5, 5.5), topOfWater(x), random(1.6, 2.3), 0.12 + i * random(0.07, 0.14));
        }
        timers.glug = gsap.delayedCall(random(GLUG[0], GLUG[1]), glug);
      };

      const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
      observer.observe(layer);
      trickle();
      timers.glug = gsap.delayedCall(1.2, glug);

      return () => {
        observer.disconnect();
        timers.trickle?.kill();
        timers.glug?.kill();
        layer.replaceChildren();
      };
    },
    { scope: ref }
  );

  return ref;
}
