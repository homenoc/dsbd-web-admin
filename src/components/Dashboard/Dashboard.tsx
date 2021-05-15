import React from 'react';
import clsx from 'clsx';
import {
    AppBar,
    Badge, Collapse, colors,
    Container, createMuiTheme, ThemeProvider,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List, ListItem, ListItemIcon, ListItemText,
    Toolbar,
    Typography
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import PeopleIcon from "@material-ui/icons/People";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import LayersIcon from "@material-ui/icons/Layers";
import ClassIcon from '@material-ui/icons/Class';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import ChatIcon from "@material-ui/icons/Chat";
import SettingsIcon from "@material-ui/icons/Settings";
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import useStyles from "./styles";
import useSideBarStyles from "./SideBar/styles";
import {useHistory} from "react-router-dom";

export default function Dashboard(props: any) {
    const classesDashboard = useStyles();
    const classesMenu = useSideBarStyles();
    // Menu Bar
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpenOther(false);
        setOpen(false);
    };
    // Menu Bar (Other Button)
    const [openOther, setOpenOther] = React.useState(false);
    const handleClick = () => {
        setOpenOther(!openOther);
        // Menu Bar is not opened...
        if (!open) {
            setOpen(true);
        }
    };

    const theme = createMuiTheme({
        palette: {
            primary: {
                main: colors.blue[800],
            },
            type: "dark",
            // type: darkMode ? "dark" : "light",
        },
    });

    const history = useHistory();

    const DashboardPage = () => {
        history.push("/dashboard");
    }
    const NoticePage = () => {
        history.push("/dashboard/notice");
    }
    const GroupPage = () => {
        history.push("/dashboard/group");
    }
    const OrderPage = () => {
        history.push("/dashboard/order");
    }
    const SupportPage = () => {
        history.push("/dashboard/support");
    }
    const ServicePage = () => {
        history.push("/dashboard/service");
    }
    const ConnectionPage = () => {
        history.push("/dashboard/connection");
    }
    const UserPage = () => {
        history.push("/dashboard/user");
    }

    return (
        <ThemeProvider theme={theme}>
            <div className={classesDashboard.root}>
                <CssBaseline/>
                <AppBar position="absolute"
                        className={clsx(classesDashboard.appBar, open && classesDashboard.appBarShift)}>
                    <Toolbar className={classesDashboard.toolbar}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            className={clsx(classesDashboard.menuButton, open && classesDashboard.menuButtonHidden)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap
                                    className={classesDashboard.title}>
                            AS59105 Admin Page
                        </Typography>
                        <IconButton color="inherit">
                            <Badge badgeContent={0} color="secondary">
                                <NotificationsIcon/>
                            </Badge>
                        </IconButton>
                        <IconButton color="inherit">
                            <PermIdentityIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    classes={{paper: clsx(classesDashboard.drawerPaper, !open && classesDashboard.drawerPaperClose),}}
                    open={open}
                >
                    <div className={classesDashboard.toolbarIcon}>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </div>
                    <Divider/>
                    <ListItem button onClick={DashboardPage}>
                        <ListItemIcon>
                            <DashboardIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Dashboard"/>
                    </ListItem>
                    <ListItem button onClick={NoticePage}>
                        <ListItemIcon>
                            <NotificationsIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Notice"/>
                    </ListItem>
                    <ListItem button onClick={GroupPage}>
                        <ListItemIcon>
                            <PeopleIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Group"/>
                    </ListItem>
                    <ListItem button onClick={OrderPage}>
                        <ListItemIcon>
                            <ShoppingCartIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Orders"/>
                    </ListItem>
                    <ListItem button onClick={SupportPage}>
                        <ListItemIcon>
                            <ChatIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Chat"/>
                    </ListItem>
                    <ListItem button onClick={handleClick}>
                        <ListItemIcon>
                            <LayersIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Other"/>
                        {openOther ? <ExpandLess/> : <ExpandMore/>}
                    </ListItem>
                    <Collapse in={openOther} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem button className={classesMenu.nested}>
                                <ListItemIcon>
                                    <PersonIcon/>
                                </ListItemIcon>
                                <ListItemText primary="User" onClick={UserPage}/>
                            </ListItem>
                            <ListItem button className={classesMenu.nested}>
                                <ListItemIcon>
                                    <ClassIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Service" onClick={ServicePage}/>
                            </ListItem>
                            <ListItem button className={classesMenu.nested}>
                                <ListItemIcon>
                                    <AccountTreeIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Connection" onClick={ConnectionPage}/>
                            </ListItem>
                            <ListItem button className={classesMenu.nested}>
                                <ListItemIcon>
                                    <VpnKeyIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Token"/>
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItem button>
                        <ListItemIcon>
                            <SettingsIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Setting"/>
                    </ListItem>
                    <Divider/>
                    {/*<List>{secondaryList}</List>*/}
                </Drawer>
                <main className={classesDashboard.content}>
                    <div className={classesDashboard.appBarSpacer}/>
                    <Container maxWidth="lg" className={classesDashboard.container}>
                        <Typography
                            component="h2"
                            variant="h5"
                            color="inherit"
                            noWrap
                            className={classesDashboard.pageTitle}
                        >
                            {props.title}
                        </Typography>
                        {props.children}
                    </Container>
                </main>
            </div>
        </ThemeProvider>
    );
}
