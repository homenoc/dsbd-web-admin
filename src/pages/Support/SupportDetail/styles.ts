import {Paper, styled} from "@mui/material";
import ReactMarkdown from "react-markdown";

export const StyledMessageTimeStampRight = styled("div")(({theme}) => ({
    color: "black",
    position: "absolute",
    fontSize: ".85em",
    fontWeight: 300,
    marginTop: "10px",
    bottom: "-3px",
    right: "5px"
}))

export const StyledReactMarkdownMessageContent = styled(ReactMarkdown)(({theme}) => ({
    padding: 0,
    margin: 0,
    color: "black",
    // overflowWrap: "normal",
    // overflowY: 'scroll',
    overflowX: 'auto',
}))

export const StyledMessageRowLeft = styled("div")(({theme}) => ({
    display: "flex",
}))

export const StyledMessageRowRight = styled("div")(({theme}) => ({
    display: "flex",
    justifyContent: "flex-end"
}))

export const StyledDisplayName = styled("div")(({theme}) => ({
    marginLeft: "20px"
}))

export const StyledMessageBlue = styled("div")(({theme}) => ({
    position: "relative",
    marginLeft: "20px",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#d2d2cc",
    // width: "40%",
    textAlign: "left",
    font: "400 .9em 'Open Sans', sans-serif",
    border: "1px solid #d2d2cc",
    borderRadius: "10px",
    '&:after': {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "15px solid #d2d2cc",
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        top: "0",
        left: "-15px",
    },
    '&:before': {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "17px solid #d2d2cc",
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        top: "-1px",
        left: "-17px",
    },
}))

export const StyledMessageOrange = styled("div")(({theme}) => ({
    position: "relative",
    marginRight: "20px",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#85e249",
    width: "60%",
    textAlign: "left",
    font: "400 .9em 'Open Sans', sans-serif",
    border: "1px solid #85e249",
    borderRadius: "10px",
    '&:after': {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "15px solid #85e249",
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        top: "0",
        right: "-15px",
    },
    '&:before': {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "17px solid #85e249",
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        top: "-1px",
        right: "-17px",
    },
}))

export const StyledPaper = styled(Paper)(({theme}) => ({
    width: '100vw',
    height: '100vh',
    // maxWidth: '1000px',
    // maxHeight: '1400px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative'
}))

export const StyledPaperMessageBody = styled(Paper)(({theme}) => ({
    width: 'calc( 100% - 20px )',
    margin: 10,
    backgroundColor: "rgb(113, 147, 193)",
    // overflowX: 'hidden',
    overflowY: 'scroll',
    height: 'calc( 100% - 80px )'
}))

export const StyledDivContainer = styled("div")(({theme}) => ({
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}))
