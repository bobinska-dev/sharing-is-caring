# Code for guide [Create a bin for logging and restoring deleted documents](https://www.sanity.io/guides/bin-for-restoring-deleted-documents)

Set up a custom bin logic in your Studio, enabling users to restore deleted documents of a certain type with 2 clicks, using a webhook and a singleton document type, to which we add some custom components using the Component API and the Sanity UI.

## In this guide, you will

- Create a singleton document type and create your singleton document using the CLI.
  The `deletedDocs.bin` type will have a `deletedDocLogs` [array](https://github.com/bobinska-dev/sharing-is-caring/blob/bbe7ab322ce5e755c9d32c915bc0a937820ef495/Document%20Bin%20-%20Restoring%20deleted%20documents%20in%20the%20studio/deletedDocBinDocument.tsx#L55) with log items (objects) where we store the `documentId` (string), `type` (string), `deletedAt` (datetime) and `documentTitle` (string) of each deleted document. [See interface LogItem](https://github.com/bobinska-dev/sharing-is-caring/blob/bbe7ab322ce5e755c9d32c915bc0a937820ef495/Document%20Bin%20-%20Restoring%20deleted%20documents%20in%20the%20studio/deletedDocBinDocument.tsx#L26-L31)
  There can also be a more straightforward (optional) [array](https://github.com/bobinska-dev/sharing-is-caring/blob/bbe7ab322ce5e755c9d32c915bc0a937820ef495/Document%20Bin%20-%20Restoring%20deleted%20documents%20in%20the%20studio/deletedDocBinDocument.tsx#L107) `deletedDocIds` with just the `_id` stings.

- Create a custom item component for the `log` items, including the intent button for opening the deleted documents in question.

- Create a custom input component for the deletedDocLogs array, which will remove all document logs, which have been restored already.

- Set up a webhook which will be triggered upon deletion of a subset of documents. This webhook will hit the mutation endpoint and patch the deleted document information we need to the logs of the bin singleton document.
