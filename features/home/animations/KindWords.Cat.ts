"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createCatRig, CROUCH, RUN, SIT, STAND } from "./paperCat";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** The cat in the water cooler corner (px of the 1440 × 731 room): its box (the art is 300 × 220). */
export const KW_CAT = { width: 200, height: 147 } as const;

/** Its top for paws on the floor, and on top of the cabinet the robot stands behind. */
const FLOOR_Y = 690 - (KW_CAT.height * 212) / 220;
const CABINET_Y = 549 - (KW_CAT.height * 212) / 220;
/** Where it sits, beside Arjun; where it crouches below the cabinet; where it lands on it, at the robot. */
const SIT_X = 425;
const CROUCH_X = 640;
const LAND_X = 880;
/** Walking speed (px/s): a stride carries it about this far. */
const SPEED = 218;

/**
 * The paper cat (see PaperCat) in the Kind Words room, once, when the room
 * scrolls into view (paused while it's off screen):
 *  1. it sits beside Arjun, blinking, its tail tip flicking; it glances out at
 *     you and smiles;
 *  2. after a few seconds it gets up and pads over to the cabinet, crouches to
 *     ambush, eyes up on the robot, tail swishing, rear wiggling...
 *  3. and leaps up onto the cabinet into the robot, which topples over
 *     backwards off it onto the floor behind;
 *  4. on the cabinet, the cat turns to you with a big smile, then jumps down
 *     and runs off to the right;
 *  5. the robot gets back up, cross: brows down, huffing and shaking. The cat
 *     doesn't come back.
 * With reduced motion it just sits by Arjun.
 */
export function useKindWordsCat() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const tl = gsap.timeline({ paused: true });
      const { j, cat, flip, shadow, pose, setPose, walk, look, blink, grin, ambush, pounce } = createCatRig(root, tl);
      // facing right, towards the robot, sitting by Arjun
      gsap.set(flip, { scaleX: -1 });
      gsap.set(cat, { x: SIT_X, y: FLOOR_Y, autoAlpha: 1 });
      setPose(SIT);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const scene = root.parentElement;
      const robot = scene?.querySelector<HTMLElement>("[data-robot-fall]") ?? [];
      const brows = scene?.querySelector<HTMLElement>("[data-robot-brows]") ?? [];

      // 1. sitting with Arjun: a blink, the tail tip flicking, a glance out at you and a smile
      tl.to(j.tail3, { rotation: 30, duration: 0.2, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0.3);
      blink(0.9);
      look(1.2, 2.6, 0.4);
      grin(1.3, 1);
      look(2.4, 0, 0);

      // 2. over to the cabinet, and down to ambush, eyes up on the robot
      let t = 2.8;
      pose(t, STAND, 0.35);
      const walkTime = (CROUCH_X - SIT_X) / SPEED;
      tl.to(cat, { x: CROUCH_X, duration: walkTime, ease: "none" }, t + 0.4);
      walk(t + 0.4, walkTime);
      t += 0.4 + walkTime;
      pose(t, { ...CROUCH, head: 18 }, 0.5);
      look(t, -0.6, -2.4);
      ambush(t + 0.5, 1.8);
      blink(t + 1.2);

      // 3. the leap: up onto the cabinet, into the robot, which topples over backwards
      t += 2.4;
      const leap = 0.62;
      pounce(t, LAND_X - CROUCH_X, 60, CABINET_Y - FLOOR_Y, leap);
      tl.to(shadow, { autoAlpha: 0, duration: 0.15 }, t); // no floor under it up there
      const hit = t + leap * 0.75;
      // ...over backwards, off the cabinet and down onto the floor behind it (its head poking out past it), a bounce
      tl.to(robot, { rotation: 84, duration: 0.5, ease: "power2.in" }, hit)
        .to(robot, { y: 118, duration: 0.5, ease: "power3.in" }, hit + 0.12)
        .to(robot, { rotation: 78, duration: 0.12, ease: "power1.out", yoyo: true, repeat: 1 }, hit + 0.62);

      // 4. on the cabinet: a big smile out at you, then down and away to the right
      t += leap + 0.25;
      pose(t, STAND, 0.3);
      look(t + 0.2, 2.6, 0.4);
      tl.to(j.head, { rotation: -6, duration: 0.3, ease: "sine.inOut" }, t + 0.2);
      grin(t + 0.3, 1.3);
      t += 1.9;
      look(t - 0.2, 0, 0);
      pounce(t, 220, 26, FLOOR_Y - CABINET_Y, 0.5);
      tl.to(shadow, { autoAlpha: 1, duration: 0.15 }, t + 0.42);
      t += 0.6;
      const runTime = RUN * 4;
      tl.to(cat, { x: 1480, duration: runTime, ease: "power1.in" }, t);
      walk(t, runTime, RUN);
      t += runTime;
      tl.set(cat, { autoAlpha: 0 }, t);

      // 5. once the cat's gone, the robot gets back up, cross: brows down, huffing and shaking
      const up = t - 0.4;
      tl.to(robot, { rotation: 0, y: 0, duration: 0.75, ease: "back.out(1.6)" }, up)
        .to(brows, { opacity: 1, duration: 0.15 }, up + 0.6)
        .to(robot, { keyframes: { x: [0, -3, 3, -3, 3, -2, 2, 0], rotation: [0, -1.5, 1.5, -1.5, 1.5, -1, 1, 0] }, duration: 0.7, ease: "none" }, up + 0.8)
        .to(robot, { keyframes: { x: [0, -2, 2, -2, 2, 0] }, duration: 0.5, ease: "none" }, up + 2.2)
        .to(brows, { opacity: 0, duration: 0.5 }, up + 4.5);

      // once, when the room scrolls into view (paused if it's scrolled away before the end)
      let started = false;
      let visible = false;
      const run = () => (started && visible ? tl.resume() : tl.pause());
      const trigger = ScrollTrigger.create({ trigger: root, start: "top 65%", once: true, onEnter: () => ((started = true), run()) });
      const observer = new IntersectionObserver(([entry]) => ((visible = entry.isIntersecting), run()));
      observer.observe(root);
      return () => {
        trigger.kill();
        observer.disconnect();
        tl.kill();
      };
    },
    { scope: ref }
  );

  return ref;
}
