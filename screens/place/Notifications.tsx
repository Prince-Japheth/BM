import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export default function NotificationScreen() {
  const notifications = [
    {
      id: 1,
      title: 'System Maintenance',
      message: 'Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Ut sem nulla pharetra diam sit amet nisl suscipit. Mus mauris vitae ultricies leo integer malesuada nunc.',
    },
    {
      id: 2,
      title: 'System Maintenance',
      message: 'Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Ut sem nulla pharetra diam sit amet nisl suscipit. Mus mauris vitae ultricies leo integer malesuada nunc.',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
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
});