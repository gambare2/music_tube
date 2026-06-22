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

type LikedContextType = {
  likedVideos: Video[];
  likedSongs: (video: Video) => void;
  likedMusic: (id: string | number) => boolean;
  syncWithBackend: () => Promise<void>;
};

const LikedContext = createContext<LikedContextType | undefined>(undefined);

export const useLiked = () => {
  const context = useContext(LikedContext);
  if (!context) throw new Error("useLiked must be used within LikedProvider");
  return context;
};

export const LikedProvider = ({ children }: { children: ReactNode }) => {
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);

  // Fetch and map songs from the backend database
  const syncWithBackend = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axiosInstance.get('/api/music/liked');
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
        setLikedVideos(mapped);
      }
    } catch (err) {
      console.error("[LikedContext] Sync error:", err);
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

  const likedSongs = async (video: Video) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please log in to like songs");
      return;
    }

    const isCurrentlyLiked = likedVideos.some((v) => String(v.id) === String(video.id));

    // Optimistic Update: instantly update the UI state
    const previousState = [...likedVideos];
    setLikedVideos((prev) =>
      isCurrentlyLiked
        ? prev.filter((v) => String(v.id) !== String(video.id))
        : [...prev, video]
    );

    try {
      if (isCurrentlyLiked) {
        // Delete request to unlike
        await axiosInstance.delete(`/api/music/like/${video.id}`);
        toast.info("Removed from Liked Songs");
      } else {
        // Post request to like
        // Format to backend representation
        const songData = {
          id: String(video.id),
          name: video.title || video.name,
          artist_name: video.description || video.artist_name,
          audio: video.videoUrl || video.audio,
          album_image: video.thumbnail || video.album_image
        };
        await axiosInstance.post('/api/music/like', { song: songData });
        toast.success("Added to Liked Songs");
      }
    } catch (err) {
      // Revert if API fails
      setLikedVideos(previousState);
      toast.error("Failed to sync liked state with database");
    }
  };

  const likedMusic = (id: string | number) => {
    return likedVideos.some((v) => String(v.id) === String(id));
  };

  return (
    <LikedContext.Provider value={{ likedVideos, likedSongs, likedMusic, syncWithBackend }}>
      {children}
    </LikedContext.Provider>
  );
};
