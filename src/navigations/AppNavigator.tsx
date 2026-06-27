import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
import ProfileScreen from '../screens/main/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Available Food" component={VolunteerFeedScreen} />
      <Tab.Screen name="My Task" component={OngoingTaskScreen} />
      <Tab.Screen name="Receiver Hub" component={ReceiverHomeScreen} /> 
      <Tab.Screen name="History Log" component={HistoryScreen} /> 
      <Tab.Screen name="Home" component={DonorHomeScreen} />
      <Tab.Screen name="Post Food" component={AddFoodScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} options={{ headerShown: true, title: 'Donation Details' }} />
      <Stack.Screen name="Verification" component={VerificationScreen} options={{ headerShown: true, title: 'Verify Delivery' }} />
    </Stack.Navigator>
  );
}