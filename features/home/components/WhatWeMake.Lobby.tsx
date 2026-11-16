"use client";

import { useRef, useState } from "react";
import { INITIAL_FLOOR } from "../constants/whatWeMake.constants";
import { BuildingDirectory, FloorSelect, SelectedService } from "./WhatWeMake.Directory";
import { Lift } from "./WhatWeMake.Lift";
import { FloorArtworkPreloader } from "./WhatWeMake.Floors";
import { scrollToElement } from "@/lib/scroll/smoothScroll";

/**
 * The lobby: press a floor in the directory and the lift rides to it.
 *  - requested: the floor pressed (its button pulses until the lift arrives)
 *  - scene:     the studio inside the car (swapped while the doors are shut)
 *  - current:   the floor the lift has arrived at (lit button + service card)
 *
 * Phones: a dropdown of the floors on top, the lift (at most about half the
 * screen's height, so all three fit on one screen), then the floor's card. Picking a floor brings the
 * lift into view if it isn't, so the ride is never missed.
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
      <div className="flex w-full max-w-[498px] shrink-0 flex-col gap-5 max-md:order-3 md:min-w-0 md:flex-1 md:shrink xl:w-[498px] xl:flex-none xl:gap-[21px]">
        <div className="max-md:hidden">
          <BuildingDirectory current={current} requested={requested} onSelect={select} />
        </div>
        {/* phones: the card sits under the lift */}
        <div data-wwm="card">
          <SelectedService floor={current} />
        </div>
      </div>
      <FloorArtworkPreloader />
      {/* phones: the lift is about half the screen tall (less on short phones), so the dropdown and card always fit round it */}
      <div
        ref={liftRef}
        data-wwm="lift"
        className="w-full max-w-[360px] shrink-0 max-md:order-2 max-md:flex max-md:max-w-none max-md:justify-center sm:max-w-[400px] md:w-[290px] lg:w-[400px] xl:w-[428px] xl:max-w-none"
      >
        <Lift target={requested} initialFloor={INITIAL_FLOOR} sceneFloor={scene} onSceneChange={setScene} onArrive={setCurrent} />
      </div>
    </>
  );
}
