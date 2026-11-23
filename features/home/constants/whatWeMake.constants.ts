export const whatWeMakeCopy = {
  label: "What we make",
  heading: "Eight floors. One lift. Press any button.",
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
  { number: 8, name: "Digital", description: "Websites, SEO, social and performance campaigns that bring people to your door and keep them coming back." },
  { number: 7, name: "Artists", description: "Artist and talent management and bookings for events, brand shoots and launches." },
  { number: 6, name: "Events", description: "Launches, corporate events, activations and shows, planned and run on the ground. 1000+ and counting." },
  { number: 5, name: "Radio", description: "Scripts, jingles and airtime that put your message in people's ears across the region." },
  { number: 4, name: "Print", description: "Brochures, press ads, packaging and collateral, designed to be picked up and kept." },
  { number: 3, name: "AI creatives", aiPowered: true, description: "Faster concepts, visuals and variations, made with AI and finished by our designers." },
  { number: 2, name: "Reels", aiPowered: true, description: "Short vertical video for Instagram, YouTube Shorts and beyond, made quickly and made to be watched." },
  {
    number: 1,
    name: "Brand films",
    aiPowered: true,
    description: "Scripted, shot and cut under one roof, made faster with AI.",
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
