/** "Fresh from our minds" (Figma 75:1209): the latest articles, laid out as The CTM Times. */
export const newspaperCopy = {
  label: "Fresh from our minds",
  heading: "Today's paper, still warm from the press.",
  readFullStory: "Read the full story",
  readMore: "Read More",
};

export type Article = {
  tag: string;
  title: string;
  excerpt: string;
  href: string;
};

/** The front page's lead story (headline split: the first part in red). */
export const leadStory = {
  tag: "Real estate · 01 Nov 2026",
  headline: { highlight: "Creative marketing", rest: " for real estate" },
  excerpt: "What makes a home buyer stop, look twice and call. A field guide from the projects we have launched across the NCR.",
  href: "#",
};

/** The other stories: one wide across the top right, two in columns below it. */
export const stories: Article[] = [
  {
    tag: "Real estate · 01 Nov 2026",
    title: "How to find the right creative digital marketing agency",
    excerpt: "What makes a home buyer stop, look twice and call. A field guide from the projects we have launched across the NCR.",
    href: "#",
  },
  {
    tag: "Real estate · 01 Nov 2026",
    title: "How to find the right creative digital marketing agency",
    excerpt: "What makes a home buyer stop, look twice and call. A field guide from the projects we have launched across the NCR.",
    href: "#",
  },
  {
    tag: "Real estate · 01 Nov 2026",
    title: "How to find the right creative digital marketing agency",
    excerpt: "What makes a home buyer stop, look twice and call. A field guide from the projects we have launched across the NCR.",
    href: "#",
  },
];

/** A box in px of the 1440 section: where a tilted piece sits (its rotated bounds). */
export type Box = { left: number; top: number; width: number; height: number };

/**
 * Where each part of a story sits in its block (Figma frames 75:1230 wide,
 * 75:1242 / 75:1236 columns): the tilted boxes, and the text width inside.
 */
export const storyLayouts = {
  wide: {
    width: 581,
    height: 218,
    tag: { left: 0, top: 0, width: 173.65, height: 26.03 },
    title: { left: 0, top: 12.03, width: 540.26, height: 82.09, text: 538.18 },
    excerpt: { left: 0, top: 78, width: 535.45, height: 75.86, text: 533.67 },
    more: { left: 0, top: 163, width: 95.44, height: 34.88 },
  },
  column: {
    width: 279.44,
    height: 280.88,
    tag: { left: 0, top: 0, width: 173.65, height: 26.03 },
    title: { left: 0, top: 25.91, width: 276.87, height: 95.18, text: 273 },
    excerpt: { left: 0, top: 122.55, width: 279.44, height: 110.25, text: 274.79 },
    more: { left: 0, top: 246, width: 95.44, height: 34.88 },
  },
} as const;

/** The stories on the page: the wide one, then the two columns (left, right). */
export const storyPlacements = [
  { layout: "wide", left: 664, top: 532 },
  { layout: "column", left: 664, top: 750 },
  { layout: "column", left: 976, top: 750 },
] as const;
