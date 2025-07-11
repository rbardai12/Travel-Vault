import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useAuthStore } from "@/stores/auth-store";

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

  return <RootLayoutNav />;
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
          animation: "slide_from_bottom",
        }} 
      />
    </Stack>
  );
}