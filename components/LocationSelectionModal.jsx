import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import * as Location from 'expo-location';
import { SearchNormal } from 'iconsax-react-native';

const API_KEY = 'AIzaSyCKGOncl1C9CKmSzx9ExmibDumfVSJWl6s';

const defaultLocations = [
];

const LocationSelectionModal = ({ isVisible, onClose, onSelectLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState(defaultLocations);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserLocation = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
        );
        const data = await response.json();
        const addressComponents = data.results[0].address_components;
        
        const countryComponent = addressComponents.find(component => component.types.includes('country'));
        const stateComponent = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
        
        const country = countryComponent ? countryComponent.long_name : null;
        const state = stateComponent ? stateComponent.long_name : null;
        
        return { country, state };
      } catch (error) {
        console.error('Error fetching user location:', error);
        return { country: null, state: null };
      }
    };

    const fetchPopularLocations = async (country, state) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=popular+places+in+${encodeURIComponent(state)}+${encodeURIComponent(country)}&key=${API_KEY}`
        );
        const data = await response.json();
        const formattedLocations = data.results.map(result => {
          const addressComponents = result.formatted_address.split(',').map(item => item.trim());
          const city = addressComponents[addressComponents.length - 3] || '';
          const state = addressComponents[addressComponents.length - 2] || '';
          const country = addressComponents[addressComponents.length - 1] || '';

          return { city, state, country };
        });

        setLocations(formattedLocations);
      } catch (error) {
        console.error('Error fetching popular locations:', error);
      }
    };

    const getUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setLocations(defaultLocations); // Fallback to default locations if permission is denied
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const { country, state } = await fetchUserLocation(latitude, longitude);
      if (country && state) {
        await fetchPopularLocations(country, state);
      } else {
        setLocations(defaultLocations); // Fallback to default locations if user's country and state are not available
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const searchLocations = async () => {
      if (!searchQuery) return;

      console.log('Searching for locations with query:', searchQuery);
      setLoading(true);

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${API_KEY}`
        );
        const data = await response.json();
        console.log('API Response:', data);

        const formattedLocations = data.results.map(result => {
          const addressComponents = result.formatted_address.split(',').map(item => item.trim());
          const city = addressComponents[addressComponents.length - 3] || '';
          const state = addressComponents[addressComponents.length - 2] || '';
          const country = addressComponents[addressComponents.length - 1] || '';

          console.log('Formatted location:', { city, state, country });
          return { city, state, country };
        });

        setLocations(formattedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => searchLocations(), 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleLocationSelect = (location) => {
    console.log('Selected location:', location);
    const locationString = `${location.city}, ${location.state}, ${location.country}`.trim();
    setSelectedLocation(location);
    onSelectLocation(locationString);
    onClose();
  };

  const renderLocationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleLocationSelect(item)}
    >
      <Text style={styles.locationText}>
        {`${item.city}, ${item.state}, ${item.country}`.trim()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      isVisible={isVisible}
      style={styles.modal}
      onBackdropPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.modalContent}>
        <View style={styles.dragIndicator} />

        <View style={styles.searchContainer}>
          <SearchNormal size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#AD52F7" />
        ) : (
          <FlatList
            data={locations}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderLocationItem}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  dragIndicator: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    marginVertical: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  locationItem: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#BCBABA',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
  },
});

export default LocationSelectionModal;
