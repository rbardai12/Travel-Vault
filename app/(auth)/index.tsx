import { StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "@/stores/auth-store";
import { Plane } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { router } from "expo-router";

export default function LoginScreen() {
  const { login } = useAuthStore();

  const handleAppleLogin = () => {
    // In a real app, we would implement actual Apple authentication
    const user = { id: "user123", name: "Travel Enthusiast" };
    login(user);
    
    // Force navigation to the main app
    router.replace("/(tabs)");
  };

  const AnimatedView = Platform.OS === 'web' ? View : Animated.View;
  
  return (
    <LinearGradient
      colors={['#121212', '#1e1e1e', '#121212']}
      style={styles.container}
    >
      <AnimatedView 
        style={styles.logoContainer}
        entering={Platform.OS !== 'web' ? FadeInUp.delay(300).duration(800) : undefined}
      >
        <Plane size={60} color="#6366f1" />
        <Text style={styles.appName}>Travel Vault</Text>
      </AnimatedView>

      <AnimatedView 
        style={styles.contentContainer}
        entering={Platform.OS !== 'web' ? FadeInDown.delay(600).duration(800) : undefined}
      >
        <Text style={styles.tagline}>
          Your personal travel companion
        </Text>
        <Text style={styles.description}>
          Store all your loyalty numbers and get travel assistance in one secure place
        </Text>

        <TouchableOpacity
          style={styles.appleButton}
          onPress={handleAppleLogin}
          activeOpacity={0.8}
        >
          <View style={styles.appleButtonContent}>
            <Text style={styles.appleButtonText}>
              Sign in with Apple
            </Text>
          </View>
        </TouchableOpacity>
      </AnimatedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 16,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
  },
  tagline: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  appleButton: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  appleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  appleButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});