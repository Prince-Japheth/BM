import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { ArrowLeft2, Setting4 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';

const uploadCategories = ['All', 'Real Estate', 'Science Fiction', 'Travel', 'Mystery', 'Adventure', 'Horror'];

const uploadItems = [
    { id: '1', title: 'Apartment House', views: 1500, status: 'Published', category: 'Real Estate', image: require('../../assets/book.png') },
    { id: '2', title: 'Big Bang', views: 200, status: 'Published', category: 'Science Fiction', image: require('../../assets/book.png') },
    { id: '3', title: 'Thrilling Cities', views: 0, status: 'Published', category: 'Travel', image: require('../../assets/book.png') },
    { id: '4', title: 'Mystery Novel', views: 0, status: 'Published', category: 'Mystery', image: require('../../assets/book.png') },
    { id: '5', title: 'Space Odyssey', views: 1200, status: 'Published', category: 'Science Fiction', image: require('../../assets/book.png') },
    { id: '6', title: 'The Great Adventure', views: 800, status: 'Published', category: 'Adventure', image: require('../../assets/book.png') },
    { id: '7', title: 'Underwater Mysteries', views: 350, status: 'Published', category: 'Adventure', image: require('../../assets/book.png') },
    { id: '8', title: 'Haunted Tales', views: 450, status: 'Published', category: 'Horror', image: require('../../assets/book.png') },
    { id: '9', title: 'Fantasy Realm', views: 1500, status: 'Published', category: 'Fantasy', image: require('../../assets/book.png') },
    { id: '10', title: 'Tech Innovations', views: 600, status: 'Published', category: 'Technology', image: require('../../assets/book.png') },
    { id: '11', title: 'Historical Adventures', views: 300, status: 'Published', category: 'History', image: require('../../assets/book.png') },
];

const ViewAllUploads = () => {
    const navigation = useNavigation();
    const [activeCategory, setActiveCategory] = useState('All');
    const [timeframe, setTimeframe] = useState('Recent');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const options = ['Recent', 'Modt Viewed', 'Least Viewed'];

    const displayedUploads = activeCategory === 'All' ? uploadItems : uploadItems.filter(item => item.category === activeCategory);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.trigger}
                    onPress={() => setDropdownVisible(!dropdownVisible)}
                >
                    <Setting4 size={25} color="black" />
                    <Text style={styles.triggerText}>{timeframe}</Text>
                </TouchableOpacity>
                {dropdownVisible && (
                    <View style={styles.dropdown}>
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.option}
                                onPress={() => {
                                    setTimeframe(option);
                                    setDropdownVisible(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        timeframe === option && styles.selectedOption,
                                    ]}
                                >
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.categoryContainer}>
                    {uploadCategories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[styles.categoryPill, activeCategory === category && styles.selectedPill]}
                            onPress={() => setActiveCategory(category)}
                        >
                            <Text style={[styles.categoryText, activeCategory === category && styles.selectedText]}>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.uploadList}>
                    {displayedUploads.map((item, index) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.uploadItem, index === displayedUploads.length - 1 && { marginRight: 'auto', marginLeft: 20, }]}
                            onPress={() => navigation.navigate('BookDetails', { productId: item.id })}
                        >
                            <View style={styles.imageContainer}>
                                <Image source={item.image} style={styles.uploadImage} />
                                <View style={styles.viewsOverlay}>
                                    <AntDesign name="eye" size={12} color="#fff" />
                                    <Text style={styles.viewsCount}>{item.views >= 1000 ? `${(item.views / 1000).toFixed(1)}k` : item.views}</Text>
                                </View>
                            </View>
                            <Text style={styles.uploadTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

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
    },


    dropdownContainer: {
        zIndex: 1000,
        paddingHorizontal: 20,
    },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        padding: 10,
        // backgroundColor: '#f1e1ff',
        borderRadius: 8,
        marginLeft: 'auto',
    },
    triggerText: {
        fontSize: 16,
        color: '#3B125A',
        marginLeft: 15,
    },
    dropdown: {
        position: 'absolute',
        top: 100,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        marginTop: 5,
        width: 126,
        zIndex: 1000, // Ensure the dropdown is on top
        elevation: 10, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 }, // For iOS shadow
        shadowOpacity: 0.25, // For iOS shadow
        shadowRadius: 3.84, // For iOS shadow
        justifyContent: 'center',
        alignItems: 'center',
    },
    option: {
        padding: 10,
    },
    optionText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    selectedOption: {
        color: '#AD52F7',
    },



    content: {
        flex: 1,
    },
    categoryContainer: {
        flexDirection: 'row',
        padding: 10,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: 20,
    },
    categoryPill: {
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 12,
        margin: 5,
        borderWidth: 0.5,
    },
    selectedPill: {
        borderColor: '#AD52F7',
        borderWidth: 1,
    },
    categoryText: {
        color: '#333',
    },
    selectedText: {
        color: '#AD52F7',
    },
    uploadList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    uploadItem: {
        width: '30%',
        alignItems: 'flex-start',
        borderRadius: 12,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
    },
    uploadImage: {
        width: '100%',
        height: 180,
        borderRadius: 8,
    },
    uploadTitle: {
        fontSize: 14,
        marginBottom: 4,
        fontWeight: '600',
    },
    viewsCount: {
        fontSize: 12,
        color: '#fff',
        marginLeft: 4,
    },
    viewsOverlay: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 4,
        borderRadius: 4,
    },
});

export default ViewAllUploads;
