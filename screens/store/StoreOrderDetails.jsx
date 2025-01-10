import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { ArrowLeft2 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

const mockOrders = [
    { id: '1234hg53', title: 'Tee shirt', size: 'Small', quantity: 1, price: 29.99, color: '#DFDFDF' },
    { id: '5678ij91', title: 'Hoodie', size: 'Medium', quantity: 2, price: 49.99, color: '#DFDFDF' },
    { id: '9012kl34', title: 'Jeans', size: 'Large', quantity: 1, price: 59.99, color: '#DFDFDF' },
    { id: '5678mn90', title: 'Cap', size: 'One Size', quantity: 3, price: 19.99, color: '#DFDFDF' },
];

const PinKeypad = ({ onKeyPress, onDelete }) => {
    const numberRows = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        []
    ];

    return (
        <View style={styles.keypadContainer}>
            {numberRows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.keypadRow}>
                    {row.map((number, index) => (
                        <TouchableOpacity
                            key={number}
                            style={[
                                styles.keypadButton,
                                rowIndex === numberRows.length - 1
                            ]}
                            onPress={() => onKeyPress(number)}
                        >
                            <Text style={styles.keypadButtonText}>{number}</Text>
                        </TouchableOpacity>
                    ))}
                    {rowIndex === numberRows.length - 1 && (
                        <View style={styles.rightAlignedButtons}>
                            <View style={[styles.hidden]} />
                            <TouchableOpacity
                                style={[styles.keypadButton, styles.zeroButton]}
                                onPress={() => onKeyPress(0)}
                            >
                                <Text style={styles.keypadButtonText}>0</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.keypadButton, styles.deleteButton]}
                                onPress={onDelete}
                            >
                                <Text style={styles.deleteButtonText}><ArrowLeft2 size={18} color="red" /></Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
};

const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setOrders(mockOrders);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch orders. Please try again.');
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return { orders, loading, error };
};

const OrderDetails = () => {
    const navigation = useNavigation();
    const [isComplete, setIsComplete] = useState(false);
    const { orders, loading, error } = useOrders();
    const [isModalVisible, setModalVisible] = useState(false);
    const [pin, setPin] = useState('');

    const handlePinInput = (number) => {
        if (pin.length < 4) {
            setPin(prev => prev + number);
        }
    };

    const handlePinDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    const handleToggle = () => {
        if (!isComplete) {
            setModalVisible(true);
        } else {
            setIsComplete(false);
        }
    };

    const handlePinSubmit = () => {
        if (pin.length === 4) {
            // Here you would typically validate the PIN
            setModalVisible(false);
            setIsComplete(true);
            setPin('');
        }
    };

    useEffect(() => {
        if (pin.length === 4) {
            handlePinSubmit();
        }
    }, [pin]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Orders details</Text>
            </View>

            {/* Order List */}
            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : error ? (
                <View style={styles.centerContent}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <ScrollView style={styles.orderList}>
                    {orders.map((order) => (
                        <View key={order.id} style={styles.orderItem}>
                            <Image
                                source={require('../../assets/teddy.png')}
                                style={styles.productImage}
                            />
                            <View style={styles.orderInfo}>
                                <Text style={styles.productTitle}>{order.title}</Text>
                                <View style={styles.detailsRow}>
                                    <Text style={styles.size}>{order.size}</Text>
                                    <View style={[styles.colorCircle, { backgroundColor: order.color }]} />
                                </View>
                                <Text style={styles.price}>Price: <Text style={styles.boldText}>${order.price ? order.price.toFixed(2) : 'N/A'}</Text></Text>
                                <View style={styles.lastRow}>
                                    <Text style={styles.quantity}>Quantity: <Text style={styles.boldText}>{order.quantity}</Text></Text>
                                    <Text style={styles.orderId}>ID:{order.id}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Bottom Toggle */}
            <View style={styles.footer}>
                <Switch
                    value={isComplete}
                    onValueChange={handleToggle}
                    trackColor={{ false: '#BCBABA', true: '#CD8DFE' }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#BCBABA"
                />
                <Text style={styles.toggleText}>
                    {isComplete ? 'Complete' : 'Incomplete'}
                </Text>
            </View>

            {/* PIN Modal */}
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => {
                    setModalVisible(false);
                    setPin('');
                }}
                style={styles.modal}
                backdropOpacity={0.5}
                swipeDirection={['down']}
                onSwipeComplete={() => {
                    setModalVisible(false);
                    setPin('');
                }}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHandle} />
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Enter confirmation pin</Text>
                    </View>

                    <View style={styles.pinContainer}>
                        {[...Array(4)].map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.pinInput,
                                    pin[index] ? styles.pinInputFilled : null
                                ]}
                            >
                                <Text style={styles.pinText}>{pin[index] || ''}</Text>
                            </View>
                        ))}
                    </View>

                    <PinKeypad
                        onKeyPress={handlePinInput}
                        onDelete={handlePinDelete}
                    />
                </View>
            </Modal>
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
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        marginLeft: 12,
    },
    orderList: {
        flex: 1,
    },
    orderItem: {
        padding: 16,
        boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.05)',
        margin: 16,
        borderRadius: 15,
    },
    productImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        marginBottom: 10,
    },
    orderInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    lastRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#000000',
    },
    orderId: {
        fontSize: 14,
        color: '#6B7280',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    size: {
        fontSize: 16,
        color: '#374151',
        marginRight: 12,
        backgroundColor: '#f7f7f7',
        fontWeight: 700,
        padding: 5,
        borderRadius: 10,
        marginVertical: 15,
    },
    colorCircle: {
        width: 30,
        height: 20,
        borderRadius: 9,
        marginLeft: 8,
        borderWidth: 1,
        borderColor: 'black',
    },
    quantity: {
        fontSize: 14,
        color: '#374151',
    },
    price: {
        fontSize: 16,
        color: '#374151',
        marginVertical: 8,
    },
    boldText: {
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#FFFFFF',
    },
    toggleText: {
        marginLeft: 12,
        fontSize: 16,
        color: '#374151',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 30,
    },
    modalHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 2.5,
        marginBottom: 15,
        marginHorizontal: 'auto',
        marginTop: 20,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '400',
        color: '#595757',
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
        gap: 10,
    },
    pinInput: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#f1e1ff',
    },
    pinInputFilled: {
        backgroundColor: '#f1e1ff',
        color: 'black',
    },
    pinText: {
        fontSize: 24,
        color: 'black',
        textAlign: 'center',
        margin: 'auto',
    },
    keypadContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        gap: 60,
    },
    keypadButton: {
        width: 49,
        height: 49,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#AD52F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    keypadButtonText: {
        fontSize: 24,
        color: '#000000',
    },
    rightAlignedButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
        gap: 60,
    },
    hidden: {
        width: 49,
        height: 49,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    zeroButton: {
        width: 49,
        height: 49,
    },
    deleteButton: {
        borderColor: '#FF4444',
    },
});

export default OrderDetails;

