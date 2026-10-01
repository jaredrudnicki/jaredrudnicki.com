import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { SectionHead } from '../Layout';
import Page from '../Page';
import PROJECTS from '../../content/projects';

export const ProjectRedirect = () => {
    const { slug } = useParams();
    return <Navigate to={`/projects#${slug}`} replace />;
};

const ProjectsPage = () => {
    const { hash } = useLocation();
    const [bodies, setBodies] = useState({});

    useEffect(() => {
        Promise.all(PROJECTS.map((p) => fetch(p.body).then((r) => r.text()))).then((texts) =>
            setBodies(Object.fromEntries(PROJECTS.map((p, i) => [p.slug, texts[i]])))
        );
    }, []);

    useEffect(() => {
        if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
        else window.scrollTo(0, 0);
    }, [hash, bodies]);

    return (
        <Page>
            <main className="jr-section jr-page">
                <SectionHead>Projects</SectionHead>
                <h1 className="jr-entry-title">Things I've built and helped build</h1>

                <div className="jr-page-body">
                    {PROJECTS.map((p) => (
                        <section key={p.slug} id={p.slug} className="jr-project">
                            <div className="jr-project-side">
                                <h2 className="jr-project-name">{p.name}</h2>
                                <p className="jr-project-blurb">{p.blurb}</p>
                                <div className="jr-entry-meta">
                                    <span>{p.meta}</span>
                                    {p.links.map((l) => (
                                        <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label} ↗</a>
                                    ))}
                                </div>
                            </div>
                            <div className="jr-prose">
                                <ReactMarkdown children={bodies[p.slug] || ''} />
                            </div>
                        </section>
                    ))}
                </div>
            </main>
        </Page>
    );
};

export default ProjectsPage;
