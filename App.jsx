import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import NetInfo from '@react-native-community/netinfo';
import AppNavigator from './navigation/AppNavigator';
import NoInternetModal from './components/NoInternetModal';

export default function App() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    // Initial network check
    NetInfo.fetch().then(state => {
      setIsOffline(!state.isConnected);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const handleRetryConnection = async () => {
    // Check network status again
    const networkState = await NetInfo.fetch();
    setIsOffline(!networkState.isConnected);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="white" />
      <AppNavigator />
      <NoInternetModal
        isVisible={isOffline}
        onRetry={handleRetryConnection}
      />
    </>
  );
}