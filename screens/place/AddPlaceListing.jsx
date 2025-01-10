import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { ArrowLeft2, Add, Trash, Location } from 'iconsax-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Instagram } from 'iconsax-react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import Modal from 'react-native-modal';
import LocationSelectionModal from '../../components/LocationSelectionModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/apiService';


export default function AddPlaceListing({ navigation }) {
    const [categories, setCategories] = useState([]);
    const [showCategories, setShowCategories] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Initial loading state
    const [isRetrying, setIsRetrying] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        categoryId: 'Category',
        location: '',
        openingHour: '',
        closingHour: '',
        weekendOpeningHour: '',
        weekendClosingHour: '',
        description: '',
        locationImages: [],
        pdf: '',
        isReservationEnabled: true,
        reservationOptions: {},
        instagramLink: '',
        xLink: '',
        tiktokLink: '',
        menuUrl: '',
        isHotel: true,
        hotelRooms: []
    });
    const [reservations, setReservations] = useState([]);
    const [reservationPrices, setReservationPrices] = useState({});

    // New state for room categories
    const [rooms, setRooms] = useState([]);
    const [showAddRoomModal, setShowAddRoomModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [newRoom, setNewRoom] = useState({ name: '', price: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
    const [submissionError, setSubmissionError] = useState('');

    // New useEffect to handle error timeout
    // useEffect(() => {
    //     let timeoutId;
    //     if (submissionError) {
    //         timeoutId = setTimeout(() => {
    //             setSubmissionError('');
    //         }, 3000);
    //     }

    //     // Cleanup function to clear timeout
    //     return () => {
    //         if (timeoutId) {
    //             clearTimeout(timeoutId);
    //         }
    //     };
    // }, [submissionError]);

    const dismissError = () => {
        setSubmissionError('');
    };

    // Image upload helper function
    const uploadImage = async (imageUri, token) => {
        console.log('Image Upload Process Started', {
            imageUri,
            timestamp: new Date().toISOString()
        });

        try {
            const imageFormData = new FormData();

            // Split the uri to get the file name
            const fileName = imageUri.split('/').pop();
            const match = /\.(\w+)$/.exec(fileName);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            console.log('Image Upload File Details', {
                fileName,
                fileType: type,
                fileUri: imageUri
            });

            imageFormData.append('file', {
                uri: imageUri,
                name: fileName,
                type,
            });

            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                timeout: 30000, // 30 second timeout
                params: {
                    placeLocationImage: 'true'
                }
            };

            console.log('Image Upload Request Configuration', {
                headers: config.headers,
                timeout: config.timeout,
                params: config.params
            });

            const response = await api.post('/uploads', imageFormData, config);

            console.log('Image Upload Response', {
                status: response.status,
                data: response.data,
                timestamp: new Date().toISOString()
            });

            if (!response.data?.data?.url) {
                console.error('Invalid Image Upload Response', {
                    responseData: response.data
                });
                throw new Error('Invalid response format from upload endpoint');
            }

            return response.data.data.url;
        } catch (error) {
            console.error('Image Upload Error', {
                errorMessage: error.message,
                errorCode: error.code,
                errorResponse: error.response?.data,
                timestamp: new Date().toISOString()
            });

            if (error.code === 'ECONNABORTED') {
                throw new Error('Image upload timed out. Please check your connection and try again.');
            }
            throw new Error(error.response?.data?.message || 'Failed to upload image. Please try again.');
        }
    };

    // PDF upload helper function
    const uploadPDF = async (pdfUri, token) => {
        console.log('PDF Upload Process Started', {
            pdfUri,
            timestamp: new Date().toISOString()
        });

        try {
            const pdfFormData = new FormData();

            // Split the uri to get the file name
            const fileName = pdfUri.split('/').pop();
            const match = /\.(\w+)$/.exec(fileName);
            const type = match ? `application/${match[1]}` : 'application/pdf';

            console.log('PDF Upload File Details', {
                fileName,
                fileType: type,
                fileUri: pdfUri
            });

            pdfFormData.append('file', {
                uri: pdfUri,
                name: fileName,
                type,
            });

            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                timeout: 30000 // 30 second timeout
            };

            console.log('PDF Upload Request Configuration', {
                headers: config.headers,
                timeout: config.timeout
            });

            const response = await api.post('/upload-pdf', pdfFormData, config);

            console.log('PDF Upload Response', {
                status: response.status,
                data: response.data,
                timestamp: new Date().toISOString()
            });

            if (!response.data?.data?.url) {
                console.error('Invalid PDF Upload Response', {
                    responseData: response.data
                });
                throw new Error('Invalid response format from PDF upload endpoint');
            }

            return response.data.data.url;
        } catch (error) {
            console.error('PDF Upload Error', {
                errorMessage: error.message,
                errorCode: error.code,
                errorResponse: error.response?.data,
                timestamp: new Date().toISOString()
            });

            if (error.code === 'ECONNABORTED') {
                throw new Error('PDF upload timed out. Please check your connection and try again.');
            }
            throw new Error(error.response?.data?.message || 'Failed to upload PDF. Please try again.');
        }
    };

    // Modified handleSubmit function
    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            setSubmissionError('');

            // Validation
            const validationErrors = [];
            if (!formData.name?.trim()) validationErrors.push('Place name is required');
            if (!formData.location?.trim()) validationErrors.push('Location is required');
            if (!formData.categoryId || formData.categoryId === 'Category') {
                validationErrors.push('Category is required');
            }
            if (!formData.locationImages?.some(img => img)) {
                validationErrors.push('At least one location image is required');
            }

            if (validationErrors.length) {
                setSubmissionError(validationErrors.join('\n'));
                return;
            }

            // Add these helper functions
            const isValidTimeFormat = (time) => {
                // Basic time format validation (e.g., "8am", "11pm", "9:30am", etc.)
                const timePattern = /^(1[0-2]|0?[1-9])(?::[0-5][0-9])?\s*(?:am|pm)$/i;
                return timePattern.test(time.trim());
            };

            // Add this to your validation in handleSubmit
            if (formData.openingHour || formData.closingHour) {
                if (!isValidTimeFormat(formData.openingHour)) {
                    validationErrors.push('Weekday opening time should be in format like "8am" or "8:30am"');
                }
                if (!isValidTimeFormat(formData.closingHour)) {
                    validationErrors.push('Weekday closing time should be in format like "11pm" or "11:30pm"');
                }
            }

            if (formData.weekendOpeningHour || formData.weekendClosingHour) {
                if (!isValidTimeFormat(formData.weekendOpeningHour)) {
                    validationErrors.push('Weekend opening time should be in format like "8am" or "8:30am"');
                }
                if (!isValidTimeFormat(formData.weekendClosingHour)) {
                    validationErrors.push('Weekend closing time should be in format like "11pm" or "11:30pm"');
                }
            }

            // In the handleSubmit function, add these validation checks
            if (formData.openingHour && !formData.closingHour) {
                validationErrors.push('Please provide both opening and closing hours for weekdays');
            }
            if (formData.weekendOpeningHour && !formData.weekendClosingHour) {
                validationErrors.push('Please provide both opening and closing hours for weekends');
            }

            // Validate social media URLs if provided
            const urlPattern = /^https?:\/\/.+/i;
            if (formData.instagramLink && !urlPattern.test(formData.instagramLink)) {
                validationErrors.push('Please enter a valid Instagram URL');
            }
            if (formData.xLink && !urlPattern.test(formData.xLink)) {
                validationErrors.push('Please enter a valid Twitter URL');
            }
            if (formData.tiktokLink && !urlPattern.test(formData.tiktokLink)) {
                validationErrors.push('Please enter a valid TikTok URL');
            }

            // Get credentials
            const storedMerchantId = await AsyncStorage.getItem('merchantId');
            const token = await AsyncStorage.getItem('accessToken');

            if (!storedMerchantId || !token) {
                setSubmissionError('Authentication error. Please log in again.');
                return;
            }

            // Upload images with retry logic
            const uploadedImageUrls = [];
            for (const imageUri of formData.locationImages.filter(Boolean)) {
                let attempts = 0;
                const maxAttempts = 3;

                while (attempts < maxAttempts) {
                    try {
                        const imageUrl = await uploadImage(imageUri, token);
                        uploadedImageUrls.push(imageUrl);
                        break;
                    } catch (error) {
                        attempts++;
                        console.error(`Image upload attempt ${attempts} failed:`, error);
                        if (attempts === maxAttempts) {
                            // throw new Error(`Failed to upload image after ${maxAttempts} attempts`);
                            throw new Error(`Failed to upload image(s) due to network instability`);
                        }
                        // Wait before retrying
                        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
                    }
                }
            }

            let menuUrl = null;
            if (formData.pdf) {
                try {
                    menuUrl = await uploadPDF(formData.pdf, token);
                } catch (error) {
                    console.error('PDF upload error:', error);
                    setSubmissionError(error.message);
                    setIsLoading(false);
                    return;
                }
            }

            // Prepare the final payload
            const selectedCategory = categories.find(cat => cat.name === formData.categoryId);
            if (!selectedCategory?.id) {
                throw new Error('Invalid category selected');
            }

            const convertTimeRange = (timeString) => {
                if (!timeString || !timeString.includes('-')) return null;

                const [openingTime, closingTime] = timeString.split('-').map(time => time.trim());

                const convertTo24HourFormat = (timeStr) => {
                    const timeRegex = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i;
                    const match = timeStr.match(timeRegex);

                    if (!match) return null;

                    let [, hours, minutes = '00', meridiem] = match;
                    hours = parseInt(hours, 10);

                    // Convert to 24-hour format
                    if (meridiem.toLowerCase() === 'pm' && hours !== 12) {
                        hours += 12;
                    }
                    if (meridiem.toLowerCase() === 'am' && hours === 12) {
                        hours = 0;
                    }

                    // Pad with leading zeros
                    return `${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
                };

                return {
                    openingHour: convertTo24HourFormat(openingTime),
                    closingHour: convertTo24HourFormat(closingTime)
                };
            };

            const payload = {
                name: formData.name.trim(),
                categoryId: selectedCategory.id,
                location: {
                    state: formData.location.split(',')[1]?.trim() || '',
                    country: formData.location.split(',')[2]?.trim() || ''
                },
                ...(formData.openingHour.includes('-')
                    ? convertTimeRange(formData.openingHour)
                    : {
                        openingHour: convertTo24HourFormat(formData.openingHour),
                        closingHour: convertTo24HourFormat(formData.closingHour)
                    }),
                ...(formData.closingHour.includes('-')
                    ? {
                        weekendOpeningHour: convertTimeRange(formData.closingHour).openingHour,
                        weekendClosingHour: convertTimeRange(formData.closingHour).closingHour
                    }
                    : {
                        weekendOpeningHour: convertTo24HourFormat(formData.weekendOpeningHour),
                        weekendClosingHour: convertTo24HourFormat(formData.weekendClosingHour)
                    }),
                description: formData.description?.trim() || '',
                reservationOptions: {
                    regular: formData.reservationOptions.regular || 0,
                    vip: formData.reservationOptions.vip || 0,
                    vvip: formData.reservationOptions.vvip || 0
                },
                isReservationEnabled: formData.isReservationEnabled,
                locationImages: uploadedImageUrls,
                instagramLink: formData.instagramLink?.trim() || null,
                xLink: formData.xLink?.trim() || null,
                tiktokLink: formData.tiktokLink?.trim() || null,
                menuUrl: menuUrl,
                isHotel: formData.categoryId === 'Hotel',
                hotelRooms: formData.hotelRooms || []
            };

            console.log('Payload:', payload);

            // Submit the place with retry logic
            let submitAttempts = 0;
            const maxSubmitAttempts = 3;

            while (submitAttempts < maxSubmitAttempts) {
                try {
                    const response = await api.post(
                        `/merchants/${storedMerchantId}/places`,
                        payload,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            timeout: 30000
                        }
                    );

                    if (response.status === 200 || response.status === 201) {
                        Alert.alert('Success', 'Place added successfully');
                        // navigation.goBack();
                        navigation.pop(); 
                        return;
                    }

                    throw new Error(`Unexpected response status: ${response.status}`);
                } catch (error) {
                    submitAttempts++;
                    console.error(`Submission attempt ${submitAttempts} failed:`, error);

                    if (submitAttempts === maxSubmitAttempts) {
                        // Log the full error details
                        console.error('Final submission error:', {
                            message: error.message,
                            response: error.response?.data,
                            status: error.response?.status
                        });

                        // More specific error messaging
                        const errorMessage = error.response?.data?.message ||
                            error.message ||
                            'Failed to submit place after multiple attempts. Please try again.';

                        setSubmissionError(errorMessage);
                        return;
                    }

                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, 1000 * submitAttempts));
                }
            }

        } catch (error) {
            console.error('Unexpected submission error:', error);

            // More detailed error logging
            console.error('Full error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack,
                responseData: error.response?.data
            });

            // Set a more informative error message
            setSubmissionError(
                error.response?.data?.message ||
                error.message ||
                'An unexpected error occurred. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const pickImage = async (index) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setFormData(prev => {
                const newImages = [...prev.locationImages];
                newImages[index] = result.assets[0].uri;
                return { ...prev, locationImages: newImages };
            });
        }
    };

    const pickPDF = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf',
                copyToCacheDirectory: true
            });

            if (!result.canceled) {
                setFormData(prev => ({
                    ...prev,
                    pdf: result.assets[0].uri
                }));
            }
        } catch (err) {
            console.error('Error picking PDF:', err);
        }
    };

    const toggleReservation = (reservation) => {
        if (reservations.includes(reservation)) {
            setReservations(reservations.filter(r => r !== reservation));
            const newReservationPrices = { ...reservationPrices };
            delete newReservationPrices[reservation];
            setReservationPrices(newReservationPrices);
        } else {
            setReservations([...reservations, reservation]);
        }
    };

    const updateReservationPrice = (reservation, price) => {
        // Remove any non-numeric characters
        const cleanPrice = price.replace(/[^\d]/g, '');

        // Ensure at least 1 if no valid number is entered
        const numericPrice = cleanPrice ? parseInt(cleanPrice, 10) : 1;

        // Format with dollar sign
        const formattedPrice = `$${numericPrice}`;

        console.log(`Updating ${reservation} price to: ${formattedPrice}`);

        // Update reservationPrices state
        setReservationPrices(prev => ({
            ...prev,
            [reservation]: formattedPrice
        }));

        // Update reservationOptions in formData
        setFormData(prev => ({
            ...prev,
            reservationOptions: {
                ...prev.reservationOptions,
                [reservation]: numericPrice
            }
        }));
    };

    // Room management functions
    const handleDeleteRoom = () => {
        // Remove the room from local rooms state
        const updatedRooms = rooms.filter((_, index) => index !== selectedRoom);
        setRooms(updatedRooms);

        // Remove the room from formData's hotelRooms
        setFormData(prevFormData => ({
            ...prevFormData,
            hotelRooms: prevFormData.hotelRooms.filter((_, index) => index !== selectedRoom)
        }));

        setShowActionModal(false);
        setSelectedRoom(null);
    };

    const handleEditRoom = () => {
        // Set the selected room's data to the newRoom state for editing
        setNewRoom({
            name: rooms[selectedRoom].name,
            price: rooms[selectedRoom].price
        });

        setIsEditing(true);
        setShowActionModal(false);
        setShowAddRoomModal(true);
    };

    const handleAddRoom = () => {
        // Create a room object in the format matching the endpoint example
        const newRoomFormatted = {
            roomName: newRoom.name,
            roomPrice: parseFloat(newRoom.price),
        };

        // Update formData's hotelRooms
        setFormData(prevFormData => ({
            ...prevFormData,
            hotelRooms: isEditing && selectedRoom !== null
                ? prevFormData.hotelRooms.map((room, index) =>
                    index === selectedRoom ? newRoomFormatted : room
                )
                : [...prevFormData.hotelRooms, newRoomFormatted]
        }));

        // Update local rooms state for UI
        if (isEditing && selectedRoom !== null) {
            setRooms(rooms.map((room, index) =>
                index === selectedRoom
                    ? { name: newRoom.name, price: newRoom.price }
                    : room
            ));
        } else {
            setRooms([...rooms, { name: newRoom.name, price: newRoom.price }]);
        }

        // Reset states
        setNewRoom({ name: '', price: '' });
        setShowAddRoomModal(false);
        setIsEditing(false);
        setSelectedRoom(null);
    };


    // Function to fetch categories
    const fetchCategories = async () => {
        try {
            const storedMerchantId = await AsyncStorage.getItem('merchantId');
            const token = await AsyncStorage.getItem('accessToken');

            if (!storedMerchantId || !token) {
                console.error('Merchant ID or Access token not found in storage.');
                setIsLoading(false);
                return;
            }

            const response = await api.get(`/merchants/${storedMerchantId}/places/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                setCategories(response.data.data); // Set fetched categories
                setFormData(prev => ({ ...prev, categoryId: response.data.data[0]?.name || 'Category' }));
                setIsLoading(false);
            } else {
                throw new Error('Failed to fetch categories');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setIsLoading(false);
            if (isRetrying) {
                setIsLoading(true);
                fetchCategories(); // Retry fetching categories
            }
        }
    };

    // Fetch categories when component mounts or when retrying
    useEffect(() => {
        fetchCategories();
    }, [isRetrying]);

    const deleteImage = (index) => {
        setFormData(prev => {
            const newImages = [...prev.locationImages];
            newImages[index] = null;
            return { ...prev, locationImages: newImages };
        });
    };

    const deletePDF = () => {
        setFormData(prev => ({ ...prev, pdf: null }));
    };

    const renderImageUpload = (index, isMain = false) => {
        const containerStyle = isMain ? styles.mainImageUpload : styles.thumbnailUpload;
        const imageStyle = isMain ? styles.uploadedImage : styles.uploadedThumbnail;
        const deleteButtonStyle = isMain ? styles.deleteImageButton : styles.deleteThumbnailButton;

        return (
            <TouchableOpacity
                style={containerStyle}
                onPress={() => pickImage(index)}
            >
                {formData.locationImages[index] ? (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: formData.locationImages[index] }} style={imageStyle} />
                        <TouchableOpacity
                            style={deleteButtonStyle}
                            onPress={() => deleteImage(index)}
                        >
                            <Trash size={isMain ? 24 : 16} color="white" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Add size={isMain ? 24 : 20} color="#666" />
                )}
            </TouchableOpacity>
        );
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleLocationSelect = (location) => {
        handleInputChange('location', location || '');
    };



    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowCategories(!showCategories)}>
                    <LinearGradient
                        colors={['#AD52F7', '#7A1BF2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.categoryIdButton}
                    >
                        <Text style={styles.categoryIdButtonText}>{formData.categoryId}</Text>
                        <AntDesign name="caretdown" size={10} color="white" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {showCategories && (
                <View style={styles.categoriesDropdown}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#AD52F7" />
                    ) : (
                        categories.map((category) => (
                            <TouchableOpacity
                                key={category.id} // Use category.id as the unique key
                                style={[
                                    styles.categoryIdItem,
                                    category.name === formData.categoryId && styles.selectedCategoryItem
                                ]}
                                onPress={() => {
                                    setFormData(prev => ({ ...prev, categoryId: category.name })); // Use category.name instead of category
                                    setShowCategories(false);
                                }}
                            >
                                <Text style={category.name === formData.categoryId ? styles.selectedCategoryItemText : styles.categoryIdItemText}>
                                    {category.name}  {/* Render category.name instead of the whole object */}
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            )}


            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.label}>Place name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                        placeholder="Enter place name"
                    />
                </View>


                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Location</Text>
                    <TouchableOpacity
                        style={styles.locationInput}
                        onPress={() => setIsLocationModalVisible(true)}
                    >
                        <Text style={formData.location ? styles.locationText : styles.placeholderText}>
                            {formData.location || 'Select Location'}
                        </Text>
                        <Location size={24} color="#666" variant="Linear" />
                    </TouchableOpacity>
                </View>


                <View style={styles.section}>
                    <Text style={styles.label}>Place description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.description}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                        placeholder="Enter place description"
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={[styles.section, styles.upload]}>
                    <Text style={styles.label}>Upload pictures of the place</Text>
                    <View style={styles.imageUploadContainer}>
                        {renderImageUpload(0, true)}
                        <View style={styles.thumbnailContainer}>
                            {[1, 2, 3].map((_, index) => renderImageUpload(index + 1))}
                        </View>
                    </View>
                </View>

                {/* New Room Category Section - Only shown for Hotels */}
                {formData.categoryId === 'Hotel' && (
                    <View style={styles.section}>
                        <Text style={styles.label}>Room categoryId (for hotels)</Text>
                        <View style={styles.roomContainer}>
                            {rooms.map((room, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.roomTag}
                                    onPress={() => {
                                        setSelectedRoom(index);
                                        setShowActionModal(true);
                                    }}
                                >
                                    <Text style={styles.roomTagText}>{room.name}</Text>
                                    <TouchableOpacity
                                        style={styles.roomMenuButton}
                                        onPress={() => {
                                            setSelectedRoom(index);
                                            setShowActionModal(true);
                                        }}
                                    >
                                        <Text style={styles.roomTagText}>⋮</Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={styles.addRoomButton}
                                onPress={() => setShowAddRoomModal(true)}
                            >
                                <Text style={styles.addRoomButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.label}>Add reservations (ensure you add reservation fees)</Text>
                    <View style={styles.reservationContainer}>
                        {['regular', 'vip', 'vvip'].map((reservation) => (
                            <TouchableOpacity
                                key={reservation}
                                style={reservations.includes(reservation) ? styles.selectedReservation : styles.reservationButton}
                                onPress={() => toggleReservation(reservation)}
                            >
                                <Text style={reservations.includes(reservation) ? styles.selectedReservationText : styles.reservationButtonText}>
                                    {reservation}
                                </Text>
                                {reservations.includes(reservation) && (
                                    <AntDesign name="close" size={14} color="#fff" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {reservations.map((reservation) => (
                        <View key={reservation} style={styles.reservationPriceContainer}>
                            <Text style={styles.reservationPriceLabel}>{reservation}</Text>
                            <TextInput
                                value={reservationPrices[reservation] || ''}  // Use formatted value from reservationPrices
                                onChangeText={(price) => updateReservationPrice(reservation, price)}  // Update price
                                keyboardType="decimal-pad"
                                placeholder="$0.00"
                                style={styles.reservationPriceInput}
                            />
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <View style={styles.pdfSection}>
                        <Text style={styles.label}>Place menu (PDF only)</Text>
                        {formData.pdf ? (
                            <View style={styles.pdfPreview}>
                                <Text style={styles.pdfText}>PDF</Text>
                                <TouchableOpacity
                                    style={styles.deletePdfButton}
                                    onPress={deletePDF}
                                >
                                    <AntDesign name="close" size={15} color="white" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.pdfUpload}
                                onPress={pickPDF}
                            >
                                <Add size={24} color="#666" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Opening Time</Text>
                    {/* Weekday Hours */}
                    <View
                        style={[
                            styles.input,
                            {
                                paddingVertical: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            },
                        ]}
                    >
                        <TextInput
                            placeholder="8am-11pm"
                            style={{ flex: 1 }}
                            value={formData.openingHour}
                            onChangeText={(text) => {
                                setFormData(prev => ({
                                    ...prev,
                                    openingHour: text
                                }));
                            }}
                        />
                        <Text style={styles.badge}>Week days</Text>
                    </View>

                    {/* Weekend Hours */}
                    <View
                        style={[
                            styles.input,
                            {
                                paddingVertical: 5,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 10,
                            },
                        ]}
                    >
                        <TextInput
                            placeholder="8am-11pm"
                            style={{ flex: 1 }}
                            value={formData.closingHour}
                            onChangeText={(text) => {
                                setFormData(prev => ({
                                    ...prev,
                                    closingHour: text
                                }));
                            }}
                        />
                        <Text style={styles.badge}>Weekends</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Add social media links</Text>
                    {[
                        { name: 'Instagram', key: 'instagramLink', icon: Instagram },
                        { name: 'Twitter', key: 'xLink', icon: () => <FontAwesome6 name="x-twitter" size={20} color="#AD52F7" /> },
                        { name: 'TikTok', key: 'tiktokLink', icon: () => <FontAwesome6 name="tiktok" size={20} color="#AD52F7" /> }
                    ].map((platform) => (
                        <View key={platform.name} style={styles.socialMediaInput}>
                            <TextInput
                                placeholder={`Enter ${platform.name} link`}
                                value={formData[platform.key]}
                                onChangeText={(text) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        [platform.key]: text
                                    }));
                                }}
                                style={{ flex: 1 }}
                            />
                            <Text style={styles.socialMediaIcon}>
                                {platform.icon === Instagram ? (
                                    <Instagram size={20} color="#AD52F7" />
                                ) : (
                                    <platform.icon />
                                )}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Add/Edit Room Modal */}
            <Modal
                isVisible={showAddRoomModal}
                onBackdropPress={() => setShowAddRoomModal(false)}
                style={styles.modal}
            >
                <View style={styles.modalContent}>
                    {/* Modal Handle */}
                    <View style={{ width: 40, height: 5, backgroundColor: '#ccc', borderRadius: 2.5, alignSelf: 'center', marginBottom: 30 }} />

                    {/* Room Name Input */}
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Room Name</Text>
                    <TextInput
                        style={styles.modalInput}
                        placeholder="Room Name"
                        value={newRoom.name}
                        onChangeText={(text) => setNewRoom(prev => ({ ...prev, name: text }))}
                    />

                    {/* Room Price Input */}
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Room Price</Text>
                    <TextInput
                        style={styles.modalInput}
                        placeholder="$ 0.00"
                        value={`$ ${newRoom.price}`}
                        onChangeText={(text) => {
                            // Remove any non-numeric characters (except for the decimal)
                            const formattedPrice = text.replace(/[^0-9.]/g, '');
                            setNewRoom(prev => ({ ...prev, price: formattedPrice }));
                        }}
                        keyboardType="decimal-pad"
                    />


                    {/* Add/Update Button */}
                    <TouchableOpacity
                        style={{
                            ...styles.modalButton,
                            opacity: newRoom.name && newRoom.price ? 1 : 0.5, // Disable button if inputs are empty
                        }}
                        onPress={handleAddRoom}
                        disabled={!newRoom.name || !newRoom.price} // Disable if any field is empty
                    >
                        <LinearGradient
                            colors={['#AD52F7', '#7A1BF2']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.modalButtonGradient}
                        >
                            <Text style={styles.modalButtonText}>
                                {isEditing ? 'Update' : 'Add'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Modal>


            {/* Action Modal */}
            <Modal
                isVisible={showActionModal}
                onBackdropPress={() => setShowActionModal(false)}
                style={styles.modal}
            >
                <View style={styles.modalContent}>
                    {/* Modal Handle */}
                    <View style={{ width: 50, height: 6, backgroundColor: '#ccc', borderRadius: 2.5, alignSelf: 'center', marginBottom: 30, marginTop: '-5', }} />

                    <View style={styles.actionButtonsContainer}>
                        <TouchableOpacity
                            style={[styles.actionButton, { flex: 1 }]}
                            onPress={handleEditRoom}
                        >
                            <LinearGradient
                                colors={['#AD52F7', '#7A1BF2']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.actionButtonGradient}
                            >
                                <Text style={styles.actionButtonTextWhite}>Edit</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton, { flex: 1 }]}
                            onPress={handleDeleteRoom}
                        >
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            <LocationSelectionModal
                isVisible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
                onSelectLocation={handleLocationSelect}
            />

            {submissionError && (
                <TouchableOpacity
                    style={styles.errorContainer}
                    onPress={dismissError}
                >
                    <Text style={styles.errorText}>{submissionError}</Text>
                    <AntDesign name="close" size={15} color="black" />
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={styles.publishButton}
                onPress={handleSubmit}
                disabled={isLoading}
            >
                <LinearGradient
                    colors={['#AD52F7', '#7A1BF2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.publishButtonGradient}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.publishButtonText}>Submit</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
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
        paddingHorizontal: 20,
        paddingTop: 40,
        justifyContent: 'space-between',
        paddingBottom: 10,
    },
    categoryIdButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    categoryIdButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    categoriesDropdown: {
        position: 'absolute',
        top: 100,
        right: 20,
        width: 150,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    categoryIdItem: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    selectedCategoryItem: {
        backgroundColor: '#AD52F7',
        borderRadius: 10,
    },
    selectedCategoryItemText: {
        fontSize: 16,
        color: '#fff',
    },
    categoryIdItemText: {
        fontSize: 16,
        color: '#666',
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
    locationInput: {
        borderWidth: 1,
        borderColor: '#E1E1FE',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    locationText: {
        fontSize: 16,
        color: '#333',
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
        marginBottom: 20,
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
    thumbnailContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    thumbnailUpload: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    uploadedThumbnail: {
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
    selectedReservation: {
        backgroundColor: '#AD52F7',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    reservationButtonText: {
        fontSize: 14,
        color: '#666',
    },
    selectedReservationText: {
        fontSize: 14,
        color: '#fff',
    },
    reservationPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginTop: 12,
    },
    reservationPriceLabel: {
        width: 50,
    },
    reservationPriceInput: {
        backgroundColor: '#F4F4F4',
        borderRadius: 5,
        padding: 8,
        width: 100,
    },
    socialMediaInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 4,
        paddingHorizontal: 10,
    },
    socialMediaIcon: {
        marginLeft: 'auto',
        backgroundColor: '#e2d5fb',
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    publishButton: {
        margin: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
    publishButtonGradient: {
        padding: 16,
        alignItems: 'center',
    },
    publishButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    deleteImageButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 12,
        zIndex: 1,
    },
    deleteThumbnailButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -8 }, { translateY: -8 }],
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 8,
        padding: 2,
        zIndex: 1,
    },
    pdfSection: {
        marginTop: 20,
    },
    pdfUpload: {
        width: '40%',
        height: 80,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pdfPreview: {
        width: '40%',
        height: 80,
        backgroundColor: '#D31F1F',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    pdfText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    deletePdfButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    badge: {
        textAlign: 'right',
        marginLeft: 10,
        color: '#AD52F7',
        backgroundColor: '#e2d5fb',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    roomContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 10,
    },
    roomTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#AD52F7',
        paddingLeft: 16,
        paddingVertical: 6,
        borderRadius: 10,
    },
    roomTagText: {
        color: '#fff',
        fontSize: 14,
        marginRight: 8,
    },
    roomMenuButton: {
        padding: 4,
    },
    addRoomButton: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addRoomButtonText: {
        fontSize: 20,
        color: '#666',
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
    },
    modalButton: {
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: 8,
    },
    modalButtonGradient: {
        padding: 16,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    actionButton: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 100,
    },
    actionButtonGradient: {
        padding: 16,
        alignItems: 'center',
    },
    actionButtonTextWhite: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: '#f1e1ff',
        padding: 16,
        alignItems: 'center',
    },
    deleteButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3B125A',
    },
    errorContainer: {
        backgroundColor: '#FFE5E5',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#FF0000',
        position: 'absolute',  // Makes it float
        top: 100,               // Adjust this value as needed to control the distance from the top
        left: 0,               // Align it horizontally, you can adjust this too if needed
        right: 0,              // Align it horizontally, you can adjust this too if needed
        zIndex: 9999,          // Ensure it's on top of other components
        flexDirection: 'row',
        alignItems: 'center',
    },

    errorText: {
        color: '#D8000C',
        fontSize: 12,
        flex: 1,
    },

});