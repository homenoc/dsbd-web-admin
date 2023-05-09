import { Paper, styled, TextField } from '@mui/material'
import ReactMarkdown from 'react-markdown'

export const StyledPaperMessage = styled(Paper)(() => ({
  width: '100%',
  //margin: 10,
  backgroundColor: '#000000',
  //overflowX: 'hidden',
  overflowY: 'scroll',
  height: 'calc(100vh - 305px)',
  borderRadius: '10px',
}))

// form
export const StyledWrapForm = styled('form')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  margin: `${theme.spacing(0)} auto`,
  height: '150px',
  backgroundColor: '#000000',
  borderRadius: '10px',
  borderTop: '1px solid #5c5c5c',
}))

// TextField
export const StyledWrapText = styled(TextField)(() => ({
  width: '100%',
}))

export const StyledMessageTimeStampLeft = styled('div')(() => ({
  color: 'lightgrey',
  position: 'absolute',
  fontSize: '.85em',
  fontWeight: 300,
  marginTop: '10px',
  bottom: '2px',
  //right: '5px',
  left: '8px',
}))

export const StyledReactMarkdownMessageContentLeft = styled(ReactMarkdown)(
  () => ({
    padding: 0,
    paddingBottom: '10px',
    margin: 0,
    color: 'white',
    // overflowWrap: "normal",
    // overflowY: 'scroll',
    overflowX: 'auto',
  })
)

export const StyledReactMarkdownMessageContentRight = styled(ReactMarkdown)(
  () => ({
    padding: 0,
    paddingBottom: '20px',
    margin: 0,
    color: 'white',
    // overflowWrap: "normal",
    // overflowY: 'scroll',
    overflowX: 'auto',
  })
)

// left message
export const StyledLeftMessage = styled('div')(() => ({
  position: 'relative',
  marginLeft: '8px',
  marginBottom: '10px',
  padding: '10px',
  backgroundColor: '#343a40',
  width: '75%',
  textAlign: 'left',
  font: "400 .9em 'Open Sans', sans-serif",
  borderRadius: '15px',
}))

// right message box
export const StyledRightMessage = styled('div')(() => ({
  position: 'relative',
  marginRight: '10px',
  marginBottom: '10px',
  padding: '10px',
  background: '#6c757d',
  width: '80%',
  textAlign: 'left',
  font: "400 .9em 'Open Sans', sans-serif",
  borderRadius: '15px',
}))
