import { TrashIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType, ObjectItem } from "sanity";
import { DeletionLogInputComponent } from "./DeletionLogInputComponent";
import { DeletionLogItemComponent } from "./DeletionLogItemComponent";

// let's make the TS dogs happy
/** ## LogItem object
 *
 * ### Props
 * @property {string} docId
 * @property {string} deletedAt
 * @property {string} type (document type)
 * @property {string} documentTitle (either the title or name of the document or 'Unknown 🥲')
 *
 * ### Extends ObjectItem from Sanity with:
 *
 * @property {string} _key
 * @property {string} _type (item type)
 *
 * _______________________________________________________________________________________
 *
 * ### Good To know:
 * `_key` is the revision ID of the deleted document
 *
 */
export interface LogItem extends ObjectItem {
  docId: string;
  deletedAt: string;
  type: string;
  documentTitle: string | "Unknown 🥲";
}

export const deletedDocBinDocument = defineType({
  // We use a dot in the document type name and the _id to make sure this is a private document which cannot be read unless you are authenticated.
  name: "deletedDocs.bin",
  title: "Bin: Deleted Document Log",
  type: "document",
  icon: TrashIcon,
  // we want to skip a draft version of this document, so we set this 👇
  liveEdit: true,
  // Fieldset to "hide away" the deletedDocIds array from view unless we need them
  fieldsets: [
    {
      name: "deletedDocIdLogs",
      title: "All Deleted Doc Id Logs",
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    // * Main log for restoring documents
    defineField({
      name: "deletedDocLogs",
      title: "Deleted Doc Logs",
      type: "array",
      readOnly: true,
      options: {
        sortable: false,
      },
      description:
        "Log of deleted documents. All items have the revision ID as the _key value and might have already been restored again.",
      components: {
        input: DeletionLogInputComponent,
      },
      of: [
        defineArrayMember({
          type: "object",
          name: "log",
          title: "Log",
          readOnly: true,
          components: {
            item: DeletionLogItemComponent,
          },
          fields: [
            defineField({
              name: "docId",
              title: "Doc Id",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "deletedAt",
              title: "Deleted At",
              type: "datetime",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "type",
              title: "Type",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "documentTitle",
              title: "Document Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
    // Backup of all deleted doc ids
    defineField({
      name: "deletedDocIds",
      title: "Deleted Doc Ids",
      type: "array",
      readOnly: true,
      options: {
        sortable: false,
      },
      fieldset: "deletedDocIdLogs",
      of: [
        defineArrayMember({
          name: "deletedDocId",
          type: "string",
          readOnly: true,
          components: {
            input: DeletedDocIdInputComponent,
          },
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    // title for the document (will be set during creation via CLI)
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      hidden: true,
    }),
  ],
});
