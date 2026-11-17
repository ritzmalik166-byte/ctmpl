"use client";

import { useState } from "react";
import Image from "next/image";
import {
  cabinetDrawerTops,
  cabinetTabs,
  CABINET_CASES,
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
import { CaseBook } from "./CreativePlayground.CaseBook";
import { DeskDrawers } from "./CreativePlayground.DeskDrawers";
import { PlaygroundCat } from "./CreativePlayground.Cat";
import { scrollToElement } from "@/lib/scroll/smoothScroll";
import drawerTanishq from "@/public/images/website/home/creative-playground/drawer-tanishq.png";
import filingRoom from "@/public/images/website/home/creative-playground/filing-room-empty.png";
import almirah from "@/public/images/website/home/creative-playground/almirah.png";

const playgroundClients = playgroundCases.map(({ client }) => client);

/**
 * The interactive part of the filing room: the room itself (cabinet, case file
 * on the desk, Neha) on its scaling stage, and the client selector below it. Press a drawer (the cabinet's,
 * or one of the desk's three) or a client below and that drawer opens, its file goes on the desk and Neha stamps it APPROVED.
 * Picking from the selector while the case file is off screen first glides the
 * page back up to it, so the change is seen.
 */

/** Room kept clear at the top for the site header when checking that the file shows (px). */
const HEADER_SPACE = 90;
/** After the page starts gliding up to the file, how long before the drawers move (ms). */
const CHANGE_DELAY = 450;
export function FilingRoom() {
  const [active, setActive] = useState(INITIAL_CASE);
  const [stampSignal, setStampSignal] = useState(0);
  const ref = useFilingRoom(active);

  const open = (index: number) => {
    if (index === active) return;
    setActive(index);
    setStampSignal((n) => n + 1);
  };

  // from the client selector: bring the case file into view first if it isn't, then change it
  const pick = (index: number) => {
    if (index === active) return;
    // the file on show: the one on the desk (md up) or the flip-through file (phones)
    const file = [...(ref.current?.querySelectorAll<HTMLElement>('[data-file="folder"], [data-case-book]') ?? [])].find((el) => el.getBoundingClientRect().width > 0);
    const box = file?.getBoundingClientRect();
    if (!file || !box || (box.top >= HEADER_SPACE && box.bottom <= window.innerHeight)) return open(index);
    scrollToElement(file, { block: "center" });
    window.setTimeout(() => open(index), CHANGE_DELAY);
  };

  return (
    <div ref={ref}>
      {/* phones: no room, just the case file to flip through (same selection as everywhere) */}
      <div className="site-container md:hidden">
        <CaseBook active={active} onSelect={open} />
      </div>

      {/* md up: the room, scaled as one piece to the screen (see PlaygroundStage) */}
      <div data-cp="room" className="max-md:hidden">
        <PlaygroundStage>
          <div className="pointer-events-none absolute top-[339px] left-0 h-[844px] w-[1440px]">
            <Image
              src={filingRoom}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* the almirah (cut from the room picture with its trophies, plant and certificates), its
              drawers and file tabs: drawn at 92%, shrunk toward its foot so it still stands on the floor */}
          <div className="pointer-events-none absolute inset-0 origin-[288px_1095px] scale-[0.92] [&_button]:pointer-events-auto">
          <div className="absolute top-[347.09px] left-[78.82px] h-[761.12px] w-[418.36px]">
            <Image src={almirah} alt="" fill sizes="29.1vw" className="object-fill" />
          </div>

          {/* cabinet: the four drawers, top to bottom */}
          <div className="pointer-events-none absolute top-[549px] left-[116px] h-[121px] w-[302px]">
            <Image
              src={drawerTanishq}
              alt=""
              fill
              sizes="21vw"
              className="object-cover"
            />
          </div>
          {cabinetDrawerTops.map((top, i) => (
            <CabinetDrawer
              key={top}
              index={i}
              top={top}
              client={playgroundCases[CABINET_CASES[i]].client}
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
              className="pointer-events-none absolute left-0 z-[3] h-5 w-[420px] overflow-hidden"
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
          </div>

          {/* the desk's three drawers: press one and it slides out, and its file goes on the desk */}
          <DeskDrawers active={active} onOpen={open} />

          {/* the case file on the desk, with its tab (it drops onto the desk as the section scrolls in) */}
          <div data-cp="file" className="pointer-events-none absolute inset-0">
            {/* drawn at 92%, shrunk toward the middle of its lower edge (where it rests) */}
            <div className="absolute inset-0 origin-[848px_887px] scale-[0.92] *:pointer-events-auto">
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
          </div>

          {/* Neha, ready with her stamp (blinks, talks, gestures; stamps each new file); she steps in as the section scrolls in */}
          <div data-cp="neha" className="pointer-events-none absolute inset-0">
            {/* drawn at 92%, shrunk toward her feet */}
            <div className="absolute inset-0 origin-[1266px_1120px] scale-[0.92]">
              <NehaPuppet stampSignal={stampSignal} />
            </div>
          </div>

          {/* the paper cat, who comes through with its ball (and later a paper plane) once a drawer is opened */}
          <PlaygroundCat active={active} />
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
          onSelect={pick}
          crumple
        />
      </div>
    </div>
  );
}
