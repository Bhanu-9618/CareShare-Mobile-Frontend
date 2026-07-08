import axiosClient from '../api/axiosClient';
import { commonService, Donation } from './commonService';

export const donorService = {
  getDonations: async (): Promise<Donation[]> => {
    // 1. Force backend to expire old donations
    try {
      await commonService.expireDonations();
    } catch (e) {
      console.warn("Failed to expire donations:", e);
      // We catch this so it doesn't break the whole app if expire endpoint has a hiccup
    }
    
    // 2. Fetch the fresh list
    const response = await axiosClient.get('/donor/donations/all');
    return response.data;
  },

  postDonation: async (data: { foodName: string; quantity: string; location: string; expiryTime: string; imageKey: string }) => {
    const response = await axiosClient.post('/donor/donations', data);
    return response.data;
  }
};
