import { create } from "zustand";
import { Message } from "@/types/chat";
import { Platform } from "react-native";

type ChatState = {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  sendMessage: async (content: string) => {
    // Add user message
    set((state) => ({
      messages: [...state.messages, { role: "user", content }],
      isLoading: true,
    }));

    try {
      // Make API request to AI service
      const response = await fetch("https://toolkit.rork.com/text/llm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful travel assistant. Provide concise, accurate information about travel destinations, airlines, hotels, travel tips, and other travel-related topics. Keep responses friendly and informative."
            },
            ...get().messages,
            { role: "user", content }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      const data = await response.json();
      
      // Add AI response
      set((state) => ({
        messages: [...state.messages, { role: "assistant", content: data.completion }],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      set((state) => ({
        messages: [
          ...state.messages, 
          { 
            role: "assistant", 
            content: "Sorry, I'm having trouble connecting right now. Please try again later." 
          }
        ],
        isLoading: false,
      }));
    }
  },
}));