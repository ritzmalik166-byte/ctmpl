"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Ignore scroll moves smaller than this (px), so the header doesn't twitch. */
const NUDGE = 6;
/** Near the top the header always shows (px). */
const ALWAYS_SHOWN = 120;

/**
 * The header's frame: fixed to the top of the window.
 *  - at the very top it's transparent (the hero shows behind it);
 *  - once the page is scrolled (scrollY > 0) it takes on its paper: #F1DDBD
 *    with a matte grain and a soft shadow;
 *  - scrolling down it slides up out of view (-100%), scrolling up it slides
 *    back down, smoothly; near the top it always shows.
 * Works with the smooth scroller (it moves the window, so scroll events fire).
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 0);
      if (y < ALWAYS_SHOWN) setHidden(false);
      else if (Math.abs(y - lastY) >= NUDGE) setHidden(y > lastY);
      if (Math.abs(y - lastY) >= NUDGE || y < ALWAYS_SHOWN) lastY = y;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      data-hidden={hidden}
      className="group/header fixed inset-x-0 top-0 z-50 py-[7px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[hidden=true]:-translate-y-full"
    >
      {/* its paper: fades in once the page is scrolled */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#F1DDBD] opacity-0 shadow-[0_6px_18px_rgba(90,60,30,0.12)] transition-opacity duration-500 group-data-[scrolled=true]/header:opacity-100"
      >
        {/* matte paper grain */}
        <span className="absolute inset-0 bg-[url(/images/website/home/who-we-are/paper-wall.jpg)] bg-size-[512px] opacity-45 mix-blend-multiply" />
      </span>
      <div className="relative">{children}</div>
    </header>
  );
}
