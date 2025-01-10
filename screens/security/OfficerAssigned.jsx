import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { TickCircle } from 'iconsax-react-native';
import { CommonActions } from '@react-navigation/native';

export default function OfficerAssigned() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Destructure officer data from route parameters
  const {
    officer,
    pickupLocation,
    logistics,
    scheduledDate,
    securityQuestion
  } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Officer Assigned</Text>
          <TickCircle size={24} color="black" variant="Bold" />
        </View>

        {/* Officer Card */}
        <LinearGradient
          colors={['#F8F0FF', '#F5EAFF']}
          style={styles.card}
        >
          {/* Officer Info */}
          <View style={styles.officerInfo}>
            <Image
              source={{ uri: officer.image_url || require('../../assets/teddy.png') }}
              style={styles.officerImage}
            />
            <Text style={styles.officerName}>{officer.firstName} {officer.lastName}</Text>
          </View>

          {/* Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Pick up location</Text>
              <Text style={styles.value}>{pickupLocation}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Logistics</Text>
              <Text style={styles.value}>{logistics}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Date/Time</Text>
              <Text style={styles.value}>{new Date(scheduledDate).toLocaleString()}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Question</Text>
              <Text style={styles.value}>{securityQuestion}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'SecurityTabNavigator', params: { screen: 'SecurityDashboard' } }],
              })
            );
          }}
        >
          <LinearGradient
            colors={['#AD52F7', '#CD8DFE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.doneButton}
          >
            <Text style={styles.buttonText}>Done</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 16,
        paddingTop: 100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginRight: 8,
    },
    card: {
        padding: 16,
    },
    officerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    officerImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    officerName: {
        fontSize: 16,
        fontWeight: '600',
    },
    detailsContainer: {
        gap: 16,
    },
    detailRow: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderColor: '#BCBABA',
        paddingBottom: 5,
    },
    label: {
        fontSize: 14,
        color: 'black',
        flex: 1,
        fontWeight: 600,
    },
    value: {
        fontSize: 13,
        color: 'black',
        flex: 2,
    },
    buttonContainer: {
        padding: 16,
    },
    doneButton: {
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginBottom: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    backButton: {
        padding: 16,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#666',
        fontSize: 16,
    },
});

