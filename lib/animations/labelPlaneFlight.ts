"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/** A flight: points (px) relative to where the plane rests, at desktop size, ending at { x: 0, y: 0 }. */
export type LabelFlight = readonly { x: number; y: number }[];

/**
 * From the top right: a swoop down past its place, a banking turn underneath,
 * then a climb back up into it ("Who we are").
 */
export const FLIGHT_FROM_TOP_RIGHT: LabelFlight = [
  { x: 460, y: -280 },
  { x: 220, y: -40 },
  { x: -20, y: 80 },
  { x: -120, y: 62 },
  { x: -40, y: 33 },
  { x: 0, y: 0 },
];

/**
 * From the top left: a sweep across past its place to the right, a banking
 * turn underneath, then the same climb back up into it ("What we make").
 */
export const FLIGHT_FROM_TOP_LEFT: LabelFlight = [
  { x: -460, y: -260 },
  { x: -180, y: -120 },
  { x: 130, y: -10 },
  { x: 130, y: 80 },
  { x: -20, y: 90 },
  { x: -55, y: 46 },
  { x: 0, y: 0 },
];

/** How long a flight takes (s): unhurried, with a soft start and landing. */
const SECONDS = 3.2;

/**
 * The little red paper plane beside a section label flies in on a curve, its
 * nose turning with the path, and lands in its place, level, in its resting
 * pose: every flight ends climbing to the right, the way the plane's nose
 * points at rest, and the turn is measured from that last stretch. On narrower
 * screens the flight is smaller, in step. Plays once on `scrollTrigger`.
 */
export function flyLabelPlane(plane: HTMLElement, flight: LabelFlight, scrollTrigger: ScrollTrigger.Vars) {
  // on the home page every eyebrow keeps its plane in place: the scroll plane flies between them (see ScrollPlane)
  if (plane.hasAttribute("data-plane-dock") && document.querySelector("#who-we-are [data-plane-dock]")) return;
  const k = Math.min(1, window.innerWidth / 1280);
  const path = flight.map(({ x, y }) => ({ x: x * k, y: y * k }));
  const [before, last] = flight.slice(-2);
  const landing = (Math.atan2(last.y - before.y, last.x - before.x) * 180) / Math.PI;
  gsap.set(plane, { autoAlpha: 0 });
  gsap
    .timeline({ scrollTrigger, delay: 0.1 })
    .to(plane, {
      motionPath: { path, curviness: 1.3, autoRotate: -landing, fromCurrent: false },
      immediateRender: true,
      duration: SECONDS,
      ease: "sine.inOut",
    })
    .fromTo(plane, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "sine.out" }, 0)
    // level off exactly into its resting pose
    .to(plane, { rotation: 0, x: 0, y: 0, duration: 0.5, ease: "sine.out" });
}
