import type { StaticImageData } from "next/image";
import client1File from "@/public/images/website/home/creative-playground/files/client1_file.webp";
import client2File from "@/public/images/website/home/creative-playground/files/client2_file.webp";
import client3File from "@/public/images/website/home/creative-playground/files/client3_file.webp";
import client4File from "@/public/images/website/home/creative-playground/files/client4_file.webp";
import client5File from "@/public/images/website/home/creative-playground/files/client5_file.webp";
import client6File from "@/public/images/website/home/creative-playground/files/client6_file.webp";
import client7File from "@/public/images/website/home/creative-playground/files/client7_file.webp";
// the clients' logos (public/images/website/clients, with their empty margins trimmed off so they fill the labels)
import logoPrm2 from "@/public/images/website/clients/trimmed/prm-2.webp";
import logoPrm4 from "@/public/images/website/clients/trimmed/prm-4.webp";
import logoPrm9 from "@/public/images/website/clients/trimmed/prm-9.webp";
import logoPrm11 from "@/public/images/website/clients/trimmed/prm-11.webp";
import logoExoticaLogo from "@/public/images/website/clients/trimmed/exotica-logo.webp";
import logoMpfBl from "@/public/images/website/clients/trimmed/mpf-bl.webp";
import logoPrm10 from "@/public/images/website/clients/trimmed/prm-10.webp";
import logoPrm12 from "@/public/images/website/clients/trimmed/prm-12.webp";
import logoPrm14 from "@/public/images/website/clients/trimmed/prm-14.webp";
import logoPrm16 from "@/public/images/website/clients/trimmed/prm-16.webp";
import logoPrm17 from "@/public/images/website/clients/trimmed/prm-17.webp";
import logoPrm18 from "@/public/images/website/clients/trimmed/prm-18.webp";
import logoPrm19 from "@/public/images/website/clients/trimmed/prm-19.webp";
import logoPrm20 from "@/public/images/website/clients/trimmed/prm-20.webp";
import logoPrm22 from "@/public/images/website/clients/trimmed/prm-22.webp";
import logoPrm3 from "@/public/images/website/clients/trimmed/prm-3.webp";
import logoPrm5 from "@/public/images/website/clients/trimmed/prm-5.webp";
import logoPrm6 from "@/public/images/website/clients/trimmed/prm-6.webp";
import logoPrm7 from "@/public/images/website/clients/trimmed/prm-7.webp";
import logoPrm8 from "@/public/images/website/clients/trimmed/prm-8.webp";
import logoRdxLg from "@/public/images/website/clients/trimmed/rdx-lg.webp";
import logoScnd10 from "@/public/images/website/clients/trimmed/scnd-10.webp";
import logoScnd11 from "@/public/images/website/clients/trimmed/scnd-11.webp";
import logoScnd12 from "@/public/images/website/clients/trimmed/scnd-12.webp";
import logoScnd13 from "@/public/images/website/clients/trimmed/scnd-13.webp";
import logoScnd14 from "@/public/images/website/clients/trimmed/scnd-14.webp";
import logoScnd15 from "@/public/images/website/clients/trimmed/scnd-15.webp";
import logoScnd16 from "@/public/images/website/clients/trimmed/scnd-16.webp";
import logoScnd17 from "@/public/images/website/clients/trimmed/scnd-17.webp";
import logoScnd18 from "@/public/images/website/clients/trimmed/scnd-18.webp";
import logoScnd3 from "@/public/images/website/clients/trimmed/scnd-3.webp";
import logoScnd4 from "@/public/images/website/clients/trimmed/scnd-4.webp";
import logoScnd5 from "@/public/images/website/clients/trimmed/scnd-5.webp";
import logoScnd6 from "@/public/images/website/clients/trimmed/scnd-6.webp";
import logoScnd7 from "@/public/images/website/clients/trimmed/scnd-7.webp";
import logoScnd8 from "@/public/images/website/clients/trimmed/scnd-8.webp";
import logoScnd9 from "@/public/images/website/clients/trimmed/scnd-9.webp";

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
 * The case files, one per client. The first three are in the cabinet, top
 * drawer first (its bottom drawer is "View all projects"; see CABINET_CASES); the rest are in the drawers sliding along
 * the desk's channel (see DESK_CASES). Campaigns and briefs are placeholders.
 */
export const playgroundCases: PlaygroundCase[] = [
  { client: "Sanskar Realty", logo: logoPrm2, cover: COVERS[0], file: { client: "Sanskar Realty", campaign: "Lotus Heights launch", services: "Brand film, print, outdoor", brief: "A campaign that put Sanskar Realty where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Onyx by Splendor", logo: logoPrm4, cover: COVERS[1], file: { client: "Onyx by Splendor", campaign: "The Black Edition", services: "Launch campaign, social, events", brief: "A campaign that put Onyx by Splendor where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Godrej Properties", logo: logoPrm9, cover: COVERS[2], file: { client: "Godrej Properties", campaign: "Homes that grow with you", services: "Digital, print, site branding", brief: "A campaign that put Godrej Properties where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Gaurs", logo: logoPrm11, cover: COVERS[3], file: { client: "Gaurs", campaign: "Your own world", services: "Outdoor, radio, social", brief: "A campaign that put Gaurs where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Exotica", logo: logoExoticaLogo, cover: COVERS[4], file: { client: "Exotica", campaign: "Creating space for life", services: "Brand identity, print, digital", brief: "A campaign that put Exotica where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "My Property Fact", logo: logoMpfBl, cover: COVERS[5], file: { client: "My Property Fact", campaign: "Know before you buy", services: "Content, SEO, social", brief: "A campaign that put My Property Fact where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "GHD Infra", logo: logoPrm10, cover: COVERS[6], file: { client: "GHD Infra", campaign: "Your dream, we deliver", services: "Launch campaign, outdoor", brief: "A campaign that put GHD Infra where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Fairfox", logo: logoPrm12, cover: COVERS[0], file: { client: "Fairfox", campaign: "The address of calm", services: "Brochure, print, digital", brief: "A campaign that put Fairfox where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Eleque Infra", logo: logoPrm14, cover: COVERS[1], file: { client: "Eleque Infra", campaign: "Built on trust", services: "Brand identity, social", brief: "A campaign that put Eleque Infra where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Blanco Thornton", logo: logoPrm16, cover: COVERS[2], file: { client: "Blanco Thornton", campaign: "Quiet luxury", services: "Brand film, print", brief: "A campaign that put Blanco Thornton where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "ATS", logo: logoPrm17, cover: COVERS[3], file: { client: "ATS", campaign: "The better way home", services: "Outdoor, digital, events", brief: "A campaign that put ATS where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Graph Infra", logo: logoPrm18, cover: COVERS[4], file: { client: "Graph Infra", campaign: "Rising together", services: "Launch campaign, print", brief: "A campaign that put Graph Infra where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Ashtech", logo: logoPrm19, cover: COVERS[5], file: { client: "Ashtech", campaign: "Engineered to last", services: "Corporate film, digital", brief: "A campaign that put Ashtech where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "ACE", logo: logoPrm20, cover: COVERS[6], file: { client: "ACE", campaign: "Fulfilling ACEpirations", services: "Outdoor, radio, social", brief: "A campaign that put ACE where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Eldeco", logo: logoPrm22, cover: COVERS[0], file: { client: "Eldeco", campaign: "Homes, honestly", services: "Print, outdoor, digital", brief: "A campaign that put Eldeco where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Roots Developers", logo: logoPrm3, cover: COVERS[1], file: { client: "Roots Developers", campaign: "Where life finds its foundation", services: "Brand identity, social", brief: "A campaign that put Roots Developers where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Mirage", logo: logoPrm5, cover: COVERS[2], file: { client: "Mirage", campaign: "A world apart", services: "Brochure, site branding", brief: "A campaign that put Mirage where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Shubh Anandam", logo: logoPrm6, cover: COVERS[3], file: { client: "Shubh Anandam", campaign: "Joy, at home", services: "Launch campaign, print", brief: "A campaign that put Shubh Anandam where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Lumora Estates", logo: logoPrm7, cover: COVERS[4], file: { client: "Lumora Estates", campaign: "Light up every day", services: "Brand identity, digital", brief: "A campaign that put Lumora Estates where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Landmark", logo: logoPrm8, cover: COVERS[5], file: { client: "Landmark", campaign: "You drive us", services: "Outdoor, social", brief: "A campaign that put Landmark where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "RDX Academy", logo: logoRdxLg, cover: COVERS[6], file: { client: "RDX Academy", campaign: "Learn. Lead. Win.", services: "Admissions campaign, social", brief: "A campaign that put RDX Academy where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Greenply", logo: logoScnd10, cover: COVERS[0], file: { client: "Greenply", campaign: "Green inside", services: "Trade campaign, events", brief: "A campaign that put Greenply where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Golden I", logo: logoScnd11, cover: COVERS[1], file: { client: "Golden I", campaign: "Shop, work, live", services: "Launch campaign, outdoor", brief: "A campaign that put Golden I where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "DN Homes", logo: logoScnd12, cover: COVERS[2], file: { client: "DN Homes", campaign: "Space to be you", services: "Print, digital", brief: "A campaign that put DN Homes where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Devika", logo: logoScnd13, cover: COVERS[3], file: { client: "Devika", campaign: "The Devika address", services: "Brand film, social", brief: "A campaign that put Devika where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Apex", logo: logoScnd14, cover: COVERS[4], file: { client: "Apex", campaign: "Above the rest", services: "Brand identity, print", brief: "A campaign that put Apex where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Vidyut Vitran Nigam", logo: logoScnd15, cover: COVERS[5], file: { client: "Vidyut Vitran Nigam", campaign: "Power to every home", services: "Public awareness, print", brief: "A campaign that put Vidyut Vitran Nigam where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Uttarakhand Government", logo: logoScnd16, cover: COVERS[6], file: { client: "Uttarakhand Government", campaign: "Devbhoomi calling", services: "Tourism campaign, outdoor", brief: "A campaign that put Uttarakhand Government where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Orion Realtors", logo: logoScnd17, cover: COVERS[0], file: { client: "Orion Realtors", campaign: "Reach for the stars", services: "Digital, social", brief: "A campaign that put Orion Realtors where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Maasters Infra", logo: logoScnd18, cover: COVERS[1], file: { client: "Maasters Infra", campaign: "Developing masterpieces", services: "Launch campaign, print", brief: "A campaign that put Maasters Infra where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Sikka", logo: logoScnd3, cover: COVERS[2], file: { client: "Sikka", campaign: "Homes of distinction", services: "Outdoor, radio, digital", brief: "A campaign that put Sikka where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Samridhi", logo: logoScnd4, cover: COVERS[3], file: { client: "Samridhi", campaign: "Your property, your pride", services: "Print, site branding", brief: "A campaign that put Samridhi where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "RG Group", logo: logoScnd5, cover: COVERS[4], file: { client: "RG Group", campaign: "Built around you", services: "Brand identity, social", brief: "A campaign that put RG Group where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "RAMA", logo: logoScnd6, cover: COVERS[5], file: { client: "RAMA", campaign: "Cool ideas, together", services: "Events, print", brief: "A campaign that put RAMA where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "MMR", logo: logoScnd7, cover: COVERS[6], file: { client: "MMR", campaign: "Building beyond excellence", services: "Corporate film, digital", brief: "A campaign that put MMR where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "LandCraft", logo: logoScnd8, cover: COVERS[0], file: { client: "LandCraft", campaign: "Crafted for living", services: "Outdoor, social", brief: "A campaign that put LandCraft where its people already look: one clear idea, carried from the first sketch to the last screen." } },
  { client: "Krasa", logo: logoScnd9, cover: COVERS[1], file: { client: "Krasa", campaign: "The power to make a difference", services: "Launch campaign, digital", brief: "A campaign that put Krasa where its people already look: one clear idea, carried from the first sketch to the last screen." } },
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
