//Schema

export default {
    name: 'blogPost',
    title: 'Blog Post',
    type: 'document',

    fields: [
        // SEO Content
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required()
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2
        },
        {
            title: 'Slug',
            name: 'slug',
            type: 'slug',
            validation: Rule => Rule.required(),
            options: {
                source: 'title',
                maxLength: 200,
                slugify: input => input
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .slice(0, 200),

                /* TIP: 👇 add a slug validation, that makes sure, that even posts with the same title get a unique slug. You need to set it up and then import it. */
                //isUnique: isUniqueAcrossAllDocuments
            }
        },
        {
            name: 'image',
            type: 'image',
            title: 'Image',
            description: 'This will also be used as a preview image for social media and links shares.',
            options: {
                hotspot: true,
            },
            /* 👇 this will add a alt field to the image input component. */
            fields: [
                {
                    type: 'string',
                    name: 'alt',
                    title: 'Alternative text',
                    description: `Some of your visitors cannot see images, be they blind, color - blind, low - sighted; alternative text is of great help for those people that can rely on it to have a good idea of what\'s on your page.`,
                    options: {
                        isHighlighted: true
                    }
                }
            ]
        },

                    /* The rest of your schmea goes in here */
                    
    ]
}   