// src/routes/UserRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router";
import Home from "../component/Home"
import VideoSection from "../component/VideoSection"
import Login from  "../component/Authlogin/Login"
import ProtectedRoutes from "../../shared/routes/ProtectedRoutes"
import Profile from "../component/Profile";
import Layout from "../Layout";


const UserRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Layout/>}>
    <Route path="/home" element={<Home />} />
    <Route path="/video/:id" element={<VideoSection/>} />
    <Route path="/login" element={<Login />} />
    <Route
      path="/profile"
      element={
       <ProtectedRoutes>
        <Profile/>
       </ProtectedRoutes>
      }
    />
    </Route>
  </Routes>
);

export default UserRoutes;
