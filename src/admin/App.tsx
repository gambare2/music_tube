
import AdminRoutes from "./routes/AdminRoutes";
import { AuthProvider } from "../shared/context/Authcontext";

function AdminApp() {
  return (
    <AuthProvider>
        <AdminRoutes />
    </AuthProvider>
  );
}
export default AdminApp;

