import { StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import { Message } from "@/types/chat";
import { Clock, AlertCircle, CheckCircle, RefreshCw, Copy, Share2, MoreHorizontal, Bookmark, Tag } from "lucide-react-native";
import Animated, { FadeIn, SlideInRight, SlideInLeft, useAnimatedStyle, withRepeat, withTiming, withSequence } from "react-native-reanimated";
import { useChatStore } from "@/stores/chat-store";
import HapticTouchable from "./HapticTouchable";
import MessageContent from "./MessageContent";
import CategoryPicker from "./CategoryPicker";
import { useEffect, useState } from "react";
import { formatMessageTime, shouldShowTimestamp, getMessageStatusColor } from "@/utils/chat-utils";

type ChatMessageProps = {
  message: Message;
  index: number;
  previousMessage?: Message;
};

export default function ChatMessage({ message, index, previousMessage }: ChatMessageProps) {
  const { retryMessage, copyMessage, shareMessage, toggleBookmark, setMessageCategory, quickActions, executeQuickAction } = useChatStore();
  const [showActions, setShowActions] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const isUser = message.role === "user";
  const isError = message.status === "error";
  const isSending = message.status === "sending";
  const showTimestamp = shouldShowTimestamp(message, previousMessage);
  const showQuickActions = !isUser && quickActions.length > 0 && index === (previousMessage ? 1 : 0);

  const spinningStyle = useAnimatedStyle(() => {
    if (isSending) {
      return {
        opacity: withRepeat(
          withTiming(0.5, { duration: 1000 }),
          -1,
          true
        ),
      };
    }
    return {};
  });

  const getStatusIcon = () => {
    if (isSending) {
      return (
        <Animated.View style={spinningStyle as any}>
          <RefreshCw size={12} color={getMessageStatusColor(message.status)} />
        </Animated.View>
      );
    } else if (message.status === "sent") {
      return <CheckCircle size={12} color={getMessageStatusColor(message.status)} />;
    } else if (message.status === "delivered") {
      return <CheckCircle size={12} color={getMessageStatusColor(message.status)} />;
    } else if (isError) {
      return <AlertCircle size={12} color={getMessageStatusColor(message.status)} />;
    }
    return null;
  };

  const handleRetry = () => {
    if (isError && message.role === "user") {
      retryMessage(message.id);
    }
  };

  const handleCopy = () => {
    copyMessage(message.id);
    setShowActions(false);
  };

  const handleShare = () => {
    shareMessage(message.id);
    setShowActions(false);
  };

  const handleBookmark = () => {
    toggleBookmark(message.id);
    setShowActions(false);
  };

  const handleCategory = () => {
    setShowCategoryPicker(true);
    setShowActions(false);
  };

  const handleCategorySelect = (category: string) => {
    setMessageCategory(message.id, category);
  };

  const handleQuickAction = (action: any) => {
    executeQuickAction(action);
  };

  const AnimatedView = Platform.OS === 'web' ? View : Animated.View;

  return (
    <AnimatedView
      entering={
        Platform.OS !== 'web'
          ? (isUser ? SlideInRight.delay(100 * index).duration(300) : SlideInLeft.delay(100 * index).duration(300))
          : undefined
      }
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer
      ]}
    >
      {/* Timestamp header for conversation breaks */}
      {showTimestamp && (
        <AnimatedView entering={FadeIn.duration(300)} style={styles.timestampHeader}>
          <Text style={styles.timestampHeaderText}>
            {formatMessageTime(message.timestamp)}
          </Text>
        </AnimatedView>
      )}

      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.assistantBubble,
        isError && styles.errorBubble
      ]}>
        {/* Use MessageContent component for better formatting */}
        <MessageContent
          content={message.content}
          isUser={isUser}
        />

        {/* Bookmark indicator */}
        {message.isBookmarked && (
          <View style={styles.bookmarkIndicator}>
            <Bookmark size={12} color="#f59e0b" />
          </View>
        )}

        {/* Message metadata */}
        <View style={styles.metadata}>
          <View style={styles.timestampContainer}>
            <Clock size={10} color={isUser ? "rgba(255,255,255,0.7)" : "#888"} />
            <Text style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.assistantTimestamp
            ]}>
              {formatMessageTime(message.timestamp)}
            </Text>
          </View>

          {/* Status indicator and actions */}
          <View style={styles.rightMetadata}>
            {isUser && (
              <View style={styles.statusContainer}>
                {getStatusIcon()}
              </View>
            )}

            {/* Message actions menu */}
            <HapticTouchable
              style={styles.actionButton}
              onPress={() => setShowActions(!showActions)}
              hapticType="light"
            >
              <MoreHorizontal size={14} color={isUser ? "rgba(255,255,255,0.7)" : "#888"} />
            </HapticTouchable>
          </View>
        </View>

        {/* Error retry button */}
        {isError && message.role === "user" && (
          <HapticTouchable
            style={styles.retryButton}
            onPress={handleRetry}
            hapticType="light"
          >
            <RefreshCw size={14} color="#ef4444" />
            <Text style={styles.retryText}>Tap to retry</Text>
          </HapticTouchable>
        )}

        {/* Quick Actions */}
        {showQuickActions && (
          <AnimatedView entering={FadeIn.delay(200).duration(300)} style={styles.quickActionsContainer}>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, actionIndex) => (
                <HapticTouchable
                  key={action.id}
                  style={[styles.quickActionButton, { borderColor: action.color }]}
                  onPress={() => handleQuickAction(action)}
                  hapticType="light"
                >
                  <Text style={styles.quickActionIcon}>{action.icon}</Text>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                </HapticTouchable>
              ))}
            </View>
          </AnimatedView>
        )}

        {/* Message Actions Menu */}
        {showActions && (
          <AnimatedView entering={FadeIn.duration(200)} style={styles.actionsMenu}>
            <HapticTouchable
              style={styles.actionMenuItem}
              onPress={handleCopy}
              hapticType="light"
            >
              <Copy size={16} color="#6366f1" />
              <Text style={styles.actionMenuText}>Copy</Text>
            </HapticTouchable>

            <HapticTouchable
              style={styles.actionMenuItem}
              onPress={handleBookmark}
              hapticType="light"
            >
              <Bookmark size={16} color={message.isBookmarked ? "#f59e0b" : "#8b5cf6"} />
              <Text style={[styles.actionMenuText, message.isBookmarked && styles.bookmarkedText]}>
                {message.isBookmarked ? "Unbookmark" : "Bookmark"}
              </Text>
            </HapticTouchable>

            <HapticTouchable
              style={styles.actionMenuItem}
              onPress={handleCategory}
              hapticType="light"
            >
              <Tag size={16} color={message.category ? "#10b981" : "#8b5cf6"} />
              <Text style={[styles.actionMenuText, message.category && styles.categorizedText]}>
                {message.category ? "Change Category" : "Categorize"}
              </Text>
            </HapticTouchable>

            <HapticTouchable
              style={styles.actionMenuItem}
              onPress={handleShare}
              hapticType="light"
            >
              <Share2 size={16} color="#10b981" />
              <Text style={styles.actionMenuText}>Share</Text>
            </HapticTouchable>
          </AnimatedView>
        )}
      </View>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    maxWidth: "80%",
  },
  userContainer: {
    alignSelf: "flex-end",
  },
  assistantContainer: {
    alignSelf: "flex-start",
  },
  timestampHeader: {
    alignSelf: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  timestampHeaderText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: "hidden",
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 60,
  },
  userBubble: {
    backgroundColor: "#6366f1",
  },
  assistantBubble: {
    backgroundColor: "#2a2a2a",
    borderWidth: 1,
    borderColor: "#3a3a3a",
  },
  errorBubble: {
    borderColor: "#ef4444",
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
  userText: {
    color: "#fff",
  },
  assistantText: {
    color: "#fff",
  },
  errorText: {
    color: "#fca5a5",
  },
  metadata: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  timestampContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timestamp: {
    fontSize: 11,
    opacity: 0.7,
  },
  userTimestamp: {
    color: "rgba(255,255,255,0.7)",
  },
  assistantTimestamp: {
    color: "#888",
  },
  rightMetadata: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionButton: {
    padding: 4,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  retryText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "500",
  },
  quickActionsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  quickActionsTitle: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickActionButton: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minWidth: 100,
    alignItems: "center",
  },
  quickActionIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  quickActionTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
    textAlign: "center",
  },
  quickActionSubtitle: {
    color: "#888",
    fontSize: 10,
    textAlign: "center",
    lineHeight: 12,
  },
  actionsMenu: {
    position: "absolute",
    top: -40,
    right: 0,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    minWidth: 120,
    zIndex: 1000,
  },
  actionMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionMenuText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  bookmarkedText: {
    color: "#f59e0b",
  },
  categorizedText: {
    color: "#10b981",
  },
  bookmarkIndicator: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: "#f59e0b",
  },
});