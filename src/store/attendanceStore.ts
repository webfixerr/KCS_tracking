import { create } from "zustand"

interface AttendanceSlot {
  id: string
  employee: string
  status: string
  branch: string
  work_location: string
  shift_type: string
  latitude: string
  longitude: string
  isMarkedIn: boolean
}

interface AttendanceState {
  slots: AttendanceSlot[]
  isLoading: boolean
  setSlots: (slots: AttendanceSlot[]) => void
  updateSlotStatus: (slotId: string, isMarkedIn: boolean) => void
  setLoading: (loading: boolean) => void
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  slots: [
    {
      id: "1",
      employee: "HR-EMP-01684",
      status: "Present",
      branch: "KCS internal",
      work_location: "Lucknow",
      shift_type: "Night shift",
      latitude: "28.6490624",
      longitude: "77.1555328",
      isMarkedIn: false,
    },
    {
      id: "2",
      employee: "HR-EMP-01685",
      status: "Present",
      branch: "KCS internal",
      work_location: "Delhi",
      shift_type: "Day shift",
      latitude: "28.7041",
      longitude: "77.1025",
      isMarkedIn: false,
    },
  ],
  isLoading: false,

  setSlots: (slots) => set({ slots }),
  updateSlotStatus: (slotId, isMarkedIn) =>
    set((state) => ({
      slots: state.slots.map((slot) => (slot.id === slotId ? { ...slot, isMarkedIn } : slot)),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}))
