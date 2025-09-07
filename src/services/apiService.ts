const BASE_URL = "https://erp.knighthood.co/api/method/custom_kcs.src";

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

class ApiService {
  private async makeRequest(url: string, options: RequestInit = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", url, error);
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.makeRequest(`${BASE_URL}.auth.login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logout(sid: string): Promise<any> {
    return this.makeRequest(`${BASE_URL}.auth.logout`, {
      method: "POST",
      headers: {
        Cookie: `sid=${sid}`,
      },
    });
  }

  async getSlots(sid: string, employee_id: string): Promise<GetSlotsResponse> {
    return this.makeRequest(
      `${BASE_URL}.api.get_employee_context.get_employee_context?employee_id=${encodeURIComponent(
        employee_id
      )}`,
      {
        method: "GET",
        headers: {
          Cookie: `sid=${sid}`,
        },
      }
    );
  }

  async markAttendance(
    attendanceData: AttendanceRequest,
    sid: string
  ): Promise<any> {
    console.log("Attendance API called with:", attendanceData);
    return this.makeRequest(`${BASE_URL}.employee_attendance.attendance`, {
      method: "POST",
      headers: {
        Cookie: `sid=${sid}`,
      },
      body: JSON.stringify(attendanceData),
    });
  }

  async getProfile(sid: string, employee_id: string): Promise<ProfileResponse> {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const url = `${BASE_URL}.api.profile.get_profile?employee_id=%22${encodeURIComponent(
          employee_id
        )}%22`;
        console.log(`Attempting profile API call (Attempt ${attempt}): ${url}`);
        const response = await this.makeRequest(url, {
          method: "GET",
          headers: {
            Cookie: `sid=${sid}`,
          },
        });
        if (
          response.message?.status === "success" &&
          response.message?.data?.user
        ) {
          return response;
        }
        throw new Error("Invalid response structure from profile API");
      } catch (error: any) {
        lastError = error;
        console.error(`Profile API attempt ${attempt} failed:`, error.message);
        if (attempt < maxRetries) {
          console.log(`Retrying profile API call in 1 second...`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
    console.error("Profile API failed after retries:", lastError);
    throw new Error(
      lastError.message || "Failed to fetch profile after retries"
    );
  }
}

export const apiService = new ApiService();
