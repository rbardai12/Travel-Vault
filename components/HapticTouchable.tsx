import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, Platform } from 'react-native';
import { hapticFeedback } from '@/utils/haptics';

interface HapticTouchableProps extends TouchableOpacityProps {
    hapticType?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';
    disabled?: boolean;
}

export default function HapticTouchable({
    children,
    onPress,
    hapticType = 'light',
    disabled = false,
    ...props
}: HapticTouchableProps) {
    const handlePress = (event: any) => {
        if (!disabled && onPress) {
            // Provide haptic feedback
            hapticFeedback[hapticType]();

            // Call the original onPress handler
            onPress(event);
        }
    };

    return (
        <TouchableOpacity
            {...props}
            onPress={handlePress}
            disabled={disabled}
        >
            {children}
        </TouchableOpacity>
    );
} 