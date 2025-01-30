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
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [watchId, setWatchId] = useState(null);

  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  // Function to check location service status
  const checkLocationServices = async () => {
    const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (result === RESULTS.GRANTED) {
      // console.log("RESULT - ", result,  RESULTS, RESULTS.GRANTED)
      Geolocation.getCurrentPosition(
        position => {
          console.log('Location fetched:', position);
          setIsLocationEnabled(true);
        },
        error => {
          console.error('Error checking location:', error);
          setIsLocationEnabled(false);
        },
        {enableHighAccuracy: true},
      );
    } else {
      setIsLocationEnabled(false);
    }
  };

  // Watch position and handle location state
  const startWatchingLocation = () => {
    const id = Geolocation.watchPosition(
      position => {
        console.log('Position updated:', position);
      },
      error => {
        console.error('Error during watchPosition:', error);
      },
      {enableHighAccuracy: true, distanceFilter: 0},
    );
    setWatchId(id);
  };

  // Clear watch when unmounting
  const stopWatchingLocation = () => {
    if (watchId !== null) {
      Geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  };

  // Monitor location services
  useEffect(() => {
    const interval = setInterval(checkLocationServices, 10000); // Check every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (!isLocationEnabled) {
      Alert.alert(
        'Location Disabled',
        'Location services have been disabled. Please enable them to use this feature.',
        [{text: 'OK'}],
      );
    }
  }, [isLocationEnabled]);

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

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/method/custom_pdg.api.get_global_data`,
        );
        const data = await res.json();

        const {message} = data;
        const {location_tack_every_second, login_time, static_url} = message[0];
        await setItemAsync('locationEverySecond', location_tack_every_second);
        await setItemAsync('loginTime', login_time);
        await setItemAsync('staticUrl', static_url);
      } catch (error) {
        // const test = {};
        Alert.alert('Some Error', JSON.stringify(error));
        // test.should.crash();
      }
    };
    fetchUrls();
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
