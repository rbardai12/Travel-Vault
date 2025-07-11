# Apple Sign In Setup Guide

This guide explains how to properly set up Apple Sign In for the Travel Vault app.

## Prerequisites

1. **Apple Developer Account**: You need a paid Apple Developer account
2. **iOS Device**: Apple Sign In only works on physical iOS devices (not simulators)
3. **Expo Development Build**: Apple Sign In requires a development build, not Expo Go

## Setup Steps

### 1. Apple Developer Console Setup

1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Select **Identifiers** and find your app's identifier
4. Enable **Sign In with Apple** capability
5. Configure the domains and redirect URLs if needed

### 2. App Configuration

The app is already configured with the necessary settings in `app.config.js`:

```javascript
plugins: [
  "expo-router",
  [
    "expo-apple-authentication",
    {
      services: ["signin", "signup"]
    }
  ]
]
```

### 3. Bundle Identifier

Update the bundle identifier in `app.config.js` to match your Apple Developer account:

```javascript
ios: {
  bundleIdentifier: "com.yourcompany.travelvault", // Change this to your identifier
  // ...
}
```

### 4. Build the App

Since Apple Sign In doesn't work in Expo Go, you need to create a development build:

```bash
# Install EAS CLI if you haven't already
npm install -g @expo/eas-cli

# Login to your Expo account
eas login

# Configure EAS Build
eas build:configure

# Create a development build for iOS
eas build --platform ios --profile development
```

### 5. Testing

1. Install the development build on your iOS device
2. Open the app and navigate to the sign-in screen
3. Tap "Sign in with Apple"
4. Complete the Apple Sign In flow
5. You should be redirected to the main app with your user information

## Features

### User Information
The app will receive the following information from Apple:
- **User ID**: Unique identifier for the user
- **Email**: User's email address (if provided)
- **Name**: User's full name (if provided)
- **Private Email**: Boolean indicating if the email is a private relay email

### Privacy Features
- Apple provides a private relay email option for users
- Users can choose to hide their real email address
- The app respects user privacy preferences

### Error Handling
The app handles various Apple Sign In scenarios:
- **Cancelled**: User cancels the sign-in process
- **Not Available**: Apple Sign In is not available on the device
- **Network Errors**: Connection issues during sign-in
- **Invalid Response**: Unexpected response from Apple

## Troubleshooting

### Common Issues

1. **"Apple Sign In is not available"**
   - Ensure you're testing on a physical iOS device
   - Check that the user has an Apple ID set up
   - Verify the device supports Apple Sign In (iOS 13+)

2. **"Sign in was cancelled"**
   - This is normal when users cancel the sign-in process
   - No action needed, just inform the user they can try again

3. **Build Errors**
   - Ensure your bundle identifier matches your Apple Developer account
   - Check that Sign In with Apple is enabled in your app identifier
   - Verify your Apple Developer account is active

4. **Development Build Issues**
   - Make sure you're using a development build, not Expo Go
   - Check that your device is registered in your Apple Developer account
   - Verify the provisioning profile includes your device

### Testing Checklist

- [ ] Using a physical iOS device (not simulator)
- [ ] Device has iOS 13 or later
- [ ] User has an Apple ID set up
- [ ] Using a development build (not Expo Go)
- [ ] Bundle identifier matches Apple Developer account
- [ ] Sign In with Apple is enabled in Apple Developer Console
- [ ] Device is registered in Apple Developer account

## Security Considerations

1. **User ID**: The Apple user ID is stable and can be used to identify returning users
2. **Email Privacy**: Users can choose to use a private relay email
3. **Data Storage**: Only store necessary user information
4. **Token Validation**: Apple provides tokens that should be validated on your backend

## Next Steps

For production deployment:
1. Set up a backend to validate Apple Sign In tokens
2. Implement proper user data storage
3. Add additional authentication methods if needed
4. Test thoroughly on various iOS devices and versions 