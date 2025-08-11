import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { router } from "expo-router";
import { useLoyaltyStore } from "@/stores/loyalty-store";
import { useKTNStore } from "@/stores/ktn-store";
import { airlines } from "@/constants/airlines";
import { X } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInUp } from "react-native-reanimated";

type Airline = {
  id: string;
  name: string;
  logo: string;
};

export default function AddLoyaltyScreen() {
  const { addProgram } = useLoyaltyStore();
  const { ktns } = useKTNStore();
  const [selectedAirline, setSelectedAirline] = useState<Airline | null>(null);
  const [memberNumber, setMemberNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAirlines = searchQuery
    ? airlines.filter(airline =>
      airline.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : airlines;

  const handleSave = () => {
    if (!selectedAirline || !memberNumber) return;

    addProgram({
      id: Date.now().toString(),
      airlineId: selectedAirline.id,
      airlineName: selectedAirline.name,
      airlineLogo: selectedAirline.logo,
      memberNumber,
    });

    router.back();
  };

  const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Loyalty Program</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <AnimatedView
            style={styles.formContainer}
            entering={Platform.OS !== 'web' ? FadeInUp.duration(500) : undefined}
          >
            <Text style={styles.label}>Select Airline or Hotel</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search airlines..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />

            <View style={styles.airlinesContainer}>
              {filteredAirlines.map((airline) => (
                <TouchableOpacity
                  key={airline.id}
                  style={[
                    styles.airlineItem,
                    selectedAirline?.id === airline.id && styles.selectedAirline,
                  ]}
                  onPress={() => setSelectedAirline(airline)}
                >
                  <Text style={styles.airlineName}>{airline.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Membership Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your membership number"
              placeholderTextColor="#666"
              value={memberNumber}
              onChangeText={setMemberNumber}
            />

            {ktns.length > 0 ? (
              <View style={styles.ktnInfo}>
                <Text style={styles.ktnInfoText}>
                  ✓ KTN is set globally and will be used for all flights
                </Text>
              </View>
            ) : (
              <View style={styles.ktnInfo}>
                <Text style={styles.ktnInfoText}>
                  💡 Add your Known Traveler Number in Settings for faster check-in
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.saveButton,
                (!selectedAirline || !memberNumber) && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!selectedAirline || !memberNumber}
            >
              <Text style={styles.saveButtonText}>Save Program</Text>
            </TouchableOpacity>
          </AnimatedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ddd",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
  },
  searchInput: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
  },
  airlinesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  airlineItem: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  ktnInfo: {
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#6366f1",
  },
  ktnInfoText: {
    color: "#ddd",
    fontSize: 14,
    lineHeight: 20,
  },
  selectedAirline: {
    backgroundColor: "#6366f1",
  },
  airlineName: {
    color: "#fff",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonDisabled: {
    backgroundColor: "#3f3f46",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});