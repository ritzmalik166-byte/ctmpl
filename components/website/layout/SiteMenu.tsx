"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { navigationCopy } from "@/config/navigation";
import { holdPage } from "@/lib/scroll/smoothScroll";
import { MenuDesk, MENU_DESK_SIZE } from "./menu/MenuDesk";
import { MenuMobile, MENU_MOBILE_SIZE } from "./menu/MenuMobile";

/** From this width the menu is the desktop desk (below it, the phone layout). */
const DESKTOP_FROM = 1024;
/** The phone layout is drawn 390 wide and grows with the screen, up to this much. */
const MOBILE_MAX_SCALE = 1.6;

/** Today's dateline, as on the masthead: long on desktop, short on phones. */
function dateline(desktop: boolean) {
  const now = new Date();
  const place = `${navigationCopy.edition} · ${navigationCopy.place}`.toUpperCase();
  if (desktop) {
    const day = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).replace(",", "").toUpperCase();
    return `${place}      ·      ${day.replace(/^(\w+) /, "$1, ")}`;
  }
  const day = now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).replace(",", "").toUpperCase();
  return `${place} · ${day.replace(/^(\w+) /, "$1, ")}`;
}

/** Which layout, and how big: the desk fits the screen (both ways); the phone sheet fits its width. */
function useMenuLayout(shown: boolean) {
  const [layout, setLayout] = useState({ desktop: true, scale: 1, bleed: 0 });
  useLayoutEffect(() => {
    if (!shown) return;
    const measure = () => {
      const w = window.innerWidth;
      const desktop = w >= DESKTOP_FROM;
      // desktop: the desk spans the full width of the screen (it scrolls if that makes it taller than the screen)
      const scale = desktop ? w / MENU_DESK_SIZE.width : Math.min(w / MENU_MOBILE_SIZE.width, MOBILE_MAX_SCALE);
      // (desktop: how far the screen reaches past the 1440 frame on each side, in frame px; the masthead spans it)
      const bleed = desktop ? Math.max(0, (w / scale - MENU_DESK_SIZE.width) / 2) : 0;
      setLayout({ desktop, scale, bleed });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [shown]);
  return layout;
}

/**
 * The menu button, and the menu it opens: the special edition of The CTM Times
 * laid out on the studio's desk (the Figma "Mega Menu · Paper Art" frames, see
 * MenuDesk and MenuMobile): the masthead, the folder of pages, the services
 * sheet, the blog clippings, the letter pad (the quick contact form) and the
 * ticket stub, with the mug, glasses and pencil lying about.
 *
 * Opening: the desk fades up over the page, the masthead slides down onto it
 * and the papers are dealt onto the desk one after another, settling from a
 * tilt; the props slide in. Closing lifts it all away. While it's open the page
 * holds still, Esc closes it, and focus moves to the Close tag (and back to
 * the menu button after). Desktop: the 1440 × 1060 desk, scaled to the full
 * width of the screen (scrolling if that makes it taller), its masthead too (the
 * logo at the left edge, the Close tag at the right); phones: the 390-wide
 * sheet, scaled to the screen's width, scrolling.
 */
export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false); // in the page (stays while it closes)
  const overlay = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const { desktop, scale, bleed } = useMenuLayout(shown);
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const openMenu = () => {
    setShown(true);
    setOpen(true);
  };
  const closeMenu = () => setOpen(false);

  // in: the desk, the masthead, then the papers dealt one by one, and the props
  useLayoutEffect(() => {
    const root = overlay.current;
    if (!open || !root) return;
    holdPage(true);
    const focusClose = () => closeButton.current?.focus({ preventScroll: true });
    if (reduced()) return void focusClose();
    const q = (name: string) => root.querySelectorAll(`[data-menu="${name}"]`);
    const tl = gsap
      .timeline()
      .fromTo(q("desk"), { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power1.out" })
      .from(q("masthead"), { y: -150, duration: 0.65, ease: "power3.out", stagger: 0.04 }, 0.05)
      .from(q("part"), { y: 46, rotation: -2.5, autoAlpha: 0, duration: 0.7, ease: "back.out(1.4)", stagger: 0.09 }, 0.22)
      .from(q("prop"), { y: 30, rotation: "+=10", autoAlpha: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 }, 0.55)
      .add(focusClose, 0.4); // once the masthead (with its Close tag) is down
    return () => void tl.kill();
  }, [open, desktop]);

  // out: the papers lift away and the desk fades, then the menu leaves the page
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
      .to([...q("part"), ...q("prop")], { y: -30, autoAlpha: 0, duration: 0.3, ease: "power2.in", stagger: 0.03 })
      .to(q("masthead"), { y: -150, duration: 0.35, ease: "power2.in" }, 0.05)
      .to(q("desk"), { opacity: 0, duration: 0.3, ease: "power1.in" }, 0.2);
    return () => void tl.kill();
  }, [open, shown]);

  // Esc closes
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const Layout = desktop ? MenuDesk : MenuMobile;
  const size = desktop ? MENU_DESK_SIZE : MENU_MOBILE_SIZE;

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
            {/* the desk: kraft paper, darkening towards the edges */}
            <div data-menu="desk" className="absolute inset-0 bg-[#e0c397] bg-[url(/images/website/menu/kraft-70.webp)] bg-size-[153.6px] bg-blend-multiply">
              <span className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(0,0,0,0)_55%,rgba(77,46,20,0.28)_100%)]" />
            </div>
            {/* the edition, at its Figma size, scaled to the screen (the phone sheet scrolls) */}
            <div
              data-lenis-prevent
              className={`absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain ${desktop ? "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : ""}`}
              onClick={(e) => e.target === e.currentTarget && closeMenu()}
            >
              <div className={desktop ? "shrink-0" : "mx-auto"} style={{ width: size.width * scale, height: size.height * scale }}>
                <div style={{ zoom: scale, "--bleed": `${bleed}px` } as CSSProperties}>
                  <Layout onClose={closeMenu} onNavigate={closeMenu} closeRef={closeButton} dateline={dateline(desktop)} />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
