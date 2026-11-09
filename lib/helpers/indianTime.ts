/** India Standard Time is UTC+05:30 all year round (no daylight saving). */
const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

export type ClockTime = {
  hours: number; // 0–23
  minutes: number; // 0–59
  seconds: number; // 0–59
};

/** Current time in India, independent of the visitor's own timezone. */
export function getIndianTime(now: number = Date.now()): ClockTime {
  const ist = new Date(now + IST_OFFSET_MS);
  return {
    hours: ist.getUTCHours(),
    minutes: ist.getUTCMinutes(),
    seconds: ist.getUTCSeconds(),
  };
}

/** Rotation (degrees, clockwise from 12) of each hand of an analog clock. */
export function getHandAngles({ hours, minutes, seconds }: ClockTime) {
  return {
    hour: (hours % 12) * 30 + minutes * 0.5 + seconds / 120,
    minute: minutes * 6 + seconds * 0.1,
    second: seconds * 6,
  };
}
