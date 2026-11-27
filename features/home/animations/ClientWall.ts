"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** How fast the rows of frames glide (px per second), and how much a scroll can speed them up. */
const SPEED = 26;
const MAX_BOOST = 6;

/**
 * The reception wall. Its rows of frames (`[data-row]`, `data-direction` 1 or
 * −1, the frames laid out twice over in `[data-track]` so they run on forever)
 * glide slowly along under the track lights, each its own way; a scroll speeds
 * them up for a moment. Pointing at a row (or tabbing to a frame in it) brings
 * it to a stop. As the wall comes into view its lights (`[data-light]`)
 * flicker (they're on from the start, and end on) and the notice (`[data-sign]`) is put up.
 * The rows only move while the section's on screen; with reduced motion they
 * stand still and the lights simply stay on.
 */
export function useClientWall(ref: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", section).map((row) => {
        const track = row.querySelector<HTMLElement>("[data-track]")!;
        const state = {
          track,
          dir: Number(row.dataset.direction) || -1,
          set: 0,
          x: 0,
          speed: SPEED,
          held: false,
          setX: gsap.quickSetter(track, "x", "px") as (v: number) => void,
        };
        row.addEventListener("pointerenter", () => (state.held = true));
        row.addEventListener("pointerleave", () => (state.held = false));
        row.addEventListener("focusin", () => (state.held = true));
        row.addEventListener("focusout", () => (state.held = false));
        return state;
      });

      const measure = () => {
        for (const r of rows) {
          r.set = r.track.scrollWidth / 2;
          r.x = r.dir < 0 ? 0 : -r.set;
          r.setX(r.x);
        }
      };
      measure();

      let boost = 1;
      let visible = false;
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (visible = self.isActive),
        onUpdate: (self) => (boost = Math.max(boost, Math.min(MAX_BOOST, 1 + Math.abs(self.getVelocity()) / 300))),
      });

      const tick = (_: number, deltaMs: number) => {
        if (!visible || reduced) return;
        const dt = Math.min(deltaMs, 50) / 1000;
        boost += (1 - boost) * Math.min(1, dt * 1.5);
        for (const r of rows) {
          const target = r.held ? 0 : SPEED * boost;
          r.speed += (target - r.speed) * Math.min(1, dt * (r.held ? 6 : 2));
          r.x += r.speed * dt * r.dir;
          if (r.x <= -r.set) r.x += r.set;
          else if (r.x > 0) r.x -= r.set;
          r.setX(r.x);
        }
      };
      gsap.ticker.add(tick);
      window.addEventListener("resize", measure);

      // the lights flickering as you walk up to the wall, and the notice going up
      const lights = gsap.utils.toArray<HTMLElement>("[data-light]", section);
      const sign = section.querySelector("[data-sign]");
      // (the lights are on to begin with: the flicker only plays over them, and always ends with them on)
      if (!reduced) {
        const on = gsap.timeline({ paused: true });
        lights.forEach((light, i) => {
          on.to(light, { keyframes: [{ opacity: 0.25, duration: 0.05 }, { opacity: 0.9, duration: 0.06 }, { opacity: 0.15, duration: 0.07 }, { opacity: 1, duration: 0.2 }] }, 0.15 + i * 0.08);
        });
        if (sign) on.fromTo(sign, { autoAlpha: 0, y: 14, rotation: -4 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.6, ease: "back.out(1.7)" }, 0.3);
        ScrollTrigger.create({ trigger: section, start: "top 70%", once: true, onEnter: () => void on.play() });
      }

      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("resize", measure);
        trigger.kill();
      };
    },
    { scope: ref }
  );
}
