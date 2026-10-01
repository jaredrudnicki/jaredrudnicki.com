import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { SectionHead } from './Layout';
import Page from './Page';
import PixelField from './PixelField';

// A ```pixel block in markdown renders a live pixel field, e.g. "sweep cell=16 height=96 interactive".
// Any lines after the first are a caption drawn over the field: a heading, then body text.
function pixelProps(source) {
    const [first, ...lines] = String(source).trim().split('\n');
    const [pattern, ...opts] = first.trim().split(/\s+/);
    const caption = lines.map((l) => l.trim()).filter(Boolean);
    const props = { pattern, caption };
    for (const opt of opts) {
        const [k, v] = opt.split('=');
        props[k] = v === undefined ? true : Number(v);
    }
    return props;
}

const markdown = {
    pre: ({ node, children, ...rest }) => {
        const code = React.Children.toArray(children)[0];
        if (code?.props?.className === 'language-pixel') return <PixelField {...pixelProps(code.props.children)} />;
        return <pre {...rest}>{children}</pre>;
    },
};

const Entry = ({ label, title, meta = [], links = [], body, back }) => {
    useEffect(() => { window.scrollTo(0, 0); }, [title]);

    return (
        <Page>
            <article className="jr-section jr-entry">
                <SectionHead>{label}</SectionHead>
                <h1 className="jr-entry-title">{title}</h1>
                <div className="jr-entry-meta">
                    {meta.filter(Boolean).map((m) => <span key={m}>{m}</span>)}
                    {links.map((l) => (
                        <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label} ↗</a>
                    ))}
                </div>
                <div className="jr-prose">
                    <ReactMarkdown children={body} components={markdown} />
                </div>
                <Link to={back.to} className="jr-back">← {back.label}</Link>
            </article>
        </Page>
    );
};

export default Entry;
