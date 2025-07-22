"use client"

import { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"
import * as Font from "expo-font"
import { useAuthStore } from "./src/store/authStore"
import LoginScreen from "./src/screens/LoginScreen"
import DrawerNavigator from "./src/navigation/DrawerNavigator"

const Stack = createStackNavigator()

export default function App() {
  const { isAuthenticated, checkAuthStatus } = useAuthStore()

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          // Load any custom fonts here if needed
        })
        await checkAuthStatus()
      } catch (error) {
        console.error("Error loading fonts:", error)
      }
    }

    loadFonts()
  }, [])

  return (
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
  )
}
