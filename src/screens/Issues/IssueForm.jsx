import React, {useContext, useEffect, useState} from 'react';
import {AcitivityContext} from '../../context/ActivityContext';

import {
  Button,
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
  Modal,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import {getDateAndTime} from '../../components/CompareTime';
import SelectBox from '../../components/SelectBox';

import {WEATHER, STATUS_LIST, ROOT_CAUSE, DAMAGE} from '../../utils/api';
import {
  WEATHER_TYPE,
  DAMAGE_TYPE,
  STATUS_TYPE,
  ROOT_TYPE,
} from '../../constants/selectBox';
import {TICKET_PATH} from '../../constants/path';
import FormCamera from '../../components/FormCamera';
import PDImgLabel from '../../components/PDImgLabel';
import {AuthContext} from '../../context/AuthContext';
import Loader from '../../components/Loader';

const IssueForm = ({route, navigation}) => {
  const {name, imgType, address, customer} = route.params;
  const {issueResolvedStatus} = useContext(AcitivityContext);
  const {isLoading} = useContext(AuthContext);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');

  const [dateHeartBeat, setDatedateHeartBeat] = useState(new Date());
  const [modedateHeartBeat, setModedateHeartBeat] = useState('date');
  const [showdateHeartBeat, setShowdateHeartBeat] = useState(false);
  const [textdateHeartBeat, setTextdateHeartBeat] = useState('');

  const [weather, setWeather] = useState('');
  const [status, setStatus] = useState('');
  const [physicalDamage, setPhysicalDamage] = useState('');
  const [rootCause, setRootCause] = useState('');

  const [remark, onChangeRemark] = useState('');
  const [futureAct, onChangeAct] = useState('');

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

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const onChangedateHeartBeat = (event, selectedDate) => {
    const currentDate = selectedDate || dateHeartBeat;
    setShowdateHeartBeat(Platform.OS === 'ios');
    setDatedateHeartBeat(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = `${tempDate.getFullYear()}-${
      tempDate.getMonth() + 1
    }-${tempDate.getDate()}`;

    let fTime = `${tempDate.getHours()}:${tempDate.getMinutes()}:${tempDate.getSeconds()}`;

    setTextdateHeartBeat(`${fDate} ${fTime}`);
  };

  const showModedateHeartBeat = currentMode => {
    setShowdateHeartBeat(true);
    setModedateHeartBeat(currentMode);
  };

  let obj = {
    name,
    weather,
    status,
    any_physical_damage: physicalDamage,
    root_cause_analysis: rootCause,
    date_and_time_reached: text,
    last_heart_beatcomplaint_time: textdateHeartBeat,
    any_future_action: futureAct,
    alert_remark: remark,
    ticket_closed_at: getDateAndTime(),
  };

  const handleSubmitForm = () => {
    issueResolvedStatus({obj, navigation});
  };

  useEffect(() => {
    if (
      text &&
      // textdateHeartBeat &&
      remark &&
      weather &&
      status &&
      physicalDamage &&
      rootCause
    ) {
      setDis(false);
    }
    if (remark == '') setDis(true);
  }, [
    text,
    // textdateHeartBeat,
    remark,
    weather,
    status,
    physicalDamage,
    rootCause,
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
            <Text className="text-black text-xl">
              Please fill the form after service
            </Text>
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
                  imgType={`${imgType.imgType}_${weather}`}
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
              <View>
                <Text className="text-lg text-black">
                  Root Cause Analysis(RCA)
                  <Text className="text-red-600"> *</Text>
                </Text>
                <Text className="text-sm text-slate-600">
                  चार्जर में समस्या/Add the error from the CMS log
                </Text>
              </View>
              <SelectBox
                mainObj={{
                  api: ROOT_CAUSE,
                  setter: setRootCause,
                  getter: rootCause,
                }}
                type={ROOT_TYPE}
              />
            </View>

            <View className="space-y-3">
              <View>
                <Text className="text-lg text-black">
                  Status
                  <Text className="text-red-600"> *</Text>
                </Text>
              </View>
              <SelectBox
                mainObj={{
                  api: STATUS_LIST,
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

            {/* <View className="space-y-3">
          <View>
            <Text className="text-lg text-black">
              Last Heart Beat/Complaint Time
              <Text className="text-red-600"> *</Text>
            </Text>
            <Text className="text-sm text-slate-600">
              चार्जर की आखिरी धड़कन का समय दर्ज करें/Enter time of last
              heartbeat of charger
            </Text>
          </View>
          <View className="flex justify-between space-y-3">
            <Text className="text-black p-3 border rounded-md text-center">
              {textdateHeartBeat}
            </Text>
            <View className="flex flex-row items-center justify-between space-x-3">
              <TouchableOpacity
                onPress={() => showModedateHeartBeat('date')}
                className="bg-white border-black rounded-md p-3 border flex-1">
                <Text className="text-black">Heartbeat Date</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => showModedateHeartBeat('time')}
                className="bg-white border-black rounded-md border p-3 flex-1">
                <Text className="text-black">Heartbeat Time</Text>
              </TouchableOpacity>
            </View>
            {showdateHeartBeat && (
              <DateTimePicker
                testID="dateTimePicker"
                pre
                value={dateHeartBeat}
                mode={modedateHeartBeat}
                is24Hour={false}
                display="default"
                onChange={onChangedateHeartBeat}
                minimumDate={date}
              />
            )}
          </View>
        </View> */}

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

export default IssueForm;
