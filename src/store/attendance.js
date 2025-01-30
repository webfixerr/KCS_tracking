import {create} from 'zustand';

export const useAttendanceStore = create(set => ({
  attend: false,
  setAttend: () => {
    set((state) => ({attend : !state.attend}))
  },
}));
