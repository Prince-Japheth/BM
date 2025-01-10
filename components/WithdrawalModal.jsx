import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { Bank, Paypal } from 'iconsax-react-native';

const PaymentOption = ({ title, description, onPress, Icon }) => (
  <TouchableOpacity style={styles.paymentOption} onPress={onPress}>
    <Icon size={24} color="#000" style={styles.icon} />
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  </TouchableOpacity>
);

const WithdrawalModal = ({ isVisible, onClose }) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('options');

  const transactions = [
    { time: 'Today 2:20', amount: '$20', status: 'Approved' },
    { time: 'Today 2:20', amount: '$20', status: 'Pending' },
    { time: 'Today 2:20', amount: '$20', status: 'Failed' },
  ];

  // Function to get status color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return '#5B3F9C'; // Dark purple for approved
      case 'Pending':
      case 'Failed':
        return '#E0C3E8'; // Light purple for pending and failed
      default:
        return '#ccc'; // Default color
    }
  };

  // Function to get status text color based on status
  const getStatusTextColor = (status) => {
    switch (status) {
      case 'Approved':
        return '#FFFFFF'; // White text for approved
      case 'Pending':
      case 'Failed':
        return '#3B125A'; // Dark purple for pending and failed text
      default:
        return '#000'; // Default text color
    }
  };

  const renderContent = () => {
    if (activeTab === 'options') {
      return (
        <View style={styles.paymentOptionsContainer}>
          <PaymentOption
            Icon={Bank}
            title="Withdraw to local currency"
            description="Withdraw to a bank"
            onPress={() => navigation.navigate('BankSetupScreen')}
          />
          <PaymentOption
            Icon={Paypal}
            title="Withdrawal to PayPal"
            description="Withdraw to PayPal wallet"
            onPress={() => navigation.navigate('PaypalPay')}
          />
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollableContent}>
        {transactions.map((transaction, index) => (
          <View key={index} style={styles.transactionContainer}>
            <View style={styles.timeAmountContainer}>
              <Text style={styles.timeText}>{transaction.time}</Text>
              <Text style={styles.amountText}>{transaction.amount}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.statusButton, { backgroundColor: getStatusColor(transaction.status) }]}>
              <Text style={[styles.statusText, { color: getStatusTextColor(transaction.status) }]}>
                {transaction.status}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        {/* Modal Handle */}
        <View style={styles.modalHandle} />

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('options')}
          >
            <Text style={[styles.tabText, activeTab === 'options' && styles.activeTabText]}>
              Withdrawal Options
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
              Withdrawal History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {renderContent()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    height: 400, // Fixed height for the modal
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    marginBottom: 15,
    alignSelf: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabText: {
    color: '#aaa',
    fontSize: 16,
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  paymentOptionsContainer: {
    marginTop: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#888',
  },
  scrollableContent: {
    flex: 1,
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  timeAmountContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  timeText: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  statusText: {
    fontWeight: 'bold',
  },
});

export default WithdrawalModal;