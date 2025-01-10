import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeft2, Edit2 } from 'iconsax-react-native';

export default function ViewStoreDetails({ navigation }) {
    const storeData = {
        name: "Amazing Grace Stores",
        location: "Abujs, Nigeria",
        type: "Fashion"
    };

    const StoreItem = ({ text }) => (
        <View style={styles.StoreItem}>
            <View style={styles.bullet} />
            <Text style={styles.profileText}>{text}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <ArrowLeft2 size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Store Details</Text>
            </View>


            <View style={styles.card}>
                <StoreItem text={storeData.name} />
                <StoreItem text={storeData.location} />
                <StoreItem text={storeData.type} />
            </View>

            <Text style={styles.aboutStoreLabel}>About Store</Text>
            <View style={[styles.card]}>
                <Text>Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Ut sem nulla pharetra diam sit amet nisl suscipit. Mus mauris vitae ultricies leo integer malesuada nunc. </Text>
            </View>

            <Text style={styles.aboutStoreLabel}>Identification</Text>
            <Image
                source={require('../../assets/identification.png')}
                style={{ width: '100%', borderRadius: 10,}}
            />

            {/* Edit Button */}
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditStoreDetails')}>
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
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        borderColor: '#BCBABA',
        borderWidth: 1,
    },
    StoreItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    bullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#A66FE5',
        marginRight: 15,
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