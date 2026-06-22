import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../component/Home";
import VideoSection from "../component/VideoSection";
import Login from "../component/Authlogin/Login";
import ProtectedRoutes from "../../shared/routes/ProtectedRoutes";
import Profile from "../component/Profile";
import Layout from "../Layout";
import Register from "../component/Authlogin/Register";
import LikedSongs from "../component/LikedSongs";
import SavedSongs from "../component/SavedSongs";
import Playlist from "../component/PLaylist";
import PlaylistDetails from "../component/PlaylistDetails";
import Contact from "../component/Contact";
import Search from "../component/Search";
import ArtistDiscovery from "../component/ArtistDiscovery";
import ArtistProfile from "../component/ArtistProfile";
import GenrePage from "../component/GenrePage";
import Dashboard from "../component/Dashboard";
import ForgotPassword from "../component/Authlogin/ForgotPassword";
import ResetPassword from "../component/Authlogin/ResetPassword";
import WelcomeScreen from "../../shared/pages/WelcomeScreen";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UserRoutes: React.FC = () => (
  <>
  <Routes>
  {/* Public Auth Routes */}
  <Route path="/user/login" element={<Login />} />
  <Route path="/user/register" element={<Register />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />

  {/* Welcome Screen at root "/" */}
  <Route path="/" element={<WelcomeScreen />} />

  {/* App Layout starts from here */}
  <Route element={<Layout />}>
    <Route path="/home" element={<Home />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/videoSection/:id" element={<VideoSection />} />
    <Route path="/likedSongs" element={<LikedSongs />} />
    <Route path="/savedSongs" element={<SavedSongs />} />
    <Route path="/playlist" element={<Playlist />} />
    <Route path="/playlist/:id" element={<PlaylistDetails />} />
    <Route path="/search" element={<Search />} />
    <Route path="/artist-discovery" element={<ArtistDiscovery />} />
    <Route path="/artist/:id" element={<ArtistProfile />} />
    <Route path="/genre/:genreName" element={<GenrePage />} />

    {/* Protected Routes */}
    <Route
      path="/profile"
      element={
        <ProtectedRoutes>
          <Profile />
        </ProtectedRoutes>
      }
    />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoutes>
          <Dashboard />
        </ProtectedRoutes>
      }
    />
   
  </Route>
</Routes>
<ToastContainer position="bottom-right" autoClose={2000} />
</>

);

export default UserRoutes;

