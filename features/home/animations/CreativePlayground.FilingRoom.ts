"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CLOSED_DRAWER, OPEN_DRAWER } from "../components/CreativePlayground.Drawer";

gsap.registerPlugin(useGSAP);

/** How far the file tabs sink to hide inside their drawer (px). */
const TABS_HIDDEN_Y = 24;
/** When the APPROVED stamp lands, from the moment a drawer is picked (s). */
export const STAMP_LANDS_AT = 0.95;

/**
 * Opening another case in the filing room:
 *  1. the open cabinet drawer's file tabs sink back inside and it glides shut
 *     (a file from the desk's drawers has none here: DeskDrawers slides those),
 *  2. the picked drawer glides well out towards us (larger, a deep shadow,
 *     over its neighbours) and its file tabs rise up out of it,
 *  3. on the desk the case file's photo and typed sheet are swapped for that
 *     client's, and
 *  4. a fresh APPROVED seal is stamped on the file (Neha brings her stamp down).
 * The starting look (case 1 open) is in the markup, so nothing jumps on load.
 */
export function useFilingRoom(active: number) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useRef(active);
  const running = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const root = ref.current;
      const from = shown.current;
      if (!root || from === active) return;
      shown.current = active;

      // a file from the desk's drawers has no cabinet drawer or tabs: those steps just skip it (an empty target)
      const one = (sel: string): HTMLElement | never[] => root.querySelector<HTMLElement>(sel) ?? [];
      const [oldDrawer, newDrawer] = [one(`[data-drawer="${from}"]`), one(`[data-drawer="${active}"]`)];
      const [oldTabs, newTabs] = [one(`[data-tabs="${from}"]`), one(`[data-tabs="${active}"]`)];
      const [oldCover, newCover] = [one(`[data-cover="${from}"]`), one(`[data-cover="${active}"]`)];
      const [oldSheet, newSheet] = [one(`[data-sheet="${from}"]`), one(`[data-sheet="${active}"]`)];
      const [stamp, file] = [one('[data-file="stamp"]'), one('[data-file="folder"]')];

      // a quick second pick: finish the previous change at once, then start this one
      running.current?.progress(1);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(oldDrawer, CLOSED_DRAWER); gsap.set(newDrawer, OPEN_DRAWER);
        gsap.set(oldTabs, { y: TABS_HIDDEN_Y }); gsap.set(newTabs, { y: 0 });
        gsap.set([oldCover, oldSheet], { opacity: 0 }); gsap.set([newCover, newSheet], { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1 });
        return;
      }

      const tl = gsap.timeline();
      running.current = tl;
      tl
        // 1. close the open drawer: tabs sink inside, then it glides shut in one smooth push
        .to(oldTabs, { y: TABS_HIDDEN_Y, duration: 0.25, ease: "power2.in" }, 0)
        .to(oldDrawer, { scale: CLOSED_DRAWER.scale, y: CLOSED_DRAWER.y, boxShadow: CLOSED_DRAWER.boxShadow, duration: 0.42, ease: "power2.inOut", force3D: true }, 0.08)
        // 2. only once it's shut (flush, so the two never overlap while moving and the layering change
        //    can't be seen), the picked drawer glides right out in one smooth pull; then its tabs rise
        .set(oldDrawer, { zIndex: CLOSED_DRAWER.zIndex }, 0.5)
        .set(newDrawer, { zIndex: OPEN_DRAWER.zIndex }, 0.5)
        .to(newDrawer, { scale: OPEN_DRAWER.scale, y: OPEN_DRAWER.y, boxShadow: OPEN_DRAWER.boxShadow, duration: 0.6, ease: "power3.out", force3D: true }, 0.5)
        .fromTo(newTabs, { y: TABS_HIDDEN_Y }, { y: 0, duration: 0.45, ease: "power2.out", immediateRender: false }, 0.8)
        // 3. the photo on the file changes: the old one slides away, the new one drops in
        .to(stamp, { opacity: 0, duration: 0.15, ease: "power1.out" }, 0)
        .to(oldCover, { opacity: 0, y: 14, rotation: -2, duration: 0.3, ease: "power2.in" }, 0.05)
        .fromTo(newCover, { opacity: 0, y: -26, rotation: 2.5, scale: 1.03 }, { opacity: 1, y: 0, rotation: 0, scale: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, 0.3)
        // ...and the typed sheet is swapped: the old one is slid off, the new one laid down
        .to(oldSheet, { opacity: 0, x: 26, rotation: 2, duration: 0.32, ease: "power2.in" }, 0.1)
        .fromTo(newSheet, { opacity: 0, x: -14, y: -22, rotation: -2 }, { opacity: 1, x: 0, y: 0, rotation: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, 0.38)
        // 4. stamp it: the seal comes down hard and the file gives a little thud
        .fromTo(stamp, { opacity: 0, scale: 1.9, rotation: -6 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.16, ease: "power4.in", immediateRender: false }, STAMP_LANDS_AT)
        .to(file, { y: 2, duration: 0.06, ease: "power1.out", yoyo: true, repeat: 1 }, STAMP_LANDS_AT + 0.16);
    },
    { scope: ref, dependencies: [active] }
  );

  return ref;
}
