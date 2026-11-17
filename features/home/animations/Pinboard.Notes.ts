"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { afterIntro } from "@/lib/helpers/afterIntro";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Seconds between one note being pinned and the next. */
const PIN_EVERY = 0.16;

/**
 * The pinboard's notes (`[data-note]`, each with its `[data-pin]`), inside the
 * returned ref (the board):
 *  1. until the board scrolls into view it's empty;
 *  2. then, one after another, each note drops onto the board (from a little
 *     above, turning as it falls), its pin stabs in and the paper gives a
 *     small thud;
 *  3. once they're all up they sway on their pins as if a breeze were coming
 *     through: each at its own pace, now and then a stronger gust through all
 *     of them. The sway pauses while the board is off screen.
 * The notes' resting tilt is their CSS `rotate`; GSAP only adds to it (a
 * transform), so hovering a note still straightens it. With reduced motion the
 * notes are simply there.
 */
export function usePinboardNotes() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const board = ref.current;
      if (!board || !contextSafe || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const notes = gsap.utils.toArray<HTMLElement>("[data-note]", board);
      const pins = notes.map((n) => n.querySelector<HTMLElement>("[data-pin]"));

      // an empty board until it's seen (set before the first paint)
      gsap.set(notes, { autoAlpha: 0, transformOrigin: "50% 20px" });
      gsap.set(pins, { autoAlpha: 0 });

      const swaying: gsap.core.Animation[] = [];
      let visible = true;
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        swaying.forEach((a) => (visible ? a.resume() : a.pause()));
      });
      observer.observe(board);

      // the breeze: each note sways about its pin, at its own pace; every so often a gust through them all
      const sway = contextSafe(() => {
        notes.forEach((note, i) => {
          const reach = gsap.utils.random(1.1, 2);
          swaying.push(
            gsap.fromTo(
              note,
              { rotation: 0, skewY: 0 },
              { keyframes: { rotation: [0, reach, -reach, 0], skewY: [0, reach * 0.25, -reach * 0.25, 0], ease: "sine.inOut" }, duration: gsap.utils.random(4.4, 6.4), ease: "none", repeat: -1, delay: i * 0.12 }
            )
          );
        });
        const gust = gsap.timeline({ repeat: -1, repeatDelay: gsap.utils.random(5, 8), delay: 4 });
        gust
          .to(notes, { y: -3, duration: 0.6, ease: "sine.out", stagger: { each: 0.08, from: "start" } })
          .to(notes, { y: 0, duration: 1.1, ease: "sine.inOut", stagger: { each: 0.08, from: "start" } });
        swaying.push(gust);
        if (!visible) swaying.forEach((a) => a.pause());
      });

      const build = contextSafe(() => {
        const pinning = gsap.timeline({ scrollTrigger: { trigger: board, start: "top 72%", once: true }, onComplete: sway });
        notes.forEach((note, i) => {
          const at = 0.25 + i * PIN_EVERY;
          pinning
            // the note drops onto the board, turning as it falls
            .fromTo(note, { autoAlpha: 0, y: -90, rotation: gsap.utils.random(-10, 10), scale: 1.06 }, { autoAlpha: 1, y: 0, rotation: 0, scale: 1, duration: 0.6, ease: "power3.out" }, at)
            // the pin stabs in
            .fromTo(pins[i], { autoAlpha: 0, scale: 2.2, y: -14 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.18, ease: "power4.in" }, at + 0.45)
            // and the paper gives a little thud
            .to(note, { y: 2, duration: 0.07, ease: "power1.out", yoyo: true, repeat: 1 }, at + 0.63);
        });
      });
      const stopWaiting = afterIntro(build);

      return () => {
        stopWaiting();
        observer.disconnect();
        swaying.forEach((a) => a.kill());
      };
    },
    { scope: ref }
  );

  return ref;
}
