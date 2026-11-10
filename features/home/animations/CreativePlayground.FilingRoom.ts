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
 *  1. the open drawer's file tabs sink back inside and it closes,
 *  2. the picked drawer pulls out and its file tabs rise up out of it,
 *  3. on the desk the photo in the case file is swapped for that client's and
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

      const one = (sel: string) => root.querySelector<HTMLElement>(sel);
      const [oldDrawer, newDrawer] = [one(`[data-drawer="${from}"]`), one(`[data-drawer="${active}"]`)];
      const [oldTabs, newTabs] = [one(`[data-tabs="${from}"]`), one(`[data-tabs="${active}"]`)];
      const [oldCover, newCover] = [one(`[data-cover="${from}"]`), one(`[data-cover="${active}"]`)];
      const [stamp, file] = [one('[data-file="stamp"]'), one('[data-file="folder"]')];

      // a quick second pick: finish the previous change at once, then start this one
      running.current?.progress(1);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(oldDrawer, CLOSED_DRAWER); gsap.set(newDrawer, OPEN_DRAWER);
        gsap.set(oldTabs, { y: TABS_HIDDEN_Y }); gsap.set(newTabs, { y: 0 });
        gsap.set(oldCover, { opacity: 0 }); gsap.set(newCover, { opacity: 1, y: 0, rotation: 0, scale: 1 });
        return;
      }

      const tl = gsap.timeline();
      running.current = tl;
      tl
        // 1. close the open drawer: tabs sink inside, the drawer slides home
        .to(oldTabs, { y: TABS_HIDDEN_Y, duration: 0.3, ease: "power2.in" }, 0)
        .to(oldDrawer, { ...CLOSED_DRAWER, duration: 0.35, ease: "power2.inOut" }, 0.15)
        // 2. open the picked drawer, then its tabs come up out of it
        .to(newDrawer, { ...OPEN_DRAWER, duration: 0.4, ease: "power2.out" }, 0.3)
        .fromTo(newTabs, { y: TABS_HIDDEN_Y }, { y: 0, duration: 0.5, ease: "back.out(1.7)", immediateRender: false }, 0.5)
        // 3. the photo on the file changes: the old one slides away, the new one drops in
        .to(stamp, { opacity: 0, duration: 0.15, ease: "power1.out" }, 0)
        .to(oldCover, { opacity: 0, y: 14, rotation: -2, duration: 0.3, ease: "power2.in" }, 0.05)
        .fromTo(newCover, { opacity: 0, y: -26, rotation: 2.5, scale: 1.03 }, { opacity: 1, y: 0, rotation: 0, scale: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, 0.3)
        // 4. stamp it: the seal comes down hard and the file gives a little thud
        .fromTo(stamp, { opacity: 0, scale: 1.9, rotation: -6 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.16, ease: "power4.in", immediateRender: false }, STAMP_LANDS_AT)
        .to(file, { y: 2, duration: 0.06, ease: "power1.out", yoyo: true, repeat: 1 }, STAMP_LANDS_AT + 0.16);
    },
    { scope: ref, dependencies: [active] }
  );

  return ref;
}
