export default {
    expo: {
        name: "Travel Vault",
        slug: "travel-vault",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "dark",
        splash: {
            image: "./assets/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#121212"
        },
        assetBundlePatterns: [
            "**/*"
        ],
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.yourcompany.travelvault",
            infoPlist: {
                CFBundleDisplayName: "Travel Vault",
                CFBundleName: "Travel Vault",
                NSFaceIDUsageDescription: "This app uses Face ID to securely sign you in with Apple.",
            },
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#121212"
            },
            package: "com.yourcompany.travelvault"
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-apple-authentication",
                {
                    services: ["signin", "signup"]
                }
            ]
        ],
        scheme: "travel-vault",
        experiments: {
            typedRoutes: true
        }
    }
}; 