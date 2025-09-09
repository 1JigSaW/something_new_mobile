// Auth configuration
// Replace these with your actual values from Google Cloud Console and Apple Developer

export const AUTH_CONFIG = {
  // Google Sign In
  GOOGLE_CLIENT_ID: '718637865767-ajepgs9stmej8lmjvf5prj799dhegapl.apps.googleusercontent.com',
  
  // Apple Sign In (no additional config needed for basic setup)
  APPLE_SIGN_IN_ENABLED: true,
  
  // App Bundle ID
  BUNDLE_ID: 'org.reactjs.native.example.something-new-mobile',
};

// Instructions:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing
// 3. Enable Google Sign-In API
// 4. Go to "APIs & Services" → "Credentials"
// 5. Create OAuth 2.0 Client ID for iOS
// 6. Use Bundle ID: org.reactjs.native.example.something-new-mobile
// 7. Copy the Client ID and replace YOUR_GOOGLE_CLIENT_ID_HERE above
