// Geometry and draw batches of the /about DNA helix (D-051, AD H1–H4), shared by
// the canvas (live) and the server-rendered SVG (no JS / reduced motion), so
// both draw the same frame.
//
// Everything a frame draws is bucketed by depth level and kind into a few
// dozen batches (one path each), painted back to front. That keeps the canvas
// at ~60 path strokes per frame instead of one stroke per segment, and the SVG
// at a few dozen <path>s.

export type HelixGeo = {
  W: number;
  H: number;
  /** Amplitude (H3: 100 in the 240 box, 48 in the 120 box). */
  A: number;
  k: number;
  /** Rung spacing (H2: 34 / 26). */
  gap: number;
  step: number;
  /** Near node size; the far end is 3px. */
  node: number;
  wMax: number;
  /** Pointer wring radius (H4: 160 at desktop scale). */
  sigma: number;
};

/** Box height drives the scale. */
export function helixGeo(W: number, H: number): HelixGeo {
  const big = H > 150;
  const lambda = big ? (520 * H) / 240 : 260 * (H / 120);
  return {
    W,
    H,
    A: big ? (100 * H) / 240 : (48 * H) / 120,
    k: (Math.PI * 2) / lambda,
    gap: big ? (34 * H) / 240 : 26,
    step: big ? 8 : 6,
    node: big ? 5 : 4,
    wMax: big ? 3.4 : 2.4,
    sigma: (160 * H) / 240,
  };
}

/** The second strand trails the first by ~135°, not 180°: real DNA's major/minor grooves. */
export const OFFSET = 2.35;
export const STATIC_THETA = 0.6;
const PAPER = '#fcfcfc';
const INDIGO = [52, 50, 199] as const;
const INK = [14, 14, 16] as const;
const LEVELS = 8;
/** Front segments (z above this) get a paper knockout so they pass over what is behind (H1). */
const FRONT = 0.15;

export type FrameOpts = {
  theta: number;
  /** H4 local wring: pointer x in box px and its strength (0–1). */
  px?: number;
  wring?: number;
  /** Intro: share of the width drawn so far (0–1); the strands zip shut at the tip. */
  reveal?: number;
};

export type Batch = {
  /** `s` = stroke line pairs [x0,y0,x1,y1,…]; `f` = filled squares [x,y,size,…]. */
  kind: 's' | 'f';
  color: string;
  width: number;
  pts: number[];
  /** Knockouts use butt caps: a round cap would bite into the strand's own previous segment. */
  butt?: boolean;
};

const rgba = (c: readonly number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;
const strandRGB = (s: number) => (s === 0 ? INDIGO : INK);
/** Depth 0 (back) … 1 (front), rounded so server and browser bucket alike. */
const depth = (z: number) => Number(((z + 1) / 2).toFixed(4));
const levelOf = (z: number) => Math.min(LEVELS - 1, Math.floor(depth(z) * LEVELS));
const levelMid = (l: number) => (l + 0.5) / LEVELS; // as a depth 0–1

/**
 * One frame as ordered draw batches. Per depth level, back to front:
 * paper knockouts under the front pieces (H1) → rung halves (each in its own
 * strand's colour, H2) → strand segments → base-pair nodes.
 */
export function helixBatches(g: HelixGeo, { theta, px = 0, wring = 0, reveal = 1 }: FrameOpts): Batch[] {
  const cy = g.H / 2;
  const edge = reveal * g.W;
  const zip = 140;
  const w2 = 2 * g.sigma * g.sigma;
  const point = (x: number, s: number) => {
    const bump = wring > 0.001 ? wring * Math.exp(-((x - px) * (x - px)) / w2) : 0;
    const p = g.k * x + theta + s * OFFSET + 1.1 * bump;
    const z = Math.cos(p);
    let env = 1;
    if (reveal < 1) {
      const e = Math.min(1, Math.max(0, (edge - x) / zip));
      env = e * (2 - e);
    }
    // A touch of perspective (the near side swings a little wider) and the wring's local swell.
    return { y: cy + g.A * (1 + 0.1 * bump) * env * (1 + 0.04 * z) * Math.sin(p), z };
  };

  // Per level: [rung0, rung1, knockSeg, knockRung, seg0, seg1, nodes0, nodes1]
  const L = Array.from({ length: LEVELS }, () => Array.from({ length: 8 }, () => [] as number[]));
  const xEnd = Math.min(g.W, edge);

  for (const s of [0, 1]) {
    let prev = point(0, s);
    for (let x = g.step; x - g.step < xEnd; x += g.step) {
      const xe = Math.min(x, xEnd);
      const cur = point(xe, s);
      const z = (prev.z + cur.z) / 2;
      const l = levelOf(z);
      L[l][4 + s].push(x - g.step, prev.y, xe, cur.y);
      if (z > FRONT) L[l][2].push(x - g.step, prev.y, xe, cur.y);
      prev = cur;
    }
  }
  for (let x = g.gap / 2; x < xEnd; x += g.gap) {
    const a = point(x, 0);
    const b = point(x, 1);
    const m = (a.y + b.y) / 2;
    const la = levelOf(a.z);
    const lb = levelOf(b.z);
    L[la][0].push(x, a.y, x, m);
    L[lb][1].push(x, m, x, b.y);
    if (a.z > FRONT) L[la][3].push(x, a.y, x, m);
    if (b.z > FRONT) L[lb][3].push(x, m, x, b.y);
    // Nodes: the nearer end full size, the far end small and faint.
    const nearA = a.z >= b.z;
    L[la][6].push(x, a.y, nearA ? g.node : 3);
    L[lb][7].push(x, b.y, nearA ? 3 : g.node);
  }

  const out: Batch[] = [];
  const segW = (d: number) => 0.8 + (g.wMax - 0.8) * d;
  for (let l = 0; l < LEVELS; l++) {
    const d = levelMid(l);
    const [r0, r1, kSeg, kRung, s0, s1, n0, n1] = L[l];
    // Floor raised from the AD .12 so the back half of a base pair still reads as part of the rung.
    const rungA = 0.22 + 0.55 * d;
    // Knockouts first: they clear what lies behind this level, never this level's own pieces.
    if (kRung.length) out.push({ kind: 's', color: PAPER, width: 1.5 + 4, pts: kRung, butt: true });
    if (kSeg.length) out.push({ kind: 's', color: PAPER, width: segW(d) + 6, pts: kSeg, butt: true });
    if (r0.length) out.push({ kind: 's', color: rgba(INDIGO, rungA), width: 1.5, pts: r0 });
    if (r1.length) out.push({ kind: 's', color: rgba(INK, rungA * 0.8), width: 1.5, pts: r1 });
    const segA = 0.3 + 0.7 * d;
    if (s0.length) out.push({ kind: 's', color: rgba(INDIGO, segA), width: segW(d), pts: s0 });
    if (s1.length) out.push({ kind: 's', color: rgba(INK, segA), width: segW(d), pts: s1 });
    // Far-end nodes are 3px at 40%: split each strand's nodes by size.
    for (const [pts, s] of [[n0, 0], [n1, 1]] as const) {
      const big: number[] = [];
      const small: number[] = [];
      for (let i = 0; i < pts.length; i += 3) (pts[i + 2] === 3 ? small : big).push(pts[i], pts[i + 1], pts[i + 2]);
      const a = 0.35 + 0.65 * d;
      if (small.length) out.push({ kind: 'f', color: rgba(strandRGB(s), a * 0.4), width: 0, pts: small });
      if (big.length) out.push({ kind: 'f', color: rgba(strandRGB(s), a), width: 0, pts: big });
    }
  }
  return out;
}

/** Paints a frame's batches (one path per batch). */
export function paintBatches(ctx: CanvasRenderingContext2D, batches: Batch[]) {
  for (const b of batches) {
    const p = b.pts;
    ctx.lineCap = b.butt ? 'butt' : 'round';
    ctx.beginPath();
    if (b.kind === 's') {
      for (let i = 0; i < p.length; i += 4) {
        ctx.moveTo(p[i], p[i + 1]);
        ctx.lineTo(p[i + 2], p[i + 3]);
      }
      ctx.strokeStyle = b.color;
      ctx.lineWidth = b.width;
      ctx.stroke();
    } else {
      for (let i = 0; i < p.length; i += 3) ctx.rect(p[i] - p[i + 2] / 2, p[i + 1] - p[i + 2] / 2, p[i + 2], p[i + 2]);
      ctx.fillStyle = b.color;
      ctx.fill();
    }
  }
}

/** The static frame as SVG paths (same batches, same order). */
export function helixSvgPaths(g: HelixGeo, theta = STATIC_THETA) {
  const f = (n: number) => n.toFixed(1);
  return helixBatches(g, { theta }).map((b) => {
    let d = '';
    const p = b.pts;
    if (b.kind === 's') for (let i = 0; i < p.length; i += 4) d += `M${f(p[i])} ${f(p[i + 1])}L${f(p[i + 2])} ${f(p[i + 3])}`;
    else for (let i = 0; i < p.length; i += 3) d += `M${f(p[i] - p[i + 2] / 2)} ${f(p[i + 1] - p[i + 2] / 2)}h${p[i + 2]}v${p[i + 2]}h-${p[i + 2]}z`;
    return b.kind === 's' ? { d, stroke: b.color, w: b.width, cap: b.butt ? ('butt' as const) : ('round' as const) } : { d, fill: b.color };
  });
}
