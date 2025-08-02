import React from "react"
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user || user.role !== "admin")
     return
     <Navigate to="/admin/login" />;
  return children;
};

export default AdminRoute;

