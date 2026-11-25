"use client";

import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { useAiCreativesStudio, useArtistsCarpet, useDigitalGrowth, useEventsStage, useFilmStudio, usePrintStudio, useRadioStudio, useReelsStudio } from "../animations/WhatWeMake.Floors";
import { floorByNumber, whatWeMakeCopy } from "../constants/whatWeMake.constants";
import { STAGE_CONFETTI } from "../constants/stageConfetti.constants";
import { Layer } from "./Puppet";
// floors 3-8: the new characters (floorN-updated), each cut into a puppet laid out on the 880 x 1180 car (the old floorN art is kept)
import floor3Body from "@/public/images/website/home/what-we-make/lift/floor3-updated/body.webp";
import floor3Head from "@/public/images/website/home/what-we-make/lift/floor3-updated/head.webp";
import floor3EyeLeft from "@/public/images/website/home/what-we-make/lift/floor3-updated/eye-left.webp";
import floor3EyeRight from "@/public/images/website/home/what-we-make/lift/floor3-updated/eye-right.webp";
import floor3Forearm from "@/public/images/website/home/what-we-make/lift/floor3-updated/forearm.webp";
import floor4Body from "@/public/images/website/home/what-we-make/lift/floor4-updated/body.webp";
import floor4Head from "@/public/images/website/home/what-we-make/lift/floor4-updated/head.webp";
import floor4EyeLeft from "@/public/images/website/home/what-we-make/lift/floor4-updated/eye-left.webp";
import floor4EyeRight from "@/public/images/website/home/what-we-make/lift/floor4-updated/eye-right.webp";
import floor4Paper from "@/public/images/website/home/what-we-make/lift/floor4-updated/paper.webp";
import floor5Body from "@/public/images/website/home/what-we-make/lift/floor5-updated/body.webp";
import floor5Head from "@/public/images/website/home/what-we-make/lift/floor5-updated/head.webp";
import floor5EyeLeft from "@/public/images/website/home/what-we-make/lift/floor5-updated/eye-left.webp";
import floor5EyeRight from "@/public/images/website/home/what-we-make/lift/floor5-updated/eye-right.webp";
import floor5Arm from "@/public/images/website/home/what-we-make/lift/floor5-updated/arm.webp";
import floor6Body from "@/public/images/website/home/what-we-make/lift/floor6-updated/body.webp";
import floor6Head from "@/public/images/website/home/what-we-make/lift/floor6-updated/head.webp";
import floor6EyeLeft from "@/public/images/website/home/what-we-make/lift/floor6-updated/eye-left.webp";
import floor6EyeRight from "@/public/images/website/home/what-we-make/lift/floor6-updated/eye-right.webp";
import floor6Arm from "@/public/images/website/home/what-we-make/lift/floor6-updated/arm.webp";
import floor7Body from "@/public/images/website/home/what-we-make/lift/floor7-updated/body.webp";
import floor7Head from "@/public/images/website/home/what-we-make/lift/floor7-updated/head.webp";
import floor7Forearm from "@/public/images/website/home/what-we-make/lift/floor7-updated/forearm.webp";
import floor8Body from "@/public/images/website/home/what-we-make/lift/floor8-updated/body.webp";
import floor8Head from "@/public/images/website/home/what-we-make/lift/floor8-updated/head.webp";
import floor8EyeLeft from "@/public/images/website/home/what-we-make/lift/floor8-updated/eye-left.webp";
import floor8EyeRight from "@/public/images/website/home/what-we-make/lift/floor8-updated/eye-right.webp";
import floor8Forearm from "@/public/images/website/home/what-we-make/lift/floor8-updated/forearm.webp";
import floor1Room from "@/public/images/website/home/what-we-make/lift/floor1-room.png";
// the photographer (floor1-updated, laid out on the car at twice its size; the old floor1-cameraman.png is kept)
import floor1Cameraman from "@/public/images/website/home/what-we-make/lift/floor1-updated/cameraman.webp";
import floor1EyeLeft from "@/public/images/website/home/what-we-make/lift/floor1-updated/eye-left.webp";
import floor1EyeRight from "@/public/images/website/home/what-we-make/lift/floor1-updated/eye-right.webp";
// floor 2's creator (floor2-updated, cut into a puppet on the 880 x 1180 car frame; the old floor2 files are kept)
import reelsBackground from "@/public/images/website/home/what-we-make/lift/floor2-updated/background.webp";
import reelsRing from "@/public/images/website/home/what-we-make/lift/floor2-updated/body-back.webp";
import reelsBody from "@/public/images/website/home/what-we-make/lift/floor2-updated/body-front.webp";
import reelsHead from "@/public/images/website/home/what-we-make/lift/floor2-updated/head.webp";
import reelsEyeLeft from "@/public/images/website/home/what-we-make/lift/floor2-updated/eye-left.webp";
import reelsEyeRight from "@/public/images/website/home/what-we-make/lift/floor2-updated/eye-right.webp";
import reelsArmWave from "@/public/images/website/home/what-we-make/lift/floor2-updated/arm-wave.webp";
import reelsArmPhone from "@/public/images/website/home/what-we-make/lift/floor2-updated/arm-phone.webp";
import reelsIconYoutube from "@/public/images/website/home/what-we-make/lift/floor2-updated/icon-youtube.webp";
import reelsIconFacebook from "@/public/images/website/home/what-we-make/lift/floor2-updated/icon-facebook.webp";
import reelsIconFollow from "@/public/images/website/home/what-we-make/lift/floor2-updated/icon-follow.webp";
import reelsIconClapper from "@/public/images/website/home/what-we-make/lift/floor2-updated/icon-clapper.webp";
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
import printWall from "@/public/images/website/home/what-we-make/lift/floor4/wall.webp";
import printSignNew from "@/public/images/website/home/what-we-make/lift/floor4/sign-new.png";
import printSignSale from "@/public/images/website/home/what-we-make/lift/floor4/sign-sale.png";
import printSignOpen from "@/public/images/website/home/what-we-make/lift/floor4/sign-open.png";
import radioWall from "@/public/images/website/home/what-we-make/lift/floor5/wall.webp";
import stageBackground from "@/public/images/website/home/what-we-make/lift/floor6/stage.webp";
import stageValance from "@/public/images/website/home/what-we-make/lift/floor6/valance.webp";
import artistsBackground from "@/public/images/website/home/what-we-make/lift/floor7/floor7-bg.webp";
import artistsStar from "@/public/images/website/home/what-we-make/lift/floor7/star.png";
import digitalWall from "@/public/images/website/home/what-we-make/lift/floor8/wall.webp";
import digitalTrend from "@/public/images/website/home/what-we-make/lift/floor8/trend-line.png";
import digitalHeart from "@/public/images/website/home/what-we-make/lift/floor8/heart.png";
import digitalStar from "@/public/images/website/home/what-we-make/lift/floor8/star.png";
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

/*
 * Scenes inside the lift car, one per floor. Each fills the car (433 × 580 px
 * of the lift artwork); positions below are % of the car, sizes in cqw of the
 * lift (1cqw = 1% of the 564px-wide artwork).
 */

/**
 * Floor 1 · Brand films: the photographer leans in, counts you down with little
 * nods, and takes the shot: the camera flashes and the slate moves to the next
 * take. He blinks now and then.
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
      <div data-part="cameraman" className="absolute inset-0" style={{ transformOrigin: "50% 97.07%" }}>
        <Image src={floor1Cameraman} alt="" fill sizes="324px" className="pointer-events-none" />
        {/* his eyes, each squashed shut for a blink */}
        <div data-part="eye" className="absolute inset-0" style={{ transformOrigin: "47.13% 32.38%" }}>
          <Image src={floor1EyeLeft} alt="" fill sizes="324px" className="pointer-events-none" />
        </div>
        <div data-part="eye" className="absolute inset-0" style={{ transformOrigin: "52.55% 32.14%" }}>
          <Image src={floor1EyeRight} alt="" fill sizes="324px" className="pointer-events-none" />
        </div>
        <span data-part="rec" className="absolute size-[0.75cqw] -translate-1/2 rounded-[0.1cqw] bg-[#ff3b30]" style={{ left: "61.76%", top: "34.16%" }} />
        <span
          data-part="flash-burst"
          className="absolute aspect-square w-[34%] -translate-1/2 rounded-full bg-[radial-gradient(circle,#fff_0%,rgba(255,250,235,0.85)_22%,rgba(255,240,200,0)_68%)] opacity-0"
          style={{ left: "57.75%", top: "36.21%" }}
        />
      </div>
      {/* the whole room lights up for an instant */}
      <span data-part="flash-fill" className="absolute inset-0 bg-[#fffaf0] opacity-0" />
    </div>
  );
}

/** The ring light's bulbs that show (round her head and phone), in % of the car. */
const RING_BULBS = [
  ["53.44%", "5.51%"], ["46.68%", "6.10%"], ["60.12%", "6.52%"], ["40.64%", "8.12%"], ["66.09%", "9.07%"], ["36.18%", "11.20%"], ["70.47%", "12.92%"],
  ["32.28%", "16.13%"], ["72.61%", "17.43%"], ["31.09%", "20.58%"], ["73.25%", "21.88%"], ["31.73%", "25.20%"], ["72.85%", "26.21%"], ["34.19%", "29.53%"],
].map(([left, top]) => ({ left, top }));

/** The social icons round her (each floats from its own middle, in % of the car). */
const REELS_ICONS = [
  { src: reelsIconYoutube, origin: "22.50% 37.31%" },
  { src: reelsIconFacebook, origin: "80.01% 38.31%" },
  { src: reelsIconFollow, origin: "79.14% 49.53%" },
  { src: reelsIconClapper, origin: "27.35% 53.74%" },
];

/**
 * Floor 2 · Reels: a creator films a selfie reel in front of her ring light,
 * social icons floating round her. Every 3 seconds she waves (a peace sign,
 * from the elbow), lifts her phone and tilts her head, the ring light shines
 * (the bulbs light up round the ring, then glow together) and the icons pop.
 * She blinks and breathes in between. All her parts are cut from her own
 * artwork, laid out on the car (880 × 1180).
 */
export function ReelsStudioFloor() {
  const ref = useReelsStudio();
  const sizes = "330px";
  return (
    <div ref={ref} className="absolute inset-0">
      <Image src={reelsBackground} alt="" fill sizes={sizes} className="pointer-events-none object-cover" />

      {/* the creator, her ring light and its stand, breathing from her feet */}
      <div data-part="creator" className="absolute inset-0" style={{ transformOrigin: "52.73% 96.57%" }}>
        {/* behind her: the ring light, its stand and the icons stuck on it */}
        <Layer src={reelsRing} sizes={sizes} />
        {/* the ring light, switched on (between the ring and her, so it shines from behind her): each bulb glows, plus a soft halo round the ring */}
        <div
          data-part="ring-halo"
          className="pointer-events-none absolute aspect-square w-[52%] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,244,214,0)_58%,rgba(255,244,214,0.55)_70%,rgba(255,244,214,0)_84%)] opacity-0"
          style={{ left: "52.17%", top: "20.34%" }}
        />
        {RING_BULBS.map((pos, i) => (
          <span
            key={i}
            data-part="bulb"
            className="pointer-events-none absolute aspect-square w-[4%] -translate-1/2 rounded-full bg-[radial-gradient(circle,#fffdf3_0%,#fff3c9_45%,rgba(255,236,170,0)_72%)] opacity-0 shadow-[0_0_10px_4px_rgba(255,232,160,0.75)]"
            style={pos}
          />
        ))}
        <Layer src={reelsBody} sizes={sizes} />
        {REELS_ICONS.map(({ src, origin }) => (
          <div key={src.src} data-part="icon" className="absolute inset-0" style={{ transformOrigin: origin }}>
            <Layer src={src} sizes={sizes} />
          </div>
        ))}
        {/* the peace sign: her forearm and hand, cut exactly round them, turning where her forearm leaves the sleeve */}
        <div data-part="arm-wave" className="absolute inset-0" style={{ transformOrigin: "37.61% 40.63%" }}>
          <Layer src={reelsArmWave} sizes={sizes} />
        </div>
        {/* the phone: forearm, hand and phone, from the elbow */}
        <div data-part="arm-phone" className="absolute inset-0" style={{ transformOrigin: "71.18% 33.51%" }}>
          <Layer src={reelsArmPhone} sizes={sizes} />
        </div>
        <div data-part="head" className="absolute inset-0" style={{ transformOrigin: "51.93% 26.86%" }}>
          <Layer src={reelsHead} sizes={sizes} />
          {/* her eyes, each squashed shut for a blink */}
          <div data-part="eye" className="absolute inset-0" style={{ transformOrigin: "49.47% 21.58%" }}>
            <Layer src={reelsEyeLeft} sizes={sizes} />
          </div>
          <div data-part="eye" className="absolute inset-0" style={{ transformOrigin: "54.64% 20.16%" }}>
            <Layer src={reelsEyeRight} sizes={sizes} />
          </div>
        </div>
      </div>
    </div>
  );
}

type CutPart = { name: string; src: StaticImageData; origin: string };

/**
 * One of the new floor characters (floors 3-8), cut from its own artwork into
 * a puppet laid out on the whole car (880 × 1180), so every layer fills it:
 * the body, the parts that move (an arm, a newspaper...), each turning about
 * its own `origin`, and the head, its eyes cut out on their own so a blink can
 * squash them shut (`eye` parts). `part` names the whole figure for its floor's
 * motion (it breathes and sways from its feet).
 */
function CutCharacter({ part, feet, body, head, headOrigin, eyes, parts, children }: {
  part: string; feet: string; body: StaticImageData; head: StaticImageData; headOrigin: string;
  eyes: { src: StaticImageData; origin: string }[]; parts: CutPart[]; children?: ReactNode;
}) {
  const sizes = "330px";
  return (
    <div data-part={part} className="absolute inset-0" style={{ transformOrigin: feet }}>
      <Layer src={body} sizes={sizes} />
      <div data-part="head" className="absolute inset-0" style={{ transformOrigin: headOrigin }}>
        <Layer src={head} sizes={sizes} />
        {eyes.map(({ src, origin }) => (
          <div key={src.src} data-part="eye" className="absolute inset-0" style={{ transformOrigin: origin }}>
            <Layer src={src} sizes={sizes} />
          </div>
        ))}
        {children}
      </div>
      {parts.map(({ name, src, origin }) => (
        <div key={src.src} data-part={name} className="absolute inset-0" style={{ transformOrigin: origin }}>
          <Layer src={src} sizes={sizes} />
        </div>
      ))}
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

      {/* the designer, refining his AI concepts on a tablet, standing in front of the wall */}
      <CutCharacter part="strategist" feet="50.00% 96.61%" body={floor3Body} head={floor3Head} headOrigin="50.99% 34.22%" eyes={[{ src: floor3EyeLeft, origin: "50.13% 29.44%" }, { src: floor3EyeRight, origin: "53.64% 28.99%" }]} parts={[{ name: "forearm", src: floor3Forearm, origin: "41.07% 45.23%" }]} />
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

      {/* the reader with the morning paper, standing between the paper stacks */}
      <CutCharacter part="reader" feet="50.00% 96.61%" body={floor4Body} head={floor4Head} headOrigin="52.48% 34.43%" eyes={[{ src: floor4EyeLeft, origin: "50.17% 29.00%" }, { src: floor4EyeRight, origin: "54.34% 28.60%" }]} parts={[{ name: "paper", src: floor4Paper, origin: "51.82% 47.37%" }]} />
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

      {/* the host: headphones on, talking into her mic */}
      <CutCharacter part="host" feet="50.00% 96.61%" body={floor5Body} head={floor5Head} headOrigin="52.42% 36.36%" eyes={[{ src: floor5EyeLeft, origin: "52.35% 30.73%" }, { src: floor5EyeRight, origin: "56.59% 30.18%" }]} parts={[{ name: "arm", src: floor5Arm, origin: "65.99% 51.07%" }]} />
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

      {/* the emcee, centre stage: mic in one hand, welcoming everyone in with the other */}
      <CutCharacter part="singer" feet="50.00% 96.61%" body={floor6Body} head={floor6Head} headOrigin="52.89% 34.25%" eyes={[{ src: floor6EyeLeft, origin: "50.67% 28.84%" }, { src: floor6EyeRight, origin: "54.97% 28.54%" }]} parts={[{ name: "arm", src: floor6Arm, origin: "42.82% 37.85%" }]} />
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

      {/* the artist on the carpet, waving */}
      <CutCharacter part="artist" feet="50.00% 96.61%" body={floor7Body} head={floor7Head} headOrigin="50.74% 35.73%" eyes={[]} parts={[{ name: "forearm", src: floor7Forearm, origin: "66.55% 37.39%" }]}>
        {/* her sunglasses: a glint runs across the lenses now and then */}
        <div className="pointer-events-none absolute overflow-hidden rounded-[30%]" style={{ left: "45.69%", top: "28.86%", width: "9.62%", height: "3.16%" }}>
          <span data-part="glint" className="absolute -inset-y-full w-[28%] rotate-[25deg] bg-linear-to-r from-transparent via-white/80 to-transparent opacity-0" style={{ left: "-40%" }} />
        </div>
      </CutCharacter>
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

      {/* the digital strategist, presenting her growth chart on a tablet */}
      <CutCharacter part="strategist" feet="50.00% 96.61%" body={floor8Body} head={floor8Head} headOrigin="54.48% 36.14%" eyes={[{ src: floor8EyeLeft, origin: "52.09% 29.06%" }, { src: floor8EyeRight, origin: "56.60% 28.32%" }]} parts={[{ name: "forearm", src: floor8Forearm, origin: "52.49% 48.91%" }]} />
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
    { src: floor1Room, sizes: "324px" }, { src: floor1Cameraman, sizes: "324px" }, { src: floor1EyeLeft, sizes: "324px" }, { src: floor1EyeRight, sizes: "324px" },
    ...[reelsBackground, reelsRing, reelsBody, reelsHead, reelsEyeLeft, reelsEyeRight, reelsArmWave, reelsArmPhone, reelsIconYoutube, reelsIconFacebook, reelsIconFollow, reelsIconClapper].map((src) => ({ src, sizes: "330px" })),
    ...[aiWall, aiNote1, aiNote2, aiNote3, aiNote4, aiNote5, aiNote6, aiStarBig, aiStarMid, aiStarSmall].map((src) => ({ src, sizes: "330px" })),
    ...[printWall, printSignNew, printSignSale, printSignOpen].map((src) => ({ src, sizes: "330px" })),
    ...[radioWall].map((src) => ({ src, sizes: "330px" })),
    ...RADIO_PANELS.map(({ src }) => ({ src, sizes: "64px" })),
    ...[stageBackground, stageValance].map((src) => ({ src, sizes: "330px" })),
    ...STAGE_CURTAINS.map(({ src }) => ({ src, sizes: "40px" })),
    ...[artistsBackground].map((src) => ({ src, sizes: "330px" })),
    { src: artistsStar, sizes: "150px" },
    ...[digitalWall].map((src) => ({ src, sizes: "330px" })),
    { src: digitalTrend, sizes: "250px" }, { src: digitalHeart, sizes: "48px" }, { src: digitalStar, sizes: "48px" },
    ...[floor3Body, floor3Head, floor3EyeLeft, floor3EyeRight, floor3Forearm, floor4Body, floor4Head, floor4EyeLeft, floor4EyeRight, floor4Paper, floor5Body, floor5Head, floor5EyeLeft, floor5EyeRight, floor5Arm, floor6Body, floor6Head, floor6EyeLeft, floor6EyeRight, floor6Arm, floor7Body, floor7Head, floor7Forearm, floor8Body, floor8Head, floor8EyeLeft, floor8EyeRight, floor8Forearm].map((src) => ({ src, sizes: "330px" })),
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
