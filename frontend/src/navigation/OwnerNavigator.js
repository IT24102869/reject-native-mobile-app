import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/owner/DashboardScreen';
import ManageFoodScreen from '../screens/owner/ManageFoodScreen';
import AddFoodScreen from '../screens/owner/AddFoodScreen';

const Stack = createNativeStackNavigator();

export default function OwnerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="ManageFood" component={ManageFoodScreen} />
      <Stack.Screen name="AddFood" component={AddFoodScreen} />
    </Stack.Navigator>
  );
}
