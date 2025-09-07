import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Linking,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useAttendanceStore } from "../store/attendanceStore";
import { useAuthStore } from "../store/authStore";
import { apiService } from "../services/apiService";
import CameraModal from "../components/CameraModal";
import CustomAlert from "../components/CustomAlert";

const AttendanceScreen = () => {
  const { slots, updateSlotStatus, setLoading, isLoading, fetchSlots } =
    useAttendanceStore();
  const { user, sid } = useAuthStore();
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<string | null>(
    null
  );
  const [cameraVisible, setCameraVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
        setAlert({
          visible: true,
          type: "error",
          title: "Location Permission Required",
          message:
            "Please grant location permissions in your device settings to mark attendance.",
        });
        Linking.openSettings();
        return;
      }
      console.log("Location permission granted");
    };
    requestLocation();

    if (sid && user?.userId) {
      fetchSlots(sid, user.userId);
    }
  }, [sid, user]);

  const getLocationWithRetry = async (
    retries = 3,
    timeout = 20000
  ): Promise<Location.LocationObject> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Attempting to get location (Attempt ${attempt})...`);
        // Enable network provider for Android
        if (Platform.OS === "android") {
          try {
            await Location.enableNetworkProviderAsync();
            console.log("Network provider enabled");
          } catch (error) {
            console.log("Failed to enable network provider:", error);
          }
        }
        const locationData = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
          timeInterval: 5000,
          distanceInterval: 10,
        });
        // console.log("Location acquired:", {
        //   latitude: locationData.coords.latitude,
        //   longitude: locationData.coords.longitude,
        //   accuracy: locationData.coords.accuracy,
        // });
        return locationData;
      } catch (error: any) {
        // console.log(`Location attempt ${attempt} failed: ${error.message}`);
        if (attempt === retries) {
          // console.log("Trying last known location as fallback...");
          try {
            const lastKnownLocation =
              await Location.getLastKnownPositionAsync();
            if (lastKnownLocation) {
              console.log("Last known location acquired:", {
                latitude: lastKnownLocation.coords.latitude,
                longitude: lastKnownLocation.coords.longitude,
                accuracy: lastKnownLocation.coords.accuracy,
              });
              return lastKnownLocation;
            }
            console.log("No last known location available");
            throw error;
          } catch (fallbackError) {
            console.log("Fallback failed:", fallbackError);
            throw error; // Re-throw original error
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s before retry
      }
    }
    throw new Error("Failed to get location after retries");
  };

  const handleSlotPress = async (slotIndex: string) => {
    try {
      // Check if location services are enabled
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        console.log("Location services are disabled");
        setAlert({
          visible: true,
          type: "error",
          title: "Location Services Disabled",
          message:
            "Please enable location services (GPS) in your device settings to mark attendance.",
        });
        Linking.openSettings();
        return;
      }
      console.log("Location services are enabled");

      let locationData = await getLocationWithRetry();
      setLocation({
        latitude: locationData.coords.latitude.toString(),
        longitude: locationData.coords.longitude.toString(),
      });
      console.log("Setting cameraVisible to true");
      setSelectedSlotIndex(slotIndex);
      setCameraVisible(true);
    } catch (error: any) {
      console.error("Location error:", error);
      let errorMessage =
        "Failed to get location. Please ensure GPS is enabled and try again.";
      if (error.message.includes("Location services are disabled")) {
        errorMessage =
          "Please enable location services (GPS) in your device settings to mark attendance.";
        Linking.openSettings();
      } else if (error.message.includes("Location permission denied")) {
        errorMessage =
          "Please grant location permissions in your device settings to mark attendance.";
        Linking.openSettings();
      } else if (
        error.message.includes("timeout") ||
        error.message.includes("Current location is unavailable")
      ) {
        errorMessage =
          "Unable to get location due to weak GPS signal. Please move to an open area with a clear view of the sky or ensure your device has a stable GPS signal, then try again.";
      }
      setAlert({
        visible: true,
        type: "error",
        title: "Location Error",
        message: errorMessage,
      });
    }
  };

  const handleCameraCapture = async (base64Image: string) => {
    if (!selectedSlotIndex || !sid || !location) return;

    const slot = slots[parseInt(selectedSlotIndex)];
    if (!slot) return;

    setLoading(true);
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
      let errorMessage = "Failed to mark attendance. Please try again.";
      let errorTitle = "Error";

      if (error.message.includes("403")) {
        errorMessage =
          "You are too far from the allowed location. Please move closer and try again.";
      } else if (error.message.includes("409")) {
        errorMessage = `Attendance already exists for ${slot.employee} on ${
          new Date().toISOString().split("T")[0]
        } in shift '${slot.shift_type}'.`;
      }

      setAlert({
        visible: true,
        type: "error",
        title: errorTitle,
        message: errorMessage,
      });
    } finally {
      setLoading(false);
      setSelectedSlotIndex(null);
      setCameraVisible(false);
      setLocation(null);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (sid && user?.userId) {
      await fetchSlots(sid, user.userId);
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
