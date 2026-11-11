"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * The tear across the top of the form paper: a jagged line between y 18 and
 * 27px, 40 teeth across whatever its width; the stub above it stays under the clip.
 */
const TEAR = (() => {
  const points: string[] = [];
  for (let i = 0; i <= 40; i++) points.push(`${i * 2.5}% ${i % 2 ? 27 : 18}px`);
  return points;
})();
/** The sheet below the tear (what the hand takes away). */
export const TORN_SHEET = `polygon(${TEAR.join(", ")}, 100% 100%, 0 100%)`;
/** The stub above the tear (left under the clip). */
export const TORN_STUB = `polygon(0 0, 100% 0, ${[...TEAR].reverse().join(", ")})`;

/** How far the door opens (deg; it swings out toward us, so negative), and how dark it gets as it turns. */
const DOOR_OPEN = -34;
const DOOR_SHADE = 0.16;

/** How far (px, along the arm) the arm and the sheet go back into the room. */
const INTO_ROOM = 400;

/** The door and its hand are shown from lg (64rem) up; below that the form is just torn off the board. */
const WITH_DOOR = "(min-width: 64rem)";
/**
 * How big the door and its hand are drawn (see MeetingRoomDoor): xl 1:1 as in
 * Figma, lg 65%. The torn paper moves with the hand, so its moves (given
 * along the arm, at full size) are scaled the same way.
 */
const alongArm = (x: number, y: number) => {
  const scale = window.matchMedia("(min-width: 80rem)").matches ? 1 : 0.65;
  return { x: x * scale, y: y * scale };
};

/**
 * Below lg (no door): the request is torn off the board by itself: a couple of
 * tugs, the rip (the stub stays under the clip), and the sheet drops away.
 */
function tearOff(
  sheet: HTMLElement,
  stub: HTMLElement,
  onComplete: () => void,
) {
  return gsap
    .timeline({ onComplete })
    .to(sheet, { y: -5, rotation: -1, duration: 0.1, ease: "power1.out" })
    .to(sheet, { y: 0, rotation: 0, duration: 0.09, ease: "power1.in" })
    .to(
      sheet,
      { y: -7, rotation: 1.2, duration: 0.1, ease: "power1.out" },
      "+=0.08",
    )
    .to(sheet, { y: 0, rotation: 0, duration: 0.09, ease: "power1.in" })
    .set(stub, { autoAlpha: 1 }, "+=0.12")
    .set(sheet, { clipPath: TORN_SHEET }, "<")
    .to(
      sheet,
      { y: -24, x: -8, rotation: -6, duration: 0.2, ease: "power3.out" },
      "<",
    )
    .to(sheet, {
      y: 340,
      x: 50,
      rotation: 16,
      duration: 0.75,
      ease: "power2.in",
    })
    .to(sheet, { autoAlpha: 0, duration: 0.3, ease: "power1.in" }, "-=0.3");
}

/**
 * The meeting room booking, as a scene (all parts found by `data-anim` inside
 * the returned ref):
 *  - `takeRequest()`: from lg up the door opens a little (out toward us), a
 *    hand reaches out from behind it to the clipboard, takes hold of the
 *    request, tugs, tears it off the board (a jagged stub stays under the
 *    clip) and carries it back inside; the door closes behind it. Below lg
 *    there's no door: the request is torn off and drops away. Resolves when done.
 *  - `showBooked()`: the "room booked" note is clipped onto the board.
 *  - `clearBooked()`: the note comes off again (to send another request).
 * With reduced motion the door and hand don't move; the note just appears.
 */
export function useBookingSequence() {
  const scene = useRef<HTMLDivElement>(null);
  /** What's playing now (stopped if the section goes away mid-way). */
  const playing = useRef<gsap.core.Timeline | null>(null);
  useGSAP(() => () => void playing.current?.kill(), { scope: scene });
  const part = (name: string) =>
    scene.current?.querySelector<HTMLElement>(`[data-anim="${name}"]`) ?? null;
  const reduced = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const takeRequest = () =>
    new Promise<void>((resolve) => {
      const [leaf, arm, sheet, stub] = ["leaf", "arm", "sheet", "stub"].map(
        part,
      );
      if (!sheet || !stub || reduced()) return resolve();
      if (!window.matchMedia(WITH_DOOR).matches || !leaf || !arm) {
        playing.current = tearOff(sheet, stub, () => resolve());
        return;
      }
      const [tug, rip, away] = [
        alongArm(-9, 0),
        alongArm(-34, 14),
        alongArm(-INTO_ROOM, 34),
      ];

      playing.current = gsap
        .timeline({ onComplete: () => resolve() })
        // the door swings open a little, out toward us
        .to(
          leaf,
          { rotationY: DOOR_OPEN, duration: 0.75, ease: "power2.inOut" },
          0,
        )
        .to(
          part("leaf-shade"),
          { opacity: DOOR_SHADE, duration: 0.75, ease: "power2.inOut" },
          0,
        )
        // a hand comes out of the dark and takes hold of the paper
        .fromTo(
          arm,
          { x: -340, y: 20, autoAlpha: 1, filter: "brightness(0.25)" },
          {
            x: 0,
            y: 0,
            filter: "brightness(1)",
            duration: 0.85,
            ease: "power2.out",
          },
          0.45,
        )
        // a tug…
        .to(arm, { x: -9, duration: 0.12, ease: "power1.out" }, 1.45)
        .to(
          sheet,
          { ...tug, rotation: -1.5, duration: 0.12, ease: "power1.out" },
          1.45,
        )
        .to(
          [arm, sheet],
          { x: 0, y: 0, rotation: 0, duration: 0.1, ease: "power1.in" },
          1.57,
        )
        // …and it tears off the board
        .set(stub, { autoAlpha: 1 }, 1.72)
        .set(sheet, { clipPath: TORN_SHEET }, 1.72)
        .to(
          sheet,
          { ...rip, rotation: -7, duration: 0.2, ease: "power3.out" },
          1.72,
        )
        .to(arm, { x: -34, y: 14, duration: 0.2, ease: "power3.out" }, 1.72)
        // carried back into the room, the paper crumpling up in the hand
        .to(
          arm,
          {
            x: -INTO_ROOM,
            y: 34,
            duration: 0.95,
            ease: "power2.in",
          },
          2.05,
        )
        .to(sheet, { ...away, duration: 0.95, ease: "power2.in" }, 2.05)
        // the paper crumples up small in the hand as it's pulled away
        .to(
          sheet,
          { rotation: -26, scale: 0.3, duration: 0.7, ease: "power1.out" },
          2.05,
        )
        // into the dark of the room: the arm darkens once it's back through the
        // doorway (about 0.65 s into the pull), and both are gone
        .to(
          arm,
          { filter: "brightness(0.25)", duration: 0.25, ease: "power1.in" },
          2.72,
        )
        .to([arm, sheet], { autoAlpha: 0, duration: 0.2 }, 2.85)
        // the door is pulled shut, with a small bump back out as it meets the frame
        .to(leaf, { rotationY: 0, duration: 0.65, ease: "power2.in" }, 2.95)
        .to(
          part("leaf-shade"),
          { opacity: 0, duration: 0.65, ease: "power2.in" },
          2.95,
        )
        .to(
          leaf,
          {
            rotationY: -3,
            duration: 0.09,
            ease: "power1.out",
            yoyo: true,
            repeat: 1,
          },
          3.6,
        );
    });

  const showBooked = () => {
    const [note, stub] = [part("booked"), part("stub")];
    if (!note) return;
    if (reduced()) return void gsap.set(note, { autoAlpha: 1 });
    playing.current = gsap
      .timeline()
      .fromTo(
        note,
        { autoAlpha: 0, y: -46, rotation: -4 },
        {
          autoAlpha: 1,
          y: 0,
          rotation: 0,
          duration: 0.7,
          ease: "back.out(1.6)",
        },
      )
      .set(stub, { autoAlpha: 0 })
      .fromTo(
        part("stamp"),
        { autoAlpha: 0, scale: 1.8 },
        { autoAlpha: 0.92, scale: 1, duration: 0.3, ease: "power3.in" },
        "+=0.15",
      );
  };

  const clearBooked = () =>
    new Promise<void>((resolve) => {
      const note = part("booked");
      if (!note || reduced()) {
        if (note) gsap.set(note, { autoAlpha: 0 });
        return resolve();
      }
      playing.current = gsap
        .timeline({ onComplete: () => resolve() })
        .to(note, {
          autoAlpha: 0,
          y: 24,
          rotation: 3,
          duration: 0.35,
          ease: "power2.in",
        });
    });

  return { scene, takeRequest, showBooked, clearBooked };
}
