// C:\Users\USER\Documents\bondyt-merchant-app\components\security\SetPriceModal.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const SetPriceModal = ({
  isVisible,
  newPrice,
  setNewPrice,
  onSetPrice,
  onToggleVisibility,
  isSettingPrice
}) => {

  const handlePriceChange = (text) => {
    // Remove the dollar sign and any other non-numeric characters except decimal
    const formattedPrice = text.replace(/[^0-9.]/g, '');
    setNewPrice(formattedPrice);
  };

  if (!isVisible) {
    return (
      <View style={styles.setPrice}>
        <View style={styles.illustrationn}>
          <Image
            source={require('../../assets/request_quote.png')}
            style={styles.illustration}
            contentFit="contain"
          />
        </View>
        <Text style={styles.qTitle}>
          What would you like your service to be priced at?
        </Text>
        <Text style={styles.qsubtitle}>
          Create a price range that would be displayed to your customers when they book your service
        </Text>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={onToggleVisibility}
          disabled={isSettingPrice}
        >
          <LinearGradient
            colors={['#AD52F7', '#CD8DFE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Set Price</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.setPriceMainContentContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/request_quote.png')}
          style={styles.illustrationImage}
          contentFit="contain"
        />
      </View>
      <TextInput
        style={styles.priceInput}
        placeholder="$0.00"
        keyboardType="numeric"
        value={newPrice ? `$${newPrice}` : ''}
        onChangeText={handlePriceChange}
        editable={!isSettingPrice}
      />
      <TouchableOpacity
        style={[
          styles.setPriceButtonContainer,
          isSettingPrice && styles.setPriceButtonDisabled
        ]}
        onPress={onSetPrice}
        disabled={isSettingPrice}
      >
        <LinearGradient
          colors={['#AD52F7', '#CD8DFE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.setPriceGradientButton}
        >
          {isSettingPrice ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.setPriceButtonLabel}>Save</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  setPrice: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    margin: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  illustration: {
    alignSelf: 'center',
  },
  illustrationn: {
    alignSelf: 'center',
    backgroundColor: '#f1e1ff',
    padding: 20,
    borderRadius: 100,
  },
  qTitle: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: '600',
  },
  qsubtitle: {
    fontSize: 15,
    color: '#BCBABA',
    textAlign: 'center',
    fontWeight: '400',
  },
  buttonContainer: {
    width: 152,
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 30,
  },
  button: {
    width: 152,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  setPriceMainContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    margin: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  illustrationImage: {
    alignSelf: 'center',
  },
  imageContainer: {
    alignSelf: 'center',
    backgroundColor: '#f1e1ff',
    padding: 20,
    borderRadius: 100,
  },
  priceInput: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
  },
  setPriceButtonContainer: {
    width: 152,
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 30,
  },
  setPriceGradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setPriceButtonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  setPriceButtonDisabled: {
    opacity: 0.7,
  },
});

