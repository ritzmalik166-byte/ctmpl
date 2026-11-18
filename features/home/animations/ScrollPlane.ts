"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { afterIntro } from "@/lib/helpers/afterIntro";

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);

/** The checkpoints it flies between (every section eyebrow, from "Who we are": SectionLabel marks them), in page order. */
const DOCK = "img[data-plane-dock]";
/** A leg lands as the next eyebrow reaches this line of the screen... */
const LAND = "center 60%";
/** ...and the next leg takes off from it once it's a little higher (so it has landed before the next one leaves). */
const TAKE_OFF = "center 50%";
/** How long (s) the plane takes to catch up with the scroll: the higher, the smoother and calmer. */
const SCRUB = 1.4;
/** How far each route swings out across the screen (1 = the full route, less = a tighter, slower path). */
const SWING = 0.6;
/** The plane's picture points its nose 40° up from level: this turns it along its flight (and level at rest). */
const NOSE = 40;
/** The first and last part of a leg, in which it levels off into its eyebrow's resting pose. */
const SETTLE = 0.14;
/** Flying back up (scrolling up), how steeply at least its nose points up the page (sine of the angle). */
const CLIMB = 0.6;
/**
 * Each leg's route across the screen, a different one each time: four turning
 * points (x as a fraction of the screen's width), spread down the way between
 * the two eyebrows, each nudged up or down a little (fraction of the screen's
 * height) for the swoops.
 */
const ROUTES = [
  { x: [0.78, 0.42, 0.14, 0.5], dip: [-0.06, 0.05, -0.04, 0.06] },
  { x: [0.24, 0.66, 0.88, 0.36], dip: [0.05, -0.06, 0.04, -0.05] },
  { x: [0.62, 0.9, 0.34, 0.12], dip: [-0.05, 0.06, -0.06, 0.04] },
  { x: [0.3, 0.12, 0.7, 0.86], dip: [0.06, -0.04, 0.05, -0.06] },
  { x: [0.84, 0.5, 0.2, 0.62], dip: [-0.04, 0.06, -0.05, 0.05] },
  { x: [0.18, 0.54, 0.9, 0.4], dip: [0.05, -0.05, 0.06, -0.04] },
];
/** Paper flecks shed from its tail: how far it flies between each (px), and the colours they come in. */
const FLECK_EVERY = 14;
const FLECKS = ["#f3d6c9", "#f6e6c2", "#ffffff", "#e9c7a6", "#d16a42"];

/** Where an element's centre is on the page (px), as it's drawn right now. */
function livePage(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + window.scrollY };
}

/** An angle as the shortest turn (-180° to 180°). */
const wrap = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180;

/**
 * The little orange paper plane, flying down the page with the scroll, as a
 * relay. Every checkpoint (each section's eyebrow, from "Who we are" on)
 * always has its own plane. Scroll and a plane takes off from one checkpoint,
 * flies a swooping route across the screen (different every leg), shedding
 * paper flecks from its tail, and lands exactly on the next one's plane, level
 * in its pose; scroll on and that checkpoint's plane takes off for the one
 * after, and so on to "Start a conversation". It flies with the scroll, nose
 * always the way it's going: scroll up and it turns and flies back up, pointing
 * up the page. Rebuilt when the window resizes. Not with reduced motion.
 */
export function useScrollPlane() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const layer = ref.current;
      if (!layer || !contextSafe) return;
      // (the whole page's checkpoints: a selector string here would be scoped to this layer)
      const docks = Array.from(document.querySelectorAll<HTMLElement>(DOCK));
      if (docks.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      let legs: { trigger: ScrollTrigger; tween: gsap.core.Tween; plane: HTMLElement; cover: HTMLElement }[] = [];

      /** A paper fleck falling away behind the plane, turning, and fading. */
      const shed = (x: number, y: number, dx: number, dy: number) => {
        if (layer.childElementCount > 90) return;
        const fleck = document.createElement("span");
        const size = gsap.utils.random(3, 6);
        fleck.style.cssText = `position:absolute;left:0;top:0;width:${size}px;height:${size * gsap.utils.random(0.5, 1)}px;background:${gsap.utils.random(FLECKS)};border-radius:1px;box-shadow:0 1px 1px rgba(60,40,20,.18);pointer-events:none`;
        layer.appendChild(fleck);
        const len = Math.hypot(dx, dy) || 1;
        // from the tail (behind the nose), drifting back and down
        const tx = x - (dx / len) * 12;
        const ty = y - (dy / len) * 12;
        gsap.fromTo(
          fleck,
          { x: tx, y: ty, rotation: gsap.utils.random(0, 360), autoAlpha: 0.95 },
          {
            x: tx - (dx / len) * gsap.utils.random(14, 34) + gsap.utils.random(-10, 10),
            y: ty + gsap.utils.random(18, 46),
            rotation: `+=${gsap.utils.random(-220, 220)}`,
            autoAlpha: 0,
            duration: gsap.utils.random(0.9, 1.5),
            ease: "power1.out",
            onComplete: () => fleck.remove(),
          }
        );
      };

      const clear = () => {
        legs.forEach(({ trigger, tween, plane, cover }) => {
          trigger.kill();
          tween.kill();
          gsap.killTweensOf(plane);
          plane.remove();
          cover.remove();
        });
        legs = [];
      };

      const build = contextSafe(() => {
        clear();
        const vw = document.documentElement.clientWidth;
        const vh = window.innerHeight;

        for (let k = 0; k < docks.length - 1; k++) {
          const from = docks[k];
          const to = docks[k + 1];
          const a = livePage(from);
          const b = livePage(to);
          const route = ROUTES[k % ROUTES.length];
          const size = from.getBoundingClientRect().width || 27;
          // leaving climbing up-right (as it rests), swooping across the screen, and landing climbing up-right again
          const raw = MotionPathPlugin.arrayToRawPath(
            [
              { x: a.x, y: a.y },
              { x: a.x + size * 1.6, y: a.y - size * 1.3 },
              // (pulled in toward the straight line between the checkpoints: less ground per scroll, a calmer flight)
              ...route.x.map((fx, i) => {
                const t = (i + 1) / (route.x.length + 1);
                const straight = a.x + (b.x - a.x) * t;
                return { x: gsap.utils.clamp(vw * 0.12, vw * 0.88, straight + (fx * vw - straight) * SWING), y: a.y + (b.y - a.y) * t + route.dip[i] * vh * SWING };
              }),
              { x: b.x - size * 1.7, y: b.y + size * 1.4 },
              { x: b.x, y: b.y },
            ],
            { curviness: 1.15 }
          );
          MotionPathPlugin.cacheRawPathMeasurements(raw);

          const plane = from.cloneNode(true) as HTMLElement;
          plane.removeAttribute("data-plane-dock");
          plane.removeAttribute("style");
          plane.className = "";
          plane.style.cssText = `position:absolute;left:0;top:0;width:${size}px;height:${size}px;max-width:none;pointer-events:none;will-change:transform`;
          layer.appendChild(plane);
          // flying back (scrolling up), it tucks in behind the plane already sitting in the eyebrow it's going back to:
          // a copy of that plane, laid exactly over it, above the flying one
          const cover = plane.cloneNode(true) as HTMLElement;
          layer.appendChild(cover);
          gsap.set(cover, { xPercent: -50, yPercent: -50, x: a.x, y: a.y, autoAlpha: 0 });
          gsap.set(plane, { xPercent: -50, yPercent: -50, x: a.x, y: a.y, rotation: 0, scaleX: 1, autoAlpha: 0 });
          // its flying pose (turning smoothly after its heading), and how far it has settled into the eyebrow's resting
          // pose (level, facing right): near a checkpoint it's drawn part way between the two, all the way at it, so it
          // comes in (either way, scrolling down or up) already exactly as the eyebrow's plane sits: no snap at the end
          const pose = { rot: 0, sx: 1 };
          let settle = 0; // 1 = in flight, 0 = at rest in the checkpoint
          const render = () =>
            gsap.set(plane, { rotation: wrap(pose.rot) * settle, scaleX: 1 + (pose.sx - 1) * settle });
          const turnTo = gsap.quickTo(pose, "rot", { duration: 0.35, ease: "power2.out", onUpdate: render });
          const bankTo = gsap.quickTo(pose, "sx", { duration: 0.35, ease: "power2.out", onUpdate: render });

          const state = { t: 0 };
          let lastT = 0;
          let back = false; // flying back up the page (scrolling up)
          let mirrored = false; // heading left: the picture flipped, so it's never upside down
          let shown = false;
          let rotation = 0; // (unwrapped, so turns always go the short way round)
          let last = { x: a.x, y: a.y };
          let travelled = 0;

          const tween = gsap.to(state, {
            t: 1,
            // a gentle take-off and landing
            ease: "sine.inOut",
            paused: true,
            onUpdate() {
              const p = this.progress();
              const t = state.t;
              if (Math.abs(t - lastT) > 1e-5) back = t < lastT;
              lastT = t;
              // every checkpoint keeps its own plane; this one only shows between them, so it lands exactly on (into) the next
              if (p <= 0.002 || p >= 0.998) {
                if (shown) gsap.set(plane, { autoAlpha: 0, rotation: 0, scaleX: 1 });
                if (shown) gsap.set(cover, { autoAlpha: 0 });
                shown = false;
                rotation = 0;
                mirrored = false;
                return;
              }
              const pos = MotionPathPlugin.getPositionOnPath(raw, t, true) as { x: number; y: number; angle: number };
              // pinned to where the two checkpoints really are now (whatever their sections' entrances are doing)
              const la = livePage(from);
              const lb = livePage(to);
              // (kept on the screen, even where the curve swings wide on a phone)
              const x = gsap.utils.clamp(size * 0.6, vw - size * 0.6, pos.x + (la.x - a.x) * (1 - t) + (lb.x - b.x) * t);
              const y = pos.y + (la.y - a.y) * (1 - t) + (lb.y - b.y) * t;

              // nose the way it's going: down the page scrolling down, turned back up the page scrolling up
              let heading = pos.angle + (back ? 180 : 0);
              if (back) {
                // flying back it always points up the page (leaning left or right the way it's drifting)
                const rad = (heading * Math.PI) / 180;
                heading = (Math.atan2(Math.min(Math.sin(rad), -CLIMB), Math.cos(rad)) * 180) / Math.PI;
              }
              const c = Math.cos((heading * Math.PI) / 180);
              if (!mirrored && c < -0.25) mirrored = true;
              else if (mirrored && c > 0.25) mirrored = false;
              const target = wrap(heading + (mirrored ? 180 - NOSE : NOSE));
              rotation += wrap(target - rotation);
              // levelling into the checkpoint's resting pose as it comes in (and as it leaves), with the scroll
              const edge = Math.min(p, 1 - p) / SETTLE;
              settle = edge >= 1 ? 1 : gsap.parseEase("sine.inOut")(edge);

              gsap.set(plane, { x, y });
              gsap.set(cover, { x: la.x, y: la.y, autoAlpha: back ? 1 : 0 });
              if (!shown) {
                // (taking off: straight into its pose, no turning in from where it last was)
                shown = true;
                gsap.set(plane, { autoAlpha: 1 });
                turnTo(rotation, rotation);
                bankTo(mirrored ? -1 : 1, mirrored ? -1 : 1);
              } else {
                turnTo(rotation);
                bankTo(mirrored ? -1 : 1);
              }
              render();

              const dx = x - last.x;
              const dy = y - last.y;
              travelled += Math.hypot(dx, dy);
              if (travelled > FLECK_EVERY) {
                travelled = 0;
                shed(x, y, dx, dy);
              }
              last = { x, y };
            },
          });
          // checkpoint to checkpoint; the next leg takes off only once this one has landed
          const trigger = ScrollTrigger.create({
            trigger: from,
            endTrigger: to,
            start: TAKE_OFF,
            end: LAND,
            scrub: SCRUB,
            animation: tween,
          });
          legs.push({ trigger, tween, plane, cover });
        }
      });

      let resizeTimer = 0;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(build, 250);
      };
      window.addEventListener("resize", onResize);
      // after the welcome gateway, and again once images and fonts have settled the page's layout (this layer mounts
      // a moment after the page, so it can miss the gateway's "done": it also checks for itself until it has flown)
      let settleTimer = 0;
      let built = false;
      const start = () => {
        if (built) return;
        built = true;
        build();
        settleTimer = window.setTimeout(build, 1500);
      };
      const stopWaiting = afterIntro(start);
      const watch = window.setInterval(() => {
        if (built) window.clearInterval(watch);
        else if (document.documentElement.dataset.gateway !== "playing") start();
      }, 400);

      return () => {
        stopWaiting();
        window.clearInterval(watch);
        window.clearTimeout(resizeTimer);
        window.clearTimeout(settleTimer);
        window.removeEventListener("resize", onResize);
        clear();
        layer.replaceChildren();
      };
    },
    { scope: ref }
  );

  return ref;
}
