import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Key } from 'iconsax-react-native';
import Feather from '@expo/vector-icons/Feather';

const ForgotPassword = () => {
    const navigation = useNavigation();
    const [isFocused, setIsFocused] = useState(false);
    const [email, setEmail] = useState('');
    const [showEmailSent, setShowEmailSent] = useState(false);

    const handleResetPassword = () => {
        if (email.trim() !== '') {
            setShowEmailSent(true);
        } else {
            alert('Please enter a valid email.');
        }
    };

    return (
        <View style={styles.container}>
            {!showEmailSent ? (
                <View style={styles.enterEmail}>
                    <View style={styles.iconContainer}>
                        <Key size="32" color="#AD52F7" style={styles.icon} />
                    </View>
                    <Text style={styles.title}>Forgot password?</Text>
                    <Text style={styles.subtitle}>No worries, you can always get it back.</Text>

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[styles.input, isFocused && styles.inputFocused]}
                        placeholder="Enter your email"
                        placeholderTextColor="#B3B3B3"
                        keyboardType="email-address"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />

                    <TouchableOpacity style={styles.buttonContainer} onPress={handleResetPassword}>
                        <LinearGradient
                            colors={["#AD52F7", "#CD8DFE"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Reset password</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.emailSent}>
                    <View style={styles.iconContainer}>
                        <Feather name="mail" size={32} color="#AD52F7" />
                    </View>
                    <Text style={styles.title}>Check your email</Text>
                    <Text style={styles.subtitle}>We sent a password reset link to {email}</Text>

                    <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('InputResetPin')} >
                        <LinearGradient
                            colors={["#AD52F7", "#CD8DFE"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Continue</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                style={styles.backContainer}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backText}>Back to Sign in</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    enterEmail: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 70,
    },
    emailSent: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 70,
    },
    iconContainer: {
        backgroundColor: '#F6F5FB',
        padding: 16,
        borderRadius: 100,
        marginBottom: 16,
    },
    icon: {
        alignSelf: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6D6D6D',
        textAlign: 'center',
        marginBottom: 32,
    },
    label: {
        fontSize: 14,
        color: '#6D6D6D',
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    input: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#000000',
        marginBottom: 24,
    },
    inputFocused: {
        borderColor: '#AD52F7',
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        height: 48,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    backContainer: {
        marginTop: 16,
    },
    backText: {
        fontSize: 14,
        color: '#AD52F7',
        textAlign: 'center',
    },
});

export default ForgotPassword;