// Renders the social preview: the hero's drift field over the name, as public/og.gif
// (a seamless loop, for the apps that animate link previews) and public/og.png (its first frame).
// Needs ffmpeg on the PATH. Run with `node scripts/og/render.mjs`.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '../../public');
const font = (name) => path.join(here, 'fonts', name);

const W = 1200, H = 630;
const FPS = 15, LOOP = 5; // seconds
const T0 = 12; // the still frame the site shows with reduced motion

// The field, laid out like the hero: lamp cells with the brightest capped at `level`.
const CELL = 14, GAP = 4, LEVEL = 0.7, REST = 0.12;
const PAD = 64, FIELD_H = 300;

// Achromatic oklch lightness to an sRGB channel, so colors match HomeV2.css.
const gray = (L) => {
    const c = L ** 3;
    const s = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, s)) * 255);
};
const hex = (L) => '#' + gray(L).toString(16).padStart(2, '0').repeat(3);
const BG = gray(0.14), INK = gray(0.99);

// From src/components/PixelField.js: smooth 3D value noise and the drift pattern.
const smooth = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const fract = (x) => x - Math.floor(x);
const hash = (x, y, z) => fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453);
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
const field = (x, y, t) => noise(x * 0.09, y * 0.16, t * 0.18) * 0.65 + noise(x * 0.23, y * 0.4, t * 0.35 + 9) * 0.35;

// Drift never repeats, so to loop it the field at t is mixed with the field one loop earlier,
// on a quarter circle so the mix keeps the noise's contrast instead of averaging it flat.
const looped = (x, y, t) => {
    const a = ((t - T0) / LOOP) * (Math.PI / 2);
    const n = Math.cos(a) * (field(x, y, t) - 0.5) + Math.sin(a) * (field(x, y, t - LOOP) - 0.5);
    return smooth(n / 0.28);
};

const cols = Math.floor((W - 2 * PAD + GAP) / (CELL + GAP));
const step = (W - 2 * PAD + GAP) / cols;
const rows = Math.floor((FIELD_H + GAP) / step);

const frame = (t) => {
    const px = Buffer.alloc(W * H * 3, BG);
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const i = looped(x, y, t);
            const a = REST + i * (LEVEL - REST);
            const c = Math.round(BG + (INK - BG) * a);
            const s = Math.round(CELL * (0.86 + i * 0.14));
            const x0 = Math.round(PAD + x * step + (CELL - s) / 2);
            const y0 = Math.round(PAD + y * step + (CELL - s) / 2);
            for (let yy = y0; yy < y0 + s; yy++) px.fill(c, (yy * W + x0) * 3, (yy * W + x0 + s) * 3);
        }
    }
    return px;
};

const frames = Array.from({ length: FPS * LOOP }, (_, k) => frame(T0 + k / FPS));
const raw = Buffer.concat(frames);

const top = PAD + rows * step - GAP;
const text = (file, size, color, x, y, s) =>
    `drawtext=fontfile='${font(file)}':text='${s}':fontsize=${size}:fontcolor=${color}:x=${x}:y=${y}`;
const overlay = [
    text('Geist-SemiBold.ttf', 104, hex(0.97), PAD - 6, top + 64, 'Jared Rudnicki'),
    text('Geist-Regular.ttf', 30, hex(0.76), PAD, top + 196, 'I build software where design and AI meet.'),
    text('GeistMono-Regular.ttf', 22, hex(0.58), `w-tw-${PAD}`, top + 204, 'jaredrudnicki.com'),
].join(',');

const ffmpeg = (args) => {
    const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y',
        '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-', ...args], { input: raw });
    if (r.status !== 0) throw new Error(r.stderr.toString());
};
ffmpeg(['-vf', overlay, '-frames:v', '1', path.join(out, 'og.png')]);
ffmpeg(['-filter_complex', `${overlay},split[a][b];[a]palettegen=max_colors=32:stats_mode=full[p];[b][p]paletteuse=dither=none`,
    '-loop', '0', path.join(out, 'og.gif')]);
console.log(`og.png, og.gif: ${cols}x${rows} cells, ${frames.length} frames`);
