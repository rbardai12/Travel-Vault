import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoyaltyProgram } from "@/types/loyalty";

type LoyaltyState = {
  programs: LoyaltyProgram[];
  addProgram: (program: LoyaltyProgram) => void;
  updateProgram: (id: string, updatedProgram: LoyaltyProgram) => void;
  deleteProgram: (id: string) => void;
  loadPrograms: () => Promise<void>;
};

export const useLoyaltyStore = create<LoyaltyState>()(
  persist(
    (set, get) => ({
      programs: [],
      addProgram: (program) => 
        set((state) => ({ programs: [...state.programs, program] })),
      updateProgram: (id, updatedProgram) =>
        set((state) => ({
          programs: state.programs.map((program) =>
            program.id === id ? updatedProgram : program
          ),
        })),
      deleteProgram: (id) =>
        set((state) => ({
          programs: state.programs.filter((program) => program.id !== id),
        })),
      loadPrograms: async () => {
        // This is just to simulate loading from storage
        // The persist middleware handles the actual loading
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 500);
        });
      },
    }),
    {
      name: "travel-vault-loyalty",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);