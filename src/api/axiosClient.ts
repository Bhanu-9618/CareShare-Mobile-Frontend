import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';
import { DeviceEventEmitter } from 'react-native';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {

    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {

      await AsyncStorage.removeItem('userToken');
      DeviceEventEmitter.emit('auth_error');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
