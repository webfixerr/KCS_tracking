import {ATTENDANCE} from '../constants/api';
import api from './api';

export const AttendanceService = {
  async markAttendance(obj) {
    try {
      return await api.post(ATTENDANCE, obj);
    } catch (error) {
      console.warn('ERROR - ', error);
      // throw error;
    }
  },

  async getAttendanceRecords() {
    return api.get('/attendance');
  },

  async getRecords() {
    try {
      const {data} = await api.get('/attendance');
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default AttendanceService;
