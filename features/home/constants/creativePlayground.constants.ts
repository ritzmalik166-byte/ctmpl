import type { StaticImageData } from "next/image";
import client1File from "@/public/images/website/home/creative-playground/files/client1_file.webp";
import client2File from "@/public/images/website/home/creative-playground/files/client2_file.webp";
import client3File from "@/public/images/website/home/creative-playground/files/client3_file.webp";
import client4File from "@/public/images/website/home/creative-playground/files/client4_file.webp";
import client5File from "@/public/images/website/home/creative-playground/files/client5_file.webp";
import client6File from "@/public/images/website/home/creative-playground/files/client6_file.webp";
import client7File from "@/public/images/website/home/creative-playground/files/client7_file.webp";
// the main clients' logos (public/images/website/main-clients, with their empty margins trimmed off so they fill the labels)
import logoVedvan from "@/public/images/website/main-clients/trimmed/vedvan-new-logo.webp";
import logoSikka from "@/public/images/website/main-clients/trimmed/sikka.webp";
import logoEldeco from "@/public/images/website/main-clients/trimmed/eldeco-logo.webp";
import logoExotica from "@/public/images/website/main-clients/trimmed/exotica-logo.webp";
import logoGhdInfra from "@/public/images/website/main-clients/trimmed/ghd-infra.webp";
import logoLumora from "@/public/images/website/main-clients/trimmed/lumora-estates.webp";
import logoOnyx from "@/public/images/website/main-clients/trimmed/onyx-splendor.webp";
import logoSanskar from "@/public/images/website/main-clients/trimmed/sanskaar.webp";

export const creativePlaygroundCopy = {
  label: "Our creative playground",
  heading: "Every campaign gets its own case file.",
  intro: "The filing room is where finished work lives. Pull out a drawer and Neha will open the file and stamp it for you.",
  /** The note shown over the almirah as it scrolls into view, until a drawer has been opened. */
  almirahHint: "Click a drawer to open its case file",
  /** The desk's sliding drawers. */
  deskRail: "More case files: drag to browse",
  caseFileTab: "Case File",
  /** Phones: under the case file you flip through. */
  swipeHint: "Tap or swipe the file to turn the page",
  viewAll: "View all projects",
  /** Where "View all projects" (the button and the almirah's bottom drawer) goes: set this once the projects page exists. */
  projectsHref: "#",
  previous: "Previous project",
  next: "Next project",
} as const;

export type PlaygroundCase = {
  /** The client's name (and its drawer's label, for screen readers). */
  client: string;
  /** Its logo, on its drawer's label holder. */
  logo: StaticImageData;
  /** The campaign photo clipped in the case file (dummy artwork for now). */
  cover: StaticImageData;
  /** What is typed on the case file's sheet (dummy content for now). */
  file: { client: string; campaign: string; services: string; brief: string };
};

/** Dummy campaign artwork, shared round the clients until the real photos arrive. */
const COVERS = [client1File, client2File, client3File, client4File, client5File, client6File, client7File];

/**
 * The case files, one per main client. The first three (Vedvan, Sikka, Eldeco)
 * are in the cabinet, top drawer first (its bottom drawer is "View all
 * projects"; see CABINET_CASES); the other five are in the drawers sliding
 * along the desk's channel (see DESK_CASES). Campaigns and briefs are placeholders.
 */
export const playgroundCases: PlaygroundCase[] = [
  { client: "Vedvan", logo: logoVedvan, cover: COVERS[0], file: { client: "Vedvan", campaign: "Elemental living", services: "Launch campaign, print, digital", brief: "A campaign that put Vedvan where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Sikka", logo: logoSikka, cover: COVERS[1], file: { client: "Sikka", campaign: "Homes of distinction", services: "Outdoor, radio, digital", brief: "A campaign that put Sikka where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Eldeco", logo: logoEldeco, cover: COVERS[2], file: { client: "Eldeco", campaign: "Homes, honestly", services: "Print, outdoor, digital", brief: "A campaign that put Eldeco where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Exotica", logo: logoExotica, cover: COVERS[3], file: { client: "Exotica", campaign: "Creating space for life", services: "Brand identity, print, digital", brief: "A campaign that put Exotica where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "GHD Infra", logo: logoGhdInfra, cover: COVERS[4], file: { client: "GHD Infra", campaign: "Your dream, we deliver", services: "Launch campaign, outdoor", brief: "A campaign that put GHD Infra where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Lumora Estates", logo: logoLumora, cover: COVERS[5], file: { client: "Lumora Estates", campaign: "Light up every day", services: "Brand identity, digital", brief: "A campaign that put Lumora Estates where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Onyx by Splendor", logo: logoOnyx, cover: COVERS[6], file: { client: "Onyx by Splendor", campaign: "The Black Edition", services: "Launch campaign, social, events", brief: "A campaign that put Onyx by Splendor where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Sanskar Realty", logo: logoSanskar, cover: COVERS[0], file: { client: "Sanskar Realty", campaign: "Lotus Heights launch", services: "Brand film, print, outdoor", brief: "A campaign that put Sanskar Realty where its people already look: one clear idea, carried from the first sketch to the last screen." } },
];

/** Which files are in the cabinet (its drawers, top to bottom) and which slide along the desk (in order). */
export const CABINET_CASES = [0, 1, 2] as const;
export const DESK_CASES = playgroundCases.map((_, i) => i).slice(CABINET_CASES.length);

/** Labels typed on every case-file sheet. */
export const caseFileLabels = { title: "Case file", client: "Client", campaign: "Campaign", services: "Work", brief: "Brief" } as const;

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
