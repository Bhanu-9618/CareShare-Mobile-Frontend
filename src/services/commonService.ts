import axiosClient from '../api/axiosClient';

export interface Donation {
  donationId: string;
  donorId: string;
  foodName: string;
  quantity: string;
  location: string;
  status: string;
  createdAt: string;
  expiryAt: number;
  imageKey: string;
  imageUrl: string;
  generated_otp?: string;
}

export const commonService = {
  updateProfile: async (data: { name?: string; address?: string }) => {
    const response = await axiosClient.put('/users/profile', data);
    return response.data;
  },

  getUploadUrl: async (filename: string) => {
    const response = await axiosClient.get(`/upload-url?filename=${encodeURIComponent(filename)}`);
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosClient.get('/users/profile');
    return response.data;
  },

  expireDonations: async () => {
    const response = await axiosClient.post('/receiver/donations/expire');
    return response.data;
  },

  getHistory: async (): Promise<Donation[]> => {
    try {
      const response = await axiosClient.get('/donations/history');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getExpiredDonations: async (): Promise<Donation[]> => {
    try {
      const response = await axiosClient.get('/donations/expired');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
