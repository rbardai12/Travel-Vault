import { Message } from "@/types/chat";

export const formatMessageTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
        return "Just now";
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }
};

export const generateConversationTitle = (messages: Message[]): string => {
    if (messages.length === 0) return "New Chat";

    const firstUserMessage = messages.find(m => m.role === "user");
    if (!firstUserMessage) return "New Chat";

    const content = firstUserMessage.content;
    if (content.length <= 30) return content;

    return content.substring(0, 30) + "...";
};

export const isMessageLong = (content: string): boolean => {
    return content.length > 150;
};

export const extractLinks = (text: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
};

export const formatMessageContent = (content: string): string => {
    // Add line breaks for better readability
    return content
        .replace(/\n\n/g, '\n')
        .replace(/\n/g, '\n\n');
};

export const getMessageStatusColor = (status: string | undefined): string => {
    switch (status) {
        case 'sending':
            return '#6366f1';
        case 'sent':
            return '#10b981';
        case 'delivered':
            return '#10b981';
        case 'error':
            return '#ef4444';
        default:
            return '#888';
    }
};

export const shouldShowTimestamp = (currentMessage: Message, previousMessage?: Message): boolean => {
    if (!previousMessage) return true;

    const timeDiff = currentMessage.timestamp - previousMessage.timestamp;
    const timeDiffInMinutes = timeDiff / (1000 * 60);

    // Show timestamp if more than 5 minutes have passed
    return timeDiffInMinutes > 5;
};
