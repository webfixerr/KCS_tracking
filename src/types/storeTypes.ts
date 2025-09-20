export interface AttendanceSlot {
  employee: string;
  status: string;
  branch: string;
  shift_type: string;
  isMarkedIn: boolean;
  enable?: boolean;
}

export interface User {
  name: string;
  email: string;
  full_name: string;
  user_image?: string;
  userId: string;
}

export interface LoadingState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}