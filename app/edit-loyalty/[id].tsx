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
  Alert,
  Modal,
} from "react-native";
import { useLoyaltyStore } from "@/stores/loyalty-store";
import { X, Trash2 } from "lucide-react-native";
import { BlurView } from "expo-blur";

export default function EditLoyaltyScreen({ program, onClose }: { program: any, onClose: () => void }) {
  const { updateProgram, deleteProgram } = useLoyaltyStore();
  const [memberNumber, setMemberNumber] = useState(program?.memberNumber || "");
  const [modalVisible, setModalVisible] = useState(!!program);

  useEffect(() => {
    setMemberNumber(program?.memberNumber || "");
    setModalVisible(!!program);
  }, [program]);

  if (!program) return null;

  const handleSave = () => {
    if (!program || !memberNumber) return;
    updateProgram(program.id, {
      ...program,
      memberNumber,
    });
    setModalVisible(false);
    setTimeout(onClose, 300);
  };

  const handleDelete = () => {
    if (!program) return;
    if (Platform.OS === 'web') {
      if (confirm("Are you sure you want to delete this loyalty program?")) {
        deleteProgram(program.id);
        setModalVisible(false);
        setTimeout(onClose, 300);
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
              setModalVisible(false);
              setTimeout(onClose, 300);
            }
          }
        ]
      );
    }
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        setModalVisible(false);
        setTimeout(onClose, 300);
      }}
    >
      <View style={styles.modalContainer}>
        <BlurView
          intensity={40}
          tint="dark"
          style={styles.blurView}
        />
        <TouchableOpacity style={styles.modalBackdrop} onPress={() => {
          setModalVisible(false);
          setTimeout(onClose, 300);
        }} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}
        >
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Edit {program.airlineName}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  setTimeout(onClose, 300);
                }}
              >
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
              <Text style={styles.label}>Membership Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your membership number"
                placeholderTextColor="#666"
                value={memberNumber}
                onChangeText={setMemberNumber}
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
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  blurView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 1,
  },
  modal: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    width: "100%",
    maxHeight: "80%",
    maxWidth: 400,
    zIndex: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  headerTitle: {
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
  formContainer: {
    padding: 20,
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