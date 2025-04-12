import {create} from 'zustand';
import {Storage} from '../utils/storage';
import api from '../services/api';
import {LOGIN, LOGOUT} from '../constants/api';
import {CookieManager} from '../utils/cookies';

const useAuthStore = create(set => ({
  user: null,
  token: Storage.getToken() || null,
  isAuthenticated: !!Storage.getToken(),

  initialize: async () => {
    try {
      const token = Storage.getToken();
      if (!token) return;

      const {data} = await api.get(LOGIN);
      console.log('DATA LOGIN TRIED');
      set({isAuthenticated: true, token, user: data.user});
    } catch (error) {
      console.log('ERROR ON LOGIN ');
      Storage.clearToken();
      set({isAuthenticated: false, token: null, user: null});
    }
  },

  login: async credentials => {
    try {
      const response = await api.post(LOGIN, {
        usr: credentials.username,
        pwd: credentials.password,
      });

      const {email, empDetails, full_name, sid, message} =
        response.data.message;
      console.log('LOGIN', response.data.message);

      if (!message) {
        throw new Error('Invalid server response structure');
      }

      if (message == 'Logged In') {
        // Store session data
        Storage.setToken(sid);
        CookieManager.save(response.headers['set-cookie']);

        // Update store state
        set({
          isAuthenticated: true,
          user: {
            id: empDetails.name,
            email: email,
            fullName: full_name,
          },
          token: sid,
        });

        return;
      }
    } catch (error) {
      console.error('Login Error:', {
        message: error.message,
        response: error.response?.data,
      });

      // Clear invalid credentials
      Storage.clearToken();
      CookieManager.clear();

      throw new Error(error.message || 'Login failed');
    }
  },

  logout: async () => {
    const {data} = await api.post(LOGOUT);
    CookieManager.clear();
    Storage.clearToken();
    set({isAuthenticated: false, token: null, user: null});
  },
}));

export default useAuthStore;
