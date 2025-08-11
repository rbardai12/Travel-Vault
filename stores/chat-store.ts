import { create } from "zustand";
import { Message, ChatSession } from "@/types/chat";
import { Platform } from "react-native";
import Toast from 'react-native-toast-message';

type QuickAction = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  action: string;
  color: string;
};

type ChatState = {
  messages: Message[];
  currentSession: ChatSession | null;
  isLoading: boolean;
  isTyping: boolean;
  quickActions: QuickAction[];
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  retryMessage: (messageId: string) => Promise<void>;
  createNewSession: () => void;
  addQuickActions: (actions: QuickAction[]) => void;
  clearQuickActions: () => void;
  executeQuickAction: (action: QuickAction) => Promise<void>;
  copyMessage: (messageId: string) => void;
  shareMessage: (messageId: string) => void;
  toggleBookmark: (messageId: string) => void;
  getBookmarkedMessages: () => Message[];
  setMessageCategory: (messageId: string, category: string) => void;
  getMessagesByCategory: (category: string) => Message[];
};

const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Enhanced system prompt with better context and travel expertise
const getSystemPrompt = (userName?: string) => `You are TravelVault AI, an expert travel assistant designed to help users plan amazing trips. 

**Your Expertise:**
- ✈️ Airlines, airports, and flight booking strategies
- 🏨 Hotels, accommodations, and loyalty programs  
- 🎒 Packing lists and travel preparation
- 🌍 Destinations, culture, and local insights
- 💰 Travel deals, points, and cost optimization
- 🚗 Transportation and getting around
- 🍽️ Food, dining, and local cuisine
- 🏥 Health, safety, and travel insurance
- 📱 Travel apps and digital tools
- 🎫 Attractions, activities, and itineraries

**Your Personality:**
- Be enthusiastic and encouraging about travel
- Provide practical, actionable advice
- Use bullet points and clear formatting when helpful
- Keep responses concise (150-250 words) unless more detail is requested
- Ask follow-up questions to better understand needs
- Share insider tips and local knowledge
- Be safety-conscious and practical

**Current User:** ${userName || 'Traveler'}

**Response Guidelines:**
- Always prioritize user safety and practical concerns
- Include specific recommendations when possible
- Mention relevant loyalty programs or deals if applicable
- Suggest next steps or follow-up questions
- Use emojis sparingly but effectively for visual appeal

Remember: You're helping someone create amazing travel memories!`;

// Enhanced quick actions with better categorization and more options
const getQuickActionsForMessage = (messageContent: string, isFirstMessage: boolean = false): QuickAction[] => {
  const content = messageContent.toLowerCase();

  // First-time user suggestions
  if (isFirstMessage) {
    return [
      {
        id: 'travel-planning',
        icon: '🗺️',
        title: 'Travel Planning',
        subtitle: 'Get started with trip planning',
        action: 'I want to plan a trip. Can you help me get started?',
        color: '#6366f1'
      },
      {
        id: 'packing-help',
        icon: '🎒',
        title: 'Packing Guide',
        subtitle: 'Create a packing list',
        action: 'I need help creating a packing list for my trip',
        color: '#10b981'
      },
      {
        id: 'loyalty-tips',
        icon: '⭐',
        title: 'Loyalty Programs',
        subtitle: 'Maximize your rewards',
        action: 'How can I maximize my airline and hotel loyalty points?',
        color: '#f59e0b'
      }
    ];
  }

  if (content.includes('pack') || content.includes('packing') || content.includes('luggage')) {
    return [
      {
        id: 'packing-checklist',
        icon: '📋',
        title: 'Detailed Checklist',
        subtitle: 'Get a comprehensive list',
        action: 'Create a detailed packing checklist for me with categories',
        color: '#6366f1'
      },
      {
        id: 'weather-check',
        icon: '🌤️',
        title: 'Weather Check',
        subtitle: 'Check destination weather',
        action: 'What\'s the weather like at my destination and how should it affect my packing?',
        color: '#10b981'
      },
      {
        id: 'travel-size-tips',
        icon: '🧴',
        title: 'Travel Size Tips',
        subtitle: 'TSA and packing hacks',
        action: 'Give me TSA tips and packing hacks for carry-on luggage',
        color: '#8b5cf6'
      }
    ];
  }

  if (content.includes('flight') || content.includes('airline') || content.includes('airport')) {
    return [
      {
        id: 'flight-tips',
        icon: '✈️',
        title: 'Flight Comfort',
        subtitle: 'Make your flight better',
        action: 'Give me tips for a comfortable long-haul flight',
        color: '#6366f1'
      },
      {
        id: 'airport-navigation',
        icon: '🏢',
        title: 'Airport Navigation',
        subtitle: 'Navigate airports efficiently',
        action: 'How can I navigate airports more efficiently and avoid delays?',
        color: '#f59e0b'
      },
      {
        id: 'flight-deals',
        icon: '💰',
        title: 'Flight Deals',
        subtitle: 'Find better prices',
        action: 'What are the best strategies for finding cheap flights?',
        color: '#10b981'
      }
    ];
  }

  if (content.includes('hotel') || content.includes('accommodation') || content.includes('lodging')) {
    return [
      {
        id: 'hotel-booking',
        icon: '🏨',
        title: 'Hotel Selection',
        subtitle: 'Choose the right hotel',
        action: 'What should I look for when booking a hotel?',
        color: '#8b5cf6'
      },
      {
        id: 'loyalty-maximization',
        icon: '⭐',
        title: 'Loyalty Points',
        subtitle: 'Maximize your rewards',
        action: 'How can I maximize my hotel loyalty points and get better deals?',
        color: '#f59e0b'
      },
      {
        id: 'alternative-accommodations',
        icon: '🏠',
        title: 'Alternative Options',
        subtitle: 'Consider other options',
        action: 'What are some alternative accommodation options besides hotels?',
        color: '#10b981'
      }
    ];
  }

  if (content.includes('destination') || content.includes('visit') || content.includes('place') || content.includes('country')) {
    return [
      {
        id: 'best-time-visit',
        icon: '📅',
        title: 'Best Time to Visit',
        subtitle: 'Plan your timing',
        action: 'What\'s the best time to visit this destination?',
        color: '#10b981'
      },
      {
        id: 'local-culture',
        icon: '🌍',
        title: 'Local Culture',
        subtitle: 'Cultural insights',
        action: 'Tell me about local customs, culture, and etiquette',
        color: '#8b5cf6'
      },
      {
        id: 'must-see-attractions',
        icon: '🎯',
        title: 'Must-See Attractions',
        subtitle: 'Top recommendations',
        action: 'What are the must-see attractions and experiences?',
        color: '#6366f1'
      }
    ];
  }

  if (content.includes('food') || content.includes('dining') || content.includes('restaurant')) {
    return [
      {
        id: 'local-cuisine',
        icon: '🍽️',
        title: 'Local Cuisine',
        subtitle: 'Try authentic food',
        action: 'What local dishes should I try?',
        color: '#f59e0b'
      },
      {
        id: 'dining-tips',
        icon: '🍴',
        title: 'Dining Tips',
        subtitle: 'Navigate local restaurants',
        action: 'Give me tips for dining at local restaurants',
        color: '#10b981'
      }
    ];
  }

  if (content.includes('budget') || content.includes('cost') || content.includes('money') || content.includes('expensive')) {
    return [
      {
        id: 'budget-tips',
        icon: '💰',
        title: 'Budget Travel',
        subtitle: 'Save money on your trip',
        action: 'How can I travel on a budget?',
        color: '#10b981'
      },
      {
        id: 'hidden-costs',
        icon: '⚠️',
        title: 'Hidden Costs',
        subtitle: 'Avoid surprises',
        action: 'What hidden costs should I watch out for?',
        color: '#f59e0b'
      }
    ];
  }

  return [];
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  currentSession: null,
  isLoading: false,
  isTyping: false,
  quickActions: [],

  createNewSession: () => {
    const sessionId = `session_${Date.now()}`;
    const newSession: ChatSession = {
      id: sessionId,
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set({ currentSession: newSession, messages: [], quickActions: [] });
  },

  clearMessages: () => {
    set({ messages: [], quickActions: [] });
    Toast.show({
      type: 'success',
      text1: 'Chat cleared',
      text2: 'Starting fresh conversation',
      position: 'top',
      topOffset: 60,
      visibilityTime: 1500,
    });
  },

  retryMessage: async (messageId: string) => {
    const message = get().messages.find(m => m.id === messageId);
    if (!message || message.role !== 'user') return;

    // Remove the failed assistant message if it exists
    const updatedMessages = get().messages.filter(m =>
      !(m.role === 'assistant' && m.timestamp > message.timestamp)
    );

    set({ messages: updatedMessages, quickActions: [] });

    // Retry sending the message
    await get().sendMessage(message.content);
  },

  addQuickActions: (actions: QuickAction[]) => {
    set({ quickActions: actions });
  },

  clearQuickActions: () => {
    set({ quickActions: [] });
  },

  executeQuickAction: async (action: QuickAction) => {
    // Add the quick action as a user message
    await get().sendMessage(action.action);

    // Clear quick actions after execution
    set({ quickActions: [] });
  },

  copyMessage: (messageId: string) => {
    const message = get().messages.find(m => m.id === messageId);
    if (message) {
      // In a real app, you'd use Clipboard API here
      Toast.show({
        type: 'success',
        text1: 'Message copied',
        text2: 'Content copied to clipboard',
        position: 'top',
        topOffset: 60,
        visibilityTime: 1500,
      });
    }
  },

  shareMessage: (messageId: string) => {
    const message = get().messages.find(m => m.id === messageId);
    if (message) {
      // In a real app, you'd use Share API here
      Toast.show({
        type: 'info',
        text1: 'Share feature',
        text2: 'Message sharing coming soon',
        position: 'top',
        topOffset: 60,
        visibilityTime: 1500,
      });
    }
  },

  toggleBookmark: (messageId: string) => {
    set((state) => ({
      messages: state.messages.map(m =>
        m.id === messageId ? { ...m, isBookmarked: !m.isBookmarked } : m
      ),
    }));

    const message = get().messages.find(m => m.id === messageId);
    if (message) {
      Toast.show({
        type: 'success',
        text1: message.isBookmarked ? 'Bookmark removed' : 'Message bookmarked',
        text2: message.isBookmarked ? 'Removed from favorites' : 'Added to favorites',
        position: 'top',
        topOffset: 60,
        visibilityTime: 1500,
      });
    }
  },

  getBookmarkedMessages: () => {
    return get().messages.filter(m => m.isBookmarked);
  },

  setMessageCategory: (messageId: string, category: string) => {
    set((state) => ({
      messages: state.messages.map(m =>
        m.id === messageId ? { ...m, category } : m
      ),
    }));

    Toast.show({
      type: 'success',
      text1: 'Category updated',
      text2: `Message categorized as ${category}`,
      position: 'top',
      topOffset: 60,
      visibilityTime: 1500,
    });
  },

  getMessagesByCategory: (category: string) => {
    return get().messages.filter(m => m.category === category);
  },

  sendMessage: async (content: string) => {
    if (content.trim() === "") return;

    const userMessage: Message = {
      id: generateMessageId(),
      role: "user",
      content: content.trim(),
      timestamp: Date.now(),
      status: "sending",
    };

    const isFirstMessage = get().messages.length === 0;

    // Add user message immediately
    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      isTyping: true,
      quickActions: [], // Clear previous quick actions
    }));

    try {
      // Update message status to sent
      set((state) => ({
        messages: state.messages.map(m =>
          m.id === userMessage.id ? { ...m, status: "sent" } : m
        ),
      }));

      // Make API request to AI service with enhanced context
      const response = await fetch("https://toolkit.rork.com/text/llm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: getSystemPrompt(get().currentSession?.title || undefined)
            },
            ...get().messages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: content.trim() }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      // Add AI response
      const assistantMessage: Message = {
        id: generateMessageId(),
        role: "assistant",
        content: data.completion || "I'm here to help with your travel questions!",
        timestamp: Date.now(),
        status: "delivered",
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
        isTyping: false,
      }));

      // Add quick actions based on the conversation context
      const quickActions = getQuickActionsForMessage(content, isFirstMessage);
      if (quickActions.length > 0) {
        set({ quickActions });
      }

      // Show success toast for first message
      if (isFirstMessage) {
        Toast.show({
          type: 'success',
          text1: 'Assistant ready!',
          text2: 'Ask me anything about travel',
          position: 'top',
          topOffset: 60,
          visibilityTime: 2000,
        });
      }

    } catch (error) {
      console.error("Error sending message:", error);

      // Update user message status to error
      set((state) => ({
        messages: state.messages.map(m =>
          m.id === userMessage.id ? { ...m, status: "error", error: "Failed to send" } : m
        ),
        isLoading: false,
        isTyping: false,
        quickActions: [],
      }));

      // Add error message with more specific guidance
      const errorMessage: Message = {
        id: generateMessageId(),
        role: "assistant",
        content: "I'm having trouble connecting right now. This could be due to:\n\n• Internet connection issues\n• Server temporarily unavailable\n• Network restrictions\n\nPlease check your connection and try again. You can also tap the message to retry.",
        timestamp: Date.now(),
        status: "error",
        error: "Connection failed",
      };

      set((state) => ({
        messages: [...state.messages, errorMessage],
      }));

      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Connection failed',
        text2: 'Please check your internet and try again',
        position: 'top',
        topOffset: 60,
        visibilityTime: 3000,
      });
    }
  },
}));