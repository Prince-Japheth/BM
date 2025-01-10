import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Key } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';

const InputResetPin = () => {
    const navigation = useNavigation();
    const [pin, setPin] = useState(['', '', '', '']);

    const handlePinChange = (value, index) => {
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Key size={32} color="#AD52F7" />
            </View>
            <Text style={styles.title}>Impute PIN</Text>
            <Text style={styles.subtitle}>Impute the four-digit code sent to your email</Text>

            <View style={styles.pinContainer}>
                {pin.map((value, index) => (
                    <TextInput
                        key={index}
                        style={styles.pinInput}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={value}
                        onChangeText={(text) => handlePinChange(text, index)}
                    />
                ))}
            </View>

            <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('SetNewPassword')} >
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
    },
    iconContainer: {
        marginTop: 70,
        backgroundColor: '#F6F5FB',
        padding: 16,
        borderRadius: 100,
        marginBottom: 16,
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
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 32,
    },
    pinInput: {
        width: 48,
        height: 48,
        borderWidth: 1,
        borderColor: '#CD8DFE',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 18,
        color: '#000000',
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        height: 48,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});

export default InputResetPin;
