import React from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import HapticTouchable from './HapticTouchable';

type MessageContentProps = {
    content: string;
    isUser?: boolean;
};

export default function MessageContent({ content, isUser = false }: MessageContentProps) {
    // Function to detect and format URLs
    const formatText = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <HapticTouchable
                        key={index}
                        onPress={() => Linking.openURL(part)}
                        hapticType="light"
                    >
                        <Text style={[styles.link, isUser ? styles.userLink : styles.assistantLink]}>
                            {part}
                        </Text>
                    </HapticTouchable>
                );
            }

            // Format bullet points and numbered lists
            if (part.trim().match(/^[•\-\*]\s/)) {
                return (
                    <Text key={index} style={styles.bulletPoint}>
                        {part}
                    </Text>
                );
            }

            if (part.trim().match(/^\d+\.\s/)) {
                return (
                    <Text key={index} style={styles.numberedPoint}>
                        {part}
                    </Text>
                );
            }

            // Format headers (lines that end with :)
            if (part.trim().match(/^[A-Z][^:]*:$/)) {
                return (
                    <Text key={index} style={[styles.header, isUser ? styles.userHeader : styles.assistantHeader]}>
                        {part}
                    </Text>
                );
            }

            return <Text key={index}>{part}</Text>;
        });
    };

    // Split content into paragraphs
    const paragraphs = content.split('\n\n');

    return (
        <View style={styles.container}>
            {paragraphs.map((paragraph, index) => {
                if (paragraph.trim() === '') return null;

                // Check if this paragraph is a list
                const lines = paragraph.split('\n');
                const isList = lines.some(line =>
                    line.trim().match(/^[•\-\*]\s/) ||
                    line.trim().match(/^\d+\.\s/)
                );

                if (isList) {
                    return (
                        <View key={index} style={styles.listContainer}>
                            {lines.map((line, lineIndex) => {
                                if (line.trim() === '') return null;

                                if (line.trim().match(/^[•\-\*]\s/)) {
                                    return (
                                        <View key={lineIndex} style={styles.listItem}>
                                            <Text style={styles.bullet}>•</Text>
                                            <Text style={[styles.listText, isUser ? styles.userText : styles.assistantText]}>
                                                {line.trim().substring(2)}
                                            </Text>
                                        </View>
                                    );
                                }

                                if (line.trim().match(/^\d+\.\s/)) {
                                    return (
                                        <View key={lineIndex} style={styles.listItem}>
                                            <Text style={styles.number}>{line.trim().match(/^\d+\./)?.[0]}</Text>
                                            <Text style={[styles.listText, isUser ? styles.userText : styles.assistantText]}>
                                                {line.trim().substring(line.trim().indexOf(' ') + 1)}
                                            </Text>
                                        </View>
                                    );
                                }

                                return (
                                    <Text key={lineIndex} style={[styles.paragraph, isUser ? styles.userText : styles.assistantText]}>
                                        {line}
                                    </Text>
                                );
                            })}
                        </View>
                    );
                }

                return (
                    <Text key={index} style={[styles.paragraph, isUser ? styles.userText : styles.assistantText]}>
                        {formatText(paragraph)}
                    </Text>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 8,
    },
    userText: {
        color: '#fff',
    },
    assistantText: {
        color: '#fff',
    },
    header: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        marginTop: 4,
    },
    userHeader: {
        color: '#fff',
    },
    assistantHeader: {
        color: '#fff',
    },
    listContainer: {
        marginVertical: 8,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
        paddingLeft: 8,
    },
    bullet: {
        fontSize: 16,
        color: '#6366f1',
        marginRight: 8,
        marginTop: 2,
    },
    number: {
        fontSize: 16,
        color: '#6366f1',
        marginRight: 8,
        marginTop: 2,
        fontWeight: '600',
        minWidth: 20,
    },
    listText: {
        fontSize: 16,
        lineHeight: 22,
        flex: 1,
    },
    bulletPoint: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 8,
        color: '#6366f1',
    },
    numberedPoint: {
        fontSize: 16,
        lineHeight: 22,
        marginBottom: 8,
        color: '#6366f1',
    },
    link: {
        textDecorationLine: 'underline',
        color: '#60a5fa',
    },
    userLink: {
        color: '#93c5fd',
    },
    assistantLink: {
        color: '#60a5fa',
    },
});
