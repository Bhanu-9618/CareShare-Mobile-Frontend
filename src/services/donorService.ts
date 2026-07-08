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

export const donorService = {
  getDonations: async (): Promise<Donation[]> => {
    // 1. Force backend to expire old donations
    try {
      await axiosClient.post('/receiver/donations/expire');
    } catch (e) {
      console.warn("Failed to expire donations:", e);
      // We catch this so it doesn't break the whole app if expire endpoint has a hiccup
    }
    
    // 2. Fetch the fresh list
    const response = await axiosClient.get('/donor/donations/all');
    return response.data;
  },

  postDonation: async (data: any) => {
    // const response = await axiosClient.post('/donations', data);
    // return response.data;
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
