import type { StaticImageData } from "next/image";
import client1File from "@/public/images/website/home/creative-playground/files/client1_file.webp";
import client2File from "@/public/images/website/home/creative-playground/files/client2_file.webp";
import client3File from "@/public/images/website/home/creative-playground/files/client3_file.webp";
import client4File from "@/public/images/website/home/creative-playground/files/client4_file.webp";
import client5File from "@/public/images/website/home/creative-playground/files/client5_file.webp";
import client6File from "@/public/images/website/home/creative-playground/files/client6_file.webp";
import client7File from "@/public/images/website/home/creative-playground/files/client7_file.webp";

export const creativePlaygroundCopy = {
  label: "Our creative playground",
  // Title Case written out (not CSS `capitalize`), ready for letter-by-letter animation later
  heading: "Every Campaign Gets Its Own Case File.",
  intro: "The filing room is where finished work lives. Pull out a drawer and Neha will open the file and stamp it for you.",
  caseFileTab: "Case File",
  /** Phones: under the case file you flip through. */
  swipeHint: "Tap or swipe the file to turn the page",
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
 * The case files. Files 1–4 are in the cabinet, top drawer first (drawer 1
 * holds file 1, and so on down); files 5–7 are in the desk's three drawers,
 * left to right (see CABINET_CASES / DESK_CASES). The selector under the room
 * lists all of them in this order.
 */
export const playgroundCases: PlaygroundCase[] = [
  { client: "Sanskar", cover: client1File, file: { number: "CTM/2026/01", client: "Sanskar Realty", campaign: "Lotus Heights", filedBy: "The CTM team, Noida" } },
  { client: "Client_Two", cover: client2File, file: { number: "CTM/2026/02", client: "Client Two", campaign: "Coastal Catch", filedBy: "The CTM team, Noida" } },
  { client: "Client_Three", cover: client3File, file: { number: "CTM/2026/03", client: "Client Three", campaign: "Paisley Threads", filedBy: "The CTM team, Delhi" } },
  { client: "Client_Four", cover: client4File, file: { number: "CTM/2026/04", client: "Client Four", campaign: "Rangoli Sweets", filedBy: "The CTM team, Noida" } },
  { client: "Client_Five", cover: client5File, file: { number: "CTM/2026/05", client: "Client Five", campaign: "Kite Festival", filedBy: "The CTM team, Noida" } },
  { client: "Client_Six", cover: client6File, file: { number: "CTM/2026/06", client: "Client Six", campaign: "Peacock Silk", filedBy: "The CTM team, Delhi" } },
  { client: "Client_Seven", cover: client7File, file: { number: "CTM/2026/07", client: "Client Seven", campaign: "Monsoon Chai", filedBy: "The CTM team, Noida" } },
];

/** Which files are in the cabinet (its drawers, top to bottom) and which in the desk (its drawers, left to right). */
export const CABINET_CASES = [0, 1, 2, 3] as const;
export const DESK_CASES = [4, 5, 6] as const;

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
