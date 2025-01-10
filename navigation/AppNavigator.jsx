import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Grid3, ShoppingCart, ProfileCircle, Notification } from 'iconsax-react-native';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 0,
        height: 75,
    },
    tabBarItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tabBarIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTabBarIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 90,
        paddingHorizontal: 12,
        gap: 6,
        height: 40,
    },
    activeTabBarLabel: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
    },
    badgeContainer: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },
});

// Import all screens
import Welcome from '../screens/common/Welcome';
import SignUp from '../screens/common/SignUp';
import SignIn from '../screens/common/SignIn';
import SignInChoice from '../screens/common/SignInChoice';
import ForgotPassword from '../screens/common/ForgotPassword';
import InputResetPin from '../screens/common/InputResetPin';
import SetNewPassword from '../screens/common/SetNewPassword';
import SelectService from '../screens/common/SelectService';
import BankSetupScreen from '../screens/common/BankSetupScreen';
import PaypalPay from '../screens/common/PaypalPay';
import BankSelectionScreen from '../screens/common/BankSelectionScreen';
import ViewSalesManagers from '../screens/common/ViewSalesManagers';
import AddSalesManager from '../screens/common/AddSalesManager';
import AccountSettings from '../screens/common/AccountSettings';
import ChangePassword from '../screens/common/ChangePassword';
import Notifications from '../screens/common/Notifications';

// Store Screens
import StoreDashboard from '../screens/store/StoreDashboard';
import StoreOrders from '../screens/store/StoreOrders';
import StoreProfile from '../screens/store/Profile';
import CreateStoreDetails from '../screens/store/CreateStoreDetails';
import StoreProductDetail from '../screens/store/StoreProductDetail';
import EditStoreProduct from '../screens/store/EditProduct';
import UploadStoreProduct from '../screens/store/UploadStoreProduct';
import StoreOrderDetails from '../screens/store/StoreOrderDetails';
import ViewProfileDetails from '../screens/store/ViewProfileDetails';
import EditStoreProfile from '../screens/store/EditProfile';
import ViewStoreDetails from '../screens/store/ViewStoreDetails';
import EditStoreDetails from '../screens/store/EditStoreDetails';
import EditStoreSalesManager from '../screens/store/EditSalesManager';

// Place Screens
import PlaceDashboard from '../screens/place/PlaceDashboard';
import Reservations from '../screens/place/Reservations';
import PlaceProfile from '../screens/place/Profile';
import CreatePlaceOwnerProfile from '../screens/place/CreatePlaceOwnerProfile';
import ViewPlaceListing from '../screens/place/ViewPlaceListing';
import EditPlaceListing from '../screens/place/EditPlaceListing';
import AddPlaceListing from '../screens/place/AddPlaceListing';
import ReservationDetails from '../screens/place/ReservationDetails';
import ViewPlaceProfileDetails from '../screens/place/ViewProfileDetails';
import EditPlaceProfileDetails from '../screens/place/EditProfileDetails';
import ViewPlaceListingProfileDetails from '../screens/place/ViewPlaceListingProfileDetails';
import EditPlaceListingProfileDetails from '../screens/place/EditPlaceListingProfileDetails';

// Event Screens
import EventDashboard from '../screens/events/EventDashboard';
import EventProfile from '../screens/events/Profile';
import CreateEventOwnerProfile from '../screens/events/CreateEventOwnerProfile';
import EventDetail from '../screens/events/EventDetail';
import EditEventDetails from '../screens/events/EditEventDetails';
import AddEvent from '../screens/events/AddEvent';
import ViewEventOwnerProfileDetails from '../screens/events/ViewProfileDetails';
import EditEventOwnerProfile from '../screens/events/EditEventOwnerProfile';
import EditEventListingProfileDetails from '../screens/events/EditEventListingProfileDetails';
import ViewEventListingProfile from '../screens/events/ViewEventListingProfile';

// Security Screens
import SecurityDashboard from '../screens/security/SecurityDashboard';
import SecurityProfile from '../screens/security/Profile';
import CreateSecurityOwnerProfile from '../screens/security/CreateSecurityOwnerProfile';
import SecurityRequest from '../screens/security/SecurityRequest';
import AssignOfficer from '../screens/security/AssignOfficer';
import OfficerAssigned from '../screens/security/OfficerAssigned';
import AssignedSecurityRequest from '../screens/security/AssignedSecurityRequest';
import CompletedJobs from '../screens/security/CompletedJobs';
import AddSecurityOfficer from '../screens/security/AddSecurityOfficer';
import ViewSecurityOwnerProfileDetails from '../screens/security/ViewSecurityOwnerProfileDetails';
import EditSecurityListingProfileDetails from '../screens/security/EditSecurityListingProfileDetails';
import ViewSecurityListingProfile from '../screens/security/ViewSecurityListingProfile';
import SecurityList from '../screens/security/SecurityList';
import UpdateSecurityPrice from '../screens/security/UpdateSecurityPrice';

// Book Screens
import BookDashboard from '../screens/books/BookDashboard';
import BookProfile from '../screens/books/Profile';
import CreateBookOwnerProfile from '../screens/books/CreateBookOwnerProfile';
import BookDetails from '../screens/books/BookDetails';
import RejectedBookDetails from '../screens/books/RejectedBookDetails';
import ViewAllUploads from '../screens/books/ViewAllUploads';
import AddBook from '../screens/books/AddBook';
import PreviewAddBook from '../screens/books/PreviewAddBook';
import ViewBookOwnerProfileDetails from '../screens/books/ViewProfileDetails';
import EditBookOwnerProfile from '../screens/books/EditBookOwnerProfile';
import EditBookListingProfileDetails from '../screens/books/EditBookListingProfileDetails';
import ViewBookListingProfile from '../screens/books/ViewBookListingProfile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const tabNavigatorScreenOptions = {
    headerShown: false,
    tabBarStyle: styles.tabBar,
    tabBarActiveTintColor: '#FFFFFF',
    tabBarInactiveTintColor: '#9CA3AF',
    tabBarItemStyle: styles.tabBarItem,
    tabBarShowLabel: false,
    tabBarPressColor: 'transparent',
};

const createTabIcon = (Icon, label, width, marginLeft = 0, marginRight = 0) => ({ focused }) => (
    focused ? (
        <LinearGradient
            colors={['#AD52F7', '#CD8DFE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[{ width, marginLeft, marginRight }, styles.activeTabBarIconContainer]}
        >
            <Icon variant="Bold" color="#FFFFFF" size={23} />
            <Text style={styles.activeTabBarLabel}>{label}</Text>
        </LinearGradient>
    ) : (
        <View style={styles.tabBarIconContainer}>
            <Icon color="#9CA3AF" size={23} />
        </View>
    )
);

const createTabNavigator = (screens) => () => (
    <Tab.Navigator screenOptions={tabNavigatorScreenOptions}>
        {screens.map(({ name, component, icon, label, width, marginLeft, marginRight }) => (
            <Tab.Screen
                key={name}
                name={name}
                component={component}
                options={{
                    tabBarIcon: createTabIcon(icon, label, width, marginLeft, marginRight),
                }}
            />
        ))}
    </Tab.Navigator>
);

const StoreTabNavigator = createTabNavigator([
    { name: 'StoreDashboard', component: StoreDashboard, icon: Grid3, label: 'Dashboard', width: 110, marginLeft: 40 },
    { name: 'StoreOrders', component: StoreOrders, icon: ShoppingCart, label: 'Orders', width: 90 },
    { name: 'Notifications', component: Notifications, icon: Notification, label: 'Notifications', width: 125, marginHorizontal: 50 },
    { name: 'StoreProfile', component: StoreProfile, icon: ProfileCircle, label: 'Profile', width: 90, marginRight: 20 },
]);

const PlaceTabNavigator = createTabNavigator([
    { name: 'PlaceDashboard', component: PlaceDashboard, icon: Grid3, label: 'Dashboard', width: 110, marginLeft: 40 },
    { name: 'Reservations', component: Reservations, icon: ShoppingCart, label: 'Orders', width: 95 },
    { name: 'Notifications', component: Notifications, icon: Notification, label: 'Notifications', width: 125, marginHorizontal: 50 },
    { name: 'PlaceProfile', component: PlaceProfile, icon: ProfileCircle, label: 'Profile', width: 90, marginRight: 20 },
]);

const EventsTabNavigator = createTabNavigator([
    { name: 'EventDashboard', component: EventDashboard, icon: Grid3, label: 'Dashboard', width: 110 },
    { name: 'Notifications', component: Notifications, icon: Notification, label: 'Notifications', width: 125, marginHorizontal: 50 },
    { name: 'EventProfile', component: EventProfile, icon: ProfileCircle, label: 'Profile', width: 95 },
]);

const SecurityTabNavigator = createTabNavigator([
    { name: 'SecurityDashboard', component: SecurityDashboard, icon: Grid3, label: 'Dashboard', width: 110 },
    { name: 'Notifications', component: Notifications, icon: Notification, label: 'Notifications', width: 125 },
    { name: 'SecurityProfile', component: SecurityProfile, icon: ProfileCircle, label: 'Profile', width: 95 },
]);

const BooksTabNavigator = createTabNavigator([
    { name: 'BookDashboard', component: BookDashboard, icon: Grid3, label: 'Dashboard', width: 110 },
    { name: 'Notifications', component: Notifications, icon: Notification, label: 'Notifications', width: 125, marginHorizontal: 50 },
    { name: 'BookProfile', component: BookProfile, icon: ProfileCircle, label: 'Profile', width: 95 },
]);

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{ headerShown: false }}
            >
                {/* Common Screens */}
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen name="SignInChoice" component={SignInChoice} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen name="InputResetPin" component={InputResetPin} />
                <Stack.Screen name="SetNewPassword" component={SetNewPassword} />
                <Stack.Screen name="SelectService" component={SelectService} />
                <Stack.Screen name="BankSetupScreen" component={BankSetupScreen} />
                <Stack.Screen name="PaypalPay" component={PaypalPay} />
                <Stack.Screen name="BankSelectionScreen" component={BankSelectionScreen} />

                {/* Store Screens */}
                <Stack.Screen name="CreateStoreDetails" component={CreateStoreDetails} />
                <Stack.Screen name="StoreProductDetail" component={StoreProductDetail} />
                <Stack.Screen name="EditStoreProduct" component={EditStoreProduct} />
                <Stack.Screen name="UploadStoreProduct" component={UploadStoreProduct} />
                <Stack.Screen name="StoreOrderDetails" component={StoreOrderDetails} />
                <Stack.Screen name="ViewProfileDetails" component={ViewProfileDetails} />
                <Stack.Screen name="EditStoreProfile" component={EditStoreProfile} />
                <Stack.Screen name="AccountSettings" component={AccountSettings} />
                <Stack.Screen name="ChangePassword" component={ChangePassword} />
                <Stack.Screen name="ViewStoreDetails" component={ViewStoreDetails} />
                <Stack.Screen name="EditStoreDetails" component={EditStoreDetails} />
                <Stack.Screen name="ViewSalesManagers" component={ViewSalesManagers} />
                <Stack.Screen name="AddSalesManager" component={AddSalesManager} />
                <Stack.Screen name="EditStoreSalesManager" component={EditStoreSalesManager} />
                <Stack.Screen name="StoreTabNavigator" component={StoreTabNavigator} />

                {/* Place Screens */}
                <Stack.Screen name="CreatePlaceOwnerProfile" component={CreatePlaceOwnerProfile} />
                <Stack.Screen name="ViewPlaceListing" component={ViewPlaceListing} />
                <Stack.Screen name="EditPlaceListing" component={EditPlaceListing} />
                <Stack.Screen name="AddPlaceListing" component={AddPlaceListing} />
                <Stack.Screen name="ReservationDetails" component={ReservationDetails} />
                <Stack.Screen name="ViewPlaceProfileDetails" component={ViewPlaceProfileDetails} />
                <Stack.Screen name="EditPlaceProfileDetails" component={EditPlaceProfileDetails} />
                <Stack.Screen name="ViewPlaceListingProfileDetails" component={ViewPlaceListingProfileDetails} />
                <Stack.Screen name="EditPlaceListingProfileDetails" component={EditPlaceListingProfileDetails} />
                <Stack.Screen name="PlaceTabNavigator" component={PlaceTabNavigator} />

                {/* Events Screens */}
                <Stack.Screen name="CreateEventOwnerProfile" component={CreateEventOwnerProfile} />
                <Stack.Screen name="EventDetail" component={EventDetail} />
                <Stack.Screen name="EditEventDetails" component={EditEventDetails} />
                <Stack.Screen name="AddEvent" component={AddEvent} />
                <Stack.Screen name="ViewEventOwnerProfileDetails" component={ViewEventOwnerProfileDetails} />
                <Stack.Screen name="EditEventOwnerProfile" component={EditEventOwnerProfile} />
                <Stack.Screen name="ViewEventListingProfile" component={ViewEventListingProfile} />
                <Stack.Screen name="EditEventListingProfileDetails" component={EditEventListingProfileDetails} />
                <Stack.Screen name="EventsTabNavigator" component={EventsTabNavigator} />

                {/* Security Screens */}
                <Stack.Screen name="CreateSecurityOwnerProfile" component={CreateSecurityOwnerProfile} />
                <Stack.Screen name="SecurityRequest" component={SecurityRequest} />
                <Stack.Screen name="AssignOfficer" component={AssignOfficer} />
                <Stack.Screen name="OfficerAssigned" component={OfficerAssigned} />
                <Stack.Screen name="AssignedSecurityRequest" component={AssignedSecurityRequest} />
                <Stack.Screen name="AddSecurityOfficer" component={AddSecurityOfficer} />
                <Stack.Screen name="CompletedJobs" component={CompletedJobs} />
                <Stack.Screen name="ViewSecurityOwnerProfileDetails" component={ViewSecurityOwnerProfileDetails} />
                <Stack.Screen name="EditSecurityListingProfileDetails" component={EditSecurityListingProfileDetails} />
                <Stack.Screen name="ViewSecurityListingProfile" component={ViewSecurityListingProfile} />
                <Stack.Screen name="SecurityList" component={SecurityList} />
                <Stack.Screen name="UpdateSecurityPrice" component={UpdateSecurityPrice} />
                <Stack.Screen name="SecurityTabNavigator" component={SecurityTabNavigator} />

                {/* Books Screens */}
                <Stack.Screen name="CreateBookOwnerProfile" component={CreateBookOwnerProfile} />
                <Stack.Screen name="BookDetails" component={BookDetails} />
                <Stack.Screen name="RejectedBookDetails" component={RejectedBookDetails} />
                <Stack.Screen name="ViewAllUploads" component={ViewAllUploads} />
                <Stack.Screen name="AddBook" component={AddBook} />
                <Stack.Screen name="PreviewAddBook" component={PreviewAddBook} />
                <Stack.Screen name="ViewBookOwnerProfileDetails" component={ViewBookOwnerProfileDetails} />
                <Stack.Screen name="EditBookOwnerProfile" component={EditBookOwnerProfile} />
                <Stack.Screen name="ViewBookListingProfile" component={ViewBookListingProfile} />
                <Stack.Screen name="EditBookListingProfileDetails" component={EditBookListingProfileDetails} />
                <Stack.Screen name="BooksTabNavigator" component={BooksTabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

