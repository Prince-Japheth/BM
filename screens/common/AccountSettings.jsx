// C:\Users\USER\Documents\bondyt-merchant-app\screens\common\AccountSettings.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { ArrowLeft2, Trash, Lock1, ArrowRight2 } from 'iconsax-react-native';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/apiService';

export default function AccountSetting() {
    const navigation = useNavigation();

    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            const storedMerchantId = await AsyncStorage.getItem('merchantId');
            const token = await AsyncStorage.getItem('accessToken');
    
            if (!storedMerchantId || !token) {
                throw new Error('Required credentials not found');
            }
    
            console.log(`Attempting to delete account with ID: ${storedMerchantId}`);
            console.log(`Using token: ${token}`);
    
            const response = await api.delete(`/merchants/${storedMerchantId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            console.log('Delete response:', response.data);
    
            Alert.alert('Success', response.data.message, [
                { text: 'OK', onPress: () => navigation.navigate('SignUp') }
            ]);
        } catch (error) {
            console.error('Failed to delete account:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to delete account: Merchant is not approved yet. Please try again later.');
        } finally {
            setLoading(false);
            toggleModal();
        }
    };
    

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft2 size={24} color="#000000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account Settings</Text>
            </View>

            <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => navigation.navigate('ChangePassword')}
            >
                <View style={styles.deleteButtonLeft}>
                    <View style={styles.iconContainer}>
                        <Lock1 size={24} color="#CD8DFE" variant="Linear" />
                    </View>
                    <Text style={styles.deleteButtonText}>Change Password</Text>
                </View>
                <ArrowRight2 size={24} color="#BCBABA" variant="Linear" />
            </TouchableOpacity>

            {/* Delete Account Button */}
            <TouchableOpacity style={styles.deleteButton} onPress={toggleModal}>
                <View style={styles.deleteButtonLeft}>
                    <View style={styles.iconContainer}>
                        <Trash size={24} color="#CD8DFE" variant="Linear" />
                    </View>
                    <Text style={styles.deleteButtonText}>Delete your account</Text>
                </View>
                <ArrowRight2 size={24} color="#BCBABA" variant="Linear" />
            </TouchableOpacity>

            {/* Delete Account Modal */}
            <Modal
                isVisible={isModalVisible}
                onBackdropPress={toggleModal}
                onSwipeComplete={toggleModal}
                swipeDirection={['down']}
                style={styles.modal}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHandle} />
                    <Text style={styles.modalTitle}>Delete Account</Text>
                    <Text style={styles.modalDescription}>
                        Are you sure you want to delete your account?
                    </Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.backBtn]}
                            onPress={toggleModal}
                        >
                            <Text style={styles.backBtnText}>Back</Text>
                        </TouchableOpacity>
                        <LinearGradient
                            colors={['#AD52F7', '#CD8DFE']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.modalButton, styles.deleteBtn]}
                        >
                            <TouchableOpacity
                                style={styles.deleteBtnTouch}
                                onPress={handleDeleteAccount}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.deleteBtnText}>Delete</Text>
                                )}
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '500',
        color: '#666666',
        marginRight: 30,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.04)',
    },
    deleteButtonLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: '#F8F2FF',
        padding: 10,
        borderRadius: 12,
        marginRight: 15,
    },
    deleteButtonText: {
        fontSize: 16,
        color: '#000000',
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 12,
    },
    modalDescription: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 24,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    backBtn: {
        backgroundColor: '#F5F5F5',
    },
    deleteBtn: {
        backgroundColor: '#CD8DFE',
    },
    backBtnText: {
        fontSize: 16,
        color: '#000000',
    },
    deleteBtnText: {
        fontSize: 16,
        color: '#FFFFFF',
    },
});