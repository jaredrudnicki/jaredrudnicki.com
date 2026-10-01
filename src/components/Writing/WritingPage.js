import React, { useEffect } from 'react';
import { SectionHead } from '../Layout';
import Page from '../Page';
import PostList from './PostList';
import { usePosts } from '../../content/writing';

const WritingPage = () => {
    const posts = usePosts();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <Page>
            <main className="jr-section jr-page">
                <SectionHead>Writing</SectionHead>
                <h1 className="jr-entry-title">Explorations, notes and mini projects</h1>
                <div className="jr-page-body">
                    {posts && posts.length === 0 && <p className="jr-empty">Nothing published yet.</p>}
                    {posts && posts.length > 0 && <PostList posts={posts} />}
                </div>
            </main>
        </Page>
    );
};

export default WritingPage;
