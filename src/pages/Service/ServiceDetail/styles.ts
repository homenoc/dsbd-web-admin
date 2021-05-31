import {makeStyles} from "@material-ui/core";

export default makeStyles(theme => ({
        rootTable: {
            '& > *': {
                borderBottom: 'unset',
            },
        },
        root: {
            width: '100%',
        },
        rootForm: {
            margin: theme.spacing(1),
            marginBottom: 20,
        },
        spaceLeft: {
            marginLeft: 5,
        },
        spaceTop: {
            marginTop: 5,
        },
        formVeryShort: {
            width: '20ch',
            marginBottom: 10,
            marginRight: 5,
        },
        formVeryShort1: {
            width: '20ch',
            marginBottom: 10,
            marginLeft: 5,
            marginRight: 5,
        },
        formVeryVeryShort: {
            width: '10ch',
            marginBottom: 10,
            marginRight: 5,
        },
        formShort: {
            width: '30ch',
            marginBottom: 10,
            marginRight: 5,
        },
        formMedium: {
            width: '35ch',
            marginBottom: 10,
            marginRight: 5,
        },
        formLong: {
            "@media screen and (min-width:781px)": {
                width: '60ch',
                marginBottom: 10,
                marginRight: 5,
            }
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
        },
        largeHeading: {
            fontSize: theme.typography.pxToRem(25),
            marginTop: 10,
            marginBottom: 10
        },
        secondaryHeading: {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
        icon: {
            verticalAlign: 'bottom',
            height: 20,
            width: 20,
        },
        text: {
            whiteSpace: 'pre-line',
        },
        table: {
            minWidth: 400,
        },
        date: {
            marginBottom: 10,
        },
        details: {
            alignItems: 'center',
        },
        column: {
            flexBasis: '33.33%',
        },
        helper: {
            borderLeft: `2px solid ${theme.palette.divider}`,
            padding: theme.spacing(1, 2),
        },
        link: {
            color: theme.palette.primary.main,
            textDecoration: 'none',
            '&:hover': {
                textDecoration: 'underline',
            },
        },
        smallTitle: {
            flex: '1 1 100%',
            // minHeight: 1

        },
        memo: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            '& > *': {
                margin: theme.spacing(0.5),
            },
        },
        button1: {
            marginBottom: 10
        }
    }),
);

