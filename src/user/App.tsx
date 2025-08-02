
import UserRoutes from "./routes/UserRoutes";
import { AuthProvider } from "../shared/context/Authcontext";
import { LikedProvider } from "../shared/context/Likedcontext";
import { SavedProvider } from "../shared/context/Savedcontext";
import { PlaylistProvider } from "../shared/context/Playlistcontext";

function App() {
  return (
    <AuthProvider>
      <LikedProvider>
        <SavedProvider>
          <PlaylistProvider>
            <UserRoutes />
          </PlaylistProvider>
        </SavedProvider>
      </LikedProvider>
    </AuthProvider>
  );
}
export default App;


