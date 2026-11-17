"use client";

import { useId, type ReactNode } from "react";
import { CAT_ART, type CatJoint, type CatShape } from "../constants/playgroundCat.art";

/** One cut-out shape of the cat. */
function Shape({ shape }: { shape: CatShape }) {
  if ("poly" in shape) return <polygon points={shape.poly} fill={shape.fill} />;
  if ("ellipse" in shape) {
    const [cx, cy, rx, ry] = shape.ellipse;
    return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={shape.fill} />;
  }
  return <path d={shape.line} stroke={shape.stroke} strokeWidth={shape.width} fill="none" strokeLinecap="round" />;
}

function Shapes({ art }: { art: CatShape[] }) {
  return art.map((shape, i) => <Shape key={i} shape={shape} />);
}

/** A piece of the cat on its joint (`data-j`), lifted off the one below by a soft shadow (filter `lift`). */
function Piece({ joint, art, lift, children }: { joint?: CatJoint; art: CatShape[]; lift: string; children?: ReactNode }) {
  return (
    <g data-j={joint} filter={`url(#${lift})`}>
      <Shapes art={art} />
      {children}
    </g>
  );
}

/** A leg: the upper part on its shoulder or hip, the lower part (and paw) on its elbow or knee. */
function Leg({ upper, lower, lift }: { upper: CatJoint; lower: CatJoint; lift: string }) {
  return (
    <Piece joint={upper} art={CAT_ART[upper]} lift={lift}>
      <Piece joint={lower} art={CAT_ART[lower]} lift={lift} />
    </Piece>
  );
}

/**
 * The studio's paper cat (the filing room's and Kind Words'), folded paper like
 * the other characters (see playgroundCat.art): body, head, three-piece tail
 * and four two-piece legs are separate cut-outs on joints (`data-j`), each
 * lifted off the one below by a soft shadow, with paper grain over it all. Its
 * pupils (`data-gaze`) look at things; its smile (`data-smile`) shows when it's
 * pleased with itself, its "o" (`data-surprise`) when something surprises it. Moved by createCatRig (animations/paperCat).
 *
 * `data-cat` is its box (placed by its top left, in px of the scene), turned
 * round by `data-flip`; its shadow (`data-cat-shadow`) stays on the floor when it
 * leaps. Starts hidden unless `visible`.
 */
export function PaperCat({ width, height, visible = false }: { width: number | string; height: number | string; visible?: boolean }) {
  // ids of its filters, unique on the page (two cats, and SSR-safe)
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [lift, paper] = [`cat-lift-${uid}`, `cat-paper-${uid}`];

  return (
    <div data-cat className={visible ? "absolute top-0 left-0" : "absolute top-0 left-0 opacity-0"} style={{ width, height }}>
      <span data-cat-shadow className="absolute -bottom-[4px] left-[14%] h-[12px] w-[74%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(60,40,20,0.34),transparent)]" />
      <div data-flip className="absolute inset-0">
        <svg viewBox="0 0 300 220" className="absolute inset-0 size-full overflow-visible">
          <defs>
            <filter id={lift} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0.8" dy="1.6" stdDeviation="1.1" floodColor="#3c2410" floodOpacity="0.3" />
            </filter>
            {/* paper grain over the whole cat */}
            <filter id={paper} x="-10%" y="-30%" width="120%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} result="n" />
              <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0.22 0" result="g" />
              <feComposite in="g" in2="SourceGraphic" operator="in" result="grain" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="grain" />
              </feMerge>
            </filter>
          </defs>
          <g filter={`url(#${paper})`}>
            <g data-j="figure">
              <Leg upper="frontFarUpper" lower="frontFarLower" lift={lift} />
              <Leg upper="backFarUpper" lower="backFarLower" lift={lift} />
              <Piece joint="tail1" art={CAT_ART.tail1} lift={lift}>
                <Piece joint="tail2" art={CAT_ART.tail2} lift={lift}>
                  <Piece joint="tail3" art={CAT_ART.tail3} lift={lift} />
                </Piece>
              </Piece>
              <Piece art={CAT_ART.body} lift={lift} />
              <Piece joint="head" art={CAT_ART.head} lift={lift}>
                <g data-j="eyes">
                  <Shapes art={CAT_ART.eyes} />
                  {/* the pupils follow what it's looking at */}
                  <g data-gaze>
                    <Shapes art={CAT_ART.pupils} />
                  </g>
                </g>
                {/* a little "o" of surprise */}
                <g data-surprise opacity={0}>
                  <Shapes art={CAT_ART.surprise} />
                </g>
                {/* a big open smile, when it's pleased with itself */}
                <g data-smile opacity={0}>
                  <Shapes art={CAT_ART.smile} />
                </g>
              </Piece>
              <Leg upper="backNearUpper" lower="backNearLower" lift={lift} />
              <Leg upper="frontNearUpper" lower="frontNearLower" lift={lift} />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
