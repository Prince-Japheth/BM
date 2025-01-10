import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Setting4 } from 'iconsax-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WhatsappButton from '../../components/WhatsappButton';
import api from '../../api/apiService';

const Reservations = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('orders');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [timeframe, setTimeframe] = useState('Daily');
    const options = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initializing, setInitializing] = useState(true);
    const [authCredentials, setAuthCredentials] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 0,
        totalReservations: 0
    });

    const [statusCounts, setStatusCounts] = useState({
        pending: 0,
        rejected: 0,
        completed: 0,
    });

    const STATUS_UPDATES = {
        REJECT: 'rejected',
        COMPLETE: 'completed'
    };

    // Unified status update handler
    const updateReservationStatus = async (reservationId, newStatus, authCredentials, onSuccess) => {
        if (!reservationId) {
            console.error('No reservation ID provided');
            return false;
        }

        if (!authCredentials?.token || !authCredentials?.merchantId) {
            console.error('No auth credentials available');
            return false;
        }

        try {
            api.defaults.headers.common['Authorization'] = `Bearer ${authCredentials.token}`;

            const endpoint = `/merchants/${authCredentials.merchantId}/places/reservations/${reservationId}`;
            await api.patch(endpoint, { requestStatus: newStatus });

            console.log(`Reservation ${reservationId} status updated to ${newStatus}`);
            onSuccess?.();
            return true;
        } catch (error) {
            console.error(`Error updating reservation status:`, error);

            // Handle specific error cases
            if (error.response?.status === 404) {
                console.error('Reservation not found');
                return false;
            }

            if (!error.response || error.response.status >= 500) {
                // Retry for server errors
                console.log(`Retrying status update for reservation ${reservationId}`);
                return new Promise(resolve => {
                    setTimeout(async () => {
                        const result = await updateReservationStatus(
                            reservationId,
                            newStatus,
                            authCredentials,
                            onSuccess
                        );
                        resolve(result);
                    }, 5000);
                });
            }

            return false;
        }
    };

    // Initialize auth credentials
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedMerchantId = await AsyncStorage.getItem('merchantId');
                const token = await AsyncStorage.getItem('accessToken');

                if (storedMerchantId && token) {
                    setAuthCredentials({ merchantId: storedMerchantId, token });
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setInitializing(false);
            }
        };

        initializeAuth();
    }, []);

    // Retry mechanism for auth initialization
    useEffect(() => {
        const retryInterval = 5000; // 5 seconds
        let retryTimer;

        if (!initializing && !authCredentials && retryCount < 5) {
            retryTimer = setTimeout(async () => {
                try {
                    const storedMerchantId = await AsyncStorage.getItem('merchantId');
                    const token = await AsyncStorage.getItem('accessToken');

                    if (storedMerchantId && token) {
                        setAuthCredentials({ merchantId: storedMerchantId, token });
                    }
                } catch (error) {
                    console.error('Error in retry auth:', error);
                }
                setRetryCount(prev => prev + 1);
            }, retryInterval);
        }

        return () => clearTimeout(retryTimer);
    }, [initializing, authCredentials, retryCount]);

    // Fetch reservations based on active tab and pagination
    const fetchReservations = async (status = null) => {
        if (!authCredentials) return;

        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit
            };

            if (status && status !== 'orders') {
                params.requestStatus = status;
            }

            // Configure API request with auth token
            api.defaults.headers.common['Authorization'] = `Bearer ${authCredentials.token}`;

            const response = await api.get(
                `/merchants/${authCredentials.merchantId}/places/reservations`,
                { params }
            );

            const { data, page, limit, total_pages, total_reservations } = response.data;

            setReservations(prev =>
                pagination.page === 1 ? data : [...prev, ...data]
            );
            setPagination({
                page,
                limit,
                totalPages: total_pages,
                totalReservations: total_reservations
            });

            // Calculate counts based on the fetched data
            const pendingCount = data.filter(item => item.requestStatus === 'pending').length;
            const rejectedCount = data.filter(item => item.requestStatus === 'rejected').length;
            const completedCount = data.filter(item => item.requestStatus === 'completed').length;

            setStatusCounts({
                pending: pendingCount,
                rejected: rejectedCount,
                completed: completedCount,
            });

        } catch (error) {
            console.error('Error fetching reservations:', error);
            // Silently retry after a delay
            setTimeout(() => fetchReservations(status), 5000);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when tab changes or auth is initialized
    useEffect(() => {
        if (!initializing && authCredentials) {
            fetchReservations(activeTab);
        }
    }, [activeTab, authCredentials, initializing]);

    const tabs = [
        { id: 'orders', label: 'Orders', count: pagination.totalReservations },
        { id: 'pending', label: 'Pending', count: statusCounts.pending },
        { id: 'rejected', label: 'Rejected', count: statusCounts.rejected },
        { id: 'completed', label: 'Completed', count: statusCounts.completed }
    ];

    const handleOrderPress = (listingId) => {
        navigation.navigate('ReservationDetails', { listingId });
    };

    const handleReject = async (reservationId) => {
        const success = await updateReservationStatus(
            reservationId,
            STATUS_UPDATES.REJECT,
            authCredentials,
            () => fetchReservations(activeTab)
        );

        if (!success) {
            // Handle failure - you might want to show an error message to the user
            console.error('Failed to reject reservation');
        }
    };

    const toggleCompleteStatus = async (reservationId) => {
        const success = await updateReservationStatus(
            reservationId,
            STATUS_UPDATES.COMPLETE,
            authCredentials,
            () => fetchReservations(activeTab)
        );

        if (!success) {
            // Handle failure - you might want to show an error message to the user
            console.error('Failed to complete reservation');
        }
    };

    const renderItem = ({ item }) => {
        let badge = null;
        let backgroundColor = 'white';

        if (item.requestStatus === 'rejected') {
            badge = (
                <View style={styles.rejectedBadge}>
                    <Text style={styles.rejectedText}>Rejected</Text>
                </View>
            );
        } else if (item.requestStatus === 'completed') {
            badge = (
                <View style={styles.completedBadge}>
                    <AntDesign name="check" size={15} color="white" />
                </View>
            );
            backgroundColor = '#D1E7DD';
        }

        return (
            <View style={[styles.listingContainer, { backgroundColor }]}>
                <Pressable style={styles.listingItem} onPress={() => handleOrderPress(item.reservationId)} activeOpacity={0.5}>
                    <Image
                        source={{ uri: item.placeLocationUrl }}
                        style={styles.listingImage}
                        defaultSource={require('../../assets/place1.png')}
                    />
                    <View style={styles.listingDetails}>
                        <Text style={styles.listingTitle}>{item.placeName}</Text>
                        <View style={styles.detailsRow}>
                            <Text style={styles.reservationTime}>
                                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                            <Text style={styles.reservationType}>{item.reservationType.toUpperCase()}</Text>
                        </View>
                    </View>

                    {item.requestStatus === 'pending' && (
                        <Pressable
                            style={styles.checkbox}
                            onPress={() => toggleCompleteStatus(item.reservationId)}
                        >
                            <View
                                style={[
                                    styles.checkboxCircle,
                                    item.requestStatus === 'completed' && styles.checked
                                ]}
                            />
                        </Pressable>
                    )}

                    {badge}
                </Pressable>
            </View>
        );
    };

    const renderHiddenItem = ({ item }) => {
        if (item.requestStatus === 'rejected') {
            return null;
        }

        return (
            <View style={styles.rowBack}>
                <Pressable
                    style={styles.rejectButton}
                    onPress={() => handleReject(item.reservationId)}
                >
                    <Text style={styles.rejectText}>Reject</Text>
                </Pressable>
            </View>
        );
    };

    // Rest of the component remains the same, but update the loading state render
    if (initializing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#AD52F7" />
                <Text style={styles.loadingText}>Loading reservations...</Text>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.placeName}>Reservations</Text>
            </View>

            <View style={styles.tabs}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={styles.tabsContainer}>
                        {tabs.map(tab => (
                            <Pressable key={tab.id} onPress={() => setActiveTab(tab.id)}>
                                {activeTab === tab.id ? (
                                    <LinearGradient colors={['#AD52F7', '#CD8DFE']} style={styles.gradientBackground}>
                                        <Text style={[styles.tabText, styles.activeTabText]}>
                                            {`${tab.label} (${tab.count})`}
                                        </Text>
                                    </LinearGradient>
                                ) : (
                                    <View style={styles.tab}>
                                        <Text style={styles.tabText}>{`${tab.label} (${tab.count})`}</Text>
                                    </View>
                                )}
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.dropdownContainer}>
                    <Pressable style={styles.trigger} onPress={() => setDropdownVisible(!dropdownVisible)}>
                        <Setting4 size={25} color="black" />
                        <Text style={styles.triggerText}>{timeframe}</Text>
                    </Pressable>
                    {dropdownVisible && (
                        <View style={styles.dropdown}>
                            {options.map((option) => (
                                <Pressable
                                    key={option}
                                    style={styles.option}
                                    onPress={() => {
                                        setTimeframe(option);
                                        setDropdownVisible(false);
                                    }}
                                >
                                    <Text
                                        style={[styles.optionText, timeframe === option && styles.selectedOption]}
                                    >
                                        {option}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>
            </View>

            {loading && reservations.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#AD52F7" />
                    <Text style={styles.loadingText}>Loading reservations...</Text>
                </View>
            ) : reservations.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                    <Image source={require('../../assets/emptyorderimg.png')} style={styles.emptyStateImage} />
                    <Text style={styles.emptyStateText}>No reservations in this category</Text>
                </View>
            ) : (
                <SwipeListView
                    data={reservations}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-75}
                    disableRightSwipe={true}
                    keyExtractor={(item) => item.reservationId}
                    onEndReached={() => {
                        if (pagination.page < pagination.totalPages && !loading) {
                            setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
                        }
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() =>
                        loading && reservations.length > 0 ? (
                            <View style={styles.footerLoader}>
                                <ActivityIndicator size="small" color="#AD52F7" />
                                <Text>Loading more...</Text>
                            </View>
                        ) : null
                    }
                />

            )}

            <WhatsappButton />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        justifyContent: 'space-between',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center'
    },
    placeName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    gradientBackground: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    tabText: {
        color: '#666',
    },
    activeTabText: {
        color: '#fff',
    },
    dropdownContainer: {
        zIndex: 1000,
        paddingHorizontal: 20,
    },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical: 15,
    },
    triggerText: {
        fontSize: 16,
        color: '#3B125A',
        marginLeft: 15,
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        left: 60,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        marginTop: 5,
        width: 126,
        boxShadow: '0px 4px 64px 0px rgba(0, 0, 0, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    option: {
        padding: 10,
    },
    optionText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    selectedOption: {
        color: '#AD52F7',
    },
    listingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 2,
        borderBottomColor: 'white',
    },
    listingImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    listingDetails: {
        flex: 1,
        marginLeft: 16,
        gap: 5,
    },
    listingTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reservationTime: {
        color: 'black',
        marginRight: 10,
        backgroundColor: '#F7F7F7',
        fontWeight: 400,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 8,
    },
    reservationType: {
        color: 'black',
        backgroundColor: '#F7F7F7',
        fontWeight: 400,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 8,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    gradientButtonContainer: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    gradientButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
    },
    acceptedBadge: {
        backgroundColor: '#D1D5DB',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    acceptedText: {
        color: '#fff',
    },
    completedBadge: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#338E1C',
        padding: 4,
        borderRadius: 100,
    },
    rowBack: {
        alignItems: 'flex-end',
        backgroundColor: '#FF9494',
        flex: 1,
        justifyContent: 'center',
        height: 70,
    },
    rejectButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 75,
        height: '100%',
    },
    rejectText: {
        color: '#fff',
    },
    rejectedBadge: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    rejectedText: {
        color: 'red',
        fontWeight: 400,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyStateImage: {
        width: 250,
        height: 250,
        marginBottom: 20,
    },
    emptyStateText: {
        fontSize: 15,
        color: '#BCBABA',
        textAlign: 'center',
    },
    checkbox: {
        marginLeft: 10,
    },
    checkboxCircle: {
        width: 22,
        height: 22,
        borderRadius: 12,
        borderWidth: 0.78,
        borderColor: '#595757',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checked: {
        backgroundColor: '#338E1C',
    },
});

export default Reservations;