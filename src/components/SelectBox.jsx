import React, {useEffect, useState, useContext} from 'react';
import {AcitivityContext} from '../context/ActivityContext';
import {Dropdown} from 'react-native-element-dropdown';
import {StyleSheet, Text, View} from 'react-native';
import {
  WEATHER_TYPE,
  DAMAGE_TYPE,
  STATUS_TYPE,
  ROOT_TYPE,
  ACTIVITY_OPTIONS,
} from '../constants/selectBox';
import Loader from './Loader';

const _renderItem = item => {
  return (
    <View style={styles.item}>
      <Text style={styles.textItem}>{item.name}</Text>
    </View>
  );
};

const SelectBox = ({mainObj, type}) => {
  const {api, setter, getter} = mainObj;
  const {handleSelectApi} = useContext(AcitivityContext);

  const [weatherData, setWeatherData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [damageData, setDamagerData] = useState([]);
  const [rootData, setRootData] = useState([]);
  const [activityData, setActivityData] = useState([]);

  switch (type) {
    case WEATHER_TYPE:
      handleSelectApi({api, setData: setWeatherData});

      return (
        <>
          {weatherData.length > 0 ? (
            <Dropdown
              data={weatherData}
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              maxHeight={300}
              labelField="name"
              valueField="name"
              value={getter}
              onChange={item => setter(item.name)}
              renderItem={item => _renderItem(item)}
            />
          ) : (
            <Loader />
          )}
        </>
      );
      break;
    case STATUS_TYPE:
      handleSelectApi({api, setData: setStatusData});

      return (
        <>
          {statusData.length > 0 ? (
            <Dropdown
              data={statusData}
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              maxHeight={300}
              labelField="name"
              valueField="name"
              value={getter}
              onChange={item => setter(item.name)}
              renderItem={item => _renderItem(item)}
            />
          ) : (
            <Loader />
          )}
        </>
      );
      break;
    case DAMAGE_TYPE:
      handleSelectApi({api, setData: setDamagerData});

      return (
        <>
          {damageData.length > 0 ? (
            <Dropdown
              data={damageData}
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              maxHeight={300}
              labelField="name"
              valueField="name"
              value={getter}
              onChange={item => setter(item.name)}
              renderItem={item => _renderItem(item)}
            />
          ) : (
            <Loader />
          )}
        </>
      );
      break;
    case ROOT_TYPE:
      handleSelectApi({api, setData: setRootData});

      return (
        <>
          {rootData.length > 0 ? (
            <Dropdown
              data={rootData}
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              maxHeight={300}
              labelField="name"
              valueField="name"
              value={getter}
              onChange={item => setter(item.name)}
              renderItem={item => _renderItem(item)}
            />
          ) : (
            <Loader />
          )}
        </>
      );
      break;
    case ACTIVITY_OPTIONS:
      handleSelectApi({api, setData: setActivityData});
      return (
        <>
          {activityData.length > 0 ? (
            <Dropdown
              data={activityData.filter(item => item.name !== 'Issue')}
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              maxHeight={300}
              labelField="name"
              valueField="name"
              value={getter}
              onChange={item => setter(item.name)}
              renderItem={item => _renderItem(item)}
            />
          ) : (
            <Loader />
          )}
        </>
      );
      break;

    default:
      break;
  }
};

export default SelectBox;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    color: 'black',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'black',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
});
