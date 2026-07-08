import axiosClient from '../api/axiosClient';

export const userService = {
  updateProfile: async (data: { name?: string; address?: string }) => {
    const response = await axiosClient.put('/users/profile', data);
    return response.data;
  },
};
