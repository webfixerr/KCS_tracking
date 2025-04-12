import {create} from 'zustand';

const useAppStore = create((set) => ({
  loading: false,
  error: null,
  permissionsGranted: false,
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setPermissions: (granted) => set({ permissionsGranted: granted }),
}));

export default useAppStore;