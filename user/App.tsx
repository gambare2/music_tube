import React from "react";
import UserRoutes from "./routes/UserRoutes";
import { AuthProvider } from "../shared/context/AuthContext";

function App() {
  return (
    <AuthProvider>
        <UserRoutes />
    </AuthProvider>
  );
}
export default App;


