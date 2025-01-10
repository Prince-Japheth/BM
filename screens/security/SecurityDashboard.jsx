// C:\Users\USER\Documents\bondyt-merchant-app\screens\security\SecurityDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  ToastAndroid, // Import ToastAndroid for Android toast messages
  Platform, // Import Platform to handle iOS
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Add, TickCircle } from 'iconsax-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WithdrawalModal from '../../components/WithdrawalModal';
import WhatsappButton from '../../components/WhatsappButton';
import { useFetchSecurityData } from '../../hooks/useFetchSecurityData';
import { DashboardHeader } from '../../components/security/DashboardHeader';
import { DashboardCards } from '../../components/security/DashboardCards';
import { SecurityRequestList } from '../../components/security/SecurityRequestList';
import { SetPriceModal } from '../../components/security/SetPriceModal';
import api from '../../api/apiService';

export default function SecurityDashboard() {
  const navigation = useNavigation();
  const [isApproved, setIsApproved] = useState(null);
  const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false);
  const [isSetPriceVisible, setIsSetPriceVisible] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [assignedFilter, setAssignedFilter] = useState('pending');
  const [showRequest, setShowRequest] = useState(false);
  const [isWithdrawalModalVisible, setIsWithdrawalModalVisible] = useState(false);
  const [isSettingPrice, setIsSettingPrice] = useState(false);
  const [priceSetupComplete, setPriceSetupComplete] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);


  const { data: walletData, loading: walletLoading } = useFetchSecurityData('/wallets');
  const { data: basePriceData, loading: basePriceLoading } = useFetchSecurityData('/base-price');
  const { 
    data: securityRequests, 
    loading: requestsLoading, 
    error: requestsError,
    refetch: refetchSecurityRequests 
  } = useFetchSecurityData('/securities/bookings', refreshKey);
  
  
  const refreshSecurityRequests = async () => {
    try {
      setRefreshKey(prev => prev + 1);
      await refetchSecurityRequests();
    } catch (error) {
      console.error('Error refreshing security requests:', error);
      Alert.alert('Error', 'Failed to refresh security requests');
    }
  };

  // Toast message function
  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Success', message);
    }
  };

  useEffect(() => {
    const fetchApprovalStatus = async () => {
      try {
        const approvalStatus = await AsyncStorage.getItem('isApproved');
        if (approvalStatus !== null) {
          setIsApproved(approvalStatus === 'true');
        }
      } catch (error) {
        console.error('Error retrieving approval status:', error);
      }
    };
    fetchApprovalStatus();
  }, []);

  const filteredRequests = useMemo(() => {
    if (!securityRequests) return [];
    return securityRequests.filter(request => request.request_status === assignedFilter);
  }, [assignedFilter, securityRequests]);

  const counts = useMemo(() => {
    if (!securityRequests) return { all: 0, completed: 0, rejected: 0, pending: 0 };
    return {
      all: securityRequests.length,
      completed: securityRequests.filter(req => req.request_status === 'completed').length,
      rejected: securityRequests.filter(req => req.request_status === 'rejected').length,
      pending: securityRequests.filter(req => req.request_status === 'pending').length,
    };
  }, [securityRequests]);

  const handleAddOfficer = () => {
    if (!isApproved) {
      setIsVerificationModalVisible(true);
    } else {
      navigation.navigate('AddSecurityOfficer');
    }
  };

  const handleViewRequest = (date_booking_id) => {
    navigation.navigate('SecurityRequest', { date_booking_id });
  };

  const handleViewAssignedRequest = (date_booking_id) => {
    navigation.navigate('AssignedSecurityRequest', { date_booking_id });
  };

  const handleSetPrice = async () => {
    try {
      setIsSettingPrice(true);
      const storedMerchantId = await AsyncStorage.getItem('merchantId');
      const token = await AsyncStorage.getItem('accessToken');

      if (!storedMerchantId || !token) {
        throw new Error('Merchant ID or Access token not found in storage.');
      }

      const requestBody = { newPrice: parseFloat(newPrice) };
      const response = await api.patch(`/merchants/${storedMerchantId}/securities`, requestBody, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      showToast(response.data.message);
      setPriceSetupComplete(true);
      setIsSetPriceVisible(false);
      setNewPrice('');
    } catch (error) {
      console.error('Error setting price:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to set price');
    } finally {
      setIsSettingPrice(false);
    }
  };

  const toggleWithdrawalModal = () => {
    setIsWithdrawalModalVisible(!isWithdrawalModalVisible);
  };

  const renderContent = () => {
    if (walletLoading || basePriceLoading || requestsLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#AD52F7" />
        </View>
      );
    }

    // Show SetPriceModal only if price hasn't been set and setup isn't complete
    if ((!basePriceData?.base_price || basePriceData.base_price <= 0) && !priceSetupComplete) {
      return (
        <SetPriceModal
          isVisible={isSetPriceVisible}
          newPrice={newPrice}
          setNewPrice={setNewPrice}
          onSetPrice={handleSetPrice}
          onToggleVisibility={() => setIsSetPriceVisible(!isSetPriceVisible)}
          isSettingPrice={isSettingPrice}
        />
      );
    }

    // If no security requests and price is set, show add security officers screen
    if (!securityRequests || securityRequests.length === 0) {
      return (
        <TouchableOpacity
          style={styles.addSecurityOfficersContainer}
          onPress={handleAddOfficer}
        >
          <Image
            source={require('../../assets/add.png')}
            style={styles.illustration}
            contentFit="contain"
          />
          <Text style={{
            color: '#AD52F7',
            marginTop: 10,
            alignSelf: 'center',
            fontWeight: '500'
          }}>
            Add security officer
          </Text>
        </TouchableOpacity>
      );
    }

    // Show security requests list
    return (
      <>
        <View style={styles.catalogHeader}>
          <TouchableOpacity onPress={() => setShowRequest(false)}>
            <Text
              style={[
                styles.sectionTitle,
                !showRequest && styles.sectionTitleActive,
              ]}
            >
              Security Request
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowRequest(true)}>
            <Text
              style={[
                styles.sectionTitle,
                showRequest && styles.sectionTitleActive,
              ]}
            >
              Assigned Orders
            </Text>
          </TouchableOpacity>
        </View>
        <SecurityRequestList
          showRequest={showRequest}
          securityRequests={securityRequests}
          filteredRequests={filteredRequests}
          counts={counts}
          assignedFilter={assignedFilter}
          setAssignedFilter={setAssignedFilter}
          handleViewRequest={handleViewRequest}
          handleViewAssignedRequest={handleViewAssignedRequest}
          onRefresh={refreshSecurityRequests}
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <DashboardHeader onAddOfficer={handleAddOfficer} />
      {!isApproved && (
        <View style={styles.verificationTextContainer}>
          <Text style={styles.verificationText}>
            Your document is being verified. This process usually takes a...
          </Text>
        </View>
      )}
      <ScrollView style={styles.content}>
        <DashboardCards
          totalEarnings={walletData?.balance}
          completedJobs={counts.completed}
          onWithdraw={toggleWithdrawalModal}
          onViewCompletedJobs={() => navigation.navigate('CompletedJobs')}
        />
        {renderContent()}
      </ScrollView>
      <Modal
        visible={isVerificationModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVerificationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setIsVerificationModalVisible(false)}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <Image
              source={require('../../assets/bro.png')}
              style={styles.illustration}
              contentFit="contain"
            />
            <Text style={styles.modalTitle}>Oops</Text>
            <Text style={styles.modalMessage}>
              You can't add security officers until your account has been verified.
            </Text>
          </View>
        </View>
      </Modal>
      <WithdrawalModal
        isVisible={isWithdrawalModalVisible}
        onClose={toggleWithdrawalModal}
      />
      <WhatsappButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  verificationTextContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  verificationText: {
    marginHorizontal: 20,
    fontSize: 11,
    paddingVertical: 10,
    color: '#FA9316',
    backgroundColor: '#FFF0DE',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  addSecurityOfficersContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 70,
  },
  illustration: {
    alignSelf: 'center',
  },
  catalogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitleActive: {
    fontSize: 16,
    fontWeight: '500',
    color: '#161616',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#868686',
  },
  closeModalButton: {
    marginLeft: 'auto',
  },
});

