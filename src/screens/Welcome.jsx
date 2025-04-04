import React, {useContext, useState} from 'react';
import {Text, TouchableOpacity, View, Modal} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';

import {useAttendanceStore} from '../store/attendance';

import {AuthContext} from '../context/AuthContext';

import Camera from '../components/Camera';

const Welcome = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const attend = useAttendanceStore(state => state.attend);

  const {attendance} = useContext(AuthContext);

  const handleMarkIn = () => {
    setIsModalVisible(true);
  };

  const handleMarkOut = () => {
    attendance({log_type: 'OUT'});
  };

  return (
    <View className="flex-1 space-y-6">
      <Modal className="rounded-lg relative" visible={isModalVisible}>
        <Camera setIsModalVisible={setIsModalVisible} />
      </Modal>
      <View className="flex flex-row space-x-6 justify-center mt-6">
        <TouchableOpacity
          className={`py-3 rounded-lg px-6 ${
            attend ? 'bg-slate-400' : 'bg-blue-400'
          }`}
          disabled={attend}
          onPress={handleMarkIn}>
          <Text className="text-xl text-white text-center">Mark In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!attend}
          className={`py-3 rounded-lg px-6 ${
            attend ? 'bg-blue-400' : 'bg-slate-400'
          }`}
          onPress={handleMarkOut}>
          <Text className="text-xl text-white text-center">Mark Out</Text>
        </TouchableOpacity>
      </View>
      <View className="px-4">
        <Calendar
          onDayPress={day => {
            console.log('selected day', day);
          }}
        />
      </View>
    </View>
  );
};

export default Welcome;
