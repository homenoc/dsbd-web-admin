import {
    AccordionDetails,
    Avatar,
    Button,
    Card,
    Chip, FormControl,
    styled,
    Table,
    TableRow,
    TextField,
    Typography
} from "@mui/material";

export const SubmitButton = styled(Button)(({theme}) => ({
    margin: theme.spacing(3, 0, 2),
}));

export const StyledAvatar = styled(Avatar)(({theme}) => ({
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
}))


// typography
export const StyledTypographyHeading = styled(Typography)(({theme}) => ({
    fontSize: theme.typography.pxToRem(15),
}))

export const StyledTypographyTitle = styled(Typography)(({theme}) => ({
    flexGrow: 1,
}))

// table
export const StyledTable1 = styled(Table)(({theme}) => ({
    minWidth: 400,
}))

export const StyledTable2 = styled(Table)(({theme}) => ({
    minWidth: 500,
}))

export const StyledWrapForm = styled('form')(({theme}) => ({
    display: "flex",
    justifyContent: "center",
    width: "95%",
    margin: `${theme.spacing(0)} auto`,
    height: "150px"
}))

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

