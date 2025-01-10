import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Setting4 } from 'iconsax-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const StoreOrders = () => {
    const navigation = useNavigation(); // Initialize navigation
    const [activeTab, setActiveTab] = useState('pending');
    const [orders, setOrders] = useState([
        {
            id: '1',
            title: 'Brown teddybear',
            size: 'Small',
            quantity: 1,
            image: require('../../assets/teddy.png'),
            status: 'pending',
            isAccepted: false
        },
        {
            id: '2',
            title: 'Tee shirt',
            size: 'Small',
            quantity: 1,
            image: require('../../assets/teddy.png'),
            status: 'pending',
            isAccepted: false
        },
        {
            id: '3',
            title: 'Groceries',
            quantity: 15,
            image: require('../../assets/teddy.png'),
            status: 'pending',
            isAccepted: false
        },
        // Add completed orders
        {
            id: '4',
            title: 'Blue Backpack',
            size: 'Medium',
            quantity: 1,
            image: require('../../assets/teddy.png'),
            status: 'completed',
            isAccepted: true
        },
        {
            id: '5',
            title: 'Running Shoes',
            size: 'Large',
            quantity: 2,
            image: require('../../assets/teddy.png'),
            status: 'completed',
            isAccepted: true
        }
    ]);


    const tabs = [
        { id: 'pending', label: 'Pending', count: orders.filter(order => order.status === 'pending').length },
        { id: 'rejected', label: 'Rejected', count: orders.filter(order => order.status === 'rejected').length },
        { id: 'completed', label: 'Completed', count: orders.filter(order => order.status === 'completed').length },
    ];

    const handleAccept = (orderId) => {
        setOrders(orders.map(order =>
            order.id === orderId
                ? { ...order, isAccepted: true }
                : order
        ));
        // Navigate to StoreOrderDetails
        navigation.navigate('StoreOrderDetails', { orderId });
    };

    const handleOrderPress = (orderId) => {
        // Navigate to StoreOrderDetails
        navigation.navigate('StoreOrderDetails', { orderId });
    };

    const handleReject = (orderId) => {
        // Update the status to rejected
        setOrders(orders.map(order =>
            order.id === orderId && !order.isAccepted
                ? { ...order, status: 'rejected' }
                : order
        ));
    };

    const renderItem = ({ item }) => {
        if (item.status === 'rejected') {
            return (
                <View style={[{ backgroundColor: 'white', boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.02)', height: '70' }]}>
                    <TouchableOpacity style={styles.orderItem} onPress={() => handleOrderPress(item.id)} activeOpacity={0.5}>
                        <Image source={item.image} style={styles.orderImage} />
                        <View style={styles.orderDetails}>
                            <Text style={styles.orderTitle}>{item.title}</Text>
                            <View style={styles.detailsRow}>
                                {item.size && <Text style={styles.orderSize}>{item.size}</Text>}
                                <Text style={styles.orderQuantity}>{`${item.quantity}`}</Text>
                            </View>
                        </View>
                        <View style={styles.rejectedBadge}>
                            <Text style={styles.rejectedText}>Rejected</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }

        // Add a completed badge for completed items
        if (item.status === 'completed') {
            return (
                <View style={[{ backgroundColor: 'white', boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.02)', height: '70' }]}>
                    <TouchableOpacity style={styles.orderItem} onPress={() => handleOrderPress(item.id)} activeOpacity={0.5}>
                        <Image source={item.image} style={styles.orderImage} />
                        <View style={styles.orderDetails}>
                            <Text style={styles.orderTitle}>{item.title}</Text>
                            <View style={styles.detailsRow}>
                                {item.size && <Text style={styles.orderSize}>{item.size}</Text>}
                                <Text style={styles.orderQuantity}>{`${item.quantity}`}</Text>
                            </View>
                        </View>
                        <View style={styles.completedBadge}>
                            <AntDesign name="check" size={15} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }


        // Existing rendering for non-rejected items
        return (
            <View style={[{ backgroundColor: 'white', boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.02)', marginBottom: '20', height: '70' }]}>
                <TouchableOpacity style={styles.orderItem} onPress={() => handleOrderPress(item.id)} activeOpacity={0.5}>
                    <Image source={item.image} style={styles.orderImage} />
                    <View style={styles.orderDetails}>
                        <Text style={styles.orderTitle}>{item.title}</Text>
                        <View style={styles.detailsRow}>
                            {item.size && <Text style={styles.orderSize}>{item.size}</Text>}
                            <Text style={styles.orderQuantity}>{`${item.quantity}`}</Text>
                        </View>
                    </View>
                    {item.isAccepted ? (
                        <View style={styles.acceptedBadge}>
                            <Text style={styles.acceptedText}>Accepted</Text>
                        </View>
                    ) : (
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.gradientButtonContainer}
                                onPress={() => handleAccept(item.id)}
                            >
                                <LinearGradient
                                    colors={['#AD52F7', '#CD8DFE']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.gradientButton}
                                >
                                    <Text style={styles.buttonText}>Accept</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    const renderHiddenItem = ({ item }) => {
        // Only show reject button for non-accepted, non-rejected items
        if (item.isAccepted || item.status === 'rejected') {
            return null;
        }

        return (
            <View style={styles.rowBack}>
                <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleReject(item.id)}
                >
                    <Text style={styles.rejectText}>Reject</Text>
                </TouchableOpacity>
            </View>
        );
    };




    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [timeframe, setTimeframe] = useState('Daily');
    const options = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    const filteredOrders = 
    activeTab === 'pending'
        ? orders.filter(order => order.status === 'pending')
        : orders.filter(order => order.status === activeTab);

return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Orders</Text>
        </View>

        <View style={styles.tabs}>
            <View style={styles.tabsContainer}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => setActiveTab(tab.id)}
                    >
                        {activeTab === tab.id ? (
                            <LinearGradient
                                colors={['#AD52F7', '#CD8DFE']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientBackground}
                            >
                                <Text style={[styles.tabText, styles.activeTabText]}>
                                    {`${tab.label} (${tab.id === 'pending'
                                        ? orders.filter(order => order.status === 'pending' && !order.isAccepted).length
                                        : orders.filter(order => order.status === tab.id).length
                                        })`}
                                </Text>
                            </LinearGradient>
                        ) : (
                            <View style={styles.tab}>
                                <Text style={styles.tabText}>
                                    {`${tab.label} (${tab.id === 'pending'
                                        ? orders.filter(order => order.status === 'pending' && !order.isAccepted).length
                                        : orders.filter(order => order.status === tab.id).length
                                        })`}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
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
        </View>

        {filteredOrders.length === 0 ? (
            <View style={styles.emptyStateContainer}>
                <Image 
                    source={require('../../assets/emptyorderimg.png')} 
                    style={styles.emptyStateImage}
                    resizeMode="contain"
                />
                <Text style={styles.emptyStateText}>No orders in this category</Text>
            </View>
        ) : (
            <SwipeListView
                data={filteredOrders}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-75}
                disableRightSwipe={true}
                // Disable swipe for rejected or accepted items
                disableSwipeToReject={(item) => item.isAccepted || item.status === 'rejected'}
                keyExtractor={item => item.id}
            />
        )}
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
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
        // justifyContent: 'space-between',
        // backgroundColor: '#f1e1ff',
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


    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: 'white',
    },
    orderImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    orderDetails: {
        flex: 1,
        marginLeft: 16,
        gap: 5,
    },
    orderTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderSize: {
        color: 'black',
        marginRight: 10,
        backgroundColor: '#F7F7F7',
        fontWeight: 600,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 5,
    },
    orderQuantity: {
        color: 'black',
        backgroundColor: '#F7F7F7',
        fontWeight: 600,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 100,
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
        justifyContent: 'ceenter',
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
        marginBottom: '20',
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
});

export default StoreOrders;