// C:\Users\USER\Documents\bondyt-merchant-app\screens\common\SelectService.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft2, ShoppingCart, Location, Calendar, Shield, Book } from 'iconsax-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

export default function SelectService() {
    const navigation = useNavigation();
    const [selectedService, setSelectedService] = useState(null);


    const services = [
        {
            id: '1',
            title: 'Sell items in store',
            service: 'store',
            icon: ShoppingCart,
        },
        {
            id: '2',
            title: 'List a location',
            service: 'place',
            icon: Location,
        },
        {
            id: '3',
            title: 'List an event',
            service: 'event',
            icon: Calendar,
        },
        {
            id: '4',
            title: 'Provide security',
            service: 'security',
            icon: Shield,
        },
        {
            id: '5',
            title: 'Books',
            service: 'book',
            icon: Book,
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={styles.titleContainer}>
                <Text style={styles.title}>What service would you like to offer</Text>
                <Text style={styles.subtitle}>State your primary reason</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                {services.map((service) => (
                    <TouchableOpacity
                        key={service.id}
                        style={[
                            styles.serviceItem,
                            selectedService === service.id && styles.selectedItem,
                        ]}
                        onPress={() => setSelectedService(service.id)}
                    >
                        <View style={styles.iconContainer}>
                            <service.icon size={24} color="#666" variant="Linear" />
                        </View>
                        <Text style={styles.serviceText}>{service.title}</Text>
                        {selectedService === service.id && (
                            <View style={styles.checkContainer}>
                                <LinearGradient
                                    colors={['#AD52F7', '#CD8DFE']}
                                    style={styles.checkGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <AntDesign name="check" size={16} color="white" />
                                </LinearGradient>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.buttonContainer}
                    disabled={!selectedService}
                    onPress={() => {
                        if (selectedService) {
                            switch (selectedService) {
                                case '1':
                                    navigation.navigate('CreateStoreDetails');
                                    // navigation.navigate('StoreTabNavigator', { screen: 'StoreDashboard' })
                                    break;
                                case '2':
                                    navigation.navigate('CreatePlaceOwnerProfile');
                                    // navigation.navigate('PlaceTabNavigator', { screen: 'PlaceDashboard' })
                                    break;
                                case '3':
                                    navigation.navigate('CreateEventOwnerProfile');
                                    // navigation.navigate('EventsTabNavigator', { screen: 'EventDashboard' })
                                    break;
                                case '4':
                                    navigation.navigate('CreateSecurityOwnerProfile');
                                    // navigation.navigate('SecurityTabNavigator', { screen: 'SecurityDashboard' })
                                    break;
                                case '5':
                                    navigation.navigate('CreateBookOwnerProfile');
                                    // navigation.navigate('BooksTabNavigator', { screen: 'BookDashboard' })
                                    break;
                                default:
                                    break;
                            }
                        }
                    }}

                >
                    <LinearGradient
                        colors={['#AD52F7', '#CD8DFE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                            styles.button,
                            !selectedService && styles.buttonDisabled,
                        ]}
                    >
                        <Text style={styles.buttonText}>Get started</Text>
                    </LinearGradient>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    titleContainer: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E1E1FE',
    },
    selectedItem: {
        borderColor: '#AD52F7',
        borderWidth: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    serviceText: {
        flex: 1,
        fontSize: 16,
        color: '#1F2937',
    },
    checkContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        overflow: 'hidden',
    },
    checkGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    buttonContainer: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        overflow: 'hidden',
    },
    button: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});