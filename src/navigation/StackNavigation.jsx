import React, {useContext, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthContext} from '../context/AuthContext';

//Screen import
import Login from '../screens/Login';
import Home from '../screens/Home';
import Loader from '../components/Loader';

import {HOME_PATH, LOGIN_PATH} from '../constants/path';

const StackNavigation = () => {
  const Stack = createNativeStackNavigator();
  const {userToken, isLoading} = useContext(AuthContext);

  if (isLoading) {
    <Loader />;
  }

  console.log('USER TOKEN - ', userToken);

  return (
    <Stack.Navigator initialRouteName={userToken !== null ? Home : Login}>
      {userToken !== null ? (
        <Stack.Screen
          name={HOME_PATH}
          component={Home}
          options={{headerShown: false}}
        />
      ) : (
        <Stack.Screen name={LOGIN_PATH} component={Login} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigation;
