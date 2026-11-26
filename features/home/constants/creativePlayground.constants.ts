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
  /** What is typed on the case file's sheet. */
  file: { client: string; campaign: string; services: string; brief: string };
};

/** Dummy campaign artwork, shared round the clients until the real photos arrive. */
const COVERS = [client1File, client2File, client3File, client4File, client5File, client6File, client7File];

/**
 * The case files, one per main client. The first three (Vedvan, Sikka, Eldeco)
 * are in the cabinet, top drawer first (its bottom drawer is "View all
 * projects"; see CABINET_CASES); the other five are in the drawers sliding
 * along the desk's channel (see DESK_CASES).
 */
export const playgroundCases: PlaygroundCase[] = [
  { client: "VedVan", logo: logoVedvan, cover: COVERS[0], file: { client: "VedVan", campaign: "Elemental Living", services: "Creative Services, Website Design & Development", brief: "A digital experience inspired by VedVan's vision of elemental living. From creative brand communication to a thoughtfully designed website, every detail brings the brand's identity to life." } },
  { client: "Sikka", logo: logoSikka, cover: COVERS[1], file: { client: "Sikka", campaign: "A Creative Identity", services: "Creative Services", brief: "A creative approach that gives Sikka a distinctive brand presence. Through thoughtful design and engaging visual communication, we bring consistency and character to every brand touchpoint." } },
  { client: "Eldeco", logo: logoEldeco, cover: COVERS[2], file: { client: "Eldeco", campaign: "Digital Growth", services: "Digital Marketing", brief: "A digital-first approach designed to strengthen Eldeco's online presence. Through strategic marketing and consistent brand communication, we bring the brand closer to its audience." } },
  { client: "Exotica", logo: logoExotica, cover: COVERS[3], file: { client: "Exotica", campaign: "Creating Space for Identity", services: "Creative Services & Digital Marketing", brief: "A distinctive creative direction that brings Exotica's brand personality to life. Through thoughtful design and digital marketing, we create meaningful connections and a memorable brand presence." } },
  { client: "GHD Infra", logo: logoGhdInfra, cover: COVERS[4], file: { client: "GHD Infra", campaign: "Building Brand Presence", services: "Creative Services & Digital Marketing", brief: "A creative and digital approach that builds a stronger brand presence for GHD Infra. From compelling visual communication to strategic digital marketing, every interaction helps shape a consistent brand experience." } },
  { client: "Lumora", logo: logoLumora, cover: COVERS[5], file: { client: "Lumora", campaign: "Digital Experiences", services: "Creative Services, Website Design & Development", brief: "A cohesive brand experience designed to bring Lumora's vision to life. From thoughtful creative communication to a visually engaging, user-friendly website, every detail reflects the brand's identity across digital touchpoints." } },
  { client: "Splendor", logo: logoOnyx, cover: COVERS[6], file: { client: "Splendor", campaign: "Creative Presence", services: "Creative & Digital Marketing", brief: "A creative approach that gives Splendor a distinctive digital presence. From engaging visual communication to strategic digital marketing, every touchpoint is designed to make the brand stand out." } },
  { client: "Sanskar Realty", logo: logoSanskar, cover: COVERS[0], file: { client: "Sanskar Realty", campaign: "Building Digital Connections", services: "Creative Services, Website Design & Development", brief: "A cohesive brand experience created for Sanskar Realty. From impactful creative communication to a user-friendly website, we bring the brand's identity together through design and digital experiences." } },
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
