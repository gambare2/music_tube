import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import React from "react";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user || user.role !== "user") return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoutes;

