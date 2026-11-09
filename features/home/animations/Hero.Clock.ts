"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getHandAngles, getIndianTime } from "@/lib/helpers/indianTime";

gsap.registerPlugin(useGSAP);

const HAND = {
  hour: "[data-clock-hand='hour']",
  minute: "[data-clock-hand='minute']",
  second: "[data-clock-hand='second']",
};

/**
 * Runs the hero wall clock on live Indian time.
 *
 * - Ticks exactly on each real second (re-synced every tick, so it never drifts).
 * - The second hand "ticks" like a quartz movement with a tiny overshoot;
 *   minute and hour hands creep forward smoothly.
 * - `_short` rotation means 59s → 0s (and 11 → 12) moves forward, never spins back.
 * - Hands stay hidden until they show the correct time, so there's no 12:00 flash.
 *
 * Returns a ref for the clock element that contains the [data-clock-hand] layers.
 */
export function useIndianClock() {
  const clockRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let timer: number | undefined;

      const moveHands = (animate: boolean) => {
        const angles = getHandAngles(getIndianTime());

        if (!animate || reduceMotion) {
          gsap.set(HAND.hour, { rotation: angles.hour });
          gsap.set(HAND.minute, { rotation: angles.minute });
          gsap.set(HAND.second, { rotation: angles.second });
          return;
        }

        gsap.to(HAND.second, {
          rotation: `${angles.second}_short`,
          duration: 0.35,
          ease: "back.out(3.5)",
          overwrite: true,
        });
        const creep = { duration: 0.5, ease: "power2.out", overwrite: true } as const;
        gsap.to(HAND.minute, { rotation: `${angles.minute}_short`, ...creep });
        gsap.to(HAND.hour, { rotation: `${angles.hour}_short`, ...creep });
      };

      // Fire right after each whole second so the hand moves with real time.
      const scheduleNextTick = () => {
        timer = window.setTimeout(() => {
          moveHands(true);
          scheduleNextTick();
        }, 1000 - (Date.now() % 1000));
      };

      // Browsers throttle timers in background tabs; snap back when visible.
      const onVisibilityChange = () => {
        if (document.visibilityState === "visible") moveHands(true);
      };

      // Hands pivot from their bottom-centre, which sits on the clock's centre.
      gsap.set(Object.values(HAND), { xPercent: -50, transformOrigin: "50% 100%" });
      moveHands(false);
      gsap.to(clockRef.current, { autoAlpha: 1, duration: reduceMotion ? 0 : 0.4 });

      scheduleNextTick();
      document.addEventListener("visibilitychange", onVisibilityChange);

      return () => {
        window.clearTimeout(timer);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    },
    { scope: clockRef }
  );

  return clockRef;
}
