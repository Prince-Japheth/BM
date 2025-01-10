import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,
    Modal,
    FlatList,
} from 'react-native';
import { ArrowLeft2, Add, CloseCircle, Trash } from 'iconsax-react-native';
import * as ImagePicker from 'expo-image-picker';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    runOnJS,
    withSpring,
} from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';

const SIZES = ['Small', 'Medium', 'Large', 'XL', 'XXL', '3XL', '4XL'];

const categories = [
    'Women',
    'automobile',
    'fashion',
    'groceries',
    'winery',
    'gadgets'
];

export default function EditProduct({ navigation }) {
    const [formData, setFormData] = useState({
        name: 'Brown teddybear',
        description: 'A robotsky colored gaming mouse is super cool. It usually has a sleek design with a mix of metallic and futuristic colors.',
        features: 'Number of Buttons: 6\nHand Orientation: Right\nType: WIRED\nBrand Name: Robotsky\nOrigin: Mainland China',
        price: '30.00',
        category: 'Women',
        images: [
            require('../../assets/teddy.png'),
            require('../../assets/teddy.png'),
        ],
    });

    const [sizes, setSizes] = useState(['Small', 'Medium', 'Large']);
    const [colors, setColors] = useState([
        { id: 1, color: '#8B4513' },
    ]);

    const [showCategories, setShowCategories] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#FF0000');

    const pickImage = useCallback(async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, result.assets[0].uri]
            }));
        }
    }, []);

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const addColor = useCallback(() => {
        setColors(prevColors => [
            ...prevColors,
            { id: prevColors.length + 1, color: selectedColor }
        ]);
        setShowColorPicker(false);
    }, [selectedColor]);

    const addSize = (size) => {
        if (!sizes.includes(size)) {
            setSizes(prevSizes => [...prevSizes, size]);
        }
        setShowSizeModal(false);
    };

    const removeSize = (index) => {
        setSizes(sizes.filter((_, i) => i !== index));
    };

    const removeColor = (index) => {
        setColors(colors.filter((_, i) => i !== index));
    };

    const handleSave = useCallback(() => {
        console.log('Saving product:', formData);
        navigation.goBack();
    }, [formData, navigation]);

    const position = useSharedValue(0);

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

    const SizeModal = () => (
        <Modal
            visible={showSizeModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowSizeModal(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.sizeModalContainer}>
                    <Text style={styles.modalTitle}>Select Size</Text>
                    <FlatList
                        data={SIZES}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.sizeItem}
                                onPress={() => addSize(item)}
                            >
                                <Text style={styles.sizeItemText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item}
                    />
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setShowSizeModal(false)}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
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
                        placeholder="A robotsky colored gaming mouse is super cool..."
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
                        placeholder="Create a list of features for your product"
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Product images</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.imageContainer}>
                            {formData.images.map((image, index) => (
                                <View key={index} style={styles.imageWrapper}>
                                    <Image
                                        source={typeof image === 'number' ? image : { uri: image }}
                                        style={styles.productImage}
                                    />
                                    <TouchableOpacity
                                        style={styles.deleteIcon}
                                        onPress={() => removeImage(index)}
                                    >
                                        <Trash size={20} color="#FF0000" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                                <Add size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Colour category</Text>
                    <View style={styles.colorContainer}>
                        {colors.map((colorItem, index) => (
                            <TouchableOpacity
                                key={colorItem.id}
                                style={styles.colorWrapper}
                                onPress={() => removeColor(index)}
                            >
                                <View style={[styles.colorSquircle, { backgroundColor: colorItem.color }]} />
                                <CloseCircle size={16} color="#666" style={styles.colorCloseIcon} />
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={styles.addColorButton}
                            onPress={() => setShowColorPicker(true)}
                        >
                            <Add size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Size</Text>
                    <View style={styles.sizeContainer}>
                        {sizes.map((size, index) => (
                            <View key={index} style={styles.sizeTag}>
                                <Text style={styles.sizeText}>{size}</Text>
                                <TouchableOpacity onPress={() => removeSize(index)}>
                                    <CloseCircle size={16} color="#666" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity
                            style={styles.addSizeButton}
                            onPress={() => setShowSizeModal(true)}
                        >
                            <Add size={24} color="#666" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Product price</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.price}
                        onChangeText={(price) => setFormData(prev => ({ ...prev, price }))}
                        keyboardType="decimal-pad"
                        placeholder="0.00"
                    />
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.doneButton} onPress={handleSave}>
                <LinearGradient
                    colors={['#AD52F7', '#7A1BF2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ padding: 16, alignItems: 'center' }}
                >
                    <Text style={styles.doneButtonText}>Done</Text>
                </LinearGradient>
            </TouchableOpacity>

            <ColorPickerModal />
            <SizeModal />
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
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        color: '#666',
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
    imageContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    imageWrapper: {
        position: 'relative',
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    deleteIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 12,
        padding: 4,
    },
    addImageButton: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    colorWrapper: {
        position: 'relative',
    },
    colorSquircle: {
        width: 40,
        height: 40,
        borderRadius: 10,
    },
    colorCloseIcon: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    addColorButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sizeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    sizeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        gap: 8,
    },
    sizeText: {
        fontSize: 14,
        color: '#666',
    },
    addSizeButton: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        paddingVertical: 8,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    doneButton: {
        margin: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
    sizeModalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 12,
        width: '80%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
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
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    selectButton: {
        flex: 1,
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
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
    sizeItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    sizeItemText: {
        fontSize: 16,
        color: '#000',
    },
});

