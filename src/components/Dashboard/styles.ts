import {Container, FormControl, ListItem, styled, Typography} from "@mui/material";

const drawerWidth = 240;

export const StyledDivDashboardRoot = styled(FormControl)(({theme}) => ({
    display: 'flex',
}))

export const StyledDivDashboardToolBarIcon = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
}))

export const StyledTypographyPageTitle = styled(Typography)(({theme}) => ({
    marginBottom: theme.spacing(1),
}))

export const StyledMainContent = styled('main')(({theme}) => ({
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
}))

export const StyledDivAppBarShift = styled('div')(({theme}) => ({
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
}))

export const StyledContainer1 = styled(Container)(({theme}) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}))

export const StyledListItemSideBarNested = styled(ListItem)(({theme}) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}))
