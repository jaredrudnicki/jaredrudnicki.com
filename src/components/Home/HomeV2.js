import React, { useEffect, useReducer, useRef } from 'react';
import './HomeV2.css';

const LAMP_COLS = 34;
const LAMP_ROWS = 4;
const SLATS = 16;
const EMAIL = 'jared.a.rudnicki@gmail.com';

const PROJECTS = [
    { name: 'Sundrop Design', meta: 'Design studio · co-founder', href: 'https://www.sundropdesign.co/' },
    { name: 'Gift Picker', meta: 'TypeScript · React', href: 'https://giftpicker.io/' },
    { name: 'Jrivia', meta: 'Node · React', href: 'http://jrivia.netlify.app/' },
    { name: 'This website', meta: 'React · source', href: 'https://github.com/jaredrudnicki/jaredrudnicki.com' },
];

const ease = (x) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));

const initial = () => ({
    cas: 0, casHov: 0, casLock: 0,
    mask: 0, maskHov: 0, maskLock: 0,
    cx: -9, cy: -9, rx: 0, ry: 0, ripple: -1e9,
    ly: -9, lyOn: 0, bloom: -1e9,
    nixAt: -1e9,
});

const RATES = [['cas', 0.075], ['mask', 0.085], ['lyOn', 0.12], ['ly', 0.22], ['cx', 0.16], ['cy', 0.16]];

function step(v, t) {
    let live = false;
    for (const [k, rate] of RATES) {
        if (Math.abs(v[k] - t[k]) < 0.0015) v[k] = t[k];
        else { v[k] += (t[k] - v[k]) * rate; live = true; }
    }
    const now = performance.now();
    return live || now - v.ripple < 1400 || now - v.bloom < 1100 || now - v.nixAt < 1400;
}

function gridMap(fn) {
    const out = [];
    for (let r = 0; r < LAMP_ROWS; r++) for (let c = 0; c < LAMP_COLS; c++) out.push(fn(c, r));
    return out;
}

function cascadeCells(v) {
    const front = v.cas * (LAMP_COLS + 6) - 3;
    return gridMap((c, r) => {
        const pos = c + r * 0.5;
        const lead = Math.exp(-Math.pow(pos - front, 2) / 1.3);
        const i = Math.min(1, ease((front - pos) / 2.4) * 0.85 + lead * 0.5);
        return {
            opacity: 0.1 + i * 0.9,
            filter: `brightness(${(1 + lead * 0.75).toFixed(2)})`,
            boxShadow: i > 0.5 ? `0 0 10px oklch(0.75 0.19 52 / ${(i * 0.6).toFixed(2)})` : 'none',
        };
    });
}

function lampCells(v) {
    const age = (performance.now() - v.ripple) / 1000;
    const rippleLive = age >= 0 && age < 1.35;
    return gridMap((c, r) => {
        const lit = ease(1 - Math.hypot(c - v.cx, (r - v.cy) * 1.7) / 4.8);
        let ring = 0;
        if (rippleLive) {
            const dr = Math.hypot(c - v.rx, (r - v.ry) * 1.7);
            ring = Math.exp(-Math.pow(dr - age * 9.5, 2) / 1.8) * Math.max(0, 1 - age / 1.35);
        }
        const i = Math.min(1, Math.max(lit, ring * 1.1));
        return {
            opacity: 0.12 + i * 0.88,
            transform: `scale(${(0.86 + i * 0.14).toFixed(3)})`,
            boxShadow: i > 0.35 ? `0 0 12px oklch(0.97 0 0 / ${(i * 0.75).toFixed(2)})` : 'none',
        };
    });
}

function nixieDigits(v, target) {
    const el = performance.now() - v.nixAt;
    return target.map((d, i) => {
        const rolling = el >= 0 && el < 420 + i * 170;
        return rolling
            ? { d: String((Math.floor(el / 48) * 7 + i * 3) % 10), opacity: 0.72, filter: 'blur(0.7px)' }
            : { d, opacity: 1, filter: 'none' };
    });
}

function louvreSlats(v) {
    const bAge = (performance.now() - v.bloom) / 1000;
    return Array.from({ length: SLATS }, (_, i) => {
        const prox = Math.exp(-Math.pow(i - v.ly, 2) / 3.4) * v.lyOn;
        const bloom = bAge >= 0 && bAge < 1.05
            ? Math.exp(-Math.pow(i - bAge * 17, 2) / 5) * Math.max(0, 1 - bAge / 1.05)
            : 0;
        const a = Math.min(1, prox + bloom);
        return {
            height: `${(2 + a * 5.5).toFixed(2)}px`,
            background: `oklch(${(0.58 + a * 0.3).toFixed(3)} ${(0.13 + a * 0.04).toFixed(3)} ${(46 + a * 20).toFixed(0)})`,
            boxShadow: `0 0 ${(6 + a * 18).toFixed(1)}px oklch(0.6 0.16 44 / ${(0.3 + a * 0.5).toFixed(2)})`,
        };
    });
}

function relative(e, cols, rows) {
    const r = e.currentTarget.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * cols - 0.5, ((e.clientY - r.top) / r.height) * rows - 0.5];
}

const HomeV2 = () => {
    const v = useRef(initial()).current;
    const t = useRef(initial()).current;
    const [, force] = useReducer((n) => n + 1, 0);

    useEffect(() => {
        let raf;
        const tick = () => {
            if (step(v, t)) force();
            raf = requestAnimationFrame(tick);
        };
        v.nixAt = performance.now();
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [v, t]);

    const year = String(new Date().getFullYear()).split('');

    const maskIn = () => { v.maskHov = 1; t.mask = 1; };
    const maskOut = () => { v.maskHov = 0; t.mask = v.maskLock; };
    const maskClick = () => { v.maskLock = v.maskLock ? 0 : 1; t.mask = v.maskLock || v.maskHov; };

    const casIn = () => { v.casHov = 1; t.cas = 1; };
    const casOut = () => { v.casHov = 0; t.cas = v.casLock; };
    const casClick = () => { v.casLock = v.casLock ? 0 : 1; t.cas = v.casLock || v.casHov; force(); };

    const lampMove = (e) => { [t.cx, t.cy] = relative(e, LAMP_COLS, LAMP_ROWS); };
    const lampOut = () => { t.cx = -9; t.cy = -9; };
    const lampClick = (e) => { [v.rx, v.ry] = relative(e, LAMP_COLS, LAMP_ROWS); v.ripple = performance.now(); };

    const louvreMove = (e) => { t.ly = relative(e, 1, SLATS)[1]; t.lyOn = 1; };
    const louvreOut = () => { t.lyOn = 0; };
    const louvreClick = () => { v.bloom = performance.now(); };

    const rollNixie = () => { v.nixAt = performance.now(); };

    const maskSize = `${(8 + v.mask * 20).toFixed(1)}px`;

    return (
        <div className="jr">
            <header className="jr-nav">
                <div className="jr-nav-row">
                    <span className="jr-nav-name">Jared Rudnicki</span>
                    <span className="jr-flex" />
                    <a href="#projects">Projects</a>
                    <a href="#contact" className="jr-nav-accent">Contact</a>
                </div>
                <div className="jr-chrome" />
            </header>

            <section className="jr-hero">
                <div className="jr-intro" onMouseEnter={maskIn} onMouseLeave={maskOut} onClick={maskClick}>
                    <h1 className="jr-name">
                        <span style={{ textShadow: `0 0 ${(26 + v.mask * 34).toFixed(0)}px oklch(0.62 0.2 42 / ${(0.4 + v.mask * 0.35).toFixed(2)})` }}>
                            Jared Rudnicki
                        </span>
                        <span
                            className="jr-name-mask"
                            aria-hidden="true"
                            style={{ backgroundSize: `${maskSize} ${maskSize}`, opacity: 1 - v.mask * 0.82 }}
                        />
                    </h1>
                    <p className="jr-bio">
                        Software engineer working where design meets development.
                        Computer Science at Northeastern, with a concentration in AI.
                    </p>
                </div>

                <div className="jr-nixie-wrap" onMouseEnter={rollNixie} onClick={rollNixie}>
                    <span className="jr-label">This year</span>
                    <div className="jr-nixie">
                        {nixieDigits(v, year).map((n, i) => (
                            <span key={i} className="jr-nixie-tube" style={{ opacity: n.opacity, filter: n.filter }}>{n.d}</span>
                        ))}
                    </div>
                    <span className="jr-hint">click to re-roll</span>
                </div>
            </section>

            <div className="jr-headlamp" onPointerMove={lampMove} onPointerLeave={lampOut} onClick={lampClick}>
                <div className="jr-grid">
                    {lampCells(v).map((s, i) => <span key={i} className="jr-cell-white" style={s} />)}
                </div>
            </div>

            <section id="projects" className="jr-section">
                <div className="jr-cascade" onMouseEnter={casIn} onMouseLeave={casOut} onClick={casClick}>
                    <div className="jr-section-head">
                        <span className="jr-label">Projects</span>
                        <span className="jr-hint">{v.casLock ? 'locked on — click to release' : 'hover the marker · click to hold'}</span>
                    </div>
                    <div className="jr-grid jr-grid-amber">
                        {cascadeCells(v).map((s, i) => <span key={i} className="jr-cell-amber" style={s} />)}
                    </div>
                </div>

                <div className="jr-rows">
                    {PROJECTS.map((p, i) => (
                        <a key={p.name} className="jr-row" href={p.href} target="_blank" rel="noreferrer">
                            <span className="jr-pip" />
                            <span className="jr-row-n">{String(i + 1).padStart(2, '0')}</span>
                            <span className="jr-row-title">{p.name}</span>
                            <span className="jr-row-meta">{p.meta}</span>
                        </a>
                    ))}
                </div>
            </section>

            <footer id="contact" className="jr-contact" onMouseMove={louvreMove} onMouseLeave={louvreOut} onClick={louvreClick}>
                <div className="jr-slats" aria-hidden="true">
                    {louvreSlats(v).map((s, i) => <span key={i} style={s} />)}
                </div>
                <div className="jr-contact-body">
                    <div>
                        <span className="jr-label jr-label-bright">Contact</span>
                        <a className="jr-email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
                    </div>
                    <div className="jr-socials">
                        <a href="https://github.com/jaredrudnicki" target="_blank" rel="noreferrer">GitHub</a>
                        <a href="https://www.linkedin.com/in/jared-rudnicki/" target="_blank" rel="noreferrer">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomeV2;
