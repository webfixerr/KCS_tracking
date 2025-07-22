"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useAttendanceStore } from "../store/attendanceStore"
import { useAuthStore } from "../store/authStore"
import { apiService } from "../services/apiService"
import CameraModal from "../components/CameraModal"
import CustomAlert from "../components/CustomAlert"

const AttendanceScreen = () => {
  const { slots, updateSlotStatus, setLoading, isLoading } = useAttendanceStore()
  const { sid } = useAuthStore()
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [cameraVisible, setCameraVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [alert, setAlert] = useState<{
    visible: boolean
    type: "success" | "error" | "info"
    title: string
    message: string
  }>({
    visible: false,
    type: "info",
    title: "",
    message: "",
  })

  const handleSlotPress = (slotId: string) => {
    setSelectedSlot(slotId)
    setCameraVisible(true)
  }

  const handleCameraCapture = async (base64Image: string) => {
    if (!selectedSlot || !sid) return

    const slot = slots.find((s) => s.id === selectedSlot)
    if (!slot) return

    setLoading(true)
    try {
      const attendanceData = {
        employee: slot.employee,
        status: slot.status,
        base64_image: base64Image,
        branch: slot.branch,
        work_location: slot.work_location,
        shift_type: slot.shift_type,
        latitude: slot.latitude,
        longitude: slot.longitude,
      }

      const response = await apiService.markAttendance(attendanceData, sid)
      console.log("Attendance response:", response)

      updateSlotStatus(selectedSlot, !slot.isMarkedIn)

      setAlert({
        visible: true,
        type: "success",
        title: "Success",
        message: `Successfully ${slot.isMarkedIn ? "marked out" : "marked in"}!`,
      })
    } catch (error) {
      console.error("Attendance error:", error)
      setAlert({
        visible: true,
        type: "error",
        title: "Error",
        message: "Failed to mark attendance. Please try again.",
      })
    } finally {
      setLoading(false)
      setSelectedSlot(null)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance Management</Text>
        <Text style={styles.headerSubtitle}>Select a slot to mark your attendance</Text>
      </View>

      <View style={styles.slotsContainer}>
        {slots.map((slot) => (
          <TouchableOpacity
            key={slot.id}
            style={styles.slotCard}
            onPress={() => handleSlotPress(slot.id)}
            disabled={isLoading}
          >
            <View style={styles.slotHeader}>
              <View style={styles.slotInfo}>
                <Text style={styles.employeeId}>{slot.employee}</Text>
                <View style={[styles.statusBadge, { backgroundColor: slot.isMarkedIn ? "#4CAF50" : "#FF9800" }]}>
                  <Text style={styles.statusText}>{slot.isMarkedIn ? "Marked In" : "Not Marked"}</Text>
                </View>
              </View>
              <MaterialIcons
                name={slot.isMarkedIn ? "check-circle" : "schedule"}
                size={24}
                color={slot.isMarkedIn ? "#4CAF50" : "#FF9800"}
              />
            </View>

            <View style={styles.slotDetails}>
              <View style={styles.detailRow}>
                <MaterialIcons name="business" size={16} color="#666" />
                <Text style={styles.detailText}>{slot.branch}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="location-on" size={16} color="#666" />
                <Text style={styles.detailText}>{slot.work_location}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialIcons name="schedule" size={16} color="#666" />
                <Text style={styles.detailText}>{slot.shift_type}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: slot.isMarkedIn ? "#FF6B6B" : "#4ECDC4" }]}
              onPress={() => handleSlotPress(slot.id)}
              disabled={isLoading}
            >
              <MaterialIcons name={slot.isMarkedIn ? "logout" : "login"} size={20} color="white" />
              <Text style={styles.actionButtonText}>{slot.isMarkedIn ? "Mark Out" : "Mark In"}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <CameraModal
        visible={cameraVisible}
        onClose={() => {
          setCameraVisible(false)
          setSelectedSlot(null)
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
  )
}

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
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  slotDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
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
})

export default AttendanceScreen
