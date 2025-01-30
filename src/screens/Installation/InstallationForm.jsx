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

import {CHARGER_STATUS_LIST} from '../../utils/api';
import {STATUS_TYPE} from '../../constants/selectBox';
import {INSTALLATION_PATH} from '../../constants/path';
import Loader from '../../components/Loader';

const InstallationForm = ({route, navigation}) => {
  const {name, address} = route.params;
  const {commonFormSubmit} = useContext(AcitivityContext);
  const {lat, long, isLoading} = useContext(AuthContext);

  const [dis, setDis] = useState(true);

  const [db_serial_number, onChangeDbNo] = useState('');
  const [charger_id, onChangeChargerId] = useState('');
  const [sim_number, onChangeSimNo] = useState('');
  const [cables_with_lugs, onChangeCables] = useState('');

  const [phase_to_neutral, onChangeP2N] = useState('');
  const [neutral_to_earth, onChangeN2E] = useState('');
  const [phase_to_earth, onChangeP2E] = useState('');
  const [status, setStatus] = useState('');

  let obj = {
    db_serial_number,
    charger_id,
    sim_number,
    cables_with_lugs,
    docstatus: 0,
    phase_to_neutral,
    neutral_to_earth,
    phase_to_earth,
    latitude: lat,
    longitude: long,
    address,
    status,
  };

  const handleSubmitForm = () => {
    commonFormSubmit({
      obj,
      type: 'Charger%20Installation',
      name,
      navigation
    });
  };

  useEffect(() => {
    if (
      db_serial_number &&
      charger_id &&
      sim_number &&
      cables_with_lugs.toLowerCase() &&
      phase_to_neutral &&
      phase_to_earth &&
      neutral_to_earth &&
      status
    ) {
      setDis(false);
    }
    if (
      db_serial_number == '' ||
      charger_id == '' ||
      sim_number == '' ||
      phase_to_earth == '' ||
      phase_to_neutral == '' ||
      neutral_to_earth == '' ||
      cables_with_lugs == ''
    ) {
      setDis(true);
    }
    if (
      cables_with_lugs.toLowerCase() !== 'yes' &&
      cables_with_lugs.toLowerCase() !== 'no'
    ) {
      setDis(true);
    }
  }, [
    db_serial_number,
    charger_id,
    sim_number,
    cables_with_lugs.toLowerCase(),
    phase_to_earth,
    phase_to_neutral,
    neutral_to_earth,
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
                DB Serial Number
                <Text className="text-red-600"> *</Text>
              </Text>
              <TextInput
                onChangeText={onChangeDbNo}
                value={db_serial_number}
                keyboardType="name-phone-pad"
                className="border rounded-md text-black px-4"
              />
            </View>
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
                  api: CHARGER_STATUS_LIST,
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
                Charger ID
                <Text className="text-red-600"> *</Text>
              </Text>
              <TextInput
                onChangeText={onChangeChargerId}
                value={charger_id}
                keyboardType="name-phone-pad"
                className="border rounded-md text-black px-4"
              />
            </View>

            <View className="space-y-3">
              <Text className="text-lg text-black">
                SIM Number
                <Text className="text-red-600"> *</Text>
              </Text>
              <TextInput
                onChangeText={onChangeSimNo}
                value={sim_number}
                keyboardType="number-pad"
                className="border rounded-md text-black px-4"
              />
            </View>

            <View className="space-y-3">
              <Text className="text-lg text-black">
                Cables with Lugs, Yes/No ?
                <Text className="text-red-600"> *</Text>
              </Text>
              <TextInput
                onChangeText={onChangeCables}
                value={cables_with_lugs}
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

export default InstallationForm;
