import axiosInstance from '../services/axiosInstance';

export const searchMusic = async (query: string) => {
  const response = await axiosInstance.get(`/api/music/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

export const getGenres = async () => {
  const response = await axiosInstance.get('/api/music/genres');
  return response.data;
};

export const getGenreDetails = async (genreName: string) => {
  const response = await axiosInstance.get(`/api/music/genres/${encodeURIComponent(genreName)}`);
  return response.data;
};

export const getRecommendations = async () => {
  const response = await axiosInstance.get('/api/music/recommendations');
  return response.data;
};

// Liked Songs
export const getLikedSongs = async () => {
  const response = await axiosInstance.get('/api/music/liked');
  return response.data;
};

export const likeSong = async (song: any) => {
  const response = await axiosInstance.post('/api/music/like', { song });
  return response.data;
};

export const unlikeSong = async (songId: string) => {
  const response = await axiosInstance.delete(`/api/music/like/${songId}`);
  return response.data;
};

// Saved Songs
export const getSavedSongs = async () => {
  const response = await axiosInstance.get('/api/music/saved');
  return response.data;
};

export const saveSong = async (song: any) => {
  const response = await axiosInstance.post('/api/music/save', { song });
  return response.data;
};

export const unsaveSong = async (songId: string) => {
  const response = await axiosInstance.delete(`/api/music/save/${songId}`);
  return response.data;
};

// History log
export const getHistory = async () => {
  const response = await axiosInstance.get('/api/music/history');
  return response.data;
};

export const addHistory = async (song: any) => {
  const response = await axiosInstance.post('/api/music/history', { song });
  return response.data;
};

// Listening Stats
export const getListeningStats = async () => {
  const response = await axiosInstance.get('/api/music/stats');
  return response.data;
};
