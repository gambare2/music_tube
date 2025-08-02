// src/redux/slices/playlistSlice.ts
import { createSlice, } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Video = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
};

export type Playlist = {
  id: string | number;
  name: string;
  videos: Video[];
};

interface PlaylistState {
  playlists: Playlist[];
}

const initialState: PlaylistState = {
  playlists: JSON.parse(localStorage.getItem("playlists") || "[]"),
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    createPlaylist: (state, action: PayloadAction<{ name: string }>) => {
      const newPlaylist: Playlist = {
        id: Date.now(),
        name: action.payload.name,
        videos: [],
      };
      state.playlists.push(newPlaylist);
      localStorage.setItem("playlists", JSON.stringify(state.playlists));
    },
    addToPlaylist: (
      state,
      action: PayloadAction<{ playlistId: string | number; video: Video }>
    ) => {
      const playlist = state.playlists.find(p => p.id === action.payload.playlistId);
      if (playlist && !playlist.videos.find(v => v.id === action.payload.video.id)) {
        playlist.videos.push(action.payload.video);
        localStorage.setItem("playlists", JSON.stringify(state.playlists));
      }
    },
    removeFromPlaylist: (
      state,
      action: PayloadAction<{ playlistId: string | number; videoId: number }>
    ) => {
      const playlist = state.playlists.find(p => p.id === action.payload.playlistId);
      if (playlist) {
        playlist.videos = playlist.videos.filter(v => v.id !== action.payload.videoId);
        localStorage.setItem("playlists", JSON.stringify(state.playlists));
      }
    },
  },
});

export const { createPlaylist, addToPlaylist, removeFromPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
