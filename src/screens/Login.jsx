import React, {useState} from 'react';
import {View, TextInput, Button, Alert, StyleSheet} from 'react-native';
import useAuthStore from '../store/auth.store';
import {WELCOME_PATH} from '../constants/path';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useAuthStore();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      await login({username, password});
      navigation.navigate(WELCOME_PATH);
    } catch (error) {
      let message = error.message;

      // Handle specific error cases
      if (message.includes('Network Error')) {
        message = 'Check your internet connection';
      } else if (message.includes('HTML instead of JSON')) {
        message = 'Server configuration error';
      }

      Alert.alert('Login Failed', message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#999"
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
    color:'black'
  },
});
