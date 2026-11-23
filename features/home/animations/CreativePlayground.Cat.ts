"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { createCatRig, CROUCH, RUN, SIT, STAND, STEP } from "./paperCat";

gsap.registerPlugin(useGSAP, MotionPathPlugin);

/** The cat on the room's floor (px of the 1440 frame): its box (the art is 300 × 220) and where its paws touch down. */
export const CAT = { width: 236, height: 173, floor: 1162 } as const;
/** The paper ball's size (px). */
export const BALL = 30;

const CAT_Y = CAT.floor - (CAT.height * 212) / 220;
const BALL_Y = CAT.floor - BALL;
/** Where its front paw is, from the left of its box (px), facing left; and the ball resting just in front of it. */
const PAW = (110 / 300) * CAT.width;
const AT_PAW = PAW - BALL - 2;
/** A kick sends the ball this far (px); one comes every two strides, as the front paw swings forward. */
const KICK = 240;
/** How far the ball turns (deg) for each px it rolls. */
const ROLL = 360 / (Math.PI * BALL);
/** The pause between the two visits (s). */
const GAP = 6;

/**
 * The paper cat's round, once a drawer in the filing room has been opened
 * (then on a loop; paused while the room is off screen). Its legs walk in a
 * proper stride (diagonal pairs, the lower leg folding as each paw lifts), its
 * body bobs and its tail sways; it blinks now and then.
 *  1. In from the bottom right, kicking the crumpled paper ball ahead; it taps
 *     the ball on, stops, and sits to watch it, head tilting, tail tip
 *     flicking.
 *  2. Down into an ambush crouch, tail swishing, its rear wiggling... and it
 *     pounces low onto the ball, bats it twice, and walks off to the left kicking
 *     it along.
 *  3. 6 s later, in from the left (turned round) after a paper plane, which
 *     circles above it: it sits and watches, crouches to ambush, tail
 *     swishing, lunges up at it; the plane zips off and the cat runs after it,
 *     off to the right. 6 s later, round again.
 * Its paws are on the floor the whole time (see createCatRig).
 * Nothing moves with reduced motion (the cat stays away).
 */
export function usePlaygroundCat(active: number) {
  const ref = useRef<HTMLDivElement>(null);
  const first = useRef(active);
  const start = useRef<(() => void) | null>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const q = (sel: string) => root.querySelector<HTMLElement>(sel)!;
      const [ball, spin, plane] = [q("[data-ball]"), q("[data-spin]"), q("[data-cat-plane]")];
      const tl = gsap.timeline({ repeat: -1, paused: true });
      const { j, cat, flip, figure, gaze, pose, walk, bat, flick, look, blink, ambush, pounce, dispose } = createCatRig(root, tl);
      gsap.set(cat, { x: 1600, y: CAT_Y, autoAlpha: 0 });
      gsap.set(ball, { x: 1600, y: BALL_Y, autoAlpha: 0 });
      gsap.set(plane, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

      /** The ball kicked `by` px (negative: to the left), rolling and spinning, a little hop off the paw. */
      const kick = (at: number, by: number, dur = 0.6) => {
        tl.to(ball, { x: `+=${by}`, duration: dur, ease: "power2.out" }, at)
          .to(spin, { rotation: `+=${by * ROLL}`, duration: dur, ease: "power2.out" }, at)
          .to(ball, { y: BALL_Y - 6, duration: 0.12, ease: "power1.out", yoyo: true, repeat: 1 }, at);
      };
      // Phase 1 is worked out from where the cat and the ball really are (left edges, px), so the ball only
      // rolls and spins at the moment the paw meets it: walking at SPEED, the paw reaches the ball when
      // the cat's x is the ball's x minus AT_PAW.
      const SPEED = KICK / (STEP * 2);
      /**
       * Walk from `cx` to `endX` starting at `t0`, kicking the ball (at `bx`) on each time the paw reaches it
       * (`kicks` px; the last one, `lastKick`). Returns where the ball ends up and when the walk is over.
       */
      const kickAlong = (t0: number, cx: number, bx: number, endX: number, kicks: number, lastKick = kicks) => {
        const dur = (cx - endX) / SPEED;
        tl.to(cat, { x: endX, duration: dur, ease: "none" }, t0);
        walk(t0, dur);
        for (;;) {
          const meet = bx - AT_PAW; // the cat's x when its paw meets the ball
          if (meet < endX - 1) break;
          const at = t0 + (cx - meet) / SPEED;
          const by = bx - AT_PAW - kicks < endX ? lastKick : kicks;
          flick(at - 0.04);
          kick(at, -by, by > 160 ? 0.6 : 0.9);
          bx -= by;
        }
        return { bx, end: t0 + dur };
      };

      // 1. in from the right, kicking the ball ahead (the paw meets it, it rolls on, the cat catches up...)
      let cx = 1500;
      let bx = cx + AT_PAW - 60;
      tl.set(flip, { scaleX: 1 }, 0).set(cat, { x: cx, autoAlpha: 1 }, 0).set(ball, { x: bx, autoAlpha: 1 }, 0);
      // three kicks, then a last little tap as it slows to a stop
      const stopX = bx - AT_PAW - KICK * 3;
      ({ bx } = kickAlong(0.2, cx, bx, stopX, KICK, 120));
      cx = stopX;
      let t = 0.2 + (1500 - stopX) / SPEED;
      // it stops, and sits down to watch the ball roll on
      pose(t, STAND, 0.3);
      pose(t + 0.3, SIT, 0.7);
      look(t + 0.3, -0.6, 1.6);
      tl.to(j.head, { rotation: -10, duration: 0.4, ease: "sine.inOut" }, t + 1.1) // a tilt of the head
        .to(j.head, { rotation: -30, duration: 0.5, ease: "sine.inOut" }, t + 1.7)
        .to(j.tail3, { rotation: 40, duration: 0.18, ease: "sine.inOut", yoyo: true, repeat: 3 }, t + 1.2);
      blink(t + 1.5);

      // 2. down into an ambush crouch, tail swishing, rear wiggling... and it pounces low along the floor, paws onto the ball
      t += 2.5;
      pose(t, CROUCH, 0.6);
      look(t, -1, 0.6);
      ambush(t + 0.6, 1.6);
      t += 2.3;
      const landX = bx - AT_PAW;
      pounce(t, landX - cx, 34);
      cx = landX;
      // it lands on it: the ball squirts out from under its paws
      kick(t + 0.52, -40, 0.4);
      bx -= 40;
      pose(t + 0.8, STAND, 0.3);
      // a bat at it (the paw reaches it at full stretch)...
      const reach = (at: number, by: number) => {
        bat(at);
        kick(at + 0.13, -by, 0.5);
        bx -= by;
      };
      reach(t + 0.95, 55);
      // ...a quick skip after it (paws staying on the floor), and another bat
      tl.to(cat, { x: cx - 55, duration: 0.35, ease: "sine.inOut" }, t + 1.35)
        .to(figure, { y: -10, duration: 0.17, ease: "power1.out", yoyo: true, repeat: 1 }, t + 1.35);
      cx -= 55;
      reach(t + 1.8, 50);
      blink(t + 2.1);

      // ...then off to the left with it, kicking it along each time it catches up, until both are gone
      look(t + 2.4, 0, 0);
      t += 2.5;
      ({ end: t } = kickAlong(t, cx, bx, -CAT.width - 80, 230, 420));
      tl.set([cat, ball], { autoAlpha: 0 }, t);
      pose(t, STAND, 0.01);

      // 3. 6 s later: in from the left (turned round) after a paper plane, which circles above it
      t += GAP;
      tl.set(flip, { scaleX: -1 }, t)
        .set(cat, { x: -CAT.width - 60, autoAlpha: 1 }, t)
        .set(plane, { autoAlpha: 1 }, t)
        .to(cat, { x: 380, duration: STEP * 6, ease: "none" }, t);
      walk(t, STEP * 6);
      tl.to(plane, { motionPath: { path: [{ x: -60, y: 960 }, { x: 260, y: 900 }, { x: 520, y: 950 }, { x: 760, y: 880 }], curviness: 1.3, autoRotate: true, fromCurrent: false }, duration: STEP * 6, ease: "none", immediateRender: false }, t);
      t += STEP * 6;
      // it circles round twice while the cat sits and watches it, head turning up after it
      const loop = [{ x: 760, y: 880 }, { x: 830, y: 840 }, { x: 790, y: 790 }, { x: 720, y: 820 }, { x: 700, y: 870 }, { x: 760, y: 880 }];
      tl.to(plane, { motionPath: { path: loop, curviness: 1.4, autoRotate: true, fromCurrent: false }, duration: 2, ease: "none", repeat: 1, immediateRender: false }, t);
      pose(t, STAND, 0.3);
      pose(t + 0.3, { ...SIT, head: 4 }, 0.7);
      look(t, 0.4, -2.2);
      tl.to(gaze, { keyframes: { x: [0.4, 1, -0.6, 0.4], y: [-2.2, -1.4, -2.4, -2.2], easeEach: "sine.inOut" }, ease: "none", duration: 2, repeat: 1 }, t + 0.4);
      tl.to(j.head, { rotation: 14, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: 2 }, t + 1);
      blink(t + 1.6);
      // ...then down to ambush as it comes round low, tail swishing, and it lunges up at it, reaching (back paws on the floor)
      t += 2.2;
      pose(t, CROUCH, 0.5);
      look(t, -0.4, -1.4);
      ambush(t + 0.5, 1.5);
      t += 2;
      tl.to(plane, { motionPath: { path: [{ x: 760, y: 880 }, { x: 640, y: 960 }, { x: 760, y: 990 }, { x: 900, y: 820 }, { x: 1080, y: 860 }], curviness: 1.3, autoRotate: true, fromCurrent: false }, duration: 1.4, ease: "sine.inOut", immediateRender: false }, t - 0.2);
      pounce(t + 0.4, 130, 80);
      // the plane gets away; off it runs after it
      t += 1.3;
      tl.to(plane, { motionPath: { path: [{ x: 1080, y: 860 }, { x: 1300, y: 930 }, { x: 1520, y: 880 }, { x: 1700, y: 920 }], curviness: 1.2, autoRotate: true, fromCurrent: false }, duration: 2.2, ease: "none", immediateRender: false }, t);
      tl.to(cat, { x: 1640, duration: RUN * 8, ease: "power1.in" }, t + 0.2);
      walk(t + 0.2, RUN * 8, RUN);
      t += 0.2 + RUN * 8;
      tl.set([cat, plane], { autoAlpha: 0 }, t).set(gaze, { x: 0, y: 0 }, t);
      pose(t, STAND, 0.01);

      // ...and 6 s later, round again
      tl.set({}, {}, t + GAP);

      let started = false;
      let visible = false;
      const run = () => (started && visible ? tl.resume() : tl.pause());
      start.current = () => {
        if (started) return;
        started = true;
        run();
      };
      const observer = new IntersectionObserver(([entry]) => ((visible = entry.isIntersecting), run()));
      observer.observe(root);
      return () => {
        observer.disconnect();
        start.current = null;
        tl.kill();
        dispose();
      };
    },
    { scope: ref }
  );

  // the first time a drawer is opened, the cat comes along
  useEffect(() => {
    if (active !== first.current) start.current?.();
  }, [active]);

  return ref;
}
