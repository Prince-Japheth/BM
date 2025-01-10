import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { Key, TickCircle } from 'iconsax-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export default function SetNewPassword() {
    const navigation = useNavigation(); // Get the navigation object
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
    const [isPasswordReset, setIsPasswordReset] = useState(false);

    const handleResetPassword = () => {
        // Add your password reset logic here
        setIsPasswordReset(true);
    };

    const SuccessMessage = () => (
        <View style={styles.content}>
            <View style={[styles.iconContainer, styles.successIconContainer]}>
                <TickCircle size={32} color="#FFFFFF" variant="Bold" />
            </View>
            <Text style={styles.title}>Password Reset Successful</Text>
            <Text style={styles.subtitle}>
                Your password has been successfully reset. You can now use your new password to log in.
            </Text>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('SignIn')} >
                <LinearGradient
                    colors={['#AD52F7', '#CD8DFE']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Back to Login</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    const ResetPasswordForm = () => (
        <View style={styles.content}>
            <View style={styles.iconContainer}>
                <Key size={32} color="#CD8DFE" variant="Linear" />
            </View>

            <Text style={styles.title}>Set new password</Text>
            <Text style={styles.subtitle}>
                Your new password must be different from previously used passwords.
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={[styles.input, isPasswordFocused && styles.inputFocused]}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholder=""
                    placeholderTextColor="#666666"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                />
                <Text style={styles.hint}>Must be at least 8 characters.</Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm password</Text>
                <TextInput
                    style={[styles.input, isConfirmPasswordFocused && styles.inputFocused]}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder=""
                    placeholderTextColor="#666666"
                    onFocus={() => setIsConfirmPasswordFocused(true)}
                    onBlur={() => setIsConfirmPasswordFocused(false)}
                />
            </View>

            <TouchableOpacity style={styles.buttonContainer} onPress={handleResetPassword}>
                <LinearGradient
                    colors={['#AD52F7', '#CD8DFE']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Reset password</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text style={styles.backLink}>Back to Sign in</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {isPasswordReset ? <SuccessMessage /> : <ResetPasswordForm />}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 70,
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: '#F6F5FB',
        padding: 16,
        borderRadius: 100,
        marginBottom: 16,
    },
    successIconContainer: {
        backgroundColor: '#CD8DFE',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000000',
    },
    inputFocused: {
        borderColor: '#CD8DFE',
    },
    hint: {
        fontSize: 14,
        color: '#666666',
        marginTop: 8,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 8,
    },
    button: {
        width: '100%',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: { 
        color: '#FFFFFF', 
        fontSize: 16, 
        fontWeight: '600', 
    }, 
    backLink: { 
        color: '#CD8DFE', 
        fontSize: 16, 
        marginTop: 24, 
    },
});