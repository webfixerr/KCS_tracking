import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  FlatList,
  Button,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  LogBox,
} from 'react-native';
import {AcitivityContext} from '../../context/ActivityContext';
import CheckPriority from '../../components/checkPriority';
import {AuthContext} from '../../context/AuthContext';
import Loader from '../../components/Loader';
import {DETAILS_PATH} from '../../constants/path';
// import Counter from '../../components/Counter';

const Tickets = ({navigation}) => {
  const {isLoading} = useContext(AuthContext);
  const {ticketsAssign, chargerTickets} = useContext(AcitivityContext);
  // const [timeLeft, setTimeLeft] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    ticketsAssign();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const timerFunc = timer => {
    const currentDate = new Date();
    let tDate = new Date(timer);
    const diff = tDate - currentDate;
    // const days = Math.floor(tDate / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    // const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const timeLeft =
      hours < 0 || minutes < 0 ? 'Overdue' : `${hours}h & ${minutes}m`;

    return (
      <Text className={`text-black`}>
        Expected Time to complete -
        <Text
          className={`font-bold ${
            hours < 0 || minutes < 0 ? 'text-red-500' : 'text-blue-500'
          }`}>
          {' '}
          {timeLeft}
        </Text>
      </Text>
    );
  };

  const convertDateFormat = timer => {
    if (timer !== null) {
      let newD = new Date(timer);
      const date = newD.getDate();
      const month = newD.getMonth();
      const year = newD.getFullYear();
      const hours24 = newD.getHours();
      const minutes = newD.getMinutes();
      const period = hours24 >= 12 ? 'PM' : 'AM';
      const hours12 = hours24 % 12 || 12; // Convert 24-hour format to 12-hour format

      // Add leading zero to minutes if necessary
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return `${date}/${
        month + 1
      }/${year} - ${hours12}:${formattedMinutes} ${period}`;
    }
  };

  useEffect(() => {
    ticketsAssign();
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <View className="flex-1">
      {isLoading ? (
        <Loader />
      ) : (
        <SafeAreaView className="mt-4 flex flex-1 space-y-4">
          <Text className="text-sm text-gray-400 text-center">
            Map is coming soon....
          </Text>
          {chargerTickets.length === 0 ? (
            <Text className="text-slate-400 text-xl">
              No Tickets right now !
            </Text>
          ) : (
            <ScrollView
              className="px-4 flex-1 my-4"
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }>
              <FlatList
                data={chargerTickets}
                horizontal={false}
                renderItem={({item}) => {
                  return (
                    <View className="border rounded-lg mx-4 py-4">
                      <TouchableOpacity
                        className="px-3"
                        onPress={() =>
                          navigation.navigate(DETAILS_PATH, {
                            ticket: item,
                          })
                        }>
                        {/* <Counter
                      resolution_by={item.resolution_by}
                      setTimeLeft={setTimeLeft}
                    /> */}

                        <Text className="text-black text-xl">
                          Subject : {item.subject ?? 'N/A'}
                        </Text>

                        <Text className="text-black">
                          Charger : {item.charger ?? 'N/A'}
                        </Text>
                        <Text className="text-black">
                          Customer : {item.customer ?? 'N/A'}
                        </Text>
                        <Text className="text-black">
                          Issue type : {item.issue_type ?? 'N/A'}
                        </Text>

                        {timerFunc(item.resolution_by)}
                        {item.charger_details.map((charge, index) => (
                          <View key={index}>
                            <Text className="text-black">
                              Charger Id - {charge.charger_id ?? 'N/A'}
                            </Text>
                          </View>
                        ))}
                        <Text className="text-black">
                          Last heart Beat complaint time :{' '}
                          {convertDateFormat(
                            item.last_heart_beat_complaint_time,
                          ) ?? 'N/A'}
                        </Text>
                        <View className="flex justify-center items-end">
                          {CheckPriority(item.priority)}
                        </View>
                      </TouchableOpacity>
                      {/* <TouchableOpacity
                  className="bg-black p-2 rounded-b-md"
                  onPress={() => navigation.navigate('Maps')}>
                  <Text className="text-white text-center">View on Map</Text>
                </TouchableOpacity> */}
                    </View>
                  );
                }}
                ItemSeparatorComponent={() => <View style={{height: 16}} />}
                SectionSeparatorComponent={() => <View style={{height: 16}} />}
                keyExtractor={(item, index) => item + index}
              />
            </ScrollView>
          )}
        </SafeAreaView>
      )}
    </View>
  );
};

export default Tickets;
