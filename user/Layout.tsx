import { useState } from "react";
import React from "react";
import { Link, useLocation } from "react-router";
import MenuIcon from '@mui/icons-material/Menu';
import './App.css'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ClearIcon from '@mui/icons-material/Clear';
import Divider from '@mui/material/Divider';
import SettingsIcon from '@mui/icons-material/Settings';
import Person2Icon from '@mui/icons-material/Person2';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import ListIcon from '@mui/icons-material/List';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { List, ListItem, ListItemText, Box, Drawer } from "@mui/material";
import { Outlet } from "react-router";
import { motion, AnimatePresence } from 'framer-motion';
import Contact from "./component/Contact";
import Home from "./component/Home";


const isLoggedIn = true;
const drawerWidth = 200;

const ProfileMenu = isLoggedIn ? [
    {
        name: 'Profile',
        path: '/profile',
        icon: <Person2Icon />
    },
    {
        name: 'Settings',
        path: '/settings',
        icon: <SettingsIcon />
    },
    {
        name: 'Login',
        path: '/user/login',
        icon: <LoginIcon />
    },
] : [
    {
        name: 'Logout',
        path: '/login',
        icon: <LogoutIcon />
    },
]
const Navbarcomponent = [
    {
        name: 'Contact',
        path: '/contact'
    },
]
const PlaylistMenu = [
    {
        name: 'Home',
        path: '/home'
    },
    {
        name: 'History',
        path: '/history',
        icon: <ManageHistoryIcon />
    },
    {
        name: 'Your Playlist',
        path: 'playlist',
        icon: <ListIcon />
    },
    {
        name: 'Saved Songs',
        path: '/savedSongs',
        icon: <BookmarkBorderIcon />
    },
    {
        name: 'Liked Songs',
        path: '/likedSongs',
        icon: <FavoriteBorderIcon />
    },


]
function Layout() {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    };
    const handleDrawerClose = () => {
        setIsClosing(true);
        setIsOpen(false);
    };

    const drawer = (
        <div className="bg-slate-400 text-white font1 h-screen ">
            
             <div className="md:hidden relative z-50">
                
                        <span
                            onClick={toggleMenu}
                            className="cursor-pointer relative size-8"
                        >
                            <span
                                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
                                    }`}
                            >
                                <MenuIcon />
                            </span>
                            <span
                                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                                    }`}
                            >
                                <ClearIcon />
                            </span>
                        </span>
                        {isOpen && (
                            <div className="flex flex-col gap-4 font1 absolute top-14 left-0  text-left  bg-slate-400 text-white py-4 pr-4 pl-2">
                                {
                                    Navbarcomponent.map((item, index) => (
                                        <ListItem>

                                        <Link to={item.path} key={index}>{item.name}</Link>
                                        </ListItem>
                                    ))
                                }
                            </div>
                        )}
                    </div>
                    <span className="flex flex-row text-3xl gap-2 font-bold font2 bg-slate-600 py-3 px-1">
                        <img src="/Music_tube.svg" alt="" className="size-10" /> Pritube
                    </span>
            <Divider />
            
            <List>
                {
                    PlaylistMenu.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText>
                                <Link to={item.path} key={index}>{item.icon} {item.name}</Link>
                            </ListItemText>
                        </ListItem>
                    ))
                }
            </List>
            <Divider />
            <List>
                {Navbarcomponent.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText>
                            <Link to={item.path} key={index}>{item.name}</Link>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
            
        </div>
    )
    return (
        <>
        
      
      
        <div className=" p-4 bg-slate-600 text-white overflow-hidden">
            <div className="flex flex-row justify-between items-center">
            {/* <AnimatePresence mode="wait">
      <motion.div
  key={location.pathname}
  initial={{ opacity: 0, x: -100 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 100 }}
  transition={{ duration: 0.2, ease: 'backInOut' }}
> */}
                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, }}
                >
                    <Drawer
                        variant="temporary"
                        open={isOpen}
                        onClose={handleDrawerClose}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        slotProps={{
                            root: {
                                keepMounted: true,
                            },
                        }}
                    >
                        {drawer}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },  backgroundColor: '#475569' ,
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                </Box>
                {/* </motion.div>
</AnimatePresence> */}

               

                <div className="flex flex-row justify-end items-right gap-6">
                    <NotificationsNoneIcon className="size-10 my-1 cursor-pointer" />
                    <input type="image" src="/Avatar_profile.svg" alt="profile"
                        className="size-8 rounded-full cursor-pointer"
                        onMouseEnter={toggleMenu}
                    />
                    {isOpen && (
                        <div
                            onMouseLeave={toggleMenu}
                            className="flex flex-col gap-4 font1 absolute top-16 right-2 text-left bg-slate-400 text-white py-4 pr-4 pl-2 min-w-[150px] rounded shadow-lg z-50">
                            {ProfileMenu.map((item, index) => (
                                <div key={index}>
                                    <Link to={item.path}>{item.icon} {item.name}</Link>
                                    {index < ProfileMenu.length - 1 && <Divider
                                        className="!bg-white my-4" />}
                                </div>
                            ))}
                        </div>)}
                </div>
            </div>
            
        </div>
        
        <Box 
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${drawerWidth}px` }, 
        }}
      >
        <Outlet />
        
      </Box>
    
        
        </>
        
    )
}

export default Layout

