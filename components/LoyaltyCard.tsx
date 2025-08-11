import { StyleSheet, Text, View, TouchableOpacity, Image, Platform } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Edit2 } from "lucide-react-native";
import { LoyaltyProgram } from "@/types/loyalty";
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { Swipeable } from 'react-native-gesture-handler';
import { Trash2 } from 'lucide-react-native';
import HapticTouchable from "@/components/HapticTouchable";

type LoyaltyCardProps = {
  program: LoyaltyProgram;
  onDelete?: (program: LoyaltyProgram) => void;
};

export default function LoyaltyCard({ program, onEdit, onDelete }: LoyaltyCardProps & { onEdit?: (program: LoyaltyProgram) => void, onDelete?: (program: LoyaltyProgram) => void }) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(program);
    }
  };

  const handleCopy = () => {
    if (program.memberNumber) {
      Clipboard.setStringAsync(program.memberNumber);
      Toast.show({
        type: 'success',
        text1: 'Membership number copied!',
        position: 'top',
        topOffset: 60,
        visibilityTime: 1200,
      });
    }
  };

  // Generate gradient colors based on airline name for visual variety
  const getGradientColors = (name: string): [string, string] => {
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    // Use the hash to generate a hue between 200 and 260 (blues/purples)
    const hue = Math.abs(hash % 60) + 200;

    return [
      `hsl(${hue}, 70%, 20%)`,
      `hsl(${hue}, 70%, 30%)`,
    ];
  };

  const renderRightActions = () => (
    <HapticTouchable
      style={styles.deleteAction}
      onPress={() => onDelete && onDelete(program)}
      activeOpacity={0.8}
      hapticType="error"
    >
      <Trash2 size={28} color="#fff" />
    </HapticTouchable>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <HapticTouchable
        activeOpacity={0.9}
        onLongPress={handleCopy}
        hapticType="light"
      >
        <LinearGradient
          colors={getGradientColors(program.airlineName)}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <View style={styles.airlineInfo}>
              <Image
                source={typeof program.airlineLogo === 'string' ? { uri: program.airlineLogo } : program.airlineLogo}
                style={styles.airlineLogo}
                resizeMode="contain"
              />
              <Text style={styles.airlineName}>{program.airlineName}</Text>
            </View>
            <HapticTouchable style={styles.editButton} onPress={handleEdit} hapticType="light">
              <Edit2 size={16} color="#fff" />
            </HapticTouchable>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.numberContainer}>
              <Text style={styles.numberLabel}>Membership Number</Text>
              <Text style={styles.numberValue}>{program.memberNumber}</Text>
            </View>


          </View>
        </LinearGradient>
      </HapticTouchable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  airlineInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  airlineLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  airlineName: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    gap: 16,
  },
  numberContainer: {
    gap: 4,
  },
  numberLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  numberValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 1,
  },
  deleteAction: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    marginVertical: 8,
  },
});