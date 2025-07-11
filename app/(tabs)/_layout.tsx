import React, { useState } from "react";
import { Tabs, Redirect } from "expo-router";
import { Lock, MessageSquare, Plus } from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";
import { View, TouchableOpacity, StyleSheet, Platform, Text } from "react-native";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import AddPopup from "@/components/AddPopup";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const [showAddPopup, setShowAddPopup] = useState(false);

  const handleAddPress = () => {
    setShowAddPopup(true);
  };

  return (
    <View style={styles.tabBarContainer}>
      {Platform.OS === 'web' ? (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, state.index === 0 && styles.activeTab]}
            onPress={() => navigation.navigate('index')}
          >
            <Lock
              size={24}
              color={state.index === 0 ? "#6366f1" : "#888"}
            />
            <Text style={[styles.tabLabel, state.index === 0 && styles.activeTabLabel]}>
              Vault
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPress}
          >
            <Plus size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, state.index === 1 && styles.activeTab]}
            onPress={() => navigation.navigate('assistant')}
          >
            <MessageSquare
              size={24}
              color={state.index === 1 ? "#6366f1" : "#888"}
            />
            <Text style={[styles.tabLabel, state.index === 1 && styles.activeTabLabel]}>
              Assistant
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <BlurView intensity={80} tint="dark" style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, state.index === 0 && styles.activeTab]}
            onPress={() => navigation.navigate('index')}
          >
            <Lock
              size={24}
              color={state.index === 0 ? "#6366f1" : "#888"}
            />
            <Text style={[styles.tabLabel, state.index === 0 && styles.activeTabLabel]}>
              Vault
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPress}
          >
            <Plus size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, state.index === 1 && styles.activeTab]}
            onPress={() => navigation.navigate('assistant')}
          >
            <MessageSquare
              size={24}
              color={state.index === 1 ? "#6366f1" : "#888"}
            />
            <Text style={[styles.tabLabel, state.index === 1 && styles.activeTabLabel]}>
              Assistant
            </Text>
          </TouchableOpacity>
        </BlurView>
      )}

      <AddPopup
        visible={showAddPopup}
        onClose={() => setShowAddPopup(false)}
      />
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