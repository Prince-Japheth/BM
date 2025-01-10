import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ArrowLeft2, Edit2 } from 'iconsax-react-native';

export default function ViewProfile({ navigation }) {
  const profileData = {
    name: "Aboyi Daniel",
    email: "Aboyidaniel9@gmail.com",
    phone: "08162141984"
  };

  const ProfileItem = ({ text }) => ( 
    <View style={styles.profileItem}>
      <View style={styles.bullet} />
      <Text style={styles.profileText}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}  onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.card}>
        <ProfileItem text={profileData.name} />
        <ProfileItem text={profileData.email} />
        <ProfileItem text={profileData.phone} />
      </View>

      {/* Edit Button */}
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditEventOwnerProfile')}>
        <Edit2 size={20} color="#CD8DFE" variant="Linear" />
      </TouchableOpacity>
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
    marginRight: 30, // To offset the back button and center the title
  },
  card: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderColor: '#BCBABA',
    borderWidth: 1,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A66FE5',
    marginRight: 15,
  },
  profileText: {
    fontSize: 16,
    color: '#333333',
  },
  editButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#f1e1ff',
    padding: 15,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A66FE5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});