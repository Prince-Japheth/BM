import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Gallery, CloseCircle, DocumentUpload, Location } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import LocationSelectionModal from '../../components/LocationSelectionModal';

function FormData(name, email, phone, identification, storeName, aboutStore) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.identification = identification;
    this.storeName = storeName;
    this.aboutStore = aboutStore;
}

const StoreDetails = () => {


    const handleLocationSelect = (location) => {
        handleInputChange('location', location);
    };

    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        identification: '',
        storeName: '',
        aboutStore: '',
        location: '',
    });

    // Removed type annotation for uploadedImage
    const [uploadedImage, setUploadedImage] = useState(null);

    // Removed type annotation for focusedInput
    const [focusedInput, setFocusedInput] = useState(null);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress] = useState(new Animated.Value(0));
    const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);


    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
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

            // Simulate upload process
            Animated.timing(uploadProgress, {
                toValue: 100,
                duration: 300,
                useNativeDriver: false,
            }).start(() => {
                setIsUploading(false);
                setUploadedImage(result.assets[0].uri);  // Set the uploaded image URI
                uploadProgress.setValue(0);
            });
        }
    };

    const removeImage = () => {
        setUploadedImage(null);
    };

    const isFormValid = () => {
        return (
            formData.name.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.phone.trim() !== '' &&
            formData.storeName.trim() !== '' &&
            formData.aboutStore.trim() !== '' &&
            formData.location.trim() !== '' &&
            uploadedImage !== null
        );
    };

    const handleSubmit = () => {
        if (isFormValid()) {
            navigation.navigate('StoreTabNavigator', { screen: 'StoreDashboard' });
        } else {
            alert('Please fill all fields and upload an identification document.');
        }
    };


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Store details</Text>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={[
                            styles.input,
                            focusedInput === 'name' && styles.focusedInput
                        ]}
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        placeholder="Enter your name"
                        placeholderTextColor="#999"
                        onFocus={() => setFocusedInput('name')}
                        onBlur={() => setFocusedInput(null)}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[
                            styles.input,
                            focusedInput === 'email' && styles.focusedInput
                        ]}
                        value={formData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                        placeholder="Enter your email"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput(null)}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone number</Text>
                    <TextInput
                        style={[
                            styles.input,
                            focusedInput === 'phone' && styles.focusedInput
                        ]}
                        value={formData.phone}
                        onChangeText={(value) => handleInputChange('phone', value)}
                        placeholder="Enter your phone number"
                        placeholderTextColor="#999"
                        keyboardType="phone-pad"
                        onFocus={() => setFocusedInput('phone')}
                        onBlur={() => setFocusedInput(null)}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Upload identification document</Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                        <Text style={styles.uploadText}>
                            National id, driving license, passport
                        </Text>
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

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Store name</Text>
                    <TextInput
                        style={[
                            styles.input,
                            focusedInput === 'storeName' && styles.focusedInput
                        ]}
                        value={formData.storeName}
                        onChangeText={(value) => handleInputChange('storeName', value)}
                        placeholder="Enter store name"
                        placeholderTextColor="#999"
                        onFocus={() => setFocusedInput('storeName')}
                        onBlur={() => setFocusedInput(null)}
                    />
                </View>

                {/* Location Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Store Location</Text>
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



                {/* Location Selection Modal */}
                <LocationSelectionModal
                    isVisible={isLocationModalVisible}
                    onClose={() => setIsLocationModalVisible(false)}
                    onSelectLocation={handleLocationSelect}
                />

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>About store</Text>
                    <TextInput
                        style={[
                            styles.input,
                            styles.textArea,
                            focusedInput === 'aboutStore' && styles.focusedInput
                        ]}
                        value={formData.aboutStore}
                        onChangeText={(value) => handleInputChange('aboutStore', value)}
                        placeholder="Tell us about your store"
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        onFocus={() => setFocusedInput('aboutStore')}
                        onBlur={() => setFocusedInput(null)}
                    />
                </View>

                <TouchableOpacity
                    style={[
                        styles.buttonContainer,
                        !isFormValid() && styles.disabledButton
                    ]}
                    onPress={handleSubmit}
                    disabled={!isFormValid()}
                >
                    <LinearGradient
                        colors={['#AD52F7', '#CD8DFE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Get started</Text>
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
});

export default StoreDetails;