import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Platform, TouchableOpacity } from "react-native";
import { useLoyaltyStore } from "@/stores/loyalty-store";
import { useAuthStore } from "@/stores/auth-store";
import LoyaltyCard from "@/components/LoyaltyCard";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "@/components/EmptyState";
import ProfileDropdown from "@/components/ProfileDropdown";
import KTNWidget from "@/components/KTNWidget";
import { router } from "expo-router";
import { User } from "lucide-react-native";

export default function LoyaltyProgramsScreen() {
  const { programs, loadPrograms } = useLoyaltyStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profileIconPosition, setProfileIconPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const loadData = async () => {
      await loadPrograms();
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleAddProgram = () => {
    router.push("/add-loyalty");
  };

  const handleProfilePress = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setProfileIconPosition({ x: pageX, y: pageY });
    setShowProfileDropdown(true);
  };

  const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Vault</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleProfilePress}
        >
          <User size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <KTNWidget />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your programs...</Text>
        </View>
      ) : programs.length === 0 ? (
        <EmptyState
          title="No Loyalty Programs Yet"
          description="Add your first airline or hotel loyalty program to get started"
          buttonText="Add Program"
          onPress={handleAddProgram}
        />
      ) : (
        <FlatList
          data={programs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <AnimatedView
              entering={Platform.OS !== 'web' ? FadeInUp.delay(100 * index).duration(500) : undefined}
              style={styles.cardContainer}
            >
              <LoyaltyCard program={item} />
            </AnimatedView>
          )}
        />
      )}

      <ProfileDropdown
        visible={showProfileDropdown}
        onClose={() => setShowProfileDropdown(false)}
        anchorPosition={profileIconPosition}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
    paddingBottom: 120, // Extra padding for floating dock
  },
  cardContainer: {
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#aaa",
    fontSize: 16,
  },
});