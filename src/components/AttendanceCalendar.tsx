import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useAuthStore } from "../store/authStore";
import { apiService } from "../services/apiService";
import { useLoadingStore } from "../store/loadingStore";
import { Attendance } from "../types/apiTypes";

interface DateObject {
  year: number;
  month: number;
  day: number;
  timestamp: number;
  dateString: string;
}

interface MarkedDates {
  [date: string]: {
    selected: boolean;
    selectedColor: string;
  };
}

interface Props {
  onDatePress?: (date: DateObject) => void;
  refreshKey?: number;
}

const AttendanceCalendar: React.FC<Props> = ({ onDatePress, refreshKey }) => {
  const { sid, user } = useAuthStore();
  const { isLoading, setLoading } = useLoadingStore();
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<DateObject | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState<Attendance[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchAttendanceData = useCallback(
    async (year: number, month: number) => {
      if (!sid || !user?.userId) return;

      setLoading(true);
      try {
        const response = await apiService.getMyAttendance(
          sid,
          user.userId,
          month,
          year
        );
        const data: Attendance[] = response.message.data;
        const marked: MarkedDates = data.reduce(
          (acc: MarkedDates, attendance) => {
            const date = attendance.attendance_date;
            if (!acc[date]) {
              acc[date] = {
                selected: true,
                selectedColor:
                  attendance.status === "Present" ? "#4CAF50" : "#F44336",
              };
            }
            // For multiple entries on one day, the color will be based on the last entry in the data.
            return acc;
          },
          {}
        );
        setMarkedDates(marked);
        setTooltipData(data);
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      } finally {
        setLoading(false);
      }
    },
    [sid, user, setLoading]
  );

  useEffect(() => {
    fetchAttendanceData(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [currentDate, fetchAttendanceData, refreshKey]);

  const handleMonthChange = (month: DateObject) => {
    setCurrentDate(new Date(month.year, month.month - 1, 1));
  };

  const handleDayPress = (day: DateObject) => {
    const dailyAttendance = tooltipData.filter(
      (item) => item.attendance_date === day.dateString
    );
    if (dailyAttendance.length > 0) {
      setSelectedDate(day);
      setTooltipVisible(true);
    } else {
      setTooltipVisible(false);
      setSelectedDate(null);
    }
    if (onDatePress) {
      onDatePress(day);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4ECDC4" />
        </View>
      )}
      <Calendar
        markedDates={markedDates}
        onMonthChange={handleMonthChange}
        onDayPress={handleDayPress}
        style={styles.calendar}
        theme={{
          todayTextColor: "#4ECDC4",
          arrowColor: "#4ECDC4",
          selectedDayTextColor: "#FFFFFF",
        }}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={tooltipVisible}
        onRequestClose={() => setTooltipVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setTooltipVisible(false)}
        >
          <View style={styles.tooltip}>
            <Text style={styles.tooltipTitle}>
              Attendance Details for{" "}
              {selectedDate ? selectedDate.dateString : ""}
            </Text>
            <ScrollView style={styles.tooltipScrollView}>
              {tooltipData
                .filter(
                  (item) => item.attendance_date === selectedDate?.dateString
                )
                .map((slot, index) => (
                  <View key={index} style={styles.tooltipItem}>
                    <Text style={styles.tooltipBranch}>
                      Branch: {slot.branch}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.tooltipShift}>
                        Shift: {slot.shift}
                      </Text>
                      <View
                        style={[
                          styles.tooltipStatus,
                          {
                            backgroundColor:
                              slot.status === "Present" ? "green" : "red",
                          },
                        ]}
                      >
                        <Text style={styles.tooltipStatusText}>
                          {slot.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  calendar: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  tooltip: {
    width: "80%",
    maxHeight: "50%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  tooltipScrollView: {
    width: "100%",
  },
  tooltipItem: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  tooltipBranch: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  tooltipShift: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  tooltipStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  tooltipStatusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default AttendanceCalendar;
