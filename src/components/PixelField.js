import React, { useEffect, useRef, useState } from 'react';

const smooth = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const fract = (x) => x - Math.floor(x);
const hash = (x, y, z) => fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453);

// Smooth 3D value noise: random values on an integer lattice, blended with smoothstep.
function noise(x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const u = smooth(x - xi), v = smooth(y - yi), w = smooth(z - zi);
    const lerp = (a, b, k) => a + (b - a) * k;
    const plane = (zz) => lerp(
        lerp(hash(xi, yi, zz), hash(xi + 1, yi, zz), u),
        lerp(hash(xi, yi + 1, zz), hash(xi + 1, yi + 1, zz), u),
        v
    );
    return lerp(plane(zi), plane(zi + 1), w);
}

const drift = (x, y, t, v = {}) => {
    const z = 1 / (v.scale || 1);
    const n = noise(x * 0.09 * z, y * 0.16 * z, t * 0.18) * 0.65 + noise(x * 0.23 * z, y * 0.4 * z, t * 0.35 + 9) * 0.35;
    return smooth((n - (v.threshold ?? 0.5)) / 0.28);
};

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((n) => (n + 0.5) / 16);

const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);

// Gradient descent with momentum on a made-up loss surface. Positions are in "field units":
// the field is rows tall = 1 unit, so wells stay round however wide it is.
const descent = {
    decay: 0.93,
    controls: [
        { key: 'lr', label: 'Learning rate', min: 0.0004, max: 0.04, step: 0.0002, value: 0.0022 },
        { key: 'momentum', label: 'Momentum', min: 0, max: 0.98, step: 0.01, value: 0.9 },
        { key: 'points', label: 'Points', min: 1, max: 24, step: 1, value: 8, reset: true },
        { key: 'contours', label: 'Contours', min: 2, max: 12, step: 1, value: 4 },
        { key: 'bumps', label: 'Bumpiness', min: 0, max: 0.5, step: 0.01, value: 0.15, reset: true },
    ],
    init(cols, rows, v) {
        const W = cols / rows;
        const n = Math.max(2, Math.round(W * 1.3));
        const wells = Array.from({ length: n }, (_, k) => ({
            x: ((k + 0.2 + hash(k, 3, 3) * 0.6) * W) / n,
            y: 0.2 + hash(k, 4, 4) * 0.6,
            a: 0.5 + hash(k, 5, 5) * 0.5,
            s: 0.09 + hash(k, 6, 6) * 0.1,
        }));
        const loss = (X, Y) => {
            let l = 0.5 * (Y - 0.5) ** 2 + v.bumps * noise(X * 5, Y * 5, 7);
            for (const w of wells) l -= w.a * Math.exp(-((X - w.x) ** 2 + (Y - w.y) ** 2) / (2 * w.s * w.s));
            return l;
        };
        // The surface is drawn in terraces, lowest loss brightest, like a contour map.
        const L = new Float32Array(cols * rows);
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) L[y * cols + x] = loss((x + 0.5) / rows, (y + 0.5) / rows);
        let lo = Infinity, hi = -Infinity;
        for (const l of L) { lo = Math.min(lo, l); hi = Math.max(hi, l); }
        const depth = L.map((l) => 1 - (l - lo) / (hi - lo));
        const s = { W, rows, cols, loss, depth, lit: new Float32Array(cols * rows), acc: 0, balls: [] };
        for (let i = 0; i < v.points; i++) s.balls.push(descent.spawn(s, {}, Math.random() * 6));
        return s;
    },
    spawn(s, b, age = 0, X = Math.random() * s.W, Y = Math.random()) {
        return Object.assign(b, { X, Y, vx: 0, vy: 0, still: 0, age, ax: X, ay: Y });
    },
    step(s, dt, t, ptr, { lr, momentum: beta }) {
        const h = 0.004, tick = 1 / 40;
        for (s.acc += dt; s.acc >= tick; s.acc -= tick) {
            for (const b of s.balls) {
                const gx = (s.loss(b.X + h, b.Y) - s.loss(b.X - h, b.Y)) / (2 * h);
                const gy = (s.loss(b.X, b.Y + h) - s.loss(b.X, b.Y - h)) / (2 * h);
                b.vx = beta * b.vx - lr * gx;
                b.vy = beta * b.vy - lr * gy;
                b.X = clamp(b.X + b.vx, 0, s.W - 1e-6);
                b.Y = clamp(b.Y + b.vy, 0, 1 - 1e-6);
                // Settled means it hasn't gone anywhere for a while. Checking distance, not speed,
                // keeps slow points on gentle slopes from counting as stopped.
                if (Math.hypot(b.X - b.ax, b.Y - b.ay) > 0.01) { b.ax = b.X; b.ay = b.Y; b.still = 0; } else b.still += tick;
                b.age += tick;
                // Settled or wandering too long: start again somewhere random.
                if (b.still > 1.4 || b.age > 30) descent.spawn(s, b);
            }
        }
        s.lit.fill(0);
        for (const b of s.balls) s.lit[Math.floor(b.Y * s.rows) * s.cols + Math.floor(b.X * s.rows)] = 1;
    },
    at: (x, y, t, cols, rows, s, v) => {
        const k = y * cols + x;
        const terrace = Math.min(v.contours - 1, Math.floor(s.depth[k] * v.contours)) / (v.contours - 1);
        return Math.max(terrace * 0.3, s.lit[k]);
    },
    click(s, X, Y) {
        const oldest = s.balls.reduce((a, b) => (b.age > a.age ? b : a));
        descent.spawn(s, oldest, 0, X, Y);
    },
};

const SPEED = { key: 'speed', label: 'Speed', min: 0, max: 4, step: 0.1, value: 1 };
const afterglow = (value) => ({ key: 'afterglow', label: 'Afterglow', min: 0, max: 0.97, step: 0.01, value });
const SCALE = { key: 'scale', label: 'Scale', min: 0.4, max: 3, step: 0.1, value: 1 };
const THRESHOLD = { key: 'threshold', label: 'Threshold', min: 0.2, max: 0.8, step: 0.01, value: 0.5 };

const gauss = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());

// k-means on points drawn from a few blobs. The points never move; each round every point
// joins its nearest centroid, then every centroid moves to the mean of its points. Faint
// lines mark the borders between centroids, and pointing at a region lights its points.
const kmeans = {
    decay: 0.9,
    pointer: true,
    controls: [
        SPEED,
        { key: 'k', label: 'k', min: 1, max: 8, step: 1, value: 4, reset: true },
        { key: 'blobs', label: 'Blobs', min: 1, max: 8, step: 1, value: 4, reset: true },
    ],
    init(cols, rows, v) {
        const W = cols / rows;
        const n = clamp(Math.round((cols * rows) / 10), 40, 160);
        // Blobs are spread across the strip with some jitter, so they don't land on top of each other.
        const blobs = Array.from({ length: v.blobs }, (_, i) => ({
            X: (W * (i + 0.5 + (Math.random() - 0.5) * 0.4)) / v.blobs,
            Y: 0.25 + Math.random() * 0.5,
        }));
        const points = Array.from({ length: n }, (_, i) => {
            const b = blobs[i % v.blobs];
            return { X: clamp(b.X + gauss() * 0.08, 0, W - 1e-6), Y: clamp(b.Y + gauss() * 0.08, 0, 1 - 1e-6), c: 0 };
        });
        // Start each centroid on a random point, the classic (and easily fooled) way.
        const centroids = Array.from({ length: v.k }, () => {
            const p = points[Math.floor(Math.random() * n)];
            return { X: p.X, Y: p.Y, fromX: p.X, fromY: p.Y, toX: p.X, toY: p.Y };
        });
        return { W, cols, rows, points, centroids, clock: 0, round: 0, done: -1, lit: new Float32Array(cols * rows) };
    },
    round(s) {
        const { points, centroids } = s;
        for (const p of points) {
            let best = Infinity;
            centroids.forEach((c, i) => {
                const d = (p.X - c.toX) ** 2 + (p.Y - c.toY) ** 2;
                if (d < best) { best = d; p.c = i; }
            });
        }
        let moved = 0;
        centroids.forEach((c, i) => {
            const mine = points.filter((p) => p.c === i);
            c.fromX = c.toX; c.fromY = c.toY;
            if (mine.length) {
                c.toX = mine.reduce((sum, p) => sum + p.X, 0) / mine.length;
                c.toY = mine.reduce((sum, p) => sum + p.Y, 0) / mine.length;
            }
            moved = Math.max(moved, Math.hypot(c.toX - c.fromX, c.toY - c.fromY));
        });
        return moved;
    },
    step(s, dt, t, ptr, v) {
        const ROUND = 1;
        s.clock += dt;
        if (s.done >= 0 && s.clock - s.done > 3) Object.assign(s, kmeans.init(s.cols, s.rows, v));
        if (s.done < 0 && s.clock - s.round >= ROUND) {
            s.round = s.clock;
            if (kmeans.round(s) < 1e-4) s.done = s.clock;
        }
        // Centroids glide to their new spot over the first half of each round.
        const k = smooth((s.clock - s.round) / (ROUND / 2));
        for (const c of s.centroids) { c.X = c.fromX + (c.toX - c.fromX) * k; c.Y = c.fromY + (c.toY - c.fromY) * k; }

        const { cols, rows, lit, centroids } = s;
        const owner = new Int8Array(cols * rows);
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const X = (x + 0.5) / rows, Y = (y + 0.5) / rows;
                let best = Infinity;
                centroids.forEach((c, i) => {
                    const d = (X - c.X) ** 2 + (Y - c.Y) ** 2;
                    if (d < best) { best = d; owner[y * cols + x] = i; }
                });
            }
        }
        lit.fill(0);
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const o = owner[y * cols + x];
                const edge = (x + 1 < cols && owner[y * cols + x + 1] !== o) || (y + 1 < rows && owner[(y + 1) * cols + x] !== o);
                if (edge) lit[y * cols + x] = 0.2;
            }
        }
        const inside = ptr.tx >= 0 && ptr.tx < cols && ptr.ty >= 0 && ptr.ty < rows;
        const focus = inside ? owner[Math.floor(ptr.ty) * cols + Math.floor(ptr.tx)] : -1;
        const cell = (X, Y) => Math.floor(Y * rows) * cols + Math.floor(X * rows);
        for (const p of s.points) {
            const i = cell(p.X, p.Y);
            lit[i] = Math.max(lit[i], p.c === focus ? 0.85 : 0.45);
        }
        for (const c of centroids) lit[cell(clamp(c.X, 0, s.W - 1e-6), clamp(c.Y, 0, 1 - 1e-6))] = 1;
    },
    at: (x, y, t, cols, rows, s) => s.lit[y * cols + x],
};

// Fireflies flash on their own rhythm, and each one nudges its rhythm toward the flies
// near it (the Kuramoto model). With enough coupling, the whole field falls into step.
const fireflies = {
    decay: 0.9,
    controls: [
        { key: 'coupling', label: 'Coupling', min: 0, max: 1.5, step: 0.05, value: 0.3 },
        { key: 'count', label: 'Fireflies', min: 4, max: 80, step: 1, value: 36, reset: true },
    ],
    init(cols, rows, v) {
        const W = cols / rows;
        const flies = Array.from({ length: v.count }, (_, i) => ({
            X: Math.random() * W,
            Y: Math.random(),
            phase: Math.random(),
            freq: 0.7 + (Math.random() - 0.5) * 0.16,
            seed: i * 7.3,
        }));
        return { W, cols, rows, flies, clock: 0, lit: new Float32Array(cols * rows) };
    },
    step(s, dt, t, ptr, v) {
        const R = 0.9;
        s.clock += dt;
        const next = s.flies.map((f) => {
            let pull = 0, n = 0;
            for (const g of s.flies) {
                if (g !== f && Math.hypot(g.X - f.X, g.Y - f.Y) < R) { pull += Math.sin(2 * Math.PI * (g.phase - f.phase)); n++; }
            }
            return f.phase + dt * (f.freq + (n ? (v.coupling * pull) / n : 0));
        });
        s.lit.fill(0);
        s.flies.forEach((f, i) => {
            f.phase = fract(next[i]);
            f.X = clamp(f.X + (noise(f.seed, s.clock * 0.3, 1) - 0.5) * dt * 0.3, 0, s.W - 1e-6);
            f.Y = clamp(f.Y + (noise(f.seed, s.clock * 0.3, 2) - 0.5) * dt * 0.3, 0, 1 - 1e-6);
            // A flash is the first tenth of each cycle.
            const b = f.phase < 0.1 ? Math.sin((Math.PI * f.phase) / 0.1) : 0;
            const k = Math.floor(f.Y * s.rows) * s.cols + Math.floor(f.X * s.rows);
            s.lit[k] = Math.max(s.lit[k], b);
        });
    },
    at: (x, y, t, cols, rows, s) => s.lit[y * cols + x],
};

// Conway's Game of Life on a wrapped grid. Dying cells fade out through the afterglow.
const life = {
    decay: 0.8,
    controls: [SPEED, { key: 'density', label: 'Density', min: 0.05, max: 0.6, step: 0.01, value: 0.3, reset: true }],
    init(cols, rows, v) {
        const grid = Uint8Array.from({ length: cols * rows }, () => (Math.random() < v.density ? 1 : 0));
        return { cols, rows, grid, acc: 0, gen: 0, pop: -1, flat: 0, density: v.density };
    },
    step(s, dt) {
        const { cols, rows } = s;
        for (s.acc += dt; s.acc >= 1 / 8; s.acc -= 1 / 8) {
            const next = new Uint8Array(cols * rows);
            let pop = 0;
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    let n = 0;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx || dy) n += s.grid[((y + dy + rows) % rows) * cols + ((x + dx + cols) % cols)];
                        }
                    }
                    const alive = s.grid[y * cols + x];
                    next[y * cols + x] = n === 3 || (alive && n === 2) ? 1 : 0;
                    pop += next[y * cols + x];
                }
            }
            s.grid = next;
            s.gen++;
            s.flat = pop === s.pop ? s.flat + 1 : 0;
            s.pop = pop;
            // Once it has died out or settled, seed it again.
            if (s.flat > 24 || s.gen > 600) Object.assign(s, life.init(cols, rows, s), { acc: s.acc });
        }
    },
    at: (x, y, t, cols, rows, s) => s.grid[y * cols + x],
    click(s, X, Y) {
        // Drop a glider where you click.
        const cx = Math.floor(X * s.rows), cy = Math.floor(Y * s.rows);
        for (const [dx, dy] of [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]]) {
            s.grid[((cy + dy) % s.rows) * s.cols + ((cx + dx) % s.cols)] = 1;
        }
        s.flat = 0;
    },
};

// The footer band's click ripple: rings spread from random drops, like rain on a pond.
// Same ring shape as the footer, squashed vertically so it spreads wide across the strip.
const RIPPLE_SECONDS = 1.35;
const ripple = {
    decay: 0,
    controls: [SPEED, { key: 'rate', label: 'Drops', min: 0, max: 3, step: 0.1, value: 0.6 }],
    init: (cols, rows) => ({ cols, rows, rings: [], clock: 0, next: 0 }),
    step(s, dt, t, ptr, v) {
        s.clock += dt;
        if (v.rate > 0 && s.clock >= s.next) {
            s.rings.push({ x: Math.random() * s.cols, y: Math.random() * s.rows, born: s.clock });
            s.next = s.clock + (0.4 + Math.random() * 1.2) / v.rate;
        }
        s.rings = s.rings.filter((r) => s.clock - r.born < RIPPLE_SECONDS);
    },
    at: (x, y, t, cols, rows, s) => {
        let i = 0;
        for (const r of s.rings) {
            const age = s.clock - r.born;
            const d = Math.hypot(x - r.x, (y - r.y) * 1.7);
            i = Math.max(i, Math.exp(-Math.pow(d - age * 9.5, 2) / 1.8) * (1 - age / RIPPLE_SECONDS));
        }
        return Math.min(1, i * 1.1);
    },
    click(s, X, Y) {
        s.rings.push({ x: X * s.rows, y: Y * s.rows, born: s.clock });
    },
};

// The current time in a 3x5 lamp font, doubled up when there's room.
const GLYPHS = {
    0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111',
    4: '101101111001001', 5: '111100111001111', 6: '111100111101111', 7: '111001001001001',
    8: '111101111101111', 9: '111101111001111', ':': '01010',
};
const clock = {
    decay: 0.85,
    init: (cols, rows) => ({ cols, rows, lit: new Float32Array(cols * rows) }),
    step(s) {
        const now = new Date();
        const colon = now.getMilliseconds() < 500;
        const width = (str, scale) => [...str].reduce((w, c) => w + (c === ':' ? 1 : 3) * scale + scale, -scale);
        const parts = [now.getHours(), now.getMinutes(), now.getSeconds()].map((n) => String(n).padStart(2, '0'));
        // Drop the seconds when even the smallest digits won't fit.
        let text = parts.join(':');
        if (width(text, 1) > s.cols) text = parts.slice(0, 2).join(':');
        let scale = Math.max(1, Math.floor(s.rows / 6));
        while (scale > 1 && width(text, scale) > s.cols) scale--;
        let left = Math.floor((s.cols - width(text, scale)) / 2);
        const top = Math.floor((s.rows - 5 * scale) / 2);
        s.lit.fill(0);
        for (const c of text) {
            const w = c === ':' ? 1 : 3;
            for (let gy = 0; gy < 5 * scale; gy++) {
                for (let gx = 0; gx < w * scale; gx++) {
                    const on = c === ':' ? colon && GLYPHS[':'][Math.floor(gy / scale)] === '1' : GLYPHS[c][Math.floor(gy / scale) * 3 + Math.floor(gx / scale)] === '1';
                    const x = left + gx, y = top + gy;
                    if (on && x >= 0 && x < s.cols && y >= 0 && y < s.rows) s.lit[y * s.cols + x] = 1;
                }
            }
            left += (w + 1) * scale;
        }
    },
    at: (x, y, t, cols, rows, s) => s.lit[y * cols + x],
};

// Each pattern maps a cell (x, y) at time t (seconds) to a brightness from 0 to 1.
// `decay` is how much light a cell keeps per 60th of a second after its target drops,
// the afterglow of an incandescent bulb. 0 means cells switch off instantly.
// Patterns with `init` keep state: `step` advances it once per frame before cells are read.
// `controls` are the values a writing demo can expose as sliders; `speed` and `afterglow`
// are handled here, the rest are passed to the pattern. `reset` ones restart the state.
export const PATTERNS = {
    flat: { decay: 0, at: () => 0 },
    sweep: {
        decay: 0.9,
        controls: [SPEED, afterglow(0.9)],
        at: (x, y, t, cols) => {
            const head = (0.5 - 0.5 * Math.cos(t * 1.6)) * (cols - 1);
            return smooth(1 - Math.abs(x - head) / 1.6);
        },
    },
    drift: { decay: 0, controls: [SPEED, SCALE, THRESHOLD], at: (x, y, t, cols, rows, s, v) => drift(x, y, t, v) },
    dither: {
        decay: 0,
        controls: [SPEED, SCALE, THRESHOLD],
        at: (x, y, t, cols, rows, s, v) => (drift(x, y, t, v) > BAYER[(y % 4) * 4 + (x % 4)] ? 1 : 0),
    },
    rain: {
        decay: 0.86,
        controls: [SPEED, afterglow(0.86)],
        at: (x, y, t, cols, rows) => {
            const speed = 5 + hash(x, 1, 1) * 9;
            const head = fract(t * speed / (rows * 3) + hash(x, 2, 2)) * rows * 3;
            return Math.abs(head - y) < 0.6 ? 1 : 0;
        },
    },
    ripple,
    fireflies,
    life,
    clock,
    descent,
    kmeans,
};

const REST = 0.12;
const REACH = 4.8;

// A grid of lamp cells drawn on a canvas. Cells rest dim and brighten with the pattern;
// with `interactive`, the pointer carries its own light like the footer band. `level` caps
// the brightest a cell gets, so a background field can sit below the text in front of it.
const format = (n, step) => n.toFixed(Math.max(0, -Math.floor(Math.log10(step) + 1e-9)));
const defaults = (P) => Object.fromEntries((P.controls || []).map((c) => [c.key, c.value]));

const PixelField = ({ pattern = 'drift', cell = 12, gap = 3, height = 160, level = 1, interactive = false, controls = false, caption = [], className = '' }) => {
    const P = PATTERNS[pattern] || PATTERNS.drift;
    const wrap = useRef(null);
    const canvas = useRef(null);
    const [values, setValues] = useState(() => defaults(P));
    // The animation loop reads slider values from here, so moving one doesn't restart it.
    const live = useRef({ v: values, dirty: false, kick: null });

    useEffect(() => {
        const el = canvas.current;
        const ctx = el.getContext('2d');
        const { at } = P;
        const knobs = live.current;
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const ptr = { x: -99, y: -99, tx: -99, ty: -99 };

        let cols = 0, rows = 0, step = 0, buf = new Float32Array(0);
        let raf = 0, last = 0, visible = true, t = still ? 12 : 0, state = null;

        const resize = () => {
            const w = wrap.current.clientWidth;
            const dpr = window.devicePixelRatio || 1;
            cols = Math.max(1, Math.floor((w + gap) / (cell + gap)));
            step = (w + gap) / cols;
            rows = Math.max(1, Math.floor((height + gap) / step));
            el.width = Math.round(w * dpr);
            el.height = Math.round((rows * step - gap) * dpr);
            el.style.height = `${rows * step - gap}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            buf = new Float32Array(cols * rows);
            start();
        };
        const start = () => {
            knobs.dirty = false;
            if (!P.init) return;
            state = P.init(cols, rows, knobs.v);
            // With reduced motion there's one frame, so show the process part-way through.
            if (still) for (let i = 0; i < 300; i++) P.step(state, 1 / 40, i / 40, ptr, knobs.v);
        };

        const draw = (dt) => {
            const ink = getComputedStyle(el).getPropertyValue('--band-cell').trim() || '#fff';
            const v = knobs.v;
            const decay = v.afterglow ?? P.decay;
            const keep = decay ? Math.pow(decay, dt * 60) : 0;
            if (knobs.dirty) start();
            ptr.x += (ptr.tx - ptr.x) * Math.min(1, dt * 10);
            ptr.y += (ptr.ty - ptr.y) * Math.min(1, dt * 10);
            const size = step - gap;
            if (P.step && dt > 0) P.step(state, dt * (v.speed ?? 1), t, ptr, v);

            ctx.clearRect(0, 0, el.width, el.height);
            ctx.fillStyle = ink;
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const k = y * cols + x;
                    let i = Math.max(at(x, y, t, cols, rows, state, v), buf[k] * keep);
                    buf[k] = i;
                    if (interactive) i = Math.max(i, smooth(1 - Math.hypot(x - ptr.x, (y - ptr.y) * 1.2) / REACH));
                    const s = size * (0.86 + i * 0.14);
                    ctx.globalAlpha = REST + i * (level - REST);
                    ctx.fillRect(x * step + (size - s) / 2, y * step + (size - s) / 2, s, s);
                }
            }
            ctx.globalAlpha = 1;
        };

        const frame = (now) => {
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
            last = now;
            if (!still) t += dt * (knobs.v.speed ?? 1);
            draw(dt);
            raf = visible && !(still && Math.abs(ptr.tx - ptr.x) < 0.01) ? requestAnimationFrame(frame) : 0;
        };
        const kick = () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } };
        knobs.kick = kick;

        const move = (e) => {
            const r = el.getBoundingClientRect();
            ptr.tx = (e.clientX - r.left) / step - 0.5;
            ptr.ty = (e.clientY - r.top) / step - 0.5;
            if (ptr.x < -50) { ptr.x = ptr.tx; ptr.y = ptr.ty; }
            kick();
        };
        const leave = () => { ptr.tx = ptr.ty = -99; kick(); };
        const click = (e) => {
            const r = el.getBoundingClientRect();
            P.click(state, (e.clientX - r.left) / step / rows, (e.clientY - r.top) / step / rows);
            kick();
        };

        resize();
        const ro = new ResizeObserver(() => {
            if (!wrap.current) return;
            resize();
            draw(0);
        });
        ro.observe(wrap.current);
        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) kick();
        });
        io.observe(el);
        // The theme lives on an ancestor's data-theme, so repaint when it flips.
        const mo = new MutationObserver(() => draw(0));
        const themed = el.closest('[data-theme]');
        if (themed) mo.observe(themed, { attributes: true, attributeFilter: ['data-theme'] });
        if (interactive || P.pointer || P.click) {
            el.addEventListener('pointermove', move);
            el.addEventListener('pointerleave', leave);
        }
        if (P.click) el.addEventListener('click', click);
        kick();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            io.disconnect();
            mo.disconnect();
            el.removeEventListener('pointermove', move);
            el.removeEventListener('pointerleave', leave);
            el.removeEventListener('click', click);
            knobs.kick = null;
        };
    }, [P, cell, gap, height, level, interactive]);

    const set = (c, value) => {
        const next = { ...live.current.v, [c.key]: value };
        live.current.v = next;
        if (c.reset) live.current.dirty = true;
        live.current.kick?.();
        setValues(next);
    };
    const restart = () => { live.current.dirty = true; live.current.kick?.(); };

    return (
        <div ref={wrap} className={`jr-pixels ${className}`}>
            <div className="jr-pixels-stage">
                <canvas ref={canvas} aria-hidden="true" />
                {caption.length > 0 && (
                    <div className="jr-pixels-caption">
                        <strong>{caption[0]}</strong>
                        {caption.slice(1).map((line) => <p key={line}>{line}</p>)}
                    </div>
                )}
            </div>
            {controls && P.controls && (
                <div className="jr-pixels-controls">
                    {P.controls.map((c) => (
                        <label key={c.key} className="jr-slider">
                            <span>{c.label}</span>
                            <output>{format(values[c.key], c.step)}</output>
                            <input
                                type="range"
                                min={c.min}
                                max={c.max}
                                step={c.step}
                                value={values[c.key]}
                                onChange={(e) => set(c, Number(e.target.value))}
                            />
                        </label>
                    ))}
                    {P.init && <button type="button" className="jr-pixels-restart" onClick={restart}>Restart</button>}
                </div>
            )}
        </div>
    );
};

export default PixelField;
