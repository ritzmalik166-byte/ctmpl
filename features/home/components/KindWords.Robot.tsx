"use client";

import { useRobotIdle, useRobotReaction } from "../animations/KindWords.Robot";
import { Layer } from "./Puppet";
// the robot (robot-updated: cut from "Cardboard robot with a compact fist.png", 1038 × 1515; the old robot files are kept)
import body from "@/public/images/website/home/kind-words/robot-updated/body.webp";
import arm from "@/public/images/website/home/kind-words/robot-updated/arm.webp";
import head from "@/public/images/website/home/kind-words/robot-updated/head.webp";
import eyeLeft from "@/public/images/website/home/kind-words/robot-updated/eye-left.webp";
import eyeRight from "@/public/images/website/home/kind-words/robot-updated/eye-right.webp";

/** Its artwork is 1038 × 1515; it is drawn 192 wide at (937, 322) of the room, its middle hidden behind the desk. */
const sizes = "192px";

/**
 * The cardboard robot behind the desk, a paper puppet cut from its artwork:
 * one hand up at its head, the other a fist at its chest, its eyes on Arjun.
 * Each time `signal` changes (Arjun starts a new testimonial) it listens
 * carefully: it leans in towards him, tips its head his way, nods along now
 * and then and taps its head with its fingers, thinking it over (see
 * useRobotReaction). In between it breathes and blinks.
 */
export function RobotPuppet({ signal, seconds }: { signal: number; seconds: number }) {
  const idleRef = useRobotIdle();
  const reactionRef = useRobotReaction(signal, seconds);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute top-[322px] left-[937px] h-[280px] w-[192px]">
      <div ref={idleRef} className="absolute inset-0">
        <div ref={reactionRef} data-part="robot" className="absolute inset-0" style={{ transformOrigin: "51.59% 92.21%" }}>
          <Layer src={body} sizes={sizes} />
          {/* the head turns at the top of the neck */}
          <div data-part="head" className="absolute inset-0" style={{ transformOrigin: "50.1% 38.28%" }}>
            <Layer src={head} sizes={sizes} />
            <div data-part="eye" className="absolute inset-0" style={{ transformOrigin: "34.68% 23.1%" }}>
              <Layer src={eyeLeft} sizes={sizes} />
            </div>
            <div data-part="eye" className="absolute inset-0" style={{ transformOrigin: "53.95% 19.8%" }}>
              <Layer src={eyeRight} sizes={sizes} />
            </div>
          </div>
          {/* the hand up at its head, from the shoulder */}
          <div data-part="arm" className="absolute inset-0" style={{ transformOrigin: "28.9% 50.17%" }}>
            <Layer src={arm} sizes={sizes} />
          </div>
        </div>
      </div>
    </div>
  );
}
