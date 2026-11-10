"use client";

import Image, { type StaticImageData } from "next/image";
import { useAiCreativesStudio, useArtistsCarpet, useDigitalGrowth, useEventsStage, useFilmStudio, usePrintStudio, useRadioStudio, useReelsStudio } from "../animations/WhatWeMake.Floors";
import { floorByNumber, whatWeMakeCopy } from "../constants/whatWeMake.constants";
import { STAGE_CONFETTI } from "../constants/stageConfetti.constants";
import { Layer } from "./Puppet";
import floor1Room from "@/public/images/website/home/what-we-make/lift/floor1-room.png";
import floor1Cameraman from "@/public/images/website/home/what-we-make/lift/floor1-cameraman.png";
import reelsBackground from "@/public/images/website/home/what-we-make/lift/floor2/floor-2-bg.webp";
import reelsBody from "@/public/images/website/home/what-we-make/lift/floor2/body.png";
import reelsHead from "@/public/images/website/home/what-we-make/lift/floor2/head.png";
import reelsArmWave from "@/public/images/website/home/what-we-make/lift/floor2/arm-wave.png";
import reelsArmUpper from "@/public/images/website/home/what-we-make/lift/floor2/arm-upper.png";
import reelsArmPhone from "@/public/images/website/home/what-we-make/lift/floor2/arm-phone.png";
import reelsEyesOpen from "@/public/images/website/home/what-we-make/lift/floor2/eyes-open.png";
import reelsEyesHalf from "@/public/images/website/home/what-we-make/lift/floor2/eyes-half.png";
import aiWall from "@/public/images/website/home/what-we-make/lift/floor3/wall.webp";
import aiNote1 from "@/public/images/website/home/what-we-make/lift/floor3/note-1.png";
import aiNote2 from "@/public/images/website/home/what-we-make/lift/floor3/note-2.png";
import aiNote3 from "@/public/images/website/home/what-we-make/lift/floor3/note-3.png";
import aiNote4 from "@/public/images/website/home/what-we-make/lift/floor3/note-4.png";
import aiNote5 from "@/public/images/website/home/what-we-make/lift/floor3/note-5.png";
import aiNote6 from "@/public/images/website/home/what-we-make/lift/floor3/note-6.png";
import aiStarBig from "@/public/images/website/home/what-we-make/lift/floor3/star-big.png";
import aiStarMid from "@/public/images/website/home/what-we-make/lift/floor3/star-mid.png";
import aiStarSmall from "@/public/images/website/home/what-we-make/lift/floor3/star-small.png";
import aiBody from "@/public/images/website/home/what-we-make/lift/floor3/body.png";
import aiForearm from "@/public/images/website/home/what-we-make/lift/floor3/forearm.png";
import aiElbow from "@/public/images/website/home/what-we-make/lift/floor3/elbow.png";
import aiHead from "@/public/images/website/home/what-we-make/lift/floor3/head.png";
import aiEyesOpen from "@/public/images/website/home/what-we-make/lift/floor3/eyes-open.png";
import aiEyesHalf from "@/public/images/website/home/what-we-make/lift/floor3/eyes-half.png";
import aiMouthSmall from "@/public/images/website/home/what-we-make/lift/floor3/mouth-open-small.png";
import aiMouthWide from "@/public/images/website/home/what-we-make/lift/floor3/mouth-open-wide.png";
import printWall from "@/public/images/website/home/what-we-make/lift/floor4/wall.webp";
import printSignNew from "@/public/images/website/home/what-we-make/lift/floor4/sign-new.png";
import printSignSale from "@/public/images/website/home/what-we-make/lift/floor4/sign-sale.png";
import printSignOpen from "@/public/images/website/home/what-we-make/lift/floor4/sign-open.png";
import printBody from "@/public/images/website/home/what-we-make/lift/floor4/body.png";
import printHead from "@/public/images/website/home/what-we-make/lift/floor4/head.png";
import printPageLeft from "@/public/images/website/home/what-we-make/lift/floor4/page-left.png";
import printPageRight from "@/public/images/website/home/what-we-make/lift/floor4/page-right.png";
import printEyesOpen from "@/public/images/website/home/what-we-make/lift/floor4/eyes-open.png";
import printEyesHalf from "@/public/images/website/home/what-we-make/lift/floor4/eyes-half.png";
import printMouthSmall from "@/public/images/website/home/what-we-make/lift/floor4/mouth-open-small.png";
import printMouthWide from "@/public/images/website/home/what-we-make/lift/floor4/mouth-open-wide.png";
import radioWall from "@/public/images/website/home/what-we-make/lift/floor5/wall.webp";
import radioBody from "@/public/images/website/home/what-we-make/lift/floor5/body-hand.png";
import radioArm from "@/public/images/website/home/what-we-make/lift/floor5/arm-hip-hand.png";
import radioHead from "@/public/images/website/home/what-we-make/lift/floor5/head.png";
import radioEyesOpen from "@/public/images/website/home/what-we-make/lift/floor5/eyes-open.png";
import radioEyesHalf from "@/public/images/website/home/what-we-make/lift/floor5/eyes-half.png";
import radioMouthClosed from "@/public/images/website/home/what-we-make/lift/floor5/mouth-closed.png";
import radioMouthSmall from "@/public/images/website/home/what-we-make/lift/floor5/mouth-open-small.png";
import stageBackground from "@/public/images/website/home/what-we-make/lift/floor6/stage.webp";
import stageValance from "@/public/images/website/home/what-we-make/lift/floor6/valance.webp";
import artistsBackground from "@/public/images/website/home/what-we-make/lift/floor7/floor7-bg.webp";
import artistsStar from "@/public/images/website/home/what-we-make/lift/floor7/star.png";
import artistsBody from "@/public/images/website/home/what-we-make/lift/floor7/body.png";
import artistsHead from "@/public/images/website/home/what-we-make/lift/floor7/head.png";
import artistsForearm from "@/public/images/website/home/what-we-make/lift/floor7/forearm.png";
import artistsUpperArm from "@/public/images/website/home/what-we-make/lift/floor7/arm-upper.png";
import artistsSmile from "@/public/images/website/home/what-we-make/lift/floor7/mouth-smile.png";
import artistsSmileOpen from "@/public/images/website/home/what-we-make/lift/floor7/mouth-smile-open.png";
import digitalWall from "@/public/images/website/home/what-we-make/lift/floor8/wall.webp";
import digitalTrend from "@/public/images/website/home/what-we-make/lift/floor8/trend-line.png";
import digitalHeart from "@/public/images/website/home/what-we-make/lift/floor8/heart.png";
import digitalStar from "@/public/images/website/home/what-we-make/lift/floor8/star.png";
import digitalBody from "@/public/images/website/home/what-we-make/lift/floor8/body.png";
import digitalForearm from "@/public/images/website/home/what-we-make/lift/floor8/forearm.png";
import digitalElbow from "@/public/images/website/home/what-we-make/lift/floor8/elbow.png";
import digitalHead from "@/public/images/website/home/what-we-make/lift/floor8/head.png";
import digitalEyesOpen from "@/public/images/website/home/what-we-make/lift/floor8/eyes-open.png";
import digitalEyesHalf from "@/public/images/website/home/what-we-make/lift/floor8/eyes-half.png";
import digitalMouthSmall from "@/public/images/website/home/what-we-make/lift/floor8/mouth-open-small.png";
import digitalMouthWide from "@/public/images/website/home/what-we-make/lift/floor8/mouth-open-wide.png";
import singerBody from "@/public/images/website/home/what-we-make/lift/floor6/body.png";
import singerArm from "@/public/images/website/home/what-we-make/lift/floor6/arm.png";
import singerHead from "@/public/images/website/home/what-we-make/lift/floor6/head.png";
import singerMic from "@/public/images/website/home/what-we-make/lift/floor6/mic.png";
import singerEyesOpen from "@/public/images/website/home/what-we-make/lift/floor6/eyes-open.png";
import singerEyesHalf from "@/public/images/website/home/what-we-make/lift/floor6/eyes-half.png";
import singerMouthHum from "@/public/images/website/home/what-we-make/lift/floor6/mouth-hum.png";
import singerMouthWide from "@/public/images/website/home/what-we-make/lift/floor6/mouth-wide.png";
import stageCurtain1 from "@/public/images/website/home/what-we-make/lift/floor6/curtains/curtain-1.webp";
import stageCurtain2 from "@/public/images/website/home/what-we-make/lift/floor6/curtains/curtain-2.webp";
import stageCurtain3 from "@/public/images/website/home/what-we-make/lift/floor6/curtains/curtain-3.webp";
import stageCurtain4 from "@/public/images/website/home/what-we-make/lift/floor6/curtains/curtain-4.webp";
import stageCurtain5 from "@/public/images/website/home/what-we-make/lift/floor6/curtains/curtain-5.webp";
import stageCurtain6 from "@/public/images/website/home/what-we-make/lift/floor6/curtains/curtain-6.webp";
import radioPanel11 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-1-1.webp";
import radioPanel12 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-1-2.webp";
import radioPanel13 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-1-3.webp";
import radioPanel14 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-1-4.webp";
import radioPanel15 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-1-5.webp";
import radioPanel21 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-2-1.webp";
import radioPanel22 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-2-2.webp";
import radioPanel23 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-2-3.webp";
import radioPanel24 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-2-4.webp";
import radioPanel25 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-2-5.webp";
import radioPanel31 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-3-1.webp";
import radioPanel32 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-3-2.webp";
import radioPanel33 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-3-3.webp";
import radioPanel34 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-3-4.webp";
import radioPanel35 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-3-5.webp";
import radioPanel41 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-4-1.webp";
import radioPanel42 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-4-2.webp";
import radioPanel43 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-4-3.webp";
import radioPanel44 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-4-4.webp";
import radioPanel45 from "@/public/images/website/home/what-we-make/lift/floor5/panels/panel-4-5.webp";
import reelsMouthSmall from "@/public/images/website/home/what-we-make/lift/floor2/mouth-open-small.png";
import reelsMouthWide from "@/public/images/website/home/what-we-make/lift/floor2/mouth-open-wide.png";

/*
 * Scenes inside the lift car, one per floor. Each fills the car (433 × 580 px
 * of the lift artwork); positions below are % of the car, sizes in cqw of the
 * lift (1cqw = 1% of the 564px-wide artwork).
 */

/**
 * Floor 1 · Brand films: the cameraman leans in, counts you down with little
 * nods, and takes the shot: the camera flashes and the slate moves to the next take.
 */
export function FilmStudioFloor() {
  const ref = useFilmStudio();
  return (
    <div ref={ref} className="absolute inset-0">
      <Image src={floor1Room} alt="" fill sizes="324px" className="pointer-events-none" />
      {/* the take board on the wall (its number goes up with every shot) */}
      <span
        data-part="take"
        className="absolute -translate-1/2 font-inter text-[3.3cqw] leading-none font-semibold tracking-[0.1em] whitespace-pre text-[#ded3bd]"
        style={{ left: "49.77%", top: "16.9%" }}
      >
        {"TAKE  12"}
      </span>
      {/* the cameraman, leaning from his feet */}
      <div data-part="cameraman" className="absolute inset-0" style={{ transformOrigin: "49.65% 97.4%" }}>
        <Image src={floor1Cameraman} alt="" fill sizes="324px" className="pointer-events-none" />
        <span data-part="rec" className="absolute size-[1.06cqw] -translate-1/2 rounded-full bg-[#ff3b30]" style={{ left: "66.05%", top: "32.24%" }} />
        <span
          data-part="flash-burst"
          className="absolute aspect-square w-[34%] -translate-1/2 rounded-full bg-[radial-gradient(circle,#fff_0%,rgba(255,250,235,0.85)_22%,rgba(255,240,200,0)_68%)] opacity-0"
          style={{ left: "60.5%", top: "35.7%" }}
        />
      </div>
      {/* the whole room lights up for an instant */}
      <span data-part="flash-fill" className="absolute inset-0 bg-[#fffaf0] opacity-0" />
    </div>
  );
}

/** The ring light's 24 bulbs (every 15°), in % of the 880 × 1180 floor-2 background. */
const RING_BULBS = Array.from({ length: 24 }, (_, i) => {
  const a = (i * 15 * Math.PI) / 180;
  return { left: `${49.94 + 26.1 * Math.cos(a)}%`, top: `${30.46 + 19.47 * Math.sin(a)}%` };
});

/**
 * Floor 2 · Reels: a creator films a selfie reel in front of a ring light.
 * Every 3 seconds she waves, lifts her phone and talks, and the ring light
 * shines (the bulbs light up round the ring, then glow together).
 * Background 880 × 1180 (fills the car); she is a puppet cut from her own art.
 */
export function ReelsStudioFloor() {
  const ref = useReelsStudio();
  const sizes = "330px";
  return (
    <div ref={ref} className="absolute inset-0">
      <Image src={reelsBackground} alt="" fill sizes={sizes} className="pointer-events-none object-cover" />

      {/* ring light, switched on: each bulb glows, plus a soft halo round the ring */}
      <div
        data-part="ring-halo"
        className="pointer-events-none absolute aspect-square w-[66%] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,244,214,0)_56%,rgba(255,244,214,0.55)_66%,rgba(255,244,214,0)_80%)] opacity-0"
        style={{ left: "49.94%", top: "30.46%" }}
      />
      {RING_BULBS.map((pos, i) => (
        <span
          key={i}
          data-part="bulb"
          className="pointer-events-none absolute aspect-square w-[5%] -translate-1/2 rounded-full bg-[radial-gradient(circle,#fffdf3_0%,#fff3c9_45%,rgba(255,236,170,0)_72%)] opacity-0 shadow-[0_0_10px_4px_rgba(255,232,160,0.75)]"
          style={pos}
        />
      ))}

      {/* the creator (661 × 1168), standing with her face in the ring */}
      <div
        data-part="creator"
        className="absolute aspect-[661/1168]"
        style={{ left: "20.8%", top: "18.79%", width: "58.52%", transformOrigin: "49.92% 97.6%" }}
      >
        {/* waving arm: the whole arm (upper arm + forearm + hand) swings from the shoulder */}
        <div data-part="arm-wave" className="absolute inset-0" style={{ transformOrigin: "34.19% 25.17%" }}>
          <Image src={reelsArmWave} alt="" fill sizes={sizes} className="pointer-events-none" />
          <Image src={reelsArmUpper} alt="" fill sizes={sizes} className="pointer-events-none" />
        </div>
        {/* phone arm: the forearm swings from the elbow, tucked behind the upper arm */}
        <div data-part="arm-phone" className="absolute inset-0" style={{ transformOrigin: "95.01% 24.4%" }}>
          <Image src={reelsArmPhone} alt="" fill sizes={sizes} className="pointer-events-none" />
        </div>
        <Image src={reelsBody} alt="" fill sizes={sizes} className="pointer-events-none" />
        <div data-part="head" className="absolute inset-0" style={{ transformOrigin: "49.92% 21.83%" }}>
          <Image src={reelsHead} alt="" fill sizes={sizes} className="pointer-events-none" />
          {/* her artwork has closed eyes (the "closed" frame); open and half-closed eyes are painted on */}
          <Layer src={reelsEyesOpen} sizes={sizes} part="eyes" />
          <Layer src={reelsEyesHalf} sizes={sizes} part="eyes-half" hidden />
          <Layer src={reelsMouthSmall} sizes={sizes} part="mouth-small" hidden />
          <Layer src={reelsMouthWide} sizes={sizes} part="mouth-wide" hidden />
        </div>
      </div>
    </div>
  );
}

/** The sticky notes on the wall: each pinned at the middle of its top edge (in % of the 880 × 1180 background). */
const NOTES = [
  { src: aiNote1, pivot: "19.43% 7.12%" }, { src: aiNote2, pivot: "49.09% 7.03%" }, { src: aiNote3, pivot: "78.64% 7.46%" },
  { src: aiNote4, pivot: "19.43% 29.07%" }, { src: aiNote5, pivot: "48.98% 28.9%" }, { src: aiNote6, pivot: "78.58% 29.49%" },
];

/** A paper star that shines: it swells and turns round its centre, with a soft glow behind it. */
function ShiningStar({ src, sizes, left, top, glow }: { src: StaticImageData; sizes: string; left: string; top: string; glow: string }) {
  return (
    <>
      <span
        data-part="star-glow"
        className="pointer-events-none absolute aspect-square -translate-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,250,228,0.95)_0%,rgba(255,226,140,0.55)_32%,rgba(255,226,140,0)_70%)] opacity-0"
        style={{ left, top, width: glow }}
      />
      <div data-part="star" className="absolute inset-0" style={{ transformOrigin: `${left} ${top}` }}>
        <Image src={src} alt="" fill sizes={sizes} className="pointer-events-none" />
      </div>
    </>
  );
}

/**
 * Floor 3 · AI creatives: a strategist presents his idea on a tablet in front
 * of a wall of sticky notes. Every 3 seconds he lifts his pencil hand and
 * explains, and the stars on the wall shine; the notes flutter gently.
 * Background 880 × 1180 (fills the car), cut into a clean wall, six notes and
 * three stars; he is a puppet cut from his own art (450 × 1105).
 */
export function AiCreativesFloor() {
  const ref = useAiCreativesStudio();
  const sizes = "330px";
  return (
    <div ref={ref} className="absolute inset-0">
      <Image src={aiWall} alt="" fill sizes={sizes} className="pointer-events-none object-cover" />

      {NOTES.map(({ src, pivot }, i) => (
        <div key={src.src} data-part="note" className="absolute inset-0" style={{ transformOrigin: pivot }}>
          <Image src={src} alt="" fill sizes={sizes} className="pointer-events-none" />
          {/* the small star is stuck on the third note, so it flutters with it */}
          {i === 2 && <ShiningStar src={aiStarSmall} sizes={sizes} left="79.49%" top="10.13%" glow="11%" />}
        </div>
      ))}
      <ShiningStar src={aiStarBig} sizes={sizes} left="14.72%" top="54.19%" glow="21%" />
      <ShiningStar src={aiStarMid} sizes={sizes} left="86.31%" top="50.85%" glow="16%" />

      {/* the strategist, standing in front of the wall */}
      <div
        data-part="strategist"
        className="absolute aspect-[450/1105]"
        style={{ left: "29.64%", top: "22.97%", width: "40.73%", transformOrigin: "53.33% 98.2%" }}
      >
        <Image src={aiBody} alt="" fill sizes={sizes} className="pointer-events-none" />
        {/* pencil hand: the forearm lifts from the elbow, its end tucked under the elbow cap */}
        <div data-part="forearm" className="absolute inset-0" style={{ transformOrigin: "92.22% 38.46%" }}>
          <Image src={aiForearm} alt="" fill sizes={sizes} className="pointer-events-none" />
        </div>
        <Image src={aiElbow} alt="" fill sizes={sizes} className="pointer-events-none" />
        <div data-part="head" className="absolute inset-0" style={{ transformOrigin: "54.44% 17.74%" }}>
          <Image src={aiHead} alt="" fill sizes={sizes} className="pointer-events-none" />
          {/* his artwork has closed eyes (the "closed" frame); open and half-closed eyes are painted on */}
          <Layer src={aiEyesOpen} sizes={sizes} part="eyes" />
          <Layer src={aiEyesHalf} sizes={sizes} part="eyes-half" hidden />
          <Layer src={aiMouthSmall} sizes={sizes} part="mouth-small" hidden />
          <Layer src={aiMouthWide} sizes={sizes} part="mouth-wide" hidden />
        </div>
      </div>
    </div>
  );
}

/**
 * The hanging signs (frames 180 × 200 in the 880 × 1180 background): each swings
 * from a nail above its top edge, and glows in its own colour when it shines.
 */
const PRINT_SIGNS = [
  { src: printSignNew, left: "19.32%", panelLeft: "10.45%", rgb: "255,140,60" }, // orange
  { src: printSignSale, left: "50%", panelLeft: "41.14%", rgb: "80,170,255" }, // blue
  { src: printSignOpen, left: "80.68%", panelLeft: "71.82%", rgb: "255,205,70" }, // yellow
];

/**
 * Floor 4 · Print: a man reads the morning paper under three hanging signs.
 * He reads line by line (his head follows the line, his lips murmur the words)
 * and now and then snaps the paper straight; he blinks and breathes. The signs
 * swing gently and, one after another every 2 seconds, light up in their colour.
 * Background 880 × 1180 (fills the car), cut into a clean wall and three signs;
 * he is a puppet cut from his own art (494 × 1105).
 */
export function PrintStudioFloor() {
  const ref = usePrintStudio();
  const sizes = "330px";
  return (
    <div ref={ref} className="absolute inset-0">
      <Image src={printWall} alt="" fill sizes={sizes} className="pointer-events-none object-cover" />

      {PRINT_SIGNS.map(({ src, left, panelLeft, rgb }) => (
        <div key={src.src} data-part="sign" className="absolute inset-0" style={{ transformOrigin: `${left} 1.69%` }}>
          {/* coloured light spilling onto the wall round the frame */}
          <span
            data-part="sign-glow"
            className="pointer-events-none absolute aspect-square w-[40%] -translate-1/2 rounded-full opacity-0"
            style={{ left, top: "11.86%", backgroundImage: `radial-gradient(circle, rgba(${rgb},0.75) 0%, rgba(${rgb},0.35) 35%, rgba(${rgb},0) 68%)` }}
          />
          <Image src={src} alt="" fill sizes={sizes} className="pointer-events-none" />
          {/* the panel itself lights up */}
          <span
            data-part="sign-light"
            className="pointer-events-none absolute opacity-0 mix-blend-screen"
            style={{ left: panelLeft, top: "4.41%", width: "17.73%", height: "14.92%", backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(${rgb},0.55) 45%, rgba(${rgb},0.2) 100%)` }}
          />
        </div>
      ))}

      {/* the reader, standing between the paper stacks */}
      <div
        data-part="reader"
        className="absolute aspect-[494/1105]"
        style={{ left: "27.84%", top: "22.97%", width: "44.69%", transformOrigin: "49.6% 97.74%" }}
      >
        <Image src={printBody} alt="" fill sizes={sizes} className="pointer-events-none" />
        <div data-part="head" className="absolute inset-0" style={{ transformOrigin: "49.6% 17.38%" }}>
          <Image src={printHead} alt="" fill sizes={sizes} className="pointer-events-none" />
          {/* his artwork has closed eyes (the "closed" frame); open eyes, looking down at the paper, are painted on */}
          <Layer src={printEyesOpen} sizes={sizes} part="eyes" />
          <Layer src={printEyesHalf} sizes={sizes} part="eyes-half" hidden />
          <Layer src={printMouthSmall} sizes={sizes} part="mouth-small" hidden />
          <Layer src={printMouthWide} sizes={sizes} part="mouth-wide" hidden />
        </div>
        {/* the newspaper and the hands holding it; the right page flexes at the fold */}
        <div data-part="paper" className="absolute inset-0" style={{ transformOrigin: "49.6% 38.91%" }}>
          <div data-part="page" className="absolute inset-0" style={{ transformOrigin: "49.6% 38.91%" }}>
            <Image src={printPageRight} alt="" fill sizes={sizes} className="pointer-events-none" />
          </div>
          <Image src={printPageLeft} alt="" fill sizes={sizes} className="pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

/** The acoustic panels (5 × 4, each 150 × 140 in the 880 × 1180 background). */
const RADIO_PANELS = [radioPanel11, radioPanel12, radioPanel13, radioPanel14, radioPanel15, radioPanel21, radioPanel22, radioPanel23, radioPanel24, radioPanel25,
  radioPanel31, radioPanel32, radioPanel33, radioPanel34, radioPanel35, radioPanel41, radioPanel42, radioPanel43, radioPanel44, radioPanel45].map((src, i) => ({
  src,
  left: `${[4.545, 23.295, 42.045, 60.795, 79.545][i % 5]}%`,
  top: `${[22.034, 34.746, 47.458, 60.169][Math.floor(i / 5)]}%`,
}));

/**
 * Floor 5 · Radio: a host on air, one hand pressing her headphones, the other
 * on her hip. She talks to her listeners, gesturing with her free arm (from the
 * shoulder) and tilting her head, and blinks. The acoustic panels behind her
 * sway like hanging curtains, and every 3 seconds the ON AIR sign glows red.
 * Background 880 × 1180 (fills the car), cut into a clean wall and 20 panels;
 * she is a puppet cut from her own art (635 × 1151).
 */
export function RadioStudioFloor() {
  const ref = useRadioStudio();
  const sizes = "330px";
  return (
    <div ref={ref} className="absolute inset-0">
      <Image src={radioWall} alt="" fill sizes={sizes} className="pointer-events-none object-cover" />

      {/* ON AIR: red light round the frame, and the panel itself lighting up */}
      <span
        data-part="on-air-glow"
        className="pointer-events-none absolute rounded-[4%] opacity-0 shadow-[0_0_28px_10px_rgba(255,64,52,0.7),0_0_70px_26px_rgba(255,40,30,0.35)]"
        style={{ left: "29.55%", top: "5.93%", width: "40.91%", height: "11.02%" }}
      />
      <span
        data-part="on-air-light"
        className="pointer-events-none absolute bg-[radial-gradient(ellipse_at_center,rgba(255,236,226,0.55)_0%,rgba(255,96,80,0.45)_55%,rgba(255,70,60,0.25)_100%)] opacity-0 mix-blend-screen"
        style={{ left: "31.36%", top: "7.29%", width: "37.27%", height: "8.31%" }}
      />

      {/* acoustic panels, each hanging from the middle of its top edge */}
      {RADIO_PANELS.map(({ src, left, top }) => (
        <div
          key={src.src}
          data-part="panel"
          className="absolute h-[11.864%] w-[17.045%]"
          style={{ left, top, transformOrigin: "50% 0%" }}
        >
          <Image src={src} alt="" fill sizes="64px" className="pointer-events-none" />
        </div>
      ))}

      {/* the host */}
      <div
        data-part="host"
        className="absolute aspect-[635/1151]"
        style={{ left: "23.13%", top: "19.92%", width: "57.44%", transformOrigin: "47.24% 97.74%" }}
      >
        <Image src={radioBody} alt="" fill sizes={sizes} className="pointer-events-none" />
        {/* free arm: swings out from the shoulder, off her hip */}
        <div data-part="arm" className="absolute inset-0" style={{ transformOrigin: "63.94% 23.63%" }}>
          <Image src={radioArm} alt="" fill sizes={sizes} className="pointer-events-none" />
        </div>
        {/* head and the arm pressing her headphones move together, from the neck */}
        <div data-part="head" className="absolute inset-0" style={{ transformOrigin: "45.98% 21.11%" }}>
          <Image src={radioHead} alt="" fill sizes={sizes} className="pointer-events-none" />
          {/* her artwork has closed eyes (the "closed" frame); open and half-closed eyes are painted on */}
          <Layer src={radioEyesOpen} sizes={sizes} part="eyes" />
          <Layer src={radioEyesHalf} sizes={sizes} part="eyes-half" hidden />
          {/* her artwork is mid-word (mouth open): closed lips by default, a small open frame for some syllables */}
          <Layer src={radioMouthClosed} sizes={sizes} part="mouth-closed" />
          <Layer src={radioMouthSmall} sizes={sizes} part="mouth-small" hidden />
        </div>
      </div>
    </div>
  );
}

/** The curtain strips (three each side), each hanging from the valance, in % of the 880 × 1180 stage. */
const STAGE_CURTAINS = [
  { src: stageCurtain1, left: 0, width: 4.886 }, { src: stageCurtain2, left: 4.205, width: 9.773 }, { src: stageCurtain3, left: 13.295, width: 9.773 },
  { src: stageCurtain4, left: 75.795, width: 6.364 }, { src: stageCurtain5, left: 81.364, width: 10 }, { src: stageCurtain6, left: 90.568, width: 9.432 },
];

/**
 * Floor 6 · Events: a singer on stage between red curtains. He sings into
 * the mic (his mouth follows the notes), opens his free arm to the audience
 * from the shoulder, sways and blinks. The curtains sway gently, and as the lift doors open a
 * shower of confetti falls once from the top of the stage and stays on the floor.
 * Background 880 × 1180 (fills the car), cut into the stage, six curtain strips
 * and 55 confetti pieces; he is a puppet cut from his own art (741 × 1105).
 */
export function EventsStageFloor() {
  const ref = useEventsStage();
  const sizes = "330px";
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <Image src={stageBackground} alt="" fill sizes={sizes} className="pointer-events-none object-cover" />

      {STAGE_CONFETTI.map(({ left, top, width, height, rotate, color }, i) => (
        <span
          key={i}
          data-part="confetti"
          className="pointer-events-none absolute"
          style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%`, background: color, transform: `rotate(${rotate}deg)` }}
        />
      ))}

      {/* the valance: confetti drops out from behind it */}
      <div className="absolute inset-x-0 top-0 h-[6.1%]">
        <Image src={stageValance} alt="" fill sizes={sizes} className="pointer-events-none" />
      </div>

      {STAGE_CURTAINS.map(({ src, left, width }) => (
        <div
          key={src.src}
          data-part="curtain"
          className="absolute top-0 h-[85%]"
          style={{ left: `${left}%`, width: `${width}%`, transformOrigin: "50% 0%" }}
        >
          <Image src={src} alt="" fill sizes="40px" className="pointer-events-none" />
        </div>
      ))}

      {/* the singer, centre stage */}
      <div
        data-part="singer"
        className="absolute aspect-[741/1105]"
        style={{ left: "3.87%", top: "22.97%", width: "67.05%", transformOrigin: "68.83% 98.19%" }}
      >
        <Image src={singerBody} alt="" fill sizes={sizes} className="pointer-events-none" />
        {/* free arm, open to the audience: swings from the shoulder */}
        <div data-part="arm" className="absolute inset-0" style={{ transformOrigin: "53.58% 22.44%" }}>
          <Image src={singerArm} alt="" fill sizes={sizes} className="pointer-events-none" />
        </div>
        <div data-part="head" className="absolute inset-0" style={{ transformOrigin: "68.15% 17.65%" }}>
          <Image src={singerHead} alt="" fill sizes={sizes} className="pointer-events-none" />
          {/* his artwork has closed eyes (the "closed" frame); open and half-closed eyes are painted on */}
          <Layer src={singerEyesOpen} sizes={sizes} part="eyes" />
          <Layer src={singerEyesHalf} sizes={sizes} part="eyes-half" hidden />
          {/* his artwork sings an open note; humming lips and a wide "aah" are the other shapes */}
          <Layer src={singerMouthHum} sizes={sizes} part="mouth-hum" hidden />
          <Layer src={singerMouthWide} sizes={sizes} part="mouth-wide" hidden />
        </div>
        {/* the mic stays in front of his face */}
        <Image src={singerMic} alt="" fill sizes={sizes} className="pointer-events-none" />
      </div>
    </div>
  );
}

/** The gold star on the wall: its box in % of the 880 × 1180 background. */
const ARTIST_STAR = { left: "29.659%", top: "12.119%", width: "40.795%", height: "28.814%" };

/**
 * Floor 7 · Artists: a star on the red carpet. She waves hello to us (the
 * forearm from the elbow, the arm a little from the shoulder) and smiles as she
 * waves, tilting her head. The gold star on the wall shines every 3 seconds:
 * a warm glow, a little swell and a white gleam sweeping across it.
 * Background 880 × 1180 (fills the car); the star is cut out to shine; she is a
 * puppet cut from her own art (529 × 1298).
 */
export function ArtistsCarpetFloor() {
  const ref = useArtistsCarpet();
  const sizes = "330px";
  return (
    <div ref={ref} className="absolute inset-0">
      <Image src={artistsBackground} alt="" fill sizes={sizes} className="pointer-events-none object-cover" />

      {/* the star: glow behind it, the star itself (swells), and a gleam clipped to its shape */}
      <span
        data-part="star-glow"
        className="pointer-events-none absolute aspect-square w-[62%] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,224,120,0.85)_0%,rgba(255,206,90,0.4)_34%,rgba(255,206,90,0)_66%)] opacity-0"
        style={{ left: "49.97%", top: "27.96%" }}
      />
      <div data-part="star" className="absolute" style={{ ...ARTIST_STAR, transformOrigin: "49.78% 54.97%" }}>
        <Image src={artistsStar} alt="" fill sizes="150px" className="pointer-events-none" />
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ maskImage: `url(${artistsStar.src})`, WebkitMaskImage: `url(${artistsStar.src})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
        >
          <span data-part="star-gleam" className="absolute -inset-y-1/4 w-[34%] rotate-[20deg] bg-linear-to-r from-transparent via-white/85 to-transparent opacity-0" style={{ left: "-40%" }} />
        </div>
      </div>

      {/* the artist on the carpet */}
      <div
        data-part="artist"
        className="absolute aspect-[529/1298]"
        style={{ left: "26.03%", top: "9.83%", width: "47.85%", transformOrigin: "50.09% 98.61%" }}
      >
        <Image src={artistsBody} alt="" fill sizes={sizes} className="pointer-events-none" />
        <div data-part="head" className="absolute inset-0" style={{ transformOrigin: "50.09% 30.43%" }}>
          <Image src={artistsHead} alt="" fill sizes={sizes} className="pointer-events-none" />
          <Layer src={artistsSmile} sizes={sizes} part="smile" hidden />
          <Layer src={artistsSmileOpen} sizes={sizes} part="smile-open" hidden />
        </div>
        {/* waving arm: a little from the shoulder; the forearm and hand wave from the elbow, under the elbow */}
        <div data-part="arm" className="absolute inset-0" style={{ transformOrigin: "72.78% 33.51%" }}>
          <div data-part="forearm" className="absolute inset-0" style={{ transformOrigin: "89.22% 20.96%" }}>
            <Image src={artistsForearm} alt="" fill sizes={sizes} className="pointer-events-none" />
          </div>
          <Image src={artistsUpperArm} alt="" fill sizes={sizes} className="pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

/** The chart board (inside its frame) in % of the 880 × 1180 background, and its bars in % of the board. */
const DIGITAL_BOARD = { left: "12.5%", top: "10.169%", width: "75.114%", height: "33.983%" };
const DIGITAL_BARS = [
  [7.56, 79.8, 6.05, 14.96], [21.94, 72.32, 6.05, 22.44], [36.31, 77.31, 6.05, 17.46],
  [50.68, 62.34, 6.05, 32.42], [65.05, 67.33, 6.05, 27.43], [79.43, 52.37, 6.05, 42.39],
];
/** Round badges on the wall, each with the colour it glows in. */
const DIGITAL_BADGES = [
  { src: digitalHeart, left: "12.216%", top: "49.788%", rgb: "255,128,156" },
  { src: digitalStar, left: "75.852%", top: "51.483%", rgb: "255,206,84" },
];

/**
 * Floor 8 · Digital: a strategist presents growth. Every 3 seconds she lifts
 * her hand off the laptop and explains (talks, tilts her head) and the heart and
 * star badges shine. Behind her the chart keeps growing: the trend line draws up
 * to its arrow with the bars rising alongside it. She blinks and breathes all the time.
 * Background 880 × 1180 (fills the car), cut into the wall with an empty board,
 * the trend line, the bars and two badges; she is a puppet cut from her own art (437 × 1100).
 */
export function DigitalGrowthFloor() {
  const ref = useDigitalGrowth();
  const sizes = "330px";
  return (
    <div ref={ref} className="absolute inset-0">
      <Image src={digitalWall} alt="" fill sizes={sizes} className="pointer-events-none object-cover" />

      {/* the chart: trend line under the bars (they are 90% opaque, as in the artwork) */}
      <div className="absolute" style={DIGITAL_BOARD}>
        <div data-part="trend" className="absolute inset-0" style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
          <Image src={digitalTrend} alt="" fill sizes="250px" className="pointer-events-none" />
          <div data-part="trend-glow" className="absolute inset-0 opacity-0" style={{ filter: "drop-shadow(0 0 3px rgba(150,245,180,0.95)) drop-shadow(0 0 8px rgba(150,245,180,0.6))" }}>
            <Image src={digitalTrend} alt="" fill sizes="250px" className="pointer-events-none" />
          </div>
        </div>
        {DIGITAL_BARS.map(([left, top, width, height]) => (
          <span
            key={left}
            data-part="bar"
            className="absolute bg-[rgba(64,106,109,0.9)]"
            style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%`, transformOrigin: "50% 100%" }}
          />
        ))}
      </div>

      {/* heart and star badges: a coloured glow, a little swell and a gleam across */}
      {DIGITAL_BADGES.map(({ src, left, top, rgb }) => (
        <div key={src.src} className="absolute h-[8.898%] w-[11.932%]" style={{ left, top }}>
          <span
            data-part="badge-glow"
            className="pointer-events-none absolute -inset-[55%] rounded-full opacity-0"
            style={{ backgroundImage: `radial-gradient(circle, rgba(${rgb},0.8) 0%, rgba(${rgb},0.35) 38%, rgba(${rgb},0) 68%)` }}
          />
          <div data-part="badge" className="absolute inset-0 overflow-hidden rounded-full">
            <Image src={src} alt="" fill sizes="48px" className="pointer-events-none" />
            <span data-part="badge-gleam" className="absolute -inset-y-1/4 w-[40%] rotate-[20deg] bg-linear-to-r from-transparent via-white/80 to-transparent opacity-0" style={{ left: "-50%" }} />
          </div>
        </div>
      ))}

      {/* the strategist */}
      <div
        data-part="strategist"
        className="absolute aspect-[437/1100]"
        style={{ left: "24.67%", top: "23.31%", width: "39.53%", transformOrigin: "64.07% 97.73%" }}
      >
        <Image src={digitalBody} alt="" fill sizes={sizes} className="pointer-events-none" />
        {/* her hand lifts off the laptop: the forearm turns from the elbow, its end under the elbow */}
        <div data-part="forearm" className="absolute inset-0" style={{ transformOrigin: "89.93% 38.64%" }}>
          <Image src={digitalForearm} alt="" fill sizes={sizes} className="pointer-events-none" />
        </div>
        <Image src={digitalElbow} alt="" fill sizes={sizes} className="pointer-events-none" />
        <div data-part="head" className="absolute inset-0" style={{ transformOrigin: "65.22% 17.09%" }}>
          <Image src={digitalHead} alt="" fill sizes={sizes} className="pointer-events-none" />
          {/* her artwork has closed eyes (the "closed" frame); open and half-closed eyes are painted on, inside the glasses */}
          <Layer src={digitalEyesOpen} sizes={sizes} part="eyes" />
          <Layer src={digitalEyesHalf} sizes={sizes} part="eyes-half" hidden />
          <Layer src={digitalMouthSmall} sizes={sizes} part="mouth-small" hidden />
          <Layer src={digitalMouthWide} sizes={sizes} part="mouth-wide" hidden />
        </div>
      </div>
    </div>
  );
}

/** Floors without their studio yet: an empty car with a brass sign. */
export function ComingSoonFloor({ floor }: { floor: number }) {
  const { name } = floorByNumber(floor);
  return (
    <div className="absolute inset-0 bg-linear-to-r from-[#596165] via-[#61696d] to-[#596165]">
      <span className="absolute inset-x-0 top-[83.6%] h-[1.2%] bg-[#495052]" />
      <span className="absolute inset-x-0 top-[84.8%] bottom-0 bg-[#585e62]" />
      <div className="absolute top-[38%] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[1cqw] rounded-[0.6cqw] border-[0.4cqw] border-[#c8a252] bg-[#2a2626] px-[4cqw] py-[2.4cqw] shadow-[0_0.6cqw_1.4cqw_rgba(0,0,0,0.35)]">
        <span className="font-inter text-[2.6cqw] leading-none font-bold tracking-[0.2em] whitespace-nowrap text-[#e7cd63] uppercase">
          Floor {floor} · {name}
        </span>
        <span className="font-inter text-[2cqw] leading-none whitespace-nowrap text-[#f3f1ea]/80">{whatWeMakeCopy.comingSoon}</span>
      </div>
    </div>
  );
}

/**
 * Quietly loads every floor's artwork (same sizes as the scenes, so the browser
 * reuses the exact files) so the lift never opens onto a floor still loading.
 */
export function FloorArtworkPreloader() {
  const art = [
    { src: floor1Room, sizes: "324px" }, { src: floor1Cameraman, sizes: "324px" },
    { src: reelsBackground, sizes: "330px" }, { src: reelsBody, sizes: "330px" }, { src: reelsHead, sizes: "330px" },
    { src: reelsArmWave, sizes: "330px" }, { src: reelsArmUpper, sizes: "330px" }, { src: reelsArmPhone, sizes: "330px" }, { src: reelsEyesOpen, sizes: "330px" }, { src: reelsEyesHalf, sizes: "330px" },
    ...[aiWall, aiNote1, aiNote2, aiNote3, aiNote4, aiNote5, aiNote6, aiStarBig, aiStarMid, aiStarSmall, aiBody, aiForearm, aiElbow, aiHead, aiEyesOpen, aiEyesHalf, aiMouthSmall, aiMouthWide].map((src) => ({ src, sizes: "330px" })),
    ...[printWall, printSignNew, printSignSale, printSignOpen, printBody, printHead, printPageLeft, printPageRight, printEyesOpen, printEyesHalf, printMouthSmall, printMouthWide].map((src) => ({ src, sizes: "330px" })),
    ...[radioWall, radioBody, radioArm, radioHead, radioEyesOpen, radioEyesHalf, radioMouthClosed, radioMouthSmall].map((src) => ({ src, sizes: "330px" })),
    ...RADIO_PANELS.map(({ src }) => ({ src, sizes: "64px" })),
    ...[stageBackground, stageValance, singerBody, singerArm, singerHead, singerMic, singerEyesOpen, singerEyesHalf, singerMouthHum, singerMouthWide].map((src) => ({ src, sizes: "330px" })),
    ...STAGE_CURTAINS.map(({ src }) => ({ src, sizes: "40px" })),
    ...[artistsBackground, artistsBody, artistsHead, artistsForearm, artistsUpperArm, artistsSmile, artistsSmileOpen].map((src) => ({ src, sizes: "330px" })),
    { src: artistsStar, sizes: "150px" },
    ...[digitalWall, digitalBody, digitalForearm, digitalElbow, digitalHead, digitalEyesOpen, digitalEyesHalf, digitalMouthSmall, digitalMouthWide].map((src) => ({ src, sizes: "330px" })),
    { src: digitalTrend, sizes: "250px" }, { src: digitalHeart, sizes: "48px" }, { src: digitalStar, sizes: "48px" },
    { src: reelsMouthSmall, sizes: "330px" }, { src: reelsMouthWide, sizes: "330px" },
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute size-px overflow-hidden opacity-0">
      {art.map(({ src, sizes }) => (
        <Image key={src.src} src={src} alt="" sizes={sizes} loading="eager" fetchPriority="low" />
      ))}
    </div>
  );
}

/** The scene for a floor. */
export function FloorScene({ floor }: { floor: number }) {
  if (floor === 1) return <FilmStudioFloor />;
  if (floor === 2) return <ReelsStudioFloor />;
  if (floor === 3) return <AiCreativesFloor />;
  if (floor === 4) return <PrintStudioFloor />;
  if (floor === 5) return <RadioStudioFloor />;
  if (floor === 6) return <EventsStageFloor />;
  if (floor === 7) return <ArtistsCarpetFloor />;
  if (floor === 8) return <DigitalGrowthFloor />;
  return <ComingSoonFloor floor={floor} />;
}
