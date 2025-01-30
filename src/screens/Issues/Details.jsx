import React, {useEffect} from 'react';
import {Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {FORMS_PATH, ISSUE_FORM, ISSUE_PATH} from '../../constants/path';
import {MultipleSelectList} from 'react-native-dropdown-select-list';
import CheckPriority from '../../components/checkPriority';

const Details = ({route, navigation}) => {
  const {ticket} = route.params;

  const [selected, setSelected] = React.useState([]);
  const [dis, setDis] = React.useState(true);

  const checkList = ticket.check_list.map((item, index) => ({
    key: index + 1,
    value: item.checklist,
  }));

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

      console.log(date, month, year);

      // Add leading zero to minutes if necessary
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return `${date}/${
        month + 1
      }/${year} - ${hours12}:${formattedMinutes} ${period}`;
    }
  };

  useEffect(() => {
    if (checkList.length === selected.length) {
      setDis(false);
    } else {
      setDis(true);
    }
  }, [selected]);

  console.log("TICKET - ", ticket)

  return (
    <ScrollView className="space-y-4 p-3">
      <View className="border rounded-md p-3 space-y-2">
        <Text className="text-black text-xl">
          Subject : {ticket.subject ?? 'N/A'}
        </Text>

        <Text className="text-black">
          Customer : {ticket.customer ?? 'N/A'}
        </Text>

        <Text className="text-black">
          Issue type : {ticket.issue_type ?? 'N/A'}
        </Text>

        {/* <Text className="text-black">
          Description : {ticket.description ?? 'N/A'}
        </Text> */}
        <Text className="text-black">
          Last heart Beat complaint time :{' '}
          {convertDateFormat(ticket.last_heart_beat_complaint_time) ?? 'N/A'}
        </Text>
        <Text className="text-black">State : {ticket.state ?? 'N/A'}</Text>
        <Text className="text-black">
          Service level agreenment : {ticket.service_level_agreement ?? 'N/A'}
        </Text>
        <View className="flex justify-center items-end">
          {CheckPriority(ticket.priority)}
        </View>
      </View>
      <View className="border rounded-md p-3 space-y-2">
        {ticket.charger_details.map((charge, index) => (
          <View key={index}>
            <Text className="text-black text-xl">
              Charger name : {charge.charger_name ?? 'N/A'}
            </Text>
            <Text className="text-black">
              Charger number : {charge.charger_number ?? 'N/A'}
            </Text>

            <Text className="text-black">
              Charger ID : {charge.charger_id ?? 'N/A'}
            </Text>
            <Text className="text-black">
              Energy meter poc email : {charge.energy_meter_poc_email ?? 'N/A'}
            </Text>
            <Text className="text-black">
              Metering type : {charge.metering_type ?? 'N/A'}
            </Text>
            <Text className="text-black">
              Charger serial number : {charge.charger_serial_number ?? 'N/A'}
            </Text>
            <Text className="text-black">POC : {charge.poc ?? 'N/A'}</Text>
            <Text className="text-black">
              Poc email : {charge.poc_email ?? 'N/A'}
            </Text>
            <Text className="text-black">
              City activated : {charge.city_activated ?? 'N/A'}
            </Text>
            <Text className="text-black">
              Client : {charge.client ?? 'N/A'}
            </Text>
            <View className="flex justify-between items-center flex-row">
              <Text className="text-black">
                Address : {charge.address ?? 'N/A'}
              </Text>
            </View>
            <Text className="text-black">
              Type of parking : {charge.type_of_parking ?? 'N/A'}
            </Text>
          </View>
        ))}
      </View>
      <View className="border rounded-md px-3 py-2">
        <Text className="text-black mb-2 text-lg text-center">Checklist</Text>
        <MultipleSelectList
          setSelected={val => setSelected(val)}
          data={checkList}
          label="Tools"
          save="value"
          onSelect={() => console.log(selected)}
          dropdownTextStyles={{color: 'black'}}
          labelStyles={{color: 'black'}}
          inputStyles={{color: 'black'}}
          search={false}
        />
      </View>
      <TouchableOpacity
        disabled={dis}
        className={`p-3 rounded-lg mb-8 ${
          dis ? ' bg-zinc-700' : 'bg-green-800'
        }`}
        onPress={() =>
          navigation.navigate(FORMS_PATH, {
            imgId: ticket.name,
            imgType: ISSUE_PATH,
            screenType: ISSUE_FORM,
            customer: ticket.customer,
          })
        }>
        <Text className="text-xl text-white text-center">Resolve</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Details;
