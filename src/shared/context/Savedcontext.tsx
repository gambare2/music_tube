import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axiosInstance from "../../services/axiosInstance";
import { toast } from "react-toastify";

export type Video = {
  id: string | number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  audio?: string;
  name?: string;
  artist_name?: string;
  album_image?: string;
};

type SavedContextType = {
  SavedVideos: Video[];
  savedSongs: (video: Video) => void;
  savedMusic: (id: string | number) => boolean;
  syncWithBackend: () => Promise<void>;
};

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export const useSaved = () => {
  const context = useContext(SavedContext);
  if (!context) throw new Error("useSaved must be used within SavedProvider");
  return context;
};

export const SavedProvider = ({ children }: { children: ReactNode }) => {
  const [SavedVideos, setSavedVideos] = useState<Video[]>([]);

  // Fetch and map saved songs from the backend database
  const syncWithBackend = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axiosInstance.get('/api/music/saved');
      if (res.data && Array.isArray(res.data.results)) {
        const mapped = res.data.results.map((song: any) => ({
          id: song.id,
          title: song.name || song.title || "Unknown Title",
          description: song.artist_name || song.description || "Unknown Artist",
          thumbnail: song.album_image || song.thumbnail || "/music_cover.png",
          videoUrl: song.audio || song.videoUrl || "",
          audio: song.audio,
          name: song.name,
          artist_name: song.artist_name,
          album_image: song.album_image
        }));
        setSavedVideos(mapped);
      }
    } catch (err) {
      console.error("[SavedContext] Sync error:", err);
    }
  };

  // Perform initial load & setup 4-second real-time poll loop
  useEffect(() => {
    syncWithBackend();

    const interval = setInterval(() => {
      syncWithBackend();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Sync state whenever the login token changes
  useEffect(() => {
    const handleAuthChange = () => {
      syncWithBackend();
    };
    window.addEventListener("storage", handleAuthChange);
    return () => window.removeEventListener("storage", handleAuthChange);
  }, []);

  const savedSongs = async (video: Video) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please log in to save songs");
      return;
    }

    const isCurrentlySaved = SavedVideos.some((v) => String(v.id) === String(video.id));

    // Optimistic Update: instantly update the UI state
    const previousState = [...SavedVideos];
    setSavedVideos((prev) =>
      isCurrentlySaved
        ? prev.filter((v) => String(v.id) !== String(video.id))
        : [...prev, video]
    );

    try {
      if (isCurrentlySaved) {
        // Delete request to unsave
        await axiosInstance.delete(`/api/music/save/${video.id}`);
        toast.info("Removed from Library");
      } else {
        // Post request to save
        const songData = {
          id: String(video.id),
          name: video.title || video.name,
          artist_name: video.description || video.artist_name,
          audio: video.videoUrl || video.audio,
          album_image: video.thumbnail || video.album_image
        };
        await axiosInstance.post('/api/music/save', { song: songData });
        toast.success("Saved to Library");
      }
    } catch (err) {
      // Revert if API fails
      setSavedVideos(previousState);
      toast.error("Failed to sync library state with database");
    }
  };

  const savedMusic = (id: string | number) => {
    return SavedVideos.some((v) => String(v.id) === String(id));
  };

  return (
    <SavedContext.Provider value={{ SavedVideos, savedSongs, savedMusic, syncWithBackend }}>
      {children}
    </SavedContext.Provider>
  );
};
