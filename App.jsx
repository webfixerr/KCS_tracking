import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PermissionsAndroid, Platform } from 'react-native';
import useAuthStore from './src/store/auth.store';
import useAppStore from './src/store/app.store';
import StackNavigation from './src/navigation/StackNavigation';
import Loader from './src/components/Loader';
import ErrorModal from './src/components/ErrorModal';
import { configureInterceptors } from './src/services/api';

function App() {
  // Zustand stores
  const { initialize: initializeAuth } = useAuthStore();
  const { 
    permissionsGranted, 
    setPermissions, 
    setLoading, 
    setError, 
    clearError,
    loading,
    error
  } = useAppStore();

  // Initial app setup
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        console.log('Initialization started');
        
        // 1. Request required permissions
        console.log('Requesting permissions...');
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        console.log('Permissions response:', granted);
        
        const cameraGranted = 
          granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 
          PermissionsAndroid.RESULTS.GRANTED;
          
        const locationGranted = 
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 
          PermissionsAndroid.RESULTS.GRANTED;

        setPermissions(cameraGranted && locationGranted);

        // 2. Initialize auth state
        console.log('Initializing auth...');
        await initializeAuth();

        // 3. Configure API interceptors
        console.log('Configuring API...');
        configureInterceptors({
          auth: useAuthStore.getState(),
          app: useAppStore.getState()
        });

        console.log('Initialization completed successfully');

      } catch (err) {
        console.error('Initialization error:', err);
        setError(`Initialization failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  return (
    <>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>

      {/* Global Components */}
      <Loader visible={loading} />
      <ErrorModal 
        visible={!!error}
        message={error}
        onDismiss={clearError}
      />
    </>
  );
}

export default App;