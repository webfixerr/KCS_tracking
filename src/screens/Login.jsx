import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
} from 'react-native';

import {AuthContext} from '../context/AuthContext';
import Loader from '../components/Loader';

const Login = ({navigation}) => {
  const {login, isLoading} = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [dis, setDis] = useState(true);

  useEffect(() => {
    if (userName && password) {
      setDis(false);
    } else {
      setDis(true);
    }
  }, [userName, password]);

  return (
    <View className="bg-gray-50  flex-1 justify-center items-center">
      <View className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        {isLoading ? (
          <Loader />
        ) : (
          <View className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0">
            <View className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <Text className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Sign in to your account
              </Text>
              <View className="space-y-4 md:space-y-6" action="#">
                <View>
                  <TextInput
                    onChangeText={e => setUserName(e)}
                    className="border border-gray-300 sm:text-sm rounded-lg  block w-full p-2.5  placeholder:text-black"
                    placeholder="User-name"
                    value={userName}
                  />
                </View>
                <View>
                  <TextInput
                    onChangeText={e => setPassword(e)}
                    placeholder="Password"
                    className="border border-gray-300  sm:text-sm rounded-lg block w-full p-2.5  placeholder:text-black"
                    secureTextEntry={true}
                    value={password}
                  />
                </View>

                <TouchableOpacity
                  disabled={dis}
                  className={`rounded-lg ${dis ? 'bg-gray-300 ' : 'bg-black '}`}
                  onPress={() => login({userName, password})}>
                  <Text
                    className={`w-full  bg-primary-600 hover:bg-primary-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                      dis ? 'text-gray-600' : 'text-white'
                    }`}>
                    Log in
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Login;
