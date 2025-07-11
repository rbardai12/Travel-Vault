import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Plane } from "lucide-react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Platform } from "react-native";

type EmptyStateProps = {
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
};

export default function EmptyState({ 
  title, 
  description, 
  buttonText, 
  onPress 
}: EmptyStateProps) {
  const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

  return (
    <AnimatedView 
      style={styles.container}
      entering={Platform.OS !== 'web' ? FadeIn.duration(800) : undefined}
    >
      <View style={styles.iconContainer}>
        <Plane size={50} color="#6366f1" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    maxWidth: 300,
  },
  button: {
    backgroundColor: "#6366f1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});