import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ScrollView, TextInput, Platform } from 'react-native';
import { ArrowLeft2, Camera } from 'iconsax-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EditSecurityListingProfileDetails({ navigation }) {
    const [profileData, setProfileData] = useState({
        organizationName: "Your Organization",
        email: "organization@example.com",
        phone: "08162141984",
        representativeName: "Aboyi Daniel",
        location: "Lagos, Nigeria",
    });

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const handleChange = (key, value) => {
        setProfileData(prevData => ({
            ...prevData,
            [key]: value
        }));
    };

    const ProfileItem = ({ label, value, onChangeText, keyboardType = 'default' }) => (
        <View style={styles.profileItem}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
            />
        </View>
    );

    const handleSave = () => {
        // Implement save logic here
        console.log('Saving profile:', profileData);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <ArrowLeft2 size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                {/* Save button moved to bottom */}
            </View>

            {/* Profile Content */}
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Profile Details */}
                <View>
                    <ProfileItem
                        label="Name of Organization"
                        value={profileData.organizationName}
                        onChangeText={(value) => handleChange('organizationName', value)}
                    />
                    <ProfileItem
                        label="Official Email"
                        value={profileData.email}
                        onChangeText={(value) => handleChange('email', value)}
                        keyboardType="email-address"
                    />
                    <ProfileItem
                        label="Official Phone Number"
                        value={profileData.phone}
                        onChangeText={(value) => handleChange('phone', value)}
                        keyboardType="phone-pad"
                    />
                    <ProfileItem
                        label="Representative Name"
                        value={profileData.representativeName}
                        onChangeText={(value) => handleChange('representativeName', value)}
                    />
                    <ProfileItem
                        label="Location"
                        value={profileData.location}
                        onChangeText={(value) => handleChange('location', value)}
                    />
                </View>
            </ScrollView>

            {/* Save Button at Bottom */}
            <View style={styles.saveButtonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '500',
        color: '#666666',
    },
    backButton: {
        padding: 10,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingBottom: 80, // Added padding to ensure the content doesn't overlap with the save button
    },
    imageContainer: {
        position: 'relative',
    },
    profileItem: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 5,
    },
    input: {
        fontSize: 16,
        color: '#333333',
        borderWidth: 1,
        borderColor: '#BCBABA',
        borderRadius: 8,
        padding: 15,
    },
    cameraIconContainer: {
        position: 'absolute',
        left: 10,
        top: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 20,
        padding: 8,
    },
    saveButtonContainer: {
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 10,
    },
    saveButton: {
        backgroundColor: '#CD8DFE',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: '500',
    },
});
