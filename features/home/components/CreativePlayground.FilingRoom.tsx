"use client";

import { useState } from "react";
import Image from "next/image";
import {
  cabinetDrawerTops,
  cabinetTabs,
  caseFilePhoto,
  caseFileStamp,
  creativePlaygroundCopy,
  INITIAL_CASE,
  playgroundCases,
} from "../constants/creativePlayground.constants";
import { useFilingRoom } from "../animations/CreativePlayground.FilingRoom";
import { CabinetDrawer } from "./CreativePlayground.Drawer";
import { NehaPuppet } from "./CreativePlayground.Neha";
import { ProjectControls } from "./CreativePlayground.ProjectControls";
import drawerTanishq from "@/public/images/website/home/creative-playground/drawer-tanishq.png";
import caseFolder from "@/public/images/website/home/creative-playground/case-file/folder.png";
import paperclip from "@/public/images/website/home/creative-playground/case-file/paperclip.png";
import stampApproved from "@/public/images/website/home/creative-playground/case-file/stamp-approved.png";

/** px of the 670 × 413 case-file artwork → % of it. */
const fileX = (px: number) => `${(px / 670) * 100}%`;
const fileY = (px: number) => `${(px / 413) * 100}%`;

/**
 * The interactive part of the filing room: the cabinet, the case file on the
 * desk, Neha and the client selector. Press a drawer (or a client below) and
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
    <div ref={ref} className="absolute inset-0">
      {/* cabinet: the four drawers, top to bottom */}
      <div className="pointer-events-none absolute top-[549px] left-[116px] h-[121px] w-[302px]">
        <Image src={drawerTanishq} alt="" fill sizes="302px" className="object-cover" />
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
        <div key={top} aria-hidden="true" className="pointer-events-none absolute left-0 h-5 w-[420px] overflow-hidden" style={{ top: top - 20 }}>
          <div data-tabs={i} className="absolute inset-0" style={{ transform: `translateY(${i === INITIAL_CASE ? 0 : 24}px)` }}>
            {cabinetTabs.map(({ left, width, color }) => (
              <span key={left} className="absolute top-0 h-[22px]" style={{ left, width, backgroundColor: color }} />
            ))}
          </div>
        </div>
      ))}

      {/* the case file on the desk, with its tab */}
      <div className="absolute top-[436px] left-[539px] h-[41px] w-[129px]">
        <span className="absolute top-0 left-0 h-10 w-[129px] rounded-t-lg bg-[#e2be82]" />
        <p className="absolute top-[5px] left-[18px] flex w-[93px] flex-col gap-0.5 text-center font-inter text-xs leading-[normal] font-bold text-[#5b4520] uppercase">
          <span>{creativePlaygroundCopy.caseFileTab}</span>
          <span>
            {active + 1} of {playgroundCases.length}
          </span>
        </p>
      </div>
      <div data-file="folder" className="absolute top-[474px] left-[513px] h-[413px] w-[670px]">
        <Image src={caseFolder} alt="" fill sizes="670px" className="pointer-events-none" />
        {/* the photo: every client's cover sits in the polaroid; the open case's shows */}
        <div
          className="absolute overflow-hidden"
          style={{ left: fileX(caseFilePhoto.left), top: fileY(caseFilePhoto.top), width: fileX(caseFilePhoto.width), height: fileY(caseFilePhoto.height), rotate: `${caseFilePhoto.rotate}deg` }}
        >
          {playgroundCases.map(({ client, cover }, i) => (
            <div key={client} data-cover={i} className="absolute inset-0" style={{ opacity: i === INITIAL_CASE ? 1 : 0 }}>
              <Image src={cover} alt={`${client} campaign artwork`} fill sizes="270px" className="pointer-events-none object-cover" />
            </div>
          ))}
        </div>
        <Image src={paperclip} alt="" fill sizes="670px" className="pointer-events-none" />
        {/* APPROVED, stamped on each new file */}
        <div
          data-file="stamp"
          className="absolute"
          style={{ left: fileX(caseFileStamp.left), top: fileY(caseFileStamp.top), width: fileX(caseFileStamp.width), height: fileY(caseFileStamp.height) }}
        >
          <Image src={stampApproved} alt="Approved" fill sizes="214px" className="pointer-events-none" />
        </div>
      </div>

      {/* Neha, ready with her stamp (blinks, talks, gestures; stamps each new file) */}
      <NehaPuppet stampSignal={stampSignal} />

      {/* client selector: opens the same drawers */}
      <div className="absolute top-[1260px] left-1/2 -translate-x-1/2">
        <ProjectControls active={active} onSelect={open} />
      </div>
    </div>
  );
}
