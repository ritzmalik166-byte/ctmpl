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

/** One spoken phrase: the mouth opens and closes on syllables, ending on a closed smile. */
function speak(timeline: gsap.core.Timeline, closedMouth: Element[], at: number, syllables: number) {
  let t = at;
  for (let i = 0; i < syllables; i++) {
    const open = gsap.utils.random(0.1, 0.18);
    const shut = gsap.utils.random(0.06, 0.11);
    timeline.set(closedMouth, { opacity: 0 }, t).set(closedMouth, { opacity: 1 }, t + open);
    t += open + shut;
  }
  return t;
}

/**
 * Meera presents the whiteboard: she talks in phrases (head nodding, the
 * pointing arm giving little beats of emphasis), smiles between them, blinks,
 * and turns her arm to point at whichever stat is active.
 */
export function usePresentingMeera(activeStat?: number) {
  const ref = usePuppet((q) => {
    const [head, arm, mouth, eyes, figure] = [q("head"), q("arm"), q("mouth-closed"), q("eyes"), q("figure")];

    const presenting = gsap.timeline({ repeat: -1, repeatDelay: 1.1, delay: 0.4 }).set(mouth, { opacity: 1 }, 0);
    const end = speak(presenting, mouth, 0.2, 14);
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
 * The man is enjoying himself: a relaxed, easy sway. His raised arms wave
 * gently one after the other, his crossed legs rock from the hips, his head
 * tilts along and he bobs softly on each beat.
 */
export function useCheeringMan() {
  return usePuppet((q) => {
    const [armL, armR, legs, head, eyes, figure] = [q("arm-left"), q("arm-right"), q("legs"), q("head"), q("eyes"), q("figure")];
    const BEAT = 0.9; // seconds per beat: an easy, happy groove

    const sway = gsap.timeline({ delay: 0.2 });
    sway
      // arms wave outward, one after the other
      .to(armL, { rotation: -7, duration: BEAT, ease: "sine.inOut", yoyo: true, repeat: -1 }, 0)
      .to(armR, { rotation: 7, duration: BEAT, ease: "sine.inOut", yoyo: true, repeat: -1 }, BEAT)
      // legs rock from the hips; the head tilts along a touch behind
      .fromTo(legs, { rotation: -2 }, { rotation: 2, duration: BEAT, ease: "sine.inOut", yoyo: true, repeat: -1 }, 0)
      .fromTo(head, { rotation: -2 }, { rotation: 2, duration: BEAT, ease: "sine.inOut", yoyo: true, repeat: -1 }, 0.12)
      // a soft bob on every beat
      .to(figure, { yPercent: -0.6, duration: BEAT / 2, ease: "sine.inOut", yoyo: true, repeat: -1 }, 0);

    return [sway, blink(eyes)];
  });
}
