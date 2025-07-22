const BASE_URL = "https://erp.knighthood.co/api/method/custom_kcs.src"

export interface LoginRequest {
  usr: string
  pwd: string
}

export interface LoginResponse {
  default_route: string
  message: {
    message: string
    sid: string
    user_data: any
  }
  home_page: string
  full_name: string
}

export interface AttendanceRequest {
  employee: string
  status: string
  base64_image: string
  branch: string
  work_location: string
  shift_type: string
  latitude: string
  longitude: string
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
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.makeRequest(`${BASE_URL}.auth.login`, {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async logout(sid: string): Promise<any> {
    return this.makeRequest(`${BASE_URL}.auth.logout`, {
      method: "POST",
      headers: {
        Cookie: `sid=${sid}`,
      },
    })
  }

  async markAttendance(attendanceData: AttendanceRequest, sid: string): Promise<any> {
    console.log("Attendance API called with:", attendanceData)
    return this.makeRequest(`${BASE_URL}.employee_attendance.attendance`, {
      method: "GET",
      headers: {
        Cookie: `sid=${sid}`,
      },
      body: JSON.stringify(attendanceData),
    })
  }
}

export const apiService = new ApiService()
