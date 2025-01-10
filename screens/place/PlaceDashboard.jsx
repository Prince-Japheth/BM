import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Modal,
    ActivityIndicator,
} from 'react-native';
import WithdrawalModal from '../../components/WithdrawalModal';
import WhatsappButton from '../../components/WhatsappButton';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ShopAdd,
    Wallet,
    ArrowRight2,
    Setting4,
} from 'iconsax-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/apiService';

const formatValue = (value, isPlaceLising = false) => {
    const numericValue = Number(value);

    // if (isNaN(numericValue)) {
    //     return 'Invalid value';
    // }

    if (isPlaceLising) {
        return numericValue.toLocaleString();
    }
    if (numericValue >= 1e9) return `$${(numericValue / 1e9).toFixed(1)}B`;
    if (numericValue >= 1e6) return `$${(numericValue / 1e6).toFixed(1)}M`;
    if (numericValue >= 1e3) return `$${(numericValue / 1e3).toFixed(1)}K`;
    return `$${numericValue.toFixed(2)}`;
};

export default function PlaceDashboard() {
    const navigation = useNavigation();
    const route = useRoute();
    const [showInsight, setShowInsight] = useState(false);
    const [timeframe, setTimeframe] = useState('Daily');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false);
    const options = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    const [isApproved, setIsApproved] = useState(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [isLoadingWallet, setIsLoadingWallet] = useState(true);
    const [isLoadingPlaces, setIsLoadingPlaces] = useState(true);
    const [places, setPlaces] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isWithdrawalModalVisible, setModalVisible] = useState(false);
    const [isLoadingInsights, setIsLoadingInsights] = useState(true);

    const [insights, setInsights] = useState({
        totalReservations: 0,
        totalAmount: 0,
        totalEarnings: 0,
        totalFavorites: 0
    });

    const [ratings, setRatings] = useState({
        total_ratings: 0,
        average_rating: 0,
        reviews: []
    });
    const [isLoadingRatings, setIsLoadingRatings] = useState(true);
    const [currentRatingPage, setCurrentRatingPage] = useState(1);

    const fetchInsights = async () => {
        console.log('Insights Fetch Context:', {
            showInsight,
            timeframe,
            timestamp: new Date().toISOString()
        });
    
        try {
            const storedMerchantId = await AsyncStorage.getItem('merchantId');
            const token = await AsyncStorage.getItem('accessToken');
    
            console.log('Authentication Details:', {
                merchantIdExists: !!storedMerchantId,
                tokenExists: !!token
            });
    
            if (!storedMerchantId || !token) {
                console.warn('Missing merchant ID or token for insights fetch');
                return;
            }
    
            console.log('Insights Request Details:', {
                url: `/merchants/${storedMerchantId}/places/insights`,
                timeframe,
                merchantId: storedMerchantId
            });
    
            const response = await api.get(`/merchants/${storedMerchantId}/places/insights`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { timeframe }
            });
    
            console.log('Insights Fetch Success:', {
                data: response.data,
                timestamp: new Date().toISOString()
            });
    
            setInsights(response.data.data || {
                totalReservations: 0,
                totalAmount: 0,
                totalEarnings: 0,
                totalFavorites: 0
            });
            setIsLoadingInsights(false);
        } catch (error) {
            console.error('Insights Fetch Error:', {
                message: error.message,
                code: error.code,
                response: error.response?.data,
                timestamp: new Date().toISOString()
            });
    
            setInsights({
                totalReservations: 0,
                totalAmount: 0,
                totalEarnings: 0,
                totalFavorites: 0
            });
            setIsLoadingInsights(false); // Fix to ensure loading state is correctly set
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
        fetchWalletBalance();
        fetchPlaces();
        fetchInsights(); // Call this to fetch insights when the component mounts
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchPlaces();
            fetchInsights(); // Call this if you want to fetch insights as well

            return () => {
                // Cleanup if necessary
            };
        }, [])
    );

    const fetchWalletBalance = async (retryCount = 0) => {
        try {
            console.log('Fetching wallet balance...');
            const storedMerchantId = await AsyncStorage.getItem('merchantId');
            const token = await AsyncStorage.getItem('accessToken');

            if (!storedMerchantId || !token) {
                console.error('Merchant ID or Access token not found in storage.');
                setTimeout(() => fetchWalletBalance(retryCount + 1), 3000);
                return;
            }

            const response = await api.get(`/merchants/${storedMerchantId}/wallets`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Wallet response:', response.data);
            setWalletBalance(response.data.data.balance);
            setIsLoadingWallet(false);
        } catch (error) {
            console.error('Error fetching wallet:', error.response || error);
            if (retryCount < 3) {
                console.log(`Retrying wallet fetch... Attempt ${retryCount + 1}`);
                setTimeout(() => fetchWalletBalance(retryCount + 1), 3000);
            }
        }
    };

    const fetchPlaces = async (page = 1, retryCount = 0) => {
        try {
            console.log(`Fetching places, page ${page}...`);
            const storedMerchantId = await AsyncStorage.getItem('merchantId');
            const token = await AsyncStorage.getItem('accessToken');

            if (!storedMerchantId || !token) {
                console.error('Merchant ID or Access token not found in storage.');
                setTimeout(() => fetchPlaces(page, retryCount + 1), 3000);
                return;
            }

            const response = await api.get(`/merchants/${storedMerchantId}/places`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page,
                    limit: 10
                }
            });

            console.log('Places response:', response.data);
            setPlaces(response.data.data);
            setTotalPages(response.data.total_pages);
            setCurrentPage(page);
            setIsLoadingPlaces(false);
        } catch (error) {
            if (retryCount < 3) {
                console.log(`Retrying places fetch... Attempt ${retryCount + 1}`);
                setTimeout(() => fetchPlaces(page, retryCount + 1), 3000);
            }
        }
    };

    const fetchRatings = async () => {
        try {
            const storedMerchantId = await AsyncStorage.getItem('merchantId');
            const token = await AsyncStorage.getItem('accessToken');

            console.log('Ratings Fetch Context:', {
                merchantId: storedMerchantId,
                page: currentRatingPage
            });

            if (!storedMerchantId || !token) {
                console.warn('Missing merchant ID or token for ratings fetch');
                return;
            }

            const response = await api.get(`/merchants/${storedMerchantId}/places/ratings`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    page: currentRatingPage,
                    limit: 20
                }
            });

            console.log('Ratings Fetch Success:', {
                data: response.data,
                timestamp: new Date().toISOString 
            });

            setRatings({
                total_ratings: response.data.total_ratings || 0,
                average_rating: response.data.data.length > 0
                    ? calculateAverageRating(response.data.data)
                    : 0,
                reviews: response.data.data || []
            });
            setIsLoadingRatings(false);
        } catch (error) {
            console.error('Ratings Fetch Error:', {
                message: error.message,
                timestamp: new Date().toISOString()
            });

            setRatings({
                total_ratings: 0,
                average_rating: 0,
                reviews: []
            });
            setIsLoadingRatings(true);
        }
    };

    const toggleWithdrawalModal = () => {
        setModalVisible(!isWithdrawalModalVisible);
    };

    const handleAddPlace = () => {
        if (!isApproved) {
            setIsVerificationModalVisible(true);
        } else {
            navigation.navigate('AddPlaceListing');
        }
    };

    const handleViewPlaceListing = (placeId) => {
        navigation.navigate('ViewPlaceListing', { placeId });
        console.log(placeId)
    };

    useEffect(() => {
        if (showInsight) {
            fetchRatings();
        }
    }, [showInsight, currentRatingPage]);

    const calculateAverageRating = (ratings) => {
        if (ratings.length === 0) return 0;
        const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
        return sum / ratings.length;
    };

    // Modified RatingStars to show filled and unfilled stars
    const RatingStars = ({ rating }) => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <AntDesign
                        key={star}
                        name={star <= rating ? "star" : "staro"}
                        size={15}
                        color="gold"
                    />
                ))}
            </View>
        );
    };

    const renderWalletCard = () => (
        <View style={styles.card}>
            <View style={styles.cardIcon}>
                <Wallet size={24} color="#3B125A" variant="Linear" />
            </View>
            {isLoadingWallet ? (
                <ActivityIndicator size="large" color="#AD52F7" />
            ) : (
                <>
                    <Text style={styles.cardValue}>{formatValue(walletBalance)}</Text>
                </>
            )}
            <TouchableOpacity style={styles.withdrawButton} onPress={toggleWithdrawalModal}>
                <Text style={styles.withdrawText}>Withdraw</Text>
            </TouchableOpacity>
        </View>
    );

    const renderPlaces = () => {
        if (isLoadingPlaces) {
            return (
                <View style={[styles.loadingContainer, { paddingTop: 50 }]}>
                    <ActivityIndicator size="large" color="#AD52F7" />
                </View>
            );
        }

        if (places.length === 0) {
            return (
                <View style={styles.noProductAvailable}>
                    <Image
                        source={require('../../assets/Boxes.png')}
                        style={styles.illustration}
                        contentFit="contain"
                    />
                    <Text style={styles.subtitle}>
                        You have not added any places yet
                    </Text>
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={handleAddPlace}
                    >
                        <LinearGradient
                            colors={['#AD52F7', '#CD8DFE']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Add Place</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.productsList}>
                {places.map((place) => (
                    <TouchableOpacity
                        key={place.id}
                        style={styles.productItem}
                        onPress={() => handleViewPlaceListing(place.id)}
                    >
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{place.name}</Text>
                            <Text style={styles.productLocation}>
                                {place.location.state}, {place.location.country}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.productArrow}>
                            <ArrowRight2 size={16} color='#BCBABA' />
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
                {totalPages > 1 && (
                    <View style={styles.pagination}>
                        <TouchableOpacity
                            disabled={currentPage === 1}
                            onPress={() => fetchPlaces(currentPage - 1)}
                        >
                            <Text style={[
                                styles.paginationText,
                                currentPage === 1 && styles.paginationDisabled
                            ]}>
                                Previous
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.paginationText}>
                            {currentPage} of {totalPages}
                        </Text>
                        <TouchableOpacity
                            disabled={currentPage === totalPages}
                            onPress={() => fetchPlaces(currentPage + 1)}
                        >
                            <Text style={[
                                styles.paginationText,
                                currentPage === totalPages && styles.paginationDisabled
                            ]}>
                                Next
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Dashboard</Text>
                </View>
                <TouchableOpacity style={styles.ShopAddButton} onPress={handleAddPlace}>
                    <ShopAdd size={20} color="#000" variant="Linear" />
                </TouchableOpacity>
            </View>

            {!isApproved && (
                <View style={styles.verificationTextContainer}>
                    <Text style={styles.verificationText}>
                        Your document is being verified. This process usually takes a...
                    </Text>
                </View>
            )}

            <ScrollView style={styles.content}>
                <View style={styles.cardsContainer}>
                    {renderWalletCard()}
                </View>

                <View style={styles.catalogHeader}>
                    <TouchableOpacity onPress={() => setShowInsight(false)}>
                        <Text
                            style={[
                                styles.sectionTitle,
                                !showInsight && styles.sectionTitleActive,
                            ]}
                        >
                            Listed Places
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowInsight(true)}>
                        <Text
                            style={[
                                styles.sectionTitle,
                                showInsight && styles.sectionTitleActive,
                            ]}
                        >
                            View Insight
                        </Text>
                    </TouchableOpacity>
                </View>

                {!showInsight ? (
                    renderPlaces()
                ) : (
                    <View style={styles.insightView}>
                        <View style={styles.dropdownContainer}>
                            <TouchableOpacity
                                style={styles.trigger}
                                onPress={() => setDropdownVisible(!dropdownVisible)}
                            >
                                <Setting4 size={25} color="black" />
                                <Text style={styles.triggerText}>{timeframe}</Text>
                            </TouchableOpacity>
                            {dropdownVisible && (
                                <View style={styles.dropdown}>
                                    {options.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={styles.option}
                                            onPress={() => {
                                                setTimeframe(option);
                                                setDropdownVisible(false);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.optionText,
                                                    timeframe === option && styles.selectedOption,
                                                ]}
                                            >
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>

                        <View style={styles.cardContainer}>
                            <View style={styles.orderCard}>
                                <Text style={styles.cardTitle}>Total Reservations</Text>
                                {isLoadingInsights ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#AD52F7"
                                        style={styles.inlineLoader}
                                    />
                                ) : (
                                    <Text style={styles.orderCardValue}>
                                        {formatValue(insights.totalReservations, true)}
                                    </Text>
                                )}
                            </View>
                            <View style={styles.orderCard}>
                                <Text style={styles.cardTitle}>Total Amount</Text>
                                {isLoadingInsights ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#AD52F7"
                                        style={styles.inlineLoader}
                                    />
                                ) : (
                                    <Text style={styles.orderCardValue}>
                                        {formatValue(insights.totalAmount)}
                                    </Text>
                                )}
                            </View>
                            <View style={styles.orderCard}>
                                <Text style={styles.cardTitle}>Total Favorites</Text>
                                {isLoadingInsights ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#AD52F7"
                                        style={styles.inlineLoader}
                                    />
                                ) : (
                                    <Text style={styles.orderCardValue}>
                                        {formatValue(insights.totalFavorites, true)}
                                    </Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.yourRatingContainer}>
                            <View style={styles.yourRatingHeader}>
                                <AntDesign name="star" size={15} color="gold" />
                                <Text style={styles.yourRatingText}>Your Rating</Text>
                            </View>
                            <View style={styles.yourRatingContent}>
                                {isLoadingRatings ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#AD52F7"
                                        style={styles.inlineLoader}
                                    />
                                ) : (
                                    <>
                                        <RatingStars rating={Math.round(ratings.average_rating)} />
                                        <Text style={styles.ratingNumber}>
                                            {ratings.average_rating.toFixed(1)} ({ratings.total_ratings})
                                        </Text>
                                    </>
                                )}
                            </View>
                        </View>

                        <View style={styles.reviewsContainer}>
                            {isLoadingRatings ? (
                                <ActivityIndicator
                                    size="large"
                                    color="#AD52F7"
                                    style={{ alignSelf: 'center', flex: 1, marginTop: 50, }}
                                />
                            ) : (
                                ratings.reviews.map((review) => (
                                    <View key={review.id} style={styles.reviewCard}>
                                        <View style={styles.reviewHeader}>
                                            <Text style={styles.reviewId}>ID: {review.id.slice(-6)}</Text>
                                            <Text style={styles.timeAgo}>
                                                {review.createdAt}
                                            </Text>
                                        </View>
                                        <View style={styles.ratingContainer}>
                                            <RatingStars rating={review.rating} />
                                            <Text style={styles.reviewRating}>
                                                {review.rating.toFixed(1)}
                                            </Text>
                                        </View>
                                        <Text style={styles.reviewText}>{review.feedback}</Text>
                                    </View>
                                ))
                            )}
                        </View>
                    </View>
                )}
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
                            You can't add listings until your account has been verified.
                        </Text>
                    </View>
                </View>
            </Modal>

            <WithdrawalModal isVisible={isWithdrawalModalVisible} toggleWithdrawalModal={toggleWithdrawalModal} />

            <WhatsappButton />
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
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
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
    content: {
        flex: 1,
    },
    cardsContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 15,
    },
    card: {
        padding: 16,
        backgroundColor: '#f1e1ff',
        borderRadius: 20,
        gap: 8,
        width: 170,
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
    catalogHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitleActive: {
        fontSize: 16,
        fontWeight: '500',
        color: '#161616',
    },
    sectionTitle: {
        fontSize: 14,
        color: '#666',
    },
    productsList: {
        paddingHorizontal: 20,
        gap: 20,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.05)',
    },
    productImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        marginBottom: 4,
        fontWeight: '600',
    },
    productSales: {
        fontSize: 14,
        color: '#BCBABA',
    },
    starContainer: {
        flexDirection: 'row',
    },
    productArrow: {
        padding: 4,
    },
    arrowText: {
        fontSize: 20,
        color: '#666',
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginVertical: 20,
    },
    orderCard: {
        backgroundColor: '#F2F2F2',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        width: 105,
        shadowRadius: 4,
    },
    cardTitle: {
        color: '#BCBABA',
        fontSize: 11,
        marginBottom: 'auto',
    },
    orderCardValue: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },


    dropdownContainer: {
        zIndex: 1000,
        paddingHorizontal: 20,
    },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        padding: 10,
        // backgroundColor: '#f1e1ff',
        borderRadius: 8,
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




    noProductAvailable: {
        justifyContent: 'center', // Ensures the content is centered vertically
        alignItems: 'center', // Centers the content horizontally
        flex: 1, // Takes up full available space
        paddingVertical: 20,
    },
    illustration: {
        alignSelf: 'center', // Centers the image horizontally within the parent View
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginVertical: 20,
    },
    buttonContainer: {
        width: 280,
        height: 50,
        borderRadius: 12,
        overflow: 'hidden',
    },
    button: {
        width: 280,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
        fontWeight: 600,
        marginBottom: 15,
    },
    modalMessage: {
        fontSize: 13,
        fontWeight: 400,
        lineHeight: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#868686',
    },
    closeModalButton: {
        marginLeft: 'auto',
    },


    yourRatingContainer: {
        flexDirection: 'row',
        backgroundColor: '#F8F2FF',
        borderRadius: 15,
        overflow: 'hidden',
        marginHorizontal: 16,
        height: 90,
    },
    yourRatingHeader: {
        backgroundColor: '#2D1654',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 16,
        width: '40%',
        borderRadius: 15,
    },
    yourRatingContent: {
        flex: 1,
        backgroundColor: '#F8F2FF',
        padding: 20,
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 15,
        alignItems: 'flex-end',
        height: 95,
    },
    starsContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    yourRatingText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    ratingNumber: {
        fontSize: 16,
        fontWeight: 'bold',
    },


    reviewCard: {
        backgroundColor: '#F8F2FF',
        borderRadius: 12,
        padding: 16,
        margin: 16,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    reviewId: {
        fontSize: 14,
        color: '#2D1654',
        fontWeight: '500',
    },
    timeAgo: {
        fontSize: 14,
        color: '#666666',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 150,
        marginBottom: 12,
    },
    reviewRating: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2D1654',
    },
    reviewText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666666',
    },
});

