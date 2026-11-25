"use client";

import Image, { type StaticImageData } from "next/image";
import gsap from "gsap";
import { usePuppet } from "@/features/home/animations/puppet";
// the pair by the board (board-updated: cut from "South Asian Creative Lead in Green-1.png" and
// "South Asian producer with mustard notebook-2.png", each trimmed to its outline; the old woman/man files are kept)
import leadBody from "@/public/images/website/footer/board-updated/lead-body.webp";
import leadHead from "@/public/images/website/footer/board-updated/lead-head.webp";
import leadEyeLeft from "@/public/images/website/footer/board-updated/lead-eye-left.webp";
import leadEyeRight from "@/public/images/website/footer/board-updated/lead-eye-right.webp";
import producerBody from "@/public/images/website/footer/board-updated/producer-body.webp";
import producerHead from "@/public/images/website/footer/board-updated/producer-head.webp";
import producerEyeLeft from "@/public/images/website/footer/board-updated/producer-eye-left.webp";
import producerEyeRight from "@/public/images/website/footer/board-updated/producer-eye-right.webp";

type Person = {
  aspect: string;
  body: StaticImageData;
  head: StaticImageData;
  headOrigin: string;
  eyes: { src: StaticImageData; origin: string }[];
  /** Which way their head tips first (they look in towards the board). */
  lean: 1 | -1;
};

export const FOOTER_PEOPLE = {
  lead: {
    aspect: "415/1445",
    body: leadBody,
    head: leadHead,
    headOrigin: "56.63% 16.75%",
    eyes: [{ src: leadEyeLeft, origin: "54.94% 8.79%" }, { src: leadEyeRight, origin: "70.12% 8.3%" }],
    lean: 1,
  },
  producer: {
    aspect: "457/1481",
    body: producerBody,
    head: producerHead,
    headOrigin: "43.76% 15.6%",
    eyes: [{ src: producerEyeLeft, origin: "34.79% 8.44%" }, { src: producerEyeRight, origin: "48.14% 8.58%" }],
    lean: -1,
  },
} satisfies Record<string, Person>;

/**
 * One of the two people by the footer's board, as a paper puppet: they breathe
 * and shift their weight from their feet, blink now and then (their eyes squash
 * shut), and every few seconds tip their head towards the board and back, as
 * if reading the notes pinned on it. It fills its parent's height.
 */
export function FooterPerson({ person, sizes }: { person: Person; sizes: string }) {
  const ref = usePuppet((q) => {
    const [figure, head, eyes] = [q("figure"), q("head"), q("eye")];
    const sway = gsap.fromTo(figure, { rotation: -0.4 }, { rotation: 0.4, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const breathing = gsap.to(figure, { scaleY: 1.006, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const blinking = gsap
      .timeline({ repeat: -1, repeatRefresh: true, repeatDelay: 2.4, delay: gsap.utils.random(0.6, 2.2) })
      .to(eyes, { scaleY: 0.08, duration: 0.07, ease: "power2.in" })
      .to(eyes, { scaleY: 1, duration: 0.1, ease: "power2.out" })
      .to({}, { duration: () => gsap.utils.random(0.4, 2.8) });
    const looking = gsap
      .timeline({ repeat: -1, repeatDelay: gsap.utils.random(2.5, 3.5), delay: gsap.utils.random(1, 3) })
      .to(head, { rotation: 3 * person.lean, duration: 0.7, ease: "sine.inOut" })
      .to(head, { rotation: 1.5 * person.lean, duration: 0.5, ease: "sine.inOut" }, "+=0.6")
      .to(head, { rotation: 0, duration: 0.7, ease: "sine.inOut" }, "+=0.5");
    return [sway, breathing, blinking, looking];
  });
  return (
    <div ref={ref} className="relative h-full" style={{ aspectRatio: person.aspect }}>
      <div data-part="figure" className="absolute inset-0" style={{ transformOrigin: "50% 100%" }}>
        <Image src={person.body} alt="" fill sizes={sizes} className="pointer-events-none" />
        <div data-part="head" className="absolute inset-0" style={{ transformOrigin: person.headOrigin }}>
          <Image src={person.head} alt="" fill sizes={sizes} className="pointer-events-none" />
          {person.eyes.map(({ src, origin }) => (
            <div key={src.src} data-part="eye" className="absolute inset-0" style={{ transformOrigin: origin }}>
              <Image src={src} alt="" fill sizes={sizes} className="pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
