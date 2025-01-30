import React, {useContext, useEffect, useState} from 'react';
import {AcitivityContext} from '../../context/ActivityContext';
import {AuthContext} from '../../context/AuthContext';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import SelectBox from '../../components/SelectBox';
import {AUDIT_STATUS_LIST} from '../../utils/api';
import {STATUS_TYPE} from '../../constants/selectBox';
import {AUDIT_PATH} from '../../constants/path';
import Loader from '../../components/Loader';

const AuditForm = ({route, navigation}) => {
  const {name, address} = route.params;
  const {commonFormSubmit} = useContext(AcitivityContext);
  const {lat, long, isLoading} = useContext(AuthContext);

  const [dis, setDis] = useState(true);

  const [phase_to_neutral, onChangeP2N] = useState('');
  const [neutral_to_earth, onChangeN2E] = useState('');
  const [phase_to_earth, onChangeP2E] = useState('');
  const [tapping_point_with_mcb_rating, onChangeMR] = useState('');
  const [earthing_tapping_point, onChangeTP] = useState('');
  const [status, setStatus] = useState('');

  let obj = {
    phase_to_neutral,
    neutral_to_earth,
    phase_to_earth,
    tapping_point_with_mcb_rating,
    earthing_tapping_point,
    latitude: lat,
    longitude: long,
    address,
    status,
  };

  const handleSubmitForm = () => {
    commonFormSubmit({obj, type: 'Audit', name, navigation});
  };

  useEffect(() => {
    if (
      phase_to_neutral &&
      neutral_to_earth &&
      phase_to_earth &&
      tapping_point_with_mcb_rating &&
      earthing_tapping_point &&
      status
    ) {
      setDis(false);
    }
    if (
      phase_to_earth == '' ||
      phase_to_neutral == '' ||
      neutral_to_earth == '' ||
      tapping_point_with_mcb_rating == '' ||
      earthing_tapping_point == ''
    ) {
      setDis(true);
    }
  }, [
    phase_to_neutral,
    neutral_to_earth,
    phase_to_earth,
    tapping_point_with_mcb_rating,
    earthing_tapping_point,
    status,
  ]);

  return (
    <View className="flex-1">
      {isLoading ? (
        <Loader />
      ) : (
        <ScrollView className="px-3 my-3">
          <View className="space-y-6 border rounded-md p-4 bg-white">
            <View className="space-y-3">
              <Text className="text-lg text-black">
                Phase to Neutral
                <Text className="text-red-600"> *</Text>
              </Text>
              <TextInput
                onChangeText={onChangeP2N}
                value={phase_to_neutral}
                keyboardType="decimal-pad"
                className="border rounded-md text-black px-4"
              />
            </View>
            <View className="space-y-3">
              <Text className="text-lg text-black">
                Status
                <Text className="text-red-600"> *</Text>
              </Text>

              <SelectBox
                mainObj={{
                  api: AUDIT_STATUS_LIST,
                  setter: setStatus,
                  getter: status,
                }}
                type={STATUS_TYPE}
              />
            </View>
            <View className="space-y-3">
              <Text className="text-lg text-black">
                Neutral to Earth
                <Text className="text-red-600"> *</Text>
              </Text>
              <TextInput
                keyboardType="decimal-pad"
                onChangeText={onChangeN2E}
                value={neutral_to_earth}
                className="border rounded-md text-black px-4"
              />
            </View>
            <View className="space-y-3">
              <Text className="text-lg text-black">
                Phase to Earth
                <Text className="text-red-600"> *</Text>
              </Text>
              <TextInput
                keyboardType="decimal-pad"
                onChangeText={onChangeP2E}
                value={phase_to_earth}
                className="border rounded-md text-black px-4"
              />
            </View>
            <View className="space-y-3">
              <Text className="text-lg text-black">
                Tapping Point with MCB rating
                <Text className="text-red-600"> *</Text>
              </Text>
              <TextInput
                keyboardType="decimal-pad"
                onChangeText={onChangeMR}
                value={tapping_point_with_mcb_rating}
                className="border rounded-md text-black px-4"
              />
            </View>
            <View className="space-y-3">
              <Text className="text-lg text-black">
                Earthing Tapping Point
                <Text className="text-red-600"> *</Text>
              </Text>
              <TextInput
                keyboardType="decimal-pad"
                onChangeText={onChangeTP}
                value={earthing_tapping_point}
                className="border rounded-md text-black px-4"
              />
            </View>

            <TouchableOpacity
              disabled={dis}
              onPress={handleSubmitForm}
              className={`rounded-md px-4 py-2 ${
                dis ? 'bg-stone-600' : 'bg-green-600'
              }`}>
              <Text className="text-xl text-white text-center">Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default AuditForm;
