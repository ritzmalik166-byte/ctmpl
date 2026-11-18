/**
 * The filing room's paper cat, drawn as folded paper (like Neha): flat
 * faceted planes, a lit side and a shaded side, cut out and pinned together at
 * the joints. Side view, facing left, in px of a 300 × 220 box; the paws stand
 * on y 212.
 *
 * Each part is a list of shapes; parts nest into joints (see CAT_RIG), each
 * turning about its pivot. Far-side legs are a darker paper, behind the body.
 */

export type CatShape =
  | { poly: string; fill: string }
  | { ellipse: [cx: number, cy: number, rx: number, ry: number]; fill: string }
  | { line: string; stroke: string; width: number };

const L = "#eaa86a"; // lit orange paper
const M = "#da8d50"; // mid
const D = "#c2733d"; // shaded
const S = "#a65d2f"; // stripes
const FL = "#c47a45"; // far side, lit
const FD = "#a7612f"; // far side, shaded
const C1 = "#f5e6cb"; // cream
const C2 = "#e4cca7"; // cream, shaded
const PINK = "#e6a29b";

/** A leg: upper part, lower part and paw, split down the middle into a lit and a shaded fold. */
function leg(x: number, top: number, knee: number, near: boolean, back: boolean) {
  const [lit, dark] = near ? [M, D] : [FL, FD];
  const upper: CatShape[] = back
    ? [
        // the haunch: a big rounded thigh
        { poly: `${x - 18},${top - 12} ${x},${top - 14} ${x},${knee + 4} ${x - 10},${knee - 2}`, fill: near ? L : FL },
        { poly: `${x},${top - 14} ${x + 20},${top - 9} ${x + 16},${knee - 10} ${x + 2},${knee + 4}`, fill: dark },
      ]
    : [
        // the shoulder blade, wide and angled into the body, then the upper leg
        { poly: `${x - 13},${top - 16} ${x + 1},${top - 20} ${x + 1},${knee + 2} ${x - 8},${knee + 2} ${x - 11},${top + 8}`, fill: near ? L : FL },
        { poly: `${x + 1},${top - 20} ${x + 12},${top - 10} ${x + 12},${top + 8} ${x + 9},${knee + 2} ${x + 1},${knee + 2}`, fill: dark },
      ];
  const lower: CatShape[] = [
    { poly: `${x - 8},${knee - 3} ${x},${knee - 3} ${x - 1},203 ${x - 7},203`, fill: lit },
    { poly: `${x},${knee - 3} ${x + 8},${knee - 3} ${x + 6},203 ${x - 1},203`, fill: dark },
    // the paw: a folded cream mitten
    { poly: `${x - 12},212 ${x - 10},203 ${x + 1},200 ${x + 1},212`, fill: near ? C1 : C2 },
    { poly: `${x + 1},200 ${x + 9},202 ${x + 12},212 ${x + 1},212`, fill: C2 },
  ];
  return { upper, lower };
}

const frontNear = leg(110, 126, 166, true, false);
const frontFar = leg(126, 126, 166, false, false);
const backNear = leg(214, 122, 160, true, true);
const backFar = leg(198, 122, 160, false, true);

export const CAT_ART = {
  frontFarUpper: frontFar.upper,
  frontFarLower: frontFar.lower,
  backFarUpper: backFar.upper,
  backFarLower: backFar.lower,

  // the tail, three pieces from the base to the striped tip
  tail1: [
    { poly: "231,106 241,115 263,96 255,86", fill: M },
    { poly: "236,110 241,115 263,96 259,91", fill: D },
    { poly: "245,98 251,103 248,107 242,102", fill: S },
  ],
  tail2: [
    { poly: "253,91 264,94 276,64 265,61", fill: M },
    { poly: "258,92 264,94 276,64 270,63", fill: D },
    { poly: "262,76 271,79 269,84 260,81", fill: S },
  ],
  tail3: [
    { poly: "265,64 276,63 274,40 268,32 263,40", fill: M },
    { poly: "270,63 276,63 274,40 268,32", fill: D },
    { poly: "263,44 274,44 272,36 268,31 264,37", fill: S },
  ],

  body: [
    // back (lit) and belly (shaded), folded along the side
    { poly: "86,112 106,92 150,85 196,87 227,95 241,113 237,128 90,128", fill: L },
    { poly: "90,128 237,128 231,146 204,155 150,159 110,155 94,146", fill: D },
    // the fold catching the light
    { poly: "90,127 237,127 237,129 90,129", fill: "#f3bd85" },
    // tabby stripes down the back
    { poly: "126,88 138,87 132,106", fill: S },
    { poly: "150,85 162,85 156,105", fill: S },
    { poly: "175,86 187,87 181,106", fill: S },
    { poly: "199,89 210,91 204,108", fill: S },
    { poly: "220,95 229,98 223,110", fill: S },
    // cream chest
    { poly: "86,112 101,107 109,131 103,151 94,146 83,128", fill: C1 },
    { poly: "101,107 109,131 103,151 106,128", fill: C2 },
  ],

  head: [
    // far ear, behind: short and soft
    { poly: "33,68 38,40 58,55", fill: D },
    { poly: "38,62 41,46 53,56", fill: PINK },
    // a round face, folded in planes: crown (lit), left cheek, right cheek (shaded)
    { poly: "31,66 45,52 62,48 80,52 94,64 62,71", fill: L },
    { poly: "31,66 62,71 62,113 41,108 28,97 23,81", fill: M },
    { poly: "94,64 101,80 97,97 84,108 62,113 62,71", fill: D },
    // three little forehead stripes
    { poly: "55,51 59,50 57,59", fill: S },
    { poly: "61,49 65,49 63,58", fill: S },
    { poly: "67,50 71,51 69,59", fill: S },
    // near ear
    { poly: "68,55 88,37 94,67", fill: M },
    { poly: "73,56 86,44 89,61", fill: PINK },
    { poly: "88,37 94,67 91,50", fill: D },
    // rosy cheeks
    { ellipse: [34, 98, 5, 3.2], fill: "rgba(238,130,124,0.5)" },
    { ellipse: [84, 98, 6.5, 3.6], fill: "rgba(222,112,106,0.5)" },
    // a small cream muzzle and chin, turned a little towards where it's heading (three-quarter view)
    { poly: "39,95 54,91 70,95 72,103 64,110 55,112 46,110 37,103", fill: C1 },
    { poly: "54,91 70,95 72,103 64,110 55,112", fill: C2 },
    // tiny pink nose and a "w" mouth
    { poly: "49.5,93.5 58.5,93.5 54,99", fill: "#e07f86" },
    { line: "M54,99 Q51.5,104 47.5,101.5 M54,99 Q56.5,104 60.5,101.5", stroke: "#5a3424", width: 1.3 },
    // whiskers
    { line: "M39,100 L14,95 M39,103 L15,105 M70,100 L100,96 M70,103 L99,106", stroke: "#fbf3e3", width: 0.9 },
  ] as CatShape[],

  /** The eyes, apart so they can blink (squashed shut): big and round and green; the far one a little narrower (the face is turned). */
  eyes: [
    { ellipse: [43, 82, 6.2, 7.6], fill: "#3b2a22" },
    { ellipse: [71, 82, 7.6, 7.9], fill: "#3b2a22" },
    { ellipse: [43, 82.5, 5.1, 6.4], fill: "#8fb04f" },
    { ellipse: [71, 82.5, 6.4, 6.7], fill: "#8fb04f" },
  ] as CatShape[],

  /** The pupils and their highlights, apart so they look at what the cat is playing with (forward, by default). */
  pupils: [
    { ellipse: [40.6, 83, 3.4, 4.8], fill: "#231c18" },
    { ellipse: [68.2, 83, 4.2, 5], fill: "#231c18" },
    { ellipse: [39.2, 80, 1.9, 2], fill: "#ffffff" },
    { ellipse: [66.4, 79.8, 2.3, 2.3], fill: "#ffffff" },
    { ellipse: [42.2, 85.4, 0.8, 0.8], fill: "#ffffff" },
    { ellipse: [70, 85.6, 1, 1], fill: "#ffffff" },
  ] as CatShape[],

  /** A big open smile under the nose, shown when it's pleased with itself. */
  smile: [
    { poly: "47.5,100 60.5,100 59,105.5 54,108.5 49,105.5", fill: "#8e3a40" },
    { ellipse: [54, 106, 3.4, 2], fill: "#e8838a" },
    { line: "M46.5,99.5 Q54,101.5 61.5,99.5", stroke: "#5a3424", width: 1.2 },
  ] as CatShape[],

  /** A little round "o" of surprise (something's flying past!). */
  surprise: [
    { ellipse: [54, 104.5, 3.2, 3.8], fill: "#8e3a40" },
    { ellipse: [54, 106, 2, 1.5], fill: "#e8838a" },
  ] as CatShape[],

  frontNearUpper: frontNear.upper,
  frontNearLower: frontNear.lower,
  backNearUpper: backNear.upper,
  backNearLower: backNear.lower,
} satisfies Record<string, CatShape[]>;

/**
 * The joints and their pivots (px of the box). A joint's children ride on it:
 * the lower leg on the upper, the tail's tip on its middle on its base.
 */
export const CAT_PIVOTS = {
  head: [98, 104],
  eyes: [57, 82],
  tail1: [236, 110],
  tail2: [259, 91],
  tail3: [270, 63],
  frontNearUpper: [110, 124],
  frontNearLower: [110, 166],
  frontFarUpper: [126, 124],
  frontFarLower: [126, 166],
  backNearUpper: [212, 118],
  backNearLower: [214, 160],
  backFarUpper: [196, 118],
  backFarLower: [198, 160],
} as const satisfies Record<string, readonly [number, number]>;

export type CatJoint = keyof typeof CAT_PIVOTS;
