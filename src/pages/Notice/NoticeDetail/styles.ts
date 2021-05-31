import {makeStyles} from "@material-ui/core";
import {Theme} from "@material-ui/core/styles";

export default makeStyles(theme => ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
        rootForm: {
            margin: theme.spacing(1),
            marginBottom: 20,
        },
        formVeryTooShort: {
            width: '10ch',
            marginRight: 5,
            marginBottom: 10,
        },
        formVeryShort: {
            width: '20ch',
            marginRight: 5,
            marginBottom: 10,
        },
        formVeryShort1: {
            width: '20ch',
            marginBottom: 10,
            marginLeft: 5
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
        margin: {
            margin: theme.spacing(1),
        },
        wrapTitleText: {
            margin: theme.spacing(1),
            width: "95%",

        },
        wrapText: {
            // display: "flex",
            // justifyContent: "center",
            width: "95%",
            margin: `${theme.spacing(0)} auto`,
            height: "150px"
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
        spaceLeft: {
            marginLeft: 5,
        },
        spaceRight: {
            marginRight: 5,
        },
        formSelect: {
            margin: theme.spacing(1),
            minWidth: 200,
        },
        spaceTop: {
            marginTop: 5,
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
        },
        select: {
            danger: 'purple',
            dangerLight: theme.palette.grey[200],
            neutral0: theme.palette.background.default,
            neutral5: "orange",
            neutral10: 'pink',
            neutral20: theme.palette.grey['A200'],
            neutral30: theme.palette.text.primary,
            neutral40: 'green',
            neutral50: theme.palette.grey['A200'],
            neutral60: 'purple',
            neutral70: 'purple',
            neutral80: theme.palette.text.primary,
            neutral90: "pink",
            primary: theme.palette.text.primary,
            primary25: theme.palette.background.paper,
            primary50: theme.palette.background.paper,
            primary75: theme.palette.background.paper,
        },
    }),
);

export function GetSelectTheme(theme: Theme) {
    return ({
        danger: 'purple',
        dangerLight: theme.palette.grey[200],
        neutral0: theme.palette.background.default,
        neutral5: "orange",
        neutral10: 'pink',
        neutral20: theme.palette.grey['A200'],
        neutral30: theme.palette.text.primary,
        neutral40: 'green',
        neutral50: theme.palette.grey['A200'],
        neutral60: 'purple',
        neutral70: 'purple',
        neutral80: theme.palette.text.primary,
        neutral90: "pink",
        primary: theme.palette.text.primary,
        primary25: theme.palette.background.paper,
        primary50: theme.palette.background.paper,
        primary75: theme.palette.background.paper,
    })
}