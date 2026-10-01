import sundrop from './projects/sundrop-design.md';
import giftPicker from './projects/gift-picker.md';
import jrivia from './projects/jrivia.md';
import scute from './projects/scute.md';

const PROJECTS = [
    {
        slug: 'scute',
        name: 'Scute',
        meta: 'iOS · Mapbox · Strava',
        blurb: 'An in-progress iOS app built on Mapbox and Strava.',
        links: [{ label: 'Visit site', href: 'https://www.scute.run/' }],
        body: scute,
    },
    {
        slug: 'gift-picker',
        name: 'Gift Picker',
        meta: 'TypeScript · React',
        blurb: 'A gift recommender with a weighted matching algorithm.',
        links: [
            { label: 'Visit site', href: 'https://giftpicker.io/' },
            { label: 'GitHub', href: 'https://github.com/getpresently/gift-picker' },
            { label: 'Product Hunt', href: 'https://www.producthunt.com/products/giftpicker-by-presently' },
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
];

export default PROJECTS;
