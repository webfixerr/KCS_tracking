import {ATTENDANCE, GET_ATTENDANCE} from '../constants/api';
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

  async getAttendanceRecordsByEmployee(employeeId) {
    try {
      const filters = encodeURIComponent(
        JSON.stringify([['employee', '=', employeeId]]),
      );
      const fields = encodeURIComponent(JSON.stringify(['*']));
      const url = `${GET_ATTENDANCE}?filters=${filters}&fields=${fields}`;

      const {data} = await api.get(url);
      return data?.data || [];
    } catch (error) {
      console.warn('GET ATTENDANCE ERROR: ', error);
      return [];
    }
  },
};

export default AttendanceService;
