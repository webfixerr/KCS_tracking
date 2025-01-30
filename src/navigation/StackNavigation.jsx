import React, {useContext, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthContext} from '../context/AuthContext';

import {BASE_URL} from '../utils/api';
import {storage} from '../utils/Storage';

//Screen import
import Login from '../screens/Login';
import Maps from '../screens/Maps';
import Home from '../screens/Home';
import Details from '../screens/Issues/Details';
import Forms from '../screens/Forms';
import IssueForm from '../screens/Issues/IssueForm';
import Audit from '../screens/Audit/Audit';
import Installation from '../screens/Installation/Installation';
import Visit from '../screens/Visit/Visit';
import Loader from '../components/Loader';

import {
  ISSUE_FORM,
  AUDIT_FORM,
  INSTALLATION_FORM,
  VISIT_FORM,
  AUDIT_PATH,
  VISIT_PATH,
  INSTALLATION_PATH,
  HOME_PATH,
  MAPS_PATH,
  DETAILS_PATH,
  FORMS_PATH,
  LOGIN_PATH,
} from '../constants/path';
import AuditForm from '../screens/Audit/AuditForm';
import InstallationForm from '../screens/Installation/InstallationForm';
import VisitForm from '../screens/Visit/VisitForm';

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
        <>
          <Stack.Screen name={HOME_PATH} component={Home} options={{headerShown: false}}/>
          <Stack.Screen name={MAPS_PATH} component={Maps} />
          <Stack.Screen name={DETAILS_PATH} component={Details} />
          <Stack.Screen name={FORMS_PATH} component={Forms} />
          <Stack.Screen name={ISSUE_FORM} component={IssueForm} />

          <Stack.Screen name={AUDIT_PATH} component={Audit} />
          <Stack.Screen name={INSTALLATION_PATH} component={Installation} />
          <Stack.Screen name={VISIT_PATH} component={Visit} />
          <Stack.Screen name={AUDIT_FORM} component={AuditForm} />
          <Stack.Screen name={INSTALLATION_FORM} component={InstallationForm} />
          <Stack.Screen name={VISIT_FORM} component={VisitForm} />
        </>
      ) : (
        <Stack.Screen name={LOGIN_PATH} component={Login} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigation;
