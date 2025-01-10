// C:\Users\USER\Documents\bondyt-merchant-app\screens\place\CreatePlaceOwnerProfile.jsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Animated,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Gallery, CloseCircle, DocumentUpload, Location } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import LocationSelectionModal from '../../components/LocationSelectionModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/apiService';

const CreatePlaceOwnerProfile = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const [idImage, setIdImage] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress] = useState(new Animated.Value(0));
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateName = (name) => {
        const names = name.trim().split(' ');
        if (names.length < 2) {
            throw new Error('Please enter both first and last name');
        }
        return {
            firstName: names[0],
            lastName: names.slice(1).join(' ')
        };
    };

    // Helper function to get user-friendly error message
    const getUserFriendlyErrorMessage = (error, type) => {
        if (!error.response) {
            return `The ${type} image file is too large`;
        }

        const status = error.response.status;
        const responseMessage = error.response.data?.message;

        switch (status) {
            case 413:
                return `The ${type} image file is too large. Please use an image smaller than 5MB.`;
            case 415:
                return `Invalid file type for ${type}. Please use JPG, PNG, or HEIF formats.`;
            case 400:
                if (responseMessage?.includes('file type')) {
                    return `Unsupported file type for ${type}. Please use JPG, PNG, or HEIF formats.`;
                }
                return responseMessage || `Invalid ${type} image. Please try a different file.`;
            case 401:
                return 'Your session has expired. Please log in again.';
            case 403:
                return 'You do not have permission to upload this image.';
            case 404:
                return 'Upload service is temporarily unavailable. Please try again later.';
            case 429:
                return 'Too many upload attempts. Please wait a few minutes and try again.';
            case 500:
            case 502:
            case 503:
            case 504:
                return 'Server error. Please try again later.';
            default:
                return responseMessage || `Failed to upload ${type} image. Please try again.`;
        }
    };

    const uploadImage = async (imageUri, type) => {
        if (!imageUri) return null;

        try {
            // Validate image URI
            if (!imageUri.startsWith('file://') && !imageUri.startsWith('content://')) {
                throw new Error(`Invalid ${type} image format. Please select a valid image.`);
            }

            const formData = new FormData();
            const filename = imageUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const ext = match?.[1] ?? 'jpg';

            // Validate file extension
            const validExtensions = ['jpg', 'jpeg', 'png', 'heif', 'heic'];
            if (!validExtensions.includes(ext.toLowerCase())) {
                throw new Error(`Unsupported file format for ${type}. Please use JPG, PNG, or HEIF formats.`);
            }

            // Create file object for upload
            const fileObject = {
                uri: imageUri,
                name: `${type}_${Date.now()}.${ext}`,
                type: `image/${ext}`
            };

            formData.append('file', fileObject);

            // Retrieve access token
            const token = await AsyncStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Session expired. Please log in again.');
            }

            // Prepare query parameters and headers
            const queryParam = type === 'organizationLogo' ? 'organizationLogo=true' : 'identification=true';
            const headers = {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            };

            // Perform upload
            const response = await api.post(`/uploads?${queryParam}`, formData, { headers });

            // Validate response
            if (!response.data?.data?.url) {
                throw new Error(`Failed to get upload URL for ${type}. Please try again.`);
            }

            const uploadedUrl = response.data.data.url;

            // Additional URL validation
            if (!isValidUrl(uploadedUrl)) {
                throw new Error(`Invalid URL received for ${type}. Please try again.`);
            }

            console.log(`Successfully uploaded ${type}:`, uploadedUrl);
            return uploadedUrl;

        } catch (error) {
            // Enhanced error logging
            console.error(`Upload error (${type}):`, {
                message: error.message,
                responseData: error.response?.data,
                responseStatus: error.response?.status,
                stack: error.stack
            });

            // Get user-friendly error message
            const userMessage = getUserFriendlyErrorMessage(error, type);
            throw new Error(userMessage);
        }
    };

    // Helper function to validate URL
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    const handleSubmit = async () => {
        setErrorMessage('');
        setIsSubmitting(true);

        try {
            if (!isFormValid()) {
                throw new Error('Please complete all required fields');
            }

            const merchantId = await AsyncStorage.getItem('merchantId');
            if (!merchantId) {
                throw new Error('Session expired. Please log in again.');
            }

            let idUrl;
            try {
                idUrl = await uploadImage(idImage, 'identification document');
            } catch (uploadError) {
                throw uploadError;
            }

            const { firstName, lastName } = validateName(formData.name);

            const profileData = {
                service: 'place',
                firstName,
                lastName,
                email: formData.email.trim(),
                phoneNumber: formData.phone.trim(),
                identification: idUrl
            };

            const response = await api.put(`/merchants/${merchantId}/places`, profileData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.data?.data) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'PlaceTabNavigator', params: { screen: 'PlaceDashboard' } }],
                });
            }
        } catch (error) {
            const errorMsg = error.message || error.response?.data?.message || 'An unexpected error occurred. Please try again.';
            console.error('Profile creation error:', errorMsg);
            setErrorMessage(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = () => {
        try {
            if (formData.name) {
                validateName(formData.name);
            }
            return (
                formData.name.trim() !== '' &&
                formData.email.trim() !== '' &&
                formData.phone.trim() !== '' &&
                idImage !== null
            );
        } catch (error) {
            console.error('Form validation error:', error.message);
            return false;
        }
    };

    const pickImage = async (setImage) => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission denied for media library');
                setErrorMessage('Permission Required: Sorry, we need camera roll permissions to make this work!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const imageUri = result.assets[0]?.uri;
                if (imageUri) {
                    setIsUploading(true);
                    Animated.timing(uploadProgress, {
                        toValue: 100,
                        duration: 300,
                        useNativeDriver: false,
                    }).start(() => {
                        setIsUploading(false);
                        setImage(imageUri);
                        uploadProgress.setValue(0);
                    });
                } else {
                    setErrorMessage('Failed to get image URI');
                }
            }

        } catch (error) {
            console.error('Image picker error:', error);
            setErrorMessage('Failed to pick image. Please try again.');
        }
    };


    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const removeImage = (setImage) => {
        setImage(null);
    };

    return (
        <>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Create your profile</Text>

                <View style={styles.form}>
                    {[
                        { field: 'name', label: 'Full Name', placeholder: 'Enter your full name' },
                        { field: 'email', label: 'Email', placeholder: 'Enter your email' },
                        { field: 'phone', label: 'Phone Number', placeholder: 'Enter your phone number', keyboardType: 'phone-pad' }
                    ].map(({ field, label, placeholder, keyboardType }, index) => (
                        <View key={index} style={styles.inputGroup}>
                            <Text style={styles.label}>{label}</Text>
                            <TextInput
                                style={[styles.input, focusedInput === field && styles.focusedInput]}
                                value={formData[field]}
                                onChangeText={value => handleInputChange(field, value)}
                                placeholder={placeholder}
                                placeholderTextColor="#999"
                                autoCapitalize={field === 'email' ? 'none' : 'words'}
                                keyboardType={keyboardType || 'default'}
                                onFocus={() => setFocusedInput(field)}
                                onBlur={() => setFocusedInput(null)}
                            />
                        </View>
                    ))}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Upload Identification Document</Text>
                        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setIdImage)}>
                            <Text style={styles.uploadText}>National ID, Driving License, Passport</Text>
                            <DocumentUpload size={24} color="#666" variant="Linear" />
                        </TouchableOpacity>
                        {(isUploading || idImage) && (
                            <Animated.View style={[styles.uploadedFile, isUploading && styles.uploadingFile]}>
                                <Gallery size={20} color="#666" variant="Linear" />
                                <Text style={styles.fileName}>{isUploading ? 'Uploading...' : idImage?.split('/').pop()}</Text>
                                {!isUploading && (
                                    <TouchableOpacity onPress={() => removeImage(setIdImage)} style={styles.removeButton}>
                                        <CloseCircle size={20} color="#666" variant="Linear" />
                                    </TouchableOpacity>
                                )}
                            </Animated.View>
                        )}
                    </View>

                    {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}

                    <TouchableOpacity
                        style={[styles.buttonContainer, !isFormValid() && styles.disabledButton]}
                        onPress={handleSubmit}
                        disabled={!isFormValid() || isSubmitting}
                    >
                        <LinearGradient colors={['#AD52F7', '#CD8DFE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
                            {isSubmitting ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Get started</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        marginTop: 60,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 16,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E1E1FE',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 120,
        paddingTop: 16,
    },
    uploadButton: {
        borderWidth: 1,
        borderColor: '#E1E1FE',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    uploadText: {
        color: '#999',
        fontSize: 16,
        marginRight: 'auto',
    },
    uploadedFile: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginTop: 8,
        gap: 8,
        borderWidth: 2,
        borderColor: '#AD52F7',
        borderStyle: 'solid',
    },
    uploadingFile: {
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    fileName: {
        flex: 1,
        color: '#333',
        fontSize: 14,
    },
    removeButton: {
        padding: 4,
    },
    placeholderText: {
        color: '#999',
        fontSize: 16,
    },
    buttonContainer: {
        height: 56,
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 10,
        marginBottom: 30,
    },
    button: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    focusedInput: {
        borderWidth: 2,
        borderColor: '#AD52F7',
    },
    disabledButton: {
        opacity: 0.5,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
});

export default CreatePlaceOwnerProfile;