import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Modal,
    Pressable,
} from 'react-native';
import WithdrawalModal from '../../components/WithdrawalModal';
import WhatsappButton from '../../components/WhatsappButton';
import { Add, Wallet, Book } from 'iconsax-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const totalEarnings = 1234567; // Example total value

const formatValue = (value) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(2)}`;
};

export default function BookDashboard() {
    const navigation = useNavigation();
    const [showPendingApproval, setShowPendingApproval] = useState(false);
    const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false);
    const [isAccountVerified, setIsAccountVerified] = useState(false);
    const [products, setProducts] = useState([]);

    const handlePress = () => {
        const newProducts = [
            { id: '1', name: 'Apartment House', views: 1500, status: 'Published', category: 'Real Estate', image: require('../../assets/book.png') },
            { id: '2', name: 'Big Bang', views: 200, status: 'Published', category: 'Science Fiction', image: require('../../assets/book.png') },
            { id: '3', name: 'Thrilling Cities', views: 0, status: 'Pending', category: 'Travel', image: require('../../assets/book.png') },
            { id: '4', name: 'Mystery Novel', views: 0, status: 'Rejected', category: 'Mystery', image: require('../../assets/book.png') },
            { id: '5', name: 'Space Odyssey', views: 1200, status: 'Published', category: 'Science Fiction', image: require('../../assets/book.png') },
            { id: '6', name: 'The Great Adventure', views: 800, status: 'Published', category: 'Adventure', image: require('../../assets/book.png') },
            { id: '7', name: 'Underwater Mysteries', views: 350, status: 'Published', category: 'Adventure', image: require('../../assets/book.png') },
            { id: '8', name: 'Haunted Tales', views: 450, status: 'Published', category: 'Horror', image: require('../../assets/book.png') },
            { id: '9', name: 'Fantasy Realm', views: 1500, status: 'Published', category: 'Fantasy', image: require('../../assets/book.png') },
            { id: '10', name: 'Tech Innovations', views: 600, status: 'Pending', category: 'Technology', image: require('../../assets/book.png') },
            { id: '11', name: 'Historical Adventures', views: 300, status: 'Rejected', category: 'History', image: require('../../assets/book.png') },
            { id: '12', name: 'Mystical Creatures', views: 400, status: 'Pending', category: 'Fantasy', image: require('../../assets/book.png') },
        ];

        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
        setIsAccountVerified(true);
    };

    const [isWithdrawalModalVisible, setIsWithdrawalModalVisible] = useState(false);

    const toggleWithdrawalModal = () => {
        setIsWithdrawalModalVisible(!isWithdrawalModalVisible);
    };

    const handleAddProduct = () => {
        if (!isAccountVerified) {
            setIsVerificationModalVisible(true);
        } else {
            navigation.navigate('AddBook');
        }
    };

    const handleViewProduct = (product) => {
        if (product.status === 'Rejected') {
            navigation.navigate('RejectedBookDetails', { bookId: product.id });
        } else if (product.status === 'Pending') {
            // Do nothing if the product status is 'Pending'
            return;
        } else {
            navigation.navigate('BookDetails');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dashboard</Text>
                <TouchableOpacity style={styles.AddButton} onPress={handleAddProduct}>
                    <Add size={30} color="#AD52F7" variant="Linear" />
                </TouchableOpacity>
            </View>
            {!isAccountVerified && (
                <Pressable onPress={handlePress}>
                    <View style={styles.verificationTextContainer}>
                        <Text style={styles.verificationText}>Your document is being verified. This process usually takes a...</Text>
                    </View>
                </Pressable>
            )}

            <ScrollView style={styles.content}>
                <View style={styles.cardsContainer}>
                    <View style={styles.card}>
                        <View style={styles.cardIcon}>
                            <Wallet size={24} color="#3B125A" variant="Linear" />
                        </View>
                        <Text style={styles.cardValue}>{formatValue(totalEarnings)}</Text>
                        <TouchableOpacity style={styles.withdrawButton} onPress={toggleWithdrawalModal}>
                            <Text style={styles.withdrawText}>Withdraw</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.card}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <View style={styles.cardIcon}>
                                <Book size={24} color="#3B125A" variant="Linear" />
                            </View>
                            <Text style={[styles.cardLabel, { textAlign: 'start' }]}>Books {'\n'}listed</Text>
                        </View>
                        <Text style={styles.cardValue}>0</Text>
                        <TouchableOpacity style={styles.withdrawButton} onPress={() => navigation.navigate('ViewAllUploads')}>
                            <Text style={styles.withdrawText}>View</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.catalogHeader}>
                    <TouchableOpacity onPress={() => setShowPendingApproval(false)}>
                        <Text style={[styles.sectionTitle, !showPendingApproval && styles.sectionTitleActive]}>Recently Added</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowPendingApproval(true)}>
                        <Text style={[styles.sectionTitle, showPendingApproval && styles.sectionTitleActive]}>Pending Approval</Text>
                    </TouchableOpacity>
                </View>

                {products.length === 0 ? (
                    <View style={styles.noProductAvailable}>
                        <Image source={require('../../assets/Boxes.png')} style={styles.illustration} contentFit="contain" />
                        <Text style={styles.subtitle}>You have no requests yet</Text>
                    </View>
                ) : (
                    showPendingApproval ? (
                        <View style={styles.pendingProductsList}>
                            {products.filter(product => product.status === 'Pending' || product.status === 'Rejected').map((product) => (
                                <TouchableOpacity key={product.id} style={styles.pendingProductItem} onPress={() => handleViewProduct(product)}>
                                    <Image source={product.image} style={styles.pendingProductImage} />
                                    <View style={styles.pendingProductInfo}>
                                        <Text style={styles.pendingProductName}>{product.name}</Text>
                                        <Text style={styles.pendingProductCategory}>{product.category}</Text>
                                        <Text style={[styles.pendingProductStatus, product.status === 'Pending' ? styles.pendingColor : styles.rejectedColor]}>{product.status}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.recentProductsList}>
                            {products.filter(product => product.status === 'Published').map((product) => (
                                <TouchableOpacity key={product.id} style={styles.recentProductItem} onPress={() => handleViewProduct(product)}>
                                    <View style={styles.bookContainer}>
                                        <Image source={product.image} style={styles.recentProductImage} />
                                        <View style={styles.viewsOverlay}>
                                            <AntDesign name="eye" size={12} color="#fff" />
                                            <Text style={styles.viewsCount}>{product.views >= 1000 ? `${(product.views / 1000).toFixed(1)}k` : product.views}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.recentProductName}>{product.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )
                )}
            </ScrollView>

            <Modal visible={isVerificationModalVisible} transparent={true} animationType="slide" onRequestClose={() => setIsVerificationModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={styles.closeModalButton} onPress={() => setIsVerificationModalVisible(false)}>
                            <AntDesign name="close" size={24} color="black" />
                        </TouchableOpacity>
                        <Image source={require('../../assets/bro.png')} style={styles.illustration} contentFit="contain" />
                        <Text style={styles.modalTitle}>Oops</Text>
                        <Text style={styles.modalMessage}>You can't add products until your account has been verified.</Text>
                    </View>
                </View>
            </Modal>

            <WithdrawalModal isVisible={isWithdrawalModalVisible} onClose={toggleWithdrawalModal} />
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
    AddButton: {
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
    catalogHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 35,
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
    pendingProductsList: {
        paddingHorizontal: 20,
    },
    pendingProductItem: {
        width: '100%',
        alignItems: 'flex-start',
        borderRadius: 12,
        backgroundColor: '#fff',
        marginBottom: 20,
        flexDirection: 'row',
    },
    pendingProductImage: {
        width: 120,
        height: 80,
        borderRadius: 8,
    },
    pendingProductInfo: {
        marginLeft: 12,
        justifyContent: 'center',
    },
    pendingProductName: {
        fontSize: 16,
        fontWeight: '600',
    },
    pendingProductStatus: {
        fontSize: 13,
        fontWeight: 500,
    },
    pendingColor: {
        color: '#EDA411',
    },
    rejectedColor: {
        color: 'red',
    },
    pendingProductCategory: {
        fontSize: 14,
        color: '#BCBABA',
        fontWeight: 400,
    },
    recentProductsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    recentProductItem: {
        width: '30%',
        alignItems: 'flex-start',
        borderRadius: 12,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    recentProductImage: {
        width: '100%',
        height: 180,
        borderRadius: 8,
    },
    recentProductName: {
        fontSize: 14,
        marginBottom: 4,
        fontWeight: '600',
    },
    viewsCount: {
        fontSize: 12,
        color: '#fff',
        marginLeft: 4,
    },
    viewsOverlay: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 4,
        borderRadius: 4,
    },
    noProductAvailable: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        paddingVertical: 20,
    },
    illustration: {
        alignSelf: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginVertical: 20,
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
    bookContainer: {
        position: 'relative',
        width: '100%',
        marginBottom: 8,
    },
});