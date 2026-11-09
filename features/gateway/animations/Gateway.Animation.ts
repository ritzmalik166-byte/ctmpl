"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import ctmLogo from "@/public/images/website/brand/ctm-logo.png";
import { GATEWAY_COMPLETE_EVENT, GATEWAY_FLOOR_ATTR, gatewayTiming as T } from "../constants/gateway.constants";
import type { PaperScene, PaperState } from "../scene/createPaperScene";

type GatewayRefs = {
  rootRef: RefObject<HTMLDivElement | null>;
  backdropRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onComplete: () => void;
};

/** Font stack that next/font registered for a CSS variable on <html>. */
const fontFromVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "sans-serif";

async function loadLogo() {
  const image = new Image();
  image.src = ctmLogo.src;
  await image.decode();
  return image;
}

/**
 * Screen y (px from the top) of the floor the ball lands on: read from the
 * page element marked with GATEWAY_FLOOR_ATTR, kept inside the viewport.
 * Without a marked floor, the ball lands near the bottom of the screen.
 */
function findFloorY(viewportH: number, radius: number) {
  const fallback = viewportH * 0.9;
  const floor = document.querySelector<HTMLElement>(`[${GATEWAY_FLOOR_ATTR}]`);
  const fraction = Number(floor?.getAttribute(GATEWAY_FLOOR_ATTR));
  if (!floor || !Number.isFinite(fraction)) return fallback;
  const rect = floor.getBoundingClientRect();
  const y = rect.top + rect.height * fraction;
  return Math.min(Math.max(y, viewportH * 0.55), viewportH - radius * 0.5);
}

/**
 * The welcome gateway timeline:
 *   paper fades in → ink prints the welcome → (3s) paper crumples into a ball
 *   → small wind-up → ball is tossed onto the floor → bounces three times
 *   → rolls off to the left → gateway removed.
 *
 * three.js is loaded on demand so it never weighs down the rest of the site.
 * Click / Enter / Esc skips straight to the crumple.
 */
export function useGatewayAnimation({ rootRef, backdropRef, canvasRef, onComplete }: GatewayRefs) {
  useEffect(() => {
    const root = rootRef.current;
    const backdrop = backdropRef.current;
    const canvas = canvasRef.current;
    if (!root || !backdrop || !canvas) return;

    const startedAt = performance.now();
    let cancelled = false;
    let scene: PaperScene | undefined;
    let timeline: gsap.core.Timeline | undefined;

    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    let scrollLocked = false;

    // Page scroll is locked while the gateway plays.
    const lockScroll = () => {
      html.style.overflow = "hidden";
      scrollLocked = true;
    };
    const unlockScroll = () => {
      if (!scrollLocked) return;
      html.style.overflow = previousOverflow;
      scrollLocked = false;
    };

    const finish = () => {
      if (cancelled) return;
      // Unlock here, not only in cleanup: once done, the Gateway renders null
      // but stays mounted, so this effect's cleanup does not run.
      unlockScroll();
      html.dataset.gateway = "done";
      window.dispatchEvent(new Event(GATEWAY_COMPLETE_EVENT));
      onComplete();
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    lockScroll();
    html.dataset.gateway = "playing";

    const skip = () => {
      if (timeline && timeline.time() < timeline.labels.crumple) timeline.seek("crumple");
    };
    const onKey = (event: KeyboardEvent) => {
      if (["Escape", "Enter", " "].includes(event.key)) skip();
    };

    (async () => {
      try {
        const display = fontFromVar("--font-instrument-sans-face");
        const ui = fontFromVar("--font-inter-face");
        const [{ createPaperScene }, logo] = await Promise.all([
          import("../scene/createPaperScene"),
          loadLogo(),
          document.fonts.load(`600 64px ${display}`),
          document.fonts.load(`400 18px ${display}`),
          document.fonts.load(`600 12px ${ui}`),
        ]);
        if (cancelled) return;

        // Too slow (bad network / device): don't hold visitors at the door.
        if ((performance.now() - startedAt) / 1000 > T.giveUpAfter) return finish();

        scene = createPaperScene({ canvas, logo, fonts: { display, ui } });
        root.style.animation = "none"; // the JS timeline takes over from the CSS failsafe

        const { width, height, radius } = scene;
        const state: PaperState = { ink: 0, crumple: 0, x: 0, y: 0, spin: 0, roll: 0, squash: 0 };
        const render = () => scene?.update(state);
        render();

        // Where the ball lands and leaves (world units: px from centre, y up)
        const restY = height / 2 - findFloorY(height, radius) + radius;
        scene.setRestY(restY);
        const landX = -width * 0.14;
        const exitX = -(width / 2 + radius * 3);

        // Each bounce is shorter; height follows time² like real gravity.
        const firstBounceHeight = Math.min(height * 0.16, radius * 4);
        const bounces = [1, 0.62, 0.35].map((k) => ({
          rise: T.firstBounce * k,
          height: firstBounceHeight * k * k,
          squash: k,
        }));
        const impactPause = 0.04; // the ball sits squashed for a moment on each hit
        const bouncingTime = bounces.reduce((sum, b) => sum + impactPause + b.rise * 2, 0);

        timeline = gsap
          .timeline({ onUpdate: render, onComplete: finish })
          // the sheet settles in over the plain paper backdrop
          .to(canvas, { autoAlpha: 1, duration: T.fadeIn, ease: "power1.out" })
          .to(state, { ink: 1, duration: T.inkDuration, ease: "power2.inOut" }, T.inkStart)
          // crumple
          .addLabel("crumple", T.crumpleAt)
          .set(backdrop, { autoAlpha: 0 }, "crumple")
          .to(state, { crumple: 1, duration: T.crumple, ease: "power1.inOut" }, "crumple")
          // wind-up, then a short arc down onto the floor
          .to(state, { x: radius * 0.35, y: radius * 0.3, duration: T.windUp, ease: "power2.out" })
          .addLabel("throw")
          .to(state, { x: landX, duration: T.throw, ease: "none" }, "throw")
          .to(state, { y: `+=${radius * 1.2}`, duration: T.throw * 0.3, ease: "power2.out" }, "throw")
          .to(state, { y: restY, duration: T.throw * 0.7, ease: "power2.in" }, `throw+=${T.throw * 0.3}`)
          .to(state, { spin: 0.75, duration: T.throw, ease: "power1.out" }, "throw")
          .addLabel("land");

        // On the floor: steady drift left, rolling with it, until off-screen.
        const land = timeline.labels.land;
        timeline.to(
          state,
          { x: exitX, roll: (landX - exitX) / radius, duration: bouncingTime + T.roll, ease: "none" },
          land
        );

        // Bounces: squash on impact, rise, fall back (gravity = power2 in/out).
        let at = land;
        for (const bounce of bounces) {
          timeline
            .to(state, { squash: bounce.squash, duration: 0.06, ease: "power2.out", yoyo: true, repeat: 1 }, at)
            .to(state, { y: restY + bounce.height, duration: bounce.rise, ease: "power2.out" }, at + impactPause)
            .to(state, { y: restY, duration: bounce.rise, ease: "power2.in" }, at + impactPause + bounce.rise);
          at += impactPause + bounce.rise * 2;
        }
        // last soft touch-down before it rolls away
        timeline.to(state, { squash: 0.2, duration: 0.05, ease: "power2.out", yoyo: true, repeat: 1 }, at);

        root.addEventListener("click", skip);
        window.addEventListener("keydown", onKey);
        window.addEventListener("resize", scene.resize);
      } catch (error) {
        console.error("Gateway animation failed, skipping intro.", error);
        finish();
      }
    })();

    return () => {
      cancelled = true;
      timeline?.kill();
      root.removeEventListener("click", skip);
      window.removeEventListener("keydown", onKey);
      if (scene) window.removeEventListener("resize", scene.resize);
      scene?.dispose();
      unlockScroll();
    };
  }, [rootRef, backdropRef, canvasRef, onComplete]);
}
