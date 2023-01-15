import {
  Card,
  FormControl,
  InputBase,
  Paper,
  styled,
  TextField,
  Typography,
} from '@mui/material'

export const StyledPaperRootInput = styled(Paper)(() => ({
  component: 'form',
  minWidth: 100,
  marginBottom: 20,
}))

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  flex: 1,
}))

export const StyledCard = styled(Card)(() => ({
  minWidth: 275,
  marginBottom: 5,
}))

export const StyledTypographyTitle = styled(Typography)(() => ({
  fontSize: 14,
}))

export const StyledTextFieldVeryLong = styled(TextField)(() => ({
  '@media screen and (min-width:1001px)': {
    width: '100ch',
    marginBottom: 10,
    marginRight: 5,
  },
}))

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 200,
}))
