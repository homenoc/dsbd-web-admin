import {
  AccordionDetails,
  Avatar,
  Button,
  Card,
  Chip,
  Container,
  FormControl,
  InputBase,
  Paper,
  Select,
  styled,
  Table,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'

//search
export const StyledSearchInput = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
}))

export const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}))

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}))

// paper
export const StyledPaperRootInput = styled(Paper)(() => ({
  minWidth: 100,
  marginBottom: 20,
}))

export const StyledDisplayName = styled(Paper)(() => ({
  marginLeft: '20px',
}))

export const StyledPaper1 = styled(Paper)(() => ({
  width: '100vw',
  height: '100vh',
  // maxWidth: '1000px',
  // maxHeight: '1400px',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  position: 'relative',
}))

export const StyledPaperMessage = styled(Paper)(() => ({
  width: 'calc( 100% - 20px )',
  margin: 10,
  backgroundColor: 'rgb(113, 147, 193)',
  // overflowX: 'hidden',
  overflowY: 'scroll',
  height: 'calc( 100% - 80px )',
}))

// typography
export const StyledTypographyHeading = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(15),
}))

export const StyledTypographyTitle = styled(Typography)(() => ({
  fontSize: 14,
}))

// table
export const StyledTable1 = styled(Table)(() => ({
  minWidth: 400,
}))

export const StyledTable2 = styled(Table)(() => ({
  minWidth: 500,
}))

// form
export const StyledWrapForm = styled('form')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '95%',
  margin: `${theme.spacing(0)} auto`,
  height: '150px',
}))

// container
export const StyledDivContainer = styled('div')(() => ({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const StyledContainer1 = styled(Container)(({ theme }) => ({
  padding: theme.spacing(8, 0, 6),
}))

// TextField
export const StyledWrapText = styled(TextField)(() => ({
  width: '100%',
}))

export const StyledButton1 = styled(Button)(() => ({
  marginBottom: 10,
}))

export const StyledButtonSpaceLeft = styled(Button)(() => ({
  marginLeft: 5,
}))

export const StyledButtonSpaceRight = styled(Button)(() => ({
  marginRight: 5,
}))

export const StyledButtonSpaceTop = styled(Button)(() => ({
  marginTop: 5,
}))

// card
export const StyledCardRoot1 = styled(Card)(() => ({
  width: '100%',
}))

export const StyledCardRoot2 = styled(Card)(() => ({
  '& > *': {
    borderBottom: 'unset',
  },
}))

export const StyledCardRoot3 = styled(Card)(() => ({
  minWidth: 275,
  marginBottom: 5,
}))

// div
export const StyledDivRoot1 = styled('div')(() => ({
  width: '100%',
}))

export const StyledDivMemo = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  '& > *': {
    margin: theme.spacing(0.5),
  },
}))

export const StyledLoginForm = styled('div')(({ theme }) => ({
  width: '100%', // Fix IE 11 issue.
  marginTop: theme.spacing(1),
}))

export const StyledDivRoot2 = styled('div')(({ theme }) => ({
  flexShrink: 0,
  marginLeft: theme.spacing(2.5),
}))

export const StyledDiv1 = styled('div')(() => ({
  flexBasis: '33.33%',
}))

export const StyledDivLargeHeading = styled('div')(({ theme }) => ({
  fontSize: theme.typography.pxToRem(25),
  marginTop: 10,
  marginBottom: 10,
}))

export const StyledDivText = styled('div')(() => ({
  whiteSpace: 'pre-line',
}))

// Form
export const StyledRootForm = styled('form')(({ theme }) => ({
  margin: theme.spacing(1),
  marginBottom: 20,
}))

export const StyledRootForm1 = styled('form')(({ theme }) => ({
  margin: theme.spacing(1),
  marginBottom: 3,
}))

// TextField(Form)
export const StyledTextFieldWrapTitle = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1),
  width: '95%',
}))

export const StyledTextFieldWrap = styled(TextField)(({ theme }) => ({
  width: '95%',
  margin: `${theme.spacing(0)} auto`,
  height: '150px',
}))

export const StyledSelect1 = styled(Select)(() => ({
  width: '30ch',
  marginTop: 10,
  marginRight: 5,
}))

export const StyledTextFieldShort = styled(TextField)(() => ({
  width: '30ch',
  marginBottom: 10,
  marginRight: 5,
}))

export const StyledTextFieldVeryShort1 = styled(TextField)(() => ({
  width: '20ch',
  marginBottom: 10,
  marginRight: 5,
}))

export const StyledTextFieldVeryShort2 = styled(TextField)(() => ({
  width: '20ch',
  marginBottom: 10,
  marginLeft: 5,
  marginRight: 5,
}))

export const StyledTextFieldTooVeryShort = styled(TextField)(() => ({
  width: '10ch',
  marginBottom: 10,
  marginRight: 5,
}))

export const StyledTextFieldMedium = styled(TextField)(() => ({
  width: '35ch',
  marginBottom: 10,
  marginRight: 5,
}))

export const StyledTextFieldLong = styled(TextField)(() => ({
  '@media screen and (min-width:781px)': {
    width: '60ch',
    marginBottom: 10,
    marginRight: 5,
  },
}))

export const StyledTextFieldVeryLong = styled(TextField)(() => ({
  '@media screen and (min-width:1001px)': {
    width: '100ch',
    marginBottom: 10,
    marginRight: 5,
  },
}))

// chip
export const StyledChip1 = styled(Chip)(() => ({
  marginBottom: 10,
}))

export const StyledChip2 = styled(Chip)(() => ({
  marginRight: 5,
}))

// table row
export const StyledTableRowRoot = styled(TableRow)(() => ({
  '& > *': {
    borderBottom: 'unset',
  },
}))

// table
export const StyledTableRoot = styled(Table)(() => ({
  minWidth: 400,
}))

// AccordionDetails
export const StyledAccordionDetails = styled(AccordionDetails)(() => ({
  alignItems: 'center',
}))

// FormControl
export const StyledFormControlFormSelect = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 200,
}))

export const StyledFormControlFormShort = styled(FormControl)(() => ({
  width: '30ch',
  marginBottom: 10,
  marginRight: 5,
}))

export const StyledFormControlFormMedium = styled(FormControl)(() => ({
  width: '35ch',
  marginBottom: 10,
  marginRight: 10,
}))

export const StyledFormControlFormLong = styled(FormControl)(() => ({
  '@media screen and (min-width:781px)': {
    width: '60ch',
    marginBottom: 10,
    marginRight: 5,
  },
}))
