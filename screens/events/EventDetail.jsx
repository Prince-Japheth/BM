import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    BackHandler,
    TouchableOpacity,
    Image,
    ScrollView,
    Switch,
} from 'react-native';
import { ArrowLeft2, Calendar, Location } from 'iconsax-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export const useCustomBackHandler = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const handleBackPress = React.useCallback(() => {
        const state = navigation.getState();
        const currentIndex = state.index;

        if (currentIndex <= 0) {
            return false;
        }

        const previousRoute = state.routes[currentIndex - 1];

        if (previousRoute.name === 'UploadStoreProduct') {
            if (currentIndex > 1) {
                navigation.goBack(); // Go back to the previous screen
                navigation.goBack(); // Then go back to the one before
            }
        } else {
            navigation.goBack();
        }

        return true;
    }, [navigation]);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => backHandler.remove(); // Cleanup listener
    }, [handleBackPress]);

    return handleBackPress;
};

export default function ProductDetail({ navigation, route }) {
    const handleBackPress = useCustomBackHandler();
    const [isEnabled, setIsEnabled] = useState(false); // State for the switch

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress}>
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Event detail</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.productHeader}>
                    <Image source={require('../../assets/place1.png')} style={styles.mainImage} />
                    <View style={styles.productInfo}>
                        <Text style={styles.productName}>Capital block Party</Text>
                        <Text style={styles.productPrice}>$30</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>
                        A robotsky colored gaming mouse is super cool. It usually has a sleek design with a mix of metallic and
                        futuristic colors, giving it a unique and eye-catching appearance. It often comes with customizable RGB
                        lighting, programmable buttons, high DPI settings for precise movements, and an ergonomic shape for
                        comfortable gaming sessions.
                    </Text>

                    <View style={{ marginTop: 15 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <Calendar size="18" color="#AD52F7" variant='Bold' />
                            <Text style={{ marginLeft: 8, fontSize: 13, fontWeight: '400', color: '#595757' }}>October 24, 2024</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Location size="18" color="#AD52F7" variant='Bold' />
                            <Text style={{ marginLeft: 8, fontSize: 13, fontWeight: '400', color: '#595757' }}>78 Ajo Crescent, Gwarimpa, Abuja</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Available Ticket</Text>
                    <View style={styles.sizeContainer}>
                        {['Regular ($5)', 'VIP ($45)', 'VVIP ($400)'].map((ticketType, index) => (
                            <View key={index} style={styles.ticketTypeBtn}>
                                <Text style={styles.sizeText}>{ticketType}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.deleteButton}>
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => navigation.navigate('EditEventDetails')}
                    >
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                    <Switch
                        value={isEnabled}
                        onValueChange={toggleSwitch}
                        thumbColor={isEnabled ? 'white' : 'white'}
                        trackColor={{ false: '#767577', true: '#CD8DFE' }}
                    />
                    <Text style={{ marginRight: 10 }}>{isEnabled ? 'Switch off reservations' : 'Switch on reservations'}</Text>
                </View>
            </ScrollView>
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
        paddingHorizontal: 10,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 16,
    },
    content: {
        flex: 1,
    },
    productHeader: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    mainImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 16,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        color: '#595757',
    },
    section: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666',
    },
    sizeContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    ticketTypeBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
    },
    sizeText: {
        color: '#666',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        padding: 16,
    },
    deleteButton: {
        flex: 1,
        padding: 16,
        backgroundColor: '#FEE2E2',
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#EF4444',
        fontWeight: '600',
    },
    editButton: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#000',
        fontWeight: '600',
    },
});