import { apiVersion } from "@/sanity/lib/api";
import { RemoveCircleIcon } from "@sanity/icons";
import { Button, Stack } from "@sanity/ui";
import groq from "groq";
import { ComponentType, useState } from "react";
import { ArrayOfObjectsInputProps, useClient, useFormValue } from "sanity";
import { LogItem } from "../deletedDocLog";

/** ### Array Input Component with Button to clean up the log
 *
 * removes restored documents from the logs array
 */
export const DeletionLogInputComponent: ComponentType<
  ArrayOfObjectsInputProps
> = (props) => {
  // * Get the client
  const client = useClient({ apiVersion }).withConfig({
    perspective: "previewDrafts",
  });

  // * Get Ids and filter unique values
  /** Ids from `props.value` which are also filtered to only return unique IDs */
  const ids = props.value
    ?.map((item: LogItem) => item.docId)
    .filter((value, index, self) => self.indexOf(value) === index);

  // * Get the document ID
  /** ID of current `deletedDocIdsDocument` */
  const documentID = useFormValue(["_id"]) as string;

  // * Set the logs state which will be set by a query
  // that fetches all document ids that are in the logs and check if they exist
  const [logs, setLogs] = useState<{ docId: string }[]>([]);
  const query = groq`*[_id in $docIds]{
              'docId': _id,
            }`;
  const params = { docIds: ids };

  // * Fetch the data to check if the documents exist
  const fetchData = async () => {
    await client
      .fetch(query, params)
      .then((res) => {
        setLogs(res);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  // * Create an array of items to unset for documents that were restored
  const itemsToUnset = logs.map(
    (item) => `deletedDocLogs[docId == "${item.docId}"]`
  );
  // * Function to handle the cleanup of restored documents
  /** simple function to check document IDs for existence and unset existing items if there is a `documentID` via the client */
  const handleCleanUp = () => {
    // * Run the function only when there is a value and a documentID
    props.value &&
      documentID &&
      fetchData().then(() =>
        client
          .patch(documentID)
          .unset(itemsToUnset)
          .commit()
          .catch(console.error)
      );
  };

  return (
    <Stack space={4}>
      <Button
        text="Remove restored document from logs"
        icon={RemoveCircleIcon}
        onClick={() => handleCleanUp()}
        mode="ghost"
      />
      {/* Remove the Add Item button below the Array input */}
      {props.renderDefault({ ...props, arrayFunctions: () => null })}
    </Stack>
  );
};
