import sundrop from './projects/sundrop-design.md';
import giftPicker from './projects/gift-picker.md';
import jrivia from './projects/jrivia.md';
import thisWebsite from './projects/this-website.md';

const PROJECTS = [
    {
        slug: 'gift-picker',
        name: 'Gift Picker',
        meta: 'TypeScript · React',
        blurb: 'A gift recommender with a weighted matching algorithm.',
        links: [
            { label: 'Visit site', href: 'https://giftpicker.io/' },
            { label: 'GitHub', href: 'https://github.com/getpresently/gift-picker' },
        ],
        body: giftPicker,
    },
    {
        slug: 'jrivia',
        name: 'Jrivia',
        meta: 'Node · React',
        blurb: 'A social trivia app with accounts, scores, and moderators.',
        links: [
            { label: 'Visit site', href: 'http://jrivia.netlify.app/' },
            { label: 'GitHub', href: 'https://github.com/jaredrudnicki/jrivia' },
        ],
        body: jrivia,
    },
    {
        slug: 'sundrop-design',
        name: 'Sundrop Design',
        meta: 'Next.js · Figma',
        blurb: 'A small design studio side project.',
        links: [{ label: 'Visit site', href: 'https://www.sundropdesign.co/' }],
        body: sundrop,
    },
    {
        slug: 'this-website',
        name: 'This website',
        meta: 'React · CSS',
        blurb: 'My personal site, built around a single pixel-lamp motif.',
        links: [{ label: 'GitHub', href: 'https://github.com/jaredrudnicki/jaredrudnicki.com' }],
        body: thisWebsite,
    },
];

export default PROJECTS;
