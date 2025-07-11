import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const hapticFeedback = {
    // Light impact for general button presses
    light: () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (Platform.OS === 'android') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    },

    // Medium impact for more important actions
    medium: () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (Platform.OS === 'android') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    },

    // Heavy impact for critical actions
    heavy: () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } else if (Platform.OS === 'android') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
    },

    // Success feedback for positive actions
    success: () => {
        if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (Platform.OS === 'android') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    },

    // Warning feedback for cautionary actions
    warning: () => {
        if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } else if (Platform.OS === 'android') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
    },

    // Error feedback for destructive actions
    error: () => {
        if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else if (Platform.OS === 'android') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    },

    // Selection feedback for picker/selection changes
    selection: () => {
        if (Platform.OS === 'ios') {
            Haptics.selectionAsync();
        } else if (Platform.OS === 'android') {
            Haptics.selectionAsync();
        }
    }
};

// Helper function to wrap existing onPress handlers with haptic feedback
export const withHaptic = (
    onPress: () => void,
    hapticType: keyof typeof hapticFeedback = 'light'
) => {
    return () => {
        hapticFeedback[hapticType]();
        onPress();
    };
}; 