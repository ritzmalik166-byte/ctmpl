"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** The sky at each time of day (top and bottom of the gradient). */
const SKY = {
  night: { top: "#191b29", bottom: "#262a40" },
  dawn: { top: "#46508a", bottom: "#f4a77e" },
  morning: { top: "#7fb4e6", bottom: "#ffe0c2" },
  noon: { top: "#4f9be0", bottom: "#c4e6f8" },
  evening: { top: "#5d4b8c", bottom: "#f59a5e" },
};
/** Seconds: the night (the moon's crossing), the day (the sun's), and the turns between. */
const NIGHT = 14;
const DAY = 15;
const TURN = 2.2;
/** The sun's colours as it crosses: warm at sunrise, white-gold at noon, red-orange at sunset. */
const SUN = {
  rise: { "--sun-core": "#ffd27a", "--sun-edge": "#f08a3c", "--sun-glow": "rgba(255,160,80,0.7)" },
  noon: { "--sun-core": "#fff1b8", "--sun-edge": "#ffd166", "--sun-glow": "rgba(255,232,160,0.6)" },
  set: { "--sun-core": "#ffb35c", "--sun-edge": "#e2552d", "--sun-glow": "rgba(255,110,60,0.72)" },
};
/** How strongly the buildings are lit by day (a pale-blue wash over them). */
const DAYLIGHT = 0.42;

/**
 * Night and day over the footer's city (see FooterSkyline), round and round:
 *  - night: the moon rises at the left and crosses to the right, in an arc,
 *    the stars drifting right with it; windows light up and go out here and
 *    there all night;
 *  - as the moon leaves, dawn: the sky warms, the stars fade, the lights go
 *    out one by one and the sun comes up at the left;
 *  - the sun crosses, morning → noon → evening, with small birds flying past;
 *  - as it sets at the right, dusk: the sky darkens, the stars come out, the
 *    windows light up again and the moon rises.
 * The moon glows softly, its halo breathing; the sun's colours warm and cool
 * through the day; the CTM sign glows orange all night
 * (flickering on at dusk, off at dawn).
 * It starts in the night (the moon near where the artwork has it), runs only
 * while the footer is on screen, and with reduced motion stays as night.
 */
export function useSkylineCycle() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const one = (name: string) => root.querySelector<HTMLElement>(`[data-sky="${name}"]`)!;
      const all = (name: string) => gsap.utils.toArray<HTMLElement>(`[data-sky="${name}"]`, root);
      const [sky, stars, moon, sun, daylight] = ["sky", "stars", "moon", "sun", "daylight"].map(one);
      const [moonGlow, signHalo, signFace] = ["moon-glow", "sign-halo", "sign-face"].map(one);
      const sign = [signHalo, signFace];
      const windows = all("window");
      const litAtNight = windows.filter((w) => w.dataset.lit === "1");
      const { random } = gsap.utils;

      /** A body (moon or sun) crossing the sky left to right in an arc, high over the CTM building: p 0 → 1. */
      const cross = (body: HTMLElement, p: number) =>
        gsap.set(body, { left: `${-8 + 116 * p}%`, top: `${33 - 30 * Math.sin(Math.PI * p)}%` });
      const moonPath = { p: 0 };
      const sunPath = { p: 0 };
      const skyTo = (time: keyof typeof SKY, duration: number) => ({ "--sky-top": SKY[time].top, "--sky-bottom": SKY[time].bottom, duration, ease: "sine.inOut" });

      /** Lights going out (or on) one after another over `seconds`. */
      const switchLights = (tl: gsap.core.Timeline, list: HTMLElement[], on: boolean, at: number, seconds: number) =>
        gsap.utils.shuffle([...list]).forEach((w, i, l) => tl.to(w, { opacity: on ? 1 : 0, duration: 0.25 }, at + (seconds * i) / l.length));

      const dawnAt = NIGHT;
      const dayAt = NIGHT + TURN;
      const duskAt = NIGHT + TURN + DAY;
      const cycle = gsap.timeline({ repeat: -1 });
      cycle
        // night: the moon crosses, the stars drift right with it
        .set(moon, { autoAlpha: 1 }, 0)
        .fromTo(moonPath, { p: 0 }, { p: 1, duration: NIGHT, ease: "none", onUpdate: () => cross(moon, moonPath.p) }, 0)
        .fromTo(stars, { xPercent: 0 }, { xPercent: 50, duration: NIGHT + TURN * 2, ease: "none" }, 0)
        .to(stars, { autoAlpha: 1, duration: 1.2 }, 0)
        // dawn
        .to(sky, skyTo("dawn", TURN), dawnAt)
        .to(stars, { autoAlpha: 0, duration: TURN }, dawnAt)
        .to(daylight, { opacity: DAYLIGHT * 0.6, duration: TURN, ease: "sine.inOut" }, dawnAt)
        .set(moon, { autoAlpha: 0 }, dayAt)
        // day: the sun crosses, morning → noon → evening
        .set(sun, { autoAlpha: 1 }, dawnAt + TURN * 0.5)
        .fromTo(sunPath, { p: 0 }, { p: 1, duration: DAY + TURN, ease: "none", onUpdate: () => cross(sun, sunPath.p) }, dawnAt + TURN * 0.5)
        .set(sun, SUN.rise, dawnAt)
        .to(sun, { ...SUN.noon, duration: DAY * 0.45, ease: "sine.inOut" }, dayAt + DAY * 0.1)
        .to(sun, { ...SUN.set, duration: DAY * 0.4, ease: "sine.inOut" }, dayAt + DAY * 0.58)
        // the CTM sign switches off with the daylight
        .to(sign, { autoAlpha: 0, duration: 0.8, ease: "power1.in" }, dawnAt + 0.6)
        .to(sky, skyTo("morning", DAY * 0.3), dayAt)
        .to(daylight, { opacity: DAYLIGHT, duration: DAY * 0.3, ease: "sine.inOut" }, dayAt)
        .to(sky, skyTo("noon", DAY * 0.25), dayAt + DAY * 0.3)
        .to(sky, skyTo("evening", DAY * 0.35), dayAt + DAY * 0.62)
        .to(daylight, { opacity: DAYLIGHT * 0.5, duration: DAY * 0.35, ease: "sine.inOut" }, dayAt + DAY * 0.62)
        // dusk
        .to(sky, skyTo("night", TURN * 1.4), duskAt)
        // the CTM sign flickers on, neon style
        .set(sign, { autoAlpha: 0.6 }, duskAt + 0.5)
        .set(sign, { autoAlpha: 0 }, duskAt + 0.58)
        .set(sign, { autoAlpha: 0.9 }, duskAt + 0.72)
        .set(sign, { autoAlpha: 0.15 }, duskAt + 0.8)
        .to(sign, { autoAlpha: 1, duration: 0.3 }, duskAt + 0.95)
        .to(daylight, { opacity: 0, duration: TURN * 1.4, ease: "sine.inOut" }, duskAt)
        .set(sun, { autoAlpha: 0 }, duskAt + TURN)
        .to(stars, { autoAlpha: 1, duration: TURN }, duskAt + TURN * 0.4);
      // the windows: out at dawn, on again from evening into the night
      switchLights(cycle, windows, false, dawnAt - 0.6, TURN + 1.2);
      switchLights(cycle, litAtNight, true, duskAt - 1.2, TURN + 1.6);
      // a couple of flocks of small birds by day, flapping as they go
      ["flock-1", "flock-2"].forEach((name, i) => {
        const flock = one(name);
        const start = dayAt + 1.5 + i * 5.5;
        const across = 7.5 - i;
        cycle
          .set(flock, { autoAlpha: 1, left: "-18%", top: `${8 + i * 9}%` }, start)
          .to(flock, { left: "104%", duration: across, ease: "none" }, start)
          .to(flock, { top: `${4 + i * 9}%`, duration: across / 4, ease: "sine.inOut", yoyo: true, repeat: 3 }, start)
          .set(flock, { autoAlpha: 0 }, start + across);
      });
      const flapping = all("bird").map((bird) =>
        gsap.to(bird, { scaleY: 0.35, duration: random(0.16, 0.24), ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 70%", delay: random(0, 0.3) })
      );

      // through the night, a window here and there goes out or comes on
      const flicker = gsap.delayedCall(random(0.6, 1.4), function toggle() {
        const night = cycle.time() < dawnAt - 1 || cycle.time() > duskAt + TURN + 1;
        if (night) {
          const w = windows[Math.floor(random(0, windows.length))];
          gsap.to(w, { opacity: Number(gsap.getProperty(w, "opacity")) > 0.5 ? 0 : 1, duration: 0.2 });
        }
        flicker.restart(true).delay(random(0.5, 1.4));
      });

      // start in the night, the moon about where the artwork has it
      cycle.time(NIGHT * 0.8);
      cross(moon, 0.8);

      // the moon's glow breathes; the lit sign hums
      const moonBreath = gsap.fromTo(moonGlow, { scale: 0.92, opacity: 0.75 }, { scale: 1.12, opacity: 1, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      const signHum = gsap.fromTo(signHalo, { scale: 0.96 }, { scale: 1.06, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });

      const running = [cycle, flicker, moonBreath, signHum, ...flapping];
      const observer = new IntersectionObserver(([entry]) => running.forEach((a) => (entry.isIntersecting ? a.resume() : a.pause())));
      observer.observe(root);
      return () => observer.disconnect();
    },
    { scope: ref }
  );

  return ref;
}
