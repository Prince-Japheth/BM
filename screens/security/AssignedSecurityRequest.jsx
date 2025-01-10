import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft2 } from 'iconsax-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/apiService';

export default function SecurityRequest() {
    const navigation = useNavigation();
    const route = useRoute();
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState(null);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchBookingDetails();
    }, []);

    const fetchBookingDetails = async () => {
        try {
            const merchantId = await AsyncStorage.getItem('merchantId');
            if (!merchantId) {
                throw new Error('Merchant ID not found');
            }

            const dateBookingId = route.params?.date_booking_id;
            if (!dateBookingId) {
                throw new Error('Booking ID not provided');
            }

            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Access token not found');
            }

            const response = await api.get(`/merchants/${merchantId}/securities/bookings/${dateBookingId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const bookingDetails = response.data?.data;
            if (!bookingDetails) {
                throw new Error('Booked Date not found or response data is empty.');
            }

            setBookingData(bookingDetails);
        } catch (err) {
            console.error('Error fetching booking details:', err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()} - ${date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
    };

    const handleComplete = async () => {
        setIsProcessing(true);
        try {
            const merchantId = await AsyncStorage.getItem('merchantId');
            const token = await AsyncStorage.getItem('accessToken');

            if (!merchantId || !token) {
                throw new Error('Required credentials not found');
            }

            const response = await api.put(
                `/merchants/${merchantId}/securities/bookings`,
                {
                    security_booking_id: bookingData.security_booking_id,
                    date_booking_id: route.params?.date_booking_id,
                    status: 'accepted', // Change status to 'accepted'
                    officers_ids: [] // Assuming you want to assign no officers
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data?.statusCode === 200) {
                Alert.alert(
                    'Success',
                    'Booking completed successfully',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            }
        } catch (err) {
            console.error('Error completing booking:', err);
            Alert.alert(
                'Error',
                err.response?.data?.message || 'Failed to complete booking. Please try again.'
            );
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#AD52F7" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={fetchBookingDetails}
                >
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!bookingData) {
        return null;
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false} // Hides the vertical scrollbar
                showsHorizontalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeft2 size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>About</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Image
                        source={{ uri: bookingData.userDetail.profile_photo }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.name}>{bookingData.userDetail.first_name}</Text>
                </View>

                {/* Details Section */}
                <View style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Pick up location:</Text>
                        <Text style={styles.value}>{bookingData.pickup_location}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Logistics:</Text>
                        <Text style={styles.value}>{bookingData.logistics}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Date/Time:</Text>
                        <Text style={styles.value}>{formatDate(bookingData.scheduled_date)}</Text>
                    </View>
                    <View style={[styles.detailRow, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0, }]}>
                        <Text style={styles.label}>Question:</Text>
                        <Text style={styles.value}>{bookingData.security_question}</Text>
                    </View>
                </View>

                {/* Security Specifications */}
                <View style={styles.specSection}>
                    <Text style={styles.sectionTitle}>Security specifications</Text>
                    {bookingData.security_specification && (
                        <View style={styles.specRow}>
                            <Text style={styles.specNumber}>{bookingData.security_specification.number}</Text>
                            <Text style={styles.specText}>{bookingData.assignedOfficers[0]?.gender}</Text>
                        </View>
                    )}
                </View>

                {/* Destination Section */}
                <View style={styles.destinationSection}>
                    <Text style={styles.sectionTitle}>Destination</Text>
                    <View style={styles.restaurantCard}>
                        <Image
                            source={{ uri: bookingData.destination.image_url }}
                            style={styles.destinationImage}
                        />
                        <View style={styles.restaurantInfo}>
                            <Text style={styles.restaurantName}>{bookingData.destination.name}</Text>
                            <Text style={styles.restaurantLocation}>{`${bookingData.destination.location.country}, ${bookingData.destination.location.state}`}</Text>
                            <View style={styles.ratingContainer}>
                                {[1, 2, 3, 4].map((_, index) => (
                                    <AntDesign key={index} name="star" size={16} color="#FFD700" />
                                ))}
                                <AntDesign name="star" size={16} color="#E5E5E5" />
                            </View>
                        </View>
                    </View>
                </View>

                {/* Officer Card */}
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Assigned Officer</Text>
                    <LinearGradient colors={['#F8F0FF', '#F5EAFF']} style={styles.card}>
                        {bookingData.assignedOfficers.length > 0 && (
                            <View style={styles.officerInfo}>
                                <Image
                                    source={{ uri: bookingData.assignedOfficers[0].image_url }} // Use the officer's image URL
                                    style={styles.officerImage}
                                />
                                <Text style={styles.officerName}>
                                    {bookingData.assignedOfficers[0].firstName} {bookingData.assignedOfficers[0].lastName}
                                </Text>
                            </View>
                        )}
                        <View style={styles.detailsContainer}>
                            {renderDetailRow("Logistics", bookingData.logistics)}
                            {renderDetailRow("Date/Time", formatDate(bookingData.scheduled_date))}
                            {renderDetailRow("Question", bookingData.security_question)}
                        </View>
                    </LinearGradient>
                </View>

                {/* Bottom Buttons */}
                {
                    bookingData.request_status === 'pending' && ( // Check if the request status is pending
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                onPress={handleComplete} // Call handleComplete when pressed
                            >
                                <LinearGradient
                                    colors={['#AD52F7', '#CD8DFE']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.doneButton}
                                >
                                    <Text style={styles.buttonText}>Complete</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )
                }
            </ScrollView>
        </View>
    );

    function renderDetailRow(label, value, hideBorder = false) {
        return (
            <View style={[styles.detailRow, hideBorder && { borderBottomWidth: 0 }]}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '500',
        color: '#666 666',
        marginRight: 30,
    },
    placeholder: {
        width: 24,
    },
    profileSection: {
        alignItems: 'center',
        marginVertical: 16,
        flexDirection: 'row',
        marginHorizontal: 16,
    },
    profileSection: {
        alignItems: 'center',
        marginVertical: 16,
        flexDirection: 'row',
        marginHorizontal: 10,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 32,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
        marginLeft: 20,
        color: '#595757',
    },
    detailsCard: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BCBABA',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        borderBottomWidth: 0.5,
        borderColor: '#BCBABA',
        paddingBottom: 4,
    },
    label: {
        fontSize: 13,
        color: 'black',
        fontWeight: '600',
        flex: 1,
    },
    value: {
        fontSize: 13,
        color: 'black',
        fontWeight: '400',
        flex: 2,
        textAlign: 'start',
    },
    specSection: {
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    specRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    specNumber: {
        fontSize: 14,
        marginRight: 8,
        backgroundColor: '#F8F7F7',
        padding: 10,
        borderRadius: 8,
    },
    specText: {
        fontSize: 14,
        marginRight: 8,
        backgroundColor: '#F8F7F7',
        padding: 10,
        borderRadius: 8,
    },
    destinationSection: {
        paddingVertical: 16,
    },
    restaurantCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 15,
        overflow: 'hidden',
    },
    destinationImage: {
        width: 80,
        height: 80,
        borderRadius: 15,
    },
    restaurantInfo: {
        marginLeft: 15,
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 80,
    },
    restaurantName: {
        fontSize: 16,
        fontWeight: '600',
    },
    restaurantLocation: {
        fontSize: 14,
        color: '#666',
        marginVertical: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
    },
    content: {
        flex: 1,
        paddingTop: 30,
        marginBottom: 20,
    },
    card: {
        padding: 16,
        borderRadius: 5,
    },
    officerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    officerImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    officerName: {
        fontSize: 16,
        fontWeight: '600',
    },
    detailsContainer: {
        gap: 16,
    },
    doneButton: {
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginBottom: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});