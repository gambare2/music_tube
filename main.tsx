import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "./shared/context/Authcontext";
import UserApp from "./user/App";
import AdminApp from "./admin/App";
import "./index.css";
import { Provider } from "react-redux";
import store from "./shared/store/Store";

// App selector based on path
const AppSelector = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return isAdmin ? <AdminApp /> : <UserApp />;
};

// Render
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <AppSelector />
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);

