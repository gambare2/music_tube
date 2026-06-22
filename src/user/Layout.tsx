import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../shared/store/Store';
import { logout } from '../shared/slice/AuthSlice';
import { toast } from 'react-toastify';
import PlayerBar from './component/PlayerBar';
import LyricsDrawer from './component/LyricsDrawer';

import { getProfile } from '../api/authApi';
import { setUser } from '../shared/slice/AuthSlice';
import { useAppTheme } from '../shared/context/ThemeContext';

// Material UI Icons
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Divider from '@mui/material/Divider';
import { motion } from 'framer-motion';
import { IconButton } from '@mui/material';

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, toggleTheme } = useAppTheme();

  const user = useSelector((state: RootState) => state.auth.user) as {
    profile?: string;
    name: string;
    email: string;
    username?: string;
  } | null;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Hydrate Redux auth state on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user && token) {
      getProfile()
        .then((profileData) => {
          dispatch(setUser(profileData));
        })
        .catch((err) => {
          console.error('[HYDRATION ERROR] Failed to fetch profile:', err);
        });
    }
  }, [user, dispatch]);

  const toggleMobileMenu = () => setMobileOpen(prev => !prev);
  const toggleProfileMenu = () => setProfileOpen(prev => !prev);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast.success('Logged out successfully');
    navigate('/user/login');
  };

  const navItems = [
    { name: 'Home', path: '/home', icon: <HomeIcon /> },
    { name: 'Search', path: '/search', icon: <SearchIcon /> },
    { name: 'Discover Artists', path: '/artist-discovery', icon: <ExploreIcon /> },
  ];

  const libraryItems = [
    { name: 'Playlists', path: '/playlist', icon: <LibraryMusicIcon /> },
    { name: 'Liked Songs', path: '/likedSongs', icon: <FavoriteIcon /> },
    { name: 'Saved Songs', path: '/savedSongs', icon: <BookmarkIcon /> },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-black text-[#B3B3B3] font-sans p-6 select-none">
      {/* App Branding */}
      <Link to="/home" className="flex items-center gap-3 text-white text-2xl font-bold font-sans tracking-wide mb-8">
        <img src="/Music_tube.svg" alt="logo" className="w-9 h-9" />
        <span>PriTube</span>
      </Link>

      {/* Navigation */}
      <div className="flex flex-col gap-1 mb-8">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-4 py-3 px-2 rounded-md font-semibold text-sm transition-all duration-200 ${isActive ? 'text-white bg-neutral-900' : 'hover:text-white'
                }`}
            >
              <span className={isActive ? 'text-[#1DB954]' : ''}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <Divider className="!bg-neutral-800 my-2" />

      {/* Your Library */}
      <div className="mt-4 flex-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4 px-2">Your Library</h3>
        <div className="flex flex-col gap-1">
          {libraryItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 py-3 px-2 rounded-md font-semibold text-sm transition-all duration-200 ${isActive ? 'text-white bg-neutral-900' : 'hover:text-white'
                  }`}
              >
                <span className={isActive ? 'text-[#1DB954]' : ''}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <Divider className="!bg-neutral-800 my-2" />

      {/* Secondary User Nav */}
      <div className="flex flex-col gap-1 mt-auto">
        <Link
          to="/dashboard"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-4 py-3 px-2 rounded-md font-semibold text-sm transition-all duration-200 ${location.pathname === '/dashboard' ? 'text-white bg-neutral-900' : 'hover:text-white'
            }`}
        >
          <span className={location.pathname === '/dashboard' ? 'text-[#1DB954]' : ''}>
            <DashboardIcon />
          </span>
          <span>Analytics Dashboard</span>
        </Link>
        <Link
          to="/profile"
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-4 py-3 px-2 rounded-md font-semibold text-sm transition-all duration-200 ${location.pathname === '/profile' ? 'text-white bg-neutral-900' : 'hover:text-white'
            }`}
        >
          <span className={location.pathname === '/profile' ? 'text-[#1DB954]' : ''}>
            <PersonIcon />
          </span>
          <span>My Profile</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col font-sans antialiased select-none">

      {/* ROOT CONTENT CONTAINER */}
      <div className="flex flex-1 relative overflow-hidden">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:block w-64 h-[calc(100vh-96px)] sticky top-0 left-0 bg-black border-r border-[#181818] z-30 shrink-0">
          {sidebarContent}
        </aside>

        {/* MOBILE DRAWER OVERLAY */}
        {mobileOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden flex">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              className="w-64 h-full bg-black relative"
            >
              <div className="absolute top-4 right-4">
                <button onClick={toggleMobileMenu} className="text-white">
                  <CloseIcon />
                </button>
              </div>
              {sidebarContent}
            </motion.div>
            <div className="flex-1" onClick={toggleMobileMenu} />
          </div>
        )}

        {/* MAIN VIEWPORT PANEL */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">

          {/* FLOATING HEADER */}
          <header className="h-16 bg-[#0F0F0F]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 border-b border-[#181818]/40">
            {/* Header Left: History navigation & Mobile Menu toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMobileMenu}
                className="md:hidden text-white hover:text-[#1DB954]"
              >
                <MenuIcon />
              </button>

              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => navigate(-1)}
                  className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-neutral-800 transition-colors"
                >
                  <KeyboardArrowLeftIcon />
                </button>
                <button
                  onClick={() => navigate(1)}
                  className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center hover:bg-neutral-800 transition-colors"
                >
                  <KeyboardArrowRightIcon />
                </button>
              </div>
            </div>

            {/* Header Right: User settings & Notifications */}
            <div className="flex items-center gap-4 relative">
              <IconButton onClick={toggleTheme} className="text-[#B3B3B3] hover:text-white" title="Toggle Light/Dark Theme">
                {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              <IconButton className="text-[#B3B3B3] hover:text-white">
                <NotificationsIcon />
              </IconButton>

              {/* Profile Bubble */}
              <div className="flex items-center gap-2 cursor-pointer" onClick={toggleProfileMenu}>
                <img
                  src={user?.profile || '/Avatar_profile.svg'}
                  alt="avatar"
                  onError={(e) => {
                    e.currentTarget.src = '/Avatar_profile.svg';
                  }}
                  className="w-8 h-8 rounded-full object-cover border border-[#282828]"
                />
                <span className="hidden sm:inline text-sm font-semibold hover:text-white text-[#B3B3B3]">
                  {user?.name || 'User'}
                </span>
              </div>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-12 w-48 bg-[#181818] border border-[#282828] rounded-md shadow-2xl py-1 z-50 animate-fadeInSlideUp">
                    <div className="px-4 py-2 border-b border-[#282828]">
                      <p className="text-xs text-neutral-500 font-bold uppercase">Logged in as</p>
                      <p className="text-sm font-semibold truncate text-white">{user?.username || user?.name}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-[#B3B3B3] hover:text-white hover:bg-neutral-800/50"
                    >
                      <PersonIcon fontSize="small" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-[#B3B3B3] hover:text-white hover:bg-neutral-800/50"
                    >
                      <DashboardIcon fontSize="small" />
                      <span>Listening Stats</span>
                    </Link>
                    <Divider className="!bg-[#282828]" />
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-neutral-800/50 text-left"
                    >
                      <LogoutIcon fontSize="small" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </header>

          {/* MAIN PAGE VIEW CONTENT */}
          <main className="flex-1 overflow-y-auto px-6 py-6 pb-36 no-scrollbar">
            <Outlet />
          </main>
        </div>
      </div>

      {/* AUDIO PERSISTENT BAR & LYRICS */}
      <PlayerBar />
      <LyricsDrawer />

    </div>
  );
};

export default Layout;
