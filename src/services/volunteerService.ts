import axiosClient from '../api/axiosClient';
import { commonService, Donation } from './commonService';

export const volunteerService = {
  getFeed: async (): Promise<Donation[]> => {
    // 1. Force backend to expire old donations first
    try {
      await commonService.expireDonations();
    } catch (e) {
      console.warn("Failed to expire donations in volunteer feed:", e);
    }

    // 2. Fetch the fresh feed
    try {
      const response = await axiosClient.get('/volunteer/feed');
      return response.data;
    } catch (error) {
      console.error("VOLUNTEER FEED API ERROR: ", error);
      throw error;
    }
  },

  claimDonation: async (donationId: string) => {
    const response = await axiosClient.post(`/volunteer/donations/${donationId}/claim`);
    return response.data;
  },

  getOngoingTasks: async (): Promise<Donation[]> => {
    try {
      const response = await axiosClient.get('/volunteer/tasks/ongoing');
      return response.data;
    } catch (error) {
      console.error("ONGOING TASKS API ERROR: ", error);
      throw error;
    }
  }
};
