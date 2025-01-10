import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
    Modal,
    Pressable,
} from 'react-native';
import WithdrawalModal from '../../components/WithdrawalModal';
import WhatsappButton from '../../components/WhatsappButton';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ShopAdd,
    Home2,
    Wallet,
    Box,
    Profile,
    Whatsapp,
    ArrowRight2,
    Star1,
    Setting4,
} from 'iconsax-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const products = [

];

const categories = ['Men', 'Women', 'Groceries'];

const formatValue = (value, isProduct = false) => {
    if (isProduct) {
        return value.toLocaleString(); // Format for whole numbers without the dollar sign
    }
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(2)}`; // Default to two decimal places for smaller values
};

const totalEarnings = 1234567; // Example total value

export default function StoreDashboard() {
    const navigation = useNavigation();
    const [selectedCategory, setSelectedCategory] = useState('Women');
    const [showInsight, setShowInsight] = useState(false);
    const [timeframe, setTimeframe] = useState('Daily');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isVerificationModalVisible, setIsVerificationModalVisible] = useState(false);
    const options = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    const [isAccountVerified, setIsAccountVerified] = useState(false);
    const [products, setProducts] = useState([]);


    const handlePress = () => {
        const newProducts = [
            {
                id: '1',
                name: 'Brown teddy bear',
                price: 30,
                sales: '50-sold',
                image: require('../../assets/teddy.png'),
                rating: 5,
            },
            {
                id: '2',
                name: 'Brown teddy bear',
                price: 30,
                sales: '50-sold',
                image: require('../../assets/teddy.png'),
                rating: 5,
            },
            {
                id: '3',
                name: 'Brown teddy bear',
                price: 30,
                sales: '50-sold',
                image: require('../../assets/teddy.png'),
                rating: 5,
            },
        ];

        // Update products array
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
        setIsAccountVerified(true); // Assuming setIsAccountVerified is already defined
    };

    // Withdrawal modal state
    const [isWithdrawalModalVisible, setIsWithdrawalModalVisible] = useState(false);

    // Toggle function for withdrawal modal
    const toggleWithdrawalModal = () => {
        setIsWithdrawalModalVisible(!isWithdrawalModalVisible);
    };
    const handleAddProduct = () => {
        if (!isAccountVerified) {
            setIsVerificationModalVisible(true);
        } else {
            navigation.navigate('UploadStoreProduct')
        }
    };

    const handleViewProduct = () => {
        navigation.navigate('StoreProductDetail');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Dashboard</Text>
                </View>
                <TouchableOpacity style={styles.ShopAddButton} onPress={handleAddProduct}>
                    <ShopAdd size={20} color="#000" variant="Linear" />
                </TouchableOpacity>
            </View>
            {!isAccountVerified && (
                <Pressable onPress={handlePress} >
                    <View style={styles.verificationTextContainer}>
                        <Text style={styles.verificationText}>
                            Your document is being verified. This process usually takes a...
                        </Text>
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
                        <TouchableOpacity style={styles.withdrawButton}
                            onPress={toggleWithdrawalModal}>
                            <Text style={styles.withdrawText}>Withdraw</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.cardIcon}>
                            <Box size={24} color="#3B125A" variant="Linear" />
                        </View>
                        <Text style={styles.cardValue}>{formatValue(products.length, true)}</Text>
                        <Text style={styles.cardLabel}>Available products</Text>
                    </View>

                </View>

                <View style={styles.catalogHeader}>
                    <TouchableOpacity onPress={() => setShowInsight(false)}>
                        <Text
                            style={[
                                styles.sectionTitle,
                                !showInsight && styles.sectionTitleActive,
                            ]}
                        >
                            Product Catalog
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

                {products.length === 0 ? (
                    <View style={styles.noProductAvailable}>
                        <Image
                            source={require('../../assets/Boxes.png')}
                            style={styles.illustration}
                            contentFit="contain"
                        />

                        <Text style={styles.subtitle}>
                            You have not added any products yet
                        </Text>

                        <TouchableOpacity
                            style={styles.buttonContainer} onPress={handleAddProduct}
                        >
                            <LinearGradient
                                colors={['#AD52F7', '#CD8DFE']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Add Product</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                ) : (
                    // Show this when there are products
                    !showInsight ? (
                        <View style={styles.productCatalog}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.categoriesContainer}
                            >
                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            styles.categoryChip,
                                            selectedCategory === category && styles.selectedCategoryChip,
                                        ]}
                                        onPress={() => setSelectedCategory(category)}
                                    >
                                        <Text
                                            style={[
                                                styles.categoryText,
                                                selectedCategory === category && styles.selectedCategoryText,
                                            ]}
                                        >
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <View style={styles.productsList}>
                                {products.map((product) => (
                                    <TouchableOpacity key={product.id} style={styles.productItem}
                                        onPress={handleViewProduct}>
                                        <Image source={product.image} style={styles.productImage} />
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productName}>{product.name}</Text>
                                            <Text style={styles.productSales}>{product.sales}</Text>
                                        </View>
                                        <View style={styles.priceContainer}>
                                            <Text style={styles.productPrice}>${product.price}</Text>
                                            <TouchableOpacity style={styles.productArrow}>
                                                <ArrowRight2 size={16} color='#BCBABA' />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <View style={styles.insightView}>
                            {/* Insight view content */}
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
                                    <Text style={styles.cardTitle}>Amount</Text>
                                    <Text style={styles.orderCardValue}>$ 0.00</Text>
                                </View>
                                <View style={styles.orderCard}>
                                    <Text style={styles.cardTitle}>Average order</Text>
                                    <Text style={styles.orderCardValue}>$ 0.00</Text>
                                </View>
                                <View style={styles.orderCard}>
                                    <Text style={styles.cardTitle}>Average order</Text>
                                    <Text style={styles.orderCardValue}>$ 0.00</Text>
                                </View>
                            </View>

                            <View style={styles.productsList}>
                                <Text
                                    style={[styles.sectionTitle, showInsight && styles.sectionTitleActive]}
                                >
                                    Most Popular Item
                                </Text>

                                {products.map((product) => (
                                    <TouchableOpacity key={product.id} style={styles.productItem}>
                                        <Image source={product.image} style={styles.productImage} />
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productName}>{product.name}</Text>
                                            <Text style={styles.productSales}>{product.sales}</Text>
                                        </View>
                                        <View style={styles.starContainer}>
                                            {[...Array(product.rating)].map((_, index) => (
                                                <AntDesign name="star" size={15} color="gold" />
                                            ))}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )
                )}



            </ScrollView>



            {/* Verification Modal */}
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
                            You can't add products until your account has been verified.
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
    categoriesContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    categoryChip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 10,
    },
    selectedCategoryChip: {
        backgroundColor: '#000',
    },
    categoryText: {
        color: '#666',
    },
    selectedCategoryText: {
        color: '#fff',
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
    priceContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 12,
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
        marginBottom: 8,
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
});

