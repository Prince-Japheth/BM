// C:\Users\USER\Documents\bondyt-merchant-app\screens\common\Notifications.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/apiService';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const storedMerchantId = await AsyncStorage.getItem('merchantId');
        const token = await AsyncStorage.getItem('accessToken');

        if (!storedMerchantId || !token) {
          throw new Error('Required credentials not found');
        }

        const response = await api.get(`/merchants/${storedMerchantId}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            isRead: 'false',
            limit: 10,
            page: 1,
          },
        });

        if (response.status === 200 && response.data) {
          setNotifications(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      {loading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#A66FE5" />
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {notifications.map((notification) => (
            <View key={notification.id} style={styles.notificationCard}>
              <Feather name="mail" size={24} color="#3B125A" />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{notification.title}</Text>
                <Text style={styles.message}>{notification.message}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  notificationCard: {
    backgroundColor: '#f8e6ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#3B125A',
  },
  message: {
    fontSize: 14,
    color: '#595757',
    lineHeight: 20,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
