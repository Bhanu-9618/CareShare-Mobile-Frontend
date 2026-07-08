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
}

export const commonService = {
  updateProfile: async (data: { name?: string; address?: string }) => {
    const response = await axiosClient.put('/users/profile', data);
    return response.data;
  },

  expireDonations: async () => {
    const response = await axiosClient.post('/receiver/donations/expire');
    return response.data;
  },

  getHistory: async (): Promise<Donation[]> => {
    try {
      const response = await axiosClient.get('/donations/history');
      console.log("RAW HISTORY RESPONSE: ", response.data);
      return response.data;
    } catch (error) {
      console.error("HISTORY API ERROR: ", error);
      throw error;
    }
  },

  getExpiredDonations: async (): Promise<Donation[]> => {
    try {
      const response = await axiosClient.get('/donations/expired');
      console.log("RAW EXPIRED RESPONSE: ", response.data);
      return response.data;
    } catch (error) {
      console.error("EXPIRED API ERROR: ", error);
      throw error;
    }
  }
};
