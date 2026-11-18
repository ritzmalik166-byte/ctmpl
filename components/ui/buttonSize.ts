/** The buttons' height and label, without the sides (for a button that needs narrower ones, like the header's WhatsApp). */
export const BUTTON_HEIGHT = "h-[39.5px] font-inter text-sm leading-[19.5px] tracking-[-0.325px]";

/**
 * The size of every button on the site, taken from the header's "Start a
 * project": 39.5 px tall (a 19.5 px line plus 10 px above and below) with 40 px
 * either side, its label 14 px bold Inter. Shared by the link buttons
 * (ButtonLink) and the form buttons (CrumpleButton users), so they all match.
 */
export const BUTTON_SIZE = `${BUTTON_HEIGHT} px-10 font-bold`;
