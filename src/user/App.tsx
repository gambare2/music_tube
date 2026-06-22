
import UserRoutes from "./routes/UserRoutes";
import { AuthProvider } from "../shared/context/Authcontext";
import { LikedProvider } from "../shared/context/Likedcontext";
import { SavedProvider } from "../shared/context/Savedcontext";
import { PlaylistProvider } from "../shared/context/Playlistcontext";
import { PlayerProvider } from "../shared/context/PlayerContext";
import { ThemeProvider } from "../shared/context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LikedProvider>
          <SavedProvider>
            <PlaylistProvider>
              <PlayerProvider>
                <UserRoutes />
              </PlayerProvider>
            </PlaylistProvider>
          </SavedProvider>
        </LikedProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;


