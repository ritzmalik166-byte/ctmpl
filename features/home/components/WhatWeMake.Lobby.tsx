"use client";

import { useRef, useState } from "react";
import { INITIAL_FLOOR } from "../constants/whatWeMake.constants";
import { BuildingDirectory, SelectedService } from "./WhatWeMake.Directory";
import { Lift } from "./WhatWeMake.Lift";
import { FloorArtworkPreloader } from "./WhatWeMake.Floors";
import { scrollToElement } from "@/lib/scroll/smoothScroll";

/**
 * The lobby: press a floor in the directory and the lift rides to it.
 *  - requested: the floor pressed (its button pulses until the lift arrives)
 *  - scene:     the studio inside the car (swapped while the doors are shut)
 *  - current:   the floor the lift has arrived at (lit button + service card)
 *
 * On phones the lift sits above the directory: pressing a floor brings the lift
 * into view, so the ride is never missed.
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
      <div className="flex w-full max-w-[498px] flex-col gap-5 md:min-w-0 md:flex-1 xl:w-[498px] xl:flex-none xl:gap-[21px]">
        <BuildingDirectory current={current} requested={requested} onSelect={select} />
        {/* phones: the card sits right under the lift, above the directory */}
        <div data-wwm="card" className="max-md:order-first">
          <SelectedService floor={current} />
        </div>
      </div>
      <FloorArtworkPreloader />
      <div ref={liftRef} data-wwm="lift" className="w-full max-w-[360px] shrink-0 max-md:order-first sm:max-w-[400px] md:w-[290px] lg:w-[400px] xl:w-[428px] xl:max-w-none">
        <Lift target={requested} initialFloor={INITIAL_FLOOR} sceneFloor={scene} onSceneChange={setScene} onArrive={setCurrent} />
      </div>
    </>
  );
}
