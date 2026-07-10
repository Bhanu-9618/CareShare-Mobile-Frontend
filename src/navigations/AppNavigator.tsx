import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useApp } from '../context/AppContext';
import { RootStackParamList, RootTabParamList } from '../types/navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants/colors';

import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import VerifyAccountScreen from '../screens/auth/VerifyAccountScreen';
import DonorHomeScreen from '../screens/main/donor/DonorHomeScreen';
import AddFoodScreen from '../screens/main/donor/AddFoodScreen';
import VolunteerFeedScreen from '../screens/main/volunteer/VolunteerFeedScreen';
import FoodDetailScreen from '../screens/main/FoodDetailScreen';
import OngoingTaskScreen from '../screens/main/volunteer/OngoingTaskScreen';
import VerificationScreen from '../screens/main/VerificationScreen';
import ReceiverHomeScreen from '../screens/main/receiver/ReceiverHomeScreen';
import HistoryScreen from '../screens/main/HistoryScreen';
import VolunteerInventoryScreen from '../screens/main/volunteer/VolunteerInventoryScreen';
import ReceiverLiveFeedScreen from '../screens/main/receiver/ReceiverLiveFeedScreen';
import ReceiverRequestsScreen from '../screens/main/receiver/ReceiverRequestsScreen';
import AdvancedVerificationScreen from '../screens/main/AdvancedVerificationScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import ExpiredDonationsScreen from '../screens/main/ExpiredDonationsScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const getScreenOptions = ({ route }: any) => ({
  headerShown: false,
  tabBarIcon: ({ focused, color, size }: any) => {
    let iconName = 'help-outline';

    if (route.name === 'Donor Home' || route.name === 'Receiver Hub') {
      iconName = focused ? 'home' : 'home-outline';
    } else if (route.name === 'Post Food') {
      iconName = focused ? 'add-circle' : 'add-circle-outline';
    } else if (route.name === 'History Log') {
      iconName = focused ? 'time' : 'time-outline';
    } else if (route.name === 'Expired') {
      iconName = focused ? 'warning' : 'warning-outline';
    } else if (route.name === 'Profile') {
      iconName = focused ? 'person' : 'person-outline';
    } else if (route.name === 'Available Food' || route.name === 'Live Feed') {
      iconName = focused ? 'restaurant' : 'restaurant-outline';
    } else if (route.name === 'My Inventory') {
      iconName = focused ? 'cube' : 'cube-outline';
    } else if (route.name === 'My Task') {
      iconName = focused ? 'bicycle' : 'bicycle-outline';
    } else if (route.name === 'My Requests') {
      iconName = focused ? 'list' : 'list-outline';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: COLORS.primary,
  tabBarInactiveTintColor: 'gray',
});

function DonorTabs() {
  return (
    <Tab.Navigator screenOptions={getScreenOptions}>
      <Tab.Screen name="Donor Home" component={DonorHomeScreen} />
      <Tab.Screen name="Post Food" component={AddFoodScreen} />
      <Tab.Screen name="History Log" component={HistoryScreen} />
      <Tab.Screen name="Expired" component={ExpiredDonationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function VolunteerTabs() {
  return (
    <Tab.Navigator screenOptions={getScreenOptions}>
      <Tab.Screen name="Available Food" component={VolunteerFeedScreen} />
      <Tab.Screen name="My Inventory" component={VolunteerInventoryScreen} />
      <Tab.Screen name="My Task" component={OngoingTaskScreen} />
      <Tab.Screen name="History Log" component={HistoryScreen} />
      <Tab.Screen name="Expired" component={ExpiredDonationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function ReceiverTabs() {
  return (
    <Tab.Navigator screenOptions={getScreenOptions}>
      <Tab.Screen name="Live Feed" component={ReceiverLiveFeedScreen} />
      <Tab.Screen name="My Requests" component={ReceiverRequestsScreen} />
      <Tab.Screen name="Receiver Hub" component={ReceiverHomeScreen} />
      <Tab.Screen name="History Log" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useApp();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user === null ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="VerifyAccount" component={VerifyAccountScreen} />
        </>
      ) : (
        <>
          {user.role === 'Donor' && <Stack.Screen name="MainTabs" component={DonorTabs} />}
          {user.role === 'Volunteer' && <Stack.Screen name="MainTabs" component={VolunteerTabs} />}
          {user.role === 'Receiver' && <Stack.Screen name="MainTabs" component={ReceiverTabs} />}
          
          <Stack.Screen name="FoodDetail" component={FoodDetailScreen} options={{ headerShown: true, title: 'Donation Details' }} />
          <Stack.Screen name="Verification" component={VerificationScreen} options={{ headerShown: true, title: 'Verify Delivery' }} />
          <Stack.Screen name="AdvancedVerification" component={AdvancedVerificationScreen} options={{ headerShown: true, title: 'Secure Handover' }} />
        </>
      )}
    </Stack.Navigator>
  );
}