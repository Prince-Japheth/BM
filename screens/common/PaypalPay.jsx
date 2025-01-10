import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    BackHandler,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft2, ArrowDown2 } from 'iconsax-react-native';
import { LinearGradient } from 'expo-linear-gradient';


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

        if (previousRoute.name === 'BankSelectionScreen') {
            // If previous screen is BankSelectionScreen, go back two screens
            if (currentIndex > 1) {
                navigation.goBack(); // First, dismiss BankSelectionScreen
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

const PaypalPay = ({ navigation, route }) => {
    const [modalVisible, setModalVisible] = useState(false); // State for controlling modal visibility

    
    const handleBackPress = useCustomBackHandler();

    const handleSubmit = () => {
        setModalVisible(true); // Open modal on submit
    };

    // Function to handle closing the modal and navigating
    const handleCloseModal = () => {
        setModalVisible(false);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress}>
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bank Set Up</Text>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
                <Text style={styles.title}>
                    How much do you want to withdraw from your account
                </Text>

                <Text style={styles.label}>Enter Amount</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Minimum of $1"
                    keyboardType="numeric"
                />

                {/* Paypal Email */}
                <Text style={styles.label}>Paypal Email</Text>
                <TextInput style={styles.input} />

                {/* Note */}
                <Text style={styles.label}>Note</Text>
                <TextInput style={styles.input} />

                {/* Submit Button */}
                <TouchableOpacity onPress={handleSubmit}>
                    <LinearGradient
                        colors={['#AD52F7', '#CD8DFE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.submitButton}
                    >
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Modal for Withdrawal Info */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)} // Close modal on back press
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Image
                                source={require('../../assets/withdrawal.png')}
                                style={{
                                    width: 80,
                                    resizeMode: 'contain',
                                    marginBottom: 20,
                                }}
                            />
                            <Text style={styles.modalTitle}>Withdrawal in progress</Text>
                            <Text style={styles.modalText}>
                                withdrawals take 10-15 min to process, you can track your withdrawal on the transations history section
                            </Text>

                            {/* Close Button - This will also navigate to StoreDashboard */}
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={handleCloseModal} // Calls the function to close modal and navigate
                            >
                                <Text style={styles.modalButtonText}>Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    formContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 25,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 25,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    inputText: {
        fontSize: 14,
        color: 'black',
    },
    submitButton: {
        backgroundColor: '#8a2be2',
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContainer: {
        backgroundColor: '#3B125AFC',
        padding: 20,
        borderRadius: 10,
        width: '70%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
        color: 'white',
    },
    modalButton: {
        backgroundColor: '#8a2be2',
        paddingVertical: 12,
        paddingHorizontal: 45,
        borderRadius: 100,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PaypalPay;
