import React from 'react';
import clsx from 'clsx';
import {
    Collapse,
    Divider,
    Drawer,
    IconButton,
    List, ListItem, ListItemIcon, ListItemText,
} from "@material-ui/core";
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
import useStyles from "./styles";
import useStyles2 from "../styles";

export default function SideBar(props: any) {
    const classesDashboard = useStyles2();
    const classesMenu = useStyles();


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
    const fixedHeightPaper = clsx(classesDashboard.paper, classesDashboard.fixedHeight);
    const [openOther, setOpenOther] = React.useState(false);
    const handleClick = () => {
        setOpenOther(!openOther);
        // Menu Bar is not opened...
        if (!open) {
            setOpen(true);
        }
    };

    return (
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
            <ListItem button>
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>
                <ListItemText primary="Dashboard"/>
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <NotificationsIcon/>
                </ListItemIcon>
                <ListItemText primary="Notice"/>
            </ListItem>

            <ListItem button>
                <ListItemIcon>
                    <PeopleIcon/>
                </ListItemIcon>
                <ListItemText primary="Group"/>
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <ShoppingCartIcon/>
                </ListItemIcon>
                <ListItemText primary="Orders"/>
            </ListItem>
            <ListItem button>
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
                        <ListItemText primary="User"/>
                    </ListItem>
                    <ListItem button className={classesMenu.nested}>
                        <ListItemIcon>
                            <ClassIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Service"/>
                    </ListItem>
                    <ListItem button className={classesMenu.nested}>
                        <ListItemIcon>
                            <AccountTreeIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Connection"/>
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
        </Drawer>
    );
}
