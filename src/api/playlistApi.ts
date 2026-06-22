import axiosInstance from '../services/axiosInstance';

export const getPlaylists = async () => {
  const response = await axiosInstance.get('/api/playlists');
  return response.data;
};

export const createPlaylist = async (playlistData: { name: string; description?: string; coverImage?: string; isPublic?: boolean }) => {
  const response = await axiosInstance.post('/api/playlists', playlistData);
  return response.data;
};

export const getPlaylistDetails = async (id: string) => {
  const response = await axiosInstance.get(`/api/playlists/${id}`);
  return response.data;
};

export const updatePlaylist = async (id: string, playlistData: { name?: string; description?: string; coverImage?: string; isPublic?: boolean; songs?: any[] }) => {
  const response = await axiosInstance.put(`/api/playlists/${id}`, playlistData);
  return response.data;
};

export const deletePlaylist = async (id: string) => {
  const response = await axiosInstance.delete(`/api/playlists/${id}`);
  return response.data;
};

export const addSongToPlaylist = async (playlistId: string, song: any) => {
  const response = await axiosInstance.post(`/api/playlists/${playlistId}/songs`, { song });
  return response.data;
};

export const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
  const response = await axiosInstance.delete(`/api/playlists/${playlistId}/songs/${songId}`);
  return response.data;
};
