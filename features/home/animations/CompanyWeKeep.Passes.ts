"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** At rest: a very slow, small rock (degrees, seconds per swing; each pass a little different). */
const IDLE = { amplitude: 1.2, period: [4.6, 5.8] };
/** Swung by hand: a strong, wide, quicker swing. */
const SWUNG = { amplitude: 11, period: 1.4 };
/** "Energy" a pass gets from the hand: rises fast while touched, fades slowly after (s). */
const ENERGY = { rise: 0.18, fade: 2.6, onTouch: 0.7 };
/** While the cursor moves across a pass, the swing leans that way (deg), easing back when it stops. */
const LEAN = { angle: 5, ease: 0.3, holdMs: 220 };
/** Scrolling tips the passes (down → left, up → right; deg per px scrolled), then they swing back and settle. */
const SCROLL = { perPx: 0.06, max: 10, fade: 0.3, period: [1.2, 1.6], damping: 1.3 };
/** Final smoothing of the drawn angle (s): keeps every change fluid. */
const SMOOTH = 0.09;

type Pass = {
  set: (deg: number) => void;
  slot: HTMLElement;
  rail: Element | null;
  idlePeriod: number;
  phase: number;
  hovered: boolean;
  energy: number;
  lean: number;
  leanTarget: number;
  lastMove: number;
  /** The scroll swing: a spring that follows the tip and overshoots back. */
  tip: number;
  tipVelocity: number;
  tipStiffness: number;
  tipShare: number;
  /** The rail slider this pass hangs in (sliding it swings the pass). */
  scroller: HTMLElement | null;
  drawn: number;
};

/** Move `value` towards `target`, smoothly, over about `seconds`. */
const approach = (value: number, target: number, seconds: number, dt: number) => value + (target - value) * (1 - Math.exp(-dt / seconds));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Visitor passes swinging on their lanyards, each like a pendulum from the top
 * of its lanyard:
 *  - at rest they rock very slowly;
 *  - touched by the cursor a pass gains swing "energy": it swings wide and
 *    quick, leaning the way the cursor moves, and the energy fades slowly after
 *    the cursor leaves, so sweeping across a whole row sets every pass swinging;
 *  - scrolling tips them all (down → left, up → right) and they swing back past
 *    centre and settle, each with its own timing; sliding a rail sideways (on
 *    small screens) does the same for its passes, which lag behind the slide.
 * Every change eases in, and the drawn angle is smoothed, so nothing jumps or
 * sticks. Hover is read from each pass's fixed slot, not the moving pass.
 * Pauses off-screen; with reduced motion the passes hang still.
 */
export function useSwingingPasses() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const passes: Pass[] = gsap.utils.toArray<HTMLElement>("[data-pass-slot]", root).map((slot) => ({
        set: gsap.quickSetter(slot.querySelector("[data-pass]"), "rotation", "deg") as (deg: number) => void,
        slot,
        rail: slot.parentElement,
        idlePeriod: gsap.utils.random(IDLE.period[0], IDLE.period[1]),
        phase: gsap.utils.random(0, Math.PI * 2),
        hovered: false,
        energy: 0,
        lean: 0,
        leanTarget: 0,
        lastMove: 0,
        tip: 0,
        tipVelocity: 0,
        tipStiffness: (2 * Math.PI / gsap.utils.random(SCROLL.period[0], SCROLL.period[1])) ** 2,
        tipShare: gsap.utils.random(0.8, 1.2),
        scroller: slot.closest<HTMLElement>("[data-rail-scroller]"),
        drawn: 0,
      }));

      // scrolling: how far the board is tipped right now (fades back to 0 when scrolling stops)
      let scrollTip = 0;
      let lastScrollY = window.scrollY;
      const onScroll = () => {
        const dy = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;
        // down (dy > 0) swings the bottoms left: a clockwise, positive turn
        scrollTip = gsap.utils.clamp(-SCROLL.max, SCROLL.max, scrollTip + dy * SCROLL.perPx);
      };

      // sliding a rail sideways (small screens): its passes lag behind the way it moves, then swing back
      const rails = new Map<HTMLElement, { tip: number; left: number }>();
      passes.forEach((p) => p.scroller && !rails.has(p.scroller) && rails.set(p.scroller, { tip: 0, left: p.scroller.scrollLeft }));
      const railListeners = [...rails.entries()].map(([el, rail]) => {
        const onSlide = () => {
          const dx = el.scrollLeft - rail.left; // > 0: the rail moves left under the passes
          rail.left = el.scrollLeft;
          // the passes' bottoms lag to the right of a rail moving left: an anticlockwise, negative turn
          rail.tip = gsap.utils.clamp(-SCROLL.max, SCROLL.max, rail.tip - dx * SCROLL.perPx);
        };
        el.addEventListener("scroll", onSlide, { passive: true });
        return () => el.removeEventListener("scroll", onSlide);
      });

      const tick = (_: number, deltaMs: number) => {
        const dt = Math.min(deltaMs, 50) / 1000;
        const now = performance.now();
        scrollTip = approach(scrollTip, 0, SCROLL.fade, dt);
        rails.forEach((rail) => (rail.tip = approach(rail.tip, 0, SCROLL.fade, dt)));

        passes.forEach((p, i) => {
          // energy from the hand (and a little from a hovered neighbour on the same rail)
          const neighbourHovered = [passes[i - 1], passes[i + 1]].some((n) => n?.hovered && n.rail === p.rail);
          const energyTarget = p.hovered ? 1 : neighbourHovered ? 0.25 : 0;
          p.energy = approach(p.energy, energyTarget, energyTarget > p.energy ? ENERGY.rise : ENERGY.fade, dt);

          // the swing itself: its size and pace follow the energy, it never stops
          const amplitude = lerp(IDLE.amplitude, SWUNG.amplitude, p.energy);
          const period = lerp(p.idlePeriod, SWUNG.period, Math.min(1, p.energy * 1.4));
          p.phase += (2 * Math.PI * dt) / period;

          // lean with the hand while it moves, then drift back to centre
          if (!p.hovered || now - p.lastMove > LEAN.holdMs) p.leanTarget = 0;
          p.lean = approach(p.lean, p.leanTarget, LEAN.ease, dt);

          // the scroll swing: a damped spring chasing the board's tip, so it overshoots and settles
          const railTip = p.scroller ? rails.get(p.scroller)?.tip ?? 0 : 0;
          const accel = -p.tipStiffness * (p.tip - (scrollTip + railTip) * p.tipShare) - SCROLL.damping * p.tipVelocity;
          p.tipVelocity += accel * dt;
          p.tip += p.tipVelocity * dt;

          const angle = amplitude * Math.sin(p.phase) + p.lean + p.tip;
          p.drawn = approach(p.drawn, angle, SMOOTH, dt);
          p.set(p.drawn);
        });
      };

      const cleanups = passes.map((p) => {
        let lastX: number | null = null;
        const enter = (e: PointerEvent) => {
          p.hovered = true;
          p.energy = Math.max(p.energy, ENERGY.onTouch); // a touch sets it swinging at once (the drawn angle stays smooth)
          lastX = e.clientX;
        };
        // the bottom of the pass follows the hand: moving right swings it right (an anticlockwise, negative turn)
        const move = (e: PointerEvent) => {
          if (lastX !== null && Math.abs(e.clientX - lastX) > 0.5) {
            p.leanTarget = e.clientX > lastX ? -LEAN.angle : LEAN.angle;
            p.lastMove = performance.now();
          }
          lastX = e.clientX;
        };
        const leave = () => {
          p.hovered = false;
          lastX = null;
        };
        p.slot.addEventListener("pointerenter", enter);
        p.slot.addEventListener("pointermove", move);
        p.slot.addEventListener("pointerleave", leave);
        return () => {
          p.slot.removeEventListener("pointerenter", enter);
          p.slot.removeEventListener("pointermove", move);
          p.slot.removeEventListener("pointerleave", leave);
        };
      });

      // only run (and listen to scrolling) while the board is on screen
      let running = false;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !running) {
          lastScrollY = window.scrollY;
          window.addEventListener("scroll", onScroll, { passive: true });
          gsap.ticker.add(tick);
        }
        if (!entry.isIntersecting && running) {
          window.removeEventListener("scroll", onScroll);
          gsap.ticker.remove(tick);
        }
        running = entry.isIntersecting;
      });
      observer.observe(root);

      return () => {
        observer.disconnect();
        window.removeEventListener("scroll", onScroll);
        gsap.ticker.remove(tick);
        cleanups.forEach((off) => off());
        railListeners.forEach((off) => off());
      };
    },
    { scope: ref }
  );

  return ref;
}
