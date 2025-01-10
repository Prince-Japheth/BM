import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ScrollView } from 'react-native';
import { ArrowLeft2, Edit2 } from 'iconsax-react-native';

export default function ViewProfile({ navigation }) {
  const profileData = {
    organizationName: "Your Organization",
    email: "organization@example.com",
    phone: "08162141984",
    representativeName: "Aboyi Daniel",
    location: "Lagos, Nigeria",
    logo: require('../../assets/securityLogo.png'), // Local image path
    identification: require("../../assets/identification.png") // Replace with the actual identification picture URL
  };

  const ProfileItem = ({ label, value }) => (
    <View style={styles.profileItem}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.readonlyInput}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditSecurityListingProfileDetails')}>
          <Edit2 size={24} color="#CD8DFE" variant="Linear" />
        </TouchableOpacity>
      </View>

      {/* Profile Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Profile Details */}
        <View>
          <ProfileItem label="Name of Organization" value={profileData.organizationName} />
          <ProfileItem label="Official Email" value={profileData.email} />
          <ProfileItem label="Official Phone Number" value={profileData.phone} />
          <ProfileItem label="Representative Name" value={profileData.representativeName} />
          <ProfileItem label="Location" value={profileData.location} />
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.label}>Your Logo</Text>
          <Image source={profileData.logo} style={styles.logo} />
        </View>

        {/* Identification Picture */}
        <Text style={styles.label}>Identification</Text>
        <Image source={profileData.identification} style={styles.identification} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: '#666666',
  },
  editButton: {
    padding: 10,
    backgroundColor: '#f1e1ff',
    borderRadius: 100,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  logoContainer: {
    marginVertical: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#BCBABA',
  },
  profileItem: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  readonlyInput: {
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#BCBABA',
    borderRadius: 8,
    padding: 15,
  },
  identification: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BCBABA',
    marginBottom: 20,
  },
});
