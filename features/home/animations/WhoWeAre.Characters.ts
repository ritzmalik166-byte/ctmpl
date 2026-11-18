"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { blink, breathe, usePuppet } from "./puppet";

gsap.registerPlugin(useGSAP);

/**
 * How far Meera lowers her pointing arm (degrees) to aim at each stat.
 * In the artwork she points at 1000+; 2008 is further left, the other two lower.
 */
const AIM_AT_STAT = [-7, 0, -16, -22];

/** Her mouth shapes over her open smile ("open" is the smile as drawn: none of them shown), and how often each comes up in speech ("closed" for an m, b or p). */
const LAYERS = ["closed", "parted", "half", "wide", "round"] as const;
type Mouth = (typeof LAYERS)[number] | "open";
const SYLLABLE_MOUTHS: Mouth[] = ["parted", "parted", "half", "half", "half", "open", "open", "round", "round", "closed"];

/**
 * One spoken phrase: syllable by syllable her mouth goes through the shapes
 * speech makes (mostly parted and half open, open or wider on a stressed
 * syllable, a round "o" now and then, lips together for an m / b / p), each
 * crossfading softly into the next; a beat with lips just parted between
 * words; back to her closed smile at the end. Returns when the phrase ends.
 */
function speak(timeline: gsap.core.Timeline, mouths: Record<(typeof LAYERS)[number], Element[]>, at: number, syllables: number) {
  const r = gsap.utils.random;
  const show = (shape: Mouth, t: number) => {
    LAYERS.forEach((m) => timeline.to(mouths[m], { opacity: m === shape ? 1 : 0, duration: 0.05, ease: "none" }, t));
  };
  let t = at;
  let last: Mouth = "closed";
  for (let i = 0; i < syllables; i++) {
    let shape: Mouth = i % 4 === 1 ? (i % 8 === 1 ? "wide" : "open") : SYLLABLE_MOUTHS[Math.floor(r(0, SYLLABLE_MOUTHS.length - 0.001))];
    if (shape === last) shape = shape === "half" ? "parted" : "half"; // no shape twice running
    show(shape, t);
    last = shape;
    t += r(0.11, 0.17);
    if (i % 5 === 4 && i < syllables - 1) {
      show("parted", t); // between words
      last = "parted";
      t += r(0.08, 0.14);
    }
  }
  show("closed", t);
  return t + 0.1;
}

/**
 * Meera presents the whiteboard: she talks in phrases (her mouth shaping the
 * syllables, head nodding, the
 * pointing arm giving little beats of emphasis), smiles between them, blinks,
 * and turns her arm to point at whichever stat is active.
 */
export function usePresentingMeera(activeStat?: number) {
  const ref = usePuppet((q) => {
    const [head, arm, eyes, figure] = [q("head"), q("arm"), q("eyes"), q("figure")];
    const mouths = Object.fromEntries(LAYERS.map((m) => [m, q(`mouth-${m}`)])) as Record<(typeof LAYERS)[number], Element[]>;

    const presenting = gsap.timeline({ repeat: -1, repeatDelay: 1.1, delay: 0.4 });
    const end = speak(presenting, mouths, 0.2, 14);
    presenting
      // nod along while speaking
      .to(head, { rotation: 2.5, duration: 0.45, ease: "sine.inOut" }, 0.2)
      .to(head, { rotation: -1.5, duration: 0.6, ease: "sine.inOut" }, 0.7)
      .to(head, { rotation: 1.5, duration: 0.55, ease: "sine.inOut" }, 1.35)
      .to(head, { rotation: 0, duration: 0.5, ease: "sine.inOut" }, end - 0.2)
      // two little beats with the marker, "...and this one!"
      .to(arm, { rotation: 4, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }, 0.45)
      .to(arm, { rotation: 3, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }, 1.5);

    return [presenting, blink(eyes), breathe(figure)];
  });

  // Point at the active stat (a separate joint, so it adds to the beats above).
  useGSAP(
    () => {
      const aim = ref.current?.querySelector('[data-part="arm-aim"]');
      if (!aim || activeStat === undefined) return;
      const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(aim, { rotation: AIM_AT_STAT[activeStat] ?? 0, duration: instant ? 0 : 0.8, ease: "power2.inOut", overwrite: true });
    },
    { scope: ref, dependencies: [activeStat], revertOnUpdate: false }
  );

  return ref;
}

/**
 * The man is enjoying himself: his raised arms wave gently one after the
 * other. Only his arms move; he stands with both feet on the floor.
 */
export function useCheeringMan() {
  return usePuppet((q) => {
    const [armL, armR, eyes] = [q("arm-left"), q("arm-right"), q("eyes")];
    const BEAT = 0.9; // seconds per beat: an easy, happy groove

    // only his arms move: they wave outward, one after the other (his feet stay planted on the floor)
    const cheer = gsap.timeline({ delay: 0.2 });
    cheer
      .to(armL, { rotation: -7, duration: BEAT, ease: "sine.inOut", yoyo: true, repeat: -1 }, 0)
      .to(armR, { rotation: 7, duration: BEAT, ease: "sine.inOut", yoyo: true, repeat: -1 }, BEAT);

    return [cheer, blink(eyes)];
  });
}
