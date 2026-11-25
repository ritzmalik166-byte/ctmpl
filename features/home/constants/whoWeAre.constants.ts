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
  heading: "Every Monday starts at the whiteboard.",
  /** Two paragraphs, beside the heading. */
  intro: [
    "Creative Thinks Media began on 16 August 2008. Two friends and colleagues were talking over a cup of coffee about what it takes to build a business. The conversation turned into a brainstorm, and the brainstorm turned into a full-service advertising agency in Noida.",
    "Eighteen years and more than 10,000 brainstorming sessions later, the whiteboard is still where every project starts. We plan, write, design, shoot, print, broadcast and book, so you work with one team instead of seven vendors.",
    "Our motto is best or nothing. Early on, we asked a client for more time to remake a TV commercial we weren't happy with, and we did it at our own cost. That is what the motto means to us.",
    "Tap a magnet and Meera will walk you through the numbers.",
  ],
  /** The three notes stuck up by the whiteboard. */
  notes: ["One team, not seven vendors.", "Ideas first, channels second.", "Made in-house, checked by humans."],
  boardTitle: { lead: "CTM, ", accent: "by the numbers" },
  /**
   * The line written along the bottom of the board, one per stat (same order
   * as `boardStats`): it changes to match the stat being pointed at.
   */
  stories: [
    "Since 2008. Two friends, one cup of coffee and a very big whiteboard.",
    "1000+ events organised, from product launches to award nights and roadshows.",
    "1800+ projects done across print, radio, film, events and digital.",
    "2000+ happy clients, from growing local brands to national names.",
  ],
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
  { value: "2008", caption: "the year our story\nbegan in Noida", color: "text-marker-red", position: { left: "13.681%", top: "31.011%" } },
  { value: "1000+", caption: "events organised", color: "text-marker-blue", position: { left: "39.236%", top: "29.235%" } },
  { value: "1800+", caption: "projects done", color: "text-marker-green", position: { left: "17.639%", top: "51.639%" } },
  { value: "2000+", caption: "happy clients", color: "text-marker-mustard", position: { left: "40.417%", top: "49.863%" } },
] as const;

/** Other board layers, as % of the 1440×732 scene. */
export const boardLayout = {
  title: { left: "12.708%", top: "15.984%" },
  magnets: { left: "39.167%", top: "4.645%" },
  /** (two lines, set a little higher than Figma's one so both fit on the board) */
  story: { left: "12.708%", top: "64.8%" },
  /** Paper-art people standing in front of the board (page-level layers in Figma). */
  /**
   * (the new art is narrower / wider than Figma's: sized so each stands as tall as before.) Meera stands
   * clear of the board's writing (it ends about 50% across), her marker still on the board (to 61%), her
   * colleague beside her. Their `left` is given per screen in WhiteboardScene (`--x`): on tablets the
   * scene's sides are cropped (8.3%-91.7% shows), so they stand a little closer together there.
   */
  meera: { top: "27.596%", width: "19.6%" },
  cheeringMan: { top: "21.858%", width: "19.72%" },
} as const;
