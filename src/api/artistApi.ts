import axiosInstance from '../services/axiosInstance';

export const getArtists = async (name = '', limit = 20) => {
  const response = await axiosInstance.get(`/api/music/artists?name=${encodeURIComponent(name)}&limit=${limit}`);
  return response.data;
};

export const getTrendingArtists = async (limit = 10) => {
  const response = await axiosInstance.get(`/api/music/artists/trending?limit=${limit}`);
  return response.data;
};

export const getArtistProfile = async (artistId: string) => {
  const response = await axiosInstance.get(`/api/music/artists/${artistId}`);
  return response.data;
};

// Follow Artists
export const getFollowedArtists = async () => {
  const response = await axiosInstance.get('/api/music/followed');
  return response.data;
};

export const followArtist = async (artist: any) => {
  const response = await axiosInstance.post('/api/music/follow', { artist });
  return response.data;
};

export const unfollowArtist = async (artistId: string) => {
  const response = await axiosInstance.delete(`/api/music/follow/${artistId}`);
  return response.data;
};
