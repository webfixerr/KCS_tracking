import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { useAttendanceStore } from "../store/attendanceStore";
import { useAuthStore } from "../store/authStore";
import { apiService } from "../services/apiService";
import CameraModal from "../components/CameraModal";
import CustomAlert from "../components/CustomAlert";
import { useLoadingStore } from "../store/loadingStore";
import AttendanceCalendar from "../components/AttendanceCalendar";

const AttendanceScreen = () => {
  const {
    slots,
    updateSlotStatus,
    setLoading: setAttendanceLoading,
    fetchSlots,
  } = useAttendanceStore();
  const { user, sid } = useAuthStore();
  const { setLoading: setGlobalLoading } = useLoadingStore();
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<string | null>(
    null
  );
  const [cameraVisible, setCameraVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [alert, setAlert] = useState<{
    visible: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
  }>({
    visible: false,
    type: "info",
    title: "",
    message: "",
  });
  const [location, setLocation] = useState<{
    latitude: string;
    longitude: string;
  } | null>(null);
  const [permissionsReady, setPermissionsReady] = useState<boolean>(false);
  const [locationServicesEnabled, setLocationServicesEnabled] = useState<
    boolean | null
  >(null);

  const checkPermissionsAndLocation = useCallback(async () => {
    try {
      // Check permissions
      let { status: locationStatus } =
        await Location.getForegroundPermissionsAsync();
      if (locationStatus !== "granted") {
        setAlert({
          visible: true,
          type: "error",
          title: "Location Permission Required",
          message:
            "Please grant location permissions in your device settings to mark attendance.",
        });
        Linking.openSettings();
        setPermissionsReady(false);
        return;
      }

      let { status: cameraStatus } =
        await ImagePicker.getCameraPermissionsAsync();
      if (cameraStatus !== "granted") {
        setAlert({
          visible: true,
          type: "error",
          title: "Camera Permission Required",
          message:
            "Please grant camera permissions in your device settings to capture attendance photo.",
        });
        Linking.openSettings();
        setPermissionsReady(false);
        return;
      }

      // Check location services
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      setLocationServicesEnabled(isLocationEnabled);
      if (!isLocationEnabled) {
        setAlert({
          visible: true,
          type: "error",
          title: "Location Services Disabled",
          message:
            "Please enable location services in your device settings to mark attendance.",
        });
        Linking.openSettings();
        setPermissionsReady(false);
        return;
      }

      // Pre-fetch location
      try {
        let locationData = await Location.getLastKnownPositionAsync();
        if (!locationData) {
          locationData = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
          });
        }
        setLocation({
          latitude: locationData.coords.latitude.toString(),
          longitude: locationData.coords.longitude.toString(),
        });
      } catch (error) {
        console.log("Pre-fetch location failed:", error);
        setLocation(null);
      }

      setPermissionsReady(true);
    } catch (error: any) {
      console.error("Permission check error:", error);
      setPermissionsReady(false);
    }
  }, []);

  useEffect(() => {
    checkPermissionsAndLocation();

    if (sid && user?.userId) {
      setGlobalLoading(true);
      fetchSlots(sid, user.userId).finally(() => setGlobalLoading(false));
    }
  }, [sid, user, setGlobalLoading, checkPermissionsAndLocation, refreshKey]);

  const handleSlotPress = async (slotIndex: string) => {
    try {
      if (!permissionsReady || !locationServicesEnabled) {
        await checkPermissionsAndLocation();
        if (!permissionsReady || !locationServicesEnabled) {
          return; // Alert already shown in checkPermissionsAndLocation
        }
      }

      // Use cached location or fetch new one
      let currentLocation = location;
      if (!currentLocation) {
        let locationData = await Location.getLastKnownPositionAsync();
        if (!locationData) {
          locationData = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
          });
        }
        currentLocation = {
          latitude: locationData.coords.latitude.toString(),
          longitude: locationData.coords.longitude.toString(),
        };
        setLocation(currentLocation);
      }

      // Batch state updates
      setTimeout(() => {
        setSelectedSlotIndex(slotIndex);
        setCameraVisible(true);
      }, 0);
    } catch (error: any) {
      console.error("Location error:", error);
      let errorMessage = "Failed to get location. Please try again.";
      if (error.message.includes("Location services are disabled")) {
        errorMessage =
          "Please enable location services in your device settings to mark attendance.";
        Linking.openSettings();
      } else if (error.message.includes("Location permission denied")) {
        errorMessage =
          "Please grant location permissions in your device settings to mark attendance.";
        Linking.openSettings();
      }
      setAlert({
        visible: true,
        type: "error",
        title: "Location Error",
        message: errorMessage,
      });
      setLocation(null);
      setSelectedSlotIndex(null);
      setCameraVisible(false);
    }
  };

  const handleCameraCapture = async (base64Image: string) => {
    if (!selectedSlotIndex || !sid || !location) {
      setAlert({
        visible: true,
        type: "error",
        title: "Invalid State",
        message: "Missing required data. Please try again.",
      });
      setCameraVisible(false);
      setSelectedSlotIndex(null);
      setLocation(null);
      return;
    }

    const slot = slots[parseInt(selectedSlotIndex)];
    if (!slot) {
      setAlert({
        visible: true,
        type: "error",
        title: "Invalid Slot",
        message: "Selected slot is invalid. Please try again.",
      });
      setCameraVisible(false);
      setSelectedSlotIndex(null);
      setLocation(null);
      return;
    }

    setAttendanceLoading(true);
    setGlobalLoading(true);
    try {
      const attendanceData = {
        employee: slot.employee,
        status: slot.status,
        base64_image: base64Image,
        branch: slot.branch,
        shift_type: slot.shift_type,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      const response = await apiService.markAttendance(attendanceData, sid);
      console.log("Attendance response:", response);

      updateSlotStatus(selectedSlotIndex, true);

      // Refresh slots after successful attendance
      if (sid && user?.userId) {
        await fetchSlots(sid, user.userId);
      }

      setAlert({
        visible: true,
        type: "success",
        title: "Success",
        message: `Successfully ${
          slot.isMarkedIn ? "marked out" : "marked in"
        }!`,
      });
    } catch (error: any) {
      console.error("Attendance error:", error);

      setAlert({
        visible: true,
        type: "error",
        title: "Attendance Failed",
        message: error.message,
      });
    } finally {
      setAttendanceLoading(false);
      setGlobalLoading(false);
      setSelectedSlotIndex(null);
      setLocation(null);
      setCameraVisible(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (sid && user?.userId) {
      setGlobalLoading(true);
      await fetchSlots(sid, user.userId);
      setRefreshKey((prevKey) => prevKey + 1);
      setGlobalLoading(false);
    }
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance Management</Text>
        <Text style={styles.headerSubtitle}>
          Select a slot to mark your attendance
        </Text>
      </View>

      <View style={styles.slotsContainer}>
        {slots.map((slot, index) => (
          <View key={index} style={styles.slotCard}>
            <View style={styles.slotHeader}>
              <View style={styles.slotInfo}>
                <Text style={styles.employeeId}>
                  {index === 0 ? "Primary Branch" : "Overtime Branch"}
                </Text>
                <Text style={styles.detailText}>{slot.branch}</Text>
                <Text style={styles.detailText}>{slot.shift_type}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: slot.isMarkedIn ? "#4CAF50" : "#FF9800",
                    },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {slot.isMarkedIn ? "Marked" : "Not Marked"}
                  </Text>
                </View>
              </View>
              <MaterialIcons
                name={slot.isMarkedIn ? "check-circle" : "schedule"}
                size={24}
                color={slot.isMarkedIn ? "#4CAF50" : "#FF9800"}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: slot.isMarkedIn
                    ? "#B0BEC5"
                    : slot.enable === false
                    ? "#B0BEC5"
                    : "#4ECDC4",
                },
              ]}
              onPress={() => handleSlotPress(index.toString())}
              disabled={slot.isMarkedIn || slot.enable === false}
            >
              <MaterialIcons
                name={slot.isMarkedIn ? "check" : "login"}
                size={20}
                color="white"
              />
              <Text style={styles.actionButtonText}>
                {slot.isMarkedIn ? "Attendance Marked" : "Mark Attendance"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <AttendanceCalendar refreshKey={refreshKey}/>

      <CameraModal
        visible={cameraVisible}
        onClose={() => {
          setCameraVisible(false);
          setSelectedSlotIndex(null);
          setLocation(null);
        }}
        onCapture={handleCameraCapture}
      />

      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  slotsContainer: {
    padding: 16,
  },
  slotCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  slotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  slotInfo: {
    flex: 1,
  },
  employeeId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default AttendanceScreen;
