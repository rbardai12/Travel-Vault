import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HapticTouchable from './HapticTouchable';
import { Plane, Hotel, MapPin, Calendar, Star, BookOpen } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

type QuickAction = {
    id: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    onPress: () => void;
    color: string;
};

type QuickActionsProps = {
    actions: QuickAction[];
    visible: boolean;
};

export default function QuickActions({ actions, visible }: QuickActionsProps) {
    if (!visible || actions.length === 0) return null;

    return (
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.container}>
            <Text style={styles.title}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
                {actions.map((action, index) => (
                    <Animated.View
                        key={action.id}
                        entering={FadeInUp.delay(300 + index * 100).duration(400)}
                    >
                        <HapticTouchable
                            style={[styles.actionButton, { borderColor: action.color }]}
                            onPress={action.onPress}
                            hapticType="light"
                        >
                            <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                                {action.icon}
                            </View>
                            <Text style={styles.actionTitle}>{action.title}</Text>
                            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                        </HapticTouchable>
                    </Animated.View>
                ))}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 12,
        textAlign: 'center',
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    actionButton: {
        backgroundColor: '#2a2a2a',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        minWidth: 100,
        borderWidth: 1,
        borderColor: '#3a3a3a',
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
        textAlign: 'center',
    },
    actionSubtitle: {
        color: '#888',
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 14,
    },
});
