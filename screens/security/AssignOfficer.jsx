import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft2, ArrowDown2 } from 'iconsax-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/apiService';

export default function AssignOfficer() {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const route = useRoute();
  const [officers, setOfficers] = useState({
    male: [],
    female: []
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { security_booking_id, date_booking_id } = route.params;

  useEffect(() => {
    if (selectedGender) {
      console.log('Fetching officers for gender:', selectedGender);
      fetchOfficers(selectedGender.toLowerCase());
    }
  }, [selectedGender]);

  const fetchOfficers = async (gender) => {
    console.log('Fetching officers for gender:', gender);
    try {
      const storedMerchantId = await AsyncStorage.getItem('merchantId');
      console.log('Stored Merchant ID:', storedMerchantId);

      if (!storedMerchantId) {
        throw new Error('Merchant ID not found in storage.');
      }

      const token = await AsyncStorage.getItem('accessToken');
      console.log('Access Token:', token);

      if (!token) {
        throw new Error('Access token not found in storage.');
      }

      setLoading(true);
      const response = await api.get(`/merchants/${storedMerchantId}/securities/officers`, {
        params: {
          gender: gender,
          page: 1,
          limit: 50
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('API Response:', response.data);

      if (response.data && response.data.data) {
        const fetchedOfficers = response.data.data.map(officer => ({
          id: officer.id,
          name: `${officer.firstName} ${officer.lastName}`,
          image: officer.image_url ? { uri: officer.image_url } : require('../../assets/teddy.png')
        }));

        setOfficers(prev => ({
          ...prev,
          [gender]: fetchedOfficers
        }));
      }
    } catch (error) {
      console.error('Error fetching officers:', error);
      Alert.alert('Error', 'Failed to fetch officers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    console.log('handleAccept called'); // Log when the function is called

    // Check if an officer is selected
    if (!selectedOfficer) {
      console.log('No officer selected');
      return;
    }

    console.log('Submitting assignment for officer:', selectedOfficer);

    try {
      setIsSubmitting(true);
      console.log('Submitting state set to true'); // Log state change

      // Retrieve merchant ID and access token from AsyncStorage
      const merchantId = await AsyncStorage.getItem('merchantId');
      const token = await AsyncStorage.getItem('accessToken');

      console.log('Retrieved Merchant ID:', merchantId);
      console.log('Retrieved Token:', token);

      // Check for required credentials
      if (!merchantId || !token) {
        console.error('Required credentials not found'); // Log error
        throw new Error('Required credentials not found');
      }

      // Prepare the API request
      const requestBody = {
        security_booking_id: security_booking_id,
        date_booking_id: date_booking_id,
        status: 'pending',
        officers_ids: [selectedOfficer.id]
      };
      console.log('API Request Body:', requestBody);

      // Make the API call to assign the officer
      const response = await api.put(
        `/merchants/${merchantId}/securities/bookings`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('API Response:', response.data); // Log the API response

      // Check if the response indicates success
      if (response.data?.statusCode === 200) {
        console.log('Officer assigned successfully'); // Log success
        Alert.alert(
          'Success',
          'Officer assigned successfully',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('Navigating to OfficerAssigned screen'); // Log navigation
                // Pass the officer data to the OfficerAssigned screen
                navigation.reset({
                  index: 0, // Index of the screen to navigate to
                  routes: [
                    {
                      name: 'OfficerAssigned',
                      params: {
                        officer: response.data.data.assignedOfficers[0],
                        pickupLocation: response.data.data.pickup_location,
                        logistics: response.data.data.logistics,
                        scheduledDate: response.data.data.scheduled_date,
                        securityQuestion: response.data.data.security_question
                      }
                    }
                  ]
                });
              }
            }
          ]
        );
      } else {
        console.error('Unexpected response status code:', response.data?.statusCode); // Log unexpected status
      }
    } catch (error) {
      console.error('Error assigning officer:', error); // Log the error
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to assign officer. Please try again.'
      );
    } finally {
      setIsSubmitting(false); // Reset submitting state
      console.log('Submitting state set to false'); // Log state reset
    }
  };

  const handleGenderSelect = (gender) => {
    console.log('Selected gender:', gender);
    setSelectedGender(gender);
    setModalVisible(false);
  };

  const renderOfficer = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.officerItem,
        selectedOfficer?.id === item.id && styles.selectedOfficer,
      ]}
      onPress={() => setSelectedOfficer(item)}
    >
      <Image
        source={item.image}
        style={styles.officerImage}
        defaultSource={require('../../assets/teddy.png')}
      />
      <Text style={styles.officerName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assign an officer</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Gender Selection */}
      <View style={styles.content}>
        <Text style={styles.label}>Select a gender</Text>
        <TouchableOpacity
          style={styles.genderSelector}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.genderText}>
            {selectedGender || 'Select gender'}
          </Text>
          <ArrowDown2 size={20} color="#000" />
        </TouchableOpacity>

        {/* Officers List */}
        {loading ? (
          <ActivityIndicator size="large" color="#AD52F7" />
        ) : selectedGender && officers[selectedGender.toLowerCase()].length > 0 ? (
          <FlatList
            data={officers[selectedGender.toLowerCase()]}
            renderItem={renderOfficer}
            keyExtractor={(item) => item.id}
            style={styles.officersList}
          />
        ) : (
          selectedGender && <Text>No officers found for this gender.</Text>
        )}
      </View>

      {/* Bottom Sheet Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        swipeDirection={['down']}
        onSwipeComplete={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalIndicator} />
          </View>
          <TouchableOpacity
            style={styles.genderOption}
            onPress={() => handleGenderSelect('Male')}
          >
            <Text>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.genderOption}
            onPress={() => handleGenderSelect('Female')}
          >
            <Text>Female</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Done Button in Fixed Footer */}
      {selectedGender && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleAccept}
            disabled={!selectedOfficer || isSubmitting}
          >
            <LinearGradient
              colors={['#AD52F7', '#CD8DFE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.doneButton,
                (!selectedOfficer || isSubmitting) && styles.disabledButton,
              ]}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Done</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: '#666666',
    marginRight: 30, // To offset the back button and center the title
  },
  placeholder: {
    width: 24,
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  genderSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  genderText: {
    fontSize: 16,
  },
  officersList: {
    marginTop: 16,
  },
  officerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOfficer: {
    backgroundColor: '#F5F5F5',
  },
  officerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  officerName: {
    fontSize: 16,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
  },
  genderOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  doneButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  buttonText: {
    color: 'white',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
