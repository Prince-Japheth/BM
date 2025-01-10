import React from 'react';
import { TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Whatsapp } from 'iconsax-react-native';

const ChatButton = ({ size = 35, colors = ['#AD52F7', '#CD8DFE'] }) => {
    const phoneNumber = '15096170531'; // Remove the + symbol
    
    const openWhatsApp = async () => {
        // Format the WhatsApp URL based on platform
        const whatsappUrl = Platform.select({
            ios: `whatsapp://send?phone=${phoneNumber}`,
            android: `whatsapp://send?phone=${phoneNumber}`
        });

        // Check if WhatsApp is installed
        try {
            const supported = await Linking.canOpenURL(whatsappUrl);
            
            if (supported) {
                await Linking.openURL(whatsappUrl);
            } else {
                // If WhatsApp is not installed, open in browser
                await Linking.openURL(`https://wa.me/${phoneNumber}`);
            }
        } catch (error) {
            console.error('Error opening WhatsApp:', error);
        }
    };

    return (
        <TouchableOpacity 
            style={styles.chatButton}
            onPress={openWhatsApp}
        >
            <LinearGradient
                colors={['#ECD4FF', '#ECD4FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.chatGradient}
            >
                <Whatsapp size={35} color="#AD52F7" />
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chatButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        borderRadius: 100,
        overflow: 'hidden',
        boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.09)',
    },
    chatGradient: {
        width: 70,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ChatButton;