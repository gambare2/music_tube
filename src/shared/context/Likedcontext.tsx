import { createContext, useContext, useState,  useEffect } from "react";
import type { ReactNode } from "react";

export type Video = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
};

type LikedContextType = {
  likedVideos: Video[];
  likedSongs: (video: Video) => void;
  likedMusic: (id: number) => boolean;
};

const LikedContext = createContext<LikedContextType | undefined>(undefined);

export const useLiked = () => {
  const context = useContext(LikedContext);
  if (!context) throw new Error("useLiked must be used within LikedProvider");
  return context;
};

export const LikedProvider = ({ children }: { children: ReactNode }) => {
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("likedVideos");
    if (stored) setLikedVideos(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("likedVideos", JSON.stringify(likedVideos));
  }, [likedVideos]);

  const likedSongs = (video: Video) => {
    setLikedVideos((prev) =>
      prev.find((v) => v.id === video.id)
        ? prev.filter((v) => v.id !== video.id)
        : [...prev, video]
    );
  };

  const likedMusic = (id: number) => likedVideos.some((v) => v.id === id);

  return (
    <LikedContext.Provider value={{ likedVideos, likedSongs, likedMusic }}>
      {children}
    </LikedContext.Provider>
  );
};
