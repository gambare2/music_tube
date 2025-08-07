import { useState } from "react";
import { Link } from "react-router";
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
import { List, ListItem, ListItemText, Box, Drawer } from "@mui/material";
import { Outlet, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../shared/store/Store";
import { logout } from "../shared/slice/AuthSlice";
import { toast } from "react-toastify";


const isLoggedIn = true;
const drawerWidth = 200;

const ProfileMenu = isLoggedIn ? [
    { name: 'Profile', path: '/profile', icon: <Person2Icon /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon /> },
    { name: 'Logout', path: '/user/login', icon: <LogoutIcon /> },
] : [
    { name: 'Login', path: '/user/login', icon: <LoginIcon /> },
];

const Navbarcomponent = [
    { name: 'Contact', path: '/contact' },
];

const PlaylistMenu = [
    { name: 'Home', path: '/home' },
    { name: 'History', path: '/history', icon: <ManageHistoryIcon /> },
    { name: 'Your Playlist', path: 'playlist', icon: <ListIcon /> },
    { name: 'Saved Songs', path: '/savedSongs', icon: <BookmarkBorderIcon /> },
    { name: 'Liked Songs', path: '/likedSongs', icon: <FavoriteBorderIcon /> },
];

function Layout() {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user) as {
        profile: string;
        name: string;
        email: string;
      } | null;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(prev => !prev);
    const handleDrawerClose = () => {
        setIsClosing(true);
        setIsOpen(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        setTimeout(() => navigate('/user/login'), 1000);
        toast.success('Logged out successfully');
    };

    const drawer = (
        <div className="bg-slate-400 text-white font1 h-full min-h-screen">
            <div className="md:hidden relative z-50">
                <span onClick={toggleMenu} className="cursor-pointer relative size-8">
                    <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                        <MenuIcon />
                    </span>
                    <span className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                        <ClearIcon />
                    </span>
                </span>
                {isOpen && (
                    <div className="flex flex-col gap-4 font1 absolute top-14 left-0 text-left bg-slate-400 text-white py-4 pr-4 pl-2">
                        {Navbarcomponent.map((item, index) => (
                            <ListItem key={index}>
                                <Link to={item.path}>{item.name}</Link>
                            </ListItem>
                        ))}
                    </div>
                )}
            </div>
            <span className="flex flex-row text-3xl gap-2 font-bold font2 bg-slate-600 py-3 px-1">
                <img src="/Music_tube.svg" alt="logo" className="size-10" /> Pritube
            </span>
            <Divider />
            <List>
                {PlaylistMenu.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText>
                            <Link to={item.path}>{item.icon} {item.name}</Link>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {Navbarcomponent.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText>
                            <Link to={item.path}>{item.name}</Link>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <>
            <div className="p-4 bg-slate-600 text-white overflow-hidden w-full">
                <div className="flex justify-between items-center">
                    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                        <Drawer
                            className={`${isClosing ? 'animate-slide-out' : ''}`}
                            variant="temporary"
                            open={isOpen}
                            onClose={handleDrawerClose}
                            sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
                            slotProps={{ root: { keepMounted: true } }}
                        >
                            {drawer}
                        </Drawer>
                        <Drawer
                            variant="permanent"
                            sx={{ display: { xs: 'none', sm: 'block' }, backgroundColor: '#475569', '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Box>

                    <div className="flex items-center gap-4">
                        <NotificationsNoneIcon className="size-8 cursor-pointer" />
                        <input
                            type="image"
                            src={user?.profile || '/Avatar_profile.svg'}
                            onError={(e) => {
                                e.currentTarget.src = '/Avatar_profile.svg';
                            }}
                            alt="profile"
                            className="size-8 rounded-full cursor-pointer"
                            onClick={toggleMenu}
                        />
                        {isOpen && (
                            <div
                                onMouseLeave={toggleMenu}
                                className="flex flex-col gap-4 absolute top-16 right-2 text-left bg-slate-400 text-white py-4 pr-4 pl-2 min-w-[150px] rounded shadow-lg z-50"
                            >
                                {ProfileMenu.map((item, index) => (
                                    <div key={index} onClick={item.name === 'Logout' ? handleLogout : undefined}>
                                        <Link to={item.path}>{item.icon} {item.name}</Link>
                                        {index < ProfileMenu.length - 1 && <Divider className="!bg-white my-4" />}
                                    </div>
                                ))}

                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Box component="main" sx={{ flexGrow: 1, ml: { md: `${drawerWidth}px` } }}>
                <Outlet />
            </Box>
        </>
    );
}

export default Layout;
