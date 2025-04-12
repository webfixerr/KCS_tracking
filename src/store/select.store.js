import {create} from 'zustand';

const useSelectStore = create(set => ({
  branch: 'hcl',
  work_location: 'lucknow',
  shift_type: 'night',
  setBranch: branch => set({branch}),
  setWorkLocation: workLocation => set({work_location: workLocation}),
  setShiftType: shiftType => set({shift_type: shiftType}),
}));

export default useSelectStore;
