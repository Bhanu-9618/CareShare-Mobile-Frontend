import axiosClient from '../api/axiosClient';
import { commonService, Donation } from './commonService';

export const donorService = {
  getDonations: async (): Promise<Donation[]> => {
    try {
      await commonService.expireDonations();
    } catch (e) {
    }
    
    const response = await axiosClient.get('/donor/donations/all');
    return response.data;
  },

  postDonation: async (data: { foodName: string; quantity: string; location: string; expiryTime: string; imageKey: string }) => {
    const response = await axiosClient.post('/donor/donations', data);
    return response.data;
  }
};
