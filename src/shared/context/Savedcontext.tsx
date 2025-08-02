import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type Video = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
};

type SavedContextType = {
  SavedVideos: Video[];
  savedSongs: (video: Video) => void;
  savedMusic: (id: number) => boolean;
};

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export const useSaved = () => {
  const context = useContext(SavedContext);
  if (!context) throw new Error("useSaved must be used within SavedProvider");
  return context;
};

export const SavedProvider = ({ children }: { children: ReactNode }) => {
  const [SavedVideos, setSavedVideos] = useState<Video[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("SavedVideos");
    if (stored) setSavedVideos(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("SavedVideos", JSON.stringify(SavedVideos));
  }, [SavedVideos]);

  const savedSongs = (video: Video) => {
    setSavedVideos((prev) =>
      prev.find((v) => v.id === video.id)
        ? prev.filter((v) => v.id !== video.id)
        : [...prev, video]
    );
  };

  const savedMusic = (id: number) => SavedVideos.some((v) => v.id === id);

  return (
    <SavedContext.Provider value={{ SavedVideos, savedSongs, savedMusic }}>
      {children}
    </SavedContext.Provider>
  );
};
