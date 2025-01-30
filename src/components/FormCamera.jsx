import React, {useContext, useState, useRef} from 'react';
import {AcitivityContext} from '../context/ActivityContext';
import {getDateAndTime} from './CompareTime';
import {View, TouchableOpacity, Text, LogBox, Modal} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {RNCamera} from 'react-native-camera';
import {launchImageLibrary} from 'react-native-image-picker';
import {ISSUE_PATH} from '../constants/path';

const FormCamera = ({setIsModalVisible, imgLabelName, imgId, imgType}) => {
  let cameraRef = useRef(null);
  const [oldCam, setOldCam] = useState(false);
  const {sendIssueImg} = useContext(AcitivityContext);
  const {lat, long} = useContext(AuthContext);

  const takePic = async () => {
    if (cameraRef) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);

      let imgData = {
        base64_image: data.base64,
        filename: `${imgLabelName}.jpg`,
        activity_id: imgId,
        activity_label: imgLabelName,
        activity_type: imgType,
        created_date_time: getDateAndTime(),
        image_click_location: `${lat},${long}`,
      };
      sendIssueImg(imgData);
      setOldCam(false);
    }
  };

  const chooseGallery = async () => {
    let options = {
      mediaType: 'photo',
      includeBase64: true,
      selectionLimit: 1,
    };
    const result = await launchImageLibrary(options);

    if (result.didCancel) {
      console.log('User exit from gallery');
      LogBox.ignoreLogs(['']);
    } else if (result.assets.length > 0) {
      let imgData = {
        base64_image: result.assets[0].base64,
        filename: `${imgLabelName}.jpg`,
        activity_id: imgId,
        activity_label: imgLabelName,
        activity_type: imgType,
        created_date_time: getDateAndTime(),
        image_click_location: `${lat},${long}`,
      };
      sendIssueImg(imgData);
    }
  };

  return (
    <View className="flex flex-1 flex-col justify-center items-center">
      <Modal className="rounded-lg relative" visible={oldCam}>
        <View className="flex-col flex-1 justify-end items-center gap-y-4 rounded-lg">
          <RNCamera
            className="w-full flex-auto rounded-lg"
            ref={cameraRef}
            type={RNCamera.Constants.Type.back}
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
              onPress={takePic}
              className="bg-white text-center py-2 px-6 rounded-lg border border-black ">
              <Text className="text-xl text-black"> Click </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setOldCam(false)}
              className="bg-white text-center py-2 px-6 rounded-lg border border-black">
              <Text className="text-xl text-black"> Close </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View className="flex justify-center flex-col items-center border border-black rounded-lg px-4 pt-4 w-2/3">
        <TouchableOpacity
          onPress={() => setOldCam(true)}
          className="py-2 px-4 border border-black rounded-lg w-full mb-4">
          <Text className="text-black text-lg">Launch Camera</Text>
        </TouchableOpacity>
        {imgType === ISSUE_PATH ? (
          <TouchableOpacity
            onPress={chooseGallery}
            className="py-2 px-4 border border-black rounded-lg w-full mb-4">
            <Text className="text-black text-lg">Launch Gallery</Text>
          </TouchableOpacity>
        ) : (
          ''
        )}

        <TouchableOpacity
          onPress={() => setIsModalVisible(false)}
          className="py-2 px-4 border border-black rounded-lg w-full mb-4">
          <Text className="text-black text-lg">Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FormCamera;
