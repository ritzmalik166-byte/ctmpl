import type { StaticImageData } from "next/image";
import client1File from "@/public/images/website/home/creative-playground/files/client1_file.webp";
import client2File from "@/public/images/website/home/creative-playground/files/client2_file.webp";
import client3File from "@/public/images/website/home/creative-playground/files/client3_file.webp";
import client4File from "@/public/images/website/home/creative-playground/files/client4_file.webp";

export const creativePlaygroundCopy = {
  label: "Our creative playground",
  // Title Case written out (not CSS `capitalize`), ready for letter-by-letter animation later
  heading: "Every Campaign Gets Its Own Case File.",
  intro: "The filing room is where finished work lives. Pull out a drawer and Neha will open the file and stamp it for you.",
  caseFileTab: "Case File",
  viewAll: "View all projects",
  previous: "Previous project",
  next: "Next project",
} as const;

export type PlaygroundCase = {
  /** Name on the selector button. */
  client: string;
  cover: StaticImageData;
  /** What is typed on the case file's sheet (dummy content for now). */
  file: { number: string; client: string; campaign: string; filedBy: string };
};

/**
 * The case files, top drawer first: drawer 1 holds file 1, and so on down the
 * cabinet. The selector under the room lists the same clients in the same order.
 */
export const playgroundCases: PlaygroundCase[] = [
  { client: "Sanskar", cover: client1File, file: { number: "CTM/2026/01", client: "Sanskar Realty", campaign: "Lotus Heights", filedBy: "The CTM team, Noida" } },
  { client: "Client_Two", cover: client2File, file: { number: "CTM/2026/02", client: "Client Two", campaign: "Coastal Catch", filedBy: "The CTM team, Noida" } },
  { client: "Client_Three", cover: client3File, file: { number: "CTM/2026/03", client: "Client Three", campaign: "Paisley Threads", filedBy: "The CTM team, Delhi" } },
  { client: "Client_Four", cover: client4File, file: { number: "CTM/2026/04", client: "Client Four", campaign: "Rangoli Sweets", filedBy: "The CTM team, Noida" } },
];

/** Labels typed on every case-file sheet. */
export const caseFileLabels = { title: "Case file", client: "Client", campaign: "Campaign", filedBy: "Filed by" } as const;

/** The drawer that stands open when the section loads. */
export const INITIAL_CASE = 0;

/** Cabinet drawers (top of each, in px of the 1440 frame), top to bottom. */
export const cabinetDrawerTops = [552, 683, 813, 943] as const;

/** The coloured file tabs standing up out of the open drawer: left edge, width and colour (left to right). */
export const cabinetTabs = [
  { left: 133, width: 62, color: "#e8c98e" },
  { left: 202, width: 62, color: "#f3eee3" },
  { left: 270, width: 62, color: "#e9b8a6" },
  { left: 339, width: 61, color: "#bfe0d6" },
] as const;

/** Where the photo sits in the case file (px of the 670 × 413 file artwork): a slightly tilted polaroid. */
export const caseFilePhoto = { left: 31.22, top: 35.84, width: 269.73, height: 201.98, rotate: -3 } as const;
/** The typed sheet on the right of the case file, with its shadow (px of the file artwork). */
export const caseFileSheet = { left: 338, top: 14, width: 320, height: 392 } as const;
/** The APPROVED stamp on the case file's paper (px of the file artwork). */
export const caseFileStamp = { left: 426, top: 306, width: 214, height: 88 } as const;
