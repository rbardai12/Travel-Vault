import { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Modal,
    KeyboardAvoidingView,
    Platform,
    TextInput
} from "react-native";
import { router } from "expo-router";
import { useKTNStore } from "@/stores/ktn-store";
import { CreditCard, Shield, X } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";

export default function AddScreen() {
    const { ktns, addKTN, deleteKTN } = useKTNStore();
    const [showKTNModal, setShowKTNModal] = useState(false);
    const [ktnInput, setKtnInput] = useState("");

    const handleAddLoyalty = () => {
        router.push("/add-loyalty");
    };

    const handleManageKTN = () => {
        setShowKTNModal(true);
    };

    const handleSaveKTN = () => {
        if (ktnInput.trim()) {
            const newKTN = {
                id: Date.now().toString(),
                number: ktnInput.trim(),
                nickname: "KTN"
            };
            addKTN(newKTN);
        }
        setShowKTNModal(false);
        router.back();
    };

    const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoid}
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Add to Your Vault</Text>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => router.back()}
                    >
                        <X size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.optionsContainer}>
                    <AnimatedView
                        entering={Platform.OS !== 'web' ? FadeInUp.delay(100).duration(500) : undefined}
                        style={styles.optionCard}
                    >
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={handleAddLoyalty}
                        >
                            <View style={styles.optionIcon}>
                                <CreditCard size={32} color="#6366f1" />
                            </View>
                            <View style={styles.optionContent}>
                                <Text style={styles.optionTitle}>Add Loyalty Program</Text>
                                <Text style={styles.optionDescription}>
                                    Add airline or hotel loyalty programs to your vault
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </AnimatedView>

                    <AnimatedView
                        entering={Platform.OS !== 'web' ? FadeInUp.delay(200).duration(500) : undefined}
                        style={styles.optionCard}
                    >
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={handleManageKTN}
                        >
                            <View style={styles.optionIcon}>
                                <Shield size={32} color="#6366f1" />
                            </View>
                            <View style={styles.optionContent}>
                                <Text style={styles.optionTitle}>
                                    {ktns.length > 0 ? "Update KTN" : "Add KTN"}
                                </Text>
                                <Text style={styles.optionDescription}>
                                    {ktns.length > 0
                                        ? "Update your Known Traveler Number"
                                        : "Add your Known Traveler Number for faster check-in"
                                    }
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </AnimatedView>
                </View>

                <Modal
                    visible={showKTNModal}
                    animationType="slide"
                    presentationStyle="pageSheet"
                >
                    <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={styles.modalKeyboardAvoid}
                        >
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {ktns.length > 0 ? "Update KTN" : "Add KTN"}
                                </Text>
                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => setShowKTNModal(false)}
                                >
                                    <X size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            <AnimatedView
                                entering={Platform.OS !== 'web' ? FadeIn.duration(300) : undefined}
                                style={styles.modalContent}
                            >
                                <Text style={styles.modalLabel}>Known Traveler Number</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="Enter your KTN"
                                    placeholderTextColor="#666"
                                    value={ktnInput}
                                    onChangeText={setKtnInput}
                                    autoCapitalize="characters"
                                    autoCorrect={false}
                                />

                                <Text style={styles.modalDescription}>
                                    Your Known Traveler Number (KTN) is used for TSA PreCheck and Global Entry.
                                    It's the same number for all airlines.
                                </Text>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => setShowKTNModal(false)}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.saveButton}
                                        onPress={handleSaveKTN}
                                    >
                                        <Text style={styles.saveButtonText}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </AnimatedView>
                        </KeyboardAvoidingView>
                    </SafeAreaView>
                </Modal>
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
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
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
    optionsContainer: {
        flex: 1,
        padding: 20,
        gap: 16,
    },
    optionCard: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        overflow: "hidden",
    },
    optionButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
    },
    optionIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 14,
        color: "#aaa",
        lineHeight: 20,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "#121212",
    },
    modalKeyboardAvoid: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#2a2a2a",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    modalCloseButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#2a2a2a",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    modalLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ddd",
        marginBottom: 8,
    },
    modalInput: {
        backgroundColor: "#2a2a2a",
        borderRadius: 12,
        padding: 16,
        color: "#fff",
        fontSize: 16,
        marginBottom: 16,
    },
    modalDescription: {
        fontSize: 14,
        color: "#aaa",
        lineHeight: 20,
        marginBottom: 32,
    },
    modalButtons: {
        flexDirection: "row",
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#2a2a2a",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    saveButton: {
        flex: 1,
        backgroundColor: "#6366f1",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
}); 