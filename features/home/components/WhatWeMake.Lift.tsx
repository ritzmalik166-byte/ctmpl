"use client";

import Image from "next/image";
import { floorByNumber, LIFT } from "../constants/whatWeMake.constants";
import { useLiftRide } from "../animations/WhatWeMake.Lift";
import { FloorScene } from "./WhatWeMake.Floors";
import liftShell from "@/public/images/website/home/what-we-make/lift/lift-shell.png";

/** % of the lift artwork (564 × 815). */
const pctX = (px: number) => `${(px / LIFT.width) * 100}%`;
const pctY = (px: number) => `${(px / LIFT.height) * 100}%`;
/** cqw of the lift (1cqw = 1% of its width). */
const cqw = (px: number) => `${(px / LIFT.width) * 100}cqw`;

/** One sliding door: brass panel with an inset frame and kick plate, paper-flat like the rest of the art. */
function Door({ side }: { side: "left" | "right" }) {
  return (
    <div
      data-lift={`door-${side}`}
      className={`absolute inset-y-0 w-1/2 bg-linear-to-r from-[#a7844a] via-[#c4a062] to-[#b18c4f] ${side === "left" ? "left-0" : "right-0"}`}
    >
      <span className="absolute inset-x-[10%] top-[5%] bottom-[22%] rounded-[0.4cqw] border-[0.35cqw] border-[#8f6f3b]/60 bg-[#b9955a]" />
      <span className="absolute inset-x-[10%] top-[82%] bottom-[5%] rounded-[0.4cqw] border-[0.35cqw] border-[#8f6f3b]/60 bg-[#a98649]" />
      {/* the meeting edge, darker where the two doors touch */}
      <span className={`absolute inset-y-0 w-[3%] bg-[#6e5530]/50 ${side === "left" ? "right-0" : "left-0"}`} />
    </div>
  );
}

type LiftProps = {
  /** Floor the visitor picked; the lift rides there. */
  target: number;
  initialFloor: number;
  /** Floor whose scene is inside the car (swapped while the doors are shut). */
  sceneFloor: number;
  onSceneChange: (floor: number) => void;
  onArrive: (floor: number) => void;
};

/**
 * The lift: car (floor scene + sliding doors) behind the lift artwork, with
 * the dial needle, floor lights and "FLOOR n" label drawn on top. It fills its
 * parent's width (428 × 619 on desktop) and scales as one piece.
 */
export function Lift({ target, initialFloor, sceneFloor, onSceneChange, onArrive }: LiftProps) {
  const ref = useLiftRide(target, initialFloor, { onSceneChange, onArrive });
  const { car, dial, label } = LIFT;

  return (
    <div ref={ref} className="@container relative aspect-[428/619] w-full overflow-clip" aria-live="polite">
      <div data-lift="cabin" className="absolute inset-0">
        {/* car: the floor's studio, and the doors in front of it */}
        <div className="absolute" style={{ left: pctX(car.x), top: pctY(car.y), width: pctX(car.width), height: pctY(car.height) }}>
          <div key={sceneFloor} data-lift="scene" className="absolute inset-0 overflow-hidden">
            <FloorScene floor={sceneFloor} />
          </div>
          <Door side="left" />
          <Door side="right" />
        </div>

        {/* lift artwork (the car opening is transparent; doors slide in behind it) */}
        <Image src={liftShell} alt="" fill sizes="(min-width: 1280px) 428px, (min-width: 1024px) 400px, (min-width: 768px) 290px, 400px" priority={false} className="pointer-events-none" />

        {/* floor lights round the dial: the current floor glows */}
        {Array.from({ length: 8 }, (_, i) => {
          const n = i + 1;
          const a = (LIFT.floorAngle(n) * Math.PI) / 180;
          return (
            <span
              key={n}
              data-lift-dot={n}
              data-current={n === initialFloor || undefined}
              className="absolute size-[1.15cqw] -translate-1/2 rounded-full bg-[#f6cd76] transition-[background-color,box-shadow] duration-300 data-current:bg-[#fff2b8] data-current:shadow-[0_0_1.4cqw_0.35cqw_rgba(255,214,120,0.85)]"
              style={{ left: pctX(dial.cx + dial.dotRadius * Math.cos(a)), top: pctY(dial.cy - dial.dotRadius * Math.sin(a)) }}
            />
          );
        })}
        {/* the needle, pinned at the dial centre */}
        <span
          data-lift="needle"
          className="absolute rounded-full bg-linear-to-r from-[#e7c262] to-[#fdd47e] shadow-[0_0.2cqw_0.4cqw_rgba(0,0,0,0.35)]"
          style={{
            left: pctX(dial.cx),
            top: pctY(dial.cy),
            width: cqw(dial.needleLength),
            height: cqw(8),
            marginTop: cqw(-4),
            transformOrigin: "0% 50%",
            transform: `rotate(${-LIFT.floorAngle(initialFloor)}deg)`,
          }}
        />
        {/* FLOOR n */}
        <span
          data-lift="label"
          className="absolute -translate-1/2 font-inter leading-none font-bold tracking-[0.14em] whitespace-nowrap text-[#e7cd63]"
          style={{ left: pctX(label.cx), top: pctY(label.cy), fontSize: cqw(label.fontSize) }}
        >
          FLOOR {initialFloor}
        </span>
      </div>
      <span className="sr-only">
        Lift at floor {sceneFloor}: {floorByNumber(sceneFloor).name}
      </span>
    </div>
  );
}
