"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { afterIntro } from "@/lib/helpers/afterIntro";

/** How long each line stays up (s), and the pace of writing and erasing (s per letter). */
const HOLD = 7;
const WRITE = 0.085;
const ERASE = 0.04;
/** Each letter fades in as it's written (and out as it's erased), over this long (s). */
const INK = 0.32;

/**
 * The hero headline's changing line: each line stays up for 7 s, is erased
 * letter by letter (the caret walking back, each letter fading away), and the
 * next is written in, letter by letter, each one inking in softly, round and round. Letters are hidden by taking them out of
 * the line (display: none), so the caret always sits right after the last one
 * and the words wrap as they're written. Starts after the welcome gateway;
 * with reduced motion the first line simply stays.
 */
export function useRotatingLine(count: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);
  const wrote = useRef(false); // has a line been written in yet (the first is already there)

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const line = root.querySelector(`[data-line="${current}"]`);
    if (!line) return;
    const letters = gsap.utils.toArray<HTMLElement>("[data-letter]", line);
    const caret = line.querySelector("[data-caret]");

    const tl = gsap.timeline({ paused: true });
    let t = 0;
    if (wrote.current) {
      // write it in
      gsap.set(letters, { display: "none", opacity: 0 }); // before the first paint, so it never flashes
      tl.set(caret, { visibility: "visible" }, 0);
      t = 0.3;
      letters.forEach((letter, i) => {
        tl.set(letter, { display: "" }, t + i * WRITE);
        tl.to(letter, { opacity: 1, duration: INK, ease: "power1.out" }, t + i * WRITE);
      });
      t += letters.length * WRITE + INK + 0.8;
      tl.set(caret, { visibility: "hidden" }, t);
    }
    // stay up, then erase from the end
    t += HOLD;
    tl.set(caret, { visibility: "visible" }, t);
    t += 0.5;
    [...letters].reverse().forEach((letter, i) => {
      tl.to(letter, { opacity: 0, duration: ERASE * 2.5, ease: "power1.in" }, t + i * ERASE);
      tl.set(letter, { display: "none" }, t + (i + 2.5) * ERASE);
    });
    t += (letters.length + 2.5) * ERASE + 0.45;
    tl.call(
      () => {
        wrote.current = true;
        setCurrent((i) => (i + 1) % count);
      },
      undefined,
      t
    );

    const stopWaiting = wrote.current ? (tl.play(), () => {}) : afterIntro(() => tl.play());
    return () => {
      stopWaiting();
      tl.kill();
      // leave this line whole (and hidden, now another shows) for next time round
      gsap.set(letters, { display: "", opacity: 1 });
      gsap.set(caret, { visibility: "hidden" });
    };
  }, [current, count]);

  return { ref, current };
}
