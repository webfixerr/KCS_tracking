import { MMKV } from 'react-native-mmkv';

const cookieStorage = new MMKV({
  id: 'cookie-storage',
  encryptionKey: 'your-secure-key-here'
});

export const CookieManager = {
  save: (cookies) => {
    if (Array.isArray(cookies)) {
      cookieStorage.set('cookies', cookies.join('; '));
    }
  },
  
  load: () => cookieStorage.getString('cookies') || '',
  
  clear: () => cookieStorage.delete('cookies')
};