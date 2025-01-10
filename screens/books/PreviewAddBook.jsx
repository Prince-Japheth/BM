import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Switch,
    Modal,
} from 'react-native';
import { ArrowLeft2 } from 'iconsax-react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const mockBookData = {
    title: 'Apartment House',
    category: 'Fantasy',
    publisher: 'Embassy',
    coverImage: require('../../assets/book.png'),
};

export default function BookDetails() {
    const navigation = useNavigation();
    const [price, setPrice] = useState('');
    const [isFree, setIsFree] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const closeModal = () => setModalVisible(false);

    return (
        <>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.headerContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <ArrowLeft2 size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>

                <Image
                    source={mockBookData.coverImage}
                    style={styles.coverImage}
                />

                <View style={styles.bookInfo}>
                    <Text style={styles.titleSubtitle}>
                        {mockBookData.title} - <Text style={styles.category}>{mockBookData.category}</Text>
                    </Text>
                    <Text style={styles.publisher}>{mockBookData.publisher}</Text>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Book price</Text>
                    <TextInput
                        style={[styles.priceInput, isFree && styles.disabledInput]}
                        placeholder="$0.00"
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                        editable={!isFree}
                    />
                    <View style={styles.switchContainer}>
                        <Switch
                            value={isFree}
                            onValueChange={setIsFree}
                            trackColor={{ false: '#767577', true: '#CD8DFE' }}
                            thumbColor="#FFFFFF"
                        />
                        <Text style={styles.switchLabel}>Free</Text>
                    </View>
                </View>

                <TouchableOpacity 
                    style={styles.publishButtonContainer}
                    onPress={() => setModalVisible(true)}
                >
                    <LinearGradient
                        colors={['#AD52F7', '#7A1BF2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.publishButton}
                    >
                        <Text style={styles.publishText}>Publish</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalIcon}>
                            <AntDesign name="check" size={30} color="#AD52F7" />
                        </View>
                        <Text style={styles.modalTitle}>Book In review</Text>
                        <Text style={styles.modalDescription}>
                            Your book is being reviewed by our editors and if approved, would be made live on Bondyt within <Text style={{ fontWeight: 'bold' }}>three working days</Text>
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.backButton]}
                                onPress={closeModal}
                            >
                                <Text style={styles.backButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 20,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 40,
    },
    coverImage: {
        width: '70%',
        height: 400,
        resizeMode: 'cover',
        marginTop: 80,
        alignSelf: 'center',
    },
    bookInfo: {
        alignItems: 'center',
        marginTop: 16,
    },
    titleSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    category: {
        color: '#666',
        fontWeight: '400',
    },
    publisher: {
        color: '#666',
        marginTop: 2,
        textAlign: 'center',
    },
    priceContainer: {
        marginTop: 24,
    },
    priceLabel: {
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 12,
        color: '#595757',
        marginBottom: 10,
    },
    priceInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#999',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    switchLabel: {
        fontSize: 16,
        color: '#595757',
    },
    publishButtonContainer: {
        marginTop: 32,
    },
    publishButton: {
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    publishText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '70%',
        alignItems: 'center',
    },
    modalIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#f1e1ff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalDescription: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 24,
    },
    modalButtons: {
        width: '100%',
    },
    modalButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: 'white',
    },
    backButtonText: {
        color: '#AD52F7',
        fontSize: 16,
        fontWeight: '500',
    },
});