import React, { useEffect } from 'react'
import {
  Badge,
  Collapse,
  ThemeProvider,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Menu,
  Fade,
  styled,
  Toolbar,
  CSSObject,
  Theme,
  Box,
  Typography,
  Container,
  ListItemButton,
} from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonIcon from '@mui/icons-material/Person'
import PeopleIcon from '@mui/icons-material/People'
import LayersIcon from '@mui/icons-material/Layers'
import ClassIcon from '@mui/icons-material/Class'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import ChatIcon from '@mui/icons-material/Chat'
import SettingsIcon from '@mui/icons-material/Settings'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import { StyledDivDashboardToolBarIcon, StyledDivDashboardRoot } from './styles'
import { useNavigate } from 'react-router-dom'
import { Logout } from '../../api/Auth'
import { muiColorTheme } from '../Theme'
import { useRecoilState } from 'recoil'
import { TemplateState } from '../../api/Recoil'
import { GetTemplate } from '../../api/Group'
import { useSnackbar } from 'notistack'
import useMediaQuery from '@mui/material/useMediaQuery'

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  // 大きい画面の時、drawerを閉じた際にアイコンが中心にならないため、コメントアウト
  // [theme.breakpoints.up('sm')]: {
  //  width: `calc(${theme.spacing(9)} + 1px)`,
  // },
})

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))

interface DashboardProps {
  title?: string
  children?: React.ReactNode
  sx?: CSSObject
  forceDrawerClosed?: boolean
}

export default function Dashboard(props: DashboardProps) {
  // Menu Bar
  // useMediaQuery("(min-width:800px)")でmobileかどうかを判定
  const [open, setOpen] = React.useState(useMediaQuery('(min-width:600px)'))

  // 画面サイズが変わったときにopenを変更
  // closeが強制されているときは、openをfalseにする
  const isMobile = !useMediaQuery('(min-width:600px)')
  useEffect(() => {
    if (props.forceDrawerClosed) {
      setOpen(false)
    } else if (isMobile) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [isMobile, props.forceDrawerClosed])

  const [loading, setLoading] = React.useState(true)
  const [template, setTemplate] = useRecoilState(TemplateState)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    GetTemplate().then((res) => {
      if (res.error === '') {
        setTemplate(res.data)
        setLoading(false)
      } else {
        enqueueSnackbar('' + res.error, { variant: 'error' })
      }
    })
  }, [])

  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpenOther(false)
    setOpen(false)
  }
  // Menu Bar (Other Button)
  const [openOther, setOpenOther] = React.useState(false)
  const handleClick = () => {
    setOpenOther(!openOther)
    // Menu Bar is not opened...
    if (!open) {
      setOpen(true)
    }
  }

  const navigate = useNavigate()

  const DashboardPage = () => {
    navigate('/dashboard')
  }
  const NoticePage = () => {
    navigate('/dashboard/notice')
  }
  const GroupPage = () => {
    navigate('/dashboard/group')
  }
  const SupportPage = () => {
    navigate('/dashboard/support')
  }
  const ServicePage = () => {
    navigate('/dashboard/service')
  }
  const ConnectionPage = () => {
    navigate('/dashboard/connection')
  }
  const UserPage = () => {
    navigate('/dashboard/user')
  }
  const TokenPage = () => {
    navigate('/dashboard/token')
  }

  return (
    <ThemeProvider theme={muiColorTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6">
              AS59105 Admin Page
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton color="inherit">
                <Badge badgeContent={0} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <UserMenu key={'user_menu'} />
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <StyledDivDashboardToolBarIcon>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </StyledDivDashboardToolBarIcon>
          <Divider />
          <List component="nav">
            <ListItemButton onClick={DashboardPage}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={NoticePage}>
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Notice" />
            </ListItemButton>
            <ListItemButton onClick={GroupPage}>
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Group" />
            </ListItemButton>
            <ListItemButton onClick={SupportPage}>
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText primary="Chat" />
            </ListItemButton>
            <ListItemButton onClick={handleClick}>
              <ListItemIcon>
                <LayersIcon />
              </ListItemIcon>
              <ListItemText primary="Other" />
              {openOther ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openOther} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton onClick={UserPage}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="User" />
                </ListItemButton>
                <ListItemButton onClick={ServicePage}>
                  <ListItemIcon>
                    <ClassIcon />
                  </ListItemIcon>
                  <ListItemText primary="Service" />
                </ListItemButton>
                <ListItemButton onClick={ConnectionPage}>
                  <ListItemIcon>
                    <AccountTreeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Connection" />
                </ListItemButton>
                <ListItemButton onClick={TokenPage}>
                  <ListItemIcon>
                    <VpnKeyIcon />
                  </ListItemIcon>
                  <ListItemText primary="Token" />
                </ListItemButton>
              </List>
            </Collapse>
            <ListItemButton>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Setting" />
            </ListItemButton>
            <Divider />
          </List>
        </Drawer>
        {!loading && (
          <Box component="main" sx={{ flexGrow: 1, p: 3, ...props.sx }}>
            <StyledDivDashboardToolBarIcon />
            <Typography sx={{ m: 1 }} variant="h5" color="inherit">
              {props.title}
            </Typography>
            {props.children}
          </Box>
        )}
      </Box>
    </ThemeProvider>
  )
}

export function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const clickLogout = () => {
    Logout().then(() => {
      sessionStorage.removeItem('ACCESS_TOKEN')
      navigate('/login')
    })
  }

  return (
    <StyledDivDashboardRoot>
      <IconButton
        color="inherit"
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <PermIdentityIcon />
      </IconButton>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {/*<MenuItem onClick={handleClose}>Profile</MenuItem>*/}
        <MenuItem onClick={clickLogout}>Logout</MenuItem>
      </Menu>
    </StyledDivDashboardRoot>
  )
}
