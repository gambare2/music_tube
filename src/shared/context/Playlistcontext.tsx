import React,  {
  createContext,
  useContext,
  useState,
  useEffect,
 
} from "react";
import type { ReactNode } from "react";

export type Video = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
};

export type Playlist = {
  id: number;
  name: string;
  videos: Video[];
};

type PlaylistContextType = {
  playlists: Playlist[];
  createPlaylist: (name: string) => Promise<Playlist>;
  addToPlaylist: (playlistId: number, video: Video) => void;
  removeFromPlaylist: (playlistId: number, videoId: number) => void;
};

const PlaylistContext = createContext<PlaylistContextType | undefined>(
  undefined
);

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylist must be used within PlaylistProvider");
  }
  return context;
};

export const PlaylistProvider = ({ children }: { children: ReactNode }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("playlists");
    if (stored) {
      setPlaylists(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  const createPlaylist = async (name: string): Promise<Playlist> => {
    const newPlaylist: Playlist = {
      id: Date.now(),
      name,
      videos: [],
    };

    setPlaylists((prev) => [...prev, newPlaylist]);

    // Wait for state update to propagate
    await new Promise((resolve) => setTimeout(resolve, 0));

    return newPlaylist;
  };

  const addToPlaylist = (playlistId: number, video: Video) => {
    setPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, videos: [...playlist.videos, video] }
          : playlist
      )
    );
  };

  const removeFromPlaylist = (playlistId: number, videoId: number) => {
    setPlaylists((prev) =>
      prev.map((playlist) =>
        playlist.id === playlistId
          ? {
              ...playlist,
              videos: playlist.videos.filter((v) => v.id !== videoId),
            }
          : playlist
      )
    );
  };

  return (
    <PlaylistContext.Provider
      value={{ playlists, createPlaylist, addToPlaylist, removeFromPlaylist }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
