import { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Modal,
    Image,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
} from "react-native";
import { airlines } from "@/constants/airlines";
import { X } from "lucide-react-native";
import { useLoyaltyStore } from "@/stores/loyalty-store";
import { useKTNStore } from "@/stores/ktn-store";
import { BlurView } from "expo-blur";

export default function AddLoyaltyPopup({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const { addProgram } = useLoyaltyStore();
    const { knownTravelerNumber } = useKTNStore();
    const [selectedAirline, setSelectedAirline] = useState<any>(null);
    const [memberNumber, setMemberNumber] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [saving, setSaving] = useState(false);

    const filteredAirlines = searchQuery
        ? airlines.filter(airline =>
            airline.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : airlines;

    const handleSave = async () => {
        if (!selectedAirline || !memberNumber) return;
        setSaving(true);
        addProgram({
            id: Date.now().toString(),
            airlineId: selectedAirline.id,
            airlineName: selectedAirline.name,
            airlineLogo: selectedAirline.logo,
            memberNumber,
        });
        setSaving(false);
        setSelectedAirline(null); // Deselect after save
        setMemberNumber(""); // Clear membership number after save
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
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
                <TouchableOpacity style={[styles.modalBackdrop, { zIndex: 1 }]} onPress={onClose} />
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}
                >
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Loyalty Program</Text>
                            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
                                <X size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
                            <Text style={styles.modalLabel}>Search Airline or Hotel</Text>
                            <View style={{ position: 'relative', marginBottom: 8 }}>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="Search airlines..."
                                    placeholderTextColor="#666"
                                    value={searchQuery}
                                    onChangeText={text => {
                                        setSearchQuery(text);
                                        setSelectedAirline(null);
                                    }}
                                    editable={!selectedAirline}
                                />
                                {selectedAirline && (
                                    <View style={styles.selectedWidget}>
                                        <Image source={typeof selectedAirline.logo === 'string' ? { uri: selectedAirline.logo } : selectedAirline.logo} style={styles.selectedLogo} />
                                        <Text style={styles.selectedName}>{selectedAirline.name}</Text>
                                        <TouchableOpacity onPress={() => {
                                            setSelectedAirline(null);
                                            setSearchQuery("");
                                        }} style={styles.selectedClear}>
                                            <X size={16} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                            {!selectedAirline && searchQuery.length > 0 && (
                                <View style={{ marginBottom: 16 }}>
                                    {filteredAirlines.map((airline) => (
                                        <TouchableOpacity
                                            key={airline.id}
                                            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}
                                            onPress={() => {
                                                setSelectedAirline(airline);
                                                setSearchQuery(airline.name);
                                            }}
                                        >
                                            <Image source={typeof airline.logo === 'string' ? { uri: airline.logo } : airline.logo} style={styles.airlineLogo} />
                                            <Text style={styles.airlineName}>{airline.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                    {filteredAirlines.length === 0 && (
                                        <Text style={{ color: '#aaa', marginTop: 8 }}>No results found.</Text>
                                    )}
                                </View>
                            )}
                            {selectedAirline && (
                                <>
                                    <Text style={styles.modalLabel}>Membership Number</Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="Enter your membership number"
                                        placeholderTextColor="#666"
                                        value={memberNumber}
                                        onChangeText={setMemberNumber}
                                    />
                                </>
                            )}
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.modalSaveButton,
                                        (!selectedAirline || !memberNumber || saving) && styles.modalSaveButtonDisabled
                                    ]}
                                    onPress={handleSave}
                                    disabled={!selectedAirline || !memberNumber || saving}
                                >
                                    <Text style={styles.modalSaveText}>{saving ? "Saving..." : "Save"}</Text>
                                </TouchableOpacity>
                            </View>
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
        justifyContent: "flex-start", // was 'center', now moves up
        alignItems: "center",
        padding: 20,
        marginTop: 60, // add margin to push modal down from the top
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
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
    },
    selectedAirline: {
        backgroundColor: "#6366f1",
    },
    airlineLogo: {
        width: 28,
        height: 28,
        borderRadius: 6,
        marginRight: 8,
    },
    airlineName: {
        color: "#fff",
        fontSize: 14,
    },
    ktnInfo: {
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderRadius: 8,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: "#6366f1",
        marginTop: 16,
    },
    ktnInfoText: {
        color: "#ddd",
        fontSize: 14,
        lineHeight: 20,
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
    selectedWidget: {
        position: 'absolute',
        left: 8,
        right: 8,
        top: '50%', // center vertically
        transform: [{ translateY: -22 }], // fine-tuned centering
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#23232b',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 10,
        zIndex: 2,
    },
    selectedLogo: {
        width: 22,
        height: 22,
        borderRadius: 5,
        marginRight: 8,
    },
    selectedName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginRight: 8,
    },
    selectedClear: {
        marginLeft: 'auto',
        padding: 4,
        borderRadius: 12,
        backgroundColor: '#444',
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 