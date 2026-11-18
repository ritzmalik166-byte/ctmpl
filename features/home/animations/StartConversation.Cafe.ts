"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { afterIntro } from "@/lib/helpers/afterIntro";
import { breathe, talk, usePuppet } from "./puppet";

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

/**
 * The café barista, round and round: she tells you something (her mouth
 * moving, her head nodding and tilting along), then serves the coffee: the cup
 * comes forward to you in both hands, held there a moment, and back. In
 * between she breathes; her blink is a CSS animation. Waits for the welcome
 * gateway and pauses off screen (see usePuppet).
 */
export function useCafeBarista() {
  return usePuppet((q) => {
    const [figure, head, mouth, hands] = [q("figure"), q("head"), q("mouth"), q("hands")];
    const loop = gsap.timeline({ repeat: -1, repeatDelay: 1.2, delay: 0.8 });

    // she tells you something: two phrases with a breath between, the head going along
    let t = talk(loop, mouth, 0, 7);
    t = talk(loop, mouth, t + 0.35, 6);
    loop
      .to(head, { rotation: -3, duration: 0.5, ease: "sine.inOut" }, 0)
      .to(head, { rotation: 2.5, duration: 0.6, ease: "sine.inOut" }, 0.7)
      .to(head, { rotation: -1.5, y: 3, duration: 0.45, ease: "sine.inOut" }, 1.5) // a nod
      .to(head, { rotation: 0, y: 0, duration: 0.5, ease: "sine.inOut" }, t);

    // then serves the coffee: leans in, the cup comes forward in both hands, held, and back
    const serve = t + 0.6;
    loop
      .to(figure, { scale: 1.015, y: 4, duration: 0.7, ease: "sine.inOut" }, serve)
      .to(hands, { y: -26, scale: 1.12, duration: 0.8, ease: "power2.out" }, serve)
      .to(head, { rotation: 2, y: 4, duration: 0.6, ease: "sine.inOut" }, serve + 0.1) // a smile-nod as she offers it
      .to(hands, { y: -22, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: 1 }, serve + 0.8) // holding it out
      .to(hands, { y: 0, scale: 1, duration: 0.8, ease: "power2.inOut" }, serve + 2.1)
      .to(figure, { scale: 1, y: 0, duration: 0.7, ease: "sine.inOut" }, serve + 2.1)
      .to(head, { rotation: 0, y: 0, duration: 0.6, ease: "sine.inOut" }, serve + 2.1);

    return [loop, breathe(figure)];
  });
}

/** Seconds between one ceiling light blinking and the next. */
const LIGHT_STEP = 3;

/** One light catching: a quick flicker, then on. */
function switchOn(tl: gsap.core.Timeline, lamp: HTMLElement, at: number) {
  tl.set(lamp, { autoAlpha: 0.9 }, at)
    .set(lamp, { autoAlpha: 0.1 }, at + 0.07)
    .set(lamp, { autoAlpha: 0.75 }, at + 0.16)
    .set(lamp, { autoAlpha: 0.2 }, at + 0.22)
    .to(lamp, { autoAlpha: 1, duration: 0.3, ease: "power2.out" }, at + 0.3);
}

/** One light going: a quick flicker, then off. */
function switchOff(tl: gsap.core.Timeline, lamp: HTMLElement, at: number) {
  tl.set(lamp, { autoAlpha: 0.15 }, at)
    .set(lamp, { autoAlpha: 0.85 }, at + 0.07)
    .set(lamp, { autoAlpha: 0.2 }, at + 0.16)
    .set(lamp, { autoAlpha: 0.7 }, at + 0.22)
    .to(lamp, { autoAlpha: 0, duration: 0.35, ease: "power2.in" }, at + 0.3);
}

/**
 * The paper plane's routes across the café, in fractions of the scene (x of
 * its width, y of its height), each a curve: left to right, right to left, and
 * from the bottom left up to the top right.
 */
const FLIGHTS = [
  [{ x: -0.08, y: 0.36 }, { x: 0.22, y: 0.16 }, { x: 0.5, y: 0.34 }, { x: 0.76, y: 0.12 }, { x: 1.08, y: 0.26 }],
  [{ x: 1.08, y: 0.18 }, { x: 0.74, y: 0.42 }, { x: 0.46, y: 0.16 }, { x: 0.2, y: 0.38 }, { x: -0.08, y: 0.2 }],
  [{ x: -0.06, y: 0.8 }, { x: 0.28, y: 0.56 }, { x: 0.55, y: 0.64 }, { x: 0.8, y: 0.3 }, { x: 1.06, y: -0.06 }],
];
/** Each flight takes this long (s), unhurried, and a new one sets off every FLIGHT_EVERY seconds. */
const FLIGHT_TIME = 6.5;
const FLIGHT_EVERY = 10;
/** How long the barrel roll takes (s), and how much closer the plane seems at its middle. */
const ROLL_TIME = 2;
const ROLL_SWELL = 1.18;

/**
 * The café scene, round and round once it scrolls into view (paused while
 * it's off screen):
 *  - the three ceiling lights (`[data-lamp]`, each a halo and a beam) are all
 *    on to begin with; then every 3 s the next one flickers: the first goes
 *    off, then the second, then the third, then the first flickers back on,
 *    the second, the third, and round again;
 *  - the little orange paper plane (`[data-cafe-plane]`) flies across every 10 s, taking each
 *    route in FLIGHTS in turn, its nose following the curve; on the way it does
 *    a real 3D barrel roll (it turns over about its own length, in
 *    perspective, swelling a little as it comes round), and heading left it's
 *    rolled the right way up.
 * Rebuilt if the window is resized (the routes are in px of the scene).
 */
export function useCafeLights() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    (_, contextSafe) => {
      const scene = ref.current;
      if (!scene || !contextSafe) return;
      const lamps = gsap.utils.toArray<HTMLElement>("[data-lamp]", scene);
      const plane = scene.querySelector<HTMLElement>("[data-cafe-plane]");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(lamps, { autoAlpha: 1 });
        return;
      }
      gsap.set(lamps, { autoAlpha: 1 }); // all on to begin with
      const roll = scene.querySelector<HTMLElement>("[data-cafe-roll]");
      if (plane) gsap.set(plane, { autoAlpha: 0, xPercent: -50, yPercent: -50 }); // placed by its centre
      if (roll) gsap.set(roll, { transformPerspective: 420 });

      let lights: gsap.core.Timeline | null = null;
      let flying: gsap.core.Timeline | null = null;
      let started = false;
      let visible = false;
      const run = () => [lights, flying].forEach((t) => (started && visible ? t?.resume() : t?.pause()));

      const buildFlights = contextSafe(() => {
        flying?.kill();
        if (!plane) return;
        const { width, height } = scene.getBoundingClientRect();
        flying = gsap.timeline({ repeat: -1, paused: true });
        FLIGHTS.forEach((route, i) => {
          const path = route.map(({ x, y }) => ({ x: x * width, y: y * height }));
          const left = route[route.length - 1].x < route[0].x; // heading left: flip it so it isn't upside down
          const at = i * FLIGHT_EVERY;
          // heading left, the flight's turn leaves it upside down: rolled over (in 3D) it's the right way up
          const upright = left ? 180 : 0;
          const rollAt = at + FLIGHT_TIME * 0.36;
          flying!
            .set(roll, { rotationX: upright, scale: 1 }, at)
            .to(plane, { motionPath: { path, curviness: 1.2, autoRotate: true, fromCurrent: false }, duration: FLIGHT_TIME, ease: "none", immediateRender: false }, at)
            .fromTo(plane, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "sine.out", immediateRender: false }, at)
            // the barrel roll: once right round its own length, in perspective, coming a little closer as it turns
            .to(roll, { rotationX: upright + 360, duration: ROLL_TIME, ease: "power1.inOut" }, rollAt)
            .to(roll, { scale: ROLL_SWELL, duration: ROLL_TIME / 2, ease: "sine.out", yoyo: true, repeat: 1 }, rollAt)
            .set(plane, { autoAlpha: 0 }, at + FLIGHT_TIME);
        });
        flying.set({}, {}, FLIGHTS.length * FLIGHT_EVERY);
        run();
      });

      const build = contextSafe(() => {
        // 3 s after it starts the first light goes off, then each 3 s the next: off one by one, back on
        // one by one; the cycle is 6 steps long, so the first goes off again 3 s after the last comes on
        lights = gsap.timeline({ repeat: -1, paused: true, delay: LIGHT_STEP });
        lamps.forEach((lamp, i) => {
          switchOff(lights!, lamp, i * LIGHT_STEP);
          switchOn(lights!, lamp, (lamps.length + i) * LIGHT_STEP);
        });
        lights.set({}, {}, lamps.length * 2 * LIGHT_STEP);
        buildFlights();
        ScrollTrigger.create({ trigger: scene, start: "top 70%", once: true, onEnter: () => ((started = true), run()) });
      });

      const observer = new IntersectionObserver(([entry]) => ((visible = entry.isIntersecting), run()));
      observer.observe(scene);
      let resizeTimer = 0;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => flying && buildFlights(), 200);
      };
      window.addEventListener("resize", onResize);
      const stopWaiting = afterIntro(build);
      return () => {
        stopWaiting();
        observer.disconnect();
        window.removeEventListener("resize", onResize);
        window.clearTimeout(resizeTimer);
        lights?.kill();
        flying?.kill();
      };
    },
    { scope: ref }
  );
  return ref;
}
