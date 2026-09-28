import React, { useEffect } from 'react';
import { SectionHead } from '../Layout';
import Page from '../Page';
import EXPERIENCE from '../../content/experience';

const ExperiencePage = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <Page>
            <main className="jr-section jr-page">
                <SectionHead>Experience</SectionHead>
                <h1 className="jr-entry-title">Where I've worked</h1>

                <ol className="jr-page-body jr-jobs">
                    {EXPERIENCE.map((job) => (
                        <li key={`${job.company}-${job.role}`} className="jr-job">
                            <div className="jr-job-when">
                                {job.dates && <span>{job.dates}</span>}
                                {job.type && <span>{job.type}</span>}
                            </div>
                            <div>
                                <h2 className="jr-job-role">
                                    {job.role}
                                    <span className="jr-job-at"> at </span>
                                    {job.href
                                        ? <a href={job.href} target="_blank" rel="noreferrer">{job.company}</a>
                                        : job.company}
                                </h2>
                                {job.summary && <p className="jr-job-summary">{job.summary}</p>}
                                {job.points.length > 0 && (
                                    <ul className="jr-job-points">
                                        {job.points.map((pt) => <li key={pt}>{pt}</li>)}
                                    </ul>
                                )}
                            </div>
                        </li>
                    ))}
                </ol>
            </main>
        </Page>
    );
};

export default ExperiencePage;
