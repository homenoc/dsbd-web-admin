import React, { useRef } from 'react'
import remarkGfm from 'remark-gfm'
import {
  StyledDisplayName,
  StyledMessageBlue,
  StyledMessageOrange,
  StyledMessageRowLeft,
  StyledMessageRowRight,
  StyledMessageTimeStampLeft,
  StyledReactMarkdownMessageContentRight,
  StyledReactMarkdownMessageContentLeft,
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
              minWidth: '50vw',
              maxWidth: "70px",
            }}
          >
            <StyledReactMarkdownMessageContentLeft
              children={message}
              skipHtml={true}
              remarkPlugins={[remarkGfm]}
            />
          </div>
          <StyledMessageTimeStampLeft>{timestamp}</StyledMessageTimeStampLeft>
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
            minWidth: '50vw',
            maxWidth: "70px",
          }}
        >
          <StyledReactMarkdownMessageContentRight
            children={message}
            skipHtml={true}
            remarkPlugins={[remarkGfm]}
            // escapeHtml={false}
          />
        </div>
        <StyledMessageTimeStampLeft>{timestamp}</StyledMessageTimeStampLeft>
      </StyledMessageOrange>
    </StyledMessageRowRight>
  )
}
