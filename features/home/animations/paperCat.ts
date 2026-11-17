"use client";

import gsap from "gsap";
import { CAT_PIVOTS, type CatJoint } from "../constants/playgroundCat.art";

/** A pose: each joint's turn (deg), and the body's lean / lift (in the cat's 300 × 220 drawing). */
export type Pose = Partial<Record<CatJoint, number>> & { figY?: number; figRot?: number; figX?: number };

/** One stride (s): walking, and running. */
export const STEP = 0.55;
export const RUN = 0.36;

export const STAND: Pose = {};
/** Sitting up: haunches folded under, front legs straight, chest raised, tail curled round on the floor. */
export const SIT: Pose = {
  backNearUpper: 62, backNearLower: -128, backFarUpper: 62, backFarLower: -128,
  frontNearUpper: -26, frontNearLower: 2, frontFarUpper: -22, frontFarLower: 2,
  tail1: 40, tail2: 34, tail3: -6, head: -22, figY: 20, figRot: 26,
};
/** Down low to ambush: elbows up, haunches gathered under, chin down, tail out straight behind. */
export const CROUCH: Pose = {
  frontNearUpper: -52, frontNearLower: 88, frontFarUpper: -52, frontFarLower: 88,
  backNearUpper: 48, backNearLower: -82, backFarUpper: 48, backFarLower: -82,
  tail1: 62, tail2: -8, tail3: -16, head: 6, figY: 30,
};
/** Mid-leap: stretched out, front paws reaching, back legs pushing off. */
export const LEAP: Pose = {
  frontNearUpper: 52, frontNearLower: -12, frontFarUpper: 44, frontFarLower: -8,
  backNearUpper: -46, backNearLower: 22, backFarUpper: -40, backFarLower: 18,
  tail1: 36, tail2: -12, tail3: -14, head: 2, figRot: 8,
};

/** A walking stride (6 steps): the front and back legs' upper and lower parts; the lower folds as the paw lifts and swings forward. */
const FRONT_U = [18, 8, -4, -16, -2, 18];
const FRONT_L = [0, 0, 0, -6, -40, 0];
const BACK_U = [14, 6, -4, -14, 2, 14];
const BACK_L = [0, 0, 0, 8, -38, 0];
/** The other side's legs are half a stride behind. */
const half = (a: number[]) => [...a.slice(3, 5), ...a.slice(0, 3), a[3]];

/**
 * The paper cat's moves (see PaperCat), added to the timeline `tl` at given
 * times. `root` holds one PaperCat. Its joints turn about their own pivots; its
 * box (`cat`) moves it about the scene, and `flip` turns it round (scaleX -1:
 * facing right).
 */
export function createCatRig(root: Element, tl: gsap.core.Timeline) {
  const q = <T extends Element = HTMLElement>(sel: string) => root.querySelector(sel) as T;
  const joints = Object.keys(CAT_PIVOTS) as CatJoint[];
  const j = Object.fromEntries(joints.map((name) => [name, q(`[data-j="${name}"]`)])) as Record<CatJoint, HTMLElement>;
  const [cat, shadow, flip, figure, gaze, smile] = [q("[data-cat]"), q("[data-cat-shadow]"), q("[data-flip]"), q('[data-j="figure"]'), q("[data-gaze]"), q("[data-smile]")];
  const limbs = joints.filter((name) => name !== "eyes");

  // every joint turns about its own pivot (in the cat's 300 × 220 drawing)
  joints.forEach((name) => gsap.set(j[name], { svgOrigin: CAT_PIVOTS[name].join(" ") }));
  gsap.set(figure, { svgOrigin: "214 150" });

  /** Into a pose: every joint and the body's lean / height. */
  const pose = (at: number, p: Pose, dur = 0.45, ease = "power2.inOut") => {
    limbs.forEach((name) => tl.to(j[name], { rotation: p[name] ?? 0, duration: dur, ease }, at));
    tl.to(figure, { y: p.figY ?? 0, x: p.figX ?? 0, rotation: p.figRot ?? 0, duration: dur, ease }, at);
  };
  /** A pose at once (no movement). */
  const setPose = (p: Pose) => {
    limbs.forEach((name) => gsap.set(j[name], { rotation: p[name] ?? 0 }));
    gsap.set(figure, { y: p.figY ?? 0, x: p.figX ?? 0, rotation: p.figRot ?? 0 });
  };
  /** Walking (or running) from `at` for `dur` s, a stride every `step` s: legs in diagonal pairs, the body bobbing, the tail swaying. */
  const walk = (at: number, dur: number, step = STEP) => {
    const repeat = Math.max(0, Math.round(dur / step) - 1);
    const stride = (el: HTMLElement, values: number[]) =>
      tl.to(el, { keyframes: { rotation: values, easeEach: "sine.inOut" }, ease: "none", duration: step, repeat }, at);
    // settle into the first step of the stride
    pose(at - 0.2, { frontNearUpper: FRONT_U[0], frontFarUpper: half(FRONT_U)[0], backFarUpper: BACK_U[0], backNearUpper: half(BACK_U)[0] }, 0.2, "sine.out");
    stride(j.frontNearUpper, FRONT_U);
    stride(j.frontNearLower, FRONT_L);
    stride(j.backFarUpper, BACK_U);
    stride(j.backFarLower, BACK_L);
    stride(j.frontFarUpper, half(FRONT_U));
    stride(j.frontFarLower, half(FRONT_L));
    stride(j.backNearUpper, half(BACK_U));
    stride(j.backNearLower, half(BACK_L));
    tl.to(figure, { keyframes: { y: [0, -2.5, 0, -2.5, 0], easeEach: "sine.inOut" }, ease: "none", duration: step, repeat }, at);
    stride(j.head, [0, 2, 0, 2, 0, 0]);
    stride(j.tail1, [-5, 0, 5, 0, -5, -5]);
    stride(j.tail2, [-6, -3, 6, 3, -6, -6]);
    stride(j.tail3, [-8, -6, 8, 6, -8, -8]);
  };
  /** A quick bat with the near front paw. */
  const bat = (at: number) => {
    tl.to(j.frontNearUpper, { rotation: 42, duration: 0.14, ease: "power2.out", yoyo: true, repeat: 1 }, at)
      .to(j.frontNearLower, { rotation: -46, duration: 0.14, ease: "power2.out", yoyo: true, repeat: 1 }, at);
  };
  /** A flick of the near front paw (as it meets a ball). */
  const flick = (at: number) => tl.to(j.frontNearLower, { rotation: -30, duration: 0.1, ease: "power2.out", yoyo: true, repeat: 1 }, at);
  /** Where it looks (in the drawing; 0 0 is straight ahead, + x back towards you, - y up). */
  const look = (at: number, x: number, y: number, dur = 0.3) => tl.to(gaze, { x, y, duration: dur, ease: "sine.inOut" }, at);
  const blink = (at: number) => tl.to(j.eyes, { scaleY: 0.1, duration: 0.07, ease: "power1.in", yoyo: true, repeat: 1 }, at);
  /** A big smile, eyes squeezed happy, for `dur` s. */
  const grin = (at: number, dur: number) => {
    tl.to(smile, { opacity: 1, duration: 0.15, ease: "power1.out" }, at)
      .to(j.eyes, { scaleY: 0.55, duration: 0.2, ease: "sine.out" }, at)
      .to(smile, { opacity: 0, duration: 0.2, ease: "power1.in" }, at + dur)
      .to(j.eyes, { scaleY: 1, duration: 0.2, ease: "sine.in" }, at + dur);
  };
  /** Crouched, waiting to spring: the tail swishes side to side, the rear wiggles just before. */
  const ambush = (at: number, dur: number) => {
    const n = Math.max(1, Math.round(dur / 0.5));
    tl.to(j.tail2, { keyframes: { rotation: [-8, 26, -30, -8], easeEach: "sine.inOut" }, ease: "none", duration: 0.5, repeat: n - 1 }, at)
      .to(j.tail3, { keyframes: { rotation: [-16, 30, -36, -16], easeEach: "sine.inOut" }, ease: "none", duration: 0.5, repeat: n - 1 }, at + 0.06)
      .to(figure, { keyframes: { x: [0, 2.5, -2.5, 2.5, -2.5, 0], rotation: [0, -1.5, 1.5, -1.5, 1.5, 0], easeEach: "sine.inOut" }, ease: "none", duration: 0.6 }, at + dur - 0.8);
  };
  /**
   * A pounce: up in an arc `height` px high, `dx` px along (and `dy` px down, landing somewhere higher or
   * lower), stretched out, then down into a crouch; its shadow stays on the floor unless it lands elsewhere.
   */
  const pounce = (at: number, dx: number, height: number, dy = 0, dur = 0.54) => {
    pose(at, LEAP, 0.16, "power2.out");
    tl.to(figure, { y: -height, duration: dur / 2, ease: "power2.out" }, at)
      .to(figure, { y: 14, duration: dur / 2, ease: "power2.in" }, at + dur / 2)
      .to(cat, { x: `+=${dx}`, duration: dur, ease: "sine.inOut" }, at)
      .to(shadow, { scale: 0.6, opacity: 0.5, duration: dur / 2, ease: "power2.out", yoyo: true, repeat: 1 }, at);
    if (dy) tl.to(cat, { y: `+=${dy}`, duration: dur, ease: dy < 0 ? "power1.out" : "power1.in" }, at);
    pose(at + dur - 0.04, { ...CROUCH, figY: 18, tail2: 10, tail3: 6 }, 0.22, "power2.out");
  };

  return { j, cat, shadow, flip, figure, gaze, smile, pose, setPose, walk, bat, flick, look, blink, grin, ambush, pounce };
}
