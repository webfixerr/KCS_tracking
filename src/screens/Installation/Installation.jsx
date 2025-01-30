import React, {useContext, useEffect} from 'react';
import {AcitivityContext} from '../../context/ActivityContext';

import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ScrollView,
  LogBox,
} from 'react-native';

import {FORMS_PATH, INSTALLATION_FORM} from '../../constants/path';
import {AuthContext} from '../../context/AuthContext';
import Loader from '../../components/Loader';

const Installation = ({navigation, route}) => {
  const {type} = route.params;
  const {installationAssign, chargerInstall} = useContext(AcitivityContext);
  const {isLoading} = useContext(AuthContext);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    installationAssign();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    installationAssign();
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <View className="flex-1">
      {isLoading ? (
        <Loader />
      ) : (
        <SafeAreaView className="mt-4 flex flex-1">
          {chargerInstall.length === 0 ? (
            <Text className="text-slate-400 text-xl">
              No Installations right now !
            </Text>
          ) : (
            <ScrollView
              className="px-4"
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
              <FlatList
                data={chargerInstall}
                horizontal={false}
                renderItem={({item}) => {
                  return (
                    <View className="border rounded-lg mx-4 mb-4 p-4">
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(FORMS_PATH, {
                            imgId: item.name,
                            imgType: type,
                            screenType: INSTALLATION_FORM,
                            address: item.address,
                            customer: item.customer,
                          })
                        }>
                        <View className="flex space-y-2">
                          <Text className="text-black">
                            Name : {item.name ?? 'N/A'}
                          </Text>
                          <Text className="text-black">
                            Site name : {item.site_name ?? 'N/A'}
                          </Text>
                          <Text className="text-black">
                            Address : {item.address ?? 'N/A'}
                          </Text>
                          <Text className="text-black">
                            Customer : {item.customer ?? 'N/A'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </ScrollView>
          )}
        </SafeAreaView>
      )}
    </View>
  );
};

export default Installation;
