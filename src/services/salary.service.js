import api from './api';
import {SALARY_SLIP} from '../constants/api';

export const SalaryService = {
  async getSalary(userId) {
    const filters = encodeURIComponent(
      JSON.stringify([['employee', '=', `${userId}`]]),
    );
    const fields = encodeURIComponent(JSON.stringify(['*']));

    const url = `${SALARY_SLIP}?filters=${filters}&fields=${fields}`;

    try {
      return await api.get(url);
    } catch (error) {
      console.error('API ERROR - ', error.response?.data || error.message);
      throw error;
    }
  },
};

export default SalaryService;
