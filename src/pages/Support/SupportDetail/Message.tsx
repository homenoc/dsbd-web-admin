import React, { useRef } from 'react'
import remarkGfm from 'remark-gfm'
import {
  StyledDisplayName,
  StyledMessageBlue,
  StyledMessageOrange,
  StyledMessageRowLeft,
  StyledMessageRowRight,
  StyledMessageTimeStampRight,
  StyledReactMarkdownMessageContent,
} from './styles'

export const MessageLeft = (props: {
  message: string
  timestamp: string
  displayName?: string
}) => {
  const message = props.message ? props.message : 'no message'
  const timestamp = props.timestamp ? props.timestamp : ''
  const displayName = props.displayName ? props.displayName : '不明'
  const divRef = useRef<HTMLDivElement>(null)

  return (
    <StyledMessageRowLeft>
      <div>
        <StyledDisplayName>{displayName}</StyledDisplayName>
        <StyledMessageBlue>
          <div
            ref={divRef}
            style={{
              borderRadius: 15,
              width: '50vw',
            }}
          >
            <StyledReactMarkdownMessageContent
              children={message}
              skipHtml={true}
              remarkPlugins={[remarkGfm]}
            />
          </div>
          <StyledMessageTimeStampRight>{timestamp}</StyledMessageTimeStampRight>
        </StyledMessageBlue>
      </div>
    </StyledMessageRowLeft>
  )
}

export const MessageRight = (props: { message: string; timestamp: string }) => {
  const message = props.message ? props.message : 'no message'
  const timestamp = props.timestamp ? props.timestamp : ''
  const divRef = useRef<HTMLDivElement>(null)

  // eslint-disable @ts-ignore
  return (
    <StyledMessageRowRight>
      <StyledMessageOrange>
        <div
          ref={divRef}
          style={{
            borderRadius: 15,
            width: '50vw',
          }}
        >
          <StyledReactMarkdownMessageContent
            children={message}
            skipHtml={true}
            remarkPlugins={[remarkGfm]}
            // escapeHtml={false}
          />
        </div>
        <StyledMessageTimeStampRight>{timestamp}</StyledMessageTimeStampRight>
      </StyledMessageOrange>
    </StyledMessageRowRight>
  )
}
