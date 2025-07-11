import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Edit2 } from "lucide-react-native";
import { LoyaltyProgram } from "@/types/loyalty";

type LoyaltyCardProps = {
  program: LoyaltyProgram;
};

export default function LoyaltyCard({ program }: LoyaltyCardProps) {
  const handleEdit = () => {
    router.push(`/edit-loyalty/${program.id}`);
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

  return (
    <TouchableOpacity onPress={handleEdit} activeOpacity={0.9}>
      <LinearGradient
        colors={getGradientColors(program.airlineName)}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.airlineInfo}>
            <Image 
              source={{ uri: program.airlineLogo }} 
              style={styles.airlineLogo} 
              resizeMode="contain"
            />
            <Text style={styles.airlineName}>{program.airlineName}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Edit2 size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.numberContainer}>
            <Text style={styles.numberLabel}>Membership Number</Text>
            <Text style={styles.numberValue}>{program.memberNumber}</Text>
          </View>
          
          {program.knownTravelerNumber && (
            <View style={styles.numberContainer}>
              <Text style={styles.numberLabel}>Known Traveler Number</Text>
              <Text style={styles.numberValue}>{program.knownTravelerNumber}</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
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
});