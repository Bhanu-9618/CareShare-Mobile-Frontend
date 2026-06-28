import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useApp } from '../context/AppContext';

import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import DonorHomeScreen from '../screens/main/DonorHomeScreen';
import AddFoodScreen from '../screens/main/AddFoodScreen';
import VolunteerFeedScreen from '../screens/main/VolunteerFeedScreen';
import FoodDetailScreen from '../screens/main/FoodDetailScreen';
import OngoingTaskScreen from '../screens/main/OngoingTaskScreen';
import VerificationScreen from '../screens/main/VerificationScreen';
import ReceiverHomeScreen from '../screens/main/ReceiverHomeScreen';
import HistoryScreen from '../screens/main/HistoryScreen';
import VolunteerInventoryScreen from '../screens/main/VolunteerInventoryScreen';
import ReceiverLiveFeedScreen from '../screens/main/ReceiverLiveFeedScreen';
import ReceiverRequestsScreen from '../screens/main/ReceiverRequestsScreen';
import AdvancedVerificationScreen from '../screens/main/AdvancedVerificationScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function DonorTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Donor Home" component={DonorHomeScreen} />
      <Tab.Screen name="Post Food" component={AddFoodScreen} />
      <Tab.Screen name="History Log" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function VolunteerTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Available Food" component={VolunteerFeedScreen} />
      <Tab.Screen name="My Inventory" component={VolunteerInventoryScreen} />
      <Tab.Screen name="My Task" component={OngoingTaskScreen} />
      <Tab.Screen name="History Log" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function ReceiverTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
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