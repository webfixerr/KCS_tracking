import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const setItem = async (key, value) => {
  storage.set(key, value);
};

export const getItem = (key, defaultValue = null) => {
  const value = storage.getString(key);
  return value || defaultValue;
};

// To ensure value availability, use promises
export const setItemAsync = (key, value) => {
  return new Promise((resolve) => {
    storage.set(key, value);
    resolve(true);
  });
};

export const getItemAsync = (key, defaultValue = null) => {
  return new Promise((resolve) => {
    const value = storage.getString(key);
    resolve(value || defaultValue);
  });
};
