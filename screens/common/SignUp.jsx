// C:\Users\USER\Documents\bondyt-merchant-app\screens\common\SignUp.jsx
import React, { useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/apiService'; // Import the centralized API service

export default function SignUp() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    setLoading(true);
    setErrorMessage(''); // Reset error message

    const payload = {
      email,
      password,
      confirmPassword,
      firstName: null,
      lastName: null,
      phoneNumber: null,
      about: null,
      services: null,
      identification: null,
      role: "owner"
    };

    try {
      const response = await api.post('/auth/register', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('SignUp Response:', response.data);

      if (response.data && response.data.statusCode === 201) {
        // Successful registration
        const { id: merchantId } = response.data.data;

        // Store merchant ID
        await AsyncStorage.setItem('merchantId', merchantId.toString());

        // Clear inputs on success
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        setLoading(false);
        navigation.navigate('SignIn', {
          registrationPayload: {
            email: email, // Pass the email to SignIn screen
            role: "owner" // Pass the role if needed
          },
          successMessage: 'Registration successful. Please sign in.'
        });
      } else {
        // Handle case where user is already registered
        setLoading(false);
        setErrorMessage(response.data.message || 'Sign up failed. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      console.error('SignUp Error:', error.message);
      setErrorMessage(error.message); // Display error message to the user
    }
  };


  const isButtonDisabled = !email || !password || !confirmPassword;

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
          <Text style={styles.headerText}>Let's get started</Text>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Sign Up</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, emailFocus && styles.inputFocus]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#666666"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Create Password</Text>
              <TextInput
                style={[styles.input, passwordFocus && styles.inputFocus]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[styles.input, confirmPasswordFocus && styles.inputFocus]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                onFocus={() => setConfirmPasswordFocus(true)}
                onBlur={() => setConfirmPasswordFocus(false)}
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
                onPress={handleSignUp}
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

            <View style={styles.SignUpContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('SignInChoice')}>
                <Text style={styles.SignUpText}>
                  Already have an account?{' '}
                  <Text style={styles.SignUpLink}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
  inputFocus: {
    borderColor: '#CD8DFE',
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
  SignUpContainer: {
    alignItems: 'center',
  },
  SignUpText: {
    fontSize: 14,
    color: '#666666',
  },
  SignUpLink: {
    color: '#AD52F7',
  },
});