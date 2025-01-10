import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    BackHandler,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { ArrowLeft2 } from 'iconsax-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export const useCustomBackHandler = () => {
    const navigation = useNavigation();

    const handleBackPress = React.useCallback(() => {
        navigation.goBack();
        return true;
    }, [navigation]);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [handleBackPress]);

    return handleBackPress;
};

export default function ProductDetail() {
    const handleBackPress = useCustomBackHandler();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress}>
                    <ArrowLeft2 size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.productHeader}>
                    <Image source={require('../../assets/book.png')} style={styles.mainImage} />
                    <View style={styles.productInfo}>
                        <Text style={styles.productName}>Capital block Party</Text>
                        <Text style={styles.productCategory}>Sci-fi</Text>
                        <Text style={styles.rejectedColor}>Rejected</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>
                        A robotsky colored gaming mouse is super cool. It usually has a sleek design with a mix of metallic and
                        futuristic colors, giving it a unique and eye-catching appearance. It often comes with customizable RGB
                        lighting, programmable buttons, high DPI settings for precise movements, and an ergonomic shape for
                        comfortable gaming sessions.
                    </Text>
                </View>

                <Text style={styles.subtleText}>
                    If you feel we got something wrong, please click the button below to send us a mail.
                </Text>

                <LinearGradient
                    colors={['#AD52F7', '#CD8DFE']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.mailButton}
                >
                    <TouchableOpacity style={styles.mailButtonContent}>
                        <Text style={styles.mailButtonText}>Send us a mail</Text>
                    </TouchableOpacity>
                </LinearGradient>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 60,
        paddingBottom: 20,
    },
    content: {
        flex: 1,
    },
    productHeader: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    mainImage: {
        width: 120,
        height: 80,
        borderRadius: 15,
        marginRight: 16,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '700',
    },
    productCategory: {
        fontSize: 16,
        color: '#BCBABA',
        fontWeight: 400,
        marginVertical: 3,
    },
    rejectedColor: {
        fontSize: 13,
        fontWeight: 500,
        color: 'red',
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666',
        borderWidth: 0.5,
        borderColor: '#BCBABA',
        padding: 15,
        borderRadius: 10,
    },
    subtleText: {
        fontSize: 14,
        color: '#BCBABA',
        padding: 16,
        textAlign: 'center',
        marginTop: 30,
    },
    mailButton: {
        width: 190,
        height: 40,
        marginTop: 10,
        marginLeft: 98,
        borderRadius: 8,
        paddingTop: 3,
        paddingHorizontal: 30,
        paddingBottom: 3,
    },
    mailButtonContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mailButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});