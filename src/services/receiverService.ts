import axiosClient from '../api/axiosClient';
import { commonService, Donation } from './commonService';

export const receiverService = {
  getLiveFeed: async (): Promise<Donation[]> => {
    // 1. Force backend to cleanly expire old donations first
    try {
      await commonService.expireDonations();
    } catch (e) {
      console.warn("Failed to expire donations in receiver feed:", e);
    }

    // 2. Fetch the fresh live feed
    try {
      const response = await axiosClient.get('/receiver/live-feed');
      return response.data;
    } catch (error) {
      console.error("RECEIVER LIVE FEED API ERROR: ", error);
      throw error;
    }
  }
};
