"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { LIFT } from "../constants/whatWeMake.constants";

type LiftCallbacks = {
  /** Doors are shut: swap the scene inside the car to this floor. */
  onSceneChange: (floor: number) => void;
  /** The lift has arrived at this floor (doors about to open). */
  onArrive: (floor: number) => void;
};

/** Seconds of travel per floor, and the limits for a whole ride. */
const PER_FLOOR = 0.45;
const MIN_TRAVEL = 0.9;
const MAX_TRAVEL = 2.8;

/**
 * Drives the lift: when `target` changes it closes the doors, travels (the
 * dial needle sweeps and the "FLOOR n" label counts through each floor it
 * passes, with a slight tremble), swaps the scene, "dings" and opens the doors.
 * A new floor picked mid-ride is taken straight after, without reopening.
 *
 * Markup contract inside the returned ref:
 *  [data-lift="door-left|door-right|needle|label|cabin"] and [data-lift-dot="n"].
 */
/**
 * Fired on the car's scene ([data-lift="scene"]) as the doors start to open.
 * While a ride is on, the lift root carries data-doors="closed"; otherwise "open".
 */
export const LIFT_DOORS_OPEN = "lift:doors-open";

export function useLiftRide(target: number, initialFloor: number, { onSceneChange, onArrive }: LiftCallbacks) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ floor: initialFloor, busy: false, pending: null as number | null, doorsOpen: true });
  const callbacks = useRef({ onSceneChange, onArrive });
  const ridesRef = useRef<gsap.core.Timeline | null>(null);
  useEffect(() => {
    callbacks.current = { onSceneChange, onArrive };
  });

  // Doors start open (slid into the walls); stop any ride if the section unmounts.
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    gsap.set(root.querySelector('[data-lift="door-left"]'), { x: 0, xPercent: -100 });
    gsap.set(root.querySelector('[data-lift="door-right"]'), { x: 0, xPercent: 100 });
    root.dataset.doors = "open";
    return () => {
      ridesRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    const root = ref.current;
    const s = state.current;
    if (!root || target === s.floor) return;
    if (s.busy) {
      s.pending = target; // take it after the current ride
      return;
    }

    const el = (name: string) => root.querySelector<HTMLElement>(`[data-lift="${name}"]`)!;
    const [doorL, doorR, needle, label, cabin] = ["door-left", "door-right", "needle", "label", "cabin"].map(el);
    const dot = (n: number) => root.querySelector<HTMLElement>(`[data-lift-dot="${n}"]`);
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const showFloor = (n: number) => {
      label.textContent = `FLOOR ${n}`;
      root.querySelectorAll("[data-lift-dot]").forEach((d) => d.toggleAttribute("data-current", Number((d as HTMLElement).dataset.liftDot) === n));
    };

    const ride = (from: number, to: number) => {
      s.busy = true;
      if (instant) {
        gsap.set(needle, { rotation: -LIFT.floorAngle(to) });
        showFloor(to);
        callbacks.current.onSceneChange(to);
        callbacks.current.onArrive(to);
        s.floor = to;
        s.busy = false;
        return;
      }

      const travel = gsap.utils.clamp(MIN_TRAVEL, MAX_TRAVEL, Math.abs(to - from) * PER_FLOOR);
      const car = { floor: from };
      const tl = gsap.timeline();
      ridesRef.current = tl;

      // 1. doors slide shut
      if (s.doorsOpen) {
        tl.to(doorL, { xPercent: 0, duration: 0.7, ease: "power2.inOut" }, 0)
          .to(doorR, { xPercent: 0, duration: 0.7, ease: "power2.inOut" }, 0)
          .add(() => {
            s.doorsOpen = false;
            root.dataset.doors = "closed";
          });
      }
      // 2. ride: new scene behind the doors, needle + label move floor by floor, a slight tremble
      tl.add(() => callbacks.current.onSceneChange(to))
        .addLabel("travel", "+=0.12")
        .to(car, {
          floor: to,
          duration: travel,
          ease: "power1.inOut",
          onUpdate: () => {
            gsap.set(needle, { rotation: -LIFT.floorAngle(car.floor) });
            const passing = Math.round(car.floor);
            if (label.textContent !== `FLOOR ${passing}`) showFloor(passing);
          },
        }, "travel")
        .fromTo(cabin, { y: 0 }, { y: 0.8, duration: 0.07, ease: "none", yoyo: true, repeat: Math.max(1, Math.round(travel / 0.14)) }, "travel")
        // 3. ding: the floor's light glows
        .add(() => {
          s.floor = to;
          showFloor(to);
          callbacks.current.onArrive(to);
          const d = dot(to);
          if (d) gsap.fromTo(d, { scale: 1.9 }, { scale: 1, duration: 0.6, ease: "power2.out" });
        })
        // another floor was picked during the ride: go there before opening
        .add(() => {
          const next = s.pending;
          s.pending = null;
          if (next !== null && next !== to) {
            tl.kill();
            ride(to, next);
            return;
          }
          // hold at the floor until its studio artwork has loaded (max 2.5 s)
          const pending = [...root.querySelectorAll<HTMLImageElement>('[data-lift="scene"] img')].filter((img) => !img.complete);
          if (pending.length) {
            tl.pause();
            const loaded = Promise.all(pending.map((img) => img.decode().catch(() => undefined)));
            Promise.race([loaded, new Promise((r) => setTimeout(r, 2500))]).then(() => tl.resume());
          }
        }, "+=0.2")
        // 4. doors open on the new floor (the scene hears it, e.g. to start a confetti shower)
        .add(() => {
          root.dataset.doors = "open";
          root.querySelector('[data-lift="scene"]')?.dispatchEvent(new Event(LIFT_DOORS_OPEN));
        }, "+=0.1")
        .to(doorL, { xPercent: -100, duration: 0.8, ease: "power2.inOut" }, "<")
        .to(doorR, { xPercent: 100, duration: 0.8, ease: "power2.inOut" }, "<")
        .add(() => {
          s.doorsOpen = true;
          s.busy = false;
        });
    };

    ride(s.floor, target);
  }, [target]);

  return ref;
}
