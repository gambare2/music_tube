import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "./shared/context/Authcontext";
import UserApp from "./user/App";
import AdminApp from "./admin/App";
import "./index.css"


const AppSelector = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return isAdmin ? <AdminApp /> : <UserApp />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppSelector />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
