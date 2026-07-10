import axiosClient from '../api/axiosClient';
import { commonService, Donation } from './commonService';

export const receiverService = {
  getLiveFeed: async (): Promise<Donation[]> => {
    try {
      await commonService.expireDonations();
    } catch (e) {
    }

    try {
      const response = await axiosClient.get('/receiver/live-feed');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  requestDonation: async (donationId: string) => {
    const response = await axiosClient.post(`/receiver/donations/${donationId}/request`);
    return response.data;
  },

  getPendingRequests: async (): Promise<Donation[]> => {
    try {
      const response = await axiosClient.get('/receiver/requests/pending');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getReceiverHub: async (): Promise<Donation[]> => {
    try {
      const response = await axiosClient.get('/receiver/hub');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
