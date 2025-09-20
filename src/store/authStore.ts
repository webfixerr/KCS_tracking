import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { User } from "../types/storeTypes"

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  sid: string | null
  isLoading: boolean
  setAuth: (user: User, sid: string) => void
  logout: () => void
  checkAuthStatus: () => Promise<void>
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  sid: null,
  isLoading: false,

  setAuth: async (user: User, sid: string) => {
    await AsyncStorage.setItem("user", JSON.stringify(user))
    await AsyncStorage.setItem("sid", sid)
    set({ isAuthenticated: true, user, sid })
  },

  logout: async () => {
    await AsyncStorage.removeItem("user")
    await AsyncStorage.removeItem("sid")
    set({ isAuthenticated: false, user: null, sid: null })
  },

  checkAuthStatus: async () => {
    try {
      const user = await AsyncStorage.getItem("user")
      const sid = await AsyncStorage.getItem("sid")

      if (user && sid) {
        set({
          isAuthenticated: true,
          user: JSON.parse(user),
          sid,
        })
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}))
