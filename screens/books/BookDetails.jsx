import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Pressable,
    ScrollView
} from 'react-native';
import { ArrowLeft2, Eye } from 'iconsax-react-native';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

// Mock data to simulate API response
const mockBookData = {
    id: '1234',
    title: 'Apartment House',
    category: 'Fantasy',
    publisher: 'Embassy',
    coverImage: require('../../assets/book.png'),
    ratings: {
        average: 4,
        count: 139,
    },
    views: 50,
    sales: 50,
    reviews: [
        {
            id: '1234hg53',
            date: '2 days ago',
            rating: 5,
            text: 'Lacus sed viverra tellus in hac habitasse platea dictumst. Malesuada nunc vel risus commodo. In mollis nunc sed id semper risus in hendrerit.'
        }
    ]
};

export default function BookDetails() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [isUnpublished, setIsUnpublished] = useState(false);

    const handleUnpublish = () => {
        setIsUnpublished(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setIsUnpublished(false);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.headerContainer}> <View style={styles.header}> <TouchableOpacity onPress={() => navigation.goBack()}> <ArrowLeft2 size={24} color="#000" /> </TouchableOpacity> </View> </View>

            {/* Book Cover */}
            <Image
                source={mockBookData.coverImage}
                style={styles.coverImage}
            />

            {/* Unpublish Button */}
            <TouchableOpacity
                style={styles.unpublishButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.unpublishText}>Unpublish</Text>
            </TouchableOpacity>

            {/* Book Info */}
            <View style={styles.bookInfo}>
                <Text style={styles.titleSubtitle}>
                    {mockBookData.title} - <Text style={styles.category}>{mockBookData.category}</Text>
                </Text>
                <Text style={styles.publisher}>{mockBookData.publisher}</Text>
            </View>

            {/* Ratings Section */}
            <View style={styles.statsContainer}>
                <View style={styles.ratingsContainer}>
                    <View style={styles.stars}>
                        {[1, 2, 3, 4].map((star) => (
                            <AntDesign key={star} name="star" size={20} color="#FFD700" />
                        ))}
                        <AntDesign name="star" size={20} color="#BCBABA" />
                    </View>
                    <Text style={styles.ratingsText}>{mockBookData.ratings.count} Ratings</Text>
                </View>
                <View style={styles.viewsContainer}>
                    <Eye size="15" color="black" />
                    <Text style={styles.viewsNumber}>{mockBookData.views}</Text>
                </View>
                <View style={styles.salesContainer}>
                    <Text style={styles.salesLabel}>Sales</Text>
                    <Text style={styles.salesAmount}>${mockBookData.sales}</Text>
                </View>
            </View>

            {/* User Feedback */}
            <View style={styles.feedbackSection}>
                <Text style={styles.feedbackHeader}>User feedback</Text>
                {mockBookData.reviews.map((review) => (
                    <View key={review.id} style={styles.reviewContainer}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.reviewId}>ID:{review.id}</Text>
                            <Text style={styles.reviewDate}>{review.date}</Text>
                        </View>
                        <View style={styles.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <AntDesign key={star} name="star" size={16} color="#FFD700" />
                            ))}
                            <Text style={styles.reviewRating}>{review.rating}.0</Text>
                        </View>
                        <Text style={styles.reviewText}>{review.text}</Text>
                    </View>
                ))}
            </View>

            {/* Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {!isUnpublished ? (
                            <>
                                <View style={styles.modalIcon}>
                                    <AntDesign name="copy1" size={24} color="#8B5CF6" />
                                </View>
                                <Text style={styles.modalTitle}>
                                    Are you sure you want to Unpublish this book?
                                </Text>
                                <Text style={styles.modalDescription}>
                                    By unpublishing this book, all the comments and ratings would no longer exist, do you still want to proceed?
                                </Text>
                                <View style={styles.modalButtons}>
                                    <LinearGradient
                                        colors={['#AD52F7', '#CD8DFE']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[styles.modalButton, styles.unpublishModalButton]}
                                    >
                                        <TouchableOpacity
                                            onPress={handleUnpublish}
                                            style={styles.unpublishTouchable}
                                        >
                                            <Text style={styles.unpublishModalText}>Unpublish</Text>
                                        </TouchableOpacity>
                                    </LinearGradient>
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.backButton]}
                                        onPress={closeModal}
                                    >
                                        <Text style={styles.backButtonText}>Back</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={styles.modalIcon}>
                                    <AntDesign name="check" size={30} color="#8B5CF6" />
                                </View>
                                <Text style={styles.modalTitle}>Book Unpublished</Text>
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.backButton, { backgroundColor: 'white' }]}
                                        onPress={closeModal}
                                    >
                                        <Text style={styles.backButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { 
        backgroundColor: '#fff', 
        padding: 20, 
    }, 
    contentContainer: { 
        paddingBottom: 40, 
    }, 
    headerContainer: { 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1, 
        backgroundColor: '#fff', // To ensure it overlays properly 
    }, 
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingTop: 40, 
    },    
    coverImage: {
        width: '70%',
        height: 400,
        resizeMode: 'cover',
        marginTop: 80,
        alignSelf: 'center',
    },
    unpublishButton: {
        position: 'absolute',
        right: 65,
        top: 430,
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    unpublishText: {
        color: '#000',
        fontSize: 16,
    },
    bookInfo: {
        alignItems: 'center',
        marginTop: 16,
    },
    titleSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    category: {
        color: '#666',
        fontWeight: '400',
    },
    publisher: {
        color: '#666',
        marginTop: 2,
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#f1e1ff',
        borderRadius: 15,
        marginTop: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#AD52F7',
        borderWidth: 1,
        overflow: 'hidden',
    },
    ratingsContainer: {
        flex: 1,
        padding: 16,
    },
    stars: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    ratingsText: {
        color: 'black',
    },
    viewsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        alignSelf: 'center',
        marginRight: 55,
        gap: 5,
    },
    viewsNumber: {
        fontSize: 16,
        fontWeight: '500',
    },
    salesContainer: {
        alignItems: 'center',
        backgroundColor: '#e7caff',
        paddingHorizontal: 30,
        paddingVertical: 16,
        borderRadius: 15,
        gap: 5,
        justifyContent: 'center',
    },
    salesLabel: {
        color: '#3B125A',
    },
    salesAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3B125A',
    },
    feedbackSection: {
        marginTop: 24,
    },
    feedbackHeader: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 16,
    },
    reviewContainer: {
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    reviewId: {
        color: '#666',
    },
    reviewDate: {
        color: '#666',
    },
    reviewRating: {
        marginLeft: 8,
        fontWeight: 'bold',
        color: '#3B125A',
    },
    reviewText: {
        marginTop: 8,
        color: '#444',
        lineHeight: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '70%',
        alignItems: 'center',
    },
    modalIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#f1e1ff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalDescription: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 24,
    },
    modalButtons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginBottom: 8,
    },
    modalButton: {
        flex: 1,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    unpublishModalButton: {
        marginRight: 8,
    },
    backButton: {
        backgroundColor: '#f1e1ff',
    },
    backButtonText: {
        color: '#AD52F7',
        fontWeight: 700,
    },
    unpublishTouchable: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    unpublishModalText: {
        color: 'white',
        fontWeight: 700,
    },
    closeButton: {
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 32,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});

