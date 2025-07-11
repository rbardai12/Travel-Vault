import { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";
import { router } from "expo-router";
import { useKTNStore, KTN } from "@/stores/ktn-store";
import { CreditCard, Shield, X, Plus } from "lucide-react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import AddLoyaltyPopup from "./AddLoyaltyPopup";

type AddPopupProps = {
    visible: boolean;
    onClose: () => void;
    onAddKTN: () => void; // new prop
};

export default function AddPopup({ visible, onClose, onAddKTN }: AddPopupProps) {
    const { ktns } = useKTNStore();
    const [showAddLoyalty, setShowAddLoyalty] = useState(false);

    const handleAddLoyalty = () => {
        setShowAddLoyalty(true);
    };

    const handleAddKTN = () => {
        onClose();
        setTimeout(() => {
            onAddKTN();
        }, 300); // Wait for popup to close before opening KTN modal
    };

    const handleCloseAddLoyalty = () => {
        setShowAddLoyalty(false);
        onClose();
    };

    const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

    return (
        <>
            <Modal
                visible={visible && !showAddLoyalty}
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
                            <Text style={styles.popupTitle}>Add to Your Vault</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <X size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.optionsContainer}>
                            <TouchableOpacity
                                style={styles.option}
                                onPress={handleAddLoyalty}
                            >
                                <View style={styles.optionIcon}>
                                    <CreditCard size={24} color="#6366f1" />
                                </View>
                                <View style={styles.optionContent}>
                                    <Text style={styles.optionTitle}>Loyalty Program</Text>
                                    <Text style={styles.optionDescription}>Add airline or hotel</Text>
                                </View>
                                <Plus size={16} color="#666" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.option}
                                onPress={handleAddKTN}
                            >
                                <View style={styles.optionIcon}>
                                    <Shield size={24} color="#6366f1" />
                                </View>
                                <View style={styles.optionContent}>
                                    <Text style={styles.optionTitle}>Known Traveler Number</Text>
                                    <Text style={styles.optionDescription}>
                                        {ktns.length > 0 ? `${ktns.length} KTN${ktns.length > 1 ? 's' : ''} added` : 'Add KTN for faster check-in'}
                                    </Text>
                                </View>
                                <Plus size={16} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </AnimatedView>
                </View>
            </Modal>
            <AddLoyaltyPopup visible={showAddLoyalty} onClose={handleCloseAddLoyalty} />
        </>
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
        paddingBottom: 20, // Reduced padding for home indicator
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
    optionsContainer: {
        padding: 20,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    optionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 2,
    },
    optionDescription: {
        fontSize: 14,
        color: "#aaa",
    },
    ktnModalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    ktnModalBackdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    ktnModal: {
        backgroundColor: "#1a1a1a",
        borderRadius: 20,
        width: "100%",
        maxHeight: "80%",
        maxWidth: 400,
    },
    ktnModalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#2a2a2a",
    },
    ktnModalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    ktnModalCloseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#2a2a2a",
        justifyContent: "center",
        alignItems: "center",
    },
    ktnModalContent: {
        padding: 20,
    },
    ktnModalLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ddd",
        marginBottom: 8,
        marginTop: 16,
    },
    ktnModalInput: {
        backgroundColor: "#2a2a2a",
        borderRadius: 12,
        padding: 16,
        color: "#fff",
        fontSize: 16,
        marginBottom: 8,
    },
    ktnModalDescription: {
        fontSize: 14,
        color: "#aaa",
        lineHeight: 20,
        marginTop: 16,
        marginBottom: 24,
    },
    ktnModalButtons: {
        flexDirection: "row",
        gap: 12,
    },
    ktnModalCancelButton: {
        flex: 1,
        backgroundColor: "#2a2a2a",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    ktnModalCancelText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    ktnModalSaveButton: {
        flex: 1,
        backgroundColor: "#6366f1",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    ktnModalSaveButtonDisabled: {
        backgroundColor: "#444",
    },
    ktnModalSaveText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
}); 