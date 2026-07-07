import axiosClient from '../api/axiosClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await axiosClient.post('/auth/login', { email, password });
    // Assuming backend returns { IdToken: "...", AccessToken: "..." }
    const idToken = response.data.IdToken || response.data.token;
    if (idToken) {
      await AsyncStorage.setItem('userToken', idToken);
    }
    return response.data;
  },
  
  register: async (data: any) => {
    const response = await axiosClient.post('/auth/register', data);
    return response.data;
  },

  verify: async (email: string, code: string) => {
    const response = await axiosClient.post('/auth/verify', { email, code });
    return response.data;
  },
  
  logout: async () => {
    await AsyncStorage.removeItem('userToken');
  }
};
