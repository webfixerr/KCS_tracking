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

import {FORMS_PATH, VISIT_FORM} from '../../constants/path';
import {AuthContext} from '../../context/AuthContext';
import Loader from '../../components/Loader';

const Visit = ({navigation, route}) => {
  const {type} = route.params;
  const {visitAssign, chargerVisit} = useContext(AcitivityContext);
  const {isLoading} = useContext(AuthContext);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    visitAssign();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    visitAssign();
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <View className="flex-1">
      {isLoading ? (
        <Loader />
      ) : (
        <SafeAreaView className="mt-4 flex flex-1">
          {chargerVisit.length === 0 ? (
            <Text className="text-slate-400 text-xl">
              No Maintainance Visit right now !
            </Text>
          ) : (
            <ScrollView
              className="px-4"
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
              <FlatList
                data={chargerVisit}
                horizontal={false}
                renderItem={({item}) => {
                  return (
                    <View className="border rounded-lg mx-4 mb-4 p-4">
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(FORMS_PATH, {
                            imgId: item.name,
                            imgType: type,
                            screenType: VISIT_FORM,
                            address: item.address,
                            customer: item.customer,
                          })
                        }>
                        <View className="flex space-y-2">
                          <Text className="text-black">
                            Name : {item.name ?? 'N/A'}
                          </Text>
                          <Text className="text-black">
                            PM1/PM2 : {item.select_pm1_or_pm2 ?? 'N/A'}
                          </Text>
                          <Text className="text-black">
                            Site name : {item.site_name ?? 'N/A'}
                          </Text>
                          <Text className="text-black">
                            Customer : {item.customer ?? 'N/A'}
                          </Text>
                          <Text className="text-black">
                            Address : {item.address ?? 'N/A'}
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

export default Visit;
