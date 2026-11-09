import magnetFaceSince from "@/public/images/website/home/who-we-are/magnet-face-since.svg";
import magnetFaceEvents from "@/public/images/website/home/who-we-are/magnet-face-events.svg";
import magnetFaceProjects from "@/public/images/website/home/who-we-are/magnet-face-projects.svg";
import magnetFaceClients from "@/public/images/website/home/who-we-are/magnet-face-clients.svg";
import magnetShadowSince from "@/public/images/website/home/who-we-are/magnet-shadow-since.svg";
import magnetShadowEvents from "@/public/images/website/home/who-we-are/magnet-shadow-events.svg";
import magnetShadowProjects from "@/public/images/website/home/who-we-are/magnet-shadow-projects.svg";
import magnetShadowClients from "@/public/images/website/home/who-we-are/magnet-shadow-clients.svg";

export const whoWeAreCopy = {
  label: "Who we are",
  // Title Case written out (not CSS `capitalize`): the writing animation splits it into letters
  heading: "Every Monday Starts At The Whiteboard.",
  intro:
    "We plan and make work for brands in print, radio, film, events and digital. Tap a magnet and Meera will walk you through the numbers.",
  boardTitle: { lead: "CTM, ", accent: "by the numbers" },
  story: "Started in Noida with print and radio. Eighteen years on, still the same curiosity.",
} as const;

/**
 * Magnets on the board, in the same order as `boardStats`: magnet n lights up
 * when stat n is active (since ↔ 2008, events ↔ 1000+, …). `glow` = its colour.
 */
export const boardMagnets = [
  { label: "since", face: magnetFaceSince, shadow: magnetShadowSince, glow: "var(--color-marker-red)" },
  { label: "events", face: magnetFaceEvents, shadow: magnetShadowEvents, glow: "var(--color-marker-blue)" },
  { label: "projects", face: magnetFaceProjects, shadow: magnetShadowProjects, glow: "var(--color-marker-green)" },
  { label: "clients", face: magnetFaceClients, shadow: magnetShadowClients, glow: "var(--color-marker-mustard)" },
] as const;

/**
 * Stats written on the whiteboard, in reading order (also the mobile order).
 * `position` places each one on the board artwork, as % of the 1440×732 scene.
 */
export const boardStats = [
  { value: "2008", caption: "started in Noida", color: "text-marker-red", position: { left: "13.681%", top: "31.011%" } },
  { value: "1000+", caption: "events organised", color: "text-marker-blue", position: { left: "39.236%", top: "29.235%" } },
  { value: "1800+", caption: "projects done", color: "text-marker-green", position: { left: "17.639%", top: "51.639%" } },
  { value: "2000+", caption: "happy clients", color: "text-marker-mustard", position: { left: "40.417%", top: "49.863%" } },
] as const;

/** Other board layers, as % of the 1440×732 scene. */
export const boardLayout = {
  title: { left: "12.708%", top: "15.984%" },
  magnets: { left: "39.167%", top: "4.645%" },
  story: { left: "12.708%", top: "68.169%" },
  /** Paper-art people standing in front of the board (page-level layers in Figma). */
  meera: { left: "49.583%", top: "27.596%", width: "26.319%" },
  cheeringMan: { left: "74.792%", top: "21.858%", width: "13.333%" },
} as const;
