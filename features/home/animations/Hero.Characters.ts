"use client";

import gsap from "gsap";
import { breathe, talk, usePuppet } from "./puppet";

/**
 * Man: "Welcome in!" Every few seconds he sweeps his arm up and out, gives a
 * small wave, says hello and lowers it again. Blinks now and then.
 */
export function useWelcomingMan() {
  return usePuppet((q) => {
    const [arm, head, figure, mouth, lids] = [q("arm"), q("head"), q("figure"), q("mouth"), q("lid")];

    const welcome = gsap
      .timeline({ repeat: -1, repeatDelay: 3.2, delay: 0.3 })
      // sweep the arm open, leaning into it
      .to(arm, { rotation: 36, duration: 0.8, ease: "back.out(1.6)" }, 0)
      .to(head, { rotation: -4, duration: 0.7, ease: "power2.out" }, 0.05)
      .to(figure, { rotation: -1.2, duration: 0.8, ease: "power2.out" }, 0)
      // a friendly little wave
      .to(arm, { rotation: 27, duration: 0.22, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0.8);
    // "Wel-come in!"
    talk(welcome, mouth, 0.55, 3);
    welcome
      // settle back
      .to(arm, { rotation: 0, duration: 0.9, ease: "power2.inOut" }, 2.2)
      .to(head, { rotation: 0, duration: 0.9, ease: "power2.inOut" }, 2.2)
      .to(figure, { rotation: 0, duration: 0.9, ease: "power2.inOut" }, 2.2);

    const blink = gsap
      .timeline({ repeat: -1, repeatRefresh: true, repeatDelay: 2.6 })
      .to(lids, { scaleY: 1, duration: 0.06, ease: "power1.in" })
      .to(lids, { scaleY: 0, duration: 0.09, ease: "power1.out" }, "+=0.05");

    return [welcome, blink, breathe(figure)];
  });
}

/**
 * Woman: reads a line from her book (head dips into it), then looks up
 * and tells you about it, the book moving gently in her hands.
 */
export function useReadingWoman() {
  return usePuppet((q) => {
    const [head, book, figure, mouth] = [q("head"), q("book"), q("figure"), q("mouth")];

    const story = gsap
      .timeline({ repeat: -1, repeatDelay: 0.6, delay: 0.8 })
      // read: lean into the book
      .to(head, { rotation: 2, yPercent: 0.3, duration: 0.7, ease: "power2.inOut" }, 0)
      .to(book, { rotation: 0.8, yPercent: -0.25, duration: 0.7, ease: "power2.inOut" }, 0)
      // look up and tell us about it
      .to(head, { rotation: -2, yPercent: 0, duration: 0.6, ease: "power2.inOut" }, 2.3)
      .to(book, { rotation: -0.5, yPercent: 0.2, duration: 0.6, ease: "power2.inOut" }, 2.3);
    const doneTalking = talk(story, mouth, 2.6, 9);
    story
      .to(head, { rotation: 0, duration: 0.6, ease: "power2.inOut" }, doneTalking + 0.2)
      .to(book, { rotation: 0, yPercent: 0, duration: 0.6, ease: "power2.inOut" }, doneTalking + 0.2);

    return [story, breathe(figure)];
  });
}
