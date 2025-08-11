import { useState, useRef, useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import HapticTouchable from "@/components/HapticTouchable";
import { SafeAreaView } from "react-native-safe-area-context";
import { Send, User, Trash2, Sparkles, Plane, Hotel, MapPin, Briefcase, MessageCircle, Zap, History, Search } from "lucide-react-native";
import ChatMessage from "@/components/ChatMessage";
import ProfileDropdown from "@/components/ProfileDropdown";
import ConversationManager from "@/components/ConversationManager";
import { useChatStore } from "@/stores/chat-store";
import { useAuthStore } from "@/stores/auth-store";
import Animated, { FadeIn, FadeInDown, FadeInUp, useAnimatedStyle, withRepeat, withTiming, withSequence } from "react-native-reanimated";
import { Message } from "@/types/chat";
import Toast from 'react-native-toast-message';

export default function AssistantScreen() {
  const { messages, sendMessage, isLoading, isTyping, clearMessages, createNewSession, quickActions, executeQuickAction } = useChatStore();
  const { user } = useAuthStore();
  const [input, setInput] = useState("");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [profileIconPosition, setProfileIconPosition] = useState({ x: 0, y: 0 });
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showConversationManager, setShowConversationManager] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const flatListRef = useRef<FlatList<Message>>(null);

  // Filter messages based on search query
  const filteredMessages = useMemo(() =>
    messages.filter(message =>
      searchQuery === "" ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase())
    ), [messages, searchQuery]
  );

  // Animated styles for typing dots
  const dot1Style = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(0.3, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      true
    ),
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(0.3, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      true
    ),
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(0.3, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      true
    ),
  }));

  // Stagger the animations
  useEffect(() => {
    if (isTyping) {
      // Start dot2 animation after 200ms
      setTimeout(() => {
        // Trigger re-render for dot2
      }, 200);
      // Start dot3 animation after 400ms
      setTimeout(() => {
        // Trigger re-render for dot3
      }, 400);
    }
  }, [isTyping]);

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

  const handleClearChat = () => {
    setShowClearConfirm(false);
    clearMessages();
    createNewSession();
  };

  const handleSuggestionPress = (suggestion: string) => {
    setInput(suggestion);
    // Auto-send after a brief delay for better UX
    setTimeout(() => {
      handleSend();
    }, 100);
  };

  const handleQuickActionPress = async (action: any) => {
    await executeQuickAction(action);
  };

  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

  const suggestions = [
    {
      icon: <Plane size={20} color="#6366f1" />,
      text: "What should I pack for a beach vacation?",
      category: "Packing"
    },
    {
      icon: <MapPin size={20} color="#10b981" />,
      text: "Best time to visit Japan?",
      category: "Destinations"
    },
    {
      icon: <Hotel size={20} color="#f59e0b" />,
      text: "Tips for long-haul flights",
      category: "Travel Tips"
    },
    {
      icon: <Briefcase size={20} color="#8b5cf6" />,
      text: "How to maximize hotel loyalty points?",
      category: "Loyalty"
    }
  ];

  const renderQuickActions = () => {
    if (quickActions.length === 0) return null;

    return (
      <AnimatedView entering={FadeInUp.delay(100).duration(500)} style={styles.quickActionsContainer}>
        <View style={styles.quickActionsHeader}>
          <Zap size={16} color="#f59e0b" />
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsScroll}
        >
          {quickActions.map((action, index) => (
            <AnimatedView
              key={action.id}
              entering={FadeInUp.delay(200 + index * 100).duration(500)}
            >
              <HapticTouchable
                style={[styles.quickActionButton, { borderColor: action.color }]}
                onPress={() => handleQuickActionPress(action)}
                hapticType="light"
              >
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </HapticTouchable>
            </AnimatedView>
          ))}
        </ScrollView>
      </AnimatedView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.mainContent}
            contentContainerStyle={styles.mainContentContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <AnimatedView entering={FadeInDown.duration(600)} style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>Good morning, {user?.name || "Traveler"}</Text>
                <Text style={styles.headerSubtitle}>Your AI travel companion</Text>
              </View>
              <View style={styles.headerRight}>
                {messages.length > 0 && (
                  <>
                    <HapticTouchable
                      style={styles.conversationButton}
                      onPress={() => setShowConversationManager(true)}
                      hapticType="light"
                    >
                      <History size={20} color="#6366f1" />
                    </HapticTouchable>
                    <HapticTouchable
                      style={styles.clearButton}
                      onPress={() => setShowClearConfirm(true)}
                      hapticType="light"
                    >
                      <Trash2 size={20} color="#ef4444" />
                    </HapticTouchable>
                  </>
                )}
                <HapticTouchable
                  style={styles.profileButton}
                  onPress={handleProfilePress}
                  hapticType="light"
                >
                  <User size={24} color="#fff" />
                </HapticTouchable>
              </View>
            </AnimatedView>

            {/* Quick Actions Bar */}
            {renderQuickActions()}

            {/* Search Bar */}
            {messages.length > 0 && (
              <AnimatedView entering={FadeInUp.delay(150).duration(500)} style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                  <Search size={16} color="#666" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search messages..."
                    placeholderTextColor="#666"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery.length > 0 && (
                    <HapticTouchable
                      style={styles.clearSearchButton}
                      onPress={() => setSearchQuery("")}
                      hapticType="light"
                    >
                      <Text style={styles.clearSearchText}>✕</Text>
                    </HapticTouchable>
                  )}
                </View>
                {searchQuery.length > 0 && (
                  <Text style={styles.searchResultsText}>
                    {filteredMessages.length} result{filteredMessages.length !== 1 ? 's' : ''} found
                  </Text>
                )}
              </AnimatedView>
            )}

            {/* Main Content */}
            {messages.length === 0 ? (
              <AnimatedView entering={FadeInUp.delay(200).duration(600)} style={styles.emptyContainer}>
                <View style={styles.emptyHeader}>
                  <View style={styles.emptyIconContainer}>
                    <Sparkles size={32} color="#6366f1" />
                  </View>
                  <Text style={styles.emptyTitle}>Your Travel AI Assistant</Text>
                  <Text style={styles.emptyDescription}>
                    Ask me anything about travel recommendations, flight information,
                    packing tips, or destination details. I'm here to make your travels amazing!
                  </Text>
                </View>

                <View style={styles.suggestionsContainer}>
                  <Text style={styles.suggestionsTitle}>Quick Start</Text>
                  {suggestions.map((suggestion, index) => (
                    <AnimatedView
                      key={index}
                      entering={FadeInUp.delay(300 + index * 100).duration(500)}
                    >
                      <HapticTouchable
                        style={styles.suggestionButton}
                        onPress={() => handleSuggestionPress(suggestion.text)}
                        hapticType="light"
                      >
                        <View style={styles.suggestionContent}>
                          <View style={styles.suggestionIcon}>
                            {suggestion.icon}
                          </View>
                          <View style={styles.suggestionTextContainer}>
                            <Text style={styles.suggestionText}>{suggestion.text}</Text>
                            <Text style={styles.suggestionCategory}>{suggestion.category}</Text>
                          </View>
                        </View>
                      </HapticTouchable>
                    </AnimatedView>
                  ))}
                </View>

                {/* Feature highlights */}
                <View style={styles.featuresContainer}>
                  <Text style={styles.featuresTitle}>What I can help with</Text>
                  <View style={styles.featuresGrid}>
                    <View style={styles.featureItem}>
                      <MessageCircle size={16} color="#6366f1" />
                      <Text style={styles.featureText}>Travel Planning</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Plane size={16} color="#10b981" />
                      <Text style={styles.featureText}>Flight Tips</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Hotel size={16} color="#f59e0b" />
                      <Text style={styles.featureText}>Hotel Advice</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Briefcase size={16} color="#8b5cf6" />
                      <Text style={styles.featureText}>Packing Lists</Text>
                    </View>
                  </View>
                </View>
              </AnimatedView>
            ) : (
              <FlatList
                ref={flatListRef}
                data={filteredMessages}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <ChatMessage
                    message={item}
                    index={index}
                    previousMessage={index > 0 ? filteredMessages[index - 1] : undefined}
                  />
                )}
                contentContainerStyle={styles.chatList}
                refreshControl={
                  <RefreshControl
                    refreshing={false}
                    onRefresh={() => {
                      if (flatListRef.current) {
                        flatListRef.current.scrollToEnd({ animated: true });
                      }
                    }}
                    tintColor="#6366f1"
                    colors={["#6366f1"]}
                  />
                }
              />
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <AnimatedView entering={FadeIn.duration(300)} style={styles.typingIndicator}>
                <View style={styles.typingBubble}>
                  <View style={styles.typingDots}>
                    <Animated.View style={[styles.typingDot, dot1Style]} />
                    <Animated.View style={[styles.typingDot, dot2Style]} />
                    <Animated.View style={[styles.typingDot, dot3Style]} />
                  </View>
                  <Text style={styles.typingText}>Assistant is typing...</Text>
                </View>
              </AnimatedView>
            )}

            {/* Input Container */}
            <AnimatedView entering={FadeInUp.delay(400).duration(600)} style={styles.inputContainer}>
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
                returnKeyType="send"
                blurOnSubmit={false}
              />
              <HapticTouchable
                style={[
                  styles.sendButton,
                  (input.trim() === "" || isLoading) && styles.sendButtonDisabled
                ]}
                onPress={handleSend}
                disabled={input.trim() === "" || isLoading}
                hapticType="medium"
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Send size={20} color="#fff" />
                )}
              </HapticTouchable>
            </AnimatedView>



            {/* Clear Chat Confirmation Modal */}
            {showClearConfirm && (
              <View style={styles.modalOverlay}>
                <View style={styles.confirmModal}>
                  <Text style={styles.confirmTitle}>Clear Chat?</Text>
                  <Text style={styles.confirmText}>
                    This will delete all messages and start a new conversation.
                  </Text>
                  <View style={styles.confirmButtons}>
                    <HapticTouchable
                      style={styles.cancelButton}
                      onPress={() => setShowClearConfirm(false)}
                      hapticType="light"
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </HapticTouchable>
                    <HapticTouchable
                      style={styles.confirmButton}
                      onPress={handleClearChat}
                      hapticType="medium"
                    >
                      <Text style={styles.confirmButtonText}>Clear</Text>
                    </HapticTouchable>
                  </View>
                </View>
              </View>
            )}

          </ScrollView>
        </TouchableWithoutFeedback>

        <ProfileDropdown
          visible={showProfileDropdown}
          onClose={() => setShowProfileDropdown(false)}
          anchorPosition={profileIconPosition}
        />

        {/* Conversation Manager Modal */}
        <ConversationManager
          visible={showConversationManager}
          onClose={() => setShowConversationManager(false)}
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
    backgroundColor: "#121212",
  },
  mainContent: {
    flex: 1,
  },
  mainContentContainer: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 120 : 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
    backgroundColor: "#121212",
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  conversationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionsContainer: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
    paddingVertical: 16,
  },
  searchContainer: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
  clearSearchButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearSearchText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  searchResultsText: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
  quickActionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  quickActionsTitle: {
    color: "#f59e0b",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  quickActionsScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionButton: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    minWidth: 120,
    alignItems: "center",
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  quickActionSubtitle: {
    color: "#888",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 14,
  },
  chatList: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 160 : 140,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
    backgroundColor: "#1a1a1a",
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  input: {
    flex: 1,
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "#fff",
    maxHeight: 100,
    fontSize: 16,
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
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 140 : 120,
  },
  emptyHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  suggestionsContainer: {
    width: "100%",
    marginBottom: 40,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  suggestionButton: {
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  suggestionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  suggestionCategory: {
    color: "#888",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  featuresContainer: {
    width: "100%",
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  featureItem: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  featureText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 8,
    textAlign: "center",
  },
  typingIndicator: {
    paddingHorizontal: 16,
    marginBottom: 12,
    paddingBottom: 8,
    position: 'absolute',
    bottom: Platform.OS === "ios" ? 90 : 80,
    left: 0,
    right: 0,
    zIndex: 99,
  },
  typingBubble: {
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: "flex-start",
    maxWidth: "80%",
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6366f1",
  },
  typingDot1: {
    opacity: 0.4,
  },
  typingDot2: {
    opacity: 0.7,
  },
  typingDot3: {
    opacity: 1,
  },
  typingText: {
    color: "#888",
    fontSize: 14,
    fontStyle: "italic",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  confirmModal: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    padding: 24,
    margin: 20,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    maxWidth: 300,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  confirmText: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  confirmButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#3a3a3a",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});