"use client";

import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
import { apiService } from "../services/apiService";
import AttendanceScreen from "../screens/AttendanceScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CustomAlert from "../components/CustomAlert";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => {
  const { user, logout, sid } = useAuthStore();
  const [alert, setAlert] = React.useState<{
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

  const handleLogout = async () => {
    try {
      if (sid) {
        await apiService.logout(sid);
      }
      logout();
      setAlert({
        visible: true,
        type: "success",
        title: "Success",
        message: "Logged out successfully",
      });
    } catch (error) {
      setAlert({
        visible: true,
        type: "error",
        title: "Error",
        message: "Failed to logout",
      });
    }
  };

  const currentRoute = props.state.routeNames[props.state.index];

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.userSection}>
        <Image
          source={{
            uri: user?.user_image || "https://via.placeholder.com/80",
          }}
          style={styles.userImage}
        />
        <Text style={styles.userName}>{user?.full_name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity
          style={[
            styles.menuItem,
            currentRoute === "Attendance" && styles.activeMenuItem,
          ]}
          onPress={() => props.navigation.navigate("Attendance")}
        >
          <MaterialIcons
            name="schedule"
            size={24}
            color={currentRoute === "Attendance" ? "#007AFF" : "#666"}
          />
          <Text
            style={[
              styles.menuText,
              currentRoute === "Attendance" && styles.activeMenuText,
            ]}
          >
            Attendance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.menuItem,
            currentRoute === "Profile" && styles.activeMenuItem,
          ]}
          onPress={() => props.navigation.navigate("Profile")}
        >
          <MaterialIcons
            name="person"
            size={24}
            color={currentRoute === "Profile" ? "#007AFF" : "#666"}
          />
          <Text
            style={[
              styles.menuText,
              currentRoute === "Profile" && styles.activeMenuText,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#FF6B6B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </View>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#007AFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Drawer.Screen name="Attendance" component={AttendanceScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  userSection: {
    backgroundColor: "#007AFF",
    padding: 20,
    alignItems: "center",
    paddingTop: 50,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
  },
  menuSection: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  activeMenuItem: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#666",
  },
  activeMenuText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  logoutSection: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    padding: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#FF6B6B",
    fontWeight: "600",
  },
});

export default DrawerNavigator;
