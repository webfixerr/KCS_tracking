import {MMKV} from 'react-native-mmkv';

const storage = new MMKV({
  id: 'user-storage',
  encryptionKey: 'your-secure-key-here',
});

export const Storage = {
  setToken: token => storage.set('authToken', token),
  getToken: () => storage.getString('authToken'),
  clearToken: () => storage.delete('authToken'),
};

export default Storage;
