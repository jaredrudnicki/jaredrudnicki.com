import React from 'react';
import { NavLink } from 'react-router-dom';

export const SectionHead = ({ children }) => (
    <div className="jr-section-head">
        <span className="jr-label">{children}</span>
        <span className="jr-rule" aria-hidden="true" />
    </div>
);

const SunIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
);

const MoonIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
    </svg>
);

export const Nav = ({ theme, onToggleTheme }) => {
    const next = theme === 'dark' ? 'light' : 'dark';
    return (
        <header className="jr-nav">
            <NavLink to="/" end>Home</NavLink>
            <span className="jr-flex" />
            <NavLink to="/experience">Experience</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/writing">Writing</NavLink>
            <button type="button" className="jr-theme" onClick={onToggleTheme} aria-label={`Switch to ${next} mode`}>
                {next === 'light' ? <SunIcon /> : <MoonIcon />}
            </button>
        </header>
    );
};
