import { useState, useEffect } from 'react';
import { ToastAndroid, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/apiService';

export const useFetchSecurityData = (endpoint, maxRetries = 3, retryDelay = 1000, refreshTrigger = 0) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    let timeoutId;

    const showToast = (message) => {
      if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.LONG);
      } else {
        Alert.alert('Notification', message);
      }
    };

    const fetchWithRetry = async () => {
      try {
        const storedMerchantId = await AsyncStorage.getItem('merchantId');
        const token = await AsyncStorage.getItem('accessToken');

        if (!storedMerchantId || !token) {
          throw new Error('Required credentials not found');
        }

        const response = await api.get(`/merchants/${storedMerchantId}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.data && mounted) {
          setData(response.data.data);
          setLoading(false);
        } else {
          throw new Error('Invalid response format from API');
        }
      } catch (err) {
        console.error(`Attempt ${retryCount + 1} failed for ${endpoint}:`, err);

        if (err.message === 'Network Error') {
          showToast('Network Error: Please check your internet connection and try again.');
        }

        if (retryCount < maxRetries) {
          retryCount++;
          const delay = retryDelay * Math.pow(2, retryCount - 1);
          timeoutId = setTimeout(fetchWithRetry, delay);
        } else if (mounted) {
          setLoading(true);
          retryCount = 0;
          timeoutId = setTimeout(fetchWithRetry, retryDelay);
        }
      }
    };

    fetchWithRetry();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [endpoint, maxRetries, retryDelay, refreshTrigger]); // Added refreshTrigger to dependencies

  return { data, loading };
};