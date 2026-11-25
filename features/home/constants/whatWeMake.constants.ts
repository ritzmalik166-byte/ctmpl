export const whatWeMakeCopy = {
  label: "What we make",
  heading: "Eight floors. Pick one and ride up.",
  intro: "Tell us what you need and we'll take you to the right floor, or to several at once.",
  /** Under the lobby, with a button down to the contact form. */
  closing: "Not sure which floor? Ask at reception.",
  cta: { label: "Talk to us", href: "#start-a-conversation" },
  directoryTitle: "Building directory",
  /** "8 floors", beside the directory's title. */
  floorCount: (count: number) => `${count} floors`,
  /** Over the floor the lift is at: "Floor 01 · Now showing". */
  nowShowing: (floor: number) => `Floor ${String(floor).padStart(2, "0")} · Now showing`,
  nextFloor: "Next floor",
  aiTag: "AI-powered",
  comingSoon: "Studio opening soon",
} as const;

export type Floor = {
  number: number;
  name: string;
  /** Floors whose work is made with AI get the "AI-POWERED" tag. */
  aiPowered?: boolean;
  /** Shown on the service card when the lift arrives at this floor. */
  description?: string;
};

/** Building directory, top floor first (as on a real lobby board). */
export const floors: Floor[] = [
  {
    number: 8,
    name: "Digital marketing",
    description: "Data-led marketing that brings the right people to your brand and turns visits into leads. We plan it, build it and run it, then report on what moved.",
  },
  {
    number: 7,
    name: "Artist management",
    description: "We connect brands with celebrities, influencers, performers, anchors and entertainers, and look after the booking, the brief and the day itself.",
  },
  {
    number: 6,
    name: "Event management",
    description: "End-to-end events, from the first idea to the last guest leaving. We have organised more than 1000 of them, and we plan each one down to the detail.",
  },
  {
    number: 5,
    name: "Radio advertising",
    description: "Scripts, voice-overs and FM media planning for radio campaigns that build awareness. Radio is where we started, and Red FM 93.5 recognised our work in 2011.",
  },
  {
    number: 4,
    name: "Print advertising",
    description: "Newspaper and magazine ads, brochures and corporate profiles, designed so your message reads clearly and your brand looks like itself.",
  },
  {
    number: 3,
    name: "AI creatives",
    aiPowered: true,
    description: "Campaign concepts, visuals and variations made with generative AI, then refined by our designers and writers so they still feel like your brand. Our generative AI campaign won an AdAura award in the AI & Innovation Excellence category.",
  },
  {
    number: 2,
    name: "Reels",
    aiPowered: true,
    description: "Short vertical video for Instagram, YouTube Shorts and Facebook, scripted, shot and edited quickly, with AI helping where it saves time. Built for local and growing brands.",
  },
  {
    number: 1,
    name: "Brand films and TV ads",
    aiPowered: true,
    description: "Brand films and TV ads, scripted, shot and cut under one roof, made faster with AI. This is also where corporate videos, product films and photography live.",
  },
];

export const floorByNumber = (n: number) => floors.find((f) => f.number === n)!;

/** The floor the lift is on when the section loads (doors open). */
export const INITIAL_FLOOR = 1;

/**
 * Lift artwork geometry, in px of the 564 × 815 lift artwork.
 * The lift is drawn at 428px wide, so everything is placed in % / cqw of it.
 */
export const LIFT = {
  width: 564,
  height: 815,
  /** the open car (doors + floor scenes live here) */
  car: { x: 63, y: 173, width: 433, height: 580 },
  /** floor indicator dial above the doors */
  dial: { cx: 278.5, cy: 99.2, dotRadius: 52, needleLength: 64 },
  /** floor 1 sits lower-left on the dial, floor 8 lower-right, 22.3° apart */
  floorAngle: (floor: number) => 168.2 - (floor - 1) * 22.34,
  /** the "FLOOR n" plate */
  label: { cx: 278, cy: 132.5, fontSize: 14 },
} as const;
