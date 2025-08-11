import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal } from 'react-native';
import HapticTouchable from './HapticTouchable';
import { Tag, X } from 'lucide-react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

type Category = {
    id: string;
    name: string;
    color: string;
    icon: string;
};

type CategoryPickerProps = {
    visible: boolean;
    onClose: () => void;
    onSelectCategory: (category: string) => void;
    currentCategory?: string;
};

const categories: Category[] = [
    { id: 'travel-planning', name: 'Travel Planning', color: '#6366f1', icon: '🗺️' },
    { id: 'packing', name: 'Packing', color: '#10b981', icon: '🎒' },
    { id: 'flights', name: 'Flights', color: '#f59e0b', icon: '✈️' },
    { id: 'hotels', name: 'Hotels', color: '#8b5cf6', icon: '🏨' },
    { id: 'destinations', name: 'Destinations', color: '#ec4899', icon: '🌍' },
    { id: 'food', name: 'Food & Dining', color: '#f97316', icon: '🍽️' },
    { id: 'budget', name: 'Budget Tips', color: '#22c55e', icon: '💰' },
    { id: 'safety', name: 'Safety & Health', color: '#ef4444', icon: '🛡️' },
];

export default function CategoryPicker({ visible, onClose, onSelectCategory, currentCategory }: CategoryPickerProps) {
    const handleCategorySelect = (category: Category) => {
        onSelectCategory(category.id);
        onClose();
    };

    const handleRemoveCategory = () => {
        onSelectCategory('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View
                    entering={SlideInUp.duration(300)}
                    style={styles.container}
                >
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Tag size={20} color="#6366f1" />
                            <Text style={styles.headerTitle}>Categorize Message</Text>
                        </View>
                        <HapticTouchable
                            style={styles.closeButton}
                            onPress={onClose}
                            hapticType="light"
                        >
                            <X size={20} color="#666" />
                        </HapticTouchable>
                    </View>

                    <View style={styles.categoriesGrid}>
                        {categories.map((category) => (
                            <HapticTouchable
                                key={category.id}
                                style={[
                                    styles.categoryButton,
                                    { borderColor: category.color },
                                    currentCategory === category.id && styles.selectedCategory
                                ]}
                                onPress={() => handleCategorySelect(category)}
                                hapticType="light"
                            >
                                <Text style={styles.categoryIcon}>{category.icon}</Text>
                                <Text style={[
                                    styles.categoryName,
                                    currentCategory === category.id && styles.selectedCategoryText
                                ]}>
                                    {category.name}
                                </Text>
                            </HapticTouchable>
                        ))}
                    </View>

                    {currentCategory && (
                        <HapticTouchable
                            style={styles.removeButton}
                            onPress={handleRemoveCategory}
                            hapticType="medium"
                        >
                            <Text style={styles.removeButtonText}>Remove Category</Text>
                        </HapticTouchable>
                    )}
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 24,
        margin: 20,
        maxWidth: 400,
        width: '100%',
        borderWidth: 1,
        borderColor: '#2a2a2a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    closeButton: {
        padding: 4,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    categoryButton: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        minWidth: 100,
        alignItems: 'center',
        borderColor: '#3a3a3a',
    },
    selectedCategory: {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: '#6366f1',
    },
    categoryIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    categoryName: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    selectedCategoryText: {
        color: '#6366f1',
        fontWeight: '600',
    },
    removeButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: '#ef4444',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    removeButtonText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '600',
    },
});
