import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Entry from '../Entry';
import Page from '../Page';
import { formatDate, usePosts } from '../../content/writing';

const PostPage = () => {
    const { slug } = useParams();
    const posts = usePosts();

    if (!posts) return <Page />;

    const post = posts.find((p) => p.slug === slug);
    if (!post) return <Navigate to="/" replace />;

    return (
        <Entry
            label={post.kind}
            title={post.title}
            meta={[formatDate(post.date), post.draft && 'Draft']}
            body={post.body}
            back={{ to: '/writing', label: 'All writing' }}
        />
    );
};

export default PostPage;
