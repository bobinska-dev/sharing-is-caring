import { LinkIcon } from '@sanity/icons'
import { Box, Text, Tooltip } from '@sanity/ui'
import styled from 'styled-components'

export interface LinkRendererProps {
  children: React.ReactNode
  renderDefault: (children: React.ReactNode) => React.ReactNode
  value: {
    _key: string
    _type: string
    href: string
  }
}

const LinkRenderer = (props: LinkRendererProps) => {
  return (
    // the ToolTip component wraps the annotation, and the content prop is what will be displayed when hovering over the annotation
    <Tooltip
      content={
        //we define the content in a Box, so we can add padding, and Text where we pass the href value in if present, otherwise we display 'No url found'
        <Box padding={3}>
          <Text align="center" size={1}>
            {`${props.value.href}` || 'No url found'}
          </Text>
        </Box>
      }
      fallbackPlacements={['right', 'left']}
      placement="bottom"
      portal
    >
      {/* 
      InlineAnnotation is a styled span element, which we use to add padding. */}
      <InlineAnnotation>
        {/* 
        renderDefault() is needed to let the studio handle the functionality of the annotation, so we don't have to. */}
        <LinkIcon /> <>{props.renderDefault(props.children)}</>
      </InlineAnnotation>
    </Tooltip>
  )
}
const InlineAnnotation = styled.span`
  padding-left: 0.3em;
  padding-right: 0.2em;
`
export default LinkRenderer
