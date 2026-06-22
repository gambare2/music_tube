import axiosInstance from '../services/axiosInstance';

export const loginUser = async (credentials: any) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (formData: FormData) => {
  const response = await axiosInstance.post('/auth/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await axiosInstance.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (payload: any) => {
  const response = await axiosInstance.post('/auth/reset-password', payload);
  return response.data;
};

export const getProfile = async () => {
  const response = await axiosInstance.get('/auth/profile');
  return response.data;
};

export const updateFavoriteGenres = async (genres: string[]) => {
  const response = await axiosInstance.put('/api/music/preferences', { genres });
  return response.data;
};
