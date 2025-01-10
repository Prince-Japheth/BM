import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft2 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../api/apiService';

const ReservationDetails = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reservation details</Text>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.idContainer}>
                    <Text style={styles.label}>Users ID</Text>
                    <Text style={styles.value}>ID:1234hg53</Text>
                </View>
                <View style={styles.idContainer}>
                    <Text style={styles.label}>Reservation:</Text>
                    <Text style={styles.value}>VVIP</Text>
                </View>
                <View style={styles.idContainer}>
                    <Text style={styles.label}>Time:</Text>
                    <Text style={styles.value}>5:00 PM</Text>
                </View>
                <View style={styles.idContainer}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>Wednesday 15, December 2024</Text>
                </View>
                <View style={styles.idContainer}>
                    <Text style={styles.label}>Fees:</Text>
                    <Text style={styles.value}>$15</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <LinearGradient
                        colors={['#AD52F7', '#CD8DFE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.buttonText}>Confirm Availability</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.declineButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.declineButtonText}>Decline</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        marginLeft: 12,
    },
    infoContainer: {
        margin: 16,
        borderWidth: 1,
        borderColor: '#BCBABA',
        padding: 15,
        borderRadius: 10,
        gap: 15,
    },
    label: {
        color: '#595757',
        fontWeight: '400',
    },
    value: {
        color: 'black',
        fontWeight: '700',
    },
    idContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    buttonContainer: {
        flexDirection: 'column', // Change to column to stack buttons vertically
        justifyContent: 'flex-start',
        margin: 20,
    },
    button: {
        marginBottom: 10, // Add margin to separate buttons
        borderRadius: 15,
        overflow: 'hidden',
    },
    buttonText: {
        padding: 15,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
    declineButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    declineButtonText: {
        color: '#595757',
        fontWeight: 'bold',
    },
});

export default ReservationDetails;