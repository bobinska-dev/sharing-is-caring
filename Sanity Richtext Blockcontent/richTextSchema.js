import React from "react";
import { Tooltip, Text, Box, Flex } from '@sanity/ui'

import PubReference from './PubReference'
import InternalReference from './InternalReference'

//you probably will have to install react-icons
import { BsSignpost, BsBriefcase } from "react-icons/bs";
import { GiClick } from "react-icons/gi";
import { IoBookOutline } from "react-icons/io5";
import { VscFeedback } from "react-icons/vsc";

// This is an example how you can use the values of fields and RENDER them inside of the EDITOR 
// The inline Versions are in the renderer folder and more elegant with types etc. 
//      Typescript would be more elegant here, but good-old {conditional rendering && } does the trick as well 🤫

const Button = ({ value }) => (
    <Tooltip
        content={
            <Box padding={2}>
                <Text muted size={1}>
                    If you insert multiple Buttons, they will be displayed next to each other in one row.
                </Text>
            </Box>
        }
        fallbackPlacements={['right', 'left']}
        placement="top"
        portal
    >
        <span style={{
            display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '20px'
        }}>
            <button style={{
                background: '#426D89',
                borderRadius: '5px',
                textDecoration: 'none',
                color: 'white', padding: '0 10px',
                border: 'none'

            }}>
                {value.title && <h4 >{value.title || 'noTitle'}</h4>}
            </button>
            {value.subtitle &&
                <Text align="center" size={1} muted={true}>
                    → {value.subtitle || 'noTarget'}
                </Text>
            }
        </span>
    </Tooltip >
);

//This is the editor itself 👇

export default {
    title: 'Enriched Text',
    name: 'richText',
    type: 'array',
    of: [
        {
            title: 'Block',
            type: 'block',

            styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'H4', value: 'h4' },
                { title: 'H5', value: 'h5' },
                { title: 'H6', value: 'h6' },
                { title: 'Quote', value: 'blockquote' },
                { title: 'Small', value: 'small' },
            ],
            lists: [
                { title: 'Bullet', value: 'bullet' },
                { title: 'Numbered', value: 'number' }
            ],
            marks: {
                decorators: [
                    { title: 'Strong', value: 'strong' },
                    { title: 'Emphasis', value: 'em' },
                ],

                // these are inline links
                annotations: [
                    {
                        name: 'link',
                        type: 'object',
                        title: 'External Link',
                        fields: [
                            {
                                name: 'url',
                                type: 'url',
                                validation: Rule =>
                                    Rule.regex(
                                        /https:\/\/(www\.|)(portabletext\.org|sanity\.io)\/.*/gi,
                                        {
                                            name: 'internal url',
                                            invert: true
                                        }
                                    ).warning(
                                        `This is not an external link. Consider using internal links instead.`
                                    )
                            },

                        ],
                    },
                    {
                        name: 'internalLink',
                        type: 'object',
                        title: 'Internal Link',
                        icon: BsSignpost,
                        blockEditor: {
                            render: InternalReference
                        },
                        fields: [
                            {
                                name: 'reference',
                                type: 'reference',
                                title: 'Reference',
                                to: [
                                    { type: 'PAGE' },// add your page schematypes here here
                                ]
                            }
                        ],
                    },
                    // I added this example to show, how you can use a doc like a publication not just a link
                    {
                        name: 'publication',
                        title: 'Reference Publication',
                        type: 'reference',
                        icon: IoBookOutline,
                        blockEditor: {
                            render: PubReference
                        },
                        to: { type: 'publication' },
                    },

                ],

            }
        },

        // I defined the Youtube embed outside of this file and imported it through  schema.js -> You can use this approach or the one below 
        {
            type: 'youtube'
        },

        // I use buttons for important links in the richText (portableText) so maybe you want to use it too 
        // use the Button Component from the beginning to style it

        {
            title: 'Internal Btn',
            name: 'internalBtn',
            type: 'object',
            icon: GiClick,
            preview: {
                select: {
                    title: 'title',
                    subtitle: 'reference?.title',
                    media: 'icon'
                },
                component: Button
            },
            fields: [
                {
                    title: 'Button Text',
                    name: 'title',
                    type: 'string'
                },
                {
                    title: 'Where does it link to?',
                    name: 'reference',
                    type: 'reference',
                    to: [
                        { type: 'PAGE' },// add your page schematypes here here
                    ]
                }
            ]
        },
        {
            title: 'External Btn',
            name: 'externalBtn',
            type: 'object',
            icon: GiClick,
            preview: {
                select: {
                    title: 'title',
                    subtitle: 'url',
                    media: 'icon'
                },
                component: Button
            },
            fields: [
                {
                    title: 'Button Text',
                    name: 'title',
                    type: 'string'
                },
                {
                    title: 'Url',
                    name: 'url',
                    type: 'url',
                    validation: Rule =>
                        Rule.regex(
                            /https:\/\/(www\.|)(portabletext\.org|sanity\.io)\/.*/gi,
                            {
                                name: 'internal url',
                                invert: true
                            }
                        ).warning(
                            `This is not an external link. Consider using internal links instead.`
                        )
                }
            ]
        },
        {
            type: 'file',
            title: `File Btn`,
            description: 'Button for file-download',
            icon: GiClick,
            fields: [
                {
                    type: 'string',
                    name: 'title',
                    title: 'Button Text',
                    options: {
                        isHighlighted: true
                    }
                }
            ]
        },
        {
            type: 'image',
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

    ],
}
