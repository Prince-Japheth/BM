// File: src/components/place/DashboardCards.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wallet } from 'iconsax-react-native';

const formatValue = (value) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
};

export const DashboardCards = ({ totalEarnings, onWithdraw }) => {
    return (
        <View style={styles.cardsContainer}>
            <View style={styles.card}>
                <View style={styles.cardIcon}>
                    <Wallet size={24} color="#3B125A" variant="Linear" />
                </View>
                <Text style={styles.cardValue}>{formatValue(totalEarnings)}</Text>
                <TouchableOpacity style={styles.withdrawButton} onPress={onWithdraw}>
                    <Text style={styles.withdrawText}>Withdraw</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

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