// C:\Users\USER\Documents\bondyt-merchant-app\screens\security\UpdateSecurityPrice.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft2 } from 'iconsax-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UpdatePriceScreen() {
    const navigation = useNavigation();
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newPrice, setNewPrice] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const storedMerchantId = await AsyncStorage.getItem('merchantId');
                const token = await AsyncStorage.getItem('accessToken');
                if (!storedMerchantId || !token) {
                    throw new Error('Merchant ID or Access token not found.');
                }

                const response = await api.get(`/merchants/${storedMerchantId}/base-price`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { data } = response.data;

                if (data && data.base_price) {
                    setBalance(data.base_price.toString());
                    setNewPrice(data.base_price.toString());
                } else {
                    console.error('Base price not found');
                }
            } catch (error) {
                console.error('Error fetching base price:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, []);

    const handlePriceUpdate = async () => {
        setButtonLoading(true);
        try {
            const storedMerchantId = await AsyncStorage.getItem('merchantId');
            const token = await AsyncStorage.getItem('accessToken');
            if (!storedMerchantId || !token) {
                throw new Error('Merchant ID or Access token not found.');
            }

            const response = await api.patch(
                `/merchants/${storedMerchantId}/securities`,
                { newPrice: parseFloat(newPrice) },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.status === 200) {
                const { newPrice: updatedPrice } = response.data.data;
                setBalance(updatedPrice.toString());
                setSuccessMessage('Security price set successfully');
                setTimeout(() => setSuccessMessage(''), 2000);
            } else {
                setSuccessMessage('Error updating price');
            }
        } catch (error) {
            console.error('Error updating price:', error);
            alert('Error updating price');
        } finally {
            setButtonLoading(false);
        }
    };

    const handlePriceChange = (text) => {
        const formattedPrice = text.replace(/[^0-9.]/g, '');
        setNewPrice(formattedPrice);
    };

    return (
        <View style={styles.setPriceContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.placeholder} />
            </View>

            {successMessage && (
                <View style={styles.successMessageContainer}>
                    <Text style={styles.successMessage}>{successMessage}</Text>
                </View>
            )}

            <View style={styles.setPriceMainContentContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/request_quote.png')}
                        style={styles.illustrationImage}
                        contentFit="contain"
                    />
                </View>

                {loading ? (
                    <ActivityIndicator size="small" color="#AD52F7" style={{ marginTop: 30 }} />
                ) : (
                    <TextInput
                        style={styles.priceInput}
                        placeholder="$0.00"
                        keyboardType="numeric"
                        value={`$${newPrice}`}
                        onChangeText={handlePriceChange}
                    />
                )}

                <TouchableOpacity
                    style={styles.setPriceButtonContainer}
                    onPress={handlePriceUpdate}
                    disabled={buttonLoading}
                >
                    <LinearGradient
                        colors={['#AD52F7', '#CD8DFE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.setPriceGradientButton}
                    >
                        {buttonLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.setPriceButtonLabel}>Update</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}





const styles = StyleSheet.create({
    setPriceContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    successMessageContainer: {
        backgroundColor: '#E6F4EA',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
        margin: 20,
    },
    successMessage: {
        color: '#34A853',
        fontSize: 14,
        textAlign: 'center',
    },
    setPriceMainContentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        margin: 20,
        borderRadius: 20,
        boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.05)',
    },
    illustrationImage: {
        alignSelf: 'center',
    },
    imageContainer: {
        alignSelf: 'center',
        backgroundColor: '#f1e1ff',
        padding: 20,
        borderRadius: 100,
    },
    priceInput: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 20,
        color: '#000',
    },
    setPriceButtonContainer: {
        width: 152,
        height: 40,
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 30,
    },
    setPriceGradientButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    setPriceButtonLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});