import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Add } from 'iconsax-react-native';

export const DashboardHeader = ({ onAddOfficer }) => (
  <View style={styles.header}>
    <View>
      <Text style={styles.headerTitle}>Dashboard</Text>
    </View>
    <TouchableOpacity style={styles.ShopAddButton} onPress={onAddOfficer}>
      <Add size={20} color="#000" variant="Linear" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ShopAddButton: {
    width: 45,
    height: 45,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

