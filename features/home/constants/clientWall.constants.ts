import type { StaticImageData } from "next/image";
// the clients' logos (public/images/website/clients/trimmed); the main clients (in the creative playground's
// filing room: Exotica, GHD Infra, Sanskar, Eldeco, Onyx, Lumora, Sikka) aren't repeated here
import myPropertyFact from "@/public/images/website/clients/trimmed/mpf-bl.webp";
import gaurs from "@/public/images/website/clients/trimmed/prm-11.webp";
import fairfox from "@/public/images/website/clients/trimmed/prm-12.webp";
import eleque from "@/public/images/website/clients/trimmed/prm-14.webp";
import blancoThornton from "@/public/images/website/clients/trimmed/prm-16.webp";
import ats from "@/public/images/website/clients/trimmed/prm-17.webp";
import graphInfra from "@/public/images/website/clients/trimmed/prm-18.webp";
import ashtech from "@/public/images/website/clients/trimmed/prm-19.webp";
import ace from "@/public/images/website/clients/trimmed/prm-20.webp";
import roots from "@/public/images/website/clients/trimmed/prm-3.webp";
import mirage from "@/public/images/website/clients/trimmed/prm-5.webp";
import shubhAnandam from "@/public/images/website/clients/trimmed/prm-6.webp";
import landmark from "@/public/images/website/clients/trimmed/prm-8.webp";
import godrej from "@/public/images/website/clients/trimmed/prm-9.webp";
import rdx from "@/public/images/website/clients/trimmed/rdx-lg.webp";
import greenply from "@/public/images/website/clients/trimmed/scnd-10.webp";
import goldenI from "@/public/images/website/clients/trimmed/scnd-11.webp";
import dnHomes from "@/public/images/website/clients/trimmed/scnd-12.webp";
import devika from "@/public/images/website/clients/trimmed/scnd-13.webp";
import apex from "@/public/images/website/clients/trimmed/scnd-14.webp";
import upUndertaking from "@/public/images/website/clients/trimmed/scnd-15.webp";
import uttarakhand from "@/public/images/website/clients/trimmed/scnd-16.webp";
import orion from "@/public/images/website/clients/trimmed/scnd-17.webp";
import maasters from "@/public/images/website/clients/trimmed/scnd-18.webp";
import samridhi from "@/public/images/website/clients/trimmed/scnd-4.webp";
import rgGroup from "@/public/images/website/clients/trimmed/scnd-5.webp";
import rama from "@/public/images/website/clients/trimmed/scnd-6.webp";
import mmr from "@/public/images/website/clients/trimmed/scnd-7.webp";
import landcraft from "@/public/images/website/clients/trimmed/scnd-8.webp";
import krasa from "@/public/images/website/clients/trimmed/scnd-9.webp";

export const clientWallCopy = {
  label: "The reception wall",
  heading: "Every brand that's walked through our door.",
  intro: "On your way out of the studio, have a look at the reception wall: thirty more brands that have trusted us with their stories, campaigns and launches.",
  /** The paper notice pinned up by the heading. */
  sign: { count: "30+", text: "brands & counting" },
  listLabel: "Our clients",
} as const;

export type WallClient = {
  /** The client's name: its logo's alt text and its frame's nameplate (empty: no plate). */
  name: string;
  logo: StaticImageData;
};

/** Everyone on the line (the three rows take them in turn). */
export const wallClients: WallClient[] = [
  { name: "Gaurs", logo: gaurs },
  { name: "Godrej Properties", logo: godrej },
  { name: "ATS", logo: ats },
  { name: "Greenply", logo: greenply },
  { name: "Fairfox", logo: fairfox },
  { name: "Landmark", logo: landmark },
  { name: "Eleque Infra", logo: eleque },
  { name: "Mirage", logo: mirage },
  { name: "Government of Uttarakhand", logo: uttarakhand },
  { name: "Graph Infra", logo: graphInfra },
  { name: "Ashtech", logo: ashtech },
  { name: "Roots Developers", logo: roots },
  { name: "Shubh Anandam", logo: shubhAnandam },
  { name: "Blanco Thornton", logo: blancoThornton },
  { name: "ACE", logo: ace },
  { name: "RDX Academy", logo: rdx },
  { name: "Golden I", logo: goldenI },
  { name: "Orion Realtors", logo: orion },
  { name: "DN Homes", logo: dnHomes },
  { name: "Maasters Infra", logo: maasters },
  { name: "Devika", logo: devika },
  { name: "Samridhi", logo: samridhi },
  { name: "Apex", logo: apex },
  { name: "RG Group", logo: rgGroup },
  { name: "My Property Fact", logo: myPropertyFact },
  { name: "RAMA", logo: rama },
  { name: "MMR", logo: mmr },
  { name: "LandCraft", logo: landcraft },
  { name: "Krasa", logo: krasa },
  { name: "", logo: upUndertaking },
];

/** The two rows of frames on the wall: who's in each (every other client) and which way it glides. */
export const wallRows = [0, 1].map((row) => ({
  clients: wallClients.filter((_, i) => i % 2 === row),
  direction: row ? 1 : -1,
}));

/**
 * The paper frames, taken in turn: the coloured card each frame is cut from, its tape (washi, translucent), and
 * the tilt it was stuck up at (degrees).
 */
export const frameStyles = [
  { card: "#c8714f", tape: "rgba(247,224,138,0.82)", tilt: -1.6 },
  { card: "#7d9cc4", tape: "rgba(240,200,190,0.82)", tilt: 1.2 },
  { card: "#e0b04f", tape: "rgba(190,220,205,0.85)", tilt: -0.8 },
  { card: "#8fae8b", tape: "rgba(250,236,214,0.85)", tilt: 1.8 },
  { card: "#c9a274", tape: "rgba(200,215,240,0.82)", tilt: -1.2 },
] as const;

/** Where the paper lamps hang along the rail (% of the wall's width). */
export const wallLights = [6, 20, 34, 50, 66, 80, 94] as const;
