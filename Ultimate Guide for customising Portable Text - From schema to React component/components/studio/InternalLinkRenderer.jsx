/*
 * Tis is a jsx version of the InternalLinkRenderer,
 * to show how it works both in JS and TS
 */

import { LinkIcon } from '@sanity/icons'
import { Stack, Text, Tooltip } from '@sanity/ui'
import { useEffect, useState } from 'react'
import { useClient } from 'sanity'
import styled from 'styled-components'

// This is a basic setTimeout function which we will use later to delay fetching our referenced data
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const InternalLinkRendererJS = (props) => {
  // in order to be able to query for data in the studio, you need to setup a client version
  const client = useClient({
    apiVersion: '2022-10-31',
  })

  // we will store the data we queried in a state
  const [reference, setReference] = useState({})

  // we need to initialise the subscription
  let subscription
  // then get the data from the referenced document
  useEffect(() => {
    // so let's setup the query and params to fetch the values we need.
    const query = `*[_id == $rev]{title, 'slug': slug.current}[0]`
    const params = { rev: props.value.reference?._ref }

    const fetchReference = async (listening = false) => {
      listening && (await sleep(1500)) // here we use the sleep timeout function from the beginning of the file

      await client
        .fetch(query, params)
        .then((res) => {
          setReference(res)
        })
        .catch((err) => {
          console.error(err.message)
        })
    }

    // since we store our referenced data in a state we need to make sure, we also get changes
    const listen = () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      subscription = client
        .listen(query, params, { visibility: 'query' })
        .subscribe(() => fetchReference(true))
    }
    fetchReference().then(listen)

    // and then we need to cleanup after ourselves, so we don't get any memory leaks
    return function cleanup() {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  return (
    <Tooltip
      content={
        <Stack space={2} padding={3}>
          <Text align="center" size={1}>
            {`${reference.title}` || 'No title or slug found'}
          </Text>
          <Text align="center" size={1} muted>
            {`Slug: /${reference.slug}` || ''}
          </Text>
        </Stack>
      }
      fallbackPlacements={['right', 'left']}
      placement="bottom"
      portal
    >
      <InlineAnnotation>
        <LinkIcon /> <>{props.renderDefault(props.children)}</>
      </InlineAnnotation>
    </Tooltip>
  )
}
const InlineAnnotation = styled.span`
  padding-left: 0.3em;
  padding-right: 0.2em;
`
export default InternalLinkRendererJS
