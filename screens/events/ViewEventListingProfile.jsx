import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeft2, Edit2 } from 'iconsax-react-native';

export default function ViewEventListingProfile({ navigation }) {
    const storeData = {
        location: "Abuja, Nigeria",
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <ArrowLeft2 size={24} color="#000000" />
                </TouchableOpacity> 
                <Text style={styles.headerTitle}>Store Details</Text>
            </View>

            <Text style={styles.aboutStoreLabel}>Your Location</Text>
            <View style={styles.card}>
                <Text style={styles.profileText}>{storeData.location}</Text>
            </View>

            <Text style={styles.aboutStoreLabel}>Identification</Text>
            <Image
                source={require('../../assets/identification.png')}
                style={{ width: '100%', borderRadius: 10 }}
            />

            {/* Edit Button */}
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditEventListingProfileDetails')}>
                <Edit2 size={20} color="#CD8DFE" variant="Linear" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '500',
        color: '#666666',
        marginRight: 30, // To offset the back button and center the title
    },
    aboutStoreLabel: {
        marginTop: 30,
        marginBottom: 10,
        color: '#6B7280',
    },
    card: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        borderColor: '#BCBABA',
        borderWidth: 1,
    },
    profileText: {
        fontSize: 16,
        color: '#333333',
    },
    editButton: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: '#f1e1ff',
        padding: 15,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#A66FE5',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});