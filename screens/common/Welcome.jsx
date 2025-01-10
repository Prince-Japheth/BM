// C:\Users\USER\Documents\bondyt-merchant-app\screens\common\Welcome.jsx
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/apiService';
import { refreshToken as refreshTokenService } from '../../api/auth';

const Logger = {
  log: (context, message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`(${timestamp}) [${context}] ${message}`, data ? data : '');
  },
  error: (context, message, error = null) => {
    const timestamp = new Date().toISOString();
    console.error(`(${timestamp}) [${context}] ERROR - ${message}`, error ? error : '');
  }
};

const GradientText = ({ style, children }) => (
  <MaskedView maskElement={<Text style={style}>{children}</Text>}>
    <LinearGradient
      colors={['#AD52F7', '#CD8DFE']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={[style, { opacity: 0 }]}>{children}</Text>
    </LinearGradient>
  </MaskedView>
);

const handleServiceBasedNavigation = (navigation, services) => {
  Logger.log('NAVIGATION', 'Handling service-based navigation', { services });

  if (!services || services.length === 0) {
    Logger.log('NAVIGATION', 'No services found, navigating to SelectService');
    navigation.navigate('SelectService');
    return;
  }

  const serviceNavigationMap = {
    security: { name: 'SecurityTabNavigator', screen: 'SecurityDashboard' },
    store: { name: 'StoreTabNavigator', screen: 'StoreDashboard' },
    place: { name: 'PlaceTabNavigator', screen: 'PlaceDashboard' },
    event: { name: 'EventsTabNavigator', screen: 'EventDashboard' },
    books: { name: 'BooksTabNavigator', screen: 'BookDashboard' }
  };

  // Find the first matching service in the priority order
  const priorityOrder = ['security', 'store', 'place', 'event', 'books'];
  const primaryService = priorityOrder.find(service => services.includes(service));

  if (primaryService && serviceNavigationMap[primaryService]) {
    Logger.log('NAVIGATION', `Navigating to ${primaryService} dashboard`, {
      service: primaryService,
      route: serviceNavigationMap[primaryService]
    });

    navigation.reset({
      index: 0,
      routes: [{
        name: serviceNavigationMap[primaryService].name,
        params: { screen: serviceNavigationMap[primaryService].screen }
      }],
    });
  } else {
    Logger.log('NAVIGATION', 'No matching service found, navigating to SelectService');
    navigation.navigate('SelectService');
  }
};

export default function Welcome() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      Logger.log('AUTH_FLOW', 'Starting authentication check');

      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');

        if (!accessToken) {
          Logger.log('AUTH_FLOW', 'No access token found');
          setIsLoading(false);
          return;
        }

        Logger.log('AUTH_FLOW', 'Access token found', { tokenLength: accessToken.length });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
          const profileResponse = await api.get('/auth/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
            validateStatus: status => status >= 200 && status < 500
          });

          clearTimeout(timeoutId);

          Logger.log('API_RESPONSE', 'Profile data received', {
            status: profileResponse.status,
            dataReceived: !!profileResponse.data
          });

          if (profileResponse.status === 403) {
            Logger.log('AUTH_FLOW', 'Token expired or invalid, checking refresh status', {
              status: profileResponse.status,
              statusText: profileResponse.statusText
            });

            const hasAttemptedRefresh = await AsyncStorage.getItem('hasAttemptedRefresh');

            if (!hasAttemptedRefresh && storedRefreshToken) {
              Logger.log('AUTH_FLOW', 'Attempting token refresh', {
                hasRefreshToken: !!storedRefreshToken
              });

              await AsyncStorage.setItem('hasAttemptedRefresh', 'true');

              try {
                const result = await refreshTokenService();
                if (result?.accessToken) {
                  Logger.log('AUTH_FLOW', 'Token refresh successful', {
                    hasNewAccessToken: !!result.accessToken,
                    hasNewRefreshToken: !!result.refreshToken
                  });
                  await AsyncStorage.removeItem('hasAttemptedRefresh');
                  // Only try auth check once more after refresh
                  const newProfileResponse = await api.get('/auth/me');
                  if (newProfileResponse.data?.data) {
                    handleServiceBasedNavigation(navigation, newProfileResponse.data.data.services);
                    return;
                  }
                }
              } catch (refreshError) {
                Logger.error('AUTH_FLOW', 'Token refresh failed', {
                  error: refreshError.message,
                  status: refreshError.response?.status
                });
                await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'hasAttemptedRefresh']);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'SignInChoice' }],
                });
                return;
              }
            }

            // If we reach here, refresh failed or wasn't attempted
            await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'hasAttemptedRefresh']);
            setIsLoading(false);
            return;
          }

          if (profileResponse.data?.data) {
            handleServiceBasedNavigation(navigation, profileResponse.data.data.services);
          }
        } catch (error) {
          clearTimeout(timeoutId);
          handleAuthError(error, true);
        }
      } catch (error) {
        Logger.error('AUTH_FLOW', 'General authentication error', error);
        handleAuthError(error, true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [navigation]);

  const handleAuthError = (error, shouldShowError = false) => {
    Logger.error('ERROR_HANDLER', 'Processing authentication error', {
      errorType: error.constructor.name,
      message: error.message,
      status: error.response?.status
    });

    if (shouldShowError && (!error.response || error.response.status !== 403)) {
      const errorMessage = error.response?.data?.message ||
        'Unable to connect to the server. Please check your internet connection.';

      Alert.alert(
        'Connection Error',
        errorMessage,
        [
          {
            text: 'OK',
            onPress: () => BackHandler.exitApp()
          }
        ]
      );
    }
  };

  // Test the refresh flow
  const testRefresh = async () => {
    try {
      const result = await refreshToken();
      console.log('Token refresh successful:', result);
    } catch (error) {
      console.error('Token refresh failed:', error.message);
    }
  };

  const handleGetStarted = () => {
    Logger.log('NAVIGATION', 'User pressed Get Started, navigating to SignUp');
    navigation.navigate('SignUp');
  };

  if (isLoading) {
    Logger.log('UI_STATE', 'Rendering loading state');
    return (
      <View style={styles.container}>
        <Image
          source={require('../../assets/appicon.png')}
          style={{
            width: 170, // Set width of the image
            height: 170, // Set height of the image
            borderRadius: 20, // Rounded corners
          }}
        />
      </View>
    );
  }

  Logger.log('UI_STATE', 'Rendering welcome screen');
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Image
        source={require('../../assets/cuate.png')}
        style={styles.illustration}
        contentFit="contain"
      />

      <GradientText style={styles.title}>Merchant app</GradientText>

      <Text style={styles.subtitle}>
        Bring your business to Boyant customers
      </Text>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleGetStarted}
      >
        <LinearGradient
          colors={['#AD52F7', '#CD8DFE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Get started</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity
          onPress={() => {
            Logger.log('NAVIGATION', 'User pressed Sign In, navigating to SignInChoice');
            navigation.navigate('SignInChoice');
          }}
        >
          <GradientText style={styles.loginLink}>Signin</GradientText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  illustration: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
  },
  loginLink: {
    fontWeight: 'bold',
  },
});