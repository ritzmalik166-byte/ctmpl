"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { createCatRig, LEAP, RUN, STAND } from "./paperCat";

gsap.registerPlugin(useGSAP);

/**
 * The cat that peeks through the meeting room door's window is in the room.
 * The first time a request is sent in a visit, once the hand has taken the
 * note inside, someone in there kicks it out (see useKickedCat); after that
 * it's gone for the rest of the visit: no more peeking, no more kicks.
 */
const GONE_KEY = "ctm-door-cat-gone";
/** Sent (on window) when the kick should play: the door is open and the hand is back inside. */
export const KICK_EVENT = "ctm:kick-cat";
/** How much longer (s) the door stays open while the cat's kicked out. */
export const KICK_HOLD = 1.25;

export function catGone() {
  try {
    return sessionStorage.getItem(GONE_KEY) === "1";
  } catch {
    return false;
  }
}
function markCatGone() {
  try {
    sessionStorage.setItem(GONE_KEY, "1");
  } catch {
    // private mode: it'll just be gone until the page reloads
  }
}

/** The cat's box (px of the door; the art is 300 × 220) and where it starts, just inside the doorway by the handle, paws on the floor. */
export const KICKED_CAT = { width: 180, height: 132 } as const;
const FLOOR_Y = 672 - (KICKED_CAT.height * 212) / 220;
const START_X = 300;
/** Where it lands outside, and how far it runs off to the right (well off the section). */
const LAND_X = 490;
const RUN_TO = 1700;

/**
 * Kicked out of the meeting room (on KICK_EVENT, once a visit):
 *  1. a leg swings out through the gap by the handle and boots the cat out of
 *     the dark doorway;
 *  2. it tumbles out through the air and lands on its feet outside;
 *  3. it looks straight out at you with a greedy smile...
 *  4. then turns and runs off to the right, for good.
 * The leg pulls back in and the door closes behind it (see useBookingSequence).
 */
export function useKickedCat() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const leg = root.querySelector<HTMLElement>("[data-kick-leg]");
      const tl = gsap.timeline({ paused: true });
      const { j, cat, flip, figure, shadow, pose, setPose, walk, look, grin, airborne, dispose } = createCatRig(root, tl);
      // waiting just inside the doorway, facing out (right), behind the door
      gsap.set(flip, { scaleX: -1 });
      gsap.set(cat, { x: START_X, y: FLOOR_Y, autoAlpha: 0 });
      // (turned to face out: mirrored in the same transform as its swing, so the swing still turns the right way)
      gsap.set(leg, { autoAlpha: 0, scaleX: -1, rotation: 14, x: -30, transformOrigin: "50% 0%" });
      setPose(STAND);

      // 1. the leg comes out of the room and swings: the boot
      tl.set(cat, { autoAlpha: 1 }, 0)
        .to(leg, { autoAlpha: 1, x: 0, duration: 0.25, ease: "power2.out" }, 0)
        .to(leg, { rotation: 26, duration: 0.18, ease: "power2.out" }, 0.22) // wind up
        .to(leg, { rotation: -52, duration: 0.16, ease: "power3.in" }, 0.4) // the kick
        .to(leg, { rotation: 6, x: -40, duration: 0.4, ease: "power2.inOut" }, 0.62)
        .to(leg, { autoAlpha: 0, duration: 0.2 }, 0.85);
      // 2. out it goes, tumbling head over heels, and down on its feet outside. Only its legs take the leap
      //    pose here (the rig's poses also set the body's height and lean, which the tumble owns while it flies)
      const hit = 0.52;
      const flight = 0.62;
      airborne(hit, flight);
      (Object.keys(LEAP) as (keyof typeof LEAP)[]).forEach((name) => {
        if (!name.startsWith("fig")) tl.to(j[name as keyof typeof j], { rotation: LEAP[name], duration: 0.12, ease: "power2.out" }, hit);
      });
      tl.set(figure, { svgOrigin: "150 130" }, hit) // it turns over about its middle
        .to(cat, { x: LAND_X, duration: flight, ease: "power1.out" }, hit)
        .to(figure, { y: -70, duration: flight / 2, ease: "power2.out" }, hit)
        .to(figure, { y: 0, duration: flight / 2, ease: "power2.in" }, hit + flight / 2)
        .fromTo(figure, { rotation: 0 }, { rotation: -360, duration: flight, ease: "power1.inOut", immediateRender: false }, hit)
        .to(shadow, { scaleX: 0.5, opacity: 0.4, duration: flight / 2, yoyo: true, repeat: 1 }, hit)
        // a full turn is upright again: back to 0 and its usual pivot, with nothing to see
        .set(figure, { rotation: 0, svgOrigin: "214 150" }, hit + flight);
      // ...lands with a squash
      let t = hit + flight;
      pose(t, { figY: 10, frontNearUpper: -20, frontFarUpper: -18, backNearUpper: 20, backFarUpper: 20 }, 0.12, "power2.out");
      pose(t + 0.14, STAND, 0.25, "back.out(2)");
      // 3. a long look straight out at you, and the greedy smile
      t += 0.35;
      look(t, 2.6, 0.4, 0.25);
      grin(t + 0.25, 1.4);
      // 4. off to the right, at a run, gone
      t += 1.85;
      look(t - 0.15, 0, 0, 0.2);
      const runTime = RUN * 6;
      tl.to(cat, { x: RUN_TO, duration: runTime, ease: "power1.in" }, t);
      walk(t, runTime, RUN);
      tl.set(cat, { autoAlpha: 0 }, t + runTime);

      const kick = () => {
        markCatGone();
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        tl.play(0);
      };
      window.addEventListener(KICK_EVENT, kick);
      return () => {
        window.removeEventListener(KICK_EVENT, kick);
        tl.kill();
        dispose();
      };
    },
    { scope: ref }
  );

  return ref;
}
