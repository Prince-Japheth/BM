import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    BackHandler,
    ScrollView,
} from 'react-native';
import { ArrowLeft2, ArrowDown2 } from 'iconsax-react-native';
import { LinearGradient } from 'expo-linear-gradient'; 

const EditEventDetails = ({ navigation, route }) => {
    // Handle back press behavior
    const handleBackPress = () => {
        navigation.goBack();
    };

    // Function to handle submit button click
    const handleSubmit = () => {
        navigation.navigate('TabNavigator', {
            screen: 'StoreDashboard',
            params: {
                isWithdrawalModalVisible: false,
                setActiveTab: 'history' // You can pass this as a parameter
            },
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress}>
                        <ArrowLeft2 size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Store Details</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>

                    <Text style={styles.label}>Store Location</Text>
                    <TextInput style={styles.input} value='Abuja, Nigeria' />

                    <Text style={styles.label}>About Store</Text>
                    <TextInput
                        style={styles.input}
                        value="Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Ut sem nulla pharetra diam sit amet nisl suscipit. Mus mauris vitae ultricies leo integer malesuada nunc."
                        multiline={true}
                        numberOfLines={10}
                    />
                </View>
            </ScrollView>
            <View style={styles.footer}>
                {/* Submit Button */}
                <LinearGradient
                    colors={['#AD52F7', '#CD8DFE']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.submitButton}
                >
                    <TouchableOpacity onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit</Text>
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
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    formContainer: {
        flex: 1,
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
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#ccc',
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
});

export default EditEventDetails;