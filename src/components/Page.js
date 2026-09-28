import React, { useEffect, useRef, useState } from 'react';
import Footer from './Footer';
import { Nav } from './Layout';
import './Home/HomeV2.css';

const THEME_KEY = 'jr-theme';

function initialTheme() {
    try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

const Page = ({ children }) => {
    const [theme, setTheme] = useState(initialTheme);
    const root = useRef(null);

    useEffect(() => {
        // Match the body to the page so overscroll doesn't flash the old site's background.
        document.body.style.background = getComputedStyle(root.current).getPropertyValue('--bg');
    }, [theme]);

    const toggleTheme = () => {
        const next = theme === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
        setTheme(next);
    };

    return (
        <div className="jr" data-theme={theme} ref={root}>
            <div className="jr-top">
                <Nav theme={theme} onToggleTheme={toggleTheme} />
            </div>
            {children}
            <Footer />
        </div>
    );
};

export default Page;
