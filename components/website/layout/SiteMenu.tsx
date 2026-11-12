"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { navigationCopy } from "@/config/navigation";
import { holdPage } from "@/lib/scroll/smoothScroll";
import { MenuPaper } from "./MenuPaper";

/**
 * The menu button, and the menu it opens: a special edition of The CTM Times
 * laid over the page (see MenuPaper). The paper drops onto the darkened page,
 * settling with a slight tilt, and its columns appear one after another;
 * closing lifts it away. While it's open the page holds still, Esc closes it,
 * and focus moves to its Close button (and back to the menu button after).
 * The menu is drawn over everything, outside the header. On desktop the
 * paper fills 95% of the screen and fits it without scrolling.
 */
export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false); // in the page (stays while it closes)
  const overlay = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const openMenu = () => {
    setShown(true);
    setOpen(true);
  };
  const closeMenu = () => setOpen(false);

  // in: the paper drops onto the page and its columns appear
  useLayoutEffect(() => {
    const root = overlay.current;
    if (!open || !root) return;
    holdPage(true);
    const focusClose = () => closeButton.current?.focus({ preventScroll: true });
    if (reduced()) return void focusClose();
    const q = (name: string) => root.querySelectorAll(`[data-menu="${name}"]`);
    const tl = gsap
      .timeline()
      .fromTo(q("backdrop"), { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power1.out" })
      .fromTo(q("paper"), { y: -60, rotation: -2.5, scale: 0.96, autoAlpha: 0 }, { y: 0, rotation: 0, scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(1.3)" }, 0.05)
      .fromTo(q("part"), { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.07, ease: "power2.out" }, 0.3)
      .add(focusClose, 0.35) // once the masthead (with Close) is showing
      // settled: no transforms left on the paper, so its text stays sharp (focus, hover, typing)
      .set([...q("paper"), ...q("part")], { clearProps: "transform" });
    return () => void tl.kill();
  }, [open]);

  // out: the paper lifts away, then the menu leaves the page
  useEffect(() => {
    const root = overlay.current;
    if (open || !shown || !root) return;
    const done = () => {
      setShown(false);
      holdPage(false);
      button.current?.focus({ preventScroll: true });
    };
    if (reduced()) return done();
    const q = (name: string) => root.querySelectorAll(`[data-menu="${name}"]`);
    const tl = gsap
      .timeline({ onComplete: done })
      .to(q("paper"), { y: -40, rotation: 1.5, scale: 0.97, autoAlpha: 0, duration: 0.35, ease: "power2.in" })
      .to(q("backdrop"), { opacity: 0, duration: 0.3, ease: "power1.in" }, 0.1);
    return () => void tl.kill();
  }, [open, shown]);

  // Esc closes
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        ref={button}
        type="button"
        onClick={openMenu}
        aria-label={navigationCopy.openMenu}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex size-12 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-full border border-sand-line bg-white drop-shadow-soft transition-transform hover:scale-105 lg:size-16"
      >
        <span className="h-0.5 w-5 rounded-[1px] bg-ink-strong" />
        <span className="h-0.5 w-5 rounded-[1px] bg-ink-strong" />
        <span className="h-0.5 w-5 rounded-[1px] bg-ink-strong" />
      </button>

      {shown &&
        createPortal(
          <div ref={overlay} role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[70]">
            <div data-menu="backdrop" className="absolute inset-0 bg-[#2b2622]/60 backdrop-blur-[2px]" onClick={closeMenu} />
            {/* the paper scrolls on its own when it's taller than the screen */}
            <div data-lenis-prevent className="absolute inset-0 overflow-y-auto overscroll-contain px-2.5 py-4 sm:px-6 sm:py-8 lg:flex lg:items-center lg:justify-center lg:overflow-hidden lg:p-0" onClick={(e) => e.target === e.currentTarget && closeMenu()}>
              <MenuPaper onClose={closeMenu} onNavigate={closeMenu} closeRef={closeButton} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
