import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from 'react-native';
import { ArrowLeft2, SearchNormal, Bank } from 'iconsax-react-native';

const banks = Array(10).fill('Access Bank Nigeria'); // Example bank names

const BankSelectionScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('BankSetupScreen')}
                >
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Bank</Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <SearchNormal size={20} color="black" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#888"
                />
            </View>

            {/* Bank List */}
            <FlatList
                data={banks}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.bankItem}
                        onPress={() =>
                            navigation.navigate('BankSetupScreen', { selectedBank: item })
                        }                        
                    >
                        <Bank size={24} color="#000" style={styles.bankIcon} />
                        <Text style={styles.bankName}>{item}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 100,
        paddingHorizontal: 12,
        marginBottom: 16,
        backgroundColor: '#F9F9F9',
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#000',
        marginLeft: 8,
    },
    bankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    bankIcon: {
        marginRight: 16,
    },
    bankName: {
        fontSize: 16,
        color: '#000',
    },
});

export default BankSelectionScreen;
