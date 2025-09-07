"use client";

import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View, StyleSheet, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { useAuthStore } from "./src/store/authStore";
import LoginScreen from "./src/screens/LoginScreen";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import { useLoadingStore } from "./src/store/loadingStore";

const Stack = createStackNavigator();

export default function App() {
  const isLoading = useLoadingStore((state) => state.isLoading);
  const { isAuthenticated, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          // Load any custom fonts here if needed
        });
        await checkAuthStatus();
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    };

    loadFonts();
  }, []);

  return (
    <>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            <Stack.Screen name="Main" component={DrawerNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      {isLoading && <LoadingOverlay />}
    </>
  );
}

const LoadingOverlay = () => {
  return (
    <View style={overlayStyles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={overlayStyles.text}>Loading...</Text>
    </View>
  );
};

const overlayStyles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
});
