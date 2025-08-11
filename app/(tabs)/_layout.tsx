import React, { useState } from "react";
import { Tabs, Redirect } from "expo-router";
import { Lock, MessageSquare, Plus } from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";
import { View, TouchableOpacity, StyleSheet, Platform, Text, Modal } from "react-native";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import AddPopup from "@/components/AddPopup";
import { useKTNStore, KTN } from "@/stores/ktn-store";
import { X } from "lucide-react-native";
import { ScrollView, TextInput, KeyboardAvoidingView } from "react-native";
import HapticTouchable from "@/components/HapticTouchable";
import { hapticFeedback } from "@/utils/haptics";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showKTNModal, setShowKTNModal] = useState(false);
  const [ktnNumber, setKtnNumber] = useState("");
  const [ktnNickname, setKtnNickname] = useState("");
  const { ktns, addKTN } = useKTNStore();

  const handleAddPress = () => {
    // If we're on the assistant page, navigate to main page first
    if (state.index === 1) {
      navigation.navigate('index');
    }
    setShowAddPopup(true);
  };

  const handleAddKTN = () => {
    setShowKTNModal(true);
  };

  const handleSaveKTN = () => {
    if (ktnNumber.trim() && ktnNickname.trim()) {
      const newKTN: KTN = {
        id: Date.now().toString(),
        number: ktnNumber.trim(),
        nickname: ktnNickname.trim(),
      };
      addKTN(newKTN);
      setKtnNumber("");
      setKtnNickname("");
      setShowKTNModal(false);
    }
  };

  return (
    <View style={styles.tabBarContainer}>
      {Platform.OS === 'web' ? (
        <View style={styles.tabBar}>
          <HapticTouchable
            style={[styles.tabItem, state.index === 0 && styles.activeTab]}
            onPress={() => navigation.navigate('index')}
            hapticType="light"
          >
            <Lock
              size={24}
              color={state.index === 0 ? "#6366f1" : "#888"}
            />
            <Text style={[styles.tabLabel, state.index === 0 && styles.activeTabLabel]}>
              Vault
            </Text>
          </HapticTouchable>

          <HapticTouchable
            style={styles.addButton}
            onPress={handleAddPress}
            hapticType="medium"
          >
            <Plus size={24} color="#fff" />
          </HapticTouchable>

          <HapticTouchable
            style={[styles.tabItem, state.index === 1 && styles.activeTab]}
            onPress={() => navigation.navigate('assistant')}
            hapticType="light"
          >
            <MessageSquare
              size={24}
              color={state.index === 1 ? "#6366f1" : "#888"}
            />
            <Text style={[styles.tabLabel, state.index === 1 && styles.activeTabLabel]}>
              Assistant
            </Text>
          </HapticTouchable>
        </View>
      ) : (
        <BlurView intensity={80} tint="dark" style={styles.tabBar}>
          <HapticTouchable
            style={[styles.tabItem, state.index === 0 && styles.activeTab]}
            onPress={() => navigation.navigate('index')}
            hapticType="light"
          >
            <Lock
              size={24}
              color={state.index === 0 ? "#6366f1" : "#888"}
            />
            <Text style={[styles.tabLabel, state.index === 0 && styles.activeTabLabel]}>
              Vault
            </Text>
          </HapticTouchable>

          <HapticTouchable
            style={styles.addButton}
            onPress={handleAddPress}
            hapticType="medium"
          >
            <Plus size={24} color="#fff" />
          </HapticTouchable>

          <HapticTouchable
            style={[styles.tabItem, state.index === 1 && styles.activeTab]}
            onPress={() => navigation.navigate('assistant')}
            hapticType="light"
          >
            <MessageSquare
              size={24}
              color={state.index === 1 ? "#6366f1" : "#888"}
            />
            <Text style={[styles.tabLabel, state.index === 1 && styles.activeTabLabel]}>
              Assistant
            </Text>
          </HapticTouchable>
        </BlurView>
      )}

      <AddPopup
        visible={showAddPopup}
        onClose={() => setShowAddPopup(false)}
        onAddKTN={handleAddKTN}
      />
      <Modal
        visible={showKTNModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowKTNModal(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <BlurView
            intensity={40}
            tint="dark"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
            }}
          />
          <HapticTouchable
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 1,
            }}
            onPress={() => setShowKTNModal(false)}
            hapticType="light"
          />
          <View style={{ backgroundColor: "#1a1a1a", borderRadius: 20, width: "100%", maxWidth: 400, zIndex: 2 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "#2a2a2a" }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>Add KTN</Text>
              <HapticTouchable onPress={() => setShowKTNModal(false)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#2a2a2a", justifyContent: "center", alignItems: "center" }} hapticType="light">
                <X size={20} color="#fff" />
              </HapticTouchable>
            </View>
            <ScrollView style={{ padding: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#ddd", marginBottom: 8, marginTop: 16 }}>Nickname</Text>
              <TextInput
                style={{ backgroundColor: "#2a2a2a", borderRadius: 12, padding: 16, color: "#fff", fontSize: 16, marginBottom: 8 }}
                placeholder="e.g., Mom, Dad, John"
                placeholderTextColor="#666"
                value={ktnNickname}
                onChangeText={setKtnNickname}
                autoCapitalize="words"
              />
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#ddd", marginBottom: 8, marginTop: 16 }}>Known Traveler Number</Text>
              <TextInput
                style={{ backgroundColor: "#2a2a2a", borderRadius: 12, padding: 16, color: "#fff", fontSize: 16, marginBottom: 8 }}
                placeholder="Enter KTN"
                placeholderTextColor="#666"
                value={ktnNumber}
                onChangeText={setKtnNumber}
                autoCapitalize="characters"
                autoCorrect={false}
              />
              <Text style={{ fontSize: 14, color: "#aaa", lineHeight: 20, marginTop: 16, marginBottom: 24 }}>
                Your Known Traveler Number (KTN) is used for TSA PreCheck and Global Entry. It's the same number for all airlines.
              </Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <HapticTouchable
                  style={{ flex: 1, backgroundColor: ktnNumber.trim() && ktnNickname.trim() ? "#6366f1" : "#444", borderRadius: 12, padding: 16, alignItems: "center" }}
                  onPress={handleSaveKTN}
                  disabled={!ktnNumber.trim() || !ktnNickname.trim()}
                  hapticType="success"
                >
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>Save</Text>
                </HapticTouchable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function TabLayout() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#121212",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: -16,
    left: 0,
    right: 0,
    paddingBottom: 0,
  },
  tabBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    backgroundColor: Platform.OS === 'web' ? "rgba(42, 42, 42, 0.95)" : "rgba(26, 26, 26, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingBottom: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    height: 50,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 4,
  },
  activeTab: {
    // No background highlighting
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 10,
    color: "#888",
    marginTop: 2,
    textAlign: "center",
  },
  activeTabLabel: {
    color: "#6366f1",
  },
});