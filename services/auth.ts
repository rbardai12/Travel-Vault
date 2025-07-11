import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';

export interface AppleUser {
    id: string;
    email?: string;
    name?: {
        firstName?: string;
        lastName?: string;
    };
    isPrivateEmail?: boolean;
}

export interface AuthResult {
    success: boolean;
    user?: AppleUser;
    error?: string;
}

class AuthService {
    private static instance: AuthService;

    private constructor() { }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    /**
     * Check if Apple Sign In is available on the current device
     */
    public async isAppleSignInAvailable(): Promise<boolean> {
        if (Platform.OS !== 'ios') {
            return false;
        }

        try {
            return await AppleAuthentication.isAvailableAsync();
        } catch (error) {
            console.error('Error checking Apple Sign In availability:', error);
            return false;
        }
    }

    /**
     * Perform Apple Sign In
     */
    public async signInWithApple(): Promise<AuthResult> {
        try {
            // Check if Apple Sign In is available
            const isAvailable = await this.isAppleSignInAvailable();
            if (!isAvailable) {
                return {
                    success: false,
                    error: 'Apple Sign In is not available on this device'
                };
            }

            // Request Apple Sign In
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            // Create user object from credential
            const user: AppleUser = {
                id: credential.user,
                email: credential.email || undefined,
                name: credential.fullName ? {
                    firstName: credential.fullName.givenName,
                    lastName: credential.fullName.familyName,
                } : undefined,
                isPrivateEmail: credential.email ? credential.isPrivateEmail : undefined,
            };

            return {
                success: true,
                user,
            };

        } catch (error: any) {
            console.error('Apple Sign In error:', error);

            // Handle specific Apple Sign In errors
            if (error.code === 'ERR_CANCELED') {
                return {
                    success: false,
                    error: 'Sign in was cancelled'
                };
            }

            if (error.code === 'ERR_INVALID_RESPONSE') {
                return {
                    success: false,
                    error: 'Invalid response from Apple'
                };
            }

            if (error.code === 'ERR_NOT_AVAILABLE') {
                return {
                    success: false,
                    error: 'Apple Sign In is not available'
                };
            }

            return {
                success: false,
                error: error.message || 'An unexpected error occurred during sign in'
            };
        }
    }

    /**
     * Sign out (Apple doesn't provide a sign out method, so we just clear local data)
     */
    public async signOut(): Promise<void> {
        // Apple doesn't provide a sign out method
        // We just need to clear our local authentication state
        return Promise.resolve();
    }

    /**
     * Get user display name
     */
    public getUserDisplayName(user: AppleUser): string {
        if (user.name?.firstName && user.name?.lastName) {
            return `${user.name.firstName} ${user.name.lastName}`;
        }
        if (user.name?.firstName) {
            return user.name.firstName;
        }
        if (user.name?.lastName) {
            return user.name.lastName;
        }
        if (user.email) {
            return user.email.split('@')[0];
        }
        return 'Travel Enthusiast';
    }
}

export default AuthService.getInstance(); 