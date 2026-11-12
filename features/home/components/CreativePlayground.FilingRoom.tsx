"use client";

import { useState } from "react";
import Image from "next/image";
import {
  cabinetDrawerTops,
  cabinetTabs,
  creativePlaygroundCopy,
  INITIAL_CASE,
  playgroundCases,
} from "../constants/creativePlayground.constants";
import { useFilingRoom } from "../animations/CreativePlayground.FilingRoom";
import { CabinetDrawer } from "./CreativePlayground.Drawer";
import { CaseFile } from "./CreativePlayground.CaseFile";
import { NehaPuppet } from "./CreativePlayground.Neha";
import { ProjectControls } from "./CreativePlayground.ProjectControls";
import { PlaygroundStage } from "./CreativePlayground.Stage";
import drawerTanishq from "@/public/images/website/home/creative-playground/drawer-tanishq.png";
import filingRoom from "@/public/images/website/home/creative-playground/filing-room.png";

const playgroundClients = playgroundCases.map(({ client }) => client);

/**
 * The interactive part of the filing room: the room itself (cabinet, case file
 * on the desk, Neha) on its scaling stage, and the client selector below it. Press a drawer (or a client below) and
 * that drawer opens, its file goes on the desk and Neha stamps it APPROVED.
 */
export function FilingRoom() {
  const [active, setActive] = useState(INITIAL_CASE);
  const [stampSignal, setStampSignal] = useState(0);
  const ref = useFilingRoom(active);

  const open = (index: number) => {
    if (index === active) return;
    setActive(index);
    setStampSignal((n) => n + 1);
  };

  return (
    <div ref={ref}>
      {/* the room, scaled as one piece to the screen (see PlaygroundStage) */}
      <div data-cp="room">
        <PlaygroundStage>
          <div className="pointer-events-none absolute top-[339px] left-0 h-[844px] w-[1440px]">
            <Image
              src={filingRoom}
              alt=""
              fill
              sizes="(min-width: 1440px) 1440px, 100vw"
              className="object-cover"
            />
          </div>

          {/* cabinet: the four drawers, top to bottom */}
          <div className="pointer-events-none absolute top-[549px] left-[116px] h-[121px] w-[302px]">
            <Image
              src={drawerTanishq}
              alt=""
              fill
              sizes="302px"
              className="object-cover"
            />
          </div>
          {cabinetDrawerTops.map((top, i) => (
            <CabinetDrawer
              key={top}
              index={i}
              top={top}
              client={playgroundCases[i].client}
              initiallyOpen={i === INITIAL_CASE}
              open={i === active}
              onOpen={open}
            />
          ))}
          {/* the coloured file tabs standing up out of each drawer (only the open one's show; the rest sit inside) */}
          {cabinetDrawerTops.map((top, i) => (
            <div
              key={top}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 h-5 w-[420px] overflow-hidden"
              style={{ top: top - 20 }}
            >
              <div
                data-tabs={i}
                className="absolute inset-0"
                style={{
                  transform: `translateY(${i === INITIAL_CASE ? 0 : 24}px)`,
                }}
              >
                {cabinetTabs.map(({ left, width, color }) => (
                  <span
                    key={left}
                    className="absolute top-0 h-[22px]"
                    style={{ left, width, backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* the case file on the desk, with its tab (it drops onto the desk as the section scrolls in) */}
          <div
            data-cp="file"
            className="pointer-events-none absolute inset-0 *:pointer-events-auto"
          >
            <div className="absolute top-[436px] left-[539px] h-[41px] w-[129px]">
              <span className="absolute top-0 left-0 h-10 w-[129px] rounded-t-lg bg-[#e2be82]" />
              <p className="absolute top-[5px] left-[18px] flex w-[93px] flex-col gap-0.5 text-center font-inter text-xs leading-[normal] font-bold text-[#5b4520] uppercase">
                <span>{creativePlaygroundCopy.caseFileTab}</span>
                <span>
                  {active + 1} of {playgroundCases.length}
                </span>
              </p>
            </div>
            <CaseFile />
          </div>

          {/* Neha, ready with her stamp (blinks, talks, gestures; stamps each new file); she steps in as the section scrolls in */}
          <div data-cp="neha" className="pointer-events-none absolute inset-0">
            <NehaPuppet stampSignal={stampSignal} />
          </div>
        </PlaygroundStage>
      </div>

      {/* client selector: opens the same drawers */}
      <div
        data-cp="controls"
        className="site-container mt-8 flex justify-center md:mt-12 xl:mt-[77px]"
      >
        <ProjectControls
          clients={playgroundClients}
          active={active}
          onSelect={open}
        />
      </div>
    </div>
  );
}
