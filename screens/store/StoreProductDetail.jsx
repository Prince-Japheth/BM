import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    BackHandler,
    TouchableOpacity,
    Image,
    ScrollView,
    Pressable,
} from 'react-native';
import { ArrowLeft2 } from 'iconsax-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ProductDetailProps = {
    navigation: null,
    route: null
};

export const useCustomBackHandler = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const handleBackPress = React.useCallback(() => {
        // Get the navigation state
        const state = navigation.getState();

        // Find the index of the current route
        const currentIndex = state.index;

        // If there's no previous route, do nothing
        if (currentIndex <= 0) {
            return false;
        }

        // Get the previous route
        const previousRoute = state.routes[currentIndex - 1];

        if (previousRoute.name === 'UploadStoreProduct') {
            // If previous screen is BankSelectionScreen, go back two screens
            if (currentIndex > 1) {
                navigation.goBack(); // First, dismiss BankSelectionScreen
                navigation.goBack(); // Then go to the screen before BankSelectionScreen
            }
        } else {
            // Normal back navigation
            navigation.goBack();
        }

        return true;
    }, [navigation]);

    useEffect(() => {
        // Add hardware back button listener
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        // Cleanup listener when component unmounts
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [handleBackPress]);

    return handleBackPress;
};

export default function ProductDetail({ navigation, route }) {
    const [inStock, setInStock] = useState(true);


    const handleBackPress = useCustomBackHandler();


    const colors = [
        { id: 'brown', color: '#8B4513' },
        { id: 'tan', color: '#D2B48C' },
        { id: 'red', color: '#FF0000' },
    ];

    const productImages = [
        require('../../assets/teddy.png'),
        require('../../assets/teddy-red.png'),
        require('../../assets/teddy-tan.png'),
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress}>
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Product detail</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.productHeader}>
                    <Image source={require('../../assets/teddy.png')} style={styles.mainImage} />
                    <View style={styles.productInfo}>
                        <Text style={styles.productName}>Brown Teddy bear</Text>
                        <Text style={styles.productPrice}>$30</Text>
                        <Pressable onPress={() => setInStock(!inStock)} style={styles.stockContainer}>
                            <Text style={[styles.stockText, inStock ? styles.inStock : styles.outOfStock]}>
                                {inStock ? 'In stock' : 'Out of stock'}
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>
                        A robotsky colored gaming mouse is super cool. It usually has a sleek design with a mix of metallic and
                        futuristic colors, giving it a unique and eye-catching appearance. It often comes with customizable RGB
                        lighting, programmable buttons, high DPI settings for precise movements, and an ergonomic shape for
                        comfortable gaming sessions.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Features</Text>
                    <View style={styles.featuresList}>
                        <Text style={styles.featureItem}>• Number of Buttons: 6</Text>
                        <Text style={styles.featureItem}>• Hand Orientation: Right</Text>
                        <Text style={styles.featureItem}>• Type: WIRED</Text>
                        <Text style={styles.featureItem}>• Brand Name: Robotsky</Text>
                        <Text style={styles.featureItem}>• Origin: Mainland China</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Size</Text>
                    <View style={styles.sizeContainer}>
                        <View
                            style={[styles.sizeButton]}
                        >
                            <Text style={[styles.sizeText]}>
                                Small
                            </Text>
                        </View>
                        <View
                            style={[styles.sizeButton]}
                        >
                            <Text style={[styles.sizeText]}>
                                Medium
                            </Text>
                        </View>
                        <View
                            style={[styles.sizeButton]}
                        >
                            <Text style={[styles.sizeText]}>
                                Large
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Colour</Text>
                    <View style={styles.colorContainer}>
                        {colors.map((color) => (
                            <View
                                key={color.id}
                                style={[
                                    styles.colorButton,
                                    { backgroundColor: color.color },
                                ]}
                            />
                        ))}
                    </View>
                </View>


                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Product image</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
                        {productImages.map((image, index) => (
                            <Image key={index} source={image} style={styles.galleryImage} />
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                    // In ProductDetail.tsx
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('EditStoreProduct')}
                    >
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        paddingHorizontal: 10,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 16,
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
    productName: {
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#595757',
    },
    stockContainer: {
        alignSelf: 'flex-start',
    },
    stockText: {
        fontSize: 14,
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 5,
    },
    inStock: {
        color: '#22C55E',
        backgroundColor: '#DCFCE7',
    },
    outOfStock: {
        color: '#666',
        backgroundColor: '#F3F4F6',
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
    featuresList: {
        gap: 8,
    },
    featureItem: {
        fontSize: 14,
        color: '#666',
    },
    sizeContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    sizeButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black',
    },
    sizeText: {
        color: '#666',
    },
    colorContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    colorButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
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
});