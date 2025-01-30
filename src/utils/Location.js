import Geolocation from '@react-native-community/geolocation';
import {AuthContext} from '../context/AuthContext';
import {useContext} from 'react';
import {Alert} from 'react-native';

// Configure Geolocation
Geolocation.setRNConfiguration({
  authorizationLevel: 'always', // Request "always" location permission
  skipPermissionRequests: false, // Prompt for permission if not granted
});

const {updateCoords, setLate, setLong, logout, location_track} =
  useContext(AuthContext);

// Watch for position updates
export const watchId = Geolocation.watchPosition(
  position => {
    console.log(
      'LOCATION TRACK POS - ',
      position.coords.latitude,
      position.coords.longitude,
      location_track,
    );
    setLate(position.coords.latitude);
    setLong(position.coords.longitude);

    updateCoords({
      lat: position.coords.latitude,
      long: position.coords.longitude,
    });
  },
  error => {
    console.log(error);
    Alert.alert(
      'Location Error',
      'Location can not be accessed, please enable it.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => logout(),
        },
        {
          text: 'OK',
          onPress: () =>
            Geolocation.requestAuthorization(
              success => console.log('Location enable again', success),
              error => console.log('Error confirm loacation again', error),
            ),
        },
      ],
      {cancelable: false},
    );
  },
  {
    distanceFilter: 0, // Minimum distance (in meters) to update the location
    interval: 0, // Update interval (in milliseconds), which is any minutes
    fastestInterval: 0, // Fastest update interval (in milliseconds)
    accuracy: {
      android: 'highAccuracy',
      ios: 'best',
    },
    showsBackgroundLocationIndicator: true,
    pausesLocationUpdatesAutomatically: false,
    activityType: 'tracking', // Specify the activity type (e.g., 'fitness' or 'other')
    useSignificantChanges: true,
    deferredUpdatesInterval: 0,
    deferredUpdatesDistance: 0,
    foregroundService: {
      notificationTitle: 'Tracking your location',
      notificationBody: 'Enable location tracking to continue', // Add a notification body
    },
  },
);

// // To stop KCS (for example, when the component unmounts):
// Geolocation.clearWatch(watchId);
