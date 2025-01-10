import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { ArrowLeft2 } from 'iconsax-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const EditSalesManager = ({ navigation, route }) => {
    // Handle back press behavior
    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress}>
                        <ArrowLeft2 size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        placeholder="Enter new password"
                    />

                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        placeholder="Confirm new password"
                    />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                {/* Save Button */}
                <LinearGradient
                    colors={['#AD52F7', '#CD8DFE']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.submitButton}
                >
                    <TouchableOpacity onPress={handleBackPress}>
                        <Text style={styles.submitButtonText}>Update</Text>
                    </TouchableOpacity>
                </LinearGradient>
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
    },
    submitButton: {
        paddingVertical: 16,
        alignItems: 'center',
        borderRadius: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditSalesManager;
