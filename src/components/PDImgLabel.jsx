import React, {useContext, useEffect, useState} from 'react';
import {Modal, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {AcitivityContext} from '../context/ActivityContext';
import FormCamera from './FormCamera';
import {AuthContext} from '../context/AuthContext';
import Loader from './Loader';

const includesAll = (arr, values) => values.every(v => arr.includes(v.label));

const PDImgLabel = ({imgType, imgId, customer, setPhysicalDamage}) => {
  const [pdLabelName, setPDLabelName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [PDisVisible, setPDisVisible] = useState(true);

  const {
    getPhysicalDamageImgLabels,
    physicalDamageImgLabel,
    pdLoading,
    photoClicked,
  } = useContext(AcitivityContext);

  const handleIssueImg = img => {
    setIsModalVisible(true);
    setPDLabelName(img);
  };

  const mandatePDImgLabels = physicalDamageImgLabel.filter(
    images => images.mandatory === 1,
  );

  const optionalImg = () => {
    if (mandatePDImgLabels.length === 0) {
      setPhysicalDamage('Yes');
    } else {
      includesAll(photoClicked, mandatePDImgLabels)
        ? setPhysicalDamage('Yes')
        : setPhysicalDamage('No');
    }
    setPDisVisible(false);
  };

  const mandateImg = () => {
    if (
      physicalDamageImgLabel.length > 0 &&
      includesAll(photoClicked, mandatePDImgLabels)
    )
      setPhysicalDamage('Yes');
    setPDisVisible(false);
  };

  useEffect(() => {
    getPhysicalDamageImgLabels({imgType, customer});
  }, []);

  return (
    <Modal visible={PDisVisible}>
      {pdLoading ? (
        <Loader />
      ) : (
        <ScrollView className="px-3 pb-8 my-3 space-y-4">
          <Text className="text-2xl text-black text-center pt-4">
            Take Pictures for Physcial Damage
          </Text>
          <Modal className="rounded-lg relative" visible={isModalVisible}>
            <FormCamera
              setIsModalVisible={setIsModalVisible}
              imgLabelName={pdLabelName}
              imgId={imgId}
              imgType={`${imgType}_${pdLabelName}`}
            />
          </Modal>

          {physicalDamageImgLabel.length > 0 ? (
            <View className="flex space-y-2">
              {physicalDamageImgLabel.map(img => (
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
                      <Text className="text-red-600 font-bold"> &#42;</Text>
                    ) : (
                      ''
                    )}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text className="text-black text-center">
              No Image labels right now
            </Text>
          )}

          <View className="self-center flex justify-center flex-row items-center gap-x-2 w-full">
            <TouchableOpacity
              onPress={optionalImg}
              className={`bg-white py-2 px-6 rounded-full border`}>
              <Text className="text-lg text-black text-center"> Back </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={mandateImg}
              disabled={
                mandatePDImgLabels.length > 0
                  ? includesAll(photoClicked, mandatePDImgLabels)
                    ? false
                    : true
                  : false
              }
              className={`py-2 px-4 text-center rounded-full border ${
                mandatePDImgLabels.length > 0
                  ? includesAll(photoClicked, mandatePDImgLabels)
                    ? 'bg-black border-black'
                    : ' bg-black/50 border-black/50'
                  : 'hidden'
              } `}>
              <Text className="text-lg text-white text-center"> Continue </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </Modal>
  );
};

export default PDImgLabel;
