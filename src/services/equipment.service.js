import {GET_EQUIPMENT, REPORT_EQUIPMENT} from '../constants/api';
import api from './api';

export const EquipmentService = {
  async getEquipment(userId) {
    const url = `${GET_EQUIPMENT}?employee=${userId}`;
    return await api.get(url);
  },

  async requestEquipment({employee, equipment}) {
    return await api.post(REPORT_EQUIPMENT, {employee, equipment});
  },
};

export default EquipmentService;
