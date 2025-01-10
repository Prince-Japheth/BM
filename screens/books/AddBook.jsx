import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Pressable,
    Animated,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { CloseCircle, DocumentUpload, ArrowLeft2 } from 'iconsax-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

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

const InputSection = ({ label, ...props }) => (
    <View style={styles.section}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            placeholder={`Enter ${label.toLowerCase()}`}
            {...props}
        />
    </View>
);


const SubmitButton = ({ onPress }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        if (onPress) {
            onPress();
        }
        navigation.navigate('PreviewAddBook');
    };

    return (
        <TouchableOpacity style={styles.publishButton} onPress={handlePress}>
            <LinearGradient
                colors={['#AD52F7', '#7A1BF2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
            >
                <Text style={styles.publishButtonText}>Preview</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const UploadedFile = ({ fileName, onRemove }) => (
    <View style={styles.uploadedFile}>
        <Text style={styles.fileName}>{fileName}</Text>
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
            <CloseCircle size={20} color="#AD52F7" />
        </TouchableOpacity>
    </View>
);

export default function AddBook({ navigation }) {
    const [uploadedCover, setUploadedCover] = useState(null);
    const [uploadedDocument, setUploadedDocument] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        genre: '',
        description: '',
        title: '', // Added title to formData
    });
    const [showGenreDropdown, setShowGenreDropdown] = useState(false);

    const pickCover = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setUploadedCover(result.assets[0].uri);
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'application/epub+zip'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets?.[0]) {
                setUploadedDocument(result.assets[0]);
                console.log('Document uploaded:', result.assets[0]);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleGenreDropdown = () => {
        setShowGenreDropdown(prev => !prev);
    };

    const selectGenre = (genre) => {
        setFormData(prev => ({ ...prev, genre }));
        toggleGenreDropdown();
    };

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRemoveCover = () => {
        setUploadedCover(null);
    };

    const handleRemoveDocument = () => {
        setUploadedDocument(null);
    };

    const handleSubmit = () => {
        console.log('Submitting form data:', {
            ...formData,
            coverImage: uploadedCover,
            document: uploadedDocument ? {
                name: uploadedDocument.name,
                uri: uploadedDocument.uri,
                type: uploadedDocument.mimeType,
                size: uploadedDocument.size
            } : null,
        });
        // TODO: Implement actual form submission logic
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {showGenreDropdown && (
                    <View style={styles.dropdownAbsolute}>
                        <View style={styles.dropdown}>
                            {['Romance', 'Sci-Fi', 'Horror', 'Adventure'].map(genre => (
                                <Pressable
                                    key={genre}
                                    style={styles.dropdownOption}
                                    onPress={() => selectGenre(genre)}
                                >
                                    <Text style={styles.dropdownOptionText}>{genre}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Select Genre</Text>
                    <Pressable onPress={toggleGenreDropdown} style={styles.genreContainer}>
                        <Text style={styles.genreText}>
                            {formData.genre || 'Select genre'}
                        </Text>
                        <AntDesign name="down" size={16} color="gray" style={styles.dropdownIcon} />
                    </Pressable>
                </View>

                <InputSection
                    label="Author Name"
                    value={formData.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                />

                <InputSection
                    label="Book Title"
                    value={formData.title}
                    onChangeText={(text) => handleInputChange('title', text)}
                />

                <InputSection
                    label="Book Description"
                    value={formData.description}
                    onChangeText={(text) => handleInputChange('description', text)}
                    multiline
                />

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Upload Book Cover</Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={pickCover}>
                        <Text style={styles.uploadText}>
                            Select Book Cover
                        </Text>
                        <DocumentUpload size={24} color="#666" variant="Linear" />
                    </TouchableOpacity>
                    {uploadedCover && (
                        <UploadedFile
                            fileName={uploadedCover.split('/').pop()}
                            onRemove={handleRemoveCover}
                        />
                    )}
                </View>

                <View style={[styles.inputGroup, { marginBottom: 20 }]}>
                    <Text style={styles.label}>Upload PDF/EPUB</Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                        <Text style={styles.uploadText}>
                            Select PDF/EPUB
                        </Text>
                        <DocumentUpload size={24} color="#666" variant="Linear" />
                    </TouchableOpacity>
                    {uploadedDocument && (
                        <UploadedFile
                            fileName={uploadedDocument.name}
                            onRemove={handleRemoveDocument}
                        />
                    )}
                </View>

            </ScrollView>

            <SubmitButton onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        justifyContent: 'space-between',
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
    genreContainer: {
        borderWidth: 1,
        borderColor: '#E1E1FE',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    genreText: {
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
        textAlign: 'center',
    },
    inputGroup: {
        marginTop: 20,
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
    fileName: {
        flex: 1,
        color: '#333',
        fontSize: 14,
    },
    removeButton: {
        padding: 4,
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

