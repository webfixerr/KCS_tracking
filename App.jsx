import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import {BASE_URL} from './src/utils/api';

//Context state imports
import {AuthProvider} from './src/context/AuthContext';
import {ActivityProvider} from './src/context/ActivityContext';

import StackNavigation from './src/navigation/StackNavigation';
import usePushNotification from './src/hooks/usePushNotification';

import {Alert} from 'react-native';

import {setItem, setItemAsync} from './src/utils/Storage';

import Geolocation from '@react-native-community/geolocation';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

function App() {
  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();


  useEffect(() => {
    const listenToNotifications = () => {
      try {
        getFCMToken();
        requestUserPermission();
        onNotificationOpenedAppFromQuit();
        listenToBackgroundNotifications();
        listenToForegroundNotifications();
        onNotificationOpenedAppFromBackground();
      } catch (error) {
        console.log('ERROR - ', error);
      }
    };

    listenToNotifications();
  }, []);

  return (
    <AuthProvider>
      <ActivityProvider>
        <NavigationContainer>
          <StackNavigation />
        </NavigationContainer>
      </ActivityProvider>
    </AuthProvider>
  );
}

export default App;
