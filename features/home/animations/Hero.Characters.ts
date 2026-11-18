"use client";

import gsap from "gsap";
import { blinkShut, breathe, usePuppet, type PartQuery } from "./puppet";

/** The receptionist's side of her phone call, a line at a time, with a pause to listen after each. */
const CALL = [
  "Hello, Creative Thinks Media!",
  "Yes, of course. Let me check that for you.",
  "We can meet on Monday, at ten.",
  "Perfect! See you then. Bye bye!",
];

/** The woman on the left, welcoming the visitor in, a line at a time. */
const WELCOME = [
  "Welcome to Creative Thinks Media!",
  "Come on in, the team is just inside.",
  "Would you like a quick tour?",
  "Have a look around, enjoy!",
];

/** Mouth shapes. Each speaker's own artwork is one of them; the others are laid over it. */
type Viseme = "closed" | "small" | "mid" | "wide" | "round";
const VISEMES: Viseme[] = ["closed", "small", "mid", "wide", "round"];

/** The mouth shape each letter makes, roughly (vowels open it; m, b and p close it). */
function shapeOf(ch: string): Viseme {
  if (ch === "a") return "wide";
  if (ch === "e") return "mid";
  if ("ouw".includes(ch)) return "round";
  if ("mbp".includes(ch)) return "closed";
  return "small"; // i, y and the rest of the consonants: lips just parted
}

/** A line as mouth shapes in time (s): vowels held longer, a beat at commas, longer at full stops. */
function lipSync(line: string) {
  const out: { shape: Viseme; length: number }[] = [];
  const push = (shape: Viseme, length: number) => {
    const last = out.at(-1);
    if (last && last.shape === shape) last.length += length * 0.6;
    else out.push({ shape, length });
  };
  for (const ch of line.toLowerCase()) {
    if (ch === " ") push("small", 0.04);
    else if (ch === ",") push("closed", 0.22);
    else if (".!?".includes(ch)) push("closed", 0.4);
    else if (/[a-z]/.test(ch)) push(shapeOf(ch), "aeiou".includes(ch) ? gsap.utils.random(0.09, 0.13) : gsap.utils.random(0.05, 0.07));
  }
  return out;
}

type Talker = {
  /** The part that moves with what they say (head or whole figure). */
  part: string;
  /** Their mouth-shape overlays are `${mouth}-${shape}`; `own` is the shape their artwork already has. */
  mouth: string;
  own: Viseme;
  lines: string[];
  /** How much the head moves (1 = the receptionist's). */
  motion: number;
  /** When they start, and how long they pause to listen after each line (s). */
  delay: number;
  listen: [number, number];
};

/**
 * Someone talking: each line said with their lips shaping the words (a mouth
 * shape per sound, in time) and their head moving with it; then they listen,
 * lips together, smiling, with a tilt and an "mm-hm" nod or two.
 */
function talking(q: PartQuery, { part, mouth, own, lines, motion: k, delay, listen }: Talker) {
  const who = q(part);
  const overlays = Object.fromEntries(VISEMES.filter((v) => v !== own).map((v) => [v, q(`${mouth}-${v}`)])) as Partial<Record<Viseme, Element[]>>;
  const all = Object.values(overlays).flat();
  const tl = gsap.timeline({ repeat: -1, delay });
  const show = (shape: Viseme, at: number) => {
    tl.set(all, { opacity: 0 }, at);
    if (shape !== own) tl.set(overlays[shape]!, { opacity: 1 }, at);
  };

  gsap.set(all, { opacity: 0 });
  let t = 0;
  // listening first, lips together, smiling
  show("closed", t);
  t += 1.2;
  lines.forEach((line, i) => {
    // they talk: a slight lift of the head into it, then small nods on the open vowels
    tl.to(who, { rotation: (i % 2 ? 1.2 : -1) * k, yPercent: -0.15 * k, duration: 0.35, ease: "sine.out" }, t - 0.15);
    let nod = 0;
    for (const { shape, length } of lipSync(line)) {
      show(shape, t);
      if (shape === "wide" && nod++ % 2 === 0) {
        tl.to(who, { rotation: `+=${0.7 * k}`, duration: 0.12, ease: "sine.out", yoyo: true, repeat: 1 }, t);
      }
      t += length;
    }
    // …and listen: lips together, smiling, a tilt and an "mm-hm" nod or two
    show("closed", t);
    tl.to(who, { rotation: (i % 2 ? -1.4 : 1.4) * k, yPercent: 0, duration: 0.6, ease: "sine.inOut" }, t + 0.1).to(
      who,
      { yPercent: 0.35 * k, duration: 0.18, ease: "sine.inOut", yoyo: true, repeat: 3 },
      t + 0.9
    );
    t += gsap.utils.random(...listen);
  });
  // (back where they started, for the next round)
  tl.to(who, { rotation: 0, yPercent: 0, duration: 0.5, ease: "sine.inOut" }, t - 0.5);
  return tl;
}

/**
 * The reception, gently alive: everyone breathes and blinks; the receptionist
 * talks on the phone, and the woman on the left welcomes you in.
 */
export function useReception() {
  return usePuppet((q) => {
    const [woman, clerk, man] = [q("woman"), q("clerk"), q("man")];

    const call = talking(q, { part: "clerk", mouth: "mouth", own: "mid", lines: CALL, motion: 1, delay: 0.8, listen: [1.8, 2.8] });
    // (she turns from her feet, so her movements are smaller; she starts once the receptionist has said hello)
    const welcome = talking(q, { part: "woman", mouth: "woman-mouth", own: "closed", lines: WELCOME, motion: 0.4, delay: 3.6, listen: [2.6, 3.8] });

    // the man breaks into a broad smile (lips closed) every so often, holds it, and eases back
    const smile = q("man-smile");
    gsap.set(smile, { opacity: 0 });
    // (a long run of smiles, each after its own wait and held its own while, so it never feels on a loop)
    const grin = gsap.timeline({ repeat: -1, delay: 2.5 });
    for (let i = 0; i < 8; i++) {
      grin
        .to(smile, { opacity: 1, duration: 0.35, ease: "sine.out" }, `+=${gsap.utils.random(4, 8)}`)
        .to(smile, { opacity: 0, duration: 0.5, ease: "sine.inOut" }, `+=${gsap.utils.random(2, 3.6)}`);
    }

    // each blinks on their own, now and then
    const blinks = ["woman-eyes", "clerk-eyes", "man-eyes"].map((part) => blinkShut(q(part)));

    return [call, welcome, grin, ...blinks, breathe(woman), breathe(clerk), breathe(man)];
  });
}
