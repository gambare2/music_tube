// src/routes/AdminRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router";
import Login from "../AuthContext/Login"
import AdminRoute from "../../shared/routes/AdminRoute";
import Dashboard from "../components/Dashboard";
import UploadVideos from "../components/UploadVideos"

const AdminRoutes: React.FC = () => (
  <Routes>
    <Route path="/admin/login" element={<Login />} />
    <Route
      path="/admin/dashboard"
      element={
        <AdminRoute>
          <Dashboard />
        </AdminRoute>
      }
    />
    <Route
      path="/admin/upload"
      element={
        <AdminRoute>
          <UploadVideos />
        </AdminRoute>
      }
    />
  </Routes>
);

export default AdminRoutes;
