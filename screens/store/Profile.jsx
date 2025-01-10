import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';
import WhatsappButton from '../../components/WhatsappButton';

import {
  ShoppingBag,
  ProfileCircle,
  SecurityUser,
  Shop,
  LogoutCurve,
  ArrowRight2,
  Add
} from 'iconsax-react-native';

export default function Profile() {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const menuItems = [
    {
      icon: <Add size={24} color="#CD8DFE" variant="Linear" />,
      title: "Sales Manager",
      onPress: () => navigation.navigate('ViewSalesManagers')
    },
    {
      icon: <ProfileCircle size={24} color="#CD8DFE" variant="Linear" />,
      title: "Profile Details",
      onPress: () => navigation.navigate('ViewProfileDetails')
    },
    {
      icon: <SecurityUser size={24} color="#CD8DFE" variant="Linear" />,
      title: "Account settings",
      onPress: () => navigation.navigate('AccountSettings')
    },
    {
      icon: <Shop size={24} color="#CD8DFE" variant="Linear" />,
      title: "Store Details",
      onPress: () => navigation.navigate('ViewStoreDetails')
    },
  ];

  const MenuItem = ({ icon, title, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <ArrowRight2 size={24} color="#BCBABA" variant="Linear" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Icon */}
      <View style={styles.headerIcon}>
        <ShoppingBag size={80} color="#CD8DFE" variant="Linear" />
      </View>
      <View style={styles.content}>
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <MenuItem key={index} icon={item.icon} title={item.title} onPress={item.onPress} />
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={toggleModal}>
          <LogoutCurve size={24} color="#A66FE5" variant="Linear" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        onSwipeComplete={toggleModal}
        swipeDirection={['down']}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Log Out</Text>
          <Text style={styles.modalDescription}>
            Are you sure you want to log out?
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
              style={[styles.modalButton, styles.logOutBtn]}
            >
              <TouchableOpacity style={styles.logOutBtnTouch} onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.logOutBtnText}>Log Out</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      <WhatsappButton />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  headerIcon: {
    alignItems: 'center',
    paddingTop: '30%',
    paddingBottom: '10%',
    backgroundColor: '#f9f0ff',
    padding: 20,
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.04)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#F8F2FF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: '#000000',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  logoutText: {
    marginLeft: 10,
    color: '#A66FE5',
    fontSize: 16,
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
  logOutBtn: {
    backgroundColor: '#CD8DFE',
  },
  backBtnText: {
    fontSize: 16,
    color: '#000000',
  },
  logOutBtnText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});