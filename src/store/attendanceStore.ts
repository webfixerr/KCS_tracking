import { create } from "zustand";
import { apiService } from "../services/apiService";

interface AttendanceSlot {
  employee: string;
  status: string;
  branch: string;
  shift_type: string;
  isMarkedIn: boolean;
  enable?: boolean; // For overtime branches
}

interface AttendanceState {
  slots: AttendanceSlot[];
  isLoading: boolean;
  setSlots: (slots: AttendanceSlot[]) => void;
  updateSlotStatus: (slotId: string, isMarkedIn: boolean) => void;
  setLoading: (loading: boolean) => void;
  fetchSlots: (sid: string, employee_id: string) => Promise<void>;
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  slots: [],
  isLoading: false,

  setSlots: (slots) => set({ slots }),
  updateSlotStatus: (slotId, isMarkedIn) =>
    set((state) => ({
      slots: state.slots.map((slot, index) =>
        index.toString() === slotId ? { ...slot, isMarkedIn } : slot
      ),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  fetchSlots: async (sid: string, employee_id: string) => {
    set({ isLoading: true });
    try {
      const response = await apiService.getSlots(sid, employee_id);
      console.log(
        "Fetched slots:",
        response.message.data.primary_branch,
        response.message.data.overtime_branches
      );
      const primarySlot = {
        employee: response.message.data.employee,
        status: "Present",
        branch: response.message.data.primary_branch.name,
        shift_type: response.message.data.primary_branch.shift,
        isMarkedIn: response.message.data.primary_branch.is_marked,
      };
      const overtimeSlots = response.message.data.overtime_branches.map(
        (branch: any) => ({
          employee: response.message.data.employee,
          status: "Present",
          branch: branch.name,
          shift_type: branch.shift,
          isMarkedIn: branch.is_marked,
          enable: branch.enable,
        })
      );
      set({ slots: [primarySlot, ...overtimeSlots] });
    } catch (error) {
      console.error("Fetch slots error:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
