import { LinkIcon } from "@sanity/icons";
import { Stack, Text, Tooltip } from "@sanity/ui";
import React, { useEffect, useState } from "react";
import { useClient } from "sanity";
import styled from "styled-components";

// This is a basic setTimeout function which we will use later to delay fetching our referenced data, so that we can listen for the data to be available.
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export interface InternalLinkRendererProps {
  children: React.ReactNode;
  renderDefault: (children: React.ReactNode) => React.ReactNode;
  path: Array<any>;
  value: {
    _key: string;
    _type: string;
    reference: {
      _ref: string;
    };
  };
}

const InternalLinkRenderer = (props: InternalLinkRendererProps) => {
  // in order to be able to query for data in the studio, you need to setup a client version
  const client = useClient({
    apiVersion: "2022-10-31",
  });

  const [reference, setReference] = useState<any>({});

  // we need to initialise the subscription
  let subscription;
  // then get the data from the referenced document
  useEffect(() => {
    // so let's setup the query and params to fetch the values we need.
    const query = `*[_id == $rev]{title, 'slug': slug.current}[0]`;
    const params = { rev: props.value.reference?._ref };

    const fetchReference = async (listening = false) => {
      listening && (await sleep(1500)); // chances are the data isn't query-able yet
      await client
        .fetch(query, params)
        .then((res) => {
          setReference(res);
        })
        .catch((err) => {
          console.error(err.message);
        });
    };

    // since we store our referenced data in a state we need to make sure, we also listen to changes
    const listen = () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      subscription = client
        .listen(query, params, { visibility: "query" })
        .subscribe(() => fetchReference(true));
    };

    fetchReference().then(listen);

    // and then we need to cleanup after ourselves, so we don't get any memory leaks
    return function cleanup() {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <Tooltip
      content={
        /* In this instance we stack our text instead of only using a Box with padding we can hen also define a space between items */
        <Stack space={2} padding={3}>
          <Text align="center" size={1}>
            {`${reference.title}` || "No title or slug found"}
          </Text>
          <Text align="center" size={1} muted>
            {`Slug: /${reference.slug}` || ""}
          </Text>
        </Stack>
      }
      fallbackPlacements={["right", "left"]}
      placement="bottom"
      portal
    >
      <InlineAnnotation>
        <LinkIcon /> <>{props.renderDefault(props.children)}</>
        {/* 
        renderDefault() is needed to let the studio handle the functionality of the annotation, so we don't have to. */}
      </InlineAnnotation>
    </Tooltip>
  );
};
const InlineAnnotation = styled.span`
  padding-left: 0.3em;
  padding-right: 0.2em;
`;
export default InternalLinkRenderer;
