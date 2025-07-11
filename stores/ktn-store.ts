import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type KTN = {
  id: string;
  number: string;
  nickname: string;
};

type KTNState = {
  ktns: KTN[];
  addKTN: (ktn: KTN) => void;
  updateKTN: (id: string, updatedKTN: KTN) => void;
  deleteKTN: (id: string) => void;
  loadKTNs: () => Promise<void>;
};

export const useKTNStore = create<KTNState>()(
  persist(
    (set, get) => ({
      ktns: [],
      addKTN: (ktn) => set((state) => ({ ktns: [...state.ktns, ktn] })),
      updateKTN: (id, updatedKTN) =>
        set((state) => ({
          ktns: state.ktns.map((ktn) =>
            ktn.id === id ? updatedKTN : ktn
          ),
        })),
      deleteKTN: (id) =>
        set((state) => ({
          ktns: state.ktns.filter((ktn) => ktn.id !== id),
        })),
      loadKTNs: async () => {
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
      name: "travel-vault-ktn",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 