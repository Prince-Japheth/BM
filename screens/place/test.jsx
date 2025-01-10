import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Switch,
    ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft2, Instagram } from 'iconsax-react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/apiService';

export default function ViewPlaceListing({ navigation, route }) {
    const { placeId } = route.params;
    const [placeDetails, setPlaceDetails] = useState(null);
    const [isEnabled, setIsEnabled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [previousState, setPreviousState] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchPlaceDetails = async () => {
        try {
            const storedMerchantId = await AsyncStorage.getItem('merchantId');
            if (storedMerchantId) {
                const response = await api.get(`/merchants/${storedMerchantId}/places/${placeId}`);
                if (response.status === 200) {
                    setPlaceDetails(response.data.data);
                    setIsEnabled(response.data.data.isReservationEnables || false);
                    setPreviousState(response.data.data.isReservationEnables || false);
                }
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
            setErrorMessage('Failed to load place details');
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPlaceDetails(); // Refresh the data when the screen is focused
        }, [placeId])
    );

    const handleDelete = async () => {
        console.log('Starting delete process for placeId:', placeId);
        setIsDeleting(true);
        try {
            const storedMerchantId = await AsyncStorage.getItem('merchantId');
            console.log('Retrieved merchantId:', storedMerchantId);

            if (!storedMerchantId) {
                throw new Error('Merchant ID not found');
            }

            const response = await api.delete(`/merchants/${storedMerchantId}/places/${placeId}`);
            console.log('Delete response:', response.data);

            if (response.status === 200) {
                console.log('Place deleted successfully');
                navigation.goBack();
            } else {
                throw new Error('Failed to delete place');
            }
        } catch (error) {
            console.error('Error deleting place:', error);
            setErrorMessage('Failed to delete place. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const updateReservationStatus = async (newStatus) => {
        dismissError();
        console.log('Updating reservation status...');

        try {
            const storedMerchantId = await AsyncStorage.getItem('merchantId');
            console.log('Stored Merchant ID:', storedMerchantId);

            if (storedMerchantId) {
                const response = await api.patch(
                    `/merchants/${storedMerchantId}/places/${placeId}`,
                    { isReservationEnables: newStatus }
                );
                console.log('API Response:', response);

                if (response.status === 200) {
                    console.log('Reservation status updated successfully');
                    console.log('New Status:', newStatus);
                } else {
                    console.log('Failed to update reservation status. Response status:', response.status);
                    setErrorMessage('Failed to update reservation status.');
                    setIsEnabled(previousState);
                }
            } else {
                console.log('No merchantId found in AsyncStorage.');
            }
        } catch (error) {
            console.error('Error updating reservation status:', error);
            setErrorMessage('An error occurred while updating the reservation status.');
            setIsEnabled(previousState);
        }
    };

    const toggleSwitch = () => {
        const newState = !isEnabled;
        setIsEnabled(newState);
        updateReservationStatus(newState);
    };

    const dismissError = () => {
        setErrorMessage('');
    };

    if (!placeDetails) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#AD52F7" />
            </View>
        );
    }

    const {
        name = 'N/A',
        location: { state = 'Unknown', country = 'Unknown' } = {},
        openingHour = 'N/A',
        closingHour = 'N/A',
        weekendOpeningHour = 'N/A',
        weekendClosingHour = 'N/A',
        description = 'No description available.',
        category = {},
        locationImages = [],
        reservationOptions = null,
        instagramLink,
        tiktokLink,
        xLink,
    } = placeDetails;

    console.log('Place details:', placeDetails);

    return (
        <ScrollView>
            {/* Your component UI */}
        </ScrollView>
    );
}
