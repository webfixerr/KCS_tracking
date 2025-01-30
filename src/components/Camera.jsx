import React, {useRef, useState, useContext} from 'react';
import {RNCamera} from 'react-native-camera';
import {AuthContext} from '../context/AuthContext';
import {useAttendanceStore} from '../store/attendance';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';

const Camera = ({setIsModalVisible}) => {
  let cameraRef = useRef(null);
  const setAttend = useAttendanceStore(state => state.setAttend);
  const {sendImage, userId, attendance} = useContext(AuthContext);

  const takePicture = async () => {
    if (cameraRef) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);

      let selfie = {base64_image: data.base64, filename: `${userId}.jpg`};
      sendImage(selfie);
      attendance({log_type: 'IN', userId});
      setAttend();
      setIsModalVisible(false);
    }
  };

  return (
    <View className="flex-col flex-1 justify-end items-center gap-y-4 rounded-lg">
      <RNCamera
        className="w-full flex-auto rounded-lg"
        ref={cameraRef}
        type={RNCamera.Constants.Type.front}
        // flashMode={RNCamera.Constants.FlashMode.on}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        captureAudio={false}
      />

      <View className="flex-row items-center w-full justify-around py-6">
        <TouchableOpacity
          onPress={() => {
            takePicture();
            Alert.alert('Attendance', 'You attendence has been marked !');
          }}
          className="bg-white text-center py-2 px-6 rounded-lg border border-black ">
          <Text className="text-xl text-black"> Click </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsModalVisible(false);
          }}
          className="bg-white text-center py-2 px-6 rounded-lg border border-black">
          <Text className="text-xl text-black"> Close </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Camera;
