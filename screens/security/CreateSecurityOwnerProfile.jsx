// C:\Users\USER\Documents\bondyt-merchant-app\screens\security\CreateSecurityOwnerProfile.jsx
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

const CreateSecurityOwnerProfile = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        organizationName: '',
        email: '',
        phone: '',
        representativeName: '',
        location: '',
    });

    const [logoImage, setLogoImage] = useState(null);
    const [idImage, setIdImage] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress] = useState(new Animated.Value(0));
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages
    const [isSubmitting, setIsSubmitting] = useState(false); // State for submit loading

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
    
            // Upload images with enhanced error handling
            let logoUrl, idUrl;
            try {
                [logoUrl, idUrl] = await Promise.all([
                    uploadImage(logoImage, 'organization logo'),
                    uploadImage(idImage, 'identification document')
                ]);
            } catch (uploadError) {
                throw uploadError; // Pass the user-friendly error message up
            }
    
            // Validate required identification URL
            if (!idUrl || !isValidUrl(idUrl)) {
                throw new Error('Failed to upload identification document. Please try again.');
            }
    
            const { firstName, lastName } = validateName(formData.representativeName);
            const [city, state, country = 'United States'] = formData.location.split(',').map(part => part.trim());
    
            const profileData = {
                service: 'security',
                organizationName: formData.organizationName.trim(),
                firstName,
                lastName,
                organizationEmail: formData.email.trim(),
                phoneNumber: formData.phone.trim(),
                about: "Security services provider",
                location: {
                    city,
                    state,
                    country
                },
                ...(logoUrl && { organizationLogo: logoUrl }),
                identification: idUrl
            };
    
            const response = await api.put(`/merchants/${merchantId}/securities`, profileData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.data?.data) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SecurityTabNavigator', params: { screen: 'SecurityDashboard' } }],
                });
            }
        } catch (error) {
            // Use the user-friendly error message if it exists, otherwise try to extract from response
            const errorMsg = error.message || error.response?.data?.message || 'An unexpected error occurred. Please try again.';
            console.error('Profile creation error:', {
                message: error.message,
                responseData: error.response?.data,
                responseStatus: error.response?.status
            });
            setErrorMessage(errorMsg);
        } finally {
            setIsSubmitting(false);
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


    const handleLocationSelect = (location) => {
        handleInputChange('location', location || '');
    };

    const isFormValid = () => {
        try {
            if (formData.representativeName) {
                validateName(formData.representativeName);
            }
            return (
                formData.organizationName.trim() !== '' &&
                formData.email.trim() !== '' &&
                formData.phone.trim() !== '' &&
                formData.representativeName.trim() !== '' &&
                formData.location.trim() !== '' &&
                logoImage !== null &&
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
                        { field: 'organizationName', label: 'Name of Organization', placeholder: 'Enter organization name' },
                        { field: 'email', label: 'Official Email', placeholder: 'Enter your email' },
                        { field: 'phone', label: 'Official Phone', placeholder: 'Enter your phone number', keyboardType: 'phone-pad' },
                        { field: 'representativeName', label: 'Representative Name (First & Last)', placeholder: 'Enter full name e.g. John Smith' }
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

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Your Logo</Text>
                        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setLogoImage)}>
                            <Text style={styles.uploadText}>Upload a clear version of your logo</Text>
                            <DocumentUpload size={24} color="#666" variant="Linear" />
                        </TouchableOpacity>
                        {(isUploading || logoImage) && (
                            <Animated.View style={[styles.uploadedFile, isUploading && styles.uploadingFile]}>
                                <Gallery size={20} color="#666" variant="Linear" />
                                <Text style={styles.fileName}>{isUploading ? 'Uploading...' : logoImage?.split('/').pop()}</Text>
                                {!isUploading && (
                                    <TouchableOpacity onPress={() => removeImage(setLogoImage)} style={styles.removeButton}>
                                        <CloseCircle size={20} color="#666" variant="Linear" />
                                    </TouchableOpacity>
                                )}
                            </Animated.View>
                        )}
                    </View>

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

            <LocationSelectionModal
                isVisible={isLocationModalVisible}
                onClose={() => setIsLocationModalVisible(false)}
                onSelectLocation={handleLocationSelect}
            />
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
    locationInput: {
        borderWidth: 1,
        borderColor: '#E1E1FE',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    locationText: {
        fontSize: 16,
        color: '#333',
    },
    placeholderText: {
        fontSize: 16,
        color: '#999',
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

export default CreateSecurityOwnerProfile;