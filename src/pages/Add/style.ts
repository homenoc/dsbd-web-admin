import {
    AccordionDetails,
    Avatar,
    Button,
    Card,
    Chip, Container, FormControl, InputBase, Paper,
    styled,
    Table,
    TableRow,
    TextField,
    Typography
} from "@mui/material";

//search
export const StyledSearchInput = styled(InputBase)(({theme}) => ({
    marginLeft: theme.spacing(1),
    flex: 1,
}));

export const SubmitButton = styled(Button)(({theme}) => ({
    margin: theme.spacing(3, 0, 2),
}));

export const StyledAvatar = styled(Avatar)(({theme}) => ({
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
}))

// paper
export const StyledPaperRootInput = styled(Paper)(({theme}) => ({
    minWidth: 100,
    marginBottom: 20,
}))

export const StyledDisplayName = styled(Paper)(({theme}) => ({
    marginLeft: "20px",
}))

export const StyledPaper1 = styled(Paper)(({theme}) => ({
    width: '100vw',
    height: '100vh',
    // maxWidth: '1000px',
    // maxHeight: '1400px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'relative'
}))

export const StyledPaperMessage = styled(Paper)(({theme}) => ({
    width: 'calc( 100% - 20px )',
    margin: 10,
    backgroundColor: "rgb(113, 147, 193)",
    // overflowX: 'hidden',
    overflowY: 'scroll',
    height: 'calc( 100% - 80px )'
}))

export const StyledBlueMessage = styled('div')(({theme}) => ({
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

export const StyledOrangeMessage = styled('div')(({theme}) => ({
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

// typography
export const StyledTypographyHeading = styled(Typography)(({theme}) => ({
    fontSize: theme.typography.pxToRem(15),
}))

export const StyledTypographyTitle = styled(Typography)(({theme}) => ({
    fontSize: 14,
}))

// table
export const StyledTable1 = styled(Table)(({theme}) => ({
    minWidth: 400,
}))

export const StyledTable2 = styled(Table)(({theme}) => ({
    minWidth: 500,
}))

// form
export const StyledWrapForm = styled('form')(({theme}) => ({
    display: "flex",
    justifyContent: "center",
    width: "95%",
    margin: `${theme.spacing(0)} auto`,
    height: "150px"
}))

// container
export const StyledDivContainer = styled('div')(({theme}) => ({
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}))

export const StyledContainer1 = styled(Container)(({theme}) => ({
    padding: theme.spacing(8, 0, 6)
}))

// TextField
export const StyledWrapText = styled(TextField)(({theme}) => ({
    width: "100%"
}))

export const StyledButton1 = styled(Button)(({theme}) => ({
    marginBottom: 10
}))

export const StyledButtonSpaceLeft = styled(Button)(({theme}) => ({
    marginLeft: 5,
}))

export const StyledButtonSpaceRight = styled(Button)(({theme}) => ({
    marginRight: 5,
}))

export const StyledButtonSpaceTop = styled(Button)(({theme}) => ({
    marginTop: 5,
}))

// card
export const StyledCardRoot1 = styled(Card)(({theme}) => ({
    width: '100%',
}))

export const StyledCardRoot2 = styled(Card)(({theme}) => ({
    '& > *': {
        borderBottom: 'unset',
    },
}))

export const StyledCardRoot3 = styled(Card)(({theme}) => ({
    minWidth: 275,
    marginBottom: 5,
}))

// div
export const StyledDivRoot1 = styled('div')(({theme}) => ({
    width: '100%',
}))

export const StyledDivMemo = styled('div')(({theme}) => ({
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
        margin: theme.spacing(0.5),
    },
}))

export const StyledLoginForm = styled("div")(({theme}) => ({
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
}));

export const StyledDivRoot2 = styled("div")(({theme}) => ({
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
}));

export const StyledDiv1 = styled("div")(({theme}) => ({
    flexBasis: '33.33%',
}));

export const StyledDivLargeHeading = styled('div')(({theme}) => ({
    fontSize: theme.typography.pxToRem(25),
    marginTop: 10,
    marginBottom: 10
}))

export const StyledDivText = styled('div')(({theme}) => ({
    whiteSpace: 'pre-line',
}))

// Form
export const StyledRootForm = styled('form')(({theme}) => ({
    margin: theme.spacing(1),
    marginBottom: 20,
}))

export const StyledRootForm1 = styled('form')(({theme}) => ({
    margin: theme.spacing(1),
    marginBottom: 3,
}))

// TextField(Form)
export const StyledTextFieldWrapTitle = styled(TextField)(({theme}) => ({
    margin: theme.spacing(1),
    width: "95%",
}))

export const StyledTextFieldWrap = styled(TextField)(({theme}) => ({
    width: "95%",
    margin: `${theme.spacing(0)} auto`,
    height: "150px"
}))

export const StyledTextFieldShort = styled(TextField)(({theme}) => ({
    width: '30ch',
    marginBottom: 10,
    marginRight: 5,
}))

export const StyledTextFieldVeryShort1 = styled(TextField)(({theme}) => ({
    width: '20ch',
    marginBottom: 10,
    marginRight: 5,
}))

export const StyledTextFieldVeryShort2 = styled(TextField)(({theme}) => ({
    width: '20ch',
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
}))

export const StyledTextFieldTooVeryShort = styled(TextField)(({theme}) => ({
    width: '10ch',
    marginBottom: 10,
    marginRight: 5,
}))

export const StyledTextFieldMedium = styled(TextField)(({theme}) => ({
    width: '35ch',
    marginBottom: 10,
    marginRight: 5,
}))

export const StyledTextFieldLong = styled(TextField)(({theme}) => ({
    "@media screen and (min-width:781px)": {
        width: '60ch',
        marginBottom: 10,
        marginRight: 5,
    }
}))

export const StyledTextFieldVeryLong = styled(TextField)(({theme}) => ({
    "@media screen and (min-width:1001px)": {
        width: '100ch',
        marginBottom: 10,
        marginRight: 5,
    }
}))

// chip
export const StyledChip1 = styled(Chip)(({theme}) => ({
    marginBottom: 10,
}))

export const StyledChip2 = styled(Chip)(({theme}) => ({
    marginRight: 5,
}))

// table row
export const StyledTableRowRoot = styled(TableRow)(({theme}) => ({
    '& > *': {
        borderBottom: 'unset',
    },
}))

// table
export const StyledTableRoot = styled(Table)(({theme}) => ({
    minWidth: 400,
}))

// AccordionDetails
export const StyledAccordionDetails = styled(AccordionDetails)(({theme}) => ({
    alignItems: 'center',
}))

// FormControl
export const StyledFormControlFormSelect = styled(FormControl)(({theme}) => ({
    margin: theme.spacing(1),
    minWidth: 200,
}))

export const StyledFormControlFormShort = styled(FormControl)(({theme}) => ({
    width: '30ch',
    marginBottom: 10,
    marginRight: 5,
}))

export const StyledFormControlFormMedium = styled(FormControl)(({theme}) => ({
    width: '35ch',
    marginBottom: 10,
    marginRight: 10,
}))

export const StyledFormControlFormLong = styled(FormControl)(({theme}) => ({
    "@media screen and (min-width:781px)": {
        width: '60ch',
        marginBottom: 10,
        marginRight: 5,
    }
}))

