import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useAuthStore } from "@/stores/auth-store";
import Toast, { BaseToast, ErrorToast, ToastConfigParams } from 'react-native-toast-message';
import { View, Text } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const unstable_settings = {
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // We don't need custom fonts for this app
  });

  const colorScheme = useColorScheme();

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const toastConfig = {
    success: ({ text1 }: ToastConfigParams<any>) => (
      <View
        style={{
          backgroundColor: '#23232b',
          borderRadius: 18,
          minHeight: 40,
          paddingVertical: 6,
          paddingHorizontal: 14,
          maxWidth: '80%',
          alignSelf: 'center',
          marginTop: 8,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 4,
          justifyContent: 'center', // new: vertical centering
        }}
      >
        {!!text1 && (
          <Text
            style={{
              fontSize: 15,
              color: '#fff',
              fontWeight: '600',
              textAlign: 'center',
            }}
            numberOfLines={2}
          >
            {text1}
          </Text>
        )}
      </View>
    ),
    error: ({ text1 }: ToastConfigParams<any>) => (
      <View
        style={{
          backgroundColor: '#23232b',
          borderRadius: 18,
          minHeight: 40,
          paddingVertical: 6,
          paddingHorizontal: 14,
          maxWidth: '80%',
          alignSelf: 'center',
          marginTop: 8,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 4,
          justifyContent: 'center', // new: vertical centering
        }}
      >
        {!!text1 && (
          <Text
            style={{
              fontSize: 15,
              color: '#fff',
              fontWeight: '600',
              textAlign: 'center',
            }}
            numberOfLines={2}
          >
            {text1}
          </Text>
        )}
      </View>
    ),
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootLayoutNav />
      <Toast position="top" topOffset={60} config={toastConfig} />
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#121212' },
      headerTintColor: '#fff',
      contentStyle: { backgroundColor: '#121212' }
    }}>
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-loyalty"
        options={{
          presentation: "modal",
          title: "Add Loyalty Program",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="edit-loyalty/[id]"
        options={{
          presentation: "modal",
          title: "Edit Loyalty Program",
          // animation: "slide_from_bottom", // Removed to prevent slide up
        }}
      />
    </Stack>
  );
}