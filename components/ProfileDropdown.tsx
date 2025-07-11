import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform
} from "react-native";
import { BlurView } from "expo-blur";
import { User, Moon, Sun, LogOut, Check, X, Lock, Database } from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";
import { useSettingsStore } from "@/stores/settings-store";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutUp } from "react-native-reanimated";
import { router } from "expo-router";
import { StorageDebug } from "@/utils/storage-debug";

type ProfileDropdownProps = {
  visible: boolean;
  onClose: () => void;
  anchorPosition: { x: number; y: number };
};

export default function ProfileDropdown({ visible, onClose, anchorPosition }: ProfileDropdownProps) {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useSettingsStore();

  const handleSignOut = () => {
    logout();
    onClose();
    router.replace("/(auth)");
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode();
  };

  const handleViewStoredData = async () => {
    console.log('🔍 Viewing stored data...');
    await StorageDebug.viewAllData();
    onClose();
  };

  const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        <AnimatedView
          entering={Platform.OS !== 'web' ? SlideInDown.duration(300) : undefined}
          style={styles.popup}
        >
          <View style={styles.popupHeader}>
            <Text style={styles.popupTitle}>Profile</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <User size={24} color="#6366f1" />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user?.name || "Traveler"}</Text>
                <Text style={styles.userEmail}>
                  {user?.email ?
                    (user.isPrivateEmail ? `${user.email} (Private)` : user.email) :
                    "Signed in with Apple"
                  }
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            {/* Theme selection */}
            <View style={{ marginBottom: 8 }}>
              <Text style={{ color: '#fff', fontWeight: '600', marginBottom: 8 }}>Theme</Text>
              <TouchableOpacity
                style={[styles.menuItem, { backgroundColor: '#6366f1' }]}
                disabled={true}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuItemIcon}>
                    <Moon size={20} color={'#fff'} />
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={[styles.menuItemTitle, { color: '#fff' }]}>Dark Mode</Text>
                    <Text style={[styles.menuItemDescription, { color: '#e0e7ff' }]}>Easy on the eyes</Text>
                  </View>
                </View>
                <Lock size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleViewStoredData}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <Database size={20} color="#6366f1" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>View Stored Data</Text>
                  <Text style={styles.menuItemDescription}>Check console for data</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleSignOut}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuItemIcon, styles.signOutIcon]}>
                  <LogOut size={20} color="#ef4444" />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemTitle, styles.signOutText]}>Sign Out</Text>
                  <Text style={styles.menuItemDescription}>Sign out of your account</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </AnimatedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  popupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#aaa",
  },
  separator: {
    height: 1,
    backgroundColor: "#2a2a2a",
    marginVertical: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  signOutIcon: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 14,
    color: "#aaa",
  },
  signOutText: {
    color: "#ef4444",
  },
});