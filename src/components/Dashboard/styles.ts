import { FormControl, styled } from '@mui/material'

export const StyledDivDashboardRoot = styled(FormControl)(() => ({
  display: 'flex',
}))

export const StyledDivDashboardToolBarIcon = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 8px',
  ...theme.mixins.toolbar,
}))
