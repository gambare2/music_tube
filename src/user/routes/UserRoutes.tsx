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
import Playlist from "../component/PLaylist"
import Contact from "../component/Contact";
import WelcomeScreen from "../../shared/pages/WelcomeScreen";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UserRoutes: React.FC = () => (
  <>
  <Routes>
  {/* Public Auth Routes */}
  <Route path="/user/login" element={<Login />} />
  <Route path="/user/register" element={<Register />} />
  

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

    {/* Protected Profile Route */}
    <Route
      path="/profile"
      element={
        <ProtectedRoutes>
          <Profile />
        </ProtectedRoutes>
      }
    />
   
  </Route>
</Routes>
<ToastContainer position="bottom-right" autoClose={2000} />
</>

);

export default UserRoutes;

