// AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen'; // This will be your new entry screen
import GraphScreen from './GraphScreen'; // This is your current App component

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Graph" component={GraphScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
