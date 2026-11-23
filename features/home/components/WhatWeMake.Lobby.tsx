"use client";

import { useRef, useState } from "react";
import { INITIAL_FLOOR } from "../constants/whatWeMake.constants";
import { BuildingDirectory, FloorDetails, FloorSelect } from "./WhatWeMake.Directory";
import { Lift } from "./WhatWeMake.Lift";
import { FloorArtworkPreloader } from "./WhatWeMake.Floors";
import { scrollToElement } from "@/lib/scroll/smoothScroll";

/**
 * The lobby: press a floor in the directory (or "Next floor") and the lift rides to it.
 *  - requested: the floor pressed (its button pulses until the lift arrives)
 *  - scene:     the studio inside the car (swapped while the doors are shut)
 *  - current:   the floor the lift has arrived at (its row is lit, its details shown)
 *
 * Laid out in the section's panel, which (below xl) is whatever height is left
 * of one screen under the heading:
 *  - xl: the Figma desktop frame, to its coordinates (1440 wide): the directory
 *    on the left, the floor's details in the middle, the lift on the right;
 *  - lg: the same three side by side, scaled to the screen's height;
 *  - md: the directory and the details stacked on the left, the lift beside them;
 *  - phones: the floors as a dropdown on top, the lift in the middle (taking the
 *    height that's left), the floor's details under it.
 * Below xl the lift fits its box (as tall as the panel allows, never wider than
 * its column). Picking a floor brings the lift into view if it isn't, so the
 * ride is never missed.
 */
export function WhatWeMakeLobby() {
  const [requested, setRequested] = useState(INITIAL_FLOOR);
  const [scene, setScene] = useState(INITIAL_FLOOR);
  const [current, setCurrent] = useState(INITIAL_FLOOR);
  const liftRef = useRef<HTMLDivElement>(null);

  const select = (floor: number) => {
    setRequested(floor);
    const lift = liftRef.current;
    if (!lift) return;
    const { top, bottom } = lift.getBoundingClientRect();
    if (top < 0 || bottom > window.innerHeight) {
      scrollToElement(lift, { block: "center" }); // through the smooth scroller
    }
  };

  return (
    <>
      {/* phones: the floors as a dropdown, above the lift */}
      <FloorSelect requested={requested} onSelect={select} className="shrink-0 max-md:order-1 md:hidden" />
      {/* md: the directory over the details; from lg each is a column of its own */}
      <div className="flex min-w-0 shrink-0 flex-col max-md:order-3 md:min-h-0 md:flex-1 md:justify-center md:gap-[clamp(1rem,3svh,2rem)] lg:contents">
        <BuildingDirectory
          current={current}
          requested={requested}
          onSelect={select}
          className="max-md:hidden md:min-h-0 md:shrink lg:w-[clamp(290px,36%,400px)] lg:flex-none lg:shrink-0 xl:absolute xl:top-[402px] xl:left-[101px] xl:w-[440px]"
        />
        <div data-wwm="card" className="lg:min-w-0 lg:flex-1 lg:self-center xl:absolute xl:top-[472px] xl:left-[601px] xl:w-[325px]">
          <FloorDetails floor={current} onSelect={select} />
        </div>
      </div>
      <FloorArtworkPreloader />
      {/* below xl a box the lift fits in (a size container: see Lift) */}
      <div
        ref={liftRef}
        data-wwm="lift"
        className="flex w-full items-start justify-center drop-shadow-[0_22px_24px_rgba(60,45,30,0.22)] max-md:order-2 max-md:min-h-[150px] max-md:flex-1 max-xl:[container-type:size] md:h-full md:w-[45%] md:shrink-0 md:items-center md:justify-end lg:w-[30%] xl:absolute xl:top-[395px] xl:left-[955px] xl:block xl:h-auto xl:w-[368px]"
      >
        <Lift target={requested} initialFloor={INITIAL_FLOOR} sceneFloor={scene} onSceneChange={setScene} onArrive={setCurrent} />
      </div>
    </>
  );
}
