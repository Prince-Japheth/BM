import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Wallet, BrifecaseTick } from 'iconsax-react-native';
import { formatValue } from '../../utils/securityFormatters';

export const DashboardCards = ({ totalEarnings, completedJobs, onWithdraw, onViewCompletedJobs }) => (
  <View style={styles.cardsContainer}>
    <View style={styles.card}>
      <View style={styles.cardIcon}>
        <Wallet size={24} color="#3B125A" variant="Linear" />
      </View>
      <Text style={styles.cardValue}>{totalEarnings !== null ? formatValue(totalEarnings) : 'N/A'}</Text>
      <TouchableOpacity style={styles.withdrawButton} onPress={onWithdraw}>
        <Text style={styles.withdrawText}>Withdraw</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={styles.cardIcon}>
          <BrifecaseTick size={24} color="#3B125A" variant="Linear" />
        </View>
        <Text style={[styles.cardLabel, { textAlign: 'start' }]}>
          Completed{'\n'}Jobs
        </Text>
      </View>
      <Text style={styles.cardValue}>{completedJobs}</Text>
      <TouchableOpacity style={styles.withdrawButton} onPress={onViewCompletedJobs}>
        <Text style={styles.withdrawText}>View</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  cardsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  card: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f1e1ff',
    borderRadius: 20,
    gap: 8,
  },
  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#e7caff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardValue: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 'auto',
    color: '#3B125A',
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
  },
  withdrawButton: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#3B125A',
    paddingVertical: 8,
    alignItems: 'center',
  },
  withdrawText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

