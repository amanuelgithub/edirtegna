# Edirtegna Mobile App 👋

### List package used & to be used

- Routing - expo-router
- User Interface & styling - nativewind - [✅] installed
- Animation - React Native Reanimated - [✅] installed
- Server State Management - Tanstack Query - [✅] installed
- State Management - Zustand & for persisting the states - legend state
- Other - react-native-mmkv(for storing key value paris), react-hook-form(for managing forms), flashlist(for list), Expo Image(for displaying images), zeego(native menus for), RevenueCat(for monetizing the app), React Native Gesture(for working with gestures)
- ## expo-secure-store - for storing secure information

### Must have component list

- Other component libraries
  - react-native-bottom-tabs(for a bottom tab navigation)
  - react-native-bottom-sheets
  - react-native-gifted-chat - chatting
  - victory-native - for charting
  - react-native-toast-message
  - react-content-loader - for showing a skeleton
  - react-native-pager-view - pager view

Note: difference between expo-secure-store and react-native-async-storage

No, expo-secure-store and react-native-async-storage serve different purposes and have distinct use cases. Here's how they compare:

1. expo-secure-store
   ✅ Best for: Storing sensitive data like authentication tokens, passwords, and private keys securely.
   ✅ Security: Uses Keychain (iOS) and Keystore (Android), providing encryption and better protection.
   ✅ Persistence: Data remains even after the app is closed or restarted.
   ✅ Accessibility: Requires async calls to retrieve data, as it's stored securely.
   ❌ Limitations: Slower than AsyncStorage due to encryption; not suitable for large amounts of non-sensitive data.

2. react-native-async-storage
   ✅ Best for: Storing general app data, preferences, user settings, and cache.
   ✅ Storage Method: Saves data as unencrypted key-value pairs in persistent storage.
   ✅ Speed: Faster than SecureStore because it doesn’t encrypt data.
   ✅ Persistence: Data persists across app restarts and updates.
   ❌ Security: Not encrypted, making it unsuitable for storing sensitive data like access tokens.
