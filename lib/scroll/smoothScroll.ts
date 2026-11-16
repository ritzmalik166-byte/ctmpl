import type Lenis from "lenis";

/** The page's smooth scroller, once it's running (see SmoothScroll). */
let lenis: Lenis | null = null;

export const setSmoothScroll = (instance: Lenis | null) => {
  lenis = instance;
};

/**
 * Hold the page still (e.g. while the menu is open over it), or let it go
 * again. Covers both the smooth scroller and native scrolling.
 */
export function holdPage(hold: boolean) {
  document.documentElement.style.overflow = hold ? "hidden" : "";
  if (hold) lenis?.stop();
  else lenis?.start();
}

/**
 * Smoothly scroll to an element, through the smooth scroller when it's
 * running (so the two never fight), or natively otherwise.
 * `block: "center"` centres the element on screen, like scrollIntoView.
 */
export function scrollToElement(target: HTMLElement, { block = "start" }: { block?: "start" | "center" } = {}) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis) {
    const offset = block === "center" ? -(window.innerHeight - target.getBoundingClientRect().height) / 2 : 0;
    lenis.scrollTo(target, { offset, immediate: reduced });
    return;
  }
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block });
}

/**
 * Smoothly scroll so the part of the page between `top` and `bottom` (px from
 * the top of the page) is centred on screen, or, if it's taller than the
 * screen less `headerSpace`, starts just under the site header.
 */
export function scrollToRange(top: number, bottom: number, headerSpace = 90) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const room = window.innerHeight - headerSpace;
  const target = Math.max(0, bottom - top > room ? top - headerSpace : top - headerSpace - (room - (bottom - top)) / 2);
  if (lenis) lenis.scrollTo(target, { immediate: reduced });
  else window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
}
