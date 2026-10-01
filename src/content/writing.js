import { useEffect, useState } from 'react';

// Every .md file in ./writing becomes a post; the filename is its URL slug.
const files = require.context('./writing', false, /\.md$/);

function parse(text) {
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) return { data: {}, body: text };
    const data = {};
    for (const line of match[1].split(/\r?\n/)) {
        const i = line.indexOf(':');
        if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    }
    return { data, body: match[2] };
}

async function loadPost(key) {
    const mod = files(key);
    const text = await (await fetch(mod.default || mod)).text();
    const { data, body } = parse(text);
    const slug = key.replace(/^\.\//, '').replace(/\.md$/, '');
    return {
        slug,
        title: data.title || slug,
        date: data.date || '',
        kind: data.kind || 'Note',
        summary: data.summary || '',
        draft: data.draft === 'true',
        body,
    };
}

let cache;
export function loadPosts() {
    if (!cache) {
        cache = Promise.all(files.keys().map(loadPost)).then((posts) =>
            posts
                .filter((p) => !p.draft || process.env.NODE_ENV !== 'production')
                .sort((a, b) => b.date.localeCompare(a.date))
        );
    }
    return cache;
}

export function usePosts() {
    const [posts, setPosts] = useState(null);
    useEffect(() => {
        let live = true;
        loadPosts().then((p) => live && setPosts(p));
        return () => { live = false; };
    }, []);
    return posts;
}

export function formatDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    if (!y) return '';
    return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
