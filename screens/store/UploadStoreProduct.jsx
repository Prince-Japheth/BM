import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Platform,
    Image,
    Modal,
} from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { ArrowLeft2, Add } from 'iconsax-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    runOnJS,
    withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

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

const categories = [
    'Women',
    'automobile',
    'fashion',
    'groceries',
    'winery',
    'gadgets'
];

export default function UploadProduct({ navigation }) {
    const [category, setCategory] = useState('Category');
    const [showCategories, setShowCategories] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Category',
        description: '',
        features: '',
        price: '0.00',
        images: [],
    });
    const [sizes, setSizes] = useState(['Small']);
    const [useNumbers, setUseNumbers] = useState(false);
    const [numberSizes, setNumberSizes] = useState(['']);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#FF0000');
    const [colors, setColors] = useState([]);

    const position = useSharedValue(0);

    const pickImage = async (index) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setFormData(prev => {
                const newImages = [...prev.images];
                newImages[index] = result.assets[0].uri;
                return { ...prev, images: newImages };
            });
        }
    };

    const toggleSize = (size) => {
        if (useNumbers) return;
        if (sizes.includes(size)) {
            setSizes(sizes.filter(s => s !== size));
        } else {
            setSizes([...sizes, size]);
        }
    };

    const handleUseNumbers = () => {
        setUseNumbers(!useNumbers);
        if (!useNumbers) {
            setSizes([]);
            setNumberSizes(['']);
        } else {
            setNumberSizes([]);
        }
    };

    const addNumberSize = () => {
        setNumberSizes([...numberSizes, '']);
    };

    const updateNumberSize = (index, value) => {
        const newSizes = [...numberSizes];
        newSizes[index] = value;
        setNumberSizes(newSizes);
    };

    const onGestureEvent = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.startX = position.value;
        },
        onActive: (event, ctx) => {
            const newPosition = ctx.startX + event.translationX;
            position.value = Math.min(Math.max(newPosition, 0), 280);
            const hue = (position.value / 280) * 360;
            const color = `hsl(${hue}, 100%, 50%)`;
            runOnJS(setSelectedColor)(color);
        },
        onEnd: () => {
            position.value = withSpring(position.value);
        },
    });

    const thumbStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: position.value }],
        };
    });

    const addColor = useCallback(() => {
        setColors(prevColors => [...prevColors, selectedColor]);
        setShowColorPicker(false);
    }, [selectedColor]);

    const ColorPickerModal = () => (
        <Modal
            visible={showColorPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowColorPicker(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.colorPickerContainer}>
                    <Text style={styles.modalTitle}>Select Color</Text>
                    <View style={styles.sliderContainer}>
                        <View style={styles.colorSlider}>
                            <LinearGradient
                                style={styles.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                colors={['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8F00FF']}
                            />
                            <PanGestureHandler onGestureEvent={onGestureEvent}>
                                <Animated.View style={[styles.sliderThumb, thumbStyle]} />
                            </PanGestureHandler>
                        </View>
                    </View>
                    <View style={styles.colorPreview}>
                        <View style={[styles.selectedColor, { backgroundColor: selectedColor }]} />
                    </View>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setShowColorPicker(false)}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.selectButton}
                            onPress={addColor}
                        >
                            <Text style={styles.selectButtonText}>Select</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setShowCategories(!showCategories)}
                >
                    <LinearGradient
                        colors={['#AD52F7', '#7A1BF2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.categoryButton}
                    >
                        <Text style={styles.categoryButtonText}>{formData.category}</Text>
                        <AntDesign name="caretdown" size={10} color="white" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {showCategories && (
                <View style={styles.categoriesDropdown}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryItem,
                                category === formData.category && {
                                    backgroundColor: 'transparent', // Remove default background
                                    overflow: 'hidden', // Ensure gradient clips correctly
                                }
                            ]}
                            onPress={() => {
                                setFormData(prev => ({ ...prev, category }));
                                setShowCategories(false);
                            }}
                        >
                            {category === formData.category ? (
                                <LinearGradient
                                    colors={['#AD52F7', '#7A1BF2']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.selectedCategoryItem}
                                >
                                    <Text style={styles.selectedCategoryItemText}>{category}</Text>
                                </LinearGradient>
                            ) : (
                                <Text style={styles.categoryItemText}>{category}</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.label}>Product name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(name) => setFormData(prev => ({ ...prev, name }))}
                        placeholder="Enter product name"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Product description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.description}
                        onChangeText={(description) => setFormData(prev => ({ ...prev, description }))}
                        placeholder="Enter product description"
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Product Features</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.features}
                        onChangeText={(features) => setFormData(prev => ({ ...prev, features }))}
                        placeholder="Create a list of features for this product"
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.section && styles.upload}>
                    <Text style={styles.label}>Upload product image</Text>
                    <View style={styles.imageUploadContainer}>
                        <TouchableOpacity
                            style={styles.mainImageUpload}
                            onPress={() => pickImage(0)}
                        >
                            {formData.images[0] ? (
                                <Image source={{ uri: formData.images[0] }} style={styles.uploadedImage} />
                            ) : (
                                <Add size={24} color="#666" />
                            )}
                        </TouchableOpacity>
                        <View style={styles.thumbnailContainer}>
                            {[1, 2, 3].map((_, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.thumbnailUpload}
                                    onPress={() => pickImage(index + 1)}
                                >
                                    {formData.images[index + 1] ? (
                                        <Image source={{ uri: formData.images[index + 1] }} style={styles.uploadedThumbnail} />
                                    ) : (
                                        <Add size={20} color="#666" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity style={styles.addButton} onPress={() => setShowColorPicker(true)}>
                        <Add size={20} color="#666" />
                        <Text style={styles.addButtonText}>Add colour</Text>
                    </TouchableOpacity>
                    <View style={styles.colorContainer}>
                        {colors.map((color, index) => (
                            <View key={index} style={[styles.colorCircle, { backgroundColor: color }]} />
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Select product size</Text>
                    <View style={styles.sizeContainer}>
    {['Small', 'Medium', 'Large', 'XL'].map((size) => (
        <TouchableOpacity
            key={size}
            style={sizes.includes(size) ? styles.selectedSize : styles.sizeButton}
            onPress={() => toggleSize(size)}
        >
            {sizes.includes(size) ? (
                <LinearGradient
                    colors={['#AD52F7', '#7A1BF2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBackground}
                >
                    <Text style={[styles.sizeButtonText, styles.selectedSizeText]}>
                        {size}
                    </Text>
                    <AntDesign name="close" size={14} color="#fff" />
                </LinearGradient>
            ) : (
                <>
                    <Text style={styles.sizeButtonText}>{size}</Text>
                    <Text style={styles.AddIcon}>+</Text>
                </>
            )}
        </TouchableOpacity>
    ))}
</View>
                    <TouchableOpacity
                        style={styles.numbersToggle}
                        onPress={handleUseNumbers}
                    >

                        <TouchableOpacity>
                            <GradientText style={styles.numbersToggleText}>Use numbers instead</GradientText>
                        </TouchableOpacity>

                        <View style={styles.numbersToggleIcon}>
                            {useNumbers ? (
                                <AntDesign name="close" size={20} color="#666" />
                            ) : (
                                <Add size={20} color="#666" />
                            )}
                        </View>
                    </TouchableOpacity>
                    {useNumbers && (
                        <TextInput
                            style={styles.input}
                            value={numberSizes[0]}
                            onChangeText={(text) => updateNumberSize(0, text)}
                            keyboardType="numeric"
                            placeholder="eg.4.5, 5.6"
                        />
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Product price</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.price}
                        onChangeText={(price) => setFormData(prev => ({ ...prev, price }))}
                        keyboardType="decimal-pad"
                        placeholder="$0.00"
                    />
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.publishButton} onPress={() => navigation.navigate('StoreProductDetail')}>
                <LinearGradient
                    colors={['#AD52F7', '#7A1BF2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ padding: 16, alignItems: 'center' }}
                >
                    <Text style={styles.publishButtonText}>Publish</Text>
                </LinearGradient>
            </TouchableOpacity>

            <ColorPickerModal />
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
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    categoryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    categoriesDropdown: {
        position: 'absolute',
        top: 120,
        right: 20,
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
    categoryItem: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    selectedCategoryItem: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: 120,
        borderRadius: 10,
    },
    selectedCategoryItemText: {
        fontSize: 16,
        color: '#fff',
    },
    categoryItemText: {
        fontSize: 16,
        color: '#666',
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    categoryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        color: '#333',
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
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
    },
    addButtonText: {
        fontSize: 16,
        color: '#666',
    },
    sizeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 12,
    },
    gradientBackground: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },    
    sizeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    selectedSize: {
        borderColor: '#B666F2',
    },
    sizeButtonText: {
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
    numbersToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: '10',
        marginTop: 20,
    },
    numbersToggleIcon: {
        backgroundColor: '#EBEFF499',
        padding: 5,
        borderRadius: 100,
    },
    numbersToggleText: {
        fontSize: 16,
        color: '#666',
    },
    publishButton: {
        margin: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
    publishButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
    colorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        gap: 8,
    },
    colorCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    addNumberSizeButton: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    colorPickerContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    sliderContainer: {
        width: '100%',
        height: 40,
        marginVertical: 20,
    },
    colorSlider: {
        width: '100%',
        height: 20,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
    sliderThumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'white',
        position: 'absolute',
        top: -2,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    colorPreview: {
        alignItems: 'center',
        marginVertical: 16,
    },
    selectedColor: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginRight: 8,
    },
    selectButton: {
        flex: 1,
        backgroundColor: '#B666F2',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginLeft: 8,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    selectButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

