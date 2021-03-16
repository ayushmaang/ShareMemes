import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./src/screens/HomeScreen";
import ShareScreen from "./src/screens/ShareScreen";
import ViewScreen from "./src/screens/ViewScreen";
import QRCodeScanner from "./src/screens/QRCodeScanner";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Share" component={QRCodeScanner} />
        <Stack.Screen name="View" component={ViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
