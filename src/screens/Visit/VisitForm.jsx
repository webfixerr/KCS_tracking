import React, {useContext, useEffect, useState} from 'react';
import {AcitivityContext} from '../../context/ActivityContext';

import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Modal,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import {getDateAndTime} from '../../components/CompareTime';
import SelectBox from '../../components/SelectBox';

import {WEATHER, DAMAGE} from '../../utils/api';
import {
  WEATHER_TYPE,
  DAMAGE_TYPE,
  STATUS_TYPE,
} from '../../constants/selectBox';
import {VISIT_PATH} from '../../constants/path';

import {VISIT_STATUS_LIST} from '../../utils/api';
import FormCamera from '../../components/FormCamera';
import PDImgLabel from '../../components/PDImgLabel';
import {AuthContext} from '../../context/AuthContext';
import Loader from '../../components/Loader';

const VisitForm = ({route, navigation}) => {
  const {name, imgType, address, customer} = route.params;
  const {commonFormSubmit} = useContext(AcitivityContext);
  const {isLoading} = useContext(AuthContext);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [weather, setWeather] = useState('');
  const [physicalDamage, setPhysicalDamage] = useState('');
  const [remark, onChangeRemark] = useState('');
  const [futureAct, onChangeAct] = useState('');

  const [aux_batt_voltage, onChangeAuxVolt] = useState('');
  const [current_energy_mtr_reading, onChangeCurrentEMtrReading] = useState('');

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');

  const [dateTicket, setDateTicket] = useState(new Date());
  const [modeTicket, setModeTicket] = useState('date');
  const [showTicket, setShowTicket] = useState(false);
  const [textTicket, setTextTicket] = useState('');

  const [status, setStatus] = useState('');

  const [dis, setDis] = useState(true);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = `${tempDate.getFullYear()}-${
      tempDate.getMonth() + 1
    }-${tempDate.getDate()}`;

    let fTime = `${tempDate.getHours()}:${tempDate.getMinutes()}:${tempDate.getSeconds()}`;

    setText(`${fDate} ${fTime}`);
  };

  const onChangeTicket = (event, selectedDate) => {
    const currentDateTicket = selectedDate || dateTicket;
    setShowTicket(Platform.OS === 'ios');
    setDateTicket(currentDateTicket);

    let tempDateTicket = new Date(currentDateTicket);
    let fDateTicket = `${tempDateTicket.getFullYear()}-${
      tempDateTicket.getMonth() + 1
    }-${tempDateTicket.getDate()}`;

    let fTimeTicket = `${tempDateTicket.getHours()}:${tempDateTicket.getMinutes()}:${tempDateTicket.getSeconds()}`;

    setTextTicket(`${fDateTicket} ${fTimeTicket}`);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showModeTicket = currentMode => {
    setShowTicket(true);
    setModeTicket(currentMode);
  };

  let obj = {
    weather,
    aux_batt_voltage,
    current_energy_mtr_reading,
    ticket_actual_closed_at: textTicket,
    date_and_time_reached: text,
    any_physical_damage: physicalDamage,
    alert_remark: remark,
    any_future_action: futureAct,
    ticket_closed_at: getDateAndTime(),
    status,
    address,
  };

  const handleSubmitForm = () => {
    commonFormSubmit({obj, type: 'PDG%20Maintenance', name, navigation});
  };

  useEffect(() => {
    if (
      weather &&
      aux_batt_voltage &&
      current_energy_mtr_reading &&
      textTicket &&
      text &&
      physicalDamage &&
      remark &&
      status
    ) {
      setDis(false);
    }

    if (
      remark == '' ||
      aux_batt_voltage == '' ||
      current_energy_mtr_reading == ''
    ) {
      setDis(true);
    }
  }, [
    weather,
    aux_batt_voltage,
    current_energy_mtr_reading,
    text,
    textTicket,
    physicalDamage,
    remark,
    status,
  ]);

  useEffect(() => {
    if (weather !== 'Clear/Sunny' && weather !== '') setIsModalVisible(true);
  }, [weather]);

  return (
    <View className="flex-1">
      {isLoading ? (
        <Loader />
      ) : (
        <ScrollView className="px-3 my-3">
          <View className="space-y-6 border rounded-md p-4 bg-white">
            <View className="space-y-3">
              <View>
                <Text className="text-lg text-black">
                  मौसम/Weather
                  <Text className="text-red-600"> *</Text>
                </Text>
                <Text className="text-sm text-slate-600">
                  आज का मौसम चुनें/Select todays Weather
                </Text>
              </View>

              <SelectBox
                mainObj={{
                  api: WEATHER,
                  setter: setWeather,
                  getter: weather,
                }}
                type={WEATHER_TYPE}
              />

              <Modal className="rounded-lg relative" visible={isModalVisible}>
                <FormCamera
                  setIsModalVisible={setIsModalVisible}
                  imgLabelName={weather}
                  imgId={name}
                  imgType={imgType.imgType}
                />
              </Modal>
            </View>

            <View className="space-y-3">
              <View>
                <Text className="text-lg text-black">
                  Date and Time reached
                  <Text className="text-red-600"> *</Text>
                </Text>
                <Text className="text-sm text-slate-600">
                  साइट पर पहुंचने का समय दर्ज करें/Enter time reaching site
                </Text>
              </View>
              <View className="flex justify-between space-y-3">
                <Text className="text-black p-3 border rounded-md text-center">
                  {text}
                </Text>
                <View className="flex flex-row items-center justify-between space-x-3">
                  <TouchableOpacity
                    onPress={() => showMode('date')}
                    className="bg-white border-black rounded-md p-3 border flex-1">
                    <Text className="text-black">Datepicker</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => showMode('time')}
                    className="bg-white border-black rounded-md border p-3 flex-1">
                    <Text className="text-black">TimePicker</Text>
                  </TouchableOpacity>
                </View>
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={false}
                    display="default"
                    onChange={onChange}
                    minimumDate={date}
                  />
                )}
              </View>
            </View>

            <View className="space-y-3">
              <View>
                <Text className="text-lg text-black">
                  Ticket closed at
                  <Text className="text-red-600"> *</Text>
                </Text>
                <Text className="text-sm text-slate-600">
                  टिकट बंद करने का समय दर्ज करें/Enter Ticket closing time
                </Text>
              </View>
              <View className="flex justify-between space-y-3">
                <Text className="text-black p-3 border rounded-md text-center">
                  {textTicket}
                </Text>
                <View className="flex flex-row items-center justify-between space-x-3">
                  <TouchableOpacity
                    onPress={() => showModeTicket('date')}
                    className="bg-white border-black rounded-md p-3 border flex-1">
                    <Text className="text-black">Datepicker</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => showModeTicket('time')}
                    className="bg-white border-black rounded-md border p-3 flex-1">
                    <Text className="text-black">TimePicker</Text>
                  </TouchableOpacity>
                </View>
                {showTicket && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={dateTicket}
                    mode={modeTicket}
                    is24Hour={false}
                    display="default"
                    onChange={onChangeTicket}
                    minimumDate={dateTicket}
                  />
                )}
              </View>
            </View>

            <View className="space-y-3">
              <Text className="text-lg text-black">
                Aux Battery Voltage
                <Text className="text-red-600"> *</Text>
              </Text>
              <TextInput
                keyboardType="decimal-pad"
                onChangeText={onChangeAuxVolt}
                value={aux_batt_voltage}
                className="border rounded-md text-black px-4"
              />
            </View>
            <View className="space-y-3">
              <Text className="text-lg text-black">
                Current Energy Meter Reading (in KwH)
                <Text className="text-red-600"> *</Text>
              </Text>
              <TextInput
                keyboardType="decimal-pad"
                onChangeText={onChangeCurrentEMtrReading}
                value={current_energy_mtr_reading}
                className="border rounded-md text-black px-4"
              />
            </View>

            <View className="space-y-3">
              <View>
                <Text className="text-lg text-black">
                  Any Physical Damage
                  <Text className="text-red-600"> *</Text>
                </Text>
                <Text className="text-sm text-slate-600">
                  "हाँ" चिह्नित करें यदि साइट पर कोई क्षति देखी गई हो/Please
                  mark "YES" only if any damages observed at site
                </Text>
              </View>

              <SelectBox
                mainObj={{
                  api: DAMAGE,
                  setter: setPhysicalDamage,
                  getter: physicalDamage,
                }}
                type={DAMAGE_TYPE}
              />
              {physicalDamage == 'Yes' ? (
                <PDImgLabel
                  imgType={imgType.imgType}
                  imgId={name}
                  customer={customer}
                  setPhysicalDamage={setPhysicalDamage}
                />
              ) : (
                ''
              )}
            </View>

            <View className="space-y-3">
              <Text className="text-lg text-black">
                Status
                <Text className="text-red-600"> *</Text>
              </Text>

              <SelectBox
                mainObj={{
                  api: VISIT_STATUS_LIST,
                  setter: setStatus,
                  getter: status,
                }}
                type={STATUS_TYPE}
              />
            </View>

            <View className="space-y-3">
              <View>
                <Text className="text-lg text-black">
                  Alert Remark
                  <Text className="text-red-600"> *</Text>
                </Text>
                <Text className="text-sm text-slate-600">
                  कोई बात/Any point
                </Text>
              </View>
              <TextInput
                onChangeText={onChangeRemark}
                value={remark}
                className="border rounded-md text-black"
              />
            </View>

            <View className="space-y-3">
              <View>
                <Text className="text-lg text-black">Any Future action</Text>
                <Text className="text-sm text-slate-600">
                  भविष्य की किसी भी गतिविधि को लिखें/Write any future activity
                  to be performed next visit
                </Text>
              </View>
              <TextInput
                onChangeText={onChangeAct}
                value={futureAct}
                className="border rounded-md text-black"
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

export default VisitForm;
