"use client";

import { useRobotIdle, useRobotReaction } from "../animations/KindWords.Robot";
import { Layer } from "./Puppet";
import body from "@/public/images/website/home/kind-words/robot/body.png";
import arms from "@/public/images/website/home/kind-words/robot/arms.png";
import head from "@/public/images/website/home/kind-words/robot/head.png";
import pupils from "@/public/images/website/home/kind-words/robot/pupils.png";

/** The robot's artwork is 187 × 386; it is drawn 119 × 244 at (967, 329) of the room (Figma 175:1062). */
const sizes = "119px";

/**
 * The cardboard robot behind the notice board, as a paper puppet cut from its
 * Figma artwork: body, folded arms (they move as one), head (turns at the neck)
 * and pupils, plus a mouth that opens over the drawn one. Each time
 * `signal` changes (Arjun starts a new testimonial) the robot reacts, turn
 * about: it turns to look at Arjun, then for the next one it looks straight out
 * and mutters to itself, gesturing with its arms (see useRobotReaction). In
 * between it breathes and blinks.
 */
export function RobotPuppet({ signal, seconds }: { signal: number; seconds: number }) {
  const idleRef = useRobotIdle();
  const reactionRef = useRobotReaction(signal, seconds);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute top-[329px] left-[967px] h-[244px] w-[119px]">
      <div ref={idleRef} className="absolute inset-0">
        <div ref={reactionRef} data-part="robot" className="absolute inset-0" style={{ transformOrigin: "49.7% 98.4%" }}>
          <Layer src={body} sizes={sizes} />
          {/* the head turns at the top of the neck */}
          <div data-part="head" className="absolute inset-0" style={{ transformOrigin: "48.1% 31.6%" }}>
            <Layer src={head} sizes={sizes} />
            <div data-part="pupils" className="absolute inset-0" style={{ transformOrigin: "50% 16.19%" }}>
              <Layer src={pupils} sizes={sizes} />
            </div>
            {/* the mouth opening over the drawn line (shut until it talks) */}
            <span
              data-part="mouth"
              className="absolute rounded-[50%] bg-[#5a3a1e]"
              style={{ left: "40.4%", top: "24.3%", width: "15.5%", height: "2.1%", transform: "scaleY(0)" }}
            />
          </div>
          {/* the folded arms, turning about where they cross */}
          <div data-part="arms" className="absolute inset-0" style={{ transformOrigin: "48.1% 59%" }}>
            <Layer src={arms} sizes={sizes} />
          </div>
        </div>
      </div>
    </div>
  );
}
