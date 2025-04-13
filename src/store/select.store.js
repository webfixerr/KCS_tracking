import {create} from 'zustand';
import api from '../services/api';
import {BRANCH, SHIFT_TYPE} from '../constants/api';

const useSelectStore = create(set => ({
  branch: '',
  shift_type: '',
  setBranch: branchOpt => set({branch: branchOpt}),
  setShiftType: shiftType => set({shift_type: shiftType}),

  branchOptions: [],
  shiftTypeOptions: [],

  fetchBranchOptions: async () => {
    try {
      const res = await api.get(BRANCH);
      const options = res.data.data.map(item => ({
        label: item.name,
        value: item.name.toLowerCase().replace(/\s+/g, '_'),
      }));
      set({branchOptions: options});
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  },

  fetchShiftTypeOptions: async () => {
    try {
      const res = await api.get(SHIFT_TYPE);
      const options = res.data.data.map(item => ({
        label: item.name,
        value: item.name.toLowerCase().replace(/\s+/g, '_'),
      }));
      set({shiftTypeOptions: options});
    } catch (error) {
      console.error('Error fetching shift types:', error);
    }
  },
}));

export default useSelectStore;

// work_location: 'lucknow',
// setWorkLocation: workLocation => set({work_location: workLocation}),
