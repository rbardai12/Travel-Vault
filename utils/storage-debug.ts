import AsyncStorage from "@react-native-async-storage/async-storage";

export const StorageDebug = {
    /**
     * View all stored data in the app
     */
    async viewAllData() {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const data: Record<string, any> = {};

            for (const key of keys) {
                const value = await AsyncStorage.getItem(key);
                if (value) {
                    try {
                        data[key] = JSON.parse(value);
                    } catch {
                        data[key] = value;
                    }
                }
            }

            console.log('📱 All Stored Data:', JSON.stringify(data, null, 2));
            return data;
        } catch (error) {
            console.error('Error reading storage:', error);
            return {};
        }
    },

    /**
     * View specific store data
     */
    async viewStoreData(storeName: string) {
        try {
            const key = `travel-vault-${storeName}`;
            const value = await AsyncStorage.getItem(key);

            if (value) {
                const data = JSON.parse(value);
                console.log(`📱 ${storeName} Store Data:`, JSON.stringify(data, null, 2));
                return data;
            } else {
                console.log(`📱 No data found for ${storeName} store`);
                return null;
            }
        } catch (error) {
            console.error(`Error reading ${storeName} store:`, error);
            return null;
        }
    },

    /**
     * View user authentication data
     */
    async viewAuthData() {
        return this.viewStoreData('auth');
    },

    /**
     * View loyalty programs data
     */
    async viewLoyaltyData() {
        return this.viewStoreData('loyalty');
    },

    /**
     * View KTN data
     */
    async viewKTNData() {
        return this.viewStoreData('ktn');
    },

    /**
     * Clear all stored data (use with caution!)
     */
    async clearAllData() {
        try {
            await AsyncStorage.clear();
            console.log('🗑️ All stored data cleared');
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    },

    /**
     * Clear specific store data
     */
    async clearStoreData(storeName: string) {
        try {
            const key = `travel-vault-${storeName}`;
            await AsyncStorage.removeItem(key);
            console.log(`🗑️ ${storeName} store data cleared`);
        } catch (error) {
            console.error(`Error clearing ${storeName} store:`, error);
        }
    }
}; 