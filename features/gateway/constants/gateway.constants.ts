/** Words printed on the welcome paper. */
export const gatewayCopy = {
  label: "Since 2008 · Noida",
  headline: [
    [{ text: "Welcome To The" }],
    [{ text: "House Of " }, { text: "Ideas", accent: true }, { text: "." }],
  ],
  subline: "Folded, cut and crafted by hand, one idea at a time.",
  hint: "Click anywhere to come in",
} as const;

/** Paper and ink colours, matched to the hero's paper-craft wall (#f0debe). */
export const paperPalette = {
  // drawn slightly lighter than the wall: creases and grain bring it back to ~#f0debe
  highlight: "#fdf4e3",
  base: "#f6e7cb",
  edge: "#ead6b3",
  crease: "90, 66, 40", // rgb, alpha applied per stroke
  sheen: "255, 250, 240",
  backSide: [0.79, 0.65, 0.43], // linear rgb of #e6d3b0, the paper's reverse
  ink: "#333333",
  inkAccent: "#e53926",
  inkLabel: "#c2603e",
  foldAccent: "#e2603f",
} as const;

/** Timeline, in seconds. */
export const gatewayTiming = {
  fadeIn: 0.6,
  inkStart: 0.25,
  inkDuration: 1.2,
  /** Paper stays readable until this point, then crumples. */
  crumpleAt: 3,
  crumple: 1.5,
  windUp: 0.22,
  /** toss from the centre down onto the floor */
  throw: 0.6,
  /** time to rise to the first bounce's peak (later bounces scale from it) */
  firstBounce: 0.32,
  /** after the last bounce: roll off the left edge */
  roll: 0.75,
  /** If the 3D scene isn't ready by now, skip the intro. */
  giveUpAfter: 7,
} as const;

/**
 * Put this attribute on the element whose floor the ball should land on; its
 * value is the floor line as a fraction of the element's height.
 */
export const GATEWAY_FLOOR_ATTR = "data-gateway-floor";

/** Fired on window when the gateway has finished (or was skipped). */
export { INTRO_COMPLETE_EVENT as GATEWAY_COMPLETE_EVENT } from "@/lib/constants/events";

/**
 * Once the welcome gateway has played (or been skipped), this key is saved in
 * sessionStorage: it then doesn't show again for the rest of the browser
 * session, however often the page is reloaded (see GatewaySessionScript).
 */
export const GATEWAY_SEEN_KEY = "ctm:gateway-seen";
