import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {ACTIVITY_TYPES} from '../utils/api';
import {ACTIVITY_OPTIONS} from '../constants/selectBox';
import SelectBox from '../components/SelectBox';
import {INSTALLATION, AUDIT, VISIT} from '../constants/selectBox';
import {INSTALLATION_PATH, AUDIT_PATH, VISIT_PATH} from '../constants/path';

const Activities = ({navigation}) => {
  const [formType, setFormType] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleNavigation = () => {
    switch (formType) {
      case INSTALLATION:
        navigation.navigate(INSTALLATION_PATH, {
          type: formType,
        });
        break;
      case AUDIT:
        navigation.navigate(AUDIT_PATH, {
          type: formType,
        });
        break;
      case VISIT:
        navigation.navigate(VISIT_PATH, {
          type: formType,
        });
        break;

      default:
        break;
    }
  };

  return (
    <ScrollView
      className="flex flex-1 px-4 py-4 space-y-6"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text className="text-black text-xl">Select Activity</Text>
      <View className="space-y-48 bg-white py-8 px-4 justify-self-center rounded-xl">
        <SelectBox
          mainObj={{
            api: ACTIVITY_TYPES,
            setter: setFormType,
            getter: formType,
          }}
          type={ACTIVITY_OPTIONS}
        />
        <View className="flex items-end">
          <TouchableOpacity
            className="bg-black py-2 px-3 rounded-full w-1/2"
            onPress={handleNavigation}>
            <Text className="text-white  text-center">Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Activities;
