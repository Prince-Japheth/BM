import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Wifi } from 'iconsax-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const NoInternetModal = ({ isVisible, onRetry }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {}}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBackground}>
              <Wifi size={32} color="#AD52F7" variant="Bold" />
            </View>
          </View>
          
          <Text style={styles.title}>No Internet Connection</Text>
          <Text style={styles.description}>
            Please check your internet connection and try again
          </Text>
          
          <TouchableOpacity 
            onPress={onRetry}
            style={styles.buttonContainer}
          >
            <LinearGradient
              colors={['#AD52F7', '#CD8DFE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.retryButton}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.35,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconBackground: {
    backgroundColor: 'rgba(173, 82, 247, 0.1)',
    padding: 16,
    borderRadius: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  retryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default NoInternetModal;