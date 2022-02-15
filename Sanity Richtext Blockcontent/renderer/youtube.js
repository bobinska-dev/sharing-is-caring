import React from 'react';
import getYouTubeID from 'get-youtube-id';

const YouTubePreview = ({ value }) => {

    const id = getYouTubeID(value.url);
    const url = `https://www.youtube.com/embed/${id}`;

    if (!id) {
        return <div>Missing YouTube URL</div>
    }

    return (
        <iframe
            title="YouTube Preview"
            width="300" height="155"
            src={url} title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">

        </iframe>
    )
};

export default {

    name: 'youtube',
    type: 'object',
    title: 'YouTube',
    fields: [
        {
            name: 'url',
            type: 'url',
            title: 'URL'
        }
    ],
    preview: {
        select: {
            url: 'url'
        },
        component: YouTubePreview

    }
}
