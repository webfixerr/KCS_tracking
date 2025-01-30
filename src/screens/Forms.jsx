import React, {useContext, useEffect, useState} from 'react';
import {Modal, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {AcitivityContext} from '../context/ActivityContext';
import FormCamera from '../components/FormCamera';
import Loader from '../components/Loader';
import {AuthContext} from '../context/AuthContext';

const includesAll = (arr, values) => values.every(v => arr.includes(v.label));

const Forms = ({route, navigation}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imgLabelName, setImgLabelName] = useState('');
  const {imgId, imgType, screenType, address, customer} = route.params;
  const {getImgLabel, imgLabel, photoClicked} = useContext(AcitivityContext);
  const {isLoading} = useContext(AuthContext);

  const handleIssueImg = img => {
    setIsModalVisible(true);
    setImgLabelName(img);
  };

  const mandateImgLabels = imgLabel.filter(images => images.mandatory === 1);

  useEffect(() => {
    getImgLabel({imgType, customer});
  }, []);

  return (
    <View className="flex-1">
      {isLoading ? (
        <Loader />
      ) : (
        <ScrollView className="px-3 pb-8 my-3 space-y-4">
          <Text className="text-black text-lg">Take Pictures</Text>

          <Modal className="rounded-lg relative" visible={isModalVisible}>
            <FormCamera
              setIsModalVisible={setIsModalVisible}
              imgLabelName={imgLabelName}
              imgId={imgId}
              imgType={imgType}
            />
          </Modal>
          {imgLabel.length > 0 ? (
            <View className="flex space-y-2">
              {imgLabel.map(img => (
                <TouchableOpacity
                  key={img.label}
                  className={`border rounded-md p-3 ${
                    photoClicked.includes(img.label)
                      ? 'bg-green-800'
                      : 'bg-white'
                  } ${
                    img.mandatory === 1 ? 'border-[#A5D6A7]' : 'border-black'
                  }`}
                  onPress={() => handleIssueImg(img.label)}>
                  <Text
                    className={`text-lg ${
                      photoClicked.includes(img.label)
                        ? 'text-white'
                        : 'text-black'
                    }`}>
                    {img.label}
                    {img.mandatory === 1 ? (
                      <Text className="text-red-600 font-bold">&#42;</Text>
                    ) : (
                      ''
                    )}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text className="text-black text-center">
              No Image labels right now as cutomer is N/A
            </Text>
          )}

          <TouchableOpacity
            className="flex items-end"
            disabled={
              mandateImgLabels.length > 0
                ? includesAll(photoClicked, mandateImgLabels)
                  ? false
                  : true
                : false
            }
            onPress={() =>
              navigation.navigate(screenType, {
                name: imgId,
                imgType: {imgType},
                address,
                customer,
              })
            }>
            <Text
              className={`text-white p-2 text-center rounded-full w-1/2 ${
                mandateImgLabels.length > 0
                  ? includesAll(photoClicked, mandateImgLabels)
                    ? 'bg-black'
                    : 'bg-black/50'
                  : 'bg-black'
              }`}>
              Continue
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

export default Forms;
