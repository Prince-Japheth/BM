import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { ArrowLeft2 } from 'iconsax-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddSalesManager = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [focusedInput, setFocusedInput] = useState(null);
    const [loading, setLoading] = useState(false);
    const scrollViewRef = useRef(null);

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleAddManager = async () => {
        const [firstName, lastName] = fullName.split(' ');

        // Clear previous messages
        setErrorMessage('');
        setSuccessMessage('');

        // Set loading state
        setLoading(true);

        try {
            // Log the attempt
            console.log('Attempting to create manager with the following details:', {
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
            });

            const payload = {
                firstName,
                lastName,
                email,
                password,
                confirmPassword
            };

            const accessToken = await AsyncStorage.getItem('accessToken');
            const merchantId = await AsyncStorage.getItem('merchantId'); // Retrieve merchantId
            console.log('Using access token:', accessToken);
            console.log('Using merchantId:', merchantId);
            if (!accessToken || !merchantId) {
                throw new Error('Access token or Merchant ID not found');
            }

            const response = await api.post(`/auth/managers`, { ...payload, merchantId }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Manager creation response:', response.data);

            if (response.data && response.data.statusCode === 201) {
                setSuccessMessage('Merchant Manager created successfully');
                // Optionally reset the form fields
                setFullName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');

                // Scroll to the top of the screen to show the success message
                setTimeout(() => {
                    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                }, 100); // Short delay to ensure success message is rendered

                // Navigate back after a short delay
                setTimeout(() => {
                    navigation.goBack();
                    navigation.pop();
                }, 2000); // 2 seconds delay
            } else {
                throw new Error(response.data.message || 'Manager creation failed');
            }
        } catch (error) {
            console.error('Error creating manager:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
            setErrorMessage(error.response?.data?.message || error.message);

            // Scroll to the bottom of the screen to show the error message
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100); // Short delay to ensure error message is rendered
        } finally {
            setLoading(false);
        }
    };

    const isButtonDisabled = !fullName || !email || !password || !confirmPassword;

    return (
        <View style={styles.container}>
            {/* Fixed Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress}>
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollView}showsVerticalScrollIndicator={false}>
                {/* Form */}
                <View style={styles.formContainer}>
                    {/* Success Message */}
                    {successMessage ? (

                        <View style={styles.successMessageContainer}>
                            <Text style={styles.successMessage}>{successMessage}</Text>
                        </View>
                    ) : null}

                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={[
                            styles.input,
                            focusedInput === 'fullName' && styles.inputFocused,
                        ]}
                        value={fullName}
                        onChangeText={setFullName}
                        onFocus={() => setFocusedInput('fullName')}
                        onBlur={() => setFocusedInput(null)}
                    />

                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={[
                            styles.input,
                            focusedInput === 'email' && styles.inputFocused,
                        ]}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput(null)}
                    />

                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={[
                            styles.input,
                            focusedInput === 'password' && styles.inputFocused,
                        ]}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        onFocus={() => setFocusedInput('password')}
                        onBlur={() => setFocusedInput(null)}
                    />

                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        style={[
                            styles.input,
                            focusedInput === 'confirmPassword' && styles.inputFocused,
                        ]}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        onFocus={() => setFocusedInput('confirmPassword')}
                        onBlur={() => setFocusedInput(null)}
                    />

                    {/* Error Message */}
                    {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                {/* Add Button */}
                <TouchableOpacity
                    onPress={handleAddManager}
                    disabled={isButtonDisabled || loading}
                    style={[styles.submitButton, isButtonDisabled && styles.disabledButton]}
                >
                    <LinearGradient
                        colors={['#AD52F7', '#CD8DFE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.touchableArea}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Text style={styles.submitButtonText}>Add</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    scrollView: {
        flexGrow: 1,
        paddingTop: 100, // Adjust for fixed header height
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 90,
        backgroundColor: 'white',
        zIndex: 10,
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingTop: 30,
    },
    successMessageContainer: {
        backgroundColor: '#E6F4EA',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        alignItems: 'center',
    },
    successMessage: {
        color: '#34A853',
        fontSize: 14,
        textAlign: 'center',
    },
    formContainer: {
        flex: 1,
        marginTop: 10, // Adjust to avoid overlap with header
    },
    label: {
        fontSize: 16,
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
    inputFocused: {
        borderColor: '#AD52F7', // On focus border color
    },
    footer: {
        paddingVertical: 16,
        borderColor: '#ccc',
    },
    submitButton: {
        alignItems: 'center',
        borderRadius: 8,
    },
    touchableArea: {
        alignItems: 'center',
        width: '100%',
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 8,
    },
    disabledButton: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 10,
    },
    successText: {
        color: 'green',
        fontSize: 14,
        marginBottom: 10,
    },
});

export default AddSalesManager;
