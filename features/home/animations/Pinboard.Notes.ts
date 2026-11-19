"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { afterIntro } from "@/lib/helpers/afterIntro";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Seconds between one note being pinned and the next. */
const PIN_EVERY = 0.16;

/** One note in the breeze: how far it swings (deg), how long a swing takes (s), where in it it starts, and how
 *  strongly the breeze moves it just now (1; eased to 0 while it's hovered). `gust` is its lift in a gust (px). */
type Swing = { reach: number; period: number; phase: number; strength: number; gust: number };

/**
 * The pinboard's notes (`[data-note]`, each with its `[data-pin]`, inside a
 * `[data-note-link]`), inside the returned ref (the board):
 *  1. until the board scrolls into view it's empty;
 *  2. then, one after another, each note drops onto the board (from a little
 *     above, turning as it falls), its pin stabs in and the paper gives a
 *     small thud;
 *  3. once they're all up they sway on their pins as if a breeze were coming
 *     through: each at its own pace, now and then a gentle gust through all
 *     of them. The sway stops while the board is off screen.
 * The sway is worked out every frame from each note's own swing (a sine), times
 * its strength: pointing at a note eases its strength to 0, so it glides
 * smoothly to rest (never freezing mid-tilt, never nudged by a gust while the
 * pointer is on it), and leaving eases it back in from rest, with no jump.
 * Hover is read from the link, which never moves, so it can't flicker.
 * The notes' resting tilt and hover look are CSS on elements inside
 * `[data-note]`; GSAP only moves `[data-note]`. With reduced motion the notes
 * are simply there.
 */
export function usePinboardNotes() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const board = ref.current;
      if (!board || !contextSafe || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const notes = gsap.utils.toArray<HTMLElement>("[data-note]", board);
      const pins = notes.map((n) => n.querySelector<HTMLElement>("[data-pin]"));
      const links = notes.map((n) => n.closest<HTMLElement>("[data-note-link]"));

      // an empty board until it's seen (set before the first paint)
      gsap.set(notes, { autoAlpha: 0, transformOrigin: "50% 20px" });
      gsap.set(pins, { autoAlpha: 0 });

      const swings: Swing[] = notes.map(() => ({
        reach: gsap.utils.random(1.1, 2),
        period: gsap.utils.random(4.4, 6.4),
        phase: gsap.utils.random(0, Math.PI * 2),
        strength: 0,
        gust: 0,
      }));
      const setters = notes.map((note) => ({
        rotation: gsap.quickSetter(note, "rotation", "deg"),
        skewY: gsap.quickSetter(note, "skewY", "deg"),
        y: gsap.quickSetter(note, "y", "px"),
      }));
      const hovered = notes.map(() => false);

      // every frame: each note's swing, scaled by its strength
      const breeze = () => {
        const t = gsap.ticker.time;
        swings.forEach((s, i) => {
          const angle = s.strength * s.reach * Math.sin((t / s.period) * Math.PI * 2 + s.phase);
          setters[i].rotation(angle);
          setters[i].skewY(angle * 0.25);
          setters[i].y(s.strength * s.gust);
        });
      };

      let swaying = false;
      let visible = true;
      let gust: gsap.core.Timeline | null = null;
      // off screen, the breeze stops (and picks up where it was when the board is back)
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting === visible) return;
        visible = entry.isIntersecting;
        if (!swaying) return;
        if (visible) {
          gsap.ticker.add(breeze);
          gust?.resume();
        } else {
          gsap.ticker.remove(breeze);
          gust?.pause();
        }
      });
      observer.observe(board);

      // hovered, a note eases to rest; left, the breeze takes it up again
      const calm = links.map((link, i) => {
        if (!link) return () => {};
        const enter = () => {
          hovered[i] = true;
          if (swaying) gsap.to(swings[i], { strength: 0, duration: 0.45, ease: "power2.out", overwrite: true });
        };
        const leave = () => {
          hovered[i] = false;
          if (swaying) gsap.to(swings[i], { strength: 1, duration: 1.4, ease: "power1.inOut", overwrite: true });
        };
        link.addEventListener("pointerenter", enter);
        link.addEventListener("pointerleave", leave);
        return () => {
          link.removeEventListener("pointerenter", enter);
          link.removeEventListener("pointerleave", leave);
        };
      });

      const sway = contextSafe(() => {
        // the breeze picks up gently from rest (a note under the pointer just now stays still)
        swings.forEach((s, i) => gsap.to(s, { strength: hovered[i] ? 0 : 1, duration: 1.6, delay: i * 0.12, ease: "power1.inOut" }));
        gust = gsap.timeline({ repeat: -1, repeatDelay: gsap.utils.random(5, 8), delay: 4 });
        gust
          .to(swings, { gust: -3, duration: 0.6, ease: "sine.out", stagger: { each: 0.08, from: "start" } })
          .to(swings, { gust: 0, duration: 1.1, ease: "sine.inOut", stagger: { each: 0.08, from: "start" } });
        swaying = true;
        if (visible) gsap.ticker.add(breeze);
        else gust.pause();
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
        calm.forEach((off) => off());
        gsap.ticker.remove(breeze);
        gust?.kill();
        gsap.killTweensOf(swings);
      };
    },
    { scope: ref }
  );

  return ref;
}
