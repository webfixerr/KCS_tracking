import React, {createContext, useState, useEffect} from 'react';
import {useAttendanceStore} from '../store/attendance';
import {storage, getItemAsync, setItem} from '../utils/Storage';

import {Alert} from 'react-native';
import {BASE_URL} from '../utils/api';

import CompareTime, {getDateAndTime} from '../components/CompareTime';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoading, setLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState('');

  const setAttend = useAttendanceStore(state => state.setAttend);

  const [location_track, setLocationTrack] = useState(60000);
  const [login_time, setLoginTime] = useState('');
  const [static_url, setStaticUrl] = useState('');
  const [device_id, setDeviceId] = useState('');
  const [deviceType, setDeviceType] = useState('');

  const [lat, setLate] = useState('');
  const [long, setLong] = useState('');

  const login = async ({userName, password}) => {
    setLoading(true);
    try {
      const dId = device_id || (await getItemAsync('device_id'));
      const dType = deviceType || (await getItemAsync('device_type'));

      setDeviceId(dId);
      setDeviceType(dType);

      fetch(`${BASE_URL}/method/custom_pdg.api.login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usr: userName,
          pwd: password,
          device_id: dId,
          device_type: dType,
        }),
      })
        .then(response => response.json())
        .then(data => {
          const {message, _server_messages} = data;

          if (_server_messages !== undefined) {
            let cleanedString = _server_messages.replace(/^\[\"|\"\]$/g, '');
            cleanedString = cleanedString.replace(/\\{2}/g, '\\');
            cleanedString = cleanedString.replace(/\\"/g, '"');
            const {title, message} = JSON.parse(cleanedString);
            Alert.alert(`${title}`, `${message}`);
            // Alert.alert(`${title}`, `Try after sometime`);
          }

          if (message !== undefined) {
            if (message.success_key === 1) {
              setUserId(message.emp_id);
              setItem('userId', message.emp_id);
              setUserToken(message.sid);
              setItem('userToken', message.sid);
            }
          }
          setLoading(false);
        });
    } catch (error) {
      console.log('ERRORS SHOWING -> ', error);
      setLoading(false);
      return error;
    }
  };

  const updateCoords = ({lat, long}) => {
    fetch(`${BASE_URL}/method/custom_pdg.api.update_user_location`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: long,
      }),
    })
      .then(response => response.json())
      .then(data => console.log(data));
  };

  const logout = () => {
    setLoading(true);
    try {
      setUserToken(null);
      storage.delete('userToken');
      setUserId('');
      storage.delete('userId');

      fetch(`${BASE_URL}/method/logout`)
        .then(response => response.json())
        .then(data => {
          console.log('LOGOUT SUCCES - ', data);
          setLoading(false);
        });

      updateCoords({lat: null, long: null});
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const attendance = async ({log_type, userId}) => {
    setLoading(true);
    const dloginTime = login_time || (await getItemAsync('loginTime'));

    setLoginTime(dloginTime);

    try {
      let markObj = {
        employee: userId,
        log_type: log_type,
        time: getDateAndTime(),
      };

      if (log_type == 'IN') {
        markObj['attendance_type'] = CompareTime({login_time: dloginTime});
        updateCoords({lat, long});
      }

      fetch(`${BASE_URL}/resource/Employee Checkin`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(markObj),
      })
        .then(response => response.json())
        .then(data => {
          const {_server_messages} = data;

          if (_server_messages !== undefined) {
            let cleanedString = _server_messages.replace(/^\[\"|\"\]$/g, '');
            cleanedString = cleanedString.replace(/\\{2}/g, '\\');
            cleanedString = cleanedString.replace(/\\"/g, '"');
            const {title, message} = JSON.parse(cleanedString);
            Alert.alert(`${title}`, `${message}`);
          }
          setLoading(false);
        });

      if (log_type === 'OUT') {
        updateCoords({lat: null, long: null});
        setAttend()
      }
    } catch (error) {
      console.log('ERROR ATTENDANCE - ', error);
      setLoading(false);
    }
  };

  const isLoggedIn = () => {
    try {
      setLoading(true);
      if (storage.contains('userToken')) {
        let userToken = storage.getString('userToken');
        setUserToken(userToken);
      }
      setLoading(false);
    } catch (error) {
      console.log(`Error while getting AUTH ${error}`);
    }
  };

  const isUser = () => {
    try {
      setLoading(true);
      if (storage.contains('userId')) {
        let userExist = storage.getString('userId');
        setUserId(userExist);
      }
      setLoading(false);
    } catch (error) {
      console.log(`Error while getting AUTH ${error}`);
    }
  };

  const sendImage = selfie => {
    try {
      fetch(`${BASE_URL}/method/custom_pdg.api.uploadImage`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selfie),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          const {_server_messages} = data;

          if (_server_messages !== undefined) {
            let cleanedString = _server_messages.replace(/^\[\"|\"\]$/g, '');
            cleanedString = cleanedString.replace(/\\{2}/g, '\\');
            cleanedString = cleanedString.replace(/\\"/g, '"');
            const {title, message} = JSON.parse(cleanedString);
            Alert.alert(`${title}`, `${message}`);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isLoggedIn();
    isUser();
  }, []);

  useEffect(() => {
    const fetchValue = async () => {
      const locationEverySecond = await getItemAsync('locationEverySecond');
      const loginTime = await getItemAsync('loginTime');
      const staticUrl = await getItemAsync('staticUrl');
      const device_id = await getItemAsync('device_id');
      const deviceType = await getItemAsync('device_type');

      setLocationTrack(locationEverySecond * 1000);
      setLoginTime(loginTime);
      setStaticUrl(staticUrl);
      setDeviceId(device_id);
      setDeviceType(deviceType);
    };

    fetchValue();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        attendance,
        isLoading,
        setLoading,
        userToken,
        userId,
        location_track,
        login_time,
        static_url,
        device_id,
        deviceType,
        setLate,
        setLong,
        lat,
        long,
        updateCoords,
        sendImage,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
