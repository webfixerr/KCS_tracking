import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useAuthStore } from "../store/authStore"

const ProfileScreen = () => {
  const { user } = useAuthStore()

  const profileSections = [
    {
      title: "Personal Information",
      items: [
        { label: "Full Name", value: user?.full_name || "N/A", icon: "person" },
        { label: "Email", value: user?.email || "N/A", icon: "email" },
        { label: "Username", value: user?.name || "N/A", icon: "alternate-email" },
      ],
    },
    {
      title: "Account Settings",
      items: [
        { label: "Language", value: "English", icon: "language" },
        { label: "Time Zone", value: "Asia/Kolkata", icon: "schedule" },
        { label: "Notifications", value: "Enabled", icon: "notifications" },
      ],
    },
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: user?.user_image || "https://via.placeholder.com/120",
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <MaterialIcons name="camera-alt" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.full_name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {profileSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.profileItem}>
                <View style={styles.itemLeft}>
                  <MaterialIcons name={item.icon as any} size={24} color="#007AFF" />
                  <View style={styles.itemText}>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    <Text style={styles.itemValue}>{item.value}</Text>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#ccc" />
              </View>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <View style={styles.sectionContent}>
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.itemLeft}>
              <MaterialIcons name="vpn-key" size={24} color="#FF9800" />
              <Text style={styles.actionText}>Change Password</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.itemLeft}>
              <MaterialIcons name="help" size={24} color="#4CAF50" />
              <Text style={styles.actionText}>Help & Support</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.itemLeft}>
              <MaterialIcons name="info" size={24} color="#2196F3" />
              <Text style={styles.actionText}>About</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </View>
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
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#007AFF",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemText: {
    marginLeft: 16,
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 14,
    color: "#666",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  actionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 16,
  },
})

export default ProfileScreen
