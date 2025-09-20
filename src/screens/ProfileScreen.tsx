import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
import { apiService } from "../services/apiService";
import CustomAlert from "../components/CustomAlert";

const ProfileScreen = () => {
  const { user, sid, setAuth } = useAuthStore();
  const [profileData, setProfileData] = useState<{
    name: string;
    full_name: string;
    email: string;
    mobile_no: string | null;
    image_url: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchProfile = async () => {
      if (!sid || !user?.userId) {
        console.log("Missing sid or userId:", { sid, userId: user?.userId });
        setAlert({
          visible: true,
          type: "error",
          title: "Authentication Error",
          message: "User session or user ID is missing. Please log in again.",
        });
        setLoading(false);
        return;
      }

      try {
        const response = await apiService.getProfile(sid);
        console.log("Processed profile data:", response);
        if (
          response.message?.status === "success" &&
          response.message?.data?.user
        ) {
          const newImageUrl = response.message.data.user.image_url
            ? `https://erp.knighthood.co${response.message.data.user.image_url}`
            : null;
          setProfileData({
            name: response.message.data.user.name,
            full_name: response.message.data.user.full_name,
            email: response.message.data.user.email,
            mobile_no: response.message.data.user.mobile_no,
            image_url: newImageUrl,
          });
          // Sync user.user_image in useAuthStore
          if (newImageUrl && newImageUrl !== user?.user_image) {
            setAuth({ ...user!, user_image: newImageUrl }, sid!);
          }
        } else {
          throw new Error("Invalid response structure from profile API");
        }
      } catch (error: any) {
        console.error("Profile fetch error:", error.message);

        setAlert({
          visible: true,
          type: "error",
          title: "Profile Fetch Error",
          message: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [sid, user, setAuth]);

  const profileSections = [
    {
      title: "Personal Information",
      items: [
        {
          label: "Full Name",
          value: profileData?.full_name || user?.full_name || "N/A",
          icon: "person",
        },
        {
          label: "Email",
          value: profileData?.email || user?.email || "N/A",
          icon: "email",
        },
        {
          label: "Username",
          value: profileData?.name || user?.name || "N/A",
          icon: "alternate-email",
        },
        {
          label: "Mobile Number",
          value: profileData?.mobile_no || "N/A",
          icon: "phone",
        },
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
  ];

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{
                  uri:
                    profileData?.image_url ||
                    user?.user_image ||
                    "https://via.placeholder.com/120",
                }}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.editImageButton}>
                <MaterialIcons name="camera-alt" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>
              {profileData?.full_name || user?.full_name || "N/A"}
            </Text>
            <Text style={styles.userEmail}>
              {profileData?.email || user?.email || "N/A"}
            </Text>
          </View>

          {profileSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionContent}>
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.profileItem}>
                    <View style={styles.itemLeft}>
                      <MaterialIcons
                        name={item.icon as any}
                        size={24}
                        color="#007AFF"
                      />
                      <View style={styles.itemText}>
                        <Text style={styles.itemLabel}>{item.label}</Text>
                        <Text style={styles.itemValue}>{item.value}</Text>
                      </View>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={20}
                      color="#ccc"
                    />
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

          <CustomAlert
            visible={alert.visible}
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert({ ...alert, visible: false })}
          />
        </>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
});

export default ProfileScreen;
