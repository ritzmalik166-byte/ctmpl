export const whatWeMakeCopy = {
  label: "What we make",
  // Title Case written out (not CSS `capitalize`), ready for letter-by-letter animation later
  heading: "Eight Floors. Pick One And Ride Up.",
  directoryTitle: "Building directory",
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
  { number: 8, name: "Digital", description: "Social, search and performance campaigns, powered by AI. Reach. Convert. Grow." },
  { number: 7, name: "Artists", description: "Artists, influencers and brand faces, matched with AI. Discover. Sign. Shine." },
  { number: 6, name: "Events", description: "From concept to celebration, powered by AI. Plan. Promote. Experience." },
  { number: 5, name: "Radio", description: "Broadcast, record and create, powered by AI. On air. Always." },
  { number: 4, name: "Print", description: "Premium print solutions, powered by AI for bigger ideas." },
  { number: 3, name: "AI creatives", aiPowered: true, description: "Generate stunning visuals, designs and more with cutting-edge AI tools." },
  { number: 2, name: "Reels", aiPowered: true, description: "Short-form, high-impact reels, powered by AI. Create. Edit. Go Viral." },
  {
    number: 1,
    name: "Brand films",
    aiPowered: true,
    description: "Brand films and TV ads, scripted, shot and cut under one roof, made faster with AI.",
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
