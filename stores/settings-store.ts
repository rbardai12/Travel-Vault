import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SettingsState = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isDarkMode: true, // Default to dark mode
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: "travel-vault-settings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);