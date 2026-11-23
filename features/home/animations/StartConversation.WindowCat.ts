"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { catGone, KICK_EVENT } from "./StartConversation.KickedCat";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Sent (on window) when a booking request starts (detail true: sending, the
 * door about to open) and when it's all done (false). The cat stays down out
 * of sight the whole while.
 */
export const DOOR_BUSY_EVENT = "ctm:door-busy";

/** How long the cat stays down between peeks (s). */
const EVERY = 5;

/**
 * The cat in the meeting room door's window. Every 5 seconds: it rises into
 * view on its back legs and puts its paws up on the glass either side of its
 * face; keeping its head still, only its eyes move: it looks left, then right,
 * then straight back at you, and breaks into a greedy smile (eyes narrowed),
 * holds it, and lets go: head first, then paws. Runs only while the door is on
 * screen; with reduced motion it doesn't peek at all, nor once it's been
 * kicked out of the room this visit (see useKickedCat).
 */
export function useWindowCat() {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const q = gsap.utils.selector(root);
      const [paws, head, eyes, gaze, smile] = ["[data-paws]", "[data-head-bob]", "[data-eyes]", "[data-gaze]", "[data-smile]"].map((s) => q(s));

      // down out of sight, below the sill
      gsap.set(paws, { y: 80 });
      gsap.set(head, { y: 140 });
      gsap.set(eyes, { transformOrigin: "50% 50%" });
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || catGone()) return;

      /**
       * Only its eyes move: the pupils glance over (dir -1 left, 1 right, 0
       * back to you) and stay there a moment. They're drawn a little to the
       * left already, so they've less far to go that way.
       */
      const look = (dir: number) => gsap.to(gaze, { x: dir < 0 ? -1.4 : dir * 3.6, duration: 0.3, ease: "power2.inOut" });

      const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: EVERY, delay: 1.2 });
      tl.to(head, { y: 0, duration: 0.7, ease: "back.out(1.3)" })
        .to(paws, { y: 0, duration: 0.42, ease: "back.out(1.6)" }, "-=0.35")
        // its eyes go to the left, then to the right, then straight back to you
        .add(look(-1), "+=0.25")
        .add(look(1), "+=0.7")
        .add(look(0), "+=0.7")
        // ...and a greedy smile, its eyes narrowed
        .to(eyes, { scaleY: 0.55, duration: 0.18, ease: "power2.out" }, "+=0.35")
        .to(smile, { opacity: 1, duration: 0.18 }, "<")
        // hold it, then let go
        .to(smile, { opacity: 0, duration: 0.2 }, "+=1.3")
        .to(eyes, { scaleY: 1, duration: 0.2 }, "<")
        .to(head, { y: 140, duration: 0.45, ease: "power2.in" }, "<0.05")
        .to(paws, { y: 80, duration: 0.3, ease: "power2.in" }, "-=0.18");

      // only while the door's on screen
      const trigger = ScrollTrigger.create({ trigger: root, start: "top bottom", end: "bottom top", onToggle: (self) => (self.isActive ? tl.play() : tl.pause()) });
      // kicked out of the room: it drops out of the window, and doesn't come back this visit
      const gone = () => {
        trigger.kill();
        tl.kill();
        gsap.to(head, { y: 140, duration: 0.25, ease: "power2.in" });
        gsap.to(paws, { y: 80, duration: 0.2, ease: "power2.in" });
        gsap.to(smile, { opacity: 0, duration: 0.1 });
      };
      // while a request is being sent and taken in, it ducks down and stays down; then it carries on peeking
      const busy = (e: Event) => {
        if (catGone()) return;
        if ((e as CustomEvent<boolean>).detail) {
          tl.pause();
          gsap.to(head, { y: 140, duration: 0.3, ease: "power2.in", overwrite: "auto" });
          gsap.to(paws, { y: 80, duration: 0.25, ease: "power2.in", overwrite: "auto" });
          gsap.to(smile, { opacity: 0, duration: 0.1, overwrite: "auto" });
        } else {
          tl.restart(true);
          if (!trigger.isActive) tl.pause();
        }
      };
      window.addEventListener(KICK_EVENT, gone);
      window.addEventListener(DOOR_BUSY_EVENT, busy);
      return () => {
        window.removeEventListener(KICK_EVENT, gone);
        window.removeEventListener(DOOR_BUSY_EVENT, busy);
      };
    },
    { scope: ref }
  );

  return ref;
}
