import React, {useCallback, useEffect, useRef, useState} from 'react'
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {deepOrange} from '@material-ui/core/colors';
import ReactMarkdown from 'react-markdown';
import gfm from "remark-gfm";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        messageRow: {
            display: "flex",
        },
        messageRowRight: {
            display: "flex",
            justifyContent: "flex-end"
        },
        messageLeft: {},
        messageBlue: {
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
        },
        messageOrange: {
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
        },

        messageContent: {
            padding: 0,
            margin: 0,
            color: "black",
            // overflowWrap: "normal",
            // overflowY: 'scroll',
            overflowX: 'auto',
        },
        messageTimeStampRight: {
            color: "black",
            position: "absolute",
            fontSize: ".85em",
            fontWeight: 300,
            marginTop: "10px",
            bottom: "-3px",
            right: "5px",
        },

        orange: {
            color: theme.palette.getContrastText(deepOrange[500]),
            backgroundColor: deepOrange[500],
            width: theme.spacing(4),
            height: theme.spacing(4),
        },
        avatarNothing: {
            color: "transparent",
            backgroundColor: "transparent",
            width: theme.spacing(4),
            height: theme.spacing(4),
        },
        displayName: {
            marginLeft: "20px",
        },
    })
);

const useResize = (myRef: React.RefObject<HTMLDivElement>) => {
    const getWidth = useCallback(() => myRef?.current?.offsetWidth, [myRef]);

    const [width, setWidth] = useState<number | undefined>(undefined);

    useEffect(() => {
        const handleResize = () => {
            setWidth(getWidth());
        };

        if (myRef.current) {
            setWidth(getWidth());
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [myRef, getWidth]);

    return width && width > 25 ? width - 25 : width;
};


export const MessageLeft = (props: { message: string; timestamp: string; displayName?: string; }) => {
    const message = props.message ? props.message : 'no message';
    const timestamp = props.timestamp ? props.timestamp : '';
    const displayName = props.displayName ? props.displayName : '不明';
    const classes = useStyles();
    const divRef = useRef<HTMLDivElement>(null);

    return (
        <div className={classes.messageRow}>
            <div>
                <div className={classes.displayName}>{displayName}</div>
                <div className={classes.messageBlue}>
                    <div
                        ref={divRef}
                        style={{
                            borderRadius: 15,
                            width: '50vw',
                        }}
                    >
                        <ReactMarkdown
                            className={classes.messageContent}
                            children={message}
                            skipHtml={true}
                            plugins={[gfm]}
                        />
                    </div>
                    <div className={classes.messageTimeStampRight}>{timestamp}</div>
                </div>
            </div>
        </div>
    )
}

export const MessageRight = (props: { message: string; timestamp: string; }) => {
    const classes = useStyles();
    const message = props.message ? props.message : 'no message';
    const timestamp = props.timestamp ? props.timestamp : '';
    const divRef = useRef<HTMLDivElement>(null);

    // @ts-ignore
    return (
        <div className={classes.messageRowRight}>
            <div className={classes.messageOrange}>
                <div
                    ref={divRef}
                    style={{
                        borderRadius: 15,
                        width: '50vw',
                    }}
                >
                    <ReactMarkdown
                        className={classes.messageContent}
                        children={message}
                        skipHtml={true}
                        plugins={[gfm]}
                        // escapeHtml={false}
                    />
                </div>
                <div className={classes.messageTimeStampRight}>{timestamp}</div>
            </div>
        </div>
    )
}