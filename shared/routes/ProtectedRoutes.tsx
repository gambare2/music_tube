import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

const ProtectedRoutes = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== "user") return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoutes;

