"use client";

import Image from "next/image";
import { BALL, CAT, usePlaygroundCat } from "../animations/CreativePlayground.Cat";
import { PaperCat } from "./PaperCat";
import paperBall from "@/public/images/website/home/creative-playground/cat/paper-ball.png";
import paperPlane from "@/public/icons/paper-plane-accent.svg";

/**
 * The paper cat who wanders through the filing room once a drawer has been
 * opened (see usePlaygroundCat), with its crumpled paper ball and, later, a
 * paper plane to chase (the paper cat: see PaperCat). Drawn on the room's
 * stage, in front of everything, its paws on the floor.
 */
export function PlaygroundCat({ active }: { active: number }) {
  const ref = usePlaygroundCat(active);
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]">
      {/* the cat (moved along the floor, turned round, posed: see createCatRig) */}
      <PaperCat width={CAT.width} height={CAT.height} />

      {/* the crumpled paper ball: rolled along the floor (data-ball), spinning as it goes (data-spin) */}
      <div data-ball className="absolute top-0 left-0 opacity-0" style={{ width: BALL, height: BALL }}>
        <span className="absolute -bottom-[3px] left-[10%] h-[7px] w-[80%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(60,40,20,0.3),transparent)]" />
        <div data-spin className="absolute inset-0">
          <Image src={paperBall} alt="" fill sizes="40px" className="select-none" />
        </div>
      </div>

      {/* the paper plane it chases (placed by its centre; its nose follows the flight) */}
      <div data-cat-plane className="absolute top-0 left-0 w-[46px] opacity-0">
        <Image src={paperPlane} alt="" unoptimized className="h-auto w-full rotate-[40deg] drop-shadow-[0_3px_3px_rgba(60,40,20,0.25)]" />
      </div>
    </div>
  );
}
