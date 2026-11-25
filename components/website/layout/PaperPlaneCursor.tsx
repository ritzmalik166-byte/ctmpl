"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import paperPlane from "@/public/icons/paper-plane-accent.svg";

/** The plane's nose, in % of its 27 × 27 art (the tip of the wing fold): the cursor's hot spot. */
const NOSE = { x: 26 / 27, y: 1.5 / 27 };
/** Which way the drawn plane points (its fold, from tail to nose), in degrees. */
const DRAWN_HEADING = (Math.atan2(1.5 - 15.5, 26 - 9) * 180) / Math.PI;
/** Things you can click: the plane perks up over them. */
const CLICKABLE = 'a, button, [role="button"], label, select, summary, [data-cursor="hover"]';
/** Things you type in: the plane gets out of the way (the text cursor shows). */
const TYPING = 'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';

/**
 * The cursor is a paper plane (the site's own little plane, from the section
 * labels), on desktop with a mouse. Its nose is the pointer's tip; it follows
 * the mouse closely and turns to fly the way you move it, banking smoothly
 * round; over something you can click it lifts a little bigger, over a text
 * field it gets out of the way so you see where you're typing, and it dips on a
 * click. Phones, tablets and reduced motion keep the normal cursor.
 */
export function PaperPlaneCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setOn(fine.matches && !reduced.matches);
    update();
    fine.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const plane = ref.current;
    if (!on || !plane) return;
    document.documentElement.classList.add("plane-cursor");

    const moveX = gsap.quickTo(plane, "x", { duration: 0.12, ease: "power3.out" });
    const moveY = gsap.quickTo(plane, "y", { duration: 0.12, ease: "power3.out" });
    const turn = gsap.quickTo(plane, "rotation", { duration: 0.45, ease: "power2.out" });
    let heading = 0; // the plane's rotation so far (unwrapped, so it always turns the short way round)
    let last: { x: number; y: number } | null = null;
    let shown = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        gsap.set(plane, { x: e.clientX, y: e.clientY });
        gsap.to(plane, { autoAlpha: 1, duration: 0.2 });
        shown = true;
      }
      moveX(e.clientX);
      moveY(e.clientY);
      if (last) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        if (dx * dx + dy * dy > 9) {
          // fly the way it's moving: the nose turns to the direction of travel, the short way round
          const want = (Math.atan2(dy, dx) * 180) / Math.PI - DRAWN_HEADING;
          const delta = ((((want - heading) % 360) + 540) % 360) - 180;
          heading += delta;
          turn(heading);
          last = { x: e.clientX, y: e.clientY };
        }
      } else last = { x: e.clientX, y: e.clientY };

      const target = e.target as Element | null;
      const typing = !!target?.closest?.(TYPING);
      const hovering = !typing && !!target?.closest?.(CLICKABLE);
      gsap.to(plane, { scale: typing ? 0.6 : hovering ? 1.3 : 1, opacity: typing ? 0 : 1, duration: 0.25, ease: "power2.out", overwrite: "auto" });
    };
    const onDown = () => gsap.to(plane.firstElementChild, { scale: 0.8, duration: 0.1, ease: "power2.out" });
    const onUp = () => gsap.to(plane.firstElementChild, { scale: 1, duration: 0.3, ease: "back.out(3)" });
    const onLeave = () => {
      gsap.to(plane, { autoAlpha: 0, duration: 0.2 });
      shown = false;
      last = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.documentElement.classList.remove("plane-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(plane);
    };
  }, [on]);

  if (!on) return null;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none invisible fixed top-0 left-0 z-[9999] opacity-0"
      // the nose is the hot spot: the plane hangs back from the pointer and turns about its nose
      style={{ width: 30, height: 30, marginLeft: -NOSE.x * 30, marginTop: -NOSE.y * 30, transformOrigin: `${NOSE.x * 100}% ${NOSE.y * 100}%` }}
    >
      <span className="block size-full" style={{ transformOrigin: `${NOSE.x * 100}% ${NOSE.y * 100}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={paperPlane.src} alt="" width={30} height={30} className="block size-full drop-shadow-[0_2px_2px_rgba(60,35,15,0.3)]" />
      </span>
    </div>
  );
}
