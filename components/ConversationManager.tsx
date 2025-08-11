import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, ScrollView, Alert } from 'react-native';
import { Calendar, Clock, MessageSquare, Trash2, Download, Share2, Plus, Bookmark } from 'lucide-react-native';
import HapticTouchable from './HapticTouchable';
import { useChatStore } from '@/stores/chat-store';
import { Message, ChatSession } from '@/types/chat';
import Toast from 'react-native-toast-message';

type ConversationManagerProps = {
    visible: boolean;
    onClose: () => void;
};

export default function ConversationManager({ visible, onClose }: ConversationManagerProps) {
    const { messages, currentSession, createNewSession, clearMessages, getBookmarkedMessages } = useChatStore();
    const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
    const [activeTab, setActiveTab] = useState<'sessions' | 'bookmarks'>('sessions');

    // Mock sessions for demonstration - in a real app, these would come from storage
    const mockSessions: ChatSession[] = [
        {
            id: 'session_1',
            title: 'Beach Vacation Planning',
            messages: [],
            createdAt: Date.now() - 86400000, // 1 day ago
            updatedAt: Date.now() - 3600000, // 1 hour ago
        },
        {
            id: 'session_2',
            title: 'Japan Travel Tips',
            messages: [],
            createdAt: Date.now() - 172800000, // 2 days ago
            updatedAt: Date.now() - 7200000, // 2 hours ago
        },
        {
            id: 'session_3',
            title: 'Hotel Loyalty Programs',
            messages: [],
            createdAt: Date.now() - 259200000, // 3 days ago
            updatedAt: Date.now() - 10800000, // 3 hours ago
        },
    ];

    const handleNewSession = () => {
        createNewSession();
        onClose();
        Toast.show({
            type: 'success',
            text1: 'New conversation started',
            text2: 'Ready to help with your travel plans',
            position: 'top',
            topOffset: 60,
            visibilityTime: 2000,
        });
    };

    const handleLoadSession = (session: ChatSession) => {
        setSelectedSession(session);
        // In a real app, you'd load the session messages here
        Toast.show({
            type: 'info',
            text1: 'Session loaded',
            text2: `Loaded: ${session.title}`,
            position: 'top',
            topOffset: 60,
            visibilityTime: 1500,
        });
    };

    const handleDeleteSession = (sessionId: string) => {
        Alert.alert(
            'Delete Session',
            'Are you sure you want to delete this conversation? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        // In a real app, you'd delete the session from storage
                        Toast.show({
                            type: 'success',
                            text1: 'Session deleted',
                            text2: 'Conversation removed',
                            position: 'top',
                            topOffset: 60,
                            visibilityTime: 1500,
                        });
                    },
                },
            ]
        );
    };

    const handleExportConversation = () => {
        if (messages.length === 0) {
            Toast.show({
                type: 'info',
                text1: 'No messages to export',
                text2: 'Start a conversation first',
                position: 'top',
                topOffset: 60,
                visibilityTime: 2000,
            });
            return;
        }

        // In a real app, you'd export the conversation to a file
        Toast.show({
            type: 'success',
            text1: 'Conversation exported',
            text2: 'Check your downloads folder',
            position: 'top',
            topOffset: 60,
            visibilityTime: 2000,
        });
    };

    const handleShareConversation = () => {
        if (messages.length === 0) {
            Toast.show({
                type: 'info',
                text1: 'No messages to share',
                text2: 'Start a conversation first',
                position: 'top',
                topOffset: 60,
                visibilityTime: 2000,
            });
            return;
        }

        // In a real app, you'd share the conversation
        Toast.show({
            type: 'info',
            text1: 'Share feature',
            text2: 'Coming soon in next update',
            position: 'top',
            topOffset: 60,
            visibilityTime: 2000,
        });
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Conversations</Text>
                    <HapticTouchable
                        style={styles.closeButton}
                        onPress={onClose}
                        hapticType="light"
                    >
                        <Text style={styles.closeButtonText}>Done</Text>
                    </HapticTouchable>
                </View>

                {/* Tab Navigation */}
                <View style={styles.tabContainer}>
                    <HapticTouchable
                        style={[styles.tab, activeTab === 'sessions' && styles.activeTab]}
                        onPress={() => setActiveTab('sessions')}
                        hapticType="light"
                    >
                        <Text style={[styles.tabText, activeTab === 'sessions' && styles.activeTabText]}>
                            Sessions
                        </Text>
                    </HapticTouchable>
                    <HapticTouchable
                        style={[styles.tab, activeTab === 'bookmarks' && styles.activeTab]}
                        onPress={() => setActiveTab('bookmarks')}
                        hapticType="light"
                    >
                        <Text style={[styles.tabText, activeTab === 'bookmarks' && styles.activeTabText]}>
                            Bookmarks
                        </Text>
                    </HapticTouchable>
                </View>

                {/* Current Session Info */}
                {currentSession && (
                    <View style={styles.currentSessionContainer}>
                        <View style={styles.currentSessionHeader}>
                            <MessageSquare size={20} color="#6366f1" />
                            <Text style={styles.currentSessionTitle}>Current Session</Text>
                        </View>
                        <View style={styles.currentSessionInfo}>
                            <Text style={styles.currentSessionName}>
                                {currentSession.title}
                            </Text>
                            <Text style={styles.currentSessionStats}>
                                {messages.length} message{messages.length !== 1 ? 's' : ''} •
                                Started {formatDate(currentSession.createdAt)}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <HapticTouchable
                        style={styles.actionButton}
                        onPress={handleNewSession}
                        hapticType="medium"
                    >
                        <Plus size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>New Chat</Text>
                    </HapticTouchable>

                    <HapticTouchable
                        style={[styles.actionButton, messages.length === 0 && styles.actionButtonDisabled]}
                        onPress={handleExportConversation}
                        disabled={messages.length === 0}
                        hapticType="medium"
                    >
                        <Download size={20} color={messages.length === 0 ? "#666" : "#fff"} />
                        <Text style={[styles.actionButtonText, messages.length === 0 && styles.actionButtonTextDisabled]}>
                            Export
                        </Text>
                    </HapticTouchable>

                    <HapticTouchable
                        style={[styles.actionButton, messages.length === 0 && styles.actionButtonDisabled]}
                        onPress={handleShareConversation}
                        disabled={messages.length === 0}
                        hapticType="medium"
                    >
                        <Share2 size={20} color={messages.length === 0 ? "#666" : "#fff"} />
                        <Text style={[styles.actionButtonText, messages.length === 0 && styles.actionButtonTextDisabled]}>
                            Share
                        </Text>
                    </HapticTouchable>
                </View>

                {/* Content based on active tab */}
                {activeTab === 'sessions' ? (
                    <>
                        {/* Previous Sessions */}
                        <View style={styles.sessionsContainer}>
                            <Text style={styles.sessionsTitle}>Previous Sessions</Text>
                            <ScrollView style={styles.sessionsList} showsVerticalScrollIndicator={false}>
                                {mockSessions.map((session) => (
                                    <HapticTouchable
                                        key={session.id}
                                        style={styles.sessionItem}
                                        onPress={() => handleLoadSession(session)}
                                        hapticType="light"
                                    >
                                        <View style={styles.sessionInfo}>
                                            <Text style={styles.sessionName}>{session.title}</Text>
                                            <View style={styles.sessionMeta}>
                                                <View style={styles.sessionMetaItem}>
                                                    <Calendar size={14} color="#888" />
                                                    <Text style={styles.sessionMetaText}>
                                                        {formatDate(session.createdAt)}
                                                    </Text>
                                                </View>
                                                <View style={styles.sessionMetaItem}>
                                                    <Clock size={14} color="#888" />
                                                    <Text style={styles.sessionMetaText}>
                                                        {formatTime(session.updatedAt)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <HapticTouchable
                                            style={styles.deleteButton}
                                            onPress={() => handleDeleteSession(session.id)}
                                            hapticType="light"
                                        >
                                            <Trash2 size={16} color="#ef4444" />
                                        </HapticTouchable>
                                    </HapticTouchable>
                                ))}
                            </ScrollView>
                        </View>
                    </>
                ) : (
                    <>
                        {/* Bookmarks */}
                        <View style={styles.sessionsContainer}>
                            <Text style={styles.sessionsTitle}>Bookmarked Messages</Text>
                            <ScrollView style={styles.sessionsList} showsVerticalScrollIndicator={false}>
                                {getBookmarkedMessages().map((message) => (
                                    <View key={message.id} style={styles.bookmarkItem}>
                                        <View style={styles.bookmarkInfo}>
                                            <Text style={styles.bookmarkRole}>
                                                {message.role === 'user' ? 'You' : 'Assistant'}
                                            </Text>
                                            <Text style={styles.bookmarkContent} numberOfLines={2}>
                                                {message.content}
                                            </Text>
                                            <Text style={styles.bookmarkTime}>
                                                {formatTime(message.timestamp)}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </>
                )}

                {/* Empty State for Sessions */}
                {activeTab === 'sessions' && mockSessions.length === 0 && (
                    <View style={styles.emptyState}>
                        <MessageSquare size={48} color="#666" />
                        <Text style={styles.emptyStateTitle}>No Previous Sessions</Text>
                        <Text style={styles.emptyStateText}>
                            Your conversation history will appear here
                        </Text>
                    </View>
                )}

                {/* Empty State for Bookmarks */}
                {activeTab === 'bookmarks' && getBookmarkedMessages().length === 0 && (
                    <View style={styles.emptyState}>
                        <Bookmark size={48} color="#666" />
                        <Text style={styles.emptyStateTitle}>No Bookmarked Messages</Text>
                        <Text style={styles.emptyStateText}>
                            Bookmark important messages to find them later
                        </Text>
                    </View>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
    },
    closeButtonText: {
        color: '#6366f1',
        fontSize: 16,
        fontWeight: '600',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 8,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#2a2a2a',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3a3a3a',
    },
    activeTab: {
        backgroundColor: '#6366f1',
        borderColor: '#6366f1',
    },
    tabText: {
        color: '#888',
        fontSize: 14,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#fff',
    },
    currentSessionContainer: {
        margin: 20,
        padding: 16,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.3)',
    },
    currentSessionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    currentSessionTitle: {
        color: '#6366f1',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    currentSessionInfo: {
        gap: 4,
    },
    currentSessionName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    currentSessionStats: {
        color: '#888',
        fontSize: 14,
    },
    actionButtons: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 24,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#6366f1',
        borderRadius: 12,
    },
    actionButtonDisabled: {
        backgroundColor: '#2a2a2a',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    actionButtonTextDisabled: {
        color: '#666',
    },
    sessionsContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sessionsTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    sessionsList: {
        flex: 1,
    },
    sessionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#3a3a3a',
    },
    sessionInfo: {
        flex: 1,
        gap: 8,
    },
    sessionName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    sessionMeta: {
        flexDirection: 'row',
        gap: 16,
    },
    sessionMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    sessionMetaText: {
        color: '#888',
        fontSize: 12,
    },
    deleteButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyStateTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    bookmarkItem: {
        padding: 16,
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#3a3a3a',
    },
    bookmarkInfo: {
        gap: 8,
    },
    bookmarkRole: {
        color: '#6366f1',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    bookmarkContent: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
    },
    bookmarkTime: {
        color: '#888',
        fontSize: 12,
    },
});
