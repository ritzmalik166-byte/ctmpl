"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils/cn";
import { boardLayout, boardMagnets, boardStats, whoWeAreCopy } from "../constants/whoWeAre.constants";
import { useMarkerCircles } from "../animations/WhoWeAre.Markers";
import { CheeringMan, PresentingMeera } from "./WhoWeAre.Characters";
import whiteboardRoom from "@/public/images/website/home/who-we-are/whiteboard-room.png";
import whiteboardBoard from "@/public/images/website/home/who-we-are/whiteboard-board.png";
import roomWallTile from "@/public/images/website/home/who-we-are/room-wall-tile.png";
import roomFloorCorner from "@/public/images/website/home/who-we-are/room-floor-corner.png";

/* -------------------------------------------------------------------------- */
/*  Shared pieces — sized in `em`, so each layout just sets a font-size        */
/* -------------------------------------------------------------------------- */

type ActiveStat = { active: number; onActivate: (index: number) => void };

/**
 * Row of round fridge-style magnets. 1em = magnet label size (17px in Figma).
 * The magnet matching the active stat "lights up": a glow in its colour flickers
 * on like a lamp, and the magnet lifts off the board with a brighter face.
 * Hovering or tapping a magnet activates its stat too.
 */
function Magnets({ active, onActivate, className, style }: ActiveStat & { className?: string; style?: CSSProperties }) {
  return (
    <ul className={cn("flex gap-[1em]", className)} style={style}>
      {boardMagnets.map((magnet, i) => {
        const lit = active === i;
        return (
          <li key={magnet.label} className="relative h-[3.353em] w-[3.294em]">
            <button
              type="button"
              aria-pressed={lit}
              aria-label={`Show ${magnet.label}`}
              data-lit={lit || undefined}
              onPointerEnter={() => onActivate(i)}
              onFocus={() => onActivate(i)}
              onClick={() => onActivate(i)}
              className="group absolute inset-0 cursor-pointer rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marker-navy"
            >
              {/* the light: a soft halo in the magnet's colour, flickering on */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[-45%] scale-75 rounded-full opacity-0 blur-[0.35em] transition-[opacity,scale] duration-500 group-data-lit:scale-100 group-data-lit:opacity-80 group-data-lit:animate-[magnet-light-on_0.5s_ease-out_forwards] motion-reduce:animate-none motion-reduce:transition-none"
                style={{ background: `radial-gradient(circle, ${magnet.glow} 0%, transparent 68%)` }}
              />
              <Image src={magnet.shadow} alt="" unoptimized className="absolute top-[3.509%] left-[-3.571%] h-[107.018%] w-[112.5%] max-w-none transition-[translate,opacity] duration-300 group-data-lit:translate-y-[0.12em] group-data-lit:opacity-80" />
              {/* face + label lift a little off the board when lit */}
              <span className="absolute inset-0 transition-[translate,filter] duration-300 group-data-lit:-translate-y-[0.14em] group-data-lit:brightness-115 motion-reduce:transition-none">
                <Image src={magnet.face} alt="" unoptimized className="absolute top-0 left-0 h-[91.228%] w-[98.214%] max-w-none" />
                {/* glossy highlight, like light catching the magnet */}
                <span
                  aria-hidden="true"
                  className="absolute top-[10%] left-[18%] h-[26%] w-[42%] -rotate-20 rounded-full bg-white opacity-0 blur-[0.08em] transition-opacity duration-300 group-data-lit:opacity-35"
                />
                <span className="absolute top-[29.825%] left-0 w-[98.214%] text-center leading-[normal] font-bold text-white">
                  {magnet.label}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function BoardTitle({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <p className={cn("leading-[1.1] font-bold whitespace-nowrap", className)} style={style}>
      <span className="text-marker-navy">{whoWeAreCopy.boardTitle.lead}</span>
      <span className="text-marker-red">{whoWeAreCopy.boardTitle.accent}</span>
    </p>
  );
}

/**
 * Centre line of the hand-drawn circle from Figma (its 350×145 artwork is an
 * outlined shape): the pen's start flick, then the loop. As a stroke it can be
 * "drawn" with a dash offset.
 */
const MARKER_CIRCLE_PATH =
  "M93.75 22.77C62 30.9 36.8 42.5 20.4 57.22C11.59 65.33 5.43 74.4 2.32 84.34C-11.45 128.75 37.71 144.9 106.53 144.9C200.9 146.92 316.91 117.65 343.45 74.25C370.98 29.84 308.06 2.59 222.53 0.57C133.99 -3.38 28.49 12.98 20.4 57.22";

/** The stat circled on first render (2008, as in Figma). */
const INITIAL_ACTIVE_STAT = 0;

/**
 * Marker circle around a stat, in the stat's colour. Its inline style is only
 * the *initial* state and never changes; afterwards GSAP alone draws and
 * wipes it (a style that followed `active` would make React fight the animation).
 */
function MarkerCircle({ index }: { index: number }) {
  const shown = index === INITIAL_ACTIVE_STAT;
  return (
    <svg
      data-marker-index={index}
      aria-hidden="true"
      viewBox="0 0 350 145"
      fill="none"
      className="pointer-events-none absolute top-[-0.3125em] left-[-0.969em] h-[2.266em] w-[5.469em] overflow-visible"
    >
      <path
        d={MARKER_CIRCLE_PATH}
        pathLength={1}
        stroke="currentColor"
        strokeWidth={5.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        // hidden circles are also transparent, or the round cap shows as a stray dot
        style={{ strokeDasharray: 1, strokeDashoffset: shown ? 0 : 1, opacity: shown ? 1 : 0 }}
      />
    </svg>
  );
}

type StatProps = {
  stat: (typeof boardStats)[number];
  index: number;
  active: boolean;
  onActivate: (index: number) => void;
  className?: string;
  style?: CSSProperties;
};

/**
 * One handwritten statistic. 1em = the value's size (64px in Figma).
 * Hover, focus or tap it and a marker circle is drawn round it.
 * Pass `relative` or `absolute` in className to place it.
 */
function Stat({ stat, index, active, onActivate, className, style }: StatProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onPointerEnter={() => onActivate(index)}
      onFocus={() => onActivate(index)}
      onClick={() => onActivate(index)}
      className={cn(
        // flex-col + justify-start: buttons centre content vertically by default
        "flex h-[1.6875em] w-[3em] cursor-pointer flex-col justify-start text-left font-bold whitespace-nowrap outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-marker-navy",
        stat.color,
        className
      )}
      style={style}
    >
      <MarkerCircle index={index} />
      <span className="relative top-[-0.125em] block leading-[1.05]">{stat.value}</span>
      {/* caption: 26px, 66px below the stat's top (2.538 of its own em) */}
      <span className="absolute top-[2.538em] left-0 text-[0.406em] leading-[1.1] text-marker-black">{stat.caption}</span>
    </button>
  );
}

/** Zig-zag placement on phones, echoing the two columns of the desktop board. */
const listStatAlign = ["self-start ml-4", "self-end mr-6", "self-start ml-10", "self-end mr-2"];

/** Which stat is active on a board: shared by its stats (marker circle) and magnets (light). */
function useActiveStat(): ActiveStat {
  const [active, setActive] = useState(INITIAL_ACTIVE_STAT);
  return { active, onActivate: setActive };
}

/**
 * The four stats, the active one circled in marker (2008 to begin with, as in Figma).
 *  - "board": positioned on the whiteboard artwork (tablet & desktop)
 *  - "list":  a zig-zag column inside the phone board
 */
function BoardStats({ layout, active, onActivate }: ActiveStat & { layout: "board" | "list" }) {
  const ref = useMarkerCircles(active);
  const onBoard = layout === "board";

  return (
    // on the board this layer covers the whole scene: let pointers through to the magnets
    <div ref={ref} className={onBoard ? "pointer-events-none absolute inset-0" : "mt-6 flex flex-col gap-9"}>
      {boardStats.map((stat, i) => (
        <Stat
          key={stat.value}
          stat={stat}
          index={i}
          active={active === i}
          onActivate={onActivate}
          className={onBoard ? "pointer-events-auto absolute text-[4.444cqw]" : cn("relative text-[44px]", listStatAlign[i])}
          style={onBoard ? stat.position : undefined}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tablet & desktop: text locked onto the whiteboard artwork                  */
/* -------------------------------------------------------------------------- */

/**
 * The illustrated room with everything written on its board. All positions
 * are % of the 1440×732 scene and sizes are in cqw, so the writing scales with
 * the art. Tablet (md) frames the board and the two characters (scene
 * x 100–1300); desktop (lg) shows the full room.
 */
export function WhiteboardScene() {
  const activeStat = useActiveStat();
  return (
    <div className="relative hidden aspect-[1200/732] w-full md:block lg:aspect-[1440/732]">
      <div className="@container absolute inset-y-0 left-[-8.333%] w-[120%] font-caveat lg:left-0 lg:w-full">
        <Image src={whiteboardRoom} alt="" fill sizes="(min-width: 1024px) 100vw, 120vw" className="object-cover" />

        <Magnets {...activeStat} className="absolute text-[1.181cqw]" style={boardLayout.magnets} />
        <BoardTitle className="absolute text-[2.639cqw]" style={boardLayout.title} />
        <BoardStats {...activeStat} layout="board" />
        <p className="absolute text-[1.667cqw] leading-[1.2] font-bold whitespace-nowrap text-marker-navy" style={boardLayout.story}>
          {whoWeAreCopy.story}
        </p>

        {/* Meera points at the board; her colleague cheers beside her */}
        <PresentingMeera activeStat={activeStat.active} sizes="27vw" style={boardLayout.meera} />
        <CheeringMan sizes="14vw" style={boardLayout.cheeringMan} />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Phones: a real board that grows with its content                           */
/* -------------------------------------------------------------------------- */

/** Board frame from the Figma art, 9-sliced so it can take any size. */
const boardFrame: CSSProperties = {
  borderStyle: "solid",
  borderWidth: "16px 19px 17px 16px",
  borderImage: `url(${whiteboardBoard.src}) 16 19 17 16 fill stretch`,
};

export function WhiteboardMobile() {
  const activeStat = useActiveStat();
  return (
    // wallpaper tiles upward from the floor corner (both cut from the room art)
    <div
      className="relative bg-size-[100%_auto] bg-repeat-y md:hidden"
      style={{ backgroundImage: `url(${roomWallTile.src})` }}
    >
      <Image src={roomFloorCorner} alt="" sizes="100vw" className="absolute bottom-0 left-0 h-auto w-full" />

      {/* Meera and her colleague stand on the floor below the board, sized to the screen width */}
      <PresentingMeera sizes="44vw" className="bottom-3 left-[3%] z-10 w-[44%]" />
      <CheeringMan sizes="22vw" className="bottom-3 left-[49%] z-10 w-[21%]" />

      {/* bottom padding leaves floor space for the two characters (% of width, like them) */}
      <div className="relative px-(--gutter) pt-10 pb-[56%]">
        <div className="font-caveat" style={boardFrame}>
          <div className="flex flex-col px-4 pt-4 pb-6">
            <Magnets {...activeStat} className="self-end text-[13px]" />
            <BoardTitle className="mt-4 text-[28px]" />
            <BoardStats {...activeStat} layout="list" />
            <p className="mt-10 text-[19px] leading-[1.25] font-bold text-marker-navy">{whoWeAreCopy.story}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
