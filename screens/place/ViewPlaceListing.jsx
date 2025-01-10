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
                    setIsEnabled(response.data.data.isReservationEnabled || false);
                    setPreviousState(response.data.data.isReservationEnabled || false);
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

    const toggleSwitch = () => {
        const newState = !isEnabled;
        setIsEnabled(newState);
        updateReservationStatus(newState);
    };

    const updateReservationStatus = async (newStatus) => {
        dismissError();
        try {
            const storedMerchantId = await AsyncStorage.getItem('merchantId');
            if (storedMerchantId) {
                const response = await api.patch(
                    `/merchants/${storedMerchantId}/places/${placeId}`,
                    { isReservationEnabled: newStatus }
                );

                if (response.status === 200) {
                    console.log('Reservation status updated successfully');
                } else {
                    setErrorMessage('Failed to update reservation status.');
                    setIsEnabled(previousState); // Revert to previous state on failure
                }
            }
        } catch (error) {
            console.error('Error updating reservation status:', error);
            setErrorMessage('An error occurred while updating the reservation status.');
            setIsEnabled(previousState); // Revert to previous state on error
        }
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
        <View style={styles.container}>
            {/* Floating error rectangle */}
            {errorMessage ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                    <TouchableOpacity onPress={dismissError} style={styles.errorCloseButton}>
                        <AntDesign name="close" size={15} color="black" />
                    </TouchableOpacity>
                </View>
            ) : null}

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Place Listing</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.productHeader}>
                    <Image source={{ uri: locationImages[0]?.image_url || '' }} style={styles.mainImage} />
                    <View style={styles.productInfo}>
                        <Text style={styles.listingName}>{name}</Text>
                        <Text style={styles.listingLocation}>{`${state}, ${country}`}</Text>
                        <Text style={styles.listingOpening}>
                            Open {openingHour || 'N/A'} - {closingHour || 'N/A'} (weekdays)
                        </Text>
                        <Text style={styles.listingOpening}>
                            Open {weekendOpeningHour || 'N/A'} - {weekendClosingHour || 'N/A'} (weekends)
                        </Text>

                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Category</Text>
                    <View style={styles.sizeContainer}>
                        <View style={styles.sizeButton}>
                            <Text style={styles.sizeText}>{category.name || 'N/A'}</Text>
                        </View>
                    </View>
                </View>

                {reservationOptions && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Reservation Options</Text>
                        <View style={styles.sizeContainer}>
                            {reservationOptions.reservationRegular && (
                                <View style={styles.sizeButton}>
                                    <Text style={styles.sizeText}>
                                        Regular
                                    </Text>
                                </View>
                            )}
                            {reservationOptions.reservationVip && (
                                <View style={styles.sizeButton}>
                                    <Text style={styles.sizeText}>
                                        VIP
                                    </Text>
                                </View>
                            )}
                            {reservationOptions.reservationVvip && (
                                <View style={styles.sizeButton}>
                                    <Text style={styles.sizeText}>
                                        VVIP
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Location Images</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
                        {locationImages.map((image, index) => (
                            <Image key={index} source={{ uri: image.image_url }} style={styles.galleryImage} />
                        ))}
                    </ScrollView>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                    <Switch
                        value={isEnabled}
                        onValueChange={toggleSwitch}
                        thumbColor={isEnabled ? 'white' : 'white'}
                        trackColor={{ false: '#767577', true: '#CD8DFE' }}
                    />
                    <Text style={{ marginRight: 10 }}> {isEnabled ? 'Switch off reservations' : 'Switch on reservations'}</Text>
                </View>

                <View style={styles.socialLinks}>
                    {instagramLink && (
                        <TouchableOpacity onPress={() => openLink(instagramLink)}>
                            <Instagram size={20} color="black" />
                        </TouchableOpacity>
                    )}
                    {tiktokLink && (
                        <TouchableOpacity onPress={() => openLink(tiktokLink)}>
                            <FontAwesome6 name="tiktok" size={20} color="black" />
                        </TouchableOpacity>
                    )}
                    {xLink && (
                        <TouchableOpacity onPress={() => openLink(xLink)}>
                            <FontAwesome6 name="x-twitter" size={20} color="black" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]}
                        onPress={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <ActivityIndicator size="small" color="red" />
                        ) : (
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => {
                            navigation.navigate('EditPlaceListing', {
                                placeDetails: placeDetails
                            });
                        }}
                    >
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // Optional, to make the background white during loading
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 16,
    },
    content: {
        flex: 1,
    },
    productHeader: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    mainImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 16,
    },
    productInfo: {
        flex: 1,
    },
    listingName: {
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 8,
    },
    listingLocation: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#595757',
    },
    listingOpening: {
        fontSize: 13,
        fontWeight: '4  00',
        marginBottom: 3,
        color: '#BCBABA',
    },
    section: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666',
    },
    sizeContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    sizeButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
    },
    sizeText: {
        color: '#666',
    },
    imageGallery: {
        flexDirection: 'row',
    },
    galleryImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 12,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        padding: 16,
    },
    deleteButton: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FEE2E2',
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#EF4444',
        fontWeight: '600',
    },
    editButton: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#000',
        fontWeight: '600',
    },
    errorContainer: {
        position: 'absolute',
        top: 100,
        left: 20,
        right: 20,
        backgroundColor: '#FFE5E5',
        borderWidth: 1,
        borderColor: '#FF0000',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1,
    },
    errorMessage: {
        color: 'red',
        fontSize: 14,
        flex: 1,
    },
    errorCloseButton: {
        paddingLeft: 10,
    },
    errorCloseText: {
        color: '#FF0000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    deleteButtonDisabled: {
        opacity: 0.7,
    },
});
