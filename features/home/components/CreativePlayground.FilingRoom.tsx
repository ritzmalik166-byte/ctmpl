"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import { CabinetDrawer, ViewAllDrawer } from "./CreativePlayground.Drawer";
import { CaseFile } from "./CreativePlayground.CaseFile";
import { NehaPuppet } from "./CreativePlayground.Neha";
import ButtonLink from "@/components/ui/ButtonLink";
import { PlaygroundStage } from "./CreativePlayground.Stage";
import { CaseBook } from "./CreativePlayground.CaseBook";
import { DeskChannel } from "./CreativePlayground.DeskChannel";
import { AlmirahHint } from "./CreativePlayground.AlmirahHint";
import { PlaygroundCat } from "./CreativePlayground.Cat";
import drawerTanishq from "@/public/images/website/home/creative-playground/drawer-tanishq.png";
import filingRoom from "@/public/images/website/home/creative-playground/filing-room-empty.png";
import almirah from "@/public/images/website/home/creative-playground/almirah.png";

/**
 * The interactive part of the filing room: the room itself (cabinet, case file
 * on the desk, Neha) on its scaling stage; the almirah's bottom drawer is
 * "View all projects".
 * Every client has a drawer with its logo: the cabinet's four, and the rest
 * sliding along a channel in the desk (see DeskChannel). Press a drawer and it
 * opens, its file goes on the desk and Neha stamps it APPROVED.
 */
/** How long the almirah's hint shows each time (ms), and how long after the almirah comes into view (ms). */
const HINT_FOR = 4000;
const HINT_AFTER = 700;
/** Once a drawer has been opened, the hint isn't shown again this visit (kept for the browser session). */
const HINT_DONE = "ctm-almirah-hint-done";

/**
 * The almirah's hint: as the almirah scrolls into view (a ScrollTrigger on `target`), it shows for 4 s, a
 * moment after the room has made its entrance; again each time the section is scrolled back into, until a
 * drawer is opened. After that it's gone for the rest of the session.
 */
function useAlmirahHint() {
  const [show, setShow] = useState(false);
  const target = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const timers = useRef<number[]>([]);
  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => {
    try {
      done.current = sessionStorage.getItem(HINT_DONE) === "1";
    } catch {}
    const el = target.current;
    if (!el || done.current) return;
    const pop = () => {
      if (done.current || timers.current.length) return;
      timers.current = [
        window.setTimeout(() => !done.current && setShow(true), HINT_AFTER),
        window.setTimeout(() => {
          setShow(false);
          timers.current = [];
        }, HINT_AFTER + HINT_FOR),
      ];
    };
    // the almirah well in view: its middle past 70% of the screen, and still on screen
    const trigger = ScrollTrigger.create({ trigger: el, start: "top 70%", end: "bottom 20%", onEnter: pop, onEnterBack: pop });
    return () => {
      trigger.kill();
      clear();
    };
  }, []);
  const dismiss = () => {
    done.current = true;
    clear();
    setShow(false);
    try {
      sessionStorage.setItem(HINT_DONE, "1");
    } catch {}
  };
  return { show, target, dismiss };
}

export function FilingRoom() {
  const [active, setActive] = useState(INITIAL_CASE);
  const [stampSignal, setStampSignal] = useState(0);
  const ref = useFilingRoom(active);
  const { show: hintShown, target: almirahRef, dismiss: dismissHint } = useAlmirahHint();

  const open = (index: number) => {
    // a drawer has been opened: the hint has done its job
    dismissHint();
    if (index === active) return;
    setActive(index);
    setStampSignal((n) => n + 1);
  };

  return (
    <div ref={ref}>
      {/* phones: no room, just the case file to flip through, and the clients' drawers under it */}
      <div className="site-container md:hidden">
        <CaseBook active={active} onSelect={open} />
        <div className="mt-12 mb-2">
          <DeskChannel variant="strip" active={active} onOpen={open} />
        </div>
      </div>

      {/* md up: the room, scaled as one piece to the screen (see PlaygroundStage) */}
      <div data-cp="room" className="max-md:hidden">
        <PlaygroundStage>
          {/* (its top edge fades into the section's wall above, so there's no line between them) */}
          <div className="pointer-events-none absolute top-[339px] left-0 h-[844px] w-[1440px] [mask-image:linear-gradient(to_bottom,transparent,black_90px)]">
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
          <div className="pointer-events-none absolute inset-0 origin-[288px_1095px] scale-[0.92] [&_a]:pointer-events-auto [&_button]:pointer-events-auto">
          <div ref={almirahRef} className="absolute top-[347.09px] left-[78.82px] h-[761.12px] w-[418.36px]">
            <Image src={almirah} alt="" fill sizes="29.1vw" className="object-fill" />
          </div>

          {/* cabinet: three clients' drawers, top to bottom, and at the bottom "View all projects" */}
          <div className="pointer-events-none absolute top-[549px] left-[116px] h-[121px] w-[302px]">
            <Image
              src={drawerTanishq}
              alt=""
              fill
              sizes="21vw"
              className="object-cover"
            />
          </div>
          {cabinetDrawerTops.slice(0, CABINET_CASES.length).map((top, i) => (
            <CabinetDrawer
              key={top}
              index={i}
              top={top}
              client={playgroundCases[CABINET_CASES[i]].client}
              logo={playgroundCases[CABINET_CASES[i]].logo}
              initiallyOpen={i === INITIAL_CASE}
              open={i === active}
              onOpen={open}
            />
          ))}
          <ViewAllDrawer top={cabinetDrawerTops[CABINET_CASES.length]} href={creativePlaygroundCopy.projectsHref} label={creativePlaygroundCopy.viewAll} />
          {/* the hint over the drawers, as the almirah comes into view: "Click a drawer to open its case file" */}
          <AlmirahHint show={hintShown} text={creativePlaygroundCopy.almirahHint} />
          {/* the coloured file tabs standing up out of each drawer (only the open one's show; the rest sit inside) */}
          {cabinetDrawerTops.slice(0, CABINET_CASES.length).map((top, i) => (
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

          {/* the desk's drawers, sliding along a channel: press one and it slides out, and its file goes on the desk */}
          <DeskChannel active={active} onOpen={open} />

          {/* the case file on the desk, with its tab (it drops onto the desk as the section scrolls in) */}
          <div data-cp="file" className="pointer-events-none absolute inset-0">
            {/* drawn at 92%, shrunk toward the middle of its lower edge (where it rests) */}
            <div className="absolute inset-0 origin-[848px_887px] scale-[0.92] *:pointer-events-auto">
            <div className="absolute top-[436px] left-[539px] h-[41px] w-[129px]">
              <span className="absolute top-0 left-0 h-10 w-[129px] rounded-t-lg bg-[#e2be82]" />
              <p className="absolute top-[12px] left-[18px] w-[93px] text-center font-inter text-xs leading-[normal] font-bold text-[#5b4520] uppercase">
                {creativePlaygroundCopy.caseFileTab}
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

      {/* all the work (phones; from md it's the almirah's bottom drawer) */}
      <div data-cp="controls" className="site-container mt-8 flex justify-center md:hidden">
        <ButtonLink href={creativePlaygroundCopy.projectsHref} variant="folded">
          {/* the button capitalises words; this label stays in sentence case */}
          <span className="normal-case">{creativePlaygroundCopy.viewAll}</span>
        </ButtonLink>
      </div>
    </div>
  );
}
