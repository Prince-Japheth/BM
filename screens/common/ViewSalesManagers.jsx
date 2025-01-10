import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { ArrowLeft2, Add } from 'iconsax-react-native';

const ViewSalesManagers = ({ navigation }) => {
    const [salesManagers, setSalesManagers] = useState([
        { id: 1, name: 'Sandra Aki', email: 'sandra.aki@example.com' },
        { id: 2, name: 'John Doe', email: 'john.doe@example.com' },
        { id: 3, name: 'Jane Smith', email: 'jane.smith@example.com' },
    ]);

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleRemove = (id) => {
        const updatedManagers = salesManagers.filter((manager) => manager.id !== id);
        setSalesManagers(updatedManagers);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <ArrowLeft2 size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('AddSalesManager')}
                    >
                        <Add size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Sales Manager Cards */}
                {salesManagers.map((manager) => (
                    <View key={manager.id} style={styles.salesManagerCard}>
                        <View style={styles.infoContainer}>
                            <Text style={styles.name}>{manager.name}</Text>
                            <Text style={styles.email}>{manager.email}</Text>
                        </View>
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate('EditStoreSalesManager')}>
                                <Text style={styles.editText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => handleRemove(manager.id)}
                            >
                                <Text style={styles.removeText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
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
    scrollViewContent: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        marginBottom: 20,
    },
    backButton: {
        marginRight: 16,
    },
    addButton: {
        backgroundColor: '#EBEFF499',
        padding: 8,
        borderRadius: 100,
        marginLeft: 'auto',
    },
    salesManagerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 8,
        marginBottom: 16,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#BCBABA',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editButton: {
        marginLeft: 12,
    },
    editText: {
        fontSize: 14,
        fontWeight: '400',
        color: 'black',
    },
    removeButton: {
        marginLeft: 12,
        backgroundColor: '#DFB7FF',
        padding: 10,
        borderRadius: 5,
    },
    removeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3B125A',
    },
});

export default ViewSalesManagers;
