import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Send, User } from "lucide-react-native";
import ChatMessage from "@/components/ChatMessage";
import ProfileDropdown from "@/components/ProfileDropdown";
import { useChatStore } from "@/stores/chat-store";
import { useAuthStore } from "@/stores/auth-store";
import Animated, { FadeIn } from "react-native-reanimated";
import { Message } from "@/types/chat";

export default function AssistantScreen() {
  const { messages, sendMessage, isLoading } = useChatStore();
  const { user } = useAuthStore();
  const [input, setInput] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profileIconPosition, setProfileIconPosition] = useState({ x: 0, y: 0 });
  const flatListRef = useRef<FlatList<Message>>(null);

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    await sendMessage(userMessage);
  };

  const handleProfilePress = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setProfileIconPosition({ x: pageX, y: pageY });
    setShowProfileDropdown(true);
  };

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={100}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Good morning, {user?.name || "Traveler"}</Text>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfilePress}
          >
            <User size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {messages.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Your Travel AI Assistant</Text>
            <Text style={styles.emptyDescription}>
              Ask me anything about travel recommendations, flight information,
              packing tips, or destination details.
            </Text>
            <View style={styles.suggestionsContainer}>
              <TouchableOpacity
                style={styles.suggestionButton}
                onPress={() => setInput("What should I pack for a beach vacation?")}
              >
                <Text style={styles.suggestionText}>Packing for beach</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.suggestionButton}
                onPress={() => setInput("Best time to visit Japan?")}
              >
                <Text style={styles.suggestionText}>Best time for Japan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.suggestionButton}
                onPress={() => setInput("Tips for long-haul flights")}
              >
                <Text style={styles.suggestionText}>Long flight tips</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => `msg-${index}`}
            renderItem={({ item, index }) => (
              <AnimatedView entering={Platform.OS !== 'web' ? FadeIn.delay(100 * index).duration(300) : undefined}>
                <ChatMessage message={item} />
              </AnimatedView>
            )}
            contentContainerStyle={styles.chatList}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask about travel..."
            placeholderTextColor="#666"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (input.trim() === "" || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={input.trim() === "" || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Send size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        <ProfileDropdown
          visible={showProfileDropdown}
          onClose={() => setShowProfileDropdown(false)}
          anchorPosition={profileIconPosition}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  chatList: {
    padding: 16,
    paddingBottom: 140, // Extra padding for floating dock
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
    backgroundColor: "#1a1a1a",
    marginBottom: 100, // Space for floating dock
  },
  input: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "#fff",
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#3f3f46",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: 120, // Space for floating dock
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  suggestionsContainer: {
    width: "100%",
    gap: 10,
  },
  suggestionButton: {
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 12,
    width: "100%",
  },
  suggestionText: {
    color: "#ddd",
    fontSize: 16,
  },
});