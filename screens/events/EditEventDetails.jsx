import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { ArrowLeft2, Add } from 'iconsax-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

// Mock data
const mockEventData = {
    id: '1',
    name: 'Summer Music Festival',
    location: 'Central Park, New York',
    description: 'Join us for a day of amazing music and fun activities in the heart of New York City.',
    images: ['../../assets/place1.png'],
    reservations: ['Regular', 'VIP'],
    reservationPrices: {
        'Regular': '50.00',
        'VIP': '150.00'
    }
};

const GradientText = ({ style, children }) => (
    <MaskedView maskElement={<Text style={style}>{children}</Text>}>
        <LinearGradient
            colors={['#AD52F7', '#CD8DFE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        >
            <Text style={[style, { opacity: 0 }]}>{children}</Text>
        </LinearGradient>
    </MaskedView>
);

export default function EditEventDetails({ navigation }) {
    const [formData, setFormData] = useState(mockEventData);

    useEffect(() => {
        // Simulating API call to fetch event details
        // In a real scenario, you would fetch data here
        setFormData(mockEventData);
    }, []);

    const pickImage = async (index) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setFormData(prev => ({
                ...prev,
                images: [
                    ...prev.images.slice(0, index),
                    result.assets[0].uri,
                    ...prev.images.slice(index + 1)
                ]
            }));
        }
    };

    const toggleReservation = (reservation) => {
        setFormData(prev => {
            const newReservations = prev.reservations.includes(reservation)
                ? prev.reservations.filter(r => r !== reservation)
                : [...prev.reservations, reservation];

            const newReservationPrices = { ...prev.reservationPrices };
            if (!newReservations.includes(reservation)) {
                delete newReservationPrices[reservation];
            } else if (!newReservationPrices[reservation]) {
                newReservationPrices[reservation] = '';
            }

            return {
                ...prev,
                reservations: newReservations,
                reservationPrices: newReservationPrices
            };
        });
    };

    const updateReservationPrice = (reservation, price) => {
        setFormData(prev => ({
            ...prev,
            reservationPrices: {
                ...prev.reservationPrices,
                [reservation]: price
            }
        }));
    };

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        // TODO: Implement form submission logic to update event details
        console.log('Updated event details:', formData);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Event Details</Text>
            </View>

            <ScrollView style={styles.content}>
                <InputSection
                    label="Event name"
                    value={formData.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                />
                <InputSection
                    label="Location"
                    value={formData.location}
                    onChangeText={(text) => handleInputChange('location', text)}
                />
                <InputSection
                    label="Event description"
                    value={formData.description}
                    onChangeText={(text) => handleInputChange('description', text)}
                    multiline
                    numberOfLines={4}
                />

                <ImageUploadSection
                    images={formData.images}
                    onPickImage={pickImage}
                />

                <TicketCategorySection
                    reservations={formData.reservations}
                    reservationPrices={formData.reservationPrices}
                    toggleReservation={toggleReservation}
                    updateReservationPrice={updateReservationPrice}
                />
            </ScrollView>

            <SubmitButton onPress={handleSubmit} />
        </View>
    );
}

const InputSection = ({ label, ...props }) => (
    <View style={styles.section}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={[styles.input, props.multiline && styles.textArea]}
            placeholder={`Enter ${label.toLowerCase()}`}
            {...props}
        />
    </View>
);

const ImageUploadSection = ({ images, onPickImage }) => (
    <View style={[styles.section, styles.upload]}>
        <Text style={styles.label}>Event banner</Text>
        <View style={styles.imageUploadContainer}>
            <TouchableOpacity
                style={styles.mainImageUpload}
                onPress={() => onPickImage(0)}
            >
                {images[0] ? (
                    <Image source={images[0].startsWith('../../') ? require('../../assets/place1.png') : { uri: images[0] }} style={styles.uploadedImage} />
                ) : (
                    <Add size={24} color="#666" />
                )}
            </TouchableOpacity>
        </View>
    </View>
);

const TicketCategorySection = ({ reservations, reservationPrices, toggleReservation, updateReservationPrice }) => (
    <View style={styles.section}>
        <Text style={styles.label}>Ticket Category</Text>
        <View style={styles.reservationContainer}>
            {['Regular', 'VIP', 'VVIP'].map((reservation) => (
                <TouchableOpacity
                    key={reservation} style={reservations.includes(reservation) ? styles.selectedSize : styles.reservationButton} onPress={() => toggleReservation(reservation)}
                >
                    {reservations.includes(reservation) ? (
                        <LinearGradient
                            colors={['#AD52F7', '#7A1BF2']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientBackground}
                        >
                            <Text style={[styles.reservationButtonText, styles.selectedSizeText]}>
                                {reservation}
                            </Text>
                            <AntDesign name="close" size={14} color="#fff" />
                        </LinearGradient>
                    ) : (
                        <>
                            <Text style={styles.reservationButtonText}>{reservation}</Text>
                            <Text style={styles.AddIcon}>+</Text>
                        </>
                    )}
                </TouchableOpacity>
            ))}
        </View>

        {reservations.map((reservation) => (
            <View key={reservation} style={styles.priceInputContainer}>
                <Text>{reservation}</Text>
                <TextInput
                    value={reservationPrices[reservation]}
                    onChangeText={(price) => updateReservationPrice(reservation, price)}
                    keyboardType="decimal-pad"
                    placeholder="$0.00"
                    style={styles.priceInput}
                />
            </View>
        ))}
    </View>
);

const SubmitButton = ({ onPress }) => (
    <TouchableOpacity style={styles.publishButton} onPress={onPress}>
        <LinearGradient
            colors={['#AD52F7', '#7A1BF2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
        >
            <Text style={styles.publishButtonText}>Update Event</Text>
        </LinearGradient>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 25,
    },
    label: {
        fontSize: 13,
        fontWeight: '400',
        color: '#BCBABA',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    upload: {
        borderColor: '#E5E7EB',
        padding: 25,
        borderWidth: 1,
        borderRadius: 15,
    },
    imageUploadContainer: {
        gap: 12,
    },
    mainImageUpload: {
        width: 200,
        height: 200,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    reservationContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 12,
    },
    reservationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    selectedSize: {
        borderColor: '#B666F2',
    },
    gradientBackground: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    reservationButtonText: {
        fontSize: 14,
        color: '#666',
    },
    selectedSizeText: {
        color: '#fff',
    },
    AddIcon: {
        fontSize: 14,
        color: '#666',
    },
    priceInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 15,
        width: 170,
    },
    priceInput: {
        marginLeft: 8,
        backgroundColor: '#F4F4F4',
        borderRadius: 5,
        padding: 8,
        width: 100,
    },
    publishButton: {
        margin: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
    gradientButton: {
        padding: 16,
        alignItems: 'center',
    },
    publishButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

