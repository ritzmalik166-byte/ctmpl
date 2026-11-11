import type { StaticImageData } from "next/image";
import lanyard1 from "@/public/images/website/home/company-we-keep/lanyard-1.svg";
import lanyard2 from "@/public/images/website/home/company-we-keep/lanyard-2.svg";
import lanyard3 from "@/public/images/website/home/company-we-keep/lanyard-3.svg";
import lanyard4 from "@/public/images/website/home/company-we-keep/lanyard-4.svg";
import lanyard5 from "@/public/images/website/home/company-we-keep/lanyard-5.svg";
import lanyard6 from "@/public/images/website/home/company-we-keep/lanyard-6.svg";

export const companyWeKeepCopy = {
  label: "The company we keep",
  // Title Case written out (not CSS `capitalize`), ready for letter-by-letter animation later
  heading: "Signed In At Reception, Again And Again.",
  intro: "Every brand that works with us gets a visitor pass. Some of these have been in our building for more than a decade.",
  visitor: "Visitor",
  passNumber: "Pass no.",
} as const;

/** One visitor pass hanging from the rail (positions in px of its 208px-wide slot, as in Figma). */
export type VisitorPass = {
  brand: string;
  number: string;
  /** Colour of the pass header (and its lanyard). */
  color: string;
  /** "VISITOR" in dark or light, whichever reads on the header colour. */
  labelColor: string;
  lanyard: { src: StaticImageData; left: number; height: number };
  /** Top of the pass and of its metal clip, and the pass's slight tilt. */
  top: number;
  clipTop: number;
  tilt: number;
};

/** The six passes on a rail, left to right (Figma 75:453; the second rail repeats them). */
export const visitorPasses: VisitorPass[] = [
  { brand: "ICICI", number: "001", color: "#bf5d3a", labelColor: "#292624", lanyard: { src: lanyard1, left: 73, height: 90 }, top: 99, clipTop: 85, tilt: -2.3 },
  { brand: "Tanishq", number: "002", color: "#285f8e", labelColor: "#faf7f0", lanyard: { src: lanyard2, left: 71, height: 133 }, top: 142, clipTop: 128, tilt: -2.2 },
  { brand: "Raymond Group", number: "003", color: "#3f7e5d", labelColor: "#faf7f0", lanyard: { src: lanyard3, left: 76, height: 104 }, top: 113, clipTop: 99, tilt: 0 },
  { brand: "Kotak Life Insurance", number: "004", color: "#b78b27", labelColor: "#292624", lanyard: { src: lanyard4, left: 76, height: 149 }, top: 158, clipTop: 144, tilt: 0 },
  { brand: "Escorts Tractor", number: "005", color: "#87466b", labelColor: "#faf7f0", lanyard: { src: lanyard5, left: 74, height: 96 }, top: 105, clipTop: 91, tilt: -1.1 },
  { brand: "Jaypee Group", number: "006", color: "#3a393e", labelColor: "#faf7f0", lanyard: { src: lanyard6, left: 74, height: 123 }, top: 132, clipTop: 118, tilt: -0.7 },
];

/** Left edge of each pass slot along its rail. */
export const passSlots = [3, 215, 427, 639, 851, 1063] as const;

/** The two rails (left / top in px of the 1440 frame, from the section top). */
export const lanyardRails = [
  { left: 80, top: 434 },
  { left: 79, top: 843 },
] as const;

/** Barcode bar widths, left to right; a bar every 4.4px (as drawn in Figma). */
export const barcodeBars = [2, 1, 1, 1.6, 1, 2, 1.6, 1, 1, 1.6, 2, 1, 1.6, 1, 1, 2, 1, 1, 1.6, 1, 2, 1.6, 1, 1, 1.6, 2, 1, 1.6, 1, 1, 2, 1, 1, 1.6, 1, 2, 1.6, 1, 1, 1.6, 2, 1, 1.6] as const;
