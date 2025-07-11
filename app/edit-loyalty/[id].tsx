import { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useLoyaltyStore } from "@/stores/loyalty-store";
import { X, Trash2 } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditLoyaltyScreen() {
  const { id } = useLocalSearchParams();
  const { programs, updateProgram, deleteProgram } = useLoyaltyStore();
  
  const [memberNumber, setMemberNumber] = useState("");
  const [knownTravelerNumber, setKnownTravelerNumber] = useState("");
  
  const program = programs.find(p => p.id === id);
  
  useEffect(() => {
    if (program) {
      setMemberNumber(program.memberNumber);
      setKnownTravelerNumber(program.knownTravelerNumber || "");
    } else {
      // If program not found, go back
      router.back();
    }
  }, [program]);

  const handleSave = () => {
    if (!program || !memberNumber) return;
    
    updateProgram(program.id, {
      ...program,
      memberNumber,
      knownTravelerNumber: knownTravelerNumber || null,
    });
    
    router.back();
  };

  const handleDelete = () => {
    if (!program) return;
    
    if (Platform.OS === 'web') {
      if (confirm("Are you sure you want to delete this loyalty program?")) {
        deleteProgram(program.id);
        router.back();
      }
    } else {
      Alert.alert(
        "Delete Program",
        "Are you sure you want to delete this loyalty program?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Delete", 
            style: "destructive",
            onPress: () => {
              deleteProgram(program.id);
              router.back();
            }
          }
        ]
      );
    }
  };

  if (!program) return null;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit {program.airlineName}</Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => router.back()}
            >
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Membership Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your membership number"
              placeholderTextColor="#666"
              value={memberNumber}
              onChangeText={setMemberNumber}
            />

            <Text style={styles.label}>Known Traveler Number (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your KTN if available"
              placeholderTextColor="#666"
              value={knownTravelerNumber}
              onChangeText={setKnownTravelerNumber}
            />

            <TouchableOpacity
              style={[
                styles.saveButton,
                !memberNumber && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!memberNumber}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Trash2 size={20} color="#fff" style={styles.deleteIcon} />
              <Text style={styles.deleteButtonText}>Delete Program</Text>
            </TouchableOpacity>
          </View>
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
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#ef4444",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  deleteIcon: {
    marginRight: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});