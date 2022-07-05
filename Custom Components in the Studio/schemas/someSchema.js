
// in studio/schemas/someSchema.js

import { VscBrowser } from "react-icons/vsc";
import { createHeading } from "../../src/components/createHeading";
import { createDescription } from "../../src/components/createDescription";
import SlugInput from 'sanity-plugin-better-slug'
import { basePath, studioPubs, studioNews } from "../../src/basePath";
import { isUniqueAcrossAllDocuments } from '../../src/isUniqueAcrossAllDocuments'

export default {
    name: 'someSchema',
    title: 'Some Schema',
    type: 'document',
    icon: VscBrowser,
    groups: [
        {
            name: 'seo',
            title: 'SEO',
        },
        {
            name: 'content',
            title: 'Some Content',
        },
    ],
    fields: [
    createHeading("SEO Content", "h2"),
    {
        name: 'title',
        title: 'Title',
        type: 'string',
        group: 'seo',
        validation: Rule => Rule.required()
    },
    {
        name: 'description',
        title: 'Description (SEO)',
        type: 'text',
        group: 'seo',
        validation: Rule => Rule.required(),
        maxLength: 280,
        rows: 2
    },
    {
        name: 'image',
        title: 'Preview Image (OG Image)',
        group: 'seo',
        validation: Rule => Rule.required(),
        type: 'image',
        options: {
            hotspot: true,
        }
    },
    {
        title: 'Slug',
        name: 'slug',
        type: 'slug',
        inputComponent: SlugInput,
        group: 'seo',
        readOnly: false,
        options: {
            basePath: basePath,
            isUnique: isUniqueAcrossAllDocuments,
            source: 'title',
            maxLength: 200, // will be ignored if slugify is set
            slugify: input => input
                .toLowerCase()
                .replace(/\s+/g, '-')
                .slice(0, 200)
        }
        },
        createHeading("General Content", "h2"),
        createDescription(
        {
            group: 'content',
            title: 'Publications & News Feeds will be auto-generated on the page.',
            links: [
                { title: 'Publications', url: studioPubs },
                { title: 'News', url: studioNews },
            ]
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'description',
            media: 'image'
        }
    }

}
Footer
