import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../content/writing';

const PostList = ({ posts }) => (
    <div className="jr-posts">
        {posts.map((p) => (
            <Link key={p.slug} className="jr-post" to={`/writing/${p.slug}`}>
                <span className="jr-post-title">{p.title}</span>
                <span className="jr-post-kind">{p.draft ? 'Draft' : p.kind}</span>
                <span className="jr-post-date">{formatDate(p.date)}</span>
            </Link>
        ))}
    </div>
);

export default PostList;
