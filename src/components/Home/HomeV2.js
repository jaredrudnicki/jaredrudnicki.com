import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SectionHead } from '../Layout';
import Socials from './Socials';
import Booking, { CAL_LINK } from './Booking';
import Page from '../Page';
import PixelField from '../PixelField';
import PostList from '../Writing/PostList';
import { usePosts } from '../../content/writing';

const RECENT = 5;

const HomeV2 = () => {
    const { hash } = useLocation();
    const posts = usePosts();
    const [booking, setBooking] = useState(CAL_LINK && hash === '#book');

    useEffect(() => {
        if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    }, [hash, posts]);

    const openBooking = () => {
        setBooking(true);
        // Wait a frame so the panel exists; only scrolls when it's stacked below the bio.
        requestAnimationFrame(() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
    };

    return (
        <Page>
            <main className="jr-home">
                <section className="jr-hero">
                    <PixelField className="jr-hero-pixels" pattern="drift" level={0.7} interactive />
                    <div className={`jr-hero-body${booking ? ' has-cal' : ''}`}>
                        <div className="jr-hero-intro">
                            <h1 className="jr-name">
                                <span className="jr-name-text">Jared Rudnicki</span>
                                <span className="jr-name-mask" aria-hidden="true" />
                            </h1>
                            <p className="jr-bio">
                                I build software where design and AI meet. I'm a software engineer at{' '}
                                <a href="https://www.copley.com" target="_blank" rel="noreferrer">Copley</a>,
                                a demand engineering platform.{' '}
                                {CAL_LINK ? (
                                    <button type="button" className="jr-bio-more" onClick={openBooking} aria-expanded={booking}>
                                        Let's chat.
                                    </button>
                                ) : null}
                            </p>
                            <Socials />
                        </div>
                        {booking && <Booking onClose={() => setBooking(false)} />}
                    </div>
                </section>

                {posts?.length > 0 && (
                    <section id="writing" className="jr-section">
                        <SectionHead>Recent writing</SectionHead>
                        <PostList posts={posts.slice(0, RECENT)} />
                        {posts.length > RECENT && <Link to="/writing" className="jr-back">All writing →</Link>}
                    </section>
                )}
            </main>
        </Page>
    );
};

export default HomeV2;
