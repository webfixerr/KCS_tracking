import React from 'react';
import 'react-native-gesture-handler';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';

//Screen imports
import AttendanceScreen from '../screens/AttendanceScreen';
import Salary from '../screens/Salary';
import Equipment from '../screens/Equipment';

import {WELCOME_PATH, SALARY_PATH, EQUIPMENT_PATH} from '../constants/path';
import {Text} from 'react-native';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label={() => <Text style={{color: 'white'}}>Logout</Text>}
        style={{backgroundColor: 'red'}}
        // onPress={logout}
      />
    </DrawerContentScrollView>
  );
}

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: true}}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name={WELCOME_PATH}
        component={AttendanceScreen}
        options={{
          drawerActiveTintColor: '#333',
          drawerActiveBackgroundColor: 'lightblue',
        }}
      />
      <Drawer.Screen
        name={SALARY_PATH}
        component={Salary}
        options={{
          drawerActiveTintColor: '#333',
          drawerActiveBackgroundColor: 'lightblue',
        }}
      />
      <Drawer.Screen
        name={EQUIPMENT_PATH}
        component={Equipment}
        options={{
          drawerActiveTintColor: '#333',
          drawerActiveBackgroundColor: 'lightblue',
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
