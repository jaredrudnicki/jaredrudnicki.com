import React from 'react';

const EMAIL = 'jared.a.rudnicki@gmail.com';
const X_URL = '';

const XIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.724 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const MailIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3.5 6l8.5 7 8.5-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
);

const LINKS = [
    X_URL && { label: 'X', href: X_URL, Icon: XIcon },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jared-rudnicki/', Icon: LinkedInIcon },
    { label: `Email ${EMAIL}`, href: `mailto:${EMAIL}`, Icon: MailIcon, local: true },
].filter(Boolean);

const Socials = () => (
    <nav className="jr-socials" aria-label="Contact">
        {LINKS.map(({ label, href, Icon, local }) => (
            <a
                key={href}
                href={href}
                aria-label={label}
                title={label}
                {...(local ? {} : { target: '_blank', rel: 'noreferrer' })}
            >
                <Icon />
            </a>
        ))}
    </nav>
);

export default Socials;
