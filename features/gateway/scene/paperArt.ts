import { gatewayCopy, paperPalette as P } from "../constants/gateway.constants";

/**
 * Procedural paper artwork, drawn once on 2D canvases and used as textures:
 *  - drawPaper(): the sheet itself (tone, fold facets, creases, fibres, grain)
 *  - drawInk():   logo + welcome words on a transparent layer, "printed" later
 * Everything is seeded, so the sheet looks the same on every visit.
 */

type Rand = () => number;

/** Small seeded PRNG (mulberry32). */
export function seededRandom(seed: number): Rand {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const between = (rand: Rand, min: number, max: number) => min + rand() * (max - min);

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  return { canvas, ctx };
}

/* -------------------------------------------------------------------------- */
/*  Paper                                                                     */
/* -------------------------------------------------------------------------- */

type Fold = { px: number; py: number; nx: number; ny: number; weight: number; mountain: boolean };

/**
 * @param w,h  canvas size in device pixels
 * @param s    device pixels per CSS pixel (keeps line widths consistent)
 */
export function drawPaper(w: number, h: number, s: number, rand: Rand) {
  const { canvas, ctx } = createCanvas(w, h);

  paintBaseTone(ctx, w, h);
  paintMottling(ctx, w, h, rand);

  // Long folds: the sheet was folded and flattened again.
  const folds: Fold[] = Array.from({ length: 9 }, () => {
    const angle = rand() * Math.PI;
    return {
      px: between(rand, 0.1, 0.9) * w,
      py: between(rand, 0.1, 0.9) * h,
      nx: -Math.sin(angle),
      ny: Math.cos(angle),
      weight: between(rand, 0.025, 0.06) * (rand() < 0.5 ? -1 : 1),
      mountain: rand() < 0.5,
    };
  });

  paintFoldFacets(ctx, w, h, s, folds);
  folds.forEach((fold) => paintFoldLine(ctx, w, h, s, fold, rand));
  paintWrinkles(ctx, w, h, s, rand);
  paintFibres(ctx, w, h, s, rand);
  paintGrain(ctx, w, h, rand);

  return canvas;
}

function paintBaseTone(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const tone = ctx.createRadialGradient(w * 0.45, h * 0.42, 0, w * 0.5, h * 0.5, Math.hypot(w, h) * 0.62);
  tone.addColorStop(0, P.highlight);
  tone.addColorStop(0.55, P.base);
  tone.addColorStop(1, P.edge);
  ctx.fillStyle = tone;
  ctx.fillRect(0, 0, w, h);
}

/** Soft uneven tone, like hand-made paper. */
function paintMottling(ctx: CanvasRenderingContext2D, w: number, h: number, rand: Rand) {
  for (let i = 0; i < 70; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = between(rand, 0.04, 0.18) * Math.max(w, h);
    const light = rand() < 0.5;
    const blot = ctx.createRadialGradient(x, y, 0, x, y, r);
    blot.addColorStop(0, light ? "rgba(255,250,238,0.10)" : "rgba(160,120,70,0.035)");
    blot.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = blot;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
}

/** Each fold tilts one side of the sheet towards the light: flat facets of tone. */
function paintFoldFacets(ctx: CanvasRenderingContext2D, w: number, h: number, s: number, folds: Fold[]) {
  const step = 4; // computed at quarter resolution, then smoothed up
  const lw = Math.ceil(w / step);
  const lh = Math.ceil(h / step);
  const { canvas: low, ctx: lctx } = createCanvas(lw, lh);
  const image = lctx.createImageData(lw, lh);
  const softness = 10 * s;

  for (let y = 0; y < lh; y++) {
    for (let x = 0; x < lw; x++) {
      let shade = 0;
      for (const f of folds) {
        const d = (x * step - f.px) * f.nx + (y * step - f.py) * f.ny;
        shade += f.weight * Math.tanh(d / softness);
      }
      const i = (y * lw + x) * 4;
      if (shade > 0) {
        image.data.set([255, 251, 242, Math.min(255, shade * 280)], i);
      } else {
        image.data.set([140, 100, 55, Math.min(255, -shade * 170)], i);
      }
    }
  }

  lctx.putImageData(image, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(low, 0, 0, w, h);
}

/** Draws a hand-drawn-feeling polyline from a to b with a little wobble. */
function wobblyPath(ctx: CanvasRenderingContext2D, ax: number, ay: number, bx: number, by: number, wobble: number, rand: Rand) {
  const steps = Math.max(2, Math.round(Math.hypot(bx - ax, by - ay) / 40));
  const nx = -(by - ay);
  const ny = bx - ax;
  const len = Math.hypot(nx, ny) || 1;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const off = i === steps ? 0 : (rand() - 0.5) * wobble;
    ctx.lineTo(ax + (bx - ax) * t + (nx / len) * off, ay + (by - ay) * t + (ny / len) * off);
  }
}

/** A crease: a dark valley with a bright ridge beside it. */
function strokeCrease(
  ctx: CanvasRenderingContext2D,
  s: number,
  draw: (offset: number) => void,
  strength: number,
  mountain: boolean
) {
  const side = mountain ? 1 : -1;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // soft shadow of the fold
  ctx.save();
  ctx.translate(side * 2 * s, side * 2 * s);
  ctx.strokeStyle = `rgba(${P.crease}, ${0.05 * strength})`;
  ctx.lineWidth = 7 * s;
  draw(0);
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = `rgba(${P.crease}, ${0.22 * strength})`;
  ctx.lineWidth = 1.1 * s;
  draw(0);
  ctx.stroke();

  ctx.save();
  ctx.translate(-side * 1.2 * s, -side * 1.2 * s);
  ctx.strokeStyle = `rgba(${P.sheen}, ${0.55 * strength})`;
  ctx.lineWidth = 1 * s;
  draw(0);
  ctx.stroke();
  ctx.restore();
}

function paintFoldLine(ctx: CanvasRenderingContext2D, w: number, h: number, s: number, f: Fold, rand: Rand) {
  // line direction is perpendicular to the fold normal; extend past the edges
  const dx = f.ny;
  const dy = -f.nx;
  const reach = Math.hypot(w, h);
  const seed = rand() * 1e6;
  strokeCrease(
    ctx,
    s,
    () => wobblyPath(ctx, f.px - dx * reach, f.py - dy * reach, f.px + dx * reach, f.py + dy * reach, 2.5 * s, seededRandom(seed)),
    between(rand, 0.6, 1),
    f.mountain
  );
}

/** Short creases, many meeting at a few points, as crumpled paper does. */
function paintWrinkles(ctx: CanvasRenderingContext2D, w: number, h: number, s: number, rand: Rand) {
  const hubs = Array.from({ length: 7 }, () => ({ x: rand() * w, y: rand() * h }));

  for (const hub of hubs) {
    const spokes = 4 + Math.floor(rand() * 4);
    for (let i = 0; i < spokes; i++) {
      const angle = rand() * Math.PI * 2;
      const length = between(rand, 60, 260) * s;
      const seed = rand() * 1e6;
      strokeCrease(
        ctx,
        s,
        () => wobblyPath(ctx, hub.x, hub.y, hub.x + Math.cos(angle) * length, hub.y + Math.sin(angle) * length, 6 * s, seededRandom(seed)),
        between(rand, 0.35, 0.75),
        rand() < 0.5
      );
    }
  }

  for (let i = 0; i < 60; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const angle = rand() * Math.PI * 2;
    const length = between(rand, 30, 140) * s;
    const seed = rand() * 1e6;
    strokeCrease(
      ctx,
      s,
      () => wobblyPath(ctx, x, y, x + Math.cos(angle) * length, y + Math.sin(angle) * length, 5 * s, seededRandom(seed)),
      between(rand, 0.2, 0.5),
      rand() < 0.5
    );
  }
}

function paintFibres(ctx: CanvasRenderingContext2D, w: number, h: number, s: number, rand: Rand) {
  ctx.lineWidth = 0.6 * s;
  for (let i = 0; i < 900; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const length = between(rand, 4, 18) * s;
    const angle = rand() * Math.PI * 2;
    ctx.strokeStyle = rand() < 0.5 ? "rgba(120, 90, 55, 0.07)" : "rgba(255, 252, 245, 0.18)";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(
      x + Math.cos(angle + 0.6) * length * 0.5,
      y + Math.sin(angle + 0.6) * length * 0.5,
      x + Math.cos(angle) * length,
      y + Math.sin(angle) * length
    );
    ctx.stroke();
  }
}

function paintGrain(ctx: CanvasRenderingContext2D, w: number, h: number, rand: Rand) {
  const size = 256;
  const { canvas: tile, ctx: tctx } = createCanvas(size, size);
  const image = tctx.createImageData(size, size);
  for (let i = 0; i < image.data.length; i += 4) {
    const dark = rand() < 0.5;
    image.data[i] = dark ? 120 : 255;
    image.data[i + 1] = dark ? 90 : 250;
    image.data[i + 2] = dark ? 55 : 238;
    image.data[i + 3] = rand() * (dark ? 16 : 22);
  }
  tctx.putImageData(image, 0, 0);
  const pattern = ctx.createPattern(tile, "repeat");
  if (!pattern) return;
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, w, h);
}

/* -------------------------------------------------------------------------- */
/*  Ink                                                                       */
/* -------------------------------------------------------------------------- */

type InkFonts = { display: string; ui: string };

/**
 * Logo and welcome words on a transparent canvas. Layout is in CSS pixels
 * (cssW × cssH) and scaled by `s` so it stays sharp on retina screens.
 */
export function drawInk(cssW: number, cssH: number, s: number, logo: HTMLImageElement, fonts: InkFonts) {
  const { canvas, ctx } = createCanvas(cssW * s, cssH * s);
  ctx.scale(s, s);
  ctx.textBaseline = "alphabetic";

  const maxWidth = cssW * 0.86;
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  // Headline size: fluid, then shrunk until the longest line fits.
  let size = clamp(cssW * 0.062, 34, 82);
  const headlineWidth = () =>
    Math.max(
      ...gatewayCopy.headline.map((line) => {
        ctx.font = `600 ${size}px ${fonts.display}`;
        return ctx.measureText(line.map((part) => part.text).join("")).width;
      })
    );
  while (size > 24 && headlineWidth() > maxWidth) size -= 1;

  const logoH = clamp(size * 1.0, 42, 76);
  const logoW = (logo.naturalWidth / logo.naturalHeight) * logoH;
  const labelSize = clamp(size * 0.17, 11, 13);
  const sublineSize = clamp(size * 0.24, 15, 19);
  const lineHeight = size * 1.14;

  const gaps = { logo: size * 0.5, label: size * 0.32, subline: size * 0.42 };
  const blockH =
    logoH + gaps.logo + labelSize + gaps.label + lineHeight * gatewayCopy.headline.length + gaps.subline + sublineSize;
  let y = (cssH - blockH) / 2;
  const cx = cssW / 2;

  // Logo
  ctx.drawImage(logo, cx - logoW / 2, y, logoW, logoH);
  y += logoH + gaps.logo;

  // Label with the paper-fold accent used across the site
  ctx.font = `600 ${labelSize}px ${fonts.ui}`;
  const label = gatewayCopy.label.toUpperCase();
  const tracking = labelSize * 0.24;
  const labelW = measureTracked(ctx, label, tracking);
  const accent = labelSize * 1.15;
  const rowW = accent + labelSize * 0.7 + labelW;
  let x = cx - rowW / 2;
  drawFoldAccent(ctx, x, y - labelSize * 0.05, accent);
  x += accent + labelSize * 0.7;
  ctx.fillStyle = P.inkLabel;
  fillTracked(ctx, label, x, y + labelSize * 0.88, tracking);
  y += labelSize + gaps.label;

  // Headline
  for (const line of gatewayCopy.headline) {
    y += lineHeight;
    ctx.font = `600 ${size}px ${fonts.display}`;
    const full = line.map((part) => part.text).join("");
    let lx = cx - ctx.measureText(full).width / 2;
    for (const part of line) {
      ctx.fillStyle = "accent" in part && part.accent ? P.inkAccent : P.ink;
      ctx.fillText(part.text, lx, y - lineHeight * 0.18);
      lx += ctx.measureText(part.text).width;
    }
  }
  y += gaps.subline;

  // Subline (wrapped)
  ctx.font = `400 ${sublineSize}px ${fonts.display}`;
  ctx.fillStyle = "rgba(51, 51, 51, 0.78)";
  ctx.textAlign = "center";
  wrapText(ctx, gatewayCopy.subline, cssW * 0.8).forEach((text, i) => {
    ctx.fillText(text, cx, y + sublineSize + i * sublineSize * 1.5);
  });

  // Hint at the foot of the sheet
  ctx.textAlign = "left";
  ctx.font = `600 11px ${fonts.ui}`;
  ctx.fillStyle = "rgba(51, 51, 51, 0.45)";
  const hint = gatewayCopy.hint.toUpperCase();
  const hintW = measureTracked(ctx, hint, 2.6);
  fillTracked(ctx, hint, cx - hintW / 2, cssH - 40, 2.6);

  return canvas;
}

/** The small folded-paper triangle that marks section labels in the design. */
function drawFoldAccent(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = P.foldAccent;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + size, y);
  ctx.lineTo(x, y + size);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(120, 30, 10, 0.35)";
  ctx.beginPath();
  ctx.moveTo(x + size, y);
  ctx.lineTo(x + size * 0.45, y + size * 0.55);
  ctx.lineTo(x + size * 0.55, y + size * 0.2);
  ctx.closePath();
  ctx.fill();
}

function measureTracked(ctx: CanvasRenderingContext2D, text: string, tracking: number) {
  return ctx.measureText(text).width + tracking * (text.length - 1);
}

function fillTracked(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, tracking: number) {
  for (const char of text) {
    ctx.fillText(char, x, y);
    x += ctx.measureText(char).width + tracking;
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Soft round shadow used under the paper ball. */
export function drawShadow() {
  const size = 128;
  const { canvas, ctx } = createCanvas(size, size);
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(70, 48, 25, 0.6)");
  g.addColorStop(0.55, "rgba(70, 48, 25, 0.22)");
  g.addColorStop(1, "rgba(70, 48, 25, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}
