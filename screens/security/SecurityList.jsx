// C:\Users\USER\Documents\bondyt-merchant-app\screens\security\SecurityList.jsx
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput, Animated, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft2, Setting4, ArrowDown2, Trash, SearchNormal } from 'iconsax-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../api/apiService'; // Import your API service
import AsyncStorage from '@react-native-async-storage/async-storage';

const filterOptions = ['All', 'Male', 'Female'];

export default function SecurityList() {
    const navigation = useNavigation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [selectedOfficer, setSelectedOfficer] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [officers, setOfficers] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const dropdownAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fetchOfficers = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                const merchantId = await AsyncStorage.getItem('merchantId');
                if (!accessToken || !merchantId) {
                    throw new Error('Access token or Merchant ID not found');
                }

                const response = await api.get(`/merchants/${merchantId}/securities/officers`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setOfficers(response.data.data); // Set fetched officers
            } catch (err) {
                console.error('Error fetching officers:', err);
                setError(err.message); // Set error message
            } finally {
                setLoading(false); // Set loading to false
            }
        };

        fetchOfficers();
    }, []);

    const toggleDropdown = () => {
        if (isDropdownOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    };

    const openDropdown = () => {
        setIsDropdownOpen(true);
        Animated.timing(dropdownAnimation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const closeDropdown = () => {
        Animated.timing(dropdownAnimation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setIsDropdownOpen(false);
        });
    };

    const handleFilterSelect = (filter) => {
        setSelectedFilter(filter);
        closeDropdown();
    };

    const handleDeleteOfficer = (officerId) => {
        Alert.alert(
            "Delete Officer",
            "Are you sure you want to delete this officer?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const accessToken = await AsyncStorage.getItem('accessToken');
                            const merchantId = await AsyncStorage.getItem('merchantId');
                            if (!accessToken || !merchantId) {
                                throw new Error('Access token or Merchant ID not found');
                            }
    
                            // Make the DELETE request to the API
                            const response = await api.delete(`/merchants/${merchantId}/securities/officers/${officerId}`, {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            });
    
                            // Check if the response is successful
                            if (response.status === 200) {
                                Alert.alert("Success", response.data.message);
                                // Update the local state to remove the officer
                                setOfficers(prevOfficers => prevOfficers.filter(officer => officer.id !== officerId));
                                if (selectedOfficer?.id === officerId) {
                                    setSelectedOfficer(null);
                                }
                            }
                        } catch (err) {
                            console.error('Error deleting officer:', err);
                            Alert.alert("Error", err.message || "Failed to delete officer");
                        }
                    }
                }
            ]
        );
    };

    const filteredOfficers = officers.filter(officer => {
        const matchesFilter = selectedFilter === 'All' ||
            officer.gender.toLowerCase() === selectedFilter.toLowerCase();
        const matchesSearch = officer.firstName.toLowerCase()
            .includes(searchQuery.toLowerCase()) || officer.lastName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const renderOfficer = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.officerItem,
                selectedOfficer?.id === item.id && styles.selectedOfficer,
            ]}
            onPress={() => setSelectedOfficer(item)}
        >
            <Image source={{ uri: item.image_url }} style={styles.officerImage} />
            <Text style={styles.officerName}>{`${item.firstName} ${item.lastName}`}</Text>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteOfficer(item.id)}
            >
                <Trash size={20} color="#BCBABA" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const dropdownTranslateY = dropdownAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-20, 0],
    });

    const dropdownOpacity = dropdownAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Security List</Text>
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={styles.filterButton}
                        onPress={toggleDropdown}
                        activeOpacity={0.7}
                    >
                        <Setting4 size={20} color="#000" style={styles.filterIcon} />
                        <Text style={styles.filterText}>{selectedFilter}</Text>
                        <ArrowDown2
                            size={16}
                            color="#000"
                            style={[
                                styles.arrowIcon,
                                isDropdownOpen && styles.arrowIconRotated
                            ]}
                        />
                    </TouchableOpacity>

                    {isDropdownOpen && (
                        <Animated.View
                            style={[
                                styles.dropdown,
                                {
                                    opacity: dropdownOpacity,
                                    transform: [{ translateY: dropdownTranslateY }],
                                }
                            ]}
                        >
                            {filterOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.dropdownItem,
                                        selectedFilter === option && styles.selectedDropdownItem
                                    ]}
                                    onPress={() => handleFilterSelect(option)}
                                >
                                    <Text
                                        style={[
                                            styles.dropdownText,
                                            selectedFilter === option && styles.selectedDropdownText
                                        ]}
                                    >
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </Animated.View>
                    )}
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <SearchNormal size="25" color="black" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for a security officer"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Loading Indicator */}
            {loading && <ActivityIndicator size="large" color="#AD52F7" style={styles.loadingIndicator} />}

            {/* Error Handling */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {/* Officers List */}
            <FlatList
                data={filteredOfficers}
                renderItem={renderOfficer}
                keyExtractor={(item) => item.id}
                style={styles.officersList}
            />

            {/* Done Button */}
            {/* <TouchableOpacity
                onPress={() => navigation.goBack()}
                disabled={!selectedOfficer}
            >
                <LinearGradient
                    colors={['#AD52F7', '#CD8DFE']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.doneButton, !selectedOfficer && styles.disabledButton]}
                >
                    <Text style={styles.buttonText}>Done</Text>
                </LinearGradient>
            </TouchableOpacity> */}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#666666',
    },
    filterContainer: {
        position: 'relative',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        minWidth: 125,
    },
    filterIcon: {
        marginRight: 8,
    },
    filterText: {
        fontSize: 14,
        marginRight: 8,
        flex: 1,
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        right: 0,
        width: '100%',
        minWidth: 120,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 4,
        marginTop: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000,
    },
    arrowIcon: {
        transform: [{ rotate: '0deg' }],
    },
    arrowIconRotated: {
        transform: [{ rotate: '180deg' }],
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    selectedDropdownItem: {
        backgroundColor: '#F5F5F5',
    },
    dropdownText: {
        fontSize: 14,
        color: '#000',
    },
    selectedDropdownText: {
        color: '#AD52F7',
        fontWeight: '500',
    },
    searchContainer: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        backgroundColor: '#F5F5F5',
        borderRadius: 100,
        fontSize: 16,
        flexDirection: 'row',
        gap: 10,
        margin: 20,
        alignItems: 'center'
    },
    searchInput: {
        padding: 12,
    },
    officersList: {
        flex: 1,
        paddingHorizontal: 16,
    },
    officerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        backgroundColor: '#FFFFFF',
    },
    selectedOfficer: {
        backgroundColor: '#F5F5F5',
        borderColor: '#AD52F7',
    },
    officerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    officerName: {
        fontSize: 16,
        flex: 1,
    },
    deleteButton: {
        padding: 4,
    },
    doneButton: {
        margin: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});