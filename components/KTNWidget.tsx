import { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import HapticTouchable from "@/components/HapticTouchable";
import { useKTNStore, KTN } from "@/stores/ktn-store";
import { Shield, X, Edit2, Plus } from "lucide-react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

export default function KTNWidget() {
    const { ktns, updateKTN, deleteKTN } = useKTNStore();
    const [editingKTN, setEditingKTN] = useState<KTN | null>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editNumber, setEditNumber] = useState("");
    const [editNickname, setEditNickname] = useState("");

    const handleEdit = (ktn: KTN) => {
        setEditingKTN(ktn);
        setEditNumber(ktn.number);
        setEditNickname(ktn.nickname);
        setEditModalVisible(true);
    };

    const handleSaveEdit = () => {
        if (editingKTN && editNumber.trim() && editNickname.trim()) {
            updateKTN(editingKTN.id, {
                ...editingKTN,
                number: editNumber.trim(),
                nickname: editNickname.trim(),
            });
            setEditModalVisible(false);
            setEditingKTN(null);
        }
    };

    const handleDelete = () => {
        if (editingKTN) {
            deleteKTN(editingKTN.id);
            setEditModalVisible(false);
            setEditingKTN(null);
        }
    };

    const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

    if (ktns.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Shield size={20} color="#6366f1" />
                    <Text style={styles.headerTitle}>Known Traveler Numbers</Text>
                </View>
                <Text style={styles.headerCount}>{ktns.length}</Text>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {ktns.map((ktn, index) => (
                    <AnimatedView
                        key={ktn.id}
                        entering={Platform.OS !== 'web' ? FadeInUp.delay(index * 100).duration(300) : undefined}
                        style={styles.ktnCard}
                    >
                        <View style={styles.ktnHeader}>
                            <Text style={styles.ktnNickname}>{ktn.nickname}</Text>
                            <View style={styles.ktnActions}>
                                <HapticTouchable
                                    style={styles.actionButton}
                                    onPress={() => handleEdit(ktn)}
                                    hapticType="light"
                                >
                                    <Edit2 size={14} color="#666" />
                                </HapticTouchable>
                            </View>
                        </View>
                        <HapticTouchable
                            activeOpacity={0.9}
                            onLongPress={async () => {
                                await Clipboard.setStringAsync(ktn.number);
                                Toast.show({
                                    type: 'success',
                                    text1: 'KTN copied!',
                                    position: 'top',
                                    topOffset: 60,
                                    visibilityTime: 1200,
                                });
                            }}
                            hapticType="light"
                        >
                            <Text style={styles.ktnNumber}>{ktn.number}</Text>
                        </HapticTouchable>
                    </AnimatedView>
                ))}
            </ScrollView>

            {/* Edit Modal */}
            <Modal
                visible={editModalVisible}
                transparent
                animationType="fade"
            >
                <View style={styles.modalContainer}>
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
                        style={[styles.modalBackdrop, { zIndex: 1 }]}
                        onPress={() => setEditModalVisible(false)}
                        hapticType="light"
                    />
                    <View style={[styles.modal, { zIndex: 2 }]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit KTN</Text>
                            <HapticTouchable
                                onPress={() => setEditModalVisible(false)}
                                style={styles.modalCloseButton}
                                hapticType="light"
                            >
                                <X size={20} color="#fff" />
                            </HapticTouchable>
                        </View>

                        <View style={styles.modalContent}>
                            <Text style={styles.modalLabel}>Nickname</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="e.g., Mom, Dad, John"
                                placeholderTextColor="#666"
                                value={editNickname}
                                onChangeText={setEditNickname}
                                autoCapitalize="words"
                            />

                            <Text style={styles.modalLabel}>Known Traveler Number</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Enter KTN"
                                placeholderTextColor="#666"
                                value={editNumber}
                                onChangeText={setEditNumber}
                                autoCapitalize="characters"
                                autoCorrect={false}
                            />

                            <View style={styles.modalButtons}>
                                <HapticTouchable
                                    style={[
                                        styles.modalSaveButton,
                                        (!editNumber.trim() || !editNickname.trim()) && styles.modalSaveButtonDisabled
                                    ]}
                                    onPress={handleSaveEdit}
                                    disabled={!editNumber.trim() || !editNickname.trim()}
                                    hapticType="success"
                                >
                                    <Text style={styles.modalSaveText}>Save</Text>
                                </HapticTouchable>
                            </View>
                            <HapticTouchable
                                style={styles.deleteButton}
                                onPress={handleDelete}
                                hapticType="error"
                            >
                                <Text style={styles.deleteButtonText}>Delete KTN</Text>
                            </HapticTouchable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
        marginLeft: 8,
    },
    headerCount: {
        fontSize: 14,
        color: "#666",
        backgroundColor: "#2a2a2a",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    scrollContent: {
        paddingRight: 16,
    },
    ktnCard: {
        backgroundColor: "#2a2a2a",
        borderRadius: 16,
        padding: 12, // reduced from 20
        marginRight: 12, // reduced from 16
        minWidth: 150, // reduced from 200
        maxWidth: 170, // add a maxWidth for consistency
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    ktnHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4, // reduced from 8
    },
    ktnNickname: {
        fontSize: 14, // reduced from 16
        fontWeight: "600",
        color: "#fff",
    },
    ktnActions: {
        flexDirection: "row",
        gap: 4,
    },
    actionButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#1a1a1a",
        justifyContent: "center",
        alignItems: "center",
    },
    ktnNumber: {
        fontSize: 12, // reduced from 14
        fontWeight: "500",
        color: "#aaa",
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        letterSpacing: 1,
        marginTop: 4, // reduced from 8
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalBackdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modal: {
        backgroundColor: "#1a1a1a",
        borderRadius: 20,
        width: "100%",
        maxHeight: "80%",
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#2a2a2a",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    modalCloseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#2a2a2a",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        padding: 20,
    },
    modalLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ddd",
        marginBottom: 8,
        marginTop: 16,
    },
    modalInput: {
        backgroundColor: "#2a2a2a",
        borderRadius: 12,
        padding: 16,
        color: "#fff",
        fontSize: 16,
        marginBottom: 8,
    },
    modalButtons: {
        flexDirection: "row",
        gap: 12,
        marginTop: 24,
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: "#2a2a2a",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    modalCancelText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    modalSaveButton: {
        flex: 1,
        backgroundColor: "#6366f1",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    modalSaveButtonDisabled: {
        backgroundColor: "#444",
    },
    modalSaveText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    deleteButton: {
        backgroundColor: '#ef4444',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 