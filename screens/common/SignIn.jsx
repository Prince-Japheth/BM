import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import api from '../../api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn({ route }) {
    const navigation = useNavigation();
    const [email, setEmail] = useState(route.params?.registrationPayload?.email || '');
    const [password, setPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState(route.params?.successMessage || '');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const role = route.params?.registrationPayload?.role || 'merchant'; // Default role

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const validateInput = () => {
        if (!email.trim()) {
            setErrorMessage('Email is required');
            return false;
        }
        if (!password.trim()) {
            setErrorMessage('Password is required');
            return false;
        }
        if (!email.includes('@')) {
            setErrorMessage('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSignIn = async () => {
        if (!validateInput()) return;

        setLoading(true);
        setErrorMessage('');

        try {
            // Step 1: Login Request
            const loginResponse = await api.post('/auth/login', {
                email: email.trim().toLowerCase(),
                password,
                role
            });

            if (!loginResponse.data || loginResponse.data.statusCode !== 200) {
                throw new Error(loginResponse.data?.message || 'Login failed');
            }

            const { accessToken, refreshToken, merchant } = loginResponse.data.data;

            // Step 2: Store Authentication Data
            await AsyncStorage.multiSet([
                ['accessToken', accessToken],
                ['refreshToken', refreshToken],
                ['merchantId', merchant.id.toString()],
            ]);

            // Step 3: Fetch User Profile
            const profileResponse = await api.get('/auth/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (!profileResponse.data || profileResponse.data.statusCode !== 200) {
                throw new Error('Failed to retrieve user profile');
            }

            const { services, isApproved } = profileResponse.data.data;
            await AsyncStorage.setItem('isApproved', isApproved.toString());

            // Step 4: Navigation Logic Based on Services
            handleNavigation(services);

        } catch (error) {
            console.error('Login Error:', error);
            setErrorMessage(
                error.response?.data?.message ||
                error.message ||
                'An error occurred during sign in'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleNavigation = (services) => {
        if (!services || services.length === 0) {
            navigation.navigate('SelectService');
            return;
        }

        const serviceNavigationMap = {
            security: { name: 'SecurityTabNavigator', screen: 'SecurityDashboard' },
            store: { name: 'StoreTabNavigator', screen: 'StoreDashboard' },
            place: { name: 'PlaceTabNavigator', screen: 'PlaceDashboard' },
            event: { name: 'EventsTabNavigator', screen: 'EventDashboard' },
            books: { name: 'BooksTabNavigator', screen: 'BookDashboard' }
        };

        const service = services.find(s => serviceNavigationMap[s]);
        
        if (service) {
            const { name, screen } = serviceNavigationMap[service];
            navigation.reset({
                index: 0,
                routes: [{ name, params: { screen } }],
            });
        } else {
            navigation.navigate('SelectService');
        }
    };


    const isButtonDisabled = !email || !password;

    return (
        <LinearGradient
            colors={['#AD52F7', '#CD8DFE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.headerText}>Welcome Back</Text>

                    <View style={styles.formContainer}>
                        {successMessage ? (
                            <View style={styles.successMessageContainer}>
                                <Text style={styles.successMessage}>{successMessage}</Text>
                            </View>
                        ) : null}

                        <Text style={styles.title}>Sign In</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#666666"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

                        <Text style={styles.termsText}>
                            By tapping continue, you agree to all our terms and also acknowledge that you have read our privacy policy.
                        </Text>

                        <LinearGradient
                            colors={['#AD52F7', '#CD8DFE']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.continueButton, isButtonDisabled && styles.disabledButton]}
                        >
                            <TouchableOpacity
                                onPress={handleSignIn}
                                disabled={isButtonDisabled}
                                style={styles.touchableArea}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.continueButtonText}>Continue</Text>
                                )}
                            </TouchableOpacity>
                        </LinearGradient>

                        <View style={styles.signInContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                <Text style={styles.signInText}>
                                    Don't have an account?{' '}
                                    <Text style={styles.signInLink}>Sign Up</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.signInContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                <Text style={styles.signInLink}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}


const styles = StyleSheet.create({
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
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    headerText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 70,
        marginBottom: 50,
        marginLeft: 24,
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingTop: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#000000',
    },
    errorMessage: {
        color: 'red',
        fontSize: 14,
        marginBottom: 24,
        textAlign: 'center',
    },
    termsText: {
        fontSize: 12,
        color: '#666666',
        lineHeight: 20,
        marginBottom: 24,
        textAlign: 'center',
    },
    continueButton: {
        borderRadius: 12,
        marginBottom: 24,
    },
    touchableArea: {
        paddingVertical: 16,
        alignItems: 'center',
        width: '100%',
    },
    disabledButton: {
        opacity: 0.5,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    signInContainer: {
        alignItems: 'center',
    },
    signInText: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 20,
    },
    signInLink: {
        color: '#AD52F7',
    },
});