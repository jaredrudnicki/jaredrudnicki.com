import React, { useEffect, useReducer, useRef, useState } from 'react';

const ROWS = 4;
const TARGET_CELL = 30;
const RIPPLE_SECONDS = 1.35;

const smooth = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const colsFor = (width) => Math.max(17, Math.min(64, Math.round(width / TARGET_CELL)));

function cellStyles(v, cols) {
    const age = (performance.now() - v.ripple) / 1000;
    const rippling = age >= 0 && age < RIPPLE_SECONDS;
    const out = [];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < cols; c++) {
            const lit = smooth(1 - Math.hypot(c - v.cx, (r - v.cy) * 1.7) / 4.8);
            let ring = 0;
            if (rippling) {
                const d = Math.hypot(c - v.rx, (r - v.ry) * 1.7);
                ring = Math.exp(-Math.pow(d - age * 9.5, 2) / 1.8) * (1 - age / RIPPLE_SECONDS);
            }
            const i = Math.min(1, Math.max(lit, ring * 1.1));
            out.push({
                opacity: 0.12 + i * 0.88,
                transform: `scale(${(0.86 + i * 0.14).toFixed(3)})`,
                boxShadow: i > 0.35 ? `0 0 12px color-mix(in oklch, var(--band-glow) ${Math.round(i * 75)}%, transparent)` : 'none',
            });
        }
    }
    return out;
}

// The headlamp band: cells light up around the cursor, and a click sends a ring outward.
const Footer = () => {
    const v = useRef({ cx: -9, cy: -9, rx: 0, ry: 0, ripple: -1e9 }).current;
    const t = useRef({ cx: -9, cy: -9 }).current;
    const raf = useRef(0);
    const band = useRef(null);
    const [cols, setCols] = useState(34);
    const [, force] = useReducer((n) => n + 1, 0);

    useEffect(() => {
        const el = band.current;
        const ro = new ResizeObserver(([entry]) => setCols(colsFor(entry.contentRect.width)));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const tick = () => {
        v.cx += (t.cx - v.cx) * 0.16;
        v.cy += (t.cy - v.cy) * 0.16;
        force();
        const settled = Math.abs(t.cx - v.cx) < 0.01 && Math.abs(t.cy - v.cy) < 0.01;
        const rippling = performance.now() - v.ripple < RIPPLE_SECONDS * 1000;
        raf.current = settled && !rippling ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf.current) raf.current = requestAnimationFrame(tick); };

    useEffect(() => () => cancelAnimationFrame(raf.current), []);

    const at = (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        return [((e.clientX - r.left) / r.width) * cols - 0.5, ((e.clientY - r.top) / r.height) * ROWS - 0.5];
    };
    const move = (e) => {
        if (t.cx < -5) [v.cx, v.cy] = at(e);
        [t.cx, t.cy] = at(e);
        kick();
    };
    const leave = () => { t.cx = -9; t.cy = -9; kick(); };
    const click = (e) => { [v.rx, v.ry] = at(e); v.ripple = performance.now(); kick(); };

    return (
        <footer className="jr-footer">
            <div
                ref={band}
                className="jr-band"
                style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                onPointerMove={move}
                onPointerLeave={leave}
                onPointerUp={(e) => e.pointerType !== 'mouse' && leave()}
                onClick={click}
                aria-hidden="true"
            >
                {cellStyles(v, cols).map((s, i) => <span key={i} style={s} />)}
            </div>
            <div className="jr-footer-meta">
                <span>© {new Date().getFullYear()} Jared Rudnicki</span>
            </div>
        </footer>
    );
};

export default Footer;
