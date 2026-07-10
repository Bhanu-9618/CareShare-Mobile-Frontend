import axiosClient from '../api/axiosClient';
import { commonService, Donation } from './commonService';

export const volunteerService = {
  getFeed: async (): Promise<Donation[]> => {
    try {
      await commonService.expireDonations();
    } catch (e) {
    }

    try {
      const response = await axiosClient.get('/volunteer/feed');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  claimDonation: async (donationId: string) => {
    const response = await axiosClient.post(`/volunteer/donations/${donationId}/claim`);
    return response.data;
  },

  unclaimDonation: async (donationId: string) => {
    const response = await axiosClient.put(`/volunteer/donations/${donationId}/unclaim`);
    return response.data;
  },

  getOngoingTasks: async (): Promise<Donation[]> => {
    try {
      const response = await axiosClient.get('/volunteer/tasks/ongoing');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  pickupDonation: async (taskId: string) => {
    const response = await axiosClient.post(`/volunteer/tasks/${taskId}/pickup`);
    return response.data;
  },

  getInventory: async (): Promise<Donation[]> => {
    try {
      const response = await axiosClient.get('/volunteer/inventory');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  cancelRequest: async (donationId: string) => {
    const response = await axiosClient.post(`/volunteer/donations/${donationId}/cancel`);
    return response.data;
  },

  confirmRequest: async (donationId: string) => {
    const response = await axiosClient.post(`/volunteer/inventory/${donationId}/confirm-request`);
    return response.data;
  },

  deliverDonation: async (donationId: string, otp: string) => {
    const response = await axiosClient.post(`/volunteer/inventory/${donationId}/deliver`, { otp });
    return response.data;
  }
};
