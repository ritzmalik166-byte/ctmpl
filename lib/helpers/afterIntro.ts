import { INTRO_COMPLETE_EVENT } from "@/lib/constants/events";

/**
 * Runs `callback` once the welcome gateway is out of the way: immediately if it
 * already finished (or never ran), otherwise when it completes.
 * Returns an unsubscribe function for effect cleanups.
 */
export function afterIntro(callback: () => void): () => void {
  const state = document.documentElement.dataset.gateway;
  if (state !== "playing" && document.querySelector("[aria-label='Welcome']") === null) {
    callback();
    return () => {};
  }
  if (state === "done") {
    callback();
    return () => {};
  }
  const onDone = () => callback();
  window.addEventListener(INTRO_COMPLETE_EVENT, onDone, { once: true });
  return () => window.removeEventListener(INTRO_COMPLETE_EVENT, onDone);
}
