import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SectionHead } from '../Layout';
import Socials from './Socials';
import Page from '../Page';
import PixelField from '../PixelField';
import PostList from '../Writing/PostList';
import { usePosts } from '../../content/writing';

const RECENT = 5;

const HomeV2 = () => {
    const { hash } = useLocation();
    const posts = usePosts();

    useEffect(() => {
        if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    }, [hash, posts]);

    return (
        <Page>
            <main className="jr-home">
                <section className="jr-hero">
                    <PixelField className="jr-hero-pixels" pattern="drift" level={0.7} interactive />
                    <h1 className="jr-name">
                        <span className="jr-name-text">Jared Rudnicki</span>
                        <span className="jr-name-mask" aria-hidden="true" />
                    </h1>
                    <p className="jr-bio">
                        I build software where design and AI meet. Right now I'm building{' '}
                        <a href="https://www.copley.com" target="_blank" rel="noreferrer">Copley</a>,
                        a demand engineering platform. I studied computer science and AI at Northeastern.
                    </p>
                    <Socials />
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
