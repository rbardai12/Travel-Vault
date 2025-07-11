import { StyleSheet, Text, View, TouchableOpacity, Platform, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "@/stores/auth-store";
import { Plane } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { router } from "expo-router";
import HapticTouchable from "@/components/HapticTouchable";
import { useState, useEffect } from "react";
import AuthService from "@/services/auth";
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const { login, setLoading, isLoading } = useAuthStore();
  const [isAppleAvailable, setIsAppleAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    checkAppleSignInAvailability();
  }, []);

  const checkAppleSignInAvailability = async () => {
    try {
      const available = await AuthService.isAppleSignInAvailable();
      setIsAppleAvailable(available);
    } catch (error) {
      console.error('Error checking Apple Sign In availability:', error);
      setIsAppleAvailable(false);
    }
  };

  const handleAppleLogin = async () => {
    if (!isAppleAvailable) {
      Alert.alert(
        'Apple Sign In Unavailable',
        'Apple Sign In is not available on this device. Please try again later.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);

    try {
      const result = await AuthService.signInWithApple();
      
      if (result.success && result.user) {
        // Convert Apple user to our user format
        const user = {
          id: result.user.id,
          name: AuthService.getUserDisplayName(result.user),
          email: result.user.email,
          isPrivateEmail: result.user.isPrivateEmail,
        };
        
        login(user);
        
        // Show success message
        Toast.show({
          type: 'success',
          text1: 'Welcome!',
          text2: `Signed in as ${user.name}`,
          position: 'top',
          topOffset: 60,
          visibilityTime: 2000,
        });
        
        // Navigate to main app
        router.replace("/(tabs)");
      } else {
        // Show error message
        Toast.show({
          type: 'error',
          text1: 'Sign In Failed',
          text2: result.error || 'An unexpected error occurred',
          position: 'top',
          topOffset: 60,
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error('Apple Sign In error:', error);
      Toast.show({
        type: 'error',
        text1: 'Sign In Failed',
        text2: 'An unexpected error occurred. Please try again.',
        position: 'top',
        topOffset: 60,
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
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

        {isAppleAvailable === null ? (
          <View style={[styles.appleButton, styles.appleButtonDisabled]}>
            <View style={styles.appleButtonContent}>
              <Text style={styles.appleButtonText}>
                Checking availability...
              </Text>
            </View>
          </View>
        ) : isAppleAvailable ? (
          <HapticTouchable
            style={[styles.appleButton, isLoading && styles.appleButtonDisabled]}
            onPress={handleAppleLogin}
            activeOpacity={0.8}
            hapticType="medium"
            disabled={isLoading}
          >
            <View style={styles.appleButtonContent}>
              <Text style={styles.appleButtonText}>
                {isLoading ? 'Signing in...' : 'Sign in with Apple'}
              </Text>
            </View>
          </HapticTouchable>
        ) : (
          <View style={[styles.appleButton, styles.appleButtonDisabled]}>
            <View style={styles.appleButtonContent}>
              <Text style={styles.appleButtonText}>
                Apple Sign In Unavailable
              </Text>
            </View>
          </View>
        )}
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
  appleButtonDisabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
  },
});