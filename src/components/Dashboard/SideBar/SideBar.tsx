import React from 'react';
import {
    Collapse,
    Divider,
    Drawer,
    IconButton,
    List, ListItem, ListItemIcon, ListItemText,
} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LayersIcon from "@mui/icons-material/Layers";
import ClassIcon from '@mui/icons-material/Class';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import {StyledDivDashboardToolBarIcon, StyledListItemSideBarNested} from "../styles";

export default function SideBar() {
    // Menu Bar
    const [open, setOpen] = React.useState(false);
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

    return (
        <Drawer
            variant="permanent"
            // classes={{paper: clsx(classesDashboard.drawerPaper, !open && classesDashboard.drawerPaperClose),}}
            open={open}
        >
            <StyledDivDashboardToolBarIcon>
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon/>
                </IconButton>
            </StyledDivDashboardToolBarIcon>
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
                    <StyledListItemSideBarNested>
                        <ListItemIcon>
                            <PersonIcon/>
                        </ListItemIcon>
                        <ListItemText primary="User"/>
                    </StyledListItemSideBarNested>
                    <StyledListItemSideBarNested>
                        <ListItemIcon>
                            <ClassIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Service"/>
                    </StyledListItemSideBarNested>
                    <StyledListItemSideBarNested>
                        <ListItemIcon>
                            <AccountTreeIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Connection"/>
                    </StyledListItemSideBarNested>
                    <StyledListItemSideBarNested>
                        <ListItemIcon>
                            <VpnKeyIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Token"/>
                    </StyledListItemSideBarNested>
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
