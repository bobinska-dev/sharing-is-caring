import { ImageIcon, LinkIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import InternalLinkRenderer from "../components/studio/InternalLinkRenderer";
import LinkRenderer from "../components/studio/LinkRenderer";

export default defineType({
  type: "array",
  name: "body",
  title: "Body",
  description: "This is where you can write general content. ",
  of: [
    // Paragraphs and default styles (not defined here, hence added by default)
    defineArrayMember({
      type: "block",

      // INLINE BLOCKS
      // to understand what this would do, visit: https://www.sanity.io/guides/add-inline-blocks-to-portable-text-editor
      of: [
        defineField({
          name: "authorReference",
          type: "reference",
          to: [{ type: "author" }],
        }),
      ],
      marks: {
        annotations: [
          defineField({
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "Url",
                validation: (Rule) =>
                  Rule.uri({
                    allowRelative: false,
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              },
            ],
            components: {
              annotation: LinkRenderer,
            },
          }),
          defineField({
            name: "internalLink",
            type: "object",
            title: "Link internal page",
            icon: LinkIcon,
            components: {
              annotation: InternalLinkRenderer,
            },
            fields: [
              {
                name: "reference",
                type: "reference",
                title: "Reference",
                to: [{ type: "page" }],
              },
            ],
          }),
        ],
      },
    }),
    defineField({
      type: "image",
      icon: ImageIcon,
      name: "image",
      title: "Image",
      options: {
        hotspot: true,
      },
      preview: {
        select: {
          imageUrl: "asset.url",
          title: "caption",
        },
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          description:
            "Alternative text for screenreaders. Falls back on caption if not set",
        }),
      ],
    }),
  ],
});
