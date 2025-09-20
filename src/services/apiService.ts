import {
  AttendanceRequest,
  GetAttendanceResponse,
  GetSlotsResponse,
  LoginRequest,
  LoginResponse,
  ProfileResponse,
} from "./../types/apiTypes";

const BASE_URL = "https://erp.knighthood.co/api/method/custom_kcs.src";

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
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          const errorText = await response.text();
          throw new Error(
            `HTTP error! status: ${response.status}, message: ${errorText}`
          );
        }

        if (
          errorData?.message?.status === "error" &&
          errorData.message.message
        ) {
          throw new Error(errorData.message.message);
        } else {
          throw new Error(
            `HTTP error! status: ${response.status}, message: An unknown error occurred.`
          );
        }
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

  async getSlots(sid: string): Promise<GetSlotsResponse> {
    return this.makeRequest(
      `${BASE_URL}.api.get_employee_context.get_employee_context`,
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

  async getMyAttendance(
    sid: string,
    userId: string,
    month: number,
    year: number
  ): Promise<GetAttendanceResponse> {
    const url = `${BASE_URL}.api.attendance.get_my_attendance?user_id=${encodeURIComponent(
      userId
    )}&month=${month}&year=${year}`;
    try {
      return await this.makeRequest(url, {
        method: "GET",
        headers: {
          Cookie: `sid=${sid}`,
        },
      });
    } catch (error: any) {
      console.error("Get attendance API failed:", error.message);
      throw error;
    }
  }

  async getProfile(sid: string): Promise<ProfileResponse> {
    const maxRetries = 3;
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const url = `${BASE_URL}.api.profile.get_profile`;
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
