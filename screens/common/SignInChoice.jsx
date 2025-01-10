// C:\Users\USER\Documents\bondyt-merchant-app\screens\common\SignInChoice.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { ShopAdd, Profile } from 'iconsax-react-native';

export default function SignInChoice() {
    const navigation = useNavigation();

    const handleSignIn = (role) => {
        navigation.navigate('SignIn', { registrationPayload: { role } });
    };

    return (
        <LinearGradient
            colors={['#AD52F7', '#CD8DFE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>How would you like to sign in</Text>

                        <TouchableOpacity
                            style={styles.choice}
                            onPress={() => handleSignIn('owner')}
                        >
                            <ShopAdd size="20" color="black" />
                            <Text style={styles.choiceText}>Store Owner</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.choice}
                            onPress={() => handleSignIn('manager')}
                        >
                            <Profile size="20" color="black" />
                            <Text style={styles.choiceText}>Sales Manager</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    formContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingTop: 50,
        marginTop: 150,
    },
    title: {
        fontSize: 30,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 32,
    },
    choice: {
        flexDirection: 'row',
        gap: 10,
        padding: 15,
        borderColor: '#E1E1FE',
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 20,
    },
    choiceText: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '600',
    },
});