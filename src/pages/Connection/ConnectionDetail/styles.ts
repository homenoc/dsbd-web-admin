import {makeStyles} from "@material-ui/core";

export default makeStyles(theme => ({
        rootInput: {
            minWidth: 100,
            marginBottom: 20,
        },
        root: {
            minWidth: 275,
            marginBottom: 5,
        },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            fontSize: 14,
        },
        pos: {
            marginBottom: 12,
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
        },
        formVeryShort: {
            width: '20ch',
            marginBottom: 10,
            marginRight: 10,
        },
        formVeryShort1: {
            width: '20ch',
            marginBottom: 10,
            marginLeft: 5
        },
        formShort: {
            width: '30ch',
            marginBottom: 10,
        },
        formMedium: {
            width: '35ch',
            marginBottom: 10,
            marginRight: 10,
        },
        formLong: {
            "@media screen and (min-width:781px)": {
                width: '60ch',
                marginBottom: 10,
            }
        },
        date: {
            marginBottom: 10,
        },
    }),
);
