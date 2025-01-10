// C:\Users\USER\Documents\bondyt-merchant-app\screens\security\AddSecurityOfficer.jsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Animated,
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Gallery, CloseCircle, DocumentUpload } from 'iconsax-react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import api from '../../api/apiService'; // Import your apiService

const AddSecurityOfficer = () => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        name: '',
        gender: '',
    });

    const [uploadedImage, setUploadedImage] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress] = useState(new Animated.Value(0));
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [errorMessage, setErrorMessage] = useState(''); // Error message state
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const toggleGenderDropdown = () => {
        setShowGenderDropdown(!showGenderDropdown);
    };

    const selectGender = (gender) => {
        setFormData((prev) => ({
            ...prev,
            gender,
        }));
        toggleGenderDropdown();
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.canceled) {
            setIsUploading(true);
            setUploadedImage(null);  // Reset the uploaded image
    
            // Upload the image to the server
            const formData = new FormData();
            formData.append('file', {
                uri: result.assets[0].uri,
                name: 'security_officer_image.jpg', // You can change the name as needed
                type: 'image/jpeg', // Adjust the type based on the image format
            });
    
            try {
                const token = await AsyncStorage.getItem('accessToken');
                console.log('Using token:', token);
                console.log('FormData:', formData);
    
                const response = await api.post('/uploads?securityOfficer=true', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`, // Include authorization header
                    },
                });
                console.log('Upload response:', response.data);
                setUploadedImage(response.data.data.url); // Set the uploaded image URL
            } catch (error) {
                console.error('Image upload failed:', error.response?.data || error.message);
                alert('Image upload failed: ' + (error.response?.data?.message || error.message));
            } finally {
                setIsUploading(false);
            }
        }
    };
    
    



    const removeImage = () => {
        setUploadedImage(null);
    };

    const isFormValid = () => {
        return (
            formData.name.trim() !== '' &&
            formData.gender.trim() !== '' &&
            uploadedImage !== null
        );
    };

    const handleSubmit = async () => {
        if (isFormValid()) {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                const merchantId = await AsyncStorage.getItem('merchantId'); // Retrieve merchantId
                console.log('Using access token:', accessToken);
                console.log('Using merchantId:', merchantId);
                if (!accessToken || !merchantId) {
                    throw new Error('Access token or Merchant ID not found');
                }

                const requestBody = {
                    gender: formData.gender.toLowerCase(), // Ensure gender is in lowercase
                    firstName: formData.name.split(' ')[0], // Assuming first name is the first part of the name
                    lastName: formData.name.split(' ')[1] || '', // Assuming last name is the second part of the name
                    image_url: uploadedImage, // Use the uploaded image URL
                };

                setIsLoading(true); // Set loading state to true
                setErrorMessage(''); // Reset error message

                const response = await api.post(`/merchants/${merchantId}/securities/officers`, requestBody, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Include access token in headers
                    },
                });

                // Log the success message instead of alerting
                console.log(response.data.message); // Log success message

                // Set success message to display in the UI
                setSuccessMessage(response.data.message); // Show success message

                // Clear the input fields after success
                setFormData({ gender: '', name: '' }); // Reset formData to initial values
                setUploadedImage(''); // Reset uploadedImage to initial value

                // Hide success message after 2 seconds and navigate back
                setTimeout(() => {
                    setSuccessMessage(''); // Clear success message
                    navigation.navigate('SecurityTabNavigator', { screen: 'SecurityDashboard' });
                }, 2000);
            } catch (error) {
                console.error('Failed to submit form:', error.message);
                setErrorMessage(error.message); // Set error message
            } finally {
                setIsLoading(false); // Reset loading state
            }
        } else {
            setErrorMessage('Please fill all fields and upload an image.'); // Set error message
        }
    };


    return (
        <ScrollView
            style={styles.container}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollViewContent}
        >
            <Text style={styles.title}>Add Security Officer</Text>

            {successMessage ? (
                <View style={styles.successMessageContainer}>
                    <Text style={styles.successMessage}>{successMessage}</Text>
                </View>
            ) : null}

            <View style={styles.form}>
                {showGenderDropdown && (
                    <View style={styles.dropdownAbsolute}>
                        <View style={styles.dropdown}>
                            <Pressable
                                style={styles.dropdownOption}
                                onPress={() => selectGender('Male')}
                            >
                                <Text style={styles.dropdownOptionText}>Male</Text>
                            </Pressable>
                            <Pressable
                                style={styles.dropdownOption}
                                onPress={() => selectGender('Female')}
                            >
                                <Text style={styles.dropdownOptionText}>Female</Text>
                            </Pressable>
                        </View>
                    </View>
                )}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Select Gender</Text>
                    <Pressable
                        onPress={toggleGenderDropdown}
                        style={styles.genderContainer}
                    >
                        <Text style={styles.genderText}>
                            {formData.gender || 'Select gender'}
                        </Text>
                        <AntDesign
                            name="down"
                            size={16}
                            color="gray"
                            style={styles.dropdownIcon}
                        />
                    </Pressable>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Officer Name (First Name & Last Name)</Text>
                    <TextInput
                        style={[
                            styles.input,
                            focusedInput === 'name' && styles.focusedInput
                        ]}
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        placeholder="Enter officer's name"
                        placeholderTextColor="#999"
                        autoCapitalize="words"
                        onFocus={() => setFocusedInput('name')}
                        onBlur={() => setFocusedInput(null)}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Upload Image</Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                        <Text style={styles.uploadText}>Image</Text>
                        <DocumentUpload size={24} color="#666" variant="Linear" />
                    </TouchableOpacity>

                    {(isUploading || uploadedImage) && (
                        <Animated.View
                            style={[
                                styles.uploadedFile,
                                isUploading && styles.uploadingFile,
                                {
                                    borderColor: isUploading
                                        ? uploadProgress.interpolate({
                                            inputRange: [0, 100],
                                            outputRange: ['#AD52F7', '#CD8DFE'],
                                        })
                                        : '#AD52F7',
                                },
                            ]}
                        >
                            <Gallery size={20} color="#666" variant="Linear" />
                            <Text style={styles.fileName}>
                                {isUploading ? 'Uploading...' : uploadedImage?.split('/').pop()}
                            </Text>
                            {!isUploading && (
                                <TouchableOpacity onPress={removeImage} style={styles.removeButton}>
                                    <CloseCircle size={20} color="#666" variant="Linear" />
                                </TouchableOpacity>
                            )}
                        </Animated.View>
                    )}
                </View>

                {errorMessage ? (
                    <Text style={styles.errorMessage}>{errorMessage}</Text>
                ) : null}

                <TouchableOpacity
                    style={[
                        styles.buttonContainer,
                        !isFormValid() && styles.disabledButton
                    ]}
                    onPress={handleSubmit}
                    disabled={!isFormValid() || isLoading}
                >
                    <LinearGradient
                        colors={['#AD52F7', '#CD8DFE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Get Started</ Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollViewContent: {
        padding: 20,
        paddingBottom: 100,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        marginTop: 60,
    },
    successMessageContainer: {
        backgroundColor: '#E6F4EA',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        alignItems: 'center',
    },
    successMessage: {
        color: '#34A853',
        fontSize: 14,
        textAlign: 'center',
    },
    form: {
        gap: 20,
        position: 'relative',
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
    genderContainer: {
        borderWidth: 1,
        borderColor: '#E1E1FE',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    genderText: {
        color: 'black',
        fontSize: 16,
    },
    dropdownAbsolute: {
        position: 'absolute',
        top: 100,
        right: 0,
        zIndex: 100,
    },
    dropdown: {
        backgroundColor: 'white',
        borderRadius: 12,
        width: 150,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    dropdownOption: {
        paddingVertical: 12,
    },
    dropdownOptionText: {
        color: '#333',
        fontSize: 16,
    },
    errorMessage: {
        color: 'red',
    },
});

export default AddSecurityOfficer;