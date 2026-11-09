"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { afterIntro } from "@/lib/helpers/afterIntro";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, MotionPathPlugin);

/** Seconds per letter: the heading is written slowly, the intro a little faster. */
const PACE = { heading: 0.045, intro: 0.016 };

/**
 * "Who we are" scroll intro:
 *  1. the label slides in
 *  2. heading and intro are written out letter by letter, an ink caret
 *     following the pen
 *  3. the paper airplane glides in on a curved path and lands in its place,
 *     then hovers gently
 * Plays once when the section scrolls into view (after the welcome gateway).
 */
export function useWhoWeAreIntro() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = ref.current;
      if (!root || !contextSafe || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const q = (name: string) => root.querySelector<HTMLElement>(`[data-anim="${name}"]`)!;
      const [label, heading, intro, plane] = [q("label"), q("heading"), q("intro"), q("plane")];

      // Hide before first paint (the section starts below the fold).
      gsap.set([label, heading, intro, plane], { autoAlpha: 0 });

      let stopWaiting = () => {};
      const build = contextSafe(() => {
        // Split after fonts load so letter widths are final; words stay whole when wrapping.
        const split = (el: HTMLElement) => SplitText.create(el, { type: "words,chars", aria: "auto" }).chars;
        const headingChars = split(heading);
        const introChars = split(intro);
        gsap.set([heading, intro], { autoAlpha: 1 });
        gsap.set([...headingChars, ...introChars], { autoAlpha: 0 });

        const timeline = gsap.timeline({
          scrollTrigger: { trigger: root, start: "top 75%", once: true },
          defaults: { ease: "power2.out" },
        });

        timeline.fromTo(label, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.6 }, 0);
        write(timeline, heading, headingChars, PACE.heading, 0.35);
        write(timeline, intro, introChars, PACE.intro, 0.35 + headingChars.length * PACE.heading + 0.2);
        flyIn(timeline, plane, 0.2);
      });

      // Fonts first, then wait for the gateway so it never plays behind it.
      document.fonts.ready.then(() => {
        if (ref.current) stopWaiting = afterIntro(build);
      });

      return () => stopWaiting();
    },
    { scope: ref }
  );

  return ref;
}

/**
 * Letters appear one after another, each settling into place like fresh ink,
 * while the caret jumps to the end of the letter just written.
 */
function write(timeline: gsap.core.Timeline, block: HTMLElement, chars: Element[], pace: number, at: number) {
  const caret = block.querySelector<HTMLElement>('[data-anim="caret"]');
  const blockBox = () => block.getBoundingClientRect();

  const moveCaret = (char: Element) => {
    if (!caret) return;
    const box = char.getBoundingClientRect();
    const origin = blockBox();
    gsap.set(caret, { x: box.right - origin.left + 1, y: box.top - origin.top + box.height * 0.06 });
  };

  timeline
    .set(caret, { autoAlpha: 1 }, at)
    .fromTo(
      chars,
      { autoAlpha: 0, yPercent: 35, rotation: -6 },
      {
        autoAlpha: 1,
        yPercent: 0,
        rotation: 0,
        duration: 0.22,
        stagger: {
          each: pace,
          onStart(this: gsap.core.Tween) {
            moveCaret(this.targets()[0] as Element);
          },
        },
      },
      at
    )
    // caret blinks twice at the end of the line, then lifts away
    .to(caret, { autoAlpha: 0, duration: 0.12, repeat: 3, yoyo: true, ease: "steps(1)" })
    .to(caret, { autoAlpha: 0, duration: 0.2 });
}

/**
 * The airplane enters from the lower left, swoops up and round, then glides
 * up-and-right into its spot: the direction its nose already points, so it
 * arrives at exactly its resting angle. Then it bobs as if on air.
 */
function flyIn(timeline: gsap.core.Timeline, plane: HTMLElement, at: number) {
  const NOSE_ANGLE = -25; // the artwork's nose points up-right by ~25°

  timeline
    .set(plane, { autoAlpha: 1 }, at)
    .from(
      plane,
      {
        duration: 2.2,
        ease: "power1.inOut",
        motionPath: {
          path: [
            { x: -520, y: 260 },
            { x: -300, y: 40 },
            { x: -120, y: -110 },
            { x: 60, y: -40 },
            { x: -40, y: 70 },
            { x: 0, y: 0 },
          ],
          curviness: 1.4,
          autoRotate: -NOSE_ANGLE,
        },
        scale: 0.6,
      },
      at
    )
    // the motion path can leave a few degrees of bank; level out exactly
    .to(plane, { rotation: 0, duration: 0.35, ease: "power2.out" })
    // then float on the air
    .to(plane, { y: -6, rotation: -2, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
}
