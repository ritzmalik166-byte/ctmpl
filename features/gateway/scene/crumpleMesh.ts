import { PlaneGeometry } from "three";
import { createNoise3D } from "simplex-noise";

/**
 * A screen-sized sheet whose vertices can travel from "flat" to "crumpled ball".
 *
 * Each vertex gets a target on a lumpy sphere: the sheet's centre maps to the
 * front of the ball and its corners wrap round the back. On the way there,
 * wrinkles rise across the sheet (edges first, centre last, like hands closing
 * around it), and flat shading turns every bend into a crisp paper facet.
 */
export function createCrumpleMesh(width: number, height: number, radius: number, random: () => number) {
  const noise = createNoise3D(random);

  // ~56 segments on the long side: crisp facets without many vertices.
  const long = 56;
  const segX = width >= height ? long : Math.max(20, Math.round((long * width) / height));
  const segY = width >= height ? Math.max(20, Math.round((long * height) / width)) : long;

  const geometry = new PlaneGeometry(width, height, segX, segY);
  const position = geometry.attributes.position;
  const live = position.array as Float32Array;
  const flat = Float32Array.from(live);
  const ball = new Float32Array(live.length);
  const wrinkle = new Float32Array(live.length); // small sharp creases, per vertex
  const buckle = new Float32Array(live.length); // big folds that break the outline
  const delay = new Float32Array(position.count);

  const halfW = width / 2;
  const halfH = height / 2;
  const sheetWrinkle = Math.min(width, height) * 0.045; // wrinkle depth while still sheet-sized
  const ballWrinkle = radius * 0.06; // ...shrinks with the paper
  const sheetSize = Math.min(halfW, halfH);
  const maxDelay = 0.4;

  for (let i = 0; i < position.count; i++) {
    const nx = flat[i * 3] / halfW;
    const ny = flat[i * 3 + 1] / halfH;
    const d = Math.min(1, Math.hypot(nx, ny) / Math.SQRT2); // 0 centre → 1 corner

    // sheet → sphere: centre at the front pole, corners wrapping to the back
    const theta = Math.atan2(ny, nx);
    const phi = d * Math.PI * 0.92;
    let sx = Math.sin(phi) * Math.cos(theta);
    let sy = Math.sin(phi) * Math.sin(theta);
    let sz = Math.cos(phi);

    // fold the surface over itself a little
    const j = 0.22;
    sx += j * noise(sx * 2.6, sy * 2.6, sz * 2.6 + 1.7);
    sy += j * noise(sx * 2.6 + 5.1, sy * 2.6, sz * 2.6);
    sz += j * noise(sx * 2.6, sy * 2.6 + 9.3, sz * 2.6);
    const len = Math.hypot(sx, sy, sz) || 1;

    // lumps and dents: compact, but never a perfect sphere
    const r = radius * (0.9 + 0.16 * noise(sx * 2.5, sy * 2.5, sz * 2.5 + 9) + 0.07 * noise(sx * 6, sy * 6, sz * 6 + 3));

    ball[i * 3] = (sx / len) * r;
    ball[i * 3 + 1] = (sy / len) * r;
    ball[i * 3 + 2] = (sz / len) * r;

    // ridged noise gives sharp creases rather than soft hills
    const ridge = (seed: number) => {
      const a = 1 - Math.abs(noise(nx * 4.5, ny * 4.5 * (height / width), seed));
      const b = 1 - Math.abs(noise(nx * 11, ny * 11 * (height / width), seed + 7));
      return a * a * 0.75 + b * b * 0.4 - 0.45;
    };
    wrinkle[i * 3] = 0.35 * ridge(2.1);
    wrinkle[i * 3 + 1] = 0.35 * ridge(6.4);
    wrinkle[i * 3 + 2] = ridge(4.2);

    // low-frequency folds; the sheet buckles in big chunks mid-crumple
    const fold = (seed: number) => noise(nx * 1.4, ny * 1.4 * (height / width), seed);
    buckle[i * 3] = fold(12.5);
    buckle[i * 3 + 1] = fold(17.3);
    buckle[i * 3 + 2] = fold(23.9);

    delay[i] = (1 - d) * maxDelay;
  }

  const smooth = (a: number, b: number, v: number) => {
    const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  /** progress: 0 = flat sheet, 1 = paper ball */
  const setProgress = (progress: number) => {
    for (let i = 0; i < position.count; i++) {
      const local = Math.min(1, Math.max(0, (progress - delay[i]) / (1 - maxDelay)));
      const e = easeInOut(local);
      // wrinkles bite in early, then stay as the creases of the finished ball
      const depth = smooth(0, 0.35, local) * (sheetWrinkle + (ballWrinkle - sheetWrinkle) * e);
      // big folds scale with the paper's current size and fade out as it closes
      const fold = 0.28 * (sheetSize + (radius - sheetSize) * e) * Math.sin(Math.PI * e);
      for (let k = 0; k < 3; k++) {
        const n = i * 3 + k;
        live[n] = flat[n] + (ball[n] - flat[n]) * e + wrinkle[n] * depth + buckle[n] * fold;
      }
    }
    position.needsUpdate = true;
  };

  return { geometry, setProgress };
}
