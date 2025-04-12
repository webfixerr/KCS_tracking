import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import useAuthStore from '../store/auth.store';
import Login from '../screens/Login';
import Home from '../screens/Home';

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  const {isAuthenticated, initialize} = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <Stack.Navigator>

      {isAuthenticated ? (
        <Stack.Screen
          name="Attendance"
          component={Home}
          options={{headerShown: false}}
        />
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
      )}
    </Stack.Navigator>
  );
}
