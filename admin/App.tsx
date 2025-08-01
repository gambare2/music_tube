import React from 'react'
import AdminRoutes from "./routes/AdminRoutes";
import { AuthProvider } from "../shared/context/AuthContext";

function AdminApp() {
  return (
    <AuthProvider>
        <AdminRoutes />
    </AuthProvider>
  );
}
export default AdminApp;

