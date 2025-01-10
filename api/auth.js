import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.AUTH_API_URL || 'https://merchant-api.bondyt.com/api/v1/auth';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  MERCHANT_ID: 'merchantId',
  TOKEN_EXPIRY: 'tokenExpiry',
};

let refreshingPromise = null;

export const refreshToken = async () => {
  if (refreshingPromise) return refreshingPromise;

  refreshingPromise = (async () => {
    try {
      const storedRefreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      // Log the request details for debugging
      console.log('[AUTH] Refresh token request:', {
        url: `${API_URL}/refresh-token`,
        refreshToken: `${storedRefreshToken.substring(0, 10)}...`, // Only log part of the token for security
      });

      const response = await fetch(`${API_URL}/refresh-token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Refresh-Token': storedRefreshToken,
        }
      });

      // Log the raw response for debugging
      console.log('[AUTH] Raw response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status} ${response.statusText}\nResponse: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('[AUTH] Response data:', responseData); // Log the parsed response

      if (!responseData || !responseData.data) {
        throw new Error('Invalid response format: missing data object');
      }

      const {
        data: {
          accessToken,
          accessTokenExpiresIn,
          accessTokenExpiry,
          accessTokenExpiresAt,
          accessTokenType,
        }
      } = responseData;

      const newRefreshToken = response.headers.get('x-refresh-token');

      // Validate all required fields
      if (!accessToken) throw new Error('Missing accessToken in response');
      if (!newRefreshToken) throw new Error('Missing x-refresh-token in response headers');

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken],
        [STORAGE_KEYS.TOKEN_EXPIRY, accessTokenExpiresAt?.toString() || (Date.now() + 3600000).toString()],
      ]);

      return {
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiresIn,
        accessTokenExpiry,
        accessTokenExpiresAt,
        accessTokenType,
      };

    } catch (error) {
      // Enhanced error logging
      console.error('[AUTH] Refresh token error:', {
        message: error.message,
        status: error.response?.status || error.status,
        statusText: error.response?.statusText || error.statusText,
        data: error.response?.data || error.data,
        stack: error.stack,
      });
      throw error;
    } finally {
      refreshingPromise = null;
    }
  })();

  return refreshingPromise;
};

// Logout function
export const logout = async () => {
  try {
    const accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (accessToken) {
      await axios.get(`${API_URL}/logout`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    }
  } catch (error) {
    console.error('Error during logout:', error);
    throw new Error(error.response?.data?.message || 'Failed to log out');
  } finally {
    await clearAuthData();
  }
};


// Clear auth data
export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw new Error('Failed to clear authentication data');
  }
};
