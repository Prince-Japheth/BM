import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { ArrowLeft2 } from 'iconsax-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../api/apiService'; // Ensure this is correctly importing apiService
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const ChangePassword = ({ navigation }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false); // Loading state for button
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handlePasswordUpdate = async () => {
        setErrorMessage(''); // Reset error message
        setLoading(true); // Start loading

        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const merchantId = await AsyncStorage.getItem('merchantId'); // Retrieve merchantId
            console.log('Using access token:', accessToken);
            console.log('Using merchantId:', merchantId);
            if (!accessToken || !merchantId) {
                throw new Error('Access token or Merchant ID not found');
            }

            const response = await api.put('/auth/password-update', {
                oldPassword,
                newPassword,
                confirmPassword
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                setSuccessMessage('Password updated successfully!');
                setTimeout(() => {
                    setSuccessMessage(''); // Hide success message after 2 seconds
                }, 2000);
            } else {
                // If the response is not 200, extract the error message
                setErrorMessage((response.data.message || 'Unknown error, Please try again later'));
            }
        } catch (error) {
            console.error('Error updating password:', error);
            // Check if the error has a response and extract the message
            const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred, Please try again later';
            setErrorMessage(errorMessage);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Check if all inputs are filled
    const isButtonDisabled = !oldPassword || !newPassword || !confirmPassword || loading;

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress}>
                        <ArrowLeft2 size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Success Message */}
                {successMessage && (
                    <View style={styles.successMessageContainer}>
                        <Text style={styles.successMessage}>{successMessage}</Text>
                    </View>
                )}

                {/* Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Old Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        placeholder="Enter old password"
                        value={oldPassword}
                        onChangeText={setOldPassword}
                    />

                    <Text style={styles.label}>New Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        placeholder="Enter new password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />

                    <Text style={styles.label}>Confirm New Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    {/* Display error message under confirm password */}
                    {errorMessage ? (
                        <Text style={styles.errorMessage}>{errorMessage}</Text>
                    ) : null}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                {/* Save Button */}
                <TouchableOpacity onPress={handlePasswordUpdate} disabled={isButtonDisabled}>
                    <LinearGradient
                        colors={['#AD52F7', '#CD8DFE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.submitButton, isButtonDisabled && styles.disabledButton]}
                    >
                        <Text style={[styles.submitButtonText]}>
                            {loading ? <ActivityIndicator size="small" color="white" /> : 'Update Password'}
                        </Text>
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
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        marginBottom: 20,
    },
    formContainer: {
        flex: 1,
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
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        borderColor: '#ccc',
        backgroundColor: 'white',
    },
    submitButton: {
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 8,
    },
    disabledButton: {
        opacity: 0.5, // Make the button look disabled
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorMessage: {
        color: 'red',
        marginTop: 10,
        fontSize: 14,
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
});

export default ChangePassword;
