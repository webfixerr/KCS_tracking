export interface LoginRequest {
  usr: string;
  pwd: string;
}

export interface LoginResponse {
  default_route: string;
  message: {
    message: string;
    sid: string;
    user_data: any;
    empDetails: any;
  };
  home_page: string;
  full_name: string;
}

export interface AttendanceRequest {
  employee: string;
  status: string;
  base64_image: string;
  branch: string;
  shift_type: string;
  latitude: string;
  longitude: string;
}

export interface Slot {
  name: string;
  shift: string;
  is_marked: boolean;
  enable?: boolean; // Only for overtime branches
}

export interface GetSlotsResponse {
  message: {
    status: string;
    data: {
      employee: string;
      primary_branch: Slot;
      overtime_branches: Slot[];
    };
  };
}

export interface ProfileResponse {
  message: {
    status: string;
    data: {
      user: {
        name: string;
        full_name: string;
        email: string;
        mobile_no: string | null;
        image_url: string | null;
      };
      employee: any;
    };
  };
}

export interface Attendance {
  branch: string;
  shift: string;
  attendance_date: string;
  status: string;
  late_entry: number;
  early_exit: number;
}

export interface GetAttendanceResponse {
  message: {
    success: boolean;
    data: Attendance[];
  };
}
